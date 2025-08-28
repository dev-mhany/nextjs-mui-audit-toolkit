import { test, expect, describe, beforeEach, afterEach, jest } from '@jest/globals'
import { join } from 'path'
import { readFile, writeFile, mkdir, rmdir } from 'fs/promises'
import { existsSync } from 'fs'
import { scanProject } from '../../src/scanner.js'
import { generateReport } from '../../src/reporter.js'
import { calculateGrades } from '../../src/grader.js'
import { configManager } from '../../src/config-manager.js'
import { autoFixer } from '../../src/auto-fixer.js'
import { cacheManager } from '../../src/cache-manager.js'

describe('Full Audit Workflow Integration Tests', () => {
  const testProjectDir = join(process.cwd(), 'test-project')
  const auditOutputDir = join(process.cwd(), 'test-audit-output')

  beforeEach(async () => {
    // Create test project structure
    await mkdir(testProjectDir, { recursive: true })
    await mkdir(join(testProjectDir, 'src', 'components'), { recursive: true })
    await mkdir(join(testProjectDir, 'pages'), { recursive: true })

    // Clear any existing cache
    await cacheManager.initialize()
    await cacheManager.clear()
  })

  afterEach(async () => {
    // Cleanup test directories
    if (existsSync(testProjectDir)) {
      await rmdir(testProjectDir, { recursive: true })
    }
    if (existsSync(auditOutputDir)) {
      await rmdir(auditOutputDir, { recursive: true })
    }
  })

  describe('End-to-End Audit Process', () => {
    test('should complete full audit workflow with mixed quality code', async () => {
      // Create test files with various issues
      await createTestFiles()

      // Run the complete audit workflow
      const config = await configManager.loadConfig()

      // 1. Scan project
      const scanResults = await scanProject(testProjectDir, config)

      // Verify scan results
      expect(scanResults).toHaveProperty('files')
      expect(scanResults).toHaveProperty('summary')
      expect(scanResults.summary.totalFiles).toBeGreaterThan(0)
      expect(scanResults.summary.totalIssues).toBeGreaterThan(0)

      // 2. Calculate grades
      const grades = calculateGrades(scanResults)

      // Verify grades calculation
      expect(grades).toHaveProperty('overallScore')
      expect(grades).toHaveProperty('letterGrade')
      expect(grades).toHaveProperty('categoryScores')
      expect(grades.overallScore).toBeGreaterThanOrEqual(0)
      expect(grades.overallScore).toBeLessThanOrEqual(100)
      expect(['A', 'B', 'C', 'D', 'F']).toContain(grades.letterGrade)

      // 3. Generate reports
      await mkdir(auditOutputDir, { recursive: true })
      await generateReport(scanResults, grades, auditOutputDir, {
        output: { formats: ['json', 'markdown', 'html'] }
      })

      // Verify report generation
      expect(existsSync(join(auditOutputDir, 'report.json'))).toBe(true)
      expect(existsSync(join(auditOutputDir, 'REPORT.md'))).toBe(true)
      expect(existsSync(join(auditOutputDir, 'report.html'))).toBe(true)

      // Verify report content
      const jsonReport = JSON.parse(await readFile(join(auditOutputDir, 'report.json'), 'utf8'))
      expect(jsonReport).toHaveProperty('summary')
      expect(jsonReport).toHaveProperty('files')
      expect(jsonReport.summary.overallScore).toBe(grades.overallScore)
    })

    test('should handle auto-fixing workflow', async () => {
      // Create test files with fixable issues
      await createFixableTestFiles()

      const config = await configManager.loadConfig()
      const initialResults = await scanProject(testProjectDir, config)
      const initialGrades = calculateGrades(initialResults)

      expect(initialResults.summary.totalIssues).toBeGreaterThan(0)

      // Run auto-fixer
      const fixResults = await autoFixer.fixProject(initialResults, {
        dryRun: false,
        backup: false
      })

      expect(fixResults.fixedFiles).toBeGreaterThan(0)
      expect(fixResults.totalFixes).toBeGreaterThan(0)

      // Re-scan after fixes
      const postFixResults = await scanProject(testProjectDir, config)
      const postFixGrades = calculateGrades(postFixResults)

      // Verify improvement
      expect(postFixResults.summary.totalIssues).toBeLessThan(initialResults.summary.totalIssues)
      expect(postFixGrades.overallScore).toBeGreaterThanOrEqual(initialGrades.overallScore)
    })

    test('should handle perfect code without issues', async () => {
      // Create perfect test files
      await createPerfectTestFiles()

      const config = await configManager.loadConfig()
      const results = await scanProject(testProjectDir, config)
      const grades = calculateGrades(results)

      expect(results.summary.totalIssues).toBe(0)
      expect(grades.overallScore).toBe(100)
      expect(grades.letterGrade).toBe('A')
      expect(grades.criticalIssues).toBe(0)
    })

    test('should respect configuration settings', async () => {
      await createTestFiles()

      // Test with custom configuration
      const customConfig = {
        rules: {
          'mui/inline-styles': 'off',
          'next/image-usage': 'error'
        },
        categories: {
          nextjs: { weight: 50 },
          mui: { weight: 50 }
        },
        thresholds: {
          minScore: 95,
          failOnCritical: true
        }
      }

      const results = await scanProject(testProjectDir, customConfig)

      // Verify that disabled rules don't appear in results
      const muiStyleIssues = Object.values(results.files)
        .flatMap(f => f.issues)
        .filter(issue => issue.rule === 'mui/inline-styles')
      expect(muiStyleIssues.length).toBe(0)
    })

    test('should handle caching correctly', async () => {
      await createTestFiles()

      const config = await configManager.loadConfig()

      // First scan - should populate cache
      const startTime1 = Date.now()
      const results1 = await scanProject(testProjectDir, config)
      const duration1 = Date.now() - startTime1

      // Second scan - should use cache
      const startTime2 = Date.now()
      const results2 = await scanProject(testProjectDir, config)
      const duration2 = Date.now() - startTime2

      // Results should be identical
      expect(results1.summary.totalIssues).toBe(results2.summary.totalIssues)
      expect(results1.summary.totalFiles).toBe(results2.summary.totalFiles)

      // Second scan should be faster due to caching
      expect(duration2).toBeLessThan(duration1)

      // Verify cache stats
      const cacheStats = cacheManager.getStats()
      expect(cacheStats.hits).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid project directory gracefully', async () => {
      const invalidDir = join(process.cwd(), 'non-existent-directory')

      await expect(scanProject(invalidDir)).rejects.toThrow(/Failed to scan project/)
    })

    test('should handle corrupted files gracefully', async () => {
      // Create a file with invalid syntax
      await writeFile(join(testProjectDir, 'invalid.jsx'), 'invalid javascript {{{')

      const config = await configManager.loadConfig()

      // Should not throw, but should handle the error gracefully
      const results = await scanProject(testProjectDir, config)
      expect(results).toHaveProperty('files')
      expect(results).toHaveProperty('summary')
    })

    test('should handle missing output directory', async () => {
      await createTestFiles()

      const config = await configManager.loadConfig()
      const results = await scanProject(testProjectDir, config)
      const grades = calculateGrades(results)

      const nonExistentDir = join(process.cwd(), 'non-existent', 'deep', 'path')

      // Should create directory and generate reports
      await expect(generateReport(results, grades, nonExistentDir)).resolves.not.toThrow()

      expect(existsSync(join(nonExistentDir, 'report.json'))).toBe(true)
    })
  })

  describe('Performance Tests', () => {
    test('should handle large projects efficiently', async () => {
      // Create many test files
      const fileCount = 50
      for (let i = 0; i < fileCount; i++) {
        await writeFile(
          join(testProjectDir, `component-${i}.jsx`),
          generateTestComponent(`Component${i}`)
        )
      }

      const config = await configManager.loadConfig()

      const startTime = Date.now()
      const results = await scanProject(testProjectDir, config)
      const duration = Date.now() - startTime

      expect(results.summary.totalFiles).toBe(fileCount)
      expect(duration).toBeLessThan(30000) // Should complete within 30 seconds
    })
  })

  // Helper functions
  async function createTestFiles() {
    // Component with multiple issues
    await writeFile(
      join(testProjectDir, 'src', 'components', 'BadComponent.jsx'),
      `
import React from 'react'
import { Box, Grid } from '@mui/material'

export default function BadComponent() {
  return (
    <div>
      <Box style={{ padding: '16px', color: '#1976d2' }}>
        <img src="/test.jpg" />
        <Grid container>
          <Grid item>
            No responsive props
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}
    `
    )

    // Page with Next.js issues
    await writeFile(
      join(testProjectDir, 'pages', 'bad-page.js'),
      `
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function BadPage() {
  return (
    <div>
      <Head>
        <title>Bad Page</title>
      </Head>
      <h1>Hello World</h1>
      <img src="/hero.jpg" alt="Hero" />
    </div>
  )
}
    `
    )
  }

  async function createFixableTestFiles() {
    // Component with auto-fixable issues
    await writeFile(
      join(testProjectDir, 'FixableComponent.jsx'),
      `
import React from 'react'
import { Box } from '@mui/material'

export default function FixableComponent() {
  return (
    <Box style={{ padding: '16px', margin: '8px' }}>
      <img src="/test.jpg" />
    </Box>
  )
}
    `
    )
  }

  async function createPerfectTestFiles() {
    // Perfect component with no issues
    await writeFile(
      join(testProjectDir, 'PerfectComponent.jsx'),
      `
import React from 'react'
import Image from 'next/image'
import { Box, Grid } from '@mui/material'

export default function PerfectComponent() {
  return (
    <Box sx={{ padding: 2 }}>
      <Image src="/test.jpg" alt="Test image" width={400} height={300} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ color: 'primary.main' }}>
            Perfect content
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
    `
    )
  }

  function generateTestComponent(name) {
    return `
import React from 'react'
import { Box } from '@mui/material'

export default function ${name}() {
  return (
    <Box sx={{ padding: 2 }}>
      <h1>${name}</h1>
    </Box>
  )
}
    `
  }
})
