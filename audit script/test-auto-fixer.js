#!/usr/bin/env node

import { mkdir, rmdir, writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { AutoFixer } from './src/auto-fixer.js'

async function runAutoFixerTests() {
  console.log('🧪 Running Auto-Fixer Tests...\n')

  const autoFixer = new AutoFixer()
  let passed = 0
  let failed = 0

  // Create test directory
  const testDir = join(process.cwd(), 'test-temp-auto-fixer')
  await mkdir(testDir, { recursive: true })

  try {
    // Test 1: MUI inline styles fixer
    console.log('Test 1: MUI inline styles fixer')
    try {
      const testFile = join(testDir, 'test1.jsx')
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px', margin: '8px' }}>
      <div style={{ color: 'red' }}>Hello</div>
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [{ rule: 'mui/inline-styles', line: 6, column: 10 }]
      const result = await autoFixer.fixFile(testFile, issues)

      const fixedContent = await readFile(testFile, 'utf8')

      if (
        result.hasChanges &&
        fixedContent.includes('sx={{') &&
        !fixedContent.includes('style={{')
      ) {
        console.log('✅ PASSED: Successfully converted style to sx prop\n')
        passed++
      } else {
        console.log('❌ FAILED: Did not convert style to sx prop properly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }

    // Test 2: Next.js Image fixer
    console.log('Test 2: Next.js Image fixer')
    try {
      const testFile = join(testDir, 'test2.jsx')
      const content = `
import React from 'react';

export default function TestComponent() {
  return (
    <div>
      <img src="/test.jpg" alt="Test" />
      <img src="/another.png" />
    </div>
  );
}
`
      await writeFile(testFile, content)

      const issues = [{ rule: 'next/image-usage', line: 6, column: 6 }]
      const result = await autoFixer.fixFile(testFile, issues)

      const fixedContent = await readFile(testFile, 'utf8')

      if (
        result.hasChanges &&
        fixedContent.includes("import Image from 'next/image'") &&
        fixedContent.includes('<Image') &&
        fixedContent.includes('width={500} height={300}')
      ) {
        console.log('✅ PASSED: Successfully converted img to Next.js Image\n')
        passed++
      } else {
        console.log('❌ FAILED: Did not convert img to Next.js Image properly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }

    // Test 3: Alt text fixer
    console.log('Test 3: Alt text fixer')
    try {
      const testFile = join(testDir, 'test3.jsx')
      const content = `
import React from 'react';
import Image from 'next/image';

export default function TestComponent() {
  return (
    <div>
      <img src="/test.jpg" />
      <Image src="/another.png" width={100} height={100} />
    </div>
  );
}
`
      await writeFile(testFile, content)

      const issues = [{ rule: 'a11y/alt-text', line: 7, column: 6 }]
      const result = await autoFixer.fixFile(testFile, issues)

      const fixedContent = await readFile(testFile, 'utf8')

      if (result.hasChanges && fixedContent.includes('alt=""')) {
        console.log('✅ PASSED: Successfully added alt attributes\n')
        passed++
      } else {
        console.log('❌ FAILED: Did not add alt attributes properly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }

    // Test 4: Theme token enforcement
    console.log('Test 4: Theme token enforcement')
    try {
      const testFile = join(testDir, 'test4.jsx')
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box sx={{ 
      padding: '16px', 
      margin: '8px',
      color: '#1976d2'
    }}>
      Content
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [{ rule: 'mui/theme-token-enforcement', line: 7, column: 6 }]
      const result = await autoFixer.fixFile(testFile, issues)

      const fixedContent = await readFile(testFile, 'utf8')

      if (
        result.hasChanges &&
        fixedContent.includes('theme.spacing(2)') &&
        fixedContent.includes('theme.spacing(1)') &&
        fixedContent.includes('theme.palette.primary.main')
      ) {
        console.log('✅ PASSED: Successfully converted to theme tokens\n')
        passed++
      } else {
        console.log('❌ FAILED: Did not convert to theme tokens properly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }

    // Test 5: Available fixers
    console.log('Test 5: Available fixers')
    try {
      const fixers = autoFixer.getAvailableFixers()
      const fixerIds = fixers.map(f => f.ruleId)

      if (
        Array.isArray(fixers) &&
        fixers.length > 0 &&
        fixerIds.includes('mui/inline-styles') &&
        fixerIds.includes('next/image-usage') &&
        fixerIds.includes('a11y/alt-text')
      ) {
        console.log('✅ PASSED: Available fixers working correctly\n')
        passed++
      } else {
        console.log('❌ FAILED: Available fixers not working correctly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }

    // Test 6: Dry run mode
    console.log('Test 6: Dry run mode')
    try {
      const testFile = join(testDir, 'test6.jsx')
      const content = `
import React from 'react';
import { Box } from '@mui/material';

export default function TestComponent() {
  return (
    <Box style={{ padding: '16px' }}>
      Content
    </Box>
  );
}
`
      await writeFile(testFile, content)

      const issues = [{ rule: 'mui/inline-styles', line: 6, column: 10 }]
      const result = await autoFixer.fixFile(testFile, issues, { dryRun: true })

      const fileContent = await readFile(testFile, 'utf8')

      if (
        result.hasChanges &&
        result.fixedContent &&
        result.fixedContent.includes('sx={{') &&
        fileContent.includes('style={{') &&
        !fileContent.includes('sx={{')
      ) {
        console.log('✅ PASSED: Dry run mode working correctly\n')
        passed++
      } else {
        console.log('❌ FAILED: Dry run mode not working correctly\n')
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`)
      failed++
    }
  } finally {
    // Clean up test directory
    try {
      await rmdir(testDir, { recursive: true })
    } catch (error) {
      console.log(`⚠️ Warning: Could not clean up test directory: ${error.message}`)
    }
  }

  // Summary
  console.log('🏁 Test Results Summary:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📊 Total: ${passed + failed}`)

  if (failed === 0) {
    console.log('\n🎉 All auto-fixer tests passed!')
    return true
  } else {
    console.log('\n💥 Some auto-fixer tests failed!')
    return false
  }
}

// Run the tests
runAutoFixerTests()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error)
    process.exit(1)
  })
