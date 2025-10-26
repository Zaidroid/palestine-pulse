# Design Document

## Overview

This design document outlines the architecture and implementation strategy for redesigning the Palestine Humanitarian Dashboard with D3.js visualizations, complete Arabic localization, and accurate data source attribution. The redesign leverages the existing local data infrastructure (`/public/data/`) and the interactive chart library (`AdvancedInteractiveDemo.tsx`) to create a cohesive, performant, and accessible dashboard experience.

### Design Goals

1. **Data-Driven Visualization**: Map each dataset to the most appropriate D3 chart type
2. **Consistent User Experience**: Apply unified patterns across all dashboard sub-tabs
3. **Bilingual Support**: Seamless English/Arabic switching with proper RTL layout
4. **Data Transparency**: Clear attribution and metadata for all visualizations
5. **Performance**: Fast loading and smooth interactions even with large datasets
6. **Accessibility**: WCAG 2.1 AA compliance for inclusive access

### Key Design Principles

- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with D3
- **Mobile-First**: Responsive layouts that adapt from mobile to desktop
- **Theme-Aware**: Consistent appearance in light and dark modes
- **Modular Architecture**: Reusable chart components with consistent APIs
- **Type Safety**: Full TypeScript coverage for data structures and components

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Dashboard   │  │   i18n       │      │
│  │   Router     │  │  Components  │  │   Provider   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Visualization Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  ChartCard   │  │  D3 Charts   │  │   Filters    │      │
│  │  Wrapper     │  │  Components  │  │   Controls   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Data Hooks  │  │  Transform   │  │   Cache      │      │
│  │  (React)     │  │  Services    │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Local Data Storage                         │
│  /public/data/hdx/        /public/data/worldbank/           │
│  /public/data/tech4palestine/  /public/data/goodshepherd/   │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture


#### Chart Component Hierarchy

```typescript
// Base Chart Component Structure
interface BaseChartProps {
  data: any[];
  width?: number;
  height?: number;
  loading?: boolean;
  theme: 'light' | 'dark';
  locale: 'en' | 'ar';
  onExport?: () => void;
  onShare?: () => void;
}

// ChartCard Wrapper (from AdvancedInteractiveDemo)
<ChartCard
  title={t('chart.title')}
  icon={<Icon />}
  badge="Chart Type"
  dataSource={{
    source: string,
    url?: string,
    lastUpdated: string,
    reliability: 'high' | 'medium' | 'low',
    methodology: string
  }}
  chartType="area" | "bar" | "donut" | ...
>
  <D3ChartComponent {...props} />
</ChartCard>
```

#### Data Flow Architecture

```
User Action → Filter Change → Hook Re-fetch → Transform Data → Update Chart → Animate Transition
     ↓              ↓              ↓               ↓              ↓              ↓
  onClick      setState      useEffect      useMemo      D3 Update    transition()
```

## Components and Interfaces

### Core Chart Components

#### 1. ChartCard Wrapper Component

**Purpose**: Unified container for all charts with consistent controls and metadata

**Interface**:
```typescript
interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  badge: string;
  children: React.ReactNode;
  dataSource: DataSourceMetadata;
  chartType: ChartType;
  filters?: FilterConfig;
  exportEnabled?: boolean;
  shareEnabled?: boolean;
}

interface DataSourceMetadata {
  source: string;
  url?: string;
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  methodology: string;
  recordCount?: number;
}
```

**Features**:
- Time filter tabs (7D, 1M, 3M, 1Y, All)
- Export button (PNG/CSV)
- Share button (URL with filters)
- Data source badge with hover panel
- Loading states
- Error boundaries


#### 2. D3 Chart Components Library

**15 Chart Types** (from AdvancedInteractiveDemo):

1. **AnimatedAreaChart**: Time-series trends with smooth area fills
2. **InteractiveBarChart**: Categorical comparisons with hover interactions
3. **AdvancedDonutChart**: Proportional breakdowns with center statistics
4. **StreamGraphChart**: Stacked area showing flow over time
5. **RadarChart**: Multi-dimensional comparisons
6. **SankeyFlowChart**: Flow between categories/regions
7. **ViolinPlotChart**: Distribution analysis with quartiles
8. **ChordDiagramChart**: Inter-relationships between entities
9. **CalendarHeatmapChart**: Daily patterns in calendar format
10. **PopulationPyramidChart**: Age/gender demographic breakdowns
11. **IsotypeChart**: Humanized representation with icons
12. **WaffleChart**: Proportional grid representation
13. **TimelineEventsChart**: Timeline with annotated events
14. **SmallMultiplesChart**: Synchronized regional comparisons
15. **HorizonChart**: Compact multi-metric overview

