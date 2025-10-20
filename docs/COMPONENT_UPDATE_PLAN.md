# 📋 Component Update Plan - Real Data Integration
**Palestine Pulse Dashboard - Remaining Components**

**Created**: January 17, 2025  
**Purpose**: Systematic plan to update all components with real data using consistent badge system  
**Status**: Ready for Implementation

---

## 🎯 Overview

### Already Completed ✅
- [x] Economic Impact - World Bank GDP & unemployment (60% real data)
- [x] Food Security - WFP food prices (70% real data)
- [x] DataQualityBadge system implemented and tested

### Remaining Components to Update

| Component | Current Real Data | Potential | Data Source Available | Priority | Est. Time |
|-----------|-------------------|-----------|----------------------|----------|-----------|
| **Prisoners Stats** | 20% | 90% | ✅ Good Shepherd hooks ready | 🔥 HIGH | 2 hours |
| **West Bank Overview** | Partial | 100% | ✅ useWestBankData() ready | 🔥 HIGH | 1 hour |
| **Healthcare Status** | 10% | 70% | ⏳ Need service for facilities DB | 🟡 MEDIUM | 4 hours |
| **Education Impact** | 0% | 50% | ⏳ Need service for schools DB | 🟡 MEDIUM | 4 hours |
| **Displacement Stats** | 0% | 30% | ⏳ Need service for population | 🟡 MEDIUM | 3 hours |
| **Aid Tracker** | 0% | 30% | ⚠️ Scattered HDX data | 🟢 LOW | 5 hours |
| **Utilities Status** | 0% | 20% | ⚠️ Limited data | 🟢 LOW | N/A |
| **Settlements** | 0% | 0% | ❌ No API | 🟢 LOW | Partnership |
| **International** | 0% | 0% | ❌ Manual | 🟢 LOW | Manual |

---

## 🎨 Badge Implementation Pattern

### Standard Badge Pattern (Use in All Components)

```typescript
import { DataQualityBadge, DataLoadingBadge } from '@/components/ui/data-quality-badge';

// 1. Fetch data with hook
const { data, isLoading, error } = useYourDataHook();

// 2. Determine if real data is available
const hasRealData = !error && data && data.length > 0;

// 3. In component header, add badge
<div className="flex items-center justify-between">
  <div>
    <h2>Component Title</h2>
    <p>Description</p>
    <div className="mt-2">
      {isLoading ? (
        <DataLoadingBadge />
      ) : (
        <DataQualityBadge 
          source="Source Name" 
          isRealData={hasRealData}
          recordCount={data?.length}
          lastUpdated={data?.[0]?.date ? new Date(data[0].date) : undefined}
          showDetails={true}
        />
      )}
    </div>
  </div>
</div>

// 4. In charts/metrics, show data source
<CardHeader>
  <div className="flex items-center justify-between">
    <div>
      <CardTitle>Chart Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </div>
    <DataQualityBadge 
      source="Source Name" 
      isRealData={hasRealData}
      showDetails={false}
    />
  </div>
</CardHeader>

// 5. In footer, explain data sources
<div className="text-xs text-muted-foreground text-center p-4 border-t">
  {hasRealData ? (
    <>
      ✅ Real data from <strong>Source Name</strong>.
      [Additional context about data]
      Last updated: {new Date().toLocaleDateString()}
    </>
  ) : (
    <>
      Sample/estimated data. Integration with [Source] in progress.
      Last updated: {new Date().toLocaleDateString()}
    </>
  )}
</div>
```

---

## 📊 Component-by-Component Plan

### Priority 1: Quick Wins (Hooks Already Exist)

#### 1️⃣ Prisoners Stats Component
**File**: [`src/components/dashboards/PrisonersStats.tsx`](src/components/dashboards/PrisonersStats.tsx)

**Current Status**:
- ✅ Child prisoners: Real data (Good Shepherd)
- ❌ Overall prisoners: Sample data
- ❌ Prison conditions: Sample data

**Available Hooks**:
```typescript
import { 
  useChildPrisoners,  // Already used
  usePrisonerData,    // ⭐ NEWLY AVAILABLE
  useNGOData,         // ⭐ NEWLY AVAILABLE
} from '@/hooks/useGoodShepherdData';
```

