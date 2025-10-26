# Mobile Optimization System

A comprehensive mobile-first component library for the Palestine Pulse dashboard redesign.

## Overview

This mobile optimization system provides touch-optimized components, gestures, layouts, and navigation patterns specifically designed for mobile and tablet devices.

## Features

### 1. Touch Gesture Support

#### Swipe Gestures
```tsx
import { Swipeable } from '@/components/ui/touch-gesture-wrapper';

<Swipeable
  onSwipeLeft={() => console.log('Swiped left')}
  onSwipeRight={() => console.log('Swiped right')}
  threshold={50}
>
  <div>Swipeable content</div>
</Swipeable>
```

#### Pinch-to-Zoom
```tsx
import { PinchableChart } from '@/components/ui/pinchable-chart';

<PinchableChart minScale={1} maxScale={3}>
  <YourChart />
</PinchableChart>
```

#### Pull-to-Refresh
```tsx
import { PullToRefreshWrapper } from '@/components/ui/touch-gesture-wrapper';

<PullToRefreshWrapper
  onRefresh={async () => {
    await fetchData();
  }}
  threshold={80}
>
  <div>Your content</div>
</PullToRefreshWrapper>
```

### 2. Touch Target Optimization

All interactive elements meet WCAG 2.1 guidelines with minimum 44x44px touch targets.

#### Touch Target Component
```tsx
import { TouchTarget, TouchTargetGroup } from '@/components/ui/touch-target';

<TouchTargetGroup spacing="sm" orientation="horizontal">
  <TouchTarget size="md" feedback="scale">
    <Icon />
  </TouchTarget>
  <TouchTarget size="md" feedback="scale">
    <Icon />
  </TouchTarget>
</TouchTargetGroup>
```

#### Enhanced Button Sizes
```tsx
import { Button } from '@/components/ui/button';

// Mobile-optimized sizes
<Button size="touch">Click me</Button>
<Button size="touchIcon"><Icon /></Button>
```

### 3. Mobile-Specific Layouts

#### Responsive Metric Grid
```tsx
import { MobileMetricGrid } from '@/components/ui/mobile-layout';

<MobileMetricGrid
  mobileColumns={1}
  tabletColumns={2}
  desktopColumns={3}
>
  <MetricCard />
  <MetricCard />
  <MetricCard />
</MobileMetricGrid>
```

#### Mobile Chart Container
```tsx
import { MobileChartContainer } from '@/components/ui/mobile-layout';

<MobileChartContainer
  mobileHeight={300}
  desktopHeight={400}
  simplifyOnMobile
>
  <Chart />
</MobileChartContainer>
```

#### Mobile Enhanced Chart
```tsx
import { MobileEnhancedChart } from '@/components/ui/mobile-enhanced-chart';

<MobileEnhancedChart
  title="Chart Title"
  mobileHeight={300}
  enablePinchZoom
>
  <Chart />
</MobileEnhancedChart>
```

### 4. Mobile Navigation

#### Mobile Menu Drawer
```tsx
import { MobileMenu } from '@/components/ui/mobile-menu';

const menuItems = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    icon: <HomeIcon />,
    onClick: () => navigate('/dashboard'),
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: <SettingsIcon />,
    children: [
      { label: 'Profile', value: 'profile', onClick: () => {} },
      { label: 'Preferences', value: 'preferences', onClick: () => {} },
    ],
  },
];

<MobileMenu
  items={menuItems}
  activeItem="dashboard"
  header={<Logo />}
  footer={<UserInfo />}
/>
```

#### Scrollable Tabs
```tsx
import { ScrollableTabs } from '@/components/ui/scrollable-tabs';

<ScrollableTabs
  tabs={[
    { value: 'tab1', label: 'Tab 1', icon: <Icon /> },
    { value: 'tab2', label: 'Tab 2', icon: <Icon /> },
  ]}
  activeTab="tab1"
  onTabChange={(tab) => setActiveTab(tab)}
  variant="pills"
/>
```

#### Unified Mobile Navigation
```tsx
import { MobileNavigation } from '@/components/ui/mobile-navigation';

<MobileNavigation
  tabs={navigationTabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="sub"
/>
```

## Utilities

### Touch Target Utilities
```tsx
import {
  getTouchTargetClasses,
  getPressFeedbackClasses,
  validateTouchTargetSize,
} from '@/lib/touch-target-utils';

// Get touch-optimized classes
const classes = getTouchTargetClasses('md', 'additional-class');

// Add press feedback
const feedbackClasses = getPressFeedbackClasses('scale');

// Validate touch target size
const isValid = validateTouchTargetSize(element);
```

### Mobile Chart Configuration
```tsx
import {
  useMobileChartConfig,
  formatMobileTick,
  getResponsiveChartProps,
} from '@/lib/mobile-chart-config';

// Get responsive chart config
const chartConfig = useMobileChartConfig();

// Format tick values for mobile
const formattedValue = formatMobileTick(1500000, true); // "1.5M"

// Get Recharts props
const chartProps = getResponsiveChartProps(isMobile);
```

## Breakpoint System

The mobile optimization system uses a consistent breakpoint system:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Wide**: > 1440px

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { isMobile, isTablet, isDesktop, isMobileOrTablet } = useBreakpoint();
```

## Best Practices

### 1. Touch Targets
- Minimum size: 44x44px
- Minimum spacing: 8px between targets
- Always provide press feedback (scale 0.95)

### 2. Charts on Mobile
- Reduce height to 300px
- Simplify axis labels
- Enable pinch-to-zoom for detailed views
- Use larger touch points for interactions

### 3. Navigation
- Use full-screen drawer for main navigation on mobile
- Use 2-column grid for sub-navigation tabs
- Enable horizontal scroll with snap for overflowing tabs
- Provide visual hints for scrollable content

### 4. Layouts
- Single column for metric cards on mobile
- Increase padding and spacing on larger screens
- Use responsive containers with proper max-widths
- Stack content vertically on mobile

### 5. Performance
- Use CSS transforms for animations (GPU-accelerated)
- Add `touch-manipulation` CSS property to prevent delays
- Debounce scroll and resize events
- Lazy load off-screen content

## Accessibility

All mobile components follow WCAG 2.1 Level AA guidelines:

- Minimum 44x44px touch targets
- Proper focus indicators
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Respects `prefers-reduced-motion`

## Examples

See the following files for complete examples:
- `src/components/ui/mobile-layout.tsx` - Layout examples
- `src/components/ui/mobile-navigation.tsx` - Navigation examples
- `src/components/ui/touch-gesture-wrapper.tsx` - Gesture examples

## Testing

Test mobile components on:
- iOS Safari (iPhone)
- Android Chrome
- Various screen sizes (320px - 768px)
- Touch and mouse interactions
- Landscape and portrait orientations

## Browser Support

- iOS Safari 12+
- Android Chrome 80+
- Modern mobile browsers with touch support
