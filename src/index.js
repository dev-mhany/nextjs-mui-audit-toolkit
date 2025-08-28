#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { scanProject } from './scanner.js'
import { generateReport } from './reporter.js'
import { calculateGrades } from './grader.js'
import { runESLint } from './eslint-runner.js'
import { createAuditDirectory } from './utils.js'
import { runPWAAudit } from './pwa-scanner.js'
import { runRuntimeAudits } from './runtime-auditor.js'
import { configManager } from './config-manager.js'
import { logger, setupGlobalErrorHandling, withErrorHandling, AuditError } from './logger.js'
import { cacheManager } from './cache-manager.js'
import { autoFixer } from './auto-fixer.js'

program
  .name('nextjs-mui-audit')
  .description('Audit Next.js + MUI projects for best practices')
  .version('1.1.0')
  .option('-p, --path <path>', 'Path to project directory', '.')
  .option('-o, --output <dir>', 'Output directory for reports', '.')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--strict', 'Fail on any critical issues', false)
  .option('--min-score <score>', 'Minimum acceptable score (0-100)', '85')
  .option('--verbose', 'Show verbose output', false)
  .option('--fix', 'Auto-fix issues where possible', false)
  .option('--no-cache', 'Disable caching', false)
  .option('--clear-cache', 'Clear cache before running', false)
  .option('--cache-info', 'Show cache information and exit', false)
  .parse()

const options = program.opts()

