# Enhanced Footer Component

A modern, animated footer component with data source status indicators, real-time sync animations, countdown timer, and quick action buttons.

## Features

### Core Features
- **Data Source Status Badges**: Display multiple data sources with color-coded status indicators
- **Real-time Sync Status**: Animated indicators showing syncing, active, error, or disabled states
- **Auto-refresh Countdown**: Visual countdown timer with number flip animation
- **Quick Action Buttons**: Export, Share, Docs, and Refresh with interactive animations
- **Responsive Layout**: Adapts to mobile, tablet, and desktop viewports
- **Accessibility**: Respects `prefers-reduced-motion` and includes proper ARIA labels

### Animations
- **Staggered Badge Entry**: Badges fade in with 50ms delay between each (Requirement 8.2)
- **Rotating Sync Indicator**: Spinning animation for syncing status (Requirement 8.2)
- **Number Flip Animation**: Smooth flip effect for countdown timer (Requirement 8.4)
- **Button Interactions**: Press and hover animations for all action buttons
- **Footer Entry**: Smooth slide-up animation on initial load

## Usage

### Basic Usage

```tsx
import { EnhancedFooter, DataSourceStatus } from '@/components/ui/enhanced-footer';

const dataSources: DataSourceStatus[] = [
  {
    name: 'OCHA',
    status: 'active',
    lastSync: new Date(),
    quality: 'high',
  },
  {
    name: 'World Bank',
    status: 'syncing',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    quality: 'medium',
    message: 'Syncing latest data...'
  },
];

function App() {
  const handleRefresh = async () => {
    // Refresh data logic
  };

  const handleExport = () => {
    // Export logic
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

### With All Props

```tsx
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={300000}
  onRefresh={handleRefresh}
  onExport={handleExport}
  onShare={handleShare}
  onDocs={handleDocs}
  className="custom-footer-class"
/>
```

## Props

### EnhancedFooterProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSources` | `DataSourceStatus[]` | Required | Array of data sources with status information |
| `lastUpdated` | `Date` | Required | Timestamp of last data update |
| `autoRefreshInterval` | `number` | `300000` | Auto-refresh interval in milliseconds (default: 5 minutes) |
| `onRefresh` | `() => Promise<void>` | `undefined` | Callback for manual refresh action |
| `onExport` | `() => void` | `undefined` | Callback for export action |
| `onShare` | `() => void` | `undefined` | Callback for share action (defaults to native share or clipboard) |
| `onDocs` | `() => void` | `undefined` | Callback for docs action (defaults to GitHub docs) |
| `className` | `string` | `undefined` | Additional CSS classes |

### DataSourceStatus

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Display name of the data source |
| `status` | `'active' \| 'syncing' \| 'error' \| 'disabled'` | Yes | Current status of the data source |
| `lastSync` | `Date` | No | Timestamp of last successful sync |
| `quality` | `'high' \| 'medium' \| 'low'` | No | Data quality indicator |
| `message` | `string` | No | Additional status message |

## Status Indicators

### Visual Indicators

- **Active** (Green): Data source is operational and up-to-date
- **Syncing** (Yellow): Currently fetching new data (with spinning animation)
- **Error** (Red): Connection or data retrieval issue
- **Disabled** (Gray): Data source is not currently active

### Hover Information

Each badge shows detailed information on hover:
- Source name
- Current status
- Data quality level
- Last sync time (relative)
- Status message (if available)

## Animations

### Badge Stagger Animation
Badges animate in with a staggered delay of 50ms between each badge, creating a smooth cascade effect.

```tsx
// Automatically applied to all badges
const badgeStaggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.05, // 50ms delay
    },
  },
};
```

### Countdown Timer Animation
The countdown timer uses a number flip animation when values change:

```tsx
// Smooth transition between numbers
const numberFlipVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};
```

### Sync Indicator Animation
Syncing sources display a continuously rotating icon:

```tsx
// Infinite rotation for syncing state
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
>
  <Loader2 />
</motion.div>
```

## Integration Examples

### With V3 Store

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

### With Export Service

```tsx
import { exportData } from '@/services/exportService';
import { EnhancedFooter } from '@/components/ui/enhanced-footer';

function Dashboard() {
  const handleExport = () => {
    const data = getCurrentDashboardData();
    exportData(data, 'csv', 'dashboard-export.csv');
  };

  return (
    <EnhancedFooter
      dataSources={dataSources}
      lastUpdated={lastUpdated}
      onExport={handleExport}
    />
  );
}
```

### Custom Refresh Interval

```tsx
// Refresh every 2 minutes
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={120000}
  onRefresh={handleRefresh}
/>

// Refresh every 10 minutes
<EnhancedFooter
  dataSources={dataSources}
  lastUpdated={lastUpdated}
  autoRefreshInterval={600000}
  onRefresh={handleRefresh}
/>
```

## Accessibility

### Reduced Motion Support
The component respects the `prefers-reduced-motion` media query:
- Disables stagger animations
- Removes number flip animations
- Maintains functionality without decorative animations

```tsx
const prefersReducedMotion = useReducedMotion();

// Conditionally apply animations
<motion.div
  variants={prefersReducedMotion ? undefined : badgeItemVariants}
>
  {/* Content */}
</motion.div>
```

### Keyboard Navigation
- All buttons are keyboard accessible
- Proper focus indicators
- Logical tab order

### Screen Readers
- Semantic HTML structure
- ARIA labels on interactive elements
- Status updates announced appropriately

## Styling

### Custom Styling

```tsx
<EnhancedFooter
  className="custom-footer"
  dataSources={dataSources}
  lastUpdated={lastUpdated}
/>
```

### Theme Support
The component automatically adapts to light and dark themes using CSS variables:
- `--background`
- `--foreground`
- `--border`
- `--muted`
- `--primary`

## Performance

### Optimizations
- Memoized callbacks to prevent unnecessary re-renders
- Efficient animation using Framer Motion
- Minimal re-renders with proper state management
- GPU-accelerated animations using CSS transforms

### Bundle Size
- Core component: ~8KB (minified)
- With dependencies: ~15KB (minified + gzipped)

## Requirements Mapping

This component fulfills the following requirements:

- **8.1**: Display data source badges with status indicators
- **8.2**: Real-time sync status animations (staggered fade-in, rotating spinner)
- **8.3**: Hover popover with detailed status information
- **8.4**: Countdown timer with animated updates (number flip animation)
- **8.5**: Quick action buttons (Export, Share, Docs, Refresh)
- **15.1**: Export functionality integration
- **15.3**: Share functionality with URL generation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Dependencies

- `framer-motion`: Animation library
- `lucide-react`: Icon library
- `date-fns`: Date formatting
- `@/components/ui/*`: Shadcn UI components
- `@/lib/animation/*`: Animation utilities

## Related Components

- [EnhancedMetricCard](../enhanced-metric-card/README.md)
- [EnhancedDataSourceBadge](../enhanced-data-source-badge/README.md)
- [PageTransition](../page-transition/README.md)

## Demo

Run the demo to see all features in action:

```tsx
import { EnhancedFooterDemo } from '@/components/ui/enhanced-footer/EnhancedFooterDemo';

<EnhancedFooterDemo />
```

The demo includes:
- Multiple data source states
- Interactive state simulation
- All animation variants
- Responsive behavior testing