**Common Chart Interface**:
```typescript
interface D3ChartProps {
  data: any[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  theme: 'light' | 'dark';
  locale: 'en' | 'ar';
  animated?: boolean;
  interactive?: boolean;
  onDataPointClick?: (data: any) => void;
  onDataPointHover?: (data: any) => void;
}
```

### Data Transformation Services

#### DataTransformService

**Purpose**: Transform raw data from local files into chart-ready formats

**Key Methods**:
```typescript
class DataTransformService {
  // Time-series aggregation
  aggregateByTimeRange(
    data: any[],
    range: '7d' | '1m' | '3m' | '1y' | 'all',
    dateField: string
  ): any[];

  // Category grouping
  groupByCategory(
    data: any[],
    categoryField: string,
    valueField: string
  ): CategoryData[];

  // Demographic transformation
  transformToPyramid(
    data: any[],
    ageField: string,
    genderField: string
  ): PyramidData;

  // Flow transformation for Sankey
  transformToFlow(
    data: any[],
    sourceField: string,
    targetField: string,
    valueField: string
  ): FlowData;

  // Calendar heatmap transformation
  transformToCalendar(
    data: any[],
    dateField: string,
    valueField: string
  ): CalendarData[];
}
```


### Localization Architecture

#### i18n Structure

**Translation Files**:
```
src/i18n/locales/
├── en.json          # English translations
├── ar.json          # Arabic translations
└── common.json      # Shared translations
```

**Translation Keys Structure**:
```json
{
  "dashboards": {
    "gaza": {
      "healthcare": {
        "title": "Healthcare System Status",
        "subtitle": "Monitoring medical infrastructure",
        "charts": {
          "hospitalStatus": "Hospital Operational Status",
          "attacksTimeline": "Healthcare Attacks Timeline",
          "supplyAvailability": "Medical Supply Availability"
        },
        "metrics": {
          "totalHospitals": "Total Hospitals",
          "operationalBeds": "Operational Beds",
          "healthcareWorkers": "Healthcare Workers"
        }
      }
    }
  },
  "charts": {
    "filters": {
      "7d": "Last 7 Days",
      "1m": "Last Month",
      "3m": "Last 3 Months",
      "1y": "Last Year",
      "all": "All Time"
    },
    "actions": {
      "export": "Export",
      "share": "Share",
      "filter": "Filter"
    }
  }
}
```

#### RTL Layout System

**CSS Strategy**:
```css
/* Logical properties for RTL support */
[dir="rtl"] {
  /* Use logical properties */
  margin-inline-start: 1rem;  /* Instead of margin-left */
  padding-inline-end: 1rem;   /* Instead of padding-right */
  
  /* Flip flex direction */
  flex-direction: row-reverse;
  
  /* Flip text alignment */
  text-align: start;  /* Instead of left */
}

/* Chart-specific RTL adjustments */
[dir="rtl"] .chart-axis-label {
  text-anchor: end;
}

[dir="rtl"] .chart-legend {
  direction: rtl;
}
```

**D3 RTL Adjustments**:
```typescript
// Adjust scales for RTL
const xScale = locale === 'ar' 
  ? d3.scaleLinear().domain([max, 0]).range([0, width])
  : d3.scaleLinear().domain([0, max]).range([0, width]);

// Flip text anchors
const textAnchor = locale === 'ar' ? 'end' : 'start';
```


## Data Models

### Data Source Mapping

#### Gaza Strip Dashboards

**1. Healthcare Status** (`/dashboards/HealthcareStatus`)
- **Data Sources**: 
  - `goodshepherd/healthcare/` - Healthcare attacks (2,900 records)
  - `hdx/health/` - Health facilities data
- **Charts**:
  - Hospital Status: AdvancedDonutChart (operational/partial/non-operational)
  - Attacks Timeline: AnimatedAreaChart (attacks over time)
  - Attacks by Type: InteractiveBarChart (facility types targeted)
  - Supply Availability: InteractiveBarChart (stock levels)
  - Healthcare Workers: Custom stat cards
  - Attacks by Region: SmallMultiplesChart (governorate comparison)

**2. Displacement Stats** (`/dashboards/DisplacementStats`)
- **Data Sources**:
  - `hdx/displacement/` - IDP movement data
  - `hdx/humanitarian/` - Shelter data
