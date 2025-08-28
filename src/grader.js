import { gradeConfig } from './grade-config.js'
import { pluginManager } from './plugin-manager.js'

export async function calculateGrades(results) {
  const grades = {
    overallScore: 0,
    letterGrade: 'F',
    categoryScores: {},
    criticalIssues: 0,
    totalIssues: 0
  }

  // Calculate total issues
  grades.totalIssues = results.summary?.totalIssues || 0

  // Count critical issues (errors)
  grades.criticalIssues = results.summary?.issuesBySeverity?.error || 0

  // Calculate category scores
  const categories = [
    'nextjs',
    'mui',
    'accessibility',
    'responsive',
    'performance',
    'security',
    'quality',
    'pwa'
  ]

  for (const category of categories) {
    grades.categoryScores[category] = calculateCategoryScore(results, category)
  }

  // Handle PWA-specific scoring
  if (results.pwa && results.pwa.summary) {
    grades.categoryScores.pwa = results.pwa.summary.pwaScore
  }

  // Calculate overall score using weighted average
  grades.overallScore = calculateOverallScore(grades.categoryScores)
  grades.letterGrade = getLetterGrade(grades.overallScore)

  // Execute afterGrading hooks
  try {
    await pluginManager.executeHook('afterGrading', grades)
  } catch (error) {
    // Continue if hook fails
    console.warn('Plugin hook failed:', error.message)
  }

  return grades
}

function calculateCategoryScore(results, category) {
  let totalIssues = 0
  let weightedScore = 0
  let fileCount = 0

  // Count issues by category
  for (const filePath in results.files) {
    const file = results.files[filePath]
    const categoryIssues = file.issues.filter(issue => issue.category === category)

    if (categoryIssues.length > 0) {
      totalIssues += categoryIssues.length
      fileCount++

      // Calculate weighted score for this file
      const fileScore = Math.max(0, 100 - categoryIssues.length * 10)
      weightedScore += fileScore
    }
  }

  if (fileCount === 0) {
    return 100 // No files with this category
  }

  // Return average score for this category
  return Math.round(weightedScore / fileCount)
}

function calculateOverallScore(categoryScores) {
  let totalWeight = 0
  let weightedSum = 0

  for (const category in gradeConfig.weights) {
    const weight = gradeConfig.weights[category]
    const score = categoryScores[category] || 100

    totalWeight += weight
    weightedSum += score * weight
  }

  if (totalWeight === 0) {
    return 100
  }

  return Math.round(weightedSum / totalWeight)
}

function getLetterGrade(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getTopIssues(results, limit = 10) {
  const issueCounts = {}

  // Count occurrences of each rule
  for (const filePath in results.files) {
    const file = results.files[filePath]

    for (const issue of file.issues) {
      const ruleKey = issue.rule
      if (!issueCounts[ruleKey]) {
        issueCounts[ruleKey] = {
          count: 0,
          rule: issue.rule,
          category: issue.category,
          severity: issue.severity,
          message: issue.message
        }
      }
      issueCounts[ruleKey].count++
    }
  }

  // Sort by count and severity
  const sortedIssues = Object.values(issueCounts).sort((a, b) => {
    // First by severity (error > warning > info)
    const severityOrder = { error: 3, warning: 2, info: 1 }
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]

    if (severityDiff !== 0) return severityDiff

    // Then by count
    return b.count - a.count
  })

  return sortedIssues.slice(0, limit)
}

export function getCategoryBreakdown(results) {
  const breakdown = {}

  for (const filePath in results.files) {
    const file = results.files[filePath]

    for (const issue of file.issues) {
      const category = issue.category

      if (!breakdown[category]) {
        breakdown[category] = {
          total: 0,
          bySeverity: { error: 0, warning: 0, info: 0 },
          files: new Set()
        }
      }

      breakdown[category].total++
      breakdown[category].bySeverity[issue.severity]++
      breakdown[category].files.add(filePath)
    }
  }

  // Convert Sets to counts
  for (const category in breakdown) {
    breakdown[category].fileCount = breakdown[category].files.size
    delete breakdown[category].files
  }

  return breakdown
}

export function getDetailedCategoryBreakdown(results) {
  const breakdown = {}

  for (const filePath in results.files) {
    const file = results.files[filePath]

    if (!file.issues || !Array.isArray(file.issues)) continue

    for (const issue of file.issues) {
      const category = issue.category

      if (!breakdown[category]) {
        breakdown[category] = {}
      }

      if (!breakdown[category][filePath]) {
        breakdown[category][filePath] = []
      }

      breakdown[category][filePath].push(issue)
    }
  }

  return breakdown
}
