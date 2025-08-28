import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/')
    const a11y = await new AxeBuilder({ page }).include('body').analyze()
    expect(a11y.violations, JSON.stringify(a11y.violations, null, 2)).toEqual([])
  })

  test('dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard')
    const a11y = await new AxeBuilder({ page }).include('body').analyze()
    expect(a11y.violations, JSON.stringify(a11y.violations, null, 2)).toEqual([])
  })

  test('forms accessibility', async ({ page }) => {
    await page.goto('/forms')
    const a11y = await new AxeBuilder({ page }).include('body').analyze()
    expect(a11y.violations, JSON.stringify(a11y.violations, null, 2)).toEqual([])
  })

  test('navigation accessibility', async ({ page }) => {
    await page.goto('/')

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Test focus indicators
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Test skip links
    const skipLink = page.locator('[href="#main-content"]')
    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeVisible()
    }
  })

  test('color contrast compliance', async ({ page }) => {
    await page.goto('/')
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2aa', 'color-contrast']).analyze()

    const colorViolations = a11y.violations.filter(v =>
      v.tags.some(tag => tag.includes('color-contrast'))
    )
    expect(colorViolations, JSON.stringify(colorViolations, null, 2)).toEqual([])
  })

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/')
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2aa', 'screen-reader']).analyze()

    const screenReaderViolations = a11y.violations.filter(v =>
      v.tags.some(tag => tag.includes('screen-reader'))
    )
    expect(screenReaderViolations, JSON.stringify(screenReaderViolations, null, 2)).toEqual([])
  })
})
