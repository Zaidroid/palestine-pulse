# API Integration Guide
## Technical Implementation for Free Data Sources

**Created**: January 17, 2025  
**Purpose**: Step-by-step guide for integrating free APIs into Palestine Pulse Dashboard

---

## 🎯 Quick Start: Priority Integrations

### 1. **WFP Food Prices** (Highest Priority - Easiest Integration)

#### Endpoint Details
```
Base URL: https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7
Direct CSV: /resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv
```

#### Sample Response Structure
```csv
date,admin1,admin2,market,market_id,latitude,longitude,category,commodity,commodity_id,unit,priceflag,pricetype,currency,price,usdprice
2025-08-15,Gaza Strip,Gaza,Gaza,PSE001,31.5,34.45,cereals and tubers,Bread,104,Kg,actual,Retail,ILS,12.50,3.45
```

#### Integration Code
```typescript
// src/services/wfpService.ts
import Papa from 'papaparse';

export interface WFPFoodPrice {
  date: string;
  admin1: string;
  admin2: string;
  market: string;
  commodity: string;
  price: number;
  usdprice: number;
}

export const fetchWFPFoodPrices = async (): Promise<WFPFoodPrice[]> => {
  const url = 'https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv';
  
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data as WFPFoodPrice[]),
      error: (error) => reject(error),
    });
  });
};
```

#### Required Package
```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

---

### 2. **World Bank API** (Economic Indicators)

#### Endpoint Pattern
```
Base: https://api.worldbank.org/v2
Pattern: /country/{country}/indicator/{indicator}?format=json&date={year}:{year}
Palestine Code: PSE
```

#### Key Indicators
```typescript
export const WORLDBANK_INDICATORS = {
  GDP: 'NY.GDP.MKTP.CD',              // GDP (current US$)
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',    // GDP growth (annual %)
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',   // GDP per capita
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',     // Unemployment, total (% of labor force)
  POVERTY: 'SI.POV.DDAY',             // Poverty headcount ratio
  INFLATION: 'FP.CPI.TOTL.ZG',        // Inflation, consumer prices (annual %)
  TRADE_DEFICIT: 'BN.GSR.GNFS.CD',    // Trade balance
} as const;
```

#### Sample Request
```bash
curl "https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2024"
```

#### Sample Response
```json
[
  {
    "page": 1,
    "pages": 1,
    "per_page": 50,
    "total": 5
  },
  [
    {
      "indicator": {
        "id": "NY.GDP.MKTP.CD",
        "value": "GDP (current US$)"
      },
      "country": {
        "id": "PS",
        "value": "West Bank and Gaza"
      },
      "countryiso3code": "PSE",
      "date": "2023",
      "value": 18084000000,
      "unit": "",
      "obs_status": "",
      "decimal": 0
    }
  ]
]
```

#### Integration Code
```typescript
// src/services/worldBankService.ts
export interface WorldBankIndicator {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  date: string;
  value: number | null;
}

