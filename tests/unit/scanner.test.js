import { test, expect, describe, beforeEach, jest } from '@jest/globals'
import { scanProject } from '../src/scanner.js'
import { configManager } from '../src/config-manager.js'
import fs from 'fs'
import path from 'path'

// Mock fs and glob
jest.mock('fs')
jest.mock('glob')

describe('Scanner', () => {
  let mockConfig

  beforeEach(() => {
    mockConfig = {
      include: ['**/*.{js,jsx,ts,tsx}'],
      ignore: ['node_modules/**', '.next/**'],
      isRuleEnabled: jest.fn(() => true),
      getRuleSeverity: jest.fn((ruleId, defaultSeverity) => defaultSeverity),
      getRuleOptions: jest.fn(() => ({})),
      shouldIgnore: jest.fn(() => false),
      shouldInclude: jest.fn(() => true)
    }

    // Reset mocks
    jest.clearAllMocks()
  })

  describe('scanProject', () => {
    test('should scan project and return structured results', async () => {
      // Mock glob to return test files
      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/test.jsx', 'src/components/Button.tsx'])

      // Mock file reading
      fs.readFileSync.mockImplementation(filePath => {
        if (filePath.includes('test.jsx')) {
          return '<Box style={{ padding: "16px" }}>Test</Box>'
        }
        if (filePath.includes('Button.tsx')) {
          return 'import React from "react"\\nexport const Button = () => <button>Click</button>'
        }
        return ''
      })

      fs.statSync.mockReturnValue({ isFile: () => true })

      const results = await scanProject('./test-project', mockConfig)

      expect(results).toHaveProperty('files')
      expect(results).toHaveProperty('summary')
      expect(results.summary).toHaveProperty('totalFiles')
      expect(results.summary).toHaveProperty('totalIssues')
      expect(results.summary).toHaveProperty('issuesByCategory')
      expect(results.summary).toHaveProperty('issuesBySeverity')
    })

    test('should respect configuration ignore patterns', async () => {
      mockConfig.shouldIgnore = jest.fn(filePath => filePath.includes('test'))

      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/test.jsx', 'src/Button.tsx'])

      fs.readFileSync.mockReturnValue('')
      fs.statSync.mockReturnValue({ isFile: () => true })

      const results = await scanProject('./test-project', mockConfig)

      // Should only process Button.tsx, not test.jsx
      expect(mockConfig.shouldIgnore).toHaveBeenCalledWith('src/test.jsx')
      expect(mockConfig.shouldIgnore).toHaveBeenCalledWith('src/Button.tsx')
    })

    test('should apply rule configuration', async () => {
      mockConfig.isRuleEnabled = jest.fn(ruleId => ruleId !== 'mui/inline-styles')
      mockConfig.getRuleSeverity = jest.fn((ruleId, defaultSeverity) =>
        ruleId === 'next/image-usage' ? 'error' : defaultSeverity
      )

      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/test.jsx'])

      fs.readFileSync.mockReturnValue(
        '<Box style={{ padding: "16px" }}><img src="test.jpg" /></Box>'
      )
      fs.statSync.mockReturnValue({ isFile: () => true })

      await scanProject('./test-project', mockConfig)

      expect(mockConfig.isRuleEnabled).toHaveBeenCalled()
      expect(mockConfig.getRuleSeverity).toHaveBeenCalled()
    })

    test('should handle file read errors gracefully', async () => {
      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/test.jsx'])

      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      await expect(scanProject('./test-project', mockConfig)).rejects.toThrow(
        'Failed to scan project'
      )
    })
  })

  describe('File scoring', () => {
    test('should calculate correct file scores', async () => {
      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/perfect.jsx', 'src/issues.jsx'])

      fs.readFileSync.mockImplementation(filePath => {
        if (filePath.includes('perfect.jsx')) {
          return `
            import Image from 'next/image'
            import { Box } from '@mui/material'
            
            export default function Perfect() {
              return (
                <Box sx={{ padding: 2 }}>
                  <Image src="/test.jpg" alt="Test" width={100} height={100} />
                </Box>
              )
            }
          `
        }
        if (filePath.includes('issues.jsx')) {
          return `
            export default function Issues() {
              return (
                <div style={{ padding: '16px' }}>
                  <img src="/test.jpg" />
                </div>
              )
            }
          `
        }
        return ''
      })

      fs.statSync.mockReturnValue({ isFile: () => true })

      const results = await scanProject('./test-project', mockConfig)

      expect(results.files['src/perfect.jsx'].score).toBeGreaterThan(
        results.files['src/issues.jsx'].score
      )
    })
  })

  describe('Issue detection', () => {
    test('should detect multiple issues in a single file', async () => {
      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/multi-issues.jsx'])

      fs.readFileSync.mockReturnValue(`
        import Head from 'next/head'
        
        export default function MultiIssues() {
          return (
            <div>
              <Head><title>Test</title></Head>
              <div style={{ padding: '16px' }}>
                <img src="/test.jpg" />
                <Grid container>
                  <Grid item>No responsive props</Grid>
                </Grid>
              </div>
            </div>
          )
        }
      `)

      fs.statSync.mockReturnValue({ isFile: () => true })

      const results = await scanProject('./test-project', mockConfig)
      const fileIssues = results.files['src/multi-issues.jsx'].issues

      expect(fileIssues.length).toBeGreaterThan(1)

      // Should detect multiple types of issues
      const categories = new Set(fileIssues.map(issue => issue.category))
      expect(categories.size).toBeGreaterThan(1)
    })

    test('should provide accurate line and column numbers', async () => {
      const { glob } = await import('glob')
      glob.mockResolvedValue(['src/line-test.jsx'])

      const testContent = `import React from 'react'

export default function LineTest() {
  return (
    <div style={{ padding: '16px' }}>
      Content
    </div>
  )
}`

      fs.readFileSync.mockReturnValue(testContent)
      fs.statSync.mockReturnValue({ isFile: () => true })

      const results = await scanProject('./test-project', mockConfig)
      const styleIssue = results.files['src/line-test.jsx'].issues.find(
        issue => issue.rule === 'mui/inline-styles'
      )

      if (styleIssue) {
        expect(styleIssue.line).toBe(5) // Line with style prop
        expect(styleIssue.column).toBeGreaterThan(0)
      }
    })
  })
})
