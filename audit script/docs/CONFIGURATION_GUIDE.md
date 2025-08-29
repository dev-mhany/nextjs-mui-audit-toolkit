# Configuration Guide

Complete guide to configuring the Next.js + MUI Audit Toolkit.

## Configuration Files

### audit.config.js

The main configuration file should be placed in your project root:

```javascript
module.exports = {
  // Scoring and thresholds
  thresholds: {
    minScore: 85, // Minimum passing score (0-100)
    failOnCritical: false // Fail audit if critical issues found
  },

  // Output configuration
  output: {
    directory: './audit-results', // Output directory for reports
    verbose: false, // Detailed console output
    ci: false // CI mode for machine-readable output
  },

  // Category weights (must sum to 100)
  weights: {
    nextjs: 20, // Next.js architecture and best practices
    mui: 20, // Material-UI usage and patterns
    accessibility: 15, // WCAG AA compliance
    responsive: 15, // Mobile-first responsive design
    performance: 10, // Performance optimization
    security: 5, // Security best practices
    codeQuality: 10, // Code quality and standards
    testing: 5 // Testing coverage and quality
  },

  // Custom rules
  rules: {
    'no-inline-styles': {
      pattern: /style={{[^}]+}}/g,
      severity: 'error',
      message: 'Avoid inline styles, use sx prop or theme tokens',
      category: 'mui',
      autofix: true
    },
    'require-alt-text': {
      pattern: /<img(?![^>]*alt=)/g,
      severity: 'critical',
      message: 'Images must have alt text for accessibility',
      category: 'accessibility'
    }
  },

  // Plugin configuration
  plugins: [
    './plugins/custom-rules.js', // Local plugin file
    './plugins/', // Plugin directory
    'audit-plugin-package', // NPM package
    {
      name: 'custom-plugin',
      path: './plugins/custom.js',
      options: {
        enabled: true,
        severity: 'warning'
      }
    }
  ],

  // ESLint integration
  eslint: {
    enabled: true,
    configFile: '.eslintrc.js',
    ignorePattern: ['node_modules/', 'dist/', '.next/']
  },

  // Runtime audit configuration
  runtime: {
    enabled: true, // Enable runtime audits (Lighthouse, etc.)
    timeout: 30000, // Timeout in milliseconds
    lighthouse: {
      enabled: true,
      mobile: true,
      desktop: false,
      budgets: './lighthouse/budgets.json'
    },
    playwright: {
      enabled: true,
      headless: true,
      browsers: ['chromium']
    }
  },

  // PWA configuration
  pwa: {
    enabled: true,
    requireManifest: true,
    requireServiceWorker: false,
    offlineSupport: false
  },

  // Performance budgets
  budgets: {
    firstLoadJS: 180000, // 180KB max first-load JS
    totalBlockingTime: 300, // 300ms max TBT
    largestContentfulPaint: 2500, // 2.5s max LCP
    cumulativeLayoutShift: 0.1 // 0.1 max CLS
  },

  // Cache configuration
  cache: {
    enabled: true,
    directory: '.audit-cache',
    ttl: 3600000, // 1 hour in milliseconds
    maxSize: 100 // 100MB max cache size
  },

  // Reporting configuration
  reports: {
    json: true, // Generate JSON report
    markdown: true, // Generate Markdown report
    html: true, // Generate HTML report
    console: true, // Console output
    junit: false // JUnit XML for CI integration
  },

  // Exclude patterns
  exclude: [
    'node_modules/**',
    'dist/**',
    '.next/**',
    'coverage/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}'
  ],

  // Include patterns (if specified, only these will be scanned)
  include: [
    'src/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}'
  ]
}
```

## Environment Variables

### Core Configuration

```bash
# Configuration file path
AUDIT_CONFIG_FILE=./custom-audit.config.js

# Environment mode
NODE_ENV=development|production|test

# Logging level
LOG_LEVEL=error|warn|info|debug

# Cache directory
AUDIT_CACHE_DIR=./.audit-cache

# Disable cache
AUDIT_NO_CACHE=true
```

### CI/CD Variables

```bash
# CI mode
AUDIT_CI=true

# Minimum score
AUDIT_MIN_SCORE=85

# Fail on critical issues
AUDIT_FAIL_ON_CRITICAL=true

# Output directory
AUDIT_OUTPUT_DIR=./audit-results
```

### Runtime Configuration

```bash
# Disable runtime audits
AUDIT_NO_RUNTIME=true

# Lighthouse timeout
LIGHTHOUSE_TIMEOUT=30000

# Playwright headless mode
PLAYWRIGHT_HEADLESS=true
```

## Preset Configurations

### Development Mode

```javascript
// audit.config.dev.js
module.exports = {
  thresholds: {
    minScore: 70,
    failOnCritical: false
  },
  output: {
    verbose: true,
    ci: false
  },
  runtime: {
    enabled: true,
    timeout: 60000
  },
  cache: {
    enabled: true
  }
}
```

### CI/CD Mode

```javascript
// audit.config.ci.js
module.exports = {
  thresholds: {
    minScore: 85,
    failOnCritical: true
  },
  output: {
    verbose: false,
    ci: true,
    directory: './audit-results'
  },
  runtime: {
    enabled: false // Static analysis only for security
  },
  cache: {
    enabled: false // Fresh run every time
  },
  reports: {
    json: true,
    markdown: false,
    html: false,
    console: false,
    junit: true
  }
}
```

