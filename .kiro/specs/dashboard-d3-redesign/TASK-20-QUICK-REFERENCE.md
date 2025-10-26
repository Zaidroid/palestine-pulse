# Task 20 Quick Reference: Healthcare Dashboard

## Component Location
```
src/components/dashboards/HealthcareStatusV2.tsx
```

## Usage
```tsx
import { HealthcareStatusV2 } from '@/components/dashboards/HealthcareStatusV2';

<HealthcareStatusV2 loading={false} />
```

## Charts Implemented

### 1. Hospital Operational Status (Donut Chart)
```tsx
<AdvancedDonutChart
  data={hospitalStatusData}
  showLegend={true}
  showPercentageLabels={true}
  centerLabel="Total Hospitals"
/>
```
**Data**: Operational, Partially Operational, Non-Operational counts

### 2. Attacks by Type (Bar Chart)
```tsx
<InteractiveBarChart
  data={attacksByTypeData}
  orientation="horizontal"
  showGrid={true}
  showValueLabels={true}
/>
```
**Data**: Top 8 facility types targeted

### 3. Regional Comparison (Small Multiples)
```tsx
<SmallMultiplesChart
  regions={attacksByGovernorateData}
  columns={3}
  synchronizeScales={true}
  showTotals={true}
/>
```
**Data**: Top 6 governorates by attack count

### 4. Attacks Timeline (Area Chart)
```tsx
<AnimatedAreaChart
  data={attacksTimelineData}
  showGrid={true}
  animated={true}
  valueFormatter={(value) => `${value} attacks`}
/>
```
**Data**: Monthly attack aggregations

### 5. Timeline with Events
```tsx
<TimelineEventsChart
  data={attacksTimelineData}
  events={majorHealthcareEvents}
  showGrid={true}
/>
```
**Data**: Timeline with major incident annotations

### 6. Daily Patterns (Calendar Heatmap)
```tsx
<CalendarHeatmapChart
  data={dailyAttacksData}
  showMonthLabels={true}
  showDayLabels={true}
/>
```
**Data**: Daily attack intensity

### 7. Supply Availability (Bar Chart)
```tsx
<InteractiveBarChart
  data={supplyAvailabilityData}
  orientation="horizontal"
  valueFormatter={(value) => `${value}%`}
/>
```
**Data**: 8 essential medical supplies with % availability

## Translation Keys

### Dashboard
- `dashboards.gaza.healthcare.title`
- `dashboards.gaza.healthcare.subtitle`

### Metrics
- `dashboards.gaza.healthcare.totalHospitals`
- `dashboards.gaza.healthcare.attacksCount`
- `dashboards.gaza.healthcare.healthcareWorkers`
- `dashboards.gaza.healthcare.criticalShortages`

### Charts
- `dashboards.gaza.healthcare.hospitalStatus`
- `dashboards.gaza.healthcare.attacksByType`
- `dashboards.gaza.healthcare.regionalComparison`
- `dashboards.gaza.healthcare.attacksTimeline`
- `dashboards.gaza.healthcare.supplyAvailability`

### Chart Types
- `charts.types.donut`
- `charts.types.bar`
- `charts.types.area`
- `charts.types.timeline`
- `charts.types.calendar`
- `charts.types.smallMultiples`

## Data Hooks
```tsx
const { data: healthcareAttacks, isLoading, error } = useHealthcareAttacksSummary();
const { data: facilitiesData } = useHealthFacilities();
const facilityStats = useHealthFacilityStats();
const { t } = useTranslation();
```

## Color Coding

### Hospital Status
- 🟢 Green (#10B981): Operational
- 🟠 Amber (#F59E0B): Partially Operational
- 🔴 Red (#EF4444): Non-Operational

### Supply Status
- 🔴 Red: Critical (< 10%)
- 🟠 Amber: Limited (10-25%)
- 🟢 Green: Adequate (> 25%)

## Key Metrics
- Total Hospitals: 36
- Healthcare Attacks: 2,900+
- Healthcare Workers: 1,934 (1,034 casualties)
- Critical Shortages: 5 supplies

## Data Sources
- Good Shepherd Collective (attacks)
- Ministry of Health via HDX (facilities)
- Estimated (supplies, workers)

## Testing Checklist
- [ ] Component renders without errors
- [ ] All charts display data correctly
- [ ] Translations work in English and Arabic
- [ ] RTL layout works properly
- [ ] Time filters function correctly
- [ ] Tooltips show on hover
- [ ] Export/Share buttons work
- [ ] Loading states display
- [ ] Theme switching works
- [ ] Responsive on mobile

## Common Issues

### Charts not rendering
- Check data format matches chart props
- Verify data is not empty array
- Check console for D3 errors

### Translations missing
- Verify translation keys exist in both en.json and ar.json
- Check useTranslation() hook is called
- Ensure i18n provider wraps component

### RTL layout issues
- Check CSS logical properties are used
- Verify D3 charts support RTL
- Test with `i18n.language === 'ar'`

## Performance Tips
- Use `useMemo` for data transformations
- Lazy load chart components if needed
- Implement virtualization for large datasets
- Cache API responses with React Query