async function main() {
  const startTime = Date.now()

  try {
    // Handle cache info request
    if (options.cacheInfo) {
      await cacheManager.initialize()
      const cacheInfo = await cacheManager.getInfo()
      console.log('\n📦 Cache Information:')
      console.log(JSON.stringify(cacheInfo, null, 2))
      return
    }

    // Clear cache if requested
    if (options.clearCache) {
      await cacheManager.initialize()
      await cacheManager.clear()
      logger.info('Cache cleared')
    }

    // Disable cache if requested
    if (options.noCache) {
      cacheManager.enabled = false
      logger.debug('Cache disabled via CLI option')
    }

    // Setup global error handling
    setupGlobalErrorHandling(logger)

    // Configure logger based on options
    if (options.verbose) {
      logger.setLevel('debug')
    }

    logger.auditStart(options.path)
    logger.info('Next.js + MUI Audit Toolkit v1.1.0')

    // Load configuration
    const configProgress = logger.startProgress('Loading configuration')
    try {
      const config = await configManager.loadConfig(options.config)
      configManager.validate()

      const ruleCount = Object.keys(config.rules || {}).length
      logger.configLoaded(options.config, ruleCount)
      configProgress.succeed(`Configuration loaded (${ruleCount} custom rules)`)
    } catch (error) {
      configProgress.fail('Configuration loading failed')
      throw error
    }
    // Override config with CLI options
    if (options.minScore) {
      config.thresholds.minScore = parseInt(options.minScore)
    }
    if (options.strict !== undefined) {
      config.thresholds.failOnCritical = options.strict
    }
    if (options.output !== '.') {
      config.output.directory = options.output
    }
    if (options.verbose) {
      config.output.verbose = true
      logger.debug('CLI options applied', {
        minScore: config.thresholds.minScore,
        strict: config.thresholds.failOnCritical,
        output: config.output.directory
      })
    }

    // Create audit output directory
    const setupProgress = logger.startProgress('Setting up audit environment')
    await createAuditDirectory(config.output.directory)
    setupProgress.succeed('Audit environment ready')

    // Run ESLint analysis
    const eslintProgress = logger.startProgress('Running ESLint analysis')
    logger.timeStart('eslint')
    const eslintResults = await withErrorHandling(() => runESLint(options.path), logger, {
      component: 'eslint',
      path: options.path
    })()
    const eslintDuration = logger.timeEnd('eslint')
    eslintProgress.succeed(`ESLint analysis completed (${eslintDuration}ms)`)

    // Scan project for custom rule violations
    const scanProgress = logger.startProgress('Scanning for custom rule violations')
    logger.timeStart('scan')
    const scanResults = await withErrorHandling(() => scanProject(options.path, config), logger, {
      component: 'scanner',
      path: options.path
    })()
    const scanDuration = logger.timeEnd('scan')
    scanProgress.succeed(
      `Custom rules scan completed (${scanDuration}ms, ${scanResults.summary.totalIssues} issues found)`
    )

    // Run PWA-specific audit
    const pwaProgress = logger.startProgress('Running PWA audit')
    logger.timeStart('pwa')
    const pwaResults = await withErrorHandling(() => runPWAAudit(options.path), logger, {
      component: 'pwa',
      path: options.path
    })()
    const pwaDuration = logger.timeEnd('pwa')
    pwaProgress.succeed(`PWA audit completed (${pwaDuration}ms)`)

    // Run runtime audits
    const runtimeProgress = logger.startProgress('Running runtime audits')
    logger.timeStart('runtime')
    const runtimeResults = await withErrorHandling(() => runRuntimeAudits(options.path), logger, {
      component: 'runtime',
      path: options.path
    })()
    const runtimeDuration = logger.timeEnd('runtime')
    runtimeProgress.succeed(`Runtime audits completed (${runtimeDuration}ms)`)

    // Merge results
    const allResults = {
      ...scanResults,
      eslint: eslintResults,
      pwa: pwaResults,
      runtime: runtimeResults
    }

    // Calculate grades
    const gradingProgress = logger.startProgress('Calculating grades')
    logger.timeStart('grading')
    const grades = calculateGrades(allResults)
    const gradingDuration = logger.timeEnd('grading')
    gradingProgress.succeed(`Grading completed (${gradingDuration}ms)`)

    // Generate reports
    const reportProgress = logger.startProgress('Generating reports')
    logger.timeStart('reporting')
    await withErrorHandling(
      () => generateReport(allResults, grades, config.output.directory, config),
      logger,
      { component: 'reporter', output: config.output.directory }
    )()
    const reportDuration = logger.timeEnd('reporting')
    reportProgress.succeed(`Reports generated (${reportDuration}ms)`)

    // Run auto-fixer if requested
    if (options.fix) {
      const fixProgress = logger.startProgress('Running auto-fixer')
      logger.timeStart('fixing')

      try {
        const fixResults = await autoFixer.fixProject(allResults, {
          dryRun: false,
          backup: true,
          parallel: false
        })

        const fixDuration = logger.timeEnd('fixing')
        fixProgress.succeed(
          `Auto-fix completed (${fixDuration}ms, ${fixResults.fixedFiles} files fixed)`
        )

        // Generate fix report
        const fixReport = autoFixer.generateFixReport(fixResults)
        const fixReportPath = join(config.output.directory, 'FIX_REPORT.md')
        await writeFile(fixReportPath, fixReport)

        logger.success(`Fix report saved to: ${fixReportPath}`, {
          fixedFiles: fixResults.fixedFiles,
          totalFixes: fixResults.totalFixes
        })

        // Re-run scan if files were fixed to show improvement
        if (fixResults.fixedFiles > 0) {
          logger.info('Re-scanning project after fixes...')

          const rescanResults = await withErrorHandling(
            () => scanProject(options.path, config),
            logger,
            { component: 'rescan', path: options.path }
          )()

          // Update results with post-fix scan
          allResults = {
            ...allResults,
            ...rescanResults,
            eslint: eslintResults,
            pwa: pwaResults,
            runtime: runtimeResults
          }

          // Recalculate grades
          const newGrades = calculateGrades(allResults)

          logger.info('Post-fix results', {
            oldScore: grades.overallScore,
            newScore: newGrades.overallScore,
            improvement: newGrades.overallScore - grades.overallScore
          })

          // Use updated grades for final reporting
          grades = newGrades

          // Regenerate reports with updated results
          await withErrorHandling(
            () => generateReport(allResults, grades, config.output.directory, config),
            logger,
            { component: 'post-fix-reporter', output: config.output.directory }
          )()
        }
      } catch (error) {
        fixProgress.fail('Auto-fix failed')
        logger.error('Auto-fix process failed', error)
        // Don't fail the entire audit, just log the error
      }
    }

    // Run auto-fixer if requested
    if (options.fix) {
      const fixProgress = logger.startProgress('Running auto-fixer')
      logger.timeStart('fixing')

      try {
        const fixResults = await autoFixer.fixProject(allResults, {
          dryRun: false,
          backup: true,
          parallel: false
        })

        const fixDuration = logger.timeEnd('fixing')
        fixProgress.succeed(
          `Auto-fix completed (${fixDuration}ms, ${fixResults.fixedFiles} files fixed)`
        )

        // Generate fix report
        const fixReport = autoFixer.generateFixReport(fixResults)
        const fixReportPath = join(config.output.directory, 'FIX_REPORT.md')
        await writeFile(fixReportPath, fixReport)

        logger.success(`Fix report saved to: ${fixReportPath}`, {
          fixedFiles: fixResults.fixedFiles,
          totalFixes: fixResults.totalFixes
        })

        // Re-run scan if files were fixed
        if (fixResults.fixedFiles > 0) {
          logger.info('Re-scanning project after fixes...')

          const rescanResults = await withErrorHandling(
            () => scanProject(options.path, config),
            logger,
            { component: 'rescan', path: options.path }
          )()

          // Update results with post-fix scan
          allResults = {
            ...allResults,
            ...rescanResults,
            eslint: eslintResults,
            pwa: pwaResults,
            runtime: runtimeResults
          }

          // Recalculate grades
          const newGrades = calculateGrades(allResults)

          logger.info('Post-fix results', {
            oldScore: grades.overallScore,
            newScore: newGrades.overallScore,
            improvement: newGrades.overallScore - grades.overallScore
          })

          // Use updated grades
          grades = newGrades

          // Regenerate reports with updated results
          await withErrorHandling(
            () => generateReport(allResults, grades, config.output.directory, config),
            logger,
            { component: 'post-fix-reporter', output: config.output.directory }
          )()
        }
      } catch (error) {
        fixProgress.fail('Auto-fix failed')
        logger.error('Auto-fix process failed', error)
        // Don't fail the entire audit, just log the error
      }
    }

    // Display summary
    const totalDuration = Date.now() - startTime
    logger.auditComplete(grades.overallScore, grades.letterGrade, totalDuration)

    const outputMsg =
      config.output.directory === '.' ? 'root directory' : `${config.output.directory}/`
    logger.success(`Reports saved to: ${outputMsg}`)

    // Check if score meets minimum requirement
    if (grades.overallScore < config.thresholds.minScore) {
      const error = new AuditError(
        `Score ${grades.overallScore} is below minimum ${config.thresholds.minScore}`,
        'SCORE_TOO_LOW',
        { score: grades.overallScore, threshold: config.thresholds.minScore }
      )
      logger.error('Audit failed due to low score', error)
      process.exit(1)
    }

    // Check for critical issues if strict mode
    if (config.thresholds.failOnCritical && grades.criticalIssues > 0) {
      const error = new AuditError(
        `${grades.criticalIssues} critical issues found`,
        'CRITICAL_ISSUES_FOUND',
        { criticalIssues: grades.criticalIssues }
      )
      logger.error('Audit failed due to critical issues', error)
      process.exit(1)
    }

    logger.success('Audit passed all checks!')
  } catch (error) {
    const totalDuration = Date.now() - startTime
    logger.auditFailed(error, totalDuration)

    // Provide helpful error messages
    if (error.code) {
      logger.error(`Error code: ${error.code}`)
    }

    if (error.details && Object.keys(error.details).length > 0) {
      logger.debug('Error details', error.details)
    }

    process.exit(1)
  }
}

main()
