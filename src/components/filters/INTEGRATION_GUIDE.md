# Enhanced Filter Panel - Integration Guide

## Quick Start

### 1. Basic Integration

Add the filter button to your dashboard header:

```tsx
import { EnhancedFilterButton } from '@/components/filters';

function DashboardHeader() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Dashboard</h1>
      <div className="flex items-center gap-4">
        <EnhancedFilterButton />
        {/* Other header actions */}
      </div>
    </header>
  );
}
```

### 2. Access Filter State

Use the global store to access current filters:

```tsx
import { useGlobalStore } from '@/store/globalStore';

function DataComponent() {
  const { filters } = useGlobalStore();
  
  // Use filters in your data fetching or filtering logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Date range filter
      const itemDate = new Date(item.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
      
      // Region filter
      if (filters.regions?.length && !filters.regions.includes(item.region)) {
        return false;
      }
      
      // Demographics filter
      if (filters.demographics?.length && !filters.demographics.includes(item.demographic)) {
        return false;
      }
      
      // Event type filter
      if (filters.eventTypes?.length && !filters.eventTypes.includes(item.eventType)) {
        return false;
      }
      
      // Casualty threshold filters
      if (filters.minCasualties !== undefined && item.casualties < filters.minCasualties) {
        return false;
      }
      
      if (filters.maxCasualties !== undefined && item.casualties > filters.maxCasualties) {
        return false;
      }
      
      return true;
    });
  }, [data, filters]);
  
  return <div>{/* Render filtered data */}</div>;
}
```

### 3. Programmatic Filter Control

Set filters programmatically:

```tsx
import { useGlobalStore } from '@/store/globalStore';

function QuickFilterButtons() {
  const { setFilters, resetFilters } = useGlobalStore();
  
  const showGazaOnly = () => {
    setFilters({
      regions: ['Gaza City', 'Khan Younis', 'Rafah', 'Northern Gaza']
    });
  };
  
  const showLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    
    setFilters({
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      }
    });
  };
  
  const clearFilters = () => {
    resetFilters();
  };
  
  return (
    <div className="flex gap-2">
      <Button onClick={showGazaOnly}>Gaza Only</Button>
      <Button onClick={showLast7Days}>Last 7 Days</Button>
      <Button onClick={clearFilters}>Clear All</Button>
    </div>
  );
}
```

## Advanced Usage

### Custom Filter Logic

Create a custom hook for complex filter logic:

```tsx
import { useMemo } from 'react';
import { useGlobalStore } from '@/store/globalStore';

export function useFilteredData<T extends { 
  date: string;
  region?: string;
  demographic?: string;
  eventType?: string;
  casualties?: number;
}>(data: T[]) {
  const { filters } = useGlobalStore();
  
  return useMemo(() => {
    return data.filter(item => {
      // Date range
      const itemDate = new Date(item.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
      
      // Regions
      if (filters.regions?.length && item.region) {
        if (!filters.regions.includes(item.region)) {
          return false;
        }
      }
      
      // Demographics
      if (filters.demographics?.length && item.demographic) {
        if (!filters.demographics.includes(item.demographic)) {
          return false;
        }
      }
      
      // Event types
      if (filters.eventTypes?.length && item.eventType) {
        if (!filters.eventTypes.includes(item.eventType)) {
          return false;
        }
      }
      
      // Casualty thresholds
      if (item.casualties !== undefined) {
        if (filters.minCasualties !== undefined && item.casualties < filters.minCasualties) {
          return false;
        }
        
        if (filters.maxCasualties !== undefined && item.casualties > filters.maxCasualties) {
          return false;
        }
      }
      
      return true;
    });
  }, [data, filters]);
}

// Usage
function MyComponent() {
  const rawData = useDataFetch();
  const filteredData = useFilteredData(rawData);
  
  return <DataTable data={filteredData} />;
}
```

### Filter Change Notifications

React to filter changes:

```tsx
import { useEffect } from 'react';
import { useGlobalStore } from '@/store/globalStore';

function FilterChangeListener() {
  const { filters } = useGlobalStore();
  
  useEffect(() => {
    console.log('Filters changed:', filters);
    
    // Trigger data refetch
    refetchData();
    
    // Update analytics
    trackFilterChange(filters);
    
    // Update URL params
    updateURLParams(filters);
  }, [filters]);
  
  return null;
}
```

### URL Synchronization

Sync filters with URL parameters:

```tsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGlobalStore } from '@/store/globalStore';

function FilterURLSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useGlobalStore();
  
  // Load filters from URL on mount
  useEffect(() => {
    const regions = searchParams.get('regions')?.split(',').filter(Boolean);
    const demographics = searchParams.get('demographics')?.split(',').filter(Boolean);
    const eventTypes = searchParams.get('eventTypes')?.split(',').filter(Boolean);
    const minCasualties = searchParams.get('minCasualties');
    const maxCasualties = searchParams.get('maxCasualties');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (regions || demographics || eventTypes || minCasualties || maxCasualties || startDate || endDate) {
      setFilters({
        ...(regions && { regions }),
        ...(demographics && { demographics }),
        ...(eventTypes && { eventTypes }),
        ...(minCasualties && { minCasualties: parseInt(minCasualties) }),
        ...(maxCasualties && { maxCasualties: parseInt(maxCasualties) }),
        ...(startDate && endDate && {
          dateRange: { start: startDate, end: endDate }
        }),
      });
    }
  }, []);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.regions?.length) {
      params.set('regions', filters.regions.join(','));
    }
    
    if (filters.demographics?.length) {
      params.set('demographics', filters.demographics.join(','));
    }
    
    if (filters.eventTypes?.length) {
      params.set('eventTypes', filters.eventTypes.join(','));
    }
    
    if (filters.minCasualties !== undefined) {
      params.set('minCasualties', filters.minCasualties.toString());
    }
    
    if (filters.maxCasualties !== undefined) {
      params.set('maxCasualties', filters.maxCasualties.toString());
    }
    
    params.set('startDate', filters.dateRange.start);
    params.set('endDate', filters.dateRange.end);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);
  
  return null;
}
```

## Styling Customization

### Custom Button Styling

```tsx
<EnhancedFilterButton className="bg-primary text-primary-foreground hover:bg-primary/90" />
```

### Theme Integration

The filter panel automatically adapts to your theme (light/dark mode) using CSS variables.

## Performance Tips

1. **Memoize filtered data** to prevent unnecessary recalculations
2. **Use the debounced filters** for expensive operations
3. **Implement virtual scrolling** for large datasets
4. **Lazy load filter options** if you have many options

## Accessibility

The filter panel is fully accessible:

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels

### Keyboard Shortcuts

- `Tab`: Navigate between controls
- `Enter`: Apply filters / Toggle checkboxes
- `Escape`: Close panel
- `Space`: Toggle checkboxes

## Testing

### Unit Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedFilterButton } from '@/components/filters';

describe('EnhancedFilterButton', () => {
  it('opens filter panel on click', () => {
    render(<EnhancedFilterButton />);
    
    const button = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
  });
  
  it('displays active filter count', () => {
    // Set up filters in store
    const { container } = render(<EnhancedFilterButton />);
    
    expect(container.querySelector('.badge')).toHaveTextContent('3');
  });
});
```

### Integration Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedFilterPanel } from '@/components/filters';

describe('EnhancedFilterPanel', () => {
  it('applies filters with debouncing', async () => {
    const onOpenChange = jest.fn();
    render(<EnhancedFilterPanel isOpen={true} onOpenChange={onOpenChange} />);
    
    // Select a region
    const checkbox = screen.getByLabelText('Gaza City');
    fireEvent.click(checkbox);
    
    // Click apply
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    // Wait for debounce and async operation
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
```

## Troubleshooting

### Filters not applying

Check that you're using the global store correctly:

```tsx
const { filters } = useGlobalStore();
// NOT: const filters = useGlobalStore().filters;
```

### Panel not closing

Ensure you're passing the `onOpenChange` callback:

```tsx
<EnhancedFilterPanel 
  isOpen={isOpen} 
  onOpenChange={setIsOpen}  // Required!
/>
```

### Date picker not working

Verify that `date-fns` is installed:

```bash
npm install date-fns
```

### Animations not smooth

Check that `framer-motion` is installed and up to date:

```bash
npm install framer-motion@latest
```

## Migration from Old Filter System

If you're migrating from the old `AdvancedFilters` component:

1. Replace imports:
```tsx
// Old
import { AdvancedFilters } from '@/components/filters/AdvancedFilters';

// New
import { EnhancedFilterButton } from '@/components/filters';
```

2. Update usage:
```tsx
// Old
<AdvancedFilters />

// New
<EnhancedFilterButton />
```

3. The filter state structure remains the same, so no changes needed to your filter logic.

## Support

For issues or questions:
- Check the [README.md](./README.md) for detailed documentation
- Review the [demo component](./EnhancedFilterDemo.tsx) for examples
- Check the implementation summary for technical details
