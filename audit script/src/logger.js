import chalk from 'chalk'
import { writeFile, appendFile } from 'fs/promises'
import { join } from 'path'

export class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info'
    this.silent = options.silent || false
    this.logFile = options.logFile || null
    this.timestamp = options.timestamp !== false
    this.colorize = options.colorize !== false

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    }

    this.colors = {
      error: chalk.red,
      warn: chalk.yellow,
      info: chalk.blue,
      debug: chalk.gray,
      trace: chalk.dim
    }

    this.icons = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
      trace: '📝'
    }
  }

  setLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.level = level
    } else {
      throw new Error(
        `Invalid log level: ${level}. Valid levels: ${Object.keys(this.levels).join(', ')}`
      )
    }
  }

  error(message, error = null, context = {}) {
    this._log('error', message, error, context)
  }

  warn(message, context = {}) {
    this._log('warn', message, null, context)
  }

  info(message, context = {}) {
    this._log('info', message, null, context)
  }

  debug(message, context = {}) {
    this._log('debug', message, null, context)
  }

  trace(message, context = {}) {
    this._log('trace', message, null, context)
  }

  success(message, context = {}) {
    this._log('info', message, null, { ...context, _success: true })
  }

  async _log(level, message, error = null, context = {}) {
    if (this.silent || this.levels[level] > this.levels[this.level]) {
      return
    }

    const timestamp = this.timestamp ? this._getTimestamp() : ''
    const icon = context._success ? '✅' : this.icons[level]
    const color = context._success ? chalk.green : this.colorize ? this.colors[level] : text => text

    let logMessage = ''

    if (timestamp) {
      logMessage += chalk.gray(`[${timestamp}] `)
    }

    logMessage += `${icon} ${color(message)}`

    // Add context information
    if (Object.keys(context).length > 0) {
      const cleanContext = { ...context }
      delete cleanContext._success

      if (Object.keys(cleanContext).length > 0) {
        logMessage += chalk.gray(` ${JSON.stringify(cleanContext)}`)
      }
    }

    // Log to console
    console.log(logMessage)

    // Log error details if provided
    if (error) {
      if (error.stack && this.level === 'debug') {
        console.log(chalk.gray(error.stack))
      } else if (error.message) {
        console.log(chalk.red(`  Error: ${error.message}`))
      }
    }

    // Log to file if configured
    if (this.logFile) {
      await this._logToFile(level, message, error, context, timestamp)
    }
  }

  async _logToFile(level, message, error, context, timestamp) {
    try {
      const logEntry = {
        timestamp: timestamp || this._getTimestamp(),
        level,
        message,
        context,
        error: error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            }
          : null
      }

      const logLine = JSON.stringify(logEntry) + '\\n'
      await appendFile(this.logFile, logLine)
    } catch (fileError) {
      // Don't throw errors when logging fails
      console.error('Failed to write to log file:', fileError.message)
    }
  }

  _getTimestamp() {
    return new Date().toISOString()
  }

  // Progress indicators
  startProgress(message) {
    if (this.silent) return null

    process.stdout.write(`${this.icons.info} ${message}...`)

    return {
      succeed: successMessage => {
        process.stdout.write(
          `\\r${this.icons.info} ${message}... ✅ ${successMessage || 'Done'}\\n`
        )
      },
      fail: errorMessage => {
        process.stdout.write(
          `\\r${this.icons.info} ${message}... ❌ ${errorMessage || 'Failed'}\\n`
        )
      },
      update: newMessage => {
        process.stdout.write(`\\r${this.icons.info} ${newMessage}...`)
      }
    }
  }

  // Audit-specific logging methods
  auditStart(projectPath) {
    this.info('Starting audit', { projectPath })
  }

  auditComplete(score, grade, duration) {
    this.success(`Audit completed: ${score}/100 (${grade})`, {
      score,
      grade,
      duration: `${duration}ms`
    })
  }

  auditFailed(error, duration) {
    this.error('Audit failed', error, { duration: `${duration}ms` })
  }

  ruleViolation(rule, file, line, severity) {
    this.debug('Rule violation detected', {
      rule,
      file,
      line,
      severity
    })
  }

  fileProcessed(file, issueCount, score) {
    this.trace('File processed', {
      file,
      issues: issueCount,
      score
    })
  }

  configLoaded(configPath, ruleCount) {
    this.info('Configuration loaded', {
      configPath: configPath || 'default',
      rules: ruleCount
    })
  }

  // Performance logging
  timeStart(label) {
    if (!this._timers) this._timers = new Map()
    this._timers.set(label, Date.now())
  }

  timeEnd(label) {
    if (!this._timers || !this._timers.has(label)) {
      this.warn(`Timer '${label}' was not started`)
      return 0
    }

    const duration = Date.now() - this._timers.get(label)
    this._timers.delete(label)
    this.debug(`${label} completed`, { duration: `${duration}ms` })
    return duration
  }

  // Batch logging for performance
  batch() {
    const messages = []

    return {
      error: (message, error, context) =>
        messages.push({ level: 'error', message, error, context }),
      warn: (message, context) => messages.push({ level: 'warn', message, context }),
      info: (message, context) => messages.push({ level: 'info', message, context }),
      debug: (message, context) => messages.push({ level: 'debug', message, context }),
      trace: (message, context) => messages.push({ level: 'trace', message, context }),

      flush: async () => {
        for (const msg of messages) {
          await this._log(msg.level, msg.message, msg.error, msg.context)
        }
        messages.length = 0
      }
    }
  }

  // Create child logger with additional context
  child(context = {}) {
    const childLogger = Object.create(this)
    childLogger._baseContext = { ...this._baseContext, ...context }

    // Override _log to include base context
    const originalLog = this._log.bind(this)
    childLogger._log = function (level, message, error, context) {
      const mergedContext = { ...this._baseContext, ...context }
      return originalLog(level, message, error, mergedContext)
    }

    return childLogger
  }
}

