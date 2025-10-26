# Task 10: Sankey Flow Chart - Quick Reference

## Component Files
- **Core**: `src/components/charts/d3/SankeyFlowChart.tsx`
- **With Filters**: `src/components/charts/d3/SankeyFlowChartWithFilters.tsx`
- **Demo**: `src/components/charts/d3/SankeyFlowChartDemo.tsx`

## Basic Usage

```typescript
import { SankeyFlowChart } from '@/components/charts/d3/SankeyFlowChart';
import { FlowData } from '@/types/dashboard-data.types';

const data: FlowData[] = [
  { source: 'A', target: 'B', value: 100 },
  { source: 'B', target: 'C', value: 80 },
  { source: 'A', target: 'C', value: 50 },
];

<SankeyFlowChart
  data={data}
  height={600}
  animated={true}
  interactive={true}
  enableDragging={true}
/>
```

## With Filters

```typescript
import { SankeyFlowChartWithFilters } from '@/components/charts/d3/SankeyFlowChartWithFilters';

<SankeyFlowChartWithFilters
  data={data}
  height={600}
  showFilters={true}
  enableNodeSelection={true}
  initialThreshold={5}
  onNodeClick={(node) => console.log('Clicked:', node)}
/>
```

## Key Features

### Interactive
- ✅ Drag nodes vertically to reposition
- ✅ Hover for tooltips
- ✅ Click nodes/links for callbacks

### Filtering
- ✅ Minimum flow threshold (0-50%)
- ✅ Node selection to highlight paths
- ✅ Active filters display

### Customization
- ✅ Node alignment: left, right, center, justify
- ✅ Node width and padding
- ✅ Custom colors
- ✅ Value formatter

## Props Reference

### Essential Props
```typescript
data: FlowData[]              // Required: Flow data
height?: number               // Default: 600
animated?: boolean            // Default: true
interactive?: boolean         // Default: true
enableDragging?: boolean      // Default: true
```

### Filtering Props
```typescript
minFlowThreshold?: number     // 0-1, filters small flows
selectedNode?: string | null  // Highlight node paths
```

### Styling Props
```typescript
colors?: string[]             // Custom color palette
nodeWidth?: number            // Default: 20
nodePadding?: number          // Default: 20
nodeAlign?: string            // left|right|center|justify
```

### Callbacks
```typescript
onNodeClick?: (node: string) => void
onLinkClick?: (link: FlowData) => void
onNodeHover?: (node: string | null) => void
```

## Common Use Cases

### 1. Displacement Flow
```typescript
const displacementData: FlowData[] = [
  { source: 'North Gaza', target: 'Gaza City', value: 45000 },
  { source: 'Gaza City', target: 'Deir al-Balah', value: 38000 },
];
```

### 2. Aid Distribution
```typescript
const aidData: FlowData[] = [
  { source: 'UN Agencies', target: 'Distribution Center', value: 120000 },
  { source: 'Distribution Center', target: 'Food Aid', value: 80000 },
];
```

### 3. Resource Flow
```typescript
const resourceData: FlowData[] = [
  { source: 'Source', target: 'Processing', value: 1000 },
  { source: 'Processing', target: 'Distribution', value: 800 },
];
```

## Styling Tips

### Theme Colors
Component automatically adapts to light/dark theme.

### RTL Support
Automatically adjusts for Arabic (RTL) layout.

### Custom Colors
```typescript
<SankeyFlowChart
  data={data}
  colors={['#ef4444', '#f59e0b', '#10b981', '#3b82f6']}
/>
```

## Performance Tips

1. **Large Datasets**: Use `minFlowThreshold` to filter small flows
2. **Animation**: Set `animated={false}` for instant rendering
3. **Dragging**: Set `enableDragging={false}` if not needed

## Troubleshooting

### Issue: Nodes overlap
**Solution**: Increase `nodePadding` or `height`

### Issue: Labels cut off
**Solution**: Increase margin (especially left/right)

### Issue: Too many flows
**Solution**: Use `minFlowThreshold` filter

### Issue: Slow performance
**Solution**: Reduce data size or disable animations

## Integration Example

```typescript
// In a dashboard component
import { SankeyFlowChartWithFilters } from '@/components/charts/d3/SankeyFlowChartWithFilters';
import { useDisplacementData } from '@/hooks/useDisplacementData';

export const DisplacementDashboard = () => {
  const { data, loading } = useDisplacementData();
  
  if (loading) return <Skeleton />;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Displacement Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <SankeyFlowChartWithFilters
          data={data}
          height={600}
          showFilters={true}
          enableNodeSelection={true}
        />
      </CardContent>
    </Card>
  );
};
```

## Requirements Met
- ✅ 2.3: Sankey Diagrams for flow visualization
- ✅ 3.2: Smooth animations
- ✅ 3.3: Smart tooltips
- ✅ 3.8: Interactive feedback
- ✅ 8.4: Category filtering
- ✅ 8.5: Multiple filters

## Next Steps
1. Integrate into Displacement Stats Dashboard
2. Integrate into Food Security Dashboard
3. Add Arabic translations
4. Create integration tests
