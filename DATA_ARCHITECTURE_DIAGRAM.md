# Data Infrastructure Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA SOURCES                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   HDX HAPI   │  │Tech4Palestine│  │Good Shepherd │                  │
│  │              │  │              │  │  Collective  │                  │
│  │ • Casualties │  │ • Killed     │  │ • Prisoners  │                  │
│  │ • Displace.  │  │ • Press      │  │ • Demolitions│                  │
│  │ • Food Sec.  │  │ • Summary    │  │ • NGO Data   │                  │
│  │ • Conflict   │  │ • Daily      │  │              │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                          │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          │ API Key Required │ Public API       │ Coming Soon
          │ Rate: 1 req/sec  │ No Rate Limit    │
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS WORKFLOW                             │
│                    (Runs Every 6 Hours: 0 */6 * * *)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  1. Checkout Repository                                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  2. Setup Node.js 20 + Install Dependencies                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  3. Run: node scripts/fetch-all-data.js                         │    │
│  │     ├─ Fetch HDX HAPI (with rate limiting)                      │    │
│  │     ├─ Fetch Tech4Palestine                                     │    │
│  │     ├─ Transform & Normalize Data                               │    │
│  │     ├─ Partition by Quarter (2023-Q4, 2024-Q1, etc.)           │    │
│  │     ├─ Generate recent.json (last 30 days)                      │    │
│  │     ├─ Create index.json files                                  │    │
│  │     └─ Update manifest.json                                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  4. Check for Changes (git diff)                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  5. Commit & Push (if changes detected)                         │    │
│  │     Message: "chore: update data from all sources"              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  6. Trigger Netlify Deployment (via build hook)                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GIT REPOSITORY                                   │
│                      (Single Source of Truth)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  public/data/                                                            │
│  ├── manifest.json                    ← Global catalog                  │
│  ├── hdx/                                                                │
│  │   ├── casualties/                                                     │
│  │   │   ├── index.json              ← Date range index                 │
│  │   │   ├── recent.json             ← Last 30 days (45KB)              │
│  │   │   ├── 2023-Q4.json            ← Oct-Dec 2023 (131KB)             │
│  │   │   ├── 2024-Q1.json            ← Jan-Mar 2024 (142KB)             │
│  │   │   ├── 2024-Q2.json            ← Apr-Jun 2024 (138KB)             │
│  │   │   ├── 2024-Q3.json            ← Jul-Sep 2024 (142KB)             │
│  │   │   ├── 2024-Q4.json            ← Oct-Dec 2024 (38KB)              │
│  │   │   └── metadata.json           ← Dataset metadata                 │
│  │   ├── displacement/                                                   │
│  │   ├── humanitarian/                                                   │
│  │   └── conflict/                                                       │
│  └── tech4palestine/                                                     │
│      ├── casualties/                                                     │
│      ├── killed-in-gaza/                                                 │
│      └── summary.json                                                    │
│                                                                           │
│  Git History: Full audit trail of all data changes                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NETLIFY DEPLOYMENT                                │
│                    (Triggered by Git Push)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  1. Build React App (vite build)                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  2. Copy public/data/ to dist/data/                             │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  3. Deploy to Global CDN                                        │    │
│  │     ├─ Edge locations worldwide                                 │    │
│  │     ├─ HTTPS by default                                         │    │
│  │     ├─ Automatic compression (gzip/brotli)                      │    │
│  │     └─ Cache headers optimized                                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  React App Loads                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  useRecentData('tech4palestine', 'casualties')                  │    │
│  │  ├─ Fetch: /data/tech4palestine/casualties/recent.json         │    │
│  │  ├─ Size: 45KB                                                  │    │
│  │  ├─ Time: 50ms (from CDN)                                       │    │
│  │  └─ Cache: 5 minutes (React Query)                             │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Dashboard Renders (250ms total)                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  User Selects Date Range: Oct 7, 2023 - Oct 24, 2024                   │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  useDateRangeData('tech4palestine', 'casualties', ...)          │    │
│  │  ├─ Load: /data/tech4palestine/casualties/index.json (5KB)     │    │
│  │  ├─ Identify needed files: 2023-Q4, 2024-Q1, Q2, Q3, Q4        │    │
│  │  ├─ Load files in parallel (500KB total)                        │    │
│  │  ├─ Filter to exact date range                                  │    │
│  │  ├─ Time: 400ms                                                 │    │
│  │  └─ Cache: 1 hour (React Query)                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Chart Renders with Filtered Data                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ✅ Works Offline (Service Worker caches data files)                    │
│  ✅ Fast Subsequent Loads (React Query cache)                           │
│  ✅ No API Rate Limiting Issues                                         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Timeline

