# Micro-Interactions Integration Guide

This guide shows how to integrate the micro-interactions system into existing components.

## Quick Start

### 1. Import Components

```tsx
// Interaction feedback
import { InteractiveButton, InteractiveElement, FocusRing } from '@/lib/animation';

// Animated switch
import { AnimatedSwitch, AnimatedSwitchWithLabel } from '@/components/ui/animated-switch';

// Animated tooltip
import { 
  SimpleAnimatedTooltip, 
  InfoTooltip, 
  MetricTooltip 
} from '@/components/ui/animated-tooltip';
```

### 2. Replace Existing Components

#### Buttons
Replace standard buttons with InteractiveButton:

**Before:**
```tsx
<button className="px-6 py-3 bg-primary text-primary-foreground rounded-md">
  Click Me
</button>
```

**After:**
```tsx
<InteractiveButton
  variant="both"
  className="px-6 py-3 bg-primary text-primary-foreground rounded-md"
>
  Click Me
</InteractiveButton>
```

#### Switches
Replace standard Switch with AnimatedSwitch:

**Before:**
```tsx
import { Switch } from '@/components/ui/switch';

<Switch checked={checked} onCheckedChange={setChecked} />
```

**After:**
```tsx
import { AnimatedSwitch } from '@/components/ui/animated-switch';

<AnimatedSwitch checked={checked} onCheckedChange={setChecked} />
```

#### Tooltips
Replace standard Tooltip with AnimatedTooltip:

**Before:**
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

**After:**
```tsx
import { SimpleAnimatedTooltip } from '@/components/ui/animated-tooltip';

<SimpleAnimatedTooltip content="Tooltip text" side="top">
  <button>Hover me</button>
</SimpleAnimatedTooltip>
```

## Integration Examples

### Metric Cards

Add tooltips and interactive elements to metric cards:

```tsx
import { MetricTooltip } from '@/components/ui/animated-tooltip';
import { InteractiveElement } from '@/lib/animation';

<InteractiveElement
  variant="hover"
  className="p-6 border rounded-lg bg-card"
>
  <MetricTooltip
    title="Total Casualties"
    definition="The total number of casualties including deaths and injuries"
    side="top"
  >
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Total Casualties
      </h3>
      <p className="text-3xl font-bold">12,345</p>
    </div>
  </MetricTooltip>
</InteractiveElement>
```

### Navigation Items

Add interaction feedback to navigation:

```tsx
import { InteractiveButton } from '@/lib/animation';

<nav className="flex gap-2">
  <InteractiveButton
    variant="both"
    className="px-4 py-2 rounded-md hover:bg-accent"
  >
    Gaza
  </InteractiveButton>
  <InteractiveButton
    variant="both"
    className="px-4 py-2 rounded-md hover:bg-accent"
  >
    West Bank
  </InteractiveButton>
</nav>
```

### Settings Panel

Add animated switches to settings:

```tsx
import { AnimatedSwitchWithLabel } from '@/components/ui/animated-switch';

<div className="space-y-4">
  <AnimatedSwitchWithLabel
    label="Dark Mode"
    description="Switch between light and dark themes"
    checked={darkMode}
    onCheckedChange={setDarkMode}
  />
  
  <AnimatedSwitchWithLabel
    label="Auto-refresh"
    description="Automatically refresh data every 5 minutes"
    checked={autoRefresh}
    onCheckedChange={setAutoRefresh}
  />
</div>
```

### Info Icons

Add info tooltips next to labels:

```tsx
import { InfoTooltip } from '@/components/ui/animated-tooltip';

<div className="flex items-center gap-2">
  <label className="text-sm font-medium">Data Quality</label>
  <InfoTooltip
    content="Data quality is determined by source reliability, freshness, and completeness"
    side="right"
  />
</div>
```

### Interactive Cards

Make cards interactive with hover effects:

```tsx
import { InteractiveElement } from '@/lib/animation';

<InteractiveElement
  variant="hover"
  className="p-6 border rounded-lg bg-card cursor-pointer"
  onClick={() => handleCardClick()}
>
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card description</p>
</InteractiveElement>
```

### Custom Focus Indicators

Add focus rings to custom controls:

```tsx
import { FocusRing, useInteractionState } from '@/lib/animation';

const CustomControl = () => {
  const { isFocused, interactionProps } = useInteractionState();
  
  return (
    <div className="relative">
      <button
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        {...interactionProps}
      >
        Custom Control
      </button>
      <FocusRing isFocused={isFocused} />
    </div>
  );
};
```

## Component-Specific Integration

### EnhancedMetricCard

Add tooltips and interaction feedback:

```tsx
import { MetricTooltip } from '@/components/ui/animated-tooltip';
import { InteractiveElement } from '@/lib/animation';

export const EnhancedMetricCard = ({ title, value, definition, ...props }) => {
  return (
    <InteractiveElement
      variant="hover"
      className="p-6 border rounded-lg bg-card"
    >
      <MetricTooltip
        title={title}
        definition={definition}
        side="top"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </MetricTooltip>
    </InteractiveElement>
  );
};
```

### Navigation Tabs

Add interactive buttons to tabs:

```tsx
import { InteractiveButton } from '@/lib/animation';

export const NavigationTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <InteractiveButton
          key={tab.value}
          variant="both"
          className={cn(
            "px-4 py-2 rounded-md transition-colors",
            activeTab === tab.value
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </InteractiveButton>
      ))}
    </div>
  );
};
```

### Theme Toggle

Replace switch with animated version:

```tsx
import { AnimatedSwitch } from '@/components/ui/animated-switch';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <AnimatedSwitch
        checked={isDark}
        onCheckedChange={setIsDark}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};
```

### Data Source Badge

Add tooltip to data source badge:

```tsx
import { SimpleAnimatedTooltip } from '@/components/ui/animated-tooltip';

export const DataSourceBadge = ({ source, quality, lastUpdate }) => {
  return (
    <SimpleAnimatedTooltip
      content={
        <div className="space-y-1">
          <p className="font-semibold">{source.name}</p>
          <p className="text-xs">Quality: {quality}</p>
          <p className="text-xs">Updated: {lastUpdate}</p>
        </div>
      }
      side="top"
    >
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs">
        <span>{source.name}</span>
      </div>
    </SimpleAnimatedTooltip>
  );
};
```

## Best Practices

### 1. Use Appropriate Variants

- **Buttons:** Use `variant="both"` for primary actions
- **Cards:** Use `variant="hover"` for clickable cards
- **Links:** Use `variant="hover"` for subtle feedback

### 2. Configure Delays Appropriately

- **Quick actions:** 0-100ms delay
- **Informational tooltips:** 200ms delay (default)
- **Detailed explanations:** 300-500ms delay

### 3. Add Focus Indicators

Always add focus rings to custom interactive elements:

```tsx
<div className="relative">
  <CustomElement {...interactionProps} />
  <FocusRing isFocused={isFocused} />
</div>
```

### 4. Respect Reduced Motion

All components automatically respect `prefers-reduced-motion`. No additional configuration needed.

### 5. Use Semantic HTML

Maintain semantic HTML structure:

```tsx
// Good
<InteractiveButton as="button" type="submit">
  Submit
</InteractiveButton>

// Avoid
<InteractiveElement as="div" onClick={handleSubmit}>
  Submit
</InteractiveElement>
```

## Migration Checklist

- [ ] Replace all Button components with InteractiveButton
- [ ] Replace all Switch components with AnimatedSwitch
- [ ] Replace all Tooltip components with AnimatedTooltip
- [ ] Add MetricTooltip to all metric cards
- [ ] Add InfoTooltip to complex features
- [ ] Add FocusRing to custom controls
- [ ] Add InteractiveElement to clickable cards
- [ ] Test keyboard navigation
- [ ] Test with reduced motion enabled
- [ ] Verify accessibility with screen reader

## Testing

After integration, test:

1. **Visual appearance** - All animations look smooth
2. **Interaction states** - Hover, press, focus work correctly
3. **Keyboard navigation** - Tab order is logical
4. **Reduced motion** - Animations disabled when preferred
5. **Accessibility** - Screen reader announces correctly
6. **Performance** - 60fps maintained during animations

## Troubleshooting

### Animations not working

Check that Framer Motion is installed:
```bash
npm install framer-motion
```

### TypeScript errors

Ensure types are imported:
```tsx
import type { InteractiveButtonProps } from '@/lib/animation';
```

### Focus ring not visible

Ensure parent has `position: relative`:
```tsx
<div className="relative">
  <button {...props} />
  <FocusRing isFocused={isFocused} />
</div>
```

### Tooltip not showing

Wrap with TooltipProvider:
```tsx
import { AnimatedTooltipProvider } from '@/components/ui/animated-tooltip';

<AnimatedTooltipProvider>
  <SimpleAnimatedTooltip content="Text">
    <button>Trigger</button>
  </SimpleAnimatedTooltip>
</AnimatedTooltipProvider>
```

## Support

For issues or questions:
1. Check the README: `src/lib/animation/micro-interactions/README.md`
2. View the demo: `src/components/ui/micro-interactions-demo.tsx`
3. Review implementation: Task 10 summary document