- **Charts**:
  - Displacement Flow: SankeyFlowChart (origin → destination)
  - Temporal Trends: StreamGraphChart (IDP numbers over time)
  - Regional Distribution: SmallMultiplesChart (by governorate)
  - Shelter Capacity: InteractiveBarChart (capacity vs occupancy)
  - Daily Displacement: CalendarHeatmapChart (daily patterns)

**3. Education Impact** (`/dashboards/EducationImpact`)
- **Data Sources**:
  - `hdx/education/` - School damage data
  - `worldbank/` - Enrollment indicators (SE.PRM.ENRR, SE.SEC.ENRR)
- **Charts**:
  - School Damage: InteractiveBarChart (destroyed/damaged/operational)
  - Enrollment Trends: AnimatedAreaChart (pre/post conflict)
  - Impact by Region: SmallMultiplesChart (governorate comparison)
  - Student Displacement: WaffleChart (% affected)
  - Education Access: RadarChart (multi-dimensional impact)

**4. Economic Impact** (`/dashboards/EconomicImpact`)
- **Data Sources**:
  - `worldbank/` - Economic indicators (NY.GDP.*, SL.UEM.*, SI.POV.*)
- **Charts**:
  - GDP Trends: HorizonChart (multiple economic metrics)
  - Unemployment: AnimatedAreaChart (total, male, female)
  - Poverty Indicators: RadarChart (multi-dimensional poverty)
  - Trade Impact: ChordDiagramChart (import/export relationships)
  - Sector Breakdown: AdvancedDonutChart (economic sectors)

**5. Food Security** (`/dashboards/FoodSecurity`)
- **Data Sources**:
  - `hdx/food-security/` - Food insecurity data
  - `hdx/humanitarian/` - Aid distribution
- **Charts**:
  - Food Insecurity Levels: AnimatedAreaChart (IPC phases over time)
  - Aid Distribution: SankeyFlowChart (source → distribution points)
  - Malnutrition Rates: ViolinPlotChart (distribution by region)
  - Access to Food: InteractiveBarChart (% population by access level)
  - Daily Caloric Intake: CalendarHeatmapChart (daily patterns)

**6. Utilities Status** (`/dashboards/UtilitiesStatus`)
- **Data Sources**:
  - `hdx/infrastructure/` - Infrastructure damage
  - `worldbank/` - Electricity access (EG.ELC.ACCS.ZS)
- **Charts**:
  - Infrastructure Status: InteractiveBarChart (water, electricity, sewage)
  - Outage Patterns: CalendarHeatmapChart (daily outages)
  - Capacity Trends: AnimatedAreaChart (capacity over time)
  - Regional Access: SmallMultiplesChart (by governorate)
  - Damage Assessment: AdvancedDonutChart (damage levels)


#### West Bank Dashboards

**7. Prisoners Stats** (`/dashboards/PrisonersStats`)
- **Data Sources**:
  - `goodshepherd/prisoners/` - Child prisoners (206 records), Political prisoners (19 records)
- **Charts**:
  - Total Detainees: IsotypeChart (humanized representation, 1 icon = 10 people)
  - Demographic Breakdown: PopulationPyramidChart (age/gender)
  - Detention Timeline: TimelineEventsChart (with major events annotated)
  - Detention Duration: ViolinPlotChart (distribution of detention lengths)
  - Monthly Arrests: AnimatedAreaChart (arrests over time)
  - Detention Centers: InteractiveBarChart (by facility)

**8. Settlement Expansion** (`/dashboards/SettlementExpansion`)
- **Data Sources**:
  - `goodshepherd/demolitions/` - Home demolitions (1,000 records)
  - Custom settlement data (to be integrated)
- **Charts**:
  - Expansion Timeline: AnimatedAreaChart (settlement growth)
  - Land Seizure: InteractiveBarChart (by region)
  - Demolitions: CalendarHeatmapChart (daily demolition patterns)
  - Regional Impact: ChordDiagramChart (settlement-village relationships)
  - Demolition Types: AdvancedDonutChart (administrative/punitive/military)

**9. West Bank Economic** (`/dashboards/EconomicImpact`)
- **Data Sources**:
  - `worldbank/` - Economic indicators (same as Gaza but West Bank specific)
