#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const fail = msg => {
  console.error('❌', msg)
  process.exitCode = 1
}
const ok = msg => console.log('✅', msg)

const root = process.cwd()
const mustExist = p => {
  const f = path.join(root, p)
  if (!fs.existsSync(f)) fail(`Missing: ${p}`)
  else ok(`Found: ${p}`)
  return f
}

console.log('🔒 PWA Production Audit - Most Strict Standards\n')

// 1) Manifest checks
console.log('📱 Checking PWA Manifest...')
const manifestPath = mustExist('public/manifest.json')
let manifest
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
} catch {
  fail('manifest.json is not valid JSON')
}

const reqFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color']
reqFields.forEach(k => {
  if (!manifest?.[k]) fail(`manifest.json missing "${k}"`)
})

if (manifest.display && !['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display))
  fail(`manifest.display should be "standalone"/"fullscreen"/"minimal-ui"`)
if (manifest.start_url && !manifest.start_url.startsWith('/'))
  fail(`manifest.start_url should start with "/" (e.g., "/")`)

const icons = Array.isArray(manifest.icons) ? manifest.icons : []
const has192 = icons.some(i => /192x192/.test(i.sizes || ''))
const has512 = icons.some(i => /512x512/.test(i.sizes || ''))
const hasMaskable = icons.some(i => (i.purpose || '').includes('maskable'))
if (!has192) fail('manifest.icons missing 192x192')
if (!has512) fail('manifest.icons missing 512x512')
if (!hasMaskable) fail('manifest.icons missing a "maskable" icon')

// 2) Next + PWA wiring
console.log('\n⚙️  Checking Next.js PWA Configuration...')
const nextConfigPath = mustExist('next.config.js')
const nextConfigSrc = fs.readFileSync(nextConfigPath, 'utf8')
if (!/next-pwa|withPWA/i.test(nextConfigSrc)) {
  fail("next.config.js doesn't reference next-pwa; PWA functionality will not work")
}

const hasRuntimeCaching = /runtimeCaching/i.test(nextConfigSrc)
if (!hasRuntimeCaching) fail('No runtimeCaching detected; offline functionality will be limited')

// 3) Service worker presence (built artifacts)
console.log('\n🔧 Checking Service Worker...')
const swCandidates = ['public/sw.js', 'public/worker.js', 'public/service-worker.js']
if (!swCandidates.some(p => fs.existsSync(path.join(root, p)))) {
  fail('No service worker file found in /public; PWA will not work')
} else {
  ok('Service worker file present')
}

// 4) _document or app root MUI SSR
console.log('\n🎨 Checking MUI SSR Configuration...')
const docCandidates = [
  'pages/_document.tsx',
  'pages/_document.jsx',
  'src/pages/_document.tsx',
  'src/pages/_document.jsx'
]
const docFile = docCandidates.find(p => fs.existsSync(path.join(root, p)))
if (!docFile) {
  fail('Missing _document file for MUI SSR critical CSS extraction')
} else {
  ok(`Found ${docFile}`)
  const docSrc = fs.readFileSync(path.join(root, docFile), 'utf8')
  if (!/createEmotionServer|extractCriticalToChunks/.test(docSrc))
    fail(
      'MUI Emotion SSR not detected in _document (need createEmotionServer / extractCriticalToChunks)'
    )
  if (!/CssBaseline/.test(docSrc))
    fail('CssBaseline not detected in Document; will cause FOUC issues')
}

// 5) Head tags for PWA
console.log('\n🏷️  Checking PWA Head Tags...')
const headFiles = [
  'app/layout.tsx',
  'app/layout.jsx',
  'src/app/layout.tsx',
  'src/app/layout.jsx',
  docFile
].filter(Boolean)

const requires = [
  /<link\s+rel=["']manifest["']\s+href=["']\/manifest\.json["']/i,
  /<meta\s+name=["']theme-color["']/i,
  /<link\s+rel=["']apple-touch-icon["']/i
]

let headOK = false
for (const f of headFiles) {
  const src = fs.readFileSync(path.join(root, f), 'utf8')
  if (requires.every(rx => rx.test(src))) {
    headOK = true
    break
  }
}
if (!headOK)
  fail('Missing one or more PWA head tags (manifest link, theme-color, apple-touch-icon)')

// 6) Security headers
console.log('\n🔒 Checking Security Headers...')
if (
  !/headers\s*:\s*async\s*\(\)/.test(nextConfigSrc) &&
  !/async\s+headers\s*\(\)/.test(nextConfigSrc)
) {
  fail('next.config.js headers() not found; security headers required for production')
} else {
  const mustHeaders = [
    'content-security-policy',
    'x-content-type-options',
    'referrer-policy',
    'strict-transport-security'
  ]
  const lc = nextConfigSrc.toLowerCase()
  mustHeaders.forEach(h => {
    if (!lc.includes(h)) fail(`Security header missing: ${h}`)
  })
}

// 7) TS strict + ESLint
console.log('\n📝 Checking TypeScript & ESLint...')
const tsCfgPath = ['tsconfig.json', 'apps/web/tsconfig.json'].find(p =>
  fs.existsSync(path.join(root, p))
)
if (tsCfgPath) {
  const tsCfg = JSON.parse(fs.readFileSync(path.join(root, tsCfgPath), 'utf8'))
  const strict = tsCfg.compilerOptions?.strict === true
  if (!strict) fail(`TypeScript not in strict mode (${tsCfgPath})`)
  ok('TypeScript strict mode enabled')
} else {
  fail('No tsconfig.json found; TypeScript strict mode required')
}

const eslintrcPath = ['.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json'].find(p =>
  fs.existsSync(path.join(root, p))
)
if (eslintrcPath) {
  const esrc = fs.readFileSync(path.join(root, eslintrcPath), 'utf8')
  if (!/next\/core-web-vitals/.test(esrc)) fail("ESLint should extend 'next/core-web-vitals'")
  ok('ESLint core-web-vitals configured')
} else {
  fail('No ESLint config found; core-web-vitals required')
}

// 8) Quick anti-patterns
console.log('\n🚫 Checking for Anti-patterns...')
const grep = (dir, rx, exts = ['.tsx', '.jsx', '.ts', '.js']) => {
  const hits = []
  const walk = d => {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name)
      const stat = fs.statSync(p)
      if (stat.isDirectory() && !/node_modules|\.next|dist|out/.test(p)) walk(p)
      else if (exts.includes(path.extname(name))) {
        const s = fs.readFileSync(p, 'utf8')
        if (rx.test(s)) hits.push(p)
      }
    }
  }
  if (fs.existsSync(dir)) walk(dir)
  return hits
}

// No http:// assets (mixed content risk)
const httpHits = [
  ...grep(path.join(root, 'app'), /http:\/\//i),
  ...grep(path.join(root, 'pages'), /http:\/\//i)
]
if (httpHits.length)
  fail(`Found http:// URLs in source:\n - ${httpHits.slice(0, 10).join('\n - ')}`)

// <img> on large images instead of <Image>
const imgHits = grep(
  path.join(root, 'app'),
  /<img[^>]+(width|height)\s*=\s*["']?(?:[3-9]\d{2,}|[1-9]\d{3,})/i
).concat(
  grep(path.join(root, 'pages'), /<img[^>]+(width|height)\s*=\s*["']?(?:[3-9]\d{2,}|[1-9]\d{3,})/i)
)
if (imgHits.length)
  fail(`Large <img> tags detected; prefer next/image:\n - ${imgHits.slice(0, 10).join('\n - ')}`)

// 9) Font strategy check
console.log('\n🔤 Checking Font Strategy...')
const layoutFiles = ['app/layout.tsx', 'app/layout.jsx', 'src/app/layout.tsx', 'src/app/layout.jsx']
const hasOptimizedFonts = layoutFiles.some(f => {
  if (fs.existsSync(path.join(root, f))) {
    const src = fs.readFileSync(path.join(root, f), 'utf8')
    return /next\/font|localFont|rel=["']preload["'].*font/i.test(src)
  }
  return false
})

if (!hasOptimizedFonts) {
  fail('No optimized font loading strategy found; will cause CLS issues')
} else {
  ok('Font strategy optimized')
}

// 10) Offline route check
console.log('\n📱 Checking Offline Route...')
const hasOfflineRoute = [
  'app/offline/page.tsx',
  'app/offline/page.jsx',
  'pages/offline.tsx',
  'pages/offline.jsx'
].some(f => fs.existsSync(path.join(root, f)))

if (!hasOfflineRoute) {
  fail('No offline route found; PWA offline experience will be poor')
} else {
  ok('Offline route present')
}

process.on('beforeExit', code => {
  if (code === 0) {
    console.log('\n🎉 PWA Production Audit PASSED!')
    console.log('✅ Your app meets the most strict production standards')
    console.log('✅ Ready for PWA installation and production deployment')
  } else {
    console.error('\n🔒 PWA Production Audit FAILED!')
    console.error('❌ Fix the issues above before production deployment')
    console.error('❌ PWA functionality will not work correctly')
  }
})
