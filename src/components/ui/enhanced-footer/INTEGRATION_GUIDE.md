# Enhanced Footer Integration Guide

This guide shows how to integrate the EnhancedFooter component into your application.

## Quick Start

### 1. Replace Existing Footer

If you have an existing footer (like V3Footer), you can replace it with EnhancedFooter:

**Before:**
```tsx
import { V3Footer } from '@/components/v3/layout/V3Footer';

<V3Footer />
```

**After:**
```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';
import { useV3Store } from '@/store/v3Store';

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

### 2. Update RootLayout

**File:** `src/components/v3/layout/RootLayout.tsx`

```tsx
import { EnhancedFooter } from '@/components/ui/enhanced-footer';
import { useV3Store } from '@/store/v3Store';
import { exportData } from '@/services/exportService';

export const RootLayout = () => {
  const { 
    dataSourceStatus, 
    lastUpdated, 
    fetchConsolidatedData,
    // ... other state
  } = useV3Store();

  const dataSources = Object.values(dataSourceStatus);

  const handleExport = () => {
    // Get current dashboard data
    const data = useV3Store.getState().consolidatedData;
    exportData(data, 'csv', 'palestine-dashboard-export.csv');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <V3Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <EnhancedFooter
        dataSources={dataSources}
        lastUpdated={lastUpdated}
        autoRefreshInterval={300000} // 5 minutes
        onRefresh={() => fetchConsolidatedData(true)}
        onExport={handleExport}
      />
    </div>
  );
};
```

## Store Integration

### Update V3 Store

Ensure your store has the necessary data source status structure:

**File:** `src/store/v3Store.ts`

```tsx
export interface DataSourceState {
  name: string;
  status: 'active' | 'syncing' | 'error' | 'disabled';
  lastSync?: Date;
  quality?: 'high' | 'medium' | 'low';
  message?: string;
}

interface V3Store {
  dataSourceStatus: Record<string, DataSourceState>;
  lastUpdated: Date;
  // ... other state
  
  setDataSourceStatus: (
    source: string, 
    status: DataSourceState['status'],
    lastSync?: Date,
    message?: string
  ) => void;
}

export const useV3Store = create<V3Store>((set) => ({
  dataSourceStatus: {
    'OCHA': { name: 'OCHA', status: 'active', quality: 'high' },
    'World Bank': { name: 'World Bank', status: 'active', quality: 'high' },
    'HDX': { name: 'HDX', status: 'active', quality: 'medium' },
    'WFP': { name: 'WFP', status: 'active', quality: 'high' },
    "B'Tselem": { name: "B'Tselem", status: 'active', quality: 'high' },
  },
  lastUpdated: new Date(),
  
  setDataSourceStatus: (source, status, lastSync, message) => 
    set((state) => ({
      dataSourceStatus: {
        ...state.dataSourceStatus,
        [source]: {
          ...state.dataSourceStatus[source],
          status,
          lastSync: lastSync || state.dataSourceStatus[source]?.lastSync,
          message,
        },
      },
    })),
}));
```

## Export Integration

### Basic Export

```tsx
import { exportData } from '@/services/exportService';

const handleExport = () => {
  const data = getCurrentData();
  exportData(data, 'csv', 'export.csv');
};

<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  onExport={handleExport}
/>
```

### Export with Dialog

```tsx
import { useState } from 'react';
import { ExportDialog } from '@/components/export/ExportDialog';

function Layout() {
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <>
      <EnhancedFooter
        dataSources={dataSources}
        lastUpdated={lastUpdated}
        onExport={() => setShowExportDialog(true)}
      />
      
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </>
  );
}
```

## Share Integration

### Custom Share Handler

```tsx
import { toast } from 'sonner';