**Integration Plan**:
1. Add `usePrisonerData()` hook - overall prisoner statistics
2. Add `useNGOData()` hook - NGO monitoring data (may include prison conditions)
3. Combine with existing `useChildPrisoners()` data
4. Add `<DataQualityBadge />` to show data sources
5. Update metrics to use real data where available
6. Keep graceful fallback for unavailable metrics

**Estimated Time**: 2 hours  
**Estimated Real Data**: 20% → 90%

**Badge Placement**:
- Header: Show "Good Shepherd" with record count
- Each metric card: Show which data is real vs sample
- Footer: Explain mixed data sources

---

#### 2️⃣ West Bank Overview Component
**File**: [`src/components/dashboard/WestBankOverview.tsx`](src/components/dashboard/WestBankOverview.tsx)

**Current Status**:
- ✅ Tech4Palestine West Bank daily data already working
- ❌ Additional West Bank data not integrated

**Available Hook**:
```typescript
import { useWestBankData } from '@/hooks/useGoodShepherdData';
```

**Integration Plan**:
1. Add `useWestBankData()` hook (23.7KB of West Bank-specific data)
2. Enhance existing Tech4Palestine data with Good Shepherd data
3. Add `<DataQualityBadge />` showing both sources
4. Merge/compare data from both sources
5. Show enhanced metrics

**Estimated Time**: 1 hour  
**Estimated Real Data**: Partial → 100%

**Badge Placement**:
- Header: "Tech4Palestine + Good Shepherd"
- Metrics: Show which source each metric comes from

---

### Priority 2: Need New Services (Data Available on HDX)

#### 3️⃣ Healthcare Status Component
**File**: [`src/components/dashboards/HealthcareStatus.tsx`](src/components/dashboards/HealthcareStatus.tsx)

**Current Status**:
- ❌ healthcare_attacks.json disabled (too large)
- Using sample data

**Available Data**:
- Health Facilities Database (Gaza hospitals, Nov 2023)
- URL: `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv`

**Required New Files**:
```typescript
// src/services/healthFacilitiesService.ts
- Fetch CSV from Google Sheets
- Parse with papaparse
- Types: facility name, type, status, governorate

// src/hooks/useHealthFacilities.ts
- useGazaHealthFacilities()
- useHealthFacilityStats()
- useFacilityByStatus()
```

**Integration Plan**:
1. Create `healthFacilitiesService.ts`
2. Create `useHealthFacilities.ts`
3. Update `HealthcareStatus.tsx` to use hook
4. Show facility operational status
5. Replace healthcare_attacks with facilities data
6. Add `<DataQualityBadge source="Ministry of Health" />`

**Estimated Time**: 4 hours  
**Estimated Real Data**: 10% → 70%

**Badge Placement**:
- Header: "Ministry of Health via HDX"
- Each chart: Show data source
- Note: "Nov 2023 snapshot, infrastructure attacks from Tech4Palestine"

---

#### 4️⃣ Education Impact Component
**File**: [`src/components/dashboards/EducationImpact.tsx`](src/components/dashboards/EducationImpact.tsx)

**Current Status**:
- Using sample school damage data
- Using estimated student impact

**Available Data**:
- Schools Database (2,000+ schools, West Bank + Gaza)
- URL: `https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx`
- Can cross-reference with Tech4Palestine infrastructure damage

**Required New Files**:
```typescript
// src/services/schoolsService.ts
- Fetch XLSX from HDX
- Parse with xlsx library
- Types: school name, code, district, type

// src/hooks/useSchools.ts
- useSchoolsDatabase()
- useSchoolsByRegion()
- useSchoolsByType()
- useSchoolStatistics()
```

**Integration Plan**:
1. Create `schoolsService.ts`
2. Create `useSchools.ts`
3. Update `EducationImpact.tsx`
4. Show total schools by region
5. Cross-reference with infrastructure damage for destroyed schools
6. Add `<DataQualityBadge source="PA Ministry of Education" />`

**Estimated Time**: 4 hours  
**Estimated Real Data**: 0% → 50%

**Badge Placement**:
- Header: "PA Ministry of Education + Tech4Palestine"
- School counts: Real data badge
- Damage assessment: "Estimated from infrastructure data"

---

#### 5️⃣ Displacement Stats Component
**File**: [`src/components/dashboards/DisplacementStats.tsx`](src/components/dashboards/DisplacementStats.tsx)

