# Data Audit and Discovery Guide

This guide explains how to use the Data Audit and Discovery services to identify and replace fake data in the Palestine Pulse dashboard.

## Overview

The Data Audit and Discovery Phase provides three core services:

1. **Data Audit Service** - Scans components for fake data
2. **Data Source Verification Service** - Tests API connectivity and data quality
3. **Component Data Mapping Service** - Maps components to data sources

## Quick Start

### Running the Complete Audit

```bash
# Run the comprehensive audit
npx tsx src/scripts/runDataAudit.ts
```

This generates reports in the `audit-reports/` directory:
- `AUDIT_SUMMARY.md` - Executive summary
- `REPLACEMENT_PLAN.md` - Implementation plan
- `component-audit-report.json` - Detailed component analysis
- `data-source-verification-report.json` - Data source status
- `component-data-mapping.json` - Component-to-source mappings

### Using Individual Services

#### 1. Data Audit Service

```typescript
import { dataAuditService } from './services/dataAuditService';

// Audit a single component
const report = await dataAuditService.auditComponent(
  'src/components/v3/gaza/HumanitarianCrisis.tsx'
);

console.log(`Found ${report.totalIssues} issues`);
console.log(`Severity: ${report.severity}`);
console.log(`Estimated effort: ${report.estimatedEffort}`);

// Audit all components
const comprehensiveReport = await dataAuditService.auditAllComponents();

console.log(`Total fake data instances: ${comprehensiveReport.totalFakeDataInstances}`);
console.log(`Components needing work: ${comprehensiveReport.componentsWithFakeData}`);
```

#### 2. Data Source Verification Service

```typescript
import { dataSourceVerificationService } from './services/dataSourceVerificationService';

// Verify all data sources
const verificationReport = await dataSourceVerificationService.verifyAllSources();

console.log(`Working sources: ${verificationReport.workingSources}`);
console.log(`Failed sources: ${verificationReport.failingSources.join(', ')}`);

// Check specific source
const techPalestineResult = verificationReport.sourceResults.get('tech4palestine');
console.log(`Tech4Palestine status: ${techPalestineResult?.overallStatus}`);
console.log(`Quality score: ${techPalestineResult?.qualityMetrics.overallScore}`);
```

#### 3. Component Data Mapping Service

```typescript
import { componentDataMappingService } from './services/componentDataMappingService';

// Map a single component
const mapping = componentDataMappingService.createComponentMapping(
  'src/components/v3/gaza/HumanitarianCrisis.tsx'
);

console.log(`Component: ${mapping.componentName}`);
console.log(`Metrics: ${mapping.metrics.length}`);
console.log(`Priority: ${mapping.overallPriority}`);

// Generate global mapping
const globalMapping = componentDataMappingService.generateGlobalMapping();

console.log(`Total components: ${globalMapping.totalComponents}`);
console.log(`Total metrics: ${globalMapping.totalMetrics}`);

// Validate a mapping
const validation = componentDataMappingService.validateMapping(mapping);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## Understanding the Reports

### Fake Data Types

The audit identifies several types of fake data:

1. **hardcoded_number** - Static numbers in code
   ```typescript
   const casualties = 43000; // ❌ Fake
   ```

2. **fallback_value** - Default values used when API fails
   ```typescript
   const killed = apiData?.killed || 13000; // ❌ Fake fallback
   ```

3. **fake_array** - Generated arrays with fake data
   ```typescript
   Array.from({ length: 10 }, (_, i) => ({ value: 100 + i * 10 })); // ❌ Fake
   ```

4. **mock_calculation** - Calculations based on fake multipliers
   ```typescript
   const estimate = baseValue * 0.34; // ❌ Fake calculation
   ```

5. **static_data** - Hardcoded data objects
   ```typescript
   const data = [{ name: 'Hebron', value: 85 }]; // ❌ Fake
   ```

### Severity Levels

- **Critical** - High-visibility components with extensive fake data
- **High** - Significant fake data impacting user trust
- **Medium** - Some fake data with workarounds available
- **Low** - Minor issues or low-priority components

### Quality Metrics

Data sources are scored on:

- **Completeness** (0-1) - How complete the data structure is
- **Freshness** (0-1) - How recent the data is
- **Consistency** (0-1) - How consistent response times are
- **Reliability** (0-1) - How often the source is available
- **Overall Score** (0-1) - Average of all metrics

## Implementation Workflow

### Phase 1: Audit and Discovery (Current)

1. ✅ Run comprehensive audit
2. ✅ Verify data sources
3. ✅ Generate mappings
4. ✅ Create replacement plan

### Phase 2: Fix Data Sources

1. Review `data-source-verification-report.json`
2. Fix any failing sources
3. Ensure all required endpoints are working
4. Verify data quality meets standards

### Phase 3: Replace Fake Data

Follow the `REPLACEMENT_PLAN.md` phases:

1. **Phase 1** - Critical Gaza components
2. **Phase 2** - Critical West Bank components
3. **Phase 3** - High priority components
4. **Phase 4** - Medium priority components

For each component:

1. Review the component audit report
2. Check the data mapping
3. Implement real data integration
4. Remove fake data and fallbacks
5. Add proper error handling
6. Test thoroughly
7. Re-run audit to verify

### Phase 4: Quality Assurance

1. Run automated tests
2. Verify no fake data remains
3. Check data quality
4. Monitor performance
5. Deploy to production

## Best Practices

### When Replacing Fake Data

1. **Always use the V3 Data Consolidation Service**
   ```typescript
   const { consolidatedData } = useV3Store();
   const gazaData = consolidatedData?.gaza.humanitarianCrisis;
   ```

2. **Provide proper loading states**
   ```typescript
   if (loading || isLoadingData) {
     return <Skeleton />;
   }
   ```

3. **Add data quality indicators**
   ```typescript
   <UnifiedMetricCard
     dataSources={["Tech4Palestine"]}
     dataQuality="high"
   />
   ```

4. **Handle errors gracefully**
   ```typescript
   const value = apiData?.value ?? null;
   if (value === null) {
     return <ErrorState />;
   }
   ```

5. **Document data sources**
   ```typescript
   // Data from Tech4Palestine API: /v3/killed-in-gaza.min.json
   const casualties = consolidatedData?.gaza.humanitarianCrisis.casualties;
   ```

### Avoiding Fake Data Regression

1. Run audit regularly (weekly)
2. Add automated tests
3. Code review checklist
4. Monitor data quality metrics
5. Set up alerts for data issues

## Troubleshooting

### "Source verification failed"

Check:
- Is the API endpoint correct?
- Is the source enabled in `apiOrchestrator.ts`?
- Are there CORS issues?
- Is the API key valid (if required)?

### "High fake data percentage"

This is expected initially. Follow the replacement plan to systematically replace fake data.

### "Data structure validation failed"

The API response doesn't match expected format. Check:
- API documentation
- Sample responses
- Update expected structures in `dataSourceVerificationService.ts`

### "Transformation required"

Some metrics need data transformation. Implement transformation logic in the component or create a utility function.

## Next Steps

1. Review the generated reports in `audit-reports/`
2. Fix any failing data sources
3. Start implementing Phase 1 of the replacement plan
4. Re-run audit after each phase to track progress

## Support

For questions or issues:
- Review the spec documents in `.kiro/specs/real-data-integration/`
- Check the design document for architecture details
- Refer to the requirements document for acceptance criteria
