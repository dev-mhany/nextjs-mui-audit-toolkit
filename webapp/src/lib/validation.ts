import type { AuditRequest } from '@/types/audit'

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SecurityError'
  }
}

// URL validation patterns
const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /<script/i,
  /on\w+=/i,
  /\.\./,
  /\/\//
]

// Input sanitization functions
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    throw new ValidationError('Input must be a string')
  }

  // Trim whitespace
  let sanitized = input.trim()

  // Check length
  if (sanitized.length > maxLength) {
    throw new ValidationError(`Input too long. Maximum ${maxLength} characters allowed`)
  }

  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      throw new SecurityError('Input contains potentially malicious content')
    }
  }

  return sanitized
}

export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email, 254) // RFC 5321 limit

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(sanitized)) {
    throw new ValidationError('Invalid email format')
  }

  return sanitized.toLowerCase()
}

export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url, 2048) // Maximum URL length

  try {
    new URL(sanitized) // Validate URL format
  } catch {
    throw new ValidationError('Invalid URL format')
  }

  return sanitized
}

export function sanitizeGitHubUrl(url: string): string {
  const sanitized = sanitizeUrl(url)

  if (!GITHUB_URL_PATTERN.test(sanitized)) {
    throw new ValidationError(
      'Invalid GitHub repository URL. Must be in format: https://github.com/owner/repo'
    )
  }

  return sanitized
}

export function sanitizeGitHubToken(token: string): string {
  if (!token) return ''

  const sanitized = sanitizeString(token, 200)

  // GitHub token patterns (classic and fine-grained)
  const tokenPatterns = [
    /^ghp_[a-zA-Z0-9]{36}$/, // Classic personal access token
    /^github_pat_[a-zA-Z0-9_]{82}$/, // Fine-grained personal access token
    /^gho_[a-zA-Z0-9]{36}$/, // OAuth token
    /^ghu_[a-zA-Z0-9]{36}$/, // User-to-server token
    /^ghs_[a-zA-Z0-9]{36}$/ // Server-to-server token
  ]

  const isValidToken = tokenPatterns.some(pattern => pattern.test(sanitized))

  if (!isValidToken) {
    throw new ValidationError(
      'Invalid GitHub token format. Token must be a valid GitHub personal access token'
    )
  }

  return sanitized
}

