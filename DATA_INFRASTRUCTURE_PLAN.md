# Data Infrastructure Overhaul Plan

## Executive Summary
Transform the Palestine Pulse app from runtime API fetching to a hybrid model with pre-fetched, locally stored data enriched by HDX HAPI API, while maintaining serverless architecture.

## Current State Analysis

### Existing Data Sources
1. **Tech4Palestine** - Gaza casualties, press killed, infrastructure
2. **Good Shepherd Collective** - Child prisoners, demolitions, NGO data
3. **HDX (Basic)** - Limited CKAN API usage
4. **World Bank** - Economic indicators
5. **WFP** - Food security (disabled)
6. **B'Tselem** - Checkpoints (weekly updates)

### Current Architecture Issues
- All data fetched at runtime (client-side)
- High latency for initial page loads
- API rate limiting concerns
- No offline capability
- Limited HDX integration

## Proposed Solution

### Phase 1: Data Storage Structure (Time-Series Optimized)

**Key Design Principle**: Support dynamic date range filtering from Oct 7, 2023 onwards with efficient loading

```
public/data/
├── manifest.json                 # Global data catalog with date ranges
├── hdx/
│   ├── casualties/
│   │   ├── index.json           # Date range index for quick lookups
│   │   ├── recent.json          # Last 30 days (fast access)
│   │   ├── 2023-Q4.json        # Oct 7 - Dec 31, 2023
│   │   ├── 2024-Q1.json        # Jan 1 - Mar 31, 2024
│   │   ├── 2024-Q2.json        # Apr 1 - Jun 30, 2024
│   │   ├── 2024-Q3.json        # Jul 1 - Sep 30, 2024
│   │   ├── 2024-Q4.json        # Oct 1 - Dec 31, 2024 (current)
│   │   └── metadata.json
│   ├── displacement/
│   │   ├── index.json
│   │   ├── recent.json
│   │   ├── 2023-Q4.json
│   │   ├── 2024-Q1.json
│   │   ├── 2024-Q2.json
│   │   ├── 2024-Q3.json
│   │   ├── 2024-Q4.json
│   │   └── metadata.json
│   ├── humanitarian/
│   │   ├── food-security/
│   │   │   ├── index.json
│   │   │   ├── recent.json
│   │   │   └── [quarterly files]
│   │   ├── health-facilities/
│   │   │   ├── index.json
│   │   │   ├── current.json    # Current status
│   │   │   └── historical.json # Changes over time
│   │   └── water-sanitation/
│   │       ├── index.json
│   │       └── [quarterly files]
│   ├── infrastructure/
│   │   ├── damage-assessment/
│   │   │   ├── index.json
│   │   │   ├── recent.json
│   │   │   └── [quarterly files]
│   │   ├── schools/
│   │   │   ├── current.json
│   │   │   └── historical.json
│   │   └── hospitals/
│   │       ├── current.json
│   │       └── historical.json
│   └── conflict/
│       ├── index.json
│       ├── recent.json
│       └── [quarterly files]
├── tech4palestine/
│   ├── casualties/
│   │   ├── index.json
│   │   ├── recent.json          # Last 30 days
│   │   ├── 2023-Q4.json
│   │   ├── 2024-Q1.json
│   │   ├── 2024-Q2.json
│   │   ├── 2024-Q3.json
│   │   └── 2024-Q4.json
│   ├── killed-in-gaza/
│   │   ├── index.json
│   │   ├── recent.json
│   │   └── [quarterly files]
│   ├── press-killed.json        # Complete list (smaller dataset)
│   ├── summary.json             # Current summary only
│   └── metadata.json
├── goodshepherd/
│   ├── prisoners/
│   │   ├── index.json
│   │   ├── current.json         # Currently detained
│   │   └── historical.json      # All records
│   ├── demolitions/
│   │   ├── index.json
│   │   ├── recent.json
│   │   └── [quarterly files]
│   └── metadata.json
├── worldbank/
│   ├── economic-indicators.json # Annual data (no partitioning needed)
│   ├── population.json
│   └── metadata.json
└── btselem/
    ├── checkpoints.json         # Current status
    └── metadata.json
```

**Time-Series File Structure**:
- **recent.json**: Last 30 days (always loaded first for dashboard)
- **Quarterly files**: Historical data partitioned by quarter
- **index.json**: Maps date ranges to files for efficient lookups
- **current.json**: Latest snapshot for non-time-series data
- **historical.json**: Complete history for smaller datasets

