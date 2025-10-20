# UI Standardization & Filter Integration Plan

## Overview
This document outlines the plan to standardize all 8 subtabs across Gaza and West Bank dashboards with a **hybrid approach**: maintaining critical information panels while ensuring a minimum of **4 metric cards + 4 charts** per subtab, with full filter integration.

## Design Principles

### Layout Standard
- **Top Section**: Exactly 4 expandable metric cards in a responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop)
- **Chart Section**: Minimum 4 charts in 2x2 grid layout (2 rows, 2 charts per row)
- **Info Panels**: Keep only the most critical panels that provide contextual information not suitable for charts
- **Consistent Dimensions**: All cards must have uniform height, padding, and spacing

### Filter Integration
- All subtabs must use `useFilteredData` hook from `@/hooks/useFilteredData.ts`
- Date range filtering via `useV3Store` date range
- Metric cards show calculated values from filtered data
- Charts display filtered data dynamically
- Real-time updates when filters change

### Data Quality
- All cards show `dataQuality` badges
- All cards list `dataSources`
- Prefer real API data over hardcoded values
- Use `loading` states properly

---

## Subtab-by-Subtab Analysis

### 1. Gaza - Humanitarian Crisis ✅

**Current State**: COMPLIANT
- 4 metric cards ✅
- 4 charts (Daily Casualties, Demographic Breakdown, Age Groups, Press List) ✅
- Uses `useFilteredData` ✅

**Actions Required**:
- ✅ Verify filter integration is working correctly
- ✅ Ensure all metrics recalculate from filtered data
- Test with different date ranges and filters

---

### 2. Gaza - Infrastructure Destruction 🔧

**Current State**: PARTIAL
- 4 metric cards ✅
- 2 charts (Infrastructure Timeline, Healthcare Status gauge section)
- No filter integration ❌

**Changes Needed**:
1. **Add 2 New Charts**:
   - **Chart 3**: "Building Destruction by Category" - Horizontal bar chart showing residential, schools, hospitals, mosques, churches, cultural sites
   - **Chart 4**: "Infrastructure Damage Over Time" - Area chart showing cumulative destruction across different infrastructure types

2. **Filter Integration**:
   - Import and use `useFilteredData` hook
   - Connect infrastructure data to date range filters
   - Calculate metrics from filtered data
   - Update all hardcoded values to dynamic calculations

3. **Layout**:
   - Maintain 4-card grid at top
   - Create 2x2 chart grid below
   - Remove any standalone sections

**Code Changes**:
```typescript
// Add imports
import { useFilteredData } from "@/hooks/useFilteredData";
import { useV3Store } from "@/store/v3Store";

// Apply filtering
const filteredInfrastructure = useFilteredData(infrastructureData, { 
  dateField: 'report_date' 
});

// Calculate dynamic metrics
const metrics = useMemo(() => {
  const latest = filteredInfrastructure?.[filteredInfrastructure.length - 1];
  return {
    residential: latest?.residential_destroyed || 0,
    hospitals: latest?.hospitals_hit || 0,
    schools: latest?.schools_destroyed || 0,
    // ... etc
  };
}, [filteredInfrastructure]);
```

---

### 3. Gaza - Population Impact 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards (Displaced, Refugees, Tents, Homelessness) ✅
- 1 chart (Generational Impact) ✅
- 3 additional metric cards (Schools, Universities, Students) ❌
- 2 info panels (Education Disruption, Vulnerable Populations) ❌

**Changes Needed**:
1. **Keep Top 4 Cards** (first row)
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Generational Impact bar chart
   - **Chart 2** (new): "Education System Impact" - Combined chart showing schools closed/damaged, students affected, teachers displaced over time
   - **Chart 3** (new): "Vulnerable Populations Overview" - Donut chart showing distribution (orphans, disabled, pregnant women, elderly)
   - **Chart 4** (convert): "Displacement Trends" - Line chart showing IDP numbers, refugee flows, and homelessness rate over filtered time period

3. **Remove**: 
   - 3 extra cards in second section (merge data into charts)
   - 2 info panels (convert to charts)

4. **Filter Integration**: Full implementation with date-based filtering

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Generational]  [Chart 2: Education]
[Chart 3: Vulnerable]    [Chart 4: Displacement]
```

---

### 4. Gaza - Aid & Survival 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards ✅
- 2 charts (Aid Tracker, Commodity Prices) ✅
- 1 utility gauge section (Water, Electricity, Internet, Fuel) ❌
- 2 info panels (Healthcare Access, Aid Bottlenecks) ❌

**Changes Needed**:
1. **Keep Top 4 Cards**
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Aid Pledged vs Delivered
   - **Chart 2** (existing): Commodity Prices Trend
   - **Chart 3** (convert utility section): "Essential Services Access" - Radar chart showing Water, Electricity, Internet, Fuel, Healthcare, Food access levels
   - **Chart 4** (new): "Aid Distribution Timeline" - Stacked area chart showing different types of aid delivered over time (food, medical, shelter, etc.)

3. **Keep ONE Critical Panel**: "Aid Distribution Bottlenecks" - this provides crucial contextual info
4. **Remove**: Healthcare Access panel (data integrated into Chart 3)

5. **Filter Integration**: Connect aid delivery data to filters

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Aid Tracker]        [Chart 2: Commodity Prices]
[Chart 3: Services Radar]     [Chart 4: Aid Timeline]

[Critical Info Panel: Aid Distribution Bottlenecks]
```