### Production Mode

```javascript
// audit.config.prod.js
module.exports = {
  thresholds: {
    minScore: 95,
    failOnCritical: true
  },
  output: {
    verbose: false,
    ci: true
  },
  runtime: {
    enabled: true,
    lighthouse: {
      enabled: true,
      mobile: true,
      desktop: true
    }
  },
  budgets: {
    firstLoadJS: 150000, // Stricter budget
    totalBlockingTime: 200,
    largestContentfulPaint: 2000,
    cumulativeLayoutShift: 0.05
  }
}
```

## Custom Rules

### Rule Definition

```javascript
// In audit.config.js
rules: {
  'custom-rule-name': {
    pattern: /regex-pattern/g,
    severity: 'error|warning|critical',
    message: 'Human-readable error message',
    category: 'nextjs|mui|accessibility|responsive|performance|security|codeQuality|testing',
    autofix: true|false,
    fixFunction: (match, content) => {
      // Return fixed content
      return content.replace(match, 'fixed-version');
    }
  }
}
```

### Example Custom Rules

```javascript
rules: {
  'no-hardcoded-colors': {
    pattern: /#[0-9a-fA-F]{6}|rgb\(|rgba\(/g,
    severity: 'warning',
    message: 'Use theme colors instead of hardcoded values',
    category: 'mui',
    autofix: false
  },

  'require-key-prop': {
    pattern: /\.map\([^}]*<[^>]*(?!.*key=)/g,
    severity: 'error',
    message: 'Missing key prop in mapped elements',
    category: 'codeQuality'
  },

  'no-console-log': {
    pattern: /console\.log\(/g,
    severity: 'warning',
    message: 'Remove console.log statements',
    category: 'codeQuality',
    autofix: true,
    fixFunction: (match, content) => {
      return content.replace(match, '// console.log(');
    }
  }
}
```

## Plugin System

### Plugin Structure

```javascript
// plugins/custom-plugin.js
module.exports = {
  name: 'custom-plugin',
  version: '1.0.0',

  // Plugin lifecycle hooks
  hooks: {
    beforeScan: config => {
      console.log('Starting scan...')
    },

    afterScan: results => {
      console.log('Scan completed')
    },

    beforeGrade: results => {
      // Modify results before grading
    },

    afterGrade: grades => {
      // Process grades
    }
  },

  // Custom rules provided by plugin
  rules: {
    'plugin-rule': {
      pattern: /pattern/g,
      severity: 'warning',
      message: 'Plugin rule message',
      category: 'codeQuality'
    }
  },

  // Plugin configuration schema
  configSchema: {
    enabled: 'boolean',
    severity: 'string'
  },

  // Plugin initialization
  init: options => {
    // Setup plugin
  }
}
```

### Loading Plugins

```javascript
// audit.config.js
plugins: [
  // File path
  './plugins/custom-plugin.js',

  // Directory (loads all .js files)
  './plugins/',

  // NPM package
  'audit-plugin-accessibility',

  // With options
  {
    name: 'custom-plugin',
    path: './plugins/custom.js',
    options: {
      enabled: true,
      severity: 'error'
    }
  }
]
```

## Integration with Build Tools

### Next.js Integration

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Audit-Compliant',
            value: 'true'
          }
        ]
      }
    ]
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "audit": "nextjs-mui-audit run",
    "audit:dev": "nextjs-mui-audit run --config audit.config.dev.js",
    "audit:ci": "nextjs-mui-audit run --config audit.config.ci.js",
    "audit:fix": "nextjs-mui-audit run --fix",
    "precommit": "nextjs-mui-audit run --smoke --min-score 75"
  }
}
```

### GitHub Actions

```yaml
# .github/workflows/audit.yml
name: Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - name: Run Audit
        run: npx nextjs-mui-audit run --config audit.config.ci.js
        env:
          AUDIT_CI: true
          AUDIT_MIN_SCORE: 85
```

## Troubleshooting Configuration

### Common Issues

1. **Configuration Not Found**

   ```bash
   # Check config file exists
   ls -la audit.config.js

   # Use absolute path
   npx nextjs-mui-audit run --config /absolute/path/to/config.js
   ```

2. **Plugin Loading Errors**

   ```javascript
   // Ensure plugin paths are correct
   plugins: [path.resolve(__dirname, './plugins/custom.js')]
   ```

3. **Rule Conflicts**

   ```javascript
   // Use unique rule names
   rules: {
     'my-plugin-no-inline-styles': { /* ... */ },
     'other-plugin-no-inline-styles': { /* ... */ }
   }
   ```

4. **Weight Validation**
   ```javascript
   // Ensure weights sum to 100
   weights: {
     nextjs: 20,
     mui: 20,
     // ... should total 100
   }
   ```

### Debug Configuration

```bash
# Validate configuration
npx nextjs-mui-audit run --config audit.config.js --verbose

# Check loaded plugins
npx nextjs-mui-audit run --verbose | grep "Plugin loaded"

# Test specific rules
npx nextjs-mui-audit run --verbose | grep "Rule applied"
```
