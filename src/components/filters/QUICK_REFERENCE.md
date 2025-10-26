# Enhanced Filter Panel - Quick Reference

## Installation

No additional installation needed. All dependencies are already in the project.

## Basic Usage

```tsx
import { EnhancedFilterButton } from '@/components/filters';

function MyComponent() {
  return <EnhancedFilterButton />;
}
```

## Access Filters

```tsx
import { useGlobalStore } from '@/store/globalStore';

const { filters } = useGlobalStore();
```

## Filter Structure

```typescript
{
  dateRange: {
    start: string;  // ISO date
    end: string;    // ISO date
  };
  regions?: string[];
  demographics?: string[];
  eventTypes?: string[];
  minCasualties?: number;
  maxCasualties?: number;
}
```

## Set Filters

```tsx
const { setFilters } = useGlobalStore();

setFilters({
  regions: ['Gaza City', 'Khan Younis']
});
```

## Reset Filters

```tsx
const { resetFilters } = useGlobalStore();

resetFilters();
```

## Date Presets

- Last 7 days
- Last 30 days
- Last 60 days
- Last 90 days
- Last year

## Available Regions

- Gaza City
- Khan Younis
- Rafah
- Northern Gaza
- Ramallah
- Hebron
- Nablus
- Jenin

## Available Demographics

- Children
- Women
- Medical Personnel
- Civil Defense
- Press/Journalists

## Available Event Types

- Military Operation
- Massacre
- Ceasefire
- Humanitarian Crisis
- Political Event

## Animation Timings

- Panel slide-in: 300ms
- Backdrop fade: 300ms
- Filter chips: 200ms
- Badge spring: ~400ms
- Debounce delay: 500ms

## Keyboard Shortcuts

- `Tab` - Navigate controls
- `Enter` - Apply/Toggle
- `Escape` - Close panel
- `Space` - Toggle checkboxes

## Components

### EnhancedFilterButton
Trigger button with badge

### EnhancedFilterPanel
Main filter panel

### EnhancedFilterDemo
Demo component

## Files

- `EnhancedFilterPanel.tsx` - Main component
- `EnhancedFilterButton.tsx` - Trigger button
- `EnhancedFilterDemo.tsx` - Demo
- `README.md` - Full documentation
- `INTEGRATION_GUIDE.md` - Integration guide
- `COMPARISON.md` - Comparison with original
- `QUICK_REFERENCE.md` - This file

## Requirements Met

✅ 13.1 - Slide-in animation  
✅ 13.2 - Active filter badge  
✅ 13.3 - Date range picker  
✅ 13.4 - Filter debouncing  
✅ 13.5 - Filter chip animations

## Support

See README.md for detailed documentation.