- **Charts**:
  - Economic Indicators: HorizonChart (GDP, unemployment, poverty)
  - Unemployment Trends: AnimatedAreaChart (by gender)
  - Sector Analysis: RadarChart (agriculture, services, industry)
  - Trade Restrictions: InteractiveBarChart (impact by sector)
  - Income Distribution: ViolinPlotChart (income inequality)

#### Casualties Overview (Main Dashboard)

**10. Casualties Timeline** (`/components/charts/CasualtiesTimelineChart`)
- **Data Sources**:
  - `tech4palestine/casualties/` - Daily casualties (748 records)
  - `tech4palestine/killed-in-gaza/` - Detailed casualties (60,200 records)
- **Charts**:
  - Main Timeline: AnimatedAreaChart (total killed/injured over time)
  - Daily Casualties: CalendarHeatmapChart (intensity by day)
  - Demographic Breakdown: PopulationPyramidChart (age/gender of casualties)
  - Casualty Types: AdvancedDonutChart (civilians, children, women, press)
  - Weekly Patterns: StreamGraphChart (casualties by category)

### Data Type Definitions

```typescript
// Common data structures
interface TimeSeriesData {
  date: string | Date;
  value: number;
  category?: string;
}

interface CategoryData {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface FlowData {
  source: string;
  target: string;
  value: number;
}

interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}

interface CalendarData {
  date: string;
  value: number;
  intensity?: 'low' | 'medium' | 'high' | 'critical';
}

interface EventData {
  date: string;
  title: string;
  description: string;
  type: 'ceasefire' | 'escalation' | 'humanitarian' | 'political';
}

// Data source metadata
interface DatasetMetadata {
  source: string;
  category: string;
  recordCount: number;
  dateRange?: {
    start: string;
    end: string;
  };
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  methodology: string;
  url?: string;
}
```


## Error Handling

### Error Boundary Strategy

**Component-Level Error Boundaries**:
```typescript
class ChartErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <h3 className="font-semibold">Chart Error</h3>
            <p className="text-sm text-muted-foreground">
              Unable to render this visualization. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
```

### Data Loading States

**Loading Skeleton Pattern**:
```typescript
{loading ? (
  <Skeleton className="h-[400px] w-full" />
) : error ? (
  <ErrorState message={error.message} />
) : data.length === 0 ? (
  <EmptyState message={t('charts.noData')} />
) : (
  <D3Chart data={data} {...props} />
)}
```

### Data Validation

**Pre-render Validation**:
```typescript
function validateChartData(data: any[], requiredFields: string[]): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;
  
  return data.every(item => 
    requiredFields.every(field => 
      item.hasOwnProperty(field) && item[field] != null
    )
  );
}
```

## Testing Strategy

### Unit Testing

**Chart Component Tests**:
```typescript
describe('AnimatedAreaChart', () => {
  it('renders with valid data', () => {
    const data = [{ date: '2024-01-01', value: 100 }];
    render(<AnimatedAreaChart data={data} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<AnimatedAreaChart data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it('applies theme colors correctly', () => {
    const { container } = render(
      <AnimatedAreaChart data={mockData} theme="dark" />
    );
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', expect.stringContaining('hsl'));
  });
});
```

### Integration Testing

**Dashboard Integration Tests**:
```typescript
describe('HealthcareStatus Dashboard', () => {
  it('loads and displays all charts', async () => {
    render(<HealthcareStatus />);
    
    await waitFor(() => {
      expect(screen.getByText(/hospital operational status/i)).toBeInTheDocument();
      expect(screen.getByText(/healthcare attacks/i)).toBeInTheDocument();
    });
  });

  it('filters data when time range changes', async () => {
    render(<HealthcareStatus />);
    
    const monthFilter = screen.getByText('1M');
    fireEvent.click(monthFilter);
    
    await waitFor(() => {
      expect(screen.getByText(/filtered by: last month/i)).toBeInTheDocument();
    });
  });
});
```

### Accessibility Testing

**A11y Compliance Tests**:
```typescript
describe('Chart Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<AnimatedAreaChart data={mockData} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation', () => {
    render(<ChartCard {...props} />);
    const exportButton = screen.getByText(/export/i);
    exportButton.focus();
    expect(exportButton).toHaveFocus();
  });

  it('respects prefers-reduced-motion', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }));
    
    const { container } = render(<AnimatedAreaChart data={mockData} />);
    // Verify animations are disabled
  });
});
```


## Performance Optimization

### Data Loading Strategy

