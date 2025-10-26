# API Proxy Configuration Guide

## Overview

The Palestine Pulse dashboard fetches data from multiple external APIs. Due to CORS (Cross-Origin Resource Sharing) restrictions, we use Vite's built-in proxy server in development to route API requests.

## Configured Proxies

### 1. Tech4Palestine API
**Local Path:** `/api/tech4palestine/*`  
**Target:** `https://data.techforpalestine.org/api/*`  
**Purpose:** Primary source for Gaza casualties, infrastructure damage, and daily statistics

**Endpoints:**
- `/api/tech4palestine/v3/killed-in-gaza.min.json` → Casualty data
- `/api/tech4palestine/v2/press_killed_in_gaza.json` → Press casualties
- `/api/tech4palestine/v3/summary.json` → Summary statistics
- `/api/tech4palestine/v2/casualties_daily.json` → Daily casualties
- `/api/tech4palestine/v2/west_bank_daily.json` → West Bank daily data
- `/api/tech4palestine/v3/infrastructure-damaged.json` → Infrastructure damage

### 2. Good Shepherd Collective API
**Local Path:** `/api/goodshepherd/*`  
**Target:** `https://goodshepherdcollective.org/api/*`  
**Purpose:** West Bank data, prisoner statistics, healthcare attacks, home demolitions

**Endpoints:**
- `/api/goodshepherd/child_prisoners.json` → Child prisoner data
- `/api/goodshepherd/wb_data.json` → West Bank incidents
- `/api/goodshepherd/healthcare_attacks.json` → Healthcare facility attacks
- `/api/goodshepherd/home_demolitions.json` → Home demolition data
- `/api/goodshepherd/ngo_data.json` → NGO-sourced data
- `/api/goodshepherd/prisoner_data.json` → Political prisoner statistics

### 3. World Bank API
**Local Path:** `/api/worldbank/*`  
**Target:** `https://api.worldbank.org/v2/*`  
**Purpose:** Economic indicators for Palestine (GDP, unemployment, poverty)

**Endpoints:**
- `/api/worldbank/countries/PSE/indicators` → Palestine economic indicators
- `/api/worldbank/countries/PSE/indicators/NY.GDP.MKTP.CD` → GDP data
- `/api/worldbank/countries/PSE/indicators/SL.UEM.TOTL.ZS` → Unemployment rate

### 4. B'Tselem API
**Local Path:** `/api/btselem/*`  
**Target:** `https://www.btselem.org/api/*`  
**Purpose:** Checkpoint data, settlement information, human rights violations

**Endpoints:**
- `/api/btselem/checkpoints` → Checkpoint locations and data

### 5. UN OCHA / HDX (Direct - No Proxy)
**URL:** `https://data.humdata.org/api/action/*`  
**Purpose:** Humanitarian data, displacement statistics, aid delivery  
**Note:** This API allows CORS, so no proxy is needed

## How It Works

### Development Mode

When you run `npm run dev`, Vite starts a development server with the proxy configuration:

```
Browser Request:
http://localhost:8080/api/tech4palestine/v3/summary.json

↓ Vite Proxy Intercepts

External Request:
https://data.techforpalestine.org/api/v3/summary.json

↓ Response

Browser receives data (same-origin)
```

### Production Mode

For production, you have several options:

#### Option 1: Cloudflare Workers (Recommended)
Deploy a simple proxy using Cloudflare Workers:

```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/tech4palestine')) {
      const targetUrl = url.pathname.replace('/api/tech4palestine', 'https://data.techforpalestine.org/api');
      return fetch(targetUrl);
    }
    
    // ... other proxies
    
    return fetch(request);
  }
}
```

#### Option 2: Vercel Rewrites
Add to `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/tech4palestine/:path*",
      "destination": "https://data.techforpalestine.org/api/:path*"
    },
    {
      "source": "/api/goodshepherd/:path*",
      "destination": "https://data.goodshepherd.org/:path*"
    }
  ]
}
```

#### Option 3: Netlify Redirects
Add to `netlify.toml`:

```toml
[[redirects]]
  from = "/api/tech4palestine/*"
  to = "https://data.techforpalestine.org/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/api/goodshepherd/*"
  to = "https://data.goodshepherd.org/:splat"
  status = 200
  force = true
```

