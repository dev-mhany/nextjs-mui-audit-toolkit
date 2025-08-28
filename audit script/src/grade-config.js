export const gradeConfig = {
  // Weights for different categories (total should equal 100)
  weights: {
    nextjs: 14, // Next.js architecture and best practices
    mui: 14, // Material-UI usage and styling
    accessibility: 8, // WCAG compliance and accessibility
    responsive: 8, // Responsive design and mobile-first approach
    performance: 8, // Performance optimizations and bundle size
    security: 8, // Security best practices
    quality: 10, // Code quality, linting, and DX
    testing: 6, // Testing coverage and documentation
    seo: 8, // SEO optimization and meta tags
    image: 6, // Image optimization and formats
    modern: 4, // Modern React and web development practices
    pwa: 6 // PWA essentials and production readiness
  },

  // Score thresholds for letter grades
  thresholds: {
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0
  },

  // Issue severity weights for scoring (more strict)
  severityWeights: {
    error: 15, // Critical issues that should block deployment
    warning: 8, // Issues that should be addressed soon
    info: 3 // Suggestions for improvement
  },

  // Minimum acceptable scores for CI/CD
  minimumScores: {
    overall: 90, // Overall project score (more strict)
    critical: 0 // Maximum allowed critical issues (0 = none allowed)
  },

  // Category-specific scoring rules
  categoryRules: {
    nextjs: {
      criticalRules: ['next/image-usage', 'next/head-usage'],
      weightMultiplier: 1.0
    },
    mui: {
      criticalRules: ['mui/inline-styles', 'mui/deprecated-apis'],
      weightMultiplier: 1.0
    },
    accessibility: {
      criticalRules: ['a11y/missing-alt', 'a11y/button-label'],
      weightMultiplier: 1.0
    },
    security: {
      criticalRules: ['security/no-secrets', 'security/dangerous-html'],
      weightMultiplier: 2.0 // Security issues are weighted more heavily
    },
    seo: {
      criticalRules: ['seo/title-tag'],
      weightMultiplier: 1.0
    },
    image: {
      criticalRules: ['image/missing-alt', 'image/next-image'],
      weightMultiplier: 1.0
    },
    modern: {
      criticalRules: ['modern/error-boundaries'],
      weightMultiplier: 1.0
    },
    pwa: {
      criticalRules: ['pwa/manifest-exists', 'pwa/manifest-fields', 'pwa/service-worker'],
      weightMultiplier: 2.0 // PWA issues are critical for production
    },
    structure: {
      criticalRules: ['structure/public-folder-organization'],
      weightMultiplier: 1.0
    }
  },

  // File scoring rules
  fileScoring: {
    baseScore: 100,
    deductions: {
      error: 10,
      warning: 5,
      info: 2
    },
    minimumFileScore: 0
  },

  // Grading scale descriptions
  gradeDescriptions: {
    A: 'Excellent - Follows all best practices with minimal issues',
    B: 'Good - Minor issues that should be addressed',
    C: 'Fair - Several issues that need attention',
    D: 'Poor - Many issues requiring significant work',
    F: 'Failing - Critical issues that must be resolved'
  }
}