**Current Status**:
- Using sample IDP numbers
- Using estimated shelter data

**Available Data**:
- Population Statistics (Baseline for displacement calculations)
- URL: `https://data.humdata.org/dataset/36271e9b-9ec2-4c1c-bfff-82848eba0b2f/resource/632a784f-482a-4425-af24-01f068d250f6/download/pse_admpop_adm0_2023.csv`

**Required New Files**:
```typescript
// src/services/populationService.ts
- Fetch CSV from HDX
- Parse population by age/sex
- Calculate baseline

// src/hooks/usePopulation.ts
- usePopulationStatistics()
- usePopulationByRegion()
```

**Integration Plan**:
1. Create `populationService.ts`
2. Create `usePopulation.ts`
3. Update `DisplacementStats.tsx`
4. Use population as baseline for displacement estimates
5. Show real population vs. displaced population
6. Add `<DataQualityBadge source="PCBS" />` for population
7. Note that IDP numbers are estimated (pending UNRWA partnership)

**Estimated Time**: 3 hours  
**Estimated Real Data**: 0% → 30%

**Badge Placement**:
- Header: Mixed badges (PCBS for population, sample for IDP)
- Population metrics: Real data badge
- IDP metrics: Sample/estimated badge

---

### Priority 3: Complex Integration (Requires Data Aggregation)

#### 6️⃣ Aid Tracker Component
**File**: [`src/components/dashboards/AidTracker.tsx`](src/components/dashboards/AidTracker.tsx)

**Current Status**:
- Using sample aid delivery data
- Using estimated donor data

**Available Data**:
- Multiple humanitarian datasets on HDX
- ACLED conflict data (for access restrictions proxy)
- Scattered across different sources

**Required Approach**:
```typescript
// src/services/hdxService.ts (Generic HDX access)
- Search HDX for humanitarian datasets
- Download specific datasets
- Aggregate aid-related data

// src/hooks/useHDXData.ts
- useHDXHumanitarianData()
- useACLEDConflictData()
```

**Integration Plan**:
1. Create generic `hdxService.ts` for CKAN API
2. Search HDX for aid-related datasets
3. Aggregate data from multiple sources
4. Show what's available vs. what's needed
5. Add badges for each data source used

**Estimated Time**: 5 hours  
**Estimated Real Data**: 0% → 30-40%

**Badge Placement**:
- Header: "Multiple sources via HDX"
- Each metric: Show specific source
- Note: "Data aggregated from multiple UN sources"

---

### Priority 4: No Automated Data (Manual/Partnership Needed)

#### 7️⃣ Utilities Status Component
**File**: [`src/components/dashboards/UtilitiesStatus.tsx`](src/components/dashboards/UtilitiesStatus.tsx)

**Available Data**:
- Limited structured data
- Can infer from Tech4Palestine infrastructure damage

**Integration Plan**:
1. Use existing Tech4Palestine infrastructure data
2. Show infrastructure damage as proxy for utilities
3. Keep sample data for specific utility metrics
4. Add clear badges distinguishing inferred vs. sample

**Estimated Time**: 2 hours  
**Estimated Real Data**: 0% → 20%

**Badge Placement**:
- Multiple badges: "Inferred from infrastructure damage" + "Sample estimates"

---

#### 8️⃣ Settlement Expansion Component
**File**: [`src/components/dashboards/SettlementExpansion.tsx`](src/components/dashboards/SettlementExpansion.tsx)

**Status**: ❌ No automated data source found

**Recommendation**:
- Keep sample data
- Add clear badge: "Sample data - B'Tselem partnership pending"
- Manual updates from B'Tselem reports
- Long-term: Partner with B'Tselem for data access

**Estimated Time**: 30 minutes (just add badges)  
**Estimated Real Data**: 0% (no change)

---

#### 9️⃣ International Response Component
**File**: [`src/components/dashboards/InternationalResponse.tsx`](src/components/dashboards/InternationalResponse.tsx)

**Status**: ❌ No simple API found

**Recommendation**:
- Keep sample data
- Add clear badge: "Manual tracking - UN records complex"
- Consider manual updates from UN press releases
- Long-term: Explore UN Digital Library API

**Estimated Time**: 30 minutes (just add badges)  
**Estimated Real Data**: 0% (no change)

