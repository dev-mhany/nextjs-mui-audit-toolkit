#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Import modules
import { scanProject } from './scanner.js'
import { generateReport } from './reporter.js'
import { calculateGrades } from './grader.js'
import { runESLint } from './eslint-runner.js'
import { createAuditDirectory } from './utils.js'
import { runPWAAudit } from './pwa-scanner.js'
import { runRuntimeAudits } from './runtime-auditor.js'
import { configManager, ConfigManager } from './config-manager.js'
import { logger, setupGlobalErrorHandling, withErrorHandling, AuditError } from './logger.js'
import { cacheManager } from './cache-manager.js'
import { autoFixer } from './auto-fixer.js'
import { pluginManager } from './plugin-manager.js'

// Set up the main program
program
  .name('nextjs-mui-audit')
  .description('🔍 Next.js + MUI Best-Practice Audit Toolkit')
  .version('1.1.0')

// Main audit command
program
  .command('audit', { isDefault: true })
  .description('Run comprehensive audit on Next.js + MUI project')
  .option('-p, --path <path>', 'path to project directory', '.')
  .option('-o, --output <dir>', 'output directory for reports', 'audit')
  .option('-c, --config <path>', 'path to configuration file')
  .option('--strict', 'fail on any critical issues', false)
  .option('--min-score <score>', 'minimum acceptable score (0-100)', '85')
  .option('--verbose', 'show verbose output', false)
  .option('--fix', 'auto-fix issues where possible', false)
  .option('--no-cache', 'disable caching', false)
  .option('--clear-cache', 'clear cache before running', false)
  .option('--watch', 'watch mode for development', false)
  .action(async options => {
    try {
      if (options.watch) {
        await runWatchMode(options)
      } else {
        await runAudit(options)
      }
    } catch (error) {
      logger.error('Audit command failed', error)
      process.exit(1)
    }
  })

// Comprehensive run command - does everything
program
  .command('run')
  .description('🚀 One-command setup and full audit execution (recommended)')
  .option('-p, --path <path>', 'path to project directory', '.')
  .option('-o, --output <dir>', 'output directory for reports', 'audit')
  .option('-c, --config <path>', 'path to configuration file')
  .option('--strict', 'fail on any critical issues', false)
  .option('--min-score <score>', 'minimum acceptable score (0-100)', '85')
  .option('--verbose', 'show verbose output', false)
  .option('--fix', 'auto-fix issues where possible', false)
  .option('--skip-install', 'skip dependency installation', false)
  .option('--skip-plugins', 'skip plugin loading', false)
  .action(async options => {
    try {
      await runComprehensiveAudit(options)
    } catch (error) {
      logger.error('Comprehensive audit failed', error)
      process.exit(1)
    }
  })

// Fix command
program
  .command('fix')
  .description('Auto-fix issues found by the audit')
  .option('-p, --path <path>', 'path to project directory', '.')
  .option('-c, --config <path>', 'path to configuration file')
  .option('--dry-run', 'show what would be fixed without making changes', false)
  .option('--no-backup', 'skip creating backup files', false)
  .option('--parallel', 'fix files in parallel', false)
  .option('--rules <rules>', 'comma-separated list of rule IDs to fix')
  .option('--exclude-rules <rules>', 'comma-separated list of rule IDs to exclude')
  .option('--report <path>', 'path to save fix report', './FIX_REPORT.md')
  .option('--verbose', 'show verbose output', false)
  .action(async options => {
    try {
      await runFix(options)
    } catch (error) {
      logger.error('Fix command failed', error)
      process.exit(1)
    }
  })

// Init command
program
  .command('init')
  .description('Initialize audit configuration file')
  .option('-o, --output <path>', 'output path for config file', './audit.config.js')
  .option('--force', 'overwrite existing config file', false)
  .action(async options => {
    try {
      await initConfig(options)
    } catch (error) {
      logger.error('Init command failed', error)
      process.exit(1)
    }
  })

