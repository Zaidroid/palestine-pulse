# Free Data Sources Integration Plan
## Palestine Pulse Dashboard - Real Data Endpoints

**Generated**: January 17, 2025  
**Purpose**: Replace sample data with real, automatically fetchable data from free sources

---

## 🎯 Executive Summary

This plan identifies **free, API-accessible data sources** to replace the ~65% sample data currently in the dashboard. All sources are:
- ✅ **Free to access** (no paid subscriptions)
- ✅ **Programmatically accessible** (APIs or structured data)
- ✅ **Automatically updatable** (no manual downloads)
- ✅ **Authoritative sources** (UN agencies, governments, NGOs)

---

## 📊 Data Sources by Component

### 1. **Economic Impact Component** 
**File**: [`src/components/dashboards/EconomicImpact.tsx`](src/components/dashboards/EconomicImpact.tsx:1-100)

#### Current Status
- Using sample GDP, unemployment, business destruction data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **Palestinian Central Bureau of Statistics (PCBS) - Consumer Price Index**
- **Source**: UN OCHA HDX
- **API Endpoint**: `https://data.humdata.org/api/3/action/package_show?id=state-of-palestine-consumer-price-index`
- **Direct CSV**: `https://data.humdata.org/dataset/0e06dbe6-8eeb-4b26-ba12-652520b44177/resource/4ea77774-3f0c-4b94-bda8-c2efb82d0394/download/consumer-price-index.xlsx`
- **Update Frequency**: Monthly
- **Data Range**: Jan 2023 - Sept 2025
- **Data Points**:
  - Consumer Price Index by category
  - Inflation indicators
  - Price changes over time
- **Authentication**: None required
- **Format**: XLSX (convertible to JSON)

##### B. **World Bank Open Data API**
- **Endpoint**: `https://api.worldbank.org/v2/country/PSE/indicator/{indicator}?format=json`
- **Key Indicators for Palestine (PSE)**:
  - `NY.GDP.MKTP.CD` - GDP (current US$)
  - `SL.UEM.TOTL.ZS` - Unemployment rate
  - `NY.GDP.PCAP.CD` - GDP per capita
  - `FP.CPI.TOTL` - Consumer Price Index
- **Authentication**: None
- **Rate Limit**: None for basic access
- **Format**: JSON

**Integration Priority**: 🔥 **HIGH** - Direct API access available

---

### 2. **Aid Tracker Component**
**File**: [`src/components/dashboards/AidTracker.tsx`](src/components/dashboards/AidTracker.tsx:1-100)

#### Current Status
- Using sample aid delivery, donor, and allocation data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **UN OCHA Humanitarian Data Exchange (HDX)**
- **Base API**: `https://data.humdata.org/api/3`
- **Search Endpoint**: `/action/package_search?q=palestine+humanitarian`
- **Available Datasets**:
  - Humanitarian response plans
  - Aid delivery tracking
  - Funding status
- **Authentication**: None for public data
- **Rate Limit**: Reasonable (no strict limit documented)
- **Format**: JSON API with CSV/XLSX downloads

##### B. **ACLED Conflict Data (for access restrictions)**
- **Dataset ID**: `a01fb41d-b89c-4de0-abbd-b5046695d448`
- **Endpoint**: `https://data.humdata.org/dataset/a01fb41d-b89c-4de0-abbd-b5046695d448`
- **Data Available**:
  - Political violence events
  - Civilian targeting events
  - Demonstration events (can indicate access restrictions)
- **Update Frequency**: Weekly
- **Format**: XLSX

**Integration Priority**: 🔥 **HIGH** - Multiple datasets available on HDX

---

### 3. **Displacement Stats Component**
**File**: [`src/components/dashboards/DisplacementStats.tsx`](src/components/dashboards/DisplacementStats.tsx:1-100)

