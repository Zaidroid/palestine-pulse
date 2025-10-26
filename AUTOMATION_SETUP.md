# Automated Data Updates - Setup Guide

## 🎯 Goal

Automatically update your dashboard data every 6 hours without manual intervention.

## ✅ Solution: GitHub Actions (FREE)

**Why GitHub Actions?**
- ✅ Completely FREE (2,000 min/month)
- ✅ Runs on schedule (every 6 hours)
- ✅ Can trigger manually anytime
- ✅ Doesn't slow down deployments
- ✅ Separate from Netlify builds
- ✅ Full logs and monitoring

**Cost**: $0/month (uses ~240 minutes of 2,000 free minutes)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Commit the Workflow File

The workflow file is already created at `.github/workflows/update-data.yml`

```bash
# Commit the workflow
git add .github/
git commit -m "Add automated data updates workflow"
git push
```

### Step 2: Verify It's Working

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You should see "Update Data" workflow listed

### Step 3: Test It Manually

1. In the Actions tab, click "Update Data"
2. Click "Run workflow" button (top right)
3. Select `main` branch
4. Click "Run workflow"
5. Wait 2-5 minutes
6. Check if it completed successfully (green checkmark)

### Step 4: Check the Results

1. Go to your repository's main page
2. Look for a new commit: "🤖 Auto-update data: [timestamp]"
3. Check Netlify dashboard - it should auto-deploy
4. Visit your site - data should be updated

---

## 📅 Schedule

**Automatic runs:**
- 00:00 UTC (midnight)
- 06:00 UTC (6 AM)
- 12:00 UTC (noon)
- 18:00 UTC (6 PM)

**Manual runs:**
- Anytime via Actions tab

---

## 🔧 Configuration

### (Optional) Add HDX API Key

If you want to fetch HDX data:

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `HDX_API_KEY`
5. Value: Your HDX API key
6. Click **Add secret**

**Note**: Works without this - just skips HDX data if not provided.

---

## 📊 Monitoring

### View Workflow Runs

**URL**: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

**What you'll see:**
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow dot = Running
- ⚪ Gray circle = Queued

### Check Logs

1. Go to Actions tab
2. Click on a workflow run
3. Click on "update-data" job
4. Expand steps to see detailed logs

### What to Look For

**Successful run:**
```
✅ Data updated and pushed to repository
📊 Netlify will automatically deploy the changes
```

**No changes:**
```
ℹ️ No data changes - skipping commit
```

**Failed run:**
- Check error message in logs
- Common issues: API rate limits, network errors
- Workflow will retry on next scheduled run

---

## 🎛️ Customization

### Change Schedule

Edit `.github/workflows/update-data.yml`:

```yaml
# Current: Every 6 hours
- cron: '0 */6 * * *'

# Every 3 hours (more frequent)
- cron: '0 */3 * * *'

# Every 12 hours (less frequent)
- cron: '0 */12 * * *'

# Daily at midnight UTC
- cron: '0 0 * * *'

# Twice daily (9 AM and 9 PM UTC)
- cron: '0 9,21 * * *'
```

**Tool**: Use https://crontab.guru/ to create custom schedules

### Disable Automatic Updates

**Option 1: Disable workflow**
1. Go to Actions tab
2. Click "Update Data"
3. Click "..." menu (top right)
4. Click "Disable workflow"

**Option 2: Delete workflow file**
```bash
git rm .github/workflows/update-data.yml
git commit -m "Disable automated data updates"
git push
```

### Re-enable Automatic Updates

1. Go to Actions tab
2. Click "Update Data"
3. Click "Enable workflow"

---

## 🆚 Comparison: GitHub Actions vs Netlify Plugin

| Feature | GitHub Actions | Netlify Plugin |
|---------|---------------|----------------|
| **Cost** | FREE | Uses build minutes |
| **Schedule** | Every 6 hours | Only on deploy |
| **Build Time** | No impact | +2-5 minutes |
| **Flexibility** | High | Limited |
| **Reliability** | Independent | Coupled with build |
| **Setup** | One file | More complex |
| **Recommendation** | ✅ **Use This** | ⚠️ Alternative |

---

## 🐛 Troubleshooting

### Workflow Not Running

