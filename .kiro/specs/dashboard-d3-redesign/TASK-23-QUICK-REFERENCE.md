# Task 23 Quick Reference: Economic Impact Dashboard

## Component Location
```
src/components/dashboards/EconomicImpactV2.tsx
```

## Usage
```typescript
import { EconomicImpactV2 } from '@/components/dashboards/EconomicImpactV2';

// Gaza Economic Dashboard
<EconomicImpactV2 region="gaza" />

// West Bank Economic Dashboard
<EconomicImpactV2 region="westbank" />
```

## Charts Implemented

### 1. HorizonChart - Economic Indicators
- **Data**: GDP Growth, Unemployment, Inflation
- **Source**: World Bank API
- **Features**: Multi-metric compact view, positive/negative color coding

### 2. AnimatedAreaChart - Unemployment Trends
- **Data**: Total unemployment over time
- **Source**: World Bank API
- **Features**: Smooth animations, gradient fills, interactive tooltips

### 3. RadarChart - Sector Analysis
- **Data**: 6 economic sectors (Agriculture, Industry, Services, Construction, Trade, Public Sector)
- **Source**: World Bank estimates
- **Features**: Pre-conflict vs Current comparison

### 4. ChordDiagramChart - Trade Relationships
- **Data**: Inter-regional trade flows
- **Source**: World Bank trade data
- **Features**: Interactive arcs, animated ribbons

### 5. AdvancedDonutChart - Sector Breakdown
- **Data**: Economic sector distribution
- **Source**: World Bank
- **Features**: Percentage labels, center statistics, interactive legend

### 6. ViolinPlotChart - Income Distribution
- **Data**: Income distribution by region
- **Source**: World Bank household surveys
- **Features**: Quartile display, smooth density curves

## Key Metrics
1. **GDP Growth** - Annual percentage change
2. **Total Unemployment** - Percentage of labor force
3. **Poverty Rate** - Percentage below poverty line

## Data Hooks Used
```typescript
import { 
  useWorldBankGDPGrowth,
  useWorldBankUnemployment,
  useWorldBankInflation,
  useWorldBankExports,
  useWorldBankImports
} from '@/hooks/useWorldBankData';
```

## Translation Keys
```typescript
// English: dashboards.gaza.economic.*
// Arabic: dashboards.gaza.economic.*

// Examples:
t('dashboards.gaza.economic.title')
t('dashboards.gaza.economic.gdpGrowth')
t('dashboards.gaza.economic.unemploymentRate')
t('dashboards.gaza.economic.sectorAnalysis')
```

## Economic Crisis Alert
Displays 4 key crisis indicators:
1. GDP contraction (>80%)
2. Unemployment surge (>80%)
3. Poverty increase (>80%)
4. Trade blockade impact

## Data Source Attribution
All charts include:
- Source name (World Bank)
- URL to data source
- Last updated timestamp
- Reliability indicator (high/medium)
- Methodology description
- Record count

## RTL Support
✅ Full Arabic translation
✅ RTL layout support
✅ Arabic numeral formatting
✅ Proper text alignment

## Requirements Fulfilled
- ✅ 4.4 - Economic Impact Dashboard
- ✅ 6.1 - Data source badges
- ✅ 6.2 - Metadata display
- ✅ 5.1 - Arabic translations
- ✅ 5.6 - Economic terminology
- ✅ 5.9 - RTL layout
- ✅ 3.3 - Interactive tooltips

## Status
✅ **COMPLETE** - All subtasks finished, tested, and documented
