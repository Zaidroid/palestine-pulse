# HDX API Integration - Complete Setup Guide

## Prerequisites
- GitHub repository with your Palestine tracker app
- Netlify account with site deployed
- HDX API Key (from https://data.humdata.org)

## Step-by-Step Setup

### 1. Repository Structure

Create the following directory structure in your repo:

```
your-repo/
├── .github/
│   └── workflows/
│       └── fetch-hdx-data.yml
├── netlify/
│   └── functions/
│       └── hdx-data.js
├── scripts/
│   └── fetch-hdx-data.js
├── data/
│   ├── gaza/
│   ├── westbank/
│   └── manifest.json
├── src/
│   ├── services/
│   │   └── hdxDataService.js
│   └── components/
│       └── GazaDashboard.jsx
├── netlify.toml
└── package.json
```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

1. **HDX_API_KEY**: Your HDX API key
2. **NETLIFY_BUILD_HOOK**: Create a build hook in Netlify (Settings → Build & deploy → Build hooks)

### 3. Netlify Configuration

Create `netlify.toml` in your root directory:

```toml
[build]
  command = "npm run build"
  publish = "dist" # or "build" depending on your framework

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Environment variables
[build.environment]
  NODE_VERSION = "20"
```

### 4. Environment Variables in Netlify

Go to Netlify Dashboard → Site settings → Environment variables

Add: **HDX_API_KEY** = your HDX API key

### 5. Package.json Dependencies

Add these dependencies:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "papaparse": "^5.4.1",
    "date-fns": "^2.30.0"
  }
}
```

### 6. Initial Data Setup

Run the data fetch script locally once to populate initial data:

```bash
# Install dependencies
npm install

# Set your API key
export HDX_API_KEY='your-api-key-here'

# Run the fetch script
node scripts/fetch-hdx-data.js

# Commit the generated data
git add data/
git commit -m "Initial HDX data import"
git push
```

### 7. Verify GitHub Actions

After pushing, check:
1. Go to your repo → Actions tab
2. You should see the "Fetch HDX Data" workflow
3. It will run automatically every 6 hours
4. You can also trigger it manually using "Run workflow"

### 8. Test Netlify Functions

After deployment, test your function:

```bash
# Search datasets
curl "https://your-site.netlify.app/.netlify/functions/hdx-data?action=search&query=gaza"

# Get stats
curl "https://your-site.netlify.app/.netlify/functions/hdx-data?action=stats&category=gaza"
```

## Key HDX Datasets to Track

### Gaza
- **palestine-casualties**: Daily casualty figures
- **occupied-palestinian-territory-opt-health-facilities**: Health system status
- **gaza-displacement-figures**: IDP numbers and locations
- **gaza-humanitarian-access**: Access restrictions and closures
- **opt-damage-assessment**: Infrastructure damage

### West Bank
- **west-bank-demolitions-and-displacement**: Demolition data
- **opt-incidents-database**: Security incidents
- **opt-movement-and-access**: Checkpoint data
- **settler-violence-database**: Settler-related incidents
- **opt-casualties**: West Bank casualties

## Data Update Frequency

1. **GitHub Actions**: Every 6 hours (adjustable in workflow CRON)
2. **Netlify Function Cache**: 1 hour
3. **Client-side Cache**: 5 minutes

## Best Practices

### 1. Data Quality
- Always check `metadata_modified` dates
- Verify data completeness before displaying
- Handle missing data gracefully
- Show data sources and timestamps

### 2. Performance
- Use static data for initial render (fast)
- Load live data in background
- Implement progressive loading for large datasets
- Cache aggressively

### 3. Error Handling
```javascript
try {
  const data = await hdxDataService.loadStaticData('gaza', 'casualties');
  // Use data
} catch (error) {
  // Show user-friendly error
  // Fall back to cached data if available
  console.error('Failed to load data:', error);
}
```

### 4. Rate Limiting
- HDX API has rate limits (exact limits vary)
- GitHub Actions: No excessive requests
- Netlify Functions: Implement caching
- Client: Debounce user-triggered refreshes

## Monitoring

### GitHub Actions Status
Check `.github/workflows/fetch-hdx-data.yml` runs:
- View logs for errors
- Monitor data fetch success rate
- Check commit history for updates

### Netlify Function Logs
- Netlify Dashboard → Functions tab
- Monitor invocations and errors
- Check execution duration

### Data Freshness
Display last update time in UI:
```javascript
const manifest = await hdxDataService.getManifest();
console.log('Data last updated:', manifest.last_updated);
```

## Troubleshooting

### GitHub Action Fails
1. Check HDX_API_KEY secret is set correctly
2. Verify API key is active on HDX
3. Check network connectivity in logs
4. Review rate limiting

### Netlify Function Timeout
1. Reduce data fetching scope
2. Implement better caching
3. Increase function timeout (Netlify settings)
4. Use background functions for heavy tasks

### Data Not Updating
1. Check GitHub Actions is running
2. Verify git commits are being made
3. Check Netlify build hook is triggered
4. Clear all caches and test

## Advanced Features

### Custom Data Processing
Add transformations in `scripts/fetch-hdx-data.js`:

```javascript
function processGazaData(rawData) {
  return rawData.map(record => ({
    date: record.date,
    total: parseInt(record.total),
    children: parseInt(record.children),
    // Add calculated fields
    childrenPercentage: (record.children / record.total * 100).toFixed(1)
  }));
}
```

### Multiple Data Sources
Combine HDX with your existing sources:

```javascript
async function getCombinedData() {
  const [hdx, tech4palestine, goodshepherd] = await Promise.all([
    hdxDataService.getGazaCasualties(),
    tech4palestineAPI.getData(),
    goodshepherdAPI.getData()
  ]);
  
  return mergeDataSources([hdx, tech4palestine, goodshepherd]);
}
```

### Historical Analysis
Use HDX's historical data:

```javascript
// Fetch all versions of a dataset
const history = await fetchHistoricalVersions(datasetId);
const trends = analyzeTimeSeries(history);
```

## Resources

- HDX API Documentation: https://hdx-hxl-preview.readthedocs.io/en/latest/
- HDX Python Library: https://github.com/OCHA-DAP/hdx-python-api
- CKAN API (HDX uses CKAN): https://docs.ckan.org/en/latest/api/
- GitHub Actions Docs: https://docs.github.com/en/actions
- Netlify Functions Docs: https://docs.netlify.com/functions/overview/

## Support

If you encounter issues:
1. Check HDX status page
2. Review GitHub Actions logs
3. Check Netlify function logs
4. Verify API key permissions
5. Test API endpoints directly with curl

## License & Attribution

Always attribute data sources:
- "Data provided by Humanitarian Data Exchange (HDX)"
- "Source: UN OCHA"
- Include specific dataset licenses
- Link to original datasets when displaying data