// Rules command
program
  .command('rules')
  .description('List available rules and their descriptions')
  .option('--category <category>', 'filter by category')
  .option('--severity <severity>', 'filter by severity')
  .option('--fixable', 'show only auto-fixable rules', false)
  .option('--json', 'output as JSON', false)
  .action(async options => {
    try {
      await listRules(options)
    } catch (error) {
      logger.error('Rules command failed', error)
      process.exit(1)
    }
  })

// Cache command
program
  .command('cache')
  .description('Manage audit cache')
  .option('--clear', 'clear all cache entries', false)
  .option('--info', 'show cache information', false)
  .option('--stats', 'show cache statistics', false)
  .action(async options => {
    try {
      await manageCache(options)
    } catch (error) {
      logger.error('Cache command failed', error)
      process.exit(1)
    }
  })

// Config command
program
  .command('config')
  .description('Manage configuration')
  .option('--validate', 'validate configuration file', false)
  .option('--show', 'show current configuration', false)
  .option('-c, --config <path>', 'path to configuration file')
  .action(async options => {
    try {
      await manageConfig(options)
    } catch (error) {
      logger.error('Config command failed', error)
      process.exit(1)
    }
  })

// Version command (enhanced)
program
  .command('version')
  .description('Show version information')
  .option('--verbose', 'show detailed version information', false)
  .action(async options => {
    await showVersion(options)
  })

// Doctor command - check environment
program
  .command('doctor')
  .description('Check environment and installation')
  .action(async () => {
    try {
      await runDoctor()
    } catch (error) {
      logger.error('Doctor command failed', error)
      process.exit(1)
    }
  })

// Plugin command - manage plugins
program
  .command('plugin')
  .description('Manage audit plugins')
  .option('--list', 'list installed plugins', false)
  .option('--load <path>', 'load plugin from path')
  .option('--load-npm <package>', 'load plugin from npm package')
  .option('--load-dir <directory>', 'load plugins from directory')
  .option('--enable <name>', 'enable a plugin')
  .option('--disable <name>', 'disable a plugin')
  .option('--info <name>', 'show plugin information')
  .option('--rules', 'show rules from all plugins', false)
  .action(async options => {
    try {
      await managePlugins(options)
    } catch (error) {
      logger.error('Plugin command failed', error)
      process.exit(1)
    }
  })

// Command implementations
async function runAudit(options) {
  const startTime = Date.now()

  // Setup logging
  if (options.verbose) {
    logger.setLevel('debug')
  }

  setupGlobalErrorHandling(logger)

  // Handle cache options
  if (options.clearCache) {
    await cacheManager.initialize()
    await cacheManager.clear()
    logger.info('Cache cleared')
  }

  if (options.noCache) {
    cacheManager.enabled = false
  }

  logger.auditStart(options.path)

  // Load configuration
  const config = await configManager.loadConfig(options.config)
  configManager.validate()

  // Override config with CLI options
  if (options.minScore) config.thresholds.minScore = parseInt(options.minScore)
  if (options.strict !== undefined) config.thresholds.failOnCritical = options.strict
  if (options.output) config.output.directory = options.output
  if (options.verbose) config.output.verbose = true

  // Create output directory
  await createAuditDirectory(config.output.directory)

  // Run all audit components
  const eslintResults = await runESLint(options.path)
  const scanResults = await scanProject(options.path, config)
  const pwaResults = await runPWAAudit(options.path)
  const runtimeResults = await runRuntimeAudits(options.path)

  // Merge results
  const allResults = {
    ...scanResults,
    eslint: eslintResults,
    pwa: pwaResults,
    runtime: runtimeResults
  }

  // Calculate grades and generate reports
  const grades = calculateGrades(allResults)
  await generateReport(allResults, grades, config.output.directory, config)

  // Auto-fix if requested
  if (options.fix) {
    const fixResults = await autoFixer.fixProject(allResults, {
      dryRun: false,
      backup: true
    })

    if (fixResults.fixedFiles > 0) {
      logger.success(`Auto-fixed ${fixResults.fixedFiles} files`)
    }
  }

  const duration = Date.now() - startTime
  logger.auditComplete(grades.overallScore, grades.letterGrade, duration)

  // Check exit conditions
  if (grades.overallScore < config.thresholds.minScore) {
    throw new AuditError(`Score ${grades.overallScore} below minimum ${config.thresholds.minScore}`)
  }

  if (config.thresholds.failOnCritical && grades.criticalIssues > 0) {
    throw new AuditError(`${grades.criticalIssues} critical issues found`)
  }
}