## Testing the Proxy

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Proxy in Browser (Recommended)

Open the test page in your browser:

```
http://localhost:8080/test-proxy.html
```

Click "Run All Tests" to test all endpoints through the proxy. This is the most accurate test since it uses the actual proxy configuration.

**OR** open your browser console and run:

```javascript
// Test Tech4Palestine
fetch('/api/tech4palestine/v3/summary.json')
  .then(r => r.json())
  .then(d => console.log('Tech4Palestine:', d));

// Test Good Shepherd
fetch('/api/goodshepherd/wb_data.json')
  .then(r => r.json())
  .then(d => console.log('Good Shepherd:', d));

// Test World Bank
fetch('/api/worldbank/countries/PSE/indicators?format=json')
  .then(r => r.json())
  .then(d => console.log('World Bank:', d));
```

### 3. Test Direct API Access (Optional)

Test if the APIs are accessible directly (without proxy):

```bash
npx tsx src/scripts/testApiConnectivity.ts
```

**Note:** This tests direct API access, not the proxy. Some APIs may fail due to CORS, which is expected.

### 4. Re-run Data Audit

After confirming APIs work:

```bash
npx tsx src/scripts/runDataAudit.ts
```

## Troubleshooting

### "Proxy error" in console

**Cause:** Target API is down or URL is incorrect  
**Solution:** 
1. Check if the target API is accessible directly
2. Verify the target URL in `vite.config.ts`
3. Check API documentation for endpoint changes

### "ENOTFOUND" or "ETIMEDOUT"

**Cause:** Network connectivity issues or DNS problems  
**Solution:**
1. Check your internet connection
2. Try accessing the API directly in browser
3. Check if API requires authentication

### "404 Not Found"

**Cause:** Endpoint path is incorrect  
**Solution:**
1. Verify the endpoint path in API documentation
2. Check the `rewrite` function in proxy config
3. Look at the proxy logs in terminal

### "CORS error" still appearing

**Cause:** Proxy not intercepting the request  
**Solution:**
1. Ensure you're using the `/api/` prefix in your code
2. Restart the dev server
3. Clear browser cache

### APIs work in dev but not production

**Cause:** Proxy only works in development  
**Solution:**
1. Implement one of the production proxy options above
2. Or update API URLs to use direct CORS-enabled endpoints
3. Or deploy a backend proxy service

## Monitoring

### Check Proxy Logs

The Vite dev server logs all proxy requests. Look for:

```
Tech4Palestine proxy request: GET /api/tech4palestine/v3/summary.json
```

### Enable Verbose Logging

Add to `vite.config.ts`:

```typescript
proxy: {
  '/api/tech4palestine': {
    // ... existing config
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        console.log('→ Proxying:', req.method, req.url);
      });
      proxy.on('proxyRes', (proxyRes, req) => {
        console.log('← Response:', proxyRes.statusCode, req.url);
      });
      proxy.on('error', (err, req) => {
        console.error('✗ Proxy error:', req.url, err.message);
      });
    }
  }
}
```

## Security Considerations

### API Keys

Some APIs may require authentication. Store keys in environment variables:

```bash
# .env.local
VITE_TECH4PALESTINE_API_KEY=your_key_here
VITE_WORLDBANK_API_KEY=your_key_here
```

Access in code:

```typescript
const apiKey = import.meta.env.VITE_TECH4PALESTINE_API_KEY;
```

### Rate Limiting

Be mindful of API rate limits:
- Tech4Palestine: No known limits
- World Bank: 120 requests/minute
- UN OCHA: No known limits

Implement caching to reduce requests (already done in `apiOrchestrator.ts`).

## Next Steps

1. ✅ Proxy configuration is set up
2. 🔄 Start dev server: `npm run dev`
3. 🧪 Test APIs: `npx tsx src/scripts/testApiConnectivity.ts`
4. 📊 Re-run audit: `npx tsx src/scripts/runDataAudit.ts`
5. 🚀 Begin data integration following `REPLACEMENT_PLAN.md`

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vite proxy logs in terminal
3. Test APIs directly in browser
4. Consult API documentation for changes
