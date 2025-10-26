# Frontend Integration Plan - Connect New Data Infrastructure

## 🎯 Current Situation

### ✅ Infrastructure Ready
- 65,000+ records stored locally
- 133 HDX datasets cataloged
- 3.75MB optimized data
- All fetch scripts working
- GitHub Actions ready

### ❌ Frontend Still Using Old System
**Components using old hooks:**
- `GazaWarDashboard.tsx` uses: `useKilledInGaza`, `useSummary`, `useCasualtiesDaily`
- Other dashboards likely using similar old hooks
- Services still making API calls
- No performance benefit realized yet

---

## 📊 NEW UNUSED DATASETS

### 1. Good Shepherd (NEW - Not in Frontend)
- ✅ **Healthcare Attacks**: 2,900 records
- ✅ **NGO Financial Data**: 177 orgs, $2.1B
- ✅ **Political Prisoners**: 19 records (API)
- ✅ **Child Prisoners**: 206 records (enhanced)
- ✅ **Demolitions**: 1,000 records (enhanced)

### 2. HDX CKAN (NEW - Not in Frontend)
- ✅ **IDMC Displacement**: 2 datasets downloaded
- ✅ **FAO Food Security**: 1 dataset downloaded
- ✅ **World Bank Health**: 1 dataset downloaded
- 📋 **129 more datasets** cataloged (not downloaded yet)

### 3. World Bank (EXPANDED - Not in Frontend)
- ✅ **40+ indicators** (was 10)
- Economic, demographics, labor, education, health, infrastructure

---

## 🔄 INTEGRATION STEPS

### Step 1: Update Data Hooks (Priority: HIGH)

**File**: `src/hooks/useDataFetching.ts`

**Current**:
```typescript
export const useKilledInGaza = (): UseQueryResult<KilledPerson[], Error> => {
  return useQuery({
    queryKey: ["killedInGaza"],
    queryFn: () => fetchJson(`${API_BASE}/v3/killed-in-gaza.min.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};
```

**Should be**:
```typescript
export const useKilledInGaza = (): UseQueryResult<KilledPerson[], Error> => {
  return useQuery({
    queryKey: ["killedInGaza"],
    queryFn: async () => {
      // Try local data first
      try {
        const response = await fetch('/data/tech4palestine/killed-in-gaza/recent.json');
        if (response.ok) {
          const data = await response.json();
          return data.data; // Return the data array
        }
      } catch (error) {
        console.log('Local data not available, using API');
      }
      
      // Fallback to API
      return fetchJson(`${API_BASE}/v3/killed-in-gaza.min.json`);
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
};
```

### Step 2: Update Components (Priority: HIGH)

**Files to Update**:
1. `src/pages/v3/GazaWarDashboard.tsx`
2. `src/pages/v3/WestBankDashboard.tsx`
3. `src/components/v3/gaza/*`
4. `src/components/v3/westbank/*`

**Pattern**:
```typescript
// Add import
import { useRecentData, useDateRangeData } from '@/hooks/useLocalData';

// Replace old hooks
// OLD: const { data } = useCasualtiesDaily();
// NEW: const { data: casualties } = useRecentData('tech4palestine', 'casualties');
```

### Step 3: Add Date Range Filters (Priority: MEDIUM)

**Create**: `src/components/filters/DateRangeFilter.tsx`

```typescript
import { useDateRange } from '@/hooks/useLocalData';

export function DateRangeFilter({ onRangeChange }) {
  const { range, setPreset, setCustomRange } = useDateRange('LAST_30_DAYS');
  
  useEffect(() => {
    onRangeChange(range);
  }, [range]);
  
  return (
    <div>
      <button onClick={() => setPreset('LAST_7_DAYS')}>Last 7 Days</button>
      <button onClick={() => setPreset('LAST_30_DAYS')}>Last 30 Days</button>
      <button onClick={() => setPreset('SINCE_OCT_7')}>Since Oct 7</button>
      <input type="date" value={range.start} onChange={...} />
      <input type="date" value={range.end} onChange={...} />
    </div>
  );
}
```

### Step 4: Add New Data Visualizations (Priority: LOW)

**New Dashboard Sections**:
1. Healthcare Attacks Map (2,900 records)
2. NGO Financial Tracker (177 orgs, $2.1B)
3. World Bank Economic Indicators (40+ indicators)
4. HDX Displacement Trends (IDMC data)
5. Food Security Dashboard (FAO data)

---

## 🚀 QUICK START INTEGRATION

### Minimal Integration (30 minutes)

**Update one component to prove it works:**

```typescript
// File: src/components/dashboard/CasualtiesTrend.tsx

import { useRecentData } from '@/hooks/useLocalData';

export function CasualtiesTrend() {
  const { data, isLoading } = useRecentData('tech4palestine', 'casualties');
  
  if (isLoading) return <div>Loading...</div>;
  
  const casualties = data?.data || [];
  
  return (
    <Chart data={casualties} />
  );
}
```

**Test it:**
1. Save the file
2. Check browser console
3. Verify data loads from `/data/tech4palestine/casualties/recent.json`
4. Measure load time (should be ~50ms)

---

## 📋 COMPLETE INTEGRATION CHECKLIST

### Data Hooks (src/hooks/)
- [ ] Update `useDataFetching.ts` to use local data first
- [ ] Update `useGoodShepherdData.ts` to use local data
- [ ] Update `useWorldBankData.ts` to use local data
- [ ] Update `useHDXData.ts` to use local catalog
- [ ] Create `useHealthcareAttacks.ts` (new)
- [ ] Create `useNGOData.ts` (new)

### Dashboard Components (src/pages/v3/)
- [ ] Update `GazaWarDashboard.tsx`
- [ ] Update `WestBankDashboard.tsx`

### Sub-Components (src/components/v3/)
- [ ] Update `gaza/HumanitarianCrisis.tsx`
- [ ] Update `gaza/InfrastructureDestruction.tsx`
- [ ] Update `gaza/PopulationImpact.tsx`
- [ ] Update `westbank/*` components

### Services (src/services/)
- [x] Update `hdxService.ts` (DONE)
- [ ] Update `goodShepherdService.ts`
- [ ] Update `worldBankService.ts`
- [ ] Update `apiOrchestrator.ts`

### New Features
- [ ] Add date range filter component
- [ ] Add healthcare attacks visualization
- [ ] Add NGO financial tracker
- [ ] Add World Bank indicators dashboard
- [ ] Add data freshness indicators

---

## 🎯 RECOMMENDED APPROACH

### Week 1: Proof of Concept
1. Update ONE dashboard component
2. Verify it works and is faster
3. Document the pattern
4. Get feedback

### Week 2: Core Integration
1. Update all main dashboard hooks
2. Update all dashboard components
3. Add date range filters
4. Test thoroughly

### Week 3: New Features
1. Add healthcare attacks visualization
2. Add NGO financial tracker
3. Download more HDX datasets
4. Create new dashboard sections

### Week 4: Optimization
1. Performance testing
2. Bundle optimization
3. Cache tuning
4. Final documentation

---

## 💡 NEXT IMMEDIATE ACTIONS

1. **Choose integration approach** (quick vs full)
2. **Update first component** (I can help with this)
3. **Test and verify** performance improvement
4. **Decide on new features** to add

**Which dashboard component should we update first?**

