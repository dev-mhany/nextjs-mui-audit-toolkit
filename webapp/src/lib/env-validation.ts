/**
 * Environment Variable Validation
 *
 * Validates and provides type-safe access to environment variables
 */

interface EnvSchema {
  NODE_ENV: 'development' | 'production' | 'test'
  GITHUB_TOKEN: string
  GITHUB_WEBHOOK_SECRET: string
  GITHUB_APP_ID?: string
  EMAIL_PROVIDER?: 'smtp' | 'sendgrid' | 'mailgun' | 'resend'
  EMAIL_HOST?: string
  EMAIL_FROM_ADDRESS?: string
  SESSION_SECRET?: string
  DATABASE_TYPE: 'file' | 'sqlite' | 'postgres' | 'mysql'
}

type ValidationResult<T> =
  | {
      success: true
      data: T
      errors: null
    }
  | {
      success: false
      data: null
      errors: string[]
    }

function isValidGitHubToken(value: string): boolean {
  return /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})$/.test(value)
}

export function validateEnv(): ValidationResult<EnvSchema> {
  const errors: string[] = []
  const env = process.env

  // Validate NODE_ENV
  const nodeEnv = env.NODE_ENV || 'development'
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    errors.push('NODE_ENV: must be development, production, or test')
  }

  // Validate GitHub configuration
  if (!env.GITHUB_TOKEN) {
    errors.push('GITHUB_TOKEN: is required')
  } else if (!isValidGitHubToken(env.GITHUB_TOKEN)) {
    errors.push('GITHUB_TOKEN: invalid format')
  }

  if (!env.GITHUB_WEBHOOK_SECRET) {
    errors.push('GITHUB_WEBHOOK_SECRET: is required')
  } else if (env.GITHUB_WEBHOOK_SECRET.length < 16) {
    errors.push('GITHUB_WEBHOOK_SECRET: must be at least 16 characters')
  }

  // Production-specific validations
  if (nodeEnv === 'production') {
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
      errors.push('SESSION_SECRET: required in production (32+ chars)')
    }
  }

  if (errors.length > 0) {
    return { success: false, data: null, errors }
  }

  const validatedEnv: EnvSchema = {
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
    GITHUB_TOKEN: env.GITHUB_TOKEN!,
    GITHUB_WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET!,
    GITHUB_APP_ID: env.GITHUB_APP_ID,
    EMAIL_PROVIDER: env.EMAIL_PROVIDER as
      | 'smtp'
      | 'sendgrid'
      | 'mailgun'
      | 'resend'
      | undefined,
    EMAIL_HOST: env.EMAIL_HOST,
    EMAIL_FROM_ADDRESS: env.EMAIL_FROM_ADDRESS,
    SESSION_SECRET: env.SESSION_SECRET,
    DATABASE_TYPE: (env.DATABASE_TYPE || 'file') as
      | 'file'
      | 'sqlite'
      | 'postgres'
      | 'mysql'
  }

  return { success: true, data: validatedEnv, errors: null }
}

export function getEnv(): EnvSchema {
  const result = validateEnv()

  if (!result.success) {
    console.error('Environment validation failed:')
    result.errors.forEach(error => console.error(`  - ${error}`))
    throw new Error('Invalid environment configuration')
  }

  return result.data
}

export function checkRequiredEnvVars(): { missing: string[]; warnings: string[] } {
  const required = ['GITHUB_TOKEN', 'GITHUB_WEBHOOK_SECRET']
  const warnings = ['EMAIL_PROVIDER', 'SESSION_SECRET']

  const missing = required.filter(key => !process.env[key])
  const warningMissing = warnings.filter(key => !process.env[key])

  return { missing, warnings: warningMissing }
}

export function createEnvValidationMiddleware() {
  return function envValidationMiddleware() {
    const result = validateEnv()

    if (!result.success) {
      console.error('🚨 Environment validation failed!')
      result.errors.forEach(error => console.error(`  ❌ ${error}`))

      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment validation failed in production')
      } else {
        console.error('⚠️  Continuing in development mode...')
      }
    } else {
      console.log('✅ Environment validation passed')
    }
  }
}

export type Env = EnvSchema
