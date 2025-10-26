# Data Services

This directory contains data transformation and processing services for the Palestine Humanitarian Dashboard.

## DataTransformService

The `DataTransformService` provides core data transformation methods for converting raw data from local files into chart-ready formats for D3 visualizations.

### Features

- **Time-Series Aggregation**: Filter and aggregate data by time ranges (7d, 1m, 3m, 1y, all)
- **Category Grouping**: Group data by categories with automatic percentage calculation
- **Demographic Pyramids**: Transform age/gender data into population pyramid format
- **Flow Data**: Convert relational data into Sankey diagram format
- **Calendar Heatmaps**: Transform daily data into calendar heatmap format with intensity levels

### Installation

```typescript
import { dataTransformService } from '@/services/dataTransformService';
```

### API Reference

#### `aggregateByTimeRange(data, range, dateField, aggregation?)`

Filters and aggregates time-series data based on the specified time range.

**Parameters:**
- `data: any[]` - Array of time-series data points
- `range: '7d' | '1m' | '3m' | '1y' | 'all'` - Time range filter
- `dateField: string` - Name of the date field in the data objects (default: 'date')
- `aggregation?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'` - Optional aggregation period

**Returns:** `TimeSeriesData[]`

**Example:**
```typescript
const data = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 150 },
];
const filtered = dataTransformService.aggregateByTimeRange(data, '7d', 'date');
```

#### `groupByCategory(data, categoryField, valueField, options?)`

Aggregates data by a specified category field and calculates totals and percentages.

**Parameters:**
- `data: any[]` - Array of data objects
- `categoryField: string` - Name of the category field to group by
- `valueField: string` - Name of the value field to sum
- `options?: { sortBy?, sortOrder?, limit? }` - Optional configuration

**Returns:** `CategoryData[]`

**Example:**
```typescript
const data = [
  { type: 'hospital', count: 50 },
  { type: 'clinic', count: 30 },
];
const grouped = dataTransformService.groupByCategory(data, 'type', 'count', {
  sortBy: 'value',
  sortOrder: 'desc',
});
```

#### `transformToPyramid(data, ageField, genderField, options?)`

Converts demographic data into the format required for population pyramid charts.

**Parameters:**
- `data: any[]` - Array of demographic data
- `ageField: string` - Name of the age field
- `genderField: string` - Name of the gender field
- `options?: { ageGroupSize?, maxAge?, ageCategories? }` - Optional configuration

**Returns:** `PyramidData[]`

**Example:**
```typescript
const data = [
  { age: 25, gender: 'male' },
  { age: 30, gender: 'female' },
];
const pyramid = dataTransformService.transformToPyramid(data, 'age', 'gender');
```

#### `transformToFlow(data, sourceField, targetField, valueField?, options?)`

Converts relational data into the source-target-value format required for Sankey flow diagrams.

**Parameters:**
- `data: any[]` - Array of relational data
- `sourceField: string` - Name of the source field
- `targetField: string` - Name of the target field
- `valueField?: string` - Name of the value field (optional, defaults to count)
- `options?: { minValue?, aggregateBy? }` - Optional configuration

**Returns:** `FlowData[]`

**Example:**
```typescript
const data = [
  { from: 'Gaza City', to: 'Rafah', people: 1000 },
  { from: 'Gaza City', to: 'Khan Younis', people: 500 },
];
const flows = dataTransformService.transformToFlow(data, 'from', 'to', 'people');
```

#### `transformToCalendar(data, dateField, valueField, options?)`

Converts time-series data into the format required for calendar heatmap visualizations.

**Parameters:**
- `data: any[]` - Array of time-series data
- `dateField: string` - Name of the date field
- `valueField: string` - Name of the value field
- `options?: { intensityThresholds?, fillMissingDates? }` - Optional configuration

**Returns:** `CalendarData[]`

**Example:**
```typescript
const data = [
  { date: '2024-01-01', casualties: 50 },
  { date: '2024-01-02', casualties: 100 },
];
const calendar = dataTransformService.transformToCalendar(data, 'date', 'casualties', {
  fillMissingDates: true,
});
```

### Usage Examples

See `dataTransformService.example.ts` for comprehensive usage examples including:
- Time-series aggregation for area charts
- Category grouping for bar charts
- Demographic pyramids for population charts
- Flow data for Sankey diagrams
- Calendar heatmap data
- Combined transformations for comprehensive dashboards
- Integration with React hooks

### Testing

The service includes comprehensive unit tests covering all transformation methods:

```bash
npx vitest run src/services/__tests__/dataTransformService.test.ts
```

### Type Definitions

All data types are defined in `src/types/dashboard-data.types.ts`:
- `TimeSeriesData`
- `CategoryData`
- `FlowData`
- `PyramidData`
- `CalendarData`
- `TimeRange`
- `AggregationPeriod`

### Requirements

This service implements the following requirements from the dashboard redesign spec:
- **Requirement 1.3**: Data transformation for chart-ready formats
- **Requirement 2.1**: Time-series data for area charts
- **Requirement 2.2**: Demographic data for population pyramids
- **Requirement 2.3**: Flow data for Sankey diagrams

### Related Files

- `src/services/dataTransformService.ts` - Main service implementation
- `src/services/__tests__/dataTransformService.test.ts` - Unit tests
- `src/services/dataTransformService.example.ts` - Usage examples
- `src/types/dashboard-data.types.ts` - Type definitions
- `.kiro/specs/dashboard-d3-redesign/design.md` - Design documentation
- `.kiro/specs/dashboard-d3-redesign/requirements.md` - Requirements documentation
