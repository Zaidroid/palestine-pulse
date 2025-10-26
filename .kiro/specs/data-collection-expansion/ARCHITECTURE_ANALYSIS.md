# Architecture Analysis & Cleanup Recommendations

## Executive Summary

Based on comprehensive analysis of your codebase, here are the answers to your questions:

### 1. ✅ YES - Dashboard uses local JSON files with API fallback

Your dashboard **correctly** uses the unified data system:
- **Primary**: Fetches from `/data/{source}/{dataset}/*.json` (local files)
- **Fallback**: Uses API endpoints if local files unavailable
- **Implementation**: `useUnifiedData` hook in `src/hooks/useUnifiedData.ts`

### 2. ⚠️ MIXED - Multiple data fetching systems exist (needs consolidation)

You have **THREE** data fetching systems running in parallel:
1. **✅ useUnifiedData** (NEW - correct pattern)
2. **⚠️ apiOrchestrator** (OLD - still used by some services)
3. **⚠️ dataConsolidationService** (LEGACY - complex, partially obsolete)

### 3. 🗑️ Obsolete files that can be deleted

Several files are now obsolete after implementing the new data collection system.

### 4. ⚠️ NO - Pushing changes requires running data collection first

Your dashboard will **NOT** automatically update without running the data collection scripts.

---

## Detailed Analysis

## 1. Current Data Flow Architecture

### ✅ CORRECT: Dashboard Components → useUnifiedData Hook

Your dashboard pages correctly use the unified data pattern:

```typescript
// src/pages/v3/GazaWarDashboard.tsx
import { useRecentData, useSingleData } from "@/hooks/useUnifiedData";

// Example usage:
const { data: casualties } = useRecentData(
  'tech4palestine',
  'casualties',
  '/api/tech4palestine/v2/casualties_daily.json' // Fallback API
);
```

**How it works:**
1. Tries to fetch from `/data/tech4palestine/casualties/recent.json`
2. If not found, falls back to API endpoint
3. Caches result for 5 minutes
4. Handles errors gracefully

**This is the CORRECT pattern and should be used everywhere.**

---

## 2. Multiple Data Fetching Systems (Problem)

### System 1: ✅ useUnifiedData (NEW - Keep This)

**Location**: `src/hooks/useUnifiedData.ts`

**Purpose**: Simple, direct data loading
- Local files first
- API fallback
- React Query caching
- Clean, predictable

**Used by**:
- Gaza War Dashboard
- West Bank Dashboard
- Most new components

**Status**: ✅ **KEEP - This is the correct pattern**

---

### System 2: ⚠️ apiOrchestrator (OLD - Partially Obsolete)

**Location**: `src/services/apiOrchestrator.ts`

**Purpose**: Complex API orchestration with:
- Multiple source management
- Rate limiting
- Retry logic
- Cache management
- Fallback chains

**Used by**:
- `dataConsolidationService.ts`
- `dataSourceVerificationService.ts`
- `systemIntegrationTestingService.ts`
- `monitoringAlertingService.ts`
- `deploymentService.ts`

**Problem**: 
- Adds unnecessary complexity
- Duplicates functionality of useUnifiedData
- Makes API calls instead of using local files
- Harder to maintain

**Status**: ⚠️ **PARTIALLY OBSOLETE**

**Recommendation**: 
- Keep for monitoring/testing services
- Remove from data loading path
- Dashboard should NOT use this

---

### System 3: ⚠️ dataConsolidationService (LEGACY - Mostly Obsolete)

**Location**: `src/services/dataConsolidationService.ts`

**Purpose**: V3 data consolidation with:
- Dynamic data ingestion
- Real-time consolidation
- IndexedDB caching
- Complex source mapping

**Used by**:
- Gaza War Dashboard (initialization only)
- West Bank Dashboard (initialization only)
- v3Store

**Problem**:
- 700+ lines of complex code
- Tries to fetch from APIs using apiOrchestrator
- Duplicates what useUnifiedData does
- Most functionality unused

