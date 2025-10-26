# Micro-Interactions System

A comprehensive system for implementing subtle, responsive micro-interactions throughout the dashboard. This system provides button press animations, hover effects, focus rings, animated switches, and tooltips.

## Overview

The micro-interactions system consists of three main components:

1. **Interaction Feedback Utilities** - Button press, hover, and focus animations
2. **Animated Switch** - Toggle switches with spring physics
3. **Animated Tooltip** - Tooltips with directional fade + slide animations

All components respect the `prefers-reduced-motion` accessibility preference.

## Components

### Interaction Feedback Utilities

Located in `src/lib/animation/interaction-feedback.tsx`

#### InteractiveButton

Button component with press and hover animations.

```tsx
import { InteractiveButton } from '@/lib/animation';

<InteractiveButton
  variant="both" // 'press' | 'hover' | 'both'
  className="px-6 py-3 bg-primary text-primary-foreground rounded-md"
>
  Click Me
</InteractiveButton>
```

**Variants:**
- `both` - Both hover (scale 1.05) and press (scale 0.95) animations
- `hover` - Only hover animation
- `press` - Only press animation (with hover)

#### InteractiveElement

Generic interactive element for cards, links, etc.

```tsx
import { InteractiveElement } from '@/lib/animation';

<InteractiveElement
  variant="hover"
  as="div" // 'div' | 'span' | 'a'
  className="p-4 border rounded-lg cursor-pointer"
>
  <p>Hover over me</p>
</InteractiveElement>
```

#### FocusRing

Animated focus ring overlay for accessibility.

```tsx
import { FocusRing } from '@/lib/animation';

const [isFocused, setIsFocused] = useState(false);

<div className="relative">
  <button
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
  >
    Focus Me
  </button>
  <FocusRing isFocused={isFocused} />
</div>
```

#### useInteractionState Hook

Manages interaction states (hover, press, focus).

```tsx
import { useInteractionState } from '@/lib/animation';

const { isHovered, isPressed, isFocused, animationState, interactionProps } = 
  useInteractionState({
    onHoverStart: () => console.log('Hover started'),
    onPressStart: () => console.log('Press started'),
  });

<button {...interactionProps}>
  State: {animationState}
</button>
```

#### createInteractionVariants

Utility to create custom interaction variants.

```tsx
import { createInteractionVariants } from '@/lib/animation';
import { motion } from 'framer-motion';

const variants = createInteractionVariants({
  hoverScale: 1.1,
  pressScale: 0.9,
  hoverDuration: 200,
  pressDuration: 100,
});

<motion.button
  variants={variants}
  initial="rest"
  whileHover="hover"
  whileTap="press"
>
  Custom Animation
</motion.button>
```

### Animated Switch

Located in `src/components/ui/animated-switch.tsx`

Toggle switch with spring physics for smooth state transitions.

#### Basic Usage

```tsx
import { AnimatedSwitch } from '@/components/ui/animated-switch';

const [checked, setChecked] = useState(false);

<AnimatedSwitch
  checked={checked}
  onCheckedChange={setChecked}
  size="md" // 'sm' | 'md' | 'lg'
/>
```

#### With Label

```tsx
import { AnimatedSwitchWithLabel } from '@/components/ui/animated-switch';

<AnimatedSwitchWithLabel
  label="Enable notifications"
  description="Receive notifications about important updates"
  checked={checked}
  onCheckedChange={setChecked}
  labelPosition="right" // 'left' | 'right'
/>
```

#### Custom Spring Configuration

```tsx
<AnimatedSwitch
  checked={checked}
  onCheckedChange={setChecked}
  springConfig={{
    stiffness: 500,
    damping: 20,
    mass: 1,
  }}
/>
```

**Default Spring Config:**
- Stiffness: 400
- Damping: 30
- Mass: 1

#### useSwitchState Hook

Manages switch state with animation callbacks.

```tsx
import { useSwitchState } from '@/components/ui/animated-switch';

const { checked, isAnimating, onCheckedChange } = useSwitchState({
  defaultChecked: false,
  onCheckedChange: (checked) => console.log('Changed:', checked),
  onAnimationStart: () => console.log('Animation started'),
  onAnimationComplete: () => console.log('Animation complete'),
});
```

### Animated Tooltip

Located in `src/components/ui/animated-tooltip.tsx`

Tooltips with fade + slide animations from trigger direction.

#### Simple Tooltip

```tsx
import { SimpleAnimatedTooltip } from '@/components/ui/animated-tooltip';

<SimpleAnimatedTooltip
  content="This is a tooltip"
  side="top" // 'top' | 'right' | 'bottom' | 'left'
  delayDuration={200} // milliseconds
>
  <button>Hover me</button>
</SimpleAnimatedTooltip>
```

#### Info Tooltip

Tooltip with info icon trigger.

```tsx
import { InfoTooltip } from '@/components/ui/animated-tooltip';

<div className="flex items-center gap-2">
  <span>Feature name</span>
  <InfoTooltip
    content="Additional information about this feature"
    side="right"
  />
</div>
```