**Check:**
1. Workflow file exists: `.github/workflows/update-data.yml`
2. File is committed and pushed
3. GitHub Actions enabled in repository settings

**Fix:**
```bash
# Verify file
ls -la .github/workflows/update-data.yml

# If missing, it wasn't committed
git add .github/
git commit -m "Add workflow"
git push
```

### Workflow Fails

**Common Issues:**

1. **npm ci fails**
   - Ensure `package-lock.json` is committed
   - Check Node.js version in workflow (should be 18)

2. **Data collection fails**
   - Check API endpoints are accessible
   - Look for rate limiting errors
   - Verify script works locally: `node scripts/fetch-all-data.js`

3. **Git push fails**
   - Check repository permissions
   - Verify GITHUB_TOKEN has write access

**View Error:**
1. Go to Actions tab
2. Click failed run
3. Click failed step
4. Read error message

### No Commits Being Made

**This is normal if:**
- Data hasn't changed since last run
- All APIs returned same data
- No new records available

**Verify:**
- Check workflow logs for "No data changes detected"
- This means workflow is working correctly
- It only commits when data actually changes

### Data Not Updating on Site

**Check:**
1. Workflow completed successfully (green checkmark)
2. New commit exists with "🤖 Auto-update data"
3. Netlify detected the commit and deployed
4. Netlify build succeeded

**Fix:**
1. Check Netlify dashboard for build status
2. Verify `public/data/` files were updated in commit
3. Clear browser cache and reload site

---

## 📈 Usage Statistics

**Expected Usage:**
- Runs per day: 4
- Runs per month: ~120
- Duration per run: 2-5 minutes
- Total minutes per month: ~240 minutes

**GitHub Free Tier:**
- Public repos: 2,000 minutes/month
- Your usage: ~240 minutes/month (12%)
- **Remaining: ~1,760 minutes/month** ✅

---

## 🎉 Benefits

### Before Automation
- ❌ Manual data updates required
- ❌ Easy to forget
- ❌ Data becomes stale
- ❌ Time-consuming

### After Automation
- ✅ Automatic updates every 6 hours
- ✅ Always fresh data
- ✅ No manual intervention
- ✅ Reliable and consistent
- ✅ Full audit trail
- ✅ Can trigger manually anytime

---

## 📝 Next Steps

### 1. ✅ Commit and Push

```bash
git add .github/
git commit -m "Add automated data updates"
git push
```

### 2. ✅ Test Manually

1. Go to Actions tab
2. Run workflow manually
3. Verify it works

### 3. ✅ Monitor First Few Runs

- Check Actions tab daily for first week
- Verify data is updating
- Check Netlify deployments

### 4. ✅ Relax

Your data will now update automatically every 6 hours! 🎉

---

## 🔗 Resources

- **Workflow File**: `.github/workflows/update-data.yml`
- **Workflow README**: `.github/workflows/README.md`
- **Deployment Guide**: `DEPLOYMENT_CHECKLIST.md`
- **Architecture**: `.kiro/specs/data-collection-expansion/ARCHITECTURE_ANALYSIS.md`

---

## 💡 Tips

1. **Monitor first week**: Check Actions tab daily to ensure it's working
2. **Check Netlify**: Verify automatic deployments are triggered
3. **Browser cache**: Clear cache to see latest data
4. **Manual trigger**: Use when you need immediate update
5. **Logs are your friend**: Check logs if something seems wrong

---

## ❓ FAQ

**Q: Will this cost money?**
A: No, it's completely free within GitHub's free tier.

**Q: Can I change the schedule?**
A: Yes, edit the cron expression in the workflow file.

**Q: What if it fails?**
A: It will retry on the next scheduled run. Check logs for errors.

**Q: Can I disable it?**
A: Yes, disable the workflow in the Actions tab.

**Q: Does it slow down my site?**
A: No, it runs separately from your site deployment.

**Q: What if data doesn't change?**
A: It won't create a commit. This is normal and expected.

**Q: Can I run it manually?**
A: Yes, use the "Run workflow" button in the Actions tab.

---

**Setup Time**: 5 minutes
**Cost**: $0/month
**Maintenance**: None
**Status**: ✅ Ready to use

---

**Last Updated**: 2025-10-24
