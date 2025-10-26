# Enhanced Navigation System Demo

## Overview
This document demonstrates the enhanced navigation system with animations and breadcrumbs.

## Components

### 1. PillTabs Component

The enhanced PillTabs component supports both main navigation and sub-navigation with smooth animations.

#### Main Navigation Example
```tsx
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { AlertCircle, Building2 } from "lucide-react";

const navLinks = [
  {
    path: "/gaza",
    value: "gaza",
    label: "Gaza",
    icon: AlertCircle,
  },
  {
    path: "/west-bank",
    value: "west-bank",
    label: "West Bank",
    icon: Building2,
  },
];

<PillTabs
  tabs={navLinks}
  activeTab="gaza"
  onTabChange={handleTabChange}
  variant="main"
/>
```

#### Sub-Navigation Example with Badges
```tsx
const subTabs = [
  {
    value: "humanitarian",
    label: "Humanitarian Crisis",
    icon: AlertCircle,
    color: "text-destructive",
    badge: 5, // Shows pulsing badge with count
  },
  {
    value: "infrastructure",
    label: "Infrastructure",
    icon: Building2,
    color: "text-warning",
  },
];

<PillTabs
  tabs={subTabs}
  activeTab="humanitarian"
  onTabChange={setActiveSubTab}
  variant="sub"
/>
```

#### Mobile Layout
```tsx
<PillTabs
  tabs={subTabs}
  activeTab={activeSubTab}
  onTabChange={setActiveSubTab}
  isMobile={true}
  variant="sub"
/>
```

### 2. Breadcrumbs Component

The Breadcrumbs component provides contextual navigation with animated transitions.

#### Basic Usage
```tsx
import { Breadcrumbs, BreadcrumbItem } from "@/components/v3/shared/Breadcrumbs";
import { Home, AlertCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Gaza", href: "/gaza" },
  { label: "Humanitarian Crisis", icon: AlertCircle }
];

<Breadcrumbs items={breadcrumbs} />
```

#### Dynamic Breadcrumbs
```tsx
const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
  const activeSubTabData = subTabs.find(tab => tab.value === activeSubTab);
  return [
    { label: "Home", href: "/", icon: Home },
    { label: "Gaza", href: "/gaza" },
    { label: activeSubTabData?.label || "Dashboard", icon: activeSubTabData?.icon }
  ];
}, [activeSubTab]);

<Breadcrumbs items={breadcrumbs} className="px-4" />
```

## Animation Features

### PillTabs Animations

1. **Active Indicator Animation**
   - Spring physics (stiffness: 350, damping: 35)
   - Smooth transition between tabs
   - Shared layout animation using Framer Motion's layoutId

2. **Hover Effects**
   - Scale: 1.05x
   - Duration: 200ms
   - Easing: easeOut

3. **Press Effects**
   - Scale: 0.95x
   - Duration: 100ms
   - Easing: easeIn

4. **Icon Rotation**
   - 360° rotation on tab activation
   - Duration: 400ms
   - Easing: easeOut

5. **Badge Pulse**
   - Scale: 1.0 → 1.1 → 1.0
   - Duration: 1500ms
   - Infinite loop
   - Only visible when badge count > 0

### Breadcrumbs Animations

1. **Container Fade-in**
   - Staggered children animation
   - Delay: 50ms between items

2. **Item Animation**
   - Fade in + slide from left
   - Initial: opacity 0, x: -10
   - Final: opacity 1, x: 0
   - Duration: 300ms

3. **Hover Effects**
   - Scale: 1.05x
   - Duration: 200ms
   - Background highlight

## Accessibility

### Reduced Motion Support
All animations respect the `prefers-reduced-motion` media query:
- Animations are disabled when user preference is set
- Instant transitions for accessibility
- Functional animations maintained (loading, progress)

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper focus management
- Tab order follows visual hierarchy

### Screen Reader Support
- ARIA labels on breadcrumb navigation
- `aria-current="page"` on active breadcrumb
- Semantic HTML structure

## Responsive Behavior

### Mobile (< 768px)
- Sub-navigation uses 2-column grid layout
- Vertical icon-label orientation
- Full-width tabs
- Larger touch targets (44x44px minimum)

### Tablet (768px - 1024px)
- Horizontal tab layout
- Compact spacing
- Optimized for touch

### Desktop (> 1024px)
- Horizontal tab layout
- Hover effects enabled
- Optimal spacing for mouse interaction

## Integration Examples

### Complete Dashboard Integration
```tsx
import { useState, useMemo } from "react";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { Breadcrumbs, BreadcrumbItem } from "@/components/v3/shared/Breadcrumbs";
import { AlertCircle, Building2, Users, Home } from "lucide-react";

export const Dashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState("humanitarian");

  const subTabs = [
    {
      value: "humanitarian",
      label: "Humanitarian Crisis",
      icon: AlertCircle,
      color: "text-destructive",
      badge: 3,
    },
    {
      value: "infrastructure",
      label: "Infrastructure",
      icon: Building2,
      color: "text-warning",
    },
    {
      value: "population",
      label: "Population Impact",
      icon: Users,
      color: "text-primary",
    },
  ];

  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const activeSubTabData = subTabs.find(tab => tab.value === activeSubTab);
    return [
      { label: "Home", href: "/", icon: Home },
      { label: "Gaza", href: "/gaza" },
      { label: activeSubTabData?.label || "Dashboard", icon: activeSubTabData?.icon }
    ];
  }, [activeSubTab]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} className="px-4" />

      {/* Page Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of key metrics</p>
      </div>

      {/* Sub-Navigation */}
      <div className="flex justify-center">
        <PillTabs
          tabs={subTabs}
          activeTab={activeSubTab}
          onTabChange={setActiveSubTab}
          variant="sub"
        />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Your dashboard content here */}
      </div>
    </div>
  );
};
```

## Performance Considerations

1. **GPU Acceleration**
   - All animations use CSS transforms
   - Hardware-accelerated rendering
   - Smooth 60fps animations

2. **Efficient Re-renders**
   - useMemo for breadcrumb generation
   - Proper key management for animations
   - Optimized Framer Motion usage

3. **Bundle Size**
   - Tree-shaking friendly
   - Minimal dependencies
   - Efficient animation library usage

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch optimizations

## Testing Checklist

- [ ] Verify spring animation on tab switching
- [ ] Test hover effects on all navigation elements
- [ ] Confirm badge pulse animation
- [ ] Check icon rotation on tab change
- [ ] Test breadcrumb stagger animation
- [ ] Verify mobile 2-column layout
- [ ] Test reduced motion preference
- [ ] Verify keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Check touch target sizes on mobile
- [ ] Verify cross-browser compatibility

## Future Enhancements

1. Navigation preloading on hover
2. Keyboard shortcuts for navigation
3. Navigation state persistence
4. Analytics tracking
5. Custom animation presets
6. Theme-aware animations
