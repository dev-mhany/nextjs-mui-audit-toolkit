import { NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max unique tokens per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// In-memory store for rate limiting (use Redis in production)
const tokenCache = new Map<string, number[]>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (
      response: NextResponse,
      limit: number,
      token: string
    ): Promise<void> => {
      const now = Date.now()
      const windowStart = now - config.interval

      // Get existing requests for this token
      let tokenRequests = tokenCache.get(token) || []

      // Remove old requests outside the current window
      tokenRequests = tokenRequests.filter(timestamp => timestamp > windowStart)

      // Check if limit exceeded
      if (tokenRequests.length >= limit) {
        const reset = windowStart + config.interval
        const retryAfter = Math.ceil((reset - now) / 1000)

        throw new Error('Rate limit exceeded')
      }

      // Add current request
      tokenRequests.push(now)
      tokenCache.set(token, tokenRequests)

      // Clean up old entries to prevent memory leaks
      if (tokenCache.size > config.uniqueTokenPerInterval) {
        const entries = Array.from(tokenCache.entries())
        const cutoff = now - config.interval

        entries.forEach(([key, timestamps]) => {
          const validTimestamps = timestamps.filter(ts => ts > cutoff)
          if (validTimestamps.length === 0) {
            tokenCache.delete(key)
          } else {
            tokenCache.set(key, validTimestamps)
          }
        })
      }
    }
  }
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number = 60000 // Default: 1 minute
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = now - windowMs

  // Get existing requests for this identifier
  let requests = tokenCache.get(identifier) || []

  // Remove old requests outside the current window
  requests = requests.filter(timestamp => timestamp > windowStart)

  // Check if limit exceeded
  const success = requests.length < limit

  if (success) {
    requests.push(now)
    tokenCache.set(identifier, requests)
  }

  return {
    success,
    limit,
    remaining: Math.max(0, limit - requests.length),
    reset: now + windowMs
  }
}

// Rate limit decorator for API routes
export function withRateLimit(
  handler: Function,
  options: {
    requests: number
    window: number
    keyGenerator?: (request: any) => string
  }
) {
  return async (request: any, ...args: any[]) => {
    const identifier = options.keyGenerator
      ? options.keyGenerator(request)
      : request.ip || 'anonymous'

    const result = await checkRateLimit(identifier, options.requests, options.window)

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${options.requests} requests per ${Math.ceil(options.window / 1000)} seconds.`,
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Call the original handler
    const response = await handler(request, ...args)

    // Add rate limit headers to successful responses
    if (response instanceof NextResponse) {
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.reset.toString())
    }

    return response
  }
}

// Clear rate limit cache periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  const maxAge = 5 * 60 * 1000 // 5 minutes

  tokenCache.forEach((timestamps, key) => {
    const validTimestamps = timestamps.filter(ts => ts > now - maxAge)
    if (validTimestamps.length === 0) {
      tokenCache.delete(key)
    } else {
      tokenCache.set(key, validTimestamps)
    }
  })
}, 60000) // Clean up every minute
