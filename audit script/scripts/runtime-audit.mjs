#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

class RuntimeAuditor {
  constructor() {
    this.results = {
      lighthouse: null,
      playwright: null,
      coverage: null,
      summary: {
        passed: 0,
        failed: 0,
        total: 0
      }
    }
  }

  async runLighthouseCI() {
    console.log(chalk.blue('🔍 Running Lighthouse CI...'))

    try {
      // Check if LHCI is installed
      if (!existsSync('node_modules/@lhci/cli')) {
        console.log(chalk.yellow('⚠️  Lighthouse CI not installed. Installing...'))
        await this.runCommand('npm', ['install', '--save-dev', '@lhci/cli'])
      }

      // Run Lighthouse CI
      const result = await this.runCommand('npx', ['@lhci/cli', 'autorun'], {
        cwd: process.cwd(),
        env: { ...process.env, LHCI_GITHUB_APP_TOKEN: process.env.LHCI_GITHUB_APP_TOKEN }
      })

      if (result.success) {
        console.log(chalk.green('✅ Lighthouse CI passed'))
        this.results.lighthouse = { success: true, output: result.output }
        this.results.summary.passed++
      } else {
        console.log(chalk.red('❌ Lighthouse CI failed'))
        this.results.lighthouse = { success: false, output: result.output, error: result.error }
        this.results.summary.failed++
      }
    } catch (error) {
      console.log(chalk.red('❌ Lighthouse CI error:', error.message))
      this.results.lighthouse = { success: false, error: error.message }
      this.results.summary.failed++
    }

    this.results.summary.total++
  }

  async runPlaywrightTests() {
    console.log(chalk.blue('🎭 Running Playwright tests...'))

    try {
      // Check if Playwright is installed
      if (!existsSync('node_modules/@playwright/test')) {
        console.log(chalk.yellow('⚠️  Playwright not installed. Installing...'))
        await this.runCommand('npm', [
          'install',
          '--save-dev',
          '@playwright/test',
          '@axe-core/playwright'
        ])
        await this.runCommand('npx', ['playwright', 'install'])
      }

      // Run Playwright tests
      const result = await this.runCommand('npx', ['playwright', 'test'], {
        cwd: process.cwd(),
        env: { ...process.env, CI: 'true' }
      })

      if (result.success) {
        console.log(chalk.green('✅ Playwright tests passed'))
        this.results.playwright = { success: true, output: result.output }
        this.results.summary.passed++
      } else {
        console.log(chalk.red('❌ Playwright tests failed'))
        this.results.playwright = { success: false, output: result.output, error: result.error }
        this.results.summary.failed++
      }
    } catch (error) {
      console.log(chalk.red('❌ Playwright error:', error.message))
      this.results.playwright = { success: false, error: error.message }
      this.results.summary.failed++
    }

    this.results.summary.total++
  }

  async runCoverageAnalysis() {
    console.log(chalk.blue('📊 Running JavaScript coverage analysis...'))

    try {
      // Run coverage tests specifically
      const result = await this.runCommand(
        'npx',
        ['playwright', 'test', 'tests/coverage.spec.ts'],
        {
          cwd: process.cwd(),
          env: { ...process.env, CI: 'true' }
        }
      )

      if (result.success) {
        console.log(chalk.green('✅ Coverage analysis passed'))
        this.results.coverage = { success: true, output: result.output }
        this.results.summary.passed++
      } else {
        console.log(chalk.red('❌ Coverage analysis failed'))
        this.results.coverage = { success: false, output: result.output, error: result.error }
        this.results.summary.failed++
      }
    } catch (error) {
      console.log(chalk.red('❌ Coverage analysis error:', error.message))
      this.results.coverage = { success: false, error: error.message }
      this.results.summary.failed++
    }

    this.results.summary.total++
  }