async function runFix(options) {
  if (options.verbose) {
    logger.setLevel('debug')
  }

  logger.info('🔧 Auto-Fix Tool')

  const config = await configManager.loadConfig(options.config)
  const scanResults = await scanProject(options.path, config)

  if (scanResults.summary.totalIssues === 0) {
    logger.success('No issues found - nothing to fix!')
    return
  }

  const fixResults = await autoFixer.fixProject(scanResults, {
    dryRun: options.dryRun,
    backup: options.backup,
    parallel: options.parallel
  })

  const report = autoFixer.generateFixReport(fixResults)
  await writeFile(options.report, report)

  logger.success('Fix completed', {
    fixedFiles: fixResults.fixedFiles,
    totalFixes: fixResults.totalFixes,
    dryRun: options.dryRun
  })
}

async function initConfig(options) {
  const configPath = options.output

  if (existsSync(configPath) && !options.force) {
    logger.warn(`Configuration file already exists: ${configPath}`)
    logger.info('Use --force to overwrite')
    return
  }

  await ConfigManager.generateDefaultConfig(configPath)
  logger.success(`Configuration file created: ${configPath}`)
}

async function listRules(options) {
  const { rules } = await import('./rules.js')
  const availableFixers = autoFixer.getAvailableFixers()
  const fixableRules = new Set(availableFixers.filter(f => f.canFix).map(f => f.ruleId))

  let filteredRules = rules.filter(rule => {
    if (options.category && rule.category !== options.category) return false
    if (options.severity && rule.severity !== options.severity) return false
    if (options.fixable && !fixableRules.has(rule.id)) return false
    return true
  })

  if (options.json) {
    console.log(JSON.stringify(filteredRules, null, 2))
  } else {
    console.log(chalk.blue('\\n📋 Available Rules\\n'))

    const categories = [...new Set(filteredRules.map(r => r.category))]

    for (const category of categories) {
      const categoryRules = filteredRules.filter(r => r.category === category)

      console.log(chalk.yellow(`\\n${category.toUpperCase()}:`))

      for (const rule of categoryRules) {
        const fixable = fixableRules.has(rule.id) ? '🔧' : '  '
        const severityIcon =
          rule.severity === 'error' ? '🔴' : rule.severity === 'warning' ? '🟡' : '🔵'

        console.log(`  ${fixable} ${severityIcon} ${rule.id}`)
        console.log(`     ${rule.message}`)
        if (rule.suggestion) {
          console.log(chalk.gray(`     💡 ${rule.suggestion}`))
        }
      }
    }

    console.log(chalk.gray(`\\n📊 Total: ${filteredRules.length} rules`))
    console.log(
      chalk.gray(`🔧 Fixable: ${filteredRules.filter(r => fixableRules.has(r.id)).length} rules`)
    )
  }
}

