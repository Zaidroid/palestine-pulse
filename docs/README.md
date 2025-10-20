# Palestine Pulse - Humanitarian Dashboard

A comprehensive, real-time humanitarian data visualization platform providing multi-dimensional statistics and analysis about Palestine. Built with a serverless architecture for zero-cost hosting.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-3.0.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎉 V3 Major Update - Region-Focused Architecture

**V3 introduces a completely redesigned dashboard with:**

### 🔥 Two Powerful Regional Dashboards
1. **War on Gaza** - 4 comprehensive sub-tabs documenting the humanitarian catastrophe
2. **West Bank Occupation** - 4 detailed sub-tabs exposing systematic oppression

### 🎨 New Features
- ✨ **Animated UI** - Smooth transitions with Framer Motion
- 🎯 **Unified Header/Footer** - Consistent navigation across all pages
- 📊 **Enhanced Charts** - Beautiful, animated data visualizations
- 🎨 **Palestinian Solidarity Theme** - Red/green/black color palette
- 🔄 **Real-time Updates** - Auto-refresh with visual indicators
- 📱 **Mobile-First Design** - Fully responsive layouts

### 🚀 Access V3 Dashboard
- **Gaza War**: `/v3/gaza`
- **West Bank**: `/v3/west-bank`
- **Auto-redirect**: `/v3` → `/v3/gaza`

See [`V3_IMPLEMENTATION_SUMMARY.md`](V3_IMPLEMENTATION_SUMMARY.md) for complete details.

---

## 🌟 V2 Features (Legacy)

### **Multi-Page Application**
- **Dashboard** - Core casualty and infrastructure data
- **Maps** - Interactive geographic visualizations with Leaflet
- **Analytics** - Economic, humanitarian, healthcare, and displacement analysis

### **Interactive Visualizations**
- 🗺️ **Interactive Maps** - Gaza and West Bank with casualty heatmaps
- ⏰ **Historical Timeline** - Major events since October 7, 2023
- 📊 **15+ Chart Types** - Area, line, bar, pie, and composed charts
- 🎯 **Geographic Markers** - 10 locations with detailed popups

### **7 Comprehensive Dashboards**
1. **Economic Impact** - GDP loss, unemployment, business destruction
2. **Humanitarian Aid** - Aid deliveries, access restrictions, coverage gaps
3. **Healthcare System** - Hospital status, medical supplies, healthcare workers
4. **Displacement** - IDPs tracking, shelter capacity, regional distribution
5. **Gaza Overview** - Enhanced with all V1 features
6. **West Bank** - Enhanced monitoring
7. **Infrastructure** - Building damage analysis

### **Advanced Infrastructure**
- 🔄 **Multi-Source Integration** - 8 data sources configured
- 💾 **4-Tier Caching** - LocalStorage, API cache, React Query, CDN
- 🔐 **Security Hardened** - CSP, XSS protection, HTTPS-only
- 🚀 **Auto-Deployment** - GitHub Actions → Netlify
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ & npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd palestine-pulse-viz

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Navigate the App

- **Main Dashboard**: `http://localhost:8080/` - Core statistics
- **Maps & Timeline**: `http://localhost:8080/maps` - Geographic visualizations
- **Analytics**: `http://localhost:8080/analytics` - Advanced analysis

---

## 📊 Features Overview

### Core Features (V1 - Enhanced)
- ✅ Gaza casualties with demographic breakdowns
- ✅ West Bank casualties tracking
- ✅ Press/journalist casualties with detailed list
- ✅ Infrastructure damage (residential, mosques, schools, hospitals)
- ✅ Daily casualty trends
- ✅ Demographic distribution charts
- ✅ Dark/Light theme toggle
- ✅ Date range filtering (7-365 days)

### New V2 Features

#### **Interactive Maps**
- Geographic visualization of Gaza Strip and West Bank
- 10 location markers with real coordinates
- Casualty intensity circles (color-coded)
- Interactive popups with detailed information
- Region boundaries and labels
- Zoom and pan controls

#### **Historical Timeline**
- 8 major events since October 7, 2023
- Event type filtering (military, massacre, ceasefire, political)
- Severity indicators (critical, high, medium, low)
- Casualty counts per event
- Chronological display with details

#### **Economic Impact Analysis**
- GDP loss tracking ($74.2B cumulative)
- Unemployment rate trends (76%)
- Business destruction statistics (24,100 total)
- Sector-wise damage breakdown
- Agricultural losses ($1.58B)
- Reconstruction cost estimates ($185.5B)
- 5 key economic indicators

#### **Humanitarian Aid Tracking**
- Aid coverage by type (Food, Medical, Shelter, Water, Hygiene)
- Only 24% of needs currently met
- Aid source distribution (UN, Arab countries, EU, USA, NGOs)
- Delivery vs. blocked trends (1,672 delivered vs 1,649 blocked)
- Access restrictions analysis
- Key challenges to aid delivery

