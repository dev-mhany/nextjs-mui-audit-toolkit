import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

export async function runRuntimeAudits(projectPath) {
  const results = {
    lighthouse: { issues: [], score: 0, passed: false },
    playwright: { issues: [], score: 0, passed: false },
    coverage: { issues: [], score: 0, passed: false },
    bundle: { issues: [], score: 0, passed: false },
    summary: { totalIssues: 0, passed: 0, failed: 0 }
  }

  try {
    // Run Lighthouse CI
    console.log(chalk.blue('  🔍 Running Lighthouse CI...'))
    const lighthouseResult = await runLighthouseCI(projectPath)
    results.lighthouse = lighthouseResult
    results.summary.totalIssues += lighthouseResult.issues.length
    if (lighthouseResult.passed) results.summary.passed++
    else results.summary.failed++

    // Run Playwright tests
    console.log(chalk.blue('  🎭 Running Playwright tests...'))
    const playwrightResult = await runPlaywrightTests(projectPath)
    results.playwright = playwrightResult
    results.summary.totalIssues += playwrightResult.issues.length
    if (playwrightResult.passed) results.summary.passed++
    else results.summary.failed++

    // Run coverage analysis
    console.log(chalk.blue('  📊 Running coverage analysis...'))
    const coverageResult = await runCoverageAnalysis(projectPath)
    results.coverage = coverageResult
    results.summary.totalIssues += coverageResult.issues.length
    if (coverageResult.passed) results.summary.passed++
    else results.summary.failed++

    // Run bundle composition guard
    console.log(chalk.blue('  📦 Running bundle composition guard...'))
    const bundleResult = await runBundleGuard(projectPath)
    results.bundle = bundleResult
    results.summary.totalIssues += bundleResult.issues.length
    if (bundleResult.passed) results.summary.passed++
    else results.summary.failed++
  } catch (error) {
    console.log(chalk.red('  ❌ Runtime audit error:', error.message))
    results.error = error.message
  }

  return results
}

async function runLighthouseCI(projectPath) {
  try {
    // Check if LHCI is installed
    if (!existsSync('node_modules/@lhci/cli')) {
      console.log(chalk.yellow('    ⚠️  Installing Lighthouse CI...'))
      await runCommand('npm', ['install', '--save-dev', '@lhci/cli'])
    }

    // Run Lighthouse CI
    const result = await runCommand('npx', ['@lhci/cli', 'autorun'], {
      cwd: projectPath,
      env: { ...process.env, LHCI_GITHUB_APP_TOKEN: process.env.LHCI_GITHUB_APP_TOKEN }
    })

    if (result.success) {
      return {
        passed: true,
        score: 100,
        issues: [],
        output: result.output
      }
    } else {
      // Parse Lighthouse output for specific issues
      const issues = parseLighthouseIssues(result.output, result.error)
      return {
        passed: false,
        score: calculateLighthouseScore(issues),
        issues: issues,
        output: result.output,
        error: result.error
      }
    }
  } catch (error) {
    return {
      passed: false,
      score: 0,
      issues: [
        {
          id: 'lighthouse-error',
          category: 'runtime',
          severity: 'error',
          message: 'Lighthouse CI failed to run',
          suggestion: 'Check Lighthouse CI installation and configuration',
          file: 'lighthouse-ci',
          line: 1,
          column: 1
        }
      ],
      error: error.message
    }
  }
}