### Phase 2: HDX HAPI Integration

#### Key HDX HAPI Endpoints to Use

1. **Operational Presence** - `/api/v1/operational-presence`
2. **Population & Socio-economy** - `/api/v1/population-social`
3. **Affected People** - `/api/v1/affected-people`
4. **Humanitarian Needs** - `/api/v1/humanitarian-needs`
5. **Funding** - `/api/v1/funding`
6. **Conflict Events** - `/api/v1/conflict-event`
7. **Food Security** - `/api/v1/food-security`
8. **Refugees** - `/api/v1/refugees`

#### HDX HAPI Datasets for Palestine (PSE)

Based on research, these are priority datasets:
- **Casualties**: OCHA oPt casualty tracking
- **Displacement**: IDMC Internal Displacement Updates
- **Food Security**: WFP food security assessments
- **Health**: WHO health facility status
- **Infrastructure**: UNOSAT damage assessments
- **Conflict**: ACLED conflict events

### Phase 3: GitHub Actions Automation

#### Workflow Schedule
- **Critical Data** (casualties, displacement): Every 6 hours
- **Humanitarian Data** (food, health): Daily at 6 AM UTC
- **Economic Data**: Weekly on Mondays
- **Infrastructure**: Weekly on Wednesdays

#### Workflow Features
- Fetch from all sources in parallel
- Transform and normalize data
- Check for changes before committing
- Generate metadata with timestamps
- Update manifest.json
- Trigger Netlify rebuild

### Phase 4: Service Layer Updates

#### Priority Order
1. **Local JSON files** (instant, always available)
2. **Browser cache** (React Query)
3. **Live API** (fallback only)

#### Benefits
- 10x faster initial load
- Offline capability
- Reduced API costs
- Better reliability
- Historical data preservation

## Implementation Steps

### Step 1: Create Data Directory Structure
- Create public/data/ with subdirectories
- Add .gitkeep files
- Update .gitignore if needed

### Step 2: Create Fetch Scripts
- `scripts/fetch-hdx-hapi-data.js` - HDX HAPI integration
- `scripts/fetch-all-data.js` - Orchestrate all sources
- `scripts/generate-manifest.js` - Create data catalog

### Step 3: Create GitHub Actions Workflow
- `.github/workflows/update-data.yml`
- Configure secrets (HDX_API_KEY)
- Set up cron schedules

### Step 4: Update Services
- Modify hdxService.ts to read local files
- Update goodShepherdService.ts
- Update apiOrchestrator.ts

### Step 5: Create Data Loading Hook
- `useLocalData.ts` - Load from public/data/
- Fallback to API if local data missing
- Cache management

## Data Schema Standards

### Time-Series Index Schema (index.json)
```json
{
  "dataset": "casualties",
  "location": "gaza",
  "date_range": {
    "start": "2023-10-07",
    "end": "2024-10-24",
    "baseline_date": "2023-10-07"
  },
  "files": [
    {
      "file": "recent.json",
      "date_range": { "start": "2024-09-24", "end": "2024-10-24" },
      "records": 900,
      "size_kb": 45
    },
    {
      "file": "2024-Q4.json",
      "date_range": { "start": "2024-10-01", "end": "2024-10-24" },
      "records": 720,
      "size_kb": 38
    },
    {
      "file": "2024-Q3.json",
      "date_range": { "start": "2024-07-01", "end": "2024-09-30" },
      "records": 2760,
      "size_kb": 142
    },
    {
      "file": "2023-Q4.json",
      "date_range": { "start": "2023-10-07", "end": "2023-12-31" },
      "records": 2550,
      "size_kb": 131
    }
  ],
  "last_updated": "2024-10-24T10:00:00Z"
}
```

### Time-Series Data File Schema (e.g., 2024-Q3.json)
```json
{
  "metadata": {
    "source": "hdx-hapi",
    "dataset": "casualties",
    "location": "gaza",
    "date_range": {
      "start": "2024-07-01",
      "end": "2024-09-30"
    },
    "record_count": 2760,
    "last_updated": "2024-10-24T10:00:00Z",
    "data_quality": "verified",
    "provisional": false
  },
  "data": [
    {
      "date": "2024-07-01",
      "killed": 45,
      "killed_cumulative": 38500,
      "injured": 120,
      "injured_cumulative": 88000,
      "children_killed": 18,
      "women_killed": 12,
      "source": "hdx-hapi"
    },
    {
      "date": "2024-07-02",
      "killed": 52,
      "killed_cumulative": 38552,
      "injured": 135,
      "injured_cumulative": 88135,
      "children_killed": 21,
      "women_killed": 15,
      "source": "hdx-hapi"
    }
  ]
}
```

