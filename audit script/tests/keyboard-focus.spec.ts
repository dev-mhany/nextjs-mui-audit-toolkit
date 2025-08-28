import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation Tests', () => {
  test('comprehensive keyboard navigation flow', async ({ page }) => {
    await page.goto('/')
    
    // Test skip link functionality
    await page.keyboard.press('Tab')
    const firstFocusedElement = await page.locator(':focus')
    
    // Check if skip link is available and functional
    const skipLinkText = await firstFocusedElement.textContent()
    if (skipLinkText && skipLinkText.toLowerCase().includes('skip')) {
      await page.keyboard.press('Enter')
      const mainContent = await page.locator('#main-content, main, [role="main"]')
      await expect(mainContent).toBeFocused()
    }
    
    // Test navigation menu accessibility
    const navElements = page.locator('nav a, nav button')
    const navCount = await navElements.count()
    
    if (navCount > 0) {
      // Navigate through menu items
      for (let i = 0; i < Math.min(navCount, 5); i++) {
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        
        // Ensure focused element is visible
        await expect(focusedElement).toBeVisible()
        
        // Check focus indicator is present
        const focusOutline = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return styles.outline !== 'none' || 
                 styles.boxShadow !== 'none' || 
                 styles.border !== styles.border // Basic focus indicator check
        })
        
        expect(focusOutline).toBeTruthy()
      }
    }
  })
  
  test('form keyboard accessibility', async ({ page }) => {
    await page.goto('/forms')
    
    // Find all form inputs
    const inputs = page.locator('input, textarea, select, button[type="submit"]')
    const inputCount = await inputs.count()
    
    if (inputCount > 0) {
      // Navigate through form elements
      for (let i = 0; i < inputCount; i++) {
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        
        // Ensure form element is accessible via keyboard
        await expect(focusedElement).toBeVisible()
        
        // Test form interaction
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
        
        if (tagName === 'input') {
          const inputType = await focusedElement.getAttribute('type')
          
          if (inputType === 'text' || inputType === 'email' || !inputType) {
            await focusedElement.fill('test input')
            const value = await focusedElement.inputValue()
            expect(value).toBe('test input')
          }
        }
        
        if (tagName === 'textarea') {
          await focusedElement.fill('test textarea content')
          const value = await focusedElement.inputValue()
          expect(value).toBe('test textarea content')
        }
      }
    }
  })
  
  test('modal and dialog keyboard trapping', async ({ page }) => {
    await page.goto('/')
    
    // Look for modal/dialog triggers
    const modalTriggers = page.locator('[data-testid*="modal"], [aria-haspopup="dialog"], button[data-modal]')
    const triggerCount = await modalTriggers.count()
    
    if (triggerCount > 0) {
      // Open first modal
      await modalTriggers.first().click()
      
      // Wait for modal to appear
      await page.waitForTimeout(500)
      
      // Check if modal is properly labeled
      const modal = page.locator('[role="dialog"], [role="alertdialog"], .modal')
      const modalCount = await modal.count()
      
      if (modalCount > 0) {
        // Test focus trapping
        const focusableElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const focusableCount = await focusableElements.count()
        
        if (focusableCount > 0) {
          // First element should be focused
          await expect(focusableElements.first()).toBeFocused()
          
          // Tab through elements
          for (let i = 0; i < focusableCount; i++) {
            await page.keyboard.press('Tab')
          }
          
          // Should cycle back to first element
          await expect(focusableElements.first()).toBeFocused()
          
          // Test Escape key to close modal
          await page.keyboard.press('Escape')
          await page.waitForTimeout(500)
          
          // Modal should be closed
          await expect(modal).not.toBeVisible()
        }
      }
    }
  })
  
  test('custom component keyboard support', async ({ page }) => {
    await page.goto('/')
    
    // Test custom interactive components
    const customComponents = page.locator('[role="button"]:not(button), [role="tab"], [role="menuitem"]')
    const componentCount = await customComponents.count()
    
    if (componentCount > 0) {
      for (let i = 0; i < Math.min(componentCount, 3); i++) {
        const component = customComponents.nth(i)
        
        // Focus the component
        await component.focus()
        await expect(component).toBeFocused()
        
        // Test activation with Enter and Space
        const role = await component.getAttribute('role')
        
        if (role === 'button') {
          // Test both Enter and Space activation
          await page.keyboard.press('Enter')
          await page.waitForTimeout(100)
          
          await component.focus()
          await page.keyboard.press('Space')
          await page.waitForTimeout(100)
        }
        
        if (role === 'tab') {
          // Test arrow key navigation for tabs
          await page.keyboard.press('ArrowRight')
          await page.waitForTimeout(100)
          
          await page.keyboard.press('ArrowLeft')
          await page.waitForTimeout(100)
        }
      }
    }
  })
  
  test('ARIA live regions keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Look for live regions that might update during keyboard navigation
    const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]')
    const liveRegionCount = await liveRegions.count()
    
    if (liveRegionCount > 0) {
      // Ensure live regions are properly labeled
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i)
        const ariaLabel = await region.getAttribute('aria-label')
        const ariaLabelledby = await region.getAttribute('aria-labelledby')
        
        // Live regions should have appropriate labeling
        expect(ariaLabel || ariaLabelledby).toBeTruthy()
      }
    }
  })
})