// Bundle Guard: parse Next build stats or .next output and compare to baseline
async function runBundleGuard(projectPath) {
  try {
    const baselinePath = join(projectPath, '.audit-baselines', 'bundle-baseline.json')
    const ensureDirCmd = await runCommand(
      'node',
      ['-e', "require('fs').mkdirSync('.audit-baselines',{recursive:true})"],
      { cwd: projectPath }
    )

    // Try native Next stats first
    let statsJson = ''
    const env = { ...process.env, NEXTJS_STATS: 'true' }
    const build = await runCommand('npx', ['next', 'build', '--no-lint'], { cwd: projectPath, env })

    if (build.success) {
      // Next.js writes stats under .next or outputs a link; try to read common files
      // Attempt to read .next/build-manifest.json and .next/server/app-build-manifest.json
      statsJson = await readIfExists(join(projectPath, '.next', 'build-manifest.json'))
    } else {
      // Fallback to bundle analyzer wrapper if available in project
      const analyzerInstalled = existsSync(
        join(projectPath, 'node_modules', '@next', 'bundle-analyzer')
      )
      if (!analyzerInstalled) {
        await runCommand('npm', ['install', '--save-dev', '@next/bundle-analyzer'], {
          cwd: projectPath
        })
      }
      // We cannot mutate user's next.config.js here; as a fallback, parse build manifest only
      statsJson = await readIfExists(join(projectPath, '.next', 'build-manifest.json'))
    }

    const issues = []
    const summary = { passed: true }

    // Parse manifest sizes per page initial chunk JS
    const sizes = await extractBundleSizes(projectPath)

    // Load or create baseline
    let baseline = null
    if (existsSync(baselinePath)) {
      baseline = JSON.parse(require('fs').readFileSync(baselinePath, 'utf-8'))
    }

    const thresholdKB = 180 // first-load target (KB)
    const growthThreshold = 0.1 // 10%

    Object.entries(sizes.pageFirstLoadKB).forEach(([page, kb]) => {
      if (kb > thresholdKB) {
        issues.push({
          id: 'bundle-first-load-budget',
          category: 'runtime',
          severity: 'warning',
          message: `Page ${page} first-load JS ${kb.toFixed(1)}KB exceeds ${thresholdKB}KB budget`,
          suggestion: 'Split large components, reduce third-party deps, enable dynamic imports',
          file: 'next-build',
          line: 1,
          column: 1
        })
      }
    })

    if (baseline) {
      Object.entries(sizes.chunksKB).forEach(([chunk, kb]) => {
        const prev = baseline.chunksKB[chunk]
        if (typeof prev === 'number' && kb > prev * (1 + growthThreshold)) {
          issues.push({
            id: 'bundle-chunk-growth',
            category: 'runtime',
            severity: 'warning',
            message: `Chunk ${chunk} grew ${((100 * (kb - prev)) / prev).toFixed(1)}% (${prev.toFixed(1)}KB -> ${kb.toFixed(1)}KB)`,
            suggestion:
              'Investigate recent imports; consider code splitting and removing unused code',
            file: 'next-build',
            line: 1,
            column: 1
          })
        }
      })
    } else {
      // First run: write baseline
      require('fs').writeFileSync(baselinePath, JSON.stringify(sizes, null, 2))
    }

    const passed = issues.length === 0
    return { passed, score: passed ? 100 : Math.max(0, 100 - issues.length * 10), issues }
  } catch (error) {
    return {
      passed: false,
      score: 0,
      issues: [
        {
          id: 'bundle-guard-error',
          category: 'runtime',
          severity: 'warning',
          message: 'Bundle composition guard failed to run; ensure Next build is available',
          suggestion: 'Run next build locally to generate .next/build-manifest.json',
          file: 'next-build',
          line: 1,
          column: 1
        }
      ],
      error: error.message
    }
  }
}

async function extractBundleSizes(projectPath) {
  const { readFileSync, existsSync } = await import('fs')
  const manifestPath = join(projectPath, '.next', 'build-manifest.json')
  const appManifestPath = join(projectPath, '.next', 'server', 'app-build-manifest.json')

  const chunksKB = {}
  const pageFirstLoadKB = {}

  const readJSON = p => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : null)
  const manifest = readJSON(manifestPath)
  const appManifest = readJSON(appManifestPath)

  // Helper to get file sizes from .next output (best-effort; uses filename hints like ".js")
  const path = await import('path')
  const fs = await import('fs')
  const toKB = bytes => Math.round((bytes / 1024) * 10) / 10

  function fileSizeKB(rel) {
    try {
      const p = join(projectPath, '.next', rel.startsWith('/') ? rel.slice(1) : rel)
      if (fs.existsSync(p)) {
        const st = fs.statSync(p)
        return toKB(st.size)
      }
    } catch {}
    return 0
  }

  if (manifest && manifest.pages) {
    for (const [page, files] of Object.entries(manifest.pages)) {
      const jsFiles = files.filter(f => f.endsWith('.js'))
      const sumKB = jsFiles.reduce((acc, f) => acc + fileSizeKB(f), 0)
      pageFirstLoadKB[page] = sumKB
      jsFiles.forEach(f => {
        chunksKB[f] = (chunksKB[f] || 0) + fileSizeKB(f)
      })
    }
  }

  return { chunksKB, pageFirstLoadKB }
}

async function readIfExists(p) {
  try {
    const fs = await import('fs')
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8')
  } catch {}
  return ''
}

