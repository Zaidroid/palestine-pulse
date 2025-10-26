# RadarChart Component - Quick Reference

## Import
```typescript
import { RadarChart, RadarDataPoint, RadarSeries } from '@/components/charts/d3/RadarChart';
```

## Basic Usage

### Single Series
```typescript
const data: RadarDataPoint[] = [
  { axis: 'Healthcare', value: 75, maxValue: 100, unit: '%' },
  { axis: 'Education', value: 60, maxValue: 100, unit: '%' },
  { axis: 'Infrastructure', value: 45, maxValue: 100, unit: '%' },
  { axis: 'Economy', value: 30, maxValue: 100, unit: '%' },
  { axis: 'Security', value: 20, maxValue: 100, unit: '%' },
];

<RadarChart data={data} height={500} />
```

### Comparison Mode
```typescript
const comparisonData: RadarSeries[] = [
  {
    name: 'Pre-Conflict',
    data: [
      { axis: 'Healthcare', value: 85, maxValue: 100 },
      { axis: 'Education', value: 90, maxValue: 100 },
      // ... more axes
    ],
    color: '#10b981',
  },
  {
    name: 'Current',
    data: [
      { axis: 'Healthcare', value: 25, maxValue: 100 },
      { axis: 'Education', value: 30, maxValue: 100 },
      // ... more axes
    ],
    color: '#ef4444',
  },
];

<RadarChart 
  data={comparisonData} 
  comparisonMode={true}
  showLegend={true}
  height={500} 
/>
```

## Common Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `RadarDataPoint[]` \| `RadarSeries[]` | required | Chart data |
| `height` | `number` | `400` | Chart height in pixels |
| `levels` | `number` | `5` | Number of grid circles |
| `fillOpacity` | `number` | `0.25` | Polygon fill opacity |
| `strokeWidth` | `number` | `2` | Polygon stroke width |
| `animated` | `boolean` | `true` | Enable animations |
| `interactive` | `boolean` | `true` | Enable hover/click |
| `showGrid` | `boolean` | `true` | Show circular grid |
| `showAxisLabels` | `boolean` | `true` | Show axis labels |
| `showLegend` | `boolean` | `true` | Show legend (comparison mode) |
| `comparisonMode` | `boolean` | `false` | Enable comparison mode |

## Data Structures

### RadarDataPoint
```typescript
interface RadarDataPoint {
  axis: string;        // Metric name (e.g., "Healthcare")
  value: number;       // Raw value (e.g., 75)
  maxValue?: number;   // Max for normalization (e.g., 100)
  unit?: string;       // Unit (e.g., "%", "B$")
  metadata?: any;      // Additional data
}
```

### RadarSeries
```typescript
interface RadarSeries {
  name: string;              // Series label (e.g., "2024")
  data: RadarDataPoint[];    // Data points
  color?: string;            // Hex color (e.g., "#ef4444")
  metadata?: any;            // Additional data
}
```

## Callbacks

### onDataPointClick
```typescript
<RadarChart
  data={data}
  onDataPointClick={(point, seriesName) => {
    console.log('Clicked:', point.axis, point.value);
    console.log('Series:', seriesName);
  }}
/>
```

### onDataPointHover
```typescript
<RadarChart
  data={data}
  onDataPointHover={(point, seriesName) => {
    if (point) {
      console.log('Hovering:', point.axis);
    } else {
      console.log('Hover ended');
    }
  }}
/>
```

### valueFormatter
```typescript
<RadarChart
  data={data}
  valueFormatter={(value, axis) => {
    if (axis === 'GDP') return `$${value}B`;
    return `${value}%`;
  }}
/>
```

## Styling Options

### Custom Colors
```typescript
<RadarChart
  data={data}
  colors={['#3b82f6', '#ef4444', '#10b981']}
/>
```

### Adjust Fill & Stroke
```typescript
<RadarChart
  data={data}
  fillOpacity={0.3}
  strokeWidth={3}
/>
```

### Compact Version
```typescript
<RadarChart
  data={data}
  height={350}
  levels={3}
  radiusRatio={0.7}
/>
```

## Common Patterns

### Economic Indicators
```typescript
const economicData: RadarDataPoint[] = [
  { axis: 'GDP Growth', value: -8.5, maxValue: 10, unit: '%' },
  { axis: 'Unemployment', value: 45, maxValue: 100, unit: '%' },
  { axis: 'Inflation', value: 12, maxValue: 20, unit: '%' },
  { axis: 'Trade Balance', value: -2.5, maxValue: 5, unit: 'B$' },
  { axis: 'FDI', value: 0.5, maxValue: 5, unit: 'B$' },
];
```

### Regional Comparison
```typescript
const regionalData: RadarSeries[] = [
  {
    name: 'Gaza Strip',
    data: [/* ... */],
    color: '#ef4444',
  },
  {
    name: 'West Bank',
    data: [/* ... */],
    color: '#f59e0b',
  },
  {
    name: 'East Jerusalem',
    data: [/* ... */],
    color: '#3b82f6',
  },
];
```

### Time Series
```typescript
const timeSeriesData: RadarSeries[] = [
  { name: '2020', data: [/* ... */], color: '#3b82f6' },
  { name: '2022', data: [/* ... */], color: '#10b981' },
  { name: '2024', data: [/* ... */], color: '#ef4444' },
];
```

## Tips

1. **Optimal Axis Count:** 3-10 axes work best
2. **Series Limit:** 2-5 series for comparison mode
3. **Normalization:** Ensure all values use same maxValue for fair comparison
4. **Colors:** Use distinct colors for comparison mode
5. **Labels:** Keep axis names short (1-2 words)
6. **Units:** Include units for clarity
7. **RTL:** Component automatically handles Arabic/RTL layouts

## Demo Files

- **Basic:** `src/components/charts/d3/RadarChartDemo.tsx`
- **With Filters:** `src/components/charts/d3/RadarChartWithFilters.tsx`

## Requirements Met

✅ Multi-axis radar grid (Req 2.6)  
✅ Data polygon with fill (Req 3.2)  
✅ Axis labels and scales (Req 3.2)  
✅ Tooltips with metric details (Req 3.3)  
✅ RTL text positioning (Req 5.2)  
✅ Multiple polygon overlays (Req 8.5)  
✅ Interactive legend (Req 8.5)  
✅ Animated transitions (Req 3.2)  

---

**Quick Start:** Copy a demo example and replace with your data!
