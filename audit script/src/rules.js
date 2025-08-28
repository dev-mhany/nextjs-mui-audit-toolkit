// Helper function to generate specific complexity suggestions
function generateComplexitySuggestion(complexity, funcContent, filePath) {
  try {
    const suggestions = []

    // Base suggestions based on complexity level
    if (complexity > 20) {
      suggestions.push('🔴 CRITICAL: Function is extremely complex - consider complete refactoring')
    } else if (complexity > 15) {
      suggestions.push('🟠 HIGH: Function needs significant refactoring')
    } else if (complexity > 10) {
      suggestions.push('🟡 MEDIUM: Function should be simplified')
    }

    // Analyze specific patterns and provide targeted suggestions
    if (funcContent && typeof funcContent === 'string') {
      const patterns = {
        if: (funcContent.match(/if/g) || []).length,
        for: (funcContent.match(/for/g) || []).length,
        while: (funcContent.match(/while/g) || []).length,
        switch: (funcContent.match(/switch/g) || []).length,
        catch: (funcContent.match(/catch/g) || []).length,
        logical: (funcContent.match(/&&|\|\|/g) || []).length,
        ternary: (funcContent.match(/\?/g) || []).length
      }

      // Specific suggestions based on detected patterns
      if (patterns.if > 5) {
        suggestions.push('📋 Extract complex if-else chains into separate validation functions')
      }

      if (patterns.for > 2) {
        suggestions.push('🔄 Multiple loops detected - consider combining or extracting loop logic')
      }

      if (patterns.switch > 1) {
        suggestions.push('🔀 Multiple switch statements - use strategy pattern or lookup objects')
      }

      if (patterns.logical > 8) {
        suggestions.push(
          '🔗 Complex boolean logic - extract conditions into readable helper functions'
        )
      }

      if (patterns.catch > 2) {
        suggestions.push('⚠️ Multiple try-catch blocks - consolidate error handling')
      }
    }

    // File-specific suggestions
    if (filePath && typeof filePath === 'string') {
      if (filePath.includes('components/')) {
        suggestions.push('⚛️ React component detected - extract business logic to custom hooks')
        suggestions.push('🎯 Keep components focused on rendering, move logic to utilities')
      }

      if (filePath.includes('utils/') || filePath.includes('helpers/')) {
        suggestions.push(
          '🛠️ Utility function detected - break into smaller, single-purpose functions'
        )
      }

      if (filePath.includes('hooks/')) {
        suggestions.push('🎣 Custom hook detected - split complex logic into multiple hooks')
      }
    }

    // General refactoring suggestions
    suggestions.push('✂️ Break function into smaller functions with single responsibilities')
    suggestions.push('🔄 Use early returns to reduce nesting')
    suggestions.push('📝 Extract complex conditions into well-named boolean functions')
    suggestions.push('🏗️ Consider using the Strategy pattern for complex conditional logic')

    // Performance suggestions for very complex functions
    if (complexity > 15) {
      suggestions.push('⚡ Complex functions may impact performance - consider memoization')
      suggestions.push('🧠 High complexity reduces readability and maintainability')
    }

    return suggestions.join(' | ')
  } catch (error) {
    // Fallback if there's an error
    return 'Break down complex function into smaller, simpler functions'
  }
}

