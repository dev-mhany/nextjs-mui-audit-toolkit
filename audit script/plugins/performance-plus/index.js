// Performance Plus Plugin
// Advanced performance optimization rules

export default {
  name: '@audit-toolkit/performance-plus',
  version: '1.0.0',
  description: 'Advanced performance optimization rules for Next.js + MUI',

  rules: [
    {
      id: 'perf-plus/large-bundle-imports',
      category: 'performance',
      severity: 'warning',
      message: 'Large library imports detected - consider tree shaking',
      pattern: /import\s+.*\s+from\s+['"](@mui\/material|lodash|moment)['"](?!\s*\/)/,
      suggestion: 'Use specific imports like import { Button } from "@mui/material/Button"',
      shouldCheck: filePath =>
        filePath.endsWith('.js') ||
        filePath.endsWith('.jsx') ||
        filePath.endsWith('.ts') ||
        filePath.endsWith('.tsx')
    },

    {
      id: 'perf-plus/unnecessary-rerenders',
      category: 'performance',
      severity: 'warning',
      message: 'Component may cause unnecessary re-renders',
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Check for inline object/array creation in JSX
        const inlineObjectRegex = /\w+\s*=\s*\{[^}]*\}/g
        const inlineArrayRegex = /\w+\s*=\s*\[[^\]]*\]/g

        let match

        // Check for inline objects in props
        while ((match = inlineObjectRegex.exec(content)) !== null) {
          const lineNum = content.substring(0, match.index).split('\n').length
          const line = lines[lineNum - 1]

          // Skip if it's not in JSX (rough check)
          if (line && line.includes('<') && line.includes('>')) {
            issues.push({
              rule: 'perf-plus/unnecessary-rerenders',
              category: 'performance',
              severity: 'warning',
              message: 'Inline object creation in JSX can cause unnecessary re-renders',
              line: lineNum,
              column: match.index - content.lastIndexOf('\n', match.index),
              excerpt: line.trim(),
              suggestion: 'Move object creation outside component or use useMemo',
              file: filePath
            })
          }
        }

        return issues
      }
    },

    {
      id: 'perf-plus/heavy-computations',
      category: 'performance',
      severity: 'error',
      message: 'Heavy computation in component body should be memoized',
      pattern:
        /(?:for\s*\([^)]*\)\s*\{[^}]*\}|while\s*\([^)]*\)\s*\{[^}]*\}|\.map\s*\([^)]*\)\s*\.map|\.filter\s*\([^)]*\)\s*\.filter)/,
      suggestion: 'Use useMemo to memoize expensive calculations',
      shouldCheck: filePath => filePath.includes('component') || filePath.includes('Component')
    },

    {
      id: 'perf-plus/missing-key-props',
      category: 'performance',
      severity: 'error',
      message: 'Missing key prop in list rendering can impact performance',
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Look for .map() followed by JSX without key prop
        const mapJsxRegex = /\.map\s*\([^)]*\)\s*=>\s*<[^>]*(?!.*key\s*=)/g

        let match
        while ((match = mapJsxRegex.exec(content)) !== null) {
          const lineNum = content.substring(0, match.index).split('\n').length

          issues.push({
            rule: 'perf-plus/missing-key-props',
            category: 'performance',
            severity: 'error',
            message: 'Missing key prop in list item',
            line: lineNum,
            column: 1,
            excerpt: lines[lineNum - 1]?.trim() || '',
            suggestion: 'Add unique key prop to list items',
            file: filePath
          })
        }

        return issues
      }
    },

    {
      id: 'perf-plus/unused-imports',
      category: 'performance',
      severity: 'info',
      message: 'Unused imports increase bundle size',
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Extract imports
        const importRegex =
          /import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g
        const imports = []

        let match
        while ((match = importRegex.exec(content)) !== null) {
          const namedImports = match[1]
          const namespaceImport = match[2]
          const defaultImport = match[3]

          if (namedImports) {
            namedImports.split(',').forEach(imp => {
              const name = imp.trim().split(' as ')[0].trim()
              imports.push({ name, line: content.substring(0, match.index).split('\n').length })
            })
          } else if (namespaceImport) {
            imports.push({
              name: namespaceImport,
              line: content.substring(0, match.index).split('\n').length
            })
          } else if (defaultImport) {
            imports.push({
              name: defaultImport,
              line: content.substring(0, match.index).split('\n').length
            })
          }
        }

        // Check if imports are used
        imports.forEach(imp => {
          const usageRegex = new RegExp(`\\b${imp.name}\\b`, 'g')
          const matches = content.match(usageRegex) || []

          // If only one match (the import itself), it's unused
          if (matches.length <= 1) {
            issues.push({
              rule: 'perf-plus/unused-imports',
              category: 'performance',
              severity: 'info',
              message: `Unused import: ${imp.name}`,
              line: imp.line,
              column: 1,
              excerpt: lines[imp.line - 1]?.trim() || '',
              suggestion: `Remove unused import: ${imp.name}`,
              file: filePath
            })
          }
        })

        return issues
      }
    },

    {
      id: 'perf-plus/large-images',
      category: 'performance',
      severity: 'warning',
      message: 'Large image files may impact performance',
      pattern: /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i,
      checkFunction: (content, lines, filePath) => {
        const issues = []

        // Check for image imports or src attributes with large extensions
        const imageRegex = /(import|src\s*=\s*['"])([^'"]*\.(jpg|jpeg|png|gif|webp|bmp|tiff))/gi

        let match
        while ((match = imageRegex.exec(content)) !== null) {
          const imagePath = match[2]
          const lineNum = content.substring(0, match.index).split('\n').length

          // Suggest optimization for common large formats
          if (imagePath.match(/\.(jpg|jpeg|png)$/i)) {
            issues.push({
              rule: 'perf-plus/large-images',
              category: 'performance',
              severity: 'warning',
              message: 'Consider using WebP format for better compression',
              line: lineNum,
              column: 1,
              excerpt: lines[lineNum - 1]?.trim() || '',
              suggestion: 'Use WebP format or implement responsive images with Next.js Image',
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
      console.log('⚡ Performance Plus: Advanced performance scanning enabled')
      return scanOptions
    },

    afterScan: async results => {
      // Calculate performance impact
      const perfIssues = Object.values(results.files).flatMap(file =>
        file.issues.filter(issue => issue.category === 'performance')
      )

      console.log(
        `⚡ Performance Plus: Found ${perfIssues.length} performance optimization opportunities`
      )
      return results
    },

    afterGrading: async grades => {
      // Adjust performance scoring based on advanced rules
      const perfScore = grades.categoryScores.performance || 0
      console.log(`⚡ Performance Plus: Current performance score: ${perfScore}`)
      return grades
    }
  },

  processors: {
    '.js': async (content, filePath) => {
      // Add performance monitoring markers
      if (content.includes('export default function') || content.includes('export default class')) {
        // This is a component, add performance monitoring hints
        return content
      }
      return content
    }
  },

  initialize: async () => {
    console.log('🚀 Performance Plus Plugin initialized')
  }
}
