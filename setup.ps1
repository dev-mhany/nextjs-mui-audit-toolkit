# Next.js + MUI Audit Toolkit - Quick Setup Script (PowerShell)
# This script automates the initial setup and deployment process for Windows

param(
    [switch]$SkipBuild,
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Next.js + MUI Audit Toolkit - Quick Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

# Check prerequisites
Write-Host ""
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Cyan

# Check Node.js version
try {
    $nodeVersion = node --version
    $versionNumber = $nodeVersion.Substring(1)
    $majorVersion = [int]($versionNumber.Split('.')[0])
    
    if ($majorVersion -ge 18) {
        Write-Success "Node.js $nodeVersion (✓ >= 18.0.0)"
    } else {
        Write-Error "Node.js $nodeVersion found, but version 18+ required"
        Write-Host "Please upgrade Node.js: https://nodejs.org/"
        exit 1
    }
} catch {
    Write-Error "Node.js not found"
    Write-Host "Please install Node.js 18+: https://nodejs.org/"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion"
} catch {
    Write-Error "npm not found"
    exit 1
}

# Check git
try {
    $gitVersion = git --version
    Write-Success "$gitVersion"
} catch {
    Write-Warning "Git not found - you'll need it for deployment"
}

Write-Host ""
Write-Host "📦 Installing Dependencies..." -ForegroundColor Cyan

# Navigate to webapp directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$webappPath = Join-Path $scriptPath "webapp"

if (-not (Test-Path $webappPath)) {
    Write-Error "webapp directory not found at $webappPath"
    exit 1
}

Set-Location $webappPath

# Install dependencies
if (Test-Path "package-lock.json") {
    Write-Info "Using npm ci for clean install..."
    npm ci
} else {
    Write-Info "Using npm install..."
    npm install
}

Write-Success "Dependencies installed successfully"

Write-Host ""
Write-Host "⚙️ Setting up Environment..." -ForegroundColor Cyan

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Success "Created .env.local from template"
        Write-Warning "Please edit .env.local with your configuration"
    } else {
        Write-Error ".env.example not found"
    }
} else {
    Write-Success ".env.local already exists"
}

Write-Host ""
Write-Host "🔧 Configuration Required:" -ForegroundColor Yellow
Write-Host "1. Edit .env.local with your GitHub token:"
Write-Host "   GITHUB_TOKEN=ghp_your_token_here"
Write-Host "2. Set a secure webhook secret:"
Write-Host "   GITHUB_WEBHOOK_SECRET=your_secure_random_string"
Write-Host "3. Configure email settings (optional)"
Write-Host ""

# Check if we can build the project
if (-not $SkipBuild) {
    Write-Host "🏗️ Testing Build..." -ForegroundColor Cyan
    try {
        npm run build | Out-Null
        Write-Success "Build test successful"
    } catch {
        Write-Warning "Build test failed - check your configuration"
    }
}

Write-Host ""
Write-Host "🚀 Deployment Options:" -ForegroundColor Green
Write-Host "======================="
Write-Host ""
Write-Host "1. Vercel (Recommended):"
Write-Host "   npx vercel --prod"
Write-Host ""
Write-Host "2. Netlify:"
Write-Host "   npm run build; netlify deploy --prod --dir=.next"
Write-Host ""
Write-Host "3. Manual hosting:"
Write-Host "   npm run build; npm start"
Write-Host ""

# Check if Vercel CLI is available
try {
    vercel --version | Out-Null
    Write-Success "Vercel CLI available"
    
    if ($Deploy) {
        Write-Host ""
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
        vercel --prod
    } else {
        Write-Host ""
        $deployChoice = Read-Host "Deploy to Vercel now? (y/N)"
        if ($deployChoice -match "^[Yy]$") {
            Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
            vercel --prod
        }
    }
} catch {
    Write-Info "Install Vercel CLI: npm install -g vercel"
}

Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Green
Write-Host "=============="
Write-Host "1. Configure environment variables (.env.local)"
Write-Host "2. Set up GitHub repository secrets for CI/CD"
Write-Host "3. Deploy using your preferred method"
Write-Host "4. Test the application with a sample repository"
Write-Host ""
Write-Host "📖 For detailed instructions, see:"
Write-Host "   - README.md (webapp usage)"
Write-Host "   - DEPLOYMENT.md (deployment guide)"
Write-Host ""
Write-Success "Setup complete! 🎉"

# Open configuration files if requested
$openFiles = Read-Host "Open configuration files for editing? (y/N)"
if ($openFiles -match "^[Yy]$") {
    if (Test-Path ".env.local") {
        Start-Process notepad ".env.local"
    }
}