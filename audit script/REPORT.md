# Next.js + MUI Audit Report

## 📊 Executive Summary

**Overall Score:** 72/100 (C)

**Project Status:** 🟠 Fair - Several Issues to Address

**Audit Date:** ٢٧‏/٨‏/٢٠٢٥

**Total Files Scanned:** 27

**Total Issues Found:** 510

**Critical Issues:** 160

---

## 🎯 Category Breakdown

| Category | Score | Weight | Status |
|----------|-------|--------|--------|
| Next.js Architecture | 68/100 | 14 | 🔴 |
| MUI Usage | 41/100 | 14 | ⚫ |
| Accessibility | 68/100 | 8 | 🔴 |
| Responsive Design | 85/100 | 8 | 🟡 |
| Performance | 78/100 | 8 | 🟠 |
| Security | 70/100 | 8 | 🟠 |
| Code Quality | 29/100 | 10 | ⚫ |
| Testing | 0/100 | 6 | ⚫ |
| SEO | 0/100 | 8 | ⚫ |
| Image Optimization | 0/100 | 6 | ⚫ |
| Modern Practices | 0/100 | 4 | ⚫ |
| PWA Essentials | 88/100 | 6 | 🟡 |


---

## 🚨 Top Issues to Fix

| File | Line:Col | Category | Severity | Issue |
|------|----------|----------|----------|-------|
| [``]() | undefined:undefined | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... |
| [``]() | undefined:undefined | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... |
| [``]() | undefined:undefined | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... |
| [``]() | undefined:undefined | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible |
| [``]() | undefined:undefined | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag |
| [``]() | undefined:undefined | Image | 🔴 Error | Use Next.js Image component instead of img tag |
| [``]() | undefined:undefined | Accessibility | 🔴 Error | Image missing alt attribute |
| [``]() | undefined:undefined | Pwa | 🔴 Error | Missing theme-color meta tag |
| [``]() | undefined:undefined | Security | 🔴 Error | Unsafe eval() usage detected |
| [``]() | undefined:undefined | Security | 🔴 Error | dangerouslySetInnerHTML usage detected |


---

## 📁 File-by-File Analysis

| File | Score | Issues | Critical |
|------|-------|--------|----------|
| [`test-audit.js`](test-audit.js) | ⚫ 0/100 | 21 | 0 |
| [`playwright.config.ts`](playwright.config.ts) | 🟡 85/100 | 1 | 1 |
| [`next.config.js`](next.config.js) | 🟠 70/100 | 2 | 2 |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | ⚫ 0/100 | 17 | 4 |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | ⚫ 20/100 | 10 | 0 |
| [`tests\basic.spec.ts`](tests\basic.spec.ts) | 🟢 100/100 | 0 | 0 |
| [`tests\a11y.spec.ts`](tests\a11y.spec.ts) | 🟢 100/100 | 0 | 0 |
| [`src\utils.js`](src\utils.js) | ⚫ 0/100 | 18 | 2 |
| [`src\scanner.js`](src\scanner.js) | ⚫ 0/100 | 12 | 2 |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | ⚫ 0/100 | 23 | 0 |
| [`src\rules.js`](src\rules.js) | ⚫ 0/100 | 135 | 93 |
| [`src\reporter.js`](src\reporter.js) | ⚫ 0/100 | 21 | 2 |
| [`src\reporter-old.js`](src\reporter-old.js) | ⚫ 0/100 | 20 | 2 |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | ⚫ 0/100 | 19 | 2 |
| [`src\pwa-scanner.js`](src\pwa-scanner.js) | 🟡 84/100 | 2 | 0 |
| [`src\manual-check.js`](src\manual-check.js) | ⚫ 0/100 | 20 | 1 |
| [`src\index.js`](src\index.js) | ⚫ 0/100 | 16 | 0 |
| [`src\grader.js`](src\grader.js) | ⚫ 44/100 | 7 | 0 |
| [`src\grade-config.js`](src\grade-config.js) | 🟢 100/100 | 0 | 0 |
| [`src\eslint-runner.js`](src\eslint-runner.js) | ⚫ 0/100 | 15 | 0 |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | ⚫ 0/100 | 47 | 0 |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | ⚫ 0/100 | 17 | 0 |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | ⚫ 0/100 | 23 | 21 |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | ⚫ 0/100 | 12 | 9 |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | ⚫ 0/100 | 24 | 10 |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | ⚫ 0/100 | 11 | 5 |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | ⚫ 0/100 | 16 | 3 |
| [`public/`](public/) | 🟡 85/100 | 1 | 1 |


---

## 🔍 Issue Details by Category

