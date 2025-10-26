# Enhanced Chart System

A comprehensive chart system with animations, interactive tooltips, and export functionality for the Palestine Pulse dashboard.

## Features

- ✨ **Smooth Animations**: Viewport-triggered animations for all chart types
- 🎯 **Interactive Tooltips**: Rich tooltips with trend indicators and comparisons
- 📥 **Export Functionality**: High-resolution PNG/SVG export at 2x pixel density
- 🎨 **Consistent Styling**: Unified design system integration
- ♿ **Accessibility**: Respects `prefers-reduced-motion` and includes ARIA labels
- 📱 **Responsive**: Optimized for all screen sizes
- 🔄 **Loading States**: Built-in skeleton loaders
- ⚠️ **Error Handling**: Graceful error states with retry options

## Components

### EnhancedChart

Main wrapper component that provides consistent layout, loading states, error handling, and data source attribution.

```tsx
import { EnhancedChart } from '@/components/ui/enhanced-chart';
import { AnimatedLineChart } from '@/components/ui/enhanced-chart';
import { XAxis, YAxis, Tooltip } from 'recharts';

<EnhancedChart
  type="line"
  data={chartData}
  config={chartConfig}
  title="Monthly Trends"
  description="Data visualization over time"
  dataSources={['tech4palestine', 'un_ocha']}
  onExport={handleExport}
  loading={isLoading}
  error={error}
>
  <AnimatedLineChart
    data={chartData}
    dataKey="value"
    xAxisKey="month"
    stroke="hsl(var(--chart-1))"
  >
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
  </AnimatedLineChart>
</EnhancedChart>
```

### Animated Chart Variants

#### AnimatedLineChart

Line chart with stroke-dasharray draw animation.

```tsx
<AnimatedLineChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  stroke="hsl(var(--primary))"
  strokeWidth={2}
  animationDuration={1200}
  isInView={true}
/>
```

**Animation**: Lines draw from left to right using stroke-dasharray animation (1200ms duration).

#### AnimatedBarChart

Bar chart with staggered height scale animation.

```tsx
<AnimatedBarChart
  data={data}
  dataKey="value"
  xAxisKey="category"
  fill="hsl(var(--primary))"
  animationDuration={800}
  staggerDelay={50}
  isInView={true}
/>
```

**Animation**: Bars scale from 0 to full height with 50ms stagger between each bar (800ms per bar).

#### AnimatedAreaChart

Area chart with gradient fill and line draw animation.

```tsx
<AnimatedAreaChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  stroke="hsl(var(--primary))"
  fill="hsl(var(--primary) / 0.2)"
  animationDuration={1000}
  isInView={true}
/>
```

**Animation**: Line draws first (700ms), then gradient fill fades in (300ms).

#### AnimatedPieChart

Pie chart with rotate and scale animation.

```tsx
<AnimatedPieChart
  data={data}
  dataKey="value"
  nameKey="name"
  colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
  animationDuration={1000}
  staggerDelay={100}
  isInView={true}
/>
```

**Animation**: Chart rotates from -90° to 0° (500ms), then slices fade in with stagger (100ms delay each).

### Enhanced Tooltips

#### EnhancedChartTooltip

Rich tooltip with frosted glass effect, trend indicators, and comparison data.

```tsx
import { EnhancedChartTooltip } from '@/components/ui/enhanced-chart';

<Tooltip 
  content={
    <EnhancedChartTooltip 
      showTrend={true}
      showComparison={true}
    />
  } 
/>
```

**Features**:
- Frosted glass background with backdrop blur
- Fade + slide animation from cursor direction
- Trend indicators (up/down/neutral) with percentage change
- Comparison data display
- Responsive positioning

#### SimpleChartTooltip

Lightweight tooltip for basic use cases.

```tsx
import { SimpleChartTooltip } from '@/components/ui/enhanced-chart';

<Tooltip content={<SimpleChartTooltip />} />
```

#### TrendIndicator

Standalone component for displaying trends.

```tsx
import { TrendIndicator } from '@/components/ui/enhanced-chart';

<TrendIndicator
  value={500}
  previousValue={400}
  showPercentage={true}
  showIcon={true}
/>
```

### Export Functionality

Export charts as high-resolution images.

```tsx
import { exportChart, generateChartFilename } from '@/components/ui/enhanced-chart';

const handleExport = async () => {
  const chartElement = chartRef.current;
  if (!chartElement) return;

  const filename = generateChartFilename('monthly-trends', 'png');
  await exportChart(chartElement, {
    filename,
    format: 'png',
    scale: 2, // 2x pixel density
    backgroundColor: '#ffffff',
  });
};
```

**Export Options**:
- `format`: 'png' | 'svg'
- `scale`: Pixel density multiplier (default: 2)
- `backgroundColor`: Background color for export
- `quality`: Image quality 0-1 (PNG only)

**Additional Functions**:
- `exportChartAsPNG()`: Export as PNG
- `exportChartAsSVG()`: Export as SVG
- `exportMultipleCharts()`: Export multiple charts as single image
- `copyChartToClipboard()`: Copy chart to clipboard
- `isChartExportSupported()`: Check browser support
- `getOptimalExportScale()`: Get optimal scale based on device pixel ratio

