# Free Data Endpoints - Quick Reference
**Palestine Pulse Dashboard - Endpoint Mapping**

---

## 🎯 Component-to-Endpoint Mapping

### 1. Economic Impact Component
**File**: `src/components/dashboards/EconomicImpact.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **GDP Data** | World Bank | `https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2024` | JSON | None | Annual |
| **Unemployment** | World Bank | `https://api.worldbank.org/v2/country/PSE/indicator/SL.UEM.TOTL.ZS?format=json&date=2020:2024` | JSON | None | Annual |
| **Consumer Price Index** | PCBS via HDX | `https://data.humdata.org/dataset/0e06dbe6-8eeb-4b26-ba12-652520b44177/resource/4ea77774-3f0c-4b94-bda8-c2efb82d0394/download/consumer-price-index.xlsx` | XLSX | None | Monthly |
| **Inflation** | World Bank | `https://api.worldbank.org/v2/country/PSE/indicator/FP.CPI.TOTL.ZG?format=json` | JSON | None | Annual |

**Status**: 🔥 **HIGH PRIORITY** - All endpoints ready  
**Estimated Coverage**: Can replace 80% of sample data

---

### 2. Aid Tracker Component
**File**: `src/components/dashboards/AidTracker.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Humanitarian Data** | HDX Search | `https://data.humdata.org/api/3/action/package_search?q=palestine+humanitarian+aid` | JSON | None | Varies |
| **Conflict Events** | ACLED via HDX | `https://data.humdata.org/dataset/a01fb41d-b89c-4de0-abbd-b5046695d448` | XLSX | None | Weekly |

**Status**: 🟡 **MEDIUM PRIORITY** - Requires data aggregation  
**Estimated Coverage**: Can replace 40% of sample data  
**Note**: Aid delivery data scattered across multiple HDX datasets

---

### 3. Displacement Stats Component
**File**: `src/components/dashboards/DisplacementStats.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Population Baseline** | COD-PS via HDX | `https://data.humdata.org/dataset/36271e9b-9ec2-4c1c-bfff-82848eba0b2f/resource/632a784f-482a-4425-af24-01f068d250f6/download/pse_admpop_adm0_2023.csv` | CSV | None | Annual |
| **IDP Tracking** | UNRWA | *Requires research/partnership* | N/A | TBD | TBD |

**Status**: 🟡 **MEDIUM PRIORITY** - Partial data available  
**Estimated Coverage**: Can replace 30% of sample data  
**Action Required**: Research UNRWA data availability

---

### 4. Education Impact Component
**File**: `src/components/dashboards/EducationImpact.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Schools Database** | PA MoE via HDX | `https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx` | XLSX | None | Annual |
| **School Damage** | Cross-ref ACLED | Combine schools + conflict data | Mixed | None | Weekly |

**Status**: 🟡 **MEDIUM PRIORITY** - School list available, damage needs work  
**Estimated Coverage**: Can replace 50% of sample data

---

### 5. Food Security Component
**File**: `src/components/dashboards/FoodSecurity.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Food Prices** | WFP via HDX | `https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv` | CSV | None | Weekly |
| **Malnutrition** | IPC/UNICEF via HDX | `https://data.humdata.org/dataset/a1365b03-91e1-4fe1-a8b3-87973cdd0eba/resource/f135fa53-1d54-4de5-ad21-15cbefcef97f/download/malnutrition-in-gaza-strip_may2025.xlsx` | XLSX | None | Quarterly |

**Status**: 🔥 **HIGHEST PRIORITY** - Complete data available  
**Estimated Coverage**: Can replace 90% of sample data  
**Data Points**: 18,448 food price records, 20 markets, 2007-2025

---

### 6. Healthcare Status Component
**File**: `src/components/dashboards/HealthcareStatus.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Gaza Hospitals** | MoH via Google Sheets | `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv` | CSV | None | As updated |
| **All Facilities** | MoH via HDX | `https://data.humdata.org/dataset/15d8f2ca-3528-4fb1-9cf5-a91ed3aba170` | SHP | None | Annual |