**Lazy Loading Pattern**:
```typescript
// Lazy load chart components
const AnimatedAreaChart = lazy(() => 
  import('@/components/charts/demo/AnimatedAreaChart')
);

// Use Suspense with loading fallback
<Suspense fallback={<Skeleton className="h-[400px]" />}>
  <AnimatedAreaChart data={data} />
</Suspense>
```

**Data Caching**:
```typescript
// React Query for data caching
const { data, isLoading } = useQuery({
  queryKey: ['healthcare-attacks', timeRange],
  queryFn: () => fetchHealthcareAttacks(timeRange),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

### Chart Rendering Optimization

**Memoization**:
```typescript
// Memoize expensive calculations
const processedData = useMemo(() => {
  return transformDataForChart(rawData, filters);
}, [rawData, filters]);

// Memoize chart component
const MemoizedChart = memo(AnimatedAreaChart, (prev, next) => {
  return prev.data === next.data && prev.theme === next.theme;
});
```

**Virtual Scrolling for Large Datasets**:
```typescript
// Use react-window for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={data.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <DataRow data={data[index]} />
    </div>
  )}
</FixedSizeList>
```

### D3 Performance Best Practices

**Efficient Updates**:
```typescript
// Use D3's enter/update/exit pattern
const update = svg.selectAll('circle').data(data, d => d.id);

// Enter
update.enter()
  .append('circle')
  .attr('r', 0)
  .transition()
  .duration(300)
  .attr('r', 5);

// Update
update
  .transition()
  .duration(300)
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y));

// Exit
update.exit()
  .transition()
  .duration(300)
  .attr('r', 0)
  .remove();
```

**Canvas for Large Datasets**:
```typescript
// Use Canvas instead of SVG for >1000 data points
const useCanvas = data.length > 1000;

if (useCanvas) {
  const canvas = d3.select(ref.current)
    .append('canvas')
    .attr('width', width)
    .attr('height', height);
  
  const context = canvas.node().getContext('2d');
  // Draw with canvas API
} else {
  // Use SVG for smaller datasets
}
```

## Deployment Considerations

### Build Optimization

**Code Splitting**:
```typescript
// Route-based code splitting
const HealthcareStatus = lazy(() => 
  import('@/components/dashboards/HealthcareStatus')
);
const DisplacementStats = lazy(() => 
  import('@/components/dashboards/DisplacementStats')
);

