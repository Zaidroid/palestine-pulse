# D3.js Chart Library - Technical Implementation Guide

## Overview

This document provides comprehensive technical details for implementing the 15 D3.js charts from the Advanced Interactive Demo into your production dashboards.

**Location**: `src/components/charts/AdvancedInteractiveDemo.tsx`  
**Total Charts**: 15 different visualization types  
**Framework**: React + TypeScript + D3.js v7  
**Theme Support**: Full dark/light mode compatibility

---

## Chart Catalog

### 1. Animated Area Chart
**File**: `src/components/charts/demo/AnimatedAreaChart.tsx`  
**Best For**: Time series trends, cumulative data, showing magnitude over time

**Technical Features**:
- Gradient fills with smooth transitions
- Path animation using stroke-dasharray technique
- Interactive crosshair with tooltip
- Responsive SVG with dynamic sizing
- Theme-aware color schemes

**Key Implementation**:
```typescript
const area = d3.area<DataPoint>()
  .x(d => x(d.date))
  .y0(height)
  .y1(d => y(d.value))
  .curve(d3.curveMonotoneX);

// Animate path drawing
const pathLength = path.node().getTotalLength();
path
  .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
  .attr('stroke-dashoffset', pathLength)
  .transition()
  .duration(2000)
  .attr('stroke-dashoffset', 0);
```

**Data Structure**:
```typescript
interface DataPoint {
  date: Date;
  value: number;
}
```

---

### 2. Interactive Bar Chart
**File**: `src/components/charts/demo/InteractiveBarChart.tsx`  
**Best For**: Categorical comparisons, rankings, discrete values

**Technical Features**:
- Hover effects with scale transitions
- Color-coded bars by value
- Animated bar growth from bottom
- Sortable data
- Value labels on bars

**Key Implementation**:
```typescript
bars
  .attr('y', height)
  .attr('height', 0)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 100)
  .attr('y', d => y(d.value))
  .attr('height', d => height - y(d.value));

// Hover interaction
.on('mouseenter', function() {
  d3.select(this)
    .transition()
    .duration(200)
    .attr('opacity', 0.8)
    .attr('transform', 'scale(1.05)');
})
```

**Data Structure**:
```typescript
interface BarData {
  category: string;
  value: number;
  color?: string;
}
```

---

### 3. Advanced Donut Chart
**File**: `src/components/charts/demo/AdvancedDonutChart.tsx`  
**Best For**: Part-to-whole relationships, proportions, percentages

**Technical Features**:
- Arc tweening for smooth transitions
- Center label with total
- Interactive segment expansion
- Percentage labels
- Legend with color coding

**Key Implementation**:
```typescript
const arc = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius);

const pie = d3.pie<DataPoint>()
  .value(d => d.value)
  .sort(null);

// Arc tween animation
function arcTween(d) {
  const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
  return (t) => arc(i(t));
}
```

**Data Structure**:
```typescript
interface DonutData {
  category: string;
  value: number;
  color: string;
}
```

---

### 4. Stream Graph Chart
**File**: `src/components/charts/demo/StreamGraphChart.tsx`  
**Best For**: Multiple time series, stacked trends, flow visualization

**Technical Features**:
- Stacked area with offset
- Smooth curve interpolation
- Layer-based animation
- Interactive layer highlighting
- Coordinated tooltips

**Key Implementation**:
```typescript
const stack = d3.stack()
  .keys(categories)
  .offset(d3.stackOffsetWiggle)
  .order(d3.stackOrderInsideOut);

const area = d3.area()
  .x(d => x(d.data.date))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]))
  .curve(d3.curveBasis);
```

**Data Structure**:
```typescript
interface StreamData {
  date: Date;
  [category: string]: number | Date;
}
```

---

### 5. Radar Chart
**File**: `src/components/charts/demo/RadarChart.tsx`  
**Best For**: Multi-dimensional comparisons, capability analysis, profiles

**Technical Features**:
- Radial grid system
- Multiple data series overlay
- Animated polygon drawing
- Interactive point highlighting
- Axis labels with rotation

**Key Implementation**:
```typescript
const angleSlice = (Math.PI * 2) / axes.length;

const radarLine = d3.lineRadial()
  .radius(d => rScale(d.value))
  .angle((d, i) => i * angleSlice)
  .curve(d3.curveLinearClosed);

// Calculate point positions
const x = rScale(value) * Math.cos(angleSlice * i - Math.PI / 2);
const y = rScale(value) * Math.sin(angleSlice * i - Math.PI / 2);
```