**Status**: 🔥 **HIGH PRIORITY** - Good alternative to healthcare_attacks  
**Estimated Coverage**: Can replace 70% of sample data  
**Note**: Replaces problematic healthcare_attacks.json (too large)

---

### 7. Utilities Status Component
**File**: `src/components/dashboards/UtilitiesStatus.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Infrastructure** | Tech4Palestine | Already integrated | JSON | None | Daily |
| **Direct Utility Data** | Not found | N/A | N/A | N/A | N/A |

**Status**: 🟢 **LOW PRIORITY** - Limited structured data  
**Estimated Coverage**: Can infer 20% from infrastructure damage  
**Alternative**: Monitor infrastructure damage as proxy for utilities

---

### 8. Settlement Expansion Component
**File**: `src/components/dashboards/SettlementExpansion.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Settlement Data** | B'Tselem | No public API | N/A | N/A | N/A |

**Status**: 🟢 **LOW PRIORITY** - Requires partnership  
**Estimated Coverage**: 0% (no automated source found)  
**Action Required**: Contact B'Tselem for data partnership

---

### 9. International Response Component
**File**: `src/components/dashboards/InternationalResponse.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **UN Votes** | UN Digital Library | *Requires research* | N/A | N/A | N/A |

**Status**: 🟢 **LOW PRIORITY** - Complex source  
**Estimated Coverage**: 0% (no simple API found)  
**Alternative**: Manual tracking from UN press releases

---

### 10. Prisoners Stats Component
**File**: `src/components/dashboards/PrisonersStats.tsx`

| Data Type | Source | Endpoint | Format | Auth | Update Freq |
|-----------|--------|----------|--------|------|-------------|
| **Child Prisoners** | Good Shepherd | `https://goodshepherdcollective.org/api/child_prisoners.json` | JSON | None | Unknown |
| **Prisoner Data** | Good Shepherd | `https://goodshepherdcollective.org/api/prisoner_data.json` ⚠️ | JSON | None | Unknown |
| **West Bank Data** | Good Shepherd | `https://goodshepherdcollective.org/api/wb_data.json` ⚠️ | JSON | None | Unknown |
| **NGO Data** | Good Shepherd | `https://goodshepherdcollective.org/api/ngo_data.json` ⚠️ | JSON | None | Unknown |

**Status**: 🟡 **MEDIUM PRIORITY** - Need to test endpoints  
**Estimated Coverage**: Could reach 70-90% if endpoints work  
⚠️ = Not yet verified, requires testing

---

## 🚀 Implementation Commands

### Test Good Shepherd Endpoints
```bash
# Test each endpoint
curl -I https://goodshepherdcollective.org/api/prisoner_data.json
curl -I https://goodshepherdcollective.org/api/wb_data.json
curl -I https://goodshepherdcollective.org/api/ngo_data.json

# If 200 OK, download sample
curl https://goodshepherdcollective.org/api/prisoner_data.json | jq '.' > prisoner_data_sample.json
```

### Test World Bank API
```bash
# GDP
curl "https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2024" | jq '.'

# Unemployment
curl "https://api.worldbank.org/v2/country/PSE/indicator/SL.UEM.TOTL.ZS?format=json&date=2020:2024" | jq '.'
```

### Install Required Packages
```bash
npm install papaparse xlsx
npm install --save-dev @types/papaparse
```

---

## 📊 Data Availability Summary

| Component | Ready Data | Missing Data | Priority | Estimated Time |
|-----------|-----------|--------------|----------|----------------|
| **Food Security** | 90% | 10% | 🔥 HIGH | 2-3 days |
| **Economic Impact** | 80% | 20% | 🔥 HIGH | 3-4 days |
| **Healthcare** | 70% | 30% | 🔥 HIGH | 2-3 days |
| **Education** | 50% | 50% | 🟡 MEDIUM | 4-5 days |
| **Aid Tracker** | 40% | 60% | 🟡 MEDIUM | 5-6 days |
| **Prisoners** | 30%* | 70% | 🟡 MEDIUM | 1 day (test) |
| **Displacement** | 30% | 70% | 🟡 MEDIUM | 5-7 days |
| **Utilities** | 20% | 80% | 🟢 LOW | N/A |
| **Settlements** | 0% | 100% | 🟢 LOW | Partnership |
| **International** | 0% | 100% | 🟢 LOW | Manual |

