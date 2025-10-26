# Page Transition System - Integration Guide

## Quick Start

### Step 1: Enable Scroll Restoration

Add to your root App component:

```tsx
// src/App.tsx
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

function App() {
  // Enable automatic scroll restoration
  useScrollRestoration();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* your routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 2: Add Page Transitions

Wrap your route content with PageTransition:

```tsx
// src/pages/v3/GazaWarDashboard.tsx
import { PageTransition } from '@/components/ui/page-transition';
import { useLocation } from 'react-router-dom';

export default function GazaWarDashboard() {
  const location = useLocation();
  
  return (
    <PageTransition mode="fade" pageKey={location.pathname}>
      {/* Your dashboard content */}
    </PageTransition>
  );
}
```

### Step 3: Add Tab Transitions

For tab content within pages:

```tsx
import { TabTransition } from '@/components/ui/page-transition';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('humanitarian');
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="humanitarian">Humanitarian</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>
        
        <TabTransition tabKey={activeTab}>
          {activeTab === 'humanitarian' && <HumanitarianTab />}
          {activeTab === 'infrastructure' && <InfrastructureTab />}
        </TabTransition>
      </Tabs>
    </div>
  );
}
```

### Step 4: Add Route Preloading

Add to navigation links:

```tsx
// src/components/v3/layout/RootLayout.tsx
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { Link } from 'react-router-dom';

function Navigation() {
  const gazaPreload = useRoutePreload({ path: '/gaza' });
  const westBankPreload = useRoutePreload({ path: '/west-bank' });
  
  return (
    <nav>
      <Link to="/gaza" {...gazaPreload}>
        Gaza Dashboard
      </Link>
      <Link to="/west-bank" {...westBankPreload}>
        West Bank Dashboard
      </Link>
    </nav>
  );
}
```

## Integration with Existing Components

### Gaza Dashboard (Task 19.4)

```tsx
// src/pages/v3/GazaWarDashboard.tsx
import { useState } from 'react';
import { PageTransition, TabTransition } from '@/components/ui/page-transition';
import { useLocation } from 'react-router-dom';

export default function GazaWarDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('humanitarian');
  
  return (
    <PageTransition 
      mode="fade" 
      pageKey={location.pathname}
      loadingThreshold={500}
    >
      <div className="space-y-6">
        <header>
          <h1>Gaza War Dashboard</h1>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="humanitarian">Humanitarian Crisis</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="population">Population Impact</TabsTrigger>
            <TabsTrigger value="aid">Aid & Survival</TabsTrigger>
          </TabsList>
          
          <TabTransition tabKey={activeTab}>
            {activeTab === 'humanitarian' && <HumanitarianCrisis />}
            {activeTab === 'infrastructure' && <InfrastructureDestruction />}
            {activeTab === 'population' && <PopulationImpact />}
            {activeTab === 'aid' && <AidSurvival />}
          </TabTransition>
        </Tabs>
      </div>
    </PageTransition>
  );
}
```

### West Bank Dashboard (Task 20.4)

```tsx
// src/pages/v3/WestBankDashboard.tsx
import { useState } from 'react';
import { PageTransition, TabTransition } from '@/components/ui/page-transition';
import { useLocation } from 'react-router-dom';

export default function WestBankDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('occupation');
  
  return (
    <PageTransition 
      mode="fade" 
      pageKey={location.pathname}
      loadingThreshold={500}
    >
      <div className="space-y-6">
        <header>
          <h1>West Bank Dashboard</h1>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="occupation">Occupation Metrics</TabsTrigger>
            <TabsTrigger value="violence">Settler Violence</TabsTrigger>
            <TabsTrigger value="economic">Economic Impact</TabsTrigger>
            <TabsTrigger value="prisoners">Prisoners</TabsTrigger>
          </TabsList>
          
          <TabTransition tabKey={activeTab}>
            {activeTab === 'occupation' && <OccupationMetrics />}
            {activeTab === 'violence' && <SettlerViolence />}
            {activeTab === 'economic' && <EconomicStrangulation />}
            {activeTab === 'prisoners' && <PrisonersDetention />}
          </TabTransition>
        </Tabs>
      </div>
    </PageTransition>
  );
}
```

### Root Layout with Intelligent Preloading

```tsx
// src/components/v3/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { useScrollRestoration, useIntelligentPreload } from '@/components/ui/page-transition';

