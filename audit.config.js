// Next.js + MUI Audit Toolkit Configuration
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
    },

    // Disable specific rules
    'next/router-usage': 'off'
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
    'coverage/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}'
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
  plugins: ['./plugins/accessibility-plus', './plugins/performance-plus'],

  // Plugin settings
  pluginSettings: {
    '@audit-toolkit/accessibility-plus': {
      strictMode: true,
      skipLegacyFiles: false
    },
    '@audit-toolkit/performance-plus': {
      bundleSizeThreshold: '500kb',
      enableCacheChecks: true
    }
  }
}