#### **Healthcare System Status**
- 36 hospitals tracked (0 operational, 12 partial, 24 non-operational)
- Bed capacity analysis (2,500 total beds)
- Medical supplies availability (8 critical shortages)
- Healthcare worker casualties (1,034 killed/injured)
- Detailed facility status

#### **Displacement Statistics**
- 1.9M internally displaced (85% of Gaza population)
- 267 active shelters
- Shelter capacity vs. occupancy (138% overcrowded)
- Regional distribution breakdown
- Shelter type analysis
- Living conditions crisis alerts

---

## 🏗️ Technical Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Modern UI components

### Data & State
- **TanStack Query** - Server state management
- **Zustand** - Global state management
- **Lodash** - Utility functions
- **Date-fns** - Date operations

### Visualizations
- **Recharts** - Chart library
- **Leaflet** - Interactive maps
- **React-Leaflet** - React bindings
- **D3.js** - Advanced visualizations

### Infrastructure
- **GitHub** - Source control
- **GitHub Actions** - CI/CD
- **Netlify** - Serverless hosting
- **100% Client-Side** - No backend needed

---

## 📁 Project Structure

```
palestine-pulse-viz/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD automation
├── src/
│   ├── types/
│   │   └── data.types.ts       # TypeScript definitions
│   ├── services/
│   │   └── apiOrchestrator.ts  # Multi-source API manager
│   ├── store/
│   │   └── globalStore.ts      # Zustand state management
│   ├── components/
│   │   ├── maps/
│   │   │   └── InteractiveMap.tsx      # Leaflet maps
│   │   ├── timeline/
│   │   │   └── EventTimeline.tsx       # Historical events
│   │   ├── dashboards/
│   │   │   ├── EconomicImpact.tsx      # Economic analysis
│   │   │   ├── AidTracker.tsx          # Humanitarian aid
│   │   │   ├── HealthcareStatus.tsx    # Healthcare system
│   │   │   ├── DisplacementStats.tsx   # Displacement data
│   │   │   ├── GazaOverview.tsx        # Gaza statistics
│   │   │   └── ...                     # Other dashboards
│   │   └── ui/                         # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx           # Main dashboard
│   │   ├── Maps.tsx            # Geographic visualizations
│   │   ├── Analytics.tsx       # Advanced analytics
│   │   └── NotFound.tsx        # 404 page
│   ├── hooks/
│   │   └── useDataFetching.ts  # Data fetching hooks
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── netlify.toml                # Netlify configuration
├── PALESTINE_DASHBOARD_V2_PLAN.md      # Complete V2 plan
├── V2_QUICK_REFERENCE.md               # Quick reference
├── V2_VISUAL_ROADMAP.md                # Visual roadmap
├── IMPLEMENTATION_STATUS.md            # Progress tracking
└── V2_IMPLEMENTATION_COMPLETE.md       # What's been built
```

---

## 🚀 Deployment

### Netlify (Recommended)

This project is optimized for Netlify deployment with:
- Automatic builds on git push
- CDN distribution
- SSL certificates
- Custom domain support
- Security headers configured
- SPA routing setup

#### Deploy Steps:

1. **Connect Repository**
   ```bash
   # Via Netlify UI
   1. Login to Netlify
   2. Click "Add new site"
   3. Import from GitHub
   4. Select this repository
   
   # Or via CLI
   netlify login
   netlify init
   ```

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Already configured in netlify.toml)

3. **Custom Domain** (Optional)
   - Add in Netlify domain settings
   - Configure DNS records
   - SSL auto-provisioned

4. **Deploy**
   ```bash
   git push origin main
   # Deploys automatically via GitHub Actions!
   ```

### Alternative Platforms

Also compatible with:
- Vercel
- GitHub Pages
- AWS Amplify
- Cloudflare Pages

```bash
# Build for any platform
npm run build
# Output in dist/ directory
```

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup

No environment variables needed! All data fetched from public APIs.

Optional (for future features):
```env
# .env.local (if needed)
VITE_API_KEY=your_api_key
```

---

## 📚 Data Sources

### Active
- **Tech for Palestine** - Core casualty and infrastructure data
  - API: `https://data.techforpalestine.org/api`

### Ready to Integrate
- **UN OCHA** - Humanitarian access and aid delivery
- **WHO** - Healthcare system status
- **World Bank** - Economic indicators
- **UNRWA** - Refugee and displacement data
- **PCBS** - Palestinian national statistics
- **B'Tselem** - Human rights documentation

All data sources configured in [`src/services/apiOrchestrator.ts`](src/services/apiOrchestrator.ts)

---

## 🎯 Key Metrics

### Current Data Coverage
- **Casualties**: Real-time from Tech for Palestine
- **Infrastructure**: Daily damage reports
- **Press**: Journalist casualties list
- **Economic**: Sample data (ready for World Bank API)
- **Aid**: Sample data (ready for UN OCHA)
- **Healthcare**: Sample data (ready for WHO)
- **Displacement**: Sample data (ready for UNRWA)

### Application Stats
- **Pages**: 3 (Dashboard, Maps, Analytics)
- **Dashboards**: 7 sections
- **Charts**: 15+ types
- **Components**: 65+
- **Data Points**: 1000s
- **Updates**: Real-time capable