export const fetchWorldBankIndicator = async (
  indicator: string,
  startYear: number,
  endYear: number
): Promise<WorldBankIndicator[]> => {
  const url = `https://api.worldbank.org/v2/country/PSE/indicator/${indicator}?format=json&date=${startYear}:${endYear}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // World Bank returns [metadata, data]
  return data[1] || [];
};

// Hook for React Query
export const useWorldBankGDP = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'gdp', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.GDP,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
```

---

### 3. **HDX CKAN API** (Multiple Datasets)

#### Base API
```
Base URL: https://data.humdata.org/api/3
API Type: CKAN API (Open source data portal)
```

#### Key Endpoints

##### A. Package Search (Find Datasets)
```bash
curl "https://data.humdata.org/api/3/action/package_search?q=palestine&rows=100"
```

##### B. Package Show (Get Dataset Details)
```bash
curl "https://data.humdata.org/api/3/action/package_show?id=state-of-palestine-consumer-price-index"
```

##### C. Resource Show (Get Resource Details)
```bash
curl "https://data.humdata.org/api/3/action/resource_show?id=4ea77774-3f0c-4b94-bda8-c2efb82d0394"
```

#### Integration Code
```typescript
// src/services/hdxService.ts
const HDX_BASE = 'https://data.humdata.org/api/3';

export interface HDXResource {
  id: string;
  name: string;
  description: string;
  format: string;
  url: string;
  download_url: string;
  last_modified: string;
  size: number;
}

export interface HDXDataset {
  id: string;
  name: string;
  title: string;
  notes: string;
  resources: HDXResource[];
  organization: {
    name: string;
    title: string;
  };
  last_modified: string;
}

export const searchHDXDatasets = async (query: string): Promise<HDXDataset[]> => {
  const response = await fetch(
    `${HDX_BASE}/action/package_search?q=${encodeURIComponent(query)}&rows=100`
  );
  const data = await response.json();
  return data.result.results;
};

export const getHDXDataset = async (datasetId: string): Promise<HDXDataset> => {
  const response = await fetch(
    `${HDX_BASE}/action/package_show?id=${datasetId}`
  );
  const data = await response.json();
  return data.result;
};

export const downloadHDXResource = async (resourceUrl: string): Promise<any> => {
  const response = await fetch(resourceUrl);
  
  // Determine format and parse accordingly
  if (resourceUrl.endsWith('.csv')) {
    const text = await response.text();
    return Papa.parse(text, { header: true, dynamicTyping: true }).data;
  } else if (resourceUrl.endsWith('.json')) {
    return await response.json();
  } else if (resourceUrl.endsWith('.xlsx')) {
    // Will need SheetJS for XLSX parsing
    const buffer = await response.arrayBuffer();
    // Parse with SheetJS (see XLSX integration below)
    return buffer;
  }
  
  return await response.text();
};
```

---

### 4. **PCBS Consumer Price Index** (Economic Data)

#### Dataset Information
```
Dataset ID: 0e06dbe6-8eeb-4b26-ba12-652520b44177
Resource ID: 4ea77774-3f0c-4b94-bda8-c2efb82d0394
Download URL: https://data.humdata.org/dataset/0e06dbe6-8eeb-4b26-ba12-652520b44177/resource/4ea77774-3f0c-4b94-bda8-c2efb82d0394/download/consumer-price-index.xlsx
Format: XLSX
Update: Monthly
```

#### Data Structure
- Sheet 1: "cpi - data by major division"
  - 134 rows of CPI data by category
  - Columns: Categories, monthly values (Jan 2023 - Sept 2025)
- Sheet 2: "cpi - by Major Groups"
  - 21 rows of grouped data

#### Integration Approach
```typescript
// Use SheetJS to parse XLSX
import * as XLSX from 'xlsx';

export const fetchPCBSCPI = async () => {
  const url = 'https://data.humdata.org/dataset/0e06dbe6-8eeb-4b26-ba12-652520b44177/resource/4ea77774-3f0c-4b94-bda8-c2efb82d0394/download/consumer-price-index.xlsx';
  
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Get first sheet (CPI by division)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet);
  
  return data;
};
```

#### Required Package
```bash
npm install xlsx
```

---

### 5. **Health Facilities Database**

#### Endpoint Options

##### Option A: Google Sheets (Gaza - Current Status)
```
URL: https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv
Format: CSV (easier to parse)
Data: Gaza hospitals and health centers as of Nov 9, 2023
```

##### Option B: Combined Gaza + West Bank (Shapefile)
```
Dataset ID: 15d8f2ca-3528-4fb1-9cf5-a91ed3aba170
Format: SHP (requires GeoJSON conversion)
Data: All health facilities in both regions
```

#### Integration Code
```typescript
// src/services/healthService.ts
export interface HealthFacility {
  name: string;
  type: string; // hospital, clinic, health center
  governorate: string;
  region: 'Gaza' | 'West Bank';
  status?: 'operational' | 'damaged' | 'destroyed';
  services?: string[];
}

export const fetchGazaHealthFacilities = async (): Promise<HealthFacility[]> => {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv';
  
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

---

### 6. **Malnutrition Data** (Food Security Enhancement)

#### Endpoint
```
Dataset ID: a1365b03-91e1-4fe1-a8b3-87973cdd0eba
Resource: Malnutrition in Gaza Strip (May 2025)
Download URL: https://data.humdata.org/dataset/a1365b03-91e1-4fe1-a8b3-87973cdd0eba/resource/f135fa53-1d54-4de5-ad21-15cbefcef97f/download/malnutrition-in-gaza-strip_may2025.xlsx
Format: XLSX
```

#### Data Structure
```typescript
export interface MalnutritionData {
  country: string;
  level1: string;
  area: string;
  SAM: number;  // Severe Acute Malnutrition (%)
  MAM: number;  // Moderate Acute Malnutrition (%)
  GAM: number;  // Global Acute Malnutrition (%)
}

// Sample data from sheet:
// Country | Level 1 | Area | SAM | MAM | GAM
// State of Palestine | Gaza Strip | North Gaza | 2.9 | 4.5 | 7.4
```

#### Integration Code
```typescript
export const fetchMalnutritionData = async (): Promise<MalnutritionData[]> => {
  const url = 'https://data.humdata.org/dataset/a1365b03-91e1-4fe1-a8b3-87973cdd0eba/resource/f135fa53-1d54-4de5-ad21-15cbefcef97f/download/malnutrition-in-gaza-strip_may2025.xlsx';
  
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet) as MalnutritionData[];
};
```

---

### 7. **Schools Database** (Education Impact)

#### Endpoint
```
Dataset ID: f54aea1b-ad53-4cce-9051-788e164189d5
Resource ID: fb673d75-7100-4c53-b88b-7fe651c491bb
Download URL: https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx
Format: XLSX
```

#### Data Fields
- School name (English and Arabic)
- National school code
- District
- School type (public, private, UNRWA)

#### Integration Code
```typescript
export interface School {
  nameEn: string;
  nameAr: string;
  code: string;
  district: string;
  type: 'public' | 'private' | 'unrwa';
  region: 'Gaza' | 'West Bank';
}