### Quality

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 204:34 | Quality | 🔴 Error | Avoid using "any" type - use proper typing | Replace "any" with proper TypeScript types or "unknown" if t... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 204:46 | Quality | 🔴 Error | Avoid using "any" type - use proper typing | Replace "any" with proper TypeScript types or "unknown" if t... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 1:1 | Quality | 🟡 Warning | File is too large (246 lines) | Split large file into smaller, focused modules |
| [`src\scanner.js`](src\scanner.js) | 1:1 | Quality | 🟡 Warning | File is too large (551 lines) | Split large file into smaller, focused modules |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 1:1 | Quality | 🟡 Warning | File is too large (557 lines) | Split large file into smaller, focused modules |
| [`src\rules.js`](src\rules.js) | 1:11 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 1:1 | Quality | 🟡 Warning | File is too large (2736 lines) | Split large file into smaller, focused modules |
| [`src\reporter.js`](src\reporter.js) | 1:1 | Quality | 🟡 Warning | File is too large (611 lines) | Split large file into smaller, focused modules |
| [`src\reporter-old.js`](src\reporter-old.js) | 1:1 | Quality | 🟡 Warning | File is too large (550 lines) | Split large file into smaller, focused modules |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 1:1 | Quality | 🟡 Warning | File is too large (544 lines) | Split large file into smaller, focused modules |
| [`src\pwa-scanner.js`](src\pwa-scanner.js) | 1:1 | Quality | 🟡 Warning | File is too large (283 lines) | Split large file into smaller, focused modules |
| [`src\manual-check.js`](src\manual-check.js) | 1:1 | Quality | 🟡 Warning | File is too large (212 lines) | Split large file into smaller, focused modules |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 1:1 | Quality | 🟡 Warning | File is too large (231 lines) | Split large file into smaller, focused modules |
| [`src\rules.js`](src\rules.js) | 2:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\grader.js`](src\grader.js) | 3:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 3:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\utils.js`](src\utils.js) | 4:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\pwa-scanner.js`](src\pwa-scanner.js) | 4:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 5:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\scanner.js`](src\scanner.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 6:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 7:1 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 7:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 8:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 13:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 15:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 16:50 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 17:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter.js`](src\reporter.js) | 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-old.js`](src\reporter-old.js) | 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter.js`](src\reporter.js) | 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 23:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 25:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 25:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 25:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 25:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 25:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 26:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 27:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 27:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 27:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 27:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 28:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`src\utils.js`](src\utils.js) | 28:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 29:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 29:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 30:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 30:16 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 31:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 31:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 33:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 34:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 34:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 34:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 35:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 35:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 36:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 36:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 37:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 38:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 38:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 41:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 42:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 42:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 42:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 43:32 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 43:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 44:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 45:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\index.js`](src\index.js) | 46:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\grader.js`](src\grader.js) | 46:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 46:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 48:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 48:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 49:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 50:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 51:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 52:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 53:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 55:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 55:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\utils.js`](src\utils.js) | 57:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\index.js`](src\index.js) | 58:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`test-audit.js`](test-audit.js) | 59:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 59:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\rules.js`](src\rules.js) | 60:24 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\utils.js`](src\utils.js) | 62:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\index.js`](src\index.js) | 62:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 62:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`test-audit.js`](test-audit.js) | 63:1 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 64:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 65:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`src\index.js`](src\index.js) | 66:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 67:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\index.js`](src\index.js) | 67:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 69:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 69:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 70:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\rules.js`](src\rules.js) | 70:32 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 70:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 72:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 73:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 73:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 73:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\grader.js`](src\grader.js) | 74:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 75:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 76:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 78:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 79:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 79:23 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 80:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 80:23 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 82:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 83:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\index.js`](src\index.js) | 83:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 83:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 84:32 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\index.js`](src\index.js) | 85:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 85:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 86:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 90:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`src\utils.js`](src\utils.js) | 90:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 91:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 91:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\grader.js`](src\grader.js) | 93:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\manual-check.js`](src\manual-check.js) | 94:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 95:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 96:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\utils.js`](src\utils.js) | 100:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\grader.js`](src\grader.js) | 101:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\utils.js`](src\utils.js) | 104:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 109:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 113:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 114:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\utils.js`](src\utils.js) | 118:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 125:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | 126:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\scanner.js`](src\scanner.js) | 126:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 128:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 129:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 131:27 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 132:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 134:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\eslint-runner.js`](src\eslint-runner.js) | 135:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\grader.js`](src\grader.js) | 138:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 139:9 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`src\reporter.js`](src\reporter.js) | 141:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 142:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\scanner.js`](src\scanner.js) | 143:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 149:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 166:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 170:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\grader.js`](src\grader.js) | 170:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 177:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\scanner.js`](src\scanner.js) | 179:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\scanner.js`](src\scanner.js) | 183:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 186:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 187:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\scanner.js`](src\scanner.js) | 189:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 190:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 194:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 194:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\scanner.js`](src\scanner.js) | 198:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 198:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 201:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 201:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\manual-check.js`](src\manual-check.js) | 202:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 202:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 203:11 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 203:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 204:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 204:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 205:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 207:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 211:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 214:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 217:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 218:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\scanner.js`](src\scanner.js) | 219:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 221:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 221:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 224:3 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 225:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-old.js`](src\reporter-old.js) | 226:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 234:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 237:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 242:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-old.js`](src\reporter-old.js) | 242:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 249:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 257:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 261:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-old.js`](src\reporter-old.js) | 265:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 280:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 301:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 311:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 315:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 335:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 358:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 358:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 371:33 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\rules.js`](src\rules.js) | 372:33 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| [`src\reporter-old.js`](src\reporter-old.js) | 372:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 392:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 409:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 423:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 431:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\scanner.js`](src\scanner.js) | 441:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 454:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 461:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 492:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 507:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 514:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 516:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 521:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 522:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 524:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | 528:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 530:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 536:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 537:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter-old.js`](src\reporter-old.js) | 543:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 560:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 568:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 581:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\reporter.js`](src\reporter.js) | 589:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 1339:42 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 1352:56 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 2267:38 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 2270:34 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| [`src\rules.js`](src\rules.js) | 2271:44 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

---

### 📄 [`test-audit.js`](test-audit.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 7:1 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 13:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 17:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 25:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 29:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 30:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 31:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 35:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 36:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 37:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 38:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 42:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 44:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 48:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 49:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 50:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 51:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 52:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 55:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 59:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 63:1 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (246 lines) | Split large file into smaller, focused modules |
| 15:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 25:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 114:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 128:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 139:9 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 166:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 203:11 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 204:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 204:34 | Quality | 🔴 Error | Avoid using "any" type - use proper typing | Replace "any" with proper TypeScript types or "unknown" if type is truly unknown |
| 204:46 | Quality | 🔴 Error | Avoid using "any" type - use proper typing | Replace "any" with proper TypeScript types or "unknown" if type is truly unknown |
| 234:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 237:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 242:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`tests\coverage.spec.ts`](tests\coverage.spec.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 28:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 34:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 42:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 43:32 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 65:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 70:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 90:5 | Quality | 🟡 Warning | Function should have explicit return type annotation |  |
| 95:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 125:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 126:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`src\utils.js`](src\utils.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 4:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 28:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 35:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 45:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 53:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 57:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 62:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 67:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 72:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 76:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 80:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 90:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 96:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 100:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 104:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 118:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\scanner.js`](src\scanner.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (551 lines) | Split large file into smaller, focused modules |
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 126:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 143:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 179:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 183:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 189:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 198:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 219:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 441:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\runtime-auditor.js`](src\runtime-auditor.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (557 lines) | Split large file into smaller, focused modules |
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 25:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 33:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 41:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 48:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 55:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 59:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 109:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 207:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 224:3 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 249:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 257:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 261:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 311:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 358:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 409:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 454:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 507:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 514:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 521:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 528:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:11 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 1:1 | Quality | 🟡 Warning | File is too large (2736 lines) | Split large file into smaller, focused modules |
| 2:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 60:24 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 70:32 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 84:32 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 371:33 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 372:33 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 1339:42 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 1352:56 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 2267:38 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 2270:34 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 2271:44 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\reporter.js`](src\reporter.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (611 lines) | Split large file into smaller, focused modules |
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 141:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 149:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 177:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 201:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 221:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 315:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 335:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 392:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 461:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 536:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 560:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 568:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 581:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 589:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\reporter-old.js`](src\reporter-old.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (550 lines) | Split large file into smaller, focused modules |
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 190:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 198:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 226:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 242:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 265:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 280:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 372:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 431:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 522:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 530:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 543:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\reporter-fixed.js`](src\reporter-fixed.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (544 lines) | Split large file into smaller, focused modules |
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 17:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 57:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 134:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 142:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 170:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 194:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 211:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 301:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 358:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 423:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 492:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 516:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 524:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 537:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\pwa-scanner.js`](src\pwa-scanner.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (283 lines) | Split large file into smaller, focused modules |
| 4:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\manual-check.js`](src\manual-check.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (212 lines) | Split large file into smaller, focused modules |
| 23:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 25:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 26:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 27:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 29:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 30:16 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 70:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 73:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 82:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 83:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 86:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 91:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 94:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 129:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 202:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\index.js`](src\index.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 25:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 27:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 34:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 38:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 42:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 46:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 58:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 62:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 66:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 67:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 69:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 73:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 79:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 83:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 85:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`src\grader.js`](src\grader.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 3:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 46:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 74:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 93:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 101:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 138:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 170:8 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`src\eslint-runner.js`](src\eslint-runner.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 6:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 23:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 28:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 31:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 36:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 46:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 62:7 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 64:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 73:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 75:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 78:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 79:23 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 80:23 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 85:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 135:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`scripts\contrast-check.ts`](scripts\contrast-check.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Quality | 🟡 Warning | File is too large (231 lines) | Split large file into smaller, focused modules |
| 27:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 34:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 43:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 69:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 83:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 91:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 113:5 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 131:27 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 132:14 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 186:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 187:3 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 194:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 201:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 202:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 203:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 204:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 205:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 214:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 217:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 218:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 221:9 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |
| 225:7 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 8:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 7:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 27:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 3:16 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### 📄 [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 5:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |
| 16:50 | Quality | 🟡 Warning | Console statement in production code | Remove console statements or use proper logging library |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 6:1 | Quality | 🟡 Warning | Function is too complex (high cyclomatic complexity) |  |

### Pwa

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Pwa | 🔴 Error | PWA manifest.json reference missing | Add <link rel="manifest" href="/manifest.json"> to enable PW... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Pwa | 🔴 Error | Missing theme-color meta tag | Add <meta name="theme-color" content="#your-color"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Pwa | 🔴 Error | Missing manifest link tag | Add <link rel="manifest" href="/manifest.json"> |
| [`playwright.config.ts`](playwright.config.ts) | 11:14 | Pwa | 🔴 Error | Mixed content detected - PWA requires HTTPS | Replace http:// with https:// or relative URLs for PWA compl... |
| [`src\rules.js`](src\rules.js) | 2142:26 | Pwa | 🔴 Error | Mixed content detected - PWA requires HTTPS | Replace http:// with https:// or relative URLs for PWA compl... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Pwa | 🟡 Warning | Missing apple-touch-icon link | Add <link rel="apple-touch-icon" href="/icon-180x180.png"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Pwa | 🟡 Warning | Missing color-scheme meta tag | Add <meta name="color-scheme" content="light dark"> |

---

### 📄 [`playwright.config.ts`](playwright.config.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 11:14 | Pwa | 🔴 Error | Mixed content detected - PWA requires HTTPS | Replace http:// with https:// or relative URLs for PWA compliance |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 2142:26 | Pwa | 🔴 Error | Mixed content detected - PWA requires HTTPS | Replace http:// with https:// or relative URLs for PWA compliance |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Pwa | 🔴 Error | PWA manifest.json reference missing | Add <link rel="manifest" href="/manifest.json"> to enable PWA functionality |
| 1:1 | Pwa | 🔴 Error | Missing theme-color meta tag | Add <meta name="theme-color" content="#your-color"> |
| 1:1 | Pwa | 🔴 Error | Missing manifest link tag | Add <link rel="manifest" href="/manifest.json"> |
| 1:1 | Pwa | 🟡 Warning | Missing apple-touch-icon link | Add <link rel="apple-touch-icon" href="/icon-180x180.png"> |
| 1:1 | Pwa | 🟡 Warning | Missing color-scheme meta tag | Add <meta name="color-scheme" content="light dark"> |

### Performance

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 4:1 | Performance | 🔴 Error | Client hook used inside a Server Component. Add "use client"... | Move client-only logic to a Client Component or add "use cli... |
| [`next.config.js`](next.config.js) | 22:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 36:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`src\rules.js`](src\rules.js) | 387:1 | Performance | 🔴 Error | Client hook used inside a Server Component. Add "use client"... | Move client-only logic to a Client Component or add "use cli... |
| [`src\scanner.js`](src\scanner.js) | 533:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`src\rules.js`](src\rules.js) | 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`src\rules.js`](src\rules.js) | 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`src\rules.js`](src\rules.js) | 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Co... | Isolate browser access behind a client boundary or a server-... |
| [`src\rules.js`](src\rules.js) | 1:1 | Performance | 🟡 Warning | File has 15 client components | Consider converting some components to Server Components |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 1:1 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 17:1 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 53:4 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| [`src\rules.js`](src\rules.js) | 103:27 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 104:21 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 105:25 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 108:53 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 125:35 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 130:23 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 325:33 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| [`src\rules.js`](src\rules.js) | 326:33 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| [`src\rules.js`](src\rules.js) | 523:15 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 526:43 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 536:30 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 560:82 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 565:27 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 566:40 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 579:71 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 584:68 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| [`src\rules.js`](src\rules.js) | 636:51 | Performance | 🟡 Warning | Too many client components may impact performance |  |

---

### 📄 [`next.config.js`](next.config.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 22:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |

### 📄 [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 36:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |

### 📄 [`src\scanner.js`](src\scanner.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 533:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Performance | 🟡 Warning | File has 15 client components | Consider converting some components to Server Components |
| 103:27 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 104:21 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 105:25 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 108:53 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 125:35 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 130:23 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 325:33 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| 326:33 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| 387:1 | Performance | 🔴 Error | Client hook used inside a Server Component. Add "use client" or refactor. | Move client-only logic to a Client Component or add "use client" at the top if r... |
| 523:15 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 526:43 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 536:30 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 560:82 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 565:27 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 566:40 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 579:71 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 584:68 | Performance | 🟡 Warning | Too many client components may impact performance |  |
| 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |
| 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |
| 590:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |
| 636:51 | Performance | 🟡 Warning | Too many client components may impact performance |  |

### 📄 [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 4:1 | Performance | 🔴 Error | Client hook used inside a Server Component. Add "use client" or refactor. | Move client-only logic to a Client Component or add "use client" at the top if r... |

### 📄 [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 17:1 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |
| 53:4 | Performance | 🟡 Warning | Large import detected - consider code splitting | Use dynamic imports or tree-shakeable alternatives |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Performance | 🔴 Error | Browser global used in a Server Component. Move to Client Component or dynamic i... | Isolate browser access behind a client boundary or a server-safe wrapper |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Performance | 🟡 Warning | Too many client components may impact performance |  |

### Security

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`next.config.js`](next.config.js) | 1:1 | Security | 🔴 Error | Security headers function not configured | Add async headers() function with security headers |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 8:9 | Security | 🔴 Error | Potential secret/credential detected | Use environment variables instead of hardcoded secrets |
| [`src\utils.js`](src\utils.js) | 24:32 | Security | 🔴 Error | Potential SQL injection vulnerability | Use parameterized queries or ORM to prevent SQL injection |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 36:20 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| [`src\scanner.js`](src\scanner.js) | 172:36 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |
| [`src\rules.js`](src\rules.js) | 679:15 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| [`src\rules.js`](src\rules.js) | 680:15 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| [`src\rules.js`](src\rules.js) | 976:24 | Security | 🔴 Error | Potential SQL injection vulnerability | Use parameterized queries or ORM to prevent SQL injection |
| [`src\rules.js`](src\rules.js) | 1138:15 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| [`src\rules.js`](src\rules.js) | 1138:25 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| [`src\rules.js`](src\rules.js) | 1139:65 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| [`src\rules.js`](src\rules.js) | 1145:22 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |
| [`src\rules.js`](src\rules.js) | 1147:24 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 44:43 | Security | 🔵 Info | External link missing security attributes | Add rel="noopener noreferrer" for security |
| [`src\rules.js`](src\rules.js) | 2387:72 | Security | 🔵 Info | External link missing security attributes | Add rel="noopener noreferrer" for security |

---

### 📄 [`next.config.js`](next.config.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Security | 🔴 Error | Security headers function not configured | Add async headers() function with security headers |

### 📄 [`src\utils.js`](src\utils.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 24:32 | Security | 🔴 Error | Potential SQL injection vulnerability | Use parameterized queries or ORM to prevent SQL injection |

### 📄 [`src\scanner.js`](src\scanner.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 172:36 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 679:15 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| 680:15 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| 976:24 | Security | 🔴 Error | Potential SQL injection vulnerability | Use parameterized queries or ORM to prevent SQL injection |
| 1138:15 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| 1138:25 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| 1139:65 | Security | 🔴 Error | Potential XSS vulnerability detected | Use textContent or React components instead of innerHTML |
| 1145:22 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |
| 1147:24 | Security | 🔴 Error | Unsafe eval() usage detected | Avoid eval() and use safer alternatives |
| 2387:72 | Security | 🔵 Info | External link missing security attributes | Add rel="noopener noreferrer" for security |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 8:9 | Security | 🔴 Error | Potential secret/credential detected | Use environment variables instead of hardcoded secrets |
| 36:20 | Security | 🔴 Error | dangerouslySetInnerHTML usage detected | Sanitize HTML content or use React components instead |
| 44:43 | Security | 🔵 Info | External link missing security attributes | Add rel="noopener noreferrer" for security |

### Accessibility

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 16:35 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 19:11 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 44:43 | Accessibility | 🔴 Error | target="_blank" without rel="noopener" is a security vulnera... | Add rel="noopener noreferrer" for security when using target... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 57:19 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 112:56 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 152:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`src\rules.js`](src\rules.js) | 152:15 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compli... | Add alt attribute to all images for screen reader accessibil... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 208:81 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 513:24 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 891:10 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`src\rules.js`](src\rules.js) | 891:10 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compli... | Add alt attribute to all images for screen reader accessibil... |
| [`src\rules.js`](src\rules.js) | 937:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`src\rules.js`](src\rules.js) | 945:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`src\rules.js`](src\rules.js) | 945:15 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compli... | Add alt attribute to all images for screen reader accessibil... |
| [`src\rules.js`](src\rules.js) | 1341:35 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 1741:24 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 1741:42 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessi... |
| [`src\rules.js`](src\rules.js) | 2387:72 | Accessibility | 🔴 Error | target="_blank" without rel="noopener" is a security vulnera... | Add rel="noopener noreferrer" for security when using target... |
| [`src\rules.js`](src\rules.js) | 2394:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 1:1 | Accessibility | 🟡 Warning | Hardcoded colors detected - contrast validation needed | Use theme.palette colors and validate contrast ratios meet W... |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 16:35 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 57:19 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`src\rules.js`](src\rules.js) | 112:56 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 208:81 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`src\rules.js`](src\rules.js) | 513:24 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`src\rules.js`](src\rules.js) | 1341:35 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`src\rules.js`](src\rules.js) | 1741:24 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| [`src\rules.js`](src\rules.js) | 1741:42 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |

---

### 📄 [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 208:81 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 208:81 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 112:56 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 112:56 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 152:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| 152:15 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compliance | Add alt attribute to all images for screen reader accessibility |
| 513:24 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 513:24 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 891:10 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| 891:10 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compliance | Add alt attribute to all images for screen reader accessibility |
| 937:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| 945:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |
| 945:15 | Accessibility | 🔴 Error | All images must have alt attributes for accessibility compliance | Add alt attribute to all images for screen reader accessibility |
| 1341:35 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 1341:35 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 1741:24 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 1741:42 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 1741:24 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 1741:42 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 2387:72 | Accessibility | 🔴 Error | target="_blank" without rel="noopener" is a security vulnerability | Add rel="noopener noreferrer" for security when using target="_blank" |
| 2394:15 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |

### 📄 [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Accessibility | 🟡 Warning | Hardcoded colors detected - contrast validation needed | Use theme.palette colors and validate contrast ratios meet WCAG AA (4.5:1 for no... |

### 📄 [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 57:19 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 57:19 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |

### 📄 [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 16:35 | Accessibility | 🟡 Warning | Interactive element missing keyboard support | Add keyboard event handlers and tabIndex for accessibility |
| 16:35 | Accessibility | 🔴 Error | Interactive elements must be keyboard accessible | Add keyboard event handlers or make element keyboard accessible |
| 19:11 | Accessibility | 🔴 Error | Image missing alt attribute | Add alt attribute for screen reader accessibility |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 44:43 | Accessibility | 🔴 Error | target="_blank" without rel="noopener" is a security vulnerability | Add rel="noopener noreferrer" for security when using target="_blank" |

### Nextjs

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 3:1 | Nextjs | 🔴 Error | Use Metadata API instead of next/head | Replace with Metadata API: export const metadata = { title: ... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 12:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 13:24 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 13:22 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 14:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 14:20 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mis... | Use a stable ID or move to useEffect for client-side only re... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 15:27 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 15:25 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 19:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 19:11 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 20:21 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 20:17 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\reporter.js`](src\reporter.js) | 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\reporter-old.js`](src\reporter-old.js) | 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\manual-check.js`](src\manual-check.js) | 55:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 63:25 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 63:30 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 63:19 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydrati... | Use a stable seed or move to useEffect for client-side only ... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 64:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 65:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 65:16 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`src\reporter-old.js`](src\reporter-old.js) | 69:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | 69:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\reporter.js`](src\reporter.js) | 70:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 73:25 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 74:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | 75:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\utils.js`](src\utils.js) | 101:10 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 152:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 377:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 378:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 378:27 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 383:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 383:11 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 385:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 385:30 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 389:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 389:66 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 393:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 394:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 394:27 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`src\rules.js`](src\rules.js) | 399:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 399:11 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`src\rules.js`](src\rules.js) | 401:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 401:30 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`src\rules.js`](src\rules.js) | 406:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 406:66 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side ... |
| [`src\rules.js`](src\rules.js) | 410:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 411:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 416:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 418:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 423:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 427:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 428:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 428:27 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mis... | Use a stable ID or move to useEffect for client-side only re... |
| [`src\rules.js`](src\rules.js) | 433:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 433:11 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mis... | Use a stable ID or move to useEffect for client-side only re... |
| [`src\rules.js`](src\rules.js) | 435:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 435:30 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mis... | Use a stable ID or move to useEffect for client-side only re... |
| [`src\rules.js`](src\rules.js) | 439:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 439:66 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mis... | Use a stable ID or move to useEffect for client-side only re... |
| [`src\rules.js`](src\rules.js) | 443:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 444:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 444:38 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 444:27 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydrati... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 449:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 449:22 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 449:11 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydrati... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 451:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 451:41 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 451:30 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydrati... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 455:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values i... | Use stable values for SSR or move non-deterministic logic to... |
| [`src\rules.js`](src\rules.js) | 455:77 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatche... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 455:66 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydrati... | Use a stable seed or move to useEffect for client-side only ... |
| [`src\rules.js`](src\rules.js) | 489:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 891:10 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 937:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 945:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 2394:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 1:1 | Nextjs | 🟡 Warning | Unnecessary "use client" directive detected | Remove "use client" if component doesn't need client-side fe... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 7:15 | Nextjs | 🟡 Warning | Use next/font instead of external font links | Use next/font/google for Google Fonts optimization |
| [`src\rules.js`](src\rules.js) | 955:85 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| [`src\rules.js`](src\rules.js) | 1455:49 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| [`src\rules.js`](src\rules.js) | 1700:49 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| [`src\rules.js`](src\rules.js) | 1787:85 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| [`src\rules.js`](src\rules.js) | 2036:78 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |

