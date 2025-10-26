# TimelineEventsChart - Quick Reference

## Import
```typescript
import { TimelineEventsChartWithFilters } from '@/components/charts/d3/TimelineEventsChartWithFilters';
import { TimelineEventsChart } from '@/components/charts/d3/TimelineEventsChart';
```

## Basic Usage
```typescript
<TimelineEventsChartWithFilters
  data={timeSeriesData}
  events={eventData}
  height={500}
  showFilters={true}
/>
```

## Data Format

### Time Series Data
```typescript
const data: TimeSeriesData[] = [
  {
    date: '2024-01-01',  // or Date object
    value: 150,
    category: 'casualties',
    metadata: { /* optional */ }
  }
];
```

### Event Data
```typescript
const events: EventData[] = [
  {
    date: '2024-01-15',
    title: 'Major Event',
    description: 'Detailed description of the event',
    type: 'escalation',  // ceasefire | escalation | humanitarian | political | attack | other
    severity: 'critical', // low | medium | high | critical (optional)
    casualties: 100,      // optional
    location: 'Gaza City' // optional
  }
];
```

## Props

### TimelineEventsChart
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TimeSeriesData[]` | required | Time-series data points |
| `events` | `EventData[]` | required | Event markers |
| `width` | `number` | auto | Chart width |
| `height` | `number` | 500 | Chart height |
| `lineColor` | `string` | theme | Data line color |
| `animated` | `boolean` | true | Enable animations |
| `interactive` | `boolean` | true | Enable interactivity |
| `showGrid` | `boolean` | true | Show grid lines |
| `showEventLabels` | `boolean` | true | Show event labels |
| `eventTypeFilter` | `EventData['type'][]` | undefined | Filter event types |
| `dateRange` | `{start: Date, end: Date}` | undefined | Filter date range |
| `onEventClick` | `(event) => void` | undefined | Event click handler |
| `onEventHover` | `(event) => void` | undefined | Event hover handler |

### TimelineEventsChartWithFilters
Includes all TimelineEventsChart props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showFilters` | `boolean` | true | Show filter controls |
| `defaultTimeRange` | `TimeRange` | 'all' | Default time range |
| `defaultEventTypes` | `EventData['type'][]` | all | Default event types |
| `onFiltersChange` | `(filters) => void` | undefined | Filter change handler |

## Event Types & Colors

| Type | Color (Light) | Color (Dark) | Icon |
|------|---------------|--------------|------|
| `ceasefire` | Green (#10b981) | Light Green (#34d399) | Heart |
| `escalation` | Red (#ef4444) | Light Red (#f87171) | TrendingUp |
| `humanitarian` | Blue (#3b82f6) | Light Blue (#60a5fa) | Heart |
| `political` | Purple (#8b5cf6) | Light Purple (#a78bfa) | Users |
| `attack` | Dark Red (#dc2626) | Light Red (#f87171) | Swords |
| `other` | Gray (#6b7280) | Light Gray (#9ca3af) | MoreHorizontal |

## Time Range Options

| Value | Label | Duration |
|-------|-------|----------|
| `'7d'` | Last 7 Days | 7 days |
| `'1m'` | Last Month | 30 days |
| `'3m'` | Last 3 Months | 90 days |
| `'1y'` | Last Year | 365 days |
| `'all'` | All Time | No filter |

## Examples

### With Custom Colors
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  lineColor="#3b82f6"
  height={600}
/>
```

### With Event Click Handler
```typescript
<TimelineEventsChartWithFilters
  data={data}
  events={events}
  onEventClick={(event) => {
    console.log('Event clicked:', event.title);
    // Navigate to detail page, show modal, etc.
  }}
/>
```

### With Custom Filters
```typescript
<TimelineEventsChartWithFilters
  data={data}
  events={events}
  defaultTimeRange="3m"
  defaultEventTypes={['escalation', 'attack']}
  onFiltersChange={(filters) => {
    console.log('Active filters:', filters);
  }}
/>
```

### Without Filters
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  eventTypeFilter={['ceasefire', 'humanitarian']}
  dateRange={{
    start: new Date('2024-01-01'),
    end: new Date('2024-03-31')
  }}
/>
```

## Customization

### Custom Value Formatter
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  valueFormatter={(value) => `${value.toLocaleString()} casualties`}
/>
```

### Custom Date Formatter
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  dateFormatter={(date) => date.toLocaleDateString('ar-SA')}
/>
```

### Disable Animations
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  animated={false}
/>
```

### Hide Event Labels
```typescript
<TimelineEventsChart
  data={data}
  events={events}
  showEventLabels={false}
/>
```

## RTL Support

The chart automatically adapts to RTL layout when Arabic language is selected:
- Timeline direction reverses
- Text alignment adjusts
- Tooltips position correctly
- Filter controls reverse

## Accessibility

- Semantic SVG with ARIA labels
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Respects `prefers-reduced-motion`

## Performance Tips

1. **Limit Events**: For best performance, limit to ~50 events
2. **Memoize Data**: Use `useMemo` for data transformations
3. **Lazy Load**: Use React.lazy for code splitting
4. **Debounce Filters**: Debounce filter changes if needed

## Common Use Cases

### Casualties Timeline
```typescript
<TimelineEventsChartWithFilters
  data={dailyCasualties}
  events={majorEvents}
  defaultEventTypes={['escalation', 'attack', 'ceasefire']}
  valueFormatter={(v) => `${v} casualties`}
/>
```

### Detention Timeline
```typescript
<TimelineEventsChartWithFilters
  data={monthlyArrests}
  events={policyChanges}
  defaultEventTypes={['political', 'other']}
  valueFormatter={(v) => `${v} arrests`}
/>
```

### Healthcare Attacks
```typescript
<TimelineEventsChartWithFilters
  data={attacksOverTime}
  events={majorIncidents}
  defaultEventTypes={['attack', 'humanitarian']}
  lineColor="#dc2626"
/>
```

## Troubleshooting

### Events Not Showing
- Check event dates are within data date range
- Verify event types match filter
- Ensure events array is not empty

### Tooltip Positioning Issues
- Adjust chart margins if needed
- Check container width is sufficient
- Verify tooltip content isn't too wide

### Animation Performance
- Reduce number of data points
- Disable animations on low-end devices
- Use `animated={false}` for testing

### RTL Layout Issues
- Ensure i18n is properly configured
- Check language is set to 'ar'
- Verify CSS logical properties are supported

## Related Components

- **AnimatedAreaChart**: For simple time-series without events
- **CalendarHeatmapChart**: For daily pattern visualization
- **InteractiveBarChart**: For categorical comparisons
- **SankeyFlowChart**: For flow visualization

## Demo

See `TimelineEventsChartDemo.tsx` for a complete working example with sample data.