### Metadata Schema (metadata.json)
```json
{
  "source": "hdx-hapi",
  "dataset": "casualties",
  "location": "gaza",
  "baseline_date": "2023-10-07",
  "last_updated": "2024-10-24T10:00:00Z",
  "next_update": "2024-10-24T16:00:00Z",
  "total_records": 45000,
  "api_endpoint": "https://hapi.humdata.org/api/v1/affected-people",
  "update_frequency": "6_hours",
  "data_quality": "verified",
  "provisional": false,
  "date_range": {
    "start": "2023-10-07",
    "end": "2024-10-24"
  },
  "partitioning": {
    "strategy": "quarterly",
    "files": 5,
    "total_size_kb": 1250
  }
}
```

### Global Manifest Schema (manifest.json)
```json
{
  "generated_at": "2024-10-24T10:00:00Z",
  "version": "2.0.0",
  "baseline_date": "2023-10-07",
  "datasets": {
    "hdx": {
      "casualties": {
        "gaza": {
          "path": "/data/hdx/casualties",
          "index_file": "/data/hdx/casualties/index.json",
          "date_range": { "start": "2023-10-07", "end": "2024-10-24" },
          "last_updated": "2024-10-24T10:00:00Z",
          "total_records": 45000,
          "files": 5
        },
        "westbank": {
          "path": "/data/hdx/casualties",
          "index_file": "/data/hdx/casualties/westbank-index.json",
          "date_range": { "start": "2023-10-07", "end": "2024-10-24" },
          "last_updated": "2024-10-24T10:00:00Z",
          "total_records": 8500,
          "files": 5
        }
      },
      "displacement": {
        "gaza": {
          "path": "/data/hdx/displacement",
          "index_file": "/data/hdx/displacement/index.json",
          "date_range": { "start": "2023-10-07", "end": "2024-10-24" },
          "last_updated": "2024-10-24T10:00:00Z",
          "total_records": 12000,
          "files": 5
        }
      }
    },
    "tech4palestine": {
      "casualties": {
        "path": "/data/tech4palestine/casualties",
        "index_file": "/data/tech4palestine/casualties/index.json",
        "date_range": { "start": "2023-10-07", "end": "2024-10-24" },
        "last_updated": "2024-10-24T10:00:00Z",
        "total_records": 50000,
        "files": 5
      }
    }
  }
}
```

## Security Considerations

1. **API Keys**: Store in GitHub Secrets only
2. **Rate Limiting**: Respect HDX 1 req/sec limit
3. **Data Validation**: Verify data integrity before commit
4. **Error Handling**: Graceful fallbacks
5. **Logging**: Track all fetch operations

## Performance Targets

- **Initial Load**: < 2 seconds (vs current 5-10s)
- **Data Freshness**: < 6 hours for critical data
- **Bundle Size**: Keep data files < 5MB each
- **Offline Support**: 100% of core features

## Monitoring & Maintenance

1. **GitHub Actions Logs**: Monitor fetch success/failure
2. **Data Freshness Alerts**: Notify if data > 24 hours old
3. **Size Monitoring**: Alert if files > 10MB
4. **API Health**: Track endpoint availability

## Next Steps

1. Review and approve this plan
2. Set up HDX API key in GitHub Secrets
3. Create data directory structure
4. Implement fetch scripts
5. Test locally
6. Deploy GitHub Actions workflow
7. Update frontend services
8. Monitor and optimize

## Timeline

- **Week 1**: Infrastructure setup, scripts creation
- **Week 2**: GitHub Actions implementation, testing
- **Week 3**: Service layer updates, frontend integration
- **Week 4**: Monitoring, optimization, documentation

## Success Metrics

- [ ] All data sources automated
- [ ] Data updates every 6 hours
- [ ] Initial load time < 2 seconds
- [ ] 100% offline capability
- [ ] Zero API rate limit violations
- [ ] Historical data preserved in Git


## Dynamic Date Range Filtering Strategy

### Frontend Implementation

#### 1. Date Range Query Hook
```typescript
// hooks/useDateRangeData.ts
export const useDateRangeData = (
  source: 'hdx' | 'tech4palestine',
  dataset: string,
  dateRange: { start: string; end: string }
) => {
  // 1. Load index.json to find relevant files
  // 2. Fetch only files that overlap with date range
  // 3. Filter data client-side
  // 4. Cache results
}
```

