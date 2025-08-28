/**
 * Environment Variable Validation for Audit Script
 * 
 * Validates environment variables used in the audit CLI tool
 */

export function validateAuditEnv() {
  const errors = []
  const warnings = []
  
  // Check Node.js version
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1))
  if (majorVersion < 18) {
    errors.push(`Node.js ${nodeVersion} is too old. Requires Node.js 18+`)
  }
  
  // Check for required environment variables
  const requiredVars = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET
  }
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      warnings.push(`${key} is not set - some features may not work`)
    }
  })
  
  // Validate GitHub token format if provided
  if (process.env.GITHUB_TOKEN) {
    const tokenPattern = /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})$/
    if (!tokenPattern.test(process.env.GITHUB_TOKEN)) {
      errors.push('GITHUB_TOKEN format is invalid')
    }
  }
  
  // Check optional environment variables
  const optionalVars = [
    'EMAIL_PROVIDER',
    'EMAIL_HOST', 
    'EMAIL_FROM_ADDRESS',
    'LIGHTHOUSE_TIMEOUT',
    'PLAYWRIGHT_HEADLESS'
  ]
  
  optionalVars.forEach(key => {
    if (!process.env[key]) {
      warnings.push(`${key} is not configured - feature disabled`)
    }
  })
  
  return { errors, warnings }
}

export function checkAuditEnvironment() {
  console.log('🔍 Checking audit environment...')
  
  const { errors, warnings } = validateAuditEnv()
  
  // Display results
  if (errors.length > 0) {
    console.error('❌ Environment errors:')
    errors.forEach(error => console.error(`  • ${error}`))
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:')
    warnings.forEach(warning => console.warn(`  • ${warning}`))
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Environment looks good!')
  }
  
  // Fail if there are critical errors
  if (errors.length > 0) {
    console.error('\\nPlease fix the environment errors above before continuing.')
    process.exit(1)
  }
  
  return true
}

export function generateEnvTemplate() {
  return `# Audit Script Environment Configuration

# GitHub Configuration
GITHUB_TOKEN=ghp_your_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration (Optional)
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_FROM_ADDRESS=audit@yourdomain.com

# Runtime Configuration
LIGHTHOUSE_TIMEOUT=30000
PLAYWRIGHT_HEADLESS=true
NODE_ENV=development
`
}