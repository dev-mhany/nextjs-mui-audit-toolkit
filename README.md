# Next.js + MUI Audit Toolkit

> **Comprehensive auditing solution for Next.js applications using Material-UI**

A powerful toolkit that combines static analysis, runtime testing, and automated reporting to ensure your Next.js + Material-UI projects follow best practices for performance, accessibility, security, and code quality.

![Audit Toolkit Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Next.js+%2B+MUI+Audit+Toolkit)

## 🌟 Key Features

### 🔍 **Comprehensive Analysis**

- **Static Code Analysis**: Pattern-based scanning for MUI best practices
- **Runtime Performance Testing**: Lighthouse integration with PWA audits
- **Accessibility Validation**: WCAG AA compliance checking
- **Bundle Analysis**: Import optimization and size monitoring
- **Security Scanning**: XSS prevention and secure coding practices

### 🚀 **Dual Interface Options**

- **🖥️ Web Application**: Modern React interface for repository auditing
- **⚡ CLI Tool**: Command-line interface for development workflows
- **🔄 GitHub Actions**: Automated CI/CD integration

### 📊 **Intelligent Reporting**

- **Automated Grading**: A-F scoring with weighted categories
- **Line-Level Precision**: Exact file and line issue reporting
- **Multiple Formats**: JSON, HTML, and Markdown reports
- **Progress Tracking**: Real-time audit execution monitoring

## 🚀 Quick Start

### Option 1: Web Application (Recommended)

The easiest way to audit repositories through a modern web interface:

```bash
# Quick setup
./setup.sh  # Linux/macOS
# or
./setup.ps1  # Windows

# Manual setup
cd webapp
npm install
cp .env.example .env.local
# Edit .env.local with your GitHub token
npm run dev
```

**Then visit**: http://localhost:3000

### Option 2: CLI Tool

For direct command-line usage and CI/CD integration:

```bash
# Navigate to CLI tool
cd "audit script"
npm install

# Run audit on current project
npm run audit

# Audit specific project
node src/index.js --path /path/to/project --output ./results
```

## 📁 Project Structure

```
nextjs-mui-audit-toolkit/
├── webapp/                    # 🌐 Web Application
│   ├── src/app/              # Next.js 14 App Router
│   ├── src/components/       # React components
│   ├── src/lib/              # Utility libraries
│   └── package.json          # Web app dependencies
├── audit script/             # ⚡ CLI Tool
│   ├── src/                  # Core audit logic
│   ├── tests/                # Test suites
│   ├── examples/             # Sample projects
│   └── package.json          # CLI tool dependencies
├── .github/workflows/        # 🔄 GitHub Actions
├── DEPLOYMENT.md             # 📚 Deployment guide
└── setup.sh/setup.ps1       # 🛠️ Quick setup scripts
```

## 🌐 Web Application

**Modern interface for repository auditing with:**

- **Repository URL Input**: Audit any GitHub repository
- **Real-time Progress**: Live tracking of audit execution
- **GitHub Integration**: Automatic workflow creation and execution
- **Email Notifications**: Get notified when audits complete
- **Results Dashboard**: View audit history and analytics
- **Mobile Responsive**: Works on desktop and mobile devices

### Web App Features

| Feature                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| 🔗 **Repository Input** | Paste GitHub URL and start auditing         |
| 🔐 **Token Support**    | Private repository access via GitHub tokens |
| ⚡ **GitHub Actions**   | Automated audit execution in the cloud      |
| 📧 **Email Alerts**     | Completion notifications via email          |
| 📊 **Analytics**        | Audit history and performance metrics       |
| 🎨 **Material-UI**      | Beautiful, responsive interface             |

**Tech Stack**: Next.js 14, TypeScript, Material-UI v5, GitHub API

## ⚡ CLI Tool

**Command-line interface for development workflows:**

- **Static Analysis**: File scanning with custom rule engine
- **ESLint Integration**: Comprehensive linting with MUI plugins
- **Performance Testing**: Lighthouse CI with custom budgets
- **Accessibility Testing**: Playwright + Axe integration
- **Bundle Analysis**: Import patterns and size optimization
- **PWA Validation**: Progressive Web App compliance

### CLI Features

| Feature               | Description                         |
| --------------------- | ----------------------------------- |
| 📝 **Rule Engine**    | 50+ custom rules for Next.js + MUI  |
| 🎯 **Grading System** | Automated A-F scoring               |
| 🔍 **Line Precision** | Exact file/line issue reporting     |
| 🚀 **Performance**    | Core Web Vitals and bundle analysis |
| ♿ **Accessibility**  | WCAG AA compliance validation       |
| 🔒 **Security**       | XSS prevention and secure patterns  |

**Tech Stack**: Node.js 18+, ESLint, Lighthouse, Playwright, Jest

## 🔄 GitHub Actions Integration

Both interfaces support GitHub Actions for automated auditing:

```yaml
# .github/workflows/audit.yml
name: Next.js + MUI Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Audit
        uses: ./
        with:
          output-path: ./audit-results
```

## 📊 Sample Report

```json
{
  "grades": {
    "overallScore": 87,
    "letterGrade": "B+",
    "categories": {
      "muiUsage": { "score": 95, "weight": 30 },
      "performance": { "score": 82, "weight": 25 },
      "accessibility": { "score": 90, "weight": 20 },
      "security": { "score": 85, "weight": 15 },
      "codeQuality": { "score": 78, "weight": 10 }
    }
  },
  "summary": {
    "totalIssues": 12,
    "criticalIssues": 2,
    "filesScanned": 45,
    "rulesApplied": 52
  }
}
```

