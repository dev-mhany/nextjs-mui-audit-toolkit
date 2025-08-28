#!/usr/bin/env node

import { program } from 'commander'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { scanProject } from './scanner.js'
import { configManager } from './config-manager.js'
import { autoFixer } from './auto-fixer.js'
import { logger } from './logger.js'

program
  .name('audit-fix')
  .description('Auto-fix issues found by the audit toolkit')
  .version('1.1.0')
  .option('-p, --path <path>', 'Path to project directory', '.')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--dry-run', 'Show what would be fixed without making changes', false)
  .option('--no-backup', 'Skip creating backup files', false)
  .option('--parallel', 'Fix files in parallel', false)
  .option('--rules <rules>', 'Comma-separated list of rule IDs to fix')
  .option('--exclude-rules <rules>', 'Comma-separated list of rule IDs to exclude from fixing')
  .option('--report <path>', 'Path to save fix report', './FIX_REPORT.md')
  .option('--verbose', 'Show verbose output', false)
  .parse()

const options = program.opts()

async function main() {
  try {
    // Configure logger
    if (options.verbose) {
      logger.setLevel('debug')
    }

    logger.info('Auto-Fix Tool v1.1.0')
    logger.info(`Target directory: ${options.path}`)

    // Load configuration
    const config = await configManager.loadConfig(options.config)
    logger.configLoaded(options.config, Object.keys(config.rules || {}).length)

    // Scan project to find issues
    logger.info('Scanning project for fixable issues...')
    const scanResults = await scanProject(options.path, config)

    const totalIssues = scanResults.summary.totalIssues
    logger.info(`Found ${totalIssues} issues in ${scanResults.summary.totalFiles} files`)

    if (totalIssues === 0) {
      logger.success('No issues found - nothing to fix!')
      return
    }

    // Filter rules if specified
    let filteredResults = scanResults
    if (options.rules || options.excludeRules) {
      const includeRules = options.rules ? options.rules.split(',').map(r => r.trim()) : null
      const excludeRules = options.excludeRules
        ? options.excludeRules.split(',').map(r => r.trim())
        : []

      filteredResults = {
        ...scanResults,
        files: {}
      }

      for (const [filePath, fileData] of Object.entries(scanResults.files)) {
        const filteredIssues = fileData.issues.filter(issue => {
          if (excludeRules.includes(issue.rule)) return false
          if (includeRules && !includeRules.includes(issue.rule)) return false
          return autoFixer.canFix(issue.rule)
        })

        if (filteredIssues.length > 0) {
          filteredResults.files[filePath] = {
            ...fileData,
            issues: filteredIssues
          }
        }
      }
    }

    // Show available fixers
    const availableFixers = autoFixer.getAvailableFixers()
    const fixableRules = availableFixers.filter(f => f.canFix).map(f => f.ruleId)

    logger.info('Available auto-fixes:')
    availableFixers.forEach(fixer => {
      const status = fixer.canFix ? '✅' : '❌'
      logger.info(`  ${status} ${fixer.ruleId}: ${fixer.description}`)
    })

    // Count fixable issues
    let fixableIssueCount = 0
    for (const fileData of Object.values(filteredResults.files)) {
      fixableIssueCount += fileData.issues.filter(issue => fixableRules.includes(issue.rule)).length
    }

    if (fixableIssueCount === 0) {
      logger.warn('No fixable issues found with current rule filters')
      return
    }

    logger.info(`${fixableIssueCount} issues can be automatically fixed`)

    if (options.dryRun) {
      logger.info('Running in dry-run mode - no files will be modified')
    }

    // Run auto-fixer
    const fixResults = await autoFixer.fixProject(filteredResults, {
      dryRun: options.dryRun,
      backup: options.backup,
      parallel: options.parallel
    })

    // Generate and save fix report
    const report = autoFixer.generateFixReport(fixResults)
    await writeFile(options.report, report)

    logger.success(`Fix report saved to: ${options.report}`)

    // Show summary
    logger.success('Auto-fix completed!', {
      totalFiles: fixResults.totalFiles,
      fixedFiles: fixResults.fixedFiles,
      skippedFiles: fixResults.skippedFiles,
      totalFixes: fixResults.totalFixes,
      dryRun: options.dryRun
    })

    if (options.dryRun) {
      logger.info('Run without --dry-run to apply the fixes')
    } else if (fixResults.fixedFiles > 0) {
      logger.info('💡 Tip: Run the audit again to see the improvements!')
    }
  } catch (error) {
    logger.error('Auto-fix failed', error)
    process.exit(1)
  }
}

main()