## Usage Examples

### Basic Line Chart

```tsx
import { EnhancedChart, AnimatedLineChart } from '@/components/ui/enhanced-chart';
import { XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 300 },
  { month: 'Mar', value: 600 },
];

const config = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
};

<EnhancedChart
  type="line"
  data={data}
  config={config}
  title="Monthly Trends"
  dataSources={['tech4palestine']}
>
  <AnimatedLineChart
    data={data}
    dataKey="value"
    xAxisKey="month"
  >
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
  </AnimatedLineChart>
</EnhancedChart>
```

### Chart with Export

```tsx
const chartRef = useRef<HTMLDivElement>(null);

const handleExport = async () => {
  if (!chartRef.current) return;
  await exportChart(chartRef.current, {
    filename: 'chart-export.png',
    scale: 2,
  });
};

<div ref={chartRef}>
  <EnhancedChart
    type="bar"
    data={data}
    config={config}
    title="Bar Chart"
    onExport={handleExport}
  >
    <AnimatedBarChart data={data} dataKey="value" xAxisKey="category">
      <XAxis dataKey="category" />
      <YAxis />
    </AnimatedBarChart>
  </EnhancedChart>
</div>
```

### Chart with Trend Tooltip

```tsx
const data = [
  { month: 'Jan', value: 400, previousValue: 350 },
  { month: 'Feb', value: 300, previousValue: 400 },
  { month: 'Mar', value: 600, previousValue: 300 },
];

<EnhancedChart type="line" data={data} config={config}>
  <AnimatedLineChart data={data} dataKey="value" xAxisKey="month">
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip content={<EnhancedChartTooltip showTrend />} />
  </AnimatedLineChart>
</EnhancedChart>
```

### Loading State

```tsx
<EnhancedChart
  type="line"
  data={data}
  config={config}
  title="Loading Chart"
  loading={true}
>
  <AnimatedLineChart data={data} dataKey="value" xAxisKey="month" />
</EnhancedChart>
```

### Error State

```tsx
<EnhancedChart
  type="line"
  data={data}
  config={config}
  title="Error Chart"
  error={new Error('Failed to load data')}
>
  <AnimatedLineChart data={data} dataKey="value" xAxisKey="month" />
</EnhancedChart>
```

## Animation Specifications

### Line Charts
- **Duration**: 1200ms
- **Effect**: Stroke-dasharray draw animation
- **Easing**: Ease-out cubic

### Bar Charts
- **Duration**: 800ms per bar
- **Stagger**: 50ms between bars
- **Effect**: Height scale from 0 to 100%
- **Easing**: Ease-out

### Area Charts
- **Duration**: 1000ms total
  - Line: 700ms (70%)
  - Fill: 300ms (30%)
- **Effect**: Line draw + gradient fade
- **Easing**: Ease-out cubic

### Pie Charts
- **Duration**: 1000ms total
  - Rotation: 500ms
  - Slices: 100ms each with stagger
- **Effect**: Rotate + scale with stagger
- **Easing**: Ease-out cubic

### Axes & Grid
- **Duration**: 400-600ms
- **Delay**: 200ms after chart animation starts
- **Effect**: Fade in
- **Easing**: Ease-out

## Accessibility

- **Reduced Motion**: All animations respect `prefers-reduced-motion` media query
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.1 Level AA compliant
- **Focus Indicators**: Clear focus states for all interactive elements

## Performance

- **GPU Acceleration**: Uses CSS transforms for smooth animations
- **Intersection Observer**: Animations trigger only when charts enter viewport
- **Lazy Loading**: Charts load on-demand
- **Optimized Rendering**: React.memo and useCallback for performance
- **Export Optimization**: Configurable scale and quality settings

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

Export functionality requires:
- HTML Canvas API
- Blob API
- URL.createObjectURL

## Demo

See `EnhancedChartDemo` component for a complete demonstration of all features.

```tsx
import { EnhancedChartDemo } from '@/components/ui/enhanced-chart';

<EnhancedChartDemo />
```

## Requirements Covered

This implementation satisfies the following requirements from the design document:

- **3.1**: Staggered entrance animations with intersection observer
- **3.2**: Line chart stroke-dasharray draw animation
- **3.3**: Bar chart height scale animation
- **3.4**: Interactive tooltips with hover effects
- **3.5**: Chart data transitions with easing
- **3.6**: Viewport-triggered animations
- **9.1**: Loading skeleton states
- **9.2**: Shimmer animation for loading
- **9.5**: Error states with retry functionality
- **15.1**: Export dialog with format options
- **15.2**: High-resolution image export at 2x pixel density

## Next Steps

To integrate into existing dashboards:

1. Replace existing chart components with `EnhancedChart`
2. Wrap chart types with animated variants
3. Add `EnhancedChartTooltip` for rich interactions
4. Implement export functionality where needed
5. Test with real data and adjust animations as needed
