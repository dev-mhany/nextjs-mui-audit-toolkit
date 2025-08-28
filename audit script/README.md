# Next.js + MUI Best-Practice Audit Toolkit v1.1.0

A comprehensive static analysis toolkit that scans Next.js projects using Material-UI (MUI) to enforce industry best practices, catch styling errors, and ensure code quality with line-level precision.

## 🚀 New in v1.1.0

### ⚡ Major Features Added

- **🔧 Auto-Fix Capabilities**: Automatically fix common issues like inline styles, missing alt text, and more
- **⚙️ Configuration System**: Fully customizable rules and settings via `audit.config.js`
- **💾 Performance Caching**: Smart caching system that speeds up subsequent audits by 50-80%
- **📊 Interactive HTML Reports**: Beautiful, interactive dashboard with charts and filtering
- **🎯 Enhanced CLI**: Modern CLI with subcommands, watch mode, and better UX
- **📝 Comprehensive Logging**: Detailed logging with different levels and error tracking
- **🧪 Full Test Coverage**: Unit tests, integration tests, and E2E testing
- **🔄 GitHub Actions**: Enhanced CI/CD workflow with automatic PR comments

### 🎨 Improved User Experience

- **Watch Mode**: Automatically re-run audits when files change during development
- **Dry-Run Mode**: Preview what fixes would be applied before making changes
- **Progress Indicators**: Real-time progress feedback during long operations
- **Better Error Messages**: Contextual error messages with suggested solutions
- **Cache Management**: Built-in cache inspection and management commands

## 🚀 Features

- **🚀 One-Command Setup**: Complete audit with automatic setup via `npx nextjs-mui-audit run`
- **Comprehensive Scanning**: Analyzes Next.js architecture, MUI usage, accessibility, performance, and security
- **Line-Level Precision**: Pinpoints exact line numbers for issues and violations
- **Automated Grading**: Provides A-F letter grades with detailed scoring breakdown
- **Multiple Output Formats**: Generates JSON, Markdown, and interactive HTML reports
- **Auto-Fix Capabilities**: Automatically fixes common issues like inline styles and missing alt text
- **Plugin System**: Extensible architecture with custom rules and community plugins
- **CI/CD Integration**: GitHub Actions workflow with automatic PR blocking
- **Performance Caching**: Smart caching system that speeds up subsequent audits by 50-80%
- **Manual Check Support**: Allows adding manual verification results for responsive design and accessibility
- **PWA Auditing**: Progressive Web App compliance checking and optimization recommendations

## 📋 What Gets Audited

### Next.js Architecture (20% weight)

- App Router vs Pages Router usage
- Server vs Client Components optimization
- Built-in Image and Font optimization
- Metadata API usage
- Navigation conventions

### MUI Usage (20% weight)

- sx prop vs inline styles
- Responsive design with breakpoints
- Theme usage and consistency
- Component selection (MUI vs HTML)
- Deprecated API detection

### Accessibility (15% weight)

- WCAG AA compliance
- Image alt attributes
- Button and form labels
- Semantic HTML usage
- ARIA attributes

### Responsive Design (15% weight)

- Mobile-first approach
- Breakpoint usage
- Fluid typography
- Viewport meta tags
- Fixed dimension detection

### Performance (10% weight)

- Bundle size optimization
- Code splitting
- Dynamic imports
- Client component optimization

### Security (5% weight)

- Secret detection
- XSS prevention
- Secure external links
- HTTP headers

### Code Quality (10% weight)

- ESLint compliance
- TypeScript strict mode
- Import organization
- Unused code detection

### Testing & Documentation (5% weight)

- Test coverage
- README quality
- Code documentation

## 🛠️ Installation

### 🚀 Quick Start (Recommended)

**No installation needed!** Just run directly:

```bash
# Run immediately in any Next.js + MUI project
npx nextjs-mui-audit run
```

The `run` command will automatically:

- Check your environment (Node.js 18+)
- Install any missing dependencies
- Set up the audit toolkit
- Run the complete audit

### 📁 Local Installation (For Development)

If you want to contribute or customize the toolkit:

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-mui-audit-toolkit

# Install dependencies
npm ci

# Run the comprehensive audit
npm run run
```

### 📦 Global Installation

```bash
# Install globally for easier access
npm install -g nextjs-mui-audit-toolkit

# Then use anywhere
nextjs-mui-audit run
```

## 📖 Usage

### 🚀 One-Command Setup and Audit (Recommended)

**The easiest way to audit your project:**

```bash
# Complete audit with automatic setup
npx nextjs-mui-audit run

# With options
npx nextjs-mui-audit run --fix --verbose
npx nextjs-mui-audit run --strict --min-score 90
npm run run  # If you've installed the package
```

**What the `run` command does:**

1. 🔍 **Environment Check** - Validates Node.js, Next.js, and MUI setup
2. 📦 **Auto-Install Dependencies** - Installs missing npm packages
3. ⚙️ **Load Configuration** - Reads audit.config.js or uses defaults
4. 🔌 **Load Plugins** - Automatically loads configured plugins
5. 💾 **Initialize Cache** - Sets up performance caching
6. 📁 **Prepare Output** - Creates audit directory
7. 🔍 **Run Full Audit** - ESLint, file scanning, PWA checks, runtime audits
8. 📊 **Calculate Grades** - Comprehensive scoring and grading
9. 🔧 **Auto-Fix Issues** - Fixes common problems (if --fix is used)
10. 📄 **Generate Reports** - Creates JSON, Markdown, and HTML reports
11. 🏁 **Show Summary** - Displays results and next steps

### ⚡ Quick Start Examples

```bash
# Basic audit - just run and get results
npx nextjs-mui-audit run

