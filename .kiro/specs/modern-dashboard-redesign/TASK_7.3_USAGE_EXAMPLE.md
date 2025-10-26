# ExportDialog Usage Examples

## Basic Usage (Image Export Only)

```typescript
import { AnimatedChart } from "@/components/v3/shared";

function MyChart() {
  return (
    <AnimatedChart
      title="My Chart"
      description="Chart description"
      height={400}
      enableImageExport={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {/* Chart content */}
        </LineChart>
      </ResponsiveContainer>
    </AnimatedChart>
  );
}
```

**Export Options Available**: PNG only

---

## Enhanced Usage (All Export Formats)

```typescript
import { AnimatedChart } from "@/components/v3/shared";

function MyChart() {
  const chartData = [
    { date: "2024-01-01", value: 100 },
    { date: "2024-01-02", value: 150 },
    { date: "2024-01-03", value: 120 },
  ];

  return (
    <AnimatedChart
      title="Daily Metrics"
      description="Tracking daily performance"
      height={400}
      chartData={chartData}           // ← Enables CSV/JSON export
      dataType="daily-metrics"         // ← Custom filename prefix
      enableImageExport={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* Chart content */}
        </LineChart>
      </ResponsiveContainer>
    </AnimatedChart>
  );
}
```

**Export Options Available**: PNG, CSV, JSON, PDF

**Generated Filenames**:
- PNG: `daily-metrics-2024-10-24.png`
- CSV: `daily-metrics-2024-10-24.csv`
- JSON: `daily-metrics-2024-10-24.json`
- PDF: `daily-metrics-2024-10-24.pdf`

---

## Real-World Example (Gaza Dashboard)

```typescript
import { AnimatedChart } from "@/components/v3/shared";
import { useFilteredData } from "@/hooks/useFilteredData";

function HumanitarianCrisis() {
  const { filteredData, loading } = useFilteredData();
  
  const dailyCasualtiesChart = useMemo(() => {
    return filteredData.map(item => ({
      date: item.date,
      killed: item.killed,
      injured: item.injured,
      total: item.killed + item.injured,
    }));
  }, [filteredData]);

  return (
    <AnimatedChart
      title="Daily Casualties with Anomaly Detection"
      description="Highlights days with statistically significant spikes in deaths"
      height={400}
      loading={loading}
      dataSources={["Tech4Palestine"]}
      dataQuality="high"
      chartData={dailyCasualtiesChart}    // ← Export this data
      dataType="gaza-daily-casualties"     // ← Custom filename
      enableImageExport={true}
      enableShare={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyCasualtiesChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="killed" 
            fill="#ef4444" 
            stroke="#dc2626" 
          />
          <Area 
            type="monotone" 
            dataKey="injured" 
            fill="#f59e0b" 
            stroke="#d97706" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedChart>
  );
}
```

**Export Options**:
- **PNG**: High-res chart image (2x pixel density)
- **CSV**: Data in Excel-compatible format
- **JSON**: Raw data for developers
- **PDF**: Printable document

**CSV Output Example**:
```csv
date,killed,injured,total
2024-01-01,45,120,165
2024-01-02,52,135,187
2024-01-03,38,98,136
```

**JSON Output Example**:
```json
[
  {
    "date": "2024-01-01",
    "killed": 45,
    "injured": 120,
    "total": 165
  },
  {
    "date": "2024-01-02",
    "killed": 52,
    "injured": 135,
    "total": 187
  }
]
```

---

## With Custom Export Handler

```typescript
import { AnimatedChart } from "@/components/v3/shared";
import { ExportFormat } from "@/components/export";

function MyChart() {
  const handleExportComplete = (format: ExportFormat) => {
    console.log(`Chart exported as ${format}`);
    
    // Track analytics
    trackEvent('chart_export', {
      format,
      chart: 'daily-casualties',
      timestamp: new Date().toISOString(),
    });
    
    // Show custom notification
    toast({
      title: 'Export Complete',
      description: `Your ${format.toUpperCase()} file is ready!`,
    });
  };

  return (
    <AnimatedChart
      title="My Chart"
      chartData={data}
      dataType="my-chart"
      onExport={handleExportComplete}  // ← Called after export
    >
      {/* Chart content */}
    </AnimatedChart>
  );
}
```

---

## Migration Guide

### Before (Simple Export)

```typescript
<AnimatedChart
  title="My Chart"
  onExport={handleExport}  // Simple PNG export
>
  {/* Chart content */}
</AnimatedChart>
```

