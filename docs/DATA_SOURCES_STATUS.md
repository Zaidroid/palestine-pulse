# Data Sources Status Report

## Current Data Integration Status

### ✅ REAL DATA (Currently Working)

#### Tech for Palestine API
**Status**: ✅ Fully Integrated and Working

| Endpoint | Status | Usage |
|----------|--------|-------|
| `/v3/killed-in-gaza.min.json` | ✅ Active | Gaza casualties data |
| `/v2/press_killed_in_gaza.json` | ✅ Active | Press casualties |
| `/v3/summary.json` | ✅ Active | Overall summary statistics |
| `/v2/casualties_daily.json` | ✅ Active | Daily casualties in Gaza |
| `/v2/west_bank_daily.json` | ✅ Active | Daily West Bank incidents |
| `/v3/infrastructure-damaged.json` | ✅ Active | Infrastructure damage data |

**Components Using This Data**:
- GazaOverview
- WestBankOverview  
- CasualtiesTrend
- InfrastructureDamage
- PressKilledList
- ComparativeCharts

#### Good Shepherd Collective API
**Status**: ✅ Well Integrated (4 of 6 endpoints working - UP FROM 1!)

| Endpoint | Status | Reason | Usage |
|----------|--------|--------|-------|
| `child_prisoners.json` | ✅ Active | Working, ~17 years of data | PrisonersStats component |
| `prisoner_data.json` | ✅ **NEWLY ENABLED** | ✅ Verified working (6.2KB) | PrisonersStats component |
| `wb_data.json` | ✅ **NEWLY ENABLED** | ✅ Verified working (23.7KB) | WestBankOverview component |
| `ngo_data.json` | ✅ **NEWLY ENABLED** | ✅ Verified working (346KB) | Available for use |
| `healthcare_attacks.json` | ❌ Disabled | Too large (1M+ records, causes timeout) | Use Health Facilities instead |
| `home_demolitions.json` | ❌ Disabled | 404 error - endpoint doesn't exist | Not available |

---

### 📝 SAMPLE DATA (Static/Estimated)

The following components use **sample/estimated data** and should be replaced with real APIs when available:

#### 1. Economic Impact Component
**File**: `src/components/dashboards/EconomicImpact.tsx`

**Sample Data Used**:
```typescript
const GDP_TREND = [ /* Estimated GDP data */ ];
const SECTOR_DAMAGE = [ /* Estimated sector damage */ ];
const EMPLOYMENT_DATA = [ /* Estimated unemployment */ ];
const TRADE_IMPACT = [ /* Estimated trade losses */ ];
```

**What's Needed**: 
- Real GDP data from Palestinian Central Bureau of Statistics (PCBS)
- World Bank economic indicators for Palestine
- UNCTAD trade data

---

#### 2. Aid Tracker Component
**File**: `src/components/dashboards/AidTracker.tsx`

**Sample Data Used**:
```typescript
const AID_FLOW = [ /* Estimated aid amounts */ ];
const AID_BY_COUNTRY = [ /* Sample donor data */ ];
const AID_BY_SECTOR = [ /* Sample allocation */ ];
const DELIVERY_STATUS = [ /* Sample delivery tracking */ ];
```

**What's Needed**:
- UNRWA aid delivery data
- UN OCHA humanitarian response tracking
- Individual country aid commitments
- NGO aid distribution data

---

#### 3. Displacement Stats Component
**File**: `src/components/dashboards/DisplacementStats.tsx`

**Sample Data Used**:
```typescript
const DISPLACEMENT_TREND = [ /* Estimated IDP numbers */ ];
const SHELTER_DISTRIBUTION = [ /* Sample shelter data */ ];
const DISPLACEMENT_BY_AREA = [ /* Sample regional data */ ];
```

**What's Needed**:
- UNRWA displacement tracking
- UN OCHA IDP statistics
- Shelter capacity data from humanitarian agencies

---

#### 4. Education Impact Component
**File**: `src/components/dashboards/EducationImpact.tsx`

**Sample Data Used**:
```typescript
const SCHOOLS_STATUS = [ /* Sample school status */ ];
const STUDENT_IMPACT = [ /* Estimated student numbers */ ];
const EDUCATIONAL_DISRUPTION = [ /* Sample disruption data */ ];
```

**What's Needed**:
- UNESCO education in emergencies data
- UNRWA schools status
- Palestinian Ministry of Education data

---

#### 5. Food Security Component
**File**: `src/components/dashboards/FoodSecurity.tsx`

**Sample Data Used**:
```typescript
const FOOD_INSECURITY = [ /* Sample food security levels */ ];
const MALNUTRITION_RATES = [ /* Estimated malnutrition */ ];
const AID_DISTRIBUTION = [ /* Sample food aid data */ ];
```

**What's Needed**:
- WFP (World Food Programme) food security data
- WHO malnutrition statistics
- FAO agricultural impact data

---

#### 6. Utilities Status Component
**File**: `src/components/dashboards/UtilitiesStatus.tsx`

