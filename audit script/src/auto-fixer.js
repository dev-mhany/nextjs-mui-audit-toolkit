import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { logger } from './logger.js'

export class AutoFixer {
  constructor() {
    this.fixers = new Map()
    this.logger = logger.child({ component: 'auto-fixer' })
    this.registerDefaultFixers()
  }

  registerDefaultFixers() {
    // MUI inline styles to sx prop
    this.fixers.set('mui/inline-styles', {
      canFix: true,
      description: 'Convert style prop to sx prop',
      fix: (content, issue) => {
        // Convert style={{...}} to sx={{...}}
        return content.replace(/style=\\{([^}]+)\\}/g, 'sx={$1}')
      }
    })

    // Next.js Image usage
    this.fixers.set('next/image-usage', {
      canFix: true,
      description: 'Replace img tags with Next.js Image component',
      fix: (content, issue) => {
        let fixed = content

        // Add Image import if not present
        const hasImageImport = /import.*Image.*from ['"]next\/image['"]/.test(content)
        if (!hasImageImport) {
          // Find the last import statement
          const importRegex = /import.*from.*['"][^'"]*['"];?/g
          const imports = content.match(importRegex) || []

          if (imports.length > 0) {
            const lastImport = imports[imports.length - 1]
            const lastImportIndex = content.lastIndexOf(lastImport)
            const insertPosition = lastImportIndex + lastImport.length

            fixed =
              content.slice(0, insertPosition) +
              "\nimport Image from 'next/image'" +
              content.slice(insertPosition)
          } else {
            // No imports found, add at the beginning
            fixed = "import Image from 'next/image'\n" + content
          }
        }

        // Replace img tags with Image components
        // This is a simplified version - in production you'd want more sophisticated parsing
        fixed = fixed.replace(/<img\s+([^>]*?)\s*\/?>/g, (match, attributes) => {
          // Add width and height if not present (required by Next.js Image)
          if (!attributes.includes('width=') && !attributes.includes('height=')) {
            attributes += ' width={500} height={300}'
          }
          return `<Image ${attributes} />`
        })

        return fixed
      }
    })

    // Remove unnecessary "use client" directive
    this.fixers.set('next/client-directive', {
      canFix: true,
      description: 'Remove unnecessary "use client" directive',
      fix: (content, issue) => {
        // Remove "use client" from the beginning of the file
        return content.replace(/^[\\s]*['"]use client['"];?\\s*\\n?/m, '')
      }
    })

    // Convert next/head to metadata export
    this.fixers.set('next/head-usage', {
      canFix: false, // This is complex and requires manual intervention
      description: 'Convert next/head usage to Metadata API (requires manual intervention)',
      fix: (content, issue) => {
        // This is too complex for automatic fixing - provide guidance instead
        return content // Return unchanged
      }
    })

    // Add alt attributes to images
    this.fixers.set('a11y/alt-text', {
      canFix: true,
      description: 'Add alt attributes to images',
      fix: (content, issue) => {
        // Add alt="" to img tags that don't have alt attribute
        return content.replace(
          /<(img|Image)([^>]*?)(?<!alt=['"][^'"]*)>/g,
          (match, tag, attributes) => {
            if (!attributes.includes('alt=')) {
              return `<${tag}${attributes} alt="">`
            }
            return match
          }
        )
      }
    })

    // Fix theme token usage
    this.fixers.set('mui/theme-token-enforcement', {
      canFix: true,
      description: 'Convert hardcoded values to theme tokens',
      fix: (content, issue) => {
        let fixed = content

        // Common spacing values
        const spacingMap = {
          '4px': 'theme.spacing(0.5)',
          '8px': 'theme.spacing(1)',
          '16px': 'theme.spacing(2)',
          '24px': 'theme.spacing(3)',
          '32px': 'theme.spacing(4)',
          '40px': 'theme.spacing(5)',
          '48px': 'theme.spacing(6)',
          '56px': 'theme.spacing(7)',
          '64px': 'theme.spacing(8)'
        }

        // Common color values
        const colorMap = {
          '#1976d2': 'theme.palette.primary.main',
          '#dc004e': 'theme.palette.secondary.main',
          '#f44336': 'theme.palette.error.main',
          '#ff9800': 'theme.palette.warning.main',
          '#2196f3': 'theme.palette.info.main',
          '#4caf50': 'theme.palette.success.main'
        }

        // Replace spacing values in sx prop
        Object.entries(spacingMap).forEach(([hardcoded, token]) => {
          const regex = new RegExp(`['"]${hardcoded}['"]`, 'g')
          fixed = fixed.replace(regex, token)
        })

        // Replace color values in sx prop
        Object.entries(colorMap).forEach(([hardcoded, token]) => {
          const regex = new RegExp(`['"]${hardcoded}['"]`, 'g')
          fixed = fixed.replace(regex, token)
        })

        return fixed
      }
    })

    // Grid responsive props
    this.fixers.set('mui/responsive-design', {
      canFix: true,
      description: 'Add responsive props to Grid components',
      fix: (content, issue) => {
        // Add basic responsive props to Grid items that don't have them
        return content.replace(/<Grid\s+item([^>]*?)>/g, (match, attributes) => {
          if (
            !attributes.includes('xs=') &&
            !attributes.includes('sm=') &&
            !attributes.includes('md=') &&
            !attributes.includes('lg=')
          ) {
            return `<Grid item xs={12} md={6}${attributes}>`
          }
          return match
        })
      }
    })
  }

  registerFixer(ruleId, fixer) {
    this.fixers.set(ruleId, fixer)
    this.logger.debug(`Registered fixer for rule: ${ruleId}`)
  }

  canFix(ruleId) {
    const fixer = this.fixers.get(ruleId)
    return fixer && fixer.canFix
  }

  getFixerDescription(ruleId) {
    const fixer = this.fixers.get(ruleId)
    return fixer ? fixer.description : null
  }

  async fixFile(filePath, issues, options = {}) {
    const { dryRun = false, backup = true } = options

    try {
      const originalContent = await readFile(filePath, 'utf8')
      let fixedContent = originalContent
      let appliedFixes = []
      let skippedFixes = []

      // Group issues by rule to avoid conflicts
      const issuesByRule = new Map()
      issues.forEach(issue => {
        if (!issuesByRule.has(issue.rule)) {
          issuesByRule.set(issue.rule, [])
        }
        issuesByRule.get(issue.rule).push(issue)
      })

      // Apply fixes for each rule
      for (const [ruleId, ruleIssues] of issuesByRule) {
        const fixer = this.fixers.get(ruleId)

        if (!fixer || !fixer.canFix) {
          skippedFixes.push(
            ...ruleIssues.map(issue => ({
              rule: ruleId,
              reason: fixer ? 'Manual intervention required' : 'No fixer available',
              issue
            }))
          )
          continue
        }

        try {
          const beforeFix = fixedContent
          fixedContent = fixer.fix(fixedContent, ruleIssues[0], ruleIssues)

          if (beforeFix !== fixedContent) {
            appliedFixes.push(
              ...ruleIssues.map(issue => ({
                rule: ruleId,
                description: fixer.description,
                issue
              }))
            )

            this.logger.debug(`Applied fix for ${ruleId}`, {
              file: filePath,
              issueCount: ruleIssues.length
            })
          }
        } catch (error) {
          this.logger.warn(`Failed to apply fix for ${ruleId}`, error, {
            file: filePath
          })

          skippedFixes.push(
            ...ruleIssues.map(issue => ({
              rule: ruleId,
              reason: `Fix failed: ${error.message}`,
              issue
            }))
          )
        }
      }

      // Write the fixed content if there were changes
      const hasChanges = originalContent !== fixedContent

      if (hasChanges && !dryRun) {
        // Create backup if requested
        if (backup) {
          const backupPath = `${filePath}.backup`
          await writeFile(backupPath, originalContent)
          this.logger.debug(`Created backup: ${backupPath}`)
        }

        await writeFile(filePath, fixedContent)
        this.logger.info(`Fixed file: ${filePath}`, {
          appliedFixes: appliedFixes.length,
          skippedFixes: skippedFixes.length
        })
      }

      return {
        filePath,
        hasChanges,
        appliedFixes,
        skippedFixes,
        originalContent: dryRun ? originalContent : null,
        fixedContent: dryRun ? fixedContent : null
      }
    } catch (error) {
      this.logger.error(`Failed to fix file: ${filePath}`, error)
      throw error
    }
  }

  async fixProject(auditResults, options = {}) {
    const { dryRun = false, backup = true, parallel = false } = options

    this.logger.info('Starting auto-fix process', {
      dryRun,
      backup,
      parallel,
      totalFiles: Object.keys(auditResults.files || {}).length
    })

    const results = {
      totalFiles: 0,
      fixedFiles: 0,
      skippedFiles: 0,
      totalFixes: 0,
      fileResults: []
    }

    const filesToFix = Object.entries(auditResults.files || {}).filter(
      ([_, fileData]) => fileData.issues && fileData.issues.length > 0
    )

    results.totalFiles = filesToFix.length

    if (filesToFix.length === 0) {
      this.logger.info('No files need fixing')
      return results
    }

    const fixFile = async ([filePath, fileData]) => {
      try {
        const fixableIssues = fileData.issues.filter(issue => this.canFix(issue.rule))

        if (fixableIssues.length === 0) {
          results.skippedFiles++
          return {
            filePath,
            skipped: true,
            reason: 'No fixable issues'
          }
        }

        const fileResult = await this.fixFile(filePath, fixableIssues, { dryRun, backup })

        if (fileResult.hasChanges) {
          results.fixedFiles++
          results.totalFixes += fileResult.appliedFixes.length
        } else {
          results.skippedFiles++
        }

        return fileResult
      } catch (error) {
        this.logger.error(`Failed to fix file: ${filePath}`, error)
        results.skippedFiles++
        return {
          filePath,
          error: error.message,
          skipped: true
        }
      }
    }

    // Fix files in parallel or sequential
    if (parallel) {
      const filePromises = filesToFix.map(fixFile)
      results.fileResults = await Promise.all(filePromises)
    } else {
      for (const fileEntry of filesToFix) {
        const fileResult = await fixFile(fileEntry)
        results.fileResults.push(fileResult)

        // Progress reporting
        const progress = results.fileResults.length
        if (progress % 10 === 0) {
          this.logger.debug(`Fixed ${progress}/${filesToFix.length} files`)
        }
      }
    }

    this.logger.success('Auto-fix process completed', {
      totalFiles: results.totalFiles,
      fixedFiles: results.fixedFiles,
      skippedFiles: results.skippedFiles,
      totalFixes: results.totalFixes,
      dryRun
    })

    return results
  }

  generateFixReport(fixResults) {
    let report = '# Auto-Fix Report\\n\\n'

    report += `## Summary\\n\\n`
    report += `- **Total Files Processed:** ${fixResults.totalFiles}\\n`
    report += `- **Files Fixed:** ${fixResults.fixedFiles}\\n`
    report += `- **Files Skipped:** ${fixResults.skippedFiles}\\n`
    report += `- **Total Fixes Applied:** ${fixResults.totalFixes}\\n\\n`

    // Fixed files
    const fixedFiles = fixResults.fileResults.filter(r => r.hasChanges)
    if (fixedFiles.length > 0) {
      report += `## Fixed Files\\n\\n`
      fixedFiles.forEach(file => {
        report += `### ${file.filePath}\\n\\n`

        if (file.appliedFixes.length > 0) {
          report += `**Applied Fixes:**\\n`
          file.appliedFixes.forEach(fix => {
            report += `- ${fix.rule}: ${fix.description}\\n`
          })
          report += '\\n'
        }

        if (file.skippedFixes.length > 0) {
          report += `**Skipped Fixes:**\\n`
          file.skippedFixes.forEach(fix => {
            report += `- ${fix.rule}: ${fix.reason}\\n`
          })
          report += '\\n'
        }
      })
    }

    // Skipped files
    const skippedFiles = fixResults.fileResults.filter(r => r.skipped)
    if (skippedFiles.length > 0) {
      report += `## Skipped Files\\n\\n`
      skippedFiles.forEach(file => {
        report += `- **${file.filePath}**: ${file.reason || file.error || 'Unknown reason'}\\n`
      })
      report += '\\n'
    }

    return report
  }

  getAvailableFixers() {
    const fixers = []

    for (const [ruleId, fixer] of this.fixers) {
      fixers.push({
        ruleId,
        canFix: fixer.canFix,
        description: fixer.description
      })
    }

    return fixers
  }
}

// Singleton instance
export const autoFixer = new AutoFixer()