---

## 🔐 Security & Privacy

### Data Privacy
- ✅ No personal data collection
- ✅ Anonymous analytics only
- ✅ No tracking cookies
- ✅ GDPR compliant
- ✅ Client-side only processing

### Security
- ✅ Content Security Policy (CSP)
- ✅ XSS Protection
- ✅ Frame Options (clickjacking prevention)
- ✅ HTTPS-only
- ✅ Secure headers configured

---

## 📖 Documentation

- **[PALESTINE_DASHBOARD_V2_PLAN.md](./PALESTINE_DASHBOARD_V2_PLAN.md)** - Complete V2 specification (1,752 lines)
- **[V2_QUICK_REFERENCE.md](./V2_QUICK_REFERENCE.md)** - Quick reference guide (548 lines)
- **[V2_VISUAL_ROADMAP.md](./V2_VISUAL_ROADMAP.md)** - Visual implementation roadmap (786 lines)
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Progress tracking (550 lines)
- **[V2_IMPLEMENTATION_COMPLETE.md](./V2_IMPLEMENTATION_COMPLETE.md)** - What's been built (430 lines)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns
- Update documentation
- Test on multiple screen sizes
- Maintain accessibility standards

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Tech for Palestine** - Primary data source
- **UN OCHA** - Humanitarian data
- **WHO** - Health statistics
- **World Bank** - Economic data
- **UNRWA** - Refugee data
- **All contributors** - Community support

---

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See docs folder
- **Data Source**: [Tech for Palestine](https://data.techforpalestine.org)

---

## 🎯 Roadmap

### ✅ Completed (32%)
- Phase 1: Foundation (100%)
- Phase 2: Core Visualizations (100%)
- Phase 3: New Dashboards (40%)

### 🔄 In Progress
- Additional dashboards (Education, Utilities, Prisoners, etc.)
- More data source integrations

### ⏳ Planned
- Phase 4: Advanced Analytics (Predictive models, anomaly detection)
- Phase 5: UX Enhancements (Multi-language, export tools)
- Phase 6: PWA Features (Offline mode, push notifications)
- Phase 7: Testing & Documentation
- Phase 8: Production Launch

See [V2_VISUAL_ROADMAP.md](./V2_VISUAL_ROADMAP.md) for complete 20-week plan.

---

## 💡 Technical Highlights

### **100% Serverless**
- No backend servers
- No database
- No hosting costs (Netlify free tier)
- Only pay for custom domain (optional)

### **Performance**
- Build time: ~3.3s
- Bundle: 315 KB gzipped
- Initial load: ~2-3s
- Cached load: <500ms
- Real-time data updates

### **Type Safety**
- 100% TypeScript
- Full type coverage
- Compile-time error detection
- IntelliSense support

### **State Management**
- Zustand global store
- LocalStorage persistence
- React Query for server state
- Multi-level caching

---

## 📸 Screenshots

*Coming soon - Screenshots of Maps, Timeline, and Analytics pages*

---

## 🌍 Live Demo

*Deploy to your custom domain with Netlify*

---

---

## 🆕 What's New in V3

### Architecture Changes
- **Region-focused 2-dashboard system**: The application is now organized around two main narratives: the "War on Gaza" and the "West Bank Occupation".
- **8 total sub-tabs**: Each regional dashboard has four detailed sub-tabs for a deep dive into the data.
- **Unified layout components**: A consistent header, footer, and layout structure is used across the entire application.
- **Shared widget library**: A rich library of reusable components ensures a consistent and modern user experience.

### Component Library
- **`UnifiedMetricCard`**: A versatile, animated card for displaying key metrics.
- **`AnimatedChart`**: A wrapper component for creating beautiful, animated charts.
- **`DataTable`**: A reusable table with sorting, filtering, and pagination.
- **`MapVisualization`**: A unified component for interactive maps.
- **And many more**: Including `TrendIndicator`, `ProgressGauge`, `ComparisonCard`, and `TimelineWidget`.

### Visual Design
- **Palestinian Solidarity Theme**: A new color palette inspired by the Palestinian flag.
- **Modern Typography**: Using the `Inter` and `JetBrains Mono` fonts for a clean, readable look.
- **Smooth Animations**: Fluid animations and transitions powered by `framer-motion`.

### Component Library
- `UnifiedMetricCard` - Animated metrics with sparklines
- `AnimatedChart` - Smooth chart transitions
- `TrendIndicator` - Visual trend arrows
- `ProgressGauge` - Linear & circular progress

### Visual Design
- Palestinian flag-inspired colors
- Smooth Framer Motion animations
- Custom loading skeletons
- Hover & interaction effects

**See [`V3_IMPLEMENTATION_SUMMARY.md`](V3_IMPLEMENTATION_SUMMARY.md) for full V3 documentation**

---

**Built with ❤️ for Palestine**

**Last Updated:** 2025-01-18
**Version:** 3.0.0-alpha
**Status:** V3 In Development, V2 Production Ready