async function manageCache(options) {
  await cacheManager.initialize()

  if (options.clear) {
    await cacheManager.clear()
    logger.success('Cache cleared')
  }

  if (options.info || options.stats) {
    const info = await cacheManager.getInfo()
    const stats = cacheManager.getStats()

    console.log(chalk.blue('\\n💾 Cache Information\\n'))
    console.log(`Enabled: ${info.enabled}`)
    if (info.enabled) {
      console.log(`Directory: ${info.cacheDir}`)
      console.log(`Entries: ${info.entryCount}`)
      console.log(`Total Size: ${info.totalSize}`)
      console.log(`Max Size: ${info.maxSize}`)
      console.log(`Max Age: ${info.maxAge}`)
      console.log(`Hit Rate: ${stats.hitRate}`)
      console.log(`Hits: ${stats.hits}`)
      console.log(`Misses: ${stats.misses}`)
    }
  }
}

async function manageConfig(options) {
  const config = await configManager.loadConfig(options.config)

  if (options.validate) {
    try {
      configManager.validate()
      logger.success('Configuration is valid')
    } catch (error) {
      logger.error('Configuration validation failed', error)
      process.exit(1)
    }
  }

  if (options.show) {
    console.log(chalk.blue('\\n⚙️ Current Configuration\\n'))
    console.log(JSON.stringify(config, null, 2))
  }
}

async function showVersion(options) {
  const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'))

  console.log(chalk.blue('\\n🔍 Next.js + MUI Audit Toolkit\\n'))
  console.log(`Version: ${packageJson.version}`)

  if (options.verbose) {
    console.log(`Node.js: ${process.version}`)
    console.log(`Platform: ${process.platform}`)
    console.log(`Architecture: ${process.arch}`)
    console.log(`Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`)
  }
}

async function runDoctor() {
  console.log(chalk.blue('\\n🩺 Environment Check\\n'))

  const checks = []

  // Node.js version
  const nodeVersion = process.version
  const nodeOk = parseInt(nodeVersion.slice(1)) >= 18
  checks.push({
    name: 'Node.js version',
    status: nodeOk,
    details: `${nodeVersion} ${nodeOk ? '✅' : '❌ (requires >=18.0.0)'}`
  })

  // Check if in Next.js project
  const hasNextConfig = existsSync('next.config.js') || existsSync('next.config.mjs')
  checks.push({
    name: 'Next.js project',
    status: hasNextConfig,
    details: hasNextConfig ? '✅ next.config.js found' : '⚠️ next.config.js not found'
  })

  // Check for package.json
  const hasPackageJson = existsSync('package.json')
  checks.push({
    name: 'package.json',
    status: hasPackageJson,
    details: hasPackageJson ? '✅ Found' : '❌ Not found'
  })

  // Check for MUI
  let hasMUI = false
  if (hasPackageJson) {
    try {
      const pkg = JSON.parse(await readFile('package.json', 'utf8'))
      hasMUI = !!(pkg.dependencies?.['@mui/material'] || pkg.dependencies?.['@material-ui/core'])
    } catch (error) {
      // Ignore error
    }
  }
  checks.push({
    name: 'MUI dependency',
    status: hasMUI,
    details: hasMUI ? '✅ Found' : '⚠️ @mui/material not found'
  })

  // Display results
  for (const check of checks) {
    console.log(`${check.name}: ${check.details}`)
  }

  const allPassed = checks.every(c => c.status)
  console.log(`\\n${allPassed ? '✅' : '⚠️'} Environment ${allPassed ? 'ready' : 'has issues'}`)
}

async function runWatchMode(options) {
  logger.info('👀 Starting watch mode...')

  const chokidar = await import('chokidar')
  const patterns = ['**/*.{js,jsx,ts,tsx}', '!node_modules/**', '!.next/**']

  const watcher = chokidar.watch(patterns, {
    ignored: /node_modules|\.next/,
    persistent: true,
    cwd: options.path
  })

  let auditTimeout

  const runAuditDebounced = () => {
    clearTimeout(auditTimeout)
    auditTimeout = setTimeout(async () => {
      try {
        logger.info('🔄 File changed, re-running audit...')
        await runAudit({ ...options, watch: false })
      } catch (error) {
        logger.error('Watch mode audit failed', error)
      }
    }, 1000)
  }

  watcher.on('change', runAuditDebounced)
  watcher.on('add', runAuditDebounced)
  watcher.on('unlink', runAuditDebounced)

  // Initial audit
  await runAudit({ ...options, watch: false })

  logger.info('👀 Watching for changes... Press Ctrl+C to stop')

  // Keep process alive
  process.on('SIGINT', () => {
    watcher.close()
    logger.info('\\n👋 Watch mode stopped')
    process.exit(0)
  })
}

