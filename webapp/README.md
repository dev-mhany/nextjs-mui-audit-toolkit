# Next.js + MUI Audit Toolkit - Web Application

A modern web interface for automating Next.js + Material-UI project audits using GitHub Actions. Built with Next.js 14, TypeScript, and Material-UI v5.

![Audit Toolkit Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Next.js+%2B+MUI+Audit+Toolkit)

## 🚀 Features

- **🔍 Automated Auditing**: Trigger comprehensive audits via GitHub Actions
- **📊 Real-time Progress**: Live tracking of audit execution
- **📧 Email Notifications**: Get notified when audits complete
- **🔒 Secure Integration**: GitHub token validation and webhook security
- **📈 Analytics Dashboard**: View audit history and performance metrics
- **🎨 Modern UI**: Material-UI v5 with responsive design
- **⚡ Fast Performance**: Next.js 14 with App Router

## 📚 Documentation

For comprehensive documentation, see the `/docs` directory:

- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation and endpoints
- **[GitHub App Setup](./docs/GITHUB_APP_SETUP.md)** - GitHub App installation and configuration guide
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

### Quick Links

- [Environment Setup](./docs/GITHUB_APP_SETUP.md#environment-variables)
- [API Endpoints](./docs/API_REFERENCE.md#endpoints)
- [Deployment Options](./docs/DEPLOYMENT_GUIDE.md#deployment-platforms)
- [GitHub App Configuration](./docs/GITHUB_APP_SETUP.md#setting-up-github-app)
- [Production Deployment](./docs/DEPLOYMENT_GUIDE.md#vercel-recommended)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Material-UI v5
- **Backend**: Next.js API Routes, Node.js 18+
- **Authentication**: GitHub Personal Access Tokens
- **Database**: File-based JSON (easily extensible)
- **Email**: Nodemailer with multiple provider support
- **Deployment**: GitHub Actions, Vercel-ready
- **Security**: Input validation, rate limiting, CSRF protection

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- GitHub account with Personal Access Token
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd nextjs-mui-audit-toolkit/webapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   GITHUB_TOKEN=ghp_your_github_token_here
   GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret
   EMAIL_PROVIDER=smtp
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open application**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### GitHub Token Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy the token to your `.env.local` file

### Email Configuration

#### Gmail (Recommended for testing)

```env
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password, not regular password
```

#### SendGrid

```env
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=SG.your-sendgrid-api-key
```

### Webhook Security

Generate a secure webhook secret:

```bash
# Generate random secret
openssl rand -hex 32
```

## 🎯 Usage

### Starting an Audit

1. **Enter Repository URL**
   - Paste GitHub repository URL (e.g., `https://github.com/user/repo`)
   - Optionally provide GitHub token for private repos

2. **Configure Options**
   - Select branch (defaults to main/master)
   - Set audit parameters (strict mode, auto-fix, etc.)
   - Add email for notifications

3. **Submit Audit**
   - Click "Start Audit" button
   - Monitor progress in real-time
   - Receive email notification when complete

### Viewing Results

- **Dashboard**: View all audit history
- **Progress Tracking**: Real-time status updates
- **Detailed Reports**: Comprehensive audit results
- **GitHub Integration**: Direct links to workflow runs

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │   API Routes     │    │  GitHub Actions │
│   (Pages/Forms) │◄──►│  (Audit Logic)   │◄──►│   (Audit Bot)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Material-UI   │    │   File Database  │    │   Email Service │
│   Components    │    │   (JSON Store)   │    │   (Notifications)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

- **`src/app/`** - Next.js 14 App Router pages
- **`src/components/`** - Reusable React components
- **`src/app/api/`** - API routes for backend logic
- **`src/lib/`** - Utility libraries and services
- **`src/types/`** - TypeScript type definitions

## 🔌 API Endpoints

### Core Endpoints

| Endpoint             | Method | Description              |
| -------------------- | ------ | ------------------------ |
| `/api/audit/trigger` | POST   | Start new audit          |
| `/api/audit/[id]`    | GET    | Get audit status         |
| `/api/audit/webhook` | POST   | GitHub webhook callback  |
| `/api/email/test`    | POST   | Test email configuration |

### Example API Usage

```javascript
// Start an audit
const response = await fetch('/api/audit/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoUrl: 'https://github.com/user/repo',
    branch: 'main',
    userEmail: 'user@example.com',
    auditConfig: {
      strict: true,
      fix: false,
      minScore: 80
    }
  })
})

const result = await response.json()
console.log('Audit ID:', result.auditId)
```

```javascript
// Check audit status
const status = await fetch(`/api/audit/${auditId}`)
const audit = await status.json()
console.log('Progress:', audit.progress.percentage + '%')
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Email Configuration

```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 📁 Project Structure

```
webapp/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── AuditForm.tsx   # Main audit form
│   │   ├── Dashboard.tsx   # Results dashboard
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── lib/                # Utility libraries
│   │   ├── github.ts       # GitHub API service
│   │   ├── email.ts        # Email service
│   │   ├── database.ts     # Data persistence
│   │   └── validation.ts   # Input validation
│   └── types/              # TypeScript definitions
├── .github/workflows/      # GitHub Actions
├── public/                 # Static assets
├── .env.example           # Environment template
└── package.json           # Dependencies
```

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `GITHUB_TOKEN`
   - `GITHUB_WEBHOOK_SECRET`
   - Email configuration variables

## 🔍 Monitoring

### Health Checks

```bash
# Application health
curl https://your-app.vercel.app/api/health

# Email service status
curl https://your-app.vercel.app/api/email/test
```

### Performance Monitoring

- Response times tracked automatically
- Error rates logged
- Audit completion metrics
- Email delivery statistics

## 🛡️ Security Features

- **Input Validation**: All user inputs sanitized and validated
- **Rate Limiting**: Prevents API abuse (5 requests/minute default)
- **GitHub Webhook Verification**: HMAC signature validation
- **Error Handling**: Comprehensive error boundaries
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Token Protection**: GitHub tokens never logged or exposed

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow Material-UI design patterns
- Add tests for new features
- Update documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Material-UI Team** - Beautiful React components
- **GitHub** - Actions platform and API
- **Vercel** - Excellent hosting platform
- **dev-mhany** - Original audit toolkit concept

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@your-domain.com

---

**Built with ❤️ by dev-mhany**

_Automated auditing for Next.js + Material-UI projects_
