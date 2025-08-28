import { ESLint } from 'eslint'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'

export async function runESLint(projectPath) {
  try {
    // Check if ESLint config exists (including new flat config format)
    const eslintConfigs = [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.json',
      '.eslintrc.yml',
      '.eslintrc.yaml',
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.cjs'
    ]

    const eslintConfigPath = eslintConfigs.find(config => existsSync(join(projectPath, config)))

    if (!existsSync(eslintConfigPath)) {
      console.log('⚠️  No ESLint config found, using default configuration')
      return createDefaultESLintResults()
    }

    // For now, always use CLI approach since programmatic ESLint has issues with flat configs
    console.log('🔄 Using ESLint CLI for reliable analysis...')
    return await runESLintCLI(projectPath)
  } catch (error) {
    console.warn('⚠️  ESLint analysis failed:', error.message)
    return createDefaultESLintResults()
  }
}

function getLineContent(filePath, lineNumber) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    return lines[lineNumber - 1]?.trim() || ''
  } catch {
    return ''
  }
}

function calculateFileScore(messages) {
  let score = 100

  for (const message of messages) {
    if (message.severity === 2) {
      // Error
      score -= 10
    } else {
      // Warning
      score -= 5
    }
  }

  return Math.max(0, score)
}

async function runESLintCLI(projectPath) {
  try {
    console.log('🔄 Running: npx eslint src/**/*.{js,jsx,ts,tsx} --format=json')

    // Run ESLint CLI command
    const output = execSync('npx eslint src/**/*.{js,jsx,ts,tsx} --format=json', {
      cwd: join(process.cwd(), projectPath),
      encoding: 'utf8',
      stdio: 'pipe'
    })

    console.log('✅ ESLint CLI output length:', output.length)
    const results = JSON.parse(output)
    console.log('✅ Parsed results:', results.length, 'files')
    return processESLintResults(results, projectPath)
  } catch (error) {
    console.error('❌ ESLint CLI error:', error.message)
    if (error.stdout) console.log('stdout:', error.stdout.toString())
    if (error.stderr) console.log('stderr:', error.stderr.toString())
    throw new Error(`ESLint CLI failed: ${error.message}`)
  }
}

function processESLintResults(results, projectPath) {
  const processedResults = {
    files: {},
    summary: {
      totalFiles: results.length,
      totalIssues: 0,
      issuesBySeverity: { error: 0, warning: 0, info: 0 },
      issuesByRule: {}
    }
  }

  results.forEach(file => {
    const relativePath = file.filePath
      .replace(join(process.cwd(), projectPath), '')
      .replace(/^[\\/]/, '')

    processedResults.files[relativePath] = {
      path: relativePath,
      issues: file.messages.map(message => ({
        rule: `eslint:${message.ruleId || 'unknown'}`,
        category: 'eslint',
        severity: message.severity === 2 ? 'error' : 'warning',
        message: message.message,
        line: message.line,
        column: message.column,
        excerpt: message.line ? getLineContent(file.filePath, message.line) : '',
        suggestion: message.suggestions?.[0]?.desc || '',
        file: relativePath
      })),
      score: calculateFileScore(file.messages)
    }

    // Update summary
    file.messages.forEach(message => {
      processedResults.summary.totalIssues++
      const severity = message.severity === 2 ? 'error' : 'warning'
      processedResults.summary.issuesBySeverity[severity]++

      if (message.ruleId) {
        if (!processedResults.summary.issuesByRule[message.ruleId]) {
          processedResults.summary.issuesByRule[message.ruleId] = 0
        }
        processedResults.summary.issuesByRule[message.ruleId]++
      }
    })
  })

  return processedResults
}

function createDefaultESLintResults() {
  return {
    files: {},
    summary: {
      totalFiles: 0,
      totalIssues: 0,
      issuesBySeverity: { error: 0, warning: 0, info: 0 },
      issuesByRule: {}
    }
  }
}
