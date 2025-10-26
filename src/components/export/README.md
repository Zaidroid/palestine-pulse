# Export and Share Features

Comprehensive export and sharing functionality for the Palestine Pulse dashboard.

## Components

### ExportDialog
Modal dialog for exporting data in multiple formats with preview support.

```typescript
import { ExportDialog } from '@/components/export';

<ExportDialog 
  data={myData}
  dataType="casualties"
  chartElement={chartRef.current}
  onExportComplete={(format) => console.log(`Exported as ${format}`)}
/>
```

**Props:**
- `data`: Data to export (any type)
- `dataType`: Label for the data (string)
- `trigger?`: Custom trigger button (ReactNode)
- `chartElement?`: Chart DOM element for PNG export (HTMLElement)
- `onExportComplete?`: Callback after successful export (function)

**Supported Formats:**
- PNG (high-resolution 2x)
- PDF (document format)
- CSV (spreadsheet)
- JSON (data format)

---

### ChartExportButton
Button with dropdown for exporting charts in multiple image formats.

```typescript
import { ChartExportButton } from '@/components/export';

<ChartExportButton 
  chartElement={chartRef.current}
  chartTitle="casualties-trend"
  variant="outline"
  size="sm"
/>
```

**Props:**
- `chartElement`: Chart DOM element (HTMLElement)
- `chartTitle?`: Title for filename generation (string)
- `className?`: Additional CSS classes (string)
- `variant?`: Button variant (default | outline | ghost)
- `size?`: Button size (default | sm | lg | icon)
- `showLabel?`: Show/hide button label (boolean)

**Supported Formats:**
- PNG (high-res 2x)
- JPG (compressed)
- WebP (modern)
- SVG (vector)

---

### ShareButton
Button with dropdown for sharing dashboard views with preserved state.

```typescript
import { ShareButton } from '@/components/export';

<ShareButton 
  title="Gaza Dashboard"
  description="View humanitarian data"
  state={{
    view: 'gaza',
    dateRange: '30d',
    filters: ['casualties']
  }}
/>
```

**Props:**
- `title?`: Share title (string)
- `description?`: Share description (string)
- `url?`: Custom URL (string, defaults to current)
- `state?`: State to encode in URL (object)
- `className?`: Additional CSS classes (string)
- `variant?`: Button variant (default | outline | ghost)
- `size?`: Button size (default | sm | lg | icon)
- `showLabel?`: Show/hide button label (boolean)

**Share Options:**
- Copy link to clipboard
- Native mobile share
- Twitter
- Facebook
- LinkedIn
- Email

---

### CopyDataButton
Button with dropdown for copying data to clipboard in various formats.

```typescript
import { CopyDataButton } from '@/components/export';

<CopyDataButton 
  data={tableData}
  dataLabel="Gaza regions"
  defaultFormat="csv"
/>
```

**Props:**
- `data`: Data to copy (any type)
- `dataLabel?`: Label for notifications (string)
- `className?`: Additional CSS classes (string)
- `variant?`: Button variant (default | outline | ghost)
- `size?`: Button size (default | sm | lg | icon)
- `showLabel?`: Show/hide button label (boolean)
- `defaultFormat?`: Default copy format (CopyFormat)

**Supported Formats:**
- CSV (with headers)
- JSON (pretty)
- JSON (minified)
- Plain text (aligned table)
- Markdown (table)

---

## Utilities

### Chart Export
```typescript
import { exportChart, exportChartAsPNG } from '@/components/export';

// Export with auto-format detection
await exportChart(chartElement, {
  filename: 'my-chart.png',
  format: 'png',
  scale: 2,
  quality: 1.0
});

// Export specific format
await exportChartAsPNG(chartElement, {
  filename: 'chart.png',
  scale: 2
});
```

### Data Copy
```typescript
import { copyDataToClipboard, formatAsCSV } from '@/components/export';

// Copy to clipboard
await copyDataToClipboard(data, {
  format: 'csv',
  includeHeaders: true
});

// Format without copying
const csvString = formatAsCSV(data, true, ',');
```