export const rules = [
  // Next.js Architecture Rules
  {
    id: 'next/app-router',
    category: 'nextjs',
    severity: 'warning',
    message: 'Consider using App Router (app/ directory) for new projects',
    pattern: /pages\//,
    suggestion: 'Migrate to App Router for modern Next.js features',
    shouldCheck: filePath => !filePath.includes('app/')
  },
  {
    id: 'next/client-directive',
    category: 'nextjs',
    severity: 'warning',
    message: 'Unnecessary "use client" directive detected',
    pattern: /^[\s]*"use client"/m,
    suggestion: 'Remove "use client" if component doesn\'t need client-side features',
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const clientDirectiveIndex = content.indexOf('"use client"')

      if (clientDirectiveIndex !== -1) {
        // Check if component actually uses client-side features
        const hasState = /\buseState\b|\buseEffect\b|\bonClick\b|\bonChange\b|\bonSubmit\b/.test(
          content
        )
        const hasBrowserAPI = /\bwindow\b|\bdocument\b|\blocalStorage\b|\bsessionStorage\b/.test(
          content
        )

        if (!hasState && !hasBrowserAPI) {
          const lineNumber = content.substring(0, clientDirectiveIndex).split('\n').length
          issues.push({
            rule: 'next/client-directive',
            category: 'nextjs',
            severity: 'warning',
            message: 'Unnecessary "use client" directive',
            line: lineNumber,
            column: 1,
            excerpt: lines[lineNumber - 1]?.trim() || '',
            suggestion:
              'Remove "use client" directive as component doesn\'t use client-side features',
            file: filePath
          })
        }
      }

      return issues
    }
  },
  {
    id: 'next/head-usage',
    category: 'nextjs',
    severity: 'error',
    message: 'Use Metadata API instead of next/head',
    pattern: /import.*Head.*from ['"]next\/head['"]/,
    suggestion: 'Replace with Metadata API: export const metadata = { title: "..." }'
  },
  {
    id: 'next/image-usage',
    category: 'nextjs',
    severity: 'error',
    message: 'Use Next.js Image component instead of img tag',
    pattern: /<img\b(?!.*next\/image)/,
    suggestion: 'Import and use <Image> from next/image for optimization'
  },
  {
    id: 'next/font-usage',
    category: 'nextjs',
    severity: 'warning',
    message: 'Use next/font instead of external font links',
    pattern: /href=["']https:\/\/fonts\.googleapis\.com/,
    suggestion: 'Use next/font/google for Google Fonts optimization'
  },
  {
    id: 'next/router-usage',
    category: 'nextjs',
    severity: 'warning',
    message: 'Use next/navigation instead of next/router',
    pattern: /import.*from ['"]next\/router['"]/,
    suggestion: 'Use useRouter from next/navigation for App Router'
  },

  // MUI Styling Rules
  {
    id: 'mui/inline-styles',
    category: 'mui',
    severity: 'error',
    message: 'Use MUI sx prop instead of inline styles',
    pattern: /style=\{[^}]*\}/,
    suggestion: 'Replace inline styles with sx prop for theme consistency',
    shouldCheck: filePath => filePath.includes('mui') || filePath.includes('@mui')
  },
  {
    id: 'mui/responsive-design',
    category: 'mui',
    severity: 'warning',
    message: 'Grid component without responsive breakpoints',
    pattern: /<Grid[^>]*>(?!.*xs=|.*sm=|.*md=|.*lg=|.*xl=)/,
    suggestion: 'Add responsive props like xs={12} md={6} for mobile-first design'
  },
  {
    id: 'mui/theme-usage',
    category: 'mui',
    severity: 'info',
    message: 'Consider using theme values instead of hardcoded values',
    pattern: /sx=\{[^}]*['"](px|rem|em|%)\d+['"][^}]*\}/,
    suggestion: 'Use theme.spacing(), theme.palette, or theme.typography values'
  },
  {
    id: 'mui/theme-token-enforcement',
    category: 'mui',
    severity: 'warning',
    message: 'Hardcoded colors and spacing detected - use theme tokens instead',
    pattern: /(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|\b\d+(\.\d+)?px\b)/i,
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const linesArray = content.split('\n')

      // Color regex patterns
      const colorPatterns = [
        /#[0-9a-f]{3,8}/gi, // Hex colors
        /rgba?\([\d\s.,%]+\)/gi, // RGB/RGBA colors
        /hsla?\([\d\s.,%]+\)/gi // HSL/HSLA colors
      ]

      // Spacing regex patterns
      const spacingPatterns = [
        /\b(\d+(\.\d+)?)px\b/gi, // Pixel values
        /\b(\d+(\.\d+)?)rem\b/gi, // Rem values
        /\b(\d+(\.\d+)?)em\b/gi // Em values
      ]

      // Check each line for hardcoded values
      linesArray.forEach((line, index) => {
        const lineNumber = index + 1

        // Check for hardcoded colors in sx or style props
        if (line.includes('sx=') || line.includes('style=')) {
          colorPatterns.forEach(pattern => {
            const matches = line.match(pattern)
            if (matches) {
              matches.forEach(match => {
                issues.push({
                  rule: 'mui/theme-token-enforcement',
                  category: 'mui',
                  severity: 'warning',
                  message: `Hardcoded color '${match}' found. Use theme.palette.* token instead.`,
                  line: lineNumber,
                  column: line.indexOf(match) + 1,
                  excerpt: line.trim(),
                  suggestion:
                    'Replace with theme.palette.primary.main, theme.palette.error.main, etc.',
                  file: filePath,
                  exactLocation: `${filePath}:${lineNumber}:${line.indexOf(match) + 1}`
                })
              })
            }
          })

          // Check for hardcoded spacing in sx or style props
          spacingPatterns.forEach(pattern => {
            const matches = line.match(pattern)
            if (matches) {
              matches.forEach(match => {
                // Only flag spacing-related properties
                const spacingProps =
                  /(margin|padding|gap|top|left|right|bottom|width|height|spacing)/i
                if (spacingProps.test(line)) {
                  issues.push({
                    rule: 'mui/theme-token-enforcement',
                    category: 'mui',
                    severity: 'warning',
                    message: `Hardcoded spacing '${match}' found. Use theme.spacing() or sx scale instead.`,
                    line: lineNumber,
                    column: line.indexOf(match) + 1,
                    excerpt: line.trim(),
                    suggestion:
                      'Replace with theme.spacing(2), theme.spacing(3), or sx={{ m: 2, p: 3 }}',
                    file: filePath,
                    exactLocation: `${filePath}:${lineNumber}:${line.indexOf(match) + 1}`
                  })
                }
              })
            }
          })
        }
      })

      return issues
    },
    suggestion:
      'Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() or sx scale'
  },
  {
    id: 'mui/import-guards',
    category: 'mui',
    severity: 'error',
    message: 'Import guards to prevent bundle bloat - use named imports only',
    pattern:
      /import\s+(?:\*|Icons?|_)\s+from\s+["']@mui\/icons-material["']|import\s+_\s+from\s+["']lodash["']/,
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const linesArray = content.split('\n')

      // Check each line for problematic imports
      linesArray.forEach((line, index) => {
        const lineNumber = index + 1
        const trimmedLine = line.trim()

        // Check for MUI icons wildcard/default imports
        if (trimmedLine.includes('@mui/icons-material')) {
          if (
            trimmedLine.includes('import *') ||
            trimmedLine.includes('import Icons') ||
            trimmedLine.includes('import Icon')
          ) {
            issues.push({
              rule: 'mui/import-guards',
              category: 'mui',
              severity: 'error',
              message:
                'Wildcard import from @mui/icons-material detected - this causes bundle bloat',
              line: lineNumber,
              column: 1,
              excerpt: trimmedLine,
              suggestion:
                'Use named imports: import { Add, Edit, Delete } from "@mui/icons-material"',
              file: filePath,
              exactLocation: `${filePath}:${lineNumber}:1`
            })
          }
        }

        // Check for lodash default import
        if (
          trimmedLine.includes('import _ from "lodash"') ||
          trimmedLine.includes("import _ from 'lodash'")
        ) {
          issues.push({
            rule: 'mui/import-guards',
            category: 'mui',
            severity: 'error',
            message: 'Default import from lodash detected - this imports the entire library',
            line: lineNumber,
            column: 1,
            excerpt: trimmedLine,
            suggestion:
              'Use specific imports: import pick from "lodash/pick", import debounce from "lodash/debounce"',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:1`
          })
        }
      })

      return issues
    },
    suggestion:
      'Use named imports for MUI icons and specific imports for lodash functions to reduce bundle size'
  },
  {
    id: 'nextjs/ssr-hydration-sanity',
    category: 'nextjs',
    severity: 'error',
    message:
      'SSR hydration mismatch detected - non-deterministic values in server-rendered components',
    pattern:
      /(Math\.random\(\)|Date\.now\(\)|new Date\(\)|crypto\.randomUUID\(\)|Math\.floor\(Math\.random\(\))/,
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const linesArray = content.split('\n')

      // Check each line for non-deterministic values
      linesArray.forEach((line, index) => {
        const lineNumber = index + 1
        const trimmedLine = line.trim()

        // Skip comments and strings
        if (
          trimmedLine.startsWith('//') ||
          trimmedLine.startsWith('/*') ||
          trimmedLine.startsWith('*') ||
          trimmedLine.includes('console.log') ||
          trimmedLine.includes('console.error')
        ) {
          return
        }

        // Check for Math.random() usage
        if (trimmedLine.includes('Math.random()')) {
          issues.push({
            rule: 'nextjs/ssr-hydration-sanity',
            category: 'nextjs',
            severity: 'error',
            message: 'Math.random() detected - this causes SSR hydration mismatches',
            line: lineNumber,
            column: trimmedLine.indexOf('Math.random()') + 1,
            excerpt: trimmedLine,
            suggestion: 'Use a stable seed or move to useEffect for client-side only rendering',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:${trimmedLine.indexOf('Math.random()') + 1}`
          })
        }

        // Check for Date.now() usage
        if (trimmedLine.includes('Date.now()')) {
          issues.push({
            rule: 'nextjs/ssr-hydration-sanity',
            category: 'nextjs',
            severity: 'error',
            message: 'Date.now() detected - this causes SSR hydration mismatches',
            line: lineNumber,
            column: trimmedLine.indexOf('Date.now()') + 1,
            excerpt: trimmedLine,
            suggestion:
              'Use a stable timestamp or move to useEffect for client-side only rendering',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:${trimmedLine.indexOf('Date.now()') + 1}`
          })
        }

        // Check for new Date() without stable seed
        if (trimmedLine.includes('new Date()') && !trimmedLine.includes('new Date(')) {
          issues.push({
            rule: 'nextjs/ssr-hydration-sanity',
            category: 'nextjs',
            severity: 'error',
            message: 'new Date() detected - this causes SSR hydration mismatches',
            line: lineNumber,
            column: trimmedLine.indexOf('new Date()') + 1,
            excerpt: trimmedLine,
            suggestion:
              'Use a stable timestamp or move to useEffect for client-side only rendering',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:${trimmedLine.indexOf('new Date()') + 1}`
          })
        }

        // Check for crypto.randomUUID() usage
        if (trimmedLine.includes('crypto.randomUUID()')) {
          issues.push({
            rule: 'nextjs/ssr-hydration-sanity',
            category: 'nextjs',
            severity: 'error',
            message: 'crypto.randomUUID() detected - this causes SSR hydration mismatches',
            line: lineNumber,
            column: trimmedLine.indexOf('crypto.randomUUID()') + 1,
            excerpt: trimmedLine,
            suggestion: 'Use a stable ID or move to useEffect for client-side only rendering',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:${trimmedLine.indexOf('crypto.randomUUID()') + 1}`
          })
        }

        // Check for Math.floor(Math.random()) patterns
        if (trimmedLine.includes('Math.floor(Math.random()')) {
          issues.push({
            rule: 'nextjs/ssr-hydration-sanity',
            category: 'nextjs',
            severity: 'error',
            message: 'Math.floor(Math.random()) detected - this causes SSR hydration mismatches',
            line: lineNumber,
            column: trimmedLine.indexOf('Math.floor(Math.random()') + 1,
            excerpt: trimmedLine,
            suggestion: 'Use a stable seed or move to useEffect for client-side only rendering',
            file: filePath,
            exactLocation: `${filePath}:${lineNumber}:${trimmedLine.indexOf('Math.floor(Math.random()') + 1}`
          })
        }
      })

      return issues
    },
    suggestion:
      'Use stable values for SSR or move non-deterministic logic to useEffect for client-side only rendering'
  },
  {
    id: 'mui/component-usage',
    category: 'mui',
    severity: 'warning',
    message: 'Use MUI components instead of HTML elements',
    pattern: /<(button|input|select|textarea)\b(?!.*mui)/,
    suggestion: 'Use MUI Button, TextField, Select components for consistency',
    shouldCheck: filePath => filePath.includes('mui') || filePath.includes('@mui')
  },
  {
    id: 'mui/deprecated-apis',
    category: 'mui',
    severity: 'error',
    message: 'Deprecated MUI v4 styling API detected',
    pattern: /(makeStyles|withStyles|@mui\/styles)/,
    suggestion: 'Use sx prop or styled() API from MUI v5'
  },

  // Accessibility Rules
  {
    id: 'a11y/missing-alt',
    category: 'accessibility',
    severity: 'error',
    message: 'Image missing alt attribute',
    pattern: /<img[^>]*>(?!.*alt=)/,
    suggestion: 'Add alt attribute for screen reader accessibility'
  },
  {
    id: 'a11y/button-label',
    category: 'accessibility',
    severity: 'error',
    message: 'Button missing accessible label',
    pattern: /<button[^>]*>\s*<\/button>/,
    suggestion: 'Add text content or aria-label to button'
  },
  {
    id: 'a11y/form-labels',
    category: 'accessibility',
    severity: 'warning',
    message: 'Form input missing label',
    pattern: /<input[^>]*>(?!.*<label|.*aria-label)/,
    suggestion: 'Add <label> or aria-label for form accessibility'
  },
  {
    id: 'a11y/semantic-html',
    category: 'accessibility',
    severity: 'info',
    message: 'Consider using semantic HTML elements',
    pattern: /<div[^>]*onClick/,
    suggestion: 'Use <button> or add role="button" for clickable divs'
  },

  // Performance Rules
  {
    id: 'perf/client-heavy',
    category: 'performance',
    severity: 'warning',
    message: 'Too many client components may impact performance',
    pattern: /"use client"/g,
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const clientCount = (content.match(/"use client"/g) || []).length

      if (clientCount > 5) {
        issues.push({
          rule: 'perf/client-heavy',
          category: 'performance',
          severity: 'warning',
          message: `File has ${clientCount} client components`,
          line: 1,
          column: 1,
          excerpt: 'Multiple "use client" directives detected',
          suggestion: 'Consider converting some components to Server Components',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'perf/dynamic-imports',
    category: 'performance',
    severity: 'info',
    message: 'Consider using dynamic imports for large components',
    pattern: /import.*from ['"](chart|date|calendar|map|editor)['"]/i,
    suggestion: 'Use next/dynamic for code splitting large libraries'
  },

  // Performance Pragmatics: RSC Boundaries
  {
    id: 'perf/rsc-boundaries',
    category: 'performance',
    severity: 'error',
    message:
      'Server Component importing client-only APIs or using client hooks without "use client"',
    shouldCheck: filePath => !filePath.includes('node_modules'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // If file declares "use client", it is not an RSC file
      const isClientComponent = /^[\s]*"use client"|^[\s]*'use client'/m.test(content)
      if (isClientComponent) return issues

      // Heuristic: this is treated as a Server Component (RSC)
      const forbiddenClientHooks = [/\buseEffect\b/, /\buseLayoutEffect\b/]
      forbiddenClientHooks.forEach(pattern => {
        if (pattern.test(content)) {
          const idx = content.search(pattern)
          const lineNumber = content.substring(0, idx).split('\n').length
          issues.push({
            rule: 'perf/rsc-boundaries',
            category: 'performance',
            severity: 'error',
            message: 'Client hook used inside a Server Component. Add "use client" or refactor.',
            line: lineNumber,
            column: 1,
            excerpt: lines[lineNumber - 1] || '',
            suggestion:
              'Move client-only logic to a Client Component or add "use client" at the top if required',
            file: filePath
          })
        }
      })

      // Disallow window/document/localStorage access in RSC
      const browserGlobals = [
        /\bwindow\b/,
        /\bdocument\b/,
        /\blocalStorage\b/,
        /\bsessionStorage\b/
      ]
      browserGlobals.forEach(pattern => {
        if (pattern.test(content)) {
          const idx = content.search(pattern)
          const lineNumber = content.substring(0, idx).split('\n').length
          issues.push({
            rule: 'perf/rsc-boundaries',
            category: 'performance',
            severity: 'error',
            message:
              'Browser global used in a Server Component. Move to Client Component or dynamic import with ssr: false (last resort).',
            line: lineNumber,
            column: 1,
            excerpt: lines[lineNumber - 1] || '',
            suggestion: 'Isolate browser access behind a client boundary or a server-safe wrapper',
            file: filePath
          })
        }
      })

      // Disallow importing known client-only libraries in RSC
      const forbiddenClientLibs = [
        /from\s+['\"]framer-motion['\"]/,
        /from\s+['\"]react-hot-toast['\"]/,
        /from\s+['\"]react-use['\"]/,
        /from\s+['\"]swiper['\"]/,
        /from\s+['\"]chart\.js['\"]/,
        /from\s+['\"]@mui\/x-date-pickers['\"]/,
        /from\s+['\"]@mui\/x-charts['\"]/
      ]
      forbiddenClientLibs.forEach(pattern => {
        const match = content.match(pattern)
        if (match) {
          const idx = content.indexOf(match[0])
          const lineNumber = content.substring(0, idx).split('\n').length
          issues.push({
            rule: 'perf/rsc-boundaries',
            category: 'performance',
            severity: 'error',
            message:
              'Client-only library imported in a Server Component. Wrap with a client boundary.',
            line: lineNumber,
            column: 1,
            excerpt: lines[lineNumber - 1] || '',
            suggestion:
              'Create a client wrapper component ("use client") or use next/dynamic for the import where appropriate',
            file: filePath
          })
        }
      })

      // Warn about dynamic import with ssr: false as last resort
      const dynamicNoSSR =
        /dynamic\s*\(\s*\(\)\s*=>\s*import\([^)]*\)\s*,\s*\{\s*ssr:\s*false\s*\}\s*\)/
      if (dynamicNoSSR.test(content)) {
        const idx = content.search(dynamicNoSSR)
        const lineNumber = content.substring(0, idx).split('\n').length
        issues.push({
          rule: 'perf/rsc-boundaries',
          category: 'performance',
          severity: 'warning',
          message:
            'dynamic(..., { ssr: false }) used. This should be a last resort; prefer proper client boundaries.',
          line: lineNumber,
          column: 1,
          excerpt: lines[lineNumber - 1] || '',
          suggestion:
            'Prefer splitting by moving client-only parts to a Client Component and keep SSR when possible',
          file: filePath
        })
      }

      return issues
    }
  },

  // Security Rules
  {
    id: 'security/no-secrets',
    category: 'security',
    severity: 'error',
    message: 'Potential secret/credential detected',
    pattern: /(api[_-]?key|secret|password|token)\s*=\s*['"][^'"]{20,}['"]/i,
    suggestion: 'Use environment variables instead of hardcoded secrets'
  },
  {
    id: 'security/dangerous-html',
    category: 'security',
    severity: 'error',
    message: 'dangerouslySetInnerHTML usage detected',
    pattern: /dangerouslySetInnerHTML/,
    suggestion: 'Sanitize HTML content or use React components instead'
  },
  {
    id: 'security/external-links',
    category: 'security',
    severity: 'info',
    message: 'External link missing security attributes',
    pattern: /target=["']_blank["'](?!.*rel=)/,
    suggestion: 'Add rel="noopener noreferrer" for security'
  },

  // Code Quality Rules
  {
    id: 'quality/console-usage',
    category: 'quality',
    severity: 'warning',
    message: 'Console statement in production code',
    pattern: /console\.(log|warn|error|info)/,
    suggestion: 'Remove console statements or use proper logging library'
  },
  // Removed broken "unused imports" rule - it was causing false positives
  // The pattern was too simplistic and didn't actually check usage
  {
    id: 'quality/relative-imports',
    category: 'quality',
    severity: 'info',
    message: 'Deep relative imports detected',
    pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\//,
    suggestion: 'Use absolute imports with path aliases (@/components/...)'
  },

  // Responsive Design Rules
  {
    id: 'responsive/fixed-dimensions',
    category: 'responsive',
    severity: 'warning',
    message: 'Fixed pixel dimensions may cause responsive issues',
    pattern: /width:\s*['"]?\d+px['"]?|height:\s*['"]?\d+px['"]?/,
    suggestion: 'Use relative units (%, rem, vw) or responsive breakpoints'
  },
  {
    id: 'responsive/viewport-meta',
    category: 'responsive',
    severity: 'error',
    message: 'Missing viewport meta tag',
    pattern: /<meta[^>]*viewport[^>]*>/,
    shouldCheck: filePath => filePath.includes('_document') || filePath.includes('layout'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      if (!content.includes('viewport')) {
        issues.push({
          rule: 'responsive/viewport-meta',
          category: 'responsive',
          severity: 'error',
          message: 'Missing viewport meta tag',
          line: 1,
          column: 1,
          excerpt: 'No viewport meta tag found',
          suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
          file: filePath
        })
      }

      return issues
    }
  },

  // SEO Rules
  {
    id: 'seo/meta-tags',
    category: 'seo',
    severity: 'warning',
    message: 'Missing essential meta tags',
    pattern: /<meta[^>]*name=["'](description|keywords|author)["'][^>]*>/,
    shouldCheck: filePath => {
      // Only check _document or layout files for metadata
      // Don't check page.tsx files as they should inherit metadata from layout
      if (filePath.includes('_document')) return true
      if (filePath.includes('layout')) return true

      // Skip page.tsx files - they inherit metadata from layout.tsx
      return false
    },
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const requiredMetaTags = ['description', 'keywords', 'author']

      requiredMetaTags.forEach(tag => {
        if (!content.includes(`name="${tag}"`) && !content.includes(`name='${tag}'`)) {
          issues.push({
            rule: 'seo/meta-tags',
            category: 'seo',
            severity: 'warning',
            message: `Missing meta tag: ${tag}`,
            line: 1,
            column: 1,
            excerpt: `No meta name="${tag}" found`,
            suggestion: `Add <meta name="${tag}" content="Your ${tag} here">`,
            file: filePath
          })
        }
      })

      return issues
    }
  },
  {
    id: 'seo/og-tags',
    category: 'seo',
    severity: 'warning',
    message: 'Missing Open Graph meta tags',
    pattern: /<meta[^>]*property=["']og:/,
    shouldCheck: filePath => {
      // Only check _document or layout files for metadata
      // Don't check page.tsx files as they should inherit metadata from layout
      if (filePath.includes('_document')) return true
      if (filePath.includes('layout')) return true

      // Skip page.tsx files - they inherit metadata from layout.tsx
      return false
    },
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const requiredOGTags = ['og:title', 'og:description', 'og:image', 'og:type']

      requiredOGTags.forEach(tag => {
        if (!content.includes(`property="${tag}"`) && !content.includes(`property='${tag}'`)) {
          issues.push({
            rule: 'seo/og-tags',
            category: 'seo',
            severity: 'warning',
            message: `Missing Open Graph tag: ${tag}`,
            line: 1,
            column: 1,
            excerpt: `No og:${tag.split(':')[1]} found`,
            suggestion: `Add <meta property="${tag}" content="Your ${tag.split(':')[1]} here">`,
            file: filePath
          })
        }
      })

      return issues
    }
  },
  {
    id: 'seo/title-tag',
    category: 'seo',
    severity: 'error',
    message: 'Missing or generic page title',
    pattern: /<title>.*<\/title>/,
    shouldCheck: filePath => {
      // Only check _document or layout files for metadata
      // Don't check page.tsx files as they should inherit metadata from layout
      if (filePath.includes('_document')) return true
      if (filePath.includes('layout')) return true

      // Skip page.tsx files - they inherit metadata from layout.tsx
      return false
    },
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const titleMatch = content.match(/<title>(.*?)<\/title>/)

      if (!titleMatch) {
        issues.push({
          rule: 'seo/title-tag',
          category: 'seo',
          severity: 'error',
          message: 'Missing page title tag',
          line: 1,
          column: 1,
          excerpt: 'No <title> tag found',
          suggestion: 'Add <title>Your Page Title</title>',
          file: filePath
        })
      } else {
        const title = titleMatch[1].trim()
        if (title === 'Next.js' || title === 'React App' || title.length < 10) {
          issues.push({
            rule: 'seo/title-tag',
            category: 'seo',
            severity: 'warning',
            message: 'Generic or too short page title',
            line: content.substring(0, titleMatch.index).split('\n').length,
            column: 1,
            excerpt: `<title>${title}</title>`,
            suggestion: 'Use descriptive, unique titles (50-60 characters)',
            file: filePath
          })
        }
      }

      return issues
    }
  },

  // Image Optimization Rules
  {
    id: 'image/png-icons',
    category: 'image',
    severity: 'warning',
    message: 'PNG icons should be converted to SVG',
    shouldCheck: filePath => !filePath.includes('node_modules'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for both img tags and Next.js Image components with PNG sources
      const pngPatterns = [
        /<img[^>]*src=["']([^"']*\.png)["'][^>]*>/gi,
        /<Image[^>]*src=["']([^"']*\.png)["'][^>]*>/gi,
        /<Image[^>]*src=\{["']([^"']*\.png)["']\}[^>]*>/gi
      ]

      pngPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          const src = match[1]
          const lineNumber = content.substring(0, match.index).split('\n').length

          // Check if it's likely an icon (small dimensions or icon-like filename)
          const isIcon =
            /icon|logo|arrow|check|time|dial|reward|customer|services|vector/i.test(src) ||
            /(16x16|24x24|32x32|48x48)/.test(src)

          // Exclude large car images
          const isLargeImage = /car\d*\.png/i.test(src)

          if (isIcon && !isLargeImage) {
            issues.push({
              rule: 'image/png-icons',
              category: 'image',
              severity: 'warning',
              message: 'PNG icon should be converted to SVG',
              line: lineNumber,
              column:
                content.substring(0, match.index).lastIndexOf('\n') === -1
                  ? match.index + 1
                  : match.index - content.substring(0, match.index).lastIndexOf('\n'),
              excerpt: match[0],
              suggestion: `Convert ${src} to SVG format for better scalability and smaller file size`,
              file: filePath
            })
          }
        }
      })

      return issues
    }
  },
  {
    id: 'image/missing-alt',
    category: 'image',
    severity: 'error',
    message: 'Image missing alt attribute',
    pattern: /<img(?!.*alt=)[^>]*>/i,
    suggestion: 'Add alt attribute for accessibility and SEO'
  },
  {
    id: 'image/next-image',
    category: 'image',
    severity: 'error',
    message: 'Use Next.js Image component instead of img tag',
    pattern: /<img\b(?!.*next\/image)/,
    suggestion: 'Import and use <Image> from next/image for optimization'
  },

  // Testing Rules (More Strict)
  {
    id: 'testing/coverage',
    category: 'testing',
    severity: 'error',
    message: 'Component lacks test coverage',
    shouldCheck: filePath => filePath.includes('components/') || filePath.includes('pages/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const hasTestFile =
        filePath.replace(/\.(tsx|ts|jsx|js)$/, '.test.$1') ||
        filePath.replace(/\.(tsx|ts|jsx|js)$/, '.spec.$1')

      // Check if test file exists in the same directory
      const testPatterns = [/\.test\.(tsx|ts|jsx|js)$/, /\.spec\.(tsx|ts|jsx|js)$/]

      const hasTests = testPatterns.some(pattern => pattern.test(filePath))

      if (!hasTests) {
        issues.push({
          rule: 'testing/coverage',
          category: 'testing',
          severity: 'error',
          message: 'Component lacks test coverage',
          line: 1,
          column: 1,
          excerpt: 'No test file found',
          suggestion: `Create test file: ${filePath.replace(/\.(tsx|ts|jsx|js)$/, '.test.$1')}`,
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'testing/component-testing',
    category: 'testing',
    severity: 'warning',
    message: 'Component should have comprehensive tests',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for common testing patterns
      const hasRenderTest = content.includes('render(') || content.includes('screen.getBy')
      const hasUserInteractionTest =
        content.includes('userEvent.') || content.includes('fireEvent.')
      const hasAccessibilityTest =
        content.includes('toBeInTheDocument') || content.includes('toHaveAttribute')

      if (!hasRenderTest) {
        issues.push({
          rule: 'testing/component-testing',
          category: 'testing',
          severity: 'warning',
          message: 'Component lacks render tests',
          line: 1,
          column: 1,
          excerpt: 'No render tests found',
          suggestion: 'Add render tests using React Testing Library',
          file: filePath
        })
      }

      return issues
    }
  },

  // Code Quality Rules (More Strict)
  {
    id: 'quality/function-complexity',
    category: 'quality',
    severity: 'warning',
    message: 'Function is too complex (high cyclomatic complexity)',
    pattern: /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|const\s+\w+\s*=\s*function/,
    checkFunction: (content, lines, filePath) => {
      const issues = []
      const functions =
        content.match(
          /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|const\s+\w+\s*=\s*function/g
        ) || []

      functions.forEach((func, index) => {
        const funcStart = content.indexOf(func)
        const funcEnd = content.indexOf('}', funcStart)
        const funcContent = content.substring(funcStart, funcEnd)

        // Count complexity indicators
        const complexity = (
          funcContent.match(/if|else|for|while|switch|case|catch|&&|\|\||\?/g) || []
        ).length

        if (complexity > 10) {
          const lineNumber = content.substring(0, funcStart).split('\n').length
          issues.push({
            rule: 'quality/function-complexity',
            category: 'quality',
            severity: 'warning',
            message: `Function has high complexity (${complexity} complexity points)`,
            line: lineNumber,
            column: 1,
            excerpt: func.split('\n')[0],
            suggestion: generateComplexitySuggestion(complexity, funcContent, filePath),
            file: filePath
          })
        }
      })

      return issues
    }
  },
  {
    id: 'quality/file-size',
    category: 'quality',
    severity: 'warning',
    message: 'File is too large',
    shouldCheck: filePath => true,
    checkFunction: (content, lines, filePath) => {
      const issues = []

      if (lines.length > 200) {
        issues.push({
          rule: 'quality/file-size',
          category: 'quality',
          severity: 'warning',
          message: `File is too large (${lines.length} lines)`,
          line: 1,
          column: 1,
          excerpt: `File contains ${lines.length} lines`,
          suggestion: 'Split large file into smaller, focused modules',
          file: filePath
        })
      }

      return issues
    }
  },

  // Performance Rules (More Strict)
  {
    id: 'perf/bundle-size',
    category: 'performance',
    severity: 'warning',
    message: 'Large import detected - consider code splitting',
    pattern: /import.*from ['"](lodash|moment|date-fns|chart\.js|d3|three|framer-motion)['"]/i,
    suggestion: 'Use dynamic imports or tree-shakeable alternatives'
  },
  {
    id: 'perf/expensive-operations',
    category: 'performance',
    severity: 'warning',
    message: 'Expensive operation detected in render',
    pattern: /(map\(|filter\(|reduce\(|sort\(|JSON\.parse|JSON\.stringify)/,
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for expensive operations in render functions
      const expensiveOps =
        content.match(/(map\(|filter\(|reduce\(|sort\(|JSON\.parse|JSON\.stringify)/g) || []

      expensiveOps.forEach((op, index) => {
        const opIndex = content.indexOf(op)
        const lineNumber = content.substring(0, opIndex).split('\n').length

        issues.push({
          rule: 'perf/expensive-operations',
          category: 'performance',
          severity: 'warning',
          message: `Expensive operation detected: ${op}`,
          line: lineNumber,
          column: 1,
          excerpt: lines[lineNumber - 1] || '',
          suggestion: 'Move expensive operations outside render or use useMemo/useCallback',
          file: filePath
        })
      })

      return issues
    }
  },

  // Security Rules (More Strict)
  {
    id: 'security/xss-vulnerability',
    category: 'security',
    severity: 'error',
    message: 'Potential XSS vulnerability detected',
    pattern: /innerHTML|outerHTML|document\.write/,
    suggestion: 'Use textContent or React components instead of innerHTML'
  },
  {
    id: 'security/unsafe-eval',
    category: 'security',
    severity: 'error',
    message: 'Unsafe eval() usage detected',
    pattern: /eval\(|Function\(|setTimeout\(|setInterval\(/,
    suggestion: 'Avoid eval() and use safer alternatives'
  },

  // Accessibility Rules (More Strict)
  {
    id: 'a11y/color-contrast',
    category: 'accessibility',
    severity: 'warning',
    message: 'Hardcoded colors may have insufficient contrast',
    pattern: /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(/,
    shouldCheck: filePath => filePath.includes('components/'),
    suggestion: 'Use theme colors or verify contrast ratios meet WCAG guidelines'
  },
  {
    id: 'a11y/keyboard-navigation',
    category: 'accessibility',
    severity: 'warning',
    message: 'Interactive element missing keyboard support',
    pattern: /onClick(?!.*onKeyDown|.*onKeyUp|.*tabIndex)/,
    suggestion: 'Add keyboard event handlers and tabIndex for accessibility'
  },

  // React Best Practices (More Strict)
  {
    id: 'react/hooks-rules',
    category: 'quality',
    severity: 'error',
    message: 'React hooks rules violation detected',
    pattern: /(use[A-Z][a-zA-Z]*|useState|useEffect|useCallback|useMemo|useRef|useContext)/,
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for hooks at top level
      const hasHooks = /use[A-Z][a-zA-Z]*/.test(content)
      if (hasHooks) {
        const lines = content.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (/^use[A-Z][a-zA-Z]*/.test(line)) {
            // Check if hook is inside conditional or loop
            const beforeHook = content.substring(0, content.indexOf(line))
            const hasConditionalBefore = /(if|for|while|switch|case|else)\s*\{[^}]*$/.test(
              beforeHook
            )
            const hasLoopBefore = /(for|while|do)\s*\([^)]*\)\s*\{[^}]*$/.test(beforeHook)

            if (hasConditionalBefore || hasLoopBefore) {
              issues.push({
                rule: 'react/hooks-rules',
                category: 'quality',
                severity: 'error',
                message: 'Hook called inside conditional or loop',
                line: i + 1,
                column: 1,
                excerpt: line,
                suggestion: 'Move hook to top level of component, outside any conditions or loops',
                file: filePath
              })
            }
          }
        }
      }

      return issues
    }
  },
  {
    id: 'react/component-naming',
    category: 'quality',
    severity: 'warning',
    message: 'Component should follow PascalCase naming convention',
    pattern: /(export\s+)?(default\s+)?(function|const)\s+([a-z][a-zA-Z]*)/,
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for component definitions
      const componentPatterns = [
        /export\s+default\s+(function|const)\s+([a-z][a-zA-Z]*)/g,
        /export\s+(function|const)\s+([a-z][a-zA-Z]*)/g,
        /(function|const)\s+([a-z][a-zA-Z]*)\s*=/g
      ]

      componentPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          const componentName = match[2] || match[1]
          if (/^[a-z]/.test(componentName) && componentName.length > 2) {
            const lineNumber = content.substring(0, match.index).split('\n').length
            issues.push({
              rule: 'react/component-naming',
              category: 'quality',
              severity: 'warning',
              message: `Component '${componentName}' should use PascalCase`,
              line: lineNumber,
              column: 1,
              excerpt: match[0],
              suggestion: `Rename component to '${componentName.charAt(0).toUpperCase() + componentName.slice(1)}'`,
              file: filePath
            })
          }
        }
      })

      return issues
    }
  },
  {
    id: 'react/prop-types',
    category: 'quality',
    severity: 'warning',
    message: 'Component missing prop types or TypeScript interface',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check if it's TypeScript
      const isTypeScript = filePath.endsWith('.tsx') || filePath.endsWith('.ts')

      if (isTypeScript) {
        // Check for interface or type definition
        const hasInterface = /interface\s+\w+Props|type\s+\w+Props/.test(content)
        const hasPropsType = /Props\s*[:=]/.test(content)

        if (!hasInterface && !hasPropsType) {
          issues.push({
            rule: 'react/prop-types',
            category: 'quality',
            severity: 'warning',
            message: 'Component missing Props interface or type definition',
            line: 1,
            column: 1,
            excerpt: 'No Props interface found',
            suggestion: 'Define Props interface or type for component parameters',
            file: filePath
          })
        }
      } else {
        // Check for PropTypes
        const hasPropTypes = /PropTypes|prop-types/.test(content)
        if (!hasPropTypes) {
          issues.push({
            rule: 'react/prop-types',
            category: 'quality',
            severity: 'warning',
            message: 'Component missing PropTypes validation',
            line: 1,
            column: 1,
            excerpt: 'No PropTypes found',
            suggestion: 'Add PropTypes validation or migrate to TypeScript',
            file: filePath
          })
        }
      }

      return issues
    }
  },

  // TypeScript Best Practices (More Strict)
  {
    id: 'typescript/any-usage',
    category: 'quality',
    severity: 'error',
    message: 'Avoid using "any" type - use proper typing',
    pattern: /:\s*any\b|as\s+any\b/,
    shouldCheck: filePath => filePath.endsWith('.ts') || filePath.endsWith('.tsx'),
    suggestion: 'Replace "any" with proper TypeScript types or "unknown" if type is truly unknown'
  },
  {
    id: 'typescript/explicit-returns',
    category: 'quality',
    severity: 'warning',
    message: 'Function should have explicit return type annotation',
    pattern: /(function|const)\s+\w+\s*[=:]\s*(\([^)]*\)|\([^)]*\)\s*=>)/,
    shouldCheck: filePath => filePath.endsWith('.ts') || filePath.endsWith('.tsx'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const functionPatterns = [
        /function\s+(\w+)\s*\([^)]*\)\s*(?!:)/g,
        /const\s+(\w+)\s*[:=]\s*\([^)]*\)\s*=>\s*(?!:)/g
      ]

      functionPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          const funcName = match[1]
          const funcIndex = content.indexOf(match[0])
          const lineNumber = content.substring(0, funcIndex).split('\n').length

          // Skip if it's a simple arrow function or event handler
          const isSimpleFunction = /on[A-Z][a-zA-Z]*|handle[A-Z][a-zA-Z]*/.test(funcName)
          const isEventHandler = /onClick|onChange|onSubmit|onBlur|onFocus/.test(funcName)

          if (!isSimpleFunction && !isEventHandler) {
            issues.push({
              rule: 'typescript/explicit-returns',
              category: 'quality',
              severity: 'warning',
              message: `Function '${funcName}' should have explicit return type`,
              line: lineNumber,
              column: 1,
              excerpt: match[0],
              suggestion: 'Add return type annotation: function funcName(): ReturnType',
              file: filePath
            })
          }
        }
      })

      return issues
    }
  },
  // Removed broken "no-unused-vars" rule - it was causing false positives
  // The pattern was too simplistic and didn't actually check variable usage properly

  // Performance Best Practices (More Strict)
  {
    id: 'perf/memoization',
    category: 'performance',
    severity: 'warning',
    message: 'Component should be memoized to prevent unnecessary re-renders',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check if component is memoized
      const isMemoized = /React\.memo|memo\(/.test(content)
      const hasProps = /props|Props/.test(content)
      const isSimpleComponent = lines.length < 50

      if (hasProps && !isMemoized && !isSimpleComponent) {
        issues.push({
          rule: 'perf/memoization',
          category: 'performance',
          severity: 'warning',
          message: 'Component should be wrapped with React.memo',
          line: 1,
          column: 1,
          excerpt: 'Component with props not memoized',
          suggestion: 'Wrap component with React.memo to prevent unnecessary re-renders',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'perf/dependency-array',
    category: 'performance',
    severity: 'warning',
    message: 'useEffect or useCallback missing dependency array or has incorrect dependencies',
    pattern: /use(Effect|Callback|Memo)\s*\(/g,
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hookPatterns = [
        /useEffect\s*\([^)]*\)\s*=>\s*\{[^}]*\}/g,
        /useCallback\s*\([^)]*\)\s*=>\s*\{[^}]*\}/g,
        /useMemo\s*\([^)]*\)\s*=>\s*\{[^}]*\}/g
      ]

      hookPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          const hookContent = match[0]
          const hasDependencyArray = /,\s*\[.*\]\s*\)/.test(hookContent)

          if (!hasDependencyArray) {
            const lineNumber = content.substring(0, match.index).split('\n').length
            issues.push({
              rule: 'perf/dependency-array',
              category: 'performance',
              severity: 'warning',
              message: 'Hook missing dependency array',
              line: lineNumber,
              column: 1,
              excerpt: hookContent.substring(0, 50) + '...',
              suggestion: 'Add dependency array to prevent infinite re-renders',
              file: filePath
            })
          }
        }
      })

      return issues
    }
  },

  // Security Best Practices (More Strict)
  {
    id: 'security/sql-injection',
    category: 'security',
    severity: 'error',
    message: 'Potential SQL injection vulnerability',
    pattern: /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE)\s+.*\$\{.*\}/i,
    suggestion: 'Use parameterized queries or ORM to prevent SQL injection'
  },
  {
    id: 'security/authentication',
    category: 'security',
    severity: 'error',
    message: 'Missing authentication check for protected routes',
    pattern: /(router\.push|router\.replace|Link|href).*\/admin|\/dashboard|\/profile/i,
    shouldCheck: filePath => filePath.includes('pages/') || filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const protectedRoutes = ['/admin', '/dashboard', '/profile', '/settings', '/users']
      const hasProtectedRoute = protectedRoutes.some(route => content.includes(route))
      const hasAuthCheck = /useAuth|isAuthenticated|checkAuth|requireAuth/.test(content)

      if (hasProtectedRoute && !hasAuthCheck) {
        issues.push({
          rule: 'security/authentication',
          category: 'security',
          severity: 'error',
          message: 'Protected route missing authentication check',
          line: 1,
          column: 1,
          excerpt: 'Route access without authentication',
          suggestion: 'Add authentication check before allowing access to protected routes',
          file: filePath
        })
      }

      return issues
    }
  },

  // Code Organization Best Practices
  {
    id: 'quality/import-order',
    category: 'quality',
    severity: 'info',
    message: 'Imports should be organized by type and alphabetically',
    shouldCheck: filePath => true,
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const importLines = lines.filter(line => line.trim().startsWith('import'))
      if (importLines.length > 3) {
        // Check if imports are grouped by type
        const hasReactImports = importLines.some(line => line.includes('react'))
        const hasExternalImports = importLines.some(
          line => line.includes('@') || line.includes('http')
        )
        const hasInternalImports = importLines.some(
          line => line.includes('./') || line.includes('../')
        )

        if (hasReactImports && hasExternalImports && hasInternalImports) {
          // Check order: React -> External -> Internal
          const reactIndex = importLines.findIndex(line => line.includes('react'))
          const externalIndex = importLines.findIndex(
            line => line.includes('@') || line.includes('http')
          )
          const internalIndex = importLines.findIndex(
            line => line.includes('./') || line.includes('../')
          )

          if (reactIndex > externalIndex || externalIndex > internalIndex) {
            issues.push({
              rule: 'quality/import-order',
              category: 'quality',
              severity: 'info',
              message: 'Imports should be ordered: React -> External -> Internal',
              line: 1,
              column: 1,
              excerpt: 'Import order not following best practices',
              suggestion:
                'Organize imports: React imports first, then external packages, then internal modules',
              file: filePath
            })
          }
        }
      }

      return issues
    }
  },
  {
    id: 'quality/component-structure',
    category: 'quality',
    severity: 'info',
    message: 'Component should follow consistent structure pattern',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for common component structure
      const hasImports = /import.*from/.test(content)
      const hasComponent = /(function|const)\s+\w+/.test(content)
      const hasExport = /export/.test(content)

      if (!hasImports || !hasComponent || !hasExport) {
        issues.push({
          rule: 'quality/component-structure',
          category: 'quality',
          severity: 'info',
          message: 'Component missing standard structure elements',
          line: 1,
          column: 1,
          excerpt: 'Incomplete component structure',
          suggestion:
            'Follow standard component structure: imports -> component definition -> export',
          file: filePath
        })
      }

      return issues
    }
  },

  // Modern Web Development Best Practices
  {
    id: 'modern/error-boundaries',
    category: 'quality',
    severity: 'warning',
    message: 'App should have error boundaries for better error handling',
    shouldCheck: filePath => filePath.includes('layout') || filePath.includes('_app'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasErrorBoundary = /ErrorBoundary|error-boundary|componentDidCatch/.test(content)

      if (!hasErrorBoundary) {
        issues.push({
          rule: 'modern/error-boundaries',
          category: 'quality',
          severity: 'warning',
          message: 'Missing error boundary implementation',
          line: 1,
          column: 1,
          excerpt: 'No error boundary found',
          suggestion: 'Implement error boundaries to gracefully handle component errors',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'modern/suspense-usage',
    category: 'performance',
    severity: 'info',
    message: 'Consider using React Suspense for loading states',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasLoadingState = /loading|Loading|spinner|Spinner/.test(content)
      const hasSuspense = /Suspense|suspense/.test(content)

      if (hasLoadingState && !hasSuspense) {
        issues.push({
          rule: 'modern/suspense-usage',
          category: 'performance',
          severity: 'info',
          message: 'Consider using React Suspense instead of manual loading states',
          line: 1,
          column: 1,
          excerpt: 'Manual loading state detected',
          suggestion: 'Use React Suspense with lazy loading for better loading management',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'modern/context-usage',
    category: 'quality',
    severity: 'warning',
    message: 'Consider using React Context for state management instead of prop drilling',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for deep prop drilling (props passed through multiple levels)
      const hasProps = /props\.\w+/.test(content)
      const hasContext = /useContext|createContext|Context/.test(content)

      if (hasProps && !hasContext && lines.length > 100) {
        issues.push({
          rule: 'modern/context-usage',
          category: 'quality',
          severity: 'warning',
          message: 'Consider using React Context to avoid prop drilling',
          line: 1,
          column: 1,
          excerpt: 'Component with props but no context usage',
          suggestion: 'Use React Context for state that needs to be shared across components',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'modern/custom-hooks',
    category: 'quality',
    severity: 'info',
    message: 'Consider extracting logic into custom hooks',
    shouldCheck: filePath => filePath.includes('components/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check if component has complex logic that could be extracted
      const hasComplexLogic =
        /useState.*useState|useEffect.*useEffect|useCallback.*useCallback/.test(content)
      const hasCustomHooks = /use[A-Z][a-zA-Z]*/.test(content)
      const isLargeComponent = lines.length > 150

      if (hasComplexLogic && !hasCustomHooks && isLargeComponent) {
        issues.push({
          rule: 'modern/custom-hooks',
          category: 'quality',
          severity: 'info',
          message: 'Component has complex logic that could be extracted into custom hooks',
          line: 1,
          column: 1,
          excerpt: 'Complex component logic detected',
          suggestion: 'Extract reusable logic into custom hooks for better reusability and testing',
          file: filePath
        })
      }

      return issues
    }
  },

  // Bundle and Build Best Practices
  {
    id: 'build/tree-shaking',
    category: 'performance',
    severity: 'warning',
    message: 'Import entire library instead of specific functions',
    pattern: /import\s+\*\s+as\s+\w+\s+from\s+['"](lodash|moment|date-fns|ramda)['"]/,
    suggestion: 'Import specific functions to enable tree-shaking and reduce bundle size'
  },
  {
    id: 'build/dynamic-imports',
    category: 'performance',
    severity: 'info',
    message: 'Consider using dynamic imports for route-based code splitting',
    shouldCheck: filePath => filePath.includes('pages/') || filePath.includes('app/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasRoutes = /router\.push|Link|href.*\//.test(content)
      const hasDynamicImports = /import\(|next\/dynamic/.test(content)

      if (hasRoutes && !hasDynamicImports && lines.length > 100) {
        issues.push({
          rule: 'build/dynamic-imports',
          category: 'performance',
          severity: 'info',
          message: 'Consider using dynamic imports for route-based code splitting',
          line: 1,
          column: 1,
          excerpt: 'Routes without dynamic imports',
          suggestion:
            'Use next/dynamic for route-based code splitting to improve initial load time',
          file: filePath
        })
      }

      return issues
    }
  },

  // Accessibility Best Practices (More Strict)
  {
    id: 'a11y/aria-labels',
    category: 'accessibility',
    severity: 'warning',
    message: 'Interactive elements should have proper ARIA labels',
    pattern: /<(button|input|select|textarea|a)\b(?!.*aria-label|.*aria-labelledby|.*title)/,
    shouldCheck: filePath => filePath.includes('components/'),
    suggestion: 'Add aria-label, aria-labelledby, or title attribute for screen readers'
  },
  {
    id: 'a11y/semantic-structure',
    category: 'accessibility',
    severity: 'info',
    message: 'Consider using semantic HTML elements for better accessibility',
    pattern: /<div[^>]*onClick|<span[^>]*onClick/,
    suggestion:
      'Use semantic elements like <button>, <nav>, <main>, <section> for better accessibility'
  },

  // SEO Best Practices (More Strict)
  {
    id: 'seo/structured-data',
    category: 'seo',
    severity: 'info',
    message: 'Consider adding structured data (JSON-LD) for better search engine understanding',
    shouldCheck: filePath => {
      // Only check layout files for structured data
      // Don't check page.tsx files as they should inherit metadata from layout
      if (filePath.includes('layout')) return true

      // Skip page.tsx files - they inherit metadata from layout.tsx
      return false
    },
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasStructuredData = /application\/ld\+json|@context|@type/.test(content)

      if (!hasStructuredData) {
        issues.push({
          rule: 'seo/structured-data',
          category: 'seo',
          severity: 'info',
          message: 'Missing structured data markup',
          line: 1,
          column: 1,
          excerpt: 'No structured data found',
          suggestion: 'Add JSON-LD structured data for better SEO and rich snippets',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'seo/internal-linking',
    category: 'seo',
    severity: 'info',
    message: 'Consider adding internal links for better site structure',
    shouldCheck: filePath => filePath.includes('components/') || filePath.includes('pages/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasInternalLinks = /href=["']\//.test(content)
      const hasNavigation = /nav|navigation|menu/.test(content)

      if (!hasInternalLinks && !hasNavigation && lines.length > 50) {
        issues.push({
          rule: 'seo/internal-linking',
          category: 'seo',
          severity: 'info',
          message: 'Component could benefit from internal linking',
          line: 1,
          column: 1,
          excerpt: 'No internal links found',
          suggestion: 'Add internal links to improve site navigation and SEO',
          file: filePath
        })
      }

      return issues
    }
  },

  // PWA Essentials (Hard Fail Rules)
  {
    id: 'pwa/manifest-exists',
    category: 'pwa',
    severity: 'error',
    message: 'PWA manifest.json is missing - required for PWA functionality',
    shouldCheck: filePath =>
      filePath.includes('layout') || filePath.includes('_document') || filePath.includes('_app'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // This will be checked by the scanner for file existence
      const hasManifestReference = /manifest\.json|rel=["']manifest["']/.test(content)

      if (!hasManifestReference) {
        issues.push({
          rule: 'pwa/manifest-exists',
          category: 'pwa',
          severity: 'error',
          message: 'PWA manifest.json reference missing',
          line: 1,
          column: 1,
          excerpt: 'No manifest.json reference found',
          suggestion: 'Add <link rel="manifest" href="/manifest.json"> to enable PWA functionality',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/manifest-fields',
    category: 'pwa',
    severity: 'error',
    message: 'PWA manifest.json missing required fields',
    shouldCheck: filePath => filePath.includes('manifest.json'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      try {
        const manifest = JSON.parse(content)
        const requiredFields = [
          'name',
          'short_name',
          'start_url',
          'display',
          'theme_color',
          'background_color'
        ]

        requiredFields.forEach(field => {
          if (!manifest[field]) {
            issues.push({
              rule: 'pwa/manifest-fields',
              category: 'pwa',
              severity: 'error',
              message: `PWA manifest missing required field: ${field}`,
              line: 1,
              column: 1,
              excerpt: `Missing ${field} in manifest.json`,
              suggestion: `Add "${field}" field to manifest.json`,
              file: filePath
            })
          }
        })

        // Check specific field requirements
        if (
          manifest.display &&
          !['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)
        ) {
          issues.push({
            rule: 'pwa/manifest-fields',
            category: 'pwa',
            severity: 'error',
            message: 'PWA manifest display should be "standalone", "fullscreen", or "minimal-ui"',
            line: 1,
            column: 1,
            excerpt: `Invalid display: ${manifest.display}`,
            suggestion: 'Set display to "standalone" for best PWA experience',
            file: filePath
          })
        }

        if (manifest.start_url && !manifest.start_url.startsWith('/')) {
          issues.push({
            rule: 'pwa/manifest-fields',
            category: 'pwa',
            severity: 'error',
            message: 'PWA manifest start_url should start with "/"',
            line: 1,
            column: 1,
            excerpt: `Invalid start_url: ${manifest.start_url}`,
            suggestion: 'Set start_url to "/" or "/app"',
            file: filePath
          })
        }

        // Check icons
        if (!manifest.icons || !Array.isArray(manifest.icons)) {
          issues.push({
            rule: 'pwa/manifest-fields',
            category: 'pwa',
            severity: 'error',
            message: 'PWA manifest missing icons array',
            line: 1,
            column: 1,
            excerpt: 'No icons array found',
            suggestion: 'Add icons array with 192x192 and 512x512 sizes',
            file: filePath
          })
        } else {
          const has192 = manifest.icons.some(icon => /192x192/.test(icon.sizes || ''))
          const has512 = manifest.icons.some(icon => /512x512/.test(icon.sizes || ''))
          const hasMaskable = manifest.icons.some(icon => (icon.purpose || '').includes('maskable'))

          if (!has192) {
            issues.push({
              rule: 'pwa/manifest-fields',
              category: 'pwa',
              severity: 'error',
              message: 'PWA manifest missing 192x192 icon',
              line: 1,
              column: 1,
              excerpt: 'No 192x192 icon found',
              suggestion: 'Add 192x192 icon to manifest icons array',
              file: filePath
            })
          }

          if (!has512) {
            issues.push({
              rule: 'pwa/manifest-fields',
              category: 'pwa',
              severity: 'error',
              message: 'PWA manifest missing 512x512 icon',
              line: 1,
              column: 1,
              excerpt: 'No 512x512 icon found',
              suggestion: 'Add 512x512 icon to manifest icons array',
              file: filePath
            })
          }

          if (!hasMaskable) {
            issues.push({
              rule: 'pwa/manifest-fields',
              category: 'pwa',
              severity: 'error',
              message: 'PWA manifest missing maskable icon',
              line: 1,
              column: 1,
              excerpt: 'No maskable icon found',
              suggestion: 'Add icon with purpose: "maskable" for adaptive icons',
              file: filePath
            })
          }
        }
      } catch (error) {
        issues.push({
          rule: 'pwa/manifest-fields',
          category: 'pwa',
          severity: 'error',
          message: 'PWA manifest.json is not valid JSON',
          line: 1,
          column: 1,
          excerpt: 'Invalid JSON in manifest.json',
          suggestion: 'Fix JSON syntax in manifest.json',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/service-worker',
    category: 'pwa',
    severity: 'error',
    message: 'Service Worker not configured for PWA',
    shouldCheck: filePath => filePath.includes('next.config'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasPWAConfig = /next-pwa|withPWA/i.test(content)
      const hasRuntimeCaching = /runtimeCaching/i.test(content)

      if (!hasPWAConfig) {
        issues.push({
          rule: 'pwa/service-worker',
          category: 'pwa',
          severity: 'error',
          message: 'next-pwa not configured in next.config.js',
          line: 1,
          column: 1,
          excerpt: 'No PWA configuration found',
          suggestion: 'Install and configure next-pwa with withPWA() wrapper',
          file: filePath
        })
      }

      if (!hasRuntimeCaching) {
        issues.push({
          rule: 'pwa/service-worker',
          category: 'pwa',
          severity: 'warning',
          message: 'No runtime caching strategy configured',
          line: 1,
          column: 1,
          excerpt: 'No runtimeCaching found',
          suggestion: 'Add runtimeCaching strategies for offline functionality',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/offline-route',
    category: 'pwa',
    severity: 'warning',
    message: 'PWA should have offline route for better user experience',
    shouldCheck: filePath => filePath.includes('app/') || filePath.includes('pages/'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasOfflineRoute = /offline|Offline|OFFLINE/.test(content)

      if (!hasOfflineRoute) {
        issues.push({
          rule: 'pwa/offline-route',
          category: 'pwa',
          severity: 'warning',
          message: 'No offline route detected',
          line: 1,
          column: 1,
          excerpt: 'No offline handling found',
          suggestion: 'Create /offline route and cache it in service worker',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/head-tags',
    category: 'pwa',
    severity: 'error',
    message: 'PWA head tags missing',
    shouldCheck: filePath =>
      filePath.includes('layout') || filePath.includes('_document') || filePath.includes('_app'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasThemeColor = /<meta\s+name=["']theme-color["']/i.test(content)
      const hasManifestLink = /<link\s+rel=["']manifest["']\s+href=["']\/manifest\.json["']/i.test(
        content
      )
      const hasAppleTouchIcon = /<link\s+rel=["']apple-touch-icon["']/i.test(content)
      const hasColorScheme = /<meta\s+name=["']color-scheme["']/i.test(content)

      if (!hasThemeColor) {
        issues.push({
          rule: 'pwa/head-tags',
          category: 'pwa',
          severity: 'error',
          message: 'Missing theme-color meta tag',
          line: 1,
          column: 1,
          excerpt: 'No theme-color meta tag found',
          suggestion: 'Add <meta name="theme-color" content="#your-color">',
          file: filePath
        })
      }

      if (!hasManifestLink) {
        issues.push({
          rule: 'pwa/head-tags',
          category: 'pwa',
          severity: 'error',
          message: 'Missing manifest link tag',
          line: 1,
          column: 1,
          excerpt: 'No manifest link found',
          suggestion: 'Add <link rel="manifest" href="/manifest.json">',
          file: filePath
        })
      }

      if (!hasAppleTouchIcon) {
        issues.push({
          rule: 'pwa/head-tags',
          category: 'pwa',
          severity: 'warning',
          message: 'Missing apple-touch-icon link',
          line: 1,
          column: 1,
          excerpt: 'No apple-touch-icon found',
          suggestion: 'Add <link rel="apple-touch-icon" href="/icon-180x180.png">',
          file: filePath
        })
      }

      if (!hasColorScheme) {
        issues.push({
          rule: 'pwa/head-tags',
          category: 'pwa',
          severity: 'warning',
          message: 'Missing color-scheme meta tag',
          line: 1,
          column: 1,
          excerpt: 'No color-scheme meta tag found',
          suggestion: 'Add <meta name="color-scheme" content="light dark">',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/mixed-content',
    category: 'pwa',
    severity: 'error',
    message: 'Mixed content detected - PWA requires HTTPS',
    pattern: /http:\/\//i,
    shouldCheck: filePath => !filePath.includes('node_modules') && !filePath.includes('.next'),
    suggestion: 'Replace http:// with https:// or relative URLs for PWA compliance'
  },

  // MUI SSR Correctness (Hard Fail Rules)
  {
    id: 'mui/ssr-setup',
    category: 'mui',
    severity: 'error',
    message: 'MUI SSR not properly configured - will cause FOUC and hydration issues',
    shouldCheck: filePath => filePath.includes('_document') || filePath.includes('_app'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasEmotionServer = /createEmotionServer|extractCriticalToChunks/i.test(content)
      const hasCssBaseline = /CssBaseline/i.test(content)
      const hasThemeProvider = /ThemeProvider/i.test(content)

      if (!hasEmotionServer) {
        issues.push({
          rule: 'mui/ssr-setup',
          category: 'mui',
          severity: 'error',
          message: 'MUI Emotion SSR not configured',
          line: 1,
          column: 1,
          excerpt: 'No createEmotionServer found',
          suggestion: 'Set up createEmotionServer and extractCriticalToChunks for SSR',
          file: filePath
        })
      }

      if (!hasCssBaseline) {
        issues.push({
          rule: 'mui/ssr-setup',
          category: 'mui',
          severity: 'error',
          message: 'CssBaseline not injected',
          line: 1,
          column: 1,
          excerpt: 'No CssBaseline found',
          suggestion: 'Add CssBaseline to prevent FOUC and ensure consistent styling',
          file: filePath
        })
      }

      if (!hasThemeProvider) {
        issues.push({
          rule: 'mui/ssr-setup',
          category: 'mui',
          severity: 'error',
          message: 'ThemeProvider not found at app root',
          line: 1,
          column: 1,
          excerpt: 'No ThemeProvider found',
          suggestion: 'Wrap app with ThemeProvider for consistent theming',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'mui/font-strategy',
    category: 'mui',
    severity: 'error',
    message: 'Font strategy not optimized - will cause CLS and performance issues',
    shouldCheck: filePath =>
      filePath.includes('layout') || filePath.includes('_document') || filePath.includes('_app'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasNextFont = /next\/font|localFont/i.test(content)
      const hasGoogleFontsLink = /fonts\.googleapis\.com/i.test(content)
      const hasFontPreload = /rel=["']preload["'].*font/i.test(content)

      if (hasGoogleFontsLink && !hasFontPreload) {
        issues.push({
          rule: 'mui/font-strategy',
          category: 'mui',
          severity: 'error',
          message: 'Google Fonts blocking CSS without preload',
          line: 1,
          column: 1,
          excerpt: 'Google Fonts link without preload',
          suggestion: 'Use next/font or add rel="preload" with display="swap"',
          file: filePath
        })
      }

      if (!hasNextFont && !hasFontPreload) {
        issues.push({
          rule: 'mui/font-strategy',
          category: 'mui',
          severity: 'warning',
          message: 'Font strategy not optimized',
          line: 1,
          column: 1,
          excerpt: 'No optimized font loading found',
          suggestion: 'Use next/font or implement font preloading to prevent CLS',
          file: filePath
        })
      }

      return issues
    }
  },

  // Security Headers (Hard Fail Rules)
  {
    id: 'security/headers-config',
    category: 'security',
    severity: 'error',
    message: 'Security headers not configured - required for production',
    shouldCheck: filePath => filePath.includes('next.config'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasHeadersFunction = /headers\s*:\s*async\s*\(\)|async\s+headers\s*\(\)/i.test(content)

      if (!hasHeadersFunction) {
        issues.push({
          rule: 'security/headers-config',
          category: 'security',
          severity: 'error',
          message: 'Security headers function not configured',
          line: 1,
          column: 1,
          excerpt: 'No headers() function found',
          suggestion: 'Add async headers() function with security headers',
          file: filePath
        })
      } else {
        // Check for required security headers
        const requiredHeaders = [
          'content-security-policy',
          'x-content-type-options',
          'referrer-policy',
          'strict-transport-security'
        ]

        const content = content.toLowerCase()
        requiredHeaders.forEach(header => {
          if (!content.includes(header)) {
            issues.push({
              rule: 'security/headers-config',
              category: 'security',
              severity: 'error',
              message: `Required security header missing: ${header}`,
              line: 1,
              column: 1,
              excerpt: `Missing ${header} header`,
              suggestion: `Add ${header} header to security configuration`,
              file: filePath
            })
          }
        })
      }

      return issues
    }
  },

  // TypeScript Strict Mode (Hard Fail Rules)
  {
    id: 'typescript/strict-mode',
    category: 'typescript',
    severity: 'error',
    message: 'TypeScript not in strict mode - required for production quality',
    shouldCheck: filePath => filePath.includes('tsconfig.json'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      try {
        const config = JSON.parse(content)
        const strict = config.compilerOptions?.strict === true

        if (!strict) {
          issues.push({
            rule: 'typescript/strict-mode',
            category: 'typescript',
            severity: 'error',
            message: 'TypeScript strict mode not enabled',
            line: 1,
            column: 1,
            excerpt: 'strict: false or missing',
            suggestion: 'Set strict: true in tsconfig.json for production quality',
            file: filePath
          })
        }
      } catch (error) {
        issues.push({
          rule: 'typescript/strict-mode',
          category: 'typescript',
          severity: 'error',
          message: 'tsconfig.json is not valid JSON',
          line: 1,
          column: 1,
          excerpt: 'Invalid JSON in tsconfig.json',
          suggestion: 'Fix JSON syntax in tsconfig.json',
          file: filePath
        })
      }

      return issues
    }
  },

  // ESLint Core Web Vitals (Hard Fail Rules)
  {
    id: 'quality/eslint-core-web-vitals',
    category: 'quality',
    severity: 'error',
    message: 'ESLint must extend next/core-web-vitals for production quality',
    shouldCheck: filePath => filePath.includes('.eslintrc') || filePath.includes('eslint.config'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasCoreWebVitals = /next\/core-web-vitals/i.test(content)

      if (!hasCoreWebVitals) {
        issues.push({
          rule: 'quality/eslint-core-web-vitals',
          category: 'quality',
          severity: 'error',
          message: 'ESLint not extending next/core-web-vitals',
          line: 1,
          column: 1,
          excerpt: 'No core-web-vitals extension found',
          suggestion: 'Add "next/core-web-vitals" to ESLint extends array',
          file: filePath
        })
      }

      return issues
    }
  },

  // Accessibility Hard Fail Rules
  {
    id: 'a11y/blank-target-security',
    category: 'accessibility',
    severity: 'error',
    message: 'target="_blank" without rel="noopener" is a security vulnerability',
    pattern: /target=["']_blank["'](?!.*rel=)/i,
    suggestion: 'Add rel="noopener noreferrer" for security when using target="_blank"'
  },
  {
    id: 'a11y/image-alt-required',
    category: 'accessibility',
    severity: 'error',
    message: 'All images must have alt attributes for accessibility compliance',
    pattern: /<img(?!.*alt=)[^>]*>/i,
    suggestion: 'Add alt attribute to all images for screen reader accessibility'
  },
  {
    id: 'a11y/keyboard-interaction',
    category: 'accessibility',
    severity: 'error',
    message: 'Interactive elements must be keyboard accessible',
    pattern: /onClick(?!.*onKeyDown|.*onKeyUp|.*tabIndex|.*role=["']button["'])/i,
    suggestion: 'Add keyboard event handlers or make element keyboard accessible'
  },

  // Public Folder Structure & PWA Assets (New Rule)
  {
    id: 'structure/public-folder-organization',
    category: 'structure',
    severity: 'warning',
    message:
      'Public folder structure should be organized for better maintainability and PWA compliance',
    shouldCheck: filePath => filePath.includes('public/') || filePath.includes('public\\'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // This rule will be handled by the scanner to check actual file structure
      // The scanner will look for proper organization in the public folder
      return issues
    }
  },

  // Advanced PWA Testing Rules
  {
    id: 'pwa/workbox-recipes',
    category: 'pwa',
    severity: 'error',
    message: 'Workbox runtime caching recipes not properly configured',
    shouldCheck: filePath =>
      filePath.includes('next.config') ||
      filePath.includes('sw.js') ||
      filePath.includes('service-worker'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasNetworkFirst = /NetworkFirst/i.test(content)
      const hasCacheFirst = /CacheFirst/i.test(content)
      const hasStaleWhileRevalidate = /StaleWhileRevalidate/i.test(content)
      const hasRuntimeCaching = /runtimeCaching/i.test(content)

      if (!hasRuntimeCaching) {
        issues.push({
          rule: 'pwa/workbox-recipes',
          category: 'pwa',
          severity: 'error',
          message: 'No runtime caching strategy configured',
          line: 1,
          column: 1,
          excerpt: 'No runtimeCaching found',
          suggestion:
            'Configure runtimeCaching with NetworkFirst, CacheFirst, and StaleWhileRevalidate strategies',
          file: filePath
        })
      } else if (!hasNetworkFirst || !hasCacheFirst || !hasStaleWhileRevalidate) {
        issues.push({
          rule: 'pwa/workbox-recipes',
          category: 'pwa',
          severity: 'warning',
          message: 'Incomplete runtime caching strategies',
          line: 1,
          column: 1,
          excerpt: 'Missing some caching strategies',
          suggestion:
            'Implement complete caching: NetworkFirst for pages, CacheFirst for static resources, StaleWhileRevalidate for same-origin',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/navigation-preload',
    category: 'pwa',
    severity: 'warning',
    message: 'Navigation preload not enabled in service worker',
    shouldCheck: filePath =>
      filePath.includes('sw.js') ||
      filePath.includes('service-worker') ||
      filePath.includes('workbox'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasNavigationPreload = /navigationPreload\.enable\(\)/i.test(content)

      if (!hasNavigationPreload) {
        issues.push({
          rule: 'pwa/navigation-preload',
          category: 'pwa',
          severity: 'warning',
          message: 'Navigation preload not enabled',
          line: 1,
          column: 1,
          excerpt: 'No navigationPreload.enable() found',
          suggestion:
            'Enable navigation preload for faster page transitions: registration.navigationPreload.enable()',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/offline-fallback',
    category: 'pwa',
    severity: 'error',
    message: 'Offline fallback route not properly configured',
    shouldCheck: filePath =>
      filePath.includes('next.config') ||
      filePath.includes('sw.js') ||
      filePath.includes('service-worker'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasOfflineFallback = /fallbacks.*document.*offline/i.test(content)

      if (!hasOfflineFallback) {
        issues.push({
          rule: 'pwa/offline-fallback',
          category: 'pwa',
          severity: 'error',
          message: 'Offline fallback route not configured',
          line: 1,
          column: 1,
          excerpt: 'No offline fallback configuration found',
          suggestion: 'Add offline fallback route: fallbacks: { document: "/offline" }',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/notification-prompt',
    category: 'pwa',
    severity: 'warning',
    message: 'Notification permission prompt on first paint detected',
    shouldCheck: filePath =>
      filePath.includes('.js') ||
      filePath.includes('.jsx') ||
      filePath.includes('.ts') ||
      filePath.includes('.tsx'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasNotificationPrompt = /Notification\.requestPermission|permission.*request/i.test(
        content
      )
      const hasUserInteraction = /onClick|onSubmit|onKeyDown|addEventListener.*click/i.test(content)

      if (hasNotificationPrompt && !hasUserInteraction) {
        issues.push({
          rule: 'pwa/notification-prompt',
          category: 'pwa',
          severity: 'warning',
          message: 'Notification prompt without user interaction',
          line: 1,
          column: 1,
          excerpt: 'Notification permission requested without user interaction',
          suggestion: 'Gate notification prompts behind user interaction, not on first paint',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'pwa/maskable-icon',
    category: 'pwa',
    severity: 'warning',
    message: 'Maskable icon validation needed',
    shouldCheck: filePath =>
      filePath.includes('public/') || filePath.includes('icons/') || filePath.includes('manifest'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      const hasMaskableIcon = /maskable.*icon|icon.*maskable/i.test(content)

      if (!hasMaskableIcon) {
        issues.push({
          rule: 'pwa/maskable-icon',
          category: 'pwa',
          severity: 'warning',
          message: 'Maskable icon not configured',
          line: 1,
          column: 1,
          excerpt: 'No maskable icon configuration found',
          suggestion:
            'Add maskable icon support and validate icon composition with centered subject',
          file: filePath
        })
      }

      return issues
    }
  },

  // Advanced Accessibility & i18n Rules
  {
    id: 'a11y/theme-contrast',
    category: 'accessibility',
    severity: 'error',
    message: 'Theme color contrast must meet WCAG AA standards',
    shouldCheck: filePath =>
      filePath.includes('theme') || filePath.includes('palette') || filePath.includes('colors'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for hardcoded colors that might not meet contrast requirements
      const hardcodedColors = content.match(/#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)/gi) || []

      if (hardcodedColors.length > 0) {
        issues.push({
          rule: 'a11y/theme-contrast',
          category: 'accessibility',
          severity: 'warning',
          message: 'Hardcoded colors detected - contrast validation needed',
          line: 1,
          column: 1,
          excerpt: `Hardcoded colors found: ${hardcodedColors.slice(0, 3).join(', ')}`,
          suggestion:
            'Use theme.palette colors and validate contrast ratios meet WCAG AA (4.5:1 for normal text, 3:1 for large text)',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'a11y/keyboard-traps',
    category: 'accessibility',
    severity: 'error',
    message: 'Keyboard navigation must not create focus traps',
    shouldCheck: filePath =>
      filePath.includes('.js') ||
      filePath.includes('.jsx') ||
      filePath.includes('.ts') ||
      filePath.includes('.tsx'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for modal/dialog components that might have keyboard traps
      const hasModal = /modal|dialog|popup/i.test(content)
      const hasEscapeHandler = /onKeyDown.*Escape|onKeyUp.*Escape|keyCode.*27|key.*Escape/i.test(
        content
      )
      const hasTabHandler = /onKeyDown.*Tab|onKeyDown.*Tab|keyCode.*9|key.*Tab/i.test(content)

      if (hasModal && !hasEscapeHandler) {
        issues.push({
          rule: 'a11y/keyboard-traps',
          category: 'accessibility',
          severity: 'error',
          message: 'Modal component missing Escape key handler',
          line: 1,
          column: 1,
          excerpt: 'Modal/dialog detected without Escape key handling',
          suggestion:
            'Add onKeyDown handler for Escape key to close modal: onKeyDown={(e) => e.key === "Escape" && onClose()}',
          file: filePath
        })
      }

      if (hasModal && !hasTabHandler) {
        issues.push({
          rule: 'a11y/keyboard-traps',
          category: 'accessibility',
          severity: 'warning',
          message: 'Modal component should handle Tab key navigation',
          line: 1,
          column: 1,
          excerpt: 'Modal/dialog detected without Tab key handling',
          suggestion: 'Implement proper Tab key navigation within modal to prevent focus traps',
          file: filePath
        })
      }

      return issues
    }
  },
  {
    id: 'i18n/rtl-support',
    category: 'i18n',
    severity: 'warning',
    message: 'RTL (Right-to-Left) support not properly configured',
    shouldCheck: filePath =>
      filePath.includes('theme') ||
      filePath.includes('layout') ||
      filePath.includes('_app') ||
      filePath.includes('_document'),
    checkFunction: (content, lines, filePath) => {
      const issues = []

      // Check for RTL cache configuration
      const hasRtlCache = /createCache.*rtl|rtl.*cache|direction.*rtl/i.test(content)
      const hasRtlPlugin = /rtlPlugin|stylisPlugins.*rtl/i.test(content)
      const hasRtlHtml = /dir.*rtl|direction.*rtl/i.test(content)

      if (!hasRtlCache && !hasRtlPlugin) {
        issues.push({
          rule: 'i18n/rtl-support',
          category: 'i18n',
          severity: 'warning',
          message: 'RTL cache not configured for MUI',
          line: 1,
          column: 1,
          excerpt: 'No RTL cache configuration found',
          suggestion:
            'Add RTL cache: const cacheRtl = createCache({ key: "mui-rtl", stylisPlugins: [rtlPlugin] })',
          file: filePath
        })
      }

      if (!hasRtlHtml) {
        issues.push({
          rule: 'i18n/rtl-support',
          category: 'i18n',
          severity: 'info',
          message: 'Consider adding RTL HTML direction support',
          line: 1,
          column: 1,
          excerpt: 'No RTL HTML direction found',
          suggestion: 'Add <Html dir="rtl"> support for RTL locales',
          file: filePath
        })
      }

      return issues
    }
  }
]
