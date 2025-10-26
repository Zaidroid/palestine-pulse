# Data Transparency and Quality Indicators

## Overview

This document describes the comprehensive data transparency and quality indicator system implemented for the Palestine Pulse dashboard. The system provides users with clear visibility into data sources, quality metrics, and verification processes.

## Features Implemented

### 1. Data Source Attribution System

**Location**: `src/services/dataSourceMetadataService.ts`, `src/components/v3/shared/EnhancedDataSourceAttribution.tsx`

#### Key Components

- **DataSourceMetadataService**: Centralized service managing metadata for all data sources
- **EnhancedDataSourceAttribution**: Component displaying source information with clickable links
- **Source Registry**: Comprehensive metadata for 9+ verified data sources

#### Features

- Clear source labels on every metric and chart
- Clickable source badges linking to original data sources
- Hover cards with detailed source information
- Credibility scores and reliability indicators
- Update frequency information
- Methodology descriptions

#### Usage Example

```tsx
import { EnhancedDataSourceAttribution } from '@/components/v3/shared';

<EnhancedDataSourceAttribution
  sources={['tech4palestine', 'goodshepherd']}
  lastUpdated={new Date()}
  showQuality={true}
  showFreshness={true}
/>
```

### 2. Data Quality Badge System

**Location**: `src/components/v3/shared/EnhancedDataQualityBadge.tsx`

#### Quality Levels

- **Verified**: High reliability, recent updates, cross-verified
- **Reliable**: Trusted sources with established methodologies
- **Estimated**: Aggregated or modeled data with moderate delays
- **Unverified**: Data pending confirmation from primary sources
- **Unavailable**: Data source currently unavailable

#### Features

- Visual quality indicators with color coding
- Animated status updates
- Freshness indicators with timestamps
- Warning badges for stale or unavailable data
- Composite quality indicators for multiple sources
- Refresh functionality

#### Usage Example

```tsx
import { EnhancedDataQualityBadge } from '@/components/v3/shared';

<EnhancedDataQualityBadge
  source="tech4palestine"
  lastUpdated={new Date()}
  showFreshness={true}
  showReliability={true}
  showWarnings={true}
  animated={true}
/>
```

### 3. Data Transparency Dashboard

**Location**: `src/components/v3/shared/DataTransparencyDashboard.tsx`, `src/pages/v3/DataTransparencyPage.tsx`

#### Features

- **Overview Cards**: Total sources, active sources, syncing status, errors
- **Data Sources Grid**: Individual cards for each data source with:
  - Status indicators (active, syncing, error, disabled)
  - Quality badges
  - Last sync timestamps
  - Credibility scores with progress bars
  - Links to source websites and methodology
- **Quality Metrics Panel**: 
  - Overall data quality score
  - Reliability distribution charts
  - Source credibility comparison
- **Historical Trends Panel**:
  - 30-day quality trends
  - Availability metrics
  - Freshness tracking
  - Performance insights

#### Access

Navigate to `/data-transparency` to view the full dashboard.

### 4. User Education Features

**Location**: `src/components/v3/shared/DataEducationTooltip.tsx`

#### Education Topics

1. **Data Quality**: Understanding quality indicators and reliability levels
2. **Data Freshness**: How to interpret freshness indicators
3. **Data Sources**: Information about verified data sources
4. **Methodology**: Data collection and verification processes
5. **Verification**: How users can verify data themselves

#### Components

- **DataEducationTooltip**: Hover cards with detailed explanations
- **QuickHelpIcon**: Small help icons with tooltips
- **InlineHelpText**: Inline help text with hover information
- **HelpBadge**: Badge-style help triggers
- **EducationPanel**: Full panel with all education topics

#### Usage Example

```tsx
import { QuickHelpIcon, InlineHelpText, EducationPanel } from '@/components/v3/shared';

// Quick help icon
<QuickHelpIcon topic="dataQuality" size="sm" />

// Inline help text
<InlineHelpText topic="dataSources" text="Learn about our sources" />

// Full education panel
<EducationPanel topics={['dataQuality', 'dataFreshness', 'dataSources']} />
```

### 5. User Feedback System

**Location**: `src/components/v3/shared/DataFeedbackSystem.tsx`

#### Features

- Report data quality issues
- Issue type categorization:
  - Inaccurate data
  - Outdated information
  - Missing data
  - Source verification concerns
  - Methodology questions
  - Other issues
- Context-aware feedback (includes metric name, source, value)
- Success confirmation with animations

#### Components

