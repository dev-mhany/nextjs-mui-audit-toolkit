# Deployment Guide

Complete guide to deploying the Next.js + MUI Audit Toolkit webapp.

## Overview

The webapp is a Next.js application that provides a web interface for triggering audits via GitHub App integration. It can be deployed to various platforms including Vercel, Netlify, AWS, or Docker containers.

## Prerequisites

- Node.js 18 or higher
- GitHub App configured and registered
- Domain name for production deployment
- SSL certificate (handled automatically by most platforms)

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file (or configure in your deployment platform):

```env
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_content_here
-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Application URLs
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database (optional - uses file-based storage by default)
DATABASE_URL=your_database_connection_string

# Email Configuration (optional)
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
EMAIL_FROM_ADDRESS=noreply@your-domain.com
EMAIL_FROM_NAME="dev-mhany Audit Bot"

# Security and Rate Limiting
GITHUB_API_RATE_LIMIT=5000
WEBHOOK_RATE_LIMIT=100

# Application Settings
NODE_ENV=production
LOG_LEVEL=info
AUDIT_DEFAULT_MIN_SCORE=85
AUDIT_MAX_RUNTIME_MINUTES=15
```

### Optional Environment Variables

```env
# GitHub OAuth (if using additional OAuth features)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Alternative Email Providers
# For SendGrid:
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key

# For Mailgun:
EMAIL_PROVIDER=mailgun
EMAIL_API_KEY=your_mailgun_api_key
EMAIL_DOMAIN=mg.your-domain.com

# Analytics (optional)
ANALYTICS_ID=your_analytics_id

# Monitoring (optional)
SENTRY_DSN=your_sentry_dsn
```

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

#### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Select the `webapp` directory as the root

#### Step 2: Configure Environment Variables

In your Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Ensure `NEXTAUTH_URL` matches your Vercel domain

#### Step 3: Deploy

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from webapp directory
cd webapp
vercel --prod
```

#### Vercel Configuration

Create `vercel.json` in the webapp directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Netlify

#### Step 1: Build Configuration

Create `netlify.toml` in the webapp directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

#### Step 2: Deploy

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd webapp
netlify deploy --prod
```

### AWS (EC2 + ALB)

#### Step 1: EC2 Instance Setup

```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone and setup
git clone <your-repo-url>
cd nextjs-mui-audit-toolkit/webapp
npm ci --production
npm run build
```

#### Step 2: PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'audit-webapp',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Start the application:

```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

#### Step 3: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

#### Dockerfile

The webapp includes a production-ready Dockerfile:

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  webapp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GITHUB_APP_ID=${GITHUB_APP_ID}
      - GITHUB_APP_PRIVATE_KEY=${GITHUB_APP_PRIVATE_KEY}
      - GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f webapp

# Update
docker-compose pull
docker-compose up -d
```

### Google Cloud Platform

#### App Engine

Create `app.yaml`:

```yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production
  GITHUB_APP_ID: "your_app_id"
  GITHUB_WEBHOOK_SECRET: "your_webhook_secret"
  NEXTAUTH_URL: "https://your-project.appspot.com"

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

Deploy:

```bash
gcloud app deploy
```

#### Cloud Run

```bash
# Build and push image
docker build -t gcr.io/your-project/audit-webapp .
docker push gcr.io/your-project/audit-webapp

# Deploy to Cloud Run
gcloud run deploy audit-webapp \
  --image gcr.io/your-project/audit-webapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

## Security Configuration

### Content Security Policy

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.github.com;
      frame-src 'none';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Rate Limiting

Configure rate limiting in production:

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Implement rate limiting logic
  const ip = request.ip ?? '127.0.0.1';
  
  // Rate limit API endpoints
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add rate limiting logic here
  }
  
  return NextResponse.next();
}
```

## Monitoring and Observability

### Health Checks

Create `/api/health`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection
    // Check GitHub API connectivity
    // Check other dependencies
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

### Logging

Configure structured logging:

```javascript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Database Setup

### File-based Storage (Default)

No additional setup required. Data is stored in the `data/` directory.

### PostgreSQL

```bash
# Install PostgreSQL adapter
npm install pg @types/pg

# Update DATABASE_URL
DATABASE_URL=postgresql://user:password@host:port/database
```

### MongoDB

```bash
# Install MongoDB adapter
npm install mongodb

# Update DATABASE_URL
DATABASE_URL=mongodb://user:password@host:port/database
```

## SSL/TLS Configuration

### Let's Encrypt (Certbot)

```bash
# Install certbot
sudo yum install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full mode)
4. Configure origin certificates

## Performance Optimization

### CDN Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Caching

```javascript
// Cache static assets
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

## Backup and Recovery

### Database Backup

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup_${DATE}.tar.gz" data/
aws s3 cp "backup_${DATE}.tar.gz" s3://your-backup-bucket/
```

### Automated Backups

```yaml
# .github/workflows/backup.yml
name: Backup
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup data
        run: |
          # Backup script here
```

## Troubleshooting

### Common Issues

1. **GitHub App Authentication Errors**
   - Verify APP_ID and private key
   - Check webhook secret
   - Ensure app permissions are correct

2. **Build Failures**
   - Verify Node.js version (18+)
   - Check environment variables
   - Clear node_modules and reinstall

3. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is running

4. **Performance Issues**
   - Enable caching
   - Optimize images
   - Use CDN for static assets

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm start

# Check application health
curl https://your-domain.com/api/health

# Monitor logs
tail -f logs/combined.log
```

This deployment guide covers the most common deployment scenarios. Choose the platform that best fits your infrastructure and requirements.