# Audit with auto-fixing
npx nextjs-mui-audit run --fix

# High-quality audit with strict requirements
npx nextjs-mui-audit run --strict --min-score 95

# Verbose output for debugging
npx nextjs-mui-audit run --verbose

# Skip dependency installation (if already installed)
npx nextjs-mui-audit run --skip-install

# Skip plugin loading (faster execution)
npx nextjs-mui-audit run --skip-plugins

# Audit specific directory
npx nextjs-mui-audit run --path ./src

# Custom output location
npx nextjs-mui-audit run --output ./my-audit-results
```

### 🏭 CI/CD Integration (New in v1.1.0)

The toolkit now includes enhanced CI/CD integration with proper exit codes and machine-readable output:

```bash
# CI mode - machine-readable JSON output with exit codes
npx nextjs-mui-audit run --ci --min-score 85

# Static analysis only (safe for untrusted repositories)
npx nextjs-mui-audit run --no-runtime --output ./audit

# Quick smoke test for basic validation
npx nextjs-mui-audit run --smoke --min-score 70

# Combined CI flags for maximum safety
npx nextjs-mui-audit run --ci --no-runtime --smoke
```

#### Exit Codes for CI/CD

- **0**: Audit passed all checks
- **1**: Score below minimum threshold
- **2**: Critical issues found (in strict mode)
- **3**: Internal error or execution failure

#### CI Mode Output

With `--ci` flag, the toolkit outputs machine-readable JSON to stdout:

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
    "accessibility": { "score": 88, "weight": 15 }
  },
  "thresholds": {
    "minScore": 85,
    "failOnCritical": false
  }
}
```

### 🔒 Security-First Static Analysis

For maximum security when auditing untrusted repositories:

```bash
# Static analysis only - no code execution
npx nextjs-mui-audit run --no-runtime

# Combined with CI mode for automated pipelines
npx nextjs-mui-audit run --ci --no-runtime --min-score 80
```

### 📋 Individual Commands (Advanced Usage)

If you need more control, you can run individual commands:

```bash
# Basic audit (no setup)
npm run audit

# Auto-fix specific issues
npx nextjs-mui-audit fix --dry-run
npx nextjs-mui-audit fix --rules "mui/inline-styles,next/image-usage"

# Plugin management
npx nextjs-mui-audit plugin --list
npx nextjs-mui-audit plugin --load-dir ./plugins

# Utility commands
npx nextjs-mui-audit rules --category mui --fixable
npx nextjs-mui-audit cache --info
npx nextjs-mui-audit doctor  # Check environment
npx nextjs-mui-audit init --output ./my-config.js
```

### 🔌 Plugin System

**Extend the audit toolkit with custom rules:**

```bash
# Load plugins automatically via configuration
# Edit audit.config.js:
export default {
  plugins: [
    './plugins/accessibility-plus',
    './plugins/performance-plus',
    '@company/custom-rules'
  ]
}

# Then run audit (plugins load automatically)
npx nextjs-mui-audit run

# Manual plugin management
npx nextjs-mui-audit plugin --list
npx nextjs-mui-audit plugin --load ./my-plugin.js
npx nextjs-mui-audit plugin --info accessibility-plus
```

**Built-in plugins included:**

- 🎨 **Accessibility Plus** - Advanced WCAG compliance checks
- ⚡ **Performance Plus** - Bundle optimization and performance monitoring

**Create custom plugins:** See [Plugin Development Guide](docs/PLUGIN_DEVELOPMENT.md)

## 🎆 Example Output

Here's what you'll see when running the comprehensive audit:

```bash
$ npx nextjs-mui-audit run

🚀 Next.js + MUI Comprehensive Audit

🔍 Step 1: Environment Check
🏁 Environment ready

📦 Step 2: Installing Dependencies
  ✓ Dependencies already installed
  ✓ All dependencies satisfied

⚙️ Step 3: Loading Configuration
✓ Configuration loaded successfully

🔌 Step 4: Loading Plugins
  🔌 Loading 2 configured plugins...
  ✓ Loaded 2/2 plugins
    Loaded plugins:
    • @audit-toolkit/accessibility-plus v1.0.0
    • @audit-toolkit/performance-plus v1.0.0

💾 Step 5: Initializing Cache
✓ Cache initialized

📁 Step 6: Preparing Output Directory
✓ Output directory ready: audit

🔍 Step 7: Running Comprehensive Audit
  🔧 Running ESLint analysis...
  🔍 Scanning project files...
  📱 Running PWA audit...
  🎢 Running runtime audits...

📊 Step 8: Calculating Grades
✓ Overall Score: 87/100 (B)

📄 Step 10: Generating Reports
✓ Reports generated in audit

🏁 Audit Summary:
   📁 Project: .
   📊 Overall Score: 87/100 (B)
   🔴 Critical Issues: 2
   📄 Reports: audit
   ⏱️ Duration: 12s

✅ Audit PASSED! 🎉
Your project meets the quality standards.

📄 Next Steps:
  • View detailed report: open audit/REPORT.html
  • Run in watch mode: npx nextjs-mui-audit run --watch
  • Fix issues: npx nextjs-mui-audit fix
```

