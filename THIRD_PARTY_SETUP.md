# Third-Party Setup Instructions

This document provides step-by-step instructions for setting up the Next.js MUI Audit Toolkit with all required third-party services and environment variables.

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git
- A GitHub account with admin access to repositories you want to audit

## Environment Variables Setup

Create a `.env.local` file in the `webapp` directory with the following variables:

### Required Variables

```bash
# Database Configuration
DATABASE_PATH=./data/audit-toolkit.db

# GitHub Configuration (Required)
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_content_here
-----END RSA PRIVATE KEY-----"
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Security
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_min
NEXTAUTH_URL=http://localhost:3000
```

### Optional Variables (Choose one email provider)

```bash
# Email Configuration - Option 1: Gmail SMTP
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Configuration - Option 2: SendGrid
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Email Configuration - Option 3: Mailgun
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Email Configuration - Option 4: Resend
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key

# Default email settings
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Audit Toolkit
```

## Step-by-Step Setup Guide

### 1. GitHub App Setup

1. **Create a GitHub App:**
   - Go to GitHub Settings → Developer settings → GitHub Apps
   - Click "New GitHub App"
   - Fill in the required information:
     - **App name**: Your Audit Toolkit App
     - **Homepage URL**: `http://localhost:3000` (or your domain)
     - **Webhook URL**: `http://localhost:3000/api/webhooks/github`
     - **Webhook secret**: Generate a secure random string

2. **Set Permissions:**
   - Repository permissions:
     - Contents: Read
     - Metadata: Read
     - Pull requests: Read & Write
     - Issues: Read & Write
   - Account permissions:
     - Email addresses: Read

3. **Generate Private Key:**
   - Scroll down to "Private keys"
   - Click "Generate a private key"
   - Download the `.pem` file
   - Copy the entire content (including headers) to your `.env.local`

4. **Install the App:**
   - Go to the app's public page
   - Click "Install App"
   - Choose repositories to audit

### 2. Email Provider Setup (Choose One)

#### Option A: Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

#### Option B: SendGrid Setup

1. **Create SendGrid Account** at https://sendgrid.com
2. **Create API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Full Access"
   - Copy the key to your `.env.local`

```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
```

#### Option C: Mailgun Setup

1. **Create Mailgun Account** at https://www.mailgun.com
2. **Get API Credentials:**
   - Go to Domains → Select your domain
   - Copy API Key and Domain name

```bash
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-your_api_key_here
MAILGUN_DOMAIN=your-domain.mailgun.org
```

#### Option D: Resend Setup

1. **Create Resend Account** at https://resend.com
2. **Generate API Key:**
   - Go to API Keys → Create API Key
   - Copy the key to your `.env.local`

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
```

### 3. Security Configuration

#### Generate NextAuth Secret

```bash
# Generate a secure random string (32+ characters)
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

#### Generate Webhook Secret

```bash
# Generate webhook secret
openssl rand -hex 32
```

## Complete .env.local Template

```bash
# Database
DATABASE_PATH=./data/audit-toolkit.db

# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2ldPDi
[... your full private key content ...]
-----END RSA PRIVATE KEY-----"
GITHUB_CLIENT_ID=Iv1.your_client_id
GITHUB_CLIENT_SECRET=your_client_secret_40_chars
GITHUB_WEBHOOK_SECRET=your_webhook_secret_64_chars

# Security
NEXTAUTH_SECRET=your_super_secret_32_characters_min
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (choose one provider)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email defaults
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Audit Toolkit
```

## Installation and Build

### 1. Install Dependencies

```bash
# Install webapp dependencies
cd webapp
npm install

# Install CLI dependencies
cd ../audit\ script
npm install
```

### 2. Build the Application

```bash
# Build the webapp
cd webapp
npm run build
```

### 3. Start Development Server

```bash
# Start the webapp
cd webapp
npm run dev
```

The application will be available at http://localhost:3000

## Verification Steps

### 1. Test GitHub Integration

1. Navigate to http://localhost:3000
2. Click "Login with GitHub"
3. Authorize the application
4. Verify you can see your repositories

### 2. Test Email Configuration

The system will automatically test email configuration on startup. Check the console for any email provider connection errors.

### 3. Test Audit Functionality

1. Select a repository from the dashboard
2. Trigger an audit
3. Verify the audit completes and generates a report
4. Check that email notifications are sent (if configured)

## Troubleshooting

### Common Issues

#### GitHub Authentication Fails
- Verify your GitHub App ID and credentials
- Ensure the private key includes the full content with headers
- Check that the app is installed on the target repositories

#### Email Sending Fails
- Verify your email provider credentials
- For Gmail: Ensure you're using an App Password, not your regular password
- Check firewall settings for SMTP connections

#### Database Errors
- Ensure the `data` directory exists and is writable
- Check file permissions on the database path

#### Build Failures
- Verify all required environment variables are set
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript compilation errors

### Getting Help

1. Check the console output for detailed error messages
2. Verify all environment variables are correctly formatted
3. Ensure third-party services (GitHub App, email provider) are properly configured
4. Review the application logs for specific error details

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use strong, unique secrets** for all keys
3. **Rotate keys regularly**, especially in production
4. **Limit GitHub App permissions** to only what's needed
5. **Use environment-specific configurations** for different deployment stages

## Production Deployment

For production deployment:

1. Update `NEXTAUTH_URL` to your production domain
2. Use production-grade database solutions if needed
3. Configure proper HTTPS certificates
4. Set up monitoring and logging
5. Use secrets management services for sensitive values

---

## Support

If you encounter issues with this setup:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Review environment variable formatting
4. Test individual components (GitHub App, email provider) separately