---

### 📄 [`src\utils.js`](src\utils.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 101:10 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 152:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 377:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 378:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 378:27 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 383:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 383:11 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 385:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 385:30 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 389:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 389:66 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 393:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 394:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 394:27 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 399:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 399:11 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 401:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 401:30 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 406:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 406:66 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 410:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 411:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 416:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 418:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 423:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 427:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 428:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 428:27 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mismatches | Use a stable ID or move to useEffect for client-side only rendering |
| 433:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 433:11 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mismatches | Use a stable ID or move to useEffect for client-side only rendering |
| 435:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 435:30 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mismatches | Use a stable ID or move to useEffect for client-side only rendering |
| 439:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 439:66 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mismatches | Use a stable ID or move to useEffect for client-side only rendering |
| 443:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 444:35 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 444:38 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 444:27 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 449:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 449:22 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 449:11 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 451:42 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 451:41 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 451:30 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 455:78 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 455:77 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 455:66 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 489:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 891:10 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 937:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 945:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 955:85 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| 1455:49 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| 1700:49 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| 1787:85 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| 2036:78 | Nextjs | 🟡 Warning | Consider using App Router (app/ directory) for new projects | Migrate to App Router for modern Next.js features |
| 2394:15 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |

### 📄 [`src\reporter.js`](src\reporter.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 70:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`src\reporter-old.js`](src\reporter-old.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 69:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`src\reporter-fixed.js`](src\reporter-fixed.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 26:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 69:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`src\manual-check.js`](src\manual-check.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 55:18 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 12:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 13:24 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 13:22 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 14:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 14:20 | Nextjs | 🔴 Error | crypto.randomUUID() detected - this causes SSR hydration mismatches | Use a stable ID or move to useEffect for client-side only rendering |
| 15:27 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 15:25 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 19:19 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 20:21 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 20:17 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 63:25 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 63:30 | Nextjs | 🔴 Error | Math.random() detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 63:19 | Nextjs | 🔴 Error | Math.floor(Math.random()) detected - this causes SSR hydration mismatches | Use a stable seed or move to useEffect for client-side only rendering |
| 64:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 65:22 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 65:16 | Nextjs | 🔴 Error | Date.now() detected - this causes SSR hydration mismatches | Use a stable timestamp or move to useEffect for client-side only rendering |
| 73:25 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 74:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |
| 75:23 | Nextjs | 🔴 Error | SSR hydration mismatch detected - non-deterministic values in server-rendered co... | Use stable values for SSR or move non-deterministic logic to useEffect for clien... |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 7:15 | Nextjs | 🟡 Warning | Use next/font instead of external font links | Use next/font/google for Google Fonts optimization |

