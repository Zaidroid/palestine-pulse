# Enhanced Filter Panel

Advanced filtering system with smooth animations, debouncing, and comprehensive filter management.

## Features

### ✅ Task 14.1: Enhanced FilterPanel Component
- **Slide-in animation from right edge** (300ms with easeOut)
- **Backdrop fade animation** with blur effect
- **Active filter count badge** with spring animation
- Responsive design (full-screen on mobile, 540px panel on desktop)

### ✅ Task 14.2: Date Range Picker
- **Calendar picker with range selection** using react-day-picker
- **Preset options** for quick date selection:
  - Last 7 days
  - Last 30 days
  - Last 60 days
  - Last 90 days
  - Last year
- Visual date range display with formatting

### ✅ Task 14.3: Filter Debouncing
- **500ms debounce** on filter updates to prevent excessive re-renders
- **Loading indicator** during filter application
- Smooth async filter application with visual feedback

### ✅ Task 14.4: Filter Chip Animations
- **Animated filter chips** with fade in/out (200ms)
- **Layout animations** using Framer Motion's layout prop
- **Clear all animation** with staggered exit
- Individual chip removal with scale animation

## Components

### EnhancedFilterPanel

Main filter panel component with all filtering capabilities.

```tsx
import { EnhancedFilterPanel } from '@/components/filters';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <EnhancedFilterPanel 
      isOpen={isOpen} 
      onOpenChange={setIsOpen} 
    />
  );
}
```

**Props:**
- `isOpen: boolean` - Controls panel visibility
- `onOpenChange: (open: boolean) => void` - Callback when panel opens/closes

### EnhancedFilterButton

Trigger button with active filter count badge.

```tsx
import { EnhancedFilterButton } from '@/components/filters';

function MyComponent() {
  return <EnhancedFilterButton />;
}
```

**Props:**
- `className?: string` - Additional CSS classes

### EnhancedFilterDemo

Demo component showcasing all filter features.

```tsx
import { EnhancedFilterDemo } from '@/components/filters';

function DemoPage() {
  return <EnhancedFilterDemo />;
}
```

## Filter Types

### Date Range
- Start and end date selection
- Calendar picker with dual month view
- Quick preset buttons

### Regions
- Gaza City
- Khan Younis
- Rafah
- Northern Gaza
- Ramallah
- Hebron
- Nablus
- Jenin

### Demographics
- Children
- Women
- Medical Personnel
- Civil Defense
- Press/Journalists

### Event Types
- Military Operation
- Massacre
- Ceasefire
- Humanitarian Crisis
- Political Event

### Casualty Thresholds
- Minimum casualties (numeric input)
- Maximum casualties (numeric input)

## Animation Specifications

### Panel Animations
```typescript
// Slide-in from right
variants={drawerVariants.right}
// Duration: 300ms
// Easing: easeOut
```

### Backdrop Animation
```typescript
// Fade with blur
variants={modalBackdropVariants}
// Duration: 300ms
// Blur: backdrop-blur-sm
```

### Filter Chip Animations
```typescript
// Entry animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Exit animation
exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}

// Layout animation
layout={true}
```

### Badge Animation
```typescript
// Spring animation on mount
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: 'spring', stiffness: 500, damping: 25 }}
```

## State Management

The filter panel integrates with the global store:

```typescript
import { useGlobalStore } from '@/store/globalStore';

const { filters, setFilters, resetFilters } = useGlobalStore();
```

### Filter State Structure
```typescript
interface FilterConfig {
  dateRange: {
    start: string; // ISO date string
    end: string;   // ISO date string
  };
  regions?: string[];
  demographics?: string[];
  eventTypes?: string[];
  minCasualties?: number;
  maxCasualties?: number;
}
```

## Debouncing Implementation

Filters are debounced to prevent excessive updates:

```typescript
const [debouncedFilters, setDebouncedFilters] = useState<FilterConfig>(localFilters);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedFilters(localFilters);
  }, 500);

  return () => clearTimeout(timer);
}, [localFilters]);
```

## Usage Examples

### Basic Usage
```tsx
import { EnhancedFilterButton } from '@/components/filters';

function Dashboard() {
  return (
    <div className="flex items-center gap-4">
      <h1>Dashboard</h1>
      <EnhancedFilterButton />
    </div>
  );
}
```

### With Custom Styling
```tsx
<EnhancedFilterButton className="ml-auto" />
```

### Accessing Filter State
```tsx
import { useGlobalStore } from '@/store/globalStore';

function DataDisplay() {
  const { filters } = useGlobalStore();
  
  // Use filters to filter your data
  const filteredData = data.filter(item => {
    // Apply filter logic
    return true;
  });
  
  return <div>{/* Render filtered data */}</div>;
}
```

### Programmatic Filter Control
```tsx
import { useGlobalStore } from '@/store/globalStore';

function QuickFilters() {
  const { setFilters } = useGlobalStore();
  
  const applyGazaFilter = () => {
    setFilters({
      regions: ['Gaza City', 'Khan Younis', 'Rafah', 'Northern Gaza']
    });
  };
  
  return (
    <Button onClick={applyGazaFilter}>
      Show Gaza Only
    </Button>
  );
}
```

## Accessibility

- **Keyboard navigation**: Full keyboard support for all controls
- **Focus management**: Proper focus trapping in panel
- **ARIA labels**: All interactive elements properly labeled
- **Screen reader support**: Announcements for filter changes

## Performance

- **Debounced updates**: 500ms delay prevents excessive re-renders
- **Memoized calculations**: Active filter count is memoized
- **Optimized animations**: GPU-accelerated transforms
- **Lazy rendering**: Panel content only renders when open

## Requirements Satisfied

### Requirement 13.1
✅ Filter panel slides in from right edge with 300ms animation

### Requirement 13.2
✅ Backdrop fades in with blur effect and active filter count badge

### Requirement 13.3
✅ Calendar picker with range selection and preset options

### Requirement 13.4
✅ Filter updates debounced by 500ms with loading indicator

### Requirement 13.5
✅ Filter chips animate in/out with clear all functionality

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch optimization

## Dependencies

- `framer-motion`: Animation library
- `react-day-picker`: Calendar component
- `date-fns`: Date formatting
- `@radix-ui/react-popover`: Popover primitive
- `zustand`: State management

## Future Enhancements

- [ ] Filter presets (save/load custom filter combinations)
- [ ] Filter history (undo/redo)
- [ ] Advanced search within filters
- [ ] Export/import filter configurations
- [ ] Filter analytics (most used filters)