#### 2. Efficient File Loading
```typescript
// Example: User selects Oct 7, 2023 - Oct 24, 2024
// System loads:
// - index.json (5KB) - instant
// - Determines needed files: 2023-Q4, 2024-Q1, 2024-Q2, 2024-Q3, 2024-Q4
// - Loads files in parallel (total ~500KB)
// - Filters to exact date range
// - Caches for subsequent queries
```

#### 3. Smart Caching Strategy
- **Recent data** (last 30 days): Always cached, refreshed every 6 hours
- **Historical data**: Cached indefinitely (immutable)
- **Index files**: Cached for 24 hours
- **Filtered results**: Cached by date range key

### Data Update Strategy

#### Incremental Updates
```javascript
// When new data arrives:
// 1. Append to current quarter file (2024-Q4.json)
// 2. Update recent.json (rolling 30-day window)
// 3. Update index.json with new date range
// 4. Update metadata.json
// 5. Update manifest.json
// 6. Commit changes (only modified files)
```

#### Historical Data Preservation
- Quarterly files are immutable once the quarter ends
- Only current quarter file is updated
- Git history preserves all changes
- Enables time-travel queries

### Performance Optimization

#### Initial Load (Dashboard)
1. Load manifest.json (10KB) - 50ms
2. Load recent.json for all datasets (200KB total) - 200ms
3. Display dashboard with last 30 days - **Total: 250ms**

#### Date Range Query (e.g., Oct 7, 2023 - Oct 24, 2024)
1. Check cache - if hit, instant
2. Load index.json (5KB) - 20ms
3. Identify needed files (5 quarters)
4. Load files in parallel (500KB total) - 400ms
5. Filter to exact range - 50ms
6. Cache result - **Total: 470ms**

#### Comparison to Current Approach
- **Current**: 5-10 seconds (multiple API calls, rate limiting)
- **New**: 250ms - 500ms (local files, parallel loading)
- **Improvement**: 10-20x faster

### Date Filter UI Components

#### Preset Ranges
- Last 7 days
- Last 30 days
- Last 90 days
- Since Oct 7, 2023 (baseline)
- Custom range

#### Dynamic Range Validation
- Minimum date: Oct 7, 2023
- Maximum date: Current date
- Validate against available data in index.json
- Show data availability indicators

### API Fallback for Real-Time Data

If local data is stale (> 6 hours old):
1. Show local data immediately
2. Fetch latest from API in background
3. Update UI when new data arrives
4. Show "Updated X minutes ago" indicator

### Benefits for Your Use Case

✅ **Dynamic Filtering**: Efficiently filter any date range from Oct 7, 2023 onwards
✅ **Fast Loading**: 10-20x faster than current API approach
✅ **Offline Support**: Works completely offline with cached data
✅ **Historical Preservation**: Git history maintains all data versions
✅ **Incremental Updates**: Only fetch new data, not entire datasets
✅ **Scalable**: Handles growing datasets without performance degradation
✅ **Flexible**: Easy to add new date ranges or change partitioning strategy

### Example User Flows

#### Flow 1: Dashboard Load
1. User opens app
2. App loads recent.json (last 30 days) - 250ms
3. Dashboard displays immediately
4. Background: Check for updates, fetch if needed

#### Flow 2: Custom Date Range
1. User selects "Oct 7, 2023 - Dec 31, 2023"
2. App checks cache - miss
3. Loads index.json - 20ms
4. Identifies file: 2023-Q4.json
5. Loads file - 100ms
6. Filters to exact range - 20ms
7. Displays results - **Total: 140ms**

#### Flow 3: Full History
1. User selects "Since Oct 7, 2023"
2. App checks cache - miss
3. Loads index.json - 20ms
4. Identifies all files (5 quarters)
5. Loads files in parallel - 400ms
6. Combines data - 50ms
7. Displays results - **Total: 470ms**

### Migration Path

1. **Phase 1**: Implement data fetching and storage (Week 1)
2. **Phase 2**: Create index files and partitioning (Week 1)
3. **Phase 3**: Update frontend to use local data (Week 2)
4. **Phase 4**: Add date range filtering UI (Week 2)
5. **Phase 5**: Optimize and monitor (Week 3-4)

This approach fully supports your requirement for dynamic date range filtering from Oct 7, 2023 onwards while providing massive performance improvements!
