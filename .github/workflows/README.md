# GitHub Actions Workflows

## Automated Data Updates

This repository uses GitHub Actions to automatically update data every 6 hours.

### How It Works

1. **Schedule**: Runs at 00:00, 06:00, 12:00, 18:00 UTC daily
2. **Fetch Data**: Runs `node scripts/fetch-all-data.js`
3. **Check Changes**: Compares new data with existing data
4. **Commit & Push**: If data changed, commits and pushes to repository
5. **Auto Deploy**: Netlify detects the push and deploys automatically

### Workflow File

- **File**: `.github/workflows/update-data.yml`
- **Trigger**: Every 6 hours + manual trigger
- **Cost**: FREE (GitHub Actions free tier: 2,000 minutes/month)
- **Duration**: ~2-5 minutes per run
- **Monthly Usage**: ~240 minutes (well within free tier)

### Manual Trigger

You can manually trigger the workflow:

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Click "Update Data" workflow
3. Click "Run workflow" button
4. Select branch (usually `main`)
5. Click "Run workflow"

### Monitoring

**View workflow runs:**
- Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- Click on "Update Data" to see all runs
- Click on a specific run to see logs

**What to look for:**
- ✅ Green checkmark = Success
- ❌ Red X = Failed (check logs)
- 🟡 Yellow dot = Running

### Setup Instructions

#### 1. Enable GitHub Actions (if not already enabled)

GitHub Actions should be enabled by default. If not:

1. Go to repository Settings
2. Click "Actions" → "General"
3. Under "Actions permissions", select "Allow all actions and reusable workflows"
4. Click "Save"

#### 2. (Optional) Add HDX API Key

If you want to fetch HDX data, add the API key:

1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `HDX_API_KEY`
5. Value: Your HDX API key
6. Click "Add secret"

**Note**: The workflow works without this - it will just skip HDX data if not provided.

#### 3. Test the Workflow

**Option A: Wait for scheduled run**
- Next run will happen at the next 6-hour interval

**Option B: Trigger manually**
1. Go to Actions tab
2. Click "Update Data"
3. Click "Run workflow"
4. Wait 2-5 minutes
5. Check if data was updated

#### 4. Verify It's Working

After the first run:

1. Check Actions tab for green checkmark
2. Check recent commits for "🤖 Auto-update data"
3. Check Netlify for automatic deployment
4. Visit your site to verify data is current

### Troubleshooting

#### Workflow Not Running

**Check:**
1. GitHub Actions enabled in repository settings
2. Workflow file is in `.github/workflows/` directory
3. File has `.yml` extension
4. No syntax errors in YAML file

**Fix:**
```bash
# Verify file exists
ls -la .github/workflows/update-data.yml

# Check for syntax errors
cat .github/workflows/update-data.yml
```

#### Workflow Fails

**Common issues:**

1. **npm ci fails**
   - Check `package-lock.json` is committed
   - Verify Node.js version (should be 18)

2. **Data collection fails**
   - Check script logs in Actions tab
   - Verify API endpoints are accessible
   - Check for rate limiting

3. **Git push fails**
   - Check repository permissions
   - Verify GITHUB_TOKEN has write access

**View logs:**
1. Go to Actions tab
2. Click on failed run
3. Click on failed step
4. Read error message

#### No Data Changes

If workflow runs but doesn't commit:

**This is normal if:**
- Data sources haven't updated
- No new data available
- Data is identical to previous run

**Check logs:**
- Look for "No data changes detected"
- This means workflow is working correctly

### Customization

#### Change Schedule

Edit `.github/workflows/update-data.yml`:

```yaml
# Every 3 hours
- cron: '0 */3 * * *'

# Every 12 hours
- cron: '0 */12 * * *'

# Daily at midnight UTC
- cron: '0 0 * * *'

# Every Monday at 9 AM UTC
- cron: '0 9 * * 1'
```

**Cron syntax:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

**Tool**: Use https://crontab.guru/ to generate cron expressions

#### Add Notifications

Add Slack/Discord notifications on failure:

```yaml
# Add after the last step
- name: Notify on failure
  if: failure()
  run: |
    curl -X POST YOUR_WEBHOOK_URL \
      -H 'Content-Type: application/json' \
      -d '{"text":"Data update failed!"}'
```

#### Run on Specific Days

Only run on weekdays:

```yaml
on:
  schedule:
    - cron: '0 */6 * * 1-5'  # Monday to Friday
```

### Cost Analysis

**GitHub Actions Free Tier:**
- 2,000 minutes/month for public repositories
- Unlimited for public repositories (if you enable it)

**This Workflow:**
- Runs: 4 times/day × 30 days = 120 runs/month
- Duration: ~2 minutes/run
- Total: ~240 minutes/month
- **Cost: FREE** ✅

**Comparison:**
- GitHub Actions: FREE
- Netlify Build Plugin: Uses build minutes (limited)
- Manual updates: Your time (expensive)

### Benefits

✅ **Automated**: No manual intervention needed
✅ **Scheduled**: Runs every 6 hours automatically
✅ **Free**: Within GitHub Actions free tier
✅ **Reliable**: Separate from site deployment
✅ **Flexible**: Can trigger manually anytime
✅ **Transparent**: Full logs available
✅ **Smart**: Only commits if data changed

### Alternative: Netlify Build Plugin

If you prefer Netlify Build Plugin instead:

**Pros:**
- Runs on every deploy
- Always fresh data

**Cons:**
- Increases build time by 2-5 minutes
- Uses Netlify build minutes
- Build fails if data collection fails
- No scheduled updates (only on deploy)

**Setup:**
See `DEPLOYMENT_CHECKLIST.md` for Netlify plugin instructions.

### Support

**Issues?**
1. Check Actions tab for error logs
2. Review this README
3. Check `DEPLOYMENT_CHECKLIST.md`
4. Review `QUESTIONS_ANSWERED.md`

**Need help?**
- Open an issue in the repository
- Check GitHub Actions documentation
- Review workflow logs

---

**Last Updated**: 2025-10-24
**Status**: ✅ Active
**Next Run**: Check Actions tab
