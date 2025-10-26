# Enhanced Data Source Badge - Integration Guide

This guide shows how to integrate the EnhancedDataSourceBadge into existing dashboard components.

## Quick Start

### 1. Import the Component

```tsx
import { EnhancedDataSourceBadge, DataSourceInfo } from '@/components/ui/enhanced-data-source-badge';
```

### 2. Define Your Data Sources

```tsx
const dataSources: DataSourceInfo[] = [
  {
    name: 'UN OCHA',
    url: 'https://www.ochaopt.org/',
    description: 'United Nations Office for the Coordination of Humanitarian Affairs',
    methodology: 'Direct field reports and verified humanitarian data collection',
    reliability: 'Very High',
    updateFrequency: 'Daily',
    verificationUrl: 'https://www.ochaopt.org/data',
  },
];
```

### 3. Add to Your Component

```tsx
<EnhancedDataSourceBadge
  sources={dataSources}
  quality="high"
  lastRefresh={new Date()}
/>
```

## Integration Examples

### Example 1: Metric Card Footer

Replace the old data badge in metric cards:

```tsx
// Before
<DataQualityBadge
  source="UN OCHA"
  isRealData={true}
  recordCount={1000}
  lastUpdated={new Date()}
/>

// After
<EnhancedDataSourceBadge
  sources={[{
    name: 'UN OCHA',
    url: 'https://www.ochaopt.org/',
    description: 'Humanitarian data',
  }]}
  quality="high"
  lastRefresh={new Date()}
  compact
/>
```

### Example 2: Chart Attribution

Add to chart components:

```tsx
import { EnhancedChart } from '@/components/ui/enhanced-chart';
import { EnhancedDataSourceBadge } from '@/components/ui/enhanced-data-source-badge';

<div className="space-y-2">
  <EnhancedChart
    type="line"
    data={chartData}
    config={chartConfig}
  />
  <EnhancedDataSourceBadge
    sources={chartDataSources}
    quality="high"
    lastRefresh={lastUpdate}
    compact
  />
</div>
```

### Example 3: Dashboard Footer

Show all active data sources:

```tsx
<footer className="border-t p-4">
  <div className="flex flex-wrap gap-4">
    <EnhancedDataSourceBadge
      sources={ochaSources}
      quality="high"
      lastRefresh={ochaLastUpdate}
      onRefresh={refreshOchaData}
    />
    <EnhancedDataSourceBadge
      sources={wfpSources}
      quality="high"
      lastRefresh={wfpLastUpdate}
      onRefresh={refreshWfpData}
    />
    <EnhancedDataSourceBadge
      sources={worldBankSources}
      quality="medium"
      lastRefresh={worldBankLastUpdate}
      onRefresh={refreshWorldBankData}
    />
  </div>
</footer>
```

### Example 4: Gaza Humanitarian Crisis Component

```tsx
// src/components/v3/gaza/HumanitarianCrisis.tsx

import { EnhancedDataSourceBadge } from '@/components/ui/enhanced-data-source-badge';

export const HumanitarianCrisis = () => {
  const dataSources = [
    {
      name: 'UN OCHA',
      url: 'https://www.ochaopt.org/',
      description: 'Humanitarian situation reports',
      methodology: 'Field assessments and partner reports',
      reliability: 'Very High',
      updateFrequency: 'Daily',
    },
    {
      name: 'WHO',
      url: 'https://www.who.int/',
      description: 'Health facility status',
      methodology: 'Health facility monitoring',
      reliability: 'Very High',
      updateFrequency: 'Weekly',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with data source badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Humanitarian Crisis</h2>
        <EnhancedDataSourceBadge
          sources={dataSources}
          quality="high"
          lastRefresh={new Date()}
          onRefresh={async () => {
            // Refresh logic
          }}
        />
      </div>

      {/* Rest of component */}
      <div className="grid gap-4">
        {/* Metric cards, charts, etc. */}
      </div>
    </div>
  );
};
```