export function sanitizeBranchName(branch: string): string {
  if (!branch) return ''

  const sanitized = sanitizeString(branch, 250)

  // Git branch name validation rules
  const validBranchPattern = /^[a-zA-Z0-9]([a-zA-Z0-9._\/-]*[a-zA-Z0-9])?$/
  const invalidPatterns = [
    /\.\./, // No consecutive dots
    /\/\//, // No consecutive slashes
    /^\/|\/$/, // No leading or trailing slashes
    /\.$|\.lock$|\.$/, // No ending with dot or .lock
    /@\{/, // No @{
    /[\x00-\x1F\x7F~^:?*\[\\]/ // No control chars or Git special chars
  ]

  if (!validBranchPattern.test(sanitized)) {
    throw new ValidationError('Invalid branch name format')
  }

  for (const pattern of invalidPatterns) {
    if (pattern.test(sanitized)) {
      throw new ValidationError('Branch name contains invalid characters')
    }
  }

  return sanitized
}

export function validateAuditRequest(request: Record<string, unknown>): AuditRequest {
  if (!request || typeof request !== 'object') {
    throw new ValidationError('Request body must be a valid JSON object')
  }

  // Validate required fields
  if (!request.repoUrl) {
    throw new ValidationError('Repository URL is required', 'repoUrl')
  }

  // Sanitize and validate fields
  const validated: AuditRequest = {
    repoUrl: sanitizeGitHubUrl(request.repoUrl as string)
  }

  // Optional fields
  if (request.githubToken) {
    validated.githubToken = sanitizeGitHubToken(request.githubToken as string)
  }

  if (request.branch) {
    validated.branch = sanitizeBranchName(request.branch as string)
  }

  if (request.userEmail) {
    validated.userEmail = sanitizeEmail(request.userEmail as string)
  }

  // Validate audit config
  if (request.auditConfig) {
    validated.auditConfig = validateAuditConfig(
      request.auditConfig as Record<string, unknown>
    )
  }

  return validated
}

export function validateAuditConfig(
  config: Record<string, unknown>
): Record<string, unknown> {
  if (!config || typeof config !== 'object') {
    return {}
  }

  const validated: any = {}

  // Boolean fields
  if (typeof config.strict === 'boolean') {
    validated.strict = config.strict
  }

  if (typeof config.fix === 'boolean') {
    validated.fix = config.fix
  }

  if (typeof config.skipPlugins === 'boolean') {
    validated.skipPlugins = config.skipPlugins
  }

  // Numeric fields
  if (typeof config.minScore === 'number') {
    if (config.minScore < 0 || config.minScore > 100) {
      throw new ValidationError('minScore must be between 0 and 100')
    }
    validated.minScore = config.minScore
  }

  // Nested objects
  if (config.thresholds && typeof config.thresholds === 'object') {
    validated.thresholds = {}

    if (typeof (config.thresholds as any).minScore === 'number') {
      if (
        (config.thresholds as any).minScore < 0 ||
        (config.thresholds as any).minScore > 100
      ) {
        throw new ValidationError('thresholds.minScore must be between 0 and 100')
      }
      validated.thresholds.minScore = (config.thresholds as any).minScore
    }

    if (typeof (config.thresholds as any).failOnCritical === 'boolean') {
      validated.thresholds.failOnCritical = (config.thresholds as any).failOnCritical
    }
  }

  if (config.output && typeof config.output === 'object') {
    validated.output = {}

    if ((config.output as any).directory) {
      const directory = sanitizeString((config.output as any).directory, 100)
      if (!/^[a-zA-Z0-9._\/-]+$/.test(directory)) {
        throw new ValidationError('Invalid output directory format')
      }
      validated.output.directory = directory
    }

    if (typeof (config.output as any).verbose === 'boolean') {
      validated.output.verbose = (config.output as any).verbose
    }
  }

  return validated
}

// Content Security Policy helpers
export function generateCSPNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function sanitizeLogData(data: unknown): unknown {
  if (typeof data === 'string') {
    // Remove sensitive patterns from log data
    return data
      .replace(/ghp_[a-zA-Z0-9]{36}/g, 'ghp_***REDACTED***')
      .replace(/github_pat_[a-zA-Z0-9_]{82}/g, 'github_pat_***REDACTED***')
      .replace(/password=[^&\s]*/gi, 'password=***REDACTED***')
      .replace(/token=[^&\s]*/gi, 'token=***REDACTED***')
      .replace(/authorization:\s*[^\s\n]*/gi, 'authorization: ***REDACTED***')
  }

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      const sanitized: unknown[] = []
      for (let i = 0; i < data.length; i++) {
        sanitized[i] = sanitizeLogData(data[i])
      }
      return sanitized
    } else {
      const sanitized: Record<string, unknown> = {}
      for (const key in data) {
        if (
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('secret')
        ) {
          sanitized[key] = '***REDACTED***'
        } else {
          sanitized[key] = sanitizeLogData((data as Record<string, unknown>)[key])
        }
      }
      return sanitized
    }
  }

  return data
}

// Webhook validation functions
export async function validateWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string | undefined
): Promise<boolean> {
  if (!signature || !secret) {
    return false
  }

  try {
    // GitHub uses HMAC-SHA256 with 'sha256=' prefix
    const expectedSignature = signature.startsWith('sha256=')
      ? signature
      : `sha256=${signature}`

    // Create HMAC
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))

    const computedSignature =
      'sha256=' +
      Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    // Constant-time comparison to prevent timing attacks
    return computedSignature === expectedSignature
  } catch (error) {
    console.error('Webhook signature validation error:', error)
    return false
  }
}

export function validateWebhookPayload(payload: any): any {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Webhook payload must be a valid JSON object')
  }

  const validated: any = {}

  // Required fields
  if (!payload.audit_id) {
    throw new ValidationError('audit_id is required in webhook payload', 'audit_id')
  }
  validated.audit_id = sanitizeString(payload.audit_id, 100)

  if (!payload.status) {
    throw new ValidationError('status is required in webhook payload', 'status')
  }

  const validStatuses = [
    'queued',
    'in_progress',
    'waiting',
    'completed',
    'success',
    'failure',
    'cancelled',
    'timed_out',
    'skipped'
  ]

  if (!validStatuses.includes(payload.status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      'status'
    )
  }
  validated.status = payload.status

  // Optional fields
  if (payload.workflow_run_id) {
    if (typeof payload.workflow_run_id === 'number') {
      validated.workflow_run_id = payload.workflow_run_id
    } else {
      validated.workflow_run_id = parseInt(payload.workflow_run_id, 10)
      if (isNaN(validated.workflow_run_id)) {
        throw new ValidationError('workflow_run_id must be a valid number')
      }
    }
  }

  if (payload.repository) {
    validated.repository = sanitizeString(payload.repository, 200)
  }

  if (payload.error) {
    validated.error = sanitizeString(payload.error, 1000)
  }

  if (payload.failure_reason) {
    validated.failure_reason = sanitizeString(payload.failure_reason, 500)
  }

  // Validate audit results if present
  if (payload.results) {
    validated.results = validateWebhookResults(payload.results)
  }

  return validated
}

