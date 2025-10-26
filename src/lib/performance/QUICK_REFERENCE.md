# Performance Utilities - Quick Reference

## Import

```typescript
import {
  // Code Splitting
  lazyWithRetry,
  lazyNamed,
  preloadComponent,
  
  // Animation Performance
  getGPUAcceleratedStyles,
  useWillChange,
  throttle,
  debounce,
  useThrottledScroll,
  
  // Rendering Optimization
  useMemoizedValue,
  useMemoizedCallback,
  useDebouncedValue,
  withShallowMemo,
  
  // Virtualization
  VirtualList,
  VirtualGrid,
  VirtualMetricGrid,
  
  // Lazy Loading
  LazyImage,
  LazyComponent,
  useLazyLoad,
  useDeferredAnimation,
} from '@/lib/performance';
```

## Common Patterns

### 1. Lazy Load Route
```typescript
const Dashboard = lazyWithRetry(() => import('./Dashboard'));
```

### 2. GPU Accelerate Animation
```typescript
<div style={getGPUAcceleratedStyles(['transform'])}>
  {/* Animated content */}
</div>
```

### 3. Memoize Component
```typescript
const MemoCard = withShallowMemo(Card);
```

### 4. Virtualize Long List
```typescript
<VirtualList
  items={data}
  height={600}
  itemHeight={80}
  renderItem={(item, index, style) => (
    <div style={style}><Item {...item} /></div>
  )}
/>
```

### 5. Lazy Load Image
```typescript
<LazyImage
  src="/image.jpg"
  alt="Description"
  placeholder="/placeholder.jpg"
/>
```

### 6. Throttle Scroll Handler
```typescript
useThrottledScroll((event) => {
  // Handle scroll
}, 16); // ~60fps
```

### 7. Debounce Search Input
```typescript
const debouncedSearch = useDebouncedValue(searchTerm, 500);
```

### 8. Defer Animation
```typescript
const shouldAnimate = useDeferredAnimation(200);
```

## Performance Checklist

- [ ] Routes split into separate chunks
- [ ] Heavy components lazy loaded
- [ ] GPU acceleration applied to animations
- [ ] Scroll handlers throttled to 16ms
- [ ] Expensive computations memoized
- [ ] Pure components wrapped with React.memo
- [ ] Lists >50 items virtualized
- [ ] Images lazy loaded
- [ ] Non-critical animations deferred
- [ ] Reduced motion respected

## Metrics to Monitor

- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Frame rate: 60fps during animations
- Bundle size: Monitor chunk sizes
- Memory usage: Check for leaks

## CSS Classes

```tsx
<div className="gpu-accelerated">GPU acceleration</div>
<div className="will-change-transform">Transform optimization</div>
<div className="smooth-scroll">Smooth scrolling</div>
<div className="optimize-rendering">Rendering optimization</div>
```

## When to Use What

| Scenario | Solution |
|----------|----------|
| Large route component | `lazyWithRetry()` |
| Smooth animation | `getGPUAcceleratedStyles()` |
| Scroll handler | `useThrottledScroll()` |
| Search input | `useDebouncedValue()` |
| Expensive computation | `useMemoizedValue()` |
| Pure component | `withShallowMemo()` |
| Long list (>50 items) | `VirtualList` |
| Image below fold | `LazyImage` |
| Non-critical content | `LazyComponent` |
| Startup animation | `useDeferredAnimation()` |

## Common Mistakes to Avoid

❌ Don't use will-change on all elements
✅ Apply will-change only during animation

❌ Don't memoize everything
✅ Memoize expensive computations only

❌ Don't virtualize small lists
✅ Virtualize lists with >50 items

❌ Don't lazy load above-the-fold images
✅ Lazy load images below the fold

❌ Don't throttle to 0ms
✅ Throttle to 16ms for 60fps

## Resources

- [Full Documentation](./README.md)
- [Animation System](../animation/README.md)
- [Vite Config](../../../vite.config.ts)
