/**
 * Example Plugin: Performance Optimizer
 *
 * This plugin demonstrates the plugin system capabilities by providing:
 * - Custom rules for performance optimization
 * - File processors for analyzing bundle sizes
 * - Lifecycle hooks for additional checks
 * - Configuration schema
 */

export default {
  name: 'performance-optimizer',
  version: '1.2.0',
  description: 'Advanced performance optimization rules and checks',
  author: 'Audit Toolkit Team',

  // Plugin rules
  rules: [
    {
      id: 'performance-optimizer/large-component-files',
      category: 'performance',
      severity: 'warning',
      message: 'Component file is too large and may impact bundle size',
      suggestion: 'Consider splitting large components into smaller, reusable components',
      shouldCheck: relativePath => {
        return (
          /\.(jsx?|tsx?)$/.test(relativePath) &&
          !relativePath.includes('test') &&
          !relativePath.includes('spec')
        )
      },
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const lineCount = lines.length
        const charCount = content.length

        // Check for large files (>500 lines or >15KB)
        if (lineCount > 500 || charCount > 15000) {
          issues.push({
            rule: 'performance-optimizer/large-component-files',
            category: 'performance',
            severity: 'warning',
            message: `Component file is large: ${lineCount} lines, ${Math.round(charCount / 1024)}KB`,
            line: 1,
            column: 1,
            excerpt: lines[0]?.trim() || '',
            suggestion: 'Consider splitting into smaller components or using code splitting',
            file: filePath,
            exactLocation: `${filePath}:1:1`
          })
        }

        return issues
      }
    },

    {
      id: 'performance-optimizer/inefficient-imports',
      category: 'performance',
      severity: 'warning',
      message: 'Inefficient library import detected',
      suggestion: 'Use specific imports instead of importing entire libraries',
      pattern: /import\s+.*\s+from\s+['"](@mui\/material|lodash|date-fns|@material-ui\/core)['"]/g,
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const inefficientImports = [
          {
            pattern: /import\s+.*\s+from\s+['"]@mui\/material['"]/g,
            message: 'Import specific MUI components instead of the entire library',
            suggestion: 'Use import { Button } from "@mui/material/Button" instead'
          },
          {
            pattern: /import\s+.*\s+from\s+['"]lodash['"]/g,
            message: 'Import specific lodash functions instead of the entire library',
            suggestion: 'Use import debounce from "lodash/debounce" instead'
          },
          {
            pattern: /import\s+.*\s+from\s+['"]date-fns['"]/g,
            message: 'Import specific date-fns functions instead of the entire library',
            suggestion: 'Use import { format } from "date-fns/format" instead'
          }
        ]

        inefficientImports.forEach(({ pattern, message, suggestion }) => {
          let match
          while ((match = pattern.exec(content)) !== null) {
            const location = this.getLocation(content, match.index)
            issues.push({
              rule: 'performance-optimizer/inefficient-imports',
              category: 'performance',
              severity: 'warning',
              message,
              line: location.line,
              column: location.column,
              excerpt: lines[location.line - 1]?.trim() || '',
              suggestion,
              file: filePath,
              exactLocation: `${filePath}:${location.line}:${location.column}`
            })
          }
        })

        return issues
      }
    },

    {
      id: 'performance-optimizer/missing-lazy-loading',
      category: 'performance',
      severity: 'info',
      message: 'Component could benefit from lazy loading',
      suggestion: 'Consider using React.lazy() for components that are not immediately visible',
      shouldCheck: relativePath => {
        return (
          (/\.(jsx?|tsx?)$/.test(relativePath) && relativePath.includes('page')) ||
          relativePath.includes('route')
        )
      },
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Check for route components that aren't lazy loaded
        const hasLazyImport = content.includes('React.lazy') || content.includes('lazy(')
        const hasRouteComponent =
          content.includes('function Page') ||
          content.includes('export default function') ||
          content.includes('const Page =')

        if (hasRouteComponent && !hasLazyImport && lines.length > 50) {
          issues.push({
            rule: 'performance-optimizer/missing-lazy-loading',
            category: 'performance',
            severity: 'info',
            message: 'Large page component could benefit from lazy loading',
            line: 1,
            column: 1,
            excerpt: lines[0]?.trim() || '',
            suggestion: "Wrap component with React.lazy() if it's not critical for initial load",
            file: filePath,
            exactLocation: `${filePath}:1:1`
          })
        }

        return issues
      }
    },

    {
      id: 'performance-optimizer/unoptimized-images',
      category: 'performance',
      severity: 'warning',
      message: 'Unoptimized image usage detected',
      suggestion: 'Use Next.js Image component for automatic optimization',
      pattern: /<img[^>]*src=["'][^"']*\.(jpg|jpeg|png|gif|webp)["'][^>]*>/gi,
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const imgPattern = /<img[^>]*>/gi
        let match

        while ((match = imgPattern.exec(content)) !== null) {
          const imgTag = match[0]
          const hasNextImage = content.includes('next/image') || content.includes('import Image')

          if (!hasNextImage) {
            const location = this.getLocation(content, match.index)
            issues.push({
              rule: 'performance-optimizer/unoptimized-images',
              category: 'performance',
              severity: 'warning',
              message: 'Use Next.js Image component for better performance',
              line: location.line,
              column: location.column,
              excerpt: lines[location.line - 1]?.trim() || '',
              suggestion: 'Replace <img> with <Image> from next/image for automatic optimization',
              file: filePath,
              exactLocation: `${filePath}:${location.line}:${location.column}`
            })
          }
        }

        return issues
      }
    }
  ],

  // File processors
  processors: {
    '.json': (content, filePath) => {
      // Analyze package.json for bundle size insights
      if (filePath.endsWith('package.json')) {
        try {
          const pkg = JSON.parse(content)
          return {
            ...pkg,
            _auditMeta: {
              dependencyCount: Object.keys(pkg.dependencies || {}).length,
              devDependencyCount: Object.keys(pkg.devDependencies || {}).length,
              analyzedAt: new Date().toISOString()
            }
          }
        } catch (error) {
          return content
        }
      }
      return content
    }
  },

  // Lifecycle hooks
  hooks: {
    beforeScan: async context => {
      const { projectPath, config } = context
      console.log(`🚀 Performance Optimizer: Starting scan of ${projectPath}`)

      // Check if project has performance-related dependencies
      const packageJsonPath = `${projectPath}/package.json`
      try {
        const fs = await import('fs')
        const packageContent = fs.readFileSync(packageJsonPath, 'utf8')
        const pkg = JSON.parse(packageContent)

        const performanceDeps = [
          '@next/bundle-analyzer',
          'webpack-bundle-analyzer',
          'lighthouse',
          '@lhci/cli'
        ]

        const hasPerformanceTools = performanceDeps.some(
          dep => pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
        )

        if (!hasPerformanceTools) {
          console.log('💡 Consider adding performance analysis tools to your project')
        }
      } catch (error) {
        // Ignore errors
      }
    },

    afterScan: async results => {
      const performanceIssues = results.summary?.issuesByCategory?.performance || 0
      console.log(`🎯 Performance Optimizer: Found ${performanceIssues} performance issues`)

      if (performanceIssues > 0) {
        console.log('💡 Run `npm run build` to analyze bundle sizes after fixing issues')
      }
    },

    beforeFileProcess: (filePath, content) => {
      // Optional: Log processing of large files
      if (content.length > 50000) {
        console.log(
          `⚠️ Processing large file: ${filePath} (${Math.round(content.length / 1024)}KB)`
        )
      }
    },

    afterFileProcess: (filePath, issues) => {
      // Optional: Track issues per file type
      if (issues.length > 10) {
        console.log(`📊 High issue count in ${filePath}: ${issues.length} issues`)
      }
    },

    beforeGrading: async results => {
      // Add custom performance metrics before grading
      const performanceIssues = Object.values(results.files || {})
        .flat()
        .filter(issue => issue.category === 'performance')

      results._pluginMetrics = {
        ...results._pluginMetrics,
        performanceOptimizer: {
          issueCount: performanceIssues.length,
          severity: this.calculateSeverityScore(performanceIssues)
        }
      }
    },

    afterGrading: async grades => {
      // Provide performance-specific feedback
      const performanceScore = grades.categoryScores?.performance || 0

      if (performanceScore < 70) {
        console.log('🚨 Performance score is low! Consider:')
        console.log('   • Code splitting with React.lazy()')
        console.log('   • Optimizing imports (use specific imports)')
        console.log('   • Using Next.js Image component')
        console.log('   • Analyzing bundle size with next-bundle-analyzer')
      } else if (performanceScore < 85) {
        console.log('⚡ Good performance! Small optimizations could help:')
        console.log('   • Review large component files')
        console.log('   • Consider lazy loading for non-critical components')
      } else {
        console.log('🎉 Excellent performance score!')
      }
    }
  },

  // Configuration schema
  configSchema: {
    performanceOptimizer: {
      enabled: true,
      maxFileSize: 15000, // bytes
      maxLineCount: 500,
      strictMode: false,
      excludePatterns: ['**/test/**', '**/spec/**', '**/*.test.*', '**/*.spec.*']
    }
  },

  // Plugin initialization
  initialize: async function () {
    console.log('🔌 Performance Optimizer plugin initialized')

    // Setup any required services or configurations
    this.metrics = {
      filesAnalyzed: 0,
      issuesFound: 0,
      startTime: Date.now()
    }
  },

  // Helper methods
  getLocation: function (content, index) {
    const lines = content.substring(0, index).split('\\n')
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    }
  },

  calculateSeverityScore: function (issues) {
    return issues.reduce((score, issue) => {
      switch (issue.severity) {
        case 'error':
          return score + 3
        case 'warning':
          return score + 2
        case 'info':
          return score + 1
        default:
          return score
      }
    }, 0)
  }
}
