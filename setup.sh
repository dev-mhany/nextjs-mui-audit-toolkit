#!/bin/bash

# Next.js + MUI Audit Toolkit - Quick Setup Script
# This script automates the initial setup and deployment process

set -e  # Exit on any error

echo "🚀 Next.js + MUI Audit Toolkit - Quick Setup"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check prerequisites
echo
echo "📋 Checking Prerequisites..."

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_status "Node.js $NODE_VERSION (✓ >= 18.0.0)"
    else
        print_error "Node.js $NODE_VERSION found, but version 18+ required"
        echo "Please upgrade Node.js: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js not found"
    echo "Please install Node.js 18+: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_status "npm $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check git
if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_status "Git $GIT_VERSION"
else
    print_warning "Git not found - you'll need it for deployment"
fi

echo
echo "📦 Installing Dependencies..."

# Navigate to webapp directory
cd "$(dirname "$0")/webapp"

# Install dependencies
if [ -f "package-lock.json" ]; then
    print_info "Using npm ci for clean install..."
    npm ci
else
    print_info "Using npm install..."
    npm install
fi

print_status "Dependencies installed successfully"

echo
echo "⚙️  Setting up Environment..."

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_status "Created .env.local from template"
        print_warning "Please edit .env.local with your configuration"
    else
        print_error ".env.example not found"
    fi
else
    print_status ".env.local already exists"
fi

echo
echo "🔧 Configuration Required:"
echo "1. Edit .env.local with your GitHub token:"
echo "   GITHUB_TOKEN=ghp_your_token_here"
echo "2. Set a secure webhook secret:"
echo "   GITHUB_WEBHOOK_SECRET=your_secure_random_string"
echo "3. Configure email settings (optional)"
echo

# Check if we can build the project
echo "🏗️  Testing Build..."
if npm run build >/dev/null 2>&1; then
    print_status "Build test successful"
else
    print_warning "Build test failed - check your configuration"
fi

echo
echo "🚀 Deployment Options:"
echo "======================="
echo
echo "1. Vercel (Recommended):"
echo "   npx vercel --prod"
echo
echo "2. Netlify:"
echo "   npm run build && netlify deploy --prod --dir=.next"
echo
echo "3. Manual hosting:"
echo "   npm run build && npm start"
echo

# Check if Vercel CLI is available
if command -v vercel >/dev/null 2>&1; then
    print_status "Vercel CLI available"
    echo
    read -p "Deploy to Vercel now? (y/N): " deploy_choice
    if [[ $deploy_choice =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        vercel --prod
    fi
else
    print_info "Install Vercel CLI: npm install -g vercel"
fi

echo
echo "📚 Next Steps:"
echo "=============="
echo "1. Configure environment variables (.env.local)"
echo "2. Set up GitHub repository secrets for CI/CD"
echo "3. Deploy using your preferred method"
echo "4. Test the application with a sample repository"
echo
echo "📖 For detailed instructions, see:"
echo "   - README.md (webapp usage)"
echo "   - DEPLOYMENT.md (deployment guide)"
echo
print_status "Setup complete! 🎉"