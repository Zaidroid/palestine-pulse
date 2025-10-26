# Manifest System Usage Guide

## Overview
The manifest generation system provides comprehensive metadata about all locally stored datasets, enabling efficient data discovery and loading in the Palestine Pulse dashboard.

## Quick Start

### Generate All Manifests
```bash
npm run generate-manifest
```

### Update All Data and Manifests
```bash
npm run update-data
```
This runs: fetch-all-data → generate-manifest → validate-data

## Generated Files

### Global Manifest
**File**: `public/data/manifest.json`
**Purpose**: Central catalog of all data sources
**Contains**:
- Summary statistics (sources, datasets, records, storage)
- Source-level summaries for HDX, Good Shepherd, World Bank, Tech4Palestine
- Last updated timestamps
- Version information

### HDX Metadata
**File**: `public/data/hdx/metadata.json`
**Purpose**: Catalog of HDX datasets
**Contains**:
- List of all HDX datasets with metadata
- Category organization (7 categories)
- Record counts per dataset
- Partition information
- Date ranges

### Good Shepherd Metadata
**File**: `public/data/goodshepherd/metadata.json`
**Purpose**: Catalog of Good Shepherd datasets
**Contains**:
- Healthcare attacks data
- Demolitions data
- NGO financial data
- Prisoner data
- Partition information
- Recent file availability

### World Bank Metadata
**File**: `public/data/worldbank/metadata.json`
**Purpose**: Catalog of World Bank indicators
**Contains**:
- All 75+ indicators with metadata
- Category classification (10 categories)
- Data point counts
- Unit information

**File**: `public/data/worldbank/all-indicators.json`
**Purpose**: Simplified indicator catalog
**Contains**:
- List of all indicators
- Quick reference for indicator codes and names

### Tech4Palestine Metadata
**File**: `public/data/tech4palestine/metadata.json`
**Purpose**: Catalog of Tech4Palestine datasets
**Contains**:
- Summary data availability
- Press killed records
- Casualties data
- Killed in Gaza data

## Using Manifests in Code

### Load Global Manifest
```typescript
const manifest = await fetch('/data/manifest.json').then(r => r.json());

// Access summary
console.log(`Total datasets: ${manifest.summary.total_datasets}`);
console.log(`Total records: ${manifest.summary.total_records}`);

// Access source info
const hdxInfo = manifest.sources.hdx;
console.log(`HDX has ${hdxInfo.datasets} datasets with ${hdxInfo.records} records`);
```

### Load HDX Catalog
```typescript
const hdxCatalog = await fetch('/data/hdx/metadata.json').then(r => r.json());

// Find datasets by category
const displacementDatasets = hdxCatalog.datasets.filter(
  d => d.category === 'displacement'
);

// Check if dataset is partitioned
const dataset = hdxCatalog.datasets.find(d => d.id === 'idmc-idp-data-pse');
if (dataset.partitioned) {
  // Load partitions
  console.log(`Dataset has ${dataset.partition_count} partitions`);
}
```

### Load World Bank Indicators
```typescript
const wbMetadata = await fetch('/data/worldbank/metadata.json').then(r => r.json());

// Find indicators by category
const economicIndicators = wbMetadata.indicators.filter(
  i => i.category === 'economic'
);

// Get indicator info
const gdpIndicator = wbMetadata.indicators.find(
  i => i.code === 'NY.GDP.MKTP.CD'
);
console.log(`${gdpIndicator.name}: ${gdpIndicator.data_points} data points`);
```

### Load Good Shepherd Metadata
```typescript
const gsMetadata = await fetch('/data/goodshepherd/metadata.json').then(r => r.json());

// Check healthcare data
const healthcare = gsMetadata.datasets.healthcare;
if (healthcare.has_recent_file) {
  // Load recent data
  const recentData = await fetch('/data/goodshepherd/healthcare/recent.json')
    .then(r => r.json());
}

// Check if partitioned
if (healthcare.partitioned) {
  console.log(`Healthcare data has ${healthcare.partition_count} partitions`);
}
```

## Manifest Structure Reference

### Global Manifest Structure
```typescript
interface GlobalManifest {
  generated_at: string;
  version: string;
  baseline_date: string;
  sources: {
    [sourceName: string]: {
      name: string;
      path: string;
      datasets?: number;
      records?: number;
      indicators?: number;
      data_points?: number;
      categories?: number;
      partitions?: number;
      size_bytes: number;
      size_mb: string;
      last_updated: string;
    };
  };
  summary: {
    total_sources: number;
    total_datasets: number;
    total_records: number;
    total_size_bytes: number;
    total_size_mb: string;
  };
}
```

### HDX Metadata Structure
```typescript
interface HDXMetadata {
  source: string;
  last_updated: string;
  baseline_date: string;
  total_datasets: number;
  total_records: number;
  datasets: Array<{
    id: string;
    name: string;
    category: string;
    record_count: number;
    date_range: { start: string; end: string } | null;
    partitioned: boolean;
    partition_count?: number;
    partitions?: Array<{
      file: string;
      quarter: string;
      record_count: number;
      date_range?: { start: string; end: string };
    }>;
    has_recent_file?: boolean;
    recent_records?: number;
    file?: string;
  }>;
  categories: {
    [category: string]: number;
  };
}
```