## 🛠️ Configuration

### Environment Variables

```env
# GitHub Integration
GITHUB_TOKEN=ghp_your_token_here
GITHUB_WEBHOOK_SECRET=your_secure_secret

# Email Notifications (Optional)
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application Settings
NEXTAUTH_URL=https://your-app.vercel.app
LOG_LEVEL=info
```

### Audit Configuration

```javascript
// audit.config.js
module.exports = {
  rules: {
    'mui-imports': 'error',
    'theme-tokens': 'warn',
    accessibility: 'error'
  },
  performance: {
    budgets: {
      'first-load-js': 180
    }
  },
  output: {
    formats: ['json', 'html', 'markdown']
  }
}
```

## 🚀 Deployment

### Web Application Deployment

**Vercel (Recommended)**:

```bash
cd webapp
npx vercel --prod
```

**Netlify**:

```bash
cd webapp
npm run build
netlify deploy --prod --dir=.next
```

**Docker**:

```bash
cd webapp
docker build -t audit-webapp .
docker run -p 3000:3000 audit-webapp
```

### CLI Tool Usage

**Local Development**:

```bash
cd "audit script"
npm install
npm run audit
```

**CI/CD Integration**:

```bash
# Add to your workflow
- name: Audit Next.js + MUI
  run: |
    cd "audit script"
    npm ci
    npm run audit -- --path . --output ./results
```

## 📚 Documentation

**Complete documentation is organized by component:**

### 🔍 Quick Access

- **[Documentation Index](./DOCUMENTATION.md)** - Master documentation guide
- **[CLI Reference](./audit%20script/docs/CLI_REFERENCE.md)** - Command-line usage
- **[API Reference](./webapp/docs/API_REFERENCE.md)** - Web API documentation
- **[GitHub App Setup](./webapp/docs/GITHUB_APP_SETUP.md)** - Integration guide
- **[Deployment Guide](./webapp/docs/DEPLOYMENT_GUIDE.md)** - Production setup

### 🎨 Component Documentation

#### 🔧 Audit Script (CLI)

**Location**: [`/audit script/docs/`](./audit%20script/docs/)

- [CLI Reference](./audit%20script/docs/CLI_REFERENCE.md) - Complete command reference
- [Configuration Guide](./audit%20script/docs/CONFIGURATION_GUIDE.md) - Setup and customization
- [Plugin Development](./audit%20script/docs/PLUGIN_DEVELOPMENT.md) - Extending functionality

#### 🌐 Web Application

**Location**: [`/webapp/docs/`](./webapp/docs/)

- [API Reference](./webapp/docs/API_REFERENCE.md) - REST API documentation
- [GitHub App Setup](./webapp/docs/GITHUB_APP_SETUP.md) - Integration setup
- [Deployment Guide](./webapp/docs/DEPLOYMENT_GUIDE.md) - Production deployment
- [Implementation Summary](./webapp/docs/IMPLEMENTATION_SUMMARY.md) - Technical details

| Document                                     | Description                           |
| -------------------------------------------- | ------------------------------------- |
| [📖 Web App README](webapp/README.md)        | Complete web application guide        |
| [⚡ CLI README](audit%20script/README.md)    | Command-line tool documentation       |
| [🚀 Deployment Guide](DEPLOYMENT.md)         | Comprehensive deployment instructions |
| [🔧 Integration Guide](INTEGRATION_GUIDE.md) | CI/CD and workflow integration        |

## 🧪 Testing

```bash
# Test web application
cd webapp
npm test
npm run test:e2e

# Test CLI tool
cd "audit script"
npm test
npm run test:integration
```

## 🤝 Contributing

1. **Fork the repository**
2. **Choose your focus**:
   - Web Application: `cd webapp`
   - CLI Tool: `cd "audit script"`
3. **Create feature branch**: `git checkout -b feature/amazing-feature`
4. **Make changes and test**
5. **Submit pull request**

### Development Guidelines

- **Code Quality**: ESLint + Prettier configuration included
- **Testing**: Write tests for new features
- **Documentation**: Update relevant README files
- **Type Safety**: Use TypeScript for new code
- **Commit Convention**: Follow conventional commit format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Material-UI Team** - Beautiful React components
- **GitHub** - Actions platform and API
- **Vercel** - Excellent hosting platform
- **Open Source Community** - Tools and inspiration

## 📞 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/nextjs-mui-audit-toolkit/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/nextjs-mui-audit-toolkit/discussions)
- **📧 Email**: support@your-domain.com
- **📚 Documentation**: See individual README files

## 🌟 Features Comparison

| Feature                 | Web App | CLI Tool | GitHub Actions |
| ----------------------- | ------- | -------- | -------------- |
| **Repository Auditing** | ✅      | ✅       | ✅             |
| **Real-time Progress**  | ✅      | ⚡       | ✅             |
| **Email Notifications** | ✅      | ❌       | ✅             |
| **GitHub Integration**  | ✅      | ⚡       | ✅             |
| **Visual Dashboard**    | ✅      | ❌       | ❌             |
| **CI/CD Integration**   | ⚡      | ✅       | ✅             |
| **Offline Usage**       | ❌      | ✅       | ❌             |
| **Batch Processing**    | ⚡      | ✅       | ✅             |

**Legend**: ✅ Full Support | ⚡ Partial Support | ❌ Not Available

---

**Built with ❤️ by dev-mhany**

_Automated auditing for Next.js + Material-UI projects_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-v5-blue)](https://mui.com/)