### 📄 [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 3:1 | Nextjs | 🔴 Error | Use Metadata API instead of next/head | Replace with Metadata API: export const metadata = { title: "..." } |
| 19:11 | Nextjs | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Nextjs | 🟡 Warning | Unnecessary "use client" directive detected | Remove "use client" if component doesn't need client-side features |

### Mui

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Mui | 🔴 Error | MUI Emotion SSR not configured | Set up createEmotionServer and extractCriticalToChunks for S... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Mui | 🔴 Error | CssBaseline not injected | Add CssBaseline to prevent FOUC and ensure consistent stylin... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Mui | 🔴 Error | ThemeProvider not found at app root | Wrap app with ThemeProvider for consistent theming |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Mui | 🔴 Error | Google Fonts blocking CSS without preload | Use next/font or add rel="preload" with display="swap" |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 8:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 8:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this cau... | Use named imports: import { Add, Edit, Delete } from "@mui/i... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 11:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 11:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this cau... | Use named imports: import { Add, Edit, Delete } from "@mui/i... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 14:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 14:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this cau... | Use named imports: import { Add, Edit, Delete } from "@mui/i... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 17:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 17:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entir... | Use specific imports: import pick from "lodash/pick", import... |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | 52:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this cau... | Use named imports: import { Add, Edit, Delete } from "@mui/i... |
| [`src\rules.js`](src\rules.js) | 325:33 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`src\rules.js`](src\rules.js) | 325:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entir... | Use specific imports: import pick from "lodash/pick", import... |
| [`src\rules.js`](src\rules.js) | 326:33 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports on... | Use named imports for MUI icons and specific imports for lod... |
| [`src\rules.js`](src\rules.js) | 326:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entir... | Use specific imports: import pick from "lodash/pick", import... |
| [`src\rules.js`](src\rules.js) | 479:16 | Mui | 🔴 Error | Deprecated MUI v4 styling API detected | Use sx prop or styled() API from MUI v5 |
| [`src\rules.js`](src\rules.js) | 479:27 | Mui | 🔴 Error | Deprecated MUI v4 styling API detected | Use sx prop or styled() API from MUI v5 |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Mui | 🟡 Warning | Font strategy not optimized | Use next/font or implement font preloading to prevent CLS |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 11:60 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 11:60 | Mui | 🟡 Warning | Hardcoded color '#1976d2' found. Use theme.palette.* token i... | Replace with theme.palette.primary.main, theme.palette.error... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 16:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 17:29 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 18:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 19:21 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 20:17 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 22:7 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first de... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 23:9 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first de... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:34 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:51 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:34 | Mui | 🟡 Warning | Hardcoded spacing '300px' found. Use theme.spacing() or sx s... | Replace with theme.spacing(2), theme.spacing(3), or sx={{ m:... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:51 | Mui | 🟡 Warning | Hardcoded spacing '200px' found. Use theme.spacing() or sx s... | Replace with theme.spacing(2), theme.spacing(3), or sx={{ m:... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 29:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 30:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 30:30 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 31:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 32:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 32:9 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first de... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 67:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 68:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 69:21 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 103:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 103:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 104:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 104:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 105:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 105:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 106:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 106:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 107:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 107:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 108:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 108:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 119:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 119:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 120:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 120:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 121:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 121:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`src\reporter-old.js`](src\reporter-old.js) | 122:48 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`src\reporter-old.js`](src\reporter-old.js) | 122:57 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 122:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 122:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 123:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 123:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 124:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | 124:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`src\manual-check.js`](src\manual-check.js) | 134:62 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |
| [`src\manual-check.js`](src\manual-check.js) | 134:71 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens ins... | Replace hardcoded colors with theme.palette.* and spacing wi... |

---

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 325:33 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 325:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entire library | Use specific imports: import pick from "lodash/pick", import debounce from "loda... |
| 326:33 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 326:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entire library | Use specific imports: import pick from "lodash/pick", import debounce from "loda... |
| 479:16 | Mui | 🔴 Error | Deprecated MUI v4 styling API detected | Use sx prop or styled() API from MUI v5 |
| 479:27 | Mui | 🔴 Error | Deprecated MUI v4 styling API detected | Use sx prop or styled() API from MUI v5 |

### 📄 [`src\reporter-old.js`](src\reporter-old.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 122:48 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 122:57 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |

### 📄 [`src\manual-check.js`](src\manual-check.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 134:62 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 134:71 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |

### 📄 [`scripts\contrast-check.ts`](scripts\contrast-check.ts)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 103:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 103:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 104:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 104:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 105:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 105:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 106:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 106:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 107:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 107:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 108:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 108:49 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 119:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 119:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 120:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 120:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 121:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 121:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 122:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 122:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 123:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 123:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 124:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 124:45 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |

### 📄 [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 16:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 17:29 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 18:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 19:21 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 20:17 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 29:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 30:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 30:30 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 31:26 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 32:22 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 67:19 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 68:20 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 69:21 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |

### 📄 [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 8:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 8:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this causes bundle bloat | Use named imports: import { Add, Edit, Delete } from "@mui/icons-material" |
| 11:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 11:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this causes bundle bloat | Use named imports: import { Add, Edit, Delete } from "@mui/icons-material" |
| 14:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 14:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this causes bundle bloat | Use named imports: import { Add, Edit, Delete } from "@mui/icons-material" |
| 17:1 | Mui | 🔴 Error | Import guards to prevent bundle bloat - use named imports only | Use named imports for MUI icons and specific imports for lodash functions to red... |
| 17:1 | Mui | 🔴 Error | Default import from lodash detected - this imports the entire library | Use specific imports: import pick from "lodash/pick", import debounce from "loda... |
| 52:1 | Mui | 🔴 Error | Wildcard import from @mui/icons-material detected - this causes bundle bloat | Use named imports: import { Add, Edit, Delete } from "@mui/icons-material" |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Mui | 🔴 Error | MUI Emotion SSR not configured | Set up createEmotionServer and extractCriticalToChunks for SSR |
| 1:1 | Mui | 🔴 Error | CssBaseline not injected | Add CssBaseline to prevent FOUC and ensure consistent styling |
| 1:1 | Mui | 🔴 Error | ThemeProvider not found at app root | Wrap app with ThemeProvider for consistent theming |
| 1:1 | Mui | 🔴 Error | Google Fonts blocking CSS without preload | Use next/font or add rel="preload" with display="swap" |
| 1:1 | Mui | 🟡 Warning | Font strategy not optimized | Use next/font or implement font preloading to prevent CLS |

### 📄 [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 11:60 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 11:60 | Mui | 🟡 Warning | Hardcoded color '#1976d2' found. Use theme.palette.* token instead. | Replace with theme.palette.primary.main, theme.palette.error.main, etc. |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 22:7 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first design |
| 23:9 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first design |
| 24:34 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 24:51 | Mui | 🟡 Warning | Hardcoded colors and spacing detected - use theme tokens instead | Replace hardcoded colors with theme.palette.* and spacing with theme.spacing() o... |
| 24:34 | Mui | 🟡 Warning | Hardcoded spacing '300px' found. Use theme.spacing() or sx scale instead. | Replace with theme.spacing(2), theme.spacing(3), or sx={{ m: 2, p: 3 }} |
| 24:51 | Mui | 🟡 Warning | Hardcoded spacing '200px' found. Use theme.spacing() or sx scale instead. | Replace with theme.spacing(2), theme.spacing(3), or sx={{ m: 2, p: 3 }} |
| 32:9 | Mui | 🟡 Warning | Grid component without responsive breakpoints | Add responsive props like xs={12} md={6} for mobile-first design |

### Image

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 19:11 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 152:15 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| [`src\rules.js`](src\rules.js) | 152:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 489:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 891:10 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| [`src\rules.js`](src\rules.js) | 891:10 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 937:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 945:15 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| [`src\rules.js`](src\rules.js) | 945:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`src\rules.js`](src\rules.js) | 2394:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | 19:11 | Image | 🟡 Warning | PNG icon should be converted to SVG | Convert /logo.png to SVG format for better scalability and s... |