#### Current Status
- Using sample IDP numbers and shelter data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **COD-PS Population Statistics**
- **Dataset ID**: `36271e9b-9ec2-4c1c-bfff-82848eba0b2f`
- **CSV Endpoint**: `https://data.humdata.org/dataset/36271e9b-9ec2-4c1c-bfff-82848eba0b2f/resource/632a784f-482a-4425-af24-01f068d250f6/download/pse_admpop_adm0_2023.csv`
- **Data Available**:
  - Administrative level 0-1 population by age/sex
  - Baseline population for displacement calculations
  - 2023 reference year
- **Format**: CSV with HXL tags
- **Update**: Annual

##### B. **UNRWA Data** (Manual research needed)
- **Potential Source**: UNRWA website/reports
- **Data Needed**: IDP numbers, shelter capacity
- **Note**: May require manual data extraction or partnership

**Integration Priority**: 🟡 **MEDIUM** - Baseline data available, IDP tracking needs research

---

### 4. **Education Impact Component**
**File**: [`src/components/dashboards/EducationImpact.tsx`](src/components/dashboards/EducationImpact.tsx)

#### Current Status
- Using sample school damage and student impact data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **Palestine Schools Database**
- **Dataset ID**: `f54aea1b-ad53-4cce-9051-788e164189d5`
- **Endpoint**: `https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx`
- **Data Available**:
  - School names (English/Arabic)
  - National school codes
  - District information
  - School types
  - Coverage: West Bank and Gaza Strip
- **Source**: PA Ministry of Education
- **Update**: Annual (last: March 2022)
- **Format**: XLSX

##### B. **Education Damage Data**
- **Note**: Requires combining with conflict data from ACLED
- **Approach**: Cross-reference school locations with conflict events

**Integration Priority**: 🟡 **MEDIUM** - School database available, damage tracking needs work

---

### 5. **Food Security Component**
**File**: [`src/components/dashboards/FoodSecurity.tsx`](src/components/dashboards/FoodSecurity.tsx)

#### Current Status
- Using sample food insecurity and malnutrition data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **WFP Food Prices**
- **Dataset ID**: `7d06b059-5831-4101-aa68-6d9123ad65b7`
- **CSV Endpoint**: `https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv`
- **Data Available**:
  - Food prices by market
  - Commodity tracking (maize, rice, beans, fish, sugar, etc.)
  - Geographic distribution (admin1/admin2)
  - Time series: 2007 - Aug 2025
  - 18,448 data points
- **Update Frequency**: Weekly/Monthly
- **Format**: CSV with HXL tags
- **Markets Included**: 20 markets across Palestine

##### B. **Malnutrition Prevalence**
- **Dataset ID**: `a1365b03-91e1-4fe1-a8b3-87973cdd0eba`
- **Endpoint**: `https://data.humdata.org/dataset/a1365b03-91e1-4fe1-a8b3-87973cdd0eba/resource/f135fa53-1d54-4de5-ad21-15cbefcef97f/download/malnutrition-in-gaza-strip_may2025.xlsx`
- **Data Available**:
  - SAM (Severe Acute Malnutrition)
  - MAM (Moderate Acute Malnutrition)
  - GAM (Global Acute Malnutrition)
  - IPC projections (May-Sept 2025)
- **Source**: UNICEF, IPC
- **Format**: XLSX

**Integration Priority**: 🔥 **HIGH** - Comprehensive WFP data readily available

---

### 6. **Healthcare Status Component**
**File**: [`src/components/dashboards/HealthcareStatus.tsx`](src/components/dashboards/HealthcareStatus.tsx)

#### Current Status
- Good Shepherd `healthcare_attacks.json` disabled (too large)
- **Real Data Coverage**: 10%

#### 🆕 Available Data Sources

##### A. **Health Facilities Database**
- **Dataset ID**: `15d8f2ca-3528-4fb1-9cf5-a91ed3aba170`
- **Gaza Hospitals**: `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=xlsx`
- **West Bank/Gaza Combined**: `https://data.humdata.org/dataset/15d8f2ca-3528-4fb1-9cf5-a91ed3aba170/resource/fc5fd843-a8ee-4a3f-9474-861337893c84/download/opt-healthfacilities.zip`
- **Data Available**:
  - Facility names and locations
  - Facility types (hospital, clinic, health center)
  - Service types
  - Operational status (Nov 2023 for Gaza)
  - Supervisory organization