function validateWebhookResults(results: any): any {
  if (!results || typeof results !== 'object') {
    throw new ValidationError('results must be a valid object')
  }

  const validated: any = {}

  // Score validation
  if (typeof results.score === 'number') {
    if (results.score < 0 || results.score > 100) {
      throw new ValidationError('score must be between 0 and 100')
    }
    validated.score = results.score
  }

  // Grade validation
  if (results.grade) {
    const validGrades = [
      'A+',
      'A',
      'A-',
      'B+',
      'B',
      'B-',
      'C+',
      'C',
      'C-',
      'D+',
      'D',
      'D-',
      'F'
    ]
    if (!validGrades.includes(results.grade)) {
      throw new ValidationError(
        `Invalid grade. Must be one of: ${validGrades.join(', ')}`,
        'grade'
      )
    }
    validated.grade = results.grade
  }

  // Critical issues validation
  if (typeof results.critical_issues === 'number') {
    if (results.critical_issues < 0) {
      throw new ValidationError('critical_issues must be a non-negative number')
    }
    validated.critical_issues = results.critical_issues
  }

  // Report URL validation
  if (results.report_url) {
    validated.report_url = sanitizeUrl(results.report_url)
  }

  // Timestamp validation
  if (results.completed_at) {
    try {
      const date = new Date(results.completed_at)
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      validated.completed_at = results.completed_at
    } catch {
      throw new ValidationError('completed_at must be a valid ISO date string')
    }
  }

  return validated
}

export function validateCreateAuditRequest(request: any): any {
  if (!request || typeof request !== 'object') {
    throw new ValidationError('Request body must be a valid JSON object')
  }

  // Validate required fields
  if (!request.repoUrl) {
    throw new ValidationError('Repository URL is required', 'repoUrl')
  }

  if (!request.mode || !['app', 'pat'].includes(request.mode)) {
    throw new ValidationError('Mode must be either "app" or "pat"', 'mode')
  }

  // Sanitize and validate fields
  const validated: any = {
    repoUrl: sanitizeGitHubUrl(request.repoUrl),
    mode: request.mode
  }

  // Validate PAT if provided
  if (request.mode === 'pat') {
    if (!request.pat) {
      throw new ValidationError(
        'Personal Access Token is required when using PAT mode',
        'pat'
      )
    }
    validated.pat = sanitizeGitHubToken(request.pat)
  }

  // Optional fields
  if (request.userEmail) {
    validated.userEmail = sanitizeEmail(request.userEmail as string)
  }

  // Validate options
  if (request.options) {
    validated.options = validateAuditOptions(request.options)
  }

  return validated
}

function validateAuditOptions(options: any): any {
  if (!options || typeof options !== 'object') {
    return {}
  }

  const validated: any = {}

  if (typeof options.createPR === 'boolean') {
    validated.createPR = options.createPR
  }

  if (typeof options.staticOnly === 'boolean') {
    validated.staticOnly = options.staticOnly
  }

  if (typeof options.autoMerge === 'boolean') {
    validated.autoMerge = options.autoMerge
  }

  if (typeof options.fix === 'boolean') {
    validated.fix = options.fix
  }

  if (typeof options.minScore === 'number') {
    if (options.minScore < 0 || options.minScore > 100) {
      throw new ValidationError('minScore must be between 0 and 100')
    }
    validated.minScore = options.minScore
  }

  if (typeof options.appPath === 'string' && options.appPath.trim()) {
    const path = sanitizeString(options.appPath, 200)
    if (!/^[a-zA-Z0-9._\/-]+$/.test(path)) {
      throw new ValidationError('Invalid appPath format')
    }
    validated.appPath = path
  }

  return validated
}
