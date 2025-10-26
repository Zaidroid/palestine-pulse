# 🔍 Hardcoded Data Audit - Task 2.4

**Status**: In Progress
**Goal**: Remove ALL hardcoded data from components

---

## 📋 AUDIT RESULTS

### ✅ COMPONENTS WITH REAL DATA (No Action Needed)

These components already use real data from APIs:

1. **GazaWarDashboard.tsx** - Uses unified hooks ✅
2. **WestBankDashboard.tsx** - Uses unified hooks ✅
3. **HumanitarianCrisis.tsx** - Uses real casualty data with calculated percentages ✅
4. **InfrastructureDestruction.tsx** - Receives real data from dashboard ✅
5. **PopulationImpact.tsx** - Uses real data with fallback to V3 service ✅

---

## ⚠️ COMPONENTS WITH HARDCODED DATA (Action Required)

### 1. **PrisonersStats.tsx** - SAMPLE DATA ARRAYS

**Location**: `src/components/dashboards/PrisonersStats.tsx`

**Hardcoded Data**:
```typescript
const PRISONER_TREND = [
  { month: 'Oct 2023', total: 5200, administrative: 1264, new: 340 },
  { month: 'Nov 2023', total: 7800, administrative: 2156, new: 2980 },
  { month: 'Dec 2023', total: 9500, administrative: 3245, new: 1890 },
  // ... more months
];

const DEMOGRAPHIC_BREAKDOWN = [
  { category: 'Men', count: 10250, percentage: 85 },
  { category: 'Women', count: 95, percentage: 1 },
  { category: 'Children', count: 340, percentage: 3 },
  { category: 'Administrative Detention', count: 4456, percentage: 37 },
];

const PRISON_CONDITIONS = [
  { issue: 'Medical Neglect', cases: 780, severity: 'critical' },
  { issue: 'Torture & Abuse', cases: 1240, severity: 'critical' },
  // ... more conditions
];
```

**Status**: ⚠️ Uses Good Shepherd API but falls back to hardcoded arrays for charts
**Action**: Remove hardcoded arrays, use only real API data or hide charts

---

### 2. **AidTracker.tsx** - SAMPLE DATA ARRAYS

**Location**: `src/components/dashboards/AidTracker.tsx`

**Hardcoded Data**:
```typescript
const AID_BY_TYPE = [
  { type: 'Food', delivered: 12500, needed: 45000, percentage: 28 },
  { type: 'Medical', delivered: 3200, needed: 15000, percentage: 21 },
  // ... more types
];

const AID_BY_SOURCE = [
  { source: 'UN Agencies', value: 4500, color: '#3B82F6' },
  { source: 'Arab Countries', value: 3200, color: '#10B981' },
  // ... more sources
];

const AID_DELIVERIES_TREND = [
  { month: 'Oct 2023', deliveries: 145, blocked: 89 },
  // ... more months
];

const ACCESS_RESTRICTIONS = [
  { restriction: 'Border Crossings Closed', frequency: 89, severity: 'critical' },
  // ... more restrictions
];
```

**Status**: ⚠️ No real data source available yet
**Action**: Hide component until HDX/OCHA FTS data is integrated

---

### 3. **SettlementExpansion.tsx** - SAMPLE DATA ARRAYS

**Location**: `src/components/dashboards/SettlementExpansion.tsx`

**Hardcoded Data**:
```typescript
const SETTLEMENT_GROWTH = [
  { year: '2020', settlements: 132, population: 465000, landKm2: 542 },
  // ... more years
];

const DEMOLITIONS_BY_REASON = [
  { reason: 'Lack of Permit', count: 3420, affected: 15600 },
  // ... more reasons
];

const SETTLER_ATTACKS_TREND = [
  { month: 'Oct 2023', attacks: 127, injuries: 89 },
  // ... more months
];

const MAJOR_SETTLEMENTS = [
  { name: 'Maale Adumim', population: 38000, established: 1975, expandedRecently: true },
  // ... more settlements
];
```

