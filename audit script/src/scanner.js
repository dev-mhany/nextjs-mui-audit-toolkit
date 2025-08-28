import { glob } from 'glob'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { rules } from './rules.js'
import { logger, ScanError } from './logger.js'
import { cacheManager } from './cache-manager.js'
import { pluginManager } from './plugin-manager.js'

export async function scanProject(projectPath, config = null) {
  const results = {
    files: {},
    summary: {
      totalFiles: 0,
      totalIssues: 0,
      issuesByCategory: {},
      issuesBySeverity: { error: 0, warning: 0, info: 0 }
    }
  }

  const scanLogger = logger.child({ component: 'scanner', projectPath })

  // Initialize cache
  await cacheManager.initialize()
  const configHash = cacheManager.getConfigHash(config)

  // Load plugins if specified in config
  if (config?.plugins && config.plugins.length > 0) {
    await loadPlugins(config.plugins, scanLogger)
  }

  // Execute beforeScan hooks
  await pluginManager.executeHook('beforeScan', { projectPath, config })

  try {
    // Find all relevant files
    const patterns = config?.include || ['**/*.{js,jsx,ts,tsx}']
    const ignorePatterns = config?.ignore || [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/nextjs-mui-audit-toolkit/**'
    ]

    const files = await glob(patterns, {
      cwd: projectPath,
      absolute: false,
      ignore: ignorePatterns
    })

    results.summary.totalFiles = files.length
    scanLogger.debug(`Found ${files.length} files to scan`)

    // Scan each file
    let processedFiles = 0
    let cacheHits = 0

    for (const filePath of files) {
      try {
        // Check if file should be included/excluded based on config
        if (config && config.shouldIgnore && config.shouldIgnore(filePath)) {
          scanLogger.trace(`Skipping ignored file: ${filePath}`)
          continue
        }
        if (config && config.shouldInclude && !config.shouldInclude(filePath)) {
          scanLogger.trace(`Skipping excluded file: ${filePath}`)
          continue
        }

        const fullPath = join(projectPath, filePath)
        const fileContent = readFileSync(fullPath, 'utf-8')

        // Try to get cached result
        const cacheKey = cacheManager.getCacheKey(filePath, fileContent, configHash)
        const cachedResult = await cacheManager.getCachedResult(cacheKey)

        let fileIssues, fileScore

        if (cachedResult) {
          // Use cached result
          fileIssues = cachedResult.issues
          fileScore = cachedResult.score
          cacheHits++
          scanLogger.trace(`Cache hit for ${filePath}`)
        } else {
          // Scan file and cache result
          fileIssues = scanFile(fileContent, filePath, fullPath, config)
          fileScore = calculateFileScore(fileIssues)

          // Cache the result
          await cacheManager.setCachedResult(
            cacheKey,
            {
              issues: fileIssues,
              score: fileScore
            },
            {
              filePath,
              issueCount: fileIssues.length
            }
          )

          scanLogger.trace(`Scanned and cached ${filePath}`)
        }

        results.files[filePath] = {
          path: filePath,
          issues: fileIssues,
          score: fileScore
        }

        scanLogger.fileProcessed(filePath, fileIssues.length, fileScore)

        // Log rule violations
        fileIssues.forEach(issue => {
          scanLogger.ruleViolation(issue.rule, filePath, issue.line, issue.severity)
        })

        // Update summary
        fileIssues.forEach(issue => {
          results.summary.totalIssues++
          results.summary.issuesBySeverity[issue.severity]++

          if (!results.summary.issuesByCategory[issue.category]) {
            results.summary.issuesByCategory[issue.category] = 0
          }
          results.summary.issuesByCategory[issue.category]++
        })

        processedFiles++

        // Progress logging for large projects
        if (processedFiles % 50 === 0) {
          const cacheStats = cacheManager.getStats()
          scanLogger.debug(`Processed ${processedFiles}/${files.length} files`, {
            cacheHitRate: cacheStats.hitRate
          })
        }
      } catch (error) {
        const scanError = new ScanError(`Failed to scan file: ${error.message}`, filePath, {
          originalError: error.name
        })
        scanLogger.error(`Error scanning file ${filePath}`, scanError)

        // Continue with other files rather than failing completely
        continue
      }
    }

    // Log cache performance
    const cacheStats = cacheManager.getStats()
    scanLogger.info('Scan completed', {
      totalFiles: processedFiles,
      cacheHits,
      cacheHitRate: cacheStats.hitRate,
      totalIssues: results.summary.totalIssues
    })

    // Check public folder structure and PWA assets
    const publicFolderIssues = await checkPublicFolderStructure(projectPath)

    // Add public folder issues to results
    if (publicFolderIssues.length > 0) {
      results.files['public/'] = {
        path: 'public/',
        issues: publicFolderIssues,
        score: calculateFileScore(publicFolderIssues)
      }

      // Update summary with public folder issues
      publicFolderIssues.forEach(issue => {
        results.summary.totalIssues++
        results.summary.issuesBySeverity[issue.severity]++

        if (!results.summary.issuesByCategory[issue.category]) {
          results.summary.issuesByCategory[issue.category] = 0
        }
        results.summary.issuesByCategory[issue.category]++
      })
    }

    // Check next.config.js for PWA configuration
    const nextConfigPath = join(projectPath, 'next.config.js')
    try {
      if (statSync(nextConfigPath).isFile()) {
        const nextConfigContent = readFileSync(nextConfigPath, 'utf-8')
        const nextConfigIssues = checkNextConfigPWA(nextConfigContent, 'next.config.js')

        if (nextConfigIssues.length > 0) {
          results.files['next.config.js'] = {
            path: 'next.config.js',
            issues: nextConfigIssues,
            score: calculateFileScore(nextConfigIssues)
          }

          // Update summary with next.config.js issues
          nextConfigIssues.forEach(issue => {
            results.summary.totalIssues++
            results.summary.issuesBySeverity[issue.severity]++

            if (!results.summary.issuesByCategory[issue.category]) {
              results.summary.issuesByCategory[issue.category] = 0
            }
            results.summary.issuesByCategory[issue.category]++
          })
        }
      }
    } catch (error) {
      // next.config.js doesn't exist or can't be read
    }

    // Execute afterScan hooks
    await pluginManager.executeHook('afterScan', results)

    return results
  } catch (error) {
    const scanError = new ScanError(`Failed to scan project: ${error.message}`, null, {
      projectPath,
      originalError: error.name
    })
    scanLogger.error('Project scan failed', scanError)
    throw scanError
  }
}

function scanFile(content, relativePath, absolutePath, config = null) {
  const issues = []
  const lines = content.split('\n')

  // Get file extension for plugin processors
  const extension = relativePath.substring(relativePath.lastIndexOf('.'))

  // Process file with plugins if available
  try {
    const processedContent = pluginManager.processFile
      ? pluginManager.processFile(relativePath, content, extension)
      : content

    // Ensure content remains a string
    if (typeof processedContent === 'string') {
      content = processedContent
    } else {
      logger.warn(`Plugin returned non-string content for ${relativePath}, using original content`)
    }
  } catch (error) {
    // Continue with original content if processing fails
    logger.warn(`Plugin processing failed for ${relativePath}: ${error.message}`)
  }

  // Execute beforeFileProcess hooks
  pluginManager.executeHook('beforeFileProcess', relativePath, content)

  // Combine built-in rules with plugin rules
  const allRules = [...rules, ...pluginManager.getAllRules()]

  // Check each rule
  for (const rule of allRules) {
    // Skip rule if disabled in config
    if (config && config.isRuleEnabled && !config.isRuleEnabled(rule.id)) {
      continue
    }

    if (rule.shouldCheck && !rule.shouldCheck(relativePath, absolutePath)) {
      continue
    }

    const ruleIssues = checkRule(rule, content, lines, relativePath, config)
    issues.push(...ruleIssues)
  }

  // Execute afterFileProcess hooks
  pluginManager.executeHook('afterFileProcess', relativePath, issues)

  return issues
}

function checkRule(rule, content, lines, filePath, config = null) {
  const issues = []

  // Ensure content is a string before processing
  if (typeof content !== 'string') {
    logger.warn(`Content is not a string for ${filePath}, skipping rule ${rule.id}`)
    return issues
  }

  if (rule.pattern) {
    // Ensure pattern is global for matchAll
    const globalPattern = rule.pattern.global
      ? rule.pattern
      : new RegExp(rule.pattern.source, rule.pattern.flags + 'g')
    const matches = content.matchAll(globalPattern)
    for (const match of matches) {
      const location = getExactLocation(content, match.index)
      const lineContent = lines[location.line - 1] || ''

      const configuredSeverity =
        config && config.getRuleSeverity
          ? config.getRuleSeverity(rule.id, rule.severity)
          : rule.severity

      if (configuredSeverity === 'off') {
        continue
      }

      issues.push({
        rule: rule.id,
        category: rule.category,
        severity: configuredSeverity,
        message: rule.message,
        line: location.line,
        column: location.column,
        excerpt: lineContent.trim(),
        suggestion: rule.suggestion || '',
        file: filePath,
        exactLocation: `${filePath}:${location.line}:${location.column}`,
        options: config && config.getRuleOptions ? config.getRuleOptions(rule.id) : {}
      })
    }
  }

  if (rule.checkFunction) {
    const customIssues = rule.checkFunction(content, lines, filePath)
    issues.push(...customIssues)
  }

  return issues
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length
}

function getColumnNumber(content, index) {
  const beforeIndex = content.substring(0, index)
  const lastNewline = beforeIndex.lastIndexOf('\n')
  return lastNewline === -1 ? index + 1 : index - lastNewline
}

function getExactLocation(content, index) {
  const beforeIndex = content.substring(0, index)
  const lines = beforeIndex.split('\n')
  const lineNumber = lines.length
  const columnNumber = lines[lines.length - 1].length + 1

  return { line: lineNumber, column: columnNumber }
}

function calculateFileScore(issues) {
  let score = 100

  for (const issue of issues) {
    switch (issue.severity) {
      case 'error':
        score -= 15 // More strict - errors cost more points
        break
      case 'warning':
        score -= 8 // More strict - warnings cost more points
        break
      case 'info':
        score -= 3 // More strict - info items cost more points
        break
    }
  }

  return Math.max(0, score)
}

// Plugin loading helper
async function loadPlugins(plugins, logger) {
  for (const plugin of plugins) {
    try {
      if (typeof plugin === 'string') {
        // Load plugin by name/path
        if (plugin.startsWith('./') || plugin.startsWith('../')) {
          // Local plugin
          await pluginManager.loadPluginFromFile(plugin)
        } else if (plugin.startsWith('@') || plugin.includes('/')) {
          // NPM plugin
          await pluginManager.loadPluginFromNpm(plugin)
        } else {
          // Try to load from plugins directory
          await pluginManager.loadPluginsFromDirectory('./plugins')
        }
      } else if (typeof plugin === 'object') {
        // Plugin object
        await pluginManager.registerPlugin(plugin.name || 'anonymous', plugin)
      }
    } catch (error) {
      logger.warn(`Failed to load plugin: ${plugin}`, error)
    }
  }
}

// Check public folder structure and PWA assets
async function checkPublicFolderStructure(projectPath) {
  const issues = []

  try {
    const { readdirSync, existsSync, statSync } = await import('fs')
    const { join } = await import('path')

    const publicPath = join(projectPath, 'public')

    if (!existsSync(publicPath)) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'error',
        message: 'Public folder is missing',
        line: 1,
        column: 1,
        excerpt: 'No public folder found',
        suggestion: 'Create a public folder for static assets',
        file: 'public/',
        exactLocation: 'public/:1:1'
      })
      return issues
    }

    const publicContents = readdirSync(publicPath)

    // Check for manifest.json
    if (!publicContents.includes('manifest.json')) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'warning',
        message: 'PWA manifest.json is missing',
        line: 1,
        column: 1,
        excerpt: 'No manifest.json found in public folder',
        suggestion: 'Create manifest.json for PWA functionality',
        file: 'public/manifest.json',
        exactLocation: 'public/manifest.json:1:1'
      })
    }

    // Check for sitemap
    const hasSitemap = publicContents.some(
      file => file.includes('sitemap') || file.includes('sitemap.xml')
    )
    if (!hasSitemap) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'info',
        message: 'Sitemap is missing',
        line: 1,
        column: 1,
        excerpt: 'No sitemap found in public folder',
        suggestion: 'Create sitemap.xml for better SEO',
        file: 'public/sitemap.xml',
        exactLocation: 'public/sitemap.xml:1:1'
      })
    }

    // Check for organized folder structure
    const hasIconsFolder = publicContents.some(item => {
      const itemPath = join(publicPath, item)
      return (
        statSync(itemPath).isDirectory() &&
        (item === 'icons' || item === 'images' || item === 'assets')
      )
    })

    if (!hasIconsFolder) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'info',
        message: 'Consider organizing images into dedicated folders',
        line: 1,
        column: 1,
        excerpt: 'Images are not organized in dedicated folders',
        suggestion: 'Create icons/, images/, or assets/ folders for better organization',
        file: 'public/',
        exactLocation: 'public/:1:1'
      })
    }

    // Check for PWA icons
    const pwaIcons = publicContents.filter(file => {
      const isIcon = /icon|logo|favicon/i.test(file)
      const hasPWAExtension = /\.(png|jpg|jpeg|svg|ico)$/i.test(file)
      return isIcon && hasPWAExtension
    })

    if (pwaIcons.length === 0) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'warning',
        message: 'PWA icons are missing',
        line: 1,
        column: 1,
        excerpt: 'No PWA icons found in public folder',
        suggestion: 'Add PWA icons (192x192, 512x512) for app store compatibility',
        file: 'public/',
        exactLocation: 'public/:1:1'
      })
    } else {
      // Check for specific PWA icon sizes
      const has192 = pwaIcons.some(icon => /192|180|144/i.test(icon))
      const has512 = pwaIcons.some(icon => /512|512x512/i.test(icon))

      if (!has192) {
        issues.push({
          rule: 'structure/public-folder-organization',
          category: 'structure',
          severity: 'info',
          message: 'Consider adding 192x192 PWA icon',
          line: 1,
          column: 1,
          excerpt: 'No 192x192 icon found',
          suggestion: 'Add 192x192 icon for better PWA compatibility',
          file: 'public/',
          exactLocation: 'public/:1:1'
        })
      }

      if (!has512) {
        issues.push({
          rule: 'structure/public-folder-organization',
          category: 'structure',
          severity: 'info',
          message: 'Consider adding 512x512 PWA icon',
          line: 1,
          column: 1,
          excerpt: 'No 512x512 icon found',
          suggestion: 'Add 512x512 icon for better PWA compatibility',
          file: 'public/',
          exactLocation: 'public/:1:1'
        })
      }

      // Check for maskable icon naming convention
      const maskableIcons = pwaIcons.filter(icon => /maskable|512/i.test(icon))
      if (maskableIcons.length === 0) {
        issues.push({
          rule: 'pwa/maskable-icon',
          category: 'pwa',
          severity: 'warning',
          message: 'Maskable icon not found',
          line: 1,
          column: 1,
          excerpt: 'No maskable icon found in public folder',
          suggestion: 'Add a 512x512 maskable icon with proper naming (e.g., maskable-512.png)',
          file: 'public/',
          exactLocation: 'public/:1:1'
        })
      } else {
        // Check if maskable icons follow naming convention
        const hasProperNaming = maskableIcons.some(icon =>
          /maskable.*512|512.*maskable/i.test(icon)
        )
        if (!hasProperNaming) {
          issues.push({
            rule: 'pwa/maskable-icon',
            category: 'pwa',
            severity: 'info',
            message: 'Maskable icon naming could be improved',
            line: 1,
            column: 1,
            excerpt: `Maskable icons found: ${maskableIcons.join(', ')}`,
            suggestion:
              'Consider renaming to follow convention: maskable-512.png for better clarity',
            file: 'public/',
            exactLocation: 'public/:1:1'
          })
        }
      }
    }

    // Check for large images that should be in dedicated folders
    const largeImages = publicContents.filter(file => {
      const filePath = join(publicPath, file)
      if (statSync(filePath).isFile()) {
        const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file)
        const isLargeImage = /car|banner|hero|background/i.test(file)
        return isImage && isLargeImage
      }
      return false
    })

    if (largeImages.length > 0) {
      issues.push({
        rule: 'structure/public-folder-organization',
        category: 'structure',
        severity: 'info',
        message: 'Large images should be organized in dedicated folders',
        line: 1,
        column: 1,
        excerpt: `Large images found: ${largeImages.join(', ')}`,
        suggestion: 'Move large images to images/ or assets/ folder for better organization',
        file: 'public/',
        exactLocation: 'public/:1:1'
      })
    }
  } catch (error) {
    issues.push({
      rule: 'structure/public-folder-organization',
      category: 'structure',
      severity: 'error',
      message: 'Failed to check public folder structure',
      line: 1,
      column: 1,
      excerpt: `Error: ${error.message}`,
      suggestion: 'Check file permissions and folder structure',
      file: 'public/',
      exactLocation: 'public/:1:1'
    })
  }

  return issues
}

function checkNextConfigPWA(content, filePath) {
  const issues = []

  // Check for PWA configuration
  const hasPWAConfig = /next-pwa|withPWA/i.test(content)
  if (!hasPWAConfig) {
    issues.push({
      rule: 'pwa/workbox-recipes',
      category: 'pwa',
      severity: 'error',
      message: 'PWA configuration not found in next.config.js',
      line: 1,
      column: 1,
      excerpt: 'No next-pwa or withPWA configuration found',
      suggestion:
        'Add PWA configuration with next-pwa package and proper runtime caching strategies',
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
    return issues
  }

  // Check for runtime caching configuration
  const hasRuntimeCaching = /runtimeCaching/i.test(content)
  if (!hasRuntimeCaching) {
    issues.push({
      rule: 'pwa/workbox-recipes',
      category: 'pwa',
      severity: 'error',
      message: 'Runtime caching not configured in PWA setup',
      line: 1,
      column: 1,
      excerpt: 'No runtimeCaching configuration found',
      suggestion:
        'Add runtimeCaching with NetworkFirst, CacheFirst, and StaleWhileRevalidate strategies',
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
    return issues
  }

  // Check for specific caching strategies
  const hasNetworkFirst = /NetworkFirst/i.test(content)
  const hasCacheFirst = /CacheFirst/i.test(content)
  const hasStaleWhileRevalidate = /StaleWhileRevalidate/i.test(content)

  if (!hasNetworkFirst) {
    issues.push({
      rule: 'pwa/workbox-recipes',
      category: 'pwa',
      severity: 'warning',
      message: 'NetworkFirst caching strategy not configured',
      line: 1,
      column: 1,
      excerpt: 'No NetworkFirst strategy found',
      suggestion: 'Add NetworkFirst strategy for navigation requests (pages)',
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
  }

  if (!hasCacheFirst) {
    issues.push({
      rule: 'pwa/workbox-recipes',
      category: 'pwa',
      severity: 'warning',
      message: 'CacheFirst caching strategy not configured',
      line: 1,
      column: 1,
      excerpt: 'No CacheFirst strategy found',
      suggestion: 'Add CacheFirst strategy for static resources',
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
  }

  if (!hasStaleWhileRevalidate) {
    issues.push({
      rule: 'pwa/workbox-recipes',
      category: 'pwa',
      severity: 'warning',
      message: 'StaleWhileRevalidate caching strategy not configured',
      line: 1,
      column: 1,
      excerpt: 'No StaleWhileRevalidate strategy found',
      suggestion: 'Add StaleWhileRevalidate strategy for same-origin requests',
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
  }

  // Check for offline fallback configuration
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
      file: filePath,
      exactLocation: `${filePath}:1:1`
    })
  }

  return issues
}
