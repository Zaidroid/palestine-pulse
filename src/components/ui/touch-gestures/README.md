# Touch Gestures

Mobile-optimized touch gesture components for swipe navigation and pull-to-refresh functionality.

## Components

### SwipeableTabs

Enables swipe gestures for tab navigation on mobile devices.

```tsx
import { SwipeableTabs, SwipeableContent } from '@/components/ui/swipeable-tabs';

function MyTabs() {
  const [activeTab, setActiveTab] = useState('tab1');
  const tabs = ['tab1', 'tab2', 'tab3'];

  return (
    <SwipeableTabs
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={setActiveTab}
    >
      <TabsContent value="tab1">
        <SwipeableContent isActive={activeTab === 'tab1'}>
          {/* Tab 1 content */}
        </SwipeableContent>
      </TabsContent>
      {/* More tabs... */}
    </SwipeableTabs>
  );
}
```

### PullToRefresh

Implements pull-to-refresh gesture for mobile devices.

```tsx
import { PullToRefresh } from '@/components/ui/pull-to-refresh';

function MyContent() {
  const handleRefresh = async () => {
    // Fetch new data
    await fetchData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {/* Your content */}
    </PullToRefresh>
  );
}
```

## Features

### Swipe Navigation
- **Left Swipe**: Navigate to next tab
- **Right Swipe**: Navigate to previous tab
- **Configurable threshold**: Minimum swipe distance (default: 50px)
- **Velocity detection**: Ensures intentional swipes
- **Smooth animations**: Seamless transitions between tabs

### Pull to Refresh
- **Pull down gesture**: Trigger refresh by pulling down from top
- **Visual feedback**: Shows refresh indicator and progress
- **Threshold-based**: Only triggers when pulled past threshold (default: 80px)
- **Loading state**: Displays loading indicator during refresh
- **Scroll position aware**: Only works when scrolled to top

## Props

### SwipeableTabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Tab content |
| `activeTab` | `string` | - | Currently active tab |
| `tabs` | `string[]` | - | Array of tab identifiers |
| `onTabChange` | `(tab: string) => void` | - | Callback when tab changes |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable swipe gestures |

### PullToRefresh

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to wrap |
| `onRefresh` | `() => Promise<void>` | - | Async refresh function |
| `threshold` | `number` | `80` | Distance to trigger refresh (px) |
| `maxPullDistance` | `number` | `150` | Maximum pull distance (px) |
| `disabled` | `boolean` | `false` | Disable pull-to-refresh |
| `className` | `string` | - | Additional CSS classes |

## Usage Examples

### Dashboard with Swipe Navigation

```tsx
import { SwipeableTabs } from '@/components/ui/swipeable-tabs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['overview', 'analytics', 'reports'];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <SwipeableTabs
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      >
        <TabsContent value="overview">
          <SwipeableContent isActive={activeTab === 'overview'}>
            {/* Overview content */}
          </SwipeableContent>
        </TabsContent>
        {/* More tabs... */}
      </SwipeableTabs>
    </Tabs>
  );
}
```

### Data List with Pull-to-Refresh

```tsx
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useBreakpoint } from '@/hooks/useBreakpoint';

function DataList() {
  const { isMobile } = useBreakpoint();
  const [data, setData] = useState([]);

  const handleRefresh = async () => {
    const newData = await fetchData();
    setData(newData);
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      disabled={!isMobile}
    >
      <div className="space-y-4">
        {data.map(item => (
          <DataCard key={item.id} data={item} />
        ))}
      </div>
    </PullToRefresh>
  );
}
```

### Combined Usage

```tsx
function MobileDashboard() {
  const [activeTab, setActiveTab] = useState('tab1');
  const tabs = ['tab1', 'tab2', 'tab3'];

  const handleRefresh = async () => {
    // Refresh data for current tab
    await refreshTabData(activeTab);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <SwipeableTabs
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      >
        {/* Tab content */}
      </SwipeableTabs>
    </PullToRefresh>
  );
}
```

## Best Practices

1. **Mobile-First**: Enable gestures only on mobile devices for better UX
2. **Visual Feedback**: Always provide clear visual feedback during gestures
3. **Fallback Controls**: Provide button alternatives for non-touch devices
4. **Performance**: Keep refresh operations fast and efficient
5. **Accessibility**: Ensure keyboard navigation still works
6. **Error Handling**: Handle refresh failures gracefully

## Browser Support

- iOS Safari 10+
- Chrome for Android 60+
- Samsung Internet 8+
- Firefox for Android 68+

## Related Components

- `useTouchGestures` - Low-level touch gesture hooks
- `useBreakpoint` - Responsive breakpoint detection
- `MobileLayout` - Mobile-optimized layout wrapper