### Notifications
```typescript
import { 
  showExportSuccessNotification,
  showExportErrorNotification 
} from '@/components/export';

// Success notification
showExportSuccessNotification({
  format: 'csv',
  filename: 'data.csv',
  size: '2.5 KB'
});

// Error notification
showExportErrorNotification(error, 'csv');
```

---

## Hooks

### useShareableState
Manage application state in URL parameters for sharing.

```typescript
import { useShareableState } from '@/components/export';

const MyComponent = () => {
  const { state, updateState, clearState, getShareableUrl } = useShareableState({
    defaultState: { view: 'gaza' },
    onStateChange: (newState) => console.log(newState)
  });

  // Update state (updates URL)
  updateState({ dateRange: '30d' });

  // Get shareable URL
  const url = getShareableUrl();

  // Clear state
  clearState();
};
```

### useRestoreFromUrl
Restore state from URL parameters on component mount.

```typescript
import { useRestoreFromUrl } from '@/components/export';

const MyComponent = () => {
  const restoredState = useRestoreFromUrl(
    { view: 'gaza', dateRange: '7d' },
    (state) => {
      // Apply restored state
      setFilters(state.filters);
    }
  );
};
```

---

## Integration Examples

### Dashboard with All Features
```typescript
import { 
  ExportDialog,
  ChartExportButton,
  CopyDataButton,
  ShareButton 
} from '@/components/export';

const Dashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([...]);
  const [filters, setFilters] = useState({...});

  return (
    <div>
      {/* Header with export/share buttons */}
      <div className="flex gap-2">
        <ExportDialog 
          data={data} 
          dataType="casualties"
          chartElement={chartRef.current}
        />
        <ShareButton 
          state={{ 
            view: 'gaza',
            filters 
          }}
        />
      </div>

      {/* Chart with export button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Casualties Trend</CardTitle>
            <ChartExportButton 
              chartElement={chartRef.current}
              chartTitle="casualties-trend"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef}>
            {/* Chart component */}
          </div>
        </CardContent>
      </Card>

      {/* Table with copy button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Regional Data</CardTitle>
            <CopyDataButton 
              data={tableData}
              dataLabel="regions"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table component */}
        </CardContent>
      </Card>
    </div>
  );
};
```

### Custom Export Trigger
```typescript
<ExportDialog 
  data={data}
  dataType="casualties"
  trigger={
    <Button variant="ghost" size="icon">
      <Download className="h-4 w-4" />
    </Button>
  }
/>
```

### Programmatic Export
```typescript
import { exportChart, copyDataToClipboard } from '@/components/export';

const handleExport = async () => {
  try {
    await exportChart(chartRef.current, {
      format: 'png',
      scale: 2
    });
  } catch (error) {
    console.error('Export failed:', error);
  }
};

const handleCopy = async () => {
  try {
    await copyDataToClipboard(data, {
      format: 'csv',
      includeHeaders: true
    });
  } catch (error) {
    console.error('Copy failed:', error);
  }
};
```

---

## Browser Support

### Full Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partial Support
- Older browsers: Clipboard fallback
- No native share: Copy link fallback
- No WebP: PNG/JPG alternatives

---

## Performance Tips

1. **Chart Export**: Use refs to avoid re-renders
2. **Large Data**: Show warning for exports > 1MB
3. **Preview**: Generate only when shown
4. **Cleanup**: Revoke blob URLs after download
5. **Debounce**: Debounce format changes in preview

---

## Accessibility

All components support:
- Keyboard navigation
- Screen reader labels
- Focus management
- ARIA attributes
- High contrast mode

---

## Troubleshooting

### Export not working
- Check if data is available
- Verify chart element ref is set
- Check browser console for errors

### Share URL not preserving state
- Ensure state is serializable
- Check URL parameter encoding
- Verify navigation is working

### Copy to clipboard failing
- Check browser permissions
- Verify clipboard API support
- Use fallback for older browsers

### Chart export quality issues
- Increase scale (2x or 3x)
- Check chart rendering
- Verify canvas support

---

## Demo

See `ExportShareDemo.tsx` for a comprehensive demonstration of all features.

```typescript
import { ExportShareDemo } from '@/components/export';

<ExportShareDemo />
```
