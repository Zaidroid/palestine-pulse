# Enhanced Base Components

This directory contains the enhanced base components for the modern dashboard redesign. These components provide improved animations, visual effects, and user experience while maintaining accessibility standards.

## Components

### EnhancedCard

A modern card component with gradient backgrounds, hover animations, and loading states.

**Features:**
- Configurable gradient backgrounds with multiple directions
- Smooth hover scale and shadow elevation animations
- Built-in loading skeleton with shimmer animation
- Respects `prefers-reduced-motion` accessibility preference
- Optional hover animations

**Usage:**
```tsx
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced';

<EnhancedCard
  gradient={{
    from: 'hsl(var(--primary))',
    to: 'hsl(var(--primary) / 0.1)',
    direction: 'br'
  }}
  hoverable={true}
>
  <EnhancedCardHeader>
    <EnhancedCardTitle>Card Title</EnhancedCardTitle>
  </EnhancedCardHeader>
  <EnhancedCardContent>
    Card content goes here
  </EnhancedCardContent>
</EnhancedCard>
```

**Props:**
- `gradient?: GradientConfig` - Gradient background configuration
  - `from: string` - Starting color (CSS color value)
  - `to: string` - Ending color (CSS color value)
  - `direction?: 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl' | 't' | 'tr'` - Gradient direction (default: 'br')
- `loading?: boolean` - Show loading skeleton (default: false)
- `hoverable?: boolean` - Enable hover animations (default: true)
- `className?: string` - Additional CSS classes
- Standard HTML div props (onClick, onMouseEnter, etc.)

**Animation Specifications:**
- Hover scale: 1.03x
- Animation duration: 300ms
- Easing: ease-out
- Shadow elevation on hover

### AnimatedCounter

Smoothly animates numeric values from 0 to target with count-up animation.

**Features:**
- Smooth count-up animation using requestAnimationFrame
- Support for decimals, thousand separators, prefix, and suffix
- Respects `prefers-reduced-motion` (shows final value instantly)
- Ease-out expo easing for natural deceleration
- Accessible with ARIA live regions

**Usage:**
```tsx
import { AnimatedCounter } from '@/components/ui/enhanced';

<AnimatedCounter
  value={12345}
  duration={1500}
  decimals={0}
  prefix="$"
  suffix=""
  separator=","
/>
```

**Props:**
- `value: number` - Target value to count up to
- `duration?: number` - Animation duration in milliseconds (default: 1500)
- `decimals?: number` - Number of decimal places (default: 0)
- `prefix?: string` - Text to display before the number (default: '')
- `suffix?: string` - Text to display after the number (default: '')
- `separator?: string` - Thousand separator character (default: ',')
- `className?: string` - Additional CSS classes
- `onComplete?: () => void` - Callback when animation completes

**Animation Specifications:**
- Duration: 1500ms (configurable)
- Easing: ease-out exponential
- Updates: 60fps via requestAnimationFrame

### MiniSparkline

Compact line chart with stroke-dasharray draw animation and gradient fill.

**Features:**
- Built with Recharts for reliable rendering
- Stroke-dasharray draw animation
- Optional gradient fill
- Configurable colors and height
- Respects `prefers-reduced-motion`
- Responsive container

**Usage:**
```tsx
import { MiniSparkline } from '@/components/ui/enhanced';

const data = [
  { value: 100, date: '2024-01-01' },
  { value: 120, date: '2024-01-02' },
  { value: 115, date: '2024-01-03' },
];

<MiniSparkline
  data={data}
  color="hsl(var(--primary))"
  height={40}
  showGradient={true}
  animate={true}
/>
```

**Props:**
- `data: SparklineDataPoint[]` - Array of data points
  - `value: number` - Y-axis value
  - `date?: string` - Optional date/label
- `color?: string` - Line color (default: 'hsl(var(--primary))')
- `height?: number` - Chart height in pixels (default: 40)
- `showGradient?: boolean` - Show gradient fill under line (default: true)
- `animate?: boolean` - Enable draw animation (default: true)
- `className?: string` - Additional CSS classes

**Animation Specifications:**
- Draw animation: 1200ms
- Easing: ease-out
- Gradient fade-in after line completes

## Accessibility

All components follow accessibility best practices:

- **Reduced Motion**: All animations respect the `prefers-reduced-motion` media query
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Appropriate ARIA attributes for screen readers
- **Semantic HTML**: Proper HTML structure and roles
- **Focus Indicators**: Clear focus states for keyboard navigation

