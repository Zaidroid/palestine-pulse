# Your Questions Answered

## 1. Does all my dashboard use the stored fetched data JSON files with API as fallback?

### ✅ YES - Your dashboard correctly uses local files first

**How it works:**

```typescript
// Your dashboards use this pattern:
const { data } = useRecentData(
  'tech4palestine',
  'casualties',
  '/api/tech4palestine/v2/casualties_daily.json' // Fallback
);
```

**Data flow:**
1. **First**: Tries `/data/tech4palestine/casualties/recent.json` (local file)
2. **Fallback**: Uses API endpoint if local file not found
3. **Cache**: React Query caches for 5 minutes

**Verification:**
- Open browser console
- Look for: `"🔍 Trying local data: /data/..."`
- If successful: `"✅ Loaded from local data"`
- If failed: `"📡 Fetching from API"`

**Files used:**
- `src/hooks/useUnifiedData.ts` - Main hook
- `src/pages/v3/GazaWarDashboard.tsx` - Uses the hook
- `src/pages/v3/WestBankDashboard.tsx` - Uses the hook

---

## 2. I don't understand the use of apiOrchestrator and dataCombinator and all other middle functions

### ⚠️ You have THREE data systems (needs simplification)

#### System 1: ✅ useUnifiedData (CORRECT - Keep)

**What it does:**
- Simple: Try local file → fallback to API
- Clean code
- Easy to understand

**Used by:**
- Your dashboards ✅
- All new components ✅

**Status:** **KEEP THIS - It's the right way**

---

#### System 2: ⚠️ apiOrchestrator (OLD - Partially obsolete)

**What it does:**
- Complex API management
- Rate limiting
- Retry logic
- Multiple source fallbacks

**Used by:**
- Monitoring services
- Testing services
- ~~Data loading~~ (should NOT be used for this)

**Problem:**
- Makes API calls instead of using local files
- Adds unnecessary complexity
- Duplicates useUnifiedData functionality

**Status:** **KEEP for monitoring, REMOVE from data loading**

---

#### System 3: ⚠️ dataConsolidationService (LEGACY - Mostly obsolete)

**What it does:**
- 700+ lines of complex code
- Tries to consolidate data from multiple sources
- Uses apiOrchestrator internally
- IndexedDB caching

**Used by:**
- Dashboard initialization (unnecessary)
- v3Store (partially)

**Problem:**
- Your dashboards don't need it
- useUnifiedData does the same thing better
- Makes things complicated

**Status:** **MOSTLY OBSOLETE - Can be removed**

---

### 🎯 Simplified Explanation

**What you SHOULD have (and mostly do):**

```
Dashboard Component
    ↓
useUnifiedData Hook
    ↓
Local JSON file (/data/...)
    ↓ (if missing)
API fallback
```

**What you ALSO have (unnecessary):**

```
Dashboard Component
    ↓
dataConsolidationService
    ↓
apiOrchestrator
    ↓
Complex logic
    ↓
API calls
```

**Recommendation:** Remove the second path, keep only the first.

---

## 3. What is obsolete now and can be deleted?

### 🗑️ Safe to Delete NOW

#### Old Data Files (src/data/)

```bash
# These are hardcoded data files no longer used:
src/data/btselem-checkpoints.json      ❌ DELETE
src/data/demolitions-pre.json          ❌ DELETE
src/data/killedbyciv-pre.json          ❌ DELETE
src/data/maindata-pre.json             ❌ DELETE
src/data/minors-pre.json               ❌ DELETE
src/data/psbyps-pre.json               ❌ DELETE
src/data/spi-pre.json                  ❌ DELETE
src/data/womein-pre.json               ❌ DELETE
```

**How to delete:**

```bash
# Option 1: Use the cleanup script
chmod +x scripts/cleanup-obsolete-files.sh
./scripts/cleanup-obsolete-files.sh

# Option 2: Manual deletion
rm src/data/*-pre.json
rm src/data/btselem-checkpoints.json
```

---

### ⚠️ Review Before Deleting

#### Services That May Be Obsolete

1. **dataConsolidationService.ts** (700+ lines)
   - Used by: Dashboard initialization
   - Recommendation: Remove initialization calls from dashboards
   - Keep if: You use it for analytics/monitoring

2. **apiOrchestrator.ts** (600+ lines)
   - Used by: Monitoring and testing services
   - Recommendation: Keep for monitoring, remove from data loading
   - Don't delete: Still used by other services

---

### ✅ Keep These

