# Enhanced Data Source Badge System

A modern, animated badge system for displaying data source information with quality indicators, freshness status, and detailed attribution.

## Features

### ✅ Task 8.1: Quality Indicators
- **High Quality**: Green checkmark icon, verified data from authoritative sources
- **Medium Quality**: Yellow alert icon, reliable data with moderate delays
- **Low Quality**: Orange warning icon, estimated or modeled data
- Each quality level has appropriate colors, icons, and descriptions

### ✅ Task 8.1: Freshness Indicators
- **Fresh** (< 1 hour): Green dot, no animation
- **Recent** (1-24 hours): Blue dot, no animation
- **Stale** (1-7 days): Yellow dot, pulsing animation
- **Outdated** (> 7 days): Red dot, pulsing animation
- Color-coded indicators with relative time display

### ✅ Task 8.1: Hover Popover
- Displays detailed information on hover
- Shows quality level and description
- Lists all data sources with links
- Shows last updated time and freshness status
- Smooth fade-in animation

### ✅ Task 8.2: Badge Animations
- **Entry Animation**: Fade-in + slide-up (300ms)
- **Hover Animation**: Scale to 1.05 (200ms)
- **Stale Data Pulse**: Continuous opacity and scale animation (2s loop)
- All animations use design tokens for consistency

### ✅ Task 8.3: Click Modal
- Full-screen modal with detailed source attribution
- Shows methodology and data collection details
- Displays reliability and update frequency
- Links to verification URLs
- Refresh functionality with loading state
- Staggered content reveal animation

## Usage

### Basic Usage

```tsx
import { EnhancedDataSourceBadge } from '@/components/ui/enhanced-data-source-badge';

const sources = [
  {
    name: 'UN OCHA',
    url: 'https://www.ochaopt.org/',
    description: 'United Nations Office for the Coordination of Humanitarian Affairs',
    methodology: 'Direct field reports and verified humanitarian data collection',
    reliability: 'Very High',
    updateFrequency: 'Daily',
    verificationUrl: 'https://www.ochaopt.org/data',
  },
];

<EnhancedDataSourceBadge
  sources={sources}
  quality="high"
  lastRefresh={new Date()}
/>
```

### With Refresh Functionality

```tsx
const handleRefresh = async () => {
  // Refresh data logic
  await fetchNewData();
};

<EnhancedDataSourceBadge
  sources={sources}
  quality="high"
  lastRefresh={lastRefreshDate}
  onRefresh={handleRefresh}
/>
```

### Compact Mode

```tsx
<EnhancedDataSourceBadge
  sources={sources}
  quality="medium"
  lastRefresh={new Date()}
  compact
/>
```

### Non-Interactive Mode

```tsx
<EnhancedDataSourceBadge
  sources={sources}
  quality="low"
  lastRefresh={new Date()}
  interactive={false}
/>
```

## Props

### EnhancedDataSourceBadgeProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sources` | `DataSourceInfo[]` | Required | Array of data source information |
| `quality` | `'high' \| 'medium' \| 'low'` | Required | Data quality level |
| `lastRefresh` | `Date` | Required | Last refresh timestamp |
| `className` | `string` | - | Additional CSS classes |
| `showRefreshTime` | `boolean` | `true` | Show last refresh time |
| `showLinks` | `boolean` | `true` | Show external link icons |
| `compact` | `boolean` | `false` | Use compact display mode |
| `interactive` | `boolean` | `true` | Enable click modal |
| `onRefresh` | `() => Promise<void>` | - | Refresh callback function |

### DataSourceInfo

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Source name |
| `url` | `string` | Yes | Source URL |
| `description` | `string` | No | Source description |
| `methodology` | `string` | No | Data collection methodology |
| `reliability` | `string` | No | Reliability rating |
| `updateFrequency` | `string` | No | Update frequency |
| `verificationUrl` | `string` | No | Verification details URL |

## Animation Specifications

All animations follow the design system tokens:

- **Entry**: `slideUpVariants` - Fade-in + slide-up (300ms, ease-out)
- **Hover**: Scale 1.05 (200ms, ease-out)
- **Stale Pulse**: Opacity [0.6, 1, 0.6] + Scale [1, 1.05, 1] (2s, infinite)
- **Modal Content**: Staggered reveal (100ms delay per item)

## Requirements Mapping

- **Requirement 5.1**: Quality indicators with icons ✅
- **Requirement 5.2**: Hover popover with detailed information ✅
- **Requirement 5.3**: Multiple sources with "+N" indicator ✅
- **Requirement 5.4**: Freshness indicators with color coding ✅
- **Requirement 5.5**: Click modal with full attribution ✅

## Demo

To see all features in action, import and use the demo component:

```tsx
import { EnhancedDataSourceBadgeDemo } from '@/components/ui/enhanced-data-source-badge';

<EnhancedDataSourceBadgeDemo />
```

## Integration Examples

### In Metric Cards

```tsx
<EnhancedMetricCard
  title="Total Casualties"
  value={45000}
  icon={Users}
  footer={
    <EnhancedDataSourceBadge
      sources={casualtySources}
      quality="high"
      lastRefresh={lastUpdate}
    />
  }
/>
```

### In Chart Components

```tsx
<EnhancedChart
  type="line"
  data={chartData}
  footer={
    <EnhancedDataSourceBadge
      sources={dataSources}
      quality="medium"
      lastRefresh={lastUpdate}
      compact
    />
  }
/>
```

### In Footer

```tsx
<footer className="flex items-center gap-4">
  <EnhancedDataSourceBadge
    sources={ochaSources}
    quality="high"
    lastRefresh={ochaLastUpdate}
    onRefresh={refreshOchaData}
  />
  <EnhancedDataSourceBadge
    sources={wfpSources}
    quality="high"
    lastRefresh={wfpLastUpdate}
    onRefresh={refreshWfpData}
  />
</footer>
```

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators on interactive elements
- Semantic HTML structure
- Color contrast ratios meet WCAG 2.1 Level AA

## Performance

- Memoized calculations for time formatting
- Optimized animations using Framer Motion
- Lazy loading of modal content
- Efficient re-render prevention

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- `framer-motion`: Animation library
- `lucide-react`: Icon library
- `@radix-ui/react-dialog`: Modal component
- `@radix-ui/react-hover-card`: Popover component
