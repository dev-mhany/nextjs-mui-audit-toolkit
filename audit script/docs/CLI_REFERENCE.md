# CLI Reference Guide

Complete command-line reference for the Next.js + MUI Audit Toolkit CLI.

## Quick Start

```bash
# Run immediately in any Next.js + MUI project
npx nextjs-mui-audit run

# With auto-fixing
npx nextjs-mui-audit run --fix --verbose

# CI/CD integration
npx nextjs-mui-audit run --ci --no-runtime --min-score 85
```

## Commands

### `run` - Main Audit Command

Runs a comprehensive audit of your Next.js + MUI project.

```bash
npx nextjs-mui-audit run [options]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-p, --path <path>` | string | `.` | Path to project directory |
| `-o, --output <dir>` | string | `.` | Output directory for reports |
| `-c, --config <path>` | string | - | Path to configuration file |
| `--strict` | boolean | false | Fail on any critical issues |
| `--min-score <score>` | number | 85 | Minimum acceptable score (0-100) |
| `--verbose` | boolean | false | Show verbose output |
| `--fix` | boolean | false | Auto-fix issues where possible |
| `--no-cache` | boolean | false | Disable caching |
| `--clear-cache` | boolean | false | Clear cache before running |
| `--cache-info` | boolean | false | Show cache information and exit |

#### CI/CD Integration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--ci` | boolean | false | CI mode: machine-readable output and exit codes |
| `--no-runtime` | boolean | false | Skip runtime audits (static analysis only) |
| `--smoke` | boolean | false | Run smoke test preset (fast basic checks) |

#### Examples

```bash
# Basic audit
npx nextjs-mui-audit run

# High-quality audit with strict requirements
npx nextjs-mui-audit run --strict --min-score 95

# CI pipeline integration
npx nextjs-mui-audit run --ci --no-runtime --min-score 80

# Auto-fix with verbose output
npx nextjs-mui-audit run --fix --verbose

# Audit specific directory with custom output
npx nextjs-mui-audit run --path ./src --output ./audit-results

# Clear cache and run fresh audit
npx nextjs-mui-audit run --clear-cache --verbose
```

## Exit Codes

The CLI uses standard exit codes for CI/CD integration:

| Code | Meaning | Description |
|------|---------|-------------|
| 0 | Success | Audit passed all checks |
| 1 | Score Below Threshold | Score is below the minimum required |
| 2 | Critical Issues | Critical issues found (in strict mode) |
| 3 | Internal Error | Tool execution failed |

## CI Mode Output

When using `--ci` flag, the tool outputs machine-readable JSON to stdout:

```json
{
  "grade": "B+",
  "score": 87,
  "criticalIssues": 0,
  "totalIssues": 12,
  "duration": 45230,
  "passed": true,
  "categories": {
    "nextjs": { "score": 90, "weight": 20 },
    "mui": { "score": 85, "weight": 20 },
    "accessibility": { "score": 88, "weight": 15 },
    "responsive": { "score": 82, "weight": 15 },
    "performance": { "score": 90, "weight": 10 },
    "security": { "score": 95, "weight": 5 },
    "codeQuality": { "score": 85, "weight": 10 },
    "testing": { "score": 70, "weight": 5 }
  },
  "thresholds": {
    "minScore": 85,
    "failOnCritical": false
  }
}
```

## Configuration

### Configuration File

Create an `audit.config.js` file in your project root:

```javascript
module.exports = {
  // Scoring thresholds
  thresholds: {
    minScore: 85,
    failOnCritical: false
  },
  
  // Output configuration
  output: {
    directory: './audit-results',
    verbose: false,
    ci: false
  },
  
  // Custom rules
  rules: {
    'custom-rule-name': {
      pattern: /pattern/,
      severity: 'warning',
      message: 'Custom message'
    }
  },
  
  // Plugin configuration
  plugins: [
    './custom-plugin.js',
    'npm-plugin-name'
  ],
  
  // Runtime configuration
  runtime: {
    enabled: true,
    timeout: 30000
  }
};
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIT_CONFIG_FILE` | Path to configuration file | `audit.config.js` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` |

## Advanced Usage

### Custom Rules

```bash
# Run with custom configuration
npx nextjs-mui-audit run --config ./custom-audit.config.js

# Override specific settings
npx nextjs-mui-audit run --min-score 90 --strict
```

### Performance Optimization

```bash
# Use caching for faster subsequent runs
npx nextjs-mui-audit run --verbose

# Check cache status
npx nextjs-mui-audit run --cache-info

# Clear cache if needed
npx nextjs-mui-audit run --clear-cache
```

### Security-First Auditing

```bash
# Static analysis only (safe for untrusted repos)
npx nextjs-mui-audit run --no-runtime

# Quick validation
npx nextjs-mui-audit run --smoke --min-score 70

# Maximum security for CI pipelines
npx nextjs-mui-audit run --ci --no-runtime --strict
```

## Troubleshooting

### Common Issues

1. **Node.js Version Error**
   ```bash
   Error: Node.js 18+ required
   ```
   Solution: Upgrade to Node.js 18 or higher

2. **Permission Errors**
   ```bash
   Error: EACCES: permission denied
   ```
   Solution: Check file permissions or run with appropriate user privileges

3. **Cache Issues**
   ```bash
   npx nextjs-mui-audit run --clear-cache
   ```

4. **Memory Issues**
   ```bash
   node --max-old-space-size=4096 $(which npx) nextjs-mui-audit run
   ```

### Debug Mode

```bash
# Enable verbose logging
npx nextjs-mui-audit run --verbose

# Check configuration
npx nextjs-mui-audit run --cache-info

# Validate setup
node -e "console.log(process.version)" # Check Node.js version
```

## Integration Examples

### GitHub Actions

```yaml
- name: Run Audit
  run: |
    npx nextjs-mui-audit run --ci --min-score 85
    if [ $? -eq 1 ]; then
      echo "Score below threshold"
      exit 1
    elif [ $? -eq 2 ]; then
      echo "Critical issues found"
      exit 1
    fi
```

### npm Scripts

```json
{
  "scripts": {
    "audit": "nextjs-mui-audit run",
    "audit:ci": "nextjs-mui-audit run --ci --no-runtime",
    "audit:fix": "nextjs-mui-audit run --fix",
    "audit:strict": "nextjs-mui-audit run --strict --min-score 95"
  }
}
```

### Pre-commit Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit
npx nextjs-mui-audit run --ci --smoke --min-score 80
```