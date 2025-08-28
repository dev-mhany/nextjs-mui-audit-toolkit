# Documentation Index

Welcome to the Next.js + MUI Audit Toolkit documentation. This project consists of two main components, each with their own comprehensive documentation.

## 📚 Component Documentation

### 🔧 Audit Script (CLI Tool)

The command-line audit tool for analyzing Next.js + MUI projects.

**Location**: [`/audit script/docs/`](./audit%20script/docs/)

| Document | Description |
|----------|-------------|
| [CLI Reference](./audit%20script/docs/CLI_REFERENCE.md) | Complete command-line reference and options |
| [Configuration Guide](./audit%20script/docs/CONFIGURATION_GUIDE.md) | Detailed configuration options and examples |
| [Plugin Development](./audit%20script/docs/PLUGIN_DEVELOPMENT.md) | Guide to creating custom plugins |
| [README](./audit%20script/README.md) | Main documentation and quick start |

**Quick Start**:
```bash
npx nextjs-mui-audit run --ci --min-score 85
```

### 🌐 Web Application

The web interface for triggering audits via GitHub App integration.

**Location**: [`/webapp/docs/`](./webapp/docs/)

| Document | Description |
|----------|-------------|
| [API Reference](./webapp/docs/API_REFERENCE.md) | Complete API documentation and endpoints |
| [GitHub App Setup](./webapp/docs/GITHUB_APP_SETUP.md) | GitHub App installation and configuration |
| [Deployment Guide](./webapp/docs/DEPLOYMENT_GUIDE.md) | Production deployment instructions |
| [Implementation Summary](./webapp/docs/IMPLEMENTATION_SUMMARY.md) | Technical implementation details |
| [README](./webapp/README.md) | Main documentation and quick start |

**Quick Start**:
```bash
cd webapp
npm install
npm run dev
```

## 🚀 Getting Started

### Choose Your Interface

1. **Command Line** (Developers/CI): Use the audit script directly
2. **Web Interface** (Teams/Non-technical): Use the webapp for GitHub App integration

### For Developers (CLI)

```bash
# Install and run audit
npx nextjs-mui-audit run

# With CI integration
npx nextjs-mui-audit run --ci --no-runtime --min-score 85
```

**See**: [CLI Reference](./audit%20script/docs/CLI_REFERENCE.md)

### For Teams (Web App)