### 📊 Report Formats

The toolkit now generates multiple report formats:

- **JSON Report** (`audit/report.json`) - Machine-readable for CI/CD
- **Markdown Report** (`audit/REPORT.md`) - Human-readable detailed analysis
- **HTML Report** (`audit/report.html`) - Interactive dashboard with charts
- **Fix Report** (`FIX_REPORT.md`) - Summary of auto-applied fixes

### 🚀 Performance Features

```bash
# Caching is automatic with the run command
npx nextjs-mui-audit run  # Uses cache for faster execution

# Disable caching if needed
npx nextjs-mui-audit run --no-cache

# Clear cache before running
npx nextjs-mui-audit run --clear-cache

# Check cache statistics
npx nextjs-mui-audit cache --stats

# Clear cache manually
npx nextjs-mui-audit cache --clear
```

### Advanced Accessibility & i18n Testing

```bash
# Check theme color contrast ratios
npm run check:contrast /path/to/project

# Test keyboard navigation and focus management
npm run test:keyboard

# Run all accessibility tests
npm run test:a11y
```

### Manual Checks

```bash
# Add responsive design test result
npm run audit:manual "/homepage" responsive pass "Tested at 320px, 768px, 1024px, 1440px"

# Add accessibility test result
npm run audit:manual "/dashboard" accessibility fail "Missing alt text on chart images"

# Add performance test result
npm run audit:manual "/forms" performance partial "Lighthouse score 85, needs optimization"
```

### Command Line Options

```bash
npm run audit -- --help

Options:
  -p, --path <path>        Path to project directory (default: ".")
  -o, --output <dir>       Output directory for reports (default: "audit")
  --strict                 Fail on any critical issues (default: false)
  --min-score <score>      Minimum acceptable score 0-100 (default: "85")
  -h, --help              Display help for command
```

## 📊 Output

The toolkit generates two types of reports:

### 1. JSON Report (`audit/report.json`)

Machine-readable format containing:

- File-by-file analysis with line numbers
- Issue categorization and severity
- Scoring breakdown by category
- ESLint integration results

### 2. Markdown Report (`audit/REPORT.md`)

Human-readable format with:

- Executive summary and overall grade
- Top issues to fix
- File-by-file breakdown
- Manual check templates
- Fix recommendations

## 🔍 Example Output

```
🔍 Next.js + MUI Audit Toolkit
Scanning project at: ./my-nextjs-app

📋 Running ESLint analysis...
🔍 Scanning for custom rule violations...
📊 Calculating grades...
📝 Generating reports...

✅ Audit completed successfully!
📊 Overall Score: 87/100 (B)
📁 Reports saved to: audit/
🎉 Audit passed all checks!
```

## 🔍 Comprehensive Test Coverage

The toolkit performs hundreds of automated tests across all aspects of your Next.js + MUI project. Here's what gets tested:

### 🚀 Next.js Architecture Tests

- **App Router vs Pages Router**: Detects router usage patterns and migration opportunities
- **Client/Server Components**: Identifies unnecessary "use client" directives and optimization opportunities
- **Image Optimization**: Checks for proper Next.js Image component usage vs standard img tags
- **Font Optimization**: Validates Next.js font loading strategies
- **Navigation**: Analyzes routing patterns and Link component usage
- **Metadata API**: Checks for proper meta tag implementation
- **Head Usage**: Identifies proper document head management
- **SSR Hydration Sanity**: Prevents hydration mismatches by detecting non-deterministic values in server-rendered components

### 🎨 MUI Usage Tests

- **Inline Styles**: Detects inline styles that should use MUI sx prop
- **Responsive Design**: Validates breakpoint usage and responsive patterns
- **Theme Integration**: Checks for proper theme usage vs hardcoded values
- **Theme Token Enforcement**: Prevents hardcoded colors and spacing values, enforces theme.palette.\* and theme.spacing() usage
- **Import Guards**: Prevents bundle bloat by enforcing named imports for MUI icons and specific lodash imports
- **Component Selection**: Identifies when to use MUI vs HTML components
- **Deprecated APIs**: Detects usage of deprecated MUI components and props
- **SSR Setup**: Validates MUI server-side rendering configuration
- **Font Strategy**: Checks MUI font loading and optimization

### ♿ Accessibility Tests

- **WCAG AA Compliance**: Comprehensive accessibility rule checking
- **Image Alt Text**: Ensures all images have proper alt attributes
- **Button Labels**: Validates button accessibility and labeling
- **Form Labels**: Checks form field accessibility
- **Semantic HTML**: Identifies proper HTML structure usage
- **ARIA Attributes**: Validates ARIA implementation
- **Color Contrast**: Checks for sufficient color contrast ratios
- **Keyboard Navigation**: Ensures keyboard accessibility
- **Screen Reader Support**: Validates screen reader compatibility
- **Theme Color Contrast**: Validates theme palette colors meet WCAG AA standards
- **Keyboard Traps**: Prevents focus traps in modals and dialogs
- **Focus Management**: Ensures proper focus flow in forms and interactive elements

### 📱 Responsive Design Tests