**Data Structure**:
```typescript
interface RadarData {
  axis: string;
  value: number;
}
```

---

### 6. Sankey Flow Chart
**File**: `src/components/charts/demo/SankeyFlowChart.tsx`  
**Best For**: Flow visualization, resource allocation, process mapping

**Technical Features**:
- D3 Sankey layout algorithm
- Curved link paths
- Node dragging capability
- Flow highlighting on hover
- Gradient flows

**Key Implementation**:
```typescript
const sankey = d3Sankey.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 1], [width - 1, height - 6]]);

const { nodes, links } = sankey({
  nodes: data.nodes.map(d => ({ ...d })),
  links: data.links.map(d => ({ ...d }))
});

const link = d3Sankey.sankeyLinkHorizontal();
```

**Data Structure**:
```typescript
interface SankeyData {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
}
```

---

### 7. Violin Plot Chart
**File**: `src/components/charts/demo/ViolinPlotChart.tsx`  
**Best For**: Distribution analysis, statistical comparison, density visualization

**Technical Features**:
- Kernel density estimation
- Mirrored distribution curves
- Box plot overlay (median, quartiles)
- Multiple group comparison
- Statistical annotations

**Key Implementation**:
```typescript
// Kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
  };
}

function kernelEpanechnikov(k) {
  return v => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
}

const density = kernelDensityEstimator(
  kernelEpanechnikov(7),
  y.ticks(50)
)(data);
```

**Data Structure**:
```typescript
interface ViolinData {
  group: string;
  values: number[];
}
```

---

### 8. Chord Diagram Chart
**File**: `src/components/charts/demo/ChordDiagramChart.tsx`  
**Best For**: Relationship matrices, network flows, interconnections

**Technical Features**:
- Circular layout with ribbons
- Bidirectional flow visualization
- Interactive ribbon highlighting
- Arc labels with rotation
- Gradient ribbons

**Key Implementation**:
```typescript
const chord = d3.chord()
  .padAngle(0.05)
  .sortSubgroups(d3.descending);

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);

const ribbon = d3.ribbon()
  .radius(innerRadius);

const chords = chord(matrix);
```

**Data Structure**:
```typescript
// Matrix format: matrix[i][j] = flow from i to j
type ChordMatrix = number[][];
```

---

### 9. Calendar Heatmap Chart
**File**: `src/components/charts/demo/CalendarHeatmapChart.tsx`  
**Best For**: Daily patterns, temporal heatmaps, activity tracking

**Technical Features**:
- Calendar grid layout
- Color intensity mapping
- Month/week organization
- Daily cell tooltips
- Responsive cell sizing

**Key Implementation**:
```typescript
const cellSize = 12;
const weekOffset = (week) => week * (cellSize + 2);
const dayOffset = (day) => day * (cellSize + 2);

// Position cells
.attr('x', d => weekOffset(d3.timeWeek.count(d3.timeYear(d.date), d.date)))
.attr('y', d => dayOffset(d.date.getDay()))
.attr('width', cellSize)
.attr('height', cellSize)
.attr('fill', d => colorScale(d.value));
```

**Data Structure**:
```typescript
interface CalendarData {
  date: Date;
  value: number;
}
```

---

### 10. Population Pyramid Chart
**File**: `src/components/charts/demo/PopulationPyramidChart.tsx`  
**Best For**: Age/gender distribution, demographic analysis, comparative populations

**Technical Features**:
- Mirrored horizontal bars
- Age group categorization
- Gender comparison
- Percentage or absolute values
- Center axis alignment

**Key Implementation**:
```typescript
// Left side (male) - negative values
const xLeft = d3.scaleLinear()
  .domain([maxValue, 0])
  .range([0, width / 2]);

// Right side (female) - positive values
const xRight = d3.scaleLinear()
  .domain([0, maxValue])
  .range([width / 2, width]);

// Center axis
svg.append('line')
  .attr('x1', width / 2)
  .attr('x2', width / 2)
  .attr('y1', 0)
  .attr('y2', height);
```

**Data Structure**:
```typescript
interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}
```

---

### 11. Isotype Chart
**File**: `src/components/charts/demo/IsotypeChart.tsx`  
**Best For**: Humanizing data, pictorial representation, impact visualization

**Technical Features**:
- Icon-based visualization
- Grid layout system
- Lucide React icons
- Animated icon appearance
- Proportional representation

