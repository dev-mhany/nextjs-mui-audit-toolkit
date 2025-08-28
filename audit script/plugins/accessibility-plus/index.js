// Accessibility Plus Plugin
// Provides enhanced accessibility rules beyond the core set

export default {
  name: '@audit-toolkit/accessibility-plus',
  version: '1.0.0',
  description: 'Enhanced accessibility rules for Next.js + MUI',

  rules: [
    {
      id: 'a11y-plus/focus-management',
      category: 'accessibility',
      severity: 'error',
      message: 'Interactive elements must have proper focus management',
      pattern: /<(button|a|input|select|textarea)[^>]*(?!.*tabIndex)/i,
      suggestion: 'Add tabIndex attribute or ensure proper focus order',
      shouldCheck: filePath => filePath.includes('.jsx') || filePath.includes('.tsx')
    },

    {
      id: 'a11y-plus/semantic-landmarks',
      category: 'accessibility',
      severity: 'warning',
      message: 'Page should use semantic landmark elements',
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Check for semantic elements
        const hasMain = /<main[\s>]/.test(content)
        const hasNav = /<nav[\s>]/.test(content)
        const hasHeader = /<header[\s>]/.test(content)
        const hasFooter = /<footer[\s>]/.test(content)

        // If it's a page component, it should have landmarks
        if (filePath.includes('pages/') || filePath.includes('app/')) {
          if (!hasMain) {
            issues.push({
              rule: 'a11y-plus/semantic-landmarks',
              category: 'accessibility',
              severity: 'warning',
              message: 'Page should include a <main> landmark',
              line: 1,
              column: 1,
              excerpt: '',
              suggestion: 'Wrap main content in <main> element',
              file: filePath
            })
          }
        }

        return issues
      }
    },

    {
      id: 'a11y-plus/color-contrast',
      category: 'accessibility',
      severity: 'warning',
      message: 'Avoid hardcoded colors that may have poor contrast',
      pattern: /(color|backgroundColor):\s*['"]#[0-9a-fA-F]{3,6}['"]/,
      suggestion: 'Use theme colors that ensure proper contrast ratios',
      shouldCheck: filePath => filePath.includes('.jsx') || filePath.includes('.tsx')
    },

    {
      id: 'a11y-plus/aria-labels',
      category: 'accessibility',
      severity: 'error',
      message: 'Interactive elements without text content must have aria-label',
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Find buttons and links without text content
        const buttonRegex = /<button[^>]*>(\s*<[^>]*>\s*)*\s*<\/button>/gi
        const linkRegex = /<a[^>]*>(\s*<[^>]*>\s*)*\s*<\/a>/gi

        let match

        // Check buttons
        while ((match = buttonRegex.exec(content)) !== null) {
          const buttonContent = match[0]
          const hasAriaLabel = /aria-label\s*=/.test(buttonContent)
          const hasText = />[^<]*\w+[^<]*</.test(buttonContent)

          if (!hasAriaLabel && !hasText) {
            const lineNum = content.substring(0, match.index).split('\n').length
            issues.push({
              rule: 'a11y-plus/aria-labels',
              category: 'accessibility',
              severity: 'error',
              message: 'Button without text content must have aria-label',
              line: lineNum,
              column: 1,
              excerpt: lines[lineNum - 1]?.trim() || '',
              suggestion: 'Add aria-label="descriptive text" to the button',
              file: filePath
            })
          }
        }

        return issues
      }
    },

    {
      id: 'a11y-plus/heading-hierarchy',
      category: 'accessibility',
      severity: 'warning',
      message: 'Heading hierarchy should be logical (no skipped levels)',
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const headingRegex = /<h([1-6])[^>]*>/gi
        const headings = []

        let match
        while ((match = headingRegex.exec(content)) !== null) {
          const level = parseInt(match[1])
          const lineNum = content.substring(0, match.index).split('\n').length
          headings.push({ level, line: lineNum })
        }

        // Check for skipped levels
        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1]
          const curr = headings[i]

          if (curr.level > prev.level + 1) {
            issues.push({
              rule: 'a11y-plus/heading-hierarchy',
              category: 'accessibility',
              severity: 'warning',
              message: `Heading level h${curr.level} skips levels (previous was h${prev.level})`,
              line: curr.line,
              column: 1,
              excerpt: lines[curr.line - 1]?.trim() || '',
              suggestion: `Use h${prev.level + 1} instead of h${curr.level} to maintain hierarchy`,
              file: filePath
            })
          }
        }

        return issues
      }
    }
  ],

  hooks: {
    beforeScan: async scanOptions => {
      console.log('🔍 Accessibility Plus: Enhanced accessibility scanning enabled')
      return scanOptions
    },

    afterScan: async results => {
      // Add accessibility score calculation
      const a11yIssues = Object.values(results.files).flatMap(file =>
        file.issues.filter(issue => issue.category === 'accessibility')
      )

      console.log(`🔍 Accessibility Plus: Found ${a11yIssues.length} accessibility issues`)
      return results
    }
  },

  processors: {
    '.tsx': async (content, filePath) => {
      // Custom TypeScript processing for accessibility
      // Add any custom preprocessing here
      return content
    }
  },

  initialize: async () => {
    console.log('🚀 Accessibility Plus Plugin initialized')
  }
}