---

## 🏗️ Implementation Order & Timeline

### Week 1: Quick Wins (Already Exists Hooks)

**Day 1** (2 hours):
```
Component: PrisonersStats.tsx
Hook: usePrisonerData(), useNGOData()
Action:
1. Import hooks
2. Fetch prisoner_data.json
3. Merge with child_prisoners data
4. Add badges for each data source
5. Update metrics display
Badge: "Good Shepherd (4 datasets)"
```

**Day 2** (1 hour):
```
Component: WestBankOverview.tsx  
Hook: useWestBankData()
Action:
1. Import useWestBankData()
2. Enhance existing Tech4Palestine data
3. Show combined sources
4. Add badges
Badge: "Tech4Palestine + Good Shepherd"
```

**End of Week 1**:
- Prisoners: 20% → 90% (+70%)
- West Bank: Partial → 100% (enhanced)
- **Overall Dashboard: 55% → 60% real data**

---

### Week 2: New Services (Health & Education)

**Day 1-2** (4 hours):
```
Component: HealthcareStatus.tsx
New Service: healthFacilitiesService.ts
New Hook: useHealthFacilities.ts

Action:
1. Create service to fetch Google Sheets CSV
2. Parse facility data (name, type, status, location)
3. Create hooks for facilities by status
4. Update component with real facility count
5. Replace healthcare_attacks with facilities
6. Add badges
Badge: "Ministry of Health (Gaza facilities, Nov 2023)"
```

**Day 3-4** (4 hours):
```
Component: EducationImpact.tsx
New Service: schoolsService.ts
New Hook: useSchools.ts

Action:
1. Create service to fetch schools XLSX from HDX
2. Parse schools database
3. Count schools by region/type
4. Cross-reference with infrastructure damage
5. Update component
6. Add badges
Badge: "PA Ministry of Education + Tech4Palestine"
```

**End of Week 2**:
- Healthcare: 10% → 70% (+60%)
- Education: 0% → 50% (+50%)
- **Overall Dashboard: 60% → 67% real data**

---

### Week 3: Complex Integrations

**Day 1-2** (3 hours):
```
Component: DisplacementStats.tsx
New Service: populationService.ts
New Hook: usePopulation.ts

Action:
1. Create service for population CSV
2. Get baseline population by region
3. Show real population stats
4. Keep IDP estimates (note UNRWA partnership pending)
5. Add mixed badges
Badge (population): "PCBS (Real population baseline)"
Badge (IDP): "Sample estimates - UNRWA partnership pending"
```

**Day 3-5** (5 hours):
```
Component: AidTracker.tsx
Service: Enhanced hdxService.ts
Hook: useHDXData.ts

Action:
1. Enhance hdxService for dataset search
2. Query HDX for aid-related datasets
3. Aggregate available data
4. Show partial real data with gaps identified
5. Add multiple badges for different sources
Badge: "Various UN sources via HDX"
```

**End of Week 3**:
- Displacement: 0% → 30% (+30%)
- Aid Tracker: 0% → 30-40% (+30-40%)
- **Overall Dashboard: 67% → 72% real data**

---

### Week 4: Finalization & Edge Cases

**Day 1-2** (2 hours):
```
Component: UtilitiesStatus.tsx

Action:
1. Link to Tech4Palestine infrastructure damage
2. Infer utility status from infrastructure
3. Add clear badges explaining inference
4. Keep sample for specific metrics
Badge: "Inferred from infrastructure data (Tech4Palestine)"
```

**Day 3** (1 hour):
```
Components: SettlementExpansion.tsx, InternationalResponse.tsx

Action:
1. Add sample data badges to both
2. Note partnership/manual tracking status
3. Document what's needed
Badge: "Sample data - [Partnership/Manual] tracking needed"
```

**Day 4-5**:
```
- Final testing
- Documentation updates
- Performance optimization
- User acceptance testing
```

**End of Week 4**:
- Utilities: 0% → 20% (+20%)
- Settlements: 0% (no change - badge added)
- International: 0% (no change - badge added)
- **Overall Dashboard: 72% → 75% real data**

---

## 🎯 Badge System Consistency

### Badge Variants by Data Quality