async function runComprehensiveAudit(options) {
  const startTime = Date.now()

  console.log(chalk.blue('\n🚀 Next.js + MUI Comprehensive Audit\n'))

  // Setup logging
  if (options.verbose) {
    logger.setLevel('debug')
  }

  setupGlobalErrorHandling(logger)

  try {
    // Step 1: Environment check
    console.log(chalk.yellow('🔍 Step 1: Environment Check'))
    await runDoctor()

    // Step 2: Install dependencies if needed
    if (!options.skipInstall) {
      console.log(chalk.yellow('\n📦 Step 2: Installing Dependencies'))
      await ensureDependencies()
    } else {
      console.log(chalk.gray('\n⏭️ Step 2: Skipping dependency installation'))
    }

    // Step 3: Load configuration
    console.log(chalk.yellow('\n⚙️ Step 3: Loading Configuration'))
    const config = await configManager.loadConfig(options.config)
    configManager.validate()

    // Override config with CLI options
    if (options.minScore) config.thresholds.minScore = parseInt(options.minScore)
    if (options.strict !== undefined) config.thresholds.failOnCritical = options.strict
    if (options.output) config.output.directory = options.output
    if (options.verbose) config.output.verbose = true

    console.log(chalk.green('✓ Configuration loaded successfully'))

    // Step 4: Load plugins
    if (!options.skipPlugins) {
      console.log(chalk.yellow('\n🔌 Step 4: Loading Plugins'))
      await loadConfiguredPlugins(config)
    } else {
      console.log(chalk.gray('\n⏭️ Step 4: Skipping plugin loading'))
    }

    // Step 5: Initialize cache
    console.log(chalk.yellow('\n💾 Step 5: Initializing Cache'))
    await cacheManager.initialize()
    console.log(chalk.green('✓ Cache initialized'))

    // Step 6: Create output directory
    console.log(chalk.yellow('\n📁 Step 6: Preparing Output Directory'))
    await createAuditDirectory(config.output.directory)
    console.log(chalk.green(`✓ Output directory ready: ${config.output.directory}`))

    // Step 7: Run comprehensive audit
    console.log(chalk.yellow('\n🔍 Step 7: Running Comprehensive Audit'))

    logger.auditStart(options.path)

    // Run all audit components
    console.log(chalk.blue('  🔧 Running ESLint analysis...'))
    const eslintResults = await runESLint(options.path)

    console.log(chalk.blue('  🔍 Scanning project files...'))
    const scanResults = await scanProject(options.path, config)

    console.log(chalk.blue('  📱 Running PWA audit...'))
    const pwaResults = await runPWAAudit(options.path)

    console.log(chalk.blue('  🎭 Running runtime audits...'))
    const runtimeResults = await runRuntimeAudits(options.path)

    // Step 8: Calculate grades
    console.log(chalk.yellow('\n📊 Step 8: Calculating Grades'))
    const combinedResults = {
      ...scanResults,
      eslint: eslintResults,
      pwa: pwaResults,
      runtime: runtimeResults
    }

    const grades = await calculateGrades(combinedResults)
    console.log(chalk.green(`✓ Overall Score: ${grades.overallScore}/100 (${grades.letterGrade})`))

    // Step 9: Auto-fix if requested
    if (options.fix) {
      console.log(chalk.yellow('\n🔧 Step 9: Auto-fixing Issues'))
      const fixResults = await autoFixer.fixProject(scanResults, {
        dryRun: false,
        backup: true
      })
      console.log(
        chalk.green(`✓ Fixed ${fixResults.totalFixes} issues in ${fixResults.fixedFiles} files`)
      )

      // Re-run scan after fixes
      if (fixResults.totalFixes > 0) {
        console.log(chalk.blue('  🔄 Re-scanning after fixes...'))
        const updatedScanResults = await scanProject(options.path, config)
        const updatedGrades = await calculateGrades({
          ...updatedScanResults,
          eslint: eslintResults,
          pwa: pwaResults,
          runtime: runtimeResults
        })
        combinedResults.scanResults = updatedScanResults
        grades.overallScore = updatedGrades.overallScore
        grades.letterGrade = updatedGrades.letterGrade
        console.log(
          chalk.green(`✓ Updated Score: ${grades.overallScore}/100 (${grades.letterGrade})`)
        )
      }
    } else {
      console.log(chalk.gray('\n⏭️ Step 9: Skipping auto-fix (use --fix to enable)'))
    }

    // Step 10: Generate reports
    console.log(chalk.yellow('\n📄 Step 10: Generating Reports'))
    await generateReport(combinedResults, grades, config)
    console.log(chalk.green(`✓ Reports generated in ${config.output.directory}`))

    // Step 11: Show summary
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000)

    console.log(chalk.blue('\n🏁 Audit Summary:'))
    console.log(`   📁 Project: ${options.path}`)
    console.log(
      `   📊 Overall Score: ${chalk.bold(grades.overallScore)}/100 (${chalk.bold(grades.letterGrade)})`
    )
    console.log(`   🔴 Critical Issues: ${chalk.bold(grades.criticalIssues)}`)
    console.log(`   📄 Reports: ${config.output.directory}`)
    console.log(`   ⏱️ Duration: ${duration}s`)

    // Check thresholds
    const passed =
      grades.overallScore >= config.thresholds.minScore &&
      (!config.thresholds.failOnCritical || grades.criticalIssues === 0)

    if (passed) {
      console.log(chalk.green('\n✅ Audit PASSED! 🎉'))
      console.log(chalk.green('Your project meets the quality standards.'))
    } else {
      console.log(chalk.red('\n❌ Audit FAILED! ⚠️'))
      if (grades.overallScore < config.thresholds.minScore) {
        console.log(
          chalk.red(`Score ${grades.overallScore} is below minimum ${config.thresholds.minScore}`)
        )
      }
      if (config.thresholds.failOnCritical && grades.criticalIssues > 0) {
        console.log(chalk.red(`${grades.criticalIssues} critical issues must be resolved`))
      }

      console.log(chalk.yellow('\n💡 Suggestions:'))
      console.log('  • Run with --fix to auto-fix common issues')
      console.log('  • Check the detailed report for specific recommendations')
      console.log('  • Use --verbose for more detailed output')

      if (!passed && (options.strict || config.thresholds.failOnCritical)) {
        process.exit(1)
      }
    }

    console.log(chalk.blue('\n📄 Next Steps:'))
    console.log(`  • View detailed report: open ${config.output.directory}/REPORT.html`)
    console.log(`  • Run in watch mode: npx nextjs-mui-audit run --watch`)
    console.log(`  • Fix issues: npx nextjs-mui-audit fix`)
  } catch (error) {
    console.log(chalk.red('\n❌ Comprehensive audit failed'))
    logger.error('Comprehensive audit error', error)
    throw error
  }
}

