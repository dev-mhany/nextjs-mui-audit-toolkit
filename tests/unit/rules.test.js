import { test, expect, describe } from '@jest/globals'
import { rules } from '../src/rules.js'

describe('Rules Engine', () => {
  describe('MUI Rules', () => {
    test('should detect inline styles violation', () => {
      const testCode = `
        <Box style={{ padding: '16px', margin: '8px' }}>
          Content
        </Box>
      `

      const rule = rules.find(r => r.id === 'mui/inline-styles')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })

    test('should detect Grid without responsive breakpoints', () => {
      const testCode = `
        <Grid container>
          <Grid item>
            Content without responsive props
          </Grid>
        </Grid>
      `

      const rule = rules.find(r => r.id === 'mui/responsive-design')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })

    test('should detect hardcoded theme values', () => {
      const testCode = `
        <Box sx={{ padding: '16px', color: '#1976d2' }}>
          Hardcoded values
        </Box>
      `

      const rule = rules.find(r => r.id === 'mui/theme-usage')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })
  })

  describe('Next.js Rules', () => {
    test('should detect img tag instead of Next Image', () => {
      const testCode = `
        <div>
          <img src="/test.jpg" alt="test" />
        </div>
      `

      const rule = rules.find(r => r.id === 'next/image-usage')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })

    test('should detect next/head usage', () => {
      const testCode = `
        import Head from 'next/head'
        
        export default function Page() {
          return (
            <Head>
              <title>Page Title</title>
            </Head>
          )
        }
      `

      const rule = rules.find(r => r.id === 'next/head-usage')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })

    test('should detect next/router usage', () => {
      const testCode = `
        import { useRouter } from 'next/router'
      `

      const rule = rules.find(r => r.id === 'next/router-usage')
      expect(rule).toBeDefined()
      expect(rule.pattern.test(testCode)).toBe(true)
    })
  })

  describe('Accessibility Rules', () => {
    test('should detect missing alt text', () => {
      const testCode = `
        <img src="/test.jpg" />
        <Image src="/test.jpg" />
      `

      const rule = rules.find(r => r.id === 'a11y/alt-text')
      if (rule) {
        expect(rule.pattern.test(testCode)).toBe(true)
      }
    })

    test('should detect missing form labels', () => {
      const testCode = `
        <input type="text" />
        <textarea></textarea>
      `

      const rule = rules.find(r => r.id === 'a11y/form-labels')
      if (rule) {
        expect(rule.pattern.test(testCode)).toBe(true)
      }
    })
  })

  describe('Performance Rules', () => {
    test('should detect non-lazy loading images', () => {
      const testCode = `
        <Image src="/large-image.jpg" alt="test" />
      `

      const rule = rules.find(r => r.id === 'performance/lazy-loading')
      if (rule) {
        expect(rule.pattern.test(testCode)).toBe(true)
      }
    })
  })

  describe('Rule Configuration', () => {
    test('all rules should have required properties', () => {
      rules.forEach(rule => {
        expect(rule).toHaveProperty('id')
        expect(rule).toHaveProperty('category')
        expect(rule).toHaveProperty('severity')
        expect(rule).toHaveProperty('message')
        expect(['error', 'warning', 'info']).toContain(rule.severity)

        // Rule should have either pattern or checkFunction
        expect(rule.pattern || rule.checkFunction).toBeTruthy()
      })
    })

    test('rule IDs should be unique', () => {
      const ruleIds = rules.map(rule => rule.id)
      const uniqueIds = new Set(ruleIds)
      expect(uniqueIds.size).toBe(ruleIds.length)
    })

    test('rule categories should be valid', () => {
      const validCategories = [
        'nextjs',
        'mui',
        'accessibility',
        'responsive',
        'performance',
        'security',
        'quality',
        'testing',
        'seo'
      ]

      rules.forEach(rule => {
        expect(validCategories).toContain(rule.category)
      })
    })
  })
})