### Example 5: Enhanced Metric Card Integration

```tsx
// src/components/ui/enhanced-metric-card.tsx

import { EnhancedDataSourceBadge } from './enhanced-data-source-badge';

interface EnhancedMetricCardProps {
  // ... existing props
  dataSources?: DataSourceInfo[];
  dataQuality?: 'high' | 'medium' | 'low';
  lastRefresh?: Date;
}

export const EnhancedMetricCard = ({
  // ... existing props
  dataSources,
  dataQuality = 'high',
  lastRefresh = new Date(),
}: EnhancedMetricCardProps) => {
  return (
    <Card>
      <CardHeader>
        {/* ... existing header content */}
      </CardHeader>
      <CardContent>
        {/* ... existing content */}
      </CardContent>
      {dataSources && (
        <CardFooter>
          <EnhancedDataSourceBadge
            sources={dataSources}
            quality={dataQuality}
            lastRefresh={lastRefresh}
            compact
          />
        </CardFooter>
      )}
    </Card>
  );
};
```

## Data Source Configuration

### Creating a Data Source Registry

Create a centralized registry for all data sources:

```tsx
// src/config/dataSources.ts

import { DataSourceInfo } from '@/components/ui/enhanced-data-source-badge';

export const DATA_SOURCES: Record<string, DataSourceInfo> = {
  UN_OCHA: {
    name: 'UN OCHA',
    url: 'https://www.ochaopt.org/',
    description: 'United Nations Office for the Coordination of Humanitarian Affairs',
    methodology: 'Direct field reports and verified humanitarian data collection',
    reliability: 'Very High',
    updateFrequency: 'Daily',
    verificationUrl: 'https://www.ochaopt.org/data',
  },
  WHO: {
    name: 'WHO',
    url: 'https://www.who.int/',
    description: 'World Health Organization',
    methodology: 'Health facility reports and epidemiological surveillance',
    reliability: 'Very High',
    updateFrequency: 'Weekly',
  },
  WFP: {
    name: 'WFP',
    url: 'https://www.wfp.org/',
    description: 'World Food Programme',
    methodology: 'Food security assessments and distribution monitoring',
    reliability: 'Very High',
    updateFrequency: 'Weekly',
  },
  WORLD_BANK: {
    name: 'World Bank',
    url: 'https://www.worldbank.org/',
    description: 'World Bank Open Data',
    methodology: 'Economic indicators and statistical modeling',
    reliability: 'High',
    updateFrequency: 'Monthly',
    verificationUrl: 'https://data.worldbank.org/country/PS',
  },
  BTSELEM: {
    name: "B'Tselem",
    url: 'https://www.btselem.org/',
    description: 'Israeli Information Center for Human Rights',
    methodology: 'Field research and documentation',
    reliability: 'High',
    updateFrequency: 'Daily',
  },
  PCBS: {
    name: 'PCBS',
    url: 'http://www.pcbs.gov.ps/',
    description: 'Palestinian Central Bureau of Statistics',
    methodology: 'Official statistical surveys and census data',
    reliability: 'High',
    updateFrequency: 'Quarterly',
  },
};

// Helper function to get sources by keys
export const getDataSources = (keys: string[]): DataSourceInfo[] => {
  return keys.map(key => DATA_SOURCES[key]).filter(Boolean);
};
```

### Using the Registry

```tsx
import { getDataSources } from '@/config/dataSources';

<EnhancedDataSourceBadge
  sources={getDataSources(['UN_OCHA', 'WHO'])}
  quality="high"
  lastRefresh={new Date()}
/>
```

## Quality Level Guidelines

### High Quality
Use when:
- Data is from authoritative sources (UN, WHO, government agencies)
- Updates are frequent (daily/weekly)
- Methodology is transparent and verified
- Data is less than 24 hours old

