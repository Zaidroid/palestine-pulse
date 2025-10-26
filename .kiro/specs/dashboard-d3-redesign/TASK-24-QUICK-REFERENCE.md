# Task 24 Quick Reference: Food Security Dashboard

## Component Location
```
src/components/dashboards/FoodSecurityV2.tsx
```

## Usage
```typescript
import { FoodSecurityV2 } from '@/components/dashboards/FoodSecurityV2';

// Basic usage
<FoodSecurityV2 />

// With loading state
<FoodSecurityV2 loading={true} />
```

## Charts Implemented

### 1. AnimatedAreaChart - IPC Phases Over Time
- **Data**: Population in IPC Phase 3+ (Crisis/Emergency/Catastrophe)
- **Source**: IPC/HDX
- **Features**: Smooth animations, gradient fills, shows escalating crisis

### 2. SankeyFlowChart - Aid Distribution Flow
- **Data**: Food aid from sources (UNRWA, WFP, NGOs, Egypt) to 5 regions
- **Source**: UNRWA/WFP
- **Features**: Interactive flows, animated ribbons, reveals access constraints

### 3. SmallMultiplesChart - Malnutrition Rates by Region
- **Data**: Acute, severe, and moderate malnutrition across 5 regions
- **Source**: UNICEF/WHO
- **Features**: Regional comparison, synchronized scales, area fills
- **Note**: Replaced ViolinPlotChart for better regional comparison

### 4. InteractiveBarChart - Population by Food Security Level
- **Data**: IPC phase distribution (Catastrophic, Emergency, Crisis, Stressed)
- **Source**: IPC/WFP
- **Features**: Horizontal bars, color-coded by severity, interactive tooltips

### 5. CalendarHeatmapChart - Daily Caloric Intake
- **Data**: Average daily calories (Jan-Oct 2024)
- **Source**: WFP/HDX
- **Features**: Year-long calendar view, color intensity, declining nutrition trend

## Key Metrics
1. **People Food Insecure**: 2.2M (96% of population)
2. **Children Malnourished**: 335K with acute malnutrition
3. **Aid Delivered**: 115K MT per month (85% reduction)

## IPC Phase Classification
- **Phase 5**: Catastrophic/Famine (1.1M people)
- **Phase 4**: Emergency (800K people)
- **Phase 3**: Crisis (300K people)
- **Phase 2**: Stressed (50K people)
- **Phase 1**: Minimal (food secure)

## Translation Keys
```typescript
// English: dashboards.gaza.foodSecurity.*
// Arabic: dashboards.gaza.foodSecurity.*

// Examples:
t('dashboards.gaza.foodSecurity.title')
t('dashboards.gaza.foodSecurity.ipcPhases')
t('dashboards.gaza.foodSecurity.aidDistribution')
t('dashboards.gaza.foodSecurity.malnutritionRates')
```

## Food Security Crisis Alert
Displays 4 key crisis indicators:
1. 96% facing acute food insecurity (IPC 3+)
2. 335,000 children with acute malnutrition
3. Daily calories dropped from 2,100 to <600
4. Food aid reduced by 85%

## Data Sources
- **IPC**: Food insecurity phase classification
- **UNRWA**: Aid distribution tracking
- **WFP**: Food aid delivery and surveys
- **UNICEF**: Child malnutrition screening
- **WHO**: Health and nutrition monitoring
- **HDX**: Aggregated food security data

## Chart Replacements
- ❌ **ViolinPlotChart** → ✅ **SmallMultiplesChart**
  - Better for regional comparison
  - Clearer visualization across 5 regions
  - Synchronized scales for easy comparison

## RTL Support
✅ Full Arabic translation
✅ RTL layout support
✅ Arabic numeral formatting
✅ Calendar adapts to RTL direction

## Requirements Fulfilled
- ✅ 4.5 - Food Security Dashboard
- ✅ 6.1 - Data source badges
- ✅ 6.2 - Metadata display
- ✅ 5.1 - Arabic translations
- ✅ 5.6 - Food security terminology
- ✅ 5.9 - RTL layout
- ✅ 3.3 - Interactive tooltips

## Status
✅ **COMPLETE** - All subtasks finished, tested, and documented
