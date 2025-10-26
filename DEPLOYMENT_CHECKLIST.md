# Deployment Checklist

## Before Every Deployment

### 1. Update Data (REQUIRED)

```bash
# Run data collection
node scripts/fetch-all-data.js

# Verify data was collected
ls -lh public/data/

# Check summary report
cat public/data/data-collection-summary.json
```

**Expected output:**
- ✅ All scripts completed successfully
- ✅ Data files in `public/data/hdx/`, `public/data/goodshepherd/`, etc.
- ✅ Summary report shows datasets, records, and storage size
- ✅ No critical errors in the report

---

### 2. Verify Data Quality

```bash
# Check manifest
cat public/data/manifest.json

# Verify recent files exist
ls public/data/tech4palestine/casualties/recent.json
ls public/data/goodshepherd/healthcare/recent.json

# Check indexes
ls public/data/*/*/index.json
```

---

### 3. Test Locally

```bash
# Build the app
npm run build

# Test the build
npm run preview

# Or run dev server
npm run dev
```

**Test checklist:**
- [ ] Gaza War Dashboard loads
- [ ] West Bank Dashboard loads
- [ ] All metrics display data
- [ ] No console errors
- [ ] Charts render correctly
- [ ] Help panels work

---

### 4. Commit Data Files

```bash
# Stage data files
git add public/data/

# Commit with timestamp
git commit -m "Update data: $(date '+%Y-%m-%d %H:%M')"

# Also commit any code changes
git add -A
git commit -m "Your commit message"
```

---

### 5. Push to Deploy

```bash
# Push to main branch
git push origin main
```

**Netlify will automatically:**
1. Detect the push
2. Run `npm run build`
3. Deploy to production
4. Update the live site

---

## Deployment Verification

### After Deployment (5-10 minutes)

1. **Check Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Verify build succeeded
   - Check build logs for errors

2. **Test Live Site**
   - Visit: https://www.palboard.net
   - Test Gaza War Dashboard
   - Test West Bank Dashboard
   - Verify data is current
   - Check browser console for errors

3. **Verify Data Freshness**
   - Check "Last Updated" timestamps
   - Verify recent data is showing
   - Compare with local data

---

## Troubleshooting

### Build Failed on Netlify

**Check:**
1. Build logs in Netlify dashboard
2. TypeScript errors
3. Missing dependencies
4. Environment variables

**Fix:**
```bash
# Test build locally
npm run build

# Fix any errors
# Commit and push again
```

---

### Dashboard Shows Old Data

**Cause:** Data files not committed

**Fix:**
```bash
# Run data collection
node scripts/fetch-all-data.js

# Commit data files
git add public/data/
git commit -m "Update data"
git push
```

---

### Dashboard Shows No Data

**Cause:** Data files missing or corrupted

**Fix:**
```bash
# Delete old data
rm -rf public/data/hdx public/data/goodshepherd public/data/worldbank public/data/tech4palestine

# Re-run data collection
node scripts/fetch-all-data.js

# Verify data exists
ls -lh public/data/

# Commit and push
git add public/data/
git commit -m "Rebuild data"
git push
```

---

### API Fallback Being Used

**Symptoms:**
- Console shows "Trying API endpoint"
- Slower load times
- CORS errors

**Cause:** Local data files missing

**Fix:**
```bash
# Ensure data files are in public/data/
ls public/data/

# If missing, run data collection
node scripts/fetch-all-data.js

# Commit and deploy
git add public/data/
git commit -m "Add missing data files"
git push
```

---

## Automated Deployment (Future)

### Option 1: GitHub Actions

Create `.github/workflows/update-data.yml`:

```yaml
name: Update Data

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

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

---

### Option 2: Netlify Build Plugin

Create `netlify/plugins/fetch-data/index.js`:

```javascript
module.exports = {
  onPreBuild: async ({ utils }) => {
    await utils.run.command('node scripts/fetch-all-data.js');
  }
};
```

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "./netlify/plugins/fetch-data"
```

---

## Quick Reference

### Essential Commands

```bash
# Update data
node scripts/fetch-all-data.js

# Build app
npm run build

# Test locally
npm run dev

# Deploy
git add -A
git commit -m "Update"
git push
```

---

### File Locations

```
public/data/                          # All data files (MUST commit)
├── hdx/                              # HDX datasets
├── goodshepherd/                     # Good Shepherd data
├── worldbank/                        # World Bank indicators
├── tech4palestine/                   # Tech4Palestine data
├── manifest.json                     # Global manifest
└── data-collection-summary.json      # Collection report
```

---

### Important URLs

- **Live Site**: https://www.palboard.net
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub Repo**: [Your repo URL]
- **Data Sources**:
  - HDX: https://data.humdata.org
  - Good Shepherd: https://goodshepherdcollective.org
  - World Bank: https://api.worldbank.org
  - Tech4Palestine: https://data.techforpalestine.org

---

## Data Update Schedule

### Recommended Frequency

- **Tech4Palestine**: Every 6 hours (casualties update frequently)
- **Good Shepherd**: Daily (less frequent updates)
- **World Bank**: Weekly (economic data changes slowly)
- **HDX**: Weekly (humanitarian data varies)

### Manual Update Process

```bash
# Morning update
node scripts/fetch-all-data.js
git add public/data/
git commit -m "Morning data update"
git push

# Evening update
node scripts/fetch-all-data.js
git add public/data/
git commit -m "Evening data update"
git push
```

---

## Notes

- **Always** run data collection before deploying
- **Always** commit data files in `public/data/`
- **Never** commit `node_modules/` or `dist/`
- **Test** locally before pushing
- **Monitor** Netlify build logs
- **Verify** live site after deployment

---

## Support

If you encounter issues:

1. Check this checklist
2. Review build logs
3. Test locally
4. Check browser console
5. Review data collection summary report
6. Verify data files exist

---

**Last Updated**: 2025-10-24
