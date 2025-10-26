# D3 Chart Component Library

This directory contains the core infrastructure for D3.js chart components used throughout the dashboard.

## Structure

```
d3/
├── ChartCard.tsx       # Unified wrapper component for all charts
├── types.ts            # TypeScript interfaces and types
├── colors.ts           # Theme-aware color system
├── index.ts            # Centralized exports
└── README.md           # This file
```

## Components

### ChartCard

A unified wrapper component that provides consistent controls and metadata for all D3 charts.

**Features:**
- Time filter tabs (7D, 1M, 3M, 1Y, All)
- Export functionality (PNG/CSV)
- Share functionality (URL with filters)
- Data source badge with hover panel
- Loading states and error boundaries
- Theme-aware styling

**Usage:**

```tsx
import { ChartCard } from '@/components/charts/d3';
import { TrendingUp } from 'lucide-react';

<ChartCard
  title="Casualties Timeline"
  icon={<TrendingUp className="h-5 w-5" />}
  badge="Area Chart"
  chartType="area"
  dataSource={{
    source: "Gaza Ministry of Health",
    url: "https://example.com",
    lastUpdated: "2 hours ago",
    reliability: "high",
    methodology: "Direct hospital reports with daily aggregation"
  }}
  filters={{
    enabled: true,
    defaultFilter: 'all',
    onFilterChange: (filter) => console.log(filter)
  }}
  onExport={() => console.log('Export')}
  onShare={() => console.log('Share')}
>
  <YourD3Chart data={data} />
</ChartCard>
```

## Types

### D3ChartProps

Base interface for all D3 chart components:

```typescript
interface D3ChartProps {
  data: any[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  theme?: 'light' | 'dark';
  locale?: 'en' | 'ar';
  animated?: boolean;
  interactive?: boolean;
  onDataPointClick?: (data: any) => void;
  onDataPointHover?: (data: any) => void;
}
```

### DataSourceMetadata

Data source attribution interface:

```typescript
interface DataSourceMetadata {
  source: string;
  url?: string;
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  methodology: string;
  recordCount?: number;
}
```

## Color System

The color system integrates with the existing `chart-colors.ts` and provides D3-specific utilities.

### Basic Usage

```typescript
import { getD3Colors, getD3Color, d3ColorScales } from '@/components/charts/d3';

// Get all colors
const colors = getD3Colors();

// Get specific number of colors
const fiveColors = getD3Colors(5);

// Get single color by index
const color = getD3Color(1);

// Use predefined scales
const crisisColors = d3ColorScales.crisis;
const sequentialColors = d3ColorScales.sequential('dark');
```

### Theme-Aware Colors

```typescript
import { 
  getD3TextColor, 
  getD3GridColor, 
  getD3AxisColor 
} from '@/components/charts/d3';

const textColor = getD3TextColor(theme);
const gridColor = getD3GridColor(theme);
const axisColor = getD3AxisColor(theme);
```

### Gradients

```typescript
import { createSVGGradient } from '@/components/charts/d3';

// Create gradient in D3 SVG
const gradientId = createSVGGradient(
  svg,
  'myGradient',
  'hsl(var(--chart-1))',
  'vertical'
);

// Use in D3 selection
selection.attr('fill', `url(#${gradientId})`);
```

### Semantic Colors

```typescript
import { getSemanticColor } from '@/components/charts/d3';

const crisisColor = getSemanticColor('crisis');
const hopeColor = getSemanticColor('hope');
const warningColor = getSemanticColor('warning');
```

## Chart Types

Supported chart types:
- `area` - Animated Area Chart
- `bar` - Interactive Bar Chart
- `donut` - Advanced Donut Chart
- `stream` - Stream Graph
- `radar` - Radar Chart
- `sankey` - Sankey Flow Diagram
- `violin` - Violin Plot
- `chord` - Chord Diagram
- `calendar` - Calendar Heatmap
- `pyramid` - Population Pyramid
- `isotype` - Isotype Chart
- `waffle` - Waffle Chart
- `timeline` - Timeline with Events
- `smallmultiples` - Small Multiples
- `horizon` - Horizon Chart

## Data Structures

Common data structures for charts:

```typescript
// Time series data
interface TimeSeriesData {
  date: string | Date;
  value: number;
  category?: string;
}

// Category data
interface CategoryData {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
}

// Flow data (Sankey)
interface FlowData {
  source: string;
  target: string;
  value: number;
}

// Pyramid data
interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}

// Calendar data
interface CalendarData {
  date: string;
  value: number;
  intensity?: 'low' | 'medium' | 'high' | 'critical';
}

// Event data (Timeline)
interface EventData {
  date: string;
  title: string;
  description: string;
  type: 'ceasefire' | 'escalation' | 'humanitarian' | 'political';
}
```

## Best Practices

1. **Always use ChartCard wrapper** for consistency
2. **Use theme-aware colors** from the color system
3. **Implement proper TypeScript types** for all chart props
4. **Handle loading and error states** gracefully
5. **Support both light and dark themes**
6. **Provide data source attribution** for all charts
7. **Make charts responsive** to viewport changes
8. **Support RTL layout** for Arabic localization
9. **Implement smooth animations** with D3 transitions
10. **Add interactive tooltips** for data exploration

## Example Chart Component

```tsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { D3ChartProps, getD3Colors, getD3TextColor } from '@/components/charts/d3';

interface MyChartProps extends D3ChartProps {
  // Add chart-specific props
}

export const MyChart = ({ 
  data, 
  width = 800, 
  height = 400,
  theme = 'light',
  animated = true 
}: MyChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const colors = getD3Colors();
    const textColor = getD3TextColor(theme);

    // D3 chart implementation here
    
  }, [data, width, height, theme, animated]);

  return <svg ref={svgRef} width={width} height={height} />;
};
```

## Integration with Existing Charts

The chart components in `src/components/charts/demo/` can be wrapped with ChartCard:

```tsx
import { ChartCard } from '@/components/charts/d3';
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';

<ChartCard {...chartCardProps}>
  <AnimatedAreaChart data={data} />
</ChartCard>
```

## Requirements Satisfied

This library satisfies the following requirements from the spec:

- **Requirement 3.1**: Consistent component structure with ChartCard wrapper
- **Requirement 3.10**: Theme-aware color system integration
- **Requirement 6.1-6.10**: Data source badge system
- **Requirement 8.1-8.10**: Filter integration and interactivity
- **Requirement 9.1-9.10**: Export and share functionality

## Next Steps

1. Implement individual D3 chart components
2. Add data transformation services
3. Implement localization support
4. Add comprehensive tests
5. Create Storybook stories for each component
