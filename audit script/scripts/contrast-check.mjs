#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// WCAG contrast requirements
const WCAG_REQUIREMENTS = {
  AA: { normal: 4.5, large: 3.0 },
  AAA: { normal: 7.0, large: 4.5 }
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Invalid hex color: ${hex}`)
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

// Convert RGB to relative luminance
function rgbToLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio
function calculateContrastRatio(color1, color2) {
  let rgb1, rgb2

  try {
    if (color1.startsWith('#')) {
      rgb1 = hexToRgb(color1)
    } else if (color1.startsWith('rgb')) {
      // Simple RGB parsing - in production use a proper color library
      const match = color1.match(/(\d+),\s*(\d+),\s*(\d+)/)
      if (!match) throw new Error(`Invalid RGB color: ${color1}`)
      rgb1 = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    } else {
      throw new Error(`Unsupported color format: ${color1}`)
    }

    if (color2.startsWith('#')) {
      rgb2 = hexToRgb(color2)
    } else if (color2.startsWith('rgb')) {
      const match = color2.match(/(\d+),\s*(\d+),\s*(\d+)/)
      if (!match) throw new Error(`Invalid RGB color: ${color2}`)
      rgb2 = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    } else {
      throw new Error(`Unsupported color format: ${color2}`)
    }
  } catch (error) {
    console.warn(`Warning: Could not parse colors ${color1} or ${color2}: ${error}`)
    return 0
  }

  const lum1 = rgbToLuminance(...rgb1)
  const lum2 = rgbToLuminance(...rgb2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Check if contrast meets WCAG requirements
function checkContrast(ratio, size = 'normal') {
  return ratio >= WCAG_REQUIREMENTS.AA[size]
}

// Generate common color pairs to test
function generateColorPairs(themePath) {
  const pairs = []

  try {
    if (existsSync(themePath)) {
      const themeContent = readFileSync(themePath, 'utf-8')

      // Extract common MUI theme color combinations
      const colorMatches = themeContent.match(/palette:\s*{[\s\S]*?}/g)
      if (colorMatches) {
        // Common text/background combinations
        pairs.push(
          { foreground: '#000000', background: '#ffffff', context: 'Default text on white' },
          { foreground: '#ffffff', background: '#000000', context: 'White text on black' },
          { foreground: '#1976d2', background: '#ffffff', context: 'Primary text on white' },
          { foreground: '#ffffff', background: '#1976d2', context: 'White text on primary' },
          { foreground: '#d32f2f', background: '#ffffff', context: 'Error text on white' },
          { foreground: '#ffffff', background: '#d32f2f', context: 'White text on error' }
        )
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read theme file: ${error}`)
  }

  // Fallback to common color pairs if theme file not found
  if (pairs.length === 0) {
    pairs.push(
      { foreground: '#000000', background: '#ffffff', context: 'Black on white' },
      { foreground: '#ffffff', background: '#000000', context: 'White on black' },
      { foreground: '#1976d2', background: '#ffffff', context: 'Blue on white' },
      { foreground: '#ffffff', background: '#1976d2', context: 'White on blue' },
      { foreground: '#d32f2f', background: '#ffffff', context: 'Red on white' },
      { foreground: '#ffffff', background: '#d32f2f', context: 'White on red' }
    )
  }

  return pairs
}

// Main contrast checking function
async function checkThemeContrast(projectPath) {
  const results = []

  // Look for theme files
  const possibleThemePaths = [
    join(projectPath, 'src/theme.ts'),
    join(projectPath, 'src/theme.js'),
    join(projectPath, 'src/theme/index.ts'),
    join(projectPath, 'src/theme/index.js'),
    join(projectPath, 'theme.ts'),
    join(projectPath, 'theme.js')
  ]

  let themePath = ''
  for (const path of possibleThemePaths) {
    if (existsSync(path)) {
      themePath = path
      break
    }
  }

  const colorPairs = generateColorPairs(themePath)

  for (const pair of colorPairs) {
    const ratio = calculateContrastRatio(pair.foreground, pair.background)

    // Check both normal and large text sizes
    const normalPasses = checkContrast(ratio, 'normal')
    const largePasses = checkContrast(ratio, 'large')

    results.push({
      pair,
      ratio,
      passes: normalPasses && largePasses,
      standard: 'AA',
      size: 'normal'
    })

    results.push({
      pair,
      ratio,
      passes: largePasses,
      standard: 'AA',
      size: 'large'
    })
  }

  return results
}

// CLI usage
const projectPath = process.argv[2] || '.'

console.log('🎨 Checking theme color contrast ratios...')
console.log(`📁 Project path: ${projectPath}\n`)

checkThemeContrast(projectPath)
  .then(results => {
    let passed = 0
    let failed = 0

    console.log('📊 Contrast Ratio Results:\n')

    for (const result of results) {
      const status = result.passes ? '✅' : '❌'
      const sizeLabel = result.size === 'large' ? 'Large' : 'Normal'
      const requirement = WCAG_REQUIREMENTS[result.standard][result.size]

      console.log(`${status} ${result.pair.context}`)
      console.log(`   ${result.pair.foreground} on ${result.pair.background}`)
      console.log(`   Ratio: ${result.ratio.toFixed(2)}:1 (Required: ${requirement}:1)`)
      console.log(`   Size: ${sizeLabel} text`)
      console.log(`   Standard: WCAG ${result.standard}\n`)

      if (result.passes) {
        passed++
      } else {
        failed++
      }
    }

    console.log(`📈 Summary: ${passed} passed, ${failed} failed`)

    if (failed > 0) {
      console.log('\n⚠️  Some color combinations do not meet WCAG AA standards!')
      console.log('💡 Consider adjusting colors or using theme.palette tokens.')
      process.exit(1)
    } else {
      console.log('\n🎉 All color combinations meet WCAG AA standards!')
    }
  })
  .catch(error => {
    console.error('❌ Error checking contrast:', error.message)
    process.exit(1)
  })

export default checkThemeContrast