### Good Shepherd Metadata Structure
```typescript
interface GoodShepherdMetadata {
  source: string;
  api_base: string;
  last_updated: string;
  baseline_date: string;
  datasets: {
    [category: string]: {
      name: string;
      category: string;
      record_count: number;
      date_range: { start: string; end: string } | null;
      partitioned: boolean;
      partition_count: number;
      partition_strategy: string;
      has_recent_file: boolean;
      files?: string[];
    };
  };
  summary: {
    total_datasets: number;
    total_records: number;
    total_partitions: number;
  };
}
```

### World Bank Metadata Structure
```typescript
interface WorldBankMetadata {
  metadata: {
    source: string;
    country: string;
    country_code: string;
    last_updated: string;
    indicators: number;
    total_data_points: number;
  };
  indicators: Array<{
    code: string;
    name: string;
    category: string;
    data_points: number;
    unit: string;
  }>;
}
```

## Common Use Cases

### 1. Data Discovery
```typescript
// Find all available datasets
const manifest = await fetch('/data/manifest.json').then(r => r.json());
const allSources = Object.keys(manifest.sources);
console.log('Available sources:', allSources);
```

### 2. Check Data Freshness
```typescript
// Check when data was last updated
const manifest = await fetch('/data/manifest.json').then(r => r.json());
const hdxLastUpdated = new Date(manifest.sources.hdx.last_updated);
const daysSinceUpdate = (Date.now() - hdxLastUpdated.getTime()) / (1000 * 60 * 60 * 24);
console.log(`HDX data is ${daysSinceUpdate.toFixed(0)} days old`);
```

### 3. Load Specific Dataset
```typescript
// Load a specific HDX dataset
const hdxCatalog = await fetch('/data/hdx/metadata.json').then(r => r.json());
const dataset = hdxCatalog.datasets.find(d => d.id === 'idmc-idp-data-pse');

if (dataset) {
  const dataPath = `/data/hdx/${dataset.category}/${dataset.file}`;
  const data = await fetch(dataPath).then(r => r.json());
  console.log(`Loaded ${data.data.length} records`);
}
```

### 4. Filter by Category
```typescript
// Get all economic indicators
const wbMetadata = await fetch('/data/worldbank/metadata.json').then(r => r.json());
const economicIndicators = wbMetadata.indicators
  .filter(i => i.category === 'economic')
  .map(i => ({ code: i.code, name: i.name }));
```

### 5. Calculate Storage Usage
```typescript
// Calculate storage by source
const manifest = await fetch('/data/manifest.json').then(r => r.json());
const storageBySource = Object.entries(manifest.sources).map(([name, info]) => ({
  source: name,
  size_mb: info.size_mb,
  percentage: ((info.size_bytes / manifest.summary.total_size_bytes) * 100).toFixed(1)
}));
```

## Maintenance

### When to Regenerate Manifests
- After running any data fetch script
- After adding new datasets
- After modifying data structures
- As part of automated data refresh workflows

### Automated Regeneration
The manifest generation is automatically included in the `update-data` script:
```bash
npm run update-data
```

This ensures manifests are always in sync with the actual data.

### Manual Regeneration
If you need to regenerate manifests without fetching new data:
```bash
npm run generate-manifest
```

## Troubleshooting

### Manifest Shows 0 Records
**Cause**: Data file structure not recognized by record counter
**Solution**: Check data file format and update `countRecordsInFile()` function if needed

### Missing Datasets in Manifest
**Cause**: Dataset files not in expected location or format
**Solution**: Verify file paths and ensure files are in correct directories

### Partition Information Missing
**Cause**: index.json file not found or malformed
**Solution**: Ensure partitioned datasets have valid index.json files

### Outdated Timestamps
**Cause**: Manifest not regenerated after data update
**Solution**: Run `npm run generate-manifest` after data updates

## Integration with Dashboard

### Data Loading Hook
```typescript
// Example: useManifest hook
export function useManifest() {
  const [manifest, setManifest] = useState(null);
  
  useEffect(() => {
    fetch('/data/manifest.json')
      .then(r => r.json())
      .then(setManifest);
  }, []);
  
  return manifest;
}
```

### Dataset Selector Component
```typescript
// Example: Dataset selector using manifest
function DatasetSelector() {
  const manifest = useManifest();
  
  if (!manifest) return <Loading />;
  
  return (
    <select>
      {Object.entries(manifest.sources).map(([key, source]) => (
        <optgroup key={key} label={source.name}>
          {/* Render datasets for this source */}
        </optgroup>
      ))}
    </select>
  );
}
```

## Best Practices

1. **Always regenerate manifests after data updates**
2. **Use manifests for data discovery, not direct data access**
3. **Cache manifest data in application state**
4. **Check last_updated timestamps to determine data freshness**
5. **Use partition information to load data efficiently**
6. **Validate manifest structure before using in production**

## Future Enhancements

Potential improvements to the manifest system:
- Data quality scores in manifests
- Change detection (what's new since last update)
- Data lineage tracking
- API endpoint information
- Refresh schedules
- Data dependencies

## Support

For issues or questions about the manifest system:
1. Check this guide first
2. Review the implementation in `scripts/generate-manifest.js`
3. Check the task implementation document: `TASK_6_IMPLEMENTATION.md`
4. Verify data file structures match expected formats