**Key Implementation**:
```typescript
const iconsPerRow = 20;
const iconSize = 24;
const iconSpacing = 8;

// Calculate grid position
const row = Math.floor(i / iconsPerRow);
const col = i % iconsPerRow;
const x = col * (iconSize + iconSpacing);
const y = row * (iconSize + iconSpacing);

// Render icons
<User 
  className="h-6 w-6" 
  style={{ opacity: 0, animation: `fadeIn 0.3s ${i * 10}ms forwards` }}
/>
```

**Data Structure**:
```typescript
interface IsotypeData {
  category: string;
  count: number;
  iconRatio: number; // e.g., 1 icon = 100 people
}
```

---

### 12. Waffle Chart
**File**: `src/components/charts/demo/WaffleChart.tsx`  
**Best For**: Percentage visualization, part-to-whole in grid, proportions

**Technical Features**:
- 10x10 grid (100 squares)
- Color-coded categories
- Animated square filling
- Percentage labels
- Responsive square sizing

**Key Implementation**:
```typescript
const gridSize = 10;
const squareSize = 20;
const squareGap = 2;

// Create 100 squares
const squares = Array.from({ length: 100 }, (_, i) => {
  const row = Math.floor(i / gridSize);
  const col = i % gridSize;
  
  // Determine category for this square
  let cumulative = 0;
  const category = data.find(d => {
    cumulative += d.percentage;
    return i < cumulative;
  });
  
  return { row, col, category };
});
```

**Data Structure**:
```typescript
interface WaffleData {
  category: string;
  percentage: number;
  color: string;
}
```

---

### 13. Timeline with Events Chart
**File**: `src/components/charts/demo/TimelineEventsChart.tsx`  
**Best For**: Historical timelines, event annotation, contextual data

**Technical Features**:
- Area chart with event markers
- Vertical event lines
- Event type categorization
- Phase shading (e.g., ceasefires)
- Interactive event tooltips

**Key Implementation**:
```typescript
// Event markers
eventGroups.append('line')
  .attr('x1', 0)
  .attr('x2', 0)
  .attr('y1', 0)
  .attr('y2', height)
  .attr('stroke', d => colors[d.type])
  .attr('stroke-dasharray', '4,4');

// Phase shading
svg.append('rect')
  .attr('x', x(startDate))
  .attr('y', 0)
  .attr('width', x(endDate) - x(startDate))
  .attr('height', height)
  .attr('fill', phaseColor)
  .attr('opacity', 0.1);
```

**Data Structure**:
```typescript
interface TimelineEvent {
  date: Date;
  title: string;
  description: string;
  type: 'escalation' | 'ceasefire' | 'humanitarian' | 'political';
  severity: 'critical' | 'high' | 'medium';
}

interface TimelineData {
  date: Date;
  value: number;
}
```

---

### 14. Small Multiples Chart
**File**: `src/components/charts/demo/SmallMultiplesChart.tsx`  
**Best For**: Regional comparison, pattern recognition, synchronized views

**Technical Features**:
- Grid layout of mini charts
- Synchronized scales
- Individual chart labels
- Coordinated tooltips
- Staggered animations

**Key Implementation**:
```typescript
const cols = 2;
const rows = Math.ceil(regions.length / cols);
const chartWidth = width / cols - 20;
const chartHeight = height / rows - 30;

// Shared scales
const xScale = d3.scaleTime()
  .domain([minDate, maxDate])
  .range([0, chartWidth]);

const yScale = d3.scaleLinear()
  .domain([0, globalMax])
  .range([chartHeight, 0]);

// Position each chart
regions.forEach((region, i) => {
  const row = Math.floor(i / cols);
  const col = i % cols;
  const offsetX = col * (chartWidth + 40);
  const offsetY = row * (chartHeight + 50);
  
  const chartGroup = svg.append('g')
    .attr('transform', `translate(${offsetX}, ${offsetY})`);
});
```

**Data Structure**:
```typescript
interface SmallMultipleData {
  region: string;
  data: Array<{ date: Date; value: number }>;
}
```

---

### 15. Horizon Chart
**File**: `src/components/charts/demo/HorizonChart.tsx`  
**Best For**: Compact time series, dashboard overviews, multi-metric comparison

**Technical Features**:
- Layered color bands
- Mirrored positive/negative
- Space-efficient design
- Baseline indicators
- Multiple metrics in compact space