- **Mobile-First Approach**: Checks for mobile-first CSS patterns
- **Breakpoint Usage**: Validates responsive breakpoint implementation
- **Fluid Typography**: Ensures scalable text sizing
- **Viewport Meta Tags**: Checks proper viewport configuration
- **Fixed Dimensions**: Identifies non-responsive sizing issues
- **Touch Targets**: Validates mobile touch target sizes

### ⚡ Performance Tests

- **Bundle Size**: Analyzes JavaScript bundle optimization
- **Code Splitting**: Checks for proper dynamic imports
- **Client Component Optimization**: Identifies unnecessary client-side code
- **Expensive Operations**: Detects performance bottlenecks
- **Memoization**: Checks for proper React optimization
- **Dependency Arrays**: Validates useEffect and useMemo dependencies
- **Tree Shaking**: Ensures proper tree-shaking setup
- **Dynamic Imports**: Checks for code splitting opportunities

#### 6) Performance pragmatics

##### 6.1 RSC boundaries

- **Rule**: If a file is a Server Component (no "use client" at the top), disallow:
  - Client-only hooks: `useEffect`, `useLayoutEffect`
  - Browser globals: `window`, `document`, `localStorage`, `sessionStorage`
  - Client-heavy libraries in RSC: `framer-motion`, `react-hot-toast`, `swiper`, `chart.js`, `@mui/x-*`
- **Guidance**: Prefer a small client wrapper component with `"use client"`. Using `dynamic(() => import(...), { ssr: false })` is allowed but reported as a warning and should be a last resort.

What triggers a finding:

- RSC file using the above hooks/globals/imports → error
- `dynamic(..., { ssr: false })` usage → warning with remediation hint

##### 6.2 Bundle composition guard

- **Build stats**: Tries `NEXTJS_STATS=true next build`; falls back to parsing `.next/build-manifest.json`.
- **Budgets**:
  - Fail if any page’s first-load JS > 180 KB
  - Fail if any chunk grows > 10% vs saved baseline
- **Baseline**: On first run, writes `.audit-baselines/bundle-baseline.json`. Subsequent runs compare sizes.
- **How it runs**: Automatically during `npm run audit` as part of runtime audits.

Optional setup for detailed stats:

```js
// next.config.js (optional)
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true })
module.exports = withBundleAnalyzer({
  /* your config */
})
```

Manual build to refresh stats:

```bash
NEXTJS_STATS=true npm run build
```

### 🔒 Security Tests

- **Secret Detection**: Scans for exposed credentials and secrets
- **XSS Prevention**: Identifies potential XSS vulnerabilities
- **External Links**: Checks for secure external link handling
- **Dangerous HTML**: Detects unsafe HTML usage
- **SQL Injection**: Identifies potential injection vulnerabilities
- **Authentication**: Checks authentication implementation
- **Headers Configuration**: Validates security headers
- **Mixed Content**: Detects HTTP/HTTPS mixed content issues

### 🧹 Code Quality Tests

- **ESLint Compliance**: Runs comprehensive linting rules
- **TypeScript Strict Mode**: Enforces strict type checking
- **Import Organization**: Validates import structure and order
- **Unused Code**: Detects dead code and unused imports
- **Function Complexity**: Identifies overly complex functions
- **File Size**: Checks for oversized files
- **Component Structure**: Validates React component patterns
- **Hook Rules**: Ensures proper React hooks usage
- **Prop Types**: Checks for proper prop validation
- **Error Boundaries**: Identifies missing error handling

### 🧪 Testing & Documentation Tests

- **Test Coverage**: Checks for comprehensive testing
- **Component Testing**: Validates component test implementation
- **Documentation Quality**: Assesses README and code documentation
- **Code Comments**: Checks for proper code documentation

### 🌐 SEO Tests

- **Meta Tags**: Validates meta tag implementation
- **Open Graph Tags**: Checks social media optimization
- **Title Tags**: Ensures proper page titles
- **Structured Data**: Validates JSON-LD implementation
- **Internal Linking**: Checks for proper internal link structure
- **Sitemap**: Identifies sitemap configuration

### 🌍 Internationalization (i18n) Tests

- **RTL Support**: Validates Right-to-Left language support configuration
- **MUI RTL Cache**: Checks for proper RTL cache setup with stylis plugins
- **HTML Direction**: Ensures RTL HTML dir attribute support
- **Theme Direction**: Validates theme direction switching capabilities

### 📱 PWA Tests

- **Manifest File**: Checks for PWA manifest.json existence and content
- **Service Worker**: Validates service worker implementation
- **Offline Support**: Checks offline functionality
- **Head Tags**: Validates PWA-specific meta tags
- **Icon Sizes**: Ensures proper icon dimensions
- **Theme Colors**: Checks PWA theme configuration
- **Display Mode**: Validates PWA display settings
- **Workbox Recipes**: Validates runtime caching strategies (NetworkFirst, CacheFirst, StaleWhileRevalidate)
- **Navigation Preload**: Checks for enabled navigation preload in service worker
- **Offline Fallback**: Validates offline route configuration
- **Notification Prompts**: Ensures notification permissions are gated behind user interaction
- **Maskable Icons**: Validates icon composition and edge padding for proper masking

### 🏗️ Modern React Tests

- **Error Boundaries**: Checks for proper error handling
- **Suspense Usage**: Validates React Suspense implementation
- **Context Usage**: Identifies proper React Context patterns

