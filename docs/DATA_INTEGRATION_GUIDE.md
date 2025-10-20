# Palestine Dashboard V2 - Data Integration Guide

## Current Data Status

### ✅ REAL DATA (Active - Tech for Palestine)
The following components use **REAL, LIVE DATA** from Tech for Palestine API:

**Main Dashboard (`/`):**
- ✅ Gaza casualties (killed, injured, demographics)
- ✅ West Bank casualties  
- ✅ Press/journalist casualties
- ✅ Infrastructure damage (daily reports)
- ✅ Daily casualty trends
- ✅ All charts on main dashboard

**Advanced Analytics (`/advanced`):**
- ✅ Predictive analytics (uses real casualty data for forecasting)
- ✅ Anomaly detection (uses real casualty data)
- ✅ Correlation analysis (can use real data)
- ✅ Comparison tool (can use real data)

### 📊 SAMPLE DATA (New V2 Dashboards)
The following dashboards use **REALISTIC SAMPLE DATA** awaiting real API integration:

**Analytics Page (`/analytics`):**
- 📊 Economic Impact (sample data - ready for World Bank API)
- 📊 Humanitarian Aid (sample data - ready for UN OCHA)
- 📊 Healthcare System (sample data - ready for WHO)
- 📊 Displacement Stats (sample data - ready for UNRWA)
- 📊 Education Impact (sample data - ready for UNESCO/UNRWA)
- 📊 Utilities Status (sample data - ready for local authorities)
- 📊 Food Security (sample data - ready for WFP)
- 📊 Prisoners Stats (sample data - ready for B'Tselem)
- 📊 Settlement Expansion (sample data - ready for Peace Now)
- 📊 International Response (sample data - ready for UN)

**Maps Page (`/maps`):**
- 🗺️ Interactive maps (real coordinates, sample casualty numbers)
- ⏰ Timeline events (curated historical events - can add more)

---

## How to Integrate Real Data Sources

### Option 1: Public APIs (No API Key Required)

#### UN OCHA Humanitarian Data Exchange
```typescript
// In src/services/apiOrchestrator.ts
// Update configuration:
un_ocha: {
  name: 'un_ocha',
  baseUrl: 'https://data.humdata.org/api/3',
  enabled: true, // Change to true
  priority: 2,
  cache_ttl: 15 * 60 * 1000,
  retry_attempts: 2,
}

// Create fetch function:
export const fetchUNOCHAData = (dataset: string) =>
  apiOrchestrator.fetch('un_ocha', `/action/package_show?id=${dataset}`);
```

#### World Bank Open Data
```typescript
// Update configuration:
world_bank: {
  name: 'world_bank',
  baseUrl: 'https://api.worldbank.org/v2',
  enabled: true, // Change to true
  ...
}

// Example endpoints:
// https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json
// (Palestine GDP data)
```

### Option 2: API Keys Required

Some data sources require API keys or authentication:

1. **WHO Health Data** - May require registration
2. **Some UN databases** - May need credentials
3. **Commercial data providers** - Require paid subscriptions

### Option 3: Static Data Files

For data that updates infrequently, you can:

1. Download datasets manually
2. Place in `public/data/` folder
3. Fetch as static JSON files
4. Update periodically

Example:
```typescript
// Fetch from local file
const response = await fetch('/data/economic-indicators.json');
const data = await response.json();
```

---

## Integration Examples

### Example 1: Enable World Bank Economic Data

1. **Update API Orchestrator** (`src/services/apiOrchestrator.ts`):
```typescript
world_bank: {
  enabled: true, // Enable the source
  ...
}
```

2. **Create Hook** (`src/hooks/useDataFetching.ts`):
```typescript
export const useEconomicData = () => {
  return useQuery({
    queryKey: ["economicData"],
    queryFn: async () => {
      const response = await apiOrchestrator.fetch(
        'world_bank',
        '/country/PSE/indicator/NY.GDP.MKTP.CD?format=json'
      );
      return response.data;
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
};
```

3. **Update Component** (`src/components/dashboards/EconomicImpact.tsx`):
```typescript
// Replace sample data with:
const { data: economicData, isLoading } = useEconomicData();

// Use real data in visualizations
const processedData = economicData?.map(item => ({
  month: item.date,
  gdpLoss: item.value,
  ...
}));
```

### Example 2: Integrate Static Humanitarian Data

1. **Download Data:**
   - Get dataset from UN OCHA, WHO, etc.
   - Save as JSON in `public/data/`

2. **Create Fetcher:**
```typescript
export const useHumanitarianData = () => {
  return useQuery({
    queryKey: ["humanitarianData"],
    queryFn: async () => {
      const response = await fetch('/data/humanitarian.json');
      return response.json();
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
};
```

3. **Update Dashboard:**
   - Replace SAMPLE_DATA with useHumanitarianData()
   - Transform data to match component structure

---

## Quick Integration Checklist

For each new data source:

- [ ] Enable source in `apiOrchestrator.ts`
- [ ] Create fetch function or hook
- [ ] Update dashboard component
- [ ] Test data loading
- [ ] Verify visualizations
- [ ] Update documentation
- [ ] Handle errors gracefully

---

## Data Source Availability Matrix

| Source | Status | Requires | Public Access | Notes |
|--------|--------|----------|---------------|-------|
| **Tech for Palestine** | ✅ Active | None | Yes | Primary source - working |
| **UN OCHA** | 🔄 Ready | Registration | Limited | Some datasets public |
| **WHO** | 🔄 Ready | API Key | Some | Health data available |
| **World Bank** | 🔄 Ready | None | Yes | Open data - easy to integrate |
| **UNRWA** | ⏸️ Configured | Unknown | Limited | May need official request |
| **PCBS** | ⏸️ Configured | Unknown | Limited | Palestinian authority |
| **B'Tselem** | ⏸️ Configured | Unknown | Partial | Some data publicly available |
| **Custom** | ⏸️ Ready | Varies | Varies | For any additional sources |

---

## Recommended Next Steps

### Immediate (Can Do Now):

1. **World Bank Economic Data**
   - Fully public API
   - No authentication needed
   - GDP, unemployment data available
   - Easy integration

2. **Static Data Files**
   - Download verified datasets
   - Place in `public/data/`
   - Update components
   - Deploy with static data

### Short-term (Requires Research):

3. **UN OCHA**
   - Research available datasets
   - Check if registration needed
   - Test API endpoints
   - Integrate humanitarian data

4. **WHO Health Data**
   - Check API documentation
   - Request API key if needed
   - Test endpoints
   - Integrate health statistics

### Alternative Approach:

**Crowdsourced/Verified Data:**
- Work with humanitarian organizations
- Get verified datasets
- Use static JSON files
- Update monthly/quarterly

---

## Sample vs. Real Data Indicators

Currently, all dashboards show data but should include indicators:

**Current Implementation:**
```typescript
<div className="text-xs text-muted-foreground">
  Data source: UN OCHA, WHO (sample data for demonstration)
</div>
```

**Can Add Badges:**
```typescript
<Badge variant="secondary">Sample Data</Badge>
<Badge variant="default">Live Data</Badge>
```

---

## Benefits of Current Approach

### Why Sample Data is OK for Now:

1. **Demonstrates Functionality** - Shows what dashboard will look like
2. **UI/UX Testing** - Allows testing of layout and interactions
3. **Deployment Ready** - Can deploy and improve iteratively
4. **Realistic Values** - Sample data based on actual reports
5. **Easy Migration** - Simple to swap sample with real data later

### Real Data Integration Path:

```
Phase 1: Deploy with sample data ✅
Phase 2: Integrate World Bank (public API)
Phase 3: Add static datasets (verified sources)
Phase 4: Integrate authenticated APIs (as access granted)
Phase 5: Continuous updates (automated)
```

---

## Conclusion

**Current Status:**
- ✅ Main Dashboard: 100% REAL DATA
- ✅ Analytics Infrastructure: Ready for real data
- 📊 New Dashboards: Sample data (realistic, based on reports)
- 🔄 API Orchestrator: Configured for 8 sources
- 🚀 Deployment: Ready now, improve iteratively

**You can:**
1. Deploy now with current mix (real + sample)
2. Add real sources incrementally
3. Each dashboard clearly labeled
4. No breaking changes when adding real data

**Recommendation:** Deploy now, integrate additional sources over time as you get access/keys!