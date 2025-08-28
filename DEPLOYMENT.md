# Next.js + MUI Audit Toolkit - Deployment Guide

This guide covers deploying the Next.js + MUI Audit Toolkit web application using GitHub Actions and various hosting platforms.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Options](#deployment-options)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Netlify](#netlify)
   - [AWS Amplify](#aws-amplify)
   - [Docker Container](#docker-container)
5. [GitHub Actions Setup](#github-actions-setup)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Quick Start

For the fastest deployment to Vercel:

```bash
# 1. Clone and install dependencies
git clone <your-repo-url>
cd nextjs-mui-audit-toolkit/webapp
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Deploy to Vercel
npx vercel --prod
```

## Prerequisites

Before deploying, ensure you have:

### Required
- **Node.js 18+** - Runtime environment
- **GitHub Account** - For repository hosting and Actions
- **GitHub Personal Access Token** - For API access
  - Scopes required: `repo`, `workflow`
  - Create at: https://github.com/settings/tokens

### Optional (but recommended)
- **Vercel Account** - For hosting (free tier available)
- **Email Provider** - For audit notifications (Gmail, SendGrid, etc.)
- **Domain Name** - For custom URL

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:

### Required Variables

```env
# GitHub Integration
GITHUB_TOKEN=ghp_your_token_here
GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret_32_chars_min

# Application URL
NEXTAUTH_URL=https://your-app-domain.com
```

### Optional Variables

```env
# Email Notifications (Gmail example)
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_ADDRESS=noreply@your-domain.com
EMAIL_FROM_NAME=dev-mhany Audit Bot

# Rate Limiting
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=60000

# Logging
LOG_LEVEL=info
ENABLE_PERFORMANCE_MONITORING=true
```

## Deployment Options

### Vercel (Recommended)

Vercel provides the best Next.js deployment experience with zero configuration.

#### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret
   EMAIL_PROVIDER=smtp
   EMAIL_HOST=smtp.gmail.com
   # ... other variables
   ```

#### Method 2: CLI Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd webapp
   vercel --prod
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add GITHUB_TOKEN
   vercel env add GITHUB_WEBHOOK_SECRET
   # ... add other variables
   ```

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   cd webapp
   npm run build
   netlify deploy --prod --dir=.next
   ```

3. **Configure Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add all required variables from `.env.example`

### AWS Amplify

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize and Deploy**
   ```bash
   cd webapp
   amplify init
   amplify add hosting
   amplify publish
   ```

3. **Configure Environment Variables**
   - AWS Amplify Console → App Settings → Environment Variables
   - Add all required variables

### Docker Container

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t nextjs-mui-audit-toolkit .
   docker run -p 3000:3000 --env-file .env.local nextjs-mui-audit-toolkit
   ```

## GitHub Actions Setup

The repository includes GitHub Actions workflows for automated deployment.

### Workflow Files

- `.github/workflows/deploy-webapp.yml` - Main deployment workflow
- `.github/workflows/reference-audit.yml` - Audit execution workflow

### Required Secrets

Configure these in GitHub → Settings → Secrets and Variables → Actions:

```
GITHUB_TOKEN          # Your GitHub PAT
GITHUB_WEBHOOK_SECRET # Webhook validation secret
VERCEL_TOKEN          # Vercel deployment token
VERCEL_ORG_ID         # Your Vercel organization ID
VERCEL_PROJECT_ID     # Your Vercel project ID
```

### Required Variables

Configure these in GitHub → Settings → Secrets and Variables → Actions → Variables:

```
WEBAPP_WEBHOOK_URL    # Your deployed app URL (e.g., https://your-app.vercel.app)
```

### Setup Instructions

1. **Get Vercel Tokens**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and get tokens
   vercel login
   vercel link
   
   # Get organization and project IDs
   cat .vercel/project.json
   ```

2. **Configure GitHub Secrets**
   - Go to GitHub repository → Settings → Secrets and Variables → Actions
   - Add all required secrets and variables

3. **Enable Workflows**
   - Workflows are automatically enabled when you push the `.github/workflows/` files
   - Check the "Actions" tab in your GitHub repository

## Post-Deployment Configuration

### 1. Test the Application

```bash
# Test basic functionality
curl https://your-app-domain.com/api/health

# Test email configuration (if configured)
curl -X POST https://your-app-domain.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

### 2. Configure Webhooks (if needed)

If you need GitHub to call your app directly:

1. **Repository Settings**
   - Go to GitHub repository → Settings → Webhooks
   - Add webhook URL: `https://your-app-domain.com/api/audit/webhook`
   - Content type: `application/json`
   - Secret: Your `GITHUB_WEBHOOK_SECRET`
   - Events: Select "Workflow runs"

### 3. Custom Domain (Optional)

#### Vercel
```bash
vercel domains add your-domain.com
```

#### Netlify
- Dashboard → Domain Management → Add Custom Domain

### 4. SSL Certificate

Most platforms (Vercel, Netlify, Amplify) provide automatic SSL.

For custom setups:
```bash
# Using Certbot for Let's Encrypt
certbot --nginx -d your-domain.com
```

## Monitoring and Maintenance

### Health Checks

The application includes several health check endpoints:

```bash
# Application health
GET /api/health

# Email service status
GET /api/email/test

# Database connectivity (if applicable)
GET /api/db/status
```

### Logging

Configure logging levels via environment variables:

```env
LOG_LEVEL=info              # error, warn, info, debug
ENABLE_PERFORMANCE_MONITORING=true
DEBUG=nextjs-mui-audit-toolkit:*
```

### Performance Monitoring

Monitor key metrics:

- Response times
- Error rates
- Audit completion rates
- Email delivery rates

### Regular Maintenance

1. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor Logs**
   - Check Vercel Function Logs
   - Monitor error rates
   - Watch for failed audits

3. **Security Updates**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Update GitHub token if needed
   # Rotate webhook secrets periodically
   ```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Error**: `Module not found` or TypeScript errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

#### 2. Environment Variables Not Loading

**Error**: `GITHUB_TOKEN is undefined`

**Solutions**:
- Verify environment variables are set in deployment platform
- Check variable names (case-sensitive)
- Restart the application after adding variables

#### 3. GitHub API Rate Limits

**Error**: `API rate limit exceeded`

**Solutions**:
- Use authenticated GitHub token
- Implement rate limiting in application
- Consider using GitHub Apps for higher limits

#### 4. Email Delivery Issues

**Error**: `Email service connection failed`

**Solutions**:
```bash
# Test email configuration
curl -X GET https://your-app-domain.com/api/email/test

# Check email credentials
# For Gmail: Use App Passwords, not regular password
# Verify SMTP settings
```

#### 5. Webhook Signature Validation Failures

**Error**: `Invalid webhook signature`

**Solutions**:
- Verify `GITHUB_WEBHOOK_SECRET` matches in both places
- Check webhook payload format
- Ensure secret is properly configured

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=nextjs-mui-audit-toolkit:*
LOG_LEVEL=debug
```

### Support

For additional support:

1. **Check Application Logs**
   - Vercel: Function Logs in dashboard
   - Netlify: Function Logs in dashboard
   - Docker: `docker logs container-name`

2. **Verify Configuration**
   ```bash
   # Check environment variables
   curl https://your-app-domain.com/api/config/status
   ```

3. **Test Components Individually**
   ```bash
   # Test GitHub API
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user
   
   # Test email service
   curl -X POST https://your-app-domain.com/api/email/test \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

4. **Common Deployment Commands**
   ```bash
   # Redeploy (Vercel)
   vercel --prod
   
   # Check deployment status
   vercel ls
   
   # View logs
   vercel logs your-deployment-url
   ```

---

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Routes     │    │  GitHub Actions │
│   (Next.js+MUI) │────│  (Next.js API)   │────│   (Audit Bot)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Database       │    │   Email Service │
│                 │    │   (File-based)   │    │   (SMTP/etc)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

This deployment creates a complete auditing system that automatically processes repositories, runs comprehensive audits via GitHub Actions, and provides real-time feedback through a modern web interface.

The system is designed to be:
- **Scalable**: Uses GitHub Actions for processing
- **Secure**: Implements proper authentication and validation
- **Reliable**: Includes error handling and monitoring
- **User-friendly**: Provides clear feedback and notifications

For the best experience, deploy to Vercel with GitHub Actions for a fully automated, production-ready audit system.