export function RootLayout() {
  // Enable scroll restoration
  useScrollRestoration();
  
  // Enable intelligent preloading
  useIntelligentPreload();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### Navigation with Preloading

```tsx
// src/components/v3/shared/PillTabs.tsx (enhanced)
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { Link, useLocation } from 'react-router-dom';

export function MainNavigation() {
  const location = useLocation();
  const gazaPreload = useRoutePreload({ path: '/gaza', delay: 100 });
  const westBankPreload = useRoutePreload({ path: '/west-bank', delay: 100 });
  
  return (
    <nav className="flex gap-2">
      <Link
        to="/gaza"
        {...gazaPreload}
        className={cn(
          'px-4 py-2 rounded-full transition-colors',
          location.pathname === '/gaza' && 'bg-primary text-primary-foreground'
        )}
      >
        Gaza
      </Link>
      <Link
        to="/west-bank"
        {...westBankPreload}
        className={cn(
          'px-4 py-2 rounded-full transition-colors',
          location.pathname === '/west-bank' && 'bg-primary text-primary-foreground'
        )}
      >
        West Bank
      </Link>
    </nav>
  );
}
```

## Advanced Usage

### Custom Loading Component

```tsx
import { PageTransition } from '@/components/ui/page-transition';

function CustomLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

<PageTransition 
  mode="fade" 
  pageKey={key}
  loadingComponent={<CustomLoading />}
>
  {content}
</PageTransition>
```

### Manual Scroll Control

```tsx
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

function MyComponent() {
  const { save, restore, clear } = useScrollRestoration({ manual: true });
  
  const handleSave = () => {
    save(); // Manually save current position
  };
  
  const handleRestore = () => {
    restore(); // Manually restore saved position
  };
  
  return (
    <div>
      <button onClick={handleSave}>Save Position</button>
      <button onClick={handleRestore}>Restore Position</button>
    </div>
  );
}
```

### Container Scroll Restoration

```tsx
import { useContainerScrollRestoration } from '@/hooks/useScrollRestoration';

function ScrollableSection() {
  const { ref } = useContainerScrollRestoration('metrics-list');
  
  return (
    <div ref={ref} className="h-96 overflow-auto">
      {/* Scrollable content */}
      {/* Scroll position will be saved and restored automatically */}
    </div>
  );
}
```

### Prefetch Data with Route Preloading

```tsx
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { useQuery } from '@tanstack/react-query';

function Navigation() {
  const preloadProps = useRoutePreload({
    path: '/dashboard',
    prefetchData: async () => {
      // Prefetch data before navigation
      await queryClient.prefetchQuery({
        queryKey: ['dashboard-data'],
        queryFn: fetchDashboardData,
      });
    },
    delay: 100,
  });
  
  return (
    <Link to="/dashboard" {...preloadProps}>
      Dashboard
    </Link>
  );
}
```

## Migration Checklist

- [ ] Add `useScrollRestoration()` to App.tsx
- [ ] Wrap page components with `PageTransition`
- [ ] Replace tab content with `TabTransition`
- [ ] Add preload props to navigation links
- [ ] Test transitions between routes
- [ ] Test tab switching
- [ ] Test scroll restoration on back navigation
- [ ] Test reduced motion behavior
- [ ] Verify loading states appear for slow transitions
- [ ] Test on mobile devices

## Performance Tips

1. **Use appropriate transition types**:
   - `PageTransition` for route changes
   - `TabTransition` for tab content
   - `SectionTransition` for small content changes

2. **Configure loading threshold**:
   - Default 500ms is good for most cases
   - Increase for slower networks
   - Decrease for faster perceived performance

3. **Preload strategically**:
   - Only preload likely next routes
   - Use delay to avoid unnecessary preloads
   - Prefetch critical data only

4. **Scroll restoration**:
   - Default settings work for most cases
   - Increase `saveDelay` for better performance on scroll-heavy pages
   - Use container restoration for specific scrollable sections

## Troubleshooting

### Transitions not working
- Check that `pageKey` changes when route changes
- Verify Framer Motion is installed
- Check for conflicting CSS transitions

### Scroll not restoring
- Ensure `useScrollRestoration()` is in root component
- Check that navigation type is POP (back/forward)
- Verify sessionStorage is available

### Preloading not working
- Check route paths match lazy imports in App.tsx
- Verify hover delay is appropriate
- Check browser console for errors

### Loading skeleton not appearing
- Verify transition takes longer than threshold
- Check that content is actually loading
- Ensure skeleton component is rendering correctly

## Best Practices

1. **Always use PageTransition for routes**: Provides consistent UX
2. **Use TabTransition for tabs**: Optimized for frequent switching
3. **Enable scroll restoration globally**: Better UX for all pages
4. **Preload navigation links**: Improves perceived performance
5. **Test with reduced motion**: Ensure accessibility
6. **Monitor performance**: Check transition timing in production

## Next Steps

After integration:
1. Test all transitions thoroughly
2. Gather user feedback on transition timing
3. Monitor performance metrics
4. Adjust thresholds and delays as needed
5. Consider adding custom loading states for specific routes
