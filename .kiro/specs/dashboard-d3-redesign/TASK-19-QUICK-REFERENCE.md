# HorizonChart - Quick Reference Guide

## What is a Horizon Chart?

A **Horizon Chart** is a space-efficient visualization technique that displays multiple time-series metrics using layered color bands. It's particularly useful for comparing many metrics in a compact vertical space.

### Key Characteristics
- **Compact:** Shows multiple metrics in minimal vertical space
- **Layered Bands:** Uses color intensity to represent value magnitude
- **Positive/Negative:** Green for positive values, red for negative
- **Time-Series:** Displays data over time on horizontal axis

## Quick Start

### Basic Implementation
```typescript
import { HorizonChart } from '@/components/charts/d3/HorizonChart';

const metrics = [
  {
    name: 'GDP Growth',
    data: [
      { date: '2023-01-01', value: 2.5 },
      { date: '2023-02-01', value: 2.7 },
      // ... more data points
    ],
    unit: '%'
  },
  // ... more metrics
];

<HorizonChart
  metrics={metrics}
  bands={4}
  animated={true}
  interactive={true}
/>
```

### With Filters
```typescript
import { HorizonChartWithFilters } from '@/components/charts/d3/HorizonChartWithFilters';

<HorizonChartWithFilters
  metrics={metrics}
  initialBands={4}
  showFilters={true}
/>
```

## Props Reference

### HorizonChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `metrics` | `HorizonMetric[]` | **required** | Array of metrics to display |
| `width` | `number` | container width | Chart width in pixels |
| `bandHeight` | `number` | `40` | Height per metric band |
| `bands` | `number` | `4` | Number of horizon bands (2-6) |
| `animated` | `boolean` | `true` | Enable animations |
| `interactive` | `boolean` | `true` | Enable hover/click |
| `showLabels` | `boolean` | `true` | Show metric labels |
| `showAxes` | `boolean` | `true` | Show time axis |
| `curveType` | `string` | `'monotone'` | Curve type: linear, monotone, step, basis |
| `selectedMetrics` | `string[]` | `[]` | Filter to specific metrics |
| `valueFormatter` | `Function` | auto | Custom value formatter |
| `dateFormatter` | `Function` | auto | Custom date formatter |
| `onDataPointClick` | `Function` | - | Click callback |
| `onDataPointHover` | `Function` | - | Hover callback |

### HorizonMetric Interface

```typescript
interface HorizonMetric {
  name: string;                    // Metric name/label
  data: HorizonDataPoint[];        // Time-series data
  unit?: string;                   // Unit of measurement
  positiveColor?: string;          // Color for positive values
  negativeColor?: string;          // Color for negative values
  metadata?: Record<string, any>;  // Additional metadata
}

interface HorizonDataPoint {
  date: Date | string;  // Date/time
  value: number;        // Value (can be positive or negative)
}
```

## Common Use Cases

### 1. Economic Indicators Dashboard
```typescript
const economicMetrics = [
  { name: 'GDP Growth', data: gdpData, unit: '%' },
  { name: 'Unemployment', data: unemploymentData, unit: '%' },
  { name: 'Inflation', data: inflationData, unit: '%' },
  { name: 'Trade Balance', data: tradeData, unit: '$B' },
];

<HorizonChart metrics={economicMetrics} bands={4} />
```

### 2. Multi-Region Comparison
```typescript
const regionalMetrics = regions.map(region => ({
  name: region.name,
  data: region.timeSeriesData,
  unit: 'units',
}));

<HorizonChartWithFilters
  metrics={regionalMetrics}
  initialBands={5}
  showFilters={true}
/>
```

### 3. Custom Colors
```typescript
const customMetrics = [
  {
    name: 'Revenue',
    data: revenueData,
    positiveColor: '#10b981',  // Green
    negativeColor: '#ef4444',  // Red
  },
];

<HorizonChart metrics={customMetrics} />
```

## Band Count Guide

| Bands | Use Case | Detail Level |
|-------|----------|--------------|
| 2 | Overview, many metrics | Low detail |
| 3 | Balanced view | Medium detail |
| 4 | **Default**, good balance | Good detail |
| 5 | Detailed analysis | High detail |
| 6 | Maximum detail | Very high detail |

**Recommendation:** Start with 4 bands, adjust based on data characteristics.

## Styling & Theming

### Theme Support
The chart automatically adapts to light/dark themes:
- **Light Mode:** Darker text, lighter backgrounds
- **Dark Mode:** Lighter text, darker backgrounds
- **Colors:** Maintains contrast in both modes

### RTL Support
Fully supports right-to-left layouts:
- Labels positioned correctly
- Time axis flows right-to-left
- Tooltips positioned appropriately