- **Source**: Ministry of Health, Health Cluster
- **Format**: XLSX, SHP (shapefile)

**Integration Priority**: 🔥 **HIGH** - Good alternative to healthcare_attacks endpoint

---

### 7. **Utilities Status Component**
**File**: [`src/components/dashboards/UtilitiesStatus.tsx`](src/components/dashboards/UtilitiesStatus.tsx)

#### Current Status
- Using sample water, electricity, fuel data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **Infrastructure Data**
- **Roads Database**: `https://data.humdata.org/dataset/916c7ce0-1c2b-47fb-b134-b7c93ddf89a4`
- **Note**: Direct utility data not found on HDX
- **Alternative**: May need to track via:
  - Infrastructure damage data (already available from Tech4Palestine)
  - Conflict event correlation
  - News/report parsing

**Integration Priority**: 🟢 **LOW** - Limited structured data available

---

### 8. **Settlement Expansion Component**
**File**: [`src/components/dashboards/SettlementExpansion.tsx`](src/components/dashboards/SettlementExpansion.tsx)

#### Current Status
- Using sample settlement growth and land confiscation data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **B'Tselem Data**
- **Website**: https://www.btselem.org
- **Availability**: Reports and databases published
- **Note**: No public API found, may require:
  - Web scraping (with permission)
  - Manual data extraction from reports
  - Email data provider for partnership

##### B. **UN OCHA oPt Data**
- **Potential**: Settlement-related geospatial data
- **Requires**: Further investigation of HDX datasets

**Integration Priority**: 🟢 **LOW** - Requires partnership or manual extraction

---

### 9. **International Response Component**
**File**: [`src/components/dashboards/InternationalResponse.tsx`](src/components/dashboards/InternationalResponse.tsx)

#### Current Status
- Using sample UN votes, country positions, sanctions data
- **Real Data Coverage**: 0%

#### 🆕 Available Data Sources

##### A. **UN Digital Library**
- **Website**: https://digitallibrary.un.org
- **API**: May have voting records API
- **Requires**: Further research

##### B. **UN General Assembly Voting**
- **Potential API**: UN Data API
- **Alternative**: Manual tracking from UN press releases

**Integration Priority**: 🟢 **LOW** - Complex data source, manual tracking may be needed

---

### 10. **Prisoners Stats Component**
**File**: [`src/components/dashboards/PrisonersStats.tsx`](src/components/dashboards/PrisonersStats.tsx)

#### Current Status
- Child prisoners: ✅ Real data from Good Shepherd
- Overall prisoners: ❌ Sample data
- **Real Data Coverage**: 20%

#### 🆕 Available Data Sources

##### A. **Good Shepherd Collective - Verify Remaining Endpoints**
Test these endpoints:
```bash
curl https://goodshepherdcollective.org/api/prisoner_data.json
curl https://goodshepherdcollective.org/api/wb_data.json
curl https://goodshepherdcollective.org/api/ngo_data.json
```

##### B. **Alternative Sources**
- **Addameer**: Prisoner rights organization
- **B'Tselem**: Detention tracking
- **Note**: May require partnerships

**Integration Priority**: 🟡 **MEDIUM** - Test Good Shepherd endpoints first

---

## 🔧 Technical Implementation Guide

### HDX API Integration Pattern

```typescript
// Add to apiOrchestrator.ts
const DATA_SOURCES = {
  // ... existing sources
  hdx: {
    name: 'hdx',
    baseUrl: 'https://data.humdata.org/api/3',
    enabled: true,
    priority: 2,
    cache_ttl: 60 * 60 * 1000, // 1 hour
    retry_attempts: 2,
  }
}

// HDX endpoints
export const HDX_ENDPOINTS = {
  packageSearch: '/action/package_search',
  packageShow: '/action/package_show',
  resourceShow: '/action/resource_show',
} as const;

// Example fetch function
export const fetchHDXDataset = (datasetId: string) =>
  apiOrchestrator.fetch('hdx', `/action/package_show?id=${datasetId}`);
```