### 🔄 Runtime Tests

- **Lighthouse CI**: Performance budgets, accessibility scores, Core Web Vitals
- **Playwright + Axe**: WCAG AA compliance, keyboard navigation, color contrast
- **JavaScript Coverage**: Bundle size analysis, unused code detection, coverage thresholds
- **Bundle Optimization**: Resource size monitoring, tree shaking validation
- **Custom Hooks**: Validates custom hook implementation
- **Component Naming**: Ensures proper component naming conventions

#### Opinionated default thresholds

- **Performance (Lighthouse)**: ≥ 0.90
- **Accessibility (Lighthouse)**: ≥ 0.95
- **Best Practices (Lighthouse)**: ≥ 0.95
- **First-load JS per route**: ≤ 180 KB
- **Unused JS on first load**: ≤ 60%
- **Core Web Vitals (lab)**: LCP ≤ 2.5s, CLS ≤ 0.1, INP (proxy) ≤ 200ms
- **Security**: CSP present with nonces/hashes and HSTS enabled
- **Accessibility (critical flows)**: 0 axe violations

### 📦 Build & Bundle Tests

- **Tree Shaking**: Validates proper tree-shaking setup
- **Dynamic Imports**: Checks for code splitting opportunities
- **Bundle Analysis**: Analyzes bundle composition
- **Import Optimization**: Identifies import optimization opportunities

### 🎯 Core Web Vitals Tests

- **Largest Contentful Paint (LCP)**: Performance optimization checks
- **First Input Delay (FID)**: Interactivity optimization
- **Cumulative Layout Shift (CLS)**: Visual stability validation

### 📁 Project Structure Tests

- **Public Folder Organization**: Validates asset organization
- **File Naming Conventions**: Checks for consistent naming
- **Directory Structure**: Validates project organization
- **Import Paths**: Checks for clean import structures

## 🔧 Configuration

### Advanced PWA Testing

The toolkit includes comprehensive PWA testing beyond basic "it installs" functionality:

#### 🚀 Workbox Recipe Verification

Advanced runtime caching strategy validation:

```javascript
// next.config.js - Required configuration
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'pages', networkTimeoutSeconds: 3 }
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'static-resources' }
    },
    {
      urlPattern: ({ url }) => url.origin === self.location.origin,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'same-origin' }
    }
  ],
  fallbacks: { document: '/offline' }
})
```

**What Gets Tested:**

- ✅ **NetworkFirst**: For navigation requests (pages)
- ✅ **CacheFirst**: For static resources (`/_next/static/*`)
- ✅ **StaleWhileRevalidate**: For same-origin requests
- ✅ **Offline Fallback**: Proper `/offline` route configuration

#### 🎯 Service Worker Best Practices

Advanced service worker validation:

```javascript
// sw.js - Required features
registration.navigationPreload.enable() // ✅ Navigation preload enabled

// ✅ Offline route present and styled
// ✅ Don't prompt for notifications on first paint (gate behind click)
```

**Validation Checks:**

- **Navigation Preload**: `registration.navigationPreload.enable()`
- **Offline Route**: `/offline` route presence and styling
- **Notification Gates**: Permission prompts only after user interaction

#### 🖼️ Maskable Icon Validation

Basic icon naming and presence validation:

**What Gets Validated:**

- **Icon Presence**: 512x512 PWA icons exist in public folder
- **Naming Convention**: Proper naming for maskable icons (e.g., maskable-512.png)
- **File Format**: PNG format for best PWA compatibility

**Icon Requirements:**

- **Size**: 512x512px minimum
- **Format**: PNG format
- **Naming**: Clear naming convention (e.g., maskable-512.png)
- **Location**: Placed in public folder for Next.js serving

### ESLint Configuration

The toolkit includes a comprehensive `.eslintrc.cjs` with:

- Next.js specific rules
- MUI best practices
- Accessibility guidelines
- TypeScript strict mode
- Import organization

### Prettier Configuration

`.prettierrc` ensures consistent code formatting:

- Single quotes
- No semicolons
- 2-space indentation
- 100 character line length

### TypeScript Configuration

`tsconfig.json` enforces:

- Strict type checking
- Modern ES2020 features
- Path aliases for clean imports
- Next.js integration

### 🎨 MUI Theme-Token Enforcement

The toolkit includes a custom rule that enforces MUI theme token usage instead of hardcoded values:

**What It Catches:**

- ❌ `sx={{ color: '#ff0000' }}` → ✅ `sx={{ color: 'error.main' }}`
- ❌ `sx={{ margin: '16px' }}` → ✅ `sx={{ margin: 2 }}` (theme.spacing(2))
- ❌ `sx={{ padding: '24px' }}` → ✅ `sx={{ padding: 3 }}` (theme.spacing(3))
- ❌ `sx={{ backgroundColor: 'rgb(0, 0, 255)' }}` → ✅ `sx={{ backgroundColor: 'primary.main' }}`

**Benefits:**

- **Consistency**: All colors and spacing use the same design tokens
- **Maintainability**: Change theme values in one place
- **Accessibility**: Ensures proper color contrast ratios
- **Responsiveness**: Spacing scales automatically with theme
- **Brand Compliance**: Enforces design system consistency

### 📦 MUI Import Guards