### After (ExportDialog)

```typescript
<AnimatedChart
  title="My Chart"
  chartData={myData}              // ← Add data
  dataType="my-chart"             // ← Add type
  onExport={handleExportComplete} // ← Optional callback
>
  {/* Chart content */}
</AnimatedChart>
```

**Benefits**:
- ✅ Multiple export formats
- ✅ Preview before export
- ✅ Better user experience
- ✅ Data portability
- ✅ No breaking changes

---

## Props Reference

```typescript
interface AnimatedChartProps {
  // Chart display
  title?: string;
  description?: string;
  height?: number;
  
  // Export functionality
  chartData?: any;              // Data for CSV/JSON export
  dataType?: string;            // Filename prefix
  enableImageExport?: boolean;  // Show export button (default: true)
  onExport?: () => void;        // Callback after export
  
  // Other props...
  loading?: boolean;
  error?: Error | null;
  dataSources?: string[];
  enableShare?: boolean;
}
```

---

## Tips & Best Practices

### 1. Always Provide Chart Data
```typescript
// ✅ Good - Enables all export formats
<AnimatedChart chartData={data} dataType="sales">
  {/* Chart */}
</AnimatedChart>

// ⚠️ Limited - Only PNG export available
<AnimatedChart>
  {/* Chart */}
</AnimatedChart>
```

### 2. Use Descriptive Data Types
```typescript
// ✅ Good - Clear, descriptive filename
dataType="gaza-daily-casualties"
// Result: gaza-daily-casualties-2024-10-24.csv

// ❌ Bad - Generic filename
dataType="chart"
// Result: chart-2024-10-24.csv
```

### 3. Transform Data for Export
```typescript
// ✅ Good - Clean, exportable data
const exportData = useMemo(() => {
  return rawData.map(item => ({
    date: formatDate(item.date),
    value: item.value,
    category: item.category,
  }));
}, [rawData]);

<AnimatedChart chartData={exportData} />
```

### 4. Handle Large Datasets
```typescript
// ✅ Good - Limit export data size
const exportData = useMemo(() => {
  return largeDataset.slice(0, 10000); // Limit to 10k rows
}, [largeDataset]);

<AnimatedChart chartData={exportData} />
```

---

## Troubleshooting

### PNG Export Not Working
**Problem**: PNG export button is disabled

**Solution**: Ensure chart element is rendered
```typescript
// The chart must be visible and rendered
<AnimatedChart
  loading={false}  // ← Not loading
  error={null}     // ← No error
>
  {/* Chart content must be rendered */}
</AnimatedChart>
```

### CSV/JSON Export Shows Empty Data
**Problem**: Export shows `[]` or empty data

**Solution**: Pass chartData prop
```typescript
// ❌ Missing chartData
<AnimatedChart title="My Chart">

// ✅ With chartData
<AnimatedChart 
  title="My Chart"
  chartData={myData}  // ← Add this
>
```

### Export Dialog Not Opening
**Problem**: Clicking export does nothing

**Solution**: Check console for errors, ensure ExportDialog is imported
```typescript
// Verify import
import { AnimatedChart } from "@/components/v3/shared";

// Check browser console for errors
```

---

## Advanced Usage

### Custom Export Trigger
```typescript
import { ExportDialog } from "@/components/export";

function CustomExport() {
  return (
    <ExportDialog
      data={myData}
      dataType="custom-export"
      chartElement={chartRef.current}
      trigger={
        <Button variant="outline">
          <Download className="mr-2" />
          Custom Export Button
        </Button>
      }
    />
  );
}
```

### Programmatic Export
```typescript
import { exportChart } from "@/lib/chart-export";

async function exportChartProgrammatically() {
  const chartElement = document.getElementById('my-chart');
  
  await exportChart(chartElement, {
    filename: 'my-chart.png',
    format: 'png',
    scale: 2,
  });
}
```

---

## Summary

The ExportDialog integration provides a powerful, user-friendly way to export charts in multiple formats. By simply adding the `chartData` and `dataType` props to your AnimatedChart components, you enable comprehensive export functionality with minimal code changes.

**Key Takeaways**:
1. Add `chartData` prop to enable CSV/JSON/PDF export
2. Add `dataType` prop for better filenames
3. PNG export works automatically with chart element
4. Preview functionality helps users verify before export
5. Backward compatible - works without new props