// Chart library code splitting
const chartComponents = {
  area: lazy(() => import('@/components/charts/demo/AnimatedAreaChart')),
  bar: lazy(() => import('@/components/charts/demo/InteractiveBarChart')),
  // ... other chart types
};
```

**Bundle Size Optimization**:
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3': ['d3'],
          'charts': [
            './src/components/charts/demo/AnimatedAreaChart',
            './src/components/charts/demo/InteractiveBarChart',
            // ... other chart components
          ],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### Asset Optimization

**Image Optimization**:
- Use WebP format for images with PNG fallback
- Lazy load images below the fold
- Use appropriate image sizes for different viewports

**Font Optimization**:
- Subset fonts to include only required characters
- Use font-display: swap for faster initial render
- Preload critical fonts


## Migration Strategy

### Phase 1: Foundation (Week 1)

1. **Data Analysis & Mapping**
   - Audit all data sources in `/public/data/`
   - Create data-to-dashboard mapping document
   - Define TypeScript interfaces for all data structures

2. **Component Library Setup**
   - Extract chart components from AdvancedInteractiveDemo
   - Create reusable ChartCard wrapper
   - Set up chart component storybook

3. **Localization Infrastructure**
   - Expand i18n JSON files with all dashboard translations
   - Implement RTL CSS utilities
   - Create locale-aware number/date formatters

### Phase 2: Core Charts (Week 2-3)

1. **Implement Priority Charts**
   - AnimatedAreaChart (most used)
   - InteractiveBarChart (most used)
   - AdvancedDonutChart (most used)
   - CalendarHeatmapChart (unique to this domain)
   - PopulationPyramidChart (demographic data)

2. **Data Transformation Services**
   - Time-series aggregation
   - Category grouping
   - Flow transformation for Sankey
   - Calendar transformation

3. **Testing & Validation**
   - Unit tests for each chart
   - Visual regression tests
   - Accessibility audits

### Phase 3: Dashboard Redesign (Week 4-5)

1. **Gaza Dashboards**
   - Healthcare Status
   - Displacement Stats
   - Education Impact
   - Economic Impact
   - Food Security
   - Utilities Status

2. **West Bank Dashboards**
   - Prisoners Stats
   - Settlement Expansion
   - Economic Impact

3. **Main Dashboard**
   - Casualties Timeline
   - Overview Statistics

### Phase 4: Localization & Polish (Week 6)

1. **Arabic Translation**
   - Translate all UI strings
   - Translate chart labels and tooltips
   - Translate data source descriptions

2. **RTL Layout**
   - Apply RTL styles to all components
   - Test chart rendering in RTL
   - Adjust D3 scales for RTL

3. **Data Source Attribution**
   - Update all DataSourceBadge components
   - Consolidate footer sources
   - Add methodology descriptions

### Phase 5: Testing & Optimization (Week 7)

1. **Performance Testing**
   - Lighthouse audits
   - Bundle size analysis
   - Load time optimization

2. **Accessibility Testing**
   - Screen reader testing
   - Keyboard navigation testing
   - Color contrast validation

3. **Cross-browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)
   - RTL rendering in all browsers

### Phase 6: Deployment (Week 8)

1. **Staging Deployment**
   - Deploy to staging environment
   - User acceptance testing
   - Bug fixes

2. **Production Deployment**
   - Gradual rollout with feature flags
   - Monitor performance metrics
   - Gather user feedback

3. **Documentation**
   - Update README with new features
   - Create user guide for new visualizations
   - Document data source integration

## Design Decisions & Rationale

### Why D3.js Over Recharts?

**Decision**: Migrate from Recharts to D3.js for all visualizations

**Rationale**:
1. **Flexibility**: D3 provides complete control over SVG/Canvas rendering
2. **Performance**: Better performance with large datasets (>1000 points)
3. **Animations**: More sophisticated animation capabilities
4. **Customization**: Easier to create custom chart types (Sankey, Chord, Isotype)
5. **Industry Standard**: D3 is the de facto standard for data visualization

**Trade-offs**:
- Higher development complexity
- Steeper learning curve
- More code to maintain

### Why ChartCard Wrapper Pattern?

**Decision**: Use a unified ChartCard wrapper for all charts

**Rationale**:
1. **Consistency**: Ensures all charts have the same controls and metadata
2. **Reusability**: Reduces code duplication across dashboards
3. **Maintainability**: Changes to controls apply to all charts
4. **User Experience**: Familiar interface across all visualizations

### Why Local Data Over API Calls?

**Decision**: Continue using local JSON files instead of real-time API calls

**Rationale**:
1. **Reliability**: No dependency on external API availability
2. **Performance**: Faster load times with local data
3. **Cost**: No API rate limits or costs
4. **Offline**: Dashboard works without internet connection
5. **Automation**: GitHub Actions keep data updated daily

### Why React Query for Data Management?

**Decision**: Use React Query for data fetching and caching

**Rationale**:
1. **Caching**: Automatic caching reduces redundant data processing
2. **Loading States**: Built-in loading/error state management
3. **Refetching**: Automatic background refetching keeps data fresh
4. **DevTools**: Excellent debugging tools
5. **TypeScript**: Full TypeScript support

## Future Enhancements

### Post-Launch Improvements

1. **Real-time Updates**
   - WebSocket integration for live data updates
   - Push notifications for critical events

2. **Advanced Analytics**
   - Predictive modeling with ML
   - Anomaly detection
   - Correlation analysis

3. **Collaboration Features**
   - Shared dashboards with custom views
   - Annotations and comments on charts
   - Export to presentation formats

4. **Additional Languages**
   - French, Spanish, Hebrew
   - Automatic translation with AI

5. **Mobile App**
   - Native iOS/Android apps
   - Offline-first architecture
   - Push notifications

6. **API for Researchers**
   - Public API for data access
   - GraphQL endpoint
   - Rate limiting and authentication

## Conclusion

This design provides a comprehensive blueprint for redesigning the Palestine Humanitarian Dashboard with modern D3.js visualizations, complete Arabic localization, and accurate data attribution. The modular architecture ensures maintainability and scalability, while the phased migration strategy minimizes risk and allows for iterative improvements.

The design prioritizes:
- **User Experience**: Intuitive, responsive, accessible interface
- **Data Transparency**: Clear attribution and methodology
- **Performance**: Fast loading and smooth interactions
- **Maintainability**: Clean code with comprehensive testing
- **Internationalization**: Full bilingual support with RTL

By following this design, the dashboard will provide a world-class data visualization experience that serves researchers, journalists, humanitarian workers, and the general public in understanding the humanitarian situation in Palestine.
