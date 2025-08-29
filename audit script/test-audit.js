#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Next.js + MUI Audit Toolkit\n');

// Clean up previous test results
const auditDir = './audit';
if (existsSync(auditDir)) {
  rmSync(auditDir, { recursive: true });
  console.log('🧹 Cleaned up previous audit results');
}

try {
  console.log('🔍 Running audit on sample project...\n');
  
  // Run the audit
  const result = execSync('npm run audit -- --path ./examples/sample-project --output ./audit', {
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ Audit completed successfully!');
  
  // Check if reports were generated
  if (existsSync(join(auditDir, 'report.json')) && existsSync(join(auditDir, 'REPORT.md'))) {
    console.log('📊 Reports generated successfully:');
    console.log('   - audit/report.json (machine-readable)');
    console.log('   - audit/REPORT.md (human-readable)');
    
    // Display summary from JSON report
    const report = JSON.parse(execSync('cat audit/report.json', { encoding: 'utf-8' }));
    console.log(`\n📈 Audit Summary:`);
    console.log(`   Overall Score: ${report.summary.overallScore}/100 (${report.summary.letterGrade})`);
    console.log(`   Total Issues: ${report.summary.totalIssues}`);
    console.log(`   Critical Issues: ${report.summary.criticalIssues}`);
    
    // Show top issues
    if (report.issues.topIssues.length > 0) {
      console.log('\n🚨 Top Issues Found:');
      report.issues.topIssues.slice(0, 5).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.message} (${issue.count} occurrences)`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review the detailed report in audit/REPORT.md');
    console.log('   2. Fix critical issues first (they block deployment)');
    console.log('   3. Address warnings and info items');
    console.log('   4. Re-run audit to verify improvements');
    
  } else {
    console.log('❌ Reports not generated');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Test completed! Check the audit/ directory for results.');
