# Plugin Development Guide

This guide explains how to create plugins for the Next.js + MUI Audit Toolkit.

## Plugin System Overview

The plugin system allows you to extend the audit toolkit with custom rules, processors, and hooks. Plugins can:

- Add custom audit rules
- Provide file processors for different file types
- Hook into the audit lifecycle for custom behavior
- Extend the configuration system

## Plugin Structure

A plugin is a JavaScript module that exports a plugin object with the following structure:

```javascript
export default {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom audit plugin',
  author: 'Your Name',

  // Custom rules
  rules: [
    {
      id: 'my-plugin/custom-rule',
      category: 'custom',
      severity: 'warning',
      message: 'Custom rule violation',
      pattern: /pattern-to-match/g,
      suggestion: 'Fix suggestion',
      shouldCheck: (relativePath, absolutePath) => {
        // Return true if this rule should check this file
        return relativePath.endsWith('.jsx')
      },
      checkFunction: (content, lines, filePath) => {
        // Custom check logic
        const issues = []
        // ... add issues
        return issues
      }
    }
  ],

  // Lifecycle hooks
  hooks: {
    beforeScan: async context => {
      // Called before scanning starts
    },
    afterScan: async results => {
      // Called after scanning completes
    },
    beforeFileProcess: (filePath, content) => {
      // Called before processing each file
    },
    afterFileProcess: (filePath, issues) => {
      // Called after processing each file
    },
    beforeGrading: async results => {
      // Called before grading
    },
    afterGrading: async grades => {
      // Called after grading
    }
  },

  // File processors
  processors: {
    '.tsx': (filePath, content) => {
      // Process TypeScript React files
      return processedContent
    },
    '.scss': (filePath, content) => {
      // Process SCSS files
      return processedContent
    }
  },

  // Configuration extensions
  configSchema: {
    myPluginSettings: {
      enabled: true,
      customOption: 'default-value'
    }
  }
}
```

## Rule Definition

### Basic Rule Structure

```javascript
{
  id: 'category/rule-name',           // Unique identifier
  category: 'category-name',          // Rule category
  severity: 'error|warning|info',     // Severity level
  message: 'Rule violation message',  // Description of the issue
  suggestion: 'How to fix',          // Optional fix suggestion

  // Pattern-based matching
  pattern: /regex-pattern/g,          // Global regex pattern

  // File filtering
  shouldCheck: (relativePath, absolutePath) => boolean,

  // Custom check function
  checkFunction: (content, lines, filePath) => Array<Issue>
}
```

### Pattern-Based Rules

Use pattern-based rules for simple regex matching:

```javascript
{
  id: 'react/no-inline-styles',
  category: 'react',
  severity: 'warning',
  message: 'Avoid inline styles',
  pattern: /style\s*=\s*\{\{/g,
  suggestion: 'Use CSS classes or styled-components instead'
}
```

### Function-Based Rules

Use function-based rules for complex logic:

```javascript
{
  id: 'accessibility/missing-alt-text',
  category: 'accessibility',
  severity: 'error',
  message: 'Images must have alt text',
  shouldCheck: (relativePath) => /\.(jsx?|tsx?)$/.test(relativePath),
  checkFunction: (content, lines, filePath) => {
    const issues = []
    const imgPattern = /<img[^>]*>/g
    let match

    while ((match = imgPattern.exec(content)) !== null) {
      const imgTag = match[0]
      if (!imgTag.includes('alt=')) {
        const location = getLocation(content, match.index)
        issues.push({
          rule: 'accessibility/missing-alt-text',
          category: 'accessibility',
          severity: 'error',
          message: 'Image missing alt attribute',
          line: location.line,
          column: location.column,
          excerpt: lines[location.line - 1]?.trim() || '',
          suggestion: 'Add alt attribute to describe the image',
          file: filePath,
          exactLocation: `${filePath}:${location.line}:${location.column}`
        })
      }
    }

    return issues
  }
}
```

## Lifecycle Hooks

Hooks allow you to execute custom code at different points in the audit process:

### beforeScan Hook

Called before the scan starts:

```javascript
hooks: {
  beforeScan: async context => {
    const { projectPath, config } = context
    console.log(`Starting scan of ${projectPath}`)

    // Prepare data, validate environment, etc.
  }
}
```

### afterScan Hook

Called after scanning completes:

```javascript
hooks: {
  afterScan: async results => {
    console.log(`Found ${results.summary.totalIssues} issues`)

    // Post-process results, send notifications, etc.
    if (results.summary.totalIssues > 100) {
      await sendSlackNotification('High issue count detected!')
    }
  }
}
```

### File Processing Hooks

Called for each file:

```javascript
hooks: {
  beforeFileProcess: (filePath, content) => {
    // Validate file, prepare data
    if (filePath.includes('legacy/')) {
      console.log(`Processing legacy file: ${filePath}`)
    }
  },

  afterFileProcess: (filePath, issues) => {
    // Log file results, collect metrics
    if (issues.length > 10) {
      console.warn(`High issue count in ${filePath}: ${issues.length}`)
    }
  }
}
```

### Grading Hooks

Called during the grading process:

```javascript
hooks: {
  beforeGrading: async (results) => {
    // Prepare grading data
    console.log('Starting grade calculation...')
  },

  afterGrading: async (grades) => {
    // Process final grades
    if (grades.overallScore < 70) {
      await generateDetailedReport(grades)
    }
  }
}
```

## File Processors

File processors allow you to transform file content before rules are applied:

```javascript
processors: {
  '.tsx': (filePath, content) => {
    // Remove TypeScript types for pattern matching
    return content.replace(/: [A-Za-z<>[\]|&]+/g, '')
  },

  '.scss': (filePath, content) => {
    // Process SCSS variables
    return content.replace(/\$[\w-]+/g, '--css-var')
  }
}
```

## Configuration Schema

Define configuration options for your plugin:

```javascript
configSchema: {
  myPlugin: {
    enabled: true,
    strictMode: false,
    excludePatterns: ['**/test/**'],
    customRules: {
      'my-rule': {
        severity: 'warning',
        options: {
          maxComplexity: 10
        }
      }
    }
  }
}
```

Access configuration in your rules:

```javascript
checkFunction: (content, lines, filePath, config) => {
  const pluginConfig = config?.myPlugin || {}
  const maxComplexity = pluginConfig.customRules?.['my-rule']?.options?.maxComplexity || 5

  // Use configuration in your logic
}
```

## Example Plugins

### Accessibility Plus Plugin

```javascript
// plugins/accessibility-plus/index.js
export default {
  name: 'accessibility-plus',
  version: '1.0.0',
  description: 'Advanced accessibility checks',

  rules: [
    {
      id: 'a11y-plus/focus-visible',
      category: 'accessibility',
      severity: 'warning',
      message: 'Interactive elements should have visible focus indicators',
      pattern: /:focus(?!\-visible)/g,
      suggestion: 'Use :focus-visible instead of :focus for better accessibility'
    },

    {
      id: 'a11y-plus/semantic-headings',
      category: 'accessibility',
      severity: 'error',
      message: 'Heading levels should not be skipped',
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const headingPattern = /<h([1-6])[^>]*>/g
        const headings = []
        let match

        while ((match = headingPattern.exec(content)) !== null) {
          headings.push({
            level: parseInt(match[1]),
            index: match.index,
            line: getLineNumber(content, match.index)
          })
        }

        // Check for skipped heading levels
        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1]
          const curr = headings[i]

          if (curr.level - prev.level > 1) {
            issues.push({
              rule: 'a11y-plus/semantic-headings',
              category: 'accessibility',
              severity: 'error',
              message: `Heading level jumps from h${prev.level} to h${curr.level}`,
              line: curr.line,
              column: 1,
              excerpt: lines[curr.line - 1]?.trim() || '',
              suggestion: `Use h${prev.level + 1} instead of h${curr.level}`,
              file: filePath,
              exactLocation: `${filePath}:${curr.line}:1`
            })
          }
        }

        return issues
      }
    }
  ],

  hooks: {
    afterScan: async results => {
      const a11yIssues = Object.values(results.files)
        .flatMap(file => file.issues)
        .filter(issue => issue.category === 'accessibility')

      if (a11yIssues.length > 0) {
        console.log(`🔍 Accessibility Plus found ${a11yIssues.length} issues`)
      }
    }
  }
}
```

