import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { db } from '@/lib/database'

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 // Max 500 users per minute
})

// API rate limits by endpoint
const endpointLimits = {
  '/api/audit/trigger': { requests: 5, window: 60 * 1000 }, // 5 requests per minute
  '/api/audit/history': { requests: 30, window: 60 * 1000 }, // 30 requests per minute
  '/api/audit/summary': { requests: 20, window: 60 * 1000 }, // 20 requests per minute
  '/api/audit/progress': { requests: 60, window: 60 * 1000 }, // 60 requests per minute (real-time)
  '/api/stats': { requests: 10, window: 60 * 1000 } // 10 requests per minute
}

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400' // 24 hours
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const method = request.method
  const ip = request.ip || 'anonymous'

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  // Apply security headers to all responses
  const response = NextResponse.next()

  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Set CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  // Check for session authentication on protected routes
  if (
    pathname.startsWith('/api/create-audit') ||
    pathname.startsWith('/api/audit/trigger')
  ) {
    const sessionToken = request.cookies.get('audit_session')?.value

    if (sessionToken) {
      try {
        const session = await db.getSessionByToken(sessionToken)
        if (!session) {
          return new NextResponse(
            JSON.stringify({
              error: 'Invalid session',
              message: 'Session expired or invalid. Please install the GitHub App again.'
            }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...Object.fromEntries(response.headers.entries())
              }
            }
          )
        }

        // Add session info to request headers for API routes
        response.headers.set(
          'X-Session-Installation-Id',
          session.installationId?.toString() || ''
        )
        response.headers.set('X-Session-User-Id', session.userId || '')
      } catch (error) {
        console.error('Session validation error:', error)
      }
    }
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    try {
      // Find matching endpoint configuration
      const endpointConfig = Object.entries(endpointLimits).find(([endpoint]) =>
        pathname.startsWith(endpoint)
      )

      if (endpointConfig) {
        const [, config] = endpointConfig
        const identifier = `${ip}-${pathname}`

        // Check rate limit
        const { success, limit, remaining, reset } = await checkRateLimit(
          identifier,
          config.requests,
          config.window
        )

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', reset.toString())

        if (!success) {
          return new NextResponse(
            JSON.stringify({
              error: 'Rate limit exceeded',
              message: `Too many requests. Limit: ${config.requests} requests per minute.`,
              retryAfter: Math.ceil((reset - Date.now()) / 1000)
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                ...Object.fromEntries(response.headers.entries())
              }
            }
          )
        }
      }

      // Apply general rate limiting as fallback
      await limiter.check(response, 10, ip) // 10 requests per minute general limit
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Rate limiting error:', errorMessage)

      if (errorMessage === 'Rate limit exceeded') {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
              ...Object.fromEntries(response.headers.entries())
            }
          }
        )
      }
    }
  }

  // Validate API key for sensitive endpoints
  if (pathname.startsWith('/api/audit/trigger') || pathname.startsWith('/api/stats')) {
    const apiKey = request.headers.get('X-API-Key')
    const authHeader = request.headers.get('Authorization')

    // For now, we'll skip API key validation in development
    // In production, you should implement proper API key validation
    if (process.env.NODE_ENV === 'production' && !apiKey && !authHeader) {
      return new NextResponse(
        JSON.stringify({
          error: 'Authentication required',
          message: 'API key or authorization header required for this endpoint'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(response.headers.entries())
          }
        }
      )
    }
  }

  // Log suspicious activity
  if (
    pathname.includes('..') ||
    pathname.includes('/.env') ||
    pathname.includes('/admin')
  ) {
    console.warn(`Suspicious request detected: ${method} ${pathname} from ${ip}`)

    return new NextResponse(
      JSON.stringify({
        error: 'Access denied',
        message: 'Invalid request path'
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(response.headers.entries())
        }
      }
    )
  }

  return response
}

// Simple rate limiting implementation
async function checkRateLimit(
  identifier: string,
  requests: number,
  windowMs: number
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  // In a production environment, you would use Redis or another persistent store
  // For this demo, we'll use a simple in-memory store
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map()
  }

  const now = Date.now()
  const windowStart = now - windowMs

  // Get or create request log for this identifier
  let requestLog = global.rateLimitStore.get(identifier) || []

  // Remove old requests outside the window
  requestLog = requestLog.filter((timestamp: number) => timestamp > windowStart)

  // Check if limit exceeded
  const success = requestLog.length < requests

  if (success) {
    requestLog.push(now)
    global.rateLimitStore.set(identifier, requestLog)
  }

  return {
    success,
    limit: requests,
    remaining: Math.max(0, requests - requestLog.length),
    reset: now + windowMs
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*']
}

// Global rate limit store type
declare global {
  var rateLimitStore: Map<string, number[]> | undefined
}
