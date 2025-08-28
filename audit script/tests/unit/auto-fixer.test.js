import { describe, it, expect, beforeEach, afterEach } from 'node:test'
import { mkdir, rmdir, writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { AutoFixer } from '../../src/auto-fixer.js'

describe('AutoFixer', () => {
  let autoFixer
  let testDir
  let testFile

  beforeEach(async () => {
    autoFixer = new AutoFixer()
    
    // Create test directory
    testDir = join(process.cwd(), 'test-temp-auto-fixer')
    await mkdir(testDir, { recursive: true })
    testFile = join(testDir, 'test-component.jsx')
  })

  afterEach(async () => {
    // Clean up test directory
    try {
      await rmdir(testDir, { recursive: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('MUI inline styles fixer', () => {
    it('should convert style prop to sx prop', async () => {
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px', margin: '8px' }}>
      <div style={{ color: 'red' }}>Hello</div>
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'mui/inline-styles', line: 6, column: 10 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.appliedFixes[0].rule).toBe('mui/inline-styles')

      const fixedContent = await readFile(testFile, 'utf8')
      expect(fixedContent).toContain('sx={{')
      expect(fixedContent).not.toContain('style={{')
    })
  })

  describe('Next.js Image fixer', () => {
    it('should replace img tags with Next.js Image component', async () => {
      const content = `
import React from 'react';

export default function TestComponent() {
  return (
    <div>
      <img src="/test.jpg" alt="Test" />
      <img src="/another.png" />
    </div>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'next/image-usage', line: 6, column: 6 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      const fixedContent = await readFile(testFile, 'utf8')
      expect(fixedContent).toContain('import Image from \'next/image\'')
      expect(fixedContent).toContain('<Image')
      expect(fixedContent).toContain('width={500} height={300}')
    })
  })

  describe('Alt text fixer', () => {
    it('should add alt attributes to images without them', async () => {
      const content = `
import React from 'react';
import Image from 'next/image';

export default function TestComponent() {
  return (
    <div>
      <img src="/test.jpg" />
      <Image src="/another.png" width={100} height={100} />
    </div>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'a11y/alt-text', line: 7, column: 6 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      const fixedContent = await readFile(testFile, 'utf8')
      expect(fixedContent).toContain('alt=""')
    })
  })

  describe('Theme token enforcement', () => {
    it('should convert hardcoded values to theme tokens', async () => {
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box sx={{ 
      padding: '16px', 
      margin: '8px',
      color: '#1976d2'
    }}>
      Content
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'mui/theme-token-enforcement', line: 7, column: 6 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      const fixedContent = await readFile(testFile, 'utf8')
      expect(fixedContent).toContain('theme.spacing(2)')
      expect(fixedContent).toContain('theme.spacing(1)')
      expect(fixedContent).toContain('theme.palette.primary.main')
    })
  })

  describe('Responsive design fixer', () => {
    it('should add responsive props to Grid components', async () => {
      const content = `
import React from 'react';
import { Grid } from '@mui/material';

export default function TestComponent() {
  return (
    <Grid container>
      <Grid item>
        <div>Item 1</div>
      </Grid>
      <Grid item>
        <div>Item 2</div>
      </Grid>
    </Grid>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'mui/responsive-design', line: 7, column: 6 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      const fixedContent = await readFile(testFile, 'utf8')
      expect(fixedContent).toContain('xs={12} md={6}')
    })
  })

  describe('Dry run mode', () => {
    it('should not modify files in dry run mode', async () => {
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px' }}>
      Content
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'mui/inline-styles', line: 6, column: 10 }
      ]

      const result = await autoFixer.fixFile(testFile, issues, { dryRun: true })

      expect(result.hasChanges).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.fixedContent).toContain('sx={{')

      // File should not be modified
      const fileContent = await readFile(testFile, 'utf8')
      expect(fileContent).toContain('style={{')
      expect(fileContent).not.toContain('sx={{')
    })
  })

  describe('Backup functionality', () => {
    it('should create backup files when backup option is enabled', async () => {
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px' }}>
      Content
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'mui/inline-styles', line: 6, column: 10 }
      ]

      await autoFixer.fixFile(testFile, issues, { backup: true })

      // Check if backup file was created
      const backupFile = testFile + '.backup'
      const backupContent = await readFile(backupFile, 'utf8')
      expect(backupContent).toBe(content)
    })
  })

  describe('Project-level fixes', () => {
    it('should fix multiple files in a project', async () => {
      // Create multiple test files
      const file1 = join(testDir, 'component1.jsx')
      const file2 = join(testDir, 'component2.jsx')

      const content1 = `
import React from 'react';
import { Box } from '@mui/material';

export default function Component1() {
  return <Box style={{ padding: '16px' }}>Content</Box>;
}
`

      const content2 = `
import React from 'react';

export default function Component2() {
  return <img src="/test.jpg" />;
}
`

      await writeFile(file1, content1)
      await writeFile(file2, content2)

      const auditResults = {
        files: {
          [file1]: {
            issues: [{ rule: 'mui/inline-styles', line: 5, column: 18 }]
          },
          [file2]: {
            issues: [
              { rule: 'next/image-usage', line: 4, column: 10 },
              { rule: 'a11y/alt-text', line: 4, column: 10 }
            ]
          }
        }
      }

      const result = await autoFixer.fixProject(auditResults)

      expect(result.totalFiles).toBe(2)
      expect(result.fixedFiles).toBe(2)
      expect(result.totalFixes).toBe(3)

      // Check if files were fixed
      const fixed1 = await readFile(file1, 'utf8')
      const fixed2 = await readFile(file2, 'utf8')

      expect(fixed1).toContain('sx={{')
      expect(fixed2).toContain('import Image from \'next/image\'')
      expect(fixed2).toContain('alt=""')
    })
  })

  describe('Error handling', () => {
    it('should handle missing files gracefully', async () => {
      const nonExistentFile = join(testDir, 'non-existent.jsx')
      const issues = [{ rule: 'mui/inline-styles', line: 1, column: 1 }]

      await expect(autoFixer.fixFile(nonExistentFile, issues)).rejects.toThrow()
    })

    it('should skip unfixable issues', async () => {
      const content = `
import React from 'react';
import Head from 'next/head';

export default function TestComponent() {
  return (
    <>
      <Head>
        <title>Test</title>
      </Head>
      <div>Content</div>
    </>
  );
}
`
      await writeFile(testFile, content)

      const issues = [
        { rule: 'next/head-usage', line: 7, column: 6 }
      ]

      const result = await autoFixer.fixFile(testFile, issues)

      expect(result.hasChanges).toBe(false)
      expect(result.appliedFixes).toHaveLength(0)
      expect(result.skippedFixes).toHaveLength(1)
      expect(result.skippedFixes[0].reason).toContain('Manual intervention required')
    })
  })

  describe('Available fixers', () => {
    it('should return list of available fixers', () => {
      const fixers = autoFixer.getAvailableFixers()

      expect(Array.isArray(fixers)).toBe(true)
      expect(fixers.length).toBeGreaterThan(0)

      const fixerIds = fixers.map(f => f.ruleId)
      expect(fixerIds).toContain('mui/inline-styles')
      expect(fixerIds).toContain('next/image-usage')
      expect(fixerIds).toContain('a11y/alt-text')
      expect(fixerIds).toContain('mui/theme-token-enforcement')
    })

    it('should report which rules can be fixed', () => {
      expect(autoFixer.canFix('mui/inline-styles')).toBe(true)
      expect(autoFixer.canFix('next/image-usage')).toBe(true)
      expect(autoFixer.canFix('next/head-usage')).toBe(false)
      expect(autoFixer.canFix('non-existent-rule')).toBe(false)
    })
  })

  describe('Fix report generation', () => {
    it('should generate a comprehensive fix report', () => {
      const fixResults = {
        totalFiles: 2,
        fixedFiles: 1,
        skippedFiles: 1,
        totalFixes: 3,
        fileResults: [
          {
            filePath: '/test/file1.jsx',
            hasChanges: true,
            appliedFixes: [
              { rule: 'mui/inline-styles', description: 'Convert style prop to sx prop' },
              { rule: 'a11y/alt-text', description: 'Add alt attributes to images' }
            ],
            skippedFixes: []
          },
          {
            filePath: '/test/file2.jsx',
            skipped: true,
            reason: 'No fixable issues'
          }
        ]
      }

      const report = autoFixer.generateFixReport(fixResults)

      expect(report).toContain('# Auto-Fix Report')
      expect(report).toContain('Total Files Processed: 2')
      expect(report).toContain('Files Fixed: 1')
      expect(report).toContain('Total Fixes Applied: 3')
      expect(report).toContain('## Fixed Files')
      expect(report).toContain('## Skipped Files')
      expect(report).toContain('mui/inline-styles: Convert style prop to sx prop')
    })
  })
})