### Medium Quality
Use when:
- Data is from reliable but secondary sources
- Updates are less frequent (monthly)
- Some aggregation or estimation involved
- Data is 1-7 days old

### Low Quality
Use when:
- Data is estimated or modeled
- Sources are unverified or pending verification
- Significant delays in updates
- Data is more than 7 days old

## Refresh Functionality

### Implementing Refresh

```tsx
const [lastRefresh, setLastRefresh] = useState(new Date());
const [isRefreshing, setIsRefreshing] = useState(false);

const handleRefresh = async () => {
  setIsRefreshing(true);
  try {
    // Fetch new data
    const newData = await fetchDataFromAPI();
    
    // Update state
    setData(newData);
    setLastRefresh(new Date());
    
    // Show success message
    toast.success('Data refreshed successfully');
  } catch (error) {
    toast.error('Failed to refresh data');
  } finally {
    setIsRefreshing(false);
  }
};

<EnhancedDataSourceBadge
  sources={dataSources}
  quality="high"
  lastRefresh={lastRefresh}
  onRefresh={handleRefresh}
/>
```

## Responsive Behavior

### Desktop
- Full badge with all information
- Hover popover for quick details
- Click for full modal

### Tablet
- Compact badge recommended
- Hover popover still available
- Click for full modal

### Mobile
- Compact badge recommended
- Tap for full modal (no hover)
- Touch-optimized interactions

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { isMobile } = useBreakpoint();

<EnhancedDataSourceBadge
  sources={dataSources}
  quality="high"
  lastRefresh={new Date()}
  compact={isMobile}
/>
```

## Migration Checklist

- [ ] Identify all components using old badge system
- [ ] Create data source configurations
- [ ] Replace old badges with EnhancedDataSourceBadge
- [ ] Add refresh functionality where applicable
- [ ] Test hover and click interactions
- [ ] Verify animations work correctly
- [ ] Test on mobile devices
- [ ] Update documentation
- [ ] Remove old badge components

## Common Patterns

### Pattern 1: Card with Badge
```tsx
<Card>
  <CardHeader>
    <CardTitle>Metric Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <EnhancedDataSourceBadge
      sources={sources}
      quality="high"
      lastRefresh={lastUpdate}
      compact
    />
  </CardFooter>
</Card>
```

### Pattern 2: Section Header with Badge
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-bold">Section Title</h2>
  <EnhancedDataSourceBadge
    sources={sources}
    quality="high"
    lastRefresh={lastUpdate}
  />
</div>
```

### Pattern 3: Multiple Badges in Footer
```tsx
<footer className="flex flex-wrap gap-2">
  {dataSources.map((source, index) => (
    <EnhancedDataSourceBadge
      key={index}
      sources={[source]}
      quality={getQuality(source)}
      lastRefresh={getLastRefresh(source)}
      compact
    />
  ))}
</footer>
```

## Troubleshooting

### Badge not showing
- Check that sources array is not empty
- Verify DataSourceInfo objects have required fields (name, url)

### Animations not working
- Ensure framer-motion is installed
- Check that animations are not disabled globally

### Modal not opening
- Verify interactive prop is true (default)
- Check for z-index conflicts

### Hover popover not appearing
- Ensure HoverCard component is properly imported
- Check for pointer-events CSS conflicts

## Best Practices

1. **Always provide meaningful source information**
   - Include description and methodology
   - Add verification URLs when available

2. **Use appropriate quality levels**
   - Be honest about data quality
   - Update quality as data improves

3. **Keep refresh times accurate**
   - Update lastRefresh when data changes
   - Implement proper refresh functionality

4. **Use compact mode appropriately**
   - Use in space-constrained layouts
   - Use on mobile devices

5. **Provide refresh functionality**
   - Allow users to manually refresh data
   - Show loading states during refresh

## Support

For issues or questions:
- Check the README.md for detailed API documentation
- Review the demo component for examples
- Consult the design document for specifications