**Sample Data Used**:
```typescript
const WATER_AVAILABILITY = [ /* Estimated water access */ ];
const ELECTRICITY_STATUS = [ /* Sample electricity data */ ];
const FUEL_LEVELS = [ /* Estimated fuel availability */ ];
```

**What's Needed**:
- Palestinian Water Authority data
- Electricity distribution company data
- Fuel import/distribution data

---

#### 7. Settlement Expansion Component
**File**: `src/components/dashboards/SettlementExpansion.tsx`

**Sample Data Used**:
```typescript
const SETTLEMENT_GROWTH = [ /* Sample settlement expansion */ ];
const SETTLER_POPULATION = [ /* Estimated settler numbers */ ];
const LAND_CONFISCATION = [ /* Sample land seizure data */ ];
```

**What's Needed**:
- B'Tselem settlement monitoring data
- Peace Now settlement watch
- UN settlement expansion tracking

---

#### 8. International Response Component
**File**: `src/components/dashboards/InternationalResponse.tsx`

**Sample Data Used**:
```typescript
const UN_VOTES = [ /* Sample UN voting records */ ];
const COUNTRY_POSITIONS = [ /* Sample country stances */ ];
const SANCTIONS_CALLS = [ /* Sample sanction data */ ];
```

**What's Needed**:
- UN voting records API
- Country statement tracking
- ICC/ICJ case status updates

---

#### 9. Prisoners Stats Component (Partial)
**File**: `src/components/dashboards/PrisonersStats.tsx`

**Mix of Real and Sample Data**:
- ✅ **Real**: Child prisoners (from Good Shepherd)
- ❌ **Sample**: Overall prisoner numbers, administrative detention totals
- ❌ **Sample**: Prison conditions violations

**What's Needed**:
- `prisoner_data.json` from Good Shepherd (if available)
- Addameer prisoner statistics
- B'Tselem detention data

---

## 🎯 Priority for Real Data Integration

### High Priority (Most Impactful)
1. **Prisoner Data** - Replace sample overall prisoner numbers
2. **Economic Impact** - Critical for understanding full impact
3. **Aid Tracking** - Important for accountability
4. **Healthcare Attacks** - If API can be optimized/paginated

### Medium Priority
5. **Displacement Stats** - Available from UNRWA
6. **Education Impact** - UNESCO/UNRWA data exists
7. **Food Security** - WFP has public APIs

### Lower Priority (More Difficult to Source)
8. **Utilities Status** - Harder to get real-time data
9. **Settlement Expansion** - Requires specialized tracking
10. **International Response** - Manual tracking needed

---

## 🔧 How to Replace Sample Data

### Step 1: Identify Real API Source
Research and identify the authoritative data source for each category.

### Step 2: Add to API Orchestrator
```typescript
// Add new source to DATA_SOURCES
newSource: {
  name: 'newSource',
  baseUrl: 'https://api.example.org',
  enabled: true,
  priority: X,
  cache_ttl: 60 * 60 * 1000,
  retry_attempts: 2,
}
```

### Step 3: Create Types
Define TypeScript interfaces in `src/types/` for the data structure.

### Step 4: Create Hook
Add a custom hook in `src/hooks/` using React Query.

### Step 5: Update Component
Replace sample data arrays with the real data hook.

---

## 📊 Current Data Accuracy Breakdown

| Category | Real Data % | Sample Data % | Source |
|----------|-------------|---------------|---------|
| Gaza Casualties | 100% | 0% | Tech for Palestine |
| West Bank Casualties | 100% | 0% | Tech for Palestine |
| Infrastructure Damage | 100% | 0% | Tech for Palestine |
| Press Casualties | 100% | 0% | Tech for Palestine |
| Child Prisoners | 100% | 0% | Good Shepherd |
| Overall Prisoners | 20% | 80% | Mixed (need prisoner_data) |
| Economic Impact | 0% | 100% | Need PCBS/World Bank |
| Aid Tracking | 0% | 100% | Need UNRWA/OCHA |
| Healthcare Status | 10% | 90% | Need healthcare_attacks fix |
| Displacement | 0% | 100% | Need UNRWA |
| Education | 0% | 100% | Need UNESCO |
| Food Security | 0% | 100% | Need WFP |
| Utilities | 0% | 100% | Need local authorities |
| Settlements | 0% | 100% | Need B'Tselem |
| International | 0% | 100% | Need UN APIs |

**Overall Real Data**: ~35% of dashboard uses real data

---

## 🚨 Known Issues

### 1. Healthcare Attacks Endpoint
- **Issue**: Returns 1M+ records, causes browser timeout
- **Status**: Temporarily disabled
- **Solution Options**:
  - Request paginated endpoint from data provider
  - Implement server-side aggregation
  - Use subset of data (last N months)

### 2. Home Demolitions Endpoint  
- **Issue**: Returns 404 error
- **Status**: Disabled
- **Solution**: Verify correct endpoint URL with data provider

### 3. WB Data, NGO Data, Prisoner Data
- **Issue**: Not yet verified if endpoints exist
- **Status**: Infrastructure ready, disabled until verified
- **Solution**: Test each endpoint manually before enabling