---

### 5. West Bank - Occupation Metrics 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards ✅
- 1 chart (Settlement Expansion) ✅
- 2 info panels (Land Control, Movement Restrictions) ❌

**Changes Needed**:
1. **Keep Top 4 Cards**
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Settlement Expansion Timeline
   - **Chart 2** (convert Land Control panel): "Oslo Areas Control Distribution" - Stacked bar chart showing Area A/B/C percentages over time
   - **Chart 3** (convert Movement panel): "Movement Restrictions Impact" - Multi-series bar chart showing checkpoints, flying checkpoints, road barriers by year
   - **Chart 4** (new): "Settler Population Growth" - Area chart with population projections

3. **Filter Integration**: Date-based filtering for settlement and checkpoint data

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Settlement Expansion]  [Chart 2: Oslo Areas]
[Chart 3: Restrictions]          [Chart 4: Population Growth]
```

---

### 6. West Bank - Settler Violence 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards (top) ✅
- 1 chart (Daily Violence Trend) ✅
- 1 chart + 1 panel hybrid (Home Demolitions + Impact panel) ✅
- 4 additional metric cards (Agricultural section) ❌

**Changes Needed**:
1. **Keep Top 4 Cards** (first row)
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Daily Violence Trend
   - **Chart 2** (existing): Home Demolitions by Region
   - **Chart 3** (convert agricultural cards): "Agricultural Destruction Impact" - Grouped bar chart showing olive trees, farmland, water wells, livestock losses by region
   - **Chart 4** (new): "Violence Escalation Timeline" - Combined chart showing attacks, casualties, and demolitions over time with trend lines

3. **Keep ONE Critical Panel**: "Demolition Impact" - provides important context about homelessness and children affected

4. **Remove**: 4 agricultural metric cards (data goes into Chart 3)

5. **Filter Integration**: Connect West Bank daily data to date filters

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Violence Trend]        [Chart 2: Demolitions]
[Chart 3: Agricultural Impact]   [Chart 4: Escalation Timeline]

[Critical Info Panel: Demolition Impact]
```

---

### 7. West Bank - Economic Strangulation 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards ✅
- 2 charts (Economic Indicators, Trade Restrictions) ✅
- 3 info panels (Water, Electricity, Land Access) ❌
- 1 business impact panel ❌

**Changes Needed**:
1. **Keep Top 4 Cards**
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Economic Indicators Over Time
   - **Chart 2** (existing): Trade Restrictions Impact
   - **Chart 3** (convert 3 resource panels): "Resource Allocation Inequality" - Radar chart comparing Israeli vs Palestinian access to water, electricity, land, medical, education
   - **Chart 4** (convert business panel): "Business Impact Metrics" - Multi-metric dashboard showing closed businesses, economic zones closures, blocked goods, lost output as mini gauges

3. **No panels kept** - all data visualized in charts

4. **Filter Integration**: Economic data filtered by date range

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Economic Indicators]   [Chart 2: Trade Impact]
[Chart 3: Resource Inequality]   [Chart 4: Business Metrics]
```

---

### 8. West Bank - Prisoners & Detention 🔧

**Current State**: NON-COMPLIANT
- 4 metric cards ✅
- 2 charts (Detention Trends, Age Distribution) ✅
- 1 administrative detention panel ❌
- 2 violation panels (Rights Violations, Hunger Strikes) ❌
- 3 additional stat boxes ❌

**Changes Needed**:
1. **Keep Top 4 Cards**
2. **Create 4 Charts Total**:
   - **Chart 1** (existing): Monthly Detention Trends
   - **Chart 2** (existing): Prisoners by Age Group
   - **Chart 3** (convert violation panels): "Rights Violations Overview" - Stacked bar chart showing torture allegations, medical neglect, family visit denials, hunger strikes by month
   - **Chart 4** (new): "Administrative Detention Crisis" - Multi-series timeline showing admin detainees, regular prisoners, detention periods, and renewal rates

3. **Keep ONE Critical Panel**: "Prisoner Rights Violations" - combines the most critical statistics for human rights context

4. **Remove**: Admin panel, stat boxes (integrate into charts)

5. **Filter Integration**: Date-based filtering for detention data

**Layout Structure**:
```
[4 Metric Cards Grid]

