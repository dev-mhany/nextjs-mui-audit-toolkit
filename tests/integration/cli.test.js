import { test, expect, describe, beforeEach, afterEach } from '@jest/globals'
import { spawn } from 'child_process'
import { join } from 'path'
import { writeFile, mkdir, rmdir } from 'fs/promises'
import { existsSync } from 'fs'

describe('CLI Integration Tests', () => {
  const testProjectDir = join(process.cwd(), 'cli-test-project')
  const auditOutputDir = join(process.cwd(), 'cli-audit-output')

  beforeEach(async () => {
    // Create test project
    await mkdir(testProjectDir, { recursive: true })
    await mkdir(join(testProjectDir, 'src'), { recursive: true })

    // Create a simple test file
    await writeFile(
      join(testProjectDir, 'src', 'test.jsx'),
      `
import React from 'react'
import { Box } from '@mui/material'

export default function Test() {
  return (
    <Box style={{ padding: '16px' }}>
      <img src="/test.jpg" />
    </Box>
  )
}
    `
    )
  })

  afterEach(async () => {
    // Cleanup
    if (existsSync(testProjectDir)) {
      await rmdir(testProjectDir, { recursive: true })
    }
    if (existsSync(auditOutputDir)) {
      await rmdir(auditOutputDir, { recursive: true })
    }
  })

  describe('Audit Command', () => {
    test('should run basic audit successfully', async () => {
      const result = await runCLICommand('audit', [
        '--path',
        testProjectDir,
        '--output',
        auditOutputDir,
        '--no-cache'
      ])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Audit completed')
      expect(existsSync(join(auditOutputDir, 'report.json'))).toBe(true)
      expect(existsSync(join(auditOutputDir, 'REPORT.md'))).toBe(true)
    })

    test('should handle verbose output', async () => {
      const result = await runCLICommand('audit', [
        '--path',
        testProjectDir,
        '--output',
        auditOutputDir,
        '--verbose',
        '--no-cache'
      ])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Configuration loaded')
      expect(result.stdout).toContain('Processed')
    })

    test('should fail with strict mode and issues', async () => {
      const result = await runCLICommand('audit', [
        '--path',
        testProjectDir,
        '--strict',
        '--no-cache'
      ])

      // Should fail due to critical issues in strict mode
      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain('critical issues')
    })

    test('should handle custom minimum score', async () => {
      const result = await runCLICommand('audit', [
        '--path',
        testProjectDir,
        '--min-score',
        '95',
        '--no-cache'
      ])

      // Should fail due to high minimum score requirement
      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain('below minimum')
    })
  })

  describe('Fix Command', () => {
    test('should run dry-run fix successfully', async () => {
      const result = await runCLICommand('fix', ['--path', testProjectDir, '--dry-run'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('dry-run mode')
      expect(result.stdout).toContain('issues can be automatically fixed')
    })

    test('should apply fixes when not in dry-run', async () => {
      const result = await runCLICommand('fix', ['--path', testProjectDir, '--no-backup'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Fix completed')
      expect(existsSync('./FIX_REPORT.md')).toBe(true)
    })
  })

  describe('Rules Command', () => {
    test('should list all rules', async () => {
      const result = await runCLICommand('rules', [])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Available Rules')
      expect(result.stdout).toContain('NEXTJS:')
      expect(result.stdout).toContain('MUI:')
    })

    test('should filter rules by category', async () => {
      const result = await runCLICommand('rules', ['--category', 'mui'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('mui/')
      expect(result.stdout).not.toContain('next/')
    })

    test('should show only fixable rules', async () => {
      const result = await runCLICommand('rules', ['--fixable'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('🔧')
    })

    test('should output JSON format', async () => {
      const result = await runCLICommand('rules', ['--json'])

      expect(result.exitCode).toBe(0)

      // Should be valid JSON
      expect(() => JSON.parse(result.stdout)).not.toThrow()

      const rules = JSON.parse(result.stdout)
      expect(Array.isArray(rules)).toBe(true)
      expect(rules.length).toBeGreaterThan(0)
      expect(rules[0]).toHaveProperty('id')
      expect(rules[0]).toHaveProperty('category')
      expect(rules[0]).toHaveProperty('severity')
    })
  })

  describe('Init Command', () => {
    test('should create configuration file', async () => {
      const configPath = join(testProjectDir, 'custom.config.js')

      const result = await runCLICommand('init', ['--output', configPath])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Configuration file created')
      expect(existsSync(configPath)).toBe(true)
    })

    test('should not overwrite existing config without force', async () => {
      const configPath = join(testProjectDir, 'existing.config.js')
      await writeFile(configPath, 'existing content')

      const result = await runCLICommand('init', ['--output', configPath])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('already exists')
      expect(result.stdout).toContain('Use --force')
    })

    test('should overwrite with force flag', async () => {
      const configPath = join(testProjectDir, 'force.config.js')
      await writeFile(configPath, 'existing content')

      const result = await runCLICommand('init', ['--output', configPath, '--force'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Configuration file created')
    })
  })

  describe('Cache Command', () => {
    test('should show cache info', async () => {
      const result = await runCLICommand('cache', ['--info'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Cache Information')
      expect(result.stdout).toContain('Enabled:')
    })

    test('should clear cache', async () => {
      const result = await runCLICommand('cache', ['--clear'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Cache cleared')
    })
  })

  describe('Doctor Command', () => {
    test('should check environment', async () => {
      const result = await runCLICommand('doctor', [])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Environment Check')
      expect(result.stdout).toContain('Node.js version')
      expect(result.stdout).toContain('package.json')
    })
  })

  describe('Config Command', () => {
    test('should validate configuration', async () => {
      // Create a valid config file
      const configPath = join(testProjectDir, 'valid.config.js')
      await writeFile(
        configPath,
        `
export default {
  rules: {
    'mui/inline-styles': 'error'
  },
  categories: {
    nextjs: { weight: 50 },
    mui: { weight: 50 }
  }
}
      `
      )

      const result = await runCLICommand('config', ['--validate', '--config', configPath])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Configuration is valid')
    })

    test('should show current configuration', async () => {
      const result = await runCLICommand('config', ['--show'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Current Configuration')

      // Should be valid JSON
      const configMatch = result.stdout.match(/\{[\s\S]*\}/)
      expect(configMatch).toBeTruthy()
      expect(() => JSON.parse(configMatch[0])).not.toThrow()
    })
  })

  describe('Version Command', () => {
    test('should show version', async () => {
      const result = await runCLICommand('version', [])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Next.js + MUI Audit Toolkit')
      expect(result.stdout).toMatch(/Version: \d+\.\d+\.\d+/)
    })

    test('should show verbose version info', async () => {
      const result = await runCLICommand('version', ['--verbose'])

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('Node.js:')
      expect(result.stdout).toContain('Platform:')
      expect(result.stdout).toContain('Architecture:')
    })
  })

  // Helper function to run CLI commands
  function runCLICommand(command, args = [], timeout = 30000) {
    return new Promise(resolve => {
      const cliPath = join(process.cwd(), 'src', 'cli.js')
      const child = spawn('node', [cliPath, command, ...args], {
        stdio: 'pipe',
        cwd: process.cwd()
      })

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', data => {
        stdout += data.toString()
      })

      child.stderr.on('data', data => {
        stderr += data.toString()
      })

      const timer = setTimeout(() => {
        child.kill()
        resolve({
          exitCode: 1,
          stdout,
          stderr: stderr + 'Process timed out'
        })
      }, timeout)

      child.on('close', code => {
        clearTimeout(timer)
        resolve({
          exitCode: code,
          stdout,
          stderr
        })
      })
    })
  }
})