  async runCommand(command, args, options = {}) {
    return new Promise(resolve => {
      const process = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        ...options
      })

      let output = ''
      let error = ''

      process.stdout.on('data', data => {
        output += data.toString()
      })

      process.stderr.on('data', data => {
        error += data.toString()
      })

      process.on('close', code => {
        resolve({
          success: code === 0,
          output,
          error,
          code
        })
      })
    })
  }

  generateReport() {
    console.log(chalk.blue('\n📋 Generating Runtime Audit Report...'))

    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      results: {
        lighthouse: this.results.lighthouse,
        playwright: this.results.playwright,
        coverage: this.results.coverage
      }
    }

    // Save JSON report
    const reportPath = join(process.cwd(), 'runtime-audit-report.json')
    writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(chalk.green(`📄 JSON report saved to: ${reportPath}`))

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report)
    const markdownPath = join(process.cwd(), 'RUNTIME_AUDIT_REPORT.md')
    writeFileSync(markdownPath, markdownReport)
    console.log(chalk.green(`📄 Markdown report saved to: ${markdownPath}`))

    return report
  }

  generateMarkdownReport(report) {
    const { summary, results } = report

    return `# Runtime Audit Report

## 📊 Executive Summary

**Audit Date:** ${new Date(report.timestamp).toLocaleString()}
**Total Tests:** ${summary.total}
**Passed:** ${summary.passed} ✅
**Failed:** ${summary.failed} ❌

## 🎯 Test Results

### 🔍 Lighthouse CI
**Status:** ${results.lighthouse?.success ? '✅ PASSED' : '❌ FAILED'}

${
  results.lighthouse?.success
    ? 'All performance and accessibility budgets met successfully.'
    : `**Error:** ${results.lighthouse?.error || 'Unknown error'}\n\n**Output:**\n\`\`\`\n${results.lighthouse?.output || 'No output'}\n\`\`\``
}

### 🎭 Playwright Tests
**Status:** ${results.playwright?.success ? '✅ PASSED' : '❌ FAILED'}

${
  results.playwright?.success
    ? 'All accessibility and interaction tests passed successfully.'
    : `**Error:** ${results.playwright?.error || 'Unknown error'}\n\n**Output:**\n\`\`\`\n${results.playwright?.output || 'No output'}\n\`\`\``
}

### 📊 JavaScript Coverage
**Status:** ${results.coverage?.success ? '✅ PASSED' : '❌ FAILED'}

${
  results.coverage?.success
    ? 'JavaScript coverage thresholds met successfully.'
    : `**Error:** ${results.coverage?.error || 'Unknown error'}\n\n**Output:**\n\`\`\`\n${results.coverage?.output || 'No output'}\n\`\`\``
}

## 🚀 Next Steps

${
  summary.failed > 0
    ? `**${summary.failed} test(s) failed.** Please review the errors above and fix the issues before proceeding.`
    : '**All tests passed!** Your application meets the runtime audit requirements.'
}

## 📁 Generated Files

- \`runtime-audit-report.json\` - Machine-readable results
- \`RUNTIME_AUDIT_REPORT.md\` - Human-readable report (this file)

## 🔧 Configuration Files

- \`lighthouse/budgets.json\` - Performance budgets
- \`lighthouserc.json\` - Lighthouse CI configuration
- \`playwright.config.ts\` - Playwright test configuration
- \`tests/a11y.spec.ts\` - Accessibility tests
- \`tests/coverage.spec.ts\` - Coverage tests

---
*Generated by Next.js + MUI Runtime Audit Toolkit*
`
  }

  async run() {
    console.log(chalk.blue.bold('🚀 Next.js + MUI Runtime Audit Toolkit'))
    console.log(chalk.gray('Running comprehensive runtime audits...\n'))

    // Run all audits
    await this.runLighthouseCI()
    await this.runPlaywrightTests()
    await this.runCoverageAnalysis()

    // Generate report
    const report = this.generateReport()

    // Display summary
    console.log(chalk.blue.bold('\n📊 Runtime Audit Summary'))
    console.log(chalk.gray('─'.repeat(50)))
    console.log(`Total Tests: ${report.summary.total}`)
    console.log(`Passed: ${chalk.green(report.summary.passed)} ✅`)
    console.log(`Failed: ${chalk.red(report.summary.failed)} ❌`)

    if (report.summary.failed > 0) {
      console.log(chalk.red('\n❌ Some tests failed. Check the reports above for details.'))
      process.exit(1)
    } else {
      console.log(chalk.green('\n🎉 All runtime audits passed successfully!'))
    }
  }
}

// Run the auditor if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new RuntimeAuditor()
  auditor.run().catch(console.error)
}

export default RuntimeAuditor