The toolkit includes a critical rule that prevents bundle bloat by enforcing proper import patterns:

**What It Catches:**

- ❌ `import * from "@mui/icons-material"` → ✅ `import { Add, Edit, Delete } from "@mui/icons-material"`
- ❌ `import Icons from "@mui/icons-material"` → ✅ `import { Add, Edit, Delete } from "@mui/icons-material"`
- ❌ `import _ from "lodash"` → ✅ `import pick from "lodash/pick", import debounce from "lodash/debounce"`

**Bundle Size Impact:**

- **Wildcard MUI imports**: Can add 100KB+ to your bundle
- **Lodash default import**: Imports entire library (~70KB) instead of specific functions (~2-5KB each)
- **Tree shaking**: Named imports enable proper tree shaking and code splitting

**Performance Benefits:**

- **Faster loading**: Smaller initial bundle size
- **Better caching**: More granular caching strategies
- **Reduced memory**: Only load what you actually use
- **Faster builds**: Less code to process during compilation

### 🔄 SSR Hydration Sanity

The toolkit includes a critical rule that prevents SSR hydration mismatches:

### ♿ Advanced Accessibility & i18n Testing

The toolkit includes comprehensive accessibility and internationalization testing beyond basic WCAG compliance:

#### 🎨 Theme Color Contrast Validation

Advanced color contrast checking using WCAG standards:

```bash
# Check theme color contrast ratios
npm run check:contrast /path/to/project
```

**What Gets Validated:**

- **WCAG AA Compliance**: Normal text (4.5:1), Large text (3.0:1)
- **Theme Palette Colors**: Automatic detection of MUI theme colors
- **Color Pair Analysis**: Foreground/background combinations
- **Contrast Ratios**: Precise calculations using relative luminance

**Requirements:**

- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3.0:1 contrast ratio (≥24px or ≥19px bold)
- **Theme Integration**: Uses theme.palette colors for consistency

#### ⌨️ Keyboard & Focus Health

Comprehensive keyboard navigation testing:

```bash
# Test keyboard navigation and focus management
npm run test:keyboard
```

**What Gets Tested:**

- **Modal Focus Traps**: Ensures focus stays within modals/dialogs
- **Tab Navigation**: Validates proper Tab and Shift+Tab flow
- **Escape Key**: Checks modal closing with Escape key
- **Form Focus**: Tests focus management in forms
- **Skip Links**: Validates skip link functionality

**Keyboard Requirements:**

- **No Focus Traps**: Focus must be able to enter and exit modals
- **Escape Functionality**: Modals must close with Escape key
- **Tab Order**: Logical tab sequence through interactive elements
- **Skip Navigation**: Skip links must work for keyboard users

#### 🌍 RTL & MUI Setup Validation

Right-to-Left language support validation:

```javascript
// Required RTL configuration
import createCache from '@emotion/cache'
const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [rtlPlugin]
})
```

**What Gets Validated:**

- **RTL Cache**: MUI RTL cache configuration
- **Stylis Plugins**: RTL plugin integration
- **HTML Direction**: RTL HTML dir attribute support
- **Theme Direction**: Direction switching capabilities

**RTL Requirements:**

- **Cache Configuration**: Proper RTL cache setup
- **Plugin Integration**: RTL stylis plugin enabled
- **HTML Support**: `<Html dir="rtl">` capability
- **Style Compatibility**: Styles don't break in RTL mode

### 🔄 SSR Hydration Sanity

The toolkit includes a critical rule that prevents SSR hydration mismatches:

**What It Catches:**

- ❌ `Math.random()` → ✅ Use stable seed or move to useEffect
- ❌ `Date.now()` → ✅ Use stable timestamp or move to useEffect
- ❌ `new Date()` → ✅ Use stable timestamp or move to useEffect
- ❌ `crypto.randomUUID()` → ✅ Use stable ID or move to useEffect
- ❌ `Math.floor(Math.random())` → ✅ Use stable seed or move to useEffect

**Hydration Mismatch Impact:**

- **Server/Client Mismatch**: Different content rendered on server vs client
- **Console Errors**: "Hydration failed" warnings in browser console
- **Poor UX**: Content flickering and layout shifts
- **SEO Issues**: Inconsistent server-rendered content
- **Performance**: Re-rendering and wasted computation

**Best Practices:**

- **Stable Values**: Use props or environment variables for consistent rendering
- **Client-Only Logic**: Move non-deterministic code to useEffect
- **Conditional Rendering**: Use dynamic imports for client-specific features
- **Seed Generation**: Use stable seeds for random values when needed

## 🚀 CI/CD Integration

### GitHub Actions

The included workflow (`.github/workflows/audit.yml`):

- Runs on every PR and push
- Blocks merges with critical issues
- Comments PRs with audit results
- Uploads reports as artifacts

### Local CI

```bash
# Pre-commit hook (add to package.json)
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run audit -- --strict"
    }
  }
}
```

## 📁 Project Structure