---

### 📄 [`src\rules.js`](src\rules.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 152:15 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| 152:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 489:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 891:10 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| 891:10 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 937:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 945:15 | Image | 🔴 Error | Image missing alt attribute | Add alt attribute for accessibility and SEO |
| 945:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |
| 2394:15 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |

### 📄 [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 19:11 | Image | 🟡 Warning | PNG icon should be converted to SVG | Convert /logo.png to SVG format for better scalability and smaller file size |
| 19:11 | Image | 🔴 Error | Use Next.js Image component instead of img tag | Import and use <Image> from next/image for optimization |

### I18n

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 1:1 | I18n | 🟡 Warning | RTL cache not configured for MUI | Add RTL cache: const cacheRtl = createCache({ key: "mui-rtl"... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | I18n | 🟡 Warning | RTL cache not configured for MUI | Add RTL cache: const cacheRtl = createCache({ key: "mui-rtl"... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 1:1 | I18n | 🔵 Info | Consider adding RTL HTML direction support | Add <Html dir="rtl"> support for RTL locales |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | I18n | 🔵 Info | Consider adding RTL HTML direction support | Add <Html dir="rtl"> support for RTL locales |

---

### 📄 [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | I18n | 🟡 Warning | RTL cache not configured for MUI | Add RTL cache: const cacheRtl = createCache({ key: "mui-rtl", stylisPlugins: [rt... |
| 1:1 | I18n | 🔵 Info | Consider adding RTL HTML direction support | Add <Html dir="rtl"> support for RTL locales |

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | I18n | 🟡 Warning | RTL cache not configured for MUI | Add RTL cache: const cacheRtl = createCache({ key: "mui-rtl", stylisPlugins: [rt... |
| 1:1 | I18n | 🔵 Info | Consider adding RTL HTML direction support | Add <Html dir="rtl"> support for RTL locales |

### Responsive

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Responsive | 🔴 Error | Missing viewport meta tag | Add <meta name="viewport" content="width=device-width, initi... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:26 | Responsive | 🟡 Warning | Fixed pixel dimensions may cause responsive issues | Use relative units (%, rem, vw) or responsive breakpoints |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 24:42 | Responsive | 🟡 Warning | Fixed pixel dimensions may cause responsive issues | Use relative units (%, rem, vw) or responsive breakpoints |

---

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Responsive | 🔴 Error | Missing viewport meta tag | Add <meta name="viewport" content="width=device-width, initial-scale=1"> |

### 📄 [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 24:26 | Responsive | 🟡 Warning | Fixed pixel dimensions may cause responsive issues | Use relative units (%, rem, vw) or responsive breakpoints |
| 24:42 | Responsive | 🟡 Warning | Fixed pixel dimensions may cause responsive issues | Use relative units (%, rem, vw) or responsive breakpoints |

### Seo

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🔴 Error | Missing page title tag | Add <title>Your Page Title</title> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing meta tag: description | Add <meta name="description" content="Your description here"... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing meta tag: keywords | Add <meta name="keywords" content="Your keywords here"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing meta tag: author | Add <meta name="author" content="Your author here"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:title | Add <meta property="og:title" content="Your title here"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:description | Add <meta property="og:description" content="Your descriptio... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:image | Add <meta property="og:image" content="Your image here"> |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:type | Add <meta property="og:type" content="Your type here"> |

---

### 📄 [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Seo | 🟡 Warning | Missing meta tag: description | Add <meta name="description" content="Your description here"> |
| 1:1 | Seo | 🟡 Warning | Missing meta tag: keywords | Add <meta name="keywords" content="Your keywords here"> |
| 1:1 | Seo | 🟡 Warning | Missing meta tag: author | Add <meta name="author" content="Your author here"> |
| 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:title | Add <meta property="og:title" content="Your title here"> |
| 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:description | Add <meta property="og:description" content="Your description here"> |
| 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:image | Add <meta property="og:image" content="Your image here"> |
| 1:1 | Seo | 🟡 Warning | Missing Open Graph tag: og:type | Add <meta property="og:type" content="Your type here"> |
| 1:1 | Seo | 🔴 Error | Missing page title tag | Add <title>Your Page Title</title> |

### Structure

| File | Line:Col | Category | Severity | Issue | Suggestion |
|------|----------|----------|----------|-------|------------|
| [``]() | 1:1 | Structure | 🔴 Error | Public folder is missing | Create a public folder for static assets |

---

### 📄 [`public/`](public/)

| Line:Col | Category | Severity | Issue | Suggestion |
|----------|----------|----------|-------|------------|
| 1:1 | Structure | 🔴 Error | Public folder is missing | Create a public folder for static assets |



---

## 📋 All Files with Issues Summary

| File | Score | Issues | Critical |
|------|-------|--------|----------|
| [`test-audit.js`](test-audit.js) | ⚫ 0/100 | 21 | 0 |
| [`playwright.config.ts`](playwright.config.ts) | 🟡 85/100 | 1 | 1 |
| [`next.config.js`](next.config.js) | 🟠 70/100 | 2 | 2 |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | ⚫ 0/100 | 17 | 4 |
| [`tests\coverage.spec.ts`](tests\coverage.spec.ts) | ⚫ 20/100 | 10 | 0 |
| [`tests\basic.spec.ts`](tests\basic.spec.ts) | 🟢 100/100 | 0 | 0 |
| [`tests\a11y.spec.ts`](tests\a11y.spec.ts) | 🟢 100/100 | 0 | 0 |
| [`src\utils.js`](src\utils.js) | ⚫ 0/100 | 18 | 2 |
| [`src\scanner.js`](src\scanner.js) | ⚫ 0/100 | 12 | 2 |
| [`src\runtime-auditor.js`](src\runtime-auditor.js) | ⚫ 0/100 | 23 | 0 |
| [`src\rules.js`](src\rules.js) | ⚫ 0/100 | 135 | 93 |
| [`src\reporter.js`](src\reporter.js) | ⚫ 0/100 | 21 | 2 |
| [`src\reporter-old.js`](src\reporter-old.js) | ⚫ 0/100 | 20 | 2 |
| [`src\reporter-fixed.js`](src\reporter-fixed.js) | ⚫ 0/100 | 19 | 2 |
| [`src\pwa-scanner.js`](src\pwa-scanner.js) | 🟡 84/100 | 2 | 0 |
| [`src\manual-check.js`](src\manual-check.js) | ⚫ 0/100 | 20 | 1 |
| [`src\index.js`](src\index.js) | ⚫ 0/100 | 16 | 0 |
| [`src\grader.js`](src\grader.js) | ⚫ 44/100 | 7 | 0 |
| [`src\grade-config.js`](src\grade-config.js) | 🟢 100/100 | 0 | 0 |
| [`src\eslint-runner.js`](src\eslint-runner.js) | ⚫ 0/100 | 15 | 0 |
| [`scripts\contrast-check.ts`](scripts\contrast-check.ts) | ⚫ 0/100 | 47 | 0 |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | ⚫ 0/100 | 17 | 0 |
| [`examples\ssr-hydration-test.jsx`](examples\ssr-hydration-test.jsx) | ⚫ 0/100 | 23 | 21 |
| [`examples\import-guards-test.jsx`](examples\import-guards-test.jsx) | ⚫ 0/100 | 12 | 9 |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | ⚫ 0/100 | 24 | 10 |
| [`examples\sample-project\components\Header.jsx`](examples\sample-project\components\Header.jsx) | ⚫ 0/100 | 11 | 5 |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | ⚫ 0/100 | 16 | 3 |
| [`public/`](public/) | 🟡 85/100 | 1 | 1 |


---

## 📋 ESLint Analysis

No ESLint issues found or ESLint analysis not available.

---

## 📈 Detailed Metrics & Statistics

#### 📊 File Statistics

- **Total Files Scanned:** 27
- **Files with Issues:** 25
- **Clean Files:** 3

#### 📈 Score Distribution

- **90-100:** 3 files
- **80-89:** 3 files
- **70-79:** 1 files
- **0-59:** 21 files

#### 🚨 Issue Severity Distribution

- **🔴 Error:** 160 issues
- **🟡 Warning:** 346 issues
- **🔵 Info:** 4 issues

#### 🎯 Category Impact Analysis

- **Quality:** 246 issues, Avg Score: 24/100
- **Pwa:** 7 issues, Avg Score: 3/100
- **Performance:** 30 issues, Avg Score: 3/100
- **Security:** 15 issues, Avg Score: 3/100
- **Accessibility:** 28 issues, Avg Score: 0/100
- **Nextjs:** 87 issues, Avg Score: 0/100
- **Mui:** 70 issues, Avg Score: 0/100
- **Image:** 11 issues, Avg Score: 0/100
- **I18n:** 4 issues, Avg Score: 0/100
- **Responsive:** 3 issues, Avg Score: 0/100
- **Seo:** 8 issues, Avg Score: 0/100
- **Structure:** 1 issues, Avg Score: 3/100


---

## 🎯 Priority Matrix

#### 🔴 High Priority (Errors)

| File | Line | Issue |
|------|------|-------|
| [`playwright.config.ts`](playwright.config.ts) | 11:14 | Mixed content detected - PWA requires HTTPS... |
| [`next.config.js`](next.config.js) | 22:1 | Browser global used in a Server Component. Move to Client Co... |
| [`next.config.js`](next.config.js) | 1:1 | Security headers function not configured... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 36:1 | Browser global used in a Server Component. Move to Client Co... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 204:34 | Avoid using "any" type - use proper typing... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 204:46 | Avoid using "any" type - use proper typing... |
| [`tests\keyboard-focus.spec.ts`](tests\keyboard-focus.spec.ts) | 208:81 | Interactive elements must be keyboard accessible... |
| [`src\utils.js`](src\utils.js) | 101:10 | SSR hydration mismatch detected - non-deterministic values i... |
| [`src\utils.js`](src\utils.js) | 24:32 | Potential SQL injection vulnerability... |
| [`src\scanner.js`](src\scanner.js) | 533:1 | Browser global used in a Server Component. Move to Client Co... |

#### 🟡 Medium Priority (Warnings)

| File | Line | Issue |
|------|------|-------|
| [`test-audit.js`](test-audit.js) | 7:1 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 13:3 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 17:3 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 25:3 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 29:5 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 30:5 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 31:5 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 35:5 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 36:5 | Console statement in production code... |
| [`test-audit.js`](test-audit.js) | 37:5 | Console statement in production code... |

#### 🔵 Low Priority (Info)

| File | Line | Issue |
|------|------|-------|
| [`src\rules.js`](src\rules.js) | 2387:72 | External link missing security attributes... |
| [`examples\theme-token-test.jsx`](examples\theme-token-test.jsx) | 1:1 | Consider adding RTL HTML direction support... |
| [`examples\sample-project\pages\_document.js`](examples\sample-project\pages\_document.js) | 1:1 | Consider adding RTL HTML direction support... |
| [`examples\sample-project\components\Dashboard.jsx`](examples\sample-project\components\Dashboard.jsx) | 44:43 | External link missing security attributes... |



---

## 🛠️ How to Fix Issues

### 🚨 Critical Issues (Fix First)
- **Errors (🔴):** These must be fixed before production deployment
- **Security Issues:** Address immediately to prevent vulnerabilities
- **PWA Issues:** Required for PWA functionality

### ⚠️ Important Issues (Fix Soon)
- **Warnings (🟡):** These should be addressed in the next development cycle
- **Performance Issues:** Will impact user experience
- **Accessibility Issues:** Required for compliance

### 💡 Enhancement Issues (Fix When Possible)
- **Info (🔵):** These are suggestions for improvement
- **Code Quality:** Will improve maintainability
- **SEO Optimizations:** Will improve search rankings

### 🛠️ General Fix Strategy
1. **Start with Errors** - Fix all critical issues first
2. **Address Warnings** - Fix important issues next
3. **Review Info Items** - Implement improvements when time allows
4. **Re-run Audit** - Verify all issues are resolved
5. **Monitor Regularly** - Run audits during development

---

*Generated by Next.js + MUI Audit Toolkit v1.0.0 By @dev-mhany*
