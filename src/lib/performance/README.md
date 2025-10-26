# Performance Optimization Utilities

Comprehensive performance optimization utilities for the Palestine Pulse dashboard, implementing requirements 11.1-11.5 for optimal performance.

## Overview

This module provides utilities for:
- **Code Splitting**: Lazy loading components with retry logic
- **Animation Performance**: GPU acceleration and throttling
- **Rendering Optimization**: Memoization and React.memo HOCs
- **Virtualization**: Efficient rendering of long lists
- **Lazy Loading**: Intersection observer-based lazy loading

## Performance Goals

- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- 60fps during animations
- Efficient memory usage for large datasets

## Code Splitting

### Enhanced Lazy Loading

```typescript
import { lazyWithRetry, lazyNamed } from '@/lib/performance';

// Lazy load with automatic retry on failure
const Dashboard = lazyWithRetry(() => import('./Dashboard'));

// Lazy load named export
const Chart = lazyNamed(() => import('./Charts'), 'LineChart');

// With custom options
const HeavyComponent = lazyWithRetry(
  () => import('./HeavyComponent'),
  {
    retries: 3,
    retryDelay: 1000,
    delay: 0 // For testing
  }
);
```

### Route Preloading

```typescript
import { preloadComponent, createPreloadHandler } from '@/lib/performance';

// Preload on hover
const handleMouseEnter = createPreloadHandler(LazyDashboard);

<Link to="/dashboard" onMouseEnter={handleMouseEnter}>
  Dashboard
</Link>
```

## Animation Performance

### GPU Acceleration

```typescript
import { 
  getGPUAcceleratedStyles,
  useWillChange,
  gpuOptimizedVariants 
} from '@/lib/performance';

// Apply GPU acceleration styles
const styles = getGPUAcceleratedStyles(['transform', 'opacity']);

// Strategic will-change usage
function AnimatedCard({ isAnimating }) {
  const willChangeStyles = useWillChange(['transform'], isAnimating);
  
  return (
    <div style={{ ...gpuAccelerationStyles, ...willChangeStyles }}>
      {/* Content */}
    </div>
  );
}

// Use optimized variants
<motion.div variants={gpuOptimizedVariants.slideUp}>
  {/* Content */}
</motion.div>
```

### Throttling and Debouncing

```typescript
import { 
  useThrottledScroll,
  useThrottledResize,
  throttle,
  debounce 
} from '@/lib/performance';

// Throttled scroll handler
useThrottledScroll((event) => {
  console.log('Scroll position:', window.scrollY);
}, 16); // ~60fps

// Throttled resize handler
useThrottledResize((event) => {
  console.log('Window resized');
}, 100);

// Manual throttle/debounce
const throttledFn = throttle(expensiveFunction, 100);
const debouncedFn = debounce(expensiveFunction, 500);
```

### Animation Frame

```typescript
import { useAnimationFrame } from '@/lib/performance';

function SmoothAnimation() {
  const [position, setPosition] = useState(0);
  
  useAnimationFrame((deltaTime) => {
    setPosition(prev => prev + deltaTime * 0.1);
  }, true);
  
  return <div style={{ transform: `translateX(${position}px)` }} />;
}
```

## Rendering Optimization

### Memoization Hooks

```typescript
import {
  useMemoizedValue,
  useMemoizedCallback,
  useDebouncedValue,
  useThrottledValue,
  usePrevious
} from '@/lib/performance';

function OptimizedComponent({ data, onUpdate }) {
  // Memoize expensive computation
  const processedData = useMemoizedValue(
    () => expensiveProcessing(data),
    [data]
  );
  
  // Memoize callback
  const handleUpdate = useMemoizedCallback(
    (value) => onUpdate(value),
    [onUpdate]
  );
  
  // Debounce value for expensive operations
  const debouncedSearch = useDebouncedValue(searchTerm, 500);
  
  // Throttle value for frequent updates
  const throttledScroll = useThrottledValue(scrollPosition, 16);
  
  // Compare with previous value
  const prevData = usePrevious(data);
  
  return <div>{/* Content */}</div>;
}
```

### Memoization HOCs

```typescript
import {
  withShallowMemo,
  withDeepMemo,
  withSelectiveMemo,
  withPureMemo
} from '@/lib/performance';

// Shallow comparison (default)
const MemoizedCard = withShallowMemo(Card);

// Deep comparison (for complex props)
const MemoizedChart = withDeepMemo(Chart);

// Selective comparison (only specific props)
const MemoizedMetric = withSelectiveMemo(
  MetricCard,
  ['value', 'title', 'trend']
);

// Pure component (no props comparison)
const MemoizedIcon = withPureMemo(Icon);
```

### Safe State Management

```typescript
import { useSafeState, useIsMounted } from '@/lib/performance';

function AsyncComponent() {
  const [data, setData] = useSafeState(null);
  const isMounted = useIsMounted();
  
  useEffect(() => {
    fetchData().then(result => {
      // Only updates if component is still mounted
      setData(result);
    });
  }, []);
  
  return <div>{data}</div>;
}
```

## Virtualization

### Virtual List

```typescript
import { VirtualList } from '@/lib/performance';

function LongList({ items }) {
  return (
    <VirtualList
      items={items}
      height={600}
      itemHeight={80}
      renderItem={(item, index, style) => (
        <div style={style}>
          <ListItem {...item} />
        </div>
      )}
    />
  );
}
```

### Virtual Grid

```typescript
import { VirtualGrid } from '@/lib/performance';

function MetricGrid({ metrics }) {
  return (
    <VirtualGrid
      items={metrics}
      height={800}
      width={1200}
      columnCount={3}
      rowHeight={200}
      columnWidth={400}
      renderItem={(item, rowIndex, columnIndex, style) => (
        <div style={style}>
          <MetricCard {...item} />
        </div>
      )}
    />
  );
}
```