async function runPlaywrightTests(projectPath) {
  try {
    // Check if Playwright is installed
    if (!existsSync('node_modules/@playwright/test')) {
      console.log(chalk.yellow('    ⚠️  Installing Playwright...'))
      await runCommand('npm', ['install', '--save-dev', '@playwright/test', '@axe-core/playwright'])
      await runCommand('npx', ['playwright', 'install'])
    }

    // Run Playwright tests
    const result = await runCommand('npx', ['playwright', 'test'], {
      cwd: projectPath,
      env: { ...process.env, CI: 'true' }
    })

    if (result.success) {
      return {
        passed: true,
        score: 100,
        issues: [],
        output: result.output
      }
    } else {
      // Parse Playwright output for specific issues
      const issues = parsePlaywrightIssues(result.output, result.error)
      return {
        passed: false,
        score: calculatePlaywrightScore(issues),
        issues: issues,
        output: result.output,
        error: result.error
      }
    }
  } catch (error) {
    return {
      passed: false,
      score: 0,
      issues: [
        {
          id: 'playwright-error',
          category: 'runtime',
          severity: 'error',
          message: 'Playwright tests failed to run',
          suggestion: 'Check Playwright installation and test configuration',
          file: 'playwright-tests',
          line: 1,
          column: 1
        }
      ],
      error: error.message
    }
  }
}

async function runCoverageAnalysis(projectPath) {
  try {
    // Run coverage tests specifically
    const result = await runCommand('npx', ['playwright', 'test', 'tests/coverage.spec.ts'], {
      cwd: projectPath,
      env: { ...process.env, CI: 'true' }
    })

    if (result.success) {
      return {
        passed: true,
        score: 100,
        issues: [],
        output: result.output
      }
    } else {
      // Parse coverage output for specific issues
      const issues = parseCoverageIssues(result.output, result.error)
      return {
        passed: false,
        score: calculateCoverageScore(issues),
        issues: issues,
        output: result.output,
        error: result.error
      }
    }
  } catch (error) {
    return {
      passed: false,
      score: 0,
      issues: [
        {
          id: 'coverage-error',
          category: 'runtime',
          severity: 'error',
          message: 'Coverage analysis failed to run',
          suggestion: 'Check Playwright installation and coverage test configuration',
          file: 'tests/coverage.spec.ts',
          line: 1,
          column: 1
        }
      ],
      error: error.message
    }
  }
}

function parseLighthouseIssues(output, error) {
  const issues = []

  // Category thresholds (opinionated): Perf>=0.90, A11y>=0.95, Best Practices>=0.95
  const categoryMatchers = [
    { key: 'performance', label: 'Performance', min: 90 },
    { key: 'accessibility', label: 'Accessibility', min: 95 },
    { key: 'best-practices', label: 'Best Practices', min: 95 }
  ]

  categoryMatchers.forEach(cat => {
    const regex = new RegExp(`${cat.label} score.*?(\\d+)`, 'i')
    const match = output.match(regex)
    if (match) {
      const score = parseInt(match[1])
      if (score < cat.min) {
        issues.push({
          id: `lighthouse-${cat.key}`,
          category: 'runtime',
          severity: 'warning',
          message: `${cat.label} score ${score}/100 is below ${cat.min}/100 threshold`,
          suggestion:
            cat.key === 'performance'
              ? 'Optimize images, reduce JS, enable code splitting, cache static assets'
              : cat.key === 'accessibility'
                ? 'Fix axe violations, labels, alt text, landmarks, color contrast'
                : 'Address Lighthouse Best Practices recommendations',
          file: 'lighthouse-ci',
          line: 1,
          column: 1
        })
      }
    }
  })

  // Core Web Vitals (lab) thresholds: LCP<=2.5s, CLS<=0.1, INP<=200ms (proxy)
  const lcp = output.match(/Largest Contentful Paint.*?(\d+\.?\d*)\s*s/i)
  if (lcp && parseFloat(lcp[1]) > 2.5) {
    issues.push({
      id: 'lighthouse-lcp',
      category: 'runtime',
      severity: 'warning',
      message: `LCP ${parseFloat(lcp[1]).toFixed(2)}s exceeds 2.5s threshold`,
      suggestion: 'Improve server response, optimize hero image, reduce render-blocking resources',
      file: 'lighthouse-ci',
      line: 1,
      column: 1
    })
  }

  const cls = output.match(/Cumulative Layout Shift.*?(\d+\.?\d*)/i)
  if (cls && parseFloat(cls[1]) > 0.1) {
    issues.push({
      id: 'lighthouse-cls',
      category: 'runtime',
      severity: 'warning',
      message: `CLS ${parseFloat(cls[1]).toFixed(3)} exceeds 0.1 threshold`,
      suggestion: 'Reserve image/ads space, use font-display: swap, avoid layout shifts',
      file: 'lighthouse-ci',
      line: 1,
      column: 1
    })
  }

  const inp = output.match(/Interaction to Next Paint.*?(\d+\.?\d*)\s*ms/i)
  if (inp && parseFloat(inp[1]) > 200) {
    issues.push({
      id: 'lighthouse-inp',
      category: 'runtime',
      severity: 'warning',
      message: `INP ${parseFloat(inp[1]).toFixed(0)}ms exceeds 200ms threshold`,
      suggestion: 'Reduce long tasks, defer non-critical JS, optimize event handlers',
      file: 'lighthouse-ci',
      line: 1,
      column: 1
    })
  }

  if (error) {
    issues.push({
      id: 'lighthouse-error',
      category: 'runtime',
      severity: 'error',
      message: 'Lighthouse CI encountered errors',
      suggestion: 'Review Lighthouse configuration and ensure app is running',
      file: 'lighthouserc.json',
      line: 1,
      column: 1
    })
  }

  return issues
}