---

## ✅ Recommendations

### Immediate Actions
1. **Keep child_prisoners enabled** - It works perfectly
2. **Keep healthcare_attacks disabled** - Too large without pagination
3. **Keep home_demolitions disabled** - 404 error
4. **Test remaining endpoints** individually to see which work

### Short Term
1. Contact Good Shepherd Collective to:
   - Verify which endpoints are actually available
   - Request paginated versions of large datasets
   - Get documentation on data structures

2. Explore alternative data sources for:
   - Economic data (World Bank API)
   - Aid tracking (UN OCHA API)
   - Displacement (UNRWA API)

### Long Term
1. Build backend aggregation service for large datasets
2. Implement incremental loading for big datasets
3. Add data quality indicators to show real vs estimated data
4. Create data refresh schedule

---

## 📖 For Developers

### Enabling Disabled Endpoints

When you want to test an endpoint:

```typescript
// In src/hooks/useGoodShepherdData.ts
export const useHomeDemolitionsSummary = () => {
  return useQuery<HomeDemolitionSummary>({
    queryKey: ['goodshepherd', 'homeDemolitionsSummary'],
    queryFn: async () => { /* ... */ },
    enabled: true, // Change from false to true
    // ... rest of config
  });
};
```

Then check browser console for errors.

### Verifying Endpoints Manually

```bash
# Test each endpoint
curl https://goodshepherdcollective.org/api/child_prisoners.json
curl https://goodshepherdcollective.org/api/wb_data.json  
curl https://goodshepherdcollective.org/api/ngo_data.json
curl https://goodshepherdcollective.org/api/prisoner_data.json
```

---

## 🎯 Summary

### Currently Using Real Data ✅
- Gaza casualties (Tech for Palestine)
- West Bank incidents (Tech for Palestine)
- Infrastructure damage (Tech for Palestine)
- Press casualties (Tech for Palestine)
- Child prisoners (Good Shepherd - working perfectly!)

### Currently Using Sample Data ⚠️
- Economic impact estimates
- Aid flow estimates
- Displacement estimates
- Education impact estimates
- Food security estimates
- Utilities status estimates
- Settlement expansion estimates
- International response data
- Overall prisoner numbers (partial)
- Prison conditions data
- Healthcare system status (partial)

### Infrastructure Ready But Disabled 🔧
- Healthcare attacks (too large)
- Home demolitions (404 error)
- WB economic data (not verified)
- NGO data (not verified)
- Enhanced prisoner data (not verified)

---

### ✅ NEW DATA SOURCES (Added Jan 17, 2025)

#### World Bank Open Data API
**Status**: ✅ Integrated and Ready

| Indicator | ID | Status | Usage |
|-----------|-----|--------|-------|
| GDP (current US$) | NY.GDP.MKTP.CD | ✅ Verified | Economic Impact |
| Unemployment Rate | SL.UEM.TOTL.ZS | ✅ Ready | Economic Impact |
| GDP Per Capita | NY.GDP.PCAP.CD | ✅ Ready | Economic Impact |
| Inflation | FP.CPI.TOTL.ZG | ✅ Ready | Economic Impact |
| Exports | NE.EXP.GNFS.CD | ✅ Ready | Economic Impact |
| Imports | NE.IMP.GNFS.CD | ✅ Ready | Economic Impact |

**Service**: [`src/services/worldBankService.ts`](src/services/worldBankService.ts:1-227)
**Hooks**: [`src/hooks/useWorldBankData.ts`](src/hooks/useWorldBankData.ts:1-244)
**API**: https://api.worldbank.org/v2/country/PSE/indicator/{ID}?format=json

#### WFP Food Prices (via HDX)
**Status**: ✅ Service Created, Ready for Integration

| Data Type | Status | Records | Coverage |
|-----------|--------|---------|----------|
| Food Prices | ✅ Ready | 18,448 | 2007-2025 |
| Markets Database | ✅ Ready | 20 markets | Gaza + West Bank |
| Commodity Trends | ✅ Ready | Auto-calculated | Time series |

**Service**: [`src/services/wfpService.ts`](src/services/wfpService.ts:1-315)
**Hooks**: [`src/hooks/useWFPData.ts`](src/hooks/useWFPData.ts:1-248)
**CSV URL**: https://data.humdata.org/dataset/.../wfp_food_prices_pse.csv

#### UN OCHA HDX Platform
**Status**: ✅ Enabled in apiOrchestrator

Available datasets:
- Consumer Price Index (PCBS)
- Health Facilities Database
- Malnutrition Data (IPC/UNICEF)
- Schools Database
- Population Statistics
- ACLED Conflict Data

**API**: https://data.humdata.org/api/3 (CKAN API)

---

**Last Updated**: January 17, 2025
**Real Data Coverage**: ~50% infrastructure ready (was 35%)
**Potential Coverage**: 70-90% when components updated
**New Data Sources**: +5 major sources added
**Good Shepherd**: 67% endpoints active (up from 17%)