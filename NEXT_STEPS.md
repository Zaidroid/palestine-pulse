# Next Steps - Data Infrastructure Implementation

## ✅ What's Been Completed

### 1. Infrastructure Files Created
- ✅ Data directory structure (`public/data/`)
- ✅ HDX HAPI fetch script (`scripts/fetch-hdx-hapi-data.js`)
- ✅ Consolidated fetch script (`scripts/fetch-all-data.js`)
- ✅ GitHub Actions workflow (`.github/workflows/update-data.yml`)
- ✅ Frontend hooks (`src/hooks/useLocalData.ts`)
- ✅ Setup automation script (`scripts/setup-data-infrastructure.sh`)

### 2. Documentation Created
- ✅ `DATA_INFRASTRUCTURE_PLAN.md` - Complete architectural plan
- ✅ `DATA_INFRASTRUCTURE_README.md` - Setup and usage guide
- ✅ `IMPLEMENTATION_SUMMARY.md` - What we built
- ✅ `DATA_QUICK_REFERENCE.md` - Quick reference card
- ✅ `DATA_ARCHITECTURE_DIAGRAM.md` - Visual architecture
- ✅ `NEXT_STEPS.md` - This file

### 3. Configuration Updated
- ✅ `package.json` - Added npm scripts
- ✅ Initial `manifest.json` created

## 🚀 Immediate Next Steps (You Need to Do)

### Step 1: Get HDX API Key (5 minutes)