```
nextjs-mui-audit-toolkit/
├── src/
│   ├── index.js              # Main entry point
│   ├── scanner.js            # File scanning and rule checking
│   ├── rules.js              # Custom rule definitions
│   ├── eslint-runner.js      # ESLint integration
│   ├── grader.js             # Scoring and grading system
│   ├── grade-config.js       # Scoring weights and configuration
│   ├── reporter.js           # Report generation
│   ├── reporter-fixed.js     # Fixed version of reporter
│   ├── pwa-scanner.js        # PWA-specific auditing
│   ├── manual-check.js       # Manual verification utility
│   └── utils.js              # Utility functions
├── scripts/
│   └── pwa-audit.mjs        # PWA audit script
├── tests/
│   ├── a11y.spec.ts         # Accessibility tests (Playwright + Axe)
│   └── coverage.spec.ts     # JavaScript coverage tests
├── lighthouse/
│   └── budgets.json         # Performance budgets
├── examples/
│   └── sample-project/       # Sample project for testing
├── .eslintrc.cjs             # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tsconfig.json             # TypeScript configuration
├── lighthouserc.json         # Lighthouse CI configuration
├── playwright.config.ts      # Playwright test configuration
├── package.json              # Dependencies and scripts
├── test-audit.js            # Test script for the toolkit
├── QUICKSTART.md            # Quick start guide
└── .github/workflows/       # CI/CD workflows
```

## 🎯 Best Practices

### Quick Wins

1. **Fix critical issues first** - These block deployment
2. **Replace inline styles** - Use MUI sx prop
3. **Add missing alt text** - Essential for accessibility
4. **Use Next.js Image** - Performance optimization

### Medium Priority

1. **Update deprecated APIs** - Migrate to modern patterns
2. **Improve responsive design** - Add breakpoint props
3. **Clean up lint errors** - Improve code quality

### Long-term

1. **Add comprehensive testing** - Unit and E2E tests
2. **Optimize bundle size** - Dynamic imports
3. **Enhance documentation** - README and component docs

## 🔍 Custom Rules

Add custom rules in `src/rules.js`:

```javascript
{
  id: 'custom/rule-name',
  category: 'custom',
  severity: 'warning',
  message: 'Custom rule message',
  pattern: /regex-pattern/,
  suggestion: 'How to fix this issue'
}
```

### 🎨 MUI Theme-Token Enforcement Rule

The toolkit includes a sophisticated custom rule for MUI theme token enforcement:

```javascript
{
  id: 'mui/theme-token-enforcement',
  category: 'mui',
  severity: 'warning',
  message: 'Hardcoded colors and spacing detected - use theme tokens instead',
  pattern: /(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|\b\d+(\.\d+)?px\b)/i,
  checkFunction: (content, lines, filePath) => {
    // Advanced pattern matching for colors and spacing
    // Detects hex, RGB, HSL colors and pixel/rem/em values
    // Only flags values in sx or style props
    // Provides specific suggestions for theme tokens
  }
}
```

**Advanced Features:**

- **Smart Detection**: Only flags hardcoded values in `sx` or `style` props
- **Pattern Recognition**: Detects hex, RGB, HSL colors and various spacing units
- **Context Awareness**: Identifies spacing-related properties (margin, padding, gap, etc.)
- **Line-Level Precision**: Reports exact line and column numbers
- **Actionable Suggestions**: Provides specific theme token replacements

### 📦 MUI Import Guards Rule

The toolkit includes a critical rule for preventing bundle bloat:

```javascript
{
  id: 'mui/import-guards',
  category: 'mui',
  severity: 'error',
  message: 'Import guards to prevent bundle bloat - use named imports only',
  pattern: /import\s+(?:\*|Icons?|_)\s+from\s+["']@mui\/icons-material["']|import\s+_\s+from\s+["']lodash["']/,
  checkFunction: (content, lines, filePath) => {
    // Advanced import pattern detection
    // Flags wildcard imports from MUI icons
    // Flags default imports from lodash
    // Provides specific import suggestions
  }
}
```

**Advanced Features:**

- **Bundle Protection**: Prevents importing entire libraries unnecessarily
- **Smart Detection**: Identifies problematic import patterns with precision
- **Performance Focus**: Flags imports that significantly impact bundle size
- **Actionable Guidance**: Provides exact replacement import statements
- **Critical Severity**: Treated as errors since they impact performance

### 🔄 SSR Hydration Sanity Rule

The toolkit includes a critical rule for preventing hydration mismatches:

```javascript
{
  id: 'nextjs/ssr-hydration-sanity',
  category: 'nextjs',
  severity: 'error',
  message: 'SSR hydration mismatch detected - non-deterministic values in server-rendered components',
  pattern: /(Math\.random\(\)|Date\.now\(\)|new Date\(\)|crypto\.randomUUID\(\)|Math\.floor\(Math\.random\(\))/,
  checkFunction: (content, lines, filePath) => {
    // Advanced pattern detection for non-deterministic values
    // Flags Math.random(), Date.now(), new Date(), crypto.randomUUID()
    // Provides specific suggestions for stable alternatives
  }
}
```

**Advanced Features:**

- **Hydration Protection**: Prevents server/client rendering mismatches
- **Smart Detection**: Identifies non-deterministic patterns with precision
- **Context Awareness**: Skips comments and console statements
- **Actionable Guidance**: Provides specific alternatives and best practices
- **Critical Severity**: Treated as errors since they cause hydration failures

## 📈 Scoring System

- **A (90-100):** Excellent - Ready for production
- **B (80-89):** Good - Minor improvements needed
- **C (70-79):** Fair - Several issues to address
- **D (60-69):** Poor - Significant work required
- **F (0-59):** Critical - Must fix before deployment