\* If Good Shepherd endpoints work

---

## 🎯 Recommended Implementation Order

### Week 1: Quick Wins (3 integrations)
1. **Day 1-2**: WFP Food Prices → Food Security
2. **Day 3-4**: World Bank API → Economic Impact
3. **Day 5**: Test Good Shepherd endpoints → Prisoners

**Expected Outcome**: Real data increases from 35% → 55%

### Week 2: HDX Datasets (3 integrations)
4. **Day 1-2**: Health Facilities → Healthcare Status
5. **Day 3-4**: Malnutrition Data → Food Security (enhance)
6. **Day 5**: PCBS CPI → Economic Impact (enhance)

**Expected Outcome**: Real data increases from 55% → 70%

### Week 3: Advanced (2 integrations)
7. **Day 1-3**: Schools Database → Education Impact
8. **Day 4-5**: Population Statistics → Displacement (baseline)

**Expected Outcome**: Real data increases from 70% → 80%

### Week 4: Partnerships & Optimization
9. Contact Good Shepherd for endpoint verification
10. Research UNRWA displacement data access
11. Add data quality indicators to all components
12. Optimize caching and performance

**Expected Outcome**: Real data reaches 85%+

---

## 🔗 All Verified Endpoints

### Immediately Usable (No Setup Required)

#### World Bank API
```
✅ GDP: https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json
✅ Unemployment: https://api.worldbank.org/v2/country/PSE/indicator/SL.UEM.TOTL.ZS?format=json
✅ GDP Per Capita: https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.PCAP.CD?format=json
✅ Inflation: https://api.worldbank.org/v2/country/PSE/indicator/FP.CPI.TOTL.ZG?format=json
```

#### WFP Food Security
```
✅ Food Prices CSV: https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv
```

#### Health Facilities
```
✅ Gaza Hospitals (Google Sheets CSV): https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv
```

#### Malnutrition
```
✅ Gaza Malnutrition (XLSX): https://data.humdata.org/dataset/a1365b03-91e1-4fe1-a8b3-87973cdd0eba/resource/f135fa53-1d54-4de5-ad21-15cbefcef97f/download/malnutrition-in-gaza-strip_may2025.xlsx
```

#### Education
```
✅ Schools Database (XLSX): https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx
```

#### Economic - PCBS
```
✅ Consumer Price Index (XLSX): https://data.humdata.org/dataset/0e06dbe6-8eeb-4b26-ba12-652520b44177/resource/4ea77774-3f0c-4b94-bda8-c2efb82d0394/download/consumer-price-index.xlsx
```

#### Population
```
✅ Population Statistics (CSV): https://data.humdata.org/dataset/36271e9b-9ec2-4c1c-bfff-82848eba0b2f/resource/632a784f-482a-4425-af24-01f068d250f6/download/pse_admpop_adm0_2023.csv
```

---

### Needs Testing (Good Shepherd Collective)

```bash
⚠️ Prisoner Data: https://goodshepherdcollective.org/api/prisoner_data.json
⚠️ West Bank Data: https://goodshepherdcollective.org/api/wb_data.json
⚠️ NGO Data: https://goodshepherdcollective.org/api/ngo_data.json
```

**Test Command**:
```bash
for endpoint in prisoner_data wb_data ngo_data; do
  echo "Testing $endpoint..."
  curl -I "https://goodshepherdcollective.org/api/${endpoint}.json"
  echo "---"
done
```

---

### Not Available (Requires Partnerships)

```
❌ Settlement Data: B'Tselem (no public API)
❌ Real-time IDP: UNRWA (requires partnership)
❌ Utilities Data: Not found
❌ UN Voting Records: Complex/manual
```

---

## 💻 Sample Integration Code

### Complete Example: Food Security with WFP Data