export const fetchSchools = async (): Promise<School[]> => {
  const url = 'https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx';
  
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet) as School[];
};
```

---

## 🔧 Good Shepherd Collective - Endpoint Testing

### Test Commands

```bash
# Test prisoner data endpoint
curl -I https://goodshepherdcollective.org/api/prisoner_data.json

# Test West Bank data endpoint
curl -I https://goodshepherdcollective.org/api/wb_data.json

# Test NGO data endpoint
curl -I https://goodshepherdcollective.org/api/ngo_data.json
```

### Expected Results
- **200 OK**: Endpoint exists and is accessible
- **404 Not Found**: Endpoint doesn't exist (like home_demolitions.json)
- **500 Error**: Server issue (retry later)
- **Timeout**: Data too large (like healthcare_attacks.json)

### If Endpoints Work
```typescript
// Add to src/hooks/useGoodShepherdData.ts
export const usePrisonerData = () => {
  return useQuery({
    queryKey: ['goodshepherd', 'prisonerData'],
    queryFn: async () => {
      const response = await apiOrchestrator.fetch(
        'goodshepherd',
        'prisoner_data.json'
      );
      return response.data;
    },
    enabled: true, // Change from false
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });
};
```

---

## 🏗️ Integration Architecture

### Updated apiOrchestrator.ts

```typescript
// Add new sources
const DATA_SOURCES: Record<DataSource, DataSourceConfig> = {
  // ... existing sources
  
  hdx: {
    name: 'hdx',
    baseUrl: 'https://data.humdata.org/api/3',
    enabled: true,
    priority: 2,
    cache_ttl: 60 * 60 * 1000, // 1 hour
    retry_attempts: 2,
  },
  
  world_bank: {
    name: 'world_bank',
    baseUrl: 'https://api.worldbank.org/v2',
    enabled: true,
    priority: 3,
    cache_ttl: 24 * 60 * 60 * 1000, // 24 hours
    retry_attempts: 2,
  },
  
  wfp: {
    name: 'wfp',
    baseUrl: 'https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7',
    enabled: true,
    priority: 2,
    cache_ttl: 12 * 60 * 60 * 1000, // 12 hours
    retry_attempts: 2,
  },
};
```

### Data Source Types Update

```typescript
// src/types/data.types.ts
export type DataSource =
  | 'tech4palestine'
  | 'goodshepherd'
  | 'hdx'           // NEW
  | 'wfp'           // NEW
  | 'world_bank'    // NEW (renamed from world_bank placeholder)
  | 'un_ocha'
  | 'who'
  | 'unrwa'
  | 'pcbs'
  | 'btselem'
  | 'custom';
