import { writeFile } from 'fs/promises'
import { join } from 'path'
import { logger } from './logger.js'

export class HTMLReporter {
  constructor() {
    this.logger = logger.child({ component: 'html-reporter' })
  }

  async generateReport(results, grades, outputDir, config = {}) {
    try {
      const html = this.generateHTML(results, grades, config)
      const outputPath = join(outputDir, 'report.html')

      await writeFile(outputPath, html)
      this.logger.info(`HTML report generated: ${outputPath}`)

      return outputPath
    } catch (error) {
      this.logger.error('Failed to generate HTML report', error)
      throw error
    }
  }

  generateHTML(results, grades, config) {
    const timestamp = new Date().toLocaleString()
    const totalFiles = results.summary?.totalFiles || 0
    const totalIssues = results.summary?.totalIssues || 0
    const criticalIssues = grades.criticalIssues || 0

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next.js + MUI Audit Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 24px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .score { font-size: 48px; font-weight: bold; text-align: center; padding: 20px; border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; }
        .score.A { background: #22c55e; }
        .score.B { background: #3b82f6; }
        .score.C { background: #f59e0b; }
        .score.D, .score.F { background: #ef4444; }
        .metric { text-align: center; padding: 15px; }
        .metric-value { font-size: 32px; font-weight: bold; color: #1f2937; }
        .metric-label { color: #6b7280; text-transform: uppercase; font-size: 12px; }
        .files-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .file-item { border-bottom: 1px solid #e5e7eb; padding: 12px 0; display: flex; justify-content: space-between; align-items: center; }
        .file-path { font-family: monospace; color: #374151; }
        .file-score { font-weight: bold; padding: 4px 8px; border-radius: 4px; color: white; font-size: 14px; }
        .score-excellent { background: #22c55e; }
        .score-good { background: #3b82f6; }
        .score-fair { background: #f59e0b; }
        .score-poor { background: #ef4444; }
        .issues-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px; }
        .issue-type { text-align: center; padding: 15px; border-radius: 6px; }
        .issue-type.error { background: #fef2f2; color: #dc2626; }
        .issue-type.warning { background: #fffbeb; color: #d97706; }
        .issue-type.info { background: #eff6ff; color: #2563eb; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
        .category-item { background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; }
        .category-score { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .category-name { color: #6b7280; font-size: 14px; }
        .recommendations { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-top: 20px; }
        .rec-title { font-weight: bold; color: #0c4a6e; margin-bottom: 10px; }
        .rec-item { margin-bottom: 8px; color: #075985; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Next.js + MUI Audit Report</h1>
            <p>Generated: ${timestamp} | v1.1.0</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <div class="score ${grades.letterGrade}">${grades.overallScore}</div>
                <h3 style="text-align: center; margin: 10px 0;">Grade: ${grades.letterGrade}</h3>
                <p style="text-align: center; color: #6b7280;">Overall Score</p>
            </div>
            
            <div class="card">
                <div class="metric">
                    <div class="metric-value">${totalFiles}</div>
                    <div class="metric-label">Files Scanned</div>
                </div>
            </div>
            
            <div class="card">
                <div class="metric">
                    <div class="metric-value">${totalIssues}</div>
                    <div class="metric-label">Total Issues</div>
                </div>
            </div>
            
            <div class="card">
                <div class="metric">
                    <div class="metric-value" style="color: ${criticalIssues > 0 ? '#dc2626' : '#22c55e'}">${criticalIssues}</div>
                    <div class="metric-label">Critical Issues</div>
                </div>
            </div>
        </div>

        <div class="issues-summary">
            <div class="issue-type error">
                <div style="font-size: 24px; font-weight: bold;">${results.summary?.issuesBySeverity?.error || 0}</div>
                <div>🔴 Errors</div>
            </div>
            <div class="issue-type warning">
                <div style="font-size: 24px; font-weight: bold;">${results.summary?.issuesBySeverity?.warning || 0}</div>
                <div>🟡 Warnings</div>
            </div>
            <div class="issue-type info">
                <div style="font-size: 24px; font-weight: bold;">${results.summary?.issuesBySeverity?.info || 0}</div>
                <div>🔵 Info</div>
            </div>
        </div>

        <div class="card">
            <h2>📊 Category Scores</h2>
            <div class="category-grid">
                ${this.generateCategoryScores(grades)}
            </div>
        </div>

        <div class="files-section">
            <h2>📁 Files Analysis</h2>
            ${this.generateFilesList(results)}
        </div>

        <div class="recommendations">
            <div class="rec-title">💡 Recommendations</div>
            ${this.generateRecommendations(results, grades)}
        </div>
    </div>
</body>
</html>`
  }

  generateCategoryScores(grades) {
    const categories = [
      { key: 'nextjs', name: 'Next.js', icon: '⚡' },
      { key: 'mui', name: 'MUI', icon: '🎨' },
      { key: 'accessibility', name: 'Accessibility', icon: '♿' },
      { key: 'performance', name: 'Performance', icon: '🚀' },
      { key: 'security', name: 'Security', icon: '🔒' },
      { key: 'quality', name: 'Code Quality', icon: '✨' }
    ]

    return categories
      .map(category => {
        const score = grades.categoryScores?.[category.key] || 0
        const color = this.getScoreColor(score)

        return `
        <div class="category-item">
            <div style="font-size: 20px; margin-bottom: 8px;">${category.icon}</div>
            <div class="category-score" style="color: ${color};">${score}</div>
            <div class="category-name">${category.name}</div>
        </div>`
      })
      .join('')
  }

  generateFilesList(results) {
    const files = Object.entries(results.files || {}).slice(0, 20) // Limit to first 20 files

    if (files.length === 0) {
      return '<p>No files found.</p>'
    }

    return files
      .map(([path, data]) => {
        const scoreClass = this.getScoreClass(data.score)
        const issueCount = data.issues?.length || 0

        return `
        <div class="file-item">
            <div class="file-path">${path}</div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span>${issueCount} issues</span>
                <span class="file-score ${scoreClass}">${data.score}</span>
            </div>
        </div>`
      })
      .join('')
  }

  generateRecommendations(results, grades) {
    const recommendations = []

    if (grades.criticalIssues > 0) {
      recommendations.push(`🔴 Fix ${grades.criticalIssues} critical issues immediately`)
    }

    if (grades.overallScore < 85) {
      recommendations.push(`📈 Improve overall score from ${grades.overallScore} to at least 85`)
    }

    Object.entries(grades.categoryScores || {}).forEach(([category, score]) => {
      if (score < 70) {
        recommendations.push(`🎯 Focus on improving ${category} (current: ${score})`)
      }
    })

    if (recommendations.length === 0) {
      recommendations.push('✅ Great job! Your code quality looks excellent.')
    }

    return recommendations.map(rec => `<div class="rec-item">${rec}</div>`).join('')
  }

  getScoreClass(score) {
    if (score >= 90) return 'score-excellent'
    if (score >= 80) return 'score-good'
    if (score >= 70) return 'score-fair'
    return 'score-poor'
  }

  getScoreColor(score) {
    if (score >= 90) return '#22c55e'
    if (score >= 80) return '#3b82f6'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }
}

export const htmlReporter = new HTMLReporter()