```
src/hooks/useUnifiedData.ts            ✅ KEEP (main data hook)
src/data/help-content.tsx              ✅ KEEP (used by dashboards)
scripts/fetch-all-data.js              ✅ KEEP (data collection)
scripts/fetch-hdx-ckan-data.js         ✅ KEEP (data collection)
scripts/fetch-goodshepherd-data.js     ✅ KEEP (data collection)
scripts/fetch-worldbank-data.js        ✅ KEEP (data collection)
```

---

## 4. Does pushing changes guarantee automatically updated dashboard?

### ❌ NO - You must run data collection first

**What happens when you push:**

```
1. Git push
2. Netlify detects change
3. Runs: npm run build
4. Builds React app
5. Deploys to production
6. ❌ Does NOT run data collection scripts
```

**Result:** Dashboard uses **old data** from last manual collection.

---

### ✅ Correct Deployment Process

**BEFORE pushing to Git:**

```bash
# 1. Run data collection
node scripts/fetch-all-data.js

# 2. Verify data was collected
ls -lh public/data/
cat public/data/data-collection-summary.json

# 3. Commit data files
git add public/data/
git commit -m "Update data: $(date)"

# 4. Push to Git
git push
```

**Now Netlify will:**
1. Build your app
2. Include the updated data files
3. Deploy with fresh data ✅

---

### 🤖 Automated Solution (Recommended)

**Option A: GitHub Actions (Recommended)**

Create `.github/workflows/update-data.yml`:

```yaml
name: Update Data

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:        # Manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: node scripts/fetch-all-data.js
      - run: |
          git config user.name 'Data Bot'
          git config user.email 'bot@palboard.net'
          git add public/data/
          git diff --quiet || (git commit -m "Auto-update data" && git push)
```

**Benefits:**
- ✅ Runs automatically every 6 hours
- ✅ Can trigger manually
- ✅ Commits and pushes data
- ✅ Triggers Netlify deployment
- ✅ Always fresh data

---

**Option B: Netlify Build Plugin**

Create `netlify/plugins/fetch-data/index.js`:

```javascript
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('Fetching latest data...');
    await utils.run.command('node scripts/fetch-all-data.js');
  }
};
```

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "./netlify/plugins/fetch-data"
```

**Benefits:**
- ✅ Runs on every deploy
- ✅ Always fresh data
- ✅ No GitHub Actions needed

**Drawbacks:**
- ⚠️ Increases build time (2-5 minutes)
- ⚠️ May hit API rate limits
- ⚠️ Build fails if data collection fails

---

## Summary & Action Items

### ✅ What's Working

1. Your dashboards correctly use local JSON files
2. API fallback works when local files missing
3. Data collection scripts work perfectly
4. All data is properly partitioned and indexed

### ⚠️ What Needs Attention

1. **Manual data collection required before deploy**
   - Run `node scripts/fetch-all-data.js`
   - Commit `public/data/`
   - Then push

2. **Multiple data systems exist**
   - Keep: useUnifiedData
   - Review: apiOrchestrator (keep for monitoring)
   - Remove: dataConsolidationService initialization

3. **Obsolete files can be deleted**
   - Run: `./scripts/cleanup-obsolete-files.sh`
   - Or manually delete `src/data/*-pre.json`

### 🎯 Immediate Action Plan

**Step 1: Clean up obsolete files (5 minutes)**
```bash
./scripts/cleanup-obsolete-files.sh
npm run build  # Verify nothing breaks
git add -A
git commit -m "Remove obsolete data files"
```

**Step 2: Update data before next deploy (2-5 minutes)**
```bash
node scripts/fetch-all-data.js
git add public/data/
git commit -m "Update data: $(date)"
git push
```

**Step 3: Setup automation (30 minutes)**
- Choose GitHub Actions or Netlify plugin
- Follow setup instructions above
- Test with manual trigger
- Monitor first few runs

**Step 4: Simplify data loading (optional, 1 hour)**
- Remove dataConsolidationService initialization from dashboards
- Test thoroughly
- Commit changes

---

## Quick Reference

### Essential Commands

```bash
# Update data
node scripts/fetch-all-data.js

# Clean up obsolete files
./scripts/cleanup-obsolete-files.sh

# Build and test
npm run build
npm run dev

# Deploy
git add -A
git commit -m "Update"
git push
```

### Important Files

```
public/data/                    # All data (MUST commit)
src/hooks/useUnifiedData.ts     # Main data hook (KEEP)
scripts/fetch-all-data.js       # Data collection (KEEP)
DEPLOYMENT_CHECKLIST.md         # Deployment guide (NEW)
```

### Documentation

- **Architecture Analysis**: `.kiro/specs/data-collection-expansion/ARCHITECTURE_ANALYSIS.md`
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **This Document**: `.kiro/specs/data-collection-expansion/QUESTIONS_ANSWERED.md`

---

**Need Help?** Review the detailed architecture analysis document for more information.