```

---

## 📦 Required Dependencies

### CSV Parsing
```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

### Excel/XLSX Parsing
```bash
npm install xlsx
```

### Optional: XML Parsing (if needed)
```bash
npm install fast-xml-parser
```

---

## 🎯 Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Install required packages (papaparse, xlsx)
- [ ] Create [`src/services/hdxService.ts`](src/services/hdxService.ts)
- [ ] Create [`src/services/worldBankService.ts`](src/services/worldBankService.ts)
- [ ] Create [`src/services/wfpService.ts`](src/services/wfpService.ts)
- [ ] Update [`src/services/apiOrchestrator.ts`](src/services/apiOrchestrator.ts:25-98) with new sources
- [ ] Add new types to [`src/types/data.types.ts`](src/types/data.types.ts:438-447)

### Phase 2: Food Security (Week 1)

- [ ] Create hook [`src/hooks/useWFPData.ts`](src/hooks/useWFPData.ts)
- [ ] Integrate WFP food prices into [`FoodSecurity.tsx`](src/components/dashboards/FoodSecurity.tsx)
- [ ] Integrate malnutrition data
- [ ] Add data quality indicators
- [ ] Test and verify

### Phase 3: Economic Impact (Week 2)

- [ ] Create hook [`src/hooks/useWorldBankData.ts`](src/hooks/useWorldBankData.ts)
- [ ] Integrate World Bank GDP data
- [ ] Integrate PCBS CPI data
- [ ] Update [`EconomicImpact.tsx`](src/components/dashboards/EconomicImpact.tsx:1-100)
- [ ] Add loading states and error handling

### Phase 4: Healthcare (Week 2)

- [ ] Create hook [`src/hooks/useHealthFacilities.ts`](src/hooks/useHealthFacilities.ts)
- [ ] Integrate Gaza health facilities
- [ ] Update [`HealthcareStatus.tsx`](src/components/dashboards/HealthcareStatus.tsx)
- [ ] Replace healthcare_attacks with facilities data

### Phase 5: Education (Week 3)

- [ ] Create hook [`src/hooks/useEducationData.ts`](src/hooks/useEducationData.ts)
- [ ] Integrate schools database
- [ ] Cross-reference with conflict data for damage tracking
- [ ] Update [`EducationImpact.tsx`](src/components/dashboards/EducationImpact.tsx)

### Phase 6: Good Shepherd Verification (Week 3)

- [ ] Test `prisoner_data.json` endpoint
- [ ] Test `wb_data.json` endpoint
- [ ] Test `ngo_data.json` endpoint
- [ ] Enable working endpoints in [`useGoodShepherdData.ts`](src/hooks/useGoodShepherdData.ts)
- [ ] Update [`PrisonersStats.tsx`](src/components/dashboards/PrisonersStats.tsx)

---

## 🧪 Testing Examples

### Test World Bank API