```
Time: 00:00 UTC
├─ GitHub Actions Triggered (cron: 0 */6 * * *)
│
Time: 00:01 UTC
├─ Fetch HDX HAPI Data
│  ├─ Request 1: Casualties (wait 1.1s)
│  ├─ Request 2: Displacement (wait 1.1s)
│  ├─ Request 3: Food Security (wait 1.1s)
│  └─ Request 4: Conflict Events (wait 1.1s)
│
Time: 00:02 UTC
├─ Fetch Tech4Palestine Data (parallel)
│  ├─ Killed in Gaza
│  ├─ Press Killed
│  ├─ Summary
│  └─ Casualties Daily
│
Time: 00:03 UTC
├─ Transform & Partition Data
│  ├─ Filter: date >= 2023-10-07
│  ├─ Normalize: standardize fields
│  ├─ Partition: by quarter
│  └─ Generate: recent.json, index.json
│
Time: 00:04 UTC
├─ Commit to Git
│  └─ Push to GitHub
│
Time: 00:05 UTC
├─ Netlify Build Triggered
│  ├─ Build React app
│  ├─ Copy data files
│  └─ Deploy to CDN
│
Time: 00:07 UTC
└─ Deployment Complete ✅
   └─ Users see updated data on next page load
```

## Performance Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEFORE (Current)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Opens App                                                  │
│       ▼                                                          │
│  Fetch Tech4Palestine API (2s)                                  │
│       ▼                                                          │
│  Fetch HDX API (3s, rate limited)                               │
│       ▼                                                          │
│  Fetch Good Shepherd API (2s)                                   │
│       ▼                                                          │
│  Process Data Client-Side (1s)                                  │
│       ▼                                                          │
│  Render Dashboard                                                │
│                                                                   │
│  Total Time: 8-10 seconds ❌                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     AFTER (New)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Opens App                                                  │
│       ▼                                                          │
│  Fetch recent.json from CDN (200ms)                             │
│       ▼                                                          │
│  Render Dashboard (50ms)                                         │
│                                                                   │
│  Total Time: 250ms ✅ (20x faster)                               │
│                                                                   │
│  Background: Check for updates (optional)                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      CACHE LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: Netlify CDN                                            │
│  ├─ Location: Edge servers worldwide                            │
│  ├─ TTL: 1 hour                                                  │
│  └─ Invalidation: On new deployment                             │
│                                                                   │
│  Layer 2: Browser Cache                                          │
│  ├─ Location: User's browser                                     │
│  ├─ TTL: Based on Cache-Control headers                         │
│  └─ Invalidation: Manual or on version change                   │
│                                                                   │
│  Layer 3: React Query Cache                                      │
│  ├─ Location: JavaScript memory                                  │
│  ├─ TTL: 5 min (recent), 1 hour (historical)                    │
│  └─ Invalidation: Automatic based on staleTime                  │
│                                                                   │
│  Layer 4: Service Worker Cache                                   │
│  ├─ Location: Browser storage                                    │
│  ├─ TTL: Indefinite (until updated)                             │
│  └─ Invalidation: On new service worker version                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY BOUNDARIES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  HDX API Key                                                     │
│  ├─ Storage: GitHub Secrets (encrypted)                         │
│  ├─ Access: GitHub Actions only                                 │
│  ├─ Exposure: Never in client code                              │
│  └─ Rotation: Manual via GitHub UI                              │
│                                                                   │
│  Data Files                                                      │
│  ├─ Storage: Public Git repository                              │
│  ├─ Access: Anyone (read-only)                                  │
│  ├─ Sensitivity: No PII, aggregated data only                   │
│  └─ Integrity: Git commit signatures                            │
│                                                                   │
│  Rate Limiting                                                   │
│  ├─ HDX: 1 request per second (enforced in script)              │
│  ├─ Tech4Palestine: No limit (public API)                       │
│  └─ Netlify: DDoS protection automatic                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Monitoring & Alerts

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING POINTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  GitHub Actions                                                  │
│  ├─ Workflow Status: Success/Failure                            │
│  ├─ Execution Time: ~5 minutes expected                         │
│  ├─ Data Changes: Files modified count                          │
│  └─ Alerts: Email on failure                                    │
│                                                                   │
│  Data Freshness                                                  │
│  ├─ Check: metadata.json last_updated field                     │
│  ├─ Threshold: > 6 hours = stale                                │
│  ├─ Display: UI indicator for users                             │
│  └─ Alerts: Manual check via dashboard                          │
│                                                                   │
│  Netlify Deployment                                              │
│  ├─ Build Status: Success/Failure                               │
│  ├─ Build Time: ~2 minutes expected                             │
│  ├─ Deploy Preview: Available for PRs                           │
│  └─ Alerts: Email on failure                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

**Legend:**
- ▼ = Sequential flow
- ├─ = Branch/Option
- └─ = End of branch
- ✅ = Success/Enabled
- ❌ = Problem/Disabled