### World Bank API Integration

```typescript
const DATA_SOURCES = {
  // ... existing sources
  world_bank: {
    name: 'world_bank',
    baseUrl: 'https://api.worldbank.org/v2',
    enabled: true,
    priority: 3,
    cache_ttl: 24 * 60 * 60 * 1000, // 24 hours
    retry_attempts: 2,
  }
}

export const WORLDBANK_ENDPOINTS = {
  indicator: (countryCode: string, indicator: string) =>
    `/country/${countryCode}/indicator/${indicator}?format=json`,
  countries: '/country?format=json',
} as const;

// Palestine country code: PSE
// Example indicators:
// - NY.GDP.MKTP.CD (GDP)
// - SL.UEM.TOTL.ZS (Unemployment)
```

---

## 📋 Integration Priority Matrix

| Priority | Component | Data Source | Complexity | Impact |
|----------|-----------|-------------|------------|--------|
| 🔥 **1** | Food Security | WFP via HDX | Low | High |
| 🔥 **2** | Economic Impact | PCBS CPI via HDX | Low | High |
| 🔥 **3** | Economic Impact | World Bank API | Low | High |
| 🔥 **4** | Healthcare Status | Health Facilities via HDX | Medium | High |
| 🔥 **5** | Aid Tracker | HDX Humanitarian Data | Medium | High |
| 🟡 **6** | Displacement | COD-PS + Research UNRWA | Medium | Medium |
| 🟡 **7** | Education | Schools DB + Conflict Data | Medium | Medium |
| 🟡 **8** | Prisoners | Test Good Shepherd endpoints | Low | Medium |
| 🟢 **9** | Settlements | B'Tselem (requires partnership) | High | Low |
| 🟢 **10** | Utilities | Limited data available | High | Low |
| 🟢 **11** | International | UN records (complex) | High | Low |

---

## 🎯 Recommended Implementation Phases

### **Phase 1: Quick Wins** (Week 1-2)
Focus on readily available APIs with high impact:

1. ✅ Integrate WFP Food Prices (Food Security)
2. ✅ Integrate PCBS Consumer Price Index (Economic Impact)
3. ✅ Integrate World Bank API (Economic Impact)
4. ✅ Test Good Shepherd remaining endpoints (Prisoners)

**Expected Result**: Increase real data from 35% to ~55%

### **Phase 2: HDX Integration** (Week 3-4)
Integrate multiple HDX datasets:

1. ✅ Health Facilities data (Healthcare Status)
2. ✅ Malnutrition data (Food Security enhancement)
3. ✅ ACLED conflict data (Aid Tracker - access restrictions)
4. ✅ Schools database (Education Impact)

**Expected Result**: Increase real data from 55% to ~75%

### **Phase 3: Advanced Sources** (Week 5-6)
Research and integrate complex sources:

1. 🔍 UNRWA displacement data (requires research/partnership)
2. 🔍 B'Tselem settlement data (requires partnership)
3. 🔍 Utilities tracking (may need custom solution)

**Expected Result**: Increase real data from 75% to ~85%

### **Phase 4: Partnerships & Manual Sources** (Ongoing)
Long-term data partnerships:

1. 🤝 Contact Good Shepherd for optimized endpoints
2. 🤝 Partner with B'Tselem for settlement data
3. 🤝 Partner with UNRWA for displacement tracking
4. 🤝 Develop utilities tracking methodology

**Expected Result**: Achieve 90%+ real data coverage

---

## 🚀 Next Steps

### Immediate Actions
1. **Create HDX integration module** in [`src/services/hdxService.ts`](src/services/hdxService.ts)
2. **Add World Bank service** in [`src/services/worldBankService.ts`](src/services/worldBankService.ts)
3. **Create data transformation utilities** for CSV/XLSX → JSON
4. **Update type definitions** in [`src/types/data.types.ts`](src/types/data.types.ts:136-147)