#### Metric Tooltip

Specialized tooltip for metric cards.

```tsx
import { MetricTooltip } from '@/components/ui/animated-tooltip';

<MetricTooltip
  title="Total Users"
  definition="The total number of registered users in the system"
  side="right"
>
  <div className="metric-card">
    <span className="value">12,345</span>
    <span className="label">users</span>
  </div>
</MetricTooltip>
```

#### Advanced Usage

```tsx
import {
  AnimatedTooltip,
  AnimatedTooltipTrigger,
  AnimatedTooltipContent,
  AnimatedTooltipProvider,
} from '@/components/ui/animated-tooltip';

<AnimatedTooltipProvider>
  <AnimatedTooltip delayDuration={200}>
    <AnimatedTooltipTrigger asChild>
      <button>Trigger</button>
    </AnimatedTooltipTrigger>
    <AnimatedTooltipContent side="top" showArrow={true}>
      <div className="custom-content">
        <p>Custom tooltip content</p>
      </div>
    </AnimatedTooltipContent>
  </AnimatedTooltip>
</AnimatedTooltipProvider>
```

#### useTooltipState Hook

Manages tooltip state with delay.

```tsx
import { useTooltipState } from '@/components/ui/animated-tooltip';

const { open, onOpenChange } = useTooltipState({
  defaultOpen: false,
  delayDuration: 200,
  onOpenChange: (open) => console.log('Tooltip:', open),
});
```

## Animation Specifications

### Button Press Animation
- **Hover Scale:** 1.05
- **Press Scale:** 0.95
- **Hover Duration:** 200ms
- **Press Duration:** 100ms
- **Easing:** ease-out (hover), ease-in (press)

### Focus Ring Animation
- **Scale:** 0.95 → 1.0
- **Opacity:** 0 → 1
- **Duration:** 200ms
- **Easing:** ease-out
- **Ring Width:** 2px

### Switch Animation
- **Spring Physics:**
  - Stiffness: 400
  - Damping: 30
  - Mass: 1
- **Background Transition:** 300ms
- **Handle Movement:** Spring-based

### Tooltip Animation
- **Fade:** 0 → 1 opacity
- **Slide:** 10px from trigger direction
- **Scale:** 0.95 → 1.0
- **Duration:** 200ms (show), 100ms (hide)
- **Delay:** 200ms (configurable)
- **Easing:** ease-out (show), ease-in (hide)

## Accessibility

All components respect accessibility preferences:

### Reduced Motion
When `prefers-reduced-motion: reduce` is detected:
- Animations are disabled
- Components render in their final state
- Transitions are instant

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Tab order is logical

### Screen Readers
- ARIA labels on all interactive elements
- Semantic HTML structure
- Proper role attributes

## Requirements Mapping

This implementation satisfies the following requirements:

### Requirement 7.1 - Button Press Animation
✅ Hover scale effect (1.05) with 200ms duration
✅ Press scale effect (0.95) with 100ms duration

### Requirement 7.2 - Hover Scale Effect
✅ Scale to 1.05 on hover
✅ Smooth transition with ease-out easing

### Requirement 7.3 - Focus Ring Animations
✅ Animated focus ring with 2px outline
✅ Scale and opacity transitions
✅ 150ms duration with ease-out easing

### Requirement 7.4 - Toggle Switch Animations
✅ Spring physics for switch handle
✅ Stiffness: 400, Damping: 30
✅ Smooth state transitions

### Requirement 7.5 - Tooltip Animations
✅ Fade + slide from trigger direction
✅ 200ms delay for hover tooltips
✅ Configurable delay duration

### Requirement 14.1 - Metric Tooltips
✅ Tooltip with metric definition
✅ 200ms hover delay
✅ Specialized MetricTooltip component

## Demo

View the complete demo at `src/components/ui/micro-interactions-demo.tsx`

To see the demo in action:

```tsx
import MicroInteractionsDemo from '@/components/ui/micro-interactions-demo';

<MicroInteractionsDemo />
```

## Best Practices

1. **Use InteractiveButton for all clickable buttons** - Provides consistent feedback
2. **Add FocusRing to custom interactive elements** - Improves accessibility
3. **Use AnimatedSwitch instead of standard Switch** - Better user experience
4. **Add tooltips to metric cards** - Helps users understand data
5. **Respect reduced motion** - All components handle this automatically
6. **Configure tooltip delays appropriately** - 200ms is good for most cases
7. **Use appropriate spring physics** - Default config works for most switches

## Performance

All animations are GPU-accelerated using CSS transforms:
- `scale` for size changes
- `translate` for position changes
- `opacity` for fade effects

This ensures smooth 60fps animations even on lower-end devices.

## Browser Support

- Modern browsers with CSS transforms support
- Framer Motion compatibility
- Radix UI primitives support
- Fallback to static UI for unsupported browsers
