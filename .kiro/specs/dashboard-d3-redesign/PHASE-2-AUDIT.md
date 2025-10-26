# Phase 2: West Bank Dashboard - Audit

## Components with Recharts Usage

### 1. EconomicStrangulation.tsx
**Recharts Found:**
- LineChart
- BarChart  
- RadarChart

**Estimated Replacements:**
- LineChart → AnimatedAreaChart
- BarChart → InteractiveBarChart
- RadarChart → Circular gauges or InteractiveBarChart

---

### 2. PrisonersDetention.tsx
**Recharts Found:**
- BarChart
- AreaChart
- LineChart

**Estimated Replacements:**
- BarChart → InteractiveBarChart
- AreaChart → AnimatedAreaChart
- LineChart → AnimatedAreaChart

---

### 3. OccupationMetrics.tsx
**Recharts Found:**
- AreaChart
- BarChart
- LineChart

**Estimated Replacements:**
- AreaChart → AnimatedAreaChart
- BarChart → InteractiveBarChart
- LineChart → AnimatedAreaChart

---

### 4. OsloPact.tsx
**Status:** ✅ KEEPING AS-IS - Visually polished, well-designed
- Using as inspiration for other components

---

### 5. SettlerViolence.tsx
**Recharts Found:**
- ComposedChart (Bar + Line + Area)

**Estimated Replacements:**
- ComposedChart → Multiple D3 charts or custom visualization

---

### 6. InteractiveCheckpointMap.tsx
**Status:** No Recharts found (likely uses map visualization)

---

## Implementation Strategy
1. Start with simpler components (OsloPact - single PieChart)
2. Move to components with multiple standard charts
3. Handle ComposedChart last (most complex)
4. Test each component after replacement
5. Maintain all data fetching logic

## Estimated Effort
- 5 components to update
- ~15-20 chart replacements total
- Similar complexity to Gaza dashboard Phase 1