### Testing Plan
1. ✅ Test HDX API endpoints manually
2. ✅ Verify data formats and structures
3. ✅ Test Good Shepherd remaining endpoints
4. ✅ Implement rate limiting and caching
5. ✅ Add error handling for failed requests

### Documentation Updates
1. 📝 Update [`DATA_INTEGRATION_GUIDE.md`](DATA_INTEGRATION_GUIDE.md)
2. 📝 Create API authentication guide (if needed)
3. 📝 Document data refresh schedules
4. 📝 Add troubleshooting guide

---

## 📊 Data Quality Indicators

### Recommended Implementation
Add data quality badges to components:

```typescript
<Badge variant="success">
  🟢 Real-time data from WFP
</Badge>

<Badge variant="warning">
  🟡 Last updated: 2 hours ago
</Badge>

<Badge variant="secondary">
  ℹ️ Sample data (real data pending)
</Badge>
```

---

## 🔐 API Authentication & Rate Limits

### HDX (Humanitarian Data Exchange)
- **Authentication**: None required for public datasets
- **Rate Limit**: Not strictly enforced
- **Best Practice**: Cache responses for 1 hour

### World Bank API
- **Authentication**: None required
- **Rate Limit**: None for basic access
- **Best Practice**: Cache responses for 24 hours

### WFP Food Prices
- **Authentication**: None (accessed via HDX)
- **Update Frequency**: Weekly
- **Best Practice**: Check for updates daily, cache for 24 hours

### Good Shepherd Collective
- **Authentication**: None
- **Rate Limit**: Unknown (be respectful)
- **Best Practice**: Cache for 1 hour, maximum 1 request per minute

---

## ⚠️ Known Limitations

1. **Healthcare Attacks**: Original endpoint too large (1M+ records)
   - **Solution**: Use Health Facilities database instead
   
2. **Real-time Displacement**: No real-time IDP API found
   - **Solution**: Use population baseline + manual updates
   
3. **Settlement Data**: No public API from B'Tselem
   - **Solution**: Requires partnership or manual updates
   
4. **Utilities Data**: Limited structured data
   - **Solution**: Infer from infrastructure damage data

5. **UN Voting Records**: No simple API found
   - **Solution**: May require manual tracking or web scraping

---

## 📞 Contact Information

### Data Providers to Contact

1. **Good Shepherd Collective**
   - **Purpose**: Verify remaining endpoints, request optimized data
   - **Email**: (Research needed)

2. **UNRWA**
   - **Purpose**: Displacement and shelter data partnership
   - **Website**: https://www.unrwa.org

3. **B'Tselem**
   - **Purpose**: Settlement monitoring data
   - **Website**: https://www.btselem.org
   - **Email**: mail@btselem.org

4. **HDX Support**
   - **Purpose**: Technical questions about API usage
   - **Contact**: https://data.humdata.org/about/contact

---

## 📈 Expected Improvements

### Current State
- **Real Data**: ~35%
- **Sample Data**: ~65%
- **Update Frequency**: Varies by source

### After Phase 1-2 (Realistic Target)
- **Real Data**: ~75%
- **Sample Data**: ~25%
- **Update Frequency**: Daily for most components

### After Phase 3-4 (Ideal Target)
- **Real Data**: ~90%
- **Sample Data**: ~10%
- **Update Frequency**: Real-time where available

---

## 🎓 Learning Resources

### HDX API Documentation
- **Guide**: https://data.humdata.org/faq
- **API Docs**: https://data.humdata.org/api/3/

### World Bank API
- **Documentation**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
- **Indicators**: https://data.worldbank.org/indicator

### CSV/XLSX Processing
- **Papa Parse**: https://www.papaparse.com/ (CSV parsing)
- **SheetJS**: https://sheetjs.com/ (XLSX parsing)

---

**Document Version**: 1.0  
**Last Updated**: January 17, 2025  
**Next Review**: February 2025