function parsePlaywrightIssues(output, error) {
  const issues = []

  if (output.includes('Accessibility violations')) {
    issues.push({
      id: 'playwright-accessibility',
      category: 'runtime',
      severity: 'warning',
      message: 'Accessibility violations detected in Playwright tests',
      suggestion: 'Review axe-core violations and fix WCAG AA compliance issues',
      file: 'tests/a11y.spec.ts',
      line: 1,
      column: 1
    })
  }

  if (output.includes('Test timeout')) {
    issues.push({
      id: 'playwright-timeout',
      category: 'runtime',
      severity: 'warning',
      message: 'Playwright tests timed out',
      suggestion: 'Increase timeout in playwright.config.ts or optimize page load performance',
      file: 'playwright.config.ts',
      line: 1,
      column: 1
    })
  }

  if (error) {
    issues.push({
      id: 'playwright-error',
      category: 'runtime',
      severity: 'error',
      message: 'Playwright tests failed to execute',
      suggestion: 'Check Playwright installation and test configuration',
      file: 'playwright.config.ts',
      line: 1,
      column: 1
    })
  }

  return issues
}

function parseCoverageIssues(output, error) {
  const issues = []

  if (output.includes('JS Coverage:')) {
    const match = output.match(/JS Coverage: ([\d.]+)%/)
    if (match && parseFloat(match[1]) < 40) {
      issues.push({
        id: 'coverage-threshold',
        category: 'runtime',
        severity: 'warning',
        message: `JavaScript coverage ${match[1]}% is below 40% threshold`,
        suggestion:
          'Remove unused code, implement tree shaking, use dynamic imports for code splitting',
        file: 'tests/coverage.spec.ts',
        line: 1,
        column: 1
      })
    }
  }

  if (output.includes('Total JS Size:')) {
    const match = output.match(/Total JS Size: ([\d.]+)KB/)
    if (match && parseFloat(match[1]) > 180) {
      issues.push({
        id: 'bundle-size-js',
        category: 'runtime',
        severity: 'warning',
        message: `JavaScript bundle size ${match[1]}KB exceeds 180KB budget`,
        suggestion:
          'Implement code splitting, remove unused dependencies, optimize third-party libraries',
        file: 'tests/coverage.spec.ts',
        line: 1,
        column: 1
      })
    }
  }

  if (error) {
    issues.push({
      id: 'coverage-error',
      category: 'runtime',
      severity: 'error',
      message: 'Coverage analysis failed to execute',
      suggestion: 'Check Playwright installation and coverage test configuration',
      file: 'tests/coverage.spec.ts',
      line: 1,
      column: 1
    })
  }

  return issues
}

function calculateLighthouseScore(issues) {
  if (issues.length === 0) return 100
  const criticalIssues = issues.filter(i => i.severity === 'error').length
  const warningIssues = issues.filter(i => i.severity === 'warning').length
  return Math.max(0, 100 - criticalIssues * 20 - warningIssues * 10)
}

function calculatePlaywrightScore(issues) {
  if (issues.length === 0) return 100
  const criticalIssues = issues.filter(i => i.severity === 'error').length
  const warningIssues = issues.filter(i => i.severity === 'warning').length
  return Math.max(0, 100 - criticalIssues * 25 - warningIssues * 15)
}

function calculateCoverageScore(issues) {
  if (issues.length === 0) return 100
  const criticalIssues = issues.filter(i => i.severity === 'error').length
  const warningIssues = issues.filter(i => i.severity === 'warning').length
  return Math.max(0, 100 - criticalIssues * 20 - warningIssues * 10)
}

async function runCommand(command, args, options = {}) {
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