| Data Quality | Badge Component | Example |
|--------------|-----------------|---------|
| **Real Data** | `<DataQualityBadge isRealData={true} source="Source Name" />` | 🟢 Real data from World Bank |
| **Sample Data** | `<DataQualityBadge isRealData={false} />` | ⚠️ Sample data |
| **Loading** | `<DataLoadingBadge />` | 🔄 Loading data... |
| **Error** | `<DataErrorBadge message="..." />` | ⚠️ Data unavailable |
| **Mixed** | Multiple badges | 🟢 Population (PCBS) + ⚠️ IDP (Sample) |
| **Inferred** | `<Badge variant="outline">` | ℹ️ Inferred from infrastructure |

### Standard Badge Locations

**1. Component Header** (Required):
```typescript
<div className="mt-2">
  {isLoading ? (
    <DataLoadingBadge />
  ) : (
    <DataQualityBadge 
      source="Source Name"
      isRealData={hasRealData}
      recordCount={data?.length}
      showDetails={true}
    />
  )}
</div>
```

**2. Chart/Card Headers** (Optional but recommended):
```typescript
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Chart Title</CardTitle>
    <DataQualityBadge 
      source="Source" 
      isRealData={true}
      showDetails={false}
    />
  </div>
</CardHeader>
```

**3. Component Footer** (Required):
```typescript
<div className="text-xs text-muted-foreground text-center p-4 border-t">
  {hasRealData ? (
    <>✅ Real data from <strong>Source</strong>. Details...</>
  ) : (
    <>⚠️ Sample data. Integration pending...</>
  )}
</div>
```

**4. Individual Metrics** (When mixed data):
```typescript
<ExpandableMetricCard
  title="Metric Name"
  value="Value"
  subtitle={hasRealData ? "Real data from Source" : "Estimated"}
/>
```

---

## 📋 New Services Needed

### Service 1: Health Facilities
```typescript
// src/services/healthFacilitiesService.ts
export interface HealthFacility {
  name: string;
  type: 'hospital' | 'clinic' | 'health_center';
  governorate: string;
  region: 'Gaza' | 'West Bank';
  status: 'operational' | 'damaged' | 'destroyed' | 'partially_operational';
  services: string[];
}

export const fetchGazaHealthFacilities = async (): Promise<HealthFacility[]> => {
  const url = 'https://docs.google.com/spreadsheets/.../pub?output=csv';
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => resolve(results.data as HealthFacility[]),
      error: reject,
    });
  });
};
```

### Service 2: Schools Database
```typescript
// src/services/schoolsService.ts
import * as XLSX from 'xlsx';

export interface School {
  nameEn: string;
  nameAr: string;
  code: string;
  district: string;
  type: 'public' | 'private' | 'unrwa';
  region: 'Gaza' | 'West Bank';
}

export const fetchSchools = async (): Promise<School[]> => {
  const url = 'https://data.humdata.org/dataset/.../schools_opt_.xlsx';
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet) as School[];
};
```

### Service 3: Population Statistics
```typescript
// src/services/populationService.ts
export interface PopulationData {
  year: number;
  region: string;
  total: number;
  male: number;
  female: number;
  ageGroups: Record<string, number>;
}

export const fetchPopulationStats = async (): Promise<PopulationData[]> => {
  const url = 'https://data.humdata.org/dataset/.../pse_admpop_adm0_2023.csv';
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => resolve(results.data as PopulationData[]),
      error: reject,
    });
  });
};
```

### Service 4: Generic HDX Service
```typescript
// src/services/hdxService.ts
const HDX_API = 'https://data.humdata.org/api/3';

export const searchHDXDatasets = async (query: string) => {
  const url = `${HDX_API}/action/package_search?q=${query}`;
  const response = await fetch(url);
  return await response.json();
};

export const downloadHDXResource = async (resourceUrl: string, format: 'csv' | 'xlsx' | 'json') => {
  const response = await fetch(resourceUrl);
  
  if (format === 'csv') {
    const text = await response.text();
    return Papa.parse(text, { header: true, dynamicTyping: true }).data;
  } else if (format === 'xlsx') {
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  } else {
    return await response.json();
  }
};
```

---

## 🧪 Testing Strategy

### For Each Component Integration