## 🚀 Quick Start

Get up and running with the Next.js + MUI Audit Toolkit in 5 minutes!

### ⚡ Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Test the toolkit on the sample project
node test-audit.js

# 3. Or audit your own project
npm run audit -- --path /path/to/your/project
```

### 🔍 What You'll Get

After running the audit, you'll find:

- **`audit/report.json`** - Machine-readable data for CI/CD
- **`audit/REPORT.md`** - Human-readable report with grades and recommendations

## 🔄 Runtime Audits (Integrated)

The toolkit now includes comprehensive runtime auditing capabilities **automatically integrated into the main audit workflow**. When you run `npm run audit`, it includes both static analysis AND runtime testing in one comprehensive command.

### 🔍 Lighthouse CI with Budgets

Automated performance and accessibility testing with configurable budgets:

```bash
# Run Lighthouse CI individually
npm run lighthouse
```

**Performance Budgets:**

- **JavaScript**: 180KB max
- **CSS**: 60KB max
- **Total**: 350KB max
- **LCP**: 2.5s max
- **Interactive**: 3.5s max

**Accessibility Requirements:**

- **Performance Score**: 90+ (error threshold)
- **Accessibility Score**: 95+ (error threshold)
- **Image Optimization**: Required
- **Unused JavaScript**: Warning at 80KB+

### 🎭 Playwright + Axe (Accessibility Gates)

Comprehensive accessibility testing with automated browser interactions:

```bash
# Run all Playwright tests
npm run test:e2e

# Run accessibility tests only
npm run test:a11y

# Run coverage tests only
npm run test:coverage
```

**Accessibility Tests Include:**

- **WCAG AA Compliance**: Comprehensive rule checking
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: Sufficient contrast ratios
- **Screen Reader**: ARIA and semantic structure
- **Form Accessibility**: Labels and validation
- **Skip Links**: Navigation accessibility

**Trace Recording**: Automatic trace capture on test failures for debugging.

### 📊 First-Load JS Coverage Gate

JavaScript coverage analysis to ensure efficient code usage:

```bash
# Run coverage analysis individually
npm run test:coverage
```

**Coverage Thresholds:**

- **Homepage**: 40% minimum
- **Dashboard**: 50% minimum
- **Forms**: 45% minimum

**Bundle Analysis:**

- **JavaScript Size**: < 180KB
- **CSS Size**: < 60KB
- **Unused Code Detection**: Identifies dead code

### 🚀 Integrated Runtime Testing

Runtime tests are now **automatically included** in the main audit command:

```bash
npm run audit
```

This runs **ALL** tests in one command:

1. **Static Analysis** - Custom rules, ESLint, PWA checks
2. **Lighthouse CI** - Performance and accessibility budgets
3. **Playwright Tests** - E2E and accessibility validation
4. **Coverage Analysis** - JavaScript efficiency monitoring

**All results appear in the main audit report** with detailed suggestions and scoring.

## 🎯 **Integration Summary**

| Command                 | What It Runs                        | Output                |
| ----------------------- | ----------------------------------- | --------------------- |
| `npm run audit`         | **⭐ ALL TESTS** (Static + Runtime) | Complete audit report |
| `npm run lighthouse`    | Just Lighthouse CI                  | Individual results    |
| `npm run test:e2e`      | Just Playwright tests               | Individual results    |
| `npm run test:coverage` | Just coverage analysis              | Individual results    |

**The main `npm run audit` command now provides comprehensive coverage from static analysis through runtime testing in a single execution.**

## 📚 Documentation

For comprehensive documentation, see the `/docs` directory:

- **[CLI Reference](./docs/CLI_REFERENCE.md)** - Complete command-line reference and options
- **[Configuration Guide](./docs/CONFIGURATION_GUIDE.md)** - Detailed configuration options and examples
- **[Plugin Development](./docs/PLUGIN_DEVELOPMENT.md)** - Guide to creating custom plugins

### Quick Links

- [Installation](#installation)
- [Usage Examples](#usage)
- [Configuration](./docs/CONFIGURATION_GUIDE.md#configuration-files)
- [CLI Options](./docs/CLI_REFERENCE.md#options)
- [Custom Rules](./docs/CONFIGURATION_GUIDE.md#custom-rules)
- [Plugin System](./docs/CONFIGURATION_GUIDE.md#plugin-system)
- [CI/CD Integration](./docs/CLI_REFERENCE.md#cicd-integration-options)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new rules
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Create GitHub issues for bugs or feature requests
- **Examples**: Look at the test files for usage examples
- **Documentation**: All information is contained in this README.md

## 🔄 Version History

- **v1.0.0**: Initial release with comprehensive Next.js + MUI auditing
- Comprehensive rule set covering all major best practices
- Line-level precision for issue reporting
- Automated grading and reporting system
- CI/CD integration with GitHub Actions
- PWA auditing capabilities
- Manual verification system
- **Runtime Auditing**: Lighthouse CI, Playwright + Axe, JS coverage analysis
- **Performance Budgets**: Configurable resource and timing constraints
- **Accessibility Gates**: Automated WCAG AA compliance testing
- **Coverage Thresholds**: JavaScript efficiency monitoring

---

**Happy Auditing! 🎉**

This toolkit helps ensure your Next.js + MUI projects follow industry best practices, are accessible, performant, and maintainable.
