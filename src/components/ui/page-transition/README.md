# Page Transition System

A comprehensive page transition system with smooth animations, intelligent route preloading, and automatic scroll restoration.

## Features

### 🎬 Smooth Transitions
- **Multiple transition modes**: fade, slide, and scale
- **Loading states**: Automatic skeleton display for slow transitions (>500ms)
- **Reduced motion support**: Respects user accessibility preferences
- **Optimized variants**: Separate components for pages, tabs, and sections

### ⚡ Intelligent Preloading
- **Hover-based preloading**: Routes load on hover for instant navigation
- **Data prefetching**: Optional data fetching before navigation
- **Smart caching**: Prevents duplicate preloads
- **Automatic preloading**: Intelligently preloads likely next routes

### 📜 Scroll Restoration
- **Automatic saving**: Scroll position saved on navigation
- **Smart restoration**: Restores position on back/forward navigation
- **Session persistence**: Survives page reloads via sessionStorage
- **Container support**: Works with scrollable containers within pages

## Components

### PageTransition

Main component for page-level transitions with loading states.

```tsx
import { PageTransition } from '@/components/ui/page-transition';

<PageTransition 
  mode="fade" 
  pageKey={currentRoute}
  loadingThreshold={500}
>
  <YourPageContent />
</PageTransition>
```

**Props:**
- `mode`: `'fade' | 'slide' | 'scale'` - Transition animation type
- `pageKey`: `string` - Unique key that triggers transition when changed
- `duration`: `number` - Custom transition duration in ms
- `loadingThreshold`: `number` - Show loading skeleton after this delay (default: 500ms)
- `loadingComponent`: `ReactNode` - Custom loading component
- `onTransitionComplete`: `() => void` - Callback when transition finishes

### TabTransition

Optimized for tab content with faster cross-fade animation.

```tsx
import { TabTransition } from '@/components/ui/page-transition';

<TabTransition tabKey={activeTab}>
  <TabContent />
</TabTransition>
```

**Props:**
- `tabKey`: `string` - Unique key for the active tab
- `className`: `string` - Additional CSS classes
- `onTransitionComplete`: `() => void` - Callback when transition finishes

### SectionTransition

Minimal transitions for sections within a page.

```tsx
import { SectionTransition } from '@/components/ui/page-transition';

<SectionTransition sectionKey={currentSection}>
  <SectionContent />
</SectionTransition>
```

**Props:**
- `sectionKey`: `string` - Unique key for the section
- `className`: `string` - Additional CSS classes

## Hooks

### useRoutePreload

Enables hover-based route preloading for instant navigation.

```tsx
import { useRoutePreload } from '@/hooks/useRoutePreload';

const preloadProps = useRoutePreload({
  path: '/dashboard',
  prefetchData: async () => {
    await fetchDashboardData();
  },
  delay: 100,
});

<Link to="/dashboard" {...preloadProps}>
  Dashboard
</Link>
```

**Options:**
- `path`: `string` - Route path to preload
- `prefetchData`: `() => Promise<void>` - Optional data fetching function
- `delay`: `number` - Delay before starting preload (default: 100ms)

**Returns:**
Event handlers to spread on link/button:
- `onMouseEnter`
- `onMouseLeave`
- `onFocus`
- `onBlur`

### useRoutePreloadMultiple

Preload multiple routes at once.

```tsx
import { useRoutePreloadMultiple } from '@/hooks/useRoutePreload';

useRoutePreloadMultiple([
  { path: '/gaza', prefetchData: fetchGazaData },
  { path: '/west-bank', prefetchData: fetchWestBankData },
]);
```

### useIntelligentPreload

Automatically preloads likely next routes based on current location.

```tsx
import { useIntelligentPreload } from '@/hooks/useRoutePreload';

function App() {
  useIntelligentPreload();
  return <Routes>...</Routes>;
}
```

### useScrollRestoration

Automatic scroll position management.

```tsx
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

function App() {
  useScrollRestoration({
    smooth: false,
    saveDelay: 100,
  });
  return <Routes>...</Routes>;
}
```

**Options:**
- `smooth`: `boolean` - Use smooth scrolling when restoring (default: false)
- `manual`: `boolean` - Disable automatic restoration (default: false)
- `saveDelay`: `number` - Debounce delay for saving (default: 100ms)

