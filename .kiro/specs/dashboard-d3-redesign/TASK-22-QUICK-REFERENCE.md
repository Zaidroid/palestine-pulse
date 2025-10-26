# Task 22: Education Impact Dashboard - Quick Reference

## Component Location
```
src/components/dashboards/EducationImpactV2.tsx
```

## Usage
```tsx
import { EducationImpactV2 } from '@/components/dashboards/EducationImpactV2';

<EducationImpactV2 loading={false} />
```

## Key Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| Total Schools | 617 | All schools in Gaza |
| Destroyed | 89 | Completely destroyed schools |
| Damaged | 286 | Partially damaged schools |
| Operational | 242 | Still functioning schools |
| Damage Rate | 61% | Percentage damaged/destroyed |
| Students Affected | 625,000 | Students out of school |
| Enrollment Decline | -65% | Drop since Oct 2023 |

## Charts Implemented

### 1. School Damage Status (InteractiveBarChart)
- **Type:** Vertical bar chart
- **Data:** 3 categories (destroyed, damaged, operational)
- **Colors:** Red (destroyed), Amber (damaged), Green (operational)
- **Features:** Hover tooltips, value labels

### 2. Students Affected (WaffleChart)
- **Type:** 10x10 grid (100 squares)
- **Data:** 89% of students affected
- **Features:** Animated fill, hover tooltips, proportional representation

### 3. Regional Comparison (SmallMultiplesChart)
- **Type:** Small multiples grid
- **Data:** 5 governorates (North Gaza, Gaza City, Deir al-Balah, Khan Younis, Rafah)
- **Layout:** 3 columns
- **Features:** Synchronized scales, totals display

### 4. Enrollment Trends (AnimatedAreaChart)
- **Type:** Area chart with time series
- **Data:** 2010-2024 enrollment rates
- **Features:** Smooth animations, time filters, interactive tooltips
- **Highlight:** Shows 65% decline in 2024

### 5. Multi-Dimensional Impact (RadarChart)
- **Type:** Radar/spider chart
- **Dimensions:** 6 (Infrastructure, Enrollment, Teachers, Materials, Safety, Support)
- **Features:** Interactive, shows system collapse across all dimensions

## Translation Keys

### English (en.json)
```json
"dashboards.gaza.education": {
  "title": "Education Impact",
  "subtitle": "Assessing damage to educational infrastructure",
  "schoolDamageStatus": "School Damage Status",
  "enrollmentTrends": "Pre/Post Conflict Enrollment Trends",
  "regionalComparison": "Regional School Damage Comparison",
  "studentsAffectedVisualization": "Students Affected by School Closures",
  "multiDimensionalImpact": "Multi-Dimensional Education Impact",
  "destroyed": "Destroyed",
  "damaged": "Damaged",
  "operational": "Operational"
}
```

### Arabic (ar.json)
```json
"dashboards.gaza.education": {
  "title": "تأثير التعليم",
  "subtitle": "تقييم الأضرار في البنية التحتية التعليمية",
  "schoolDamageStatus": "حالة أضرار المدارس",
  "enrollmentTrends": "اتجاهات التسجيل قبل وبعد الصراع",
  "regionalComparison": "مقارنة أضرار المدارس الإقليمية",
  "studentsAffectedVisualization": "الطلاب المتأثرون بإغلاق المدارس",
  "multiDimensionalImpact": "التأثير متعدد الأبعاد على التعليم",
  "destroyed": "مدمرة",
  "damaged": "متضررة",
  "operational": "تعمل"
}
```

## Data Sources

| Chart | Source | Reliability | URL |
|-------|--------|-------------|-----|
| School Damage | HDX - OCHA Education Data | High | https://data.humdata.org |
| Students Affected | UNICEF Education Estimates | High | - |
| Enrollment Trends | World Bank Education Indicators | High | https://data.worldbank.org |
| Multi-Dimensional | UNICEF & Education Cluster | High | - |

## Regional Data Breakdown

| Governorate | Destroyed | Damaged | Operational | Total |
|-------------|-----------|---------|-------------|-------|
| North Gaza | 28 | 45 | 32 | 105 |
| Gaza City | 31 | 89 | 78 | 198 |
| Deir al-Balah | 12 | 52 | 48 | 112 |
| Khan Younis | 15 | 68 | 54 | 137 |
| Rafah | 3 | 32 | 30 | 65 |
| **Total** | **89** | **286** | **242** | **617** |

## Multi-Dimensional Impact Scores

| Dimension | Score | Status |
|-----------|-------|--------|
| Infrastructure | 25/100 | Critical |
| Enrollment | 35/100 | Critical |
| Teacher Availability | 42/100 | Severe |
| Learning Materials | 18/100 | Critical |
| Safety & Access | 12/100 | Critical |
| Psychosocial Support | 8/100 | Critical |

## Crisis Highlights

1. **61% of schools damaged or destroyed** (375 out of 617)
2. **625,000 students out of school** since October 2023
3. **5,500+ students killed**, 260+ teachers killed
4. **All universities damaged or destroyed**
5. **Severe psychological trauma** affecting learning capacity

## Component Props

```typescript
interface EducationImpactV2Props {
  loading?: boolean;  // Optional loading state
}
```

## Styling Classes

- `.card-elevated` - Elevated card style for metrics
- `.text-destructive` - Red text for critical values
- `.text-muted-foreground` - Muted text for secondary info

## Dependencies

```typescript
// D3 Charts
import { InteractiveBarChart } from '@/components/charts/d3/InteractiveBarChart';
import { SmallMultiplesChart } from '@/components/charts/d3/SmallMultiplesChart';
import { WaffleChart } from '@/components/charts/demo/WaffleChart';
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';
import { RadarChart } from '@/components/charts/d3/RadarChart';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import { GraduationCap, School, Users, AlertTriangle, TrendingDown, Target, MapPin, BookOpen } from 'lucide-react';
```

## Testing Checklist

- [ ] Component renders without errors
- [ ] All charts display correctly
- [ ] Metrics cards show accurate data
- [ ] Tooltips work on hover
- [ ] Loading states display properly
- [ ] Arabic translations render correctly
- [ ] RTL layout works properly
- [ ] Data source badges are visible
- [ ] Crisis alert is prominent
- [ ] Responsive on mobile devices

## Performance Notes

- All data transformations are memoized with `useMemo`
- Charts use lazy loading where applicable
- Efficient re-rendering with proper dependencies
- Optimized D3 updates for smooth animations

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatible
- Color contrast compliant (WCAG AA)

## Future Enhancements

1. Real-time data integration with OCHA API
2. Timeline of education incidents
3. Calendar heatmap of school attacks
4. Teacher casualty breakdown
5. Drill-down by school type
6. Export functionality
7. Mobile-optimized layouts