### Performance Monitor Plugin

```javascript
// plugins/performance-monitor/index.js
export default {
  name: 'performance-monitor',
  version: '1.0.0',
  description: 'Performance monitoring and optimization checks',

  rules: [
    {
      id: 'perf/large-bundle-size',
      category: 'performance',
      severity: 'warning',
      message: 'Large import detected',
      checkFunction: (content, lines, filePath) => {
        const issues = []
        const largeLibraries = ['moment', 'lodash', 'antd']

        for (const lib of largeLibraries) {
          const importPattern = new RegExp(`import.*from\\s+['"]${lib}['"]`, 'g')
          let match

          while ((match = importPattern.exec(content)) !== null) {
            const location = getLocation(content, match.index)
            issues.push({
              rule: 'perf/large-bundle-size',
              category: 'performance',
              severity: 'warning',
              message: `Large library import: ${lib}`,
              line: location.line,
              column: location.column,
              excerpt: lines[location.line - 1]?.trim() || '',
              suggestion: `Consider using specific imports or lighter alternatives`,
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
      if (grades.categoryScores.performance < 80) {
        console.log('⚡ Performance score is low. Consider optimizing imports and bundle size.')
      }
    }
  }
}
```

## Loading Plugins

### From File

```bash
npx nextjs-mui-audit plugin --load ./my-plugin.js
```

### From NPM Package

```bash
npx nextjs-mui-audit plugin --load-npm @company/audit-plugin
```

### From Directory

```bash
npx nextjs-mui-audit plugin --load-dir ./plugins
```

### Via Configuration

```javascript
// audit.config.js
export default {
  plugins: [
    './plugins/accessibility-plus',
    '@company/performance-plugin',
    {
      name: 'inline-plugin',
      rules: [
        /* rules */
      ],
      hooks: {
        /* hooks */
      }
    }
  ],

  pluginSettings: {
    'accessibility-plus': {
      strictMode: true
    },
    'performance-plugin': {
      bundleSizeLimit: '500kb'
    }
  }
}
```

## Plugin Management CLI

```bash
# List installed plugins
npx nextjs-mui-audit plugin --list

# Show plugin information
npx nextjs-mui-audit plugin --info accessibility-plus

# Show all plugin rules
npx nextjs-mui-audit plugin --rules

# Enable/disable plugins
npx nextjs-mui-audit plugin --enable my-plugin
npx nextjs-mui-audit plugin --disable my-plugin
```

## Best Practices

1. **Unique IDs**: Use descriptive, unique rule IDs with plugin prefix
2. **Performance**: Optimize checkFunction for large files
3. **Error Handling**: Handle errors gracefully in hooks and processors
4. **Configuration**: Provide sensible defaults and validate options
5. **Documentation**: Include clear descriptions and suggestions
6. **Testing**: Test plugins with various file types and edge cases

## Helper Functions

Use these utility functions in your plugins:

```javascript
function getLocation(content, index) {
  const beforeIndex = content.substring(0, index)
  const lines = beforeIndex.split('\n')
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  }
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

## Publishing Plugins

To share your plugin with others:

1. **NPM Package**: Publish as an npm package with `nextjs-mui-audit-plugin` keyword
2. **GitHub**: Share as a GitHub repository
3. **Plugin Registry**: Submit to the official plugin registry (coming soon)

## Debugging

Enable verbose logging to debug plugin issues:

```bash
npx nextjs-mui-audit audit --verbose
```

This will show:

- Plugin loading messages
- Rule execution details
- Hook execution timing
- Error messages with stack traces
