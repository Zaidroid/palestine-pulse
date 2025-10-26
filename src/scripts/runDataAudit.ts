/**
 * Data Audit CLI Tool
 * 
 * Runs comprehensive data audit and generates reports.
 * Usage: npx tsx src/scripts/runDataAudit.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { dataAuditService } from '../services/dataAuditService';
import { dataSourceVerificationService } from '../services/dataSourceVerificationService';
import { componentDataMappingService } from '../services/componentDataMappingService';

// ============================================
// REPORT GENERATION
// ============================================

async function generateAuditReports() {
  console.log('🔍 Starting Data Audit Process...\n');
  
  const outputDir = path.join(process.cwd(), 'audit-reports');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Step 1: Run comprehensive audit
  console.log('📊 Step 1: Running comprehensive component audit...');
  const auditReport = await dataAuditService.auditAllComponents();
  
  console.log(`   ✓ Audited ${auditReport.totalComponents} components`);
  console.log(`   ✓ Found ${auditReport.totalFakeDataInstances} fake data instances`);
  console.log(`   ✓ ${auditReport.componentsWithFakeData} components need attention\n`);
  
  // Save audit report
  const auditReportPath = path.join(outputDir, 'component-audit-report.json');
  fs.writeFileSync(auditReportPath, JSON.stringify(auditReport, null, 2));
  console.log(`   📄 Saved: ${auditReportPath}\n`);
  
  // Step 2: Verify data sources
  console.log('🔌 Step 2: Verifying data source connectivity...');
  const verificationReport = await dataSourceVerificationService.verifyAllSources();
  
  console.log(`   ✓ Tested ${verificationReport.totalSources} data sources`);
  console.log(`   ✓ ${verificationReport.workingSources} sources operational`);
  console.log(`   ✓ ${verificationReport.failingSources.length} sources need attention\n`);
  
  // Save verification report
  const verificationReportPath = path.join(outputDir, 'data-source-verification-report.json');
  const verificationReportJson = dataSourceVerificationService.exportReport(verificationReport);
  fs.writeFileSync(verificationReportPath, verificationReportJson);
  console.log(`   📄 Saved: ${verificationReportPath}\n`);
  
  // Step 3: Generate component data mappings
  console.log('🗺️  Step 3: Generating component data mappings...');
  const globalMapping = componentDataMappingService.generateGlobalMapping();
  
  console.log(`   ✓ Mapped ${globalMapping.totalComponents} components`);
  console.log(`   ✓ Identified ${globalMapping.totalMetrics} metrics`);
  console.log(`   ✓ Gaza: ${globalMapping.gazaMappings.length} components`);
  console.log(`   ✓ West Bank: ${globalMapping.westBankMappings.length} components\n`);
  
  // Save mapping report
  const mappingReportPath = path.join(outputDir, 'component-data-mapping.json');
  fs.writeFileSync(mappingReportPath, JSON.stringify(globalMapping, null, 2));
  console.log(`   📄 Saved: ${mappingReportPath}\n`);
  
  // Step 4: Generate summary report
  console.log('📝 Step 4: Generating summary report...');
  const summaryReport = generateSummaryReport(auditReport, verificationReport, globalMapping);
  
  const summaryReportPath = path.join(outputDir, 'AUDIT_SUMMARY.md');
  fs.writeFileSync(summaryReportPath, summaryReport);
  console.log(`   📄 Saved: ${summaryReportPath}\n`);
  
  // Step 5: Generate replacement plan
  console.log('📋 Step 5: Generating prioritized replacement plan...');
  const replacementPlan = generateReplacementPlan(auditReport, globalMapping);
  
  const replacementPlanPath = path.join(outputDir, 'REPLACEMENT_PLAN.md');
  fs.writeFileSync(replacementPlanPath, replacementPlan);
  console.log(`   📄 Saved: ${replacementPlanPath}\n`);
  
  console.log('✅ Data Audit Complete!\n');
  console.log(`📁 All reports saved to: ${outputDir}\n`);
  
  // Print quick summary
  printQuickSummary(auditReport, verificationReport, globalMapping);
}

// ============================================
// SUMMARY REPORT GENERATION
// ============================================

function generateSummaryReport(auditReport: any, verificationReport: any, globalMapping: any): string {
  const timestamp = new Date().toISOString();
  
  return `# Data Audit Summary Report

**Generated:** ${timestamp}

## Executive Summary

This report provides a comprehensive analysis of fake data usage across the Palestine Pulse dashboard and documents the current state of data source integrations.

### Key Findings

- **Total Components Audited:** ${auditReport.totalComponents}
- **Components with Fake Data:** ${auditReport.componentsWithFakeData} (${((auditReport.componentsWithFakeData / auditReport.totalComponents) * 100).toFixed(1)}%)
- **Total Fake Data Instances:** ${auditReport.totalFakeDataInstances}
- **Data Sources Tested:** ${verificationReport.totalSources}
- **Operational Sources:** ${verificationReport.workingSources}
- **Failed Sources:** ${verificationReport.failingSources.length}

### Severity Breakdown

| Severity | Count |
|----------|-------|
| Critical | ${auditReport.severityBreakdown.critical} |
| High     | ${auditReport.severityBreakdown.high} |
| Medium   | ${auditReport.severityBreakdown.medium} |
| Low      | ${auditReport.severityBreakdown.low} |

## Gaza Dashboard Analysis

- **Components:** ${auditReport.summary.gazaComponents.total}
- **With Fake Data:** ${auditReport.summary.gazaComponents.withFakeData}
- **Fake Data %:** ${auditReport.summary.gazaComponents.fakeDataPercentage.toFixed(1)}%

### Critical Gaza Components

${auditReport.componentReports
  .filter((r: any) => r.componentPath.includes('gaza') && r.severity === 'critical')
  .map((r: any) => `- **${r.componentName}**: ${r.totalIssues} issues (${r.estimatedEffort})`)
  .join('\n') || 'None'}

## West Bank Dashboard Analysis

- **Components:** ${auditReport.summary.westBankComponents.total}
- **With Fake Data:** ${auditReport.summary.westBankComponents.withFakeData}
- **Fake Data %:** ${auditReport.summary.westBankComponents.fakeDataPercentage.toFixed(1)}%

### Critical West Bank Components

${auditReport.componentReports
  .filter((r: any) => r.componentPath.includes('westbank') && r.severity === 'critical')
  .map((r: any) => `- **${r.componentName}**: ${r.totalIssues} issues (${r.estimatedEffort})`)
  .join('\n') || 'None'}

## Data Source Status

### Operational Sources

${verificationReport.workingSources > 0 ? 
  Array.from(verificationReport.sourceResults.entries())
    .filter(([_, result]: any) => result.overallStatus === 'operational')
    .map(([source, result]: any) => `- **${source}**: Quality Score ${(result.qualityMetrics.overallScore * 100).toFixed(0)}%`)
    .join('\n') : 'None'}

### Failed Sources

${verificationReport.failingSources.length > 0 ?
  verificationReport.failingSources.map((source: string) => `- **${source}**: Needs attention`).join('\n') : 'None'}

### Data Gaps

${verificationReport.dataGaps.length > 0 ?
  verificationReport.dataGaps
    .filter((gap: any) => gap.severity === 'blocking')
    .map((gap: any) => `- **${gap.requiredData}**: ${gap.description}`)
    .join('\n') : 'No blocking data gaps identified'}

## Top Issues

${auditReport.summary.topIssues.slice(0, 5).map((issue: string, i: number) => `${i + 1}. ${issue}`).join('\n')}

## Recommendations

${auditReport.summary.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

${verificationReport.recommendations.map((rec: string, i: number) => `${i + auditReport.summary.recommendations.length + 1}. ${rec}`).join('\n')}

## Next Steps

1. Review the detailed replacement plan in \`REPLACEMENT_PLAN.md\`
2. Address critical components first (Gaza humanitarian crisis)
3. Fix failing data sources before implementing replacements
4. Implement data quality monitoring to prevent regression

---

*For detailed component-level analysis, see:*
- \`component-audit-report.json\`
- \`data-source-verification-report.json\`
- \`component-data-mapping.json\`
`;
}

// ============================================
// REPLACEMENT PLAN GENERATION
// ============================================

function generateReplacementPlan(auditReport: any, globalMapping: any): string {
  const timestamp = new Date().toISOString();
  
  return `# Prioritized Data Replacement Plan

**Generated:** ${timestamp}

## Overview

This document outlines a phased approach to replacing all fake data with real data from verified sources.

**Total Estimated Effort:** ${auditReport.prioritizedReplacementPlan.estimatedTotalEffort}

## Dependencies

Before starting implementation, ensure:

${auditReport.prioritizedReplacementPlan.dependencies.map((dep: string) => `- ${dep}`).join('\n')}

## Implementation Phases

${auditReport.prioritizedReplacementPlan.phases.map((phase: any) => `
### Phase ${phase.phase}: ${phase.name}

**Priority:** ${phase.priority.toUpperCase()}  
**Estimated Effort:** ${phase.estimatedEffort}  
**Components:** ${phase.components.length}

#### Components to Update

${phase.components.map((comp: string) => {
  const mapping = globalMapping.gazaMappings.find((m: any) => m.componentPath === comp) ||
                  globalMapping.westBankMappings.find((m: any) => m.componentPath === comp);
  
  if (!mapping) return `- ${comp}`;
  
  return `
**${mapping.componentName}**
- Path: \`${comp}\`
- Metrics to replace: ${mapping.metrics.length}
- Estimated effort: ${mapping.estimatedTotalEffort}
- Key metrics:
${mapping.metrics
  .filter((m: any) => m.currentImplementation === 'fake')
  .slice(0, 3)
  .map((m: any) => `  - ${m.displayName} (${m.targetDataSource})`)
  .join('\n')}
`;
}).join('\n')}
`).join('\n')}

## Component Priority Matrix

| Component | Section | Priority | Fake Metrics | Effort | Status |
|-----------|---------|----------|--------------|--------|--------|
${[...globalMapping.gazaMappings, ...globalMapping.westBankMappings]
  .sort((a: any, b: any) => b.overallPriority - a.overallPriority)
  .map((mapping: any) => {
    const fakeCount = mapping.metrics.filter((m: any) => m.currentImplementation === 'fake').length;
    return `| ${mapping.componentName} | ${mapping.dashboardSection} | ${mapping.overallPriority} | ${fakeCount}/${mapping.metrics.length} | ${mapping.estimatedTotalEffort} | 🔴 Not Started |`;
  })
  .join('\n')}

## Data Source Integration Checklist

### Tech4Palestine
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

### Good Shepherd Collective
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

### UN OCHA / HDX
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

### World Bank
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

### WFP
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

### B'Tselem
- [ ] Verify API connectivity
- [ ] Test all endpoints
- [ ] Implement data transformations
- [ ] Add error handling
- [ ] Update components

## Quality Assurance

After each phase:

1. Run automated tests to verify no fake data remains
2. Validate data quality and accuracy
3. Check performance impact
4. Update documentation
5. Deploy to staging for review

## Monitoring

Implement continuous monitoring for:

- Data source availability
- Data freshness
- Data quality metrics
- Component performance
- User experience impact

---

*This plan should be reviewed and updated as implementation progresses.*
`;
}

// ============================================
// QUICK SUMMARY PRINTER
// ============================================

function printQuickSummary(auditReport: any, verificationReport: any, globalMapping: any) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    QUICK SUMMARY                          ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('📊 AUDIT RESULTS');
  console.log(`   Components with fake data: ${auditReport.componentsWithFakeData}/${auditReport.totalComponents}`);
  console.log(`   Total fake data instances: ${auditReport.totalFakeDataInstances}`);
  console.log(`   Critical issues: ${auditReport.severityBreakdown.critical}\n`);
  
  console.log('🔌 DATA SOURCES');
  console.log(`   Operational: ${verificationReport.workingSources}/${verificationReport.totalSources}`);
  console.log(`   Failed: ${verificationReport.failingSources.length}`);
  console.log(`   Data gaps: ${verificationReport.dataGaps.filter((g: any) => g.severity === 'blocking').length} blocking\n`);
  
  console.log('🎯 PRIORITIES');
  console.log(`   Phase 1 components: ${auditReport.prioritizedReplacementPlan.phases[0]?.components.length || 0}`);
  console.log(`   Estimated total effort: ${auditReport.prioritizedReplacementPlan.estimatedTotalEffort}\n`);
  
  console.log('═══════════════════════════════════════════════════════════\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

generateAuditReports().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});