## Performance Tips

### Optimize Data
```typescript
// Good: Reasonable data points
const data = generateDailyData(365); // 1 year daily

// Avoid: Too many data points
const data = generateMinuteData(525600); // 1 year per minute
```

### Limit Metrics
```typescript
// Good: 3-8 metrics
<HorizonChart metrics={metrics.slice(0, 8)} />

// Avoid: Too many metrics
<HorizonChart metrics={allMetrics} /> // 50+ metrics
```

### Use Filtering
```typescript
// Allow users to filter
<HorizonChartWithFilters
  metrics={allMetrics}
  initialSelectedMetrics={topMetrics}
/>
```

## Accessibility

### ARIA Labels
```typescript
<HorizonChart
  metrics={metrics}
  // Automatically includes:
  // - role="img"
  // - aria-label="Horizon chart visualization"
/>
```

### Keyboard Navigation
- Tab to focus on chart
- Hover with mouse or keyboard
- Click to drill down

### Screen Readers
- Metric names announced
- Values announced on hover
- Trend direction indicated

## Troubleshooting

### Issue: Bands not visible
**Solution:** Check that data has both positive and negative values, or adjust band count.

### Issue: Chart too tall
**Solution:** Reduce `bandHeight` or filter metrics:
```typescript
<HorizonChart bandHeight={30} />
// or
<HorizonChartWithFilters initialSelectedMetrics={['GDP', 'Unemployment']} />
```

### Issue: Animations too slow
**Solution:** Disable animations:
```typescript
<HorizonChart animated={false} />
```

### Issue: Tooltips cut off
**Solution:** Ensure parent container has enough space and proper overflow handling.

## Examples

### Minimal Example
```typescript
<HorizonChart
  metrics={[
    { name: 'Metric 1', data: data1 },
    { name: 'Metric 2', data: data2 },
  ]}
/>
```

### Full-Featured Example
```typescript
<HorizonChartWithFilters
  metrics={economicMetrics}
  initialBands={4}
  bandHeight={50}
  showFilters={true}
  compactFilters={false}
  animated={true}
  interactive={true}
  showLabels={true}
  showAxes={true}
  curveType="monotone"
  valueFormatter={(value, metric) => `${value.toFixed(2)}%`}
  dateFormatter={(date) => d3.timeFormat('%b %Y')(date)}
  onDataPointClick={(metric, data) => {
    console.log(`Clicked ${metric}:`, data);
  }}
  onDataPointHover={(metric, data) => {
    if (data) console.log(`Hovering ${metric}:`, data);
  }}
/>
```

## Integration with Dashboards

### Gaza Economic Dashboard
```typescript
import { HorizonChartWithFilters } from '@/components/charts/d3/HorizonChartWithFilters';
import { useWorldBankData } from '@/hooks/useWorldBankData';

const GazaEconomicDashboard = () => {
  const { gdp, unemployment, inflation } = useWorldBankData('gaza');
  
  const metrics = [
    { name: 'GDP Growth', data: gdp, unit: '%' },
    { name: 'Unemployment', data: unemployment, unit: '%' },
    { name: 'Inflation', data: inflation, unit: '%' },
  ];

  return (
    <HorizonChartWithFilters
      metrics={metrics}
      initialBands={4}
      showFilters={true}
    />
  );
};
```

## Best Practices

### ✅ Do
- Use 3-8 metrics for optimal readability
- Provide meaningful metric names
- Include units in metric definitions
- Use 4 bands as default
- Enable filters for many metrics
- Test with real data

### ❌ Don't
- Display more than 12 metrics without filtering
- Use inconsistent time ranges across metrics
- Omit units from metrics
- Use too many bands (>6) for overview
- Disable interactivity without good reason
- Forget to test RTL layout

## Resources

### Files
- **Component:** `src/components/charts/d3/HorizonChart.tsx`
- **With Filters:** `src/components/charts/d3/HorizonChartWithFilters.tsx`
- **Demo:** `src/components/charts/d3/HorizonChartDemo.tsx`

### Documentation
- **Requirements:** `.kiro/specs/dashboard-d3-redesign/requirements.md` (2.6, 3.2, 3.3, 8.4, 8.5)
- **Design:** `.kiro/specs/dashboard-d3-redesign/design.md`
- **Summary:** `.kiro/specs/dashboard-d3-redesign/TASK-19-SUMMARY.md`

### Related Components
- AnimatedAreaChart (time-series)
- InteractiveBarChart (categorical)
- RadarChart (multi-dimensional)
- SmallMultiplesChart (regional comparison)

---

**Need Help?** Check the demo component or refer to the full implementation summary.
