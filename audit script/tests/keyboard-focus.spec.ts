import { test, expect } from '@playwright/test'

test.describe('Keyboard & Focus Health', () => {
  test('no keyboard traps in modals', async ({ page }) => {
    // Navigate to a page with modals (adjust URL as needed)
    await page.goto('/modal-page')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for modal/dialog elements
    const modals = page.locator('[role="dialog"], [role="modal"], .modal, .dialog')

    if ((await modals.count()) === 0) {
      console.log('No modals found on page - skipping keyboard trap test')
      return
    }

    for (let i = 0; i < (await modals.count()); i++) {
      const modal = modals.nth(i)

      // Check if modal is visible
      if (!(await modal.isVisible())) continue

      console.log(`Testing modal ${i + 1}: ${(await modal.getAttribute('role')) || 'unknown'}`)

      // Focus enters modal
      await modal.focus()

      // Test Tab navigation within modal (should not escape)
      let focusTrapped = true
      let focusCount = 0
      const maxTabs = 40 // Prevent infinite loops

      for (let tabCount = 0; tabCount < maxTabs; tabCount++) {
        const previousFocus = await page.evaluate(() => document.activeElement?.tagName)
        await page.keyboard.press('Tab')
        const currentFocus = await page.evaluate(() => document.activeElement?.tagName)

        // If focus didn't change, we might be trapped
        if (previousFocus === currentFocus) {
          focusCount++
          if (focusCount > 3) {
            focusTrapped = false
            break
          }
        } else {
          focusCount = 0
        }

        // Check if focus is still within modal
        const focusInModal = await modal.evaluate(
          (el, activeEl) => {
            return el.contains(activeEl)
          },
          await page.evaluate(() => document.activeElement)
        )

        if (!focusInModal) {
          focusTrapped = false
          break
        }
      }

      // Test Shift+Tab navigation
      await modal.focus()
      let shiftTabTrapped = true

      for (let tabCount = 0; tabCount < maxTabs; tabCount++) {
        const previousFocus = await page.evaluate(() => document.activeElement?.tagName)
        await page.keyboard.press('Shift+Tab')
        const currentFocus = await page.evaluate(() => document.activeElement?.tagName)

        if (previousFocus === currentFocus) {
          focusCount++
          if (focusCount > 3) {
            shiftTabTrapped = false
            break
          }
        } else {
          focusCount = 0
        }

        const focusInModal = await modal.evaluate(
          (el, activeEl) => {
            return el.contains(activeEl)
          },
          await page.evaluate(() => document.activeElement)
        )

        if (!focusInModal) {
          shiftTabTrapped = false
          break
        }
      }

      // Test Escape key functionality
      const escapeWorks = await testEscapeKey(page, modal)

      // Assertions
      expect(focusTrapped, 'Modal should trap focus with Tab key').toBe(true)
      expect(shiftTabTrapped, 'Modal should trap focus with Shift+Tab key').toBe(true)
      expect(escapeWorks, 'Modal should close with Escape key').toBe(true)
    }
  })

  test('focus management in forms', async ({ page }) => {
    await page.goto('/forms-page')
    await page.waitForLoadState('networkidle')

    const forms = page.locator('form')

    if ((await forms.count()) === 0) {
      console.log('No forms found on page - skipping form focus test')
      return
    }

    for (let i = 0; i < (await forms.count()); i++) {
      const form = forms.nth(i)

      // Get all focusable elements in form
      const focusableElements = form.locator(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )

      if ((await focusableElements.count()) === 0) continue

      console.log(
        `Testing form ${i + 1} with ${await focusableElements.count()} focusable elements`
      )

      // Test Tab navigation through form
      await focusableElements.first().focus()

      for (let j = 0; j < (await focusableElements.count()); j++) {
        const element = focusableElements.nth(j)

        // Check if element is focusable
        const isFocusable = (await element.isVisible()) && !(await element.getAttribute('disabled'))

        if (isFocusable) {
          await element.focus()
          const isFocused = await element.evaluate(el => el === document.activeElement)
          expect(isFocused, `Element ${j + 1} should be focusable`).toBe(true)
        }

        // Test Tab to next element
        if (j < (await focusableElements.count()) - 1) {
          await page.keyboard.press('Tab')
          const nextElement = focusableElements.nth(j + 1)
          const nextFocused = await nextElement.evaluate(el => el === document.activeElement)
          expect(nextFocused, `Tab should move focus to next element`).toBe(true)
        }
      }
    }
  })

  test('skip links functionality', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for skip links
    const skipLinks = page.locator('a[href^="#"], [data-skip-link]')

    if ((await skipLinks.count()) === 0) {
      console.log('No skip links found - skipping skip link test')
      return
    }

    for (let i = 0; i < (await skipLinks.count()); i++) {
      const skipLink = skipLinks.nth(i)

      // Focus skip link
      await skipLink.focus()

      // Check if it's visible when focused
      const isVisible = await skipLink.isVisible()
      expect(isVisible, 'Skip link should be visible when focused').toBe(true)

      // Test Enter key activation
      await skipLink.press('Enter')

      // Check if focus moved to target
      const href = await skipLink.getAttribute('href')
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1)
        const target = page.locator(`#${targetId}`)

        if ((await target.count()) > 0) {
          // Wait a bit for focus to settle
          await page.waitForTimeout(100)

          const targetFocused = await target.evaluate(
            el => el === document.activeElement || el.contains(document.activeElement)
          )
          expect(targetFocused, `Focus should move to skip link target: ${targetId}`).toBe(true)
        }
      }
    }
  })
})

// Helper function to test Escape key functionality
async function testEscapeKey(page: any, modal: any): Promise<boolean> {
  try {
    // Check if modal has close functionality
    const closeButton = modal.locator(
      '[aria-label*="close"], [aria-label*="Close"], .close, .close-btn, button[onClick*="close"]'
    )

    if ((await closeButton.count()) > 0) {
      // Focus modal first
      await modal.focus()

      // Press Escape
      await page.keyboard.press('Escape')

      // Wait a bit for any animations
      await page.waitForTimeout(300)

      // Check if modal is hidden
      const isHidden = !(await modal.isVisible())

      if (isHidden) {
        return true
      }
    }

    // If no close button or Escape didn't work, check if modal responds to Escape
    await modal.focus()
    await page.keyboard.press('Escape')

    // Look for any change in modal state
    const beforeState =
      (await modal.getAttribute('aria-hidden')) || (await modal.getAttribute('hidden'))
    await page.waitForTimeout(100)
    const afterState =
      (await modal.getAttribute('aria-hidden')) || (await modal.getAttribute('hidden'))

    return beforeState !== afterState
  } catch (error) {
    console.warn('Error testing Escape key:', error)
    return false
  }
}
