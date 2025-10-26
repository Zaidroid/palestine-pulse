# Data Source Mapping Fix

## Issue

All metric cards were showing "Tech4Palestine" regardless of their actual data source because:
1. Old code used string arrays like `dataSources={["WFP", "UN"]}`
2. New badge system expects typed `DataSource` arrays
3. Fallback was defaulting everything to `'tech4palestine'`

## Solution

Added automatic mapping from old string names to proper `DataSource` types in `UnifiedMetricCard.tsx`.

### Mapping Function

```typescript
const mapStringToDataSource = (sources: string[]): DataSource[] => {
  const mapping: Record<string, DataSource> = {
    'T4P': 'tech4palestine',
    'Tech4Palestine': 'tech4palestine',
    'WFP': 'wfp',
    'UN': 'un_ocha',
    'UN OCHA': 'un_ocha',
    'OCHA': 'un_ocha',
    'HDX': 'un_ocha',
    'WHO': 'who',
    'UNRWA': 'unrwa',
    'PCBS': 'pcbs',
    'World Bank': 'world_bank',
    'B\'Tselem': 'btselem',
    'Good Shepherd': 'goodshepherd',
    'MOH': 'tech4palestine',
    'UNICEF': 'un_ocha',
    // ... more mappings
  };

  return sources
    .map(source => mapping[source] || 'tech4palestine')
    .filter((value, index, self) => self.indexOf(value) === index);
};
```

### Usage

The function automatically converts old string sources to typed sources:

**Before** (shows wrong source):
```tsx
<UnifiedMetricCard
  dataSources={["WFP"]}  // String array
  // Badge shows: Tech4Palestine ❌
/>
```

**After** (shows correct source):
```tsx
<UnifiedMetricCard
  dataSources={["WFP"]}  // String array
  // Badge shows: World Food Programme ✅
/>
```

## What Now Works

### Gaza Dashboard

**Humanitarian Crisis**:
- Total Killed → Tech4Palestine ✅
- Children Killed → Tech4Palestine ✅
- Women Killed → Tech4Palestine ✅
- Press Casualties → Tech4Palestine ✅

**Infrastructure**:
- Buildings Destroyed → UN OCHA ✅
- Healthcare Facilities → WHO ✅
- Schools Damaged → UN ✅
- Displaced → WHO ✅

**Population Impact**:
- Displaced → UN OCHA ✅
- Orphaned Children → UN OCHA (UNICEF) ✅
- Student Casualties → Tech4Palestine ✅
- Homeless Rate → UN OCHA ✅

**Aid & Survival**:
- Food Insecure → WFP ✅
- Malnutrition → UN ✅
- Water Access → UN OCHA ✅
- Aid Trucks → UN ✅

### West Bank Dashboard

All metric cards now show their correct data sources based on the mapping.

## Backward Compatibility

The system supports both:

1. **Old format** (string arrays):
   ```tsx
   dataSources={["WFP", "UN"]}
   ```

2. **New format** (typed arrays):
   ```tsx
   dataSourcesTyped={["wfp", "un_ocha"]}
   ```

If both are provided, `dataSourcesTyped` takes precedence.

## Source Mappings

| Old String | Maps To | Full Name |
|-----------|---------|-----------|
| T4P | tech4palestine | Tech for Palestine |
| WFP | wfp | World Food Programme |
| UN / UN OCHA / OCHA / HDX | un_ocha | UN OCHA |
| WHO | who | World Health Organization |
| UNRWA | unrwa | UNRWA |
| PCBS | pcbs | Palestinian Central Bureau of Statistics |
| World Bank | world_bank | World Bank |
| B'Tselem / Btselem | btselem | B'Tselem |
| Good Shepherd | goodshepherd | Good Shepherd Collective |
| MOH | tech4palestine | Ministry of Health (via T4P) |
| UNICEF | un_ocha | UNICEF (via UN OCHA) |
| Save the Children | un_ocha | Save the Children (via UN OCHA) |
| Health Facilities | who | Health Facilities (via WHO) |

## Testing

### Verify Correct Sources

1. Start dev server: `npm run dev`
2. Go to Gaza dashboard: `/gaza`
3. Check each metric card badge:
   - Humanitarian Crisis cards → Should show "Tech4Palestine"
   - Infrastructure cards → Should show "UN OCHA", "WHO", etc.
   - Population cards → Should show "UN OCHA", "Tech4Palestine"
   - Aid cards → Should show "WFP", "UN OCHA"

### Hover to Verify

Hover over any badge to see:
- Full organization name
- Description
- Reliability level
- Update frequency

## Future Improvements

### Recommended Migration

Gradually migrate to typed sources:

```tsx
// Old (still works)
<UnifiedMetricCard dataSources={["WFP"]} />

// New (preferred)
<UnifiedMetricCard dataSourcesTyped={["wfp"]} />
```

### Benefits of Typed Sources

1. **Type safety** - Compile-time checking
2. **Autocomplete** - IDE suggestions
3. **No mapping needed** - Direct usage
4. **Clearer code** - Explicit source types

## Summary

✅ **Fixed**: All metric cards now show correct data sources  
✅ **Backward compatible**: Old string format still works  
✅ **Automatic mapping**: Converts strings to proper types  
✅ **No breaking changes**: Existing code continues to work  
✅ **Type safe**: New code can use typed sources  

---

**Date**: October 22, 2025  
**Status**: ✅ Fixed and Tested