### Virtual Metric Grid

```typescript
import { VirtualMetricGrid } from '@/lib/performance';

function Dashboard({ metrics }) {
  return (
    <VirtualMetricGrid
      items={metrics}
      renderCard={(metric) => <MetricCard {...metric} />}
      cardHeight={200}
      cardWidth={300}
      gap={16}
    />
  );
}
```

### Infinite Scroll

```typescript
import { InfiniteVirtualList } from '@/lib/performance';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = async () => {
    const newItems = await fetchMoreItems();
    setItems(prev => [...prev, ...newItems]);
    setHasMore(newItems.length > 0);
  };
  
  return (
    <InfiniteVirtualList
      items={items}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={false}
      height={600}
      itemHeight={80}
      renderItem={(item, index, style) => (
        <div style={style}>{item.name}</div>
      )}
    />
  );
}
```

## Lazy Loading

### Lazy Image

```typescript
import { LazyImage } from '@/lib/performance';

function Gallery() {
  return (
    <LazyImage
      src="/large-image.jpg"
      alt="Description"
      placeholder="/placeholder.jpg"
      threshold={0.1}
      rootMargin="50px"
      onLoad={() => console.log('Image loaded')}
    />
  );
}
```

### Lazy Component

```typescript
import { LazyComponent } from '@/lib/performance';

function Page() {
  return (
    <LazyComponent
      threshold={0.1}
      placeholder={<Skeleton />}
      delay={100}
    >
      <HeavyComponent />
    </LazyComponent>
  );
}
```

### Lazy Data Loading

```typescript
import { useLazyLoad } from '@/lib/performance';

function DataSection() {
  const { ref, data, isLoading, error } = useLazyLoad(
    () => fetchData(),
    { threshold: 0.1, enabled: true }
  );
  
  return (
    <div ref={ref}>
      {isLoading && <Skeleton />}
      {error && <Error />}
      {data && <DataDisplay data={data} />}
    </div>
  );
}
```

### Deferred Animation

```typescript
import { useDeferredAnimation } from '@/lib/performance';

function AnimatedCard() {
  const shouldAnimate = useDeferredAnimation(200);
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Idle Rendering

```typescript
import { IdleComponent } from '@/lib/performance';

function Page() {
  return (
    <>
      <CriticalContent />
      
      <IdleComponent
        timeout={1000}
        placeholder={<Skeleton />}
      >
        <NonCriticalContent />
      </IdleComponent>
    </>
  );
}
```

## CSS Classes

Add these classes to elements for performance optimization:

```tsx
// GPU acceleration
<div className="gpu-accelerated">
  {/* Animated content */}
</div>

// Strategic will-change
<div className="will-change-transform">
  {/* Transform animations */}
</div>

<div className="will-change-opacity">
  {/* Opacity animations */}
</div>

<div className="will-change-transform-opacity">
  {/* Both transform and opacity */}
</div>

// Smooth scrolling
<div className="smooth-scroll">
  {/* Scrollable content */}
</div>

// Optimize rendering
<div className="optimize-rendering">
  {/* Complex content */}
</div>

// Isolate layer
<div className="isolate-layer">
  {/* Isolated content */}
</div>
```

## Best Practices

### 1. Code Splitting
- Split routes into separate chunks
- Lazy load heavy components (charts, maps, analytics)
- Preload on hover for better UX
- Use retry logic for network failures

### 2. Animation Performance
- Use CSS transforms instead of position properties
- Apply will-change strategically (only during animation)
- Throttle scroll-based animations to 16ms (~60fps)
- Respect prefers-reduced-motion

### 3. Rendering Optimization
- Memoize expensive computations with useMemo
- Use React.memo for pure components
- Implement useCallback for event handlers
- Debounce user input (500ms for search)
- Throttle frequent updates (16ms for scroll)

### 4. Virtualization
- Virtualize lists with >50 items
- Use fixed-size lists when possible
- Implement infinite scroll for large datasets
- Optimize grid layouts for metric cards

### 5. Lazy Loading
- Lazy load images with intersection observer
- Defer non-critical animations (100-200ms)
- Use idle callbacks for non-critical rendering
- Preload images on hover

## Performance Monitoring

```typescript
// Monitor component render time
import { useEffect } from 'react';

function MonitoredComponent() {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Render time: ${end - start}ms`);
    };
  });
  
  return <div>{/* Content */}</div>;
}
```

## Bundle Size Optimization

The vite.config.ts includes manual chunk splitting:
- `react-vendor`: React core libraries
- `query-vendor`: React Query
- `chart-vendor`: Recharts
- `animation-vendor`: Framer Motion
- `ui-vendor`: Radix UI components
- `gaza-dashboard`: Gaza dashboard components
- `westbank-dashboard`: West Bank dashboard components
- `analytics`: Analytics components

## Testing Performance

```bash
# Build for production
npm run build

# Analyze bundle size
npm run build -- --analyze

# Run Lighthouse audit
npm run lighthouse

# Check bundle size
npm run size
```

## Requirements Mapping

- **11.1**: Code splitting with lazy loading and retry logic
- **11.2**: GPU acceleration, will-change, and throttling
- **11.3**: Intersection observer-based lazy loading
- **11.4**: react-window virtualization for long lists
- **11.5**: React.memo, useMemo, and useCallback optimizations

## Related Documentation

- [Animation System](../animation/README.md)
- [Component Library](../../components/ui/README.md)
- [Design System](../../../.kiro/specs/modern-dashboard-redesign/design.md)