const handleShare = async () => {
  const shareData = {
    title: 'Palestine Pulse Dashboard',
    text: 'Check out this real-time humanitarian data dashboard',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      toast.success('Shared successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  }
};

<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  onShare={handleShare}
/>
```

## Refresh Integration

### With Data Refresh Service

```tsx
import { dataRefreshService } from '@/services/dataRefreshService';

const handleRefresh = async () => {
  await dataRefreshService.refreshData({ forceRefresh: true });
};

<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  onRefresh={handleRefresh}
/>
```

### With Loading State

```tsx
import { useState } from 'react';
import { toast } from 'sonner';

function Layout() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing data...');
    
    try {
      await fetchConsolidatedData(true);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={lastUpdated}
      onRefresh={handleRefresh}
    />
  );
}
```

## Data Source Status Updates

### Update Status During Fetch

```tsx
const fetchDataFromSource = async (sourceName: string) => {
  const { setDataSourceStatus } = useV3Store.getState();
  
  // Set to syncing
  setDataSourceStatus(sourceName, 'syncing', undefined, 'Fetching latest data...');
  
  try {
    const data = await fetchData(sourceName);
    
    // Set to active on success
    setDataSourceStatus(sourceName, 'active', new Date(), 'Data up to date');
    
    return data;
  } catch (error) {
    // Set to error on failure
    setDataSourceStatus(
      sourceName, 
      'error', 
      undefined, 
      `Failed to fetch: ${error.message}`
    );
    throw error;
  }
};
```

### Periodic Status Check

```tsx
useEffect(() => {
  const checkDataSourceHealth = async () => {
    const sources = ['OCHA', 'World Bank', 'HDX', 'WFP', "B'Tselem"];
    
    for (const source of sources) {
      try {
        const isHealthy = await checkSourceHealth(source);
        
        if (!isHealthy) {
          setDataSourceStatus(source, 'error', undefined, 'Health check failed');
        }
      } catch (error) {
        setDataSourceStatus(source, 'error', undefined, 'Connection timeout');
      }
    }
  };

  const interval = setInterval(checkDataSourceHealth, 60000); // Every minute
  
  return () => clearInterval(interval);
}, []);
```

## Customization

### Custom Refresh Interval

```tsx
// Refresh every 2 minutes
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={120000}
  onRefresh={handleRefresh}
/>
```

### Custom Styling

```tsx
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
/>
```

### Conditional Actions

```tsx
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  onRefresh={handleRefresh}
  // Only show export for authenticated users
  onExport={isAuthenticated ? handleExport : undefined}
  // Only show share on supported browsers
  onShare={navigator.share ? handleShare : undefined}
/>
```

## Testing

### Unit Test Example

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

describe('EnhancedFooter', () => {
  const mockDataSources = [
    { name: 'OCHA', status: 'active' as const, quality: 'high' as const },
    { name: 'World Bank', status: 'syncing' as const, quality: 'medium' as const },
  ];

  it('renders data sources', () => {
    render(
      <EnhancedFooter
        dataSources={mockDataSources}
        lastUpdated={new Date()}
      />
    );

    expect(screen.getByText('OCHA')).toBeInTheDocument();
    expect(screen.getByText('World Bank')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button clicked', async () => {
    const onRefresh = jest.fn().mockResolvedValue(undefined);
    
    render(
      <EnhancedFooter
        dataSources={mockDataSources}
        lastUpdated={new Date()}
        onRefresh={onRefresh}
      />
    );

    fireEvent.click(screen.getByText('Refresh'));
    
    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled();
    });
  });
});
```

## Migration Checklist

- [ ] Install required dependencies (framer-motion, date-fns, lucide-react)
- [ ] Update store to include data source status structure
- [ ] Replace existing footer component with EnhancedFooter
- [ ] Implement onRefresh handler
- [ ] Implement onExport handler (optional)
- [ ] Implement onShare handler (optional)
- [ ] Implement onDocs handler (optional)
- [ ] Test all animations and interactions
- [ ] Test responsive behavior on mobile
- [ ] Test accessibility with screen readers
- [ ] Verify reduced motion support

## Troubleshooting

### Data sources not updating
- Ensure `setDataSourceStatus` is called when fetching data
- Check that store is properly connected
- Verify data source names match between store and component

### Countdown timer not working
- Ensure `autoRefreshInterval` is set
- Verify `onRefresh` handler is provided
- Check that component is not unmounting/remounting

### Animations not playing
- Check if user has `prefers-reduced-motion` enabled
- Verify Framer Motion is properly installed
- Ensure animation variants are correctly defined

### Export not working
- Verify export service is properly imported
- Check that data is in correct format
- Ensure file download permissions are granted

## Best Practices

1. **Update status during data fetches**: Always update data source status to 'syncing' before fetching and 'active'/'error' after
2. **Provide meaningful messages**: Include helpful error messages in the status
3. **Handle errors gracefully**: Always catch and handle fetch errors
4. **Use appropriate refresh intervals**: Balance freshness with API rate limits
5. **Test on real devices**: Verify animations and interactions on actual mobile devices
6. **Monitor performance**: Ensure countdown timer doesn't cause performance issues

## Support

For issues or questions:
- Check the [README](./README.md) for detailed documentation
- Review the [Demo](./EnhancedFooterDemo.tsx) for usage examples
- Open an issue on GitHub
