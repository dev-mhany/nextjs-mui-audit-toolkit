# GitHub App Integration Setup

This guide explains how to set up the GitHub App integration for the dev-mhany audit toolkit, which provides enhanced security and better user experience compared to Personal Access Tokens.

## Benefits of GitHub App vs PAT

### ✅ GitHub App (Recommended)
- **Fine-grained permissions** per repository
- **Short-lived tokens** (no long-term storage)
- **Works with SSO** and branch protection
- **Revocable by repository owners**
- **Better audit trail** and security

### ⚠️ Personal Access Token (Fallback)
- Requires broad repository access
- Token stored during audit execution
- May not work with SSO restrictions
- Less secure overall

## Setting Up GitHub App

### 1. Create GitHub App

1. Go to your GitHub organization/personal settings
2. Navigate to **Developer settings** > **GitHub Apps**
3. Click **New GitHub App**

### 2. Configure GitHub App Settings

#### Basic Information
- **GitHub App name**: `dev-mhany-audit-toolkit`
- **Description**: `Automated Next.js + MUI audit toolkit for best practices analysis`
- **Homepage URL**: `https://your-domain.com`

#### Webhook
- **Webhook URL**: `https://your-domain.com/api/auth/github/callback`
- **Webhook secret**: Generate a random secret and save it
- **Active**: ✅ Checked

#### Permissions

Set the following **Repository permissions**:
- **Contents**: Read & Write (for creating audit reports)
- **Pull requests**: Write (for creating PRs with audit results)
- **Checks**: Write (for posting check run summaries)
- **Metadata**: Read (for basic repository info)
- **Actions**: Read (for monitoring workflow status)

#### Subscribe to events
- ✅ **Installation**
- ✅ **Installation repositories**
- ✅ **Pull request**
- ✅ **Check run**
- ✅ **Workflow run**

#### Where can this GitHub App be installed?
- **Any account** (recommended for public use)
- **Only on this account** (for private/testing)

### 3. Generate Private Key

1. After creating the app, scroll to **Private keys**
2. Click **Generate a private key**
3. Download the `.pem` file
4. Keep this file secure - you'll need its contents for environment variables

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_content_here
-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Other required settings...
```

### 5. Install the App

#### For Testing
1. Go to your GitHub App settings
2. Click **Install App** in the sidebar
3. Select repositories or install on all repositories
4. Complete the installation

#### For Users
1. Share your GitHub App installation URL:
   `https://github.com/apps/dev-mhany-audit-toolkit/installations/new`
2. Users can install it on their repositories

## Usage Flow

### 1. User Experience
1. User visits your audit website
2. Enters repository URL
3. Selects "GitHub App" authentication mode
4. If app isn't installed, gets "Install GitHub App" button
5. Completes installation on GitHub
6. Returns to your site to start audit

### 2. Technical Flow
1. User selects GitHub App mode
2. System checks if app is installed on target repository
3. If installed:
   - Creates short-lived installation token
   - Triggers repository dispatch event
   - Target repo runs audit workflow
   - Creates PR with audit results
4. If not installed:
   - Redirects to GitHub App installation
   - User installs app and returns

### 3. Audit Execution
1. Repository dispatch triggers `run-audit.yml` workflow
2. Workflow runs static analysis (secure, no code execution)
3. Generates audit reports in `/audit` directory
4. Creates PR with results
5. Posts check run summary
6. Uploads artifacts

## Workflow Files

### Reusable Workflow (Your Infrastructure)
`.github/workflows/audit-reusable.yml` - Triggers audits on target repositories

### Target Repository Workflow
`.github/workflows/run-audit.yml` - Executes the actual audit

Users need to add this workflow to their repositories, or it can be created automatically during the first audit.

## Security Considerations

### Safe by Design
- **Static analysis only** by default
- **No code execution** on PRs from forks
- **Sandboxed environment** in GitHub Actions
- **Rate limiting** and timeout protection
- **Input validation** and sanitization

### Branch Protection Compatibility
- Creates audit branch instead of pushing to main
- PRs work with branch protection rules
- Auto-merge only with explicit label
- Respects existing workflows and checks

### Secret Management
- No long-term token storage
- Installation tokens expire automatically
- Webhook signature verification
- Environment variable security

## Monitoring and Troubleshooting

### Webhook Events
Monitor webhook deliveries in your GitHub App settings:
- Installation events
- Repository access changes
- Pull request updates
- Check run status

### Common Issues

#### "App not installed" Error
- User hasn't installed the app on their repository
- Check installation permissions
- Verify app has access to target repository

#### "Permission denied" Error
- App permissions might be insufficient
- Check repository access in app installation
- Verify organization settings allow third-party apps

#### Webhook Not Receiving Events
- Check webhook URL is accessible
- Verify webhook secret matches
- Check firewall/proxy settings

### Debugging

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

Check webhook deliveries in GitHub App settings for detailed error messages.

## CLI Integration

The audit CLI script supports the new flow with enhanced flags:

```bash
# CI-friendly mode with machine-readable output
npx nextjs-mui-audit run --ci --min-score 85

# Static analysis only (safe for untrusted repos)
npx nextjs-mui-audit run --no-runtime --output ./audit

# Quick smoke test
npx nextjs-mui-audit run --smoke --min-score 70

# Exit codes:
# 0: Pass
# 1: Score below minimum
# 2: Critical issues found
# 3: Internal error
```

## Migration from PAT

To migrate existing PAT-based audits to GitHub App:

1. Set up GitHub App as described above
2. Update environment variables
3. Users can switch to "GitHub App" mode in the UI
4. Old PAT audits continue to work during transition
5. Gradually sunset PAT support

## Support

For issues with GitHub App integration:

1. Check the troubleshooting section
2. Review webhook delivery logs
3. Verify environment configuration
4. Check GitHub App permissions
5. Monitor application logs

The GitHub App provides a more secure, user-friendly experience while maintaining compatibility with existing workflows.