1. Go to https://data.humdata.org
2. Sign up or log in
3. Go to your profile → Settings
4. Generate an API key
5. Copy the key (you'll need it next)

### Step 2: Test Locally (10 minutes)

```bash
# 1. Set your HDX API key
export HDX_API_KEY='your-api-key-here'

# 2. Run the setup script
./scripts/setup-data-infrastructure.sh

# 3. Check the results
ls -la public/data/hdx/casualties/
cat public/data/manifest.json
```

**Expected Output:**
- Data files created in `public/data/`
- Console shows successful fetches
- No errors in the output

### Step 3: Review the Data (5 minutes)

```bash
# Check what was created
find public/data -name "*.json" | head -20

# Look at a sample file
cat public/data/tech4palestine/casualties/recent.json | head -50

# Check file sizes
du -sh public/data/*
```

**What to Look For:**
- Files are not empty
- JSON is valid (no syntax errors)
- Data has records from Oct 7, 2023 onwards
- File sizes are reasonable (< 5MB each)

### Step 4: Commit Initial Data (5 minutes)

```bash
# Stage the data files
git add public/data/
git add scripts/
git add .github/workflows/update-data.yml
git add src/hooks/useLocalData.ts
git add *.md

# Commit
git commit -m "feat: implement data infrastructure with HDX HAPI integration

- Add automated data fetching from HDX HAPI and Tech4Palestine
- Implement time-series partitioning for efficient date range queries
- Add GitHub Actions workflow for 6-hour updates
- Create frontend hooks for local data loading
- Add comprehensive documentation

Closes #[issue-number]"

# Push
git push origin main
```

### Step 5: Configure GitHub Secrets (5 minutes)

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add `HDX_API_KEY`:
   - Name: `HDX_API_KEY`
   - Value: Your HDX API key from Step 1
5. (Optional) Add `NETLIFY_BUILD_HOOK`:
   - Name: `NETLIFY_BUILD_HOOK`
   - Value: Your Netlify build hook URL
   - Get it from: Netlify Dashboard → Site settings → Build & deploy → Build hooks

### Step 6: Test GitHub Actions (10 minutes)

1. Go to **Actions** tab in your repository
2. Click **Update Data from All Sources**
3. Click **Run workflow** → **Run workflow**
4. Wait for it to complete (~5 minutes)
5. Check the logs for any errors
6. Verify new commit was created with updated data

**Expected Result:**
- Workflow completes successfully (green checkmark)
- New commit appears in your repository
- Data files are updated
- Netlify deployment triggered (if configured)

## 📋 Testing Checklist

### Local Testing
- [ ] HDX API key works
- [ ] Data fetching completes without errors
- [ ] Files are created in `public/data/`
- [ ] JSON files are valid
- [ ] Data contains records from Oct 7, 2023 onwards
- [ ] File sizes are reasonable

### GitHub Actions Testing
- [ ] Workflow runs successfully
- [ ] No rate limiting errors
- [ ] Data is committed to repository
- [ ] Netlify deployment triggered (if configured)
- [ ] No secrets exposed in logs

### Frontend Testing (After Integration)
- [ ] `useRecentData` hook works
- [ ] `useDateRangeData` hook works
- [ ] Date range filtering works correctly
- [ ] Data loads quickly (< 500ms)
- [ ] Offline mode works
- [ ] Cache invalidation works

## 🔄 Integration with Existing Code

### Phase 1: Update Services (Week 1)

Update existing services to use local data first:

```typescript
// src/services/hdxService.ts
import { fetchLocalJSON } from '@/hooks/useLocalData';

export const getCasualties = async () => {
  try {
    // Try local data first
    const data = await fetchLocalJSON('/data/hdx/casualties/recent.json');
    return data;
  } catch (error) {
    // Fallback to API
    return fetchFromAPI();
  }
};
```

### Phase 2: Update Components (Week 2)

Replace API hooks with local data hooks:

```typescript
// Before
import { useCasualtiesDaily } from '@/hooks/useDataFetching';

// After
import { useRecentData } from '@/hooks/useLocalData';

function Dashboard() {
  // Before
  // const { data } = useCasualtiesDaily();
  
  // After
  const { data } = useRecentData('tech4palestine', 'casualties');
  
  return <Chart data={data?.data} />;
}
```

### Phase 3: Add Date Range Filters (Week 3)

Add date range selection to dashboards:

```typescript
import { useDateRange, useDateRangeData } from '@/hooks/useLocalData';

function DashboardWithDateFilter() {
  const { range, setPreset } = useDateRange('LAST_30_DAYS');
  const { data } = useDateRangeData(
    'tech4palestine',
    'casualties',
    range.start,
    range.end
  );
  
  return (
    <>
      <DateRangeSelector range={range} setPreset={setPreset} />
      <Chart data={data} />
    </>
  );
}
```

## 🐛 Troubleshooting Guide

### Problem: GitHub Actions Failing

**Symptoms:**
- Workflow shows red X
- Error in logs about HDX_API_KEY

**Solution:**
```bash
# Check if secret is set
# Go to Settings → Secrets → Actions
# Verify HDX_API_KEY exists

# Test locally first
export HDX_API_KEY='your-key'
npm run fetch-hdx-data
```

### Problem: Rate Limiting Errors

**Symptoms:**
- Error: "429 Too Many Requests"
- HDX API rejecting requests

**Solution:**
```bash
# Check the rate limiting in script
# Should be 1.1 seconds between requests
grep "RATE_LIMIT_DELAY" scripts/fetch-hdx-hapi-data.js

# Increase delay if needed
# Change: const RATE_LIMIT_DELAY = 1100;
# To: const RATE_LIMIT_DELAY = 2000;
```

### Problem: Data Not Loading in Frontend

**Symptoms:**
- Console errors about missing files
- 404 errors for /data/ paths

**Solution:**
```bash
# Check if files exist
ls -la public/data/

# Check if Vite is serving public directory
# Verify vite.config.ts has correct publicDir

# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Problem: Large File Sizes

**Symptoms:**
- Files > 5MB
- Slow loading times

**Solution:**
```bash
# Check file sizes
du -sh public/data/*/*.json

# Consider:
# 1. More aggressive partitioning (monthly instead of quarterly)
# 2. Remove unnecessary fields
# 3. Implement compression (gzip)
```

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] GitHub Actions workflow status (should run every 6 hours)
- [ ] Latest commit has data updates
- [ ] No errors in workflow logs

### Weekly Checks
- [ ] Data freshness (check metadata.json last_updated)
- [ ] File sizes (ensure not growing too large)
- [ ] API key still valid

### Monthly Checks
- [ ] Review data quality
- [ ] Check for missing data
- [ ] Optimize partitioning strategy if needed
- [ ] Update documentation

## 🎯 Success Metrics

### Performance
- [ ] Initial load < 500ms (target: 250ms)
- [ ] Date range query < 1s (target: 400ms)
- [ ] Offline mode works

### Reliability
- [ ] GitHub Actions success rate > 95%
- [ ] Data freshness < 6 hours
- [ ] Zero API rate limit violations

### User Experience
- [ ] Dashboard loads instantly
- [ ] Date filters work smoothly
- [ ] No loading spinners for cached data

## 🚀 Future Enhancements

### Phase 4: Additional Data Sources
- [ ] Good Shepherd Collective integration
- [ ] World Bank economic indicators
- [ ] B'Tselem checkpoint data
- [ ] UNRWA shelter data

### Phase 5: Advanced Features
- [ ] Data compression (gzip)
- [ ] Incremental updates (append only)
- [ ] Data validation checks
- [ ] Quality dashboard
- [ ] Email alerts for failures

### Phase 6: Optimization
- [ ] Monthly partitioning for large datasets
- [ ] Lazy loading for historical data
- [ ] Service Worker caching strategy
- [ ] CDN optimization

## 📚 Resources

### Documentation
- `DATA_INFRASTRUCTURE_README.md` - Complete setup guide
- `DATA_QUICK_REFERENCE.md` - Quick commands
- `DATA_ARCHITECTURE_DIAGRAM.md` - Visual architecture

### External Links
- HDX Platform: https://data.humdata.org
- HDX HAPI Docs: https://hapi.humdata.org
- Tech4Palestine API: https://data.techforpalestine.org
- GitHub Actions Docs: https://docs.github.com/en/actions

### Support
- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For questions and ideas
- Documentation: Check the docs first

## ✅ Final Checklist

Before considering this complete:

- [ ] HDX API key obtained and tested
- [ ] Local data fetch successful
- [ ] Data committed to Git
- [ ] GitHub Secrets configured
- [ ] GitHub Actions workflow tested
- [ ] Netlify deployment verified
- [ ] Frontend hooks tested
- [ ] Documentation reviewed
- [ ] Team members informed
- [ ] Monitoring set up

## 🎉 You're Done When...

1. ✅ GitHub Actions runs successfully every 6 hours
2. ✅ Data is automatically updated and committed
3. ✅ Netlify deploys new data automatically
4. ✅ Frontend loads data from local files
5. ✅ Date range filtering works
6. ✅ Performance targets met (< 500ms)
7. ✅ Offline mode works
8. ✅ No manual intervention needed

---

**Current Status**: 🟡 Implementation Complete - Testing Required

**Next Action**: Get HDX API key and run `./scripts/setup-data-infrastructure.sh`

**Questions?** Check `DATA_INFRASTRUCTURE_README.md` or open an issue.