async function ensureDependencies() {
  try {
    const { existsSync } = await import('fs')
    const { execSync } = await import('child_process')

    // Check if node_modules exists
    if (!existsSync('node_modules')) {
      console.log(chalk.blue('  📦 Installing npm dependencies...'))
      execSync('npm ci', { stdio: 'pipe' })
      console.log(chalk.green('  ✓ Dependencies installed'))
    } else {
      console.log(chalk.green('  ✓ Dependencies already installed'))
    }

    // Check for missing peer dependencies
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' })
      console.log(chalk.green('  ✓ All dependencies satisfied'))
    } catch (error) {
      console.log(chalk.yellow('  ⚠️ Some dependencies may be missing, but continuing...'))
    }
  } catch (error) {
    console.log(chalk.red('  ❌ Failed to install dependencies'))
    logger.warn('Dependency installation failed', error)
    // Continue anyway
  }
}

async function loadConfiguredPlugins(config) {
  try {
    if (config.plugins && config.plugins.length > 0) {
      console.log(chalk.blue(`  🔌 Loading ${config.plugins.length} configured plugins...`))

      let loadedCount = 0
      for (const plugin of config.plugins) {
        try {
          if (typeof plugin === 'string') {
            if (plugin.startsWith('./') || plugin.startsWith('../')) {
              // Local plugin
              const { resolve } = await import('path')
              const absolutePath = resolve(plugin)
              await pluginManager.loadPluginFromFile(absolutePath + '/index.js')
            } else if (plugin.startsWith('@') || plugin.includes('/')) {
              // NPM plugin
              await pluginManager.loadPluginFromNpm(plugin)
            }
          } else if (typeof plugin === 'object') {
            // Plugin object
            await pluginManager.registerPlugin(plugin.name || 'anonymous', plugin)
          }
          loadedCount++
        } catch (error) {
          logger.warn(`Failed to load plugin: ${plugin}`, error)
        }
      }

      console.log(chalk.green(`  ✓ Loaded ${loadedCount}/${config.plugins.length} plugins`))

      // Show loaded plugins
      const plugins = pluginManager.getRegisteredPlugins()
      if (plugins.length > 0) {
        console.log(chalk.gray('    Loaded plugins:'))
        plugins.forEach(plugin => {
          console.log(chalk.gray(`    • ${plugin.name} v${plugin.version || '1.0.0'}`))
        })
      }
    } else {
      console.log(chalk.gray('  • No plugins configured'))
    }

    // Also try to load from default plugins directory
    const { existsSync } = await import('fs')
    if (existsSync('./plugins')) {
      console.log(chalk.blue('  🔌 Loading plugins from ./plugins directory...'))
      const loadedPlugins = await pluginManager.loadPluginsFromDirectory('./plugins')
      if (loadedPlugins.length > 0) {
        console.log(
          chalk.green(`  ✓ Loaded ${loadedPlugins.length} additional plugins from directory`)
        )
      } else {
        console.log(chalk.gray('  • No additional plugins found in ./plugins'))
      }
    }
  } catch (error) {
    logger.warn('Plugin loading failed', error)
    console.log(chalk.yellow('  ⚠️ Plugin loading failed, continuing without plugins'))
  }
}

