# API Proxy Setup - Quick Start

## ✅ What Was Done

The Vite proxy configuration has been set up to route API requests through the development server, bypassing CORS restrictions.

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8080` with proxy enabled.

### 2. Test API Connectivity

**Option A: Browser Test (Recommended)**

Open in your browser:
```
http://localhost:8080/test-proxy.html
```

Click "Run All Tests" to test the proxy configuration.

**Option B: Direct API Test**

```bash
npx tsx src/scripts/testApiConnectivity.ts
```

This tests direct API access (not the proxy). Some failures are expected due to CORS.

### 3. Re-run Data Audit

Once APIs are working:

```bash
npx tsx src/scripts/runDataAudit.ts
```

This will generate updated reports showing real data availability.

## 📋 Configured Proxies

| Local Path | Target API | Purpose |
|------------|------------|---------|
| `/api/tech4palestine/*` | `data.techforpalestine.org` | Gaza casualties & infrastructure |
| `/api/goodshepherd/*` | `data.goodshepherd.org` | West Bank data & prisoners |
| `/api/worldbank/*` | `api.worldbank.org` | Economic indicators |
| `/api/btselem/*` | `www.btselem.org` | Checkpoints & settlements |
| Direct (no proxy) | `data.humdata.org` | UN OCHA humanitarian data |

## 🔍 Verify Proxy is Working

Open browser console at `http://localhost:8080` and run:

```javascript
// Test Tech4Palestine
fetch('/api/tech4palestine/v3/summary.json')
  .then(r => r.json())
  .then(d => console.log('✓ Tech4Palestine working:', d))
  .catch(e => console.error('✗ Tech4Palestine failed:', e));

// Test Good Shepherd
fetch('/api/goodshepherd/wb_data.json')
  .then(r => r.json())
  .then(d => console.log('✓ Good Shepherd working:', d))
  .catch(e => console.error('✗ Good Shepherd failed:', e));
```

## 🐛 Troubleshooting

### "Proxy error" in terminal

**Problem:** Target API is unreachable  
**Solution:** Check if the API URL is correct and accessible

### APIs still failing

**Problem:** Dev server not running or proxy not configured  
**Solution:** 
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Clear browser cache
4. Try again

### "CORS error" still appearing

**Problem:** Request not going through proxy  
**Solution:** Ensure you're using `/api/` prefix in your code

## 📚 Full Documentation

For detailed information, see:
- `docs/API_PROXY_SETUP.md` - Complete proxy guide
- `docs/DATA_AUDIT_GUIDE.md` - Data audit usage
- `audit-reports/README.md` - Understanding audit reports

## 🎯 Next Steps

1. ✅ Proxy is configured
2. 🔄 Start dev server: `npm run dev`
3. 🧪 Test APIs: `npx tsx src/scripts/testApiConnectivity.ts`
4. 📊 Re-run audit: `npx tsx src/scripts/runDataAudit.ts`
5. 🚀 Begin data integration: Follow `audit-reports/REPLACEMENT_PLAN.md`

## 🆘 Need Help?

If you encounter issues:
1. Check terminal logs for proxy errors
2. Review `docs/API_PROXY_SETUP.md` troubleshooting section
3. Test APIs directly in browser to verify they're accessible
4. Check if APIs require authentication or API keys

---

**Status:** ✅ Proxy configuration complete  
**Last Updated:** 2025-10-22
