import { test, expect } from '@playwright/test'

test.describe('Basic Functionality Tests', () => {
  test('basic page load', async ({ page }) => {
    // This is a basic test to ensure the testing infrastructure works
    await page.goto('https://example.com')
    await expect(page).toHaveTitle(/Example Domain/)
  })

  test('basic accessibility check', async ({ page }) => {
    await page.goto('https://example.com')

    // Basic accessibility check - page should have a heading
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()

    // Page should have some content
    const content = page.locator('body')
    await expect(content).toContainText('Example Domain')
  })
})
