import { test, expect } from '@playwright/test'

test.describe('JavaScript Coverage Tests', () => {
  test('first-load JS coverage threshold', async ({ page }) => {
    await page.coverage.startJSCoverage()
    await page.goto('/')

    // Simulate minimal user flow
    await page.waitForLoadState('networkidle')

    // Click on a few interactive elements to trigger JS execution
    const buttons = page.locator('button')
    if ((await buttons.count()) > 0) {
      await buttons.first().click()
    }

    const links = page.locator('a[href^="/"]')
    if ((await links.count()) > 0) {
      await links.first().hover()
    }

    // Stop coverage collection
    const jsCov = await page.coverage.stopJSCoverage()

    // Calculate coverage metrics
    const total = jsCov.reduce((a, f) => a + f.text.length, 0)
    const used = jsCov.reduce((a, f) => a + f.ranges.reduce((x, r) => x + (r.end - r.start), 0), 0)
    const pct = (used / total) * 100

    // Assert coverage threshold (40% minimum)
    expect(pct).toBeGreaterThanOrEqual(40)

    // Log coverage details for debugging
    console.log(`JS Coverage: ${pct.toFixed(2)}% (${used}/${total} bytes)`)

    // Check for unused JavaScript files
    const unusedFiles = jsCov.filter(
      f => f.ranges.reduce((sum, r) => sum + (r.end - r.start), 0) === 0
    )

    if (unusedFiles.length > 0) {
      console.log('Unused JavaScript files:')
      unusedFiles.forEach(f => console.log(`  - ${f.url}`))
    }
  })

  test('dashboard JS coverage threshold', async ({ page }) => {
    await page.coverage.startJSCoverage()
    await page.goto('/dashboard')

    await page.waitForLoadState('networkidle')

    // Simulate dashboard interactions
    const dashboardElements = page.locator(
      '[data-testid="dashboard"] button, [data-testid="dashboard"] a'
    )
    if ((await dashboardElements.count()) > 0) {
      await dashboardElements.first().click()
    }

    const jsCov = await page.coverage.stopJSCoverage()

    const total = jsCov.reduce((a, f) => a + f.text.length, 0)
    const used = jsCov.reduce((a, f) => a + f.ranges.reduce((x, r) => x + (r.end - r.start), 0), 0)
    const pct = (used / total) * 100

    // Dashboard should have higher coverage due to more interactions
    expect(pct).toBeGreaterThanOrEqual(50)

    console.log(`Dashboard JS Coverage: ${pct.toFixed(2)}% (${used}/${total} bytes)`)
  })

  test('forms JS coverage threshold', async ({ page }) => {
    await page.coverage.startJSCoverage()
    await page.goto('/forms')

    await page.waitForLoadState('networkidle')

    // Simulate form interactions
    const inputs = page.locator('input, textarea, select')
    if ((await inputs.count()) > 0) {
      await inputs.first().fill('test input')
      await inputs.first().blur()
    }

    const jsCov = await page.coverage.stopJSCoverage()

    const total = jsCov.reduce((a, f) => a + f.text.length, 0)
    const used = jsCov.reduce((a, f) => a + f.ranges.reduce((x, r) => x + (r.end - r.start), 0), 0)
    const pct = (used / total) * 100

    // Forms should have good coverage due to validation and interactions
    expect(pct).toBeGreaterThanOrEqual(45)

    console.log(`Forms JS Coverage: ${pct.toFixed(2)}% (${used}/${total} bytes)`)
  })

  test('bundle size analysis', async ({ page }) => {
    await page.goto('/')

    // Get resource sizes
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource')
      return entries.map(entry => ({
        name: entry.name,
        size: entry.transferSize || 0,
        type: entry.initiatorType
      }))
    })

    // Analyze JavaScript bundle sizes
    const jsResources = resources.filter(r => r.type === 'script')
    const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0)

    // Assert JavaScript bundle size limits
    expect(totalJSSize).toBeLessThan(180 * 1024) // 180KB limit

    // Analyze CSS bundle sizes
    const cssResources = resources.filter(r => r.type === 'link' && r.name.includes('.css'))
    const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0)

    // Assert CSS bundle size limits
    expect(totalCSSSize).toBeLessThan(60 * 1024) // 60KB limit

    console.log(`Total JS Size: ${(totalJSSize / 1024).toFixed(2)}KB`)
    console.log(`Total CSS Size: ${(totalCSSSize / 1024).toFixed(2)}KB`)
  })
})