```typescript
// src/hooks/useWFPData.ts
import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

interface WFPFoodPrice {
  date: string;
  admin1: string;
  commodity: string;
  usdprice: number;
}

export const useWFPFoodPrices = () => {
  return useQuery({
    queryKey: ['wfp', 'foodPrices'],
    queryFn: async () => {
      const url = 'https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv';
      
      const response = await fetch(url);
      const csvText = await response.text();
      
      return new Promise<WFPFoodPrice[]>((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => resolve(results.data as WFPFoodPrice[]),
          error: reject,
        });
      });
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    retry: 2,
  });
};

// src/components/dashboards/FoodSecurity.tsx
import { useWFPFoodPrices } from '@/hooks/useWFPData';

export const FoodSecurity = () => {
  const { data: foodPrices, isLoading } = useWFPFoodPrices();
  
  const latestPrices = useMemo(() => {
    if (!foodPrices) return [];
    
    // Get latest price for each commodity
    const grouped = foodPrices.reduce((acc, item) => {
      if (!acc[item.commodity] || item.date > acc[item.commodity].date) {
        acc[item.commodity] = item;
      }
      return acc;
    }, {} as Record<string, WFPFoodPrice>);
    
    return Object.values(grouped);
  }, [foodPrices]);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Food Security</CardTitle>
          <Badge variant="success">🟢 Real WFP Data</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Use latestPrices for visualization */}
      </CardContent>
    </Card>
  );
};
```

---

## 🔧 HDX API Base Service

### Complete HDX Service Implementation