// Error handling utilities
export class AuditError extends Error {
  constructor(message, code = null, details = {}) {
    super(message)
    this.name = 'AuditError'
    this.code = code
    this.details = details

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuditError)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack
    }
  }
}

export class ConfigurationError extends AuditError {
  constructor(message, details = {}) {
    super(message, 'CONFIGURATION_ERROR', details)
    this.name = 'ConfigurationError'
  }
}

export class ScanError extends AuditError {
  constructor(message, filePath = null, details = {}) {
    super(message, 'SCAN_ERROR', { filePath, ...details })
    this.name = 'ScanError'
    this.filePath = filePath
  }
}

export class ValidationError extends AuditError {
  constructor(message, violations = [], details = {}) {
    super(message, 'VALIDATION_ERROR', { violations, ...details })
    this.name = 'ValidationError'
    this.violations = violations
  }
}

// Error handler wrapper
export function withErrorHandling(fn, logger, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      // Log the error with context
      logger.error(`Operation failed: ${fn.name || 'unknown'}`, error, {
        ...context,
        args: args.length
      })

      // Re-throw with additional context if it's not already an AuditError
      if (!(error instanceof AuditError)) {
        throw new AuditError(`Operation failed: ${error.message}`, 'OPERATION_FAILED', {
          originalError: error.name,
          context
        })
      }

      throw error
    }
  }
}

// Global error handler
export function setupGlobalErrorHandling(logger) {
  process.on('uncaughtException', error => {
    logger.error('Uncaught exception', error, {
      fatal: true,
      pid: process.pid
    })

    // Give time for logging to complete before exiting
    setTimeout(() => {
      process.exit(1)
    }, 1000)
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection', reason, {
      promise: promise.toString(),
      pid: process.pid
    })
  })

  process.on('warning', warning => {
    logger.warn('Node.js warning', {
      name: warning.name,
      message: warning.message,
      stack: warning.stack
    })
  })
}

// Create default logger instance
export const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || null,
  timestamp: true,
  colorize: !process.env.CI // Disable colors in CI
})