- **DataFeedbackSystem**: Full feedback dialog
- **QuickFeedbackButton**: Button trigger for feedback
- **InlineFeedbackLink**: Inline link for reporting issues

#### Usage Example

```tsx
import { QuickFeedbackButton, InlineFeedbackLink } from '@/components/v3/shared';

// Quick feedback button
<QuickFeedbackButton
  metricName="Total Casualties"
  source="tech4palestine"
  value={45000}
/>

// Inline feedback link
<InlineFeedbackLink
  metricName="Displacement"
  source="un_ocha"
  text="Report an issue"
/>
```

## Data Source Registry

### Verified Sources

1. **Tech4Palestine** (95% credibility)
   - Casualties, demographics, infrastructure, press casualties
   - Daily updates
   - Cross-referenced data from multiple sources

2. **Good Shepherd Collective** (92% credibility)
   - Violence, demolitions, settlements, prisoners
   - Daily updates
   - Field documentation and verified reports

3. **UN OCHA** (98% credibility)
   - Displacement, humanitarian aid, utilities
   - Daily updates
   - Official UN assessments

4. **World Bank** (94% credibility)
   - Economic indicators, GDP, unemployment
   - Monthly updates
   - Official economic statistics

5. **WFP** (96% credibility)
   - Food security, nutrition
   - Weekly updates
   - Food security assessments

6. **B'Tselem** (93% credibility)
   - Checkpoints, demolitions, settlements
   - Daily updates
   - Legal documentation and field research

7. **WHO** (97% credibility)
   - Healthcare facilities, medical supplies
   - Weekly updates
   - WHO field assessments

8. **UNRWA** (96% credibility)
   - Education, refugees, schools
   - Weekly updates
   - UNRWA operational data

9. **PCBS** (91% credibility)
   - Demographics, population, census
   - Monthly updates
   - Official Palestinian statistics

## Integration Guide

### Adding Attribution to Existing Components

1. Import the necessary components:
```tsx
import { EnhancedDataSourceAttribution } from '@/components/v3/shared';
import { QuickHelpIcon, InlineFeedbackLink } from '@/components/v3/shared';
import { DataSource } from '@/types/data.types';
```

2. Add props to your component:
```tsx
interface YourComponentProps {
  // ... existing props
  dataSources?: DataSource[];
  lastUpdated?: Date;
}
```

3. Add attribution UI:
```tsx
<div className="flex items-center justify-between pt-2 border-t">
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground">Data Sources:</span>
    <EnhancedDataSourceAttribution
      sources={dataSources}
      lastUpdated={lastUpdated}
      showQuality={true}
      showFreshness={true}
    />
    <QuickHelpIcon topic="dataSources" size="sm" />
  </div>
  <InlineFeedbackLink 
    metricName="Your Metric Name"
    source={dataSources[0]}
    value={yourValue}
  />
</div>
```

### Using Enhanced Attribution in UnifiedMetricCard

The `UnifiedMetricCard` component now supports enhanced attribution:

```tsx
<UnifiedMetricCard
  title="Total Casualties"
  value={45000}
  icon={Users}
  dataSourcesTyped={['tech4palestine', 'goodshepherd']}
  useEnhancedAttribution={true}
  lastUpdated={new Date()}
  dataQuality="high"
/>
```

## Best Practices

1. **Always Provide Source Information**: Every metric should have clear source attribution
2. **Keep Data Fresh**: Update timestamps regularly to maintain user trust
3. **Use Appropriate Quality Levels**: Accurately represent data reliability
4. **Enable User Feedback**: Allow users to report issues they notice
5. **Provide Context**: Use help icons and tooltips to educate users
6. **Link to Original Sources**: Make it easy for users to verify data
7. **Monitor Data Quality**: Use the transparency dashboard to track source health

## Future Enhancements

- Real-time data quality monitoring with alerts
- Historical data quality tracking and reporting
- Automated data verification workflows
- User-contributed data quality ratings
- Integration with external verification services
- Advanced analytics on data source performance
- Automated issue detection and reporting

## Support and Feedback

For questions or issues related to data transparency features:
- Review the education panel at `/data-transparency`
- Use the feedback system to report data quality issues
- Check source methodology links for detailed information
- Consult the data source registry for credibility scores

## Related Documentation

- [Data Integration Guide](./DATA_INTEGRATION_GUIDE.md)
- [Data Refresh System](./DATA_REFRESH_SYSTEM.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Component Update Plan](./COMPONENT_UPDATE_PLAN.md)