**1. Unit Testing**:
- [ ] Service fetches data successfully
- [ ] Hook returns correct data structure  
- [ ] Component renders with real data
- [ ] Component handles loading state
- [ ] Component handles error state
- [ ] Fallback to sample data works

**2. Integration Testing**:
- [ ] Badge shows correct source
- [ ] Badge updates on data state change
- [ ] Multiple badges work together
- [ ] Loading badge appears while fetching
- [ ] Error badge shows on failure

**3. Performance Testing**:
- [ ] Caching works (check Network tab)
- [ ] No unnecessary re-renders
- [ ] Page load time < 3 seconds
- [ ] No memory leaks
- [ ] Large datasets don't freeze UI

**4. User Acceptance Testing**:
- [ ] Real data displays correctly
- [ ] Sample data clearly labeled
- [ ] Source attribution visible
- [ ] Update timestamps accurate
- [ ] Charts render with real data

---

## 📊 Expected Coverage After All Updates

### Component Status Projection

| Component | Current | After Update | Improvement | Timeline |
|-----------|---------|--------------|-------------|----------|
| Gaza Casualties | 100% | 100% | 0% | ✅ Done |
| West Bank | 100% | 100% | 0% | ✅ Done |
| Infrastructure | 100% | 100% | 0% | ✅ Done |
| Press | 100% | 100% | 0% | ✅ Done |
| **Economic Impact** | 60% | 80%* | +20% | ✅ Done + enhance |
| **Food Security** | 70% | 90%* | +20% | ✅ Done + enhance |
| **Prisoners** | 20% | 90% | +70% | Week 1 |
| **West Bank Overview** | Partial | 100% | +30% | Week 1 |
| **Healthcare** | 10% | 70% | +60% | Week 2 |
| **Education** | 0% | 50% | +50% | Week 2 |
| **Displacement** | 0% | 30% | +30% | Week 3 |
| **Aid Tracker** | 0% | 40% | +40% | Week 3 |
| **Utilities** | 0% | 20% | +20% | Week 4 |
| **Settlements** | 0% | 0% | 0% | N/A |
| **International** | 0% | 0% | 0% | N/A |

\* Can be enhanced further with malnutrition data (IPC/UNICEF) and CPI data

**Overall Projection**:
- Current: 55% real data
- Week 1: 60% real data
- Week 2: 67% real data
- Week 3: 72% real data
- Week 4: 75% real data
- With enhancements: 80-85% real data

---

## 🎯 Detailed Component Integration Steps

### Template for Each Component

```typescript
// STEP 1: Add imports
import { useYourDataHook } from '@/hooks/useYourDataHook';
import { DataQualityBadge, DataLoadingBadge } from '@/components/ui/data-quality-badge';

// STEP 2: Add hook in component
export const YourComponent = () => {
  const { data, isLoading, error } = useYourDataHook();
  
  // STEP 3: Check if real data available
  const hasRealData = !error && data && data.length > 0;
  const isLoadingData = loading || isLoading;
  
  // STEP 4: Use real data with fallback
  const displayData = hasRealData ? transformRealData(data) : SAMPLE_DATA;
  
  // STEP 5: Add badges in header
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Component Title</h2>
          <p>Description</p>
          <div className="mt-2">
            {isLoadingData ? (
              <DataLoadingBadge />
            ) : (
              <DataQualityBadge 
                source="Source Name"
                isRealData={hasRealData}
                recordCount={data?.length}
                showDetails={true}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* STEP 6: Add badges to charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chart Title</CardTitle>
            <DataQualityBadge 
              source="Source" 
              isRealData={hasRealData}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart using displayData */}
        </CardContent>
      </Card>
      
      {/* STEP 7: Add footer with data source info */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        {hasRealData ? (
          <>✅ Real data from <strong>Source</strong>. Details...</>
        ) : (
          <>⚠️ Sample data. Integration pending...</>
        )}
      </div>
    </div>
  );
};
```

---

## 📝 Checklist for Each Component Update

### Pre-Implementation
- [ ] Identify available data source
- [ ] Check if hook/service exists
- [ ] Review component current structure
- [ ] Plan data transformation needed

### Implementation
- [ ] Create service (if needed)
- [ ] Create hooks (if needed)
- [ ] Import hooks in component
- [ ] Fetch real data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Transform data for display
- [ ] Add fallback logic

