import { test, expect, describe, beforeEach } from '@jest/globals'
import { calculateGrades } from '../src/grader.js'

describe('Grader', () => {
  let mockResults

  beforeEach(() => {
    mockResults = {
      files: {
        'src/perfect.jsx': {
          path: 'src/perfect.jsx',
          issues: [],
          score: 100
        },
        'src/good.jsx': {
          path: 'src/good.jsx',
          issues: [
            {
              rule: 'mui/theme-usage',
              category: 'mui',
              severity: 'info',
              message: 'Consider using theme values'
            }
          ],
          score: 90
        },
        'src/issues.jsx': {
          path: 'src/issues.jsx',
          issues: [
            {
              rule: 'mui/inline-styles',
              category: 'mui',
              severity: 'error',
              message: 'Use sx prop instead'
            },
            {
              rule: 'next/image-usage',
              category: 'nextjs',
              severity: 'warning',
              message: 'Use Next Image'
            }
          ],
          score: 70
        }
      },
      summary: {
        totalFiles: 3,
        totalIssues: 3,
        issuesByCategory: {
          mui: 2,
          nextjs: 1
        },
        issuesBySeverity: {
          error: 1,
          warning: 1,
          info: 1
        }
      }
    }
  })

  describe('Grade Calculation', () => {
    test('should calculate overall score correctly', () => {
      const grades = calculateGrades(mockResults)

      expect(grades).toHaveProperty('overallScore')
      expect(grades.overallScore).toBeGreaterThanOrEqual(0)
      expect(grades.overallScore).toBeLessThanOrEqual(100)
      expect(typeof grades.overallScore).toBe('number')
    })

    test('should assign letter grades correctly', () => {
      const grades = calculateGrades(mockResults)

      expect(grades).toHaveProperty('letterGrade')
      expect(['A', 'B', 'C', 'D', 'F']).toContain(grades.letterGrade)

      // Test specific score ranges
      const perfectResults = {
        files: {
          'perfect.jsx': { issues: [], score: 100 }
        },
        summary: {
          totalFiles: 1,
          totalIssues: 0,
          issuesByCategory: {},
          issuesBySeverity: { error: 0, warning: 0, info: 0 }
        }
      }

      const perfectGrades = calculateGrades(perfectResults)
      expect(perfectGrades.letterGrade).toBe('A')
      expect(perfectGrades.overallScore).toBeGreaterThanOrEqual(90)
    })

    test('should calculate category scores', () => {
      const grades = calculateGrades(mockResults)

      expect(grades).toHaveProperty('categoryScores')
      expect(grades.categoryScores).toHaveProperty('mui')
      expect(grades.categoryScores).toHaveProperty('nextjs')

      // Category scores should be between 0 and 100
      Object.values(grades.categoryScores).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })

    test('should count critical issues correctly', () => {
      const grades = calculateGrades(mockResults)

      expect(grades).toHaveProperty('criticalIssues')
      expect(grades.criticalIssues).toBe(1) // One error in mockResults
    })

    test('should handle empty results', () => {
      const emptyResults = {
        files: {},
        summary: {
          totalFiles: 0,
          totalIssues: 0,
          issuesByCategory: {},
          issuesBySeverity: { error: 0, warning: 0, info: 0 }
        }
      }

      const grades = calculateGrades(emptyResults)

      expect(grades.overallScore).toBe(100)
      expect(grades.letterGrade).toBe('A')
      expect(grades.criticalIssues).toBe(0)
    })
  })

  describe('Score Calculation Logic', () => {
    test('should penalize errors more than warnings', () => {
      const errorResults = {
        files: {
          'errors.jsx': {
            issues: [{ category: 'mui', severity: 'error', message: 'Error' }],
            score: 80
          }
        },
        summary: {
          totalFiles: 1,
          totalIssues: 1,
          issuesByCategory: { mui: 1 },
          issuesBySeverity: { error: 1, warning: 0, info: 0 }
        }
      }

      const warningResults = {
        files: {
          'warnings.jsx': {
            issues: [{ category: 'mui', severity: 'warning', message: 'Warning' }],
            score: 90
          }
        },
        summary: {
          totalFiles: 1,
          totalIssues: 1,
          issuesByCategory: { mui: 1 },
          issuesBySeverity: { error: 0, warning: 1, info: 0 }
        }
      }

      const errorGrades = calculateGrades(errorResults)
      const warningGrades = calculateGrades(warningResults)

      expect(errorGrades.overallScore).toBeLessThan(warningGrades.overallScore)
    })

    test('should handle files with no issues', () => {
      const perfectResults = {
        files: {
          'perfect1.jsx': { issues: [], score: 100 },
          'perfect2.jsx': { issues: [], score: 100 }
        },
        summary: {
          totalFiles: 2,
          totalIssues: 0,
          issuesByCategory: {},
          issuesBySeverity: { error: 0, warning: 0, info: 0 }
        }
      }

      const grades = calculateGrades(perfectResults)

      expect(grades.overallScore).toBe(100)
      expect(grades.letterGrade).toBe('A')
      expect(grades.criticalIssues).toBe(0)
    })

    test('should calculate weighted category scores', () => {
      const categoryResults = {
        files: {
          'mui-issues.jsx': {
            issues: [
              { category: 'mui', severity: 'error', message: 'MUI Error' },
              { category: 'mui', severity: 'warning', message: 'MUI Warning' }
            ],
            score: 70
          },
          'nextjs-issues.jsx': {
            issues: [{ category: 'nextjs', severity: 'info', message: 'Next.js Info' }],
            score: 95
          }
        },
        summary: {
          totalFiles: 2,
          totalIssues: 3,
          issuesByCategory: { mui: 2, nextjs: 1 },
          issuesBySeverity: { error: 1, warning: 1, info: 1 }
        }
      }

      const grades = calculateGrades(categoryResults)

      // MUI category should have lower score due to more severe issues
      expect(grades.categoryScores.mui).toBeLessThan(grades.categoryScores.nextjs)
    })
  })

  describe('Grade Breakdown', () => {
    test('should provide detailed breakdown', () => {
      const grades = calculateGrades(mockResults)

      expect(grades).toHaveProperty('breakdown')
      if (grades.breakdown) {
        expect(grades.breakdown).toHaveProperty('totalFiles')
        expect(grades.breakdown).toHaveProperty('filesWithIssues')
        expect(grades.breakdown).toHaveProperty('averageScore')
      }
    })

    test('should calculate correct averages', () => {
      const grades = calculateGrades(mockResults)

      const expectedAverage = (100 + 90 + 70) / 3 // Average of file scores
      expect(Math.abs(grades.breakdown.averageScore - expectedAverage)).toBeLessThan(1)
    })

    test('should count files with issues correctly', () => {
      const grades = calculateGrades(mockResults)

      expect(grades.breakdown.filesWithIssues).toBe(2) // good.jsx and issues.jsx have issues
      expect(grades.breakdown.totalFiles).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    test('should handle invalid input gracefully', () => {
      const invalidResults = null

      expect(() => calculateGrades(invalidResults)).not.toThrow()

      const grades = calculateGrades(invalidResults)
      expect(grades.overallScore).toBeDefined()
      expect(grades.letterGrade).toBeDefined()
    })

    test('should handle missing summary', () => {
      const resultsWithoutSummary = {
        files: {
          'test.jsx': { issues: [], score: 100 }
        }
      }

      expect(() => calculateGrades(resultsWithoutSummary)).not.toThrow()
    })

    test('should handle very low scores', () => {
      const lowScoreResults = {
        files: {
          'bad.jsx': {
            issues: Array.from({ length: 20 }, (_, i) => ({
              category: 'mui',
              severity: 'error',
              message: `Error ${i + 1}`
            })),
            score: 10
          }
        },
        summary: {
          totalFiles: 1,
          totalIssues: 20,
          issuesByCategory: { mui: 20 },
          issuesBySeverity: { error: 20, warning: 0, info: 0 }
        }
      }

      const grades = calculateGrades(lowScoreResults)

      expect(grades.overallScore).toBeGreaterThanOrEqual(0)
      expect(grades.letterGrade).toBe('F')
      expect(grades.criticalIssues).toBe(20)
    })
  })
})
