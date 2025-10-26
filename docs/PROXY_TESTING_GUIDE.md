# API Proxy Testing Guide

## Understanding the Proxy

The Vite proxy **only works in the browser** when requests are made through the dev server. It does NOT work for Node.js scripts running outside the browser.

## Two Types of Tests

### 1. Proxy Test (Browser-Based) ✅ RECOMMENDED

**What it tests:** The actual proxy configuration in `vite.config.ts`  
**Where it runs:** In the browser through the Vite dev server  
**How to run:**

```
http://localhost:8080/test-proxy.html
```

**Why use this:**
- Tests the actual proxy that your app will use
- Shows if CORS issues are resolved
- Most accurate representation of production behavior

### 2. Direct API Test (Node.js Script)

**What it tests:** Direct access to APIs (bypassing proxy)  
**Where it runs:** In Node.js terminal  
**How to run:**

```bash
npx tsx src/scripts/testApiConnectivity.ts
```

**Why use this:**
- Tests if APIs are accessible at all
- Checks if API URLs are correct
- Identifies if APIs require authentication

**Expected behavior:**
- Some APIs may fail with CORS errors (this is normal)
- Success means the API is reachable and responding
- Failure means the API URL is wrong or API is down

## Testing Workflow

### Step 1: Start Dev Server

```bash
npm run dev
```

Wait for:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

### Step 2: Test in Browser

Open: `http://localhost:8080/test-proxy.html`

Click "Run All Tests"

**Expected Results:**
- ✅ Tech4Palestine endpoints should work
- ✅ Good Shepherd endpoints should work  
- ✅ World Bank endpoints should work
- ✅ UN OCHA should work (no proxy needed)
- ⚠️ B'Tselem may fail (API might not exist or require auth)

### Step 3: Verify in Console

Open browser DevTools console and run:

```javascript
fetch('/api/tech4palestine/v3/summary.json')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Failed:', e));
```

**Success looks like:**
```javascript
Success: {
  gaza: { killed: {...}, injured: {...} },
  west_bank: {...},
  ...
}
```

**Failure looks like:**
```javascript
Failed: TypeError: Failed to fetch
```

## Troubleshooting

### All Tests Fail in Browser

**Problem:** Dev server not running or proxy not configured  
**Solution:**
1. Ensure dev server is running (`npm run dev`)
2. Check `vite.config.ts` has proxy configuration
3. Restart dev server
4. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

### "Invalid URL" Errors in Node Script

**Problem:** Script is trying to use relative URLs  
**Solution:** This is expected - use the browser test instead

### CORS Errors in Browser

**Problem:** Proxy not intercepting requests  
**Solution:**
1. Verify you're using `/api/` prefix
2. Check proxy configuration in `vite.config.ts`
3. Restart dev server

### 404 Errors

**Problem:** Endpoint doesn't exist or URL is wrong  
**Solution:**
1. Check API documentation
2. Verify endpoint path in test
3. Try accessing API directly in browser

### Slow Response Times

**Problem:** Cold start or network latency  
**Solution:**
- First request is always slower
- Subsequent requests should be faster
- Check your internet connection

## What Success Looks Like

### Browser Test Results

```
Test Results:
Total: 10 | ✓ Success: 9 | ✗ Failed: 1 | Success Rate: 90.0%

🎉 Most APIs are working! The proxy is configured correctly.
```

### Console Test

```javascript
fetch('/api/tech4palestine/v3/summary.json')
  .then(r => r.json())
  .then(d => console.log(d));

// Output:
{
  gaza: {
    killed: { total: 43000, children: 13000, women: 9000 },
    injured: { total: 95000 },
    ...
  },
  west_bank: {...},
  last_update: "2024-10-22T..."
}
```

## Next Steps After Successful Test

1. **Re-run Data Audit**
   ```bash
   npx tsx src/scripts/runDataAudit.ts
   ```

2. **Check Updated Reports**
   - `audit-reports/AUDIT_SUMMARY.md` should show operational sources
   - Data gaps should be reduced

3. **Begin Data Integration**
   - Follow `audit-reports/REPLACEMENT_PLAN.md`
   - Start replacing fake data with real API data

## Common Misconceptions

❌ **Wrong:** "The Node.js test script should work with the proxy"  
✅ **Right:** The proxy only works in the browser

❌ **Wrong:** "All APIs must pass the direct test"  
✅ **Right:** CORS failures in direct test are expected and normal

❌ **Wrong:** "I need to configure something for the proxy to work"  
✅ **Right:** The proxy works automatically when dev server is running

## Quick Reference

| Test Type | Command | Tests | Expected |
|-----------|---------|-------|----------|
| Browser Proxy | `http://localhost:8080/test-proxy.html` | Proxy config | Most should pass |
| Console Test | `fetch('/api/...')` in DevTools | Proxy config | Should work |
| Direct API | `npx tsx src/scripts/testApiConnectivity.ts` | API availability | Some CORS failures OK |

## Support

If tests are failing:
1. Verify dev server is running
2. Check browser console for errors
3. Review `vite.config.ts` proxy configuration
4. Consult `docs/API_PROXY_SETUP.md` for detailed troubleshooting
