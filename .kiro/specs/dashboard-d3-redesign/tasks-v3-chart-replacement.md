# V3 Dashboard Chart Replacement Tasks

## Goal
Replace existing Recharts visualizations in v3 Gaza and West Bank dashboards with our new D3 chart library, maintaining the same data fetching logic and improving visual appeal with animations.

## Available D3 Charts
- ✅ InteractiveBarChart
- ✅ AdvancedDonutChart  
- ✅ CalendarHeatmapChart
- ✅ SankeyFlowChart
- ✅ SmallMultiplesChart
- ✅ TimelineEventsChart
- ✅ HorizonChart
- ✅ RadarChart
- ✅ PopulationPyramidChart
- ✅ AnimatedAreaChart (demo)
- ✅ StreamGraphChart (demo)
- ✅ WaffleChart (demo)

## Phase 1: Gaza Dashboard - Humanitarian Crisis Tab

### Task 1: Replace Humanitarian Crisis Charts
**File**: `src/components/v3/gaza/HumanitarianCrisis.tsx`

**Current Charts (Recharts)**:
- AreaChart for daily casualties timeline
- PieChart for demographic breakdown
- BarChart for daily new casualties

**Replacements**:
- [x] 1.1 Replace AreaChart with AnimatedAreaChart (D3) ✅
  - Keep existing data transformation logic
  - Use `dailyCasualtiesChart` data
  - Add smooth animations
  - Maintain anomaly detection highlighting
  
- [x] 1.2 Replace PieChart with AdvancedDonutChart (D3) ✅
  - Keep demographic breakdown data
  - Add interactive hover effects
  - Show percentages on segments
  - Add center total display

- [x] 1.3 Replace BarChart with InteractiveBarChart (D3) ✅
  - Keep daily casualties data
  - Add hover tooltips
  - Add color coding by severity
  - Maintain responsive behavior

### Task 2: Replace Infrastructure Destruction Charts ✅
**File**: `src/components/v3/gaza/InfrastructureDestruction.tsx`

- [x] 2.1 Identify current Recharts usage ✅
- [x] 2.2 Replace with appropriate D3 charts ✅
  - AdvancedDonutChart for housing status breakdown
  - InteractiveBarChart for destruction timeline

### Task 3: Replace Population Impact Charts ✅
**File**: `src/components/v3/gaza/PopulationImpact.tsx`

- [x] 3.1 Identify current Recharts usage ✅
- [x] 3.2 Replace with appropriate D3 charts ✅
  - AdvancedDonutChart for casualty demographics
  - InteractiveBarChart for vulnerable populations
  - AnimatedAreaChart for education system collapse
  - PopulationPyramidChart for age/gender distribution

### Task 4: Replace Aid & Survival Charts ✅
**File**: `src/components/v3/gaza/AidSurvival.tsx`

- [x] 4.1 Identify current Recharts usage ✅
- [x] 4.2 Replace with appropriate D3 charts ✅
  - InteractiveBarChart for aid pledged vs delivered
  - Aid Bottlenecks Impact (custom metric cards)
  - InteractiveBarChart for services degradation
  - InteractiveBarChart for aid distribution by type

## Phase 2: West Bank Dashboard ✅

### Task 5: Replace West Bank Charts ✅
**File**: `src/components/v3/westbank/*.tsx`

- [x] 5.1 Audit all Recharts usage in West Bank components ✅
- [x] 5.2 Replace with D3 equivalents ✅ (Already complete - no Recharts found)
- [x] 5.3 Test with real data ✅

## Phase 3: Shared Components ✅

### Task 6: Replace Shared Chart Components ✅
**Files**: `src/components/v3/shared/*.tsx`

- [x] 6.1 Replace AnimatedChart wrapper to support D3 charts ✅ (Already supports any chart type)
- [x] 6.2 Update PressCasualtiesWidget if using Recharts ✅ (No charts used)
- [x] 6.3 Ensure all shared components use D3 ✅ (No Recharts found)

## Phase 4: Testing & Polish ✅

### Task 7: Integration Testing ✅
- [x] 7.1 Test all replaced charts with real data ✅
- [x] 7.2 Verify animations work smoothly ✅
- [x] 7.3 Test responsive behavior on mobile ✅
- [x] 7.4 Test RTL layout for Arabic ✅

### Task 8: Performance Optimization ✅
- [x] 8.1 Ensure D3 charts don't cause performance issues ✅
- [x] 8.2 Add lazy loading if needed ✅
- [x] 8.3 Optimize re-renders ✅

### Task 9: Accessibility ✅
- [x] 9.1 Add ARIA labels to all D3 charts ✅
- [x] 9.2 Ensure keyboard navigation works ✅
- [x] 9.3 Test with screen readers ✅

## Implementation Guidelines

### Data Fetching
- **DO NOT** change existing data fetching logic
- **DO NOT** create new hooks
- **USE** the same data transformations
- **KEEP** the same useMemo patterns

### Chart Replacement Pattern
```typescript
// BEFORE (Recharts)
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={dailyCasualtiesChart}>
    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
  </AreaChart>
</ResponsiveContainer>

// AFTER (D3)
<AnimatedAreaChart
  data={dailyCasualtiesChart}
  height={300}
  color="#8884d8"
/>
```

### Key Principles
1. **Minimal Changes**: Only replace the chart component, keep everything else
2. **Same Data**: Use the exact same data variables
3. **Same Props**: Match the height, colors, and behavior as closely as possible
4. **Add Value**: Leverage D3 animations and interactivity
5. **Test Thoroughly**: Ensure no regressions

## Success Criteria
- ✅ All Recharts replaced with D3 charts
- ✅ No changes to data fetching logic
- ✅ Animations work smoothly
- ✅ Charts are responsive
- ✅ RTL support maintained
- ✅ No performance degradation
- ✅ Accessibility maintained

## Notes
- Focus on visual improvement, not restructuring
- Keep the same component structure
- Maintain all existing functionality
- Add animations where beneficial
- Test with real data at every step
aa