**Status**: ⚠️ **MOSTLY OBSOLETE**

**Recommendation**: 
- Remove initialization calls from dashboards
- Dashboards should ONLY use useUnifiedData
- Keep only if needed for analytics/monitoring

---

## 3. Files That Can Be Deleted

### 🗑️ Obsolete Data Files (src/data/)

These are old hardcoded data files that are no longer used:

```
src/data/btselem-checkpoints.json          ❌ DELETE
src/data/demolitions-pre.json              ❌ DELETE
src/data/killedbyciv-pre.json              ❌ DELETE
src/data/maindata-pre.json                 ❌ DELETE
src/data/minors-pre.json                   ❌ DELETE
src/data/psbyps-pre.json                   ❌ DELETE
src/data/spi-pre.json                      ❌ DELETE
src/data/womein-pre.json                   ❌ DELETE
```

**Keep**:
```
src/data/help-content.tsx                  ✅ KEEP (used by dashboards)
src/data/help-content-*.md                 ✅ KEEP (documentation)
```

### ⚠️ Potentially Obsolete Services

These services may be obsolete depending on your needs:

```
src/services/dataConsolidationService.ts   ⚠️ REVIEW (700+ lines, mostly unused)
src/services/dataCombinator.ts             ⚠️ REVIEW (if exists)
src/services/dataSourceVerificationService.ts  ⚠️ KEEP (useful for monitoring)
src/services/systemIntegrationTestingService.ts ⚠️ KEEP (useful for testing)
```

### 🔍 How to Verify Before Deleting

Run this command to check if files are imported:

```bash
# Check if a file is imported anywhere
grep -r "demolitions-pre" src/
grep -r "maindata-pre" src/
grep -r "dataConsolidationService" src/
```

---

## 4. Deployment & Automatic Updates

### ⚠️ Current State: Manual Data Collection Required

**What happens when you push to Git:**

1. ✅ Netlify detects changes
2. ✅ Runs `npm run build`
3. ✅ Builds React app
4. ✅ Deploys to production
5. ❌ **Does NOT run data collection scripts**

**Result**: Dashboard will use **old data** from last manual collection.

---

### 🔧 What You Need to Do

#### Option A: Manual Data Collection (Current)

**Before pushing to Git:**

```bash
# 1. Run data collection locally
node scripts/fetch-all-data.js

# 2. Verify data was collected
ls -lh public/data/

# 3. Commit the data files
git add public/data/
git commit -m "Update data: $(date)"

# 4. Push to Git
git push
```

**Pros**: 
- Simple
- You control when data updates
- Can verify data before deploying

**Cons**:
- Manual process
- Easy to forget
- Data can become stale

---

#### Option B: Automated Data Collection (Recommended)

**Setup GitHub Actions to run data collection:**

Create `.github/workflows/update-data.yml`:

```yaml
name: Update Data

on:
  schedule:
    # Run every 6 hours
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run data collection
        run: node scripts/fetch-all-data.js
        env:
          HDX_API_KEY: ${{ secrets.HDX_API_KEY }}
      
      - name: Commit and push if changed
        run: |
          git config --global user.name 'Data Bot'
          git config --global user.email 'bot@palboard.net'
          git add public/data/
          git diff --quiet && git diff --staged --quiet || (git commit -m "Auto-update data: $(date)" && git push)
```

**Pros**:
- Fully automated
- Data always fresh
- Runs on schedule
- Can trigger manually

**Cons**:
- Requires GitHub Actions setup
- Uses GitHub Actions minutes
- More complex

---

#### Option C: Netlify Build Plugin (Alternative)

Create `netlify/plugins/fetch-data/index.js`:

```javascript
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('Fetching latest data...');
    
    try {
      await utils.run.command('node scripts/fetch-all-data.js');
      console.log('✅ Data collection complete');
    } catch (error) {
      console.error('❌ Data collection failed:', error);
      // Don't fail the build, use existing data
    }
  }
};
```

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "./netlify/plugins/fetch-data"
```

**Pros**:
- Runs on every deploy
- Always fresh data
- No GitHub Actions needed

**Cons**:
- Increases build time
- May hit API rate limits
- Build fails if data collection fails

---

## Recommended Action Plan

### Phase 1: Immediate Cleanup (Low Risk)

1. **Delete obsolete data files**:
   ```bash
   rm src/data/*-pre.json
   rm src/data/btselem-checkpoints.json
   ```

2. **Verify nothing breaks**:
   ```bash
   npm run build
   npm run dev
   ```

3. **Commit cleanup**:
   ```bash
   git add -A
   git commit -m "Remove obsolete hardcoded data files"
   ```

---

### Phase 2: Simplify Data Loading (Medium Risk)

1. **Remove dataConsolidationService initialization from dashboards**:

   ```typescript
   // src/pages/v3/GazaWarDashboard.tsx
   // REMOVE:
   import { dataConsolidationService } from "@/services/dataConsolidationService";
   
   useEffect(() => {
     const initializeData = async () => {
       await dataConsolidationService.initialize(); // ❌ REMOVE THIS
       fetchConsolidatedData();
     };
     initializeData();
   }, []);
   
   // KEEP ONLY:
   // Components already use useUnifiedData hooks
   ```

2. **Test thoroughly**:
   ```bash
   npm run dev
   # Test all dashboard features
   ```

3. **Commit changes**:
   ```bash
   git add -A
   git commit -m "Simplify data loading - use only useUnifiedData"
   ```

---

### Phase 3: Setup Automated Data Collection (Recommended)

1. **Choose automation method** (Option B or C above)

2. **Test locally first**:
   ```bash
   node scripts/fetch-all-data.js
   ```

3. **Setup automation**

4. **Monitor first few runs**

---

### Phase 4: Remove Obsolete Services (Optional)

**Only after Phase 1-3 are stable:**

1. Review usage of:
   - `dataConsolidationService.ts`
   - `apiOrchestrator.ts` (keep for monitoring)

2. Remove if truly unused

3. Update imports

---

## Summary of Recommendations

### ✅ DO THIS NOW:

1. **Delete obsolete data files** in `src/data/*-pre.json`
2. **Run data collection before deploying**:
   ```bash
   node scripts/fetch-all-data.js
   git add public/data/
   git commit -m "Update data"
   git push
   ```

### ⚠️ DO THIS SOON:

1. **Setup automated data collection** (GitHub Actions or Netlify plugin)
2. **Remove dataConsolidationService initialization** from dashboards
3. **Document the unified data pattern** for future development

### 🔍 INVESTIGATE:

1. **Review apiOrchestrator usage** - keep for monitoring, remove from data path
2. **Review dataConsolidationService** - remove if unused
3. **Audit all data fetching** - ensure everything uses useUnifiedData

---

## Current Data Flow (Correct)

```
Dashboard Component
    ↓
useUnifiedData Hook
    ↓
Try: /data/{source}/{dataset}/*.json (LOCAL FILES) ✅
    ↓ (if fails)
Fallback: API endpoint ⚠️
    ↓
React Query Cache
    ↓
Component renders with data
```

---

## Questions?

### Q: Will my dashboard work after pushing?

**A**: Only if you commit the data files from `public/data/` first.

### Q: Do I need to run data collection every time?

**A**: Yes, unless you setup automation (recommended).

### Q: Can I delete apiOrchestrator?

**A**: Not yet - it's used by monitoring services. Remove from data loading path first.

### Q: What's the simplest deployment process?

**A**: 
1. Run `node scripts/fetch-all-data.js`
2. Commit data files
3. Push to Git
4. Netlify auto-deploys

---

## Next Steps

1. ✅ Delete obsolete data files (safe)
2. ✅ Run data collection before next deploy
3. ⚠️ Setup automated data collection (recommended)
4. ⚠️ Simplify data loading (remove dataConsolidationService)
5. 📝 Document the process for your team