**Status**: ⚠️ No real data source available (B'Tselem partnership pending)
**Action**: Hide component until B'Tselem/Peace Now data is integrated

---

### 4. **EconomicImpact.tsx** - PARTIAL SAMPLE DATA

**Location**: `src/components/dashboards/EconomicImpact.tsx`

**Hardcoded Data**:
```typescript
const SAMPLE_ECONOMIC_DATA: EconomicMetric[] = [
  { month: 'Oct 2023', gdpLoss: 5.2, unemployment: 48, businesses: 2500, agricultural: 120 },
  // ... more months
];

const SECTOR_DAMAGE = [
  { sector: 'Manufacturing', destroyed: 8500, damaged: 12000, lossUSD: 2.8 },
  { sector: 'Retail & Commerce', destroyed: 6200, damaged: 9500, lossUSD: 1.9 },
  // ... more sectors
];
```

**Status**: ⚠️ Has real World Bank GDP/unemployment data, but sector damage is hardcoded
**Action**: Remove SECTOR_DAMAGE arrays or clearly mark as estimates

---

### 5. **GridIntegrationExample.tsx** - EXAMPLE HARDCODED VALUES

**Location**: `src/components/ui/grid/GridIntegrationExample.tsx`

**Hardcoded Data**:
```typescript
<EnhancedMetricCard
  title="Prisoners Detained"
  value={8500}  // ← HARDCODED
  change={{
    value: 12.8,
    trend: 'up',
    period: 'vs last month',
  }}
  // ...
/>
```

**Status**: ⚠️ This is an example/demo component
**Action**: Either remove component or clearly mark as "DEMO ONLY"

---

### 6. **PrisonersDetention.tsx** (V3) - FALLBACK HARDCODED VALUES

**Location**: `src/components/v3/westbank/PrisonersDetention.tsx`

**Hardcoded Data**:
```typescript
// Final fallback to pre-calculated metrics if available
return {
  totalPrisoners: westBankPrisonerData?.statistics?.total_prisoners || 9500,  // ← HARDCODED
  children: westBankPrisonerData?.statistics?.children || 250,  // ← HARDCODED
  women: westBankPrisonerData?.statistics?.women || 80,  // ← HARDCODED
  administrative: westBankPrisonerData?.statistics?.administrative_detention || 3500  // ← HARDCODED
};

// Fallback: Generate dynamic data based on current metrics
const baseTotal = metrics.totalPrisoners || 9500;  // ← HARDCODED
const baseAdmin = metrics.administrative || 3500;  // ← HARDCODED
```

**Status**: ⚠️ Uses real data first, but has hardcoded fallbacks
**Action**: Remove hardcoded fallbacks, show loading state or error instead

---

### 7. **HumanitarianCrisis.tsx** (V3) - CALCULATED PERCENTAGES

**Location**: `src/components/v3/gaza/HumanitarianCrisis.tsx`

**Hardcoded Data**:
```typescript
// Use realistic estimates based on documented patterns
demographicMetrics.childrenKilled = Math.round(totalKilled * 0.30); // ~30% children
demographicMetrics.womenKilled = Math.round(totalKilled * 0.21); // ~21% women
```

**Status**: ✅ ACCEPTABLE - These are documented demographic patterns, not arbitrary numbers
**Action**: Keep but add comment explaining source of percentages (UN/WHO reports)

---

### 8. **OccupationMetrics.tsx** (V3) - FALLBACK HARDCODED VALUES

**Location**: `src/components/v3/westbank/OccupationMetrics.tsx`

**Hardcoded Data**:
```typescript
const checkpoints = btselemCheckpointData?.summary?.totalCheckpoints ||
                   westBankOccupationData?.controlMatrix?.checkpoints ||
                   140;  // ← HARDCODED

return {
  settlements: westBankOccupationData?.settlements?.total || 279,  // ← HARDCODED
  settlerPopulation: westBankOccupationData?.settlements?.population || 700000,  // ← HARDCODED
  checkpoints: checkpoints,
  militaryZones: westBankOccupationData?.controlMatrix?.military_zones_percent || 60  // ← HARDCODED
};
```

**Status**: ⚠️ Uses real data first, but has hardcoded fallbacks
**Action**: Remove hardcoded fallbacks, show loading state or error instead

---

## 🎯 ACTION PLAN

### Priority 1: Remove Hardcoded Fallbacks in V3 Components

**Files to fix**:
- `src/components/v3/westbank/PrisonersDetention.tsx`
- `src/components/v3/westbank/OccupationMetrics.tsx`

**Changes**:
- Remove all hardcoded fallback numbers (9500, 3500, 279, 700000, 140, 60)
- Return `null` or `undefined` when no real data available
- Show proper loading/error states in UI

---

### Priority 2: Hide or Remove Dashboard Components Without Real Data

**Files to hide/remove**:
- `src/components/dashboards/AidTracker.tsx` - No real data source yet
- `src/components/dashboards/SettlementExpansion.tsx` - No real data source yet

**Options**:
1. **Option A**: Remove from navigation/routes entirely
2. **Option B**: Show "Coming Soon" placeholder with data source requirements
3. **Option C**: Keep but add prominent "SAMPLE DATA" warning banner

**Recommendation**: Option B - Show placeholder explaining what data sources are needed

---

### Priority 3: Fix PrisonersStats.tsx

**File**: `src/components/dashboards/PrisonersStats.tsx`

**Changes**:
- Remove `PRISONER_TREND` array
- Remove `DEMOGRAPHIC_BREAKDOWN` array  
- Remove `PRISON_CONDITIONS` array
- Use only Good Shepherd API data
- Hide charts that don't have real data

---

### Priority 4: Fix EconomicImpact.tsx

**File**: `src/components/dashboards/EconomicImpact.tsx`

**Changes**:
- Remove `SAMPLE_ECONOMIC_DATA` array (already has World Bank data)
- Remove `SECTOR_DAMAGE` array OR add clear "ESTIMATED" labels
- Show only charts with real World Bank data

---

### Priority 5: Fix or Remove GridIntegrationExample.tsx

**File**: `src/components/ui/grid/GridIntegrationExample.tsx`

**Changes**:
- Add "DEMO ONLY - NOT REAL DATA" banner
- OR remove from production build
- OR connect to real data sources

---

## 📊 SUMMARY

| Component | Status | Real Data | Action |
|-----------|--------|-----------|--------|
| GazaWarDashboard | ✅ Good | Yes | None |
| WestBankDashboard | ✅ Good | Yes | None |
| HumanitarianCrisis | ✅ Good | Yes | Add source comment |
| PrisonersDetention | ⚠️ Partial | Partial | Remove fallbacks |
| OccupationMetrics | ⚠️ Partial | Partial | Remove fallbacks |
| PrisonersStats | ⚠️ Mixed | Partial | Remove arrays |
| AidTracker | ❌ No Data | No | Hide component |
| SettlementExpansion | ❌ No Data | No | Hide component |
| EconomicImpact | ⚠️ Partial | Partial | Remove arrays |
| GridIntegrationExample | ❌ Demo | No | Mark as demo |

---

## 🚀 NEXT STEPS

1. **Run the fixes** (see implementation below)
2. **Test all dashboards** to ensure no broken UI
3. **Update navigation** to hide components without real data
4. **Add "Coming Soon" placeholders** for hidden components
5. **Document** which data sources are needed for each hidden component

---

## ✅ ACCEPTANCE CRITERIA

- [ ] No hardcoded numbers in V3 components (except documented percentages)
- [ ] No sample data arrays in dashboard components
- [ ] Components without real data are hidden or clearly marked
- [ ] All visible metrics use real API data
- [ ] Proper loading/error states when data unavailable
- [ ] Console shows no "using fallback data" messages
- [ ] All charts display real data or are hidden

---

**Ready to implement?** See `TASK_2.4_IMPLEMENTATION.md` for the code changes.
