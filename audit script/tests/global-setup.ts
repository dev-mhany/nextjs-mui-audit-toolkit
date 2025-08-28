import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Start any required services or setup
  console.log('🚀 Global Playwright setup starting...')
  
  // Check if the application is available
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the application to be ready
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    console.log('✅ Application is ready for testing')
  } catch (error) {
    console.log('⚠️ Application not available, tests may use static files')
  } finally {
    await page.close()
    await browser.close()
  }
  
  console.log('✅ Global Playwright setup completed')
}

export default globalSetup