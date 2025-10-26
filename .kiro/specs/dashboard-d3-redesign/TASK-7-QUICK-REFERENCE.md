# Task 7: AdvancedDonutChart - Quick Reference

## Component Location
```
src/components/charts/d3/AdvancedDonutChart.tsx
```

## Basic Usage

### Simple Donut Chart
```tsx
import { AdvancedDonutChart } from '@/components/charts/d3/AdvancedDonutChart';

const data = [
  { category: 'Children', value: 18000, color: '#ef4444' },
  { category: 'Women', value: 13500, color: '#f97316' },
  { category: 'Men', value: 11250, color: '#f59e0b' },
];

<AdvancedDonutChart
  data={data}
  height={400}
  centerLabel="Total Deaths"
/>
```

### With Drill-Down
```tsx
const hierarchicalData = [
  {
    category: 'Gaza Strip',
    value: 45000,
    children: [
      { category: 'Children', value: 18000 },
      { category: 'Women', value: 13500 },
      { category: 'Men', value: 11250 },
    ],
  },
];

<AdvancedDonutChart
  data={hierarchicalData}
  enableDrillDown={true}
  onDrillDownChange={(path) => console.log(path)}
/>
```

### With Filters
```tsx
import { AdvancedDonutChartWithFilters } from '@/components/charts/d3/AdvancedDonutChartWithFilters';

<AdvancedDonutChartWithFilters
  data={data}
  title="Healthcare Facility Status"
  dataSource="Good Shepherd Collective"
  enableFiltering={true}
  enableSorting={true}
  maxCategories={5}
/>
```

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CategoryData[]` | required | Array of category data |
| `height` | `number` | `400` | Chart height in pixels |
| `animated` | `boolean` | `true` | Enable animations |
| `interactive` | `boolean` | `true` | Enable hover/click |
| `showPercentageLabels` | `boolean` | `true` | Show % on arcs |
| `showLegend` | `boolean` | `true` | Show legend |
| `centerLabel` | `string` | `'Total'` | Center text label |
| `enableDrillDown` | `boolean` | `false` | Enable hierarchy |
| `onArcClick` | `function` | - | Click callback |
| `onDrillDownChange` | `function` | - | Path change callback |

## Features

### ✅ Implemented
- Animated arc transitions
- Hover expansion effects
- Interactive legend
- Percentage labels
- Center statistics
- RTL support
- Drill-down navigation
- Breadcrumb UI
- Smart tooltips
- Theme awareness

### 🎨 Customization
- Custom colors per segment
- Adjustable inner/outer radius
- Corner radius control
- Padding angle control
- Hover expansion amount
- Custom value formatters

## Demo Components

1. **AdvancedDonutChartDemo.tsx** - Basic features
2. **AdvancedDonutChartDrillDownDemo.tsx** - Drill-down features
3. **AdvancedDonutChartWithFilters.tsx** - Complete card with filters

## Integration Examples

### Gaza Healthcare Dashboard
```tsx
<AdvancedDonutChart
  data={hospitalStatusData}
  centerLabel="Total Facilities"
  colors={['#10b981', '#f59e0b', '#ef4444']}
/>
```

### Gaza Education Dashboard
```tsx
<AdvancedDonutChart
  data={schoolDamageData}
  centerLabel="Total Schools"
  enableDrillDown={true}
/>
```

### West Bank Economic Dashboard
```tsx
<AdvancedDonutChart
  data={sectorBreakdownData}
  centerLabel="GDP by Sector"
  showPercentageLabels={true}
/>
```

## Common Patterns

### With Loading State
```tsx
{loading ? (
  <Skeleton className="h-[400px]" />
) : (
  <AdvancedDonutChart data={data} />
)}
```

### With Error Handling
```tsx
{error ? (
  <ErrorState message={error} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <AdvancedDonutChart data={data} />
)}
```

### With Custom Formatter
```tsx
<AdvancedDonutChart
  data={data}
  valueFormatter={(value) => `${value.toLocaleString()} people`}
/>
```

## Troubleshooting

### Issue: Arcs not animating
**Solution**: Ensure `animated={true}` and check browser performance

### Issue: Legend overlapping chart
**Solution**: Increase chart width or adjust legend position

### Issue: Drill-down not working
**Solution**: Ensure data has `children` property and `enableDrillDown={true}`

### Issue: RTL layout incorrect
**Solution**: Verify i18n language is set to 'ar'

## Performance Tips

1. Use `maxCategories` prop to limit segments
2. Disable animations for large datasets
3. Memoize data transformations
4. Use lazy loading for off-screen charts

## Accessibility

- ARIA labels on SVG elements
- Keyboard-accessible breadcrumbs
- Screen reader-friendly tooltips
- High contrast color support

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Related Documentation

- [Requirements](./requirements.md) - Requirements 2.2, 3.2, 3.3, 3.8
- [Design](./design.md) - Component architecture
- [Task Summary](./TASK-7-SUMMARY.md) - Detailed implementation notes
