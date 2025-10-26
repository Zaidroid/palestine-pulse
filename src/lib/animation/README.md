# Animation System

A comprehensive animation system built on Framer Motion with design tokens, reusable variants, and utility hooks.

## Overview

This animation system provides:
- **Design Tokens**: Centralized configuration for durations, easing, and spring physics
- **Variants Library**: Pre-built animation patterns for consistent motion design
- **Utility Hooks**: Custom hooks for common animation scenarios with accessibility support

## Quick Start

```tsx
import { 
  motion, 
  fadeInVariants, 
  useIntersectionAnimation,
  animationTokens 
} from '@/lib/animation';

function MyComponent() {
  const { ref, controls } = useIntersectionAnimation();
  
  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      initial={controls.initial}
      animate={controls.animate}
    >
      Content animates when scrolled into view
    </motion.div>
  );
}
```

## Animation Tokens

### Duration
```typescript
animationTokens.duration.instant   // 100ms
animationTokens.duration.fast      // 200ms
animationTokens.duration.normal    // 300ms
animationTokens.duration.slow      // 400ms
animationTokens.duration.slower    // 600ms
animationTokens.duration.slowest   // 1000ms
animationTokens.duration.counter   // 1500ms
animationTokens.duration.draw      // 1200ms
```

### Easing
```typescript
animationTokens.easing.linear
animationTokens.easing.ease
animationTokens.easing.easeIn
animationTokens.easing.easeOut
animationTokens.easing.easeInOut
animationTokens.easing.spring
```

### Spring Physics
```typescript
animationTokens.spring.gentle    // Soft, slow spring
animationTokens.spring.default   // Balanced spring
animationTokens.spring.snappy    // Quick, responsive spring
animationTokens.spring.bouncy    // Playful, bouncy spring
animationTokens.spring.navigation // Optimized for navigation
```

### Stagger Delays
```typescript
animationTokens.stagger.fast     // 50ms
animationTokens.stagger.normal   // 100ms
animationTokens.stagger.slow     // 150ms
```

## Animation Variants

### Fade Animations
```tsx
import { motion, fadeInVariants } from '@/lib/animation';

<motion.div variants={fadeInVariants} initial="hidden" animate="visible">
  Fades in smoothly
</motion.div>
```

### Slide Animations
```tsx
import { motion, slideUpVariants } from '@/lib/animation';

<motion.div variants={slideUpVariants} initial="hidden" animate="visible">
  Slides up while fading in
</motion.div>
```

Available slide variants:
- `slideUpVariants`
- `slideDownVariants`
- `slideLeftVariants`
- `slideRightVariants`

### Scale Animations
```tsx
import { motion, scaleInVariants } from '@/lib/animation';

<motion.div variants={scaleInVariants} initial="hidden" animate="visible">
  Scales up while fading in
</motion.div>
```

### Page Transitions
```tsx
import { motion, AnimatePresence, pageVariants } from '@/lib/animation';

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants.fade}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    Page content
  </motion.div>
</AnimatePresence>
```

Available page transition modes:
- `pageVariants.fade`
- `pageVariants.slide`
- `pageVariants.scale`

### Interaction Variants
```tsx
import { motion, pressScaleVariants } from '@/lib/animation';

<motion.button
  variants={pressScaleVariants}
  initial="rest"
  whileHover="hover"
  whileTap="press"
>
  Click me
</motion.button>
```

Available interaction variants:
- `hoverScaleVariants` - Simple hover scale
- `pressScaleVariants` - Hover + press feedback
- `cardHoverVariants` - Card elevation on hover

### Stagger Animations
```tsx
import { motion, staggerContainerVariants, staggerItemVariants } from '@/lib/animation';

<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

Available stagger containers:
- `staggerContainerVariants` - Normal stagger (100ms)
- `staggerFastContainerVariants` - Fast stagger (50ms)
- `staggerSlowContainerVariants` - Slow stagger (150ms)

### Loading Animations
```tsx
import { motion, pulseVariants, spinVariants } from '@/lib/animation';

<motion.div variants={pulseVariants} animate="pulse">
  Pulsing indicator
</motion.div>

<motion.div variants={spinVariants} animate="spin">
  Spinning loader
</motion.div>
```

### Chart Animations
```tsx
import { motion, chartLineVariants } from '@/lib/animation';

<motion.path
  variants={chartLineVariants}
  initial="hidden"
  animate="visible"
  d={linePath}
/>
```

Available chart variants:
- `chartLineVariants` - Line draw animation
- `chartBarVariants` - Bar height animation

### Drawer/Panel Animations
```tsx
import { motion, drawerVariants } from '@/lib/animation';

<motion.div
  variants={drawerVariants.right}
  initial="hidden"
  animate="visible"
>
  Drawer content
</motion.div>
```

Available drawer directions:
- `drawerVariants.left`
- `drawerVariants.right`
- `drawerVariants.top`
- `drawerVariants.bottom`

## Animation Hooks

### useReducedMotion
Respects user's motion preferences for accessibility.

```tsx
import { useReducedMotion } from '@/lib/animation';

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={prefersReducedMotion ? 'no-animation' : 'with-animation'}>
      Content
    </div>
  );
}
```

### useIntersectionAnimation
Triggers animations when element enters viewport.

```tsx
import { motion, useIntersectionAnimation, fadeInVariants } from '@/lib/animation';

