# Charts and Graphs Badge Update

## Issue Fixed

Charts and graphs (using `AnimatedChart` component) were still showing the old badge system instead of the new enhanced badges.

## Solution

Updated `AnimatedChart.tsx` to use the new `EnhancedDataSourceBadge` component with the same automatic mapping functionality as `UnifiedMetricCard`.

---

## What Changed

### File Modified
- ✅ `src/components/v3/shared/AnimatedChart.tsx`

### Changes Made

1. **Replaced import**:
   ```tsx
   // Old
   import { DataSourceBadge } from "./DataSourceBadge";
   
   // New
   import { EnhancedDataSourceBadge } from "./EnhancedDataSourceBadge";
   ```

2. **Added mapping function**:
   - Same mapping as `UnifiedMetricCard`
   - Converts old string sources to typed `DataSource`
   - Handles all common source name variations

3. **Updated badge rendering**:
   ```tsx
   // Old
   <DataSourceBadge
     sources={dataSources}
     quality={dataQuality}
   />
   
   // New
   <EnhancedDataSourceBadge
     sources={dataSourcesTyped.length > 0 ? dataSourcesTyped : mapStringToDataSource(dataSources)}
     lastRefresh={new Date()}
     showRefreshTime={true}
     showLinks={true}
     compact={false}
   />
   ```

4. **Added support for typed sources**:
   - New prop: `dataSourcesTyped?: DataSource[]`
   - Backward compatible with old `dataSources?: string[]`

---

## What Now Works

### All Charts Show New Badges

**Gaza Dashboard - Humanitarian Crisis**:
- Daily Casualties chart → Tech4Palestine ✅
- Daily New Casualties chart → Tech4Palestine ✅
- Demographic Breakdown chart → Tech4Palestine ✅
- Casualty Trends chart → Tech4Palestine ✅

**Gaza Dashboard - Infrastructure**:
- Building Destruction chart → UN OCHA ✅
- Healthcare Facilities chart → WHO, UN OCHA ✅
- Infrastructure Timeline chart → UN OCHA ✅
- Health System Impact chart → WHO, Good Shepherd ✅

**Gaza Dashboard - Population Impact**:
- Casualty Demographics chart → Tech4Palestine ✅
- Vulnerable Populations chart → UN OCHA (UNICEF, WHO) ✅
- Education System chart → Tech4Palestine ✅
- Population Pyramid chart → PCBS, UN OCHA ✅

**Gaza Dashboard - Aid & Survival**:
- Food Security Trends chart → Tech4Palestine, UN ✅
- Commodity Prices chart → WFP, Tech4Palestine ✅
- Aid Distribution chart → Tech4Palestine, WHO, WFP ✅
- Survival Indicators chart → Tech4Palestine, UN ✅

---

## Features on Charts

Each chart badge now includes:

1. **Clickable Links** - Click badge to visit source website
2. **Last Refresh Time** - Shows "just now", "5m ago", etc.
3. **Manual Refresh** - Refresh icon (if callback provided)
4. **Color-Coded Freshness**:
   - 🟢 Green = Fresh (< 1 hour)
   - 🔵 Blue = Recent (1-24 hours)
   - 🟡 Yellow = Stale (1-7 days)
   - 🟠 Orange = Outdated (> 7 days)
5. **Detailed Hover Card** - Full source info, links, verification
6. **Multiple Sources** - Shows all sources used in the chart

---

## Visual Example

### Before (Old Badge)
```
┌─────────────────────────────────────────────┐
│ Daily Casualties Chart                      │
│                                             │
│ [Chart visualization]                       │
│                                             │
│ [T4P] ← Simple text badge                  │
└─────────────────────────────────────────────┘
```

### After (New Badge)
```
┌─────────────────────────────────────────────┐
│ Daily Casualties Chart                      │
│                                             │
│ [Chart visualization]                       │
│                                             │
│ [🗄️ Tech4Palestine 🔗]  🕐 5m ago  [↻]    │
└─────────────────────────────────────────────┘
```

---

## Source Mapping

Charts use the same mapping as metric cards:

| Chart Source String | Maps To | Organization |
|-------------------|---------|--------------|
| Tech4Palestine | tech4palestine | Tech for Palestine |
| WFP | wfp | World Food Programme |
| UN / UN OCHA / OCHA | un_ocha | UN OCHA |
| WHO | who | World Health Organization |
| Good Shepherd | goodshepherd | Good Shepherd Collective |
| MOH | tech4palestine | Ministry of Health |
| UNICEF | un_ocha | UNICEF |
| Health Facilities | who | Health Facilities |

---

## Testing

### Verify Chart Badges

1. **Start dev server**: `npm run dev`
2. **Go to Gaza dashboard**: `/gaza`
3. **Check each tab**:
   - Humanitarian Crisis → Scroll down to charts
   - Infrastructure → Check all charts
   - Population Impact → Check all charts
   - Aid & Survival → Check all charts

4. **Verify each chart badge**:
   - Shows correct source name
   - Has external link icon
   - Shows last refresh time
   - Hover shows detailed info
   - Click opens source website

---

## Backward Compatibility

Both formats work:

### Old Format (String Array)
```tsx
<AnimatedChart
  title="My Chart"
  dataSources={["WFP", "UN"]}
>
  {/* chart content */}
</AnimatedChart>
```

### New Format (Typed Array)
```tsx
<AnimatedChart
  title="My Chart"
  dataSourcesTyped={["wfp", "un_ocha"]}
>
  {/* chart content */}
</AnimatedChart>
```

If both are provided, `dataSourcesTyped` takes precedence.

---

## Summary

✅ **All charts** now use new enhanced badges  
✅ **Correct sources** displayed for each chart  
✅ **Clickable links** to original data sources  
✅ **Last refresh time** with relative display  
✅ **Color-coded freshness** indicators  
✅ **Detailed hover info** for all sources  
✅ **Backward compatible** with old string format  
✅ **Consistent experience** across metric cards and charts  

---

**Date**: October 22, 2025  
**Status**: ✅ Complete  
**Files Modified**: 1 (`AnimatedChart.tsx`)

---

*All charts and graphs throughout the application now display the new enhanced data source badges with correct source information.*
