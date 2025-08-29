#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

program
  .name('audit-manual')
  .description('Add manual check results to audit report')
  .version('1.0.0')
  .option('-p, --path <path>', 'Path to project directory', '.')
  .option('-o, --output <dir>', 'Audit output directory', 'audit')
  .argument('<route>', 'Route/page being tested')
  .argument('<category>', 'Category of test (responsive, accessibility, performance)')
  .argument('<result>', 'Test result (pass, fail, partial)')
  .argument('[notes]', 'Additional notes about the test')
  .parse()

const options = program.opts()
const [route, category, result, notes] = program.args

async function main() {
  try {
    console.log(chalk.blue('📝 Adding Manual Check Result'))
    console.log(chalk.gray(`Project: ${options.path}`))
    console.log(`Route: ${route}`)
    console.log(`Category: ${category}`)
    console.log(`Result: ${result}`)
    if (notes) console.log(`Notes: ${notes}\n`)

    // Validate inputs
    if (!['responsive', 'accessibility', 'performance'].includes(category)) {
      throw new Error('Category must be one of: responsive, accessibility, performance')
    }

    if (!['pass', 'fail', 'partial'].includes(result)) {
      throw new Error('Result must be one of: pass, fail, partial')
    }

    // Read existing report
    const reportPath = join(options.output, 'report.json')
    if (!existsSync(reportPath)) {
      throw new Error(`No audit report found at ${reportPath}. Run audit first.`)
    }

    const report = JSON.parse(readFileSync(reportPath, 'utf-8'))

    // Add manual check
    const manualCheck = {
      route,
      category,
      result,
      notes: notes || '',
      timestamp: new Date().toISOString(),
      tester: process.env.USER || process.env.USERNAME || 'Unknown'
    }

    if (!report.manualChecks[category]) {
      report.manualChecks[category] = []
    }

    // Check if route already has a result for this category
    const existingIndex = report.manualChecks[category].findIndex(check => check.route === route)

    if (existingIndex !== -1) {
      report.manualChecks[category][existingIndex] = manualCheck
      console.log(chalk.yellow(`⚠️  Updated existing ${category} check for ${route}`))
    } else {
      report.manualChecks[category].push(manualCheck)
      console.log(chalk.green(`✅ Added ${category} check for ${route}`))
    }

    // Write updated report
    writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // Update markdown report
    await updateMarkdownReport(options.output, report)

    console.log(chalk.green('\n✅ Manual check added successfully!'))
    console.log(chalk.blue(`📁 Updated reports in: ${options.output}/`))
  } catch (error) {
    console.error(chalk.red('❌ Failed to add manual check:'), error.message)
    process.exit(1)
  }
}

async function updateMarkdownReport(outputDir, report) {
  const mdPath = join(outputDir, 'REPORT.md')
  if (!existsSync(mdPath)) {
    console.log('⚠️  Markdown report not found, skipping update')
    return
  }

  let mdContent = readFileSync(mdPath, 'utf-8')

  // Update manual checks section
  const manualChecksSection = generateManualChecksSection(report.manualChecks)

  // Replace existing manual checks section
  const startMarker = '## ✅ Manual Checks Required'
  const endMarker = '---'

  const startIndex = mdContent.indexOf(startMarker)
  const endIndex = mdContent.indexOf(endMarker, startIndex)

  if (startIndex !== -1 && endIndex !== -1) {
    const beforeSection = mdContent.substring(0, startIndex)
    const afterSection = mdContent.substring(endIndex)

    mdContent = beforeSection + manualChecksSection + afterSection
  } else {
    // If section not found, add it before the last section
    const lastSectionIndex = mdContent.lastIndexOf('---')
    if (lastSectionIndex !== -1) {
      const beforeLast = mdContent.substring(0, lastSectionIndex)
      const afterLast = mdContent.substring(lastSectionIndex)

      mdContent = beforeLast + '\n\n' + manualChecksSection + afterLast
    }
  }

  writeFileSync(mdPath, mdContent)
}

function generateManualChecksSection(manualChecks) {
  let section = '## ✅ Manual Checks Required\n\n'

  // Responsiveness Testing
  section += '### Responsiveness Testing\n'
  section += 'Test each major route at various screen sizes (320px to 1440px):\n\n'

  if (manualChecks.responsive && manualChecks.responsive.length > 0) {
    for (const check of manualChecks.responsive) {
      const status = getStatusEmoji(check.result)
      section += `- [${check.result === 'pass' ? 'x' : ' '}] ${check.route}: ${status} ${check.result.toUpperCase()}`
      if (check.notes) section += ` - ${check.notes}`
      section += '\n'
    }
  } else {
    section += '- [ ] Homepage: `\n'
    section += '- [ ] Dashboard: `\n'
    section += '- [ ] Forms: `\n'
  }

  // Accessibility Testing
  section += '\n### Accessibility Testing\n'
  if (manualChecks.accessibility && manualChecks.accessibility.length > 0) {
    for (const check of manualChecks.accessibility) {
      const status = getStatusEmoji(check.result)
      section += `- [${check.result === 'pass' ? 'x' : ' '}] ${check.route}: ${status} ${check.result.toUpperCase()}`
      if (check.notes) section += ` - ${check.notes}`
      section += '\n'
    }
  } else {
    section += '- [ ] Screen reader compatibility: `\n'
    section += '- [ ] Keyboard navigation: `\n'
    section += '- [ ] Color contrast: `\n'
  }

  // Performance Testing
  section += '\n### Performance Testing\n'
  if (manualChecks.performance && manualChecks.performance.length > 0) {
    for (const check of manualChecks.performance) {
      const status = getStatusEmoji(check.result)
      section += `- [${check.result === 'pass' ? 'x' : ' '}] ${check.route}: ${status} ${check.result.toUpperCase()}`
      if (check.notes) section += ` - ${check.notes}`
      section += '\n'
    }
  } else {
    section += '- [ ] Lighthouse score: `\n'
    section += '- [ ] Bundle size: `\n'
    section += '- [ ] Core Web Vitals: `\n'
  }

  // Summary
  section += '\n### Summary\n'
  const totalChecks = Object.values(manualChecks).flat().length
  const passedChecks = Object.values(manualChecks)
    .flat()
    .filter(c => c.result === 'pass').length
  const failedChecks = Object.values(manualChecks)
    .flat()
    .filter(c => c.result === 'fail').length
  const partialChecks = Object.values(manualChecks)
    .flat()
    .filter(c => c.result === 'partial').length

  section += `**Total Checks:** ${totalChecks}\n`
  section += `**Passed:** ${passedChecks} 🟢\n`
  section += `**Failed:** ${failedChecks} 🔴\n`
  section += `**Partial:** ${partialChecks} 🟡\n\n`

  // Notes
  section += '### Notes\n'
  section += '```\n'
  section += 'Add any additional observations or recommendations here...\n'
  section += '```\n\n'

  section += '---\n'

  return section
}

function getStatusEmoji(result) {
  switch (result) {
    case 'pass':
      return '🟢'
    case 'fail':
      return '🔴'
    case 'partial':
      return '🟡'
    default:
      return '⚪'
  }
}

main()