function MyComponent() {
  const { ref, controls } = useIntersectionAnimation({
    threshold: 0.2,      // Trigger when 20% visible
    triggerOnce: true,   // Only animate once
  });
  
  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      initial={controls.initial}
      animate={controls.animate}
    >
      Animates when scrolled into view
    </motion.div>
  );
}
```

### useStaggerAnimation
Provides stagger configuration for child elements.

```tsx
import { motion, useStaggerAnimation } from '@/lib/animation';

function MyList({ items }) {
  const { containerVariants, itemVariants } = useStaggerAnimation(items.length, {
    staggerDelay: 100,
    delayChildren: 200,
  });
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.div key={item.id} variants={itemVariants}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### useAnimationConfig
Provides animation configuration with reduced motion support.

```tsx
import { useAnimationConfig } from '@/lib/animation';

function MyComponent() {
  const { shouldAnimate, duration, transition } = useAnimationConfig();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={transition({ duration: 0.3 })}
    >
      Content
    </motion.div>
  );
}
```

### useHoverAnimation
Manages hover state with animation support.

```tsx
import { motion, useHoverAnimation, hoverScaleVariants } from '@/lib/animation';

function MyButton() {
  const { hoverProps, animationState } = useHoverAnimation();
  
  return (
    <motion.button
      {...hoverProps}
      variants={hoverScaleVariants}
      animate={animationState}
    >
      Hover me
    </motion.button>
  );
}
```

### usePressAnimation
Manages press/tap state with animation support.

```tsx
import { motion, usePressAnimation, pressScaleVariants } from '@/lib/animation';

function MyButton() {
  const { pressProps, animationState } = usePressAnimation();
  
  return (
    <motion.button
      {...pressProps}
      variants={pressScaleVariants}
      animate={animationState}
    >
      Press me
    </motion.button>
  );
}
```

### useCountUp
Animates numbers with count-up effect.

```tsx
import { useCountUp } from '@/lib/animation';

function Counter() {
  const { formattedCount } = useCountUp({
    start: 0,
    end: 1000,
    duration: 2000,
    decimals: 0,
  });
  
  return <div>{formattedCount}</div>;
}
```

### useScrollProgress
Provides scroll progress for parallax effects.

```tsx
import { useScrollProgress } from '@/lib/animation';

function ParallaxElement() {
  const scrollProgress = useScrollProgress();
  
  return (
    <motion.div
      style={{
        y: scrollProgress * 100,
      }}
    >
      Moves with scroll
    </motion.div>
  );
}
```

### useDelayedAnimation
Delays animation start.

```tsx
import { motion, useDelayedAnimation, fadeInVariants } from '@/lib/animation';

function MyComponent() {
  const { isReady } = useDelayedAnimation(500);
  
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
    >
      Appears after 500ms
    </motion.div>
  );
}
```

## Accessibility

All animation utilities respect the `prefers-reduced-motion` media query:

- When reduced motion is preferred, animations are disabled or simplified
- Functional animations (loading, progress) are maintained
- Decorative animations are removed
- Content is immediately visible without animation delays

## Best Practices

1. **Use design tokens** for consistent timing and easing
2. **Respect reduced motion** preferences for accessibility
3. **Use intersection animations** for viewport-triggered effects
4. **Leverage stagger** for list animations
5. **Keep animations subtle** - less is more
6. **Test performance** - maintain 60fps
7. **Use GPU-accelerated properties** (transform, opacity)
8. **Avoid animating layout properties** (width, height, top, left)

## Performance Tips

- Use `transform` and `opacity` for best performance
- Add `will-change` for complex animations (sparingly)
- Use `AnimatePresence` for exit animations
- Implement intersection observer for off-screen elements
- Debounce rapid animations
- Use `layoutId` for shared element transitions

## Examples

### Animated Metric Card
```tsx
import { motion, useIntersectionAnimation, slideUpVariants } from '@/lib/animation';

function MetricCard({ title, value }) {
  const { ref, controls } = useIntersectionAnimation();
  
  return (
    <motion.div
      ref={ref}
      variants={slideUpVariants}
      initial={controls.initial}
      animate={controls.animate}
      whileHover={{ scale: 1.03 }}
      className="card"
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </motion.div>
  );
}
```

### Staggered Grid
```tsx
import { motion, useStaggerAnimation } from '@/lib/animation';

function MetricGrid({ metrics }) {
  const { containerVariants, itemVariants } = useStaggerAnimation(metrics.length);
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid"
    >
      {metrics.map(metric => (
        <motion.div key={metric.id} variants={itemVariants}>
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Animated Counter
```tsx
import { useCountUp } from '@/lib/animation';

function AnimatedCounter({ value }) {
  const { formattedCount } = useCountUp({
    end: value,
    duration: 1500,
    decimals: 0,
  });
  
  return <span className="counter">{formattedCount}</span>;
}
```

## Migration Guide

To migrate existing components to use the animation system:

1. Import animation utilities:
   ```tsx
   import { motion, fadeInVariants } from '@/lib/animation';
   ```

2. Replace `div` with `motion.div`:
   ```tsx
   <motion.div variants={fadeInVariants} initial="hidden" animate="visible">
   ```

3. Add intersection observer for viewport animations:
   ```tsx
   const { ref, controls } = useIntersectionAnimation();
   <motion.div ref={ref} {...controls}>
   ```

4. Use design tokens for custom animations:
   ```tsx
   transition={{ duration: animationTokens.duration.normal / 1000 }}
   ```