**Returns:**
Manual control functions:
- `save()` - Manually save current scroll position
- `restore(path?)` - Manually restore scroll position
- `clear()` - Clear all saved positions

### useContainerScrollRestoration

Scroll restoration for scrollable containers within a page.

```tsx
import { useContainerScrollRestoration } from '@/hooks/useScrollRestoration';

const { ref, save, restore } = useContainerScrollRestoration('my-section');

<div ref={ref} className="overflow-auto h-96">
  {content}
</div>
```

## Utilities

### manualPreloadRoute

Programmatically preload a route.

```tsx
import { manualPreloadRoute } from '@/hooks/useRoutePreload';

await manualPreloadRoute('/dashboard', async () => {
  await fetchDashboardData();
});
```

### scrollToTop

Scroll to top of page.

```tsx
import { scrollToTop } from '@/hooks/useScrollRestoration';

scrollToTop(true); // smooth scroll
```

### scrollToElement

Scroll to a specific element.

```tsx
import { scrollToElement } from '@/hooks/useScrollRestoration';

scrollToElement('#section-id', {
  behavior: 'smooth',
  block: 'start',
  offset: 80, // Account for fixed header
});
```

### clearScrollPositions

Clear all saved scroll positions.

```tsx
import { clearScrollPositions } from '@/hooks/useScrollRestoration';

clearScrollPositions();
```

## Complete Example

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  PageTransition, 
  useRoutePreload, 
  useScrollRestoration,
  useIntelligentPreload,
} from '@/components/ui/page-transition';

function App() {
  // Enable scroll restoration
  useScrollRestoration();
  
  // Enable intelligent preloading
  useIntelligentPreload();
  
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function Navigation() {
  const dashboardPreload = useRoutePreload({
    path: '/dashboard',
    prefetchData: fetchDashboardData,
  });
  
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard" {...dashboardPreload}>
        Dashboard
      </Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <PageTransition mode="fade" pageKey="dashboard">
      <div>
        <h1>Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabTransition tabKey={activeTab}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </TabTransition>
        </Tabs>
      </div>
    </PageTransition>
  );
}
```

## Transition Modes

### Fade
Simple opacity transition. Best for minimal, clean transitions.

```tsx
<PageTransition mode="fade" pageKey={key}>
  {content}
</PageTransition>
```

### Slide
Fade + vertical slide. Good for hierarchical navigation.

```tsx
<PageTransition mode="slide" pageKey={key}>
  {content}
</PageTransition>
```

### Scale
Fade + scale. Creates depth perception, good for modal-like transitions.

```tsx
<PageTransition mode="scale" pageKey={key}>
  {content}
</PageTransition>
```

## Performance Considerations

### Route Preloading
- Routes are cached after first preload
- Preloading starts after hover delay (default 100ms)
- Failed preloads are retried on next hover
- Data cache prevents duplicate fetches

### Scroll Restoration
- Scroll positions saved with debouncing (default 100ms)
- Positions expire after 5 minutes
- Uses sessionStorage for persistence
- In-memory cache for fast access

### Animations
- Respects `prefers-reduced-motion`
- Uses GPU-accelerated transforms
- Minimal layout shifts
- Optimized for 60fps

## Accessibility

- **Reduced Motion**: All animations disabled when user prefers reduced motion
- **Keyboard Navigation**: Preloading works with keyboard focus
- **Screen Readers**: Transitions don't interfere with screen reader announcements
- **Focus Management**: Focus is maintained during transitions

## Browser Support

- Modern browsers with ES6+ support
- Framer Motion compatibility
- sessionStorage support for scroll restoration
- Intersection Observer for intelligent preloading

## Requirements Satisfied

This implementation satisfies the following requirements from the design document:

- **6.1**: Page transitions with fade, slide, and scale variants
- **6.2**: Smooth fade out (300ms) and fade in + slide up (300ms) animations
- **6.3**: Cross-fade for sub-tabs (400ms)
- **6.4**: Loading skeleton for transitions > 500ms, route preloading
- **6.5**: Scroll position maintenance for back navigation

## Demo

See `PageTransitionDemo.tsx` for a complete interactive demonstration of all features.

```tsx
import { PageTransitionDemo } from '@/components/ui/page-transition/PageTransitionDemo';

<PageTransitionDemo />
```