```bash
# Get GDP for Palestine (2020-2024)
curl "https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2024"

# Get unemployment rate
curl "https://api.worldbank.org/v2/country/PSE/indicator/SL.UEM.TOTL.ZS?format=json&date=2020:2024"
```

### Test HDX API

```bash
# Search for Palestine datasets
curl "https://data.humdata.org/api/3/action/package_search?q=palestine&rows=10"

# Get specific dataset
curl "https://data.humdata.org/api/3/action/package_show?id=wfp-food-prices-for-state-of-palestine"
```

### Test WFP Food Prices

```bash
# Download CSV directly
curl -L "https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv" -o wfp_food_prices.csv

# Preview first 10 lines
head -10 wfp_food_prices.csv
```

---

## ⚡ Data Transformation Utilities

### CSV to JSON
```typescript
// src/utils/dataTransformation.ts
import Papa from 'papaparse';

export const csvToJson = async (url: string): Promise<any[]> => {
  const response = await fetch(url);
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
};
```

### XLSX to JSON
```typescript
import * as XLSX from 'xlsx';

export const xlsxToJson = async (url: string, sheetIndex = 0): Promise<any[]> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheetName = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName];
  
  return XLSX.utils.sheet_to_json(sheet);
};
```

### Date Normalization
```typescript
export const normalizeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};
```

---

## 🔄 Data Refresh Strategy

### Caching Configuration

```typescript
const CACHE_STRATEGIES = {
  // Real-time data (if available)
  realtime: 5 * 60 * 1000,        // 5 minutes
  
  // Frequently updated (daily/weekly)
  frequent: 60 * 60 * 1000,       // 1 hour
  
  // Moderate updates (monthly)
  moderate: 12 * 60 * 60 * 1000,  // 12 hours
  
  // Slow updates (quarterly/annual)
  slow: 24 * 60 * 60 * 1000,      // 24 hours
};

// Apply to sources
const SOURCE_CACHE_CONFIG = {
  tech4palestine: CACHE_STRATEGIES.frequent,
  goodshepherd: CACHE_STRATEGIES.moderate,
  wfp: CACHE_STRATEGIES.moderate,
  world_bank: CACHE_STRATEGIES.slow,
  hdx: CACHE_STRATEGIES.moderate,
};
```

---

## 🚨 Error Handling Patterns

### Retry Logic
```typescript
const fetchWithRetry = async (
  url: string,
  maxRetries = 3,
  backoff = 1000
): Promise<Response> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      // Don't retry 4xx errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
};
```

### Fallback Data
```typescript
const useFoodPricesWithFallback = () => {
  const { data, error, isLoading } = useWFPFoodPrices();
  
  // Fallback to sample data if API fails
  if (error) {
    console.warn('WFP API failed, using sample data:', error);
    return { data: SAMPLE_FOOD_PRICES, isLoading: false, error };
  }
  
  return { data, isLoading, error };
};
```

---

## 📊 Component Integration Examples

### Food Security Component

```typescript
// src/components/dashboards/FoodSecurity.tsx
import { useWFPFoodPrices, useMalnutritionData } from '@/hooks/useWFPData';

export const FoodSecurity = () => {
  const { data: foodPrices, isLoading: pricesLoading } = useWFPFoodPrices();
  const { data: malnutrition, isLoading: malnutLoading } = useMalnutritionData();
  
  // Transform WFP data for charts
  const processedPrices = useMemo(() => {
    if (!foodPrices) return [];
    
    // Group by commodity and calculate trends
    const commodityTrends = foodPrices.reduce((acc, item) => {
      if (!acc[item.commodity]) {
        acc[item.commodity] = [];
      }
      acc[item.commodity].push({
        date: item.date,
        price: item.usdprice,
      });
      return acc;
    }, {} as Record<string, Array<{date: string, price: number}>>);
    
    return commodityTrends;
  }, [foodPrices]);
  
  return (
    <div className="space-y-6">
      <Badge variant="success">
        🟢 Real data from WFP
      </Badge>
      
      {/* Rest of component */}
    </div>
  );
};
```