### Badge Integration
- [ ] Add `<DataLoadingBadge />` during fetch
- [ ] Add `<DataQualityBadge />` in header
- [ ] Add badges to each chart/card
- [ ] Add footer with data source info
- [ ] Handle mixed data sources (multiple badges)

### Testing
- [ ] Component renders without errors
- [ ] Real data displays correctly
- [ ] Loading state works
- [ ] Error state works
- [ ] Fallback to sample works
- [ ] Badges show correct info
- [ ] Performance is acceptable

---

## 🔧 Service File Creation Guide

### When to Create New Service

Create new service when:
- ✅ Data source is external API (not already in apiOrchestrator)
- ✅ Data requires transformation/parsing
- ✅ Data will be reused across components
- ✅ Complex data processing logic needed

### Service File Template

```typescript
// src/services/yourService.ts

/**
 * Your Service
 * Description of what this service does
 * Data Source: Source name and URL
 */

import Papa from 'papaparse'; // For CSV
// or
import * as XLSX from 'xlsx'; // For Excel

// Constants
const YOUR_DATA_URL = 'https://...';

// Types
export interface YourDataType {
  field1: string;
  field2: number;
}

// Error Class
export class YourServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'YourServiceError';
  }
}

// Main fetch function
export const fetchYourData = async (): Promise<YourDataType[]> => {
  try {
    const response = await fetch(YOUR_DATA_URL);
    if (!response.ok) {
      throw new YourServiceError(`Failed: ${response.statusText}`, response.status);
    }
    
    // Parse CSV
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => resolve(results.data as YourDataType[]),
        error: reject,
      });
    });
    
    // OR Parse XLSX
    // const buffer = await response.arrayBuffer();
    // const workbook = XLSX.read(buffer, { type: 'array' });
    // const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // return XLSX.utils.sheet_to_json(sheet);
    
  } catch (error) {
    throw new YourServiceError(`Error: ${error.message}`);
  }
};

// Utility functions
export const filterYourData = (data: YourDataType[], filter: string) => {
  return data.filter(item => item.field1.includes(filter));
};
```

---

## 🎓 Best Practices for Updates

### Do's ✅
- ✅ Always add loading states
- ✅ Always add error handling
- ✅ Always add fallback to sample data
- ✅ Always add `<DataQualityBadge />`
- ✅ Always document data source in footer
- ✅ Use TypeScript types for all data
- ✅ Cache data appropriately (12-24 hours)
- ✅ Show record counts when available
- ✅ Show last update timestamps
- ✅ Test both success and error states

### Don'ts ❌
- ❌ Don't remove sample data (keep as fallback)
- ❌ Don't break existing functionality
- ❌ Don't ignore loading/error states
- ❌ Don't forget badges
- ❌ Don't skip testing
- ❌ Don't hardcode data sources
- ❌ Don't fetch data on every render (use React Query)
- ❌ Don't ignore CORS issues (test in browser)
- ❌ Don't assume API will always work
- ❌ Don't forget documentation

---

## 📈 Success Metrics

### Per Component
- ✅ Real data integration percentage increased
- ✅ Badge system consistently implemented
- ✅ Loading states working
- ✅ Error handling graceful
- ✅ Performance maintained

### Overall Dashboard
- ✅ 75%+ real data coverage achieved
- ✅ All components have badges
- ✅ All components have fallbacks
- ✅ No breaking changes
- ✅ User experience enhanced

---

## 🚀 Quick Start Implementation

### Start with Prisoners Stats (Easiest Next Step)

```bash
# 1. Open file
code src/components/dashboards/PrisonersStats.tsx

# 2. Add imports at top
import { usePrisonerData, useNGOData } from '@/hooks/useGoodShepherdData';
import { DataQualityBadge, DataLoadingBadge } from '@/components/ui/data-quality-badge';

# 3. Add hooks in component
const { data: prisonerData, isLoading: prisonerLoading } = usePrisonerData();
const { data: ngoData, isLoading: ngoLoading } = useNGOData();

# 4. Use data and add badges (follow EconomicImpact.tsx pattern)

# 5. Test in browser
npm run dev
# Navigate to Prisoners Stats page
```

---

**Plan Status**: ✅ Complete and Ready  
**Next Action**: Implement prisoners stats integration (2 hours)  
**Expected Final Coverage**: 75-85% real data across all components