async function managePlugins(options) {
  try {
    // List plugins
    if (options.list) {
      const plugins = pluginManager.getRegisteredPlugins()
      console.log(chalk.blue('\n🔌 Installed Plugins\n'))

      if (plugins.length === 0) {
        console.log(chalk.gray('No plugins installed'))
        return
      }

      for (const plugin of plugins) {
        const status = plugin.enabled ? '✅' : '❌'
        console.log(`${status} ${chalk.yellow(plugin.name)} v${plugin.version || '1.0.0'}`)
        console.log(`   ${plugin.description || 'No description'}`)
        if (plugin.rules && plugin.rules.length > 0) {
          console.log(chalk.gray(`   Rules: ${plugin.rules.length}`))
        }
        console.log()
      }
      return
    }

    // Show plugin rules
    if (options.rules) {
      const allRules = pluginManager.getAllRules()
      console.log(chalk.blue('\n📋 Plugin Rules\n'))

      if (allRules.length === 0) {
        console.log(chalk.gray('No plugin rules available'))
        return
      }

      const rulesByPlugin = {}
      for (const rule of allRules) {
        const pluginName = rule.pluginName || 'unknown'
        if (!rulesByPlugin[pluginName]) {
          rulesByPlugin[pluginName] = []
        }
        rulesByPlugin[pluginName].push(rule)
      }

      for (const [pluginName, rules] of Object.entries(rulesByPlugin)) {
        console.log(chalk.yellow(`${pluginName.toUpperCase()}:`))
        for (const rule of rules) {
          const severityIcon =
            rule.severity === 'error' ? '🔴' : rule.severity === 'warning' ? '🟡' : '🔵'
          console.log(`  ${severityIcon} ${rule.id}`)
          console.log(`     ${rule.message}`)
        }
        console.log()
      }
      return
    }

    // Load plugin from path
    if (options.load) {
      await pluginManager.loadPluginFromFile(options.load)
      logger.success(`Plugin loaded from: ${options.load}`)
      return
    }

    // Load plugin from npm package
    if (options.loadNpm) {
      await pluginManager.loadPluginFromNpm(options.loadNpm)
      logger.success(`Plugin loaded from NPM: ${options.loadNpm}`)
      return
    }

    // Load plugins from directory
    if (options.loadDir) {
      const loadedCount = await pluginManager.loadPluginsFromDirectory(options.loadDir)
      logger.success(`Loaded ${loadedCount} plugins from: ${options.loadDir}`)
      return
    }

    // Enable plugin
    if (options.enable) {
      const success = pluginManager.enablePlugin(options.enable)
      if (success) {
        logger.success(`Plugin enabled: ${options.enable}`)
      } else {
        logger.error(`Plugin not found: ${options.enable}`)
        process.exit(1)
      }
      return
    }

    // Disable plugin
    if (options.disable) {
      const success = pluginManager.disablePlugin(options.disable)
      if (success) {
        logger.success(`Plugin disabled: ${options.disable}`)
      } else {
        logger.error(`Plugin not found: ${options.disable}`)
        process.exit(1)
      }
      return
    }

    // Show plugin info
    if (options.info) {
      const plugin = pluginManager.getPlugin(options.info)
      if (!plugin) {
        logger.error(`Plugin not found: ${options.info}`)
        process.exit(1)
      }

      console.log(chalk.blue(`\n🔌 Plugin: ${plugin.name}\n`))
      console.log(`Version: ${plugin.version || '1.0.0'}`)
      console.log(`Description: ${plugin.description || 'No description'}`)
      console.log(`Author: ${plugin.author || 'Unknown'}`)
      console.log(`Enabled: ${plugin.enabled ? '✅' : '❌'}`)

      if (plugin.rules && plugin.rules.length > 0) {
        console.log(`\nRules (${plugin.rules.length}):`)
        for (const rule of plugin.rules) {
          const severityIcon =
            rule.severity === 'error' ? '🔴' : rule.severity === 'warning' ? '🟡' : '🔵'
          console.log(`  ${severityIcon} ${rule.id}: ${rule.message}`)
        }
      }

      if (plugin.hooks && Object.keys(plugin.hooks).length > 0) {
        console.log(`\nHooks: ${Object.keys(plugin.hooks).join(', ')}`)
      }

      return
    }

    // Default: show help
    console.log(chalk.blue('\n🔌 Plugin Management\n'))
    console.log('Available commands:')
    console.log('  --list                 List installed plugins')
    console.log('  --load <path>          Load plugin from file')
    console.log('  --load-npm <package>   Load plugin from NPM')
    console.log('  --load-dir <dir>       Load plugins from directory')
    console.log('  --enable <name>        Enable a plugin')
    console.log('  --disable <name>       Disable a plugin')
    console.log('  --info <name>          Show plugin information')
    console.log('  --rules                Show all plugin rules')
  } catch (error) {
    logger.error('Plugin management failed', error)
    throw error
  }
}

// Parse and execute
program.parse()
