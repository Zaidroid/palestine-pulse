# Enhanced Footer Quick Start Guide

Get the EnhancedFooter component up and running in 5 minutes.

## Installation

### 1. Dependencies
The component requires these dependencies (likely already installed):

```bash
npm install framer-motion date-fns lucide-react
```

### 2. Import the Component

```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';
```

## Basic Usage

### Minimal Setup

```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function App() {
  const dataSources = [
    { name: 'OCHA', status: 'active' as const },
    { name: 'World Bank', status: 'active' as const },
  ];

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={new Date()}
    />
  );
}
```

### With Refresh

```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function App() {
  const dataSources = [
    { name: 'OCHA', status: 'active' as const },
  ];

  const handleRefresh = async () => {
    // Your refresh logic
    await fetchData();
  };

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={new Date()}
      onRefresh={handleRefresh}
    />
  );
}
```

### With All Features

```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';
import { exportData } from '@/services/exportService';

function App() {
  const dataSources = [
    {
      name: 'OCHA',
      status: 'active' as const,
      lastSync: new Date(),
      quality: 'high' as const,
    },
    {
      name: 'World Bank',
      status: 'syncing' as const,
      quality: 'medium' as const,
      message: 'Syncing latest data...'
    },
  ];

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleExport = () => {
    const data = getCurrentData();
    exportData(data, 'csv', 'export.csv');
  };

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={new Date()}
      autoRefreshInterval={300000} // 5 minutes
      onRefresh={handleRefresh}
      onExport={handleExport}
    />
  );
}
```

## Common Patterns

### Pattern 1: With Zustand Store

```tsx
import { useV3Store } from '@/store/v3Store';
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function Layout() {
  const { dataSourceStatus, lastUpdated, fetchConsolidatedData } = useV3Store();
  
  const dataSources = Object.values(dataSourceStatus);

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={lastUpdated}
      onRefresh={() => fetchConsolidatedData(true)}
    />
  );
}
```

### Pattern 2: With React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function Layout() {
  const { data, refetch } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
  });

  const dataSources = [
    { name: 'API', status: data ? 'active' : 'syncing' as const },
  ];

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={data?.lastUpdated || new Date()}
      onRefresh={() => refetch()}
    />
  );
}
```

### Pattern 3: With Custom Hook

```tsx
import { useDataSources } from '@/hooks/useDataSources';
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function Layout() {
  const { dataSources, lastUpdated, refresh } = useDataSources();

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    />
  );
}
```

## Status Indicators

Quick reference for status values:

```tsx
// Active - Everything working
{ name: 'OCHA', status: 'active' }

// Syncing - Currently fetching data
{ name: 'World Bank', status: 'syncing' }

// Error - Something went wrong
{ name: 'HDX', status: 'error', message: 'Connection timeout' }

// Disabled - Not currently active
{ name: 'WFP', status: 'disabled' }
```

## Quality Indicators

Quick reference for quality values:

```tsx
// High quality - Reliable, up-to-date data
{ name: 'OCHA', status: 'active', quality: 'high' }

// Medium quality - Some limitations
{ name: 'World Bank', status: 'active', quality: 'medium' }

// Low quality - Outdated or incomplete
{ name: 'HDX', status: 'error', quality: 'low' }
```

## Customization

### Custom Refresh Interval

```tsx
// Refresh every 2 minutes
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={120000}
/>

// Refresh every 10 minutes
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={600000}
/>
```

### Custom Styling

```tsx
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  className="bg-gradient-to-r from-blue-50 to-purple-50"
/>
```

### Conditional Features

```tsx
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  // Only show export for authenticated users
  onExport={isAuthenticated ? handleExport : undefined}
  // Only show share on supported browsers
  onShare={navigator.share ? handleShare : undefined}
/>
```

## Troubleshooting

### Issue: Animations not working
**Solution:** Check if user has `prefers-reduced-motion` enabled. The component respects this setting.

### Issue: Countdown timer not updating
**Solution:** Ensure `autoRefreshInterval` is set and `onRefresh` callback is provided.

### Issue: Data sources not showing
**Solution:** Verify `dataSources` array is not empty and has correct structure.

### Issue: TypeScript errors
**Solution:** Ensure you're using the correct types:
```tsx
import type { DataSourceStatus } from '@/components/ui/enhanced-footer';

const dataSources: DataSourceStatus[] = [
  { name: 'OCHA', status: 'active' },
];
```

## Next Steps

1. **Read the full documentation**: [README.md](./README.md)
2. **Check integration guide**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
3. **Run the demo**: [EnhancedFooterDemo.tsx](./EnhancedFooterDemo.tsx)
4. **Review testing checklist**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

## Support

- 📖 [Full Documentation](./README.md)
- 🔧 [Integration Guide](./INTEGRATION_GUIDE.md)
- 🎨 [Demo Component](./EnhancedFooterDemo.tsx)
- ✅ [Testing Checklist](./TESTING_CHECKLIST.md)
- 🔄 [Comparison with V3Footer](./COMPARISON.md)

## Examples

Check out these example implementations:

### Example 1: Simple Dashboard
```tsx
function SimpleDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>Dashboard Header</header>
      <main className="flex-1">Dashboard Content</main>
      <EnhancedFooter
        dataSources={[
          { name: 'API', status: 'active' },
        ]}
        lastUpdated={new Date()}
      />
    </div>
  );
}
```

### Example 2: With Multiple Sources
```tsx
function MultiSourceDashboard() {
  const dataSources = [
    { name: 'OCHA', status: 'active', quality: 'high' },
    { name: 'World Bank', status: 'active', quality: 'high' },
    { name: 'HDX', status: 'syncing', quality: 'medium' },
    { name: 'WFP', status: 'active', quality: 'high' },
  ];

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={new Date()}
      onRefresh={async () => {
        await Promise.all([
          fetchOCHA(),
          fetchWorldBank(),
          fetchHDX(),
          fetchWFP(),
        ]);
      }}
    />
  );
}
```

### Example 3: With Error Handling
```tsx
function RobustDashboard() {
  const [dataSources, setDataSources] = useState([
    { name: 'API', status: 'active' as const },
  ]);

  const handleRefresh = async () => {
    setDataSources([{ name: 'API', status: 'syncing' }]);
    
    try {
      await fetchData();
      setDataSources([{ 
        name: 'API', 
        status: 'active',
        lastSync: new Date(),
      }]);
    } catch (error) {
      setDataSources([{ 
        name: 'API', 
        status: 'error',
        message: error.message,
      }]);
    }
  };

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={new Date()}
      onRefresh={handleRefresh}
    />
  );
}
```

That's it! You're ready to use the EnhancedFooter component. 🎉