### Economic Impact Component

```typescript
// src/components/dashboards/EconomicImpact.tsx
import { useWorldBankGDP, usePCBSCPI } from '@/hooks/useEconomicData';

export const EconomicImpact = () => {
  const { data: gdpData } = useWorldBankGDP(2020, 2024);
  const { data: cpiData } = usePCBSCPI();
  
  const latestGDP = gdpData?.[0]?.value || 0;
  const gdpTrend = useMemo(() => {
    if (!gdpData) return [];
    return gdpData.map(item => ({
      year: item.date,
      gdp: item.value / 1e9, // Convert to billions
    })).reverse();
  }, [gdpData]);
  
  return (
    <div className="space-y-6">
      <Badge variant="success">
        🟢 Real data from World Bank & PCBS
      </Badge>
      {/* Charts using real data */}
    </div>
  );
};
```

---

## 🔐 CORS Handling

### Potential Issues
Some endpoints may have CORS restrictions when called from browser.

### Solutions

#### 1. Use Proxy (if needed)
```typescript
// Optional: Use CORS proxy for problematic endpoints
const CORS_PROXY = 'https://corsproxy.io/?';

const fetchWithCORS = async (url: string) => {
  try {
    // Try direct fetch first
    return await fetch(url);
  } catch (error) {
    // If CORS error, try with proxy
    console.warn('CORS error, using proxy:', error);
    return await fetch(CORS_PROXY + encodeURIComponent(url));
  }
};
```

