/**
 * Example Plugin: Accessibility Plus
 *
 * Extended accessibility checks beyond the built-in rules
 */

export default {
  name: 'accessibility-plus',
  version: '1.0.0',
  description: 'Enhanced accessibility checks for React applications',
  author: 'Accessibility Team',

  rules: [
    {
      id: 'a11y-plus/missing-focus-management',
      category: 'accessibility',
      severity: 'warning',
      message: 'Modal or dialog should manage focus properly',
      suggestion: 'Use useEffect to focus the modal and trap focus within it',
      shouldCheck: relativePath => /\.(jsx?|tsx?)$/.test(relativePath),
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Check for modal patterns without focus management
        const hasModal =
          content.includes('Modal') ||
          content.includes('Dialog') ||
          content.includes('role="dialog"')

        if (hasModal) {
          const hasFocusManagement =
            content.includes('useEffect') &&
            (content.includes('focus()') ||
              content.includes('tabIndex') ||
              content.includes('autoFocus'))

          if (!hasFocusManagement) {
            issues.push({
              rule: 'a11y-plus/missing-focus-management',
              category: 'accessibility',
              severity: 'warning',
              message: 'Modal component should manage focus for screen readers',
              line: 1,
              column: 1,
              excerpt: lines[0]?.trim() || '',
              suggestion: 'Add focus management with useEffect and focus trapping',
              file: filePath,
              exactLocation: `${filePath}:1:1`
            })
          }
        }

        return issues
      }
    },

    {
      id: 'a11y-plus/missing-skip-links',
      category: 'accessibility',
      severity: 'info',
      message: 'Page layout should include skip links for keyboard users',
      suggestion: 'Add skip links to main content and navigation',
      shouldCheck: relativePath => {
        return (
          relativePath.includes('layout') ||
          relativePath.includes('page') ||
          relativePath.includes('_app')
        )
      },
      checkFunction: (content, lines, filePath) => {
        const issues = []

        const hasSkipLink =
          content.includes('#main-content') ||
          content.includes('#skip') ||
          content.includes('Skip to')

        const isLayoutFile =
          content.includes('<main') || content.includes('<nav') || content.includes('role="main"')

        if (isLayoutFile && !hasSkipLink) {
          issues.push({
            rule: 'a11y-plus/missing-skip-links',
            category: 'accessibility',
            severity: 'info',
            message: 'Consider adding skip links for better keyboard navigation',
            line: 1,
            column: 1,
            excerpt: lines[0]?.trim() || '',
            suggestion: 'Add <a href="#main-content">Skip to main content</a> at the top',
            file: filePath,
            exactLocation: `${filePath}:1:1`
          })
        }

        return issues
      }
    },

    {
      id: 'a11y-plus/interactive-no-role',
      category: 'accessibility',
      severity: 'warning',
      message: 'Interactive element should have appropriate ARIA role',
      suggestion: 'Add role="button" or similar appropriate role',
      pattern: /<div[^>]*onClick[^>]*>/g,
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const interactivePattern = /<div[^>]*onClick[^>]*>/g
        let match

        while ((match = interactivePattern.exec(content)) !== null) {
          const element = match[0]

          // Check if it has appropriate accessibility attributes
          const hasRole = element.includes('role=')
          const hasTabIndex = element.includes('tabIndex')
          const hasAriaLabel = element.includes('aria-label')

          if (!hasRole && !hasTabIndex) {
            const location = this.getLocation(content, match.index)
            issues.push({
              rule: 'a11y-plus/interactive-no-role',
              category: 'accessibility',
              severity: 'warning',
              message: 'Interactive div should have role and tabIndex for accessibility',
              line: location.line,
              column: location.column,
              excerpt: lines[location.line - 1]?.trim() || '',
              suggestion: 'Add role="button" and tabIndex={0}, or use a proper <button> element',
              file: filePath,
              exactLocation: `${filePath}:${location.line}:${location.column}`
            })
          }
        }

        return issues
      }
    }
  ],

  hooks: {
    afterGrading: async grades => {
      const a11yScore = grades.categoryScores?.accessibility || 0

      if (a11yScore < 80) {
        console.log('♿ Accessibility needs attention:')
        console.log('   • Test with screen readers')
        console.log('   • Ensure keyboard navigation works')
        console.log('   • Check color contrast ratios')
        console.log('   • Add ARIA labels where needed')
      }
    }
  },

  configSchema: {
    accessibilityPlus: {
      enabled: true,
      strictMode: false,
      skipLinkRequired: true
    }
  },

  getLocation: function (content, index) {
    const lines = content.substring(0, index).split('\\n')
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    }
  }
}
