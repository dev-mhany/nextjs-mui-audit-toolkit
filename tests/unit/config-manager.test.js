import { test, expect, describe, beforeEach, jest } from '@jest/globals'
import { ConfigManager } from '../src/config-manager.js'
import fs from 'fs/promises'

// Mock fs
jest.mock('fs/promises')

describe('ConfigManager', () => {
  let configManager

  beforeEach(() => {
    configManager = new ConfigManager()
    jest.clearAllMocks()
  })

  describe('Default Configuration', () => {
    test('should have valid default configuration', () => {
      const config = configManager.config

      expect(config).toHaveProperty('rules')
      expect(config).toHaveProperty('categories')
      expect(config).toHaveProperty('thresholds')
      expect(config).toHaveProperty('ignore')
      expect(config).toHaveProperty('include')
      expect(config).toHaveProperty('output')
    })

    test('should have category weights that sum to 100', () => {
      const totalWeight = Object.values(configManager.config.categories).reduce(
        (sum, cat) => sum + cat.weight,
        0
      )

      expect(totalWeight).toBe(100)
    })

    test('should have valid default thresholds', () => {
      const thresholds = configManager.config.thresholds

      expect(thresholds.minScore).toBeGreaterThanOrEqual(0)
      expect(thresholds.minScore).toBeLessThanOrEqual(100)
      expect(typeof thresholds.failOnCritical).toBe('boolean')
    })
  })

  describe('Configuration Loading', () => {
    test('should load and merge user configuration', async () => {
      const userConfig = {
        rules: {
          'mui/inline-styles': 'error'
        },
        thresholds: {
          minScore: 90
        }
      }

      // Mock successful config file read
      fs.access.mockResolvedValue()

      // Mock dynamic import
      const originalImport = global.import
      global.import = jest.fn().mockResolvedValue({ default: userConfig })

      const config = await configManager.loadConfig('./test-config.js')

      expect(config.rules['mui/inline-styles']).toBe('error')
      expect(config.thresholds.minScore).toBe(90)

      // Should still have default values for unspecified options
      expect(config.ignore).toBeDefined()
      expect(config.categories).toBeDefined()

      global.import = originalImport
    })

    test('should handle missing config file gracefully', async () => {
      fs.access.mockRejectedValue(new Error('File not found'))

      const config = await configManager.loadConfig('./non-existent-config.js')

      // Should return default config
      expect(config).toEqual(configManager.defaultConfig)
    })

    test('should auto-detect config files', async () => {
      const userConfig = { thresholds: { minScore: 95 } }

      // Mock file system access
      fs.access
        .mockRejectedValueOnce(new Error('audit.config.js not found'))
        .mockRejectedValueOnce(new Error('audit.config.mjs not found'))
        .mockResolvedValueOnce() // .auditrc.js found

      const originalImport = global.import
      global.import = jest.fn().mockResolvedValue({ default: userConfig })

      const config = await configManager.loadConfig()

      expect(config.thresholds.minScore).toBe(95)

      global.import = originalImport
    })
  })

  describe('Rule Configuration', () => {
    test('should check if rule is enabled', () => {
      configManager.config.rules = {
        'mui/inline-styles': 'error',
        'next/image-usage': 'off',
        'mui/theme-usage': { severity: 'warning' }
      }

      expect(configManager.isRuleEnabled('mui/inline-styles')).toBe(true)
      expect(configManager.isRuleEnabled('next/image-usage')).toBe(false)
      expect(configManager.isRuleEnabled('mui/theme-usage')).toBe(true)
      expect(configManager.isRuleEnabled('unknown-rule')).toBe(true) // Default to enabled
    })

    test('should get rule severity', () => {
      configManager.config.rules = {
        'mui/inline-styles': 'error',
        'next/image-usage': { severity: 'warning' },
        'mui/theme-usage': 'off'
      }

      expect(configManager.getRuleSeverity('mui/inline-styles')).toBe('error')
      expect(configManager.getRuleSeverity('next/image-usage')).toBe('warning')
      expect(configManager.getRuleSeverity('mui/theme-usage')).toBe('off')
      expect(configManager.getRuleSeverity('unknown-rule', 'info')).toBe('info')
    })

    test('should get rule options', () => {
      configManager.config.rules = {
        'mui/theme-token-enforcement': {
          severity: 'error',
          options: {
            enforceDesignTokens: true,
            allowedColors: ['primary', 'secondary']
          }
        }
      }

      const options = configManager.getRuleOptions('mui/theme-token-enforcement')
      expect(options.enforceDesignTokens).toBe(true)
      expect(options.allowedColors).toEqual(['primary', 'secondary'])

      // Should return empty object for rules without options
      expect(configManager.getRuleOptions('unknown-rule')).toEqual({})
    })
  })

  describe('File Pattern Matching', () => {
    test('should match ignore patterns', () => {
      configManager.config.ignore = ['node_modules/**', '**/*.test.js', 'dist/']

      expect(configManager.shouldIgnore('node_modules/react/index.js')).toBe(true)
      expect(configManager.shouldIgnore('src/utils.test.js')).toBe(true)
      expect(configManager.shouldIgnore('dist/bundle.js')).toBe(true)
      expect(configManager.shouldIgnore('src/components/Button.jsx')).toBe(false)
    })

    test('should match include patterns', () => {
      configManager.config.include = ['src/**/*.{js,jsx,ts,tsx}', 'pages/**/*.js']

      expect(configManager.shouldInclude('src/components/Button.jsx')).toBe(true)
      expect(configManager.shouldInclude('pages/index.js')).toBe(true)
      expect(configManager.shouldInclude('public/manifest.json')).toBe(false)
      expect(configManager.shouldInclude('README.md')).toBe(false)
    })
  })

  describe('Configuration Validation', () => {
    test('should validate configuration successfully', () => {
      expect(() => configManager.validate()).not.toThrow()
    })

    test('should detect invalid min score', () => {
      configManager.config.thresholds.minScore = 150

      expect(() => configManager.validate()).toThrow(/minScore must be between 0 and 100/)
    })

    test('should detect invalid output formats', () => {
      configManager.config.output.formats = ['json', 'invalid-format']

      expect(() => configManager.validate()).toThrow(/Invalid output formats/)
    })

    test('should warn about category weight sum', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      configManager.config.categories = {
        nextjs: { weight: 50 },
        mui: { weight: 30 }
      }

      configManager.validate()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Category weights sum to 80, not 100')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Deep Merge', () => {
    test('should merge nested objects correctly', () => {
      const target = {
        rules: { rule1: 'error' },
        categories: { nextjs: { weight: 20 } },
        simple: 'value'
      }

      const source = {
        rules: { rule2: 'warning' },
        categories: { mui: { weight: 25 } },
        simple: 'new-value',
        new: 'added'
      }

      const result = configManager.deepMerge(target, source)

      expect(result.rules).toEqual({ rule1: 'error', rule2: 'warning' })
      expect(result.categories).toEqual({
        nextjs: { weight: 20 },
        mui: { weight: 25 }
      })
      expect(result.simple).toBe('new-value')
      expect(result.new).toBe('added')
    })
  })

  describe('Static Methods', () => {
    test('should generate default config file', async () => {
      const mockWriteFile = fs.writeFile.mockResolvedValue()

      await ConfigManager.generateDefaultConfig('./test-audit.config.js')

      expect(mockWriteFile).toHaveBeenCalledWith(
        './test-audit.config.js',
        expect.stringContaining('Next.js + MUI Audit Toolkit Configuration')
      )
    })
  })
})
