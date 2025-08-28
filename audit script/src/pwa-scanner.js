import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function runPWAAudit(projectPath) {
  const results = {
    issues: [],
    summary: {
      totalIssues: 0,
      issuesBySeverity: { error: 0, warning: 0, info: 0 },
      pwaScore: 0
    }
  }

  try {
    // Check for manifest.json
    const manifestPath = join(projectPath, 'public', 'manifest.json')
    if (!existsSync(manifestPath)) {
      results.issues.push({
        rule: 'pwa/manifest-exists',
        category: 'pwa',
        severity: 'error',
        message: 'PWA manifest.json is missing',
        line: 1,
        column: 1,
        excerpt: 'No manifest.json found in public folder',
        suggestion: 'Create manifest.json for PWA functionality',
        file: 'public/manifest.json',
        exactLocation: 'public/manifest.json:1:1'
      })
    } else {
      // Validate manifest.json content
      try {
        const manifestContent = readFileSync(manifestPath, 'utf-8')
        const manifest = JSON.parse(manifestContent)

        // Check required fields
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
            results.issues.push({
              rule: 'pwa/manifest-fields',
              category: 'pwa',
              severity: 'warning',
              message: `Missing required manifest field: ${field}`,
              line: 1,
              column: 1,
              excerpt: `Field '${field}' is missing from manifest.json`,
              suggestion: `Add '${field}' field to manifest.json`,
              file: 'public/manifest.json',
              exactLocation: 'public/manifest.json:1:1'
            })
          }
        })

        // Check for icons
        if (!manifest.icons || manifest.icons.length === 0) {
          results.issues.push({
            rule: 'pwa/manifest-icons',
            category: 'pwa',
            severity: 'warning',
            message: 'PWA icons are missing from manifest',
            line: 1,
            column: 1,
            excerpt: 'No icons defined in manifest.json',
            suggestion: 'Add icons array with 192x192 and 512x512 sizes',
            file: 'public/manifest.json',
            exactLocation: 'public/manifest.json:1:1'
          })
        } else {
          // Check for specific icon sizes
          const has192 = manifest.icons.some(icon => icon.sizes && icon.sizes.includes('192x192'))
          const has512 = manifest.icons.some(icon => icon.sizes && icon.sizes.includes('512x512'))

          if (!has192) {
            results.issues.push({
              rule: 'pwa/manifest-icons',
              category: 'pwa',
              severity: 'info',
              message: 'Consider adding 192x192 icon size',
              line: 1,
              column: 1,
              excerpt: 'No 192x192 icon size found',
              suggestion: 'Add 192x192 icon for better PWA compatibility',
              file: 'public/manifest.json',
              exactLocation: 'public/manifest.json:1:1'
            })
          }

          if (!has512) {
            results.issues.push({
              rule: 'pwa/manifest-icons',
              category: 'pwa',
              severity: 'info',
              message: 'Consider adding 512x512 icon size',
              line: 1,
              column: 1,
              excerpt: 'No 512x512 icon size found',
              suggestion: 'Add 512x512 icon for app store compatibility',
              file: 'public/manifest.json',
              exactLocation: 'public/manifest.json:1:1'
            })
          }
        }
      } catch (parseError) {
        results.issues.push({
          rule: 'pwa/manifest-valid',
          category: 'pwa',
          severity: 'error',
          message: 'Invalid manifest.json format',
          line: 1,
          column: 1,
          excerpt: `JSON parse error: ${parseError.message}`,
          suggestion: 'Fix JSON syntax in manifest.json',
          file: 'public/manifest.json',
          exactLocation: 'public/manifest.json:1:1'
        })
      }
    }

    // Check for service worker
    const swPath = join(projectPath, 'public', 'sw.js')
    const swPathAlt = join(projectPath, 'public', 'service-worker.js')
    if (!existsSync(swPath) && !existsSync(swPathAlt)) {
      results.issues.push({
        rule: 'pwa/service-worker',
        category: 'pwa',
        severity: 'warning',
        message: 'Service worker is missing',
        line: 1,
        column: 1,
        excerpt: 'No service worker found in public folder',
        suggestion: 'Create sw.js or service-worker.js for offline functionality',
        file: 'public/sw.js',
        exactLocation: 'public/sw.js:1:1'
      })
    }

    // Check for PWA head tags in layout.tsx or app/layout.tsx
    const layoutPaths = [
      join(projectPath, 'src', 'app', 'layout.tsx'),
      join(projectPath, 'src', 'app', 'layout.jsx'),
      join(projectPath, 'src', 'app', 'layout.js'),
      join(projectPath, 'src', 'app', 'layout.ts'),
      join(projectPath, 'app', 'layout.tsx'),
      join(projectPath, 'app', 'layout.jsx'),
      join(projectPath, 'app', 'layout.js'),
      join(projectPath, 'app', 'layout.ts')
    ]

    let layoutFound = false
    for (const layoutPath of layoutPaths) {
      if (existsSync(layoutPath)) {
        layoutFound = true
        const layoutContent = readFileSync(layoutPath, 'utf-8')

        // Check for PWA meta tags
        const pwaTags = [
          'apple-mobile-web-app-capable',
          'apple-mobile-web-app-status-bar-style',
          'apple-mobile-web-app-title',
          'mobile-web-app-capable',
          'theme-color',
          'msapplication-TileColor'
        ]

        pwaTags.forEach(tag => {
          if (!layoutContent.includes(tag)) {
            results.issues.push({
              rule: 'pwa/head-tags',
              category: 'pwa',
              severity: 'info',
              message: `PWA meta tag missing: ${tag}`,
              line: 1,
              column: 1,
              excerpt: `Meta tag '${tag}' not found in layout`,
              suggestion: `Add meta tag for ${tag} in layout file`,
              file: layoutPath.replace(projectPath, ''),
              exactLocation: `${layoutPath.replace(projectPath, '')}:1:1`
            })
          }
        })

        // Check for manifest link
        if (!layoutContent.includes('manifest.json')) {
          results.issues.push({
            rule: 'pwa/manifest-link',
            category: 'pwa',
            severity: 'warning',
            message: 'Manifest link is missing from layout',
            line: 1,
            column: 1,
            excerpt: 'No link to manifest.json found in layout',
            suggestion: 'Add <link rel="manifest" href="/manifest.json" /> to layout',
            file: layoutPath.replace(projectPath, ''),
            exactLocation: `${layoutPath.replace(projectPath, '')}:1:1`
          })
        }

        break
      }
    }

    if (!layoutFound) {
      results.issues.push({
        rule: 'pwa/layout-file',
        category: 'pwa',
        severity: 'warning',
        message: 'Layout file not found',
        line: 1,
        column: 1,
        excerpt: 'No layout.tsx/jsx/js found in app directory',
        suggestion: 'Create layout file for PWA meta tags',
        file: 'src/app/layout.tsx',
        exactLocation: 'src/app/layout.tsx:1:1'
      })
    }

    // Check for offline route handling
    const appPaths = [join(projectPath, 'src', 'app'), join(projectPath, 'app')]

    let offlineRouteFound = false
    for (const appPath of appPaths) {
      if (existsSync(appPath)) {
        const offlinePath = join(appPath, 'offline', 'page.tsx')
        if (existsSync(offlinePath)) {
          offlineRouteFound = true
          break
        }
      }
    }

    if (!offlineRouteFound) {
      results.issues.push({
        rule: 'pwa/offline-route',
        category: 'pwa',
        severity: 'info',
        message: 'Offline route is missing',
        line: 1,
        column: 1,
        excerpt: 'No offline page found for PWA',
        suggestion: 'Create app/offline/page.tsx for offline experience',
        file: 'src/app/offline/page.tsx',
        exactLocation: 'src/app/offline/page.tsx:1:1'
      })
    }

    // Calculate PWA score
    const totalChecks = 8 // Total number of PWA checks
    const passedChecks =
      totalChecks - results.issues.filter(issue => issue.severity === 'error').length
    results.summary.pwaScore = Math.round((passedChecks / totalChecks) * 100)

    // Update summary
    results.issues.forEach(issue => {
      results.summary.totalIssues++
      results.summary.issuesBySeverity[issue.severity]++
    })

    return results
  } catch (error) {
    results.issues.push({
      rule: 'pwa/audit-error',
      category: 'pwa',
      severity: 'error',
      message: 'Failed to run PWA audit',
      line: 1,
      column: 1,
      excerpt: `Error: ${error.message}`,
      suggestion: 'Check file permissions and project structure',
      file: 'pwa-audit',
      exactLocation: 'pwa-audit:1:1'
    })
    return results
  }
}
