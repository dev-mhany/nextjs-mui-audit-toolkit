import { readFile, access } from 'fs/promises'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ConfigManager {
  constructor() {
    this.defaultConfig = {
      rules: {},
      categories: {
        nextjs: { weight: 20 },
        mui: { weight: 20 },
        accessibility: { weight: 15 },
        responsive: { weight: 15 },
        performance: { weight: 10 },
        security: { weight: 5 },
        quality: { weight: 10 },
        testing: { weight: 5 }
      },
      thresholds: {
        minScore: 85,
        failOnCritical: true
      },
      ignore: [
        'node_modules/**',
        '.next/**',
        'out/**',
        'build/**',
        'dist/**',
        '.git/**',
        'coverage/**'
      ],
      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}'
      ],
      output: {
        formats: ['json', 'markdown'],
        directory: 'audit',
        verbose: false
      },
      plugins: [],
      extends: [],

      // Plugin-specific settings
      pluginSettings: {}
    }
    this.config = { ...this.defaultConfig }
  }

  async loadConfig(configPath) {
    const configs = []

    // Load default configuration
    configs.push(this.defaultConfig)

    // Load user configuration if provided
    if (configPath) {
      const userConfig = await this.loadConfigFile(configPath)
      if (userConfig) {
        configs.push(userConfig)
      }
    } else {
      // Try to find config file automatically
      const autoConfig = await this.findConfigFile()
      if (autoConfig) {
        configs.push(autoConfig)
      }
    }

    // Merge configurations
    this.config = this.mergeConfigs(configs)

    // Process extends
    await this.processExtends()

    return this.config
  }

  async loadConfigFile(configPath) {
    try {
      const fullPath = resolve(configPath)
      await access(fullPath)

      // Dynamic import for ES modules
      const configModule = await import(`file://${fullPath}`)
      return configModule.default || configModule
    } catch (error) {
      console.warn(`Warning: Could not load config file ${configPath}:`, error.message)
      return null
    }
  }

  async findConfigFile() {
    const configFiles = ['audit.config.js', 'audit.config.mjs', '.auditrc.js', '.auditrc.mjs']

    for (const configFile of configFiles) {
      try {
        await access(configFile)
        return await this.loadConfigFile(configFile)
      } catch {
        // File doesn't exist, continue
      }
    }

    return null
  }

  mergeConfigs(configs) {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config)
    }, {})
  }

  deepMerge(target, source) {
    const result = { ...target }

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }

    return result
  }

  async processExtends() {
    if (!this.config.extends || this.config.extends.length === 0) {
      return
    }

    for (const extendConfig of this.config.extends) {
      try {
        let extendedConfig

        if (extendConfig.startsWith('@')) {
          // npm package
          const packageName = extendConfig
          const packageConfig = await import(packageName)
          extendedConfig = packageConfig.default || packageConfig
        } else {
          // local file
          extendedConfig = await this.loadConfigFile(extendConfig)
        }

        if (extendedConfig) {
          this.config = this.deepMerge(extendedConfig, this.config)
        }
      } catch (error) {
        console.warn(`Warning: Could not extend config ${extendConfig}:`, error.message)
      }
    }
  }

  getRuleConfig(ruleId) {
    return this.config.rules[ruleId]
  }

  isRuleEnabled(ruleId) {
    const ruleConfig = this.getRuleConfig(ruleId)

    if (ruleConfig === undefined) {
      return true // Default to enabled
    }

    if (typeof ruleConfig === 'string') {
      return ruleConfig !== 'off'
    }

    if (typeof ruleConfig === 'object') {
      return ruleConfig.severity !== 'off'
    }

    return Boolean(ruleConfig)
  }

  getRuleSeverity(ruleId, defaultSeverity = 'warning') {
    const ruleConfig = this.getRuleConfig(ruleId)

    if (typeof ruleConfig === 'string') {
      return ruleConfig === 'off' ? 'off' : ruleConfig
    }

    if (typeof ruleConfig === 'object' && ruleConfig.severity) {
      return ruleConfig.severity
    }

    return defaultSeverity
  }

  getRuleOptions(ruleId) {
    const ruleConfig = this.getRuleConfig(ruleId)

    if (typeof ruleConfig === 'object' && ruleConfig.options) {
      return ruleConfig.options
    }

    return {}
  }

  getCategoryWeight(category) {
    return this.config.categories[category]?.weight || 10
  }

  shouldIgnore(filePath) {
    return this.config.ignore.some(pattern => {
      if (pattern.includes('**')) {
        // Glob pattern
        return this.matchGlob(filePath, pattern)
      }
      return filePath.includes(pattern)
    })
  }

  shouldInclude(filePath) {
    if (this.config.include.length === 0) {
      return true
    }

    return this.config.include.some(pattern => {
      if (pattern.includes('**')) {
        return this.matchGlob(filePath, pattern)
      }
      return filePath.includes(pattern)
    })
  }

  matchGlob(filePath, pattern) {
    // Simple glob matching - for production use a proper glob library
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\./g, '\\.')

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(filePath)
  }

  getThresholds() {
    return this.config.thresholds
  }

  getOutputConfig() {
    return this.config.output
  }

  validate() {
    const errors = []

    // Validate category weights
    const totalWeight = Object.values(this.config.categories).reduce(
      (sum, cat) => sum + (cat.weight || 0),
      0
    )
    if (totalWeight !== 100) {
      console.warn(
        `Warning: Category weights sum to ${totalWeight}, not 100. This may affect scoring.`
      )
    }

    // Validate thresholds
    if (this.config.thresholds.minScore < 0 || this.config.thresholds.minScore > 100) {
      errors.push('minScore must be between 0 and 100')
    }

    // Validate output formats
    const validFormats = ['json', 'markdown', 'html']
    const invalidFormats = this.config.output.formats.filter(
      format => !validFormats.includes(format)
    )
    if (invalidFormats.length > 0) {
      errors.push(
        `Invalid output formats: ${invalidFormats.join(', ')}. Valid formats: ${validFormats.join(', ')}`
      )
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
    }

    return true
  }

  static async generateDefaultConfig(outputPath = 'audit.config.js') {
    const configContent = `// Next.js + MUI Audit Toolkit Configuration
export default {
  // Rule configuration
  rules: {
    // Enable/disable specific rules
    'mui/inline-styles': 'error',
    'next/image-usage': 'warning',
    'mui/theme-usage': 'info',
    
    // Configure rules with options
    'mui/theme-token-enforcement': {
      severity: 'error',
      options: {
        enforceDesignTokens: true,
        allowedColors: ['primary', 'secondary', 'error', 'warning', 'info', 'success']
      }
    }
  },

  // Category weights (must sum to 100)
  categories: {
    nextjs: { weight: 20 },
    mui: { weight: 20 },
    accessibility: { weight: 15 },
    responsive: { weight: 15 },
    performance: { weight: 10 },
    security: { weight: 5 },
    quality: { weight: 10 },
    testing: { weight: 5 }
  },

  // Audit thresholds
  thresholds: {
    minScore: 85,
    failOnCritical: true
  },

  // File patterns to ignore
  ignore: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    '.git/**',
    'coverage/**'
  ],

  // File patterns to include
  include: [
    'src/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}'
  ],

  // Output configuration
  output: {
    formats: ['json', 'markdown'],
    directory: 'audit',
    verbose: false
  },

  // Extend other configurations
  extends: [
    // '@nextjs-mui-audit/recommended',
    // './shared-config.js'
  ],

  // Additional plugins
  plugins: [
    // 'custom-rules-plugin'
  ]
}
`

    await writeFile(outputPath, configContent)
    return outputPath
  }
}

export const configManager = new ConfigManager()