```bash
# Setup webapp
cd webapp
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

**See**: [GitHub App Setup](./webapp/docs/GITHUB_APP_SETUP.md)

## 📋 Documentation Overview

### By Topic

#### Installation & Setup
- [CLI Installation](./audit%20script/README.md#installation)
- [Webapp Setup](./webapp/README.md#quick-start)
- [GitHub App Configuration](./webapp/docs/GITHUB_APP_SETUP.md)
- [Environment Variables](./webapp/docs/GITHUB_APP_SETUP.md#environment-configuration)

#### Configuration
- [CLI Configuration](./audit%20script/docs/CONFIGURATION_GUIDE.md)
- [Custom Rules](./audit%20script/docs/CONFIGURATION_GUIDE.md#custom-rules)
- [Plugin System](./audit%20script/docs/CONFIGURATION_GUIDE.md#plugin-system)

#### Usage & Examples
- [CLI Examples](./audit%20script/docs/CLI_REFERENCE.md#examples)
- [API Usage](./webapp/docs/API_REFERENCE.md#sdk-usage-examples)
- [CI/CD Integration](./audit%20script/docs/CLI_REFERENCE.md#cicd-integration)

#### Deployment & Production
- [Webapp Deployment](./webapp/docs/DEPLOYMENT_GUIDE.md)
- [Production Configuration](./webapp/docs/DEPLOYMENT_GUIDE.md#environment-configuration)
- [Security Setup](./webapp/docs/DEPLOYMENT_GUIDE.md#security-configuration)

#### Development & Extension
- [Plugin Development](./audit%20script/docs/PLUGIN_DEVELOPMENT.md)
- [API Reference](./webapp/docs/API_REFERENCE.md)
- [Implementation Details](./webapp/docs/IMPLEMENTATION_SUMMARY.md)

### By User Type

#### DevOps Engineers
- [CLI Reference](./audit%20script/docs/CLI_REFERENCE.md) - CI/CD integration
- [Deployment Guide](./webapp/docs/DEPLOYMENT_GUIDE.md) - Production setup
- [Configuration](./audit%20script/docs/CONFIGURATION_GUIDE.md) - Environment setup

#### Frontend Developers
- [CLI Usage](./audit%20script/README.md) - Local development
- [Custom Rules](./audit%20script/docs/CONFIGURATION_GUIDE.md#custom-rules) - Project-specific rules
- [Plugin Development](./audit%20script/docs/PLUGIN_DEVELOPMENT.md) - Extensibility

#### Team Leads
- [GitHub App Setup](./webapp/docs/GITHUB_APP_SETUP.md) - Team integration
- [API Reference](./webapp/docs/API_REFERENCE.md) - Automation
- [Implementation Summary](./webapp/docs/IMPLEMENTATION_SUMMARY.md) - Technical overview

#### System Administrators
- [Deployment Guide](./webapp/docs/DEPLOYMENT_GUIDE.md) - Infrastructure
- [Security Configuration](./webapp/docs/DEPLOYMENT_GUIDE.md#security-configuration) - Security setup
- [Monitoring](./webapp/docs/DEPLOYMENT_GUIDE.md#monitoring-and-observability) - Operations

## 🔄 Product Flow Documentation

### GitHub App Integration (Recommended)

The modern, secure approach using GitHub Apps:

1. **Setup**: [GitHub App Configuration](./webapp/docs/GITHUB_APP_SETUP.md)
2. **Usage**: Web interface triggers audits automatically
3. **Results**: PR-based delivery with branch protection compatibility
4. **Security**: Fine-grained permissions, short-lived tokens

### CLI Integration

Direct command-line usage for developers and CI/CD:

1. **Setup**: [CLI Installation](./audit%20script/README.md#installation)
2. **Usage**: [CLI Examples](./audit%20script/docs/CLI_REFERENCE.md#examples)
3. **CI/CD**: [Integration Guide](./audit%20script/docs/CLI_REFERENCE.md#cicd-integration)
4. **Configuration**: [Advanced Options](./audit%20script/docs/CONFIGURATION_GUIDE.md)

## 🆘 Support & Troubleshooting

### Common Issues

1. **CLI Installation Problems**
   - [Node.js Requirements](./audit%20script/README.md#prerequisites)
   - [Troubleshooting](./audit%20script/docs/CLI_REFERENCE.md#troubleshooting)

2. **GitHub App Setup Issues**
   - [Installation Guide](./webapp/docs/GITHUB_APP_SETUP.md#troubleshooting)
   - [Permission Problems](./webapp/docs/GITHUB_APP_SETUP.md#common-issues)

3. **Deployment Issues**
   - [Platform-specific Guides](./webapp/docs/DEPLOYMENT_GUIDE.md#deployment-platforms)
   - [Environment Configuration](./webapp/docs/DEPLOYMENT_GUIDE.md#environment-configuration)

### Getting Help

1. **Check Documentation**: Start with the relevant component docs
2. **Review Examples**: See usage examples in each guide
3. **Check Issues**: Look for similar problems in GitHub issues
4. **Create Issue**: Provide detailed information and logs

## 📝 Contributing to Documentation

### Structure

- **Component-specific docs**: Keep in component directories
- **Cross-cutting concerns**: Place in root directory
- **Examples**: Include working code examples
- **Screenshots**: Use for complex UI flows

### Guidelines

1. **Keep docs up-to-date** with code changes
2. **Include examples** for all major features
3. **Link between related docs** for easy navigation
4. **Use consistent formatting** and terminology

### Documentation Updates

When making changes:

1. Update component-specific docs first
2. Update this index if structure changes
3. Verify all links work correctly
4. Test examples with current code

---

**This documentation is organized to help you find what you need quickly. Start with the component that matches your use case, then dive into specific guides as needed.**