## Performance

Components are optimized for performance:

- **GPU Acceleration**: Animations use CSS transforms for hardware acceleration
- **Memoization**: Expensive computations are memoized
- **RequestAnimationFrame**: Smooth 60fps animations
- **Lazy Rendering**: Components only animate when visible

## Examples

See `EnhancedComponentsDemo.tsx` for comprehensive examples of all components and their variants.

## Requirements Mapping

These components fulfill the following requirements from the spec:

- **Requirement 2.1**: Modern Metric Card Design - Entry animations
- **Requirement 2.2**: Animated counter from zero to target value
- **Requirement 2.3**: Hover scale and shadow elevation
- **Requirement 2.4**: Sparkline with gradient fill
- **Requirement 9.1**: Loading skeleton components
- **Requirement 9.2**: Shimmer animation for loading states
- **Requirement 10.1**: Respect prefers-reduced-motion

### EnhancedMetricCard

A comprehensive metric card component that combines all enhanced base components with additional features like expandable content, real-time indicators, and data source badges.

**Features:**
- Integrates AnimatedCounter, MiniSparkline, and EnhancedCard
- Entry animations with stagger support via intersection observer
- Expandable functionality with modal integration
- Real-time update indicator with pulsing animation
- Data source badges with quality and freshness indicators
- Trend indicators with icons and colors
- Support for custom value formatting
- Fully accessible with ARIA labels

**Usage:**
```tsx
import { EnhancedMetricCard } from '@/components/ui/enhanced';
import { Users } from 'lucide-react';

<EnhancedMetricCard
  title="Total Population"
  value={2345678}
  icon={Users}
  gradient={{
    from: 'hsl(var(--primary) / 0.1)',
    to: 'hsl(var(--primary) / 0.02)',
    direction: 'br',
  }}
  change={{
    value: 2.5,
    trend: 'up',
    period: 'vs last month',
  }}
  sparkline={{
    data: [
      { value: 100, date: '2024-01-01' },
      { value: 120, date: '2024-01-02' },
    ],
    color: 'hsl(var(--primary))',
  }}
  dataSources={['tech4palestine', 'un_ocha']}
  lastUpdated={new Date()}
  expandable={true}
  expandedContent={<div>Detailed information...</div>}
/>
```

**Props:**
- `title: string` - Card title/metric name
- `value: number | string` - Metric value (animates if number)
- `icon: LucideIcon` - Icon component from lucide-react
- `gradient?: GradientConfig` - Optional gradient background
- `change?: MetricChange` - Change indicator with trend
  - `value: number` - Percentage change
  - `trend: 'up' | 'down' | 'neutral'` - Trend direction
  - `period: string` - Time period description
- `sparkline?: object` - Optional sparkline chart
  - `data: SparklineDataPoint[]` - Chart data
  - `color: string` - Line color
- `expandable?: boolean` - Enable click to expand (default: false)
- `expandedContent?: ReactNode` - Content shown in modal
- `realTime?: boolean` - Show real-time indicator (default: false)
- `dataSources?: DataSource[]` - Array of data sources
- `quality?: 'high' | 'medium' | 'low'` - Data quality indicator
- `loading?: boolean` - Show loading skeleton (default: false)
- `lastUpdated?: Date` - Last update timestamp
- `description?: string` - Additional description
- `unit?: string` - Unit suffix for value
- `formatValue?: (value) => string` - Custom value formatter
- `className?: string` - Additional CSS classes

**Animation Specifications:**
- Entry: Fade in + slide up (500ms, stagger: 100ms)
- Counter: Count up animation (1500ms)
- Hover: Scale 1.03 + shadow elevation (300ms)
- Real-time pulse: Opacity 0.5-1.0 loop (1500ms)
- Intersection observer triggers animation when in viewport

**Requirements Fulfilled:**
- **Requirement 2.1**: Entry animations with stagger support
- **Requirement 2.2**: Animated counter integration
- **Requirement 2.3**: Hover animations and interactions
- **Requirement 2.4**: Sparkline integration
- **Requirement 2.5**: Real-time update indicator
- **Requirement 2.6**: Expandable functionality with modal
- **Requirement 5.1-5.5**: Enhanced data source badges

## Browser Support

- Modern browsers with ES6+ support
- Framer Motion compatibility
- CSS Grid and Flexbox support
- RequestAnimationFrame API
