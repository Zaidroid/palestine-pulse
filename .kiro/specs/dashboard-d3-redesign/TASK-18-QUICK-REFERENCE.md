# Task 18: SmallMultiplesChart - Quick Reference

## Component Location
```
src/components/charts/d3/
├── SmallMultiplesChart.tsx              # Core component
├── SmallMultiplesChartWithFilters.tsx   # With filter controls
└── SmallMultiplesChartDemo.tsx          # Demo with sample data
```

## Basic Usage

### Simple Usage
```typescript
import { SmallMultiplesChart } from '@/components/charts/d3/SmallMultiplesChart';

<SmallMultiplesChart
  regions={regionalData}
  height={600}
  columns={2}
/>
```

### With Filters
```typescript
import { SmallMultiplesChartWithFilters } from '@/components/charts/d3/SmallMultiplesChartWithFilters';

<SmallMultiplesChartWithFilters
  regions={regionalData}
  height={600}
  columns={2}
  initialSynchronizeScales={true}
  onRegionClick={(region) => console.log(region)}
/>
```

## Data Structure

```typescript
interface RegionalData {
  region: string;
  data: TimeSeriesData[];
  total?: number;
  metadata?: Record<string, any>;
}

interface TimeSeriesData {
  date: string | Date;
  value: number;
  category?: string;
}
```

## Example Data

```typescript
const regionalData = [
  {
    region: 'North Gaza',
    data: [
      { date: '2023-10-07', value: 120 },
      { date: '2023-10-08', value: 145 },
      { date: '2023-10-09', value: 167 },
    ],
    total: 8500,
  },
  {
    region: 'Gaza City',
    data: [
      { date: '2023-10-07', value: 200 },
      { date: '2023-10-08', value: 225 },
      { date: '2023-10-09', value: 250 },
    ],
    total: 12000,
  },
];
```

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `regions` | `RegionalData[]` | required | Array of regional data |
| `height` | `number` | `600` | Chart height in pixels |
| `columns` | `number` | `2` | Number of columns in grid |
| `animated` | `boolean` | `true` | Enable animations |
| `interactive` | `boolean` | `true` | Enable interactivity |
| `synchronizeScales` | `boolean` | `true` | Sync Y-axis scales |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showArea` | `boolean` | `true` | Show area fill |
| `showTotals` | `boolean` | `true` | Show total labels |
| `selectedRegions` | `string[]` | all | Filter regions |

## Features

### ✅ Synchronized Scales
- Compare regions with same Y-axis scale
- Toggle between synchronized and independent

### ✅ Regional Filtering
- Select/deselect regions with badges
- Bulk select all or clear
- Minimum one region always visible

### ✅ Interactive Tooltips
- Hover to see regional details
- Date and value formatting
- Smart positioning

### ✅ Highlighting
- Hover effects on charts
- Border and line thickness changes
- Visual feedback

### ✅ RTL Support
- Full right-to-left layout
- Reversed grid positioning
- Arabic text support

### ✅ Animations
- Staggered entrance (150ms delay)
- Line drawing (1500ms)
- Area fade-in (1000ms)
- Smooth transitions

## Callbacks

```typescript
// Region click handler
onRegionClick={(region) => {
  console.log('Region:', region.region);
  console.log('Total:', region.total);
  console.log('Data points:', region.data.length);
}}

// Data hover handler
onDataHover={(data) => {
  if (data) {
    console.log('Region:', data.region);
    console.log('Date:', data.date);
    console.log('Value:', data.value);
  }
}}
```

## Custom Formatters

```typescript
// Value formatter
valueFormatter={(value) => {
  return value >= 1000 
    ? d3.format('.2s')(value)  // 1.5k, 2.3M
    : d3.format(',')(value);   // 1,234
}}

// Date formatter
dateFormatter={(date) => {
  return d3.timeFormat('%b %d, %Y')(date);  // Jan 15, 2024
}}
```

## Styling

### Theme Support
- Automatically adapts to light/dark theme
- Uses theme-aware colors from `useThemePreference`

### Custom Colors
```typescript
<SmallMultiplesChart
  lineColor="#3b82f6"  // Custom line color
  // Area color is derived with opacity
/>
```

## Dashboard Integration

### Gaza Healthcare (Task 20.1)
```typescript
<SmallMultiplesChartWithFilters
  regions={healthcareByRegion}
  columns={2}
  height={600}
/>
```

### Gaza Displacement (Task 21.1)
```typescript
<SmallMultiplesChartWithFilters
  regions={displacementByRegion}
  columns={3}
  height={500}
/>
```

### Gaza Education (Task 22.1)
```typescript
<SmallMultiplesChartWithFilters
  regions={schoolDamageByRegion}
  columns={2}
  height={600}
/>
```

## Performance Tips

1. **Memoize Data**: Use `useMemo` for data processing
2. **Limit Regions**: Keep under 20 regions for best performance
3. **Limit Data Points**: Keep under 1000 points per region
4. **Disable Animations**: Set `animated={false}` for large datasets

## Troubleshooting

### Chart not rendering?
- Check that `regions` array is not empty
- Verify data has valid dates and values
- Check container has width/height

### Tooltips not showing?
- Ensure `interactive={true}`
- Check that data points exist
- Verify container positioning

### RTL not working?
- Check i18n language is set to 'ar'
- Verify `useTranslation` hook is available

### Animations too slow?
- Reduce `animated` duration in code
- Or disable with `animated={false}`

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+

## Accessibility

- ✅ ARIA labels on charts
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast (WCAG AA)
- ✅ Focus indicators

## Related Components

- `AnimatedAreaChart` - Single area chart
- `InteractiveBarChart` - Bar comparisons
- `TimelineEventsChart` - Timeline with events
- `CalendarHeatmapChart` - Calendar patterns

## Next Steps

After implementing SmallMultiplesChart:
1. Integrate into Gaza Healthcare dashboard (Task 20.1)
2. Integrate into Gaza Displacement dashboard (Task 21.1)
3. Integrate into Gaza Education dashboard (Task 22.1)
4. Add to other regional comparison dashboards

## Support

For issues or questions:
- Check TypeScript types in component files
- Review demo component for usage examples
- See full summary in TASK-18-SUMMARY.md