#### 2. Server-side Proxy (Netlify Functions)
```typescript
// netlify/functions/api-proxy.ts
export const handler = async (event) => {
  const { url } = JSON.parse(event.body);
  
  try {
    const response = await fetch(url);
    const data = await response.text();
    
    return {
      statusCode: 200,
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

---

## 📈 Performance Optimization

### Lazy Loading Large Datasets
```typescript
// For large files like WFP (18K+ records)
export const useWFPFoodPricesLazy = () => {
  const [data, setData] = useState<WFPFoodPrice[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      setLoading(true);
      const stream = await fetch(WFP_CSV_URL);
      const reader = stream.body?.getReader();
      
      // Process in chunks
      // ... streaming logic
      
      if (!cancelled) {
        setData(processedData);
        setLoading(false);
      }
    };
    
    fetchData();
    return () => { cancelled = true; };
  }, []);
  
  return { data, loading };
};
```

### Data Aggregation
```typescript
// Aggregate large datasets before storing
export const aggregateWFPData = (data: WFPFoodPrice[]) => {
  // Group by month and commodity
  return data.reduce((acc, item) => {
    const month = item.date.substring(0, 7); // YYYY-MM
    const key = `${month}-${item.commodity}`;
    
    if (!acc[key]) {
      acc[key] = {
        month,
        commodity: item.commodity,
        avgPrice: 0,
        count: 0,
      };
    }
    
    acc[key].avgPrice = 
      (acc[key].avgPrice * acc[key].count + item.usdprice) / 
      (acc[key].count + 1);
    acc[key].count++;
    
    return acc;
  }, {} as Record<string, any>);
};
```

---

## 🎨 UI Enhancements

### Data Quality Badges
```typescript
// src/components/ui/data-quality-badge.tsx
export const DataQualityBadge = ({ 
  source, 
  lastUpdated, 
  isRealData 
}: {
  source: string;
  lastUpdated?: Date;
  isRealData: boolean;
}) => {
  if (!isRealData) {
    return (
      <Badge variant="secondary">
        ℹ️ Sample data (real data pending)
      </Badge>
    );
  }
  
  const hoursAgo = lastUpdated 
    ? Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60))
    : null;
  
  return (
    <div className="flex gap-2">
      <Badge variant="success">
        🟢 Real data from {source}
      </Badge>
      {hoursAgo !== null && (
        <Badge variant="outline">
          Updated {hoursAgo}h ago
        </Badge>
      )}
    </div>
  );
};
```

---

## 🐛 Debugging Tools

### Test API Endpoints
```typescript
// src/utils/apiTester.ts
export const testEndpoint = async (url: string) => {
  console.log('Testing:', url);
  
  try {
    const start = performance.now();
    const response = await fetch(url);
    const duration = performance.now() - start;
    
    const contentType = response.headers.get('content-type');
    const size = response.headers.get('content-length');
    
    console.log({
      status: response.status,
      contentType,
      size,
      duration: `${duration.toFixed(2)}ms`,
    });
    
    return {
      success: response.ok,
      status: response.status,
      contentType,
      size,
      duration,
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
```

### Console Helper
```typescript
// Add to window for development
if (process.env.NODE_ENV === 'development') {
  window.testAPI = {
    worldBank: () => testEndpoint('https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2024'),
    wfp: () => testEndpoint('https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv'),
    goodShepherd: {
      child: () => testEndpoint('https://goodshepherdcollective.org/api/child_prisoners.json'),
      prisoner: () => testEndpoint('https://goodshepherdcollective.org/api/prisoner_data.json'),
      wb: () => testEndpoint('https://goodshepherdcollective.org/api/wb_data.json'),
      ngo: () => testEndpoint('https://goodshepherdcollective.org/api/ngo_data.json'),
    },
  };
}
```

---

## 📚 Additional Resources

### HDX Datasets for Palestine (247 found)
Search here: https://data.humdata.org/group/pse

**Key Datasets**:
- ACLED Conflict Data: Weekly updates
- Health Facilities: Hospital/clinic status
- Schools Database: Education infrastructure
- Population Statistics: Demographic data
- Consumer Price Index: Economic indicators
- Food Prices: WFP market prices
- Malnutrition: IPC/UNICEF data

### World Bank Indicators
Browse: https://data.worldbank.org/country/west-bank-and-gaza

**Available for Palestine (PSE)**:
- Economic indicators (GDP, trade, etc.)
- Social indicators (poverty, education, etc.)
- Development indicators

### Documentation Links
- **HDX API Guide**: https://data.humdata.org/faq
- **CKAN API Docs**: https://docs.ckan.org/en/2.9/api/
- **World Bank API**: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information

---

## ⚠️ Important Notes

1. **No Authentication Required**: All listed sources are publicly accessible
2. **Rate Limiting**: Be respectful, implement caching
3. **CORS**: Most endpoints should work from browser, use proxy if needed
4. **Data Formats**: Mix of CSV, JSON, XLSX - handle appropriately
5. **Update Frequencies**: Vary from daily to annual - check dataset metadata
6. **Data Quality**: Always include source attribution and last update time

---

## 🎯 Success Metrics

### Target Outcomes
- ✅ Reduce sample data from 65% to <25%
- ✅ Implement automatic data updates
- ✅ Add data quality indicators to all components
- ✅ Maintain dashboard performance (no slowdowns)
- ✅ Provide clear data source attribution

### Monitoring
```typescript
// Track data source usage
export const DataSourceMonitor = {
  sources: {
    tech4palestine: { calls: 0, errors: 0, lastUpdate: null },
    goodshepherd: { calls: 0, errors: 0, lastUpdate: null },
    hdx: { calls: 0, errors: 0, lastUpdate: null },
    world_bank: { calls: 0, errors: 0, lastUpdate: null },
    wfp: { calls: 0, errors: 0, lastUpdate: null },
  },
  
  recordCall(source: DataSource, success: boolean) {
    this.sources[source].calls++;
    if (!success) this.sources[source].errors++;
    if (success) this.sources[source].lastUpdate = new Date();
  },
  
  getStats() {
    return this.sources;
  },
};
```

---

**Last Updated**: January 17, 2025  
**Status**: Ready for Implementation  
**Next Review**: After Phase 1 completion