**Key Implementation**:
```typescript
const numBands = 4;
const bandHeight = 50;

// Create bands for positive deviations
for (let band = 0; band < numBands; band++) {
  const bandThreshold = (maxDeviation / numBands) * band;
  const nextBandThreshold = (maxDeviation / numBands) * (band + 1);
  
  const bandData = data.map(d => ({
    ...d,
    value: baseline + Math.max(0, Math.min(
      d.value - baseline - bandThreshold,
      nextBandThreshold - bandThreshold
    ))
  }));
  
  chartGroup.append('path')
    .datum(bandData)
    .attr('fill', colors.positive[band])
    .attr('d', areaGenerator);
}
```

**Data Structure**:
```typescript
interface HorizonData {
  metric: string;
  data: Array<{ date: Date; value: number }>;
  baseline: number;
}
```

---

## Common Patterns & Best Practices

### 1. Theme Integration

All charts use the `useThemePreference` hook for dark/light mode:

```typescript
import { useThemePreference } from '@/hooks/useThemePreference';

const { theme } = useThemePreference();

const colors = {
  primary: theme === 'dark' ? '#3b82f6' : '#2563eb',
  text: theme === 'dark' ? '#e5e7eb' : '#374151',
  grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
};
```

### 2. Responsive SVG Setup

```typescript
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = containerRef.current.clientWidth - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select(svgRef.current)
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);
```

### 3. Tooltip Pattern

```typescript
const [tooltip, setTooltip] = useState<{
  visible: boolean;
  x: number;
  y: number;
  data: any;
}>({ visible: false, x: 0, y: 0, data: null });

// In D3 interaction
.on('mouseover', (event, d) => {
  setTooltip({
    visible: true,
    x: event.pageX,
    y: event.pageY,
    data: d
  });
})
.on('mouseout', () => {
  setTooltip(prev => ({ ...prev, visible: false }));
});

// In JSX
{tooltip.visible && tooltip.data && (
  <div
    className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50"
    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
  >
    {/* Tooltip content */}
  </div>
)}
```

### 4. Animation Patterns

**Path Drawing Animation**:
```typescript
const pathLength = path.node().getTotalLength();
path
  .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
  .attr('stroke-dashoffset', pathLength)
  .transition()
  .duration(2000)
  .attr('stroke-dashoffset', 0);
```

**Staggered Element Animation**:
```typescript
elements
  .attr('opacity', 0)
  .transition()
  .duration(600)
  .delay((d, i) => i * 100)
  .attr('opacity', 1);
```

**Scale Transition**:
```typescript
element
  .transition()
  .duration(300)
  .attr('transform', 'scale(1.1)');
```

### 5. Data Cleanup

Always clean up D3 selections in useEffect:

```typescript
useEffect(() => {
  if (!svgRef.current) return;
  
  // Clear previous render
  d3.select(svgRef.current).selectAll('*').remove();
  
  // ... chart rendering code
  
}, [theme, data]); // Dependencies
```

---

## Integration into Production Dashboard

### Step 1: Import the Chart Component

```typescript
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';
```

### Step 2: Wrap in Card (Optional)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Casualties Timeline</CardTitle>
  </CardHeader>
  <CardContent>
    <AnimatedAreaChart />
  </CardContent>
</Card>
```

### Step 3: Add Data Source Badge

```typescript
import { DataSourceBadge } from '@/components/ui/data-source-badge';

<DataSourceBadge
  source="Gaza Ministry of Health"
  url="https://example.com"
  lastUpdated="2 hours ago"
  reliability="high"
  methodology="Direct hospital reports with daily aggregation"
/>
```

### Step 4: Add Filter Controls (Optional)

```typescript
const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');

<div className="flex gap-2">
  {['week', 'month', 'all'].map(filter => (
    <button
      key={filter}
      onClick={() => setTimeFilter(filter)}
      className={timeFilter === filter ? 'active' : ''}
    >
      {filter}
    </button>
  ))}
</div>
```

---

## Performance Considerations

### 1. Data Sampling
For large datasets (>1000 points), consider sampling:

```typescript
function sampleData(data: DataPoint[], maxPoints: number) {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}
```

### 2. Debounced Resize
Handle window resize efficiently:

```typescript
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

useEffect(() => {
  const handleResize = debounce(() => {
    // Re-render chart
  }, 250);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 3. Memoization
Memoize expensive calculations:

```typescript
import { useMemo } from 'react';

const processedData = useMemo(() => {
  return data.map(d => ({
    ...d,
    computed: expensiveCalculation(d)
  }));
}, [data]);
```

---

## Accessibility

### 1. ARIA Labels
```typescript
<svg
  ref={svgRef}
  role="img"
  aria-label="Casualties timeline showing daily trends"
>
  <title>Casualties Timeline</title>
  <desc>Line chart showing daily casualty counts from Oct 2023 to Jan 2024</desc>
</svg>
```

### 2. Keyboard Navigation
```typescript
<rect
  tabIndex={0}
  role="button"
  aria-label={`${d.category}: ${d.value}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(d);
    }
  }}
