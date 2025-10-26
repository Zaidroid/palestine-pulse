# Task 6: InteractiveBarChart - Quick Reference

## Import

```typescript
import { 
  InteractiveBarChart, 
  InteractiveBarChartWithFilters 
} from '@/components/charts/d3';
```

## Basic Usage

### Simple Bar Chart
```tsx
<InteractiveBarChart
  data={[
    { category: 'Category A', value: 100 },
    { category: 'Category B', value: 200 },
    { category: 'Category C', value: 150 },
  ]}
  orientation="vertical"
/>
```

### With Filters
```tsx
<InteractiveBarChartWithFilters
  data={categoryData}
  orientation="horizontal"
  enableCategoryFilter={true}
  enableSorting={true}
  defaultSortBy="value"
  defaultSortOrder="desc"
/>
```

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CategoryData[]` | required | Array of category data |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Bar orientation |
| `animated` | `boolean` | `true` | Enable animations |
| `interactive` | `boolean` | `true` | Enable hover/click |
| `showValueLabels` | `boolean` | `false` | Show values on bars |
| `sortBy` | `'value' \| 'category' \| 'none'` | `'none'` | Sort method |
| `sortOrder` | `'asc' \| 'desc'` | `'desc'` | Sort direction |
| `maxBars` | `number` | `undefined` | Limit number of bars |
| `onBarClick` | `(data) => void` | `undefined` | Click handler |
| `onBarHover` | `(data) => void` | `undefined` | Hover handler |

## Features

✅ Vertical and horizontal layouts
✅ Smooth animations
✅ Interactive tooltips
✅ Click handlers for drill-down
✅ RTL support
✅ Category filtering
✅ Sorting (value/alphabetical)
✅ Theme-aware colors
✅ Responsive design

## Files

- `src/components/charts/d3/InteractiveBarChart.tsx`
- `src/components/charts/d3/InteractiveBarChartWithFilters.tsx`
- `src/components/charts/d3/InteractiveBarChartDemo.tsx`

## Demo

Run the demo:
```bash
# Add route to your router for /demo/bar-chart
# Point to InteractiveBarChartDemo component
```

## Next Task

Task 7: Implement AdvancedDonutChart Component