[Chart 1: Detention Trends]      [Chart 2: Age Distribution]
[Chart 3: Violations]            [Chart 4: Admin Detention]

[Critical Info Panel: Prisoner Rights Violations - Key Statistics]
```

---

## Implementation Priority

### Phase 1: Filter Integration (All Subtabs)
1. Import `useFilteredData` and `useV3Store` hooks
2. Apply filtering to all data sources
3. Update metric calculations to use filtered data
4. Test with date range changes

### Phase 2: Chart Additions
1. Gaza - Infrastructure Destruction (2 new charts)
2. Gaza - Population Impact (3 new charts)
3. West Bank - Occupation Metrics (3 new charts)
4. West Bank - Economic Strangulation (2 new charts)

### Phase 3: Conversions
1. Gaza - Aid & Survival (convert utility section + 1 panel to charts)
2. West Bank - Settler Violence (convert cards to chart)
3. West Bank - Prisoners & Detention (convert panels to charts)

### Phase 4: Testing & Polish
1. Verify all layouts are consistent (4 cards + 4 charts minimum)
2. Test filters affect all metrics and charts
3. Verify card dimensions match across subtabs
4. Test loading states
5. Test with empty/missing data

---

## Technical Implementation Guide

### Standard Imports for All Subtabs
```typescript
import { useMemo } from "react";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useV3Store } from "@/store/v3Store";
import { UnifiedMetricCard, AnimatedChart } from "@/components/v3/shared";
// ... chart components from recharts
```

### Filter Pattern
```typescript
export const SubtabComponent = ({ data, loading }: Props) => {
  // Apply filters
  const filteredData = useFilteredData(data, { 
    dateField: 'report_date',
    // add other field mappings as needed
  });

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { /* default values */ };
    }
    
    const latest = filteredData[filteredData.length - 1];
    // Calculate all metrics from latest or aggregate filtered data
    
    return { /* calculated metrics */ };
  }, [filteredData]);

  // Prepare chart data from filtered data
  const chartData = useMemo(() => {
    return filteredData?.slice(-30).map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      value: item.value
    })) || [];
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cards use metrics.* values */}
      </div>

      {/* 4 Charts in 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1: Charts 1 & 2 */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 2: Charts 3 & 4 */}
      </div>

      {/* Optional: 1 Critical Info Panel */}
    </div>
  );
};
```

### Card Dimensions Standard
```typescript
<UnifiedMetricCard
  title="Metric Title"
  value={metrics.value}
  icon={IconComponent}
  gradient="from-destructive/20 to-destructive/5"
  trend="up" // or "down" or undefined
  change={metrics.change}
  dataQuality="high" // or "medium" or "low"
  dataSources={["Source1", "Source2"]}
  valueColor="text-destructive" // optional
  sparklineData={sparklineValues} // optional
  expandable={true} // optional
  expandedContent={<div>...</div>} // optional
/>
```

### Chart Height Standard
All charts should use `height={400}` for consistency:
```typescript
<AnimatedChart
  title="Chart Title"
  description="Chart description"
  height={400}
  loading={loading}
>
  <ResponsiveContainer width="100%" height="100%">
    {/* Chart component */}
  </ResponsiveContainer>
</AnimatedChart>
```

---

## Success Criteria

### Layout Compliance
- ✅ All 8 subtabs have exactly 4 metric cards in top grid
- ✅ All 8 subtabs have minimum 4 charts in 2x2 layout
- ✅ All cards have uniform height and styling
- ✅ All charts have uniform height (400px)
- ✅ Critical info panels are clearly labeled and minimal

### Filter Integration
- ✅ All subtabs use `useFilteredData` hook
- ✅ All metric values recalculate from filtered data
- ✅ All charts display filtered data
- ✅ Date range selector affects all metrics and charts
- ✅ Region/category filters work where applicable

### Data Quality
- ✅ All cards show data quality badges
- ✅ All cards list data sources
- ✅ Loading states work properly
- ✅ Empty state handling is graceful
- ✅ Real data used wherever available

### User Experience
- ✅ Consistent visual language across all subtabs
- ✅ Smooth transitions when filters change
- ✅ Responsive layout works on mobile/tablet/desktop
- ✅ Charts are interactive with tooltips
- ✅ Expandable cards provide additional context

---

## Next Steps for Implementation

1. **Switch to Code Mode** to implement changes
2. **Start with Phase 1**: Filter integration for all subtabs
3. **Move to Phase 2**: Add missing charts
4. **Complete Phase 3**: Convert panels to charts
5. **Finish with Phase 4**: Testing and polish

Each subtab should be implemented, tested, and verified before moving to the next to ensure quality and consistency.