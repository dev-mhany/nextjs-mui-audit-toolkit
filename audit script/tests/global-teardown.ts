import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global Playwright teardown starting...')
  
  // Clean up any temporary files or resources
  // This could include clearing test databases, stopping services, etc.
  
  console.log('✅ Global Playwright teardown completed')
}

export default globalTeardown