/>
```

### 3. Color Contrast
Ensure sufficient contrast ratios (WCAG AA: 4.5:1 for text):

```typescript
const colors = {
  primary: theme === 'dark' ? '#60a5fa' : '#2563eb', // High contrast
  secondary: theme === 'dark' ? '#34d399' : '#059669'
};
```

---

## Testing Recommendations

### 1. Visual Regression Testing
Use tools like Percy or Chromatic to catch visual changes

### 2. Unit Tests
Test data transformations and calculations:

```typescript
describe('kernelDensityEstimator', () => {
  it('should calculate density correctly', () => {
    const data = [1, 2, 3, 4, 5];
    const density = calculateDensity(data);
    expect(density).toHaveLength(50);
  });
});
```

### 3. Integration Tests
Test chart rendering and interactions:

```typescript
import { render, fireEvent } from '@testing-library/react';

test('shows tooltip on hover', () => {
  const { container } = render(<AnimatedAreaChart />);
  const chart = container.querySelector('svg');
  
  fireEvent.mouseOver(chart);
  expect(screen.getByText(/casualties/i)).toBeInTheDocument();
});
```

---

## Dependencies

```json
{
  "dependencies": {
    "d3": "^7.8.5",
    "d3-sankey": "^0.12.3",
    "react": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/d3": "^7.4.0",
    "@types/d3-sankey": "^0.12.1"
  }
}
```

---

## File Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── demo/
│   │   │   ├── AnimatedAreaChart.tsx
│   │   │   ├── InteractiveBarChart.tsx
│   │   │   ├── AdvancedDonutChart.tsx
│   │   │   ├── StreamGraphChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── SankeyFlowChart.tsx
│   │   │   ├── ViolinPlotChart.tsx
│   │   │   ├── ChordDiagramChart.tsx
│   │   │   ├── CalendarHeatmapChart.tsx
│   │   │   ├── PopulationPyramidChart.tsx
│   │   │   ├── IsotypeChart.tsx
│   │   │   ├── WaffleChart.tsx
│   │   │   ├── TimelineEventsChart.tsx
│   │   │   ├── SmallMultiplesChart.tsx
│   │   │   └── HorizonChart.tsx
│   │   └── AdvancedInteractiveDemo.tsx
│   └── ui/
│       ├── card.tsx
│       ├── badge.tsx
│       └── data-source-badge.tsx
└── hooks/
    └── useThemePreference.ts
```

---

## Quick Reference: When to Use Each Chart

| Chart Type | Use Case | Data Type | Complexity |
|------------|----------|-----------|------------|
| Area Chart | Trends over time | Time series | Low |
| Bar Chart | Category comparison | Categorical | Low |
| Donut Chart | Part-to-whole | Categorical % | Low |
| Stream Graph | Multi-series trends | Time series (stacked) | Medium |
| Radar Chart | Multi-dimensional | Multi-variate | Medium |
| Sankey | Flow/process | Network/flow | High |
| Violin Plot | Distribution | Statistical | High |
| Chord Diagram | Relationships | Matrix/network | High |
| Calendar Heatmap | Daily patterns | Time series (daily) | Medium |
| Population Pyramid | Demographics | Categorical (2-sided) | Medium |
| Isotype | Humanize numbers | Count/proportion | Low |
| Waffle | Percentage grid | Categorical % | Low |
| Timeline Events | Historical context | Time series + events | Medium |
| Small Multiples | Regional comparison | Multiple time series | Medium |
| Horizon | Compact metrics | Multiple time series | High |

---

## Support & Resources

- **D3.js Documentation**: https://d3js.org/
- **Observable Examples**: https://observablehq.com/@d3
- **D3 Gallery**: https://observablehq.com/@d3/gallery
- **Chart Selection Guide**: See `CHART_SELECTION_GUIDE.md`

---

## Next Steps

1. Choose appropriate chart(s) for your data
2. Import chart component into your dashboard
3. Prepare data in the required format
4. Add theme support if needed
5. Implement tooltips and interactions
6. Add accessibility features
7. Test across devices and themes
8. Optimize performance for production

---

**Last Updated**: October 24, 2025  
**Version**: 1.0  
**Total Charts**: 15