```typescript
// src/services/hdxService.ts
const HDX_API_BASE = 'https://data.humdata.org/api/3';

export class HDXService {
  /**
   * Search for datasets by query
   */
  static async searchDatasets(query: string, rows = 100) {
    const url = `${HDX_API_BASE}/action/package_search?q=${encodeURIComponent(query)}&rows=${rows}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('HDX API error: ' + data.error?.message);
    }
    
    return data.result.results;
  }
  
  /**
   * Get specific dataset by ID or name
   */
  static async getDataset(datasetId: string) {
    const url = `${HDX_API_BASE}/action/package_show?id=${datasetId}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Dataset not found: ' + datasetId);
    }
    
    return data.result;
  }
  
  /**
   * Download and parse CSV resource
   */
  static async downloadCSV(resourceUrl: string) {
    const response = await fetch(resourceUrl);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      });
    });
  }
  
  /**
   * Download and parse XLSX resource
   */
  static async downloadXLSX(resourceUrl: string, sheetIndex = 0) {
    const response = await fetch(resourceUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const sheetName = workbook.SheetNames[sheetIndex];
    const sheet = workbook.Sheets[sheetName];
    
    return XLSX.utils.sheet_to_json(sheet);
  }
}

// Usage
const palestineData = await HDXService.searchDatasets('palestine food');
const wfpPrices = await HDXService.downloadCSV(WFP_CSV_URL);
```

---

## 📋 Integration Checklist

### Before You Start
- [x] Review current [`apiOrchestrator.ts`](src/services/apiOrchestrator.ts:25-98)
- [x] Understand component data structure
- [x] Check existing hooks pattern in [`useDataFetching.ts`](src/hooks/useDataFetching.ts)
- [ ] Install dependencies: `npm install papaparse xlsx`

### For Each Integration
- [ ] Create service file (e.g., `src/services/wfpService.ts`)
- [ ] Define TypeScript interfaces
- [ ] Create React Query hook
- [ ] Update component to use hook
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add data quality badge
- [ ] Test with real data
- [ ] Update documentation

---

## 🎓 Code Examples by Data Format

### JSON (World Bank)
```typescript
const response = await fetch(url);
const data = await response.json();
// World Bank returns [metadata, data]
return data[1];
```

### CSV (WFP)
```typescript
import Papa from 'papaparse';

const response = await fetch(url);
const text = await response.text();

Papa.parse(text, {
  header: true,
  dynamicTyping: true,
  complete: (results) => {
    console.log(results.data);
  },
});
```

### XLSX (PCBS, Schools, Malnutrition)
```typescript
import * as XLSX from 'xlsx';

const response = await fetch(url);
const arrayBuffer = await response.arrayBuffer();
const workbook = XLSX.read(arrayBuffer, { type: 'array' });

// Single sheet
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Multiple sheets
workbook.SheetNames.forEach((sheetName, index) => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(`Sheet ${index}: ${sheetName}`, data);
});
```

---

## 🔍 Data Source Reliability

### Tier 1 (Highly Reliable - Official UN/Gov Sources)
- ✅ World Bank API
- ✅ WFP via HDX
- ✅ PCBS via HDX
- ✅ OCHA HDX Platform

**Characteristics**: Official, well-maintained, documented

### Tier 2 (Reliable - NGO/Verified Sources)
- ✅ Good Shepherd Collective
- ✅ ACLED via HDX
- ✅ IPC/UNICEF via HDX

**Characteristics**: Vetted, regularly updated, community-trusted

### Tier 3 (Requires Verification)
- ⚠️ Google Sheets (health facilities)
- ⚠️ UNRWA (requires partnership)
- ⚠️ B'Tselem (no public API)

**Characteristics**: May require manual updates or partnerships

---

## 📞 Next Steps for Partnerships

### Good Shepherd Collective
**Purpose**: Verify remaining endpoints, optimize large datasets

**Email Template**:
```
Subject: API Endpoint Verification - Palestine Pulse Dashboard

Hello Good Shepherd Collective Team,

We're building an open-source humanitarian dashboard (Palestine Pulse) and 
successfully integrated your child_prisoners.json endpoint.

Could you help verify these endpoints:
1. prisoner_data.json
2. wb_data.json
3. ngo_data.json

Also, healthcare_attacks.json returns 1M+ records causing timeouts.
Could you provide:
- Paginated version
- Or aggregated summary version
- Or recent data only (last 12 months)

Thank you for your invaluable data service!

Project: https://github.com/[your-repo]
```

### UNRWA
**Purpose**: Displacement and shelter data

**Contact**: https://www.unrwa.org/contact-us

---

## 📊 Expected Data Coverage After Integration

### Before Integration
```
Real Data:    ████████░░░░░░░░░░░░ 35%
Sample Data:  ░░░░░░░░████████████ 65%
```

### After Phase 1-2 (Realistic)
```
Real Data:    ███████████████░░░░░ 75%
Sample Data:  ░░░░░░░░░░░░░░░█████ 25%
```

### After Phase 3-4 (With Partnerships)
```
Real Data:    ██████████████████░░ 90%
Sample Data:  ░░░░░░░░░░░░░░░░░░██ 10%
```

---

## ⚡ Performance Considerations

### Large Datasets
- **WFP Food Prices**: 18,448 records → Aggregate before display
- **ACLED Conflict**: 1,889 records → Filter by date range
- **Schools Database**: ~2,000 schools → Lazy load

### Caching Strategy
```typescript
const CACHE_TTL = {
  wfp_food_prices: 12 * 60 * 60 * 1000,      // 12 hours
  world_bank_gdp: 24 * 60 * 60 * 1000,       // 24 hours
  health_facilities: 24 * 60 * 60 * 1000,    // 24 hours
  malnutrition: 7 * 24 * 60 * 60 * 1000,     // 7 days
  schools: 30 * 24 * 60 * 60 * 1000,         // 30 days
};
```

---

## 🎯 Success Criteria

### Technical
- ✅ All high-priority endpoints integrated
- ✅ No performance degradation
- ✅ Proper error handling and fallbacks
- ✅ Cache working correctly
- ✅ Loading states implemented

### Data Quality
- ✅ Source attribution visible
- ✅ Last update timestamps shown
- ✅ Data quality indicators present
- ✅ Sample data clearly marked

### User Experience
- ✅ No breaking changes
- ✅ Smooth loading experience
- ✅ Clear communication of data status
- ✅ Graceful degradation on errors

---

**Created**: January 17, 2025  
**Status**: Ready for Implementation  
**Next Action**: Begin with WFP Food Prices integration