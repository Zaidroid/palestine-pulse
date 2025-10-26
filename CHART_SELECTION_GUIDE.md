# 📊 Chart Selection Guide - Quick Reference

## 🎯 Which Chart Should I Use?

### By Data Type

#### 📅 **Time Series Data**
- **Area Chart** - Continuous trends with filled areas
- **Stream Graph** - Multiple categories stacked over time
- **Calendar Heatmap** ⭐ NEW - Daily patterns in calendar format
- **Horizon Chart** (future) - Compact multi-metric view

#### 📊 **Categorical Comparisons**
- **Bar Chart** - Simple category comparisons
- **Bullet Chart** (future) - Target vs actual with context
- **Radar Chart** - Multi-dimensional comparison

#### 🥧 **Proportions & Parts-of-Whole**
- **Donut Chart** - Circular proportions
- **Waffle Chart** (future) - Grid-based proportions
- **Isotype Chart** ⭐ NEW - Icon-based proportions

#### 📈 **Distributions**
- **Violin Plot** - Statistical distribution with density
- **Population Pyramid** ⭐ NEW - Age/gender distribution
- **Ridgeline Plot** (future) - Overlapping distributions

#### 🔀 **Flows & Relationships**
- **Sankey Diagram** - Directed flows with quantities
- **Chord Diagram** - Circular relationship matrix

---

## 🎭 By Purpose

### 😢 **Emotional Impact** (Humanize Data)
1. **Isotype Chart** ⭐⭐⭐⭐⭐ - Each icon = people
2. **Calendar Heatmap** ⭐⭐⭐⭐⭐ - Every day visible
3. **Population Pyramid** ⭐⭐⭐⭐⭐ - Vulnerable groups

### 📊 **Analytical Depth** (Understand Patterns)
1. **Violin Plot** - Statistical analysis
2. **Radar Chart** - Multi-dimensional
3. **Stream Graph** - Temporal patterns

### 🎯 **Quick Overview** (At-a-Glance)
1. **Bar Chart** - Simple comparisons
2. **Donut Chart** - Quick proportions
3. **Isotype Chart** - Visual summary

### 🔍 **Detailed Exploration** (Deep Dive)
1. **Calendar Heatmap** - Daily granularity
2. **Sankey Diagram** - Flow details
3. **Chord Diagram** - Relationship matrix

---

## 🏥 By Dashboard Section

### Humanitarian Crisis Tab
- ✅ **Calendar Heatmap** - Daily casualties
- ✅ **Population Pyramid** - Demographics
- ✅ **Isotype Chart** - Total impact
- ✅ **Area Chart** - Timeline trends
- ✅ **Donut Chart** - Category breakdown

### Infrastructure Tab
- ✅ **Bar Chart** - Damage by category
- ✅ **Bullet Chart** (future) - Destruction progress
- ✅ **Radar Chart** - Multi-facility impact

### Population Impact Tab
- ✅ **Sankey Diagram** - Displacement flows
- ✅ **Chord Diagram** - Regional movement
- ✅ **Population Pyramid** - Age distribution

### Aid & Survival Tab
- ✅ **Area Chart** - Price trends
- ✅ **Stream Graph** - Supply categories
- ✅ **Bar Chart** - Resource availability

---

## 🎨 Visual Complexity

### Simple (Easy to Understand)
- Bar Chart ⭐☆☆☆☆
- Donut Chart ⭐⭐☆☆☆
- Isotype Chart ⭐⭐☆☆☆

### Medium (Requires Some Thought)
- Area Chart ⭐⭐⭐☆☆
- Calendar Heatmap ⭐⭐⭐☆☆
- Population Pyramid ⭐⭐⭐☆☆
- Radar Chart ⭐⭐⭐☆☆

### Complex (Needs Explanation)
- Stream Graph ⭐⭐⭐⭐☆
- Violin Plot ⭐⭐⭐⭐☆
- Sankey Diagram ⭐⭐⭐⭐☆
- Chord Diagram ⭐⭐⭐⭐⭐

---

## 🎯 Decision Tree

```
START: What do you want to show?

├─ Daily patterns over time?
│  └─ Calendar Heatmap ✓
│
├─ Age/gender breakdown?
│  └─ Population Pyramid ✓
│
├─ Humanize large numbers?
│  └─ Isotype Chart ✓
│
├─ Trends over time?
│  ├─ Single metric → Area Chart
│  └─ Multiple categories → Stream Graph
│
├─ Compare categories?
│  ├─ Simple → Bar Chart
│  └─ Multi-dimensional → Radar Chart
│
├─ Show proportions?
│  ├─ Circular → Donut Chart
│  └─ Grid → Waffle Chart (future)
│
├─ Show distributions?
│  ├─ Statistical → Violin Plot
│  └─ Demographic → Population Pyramid
│
└─ Show flows/relationships?
   ├─ Directed → Sankey Diagram
   └─ Bidirectional → Chord Diagram
```

---

## 📊 Chart Comparison Matrix

| Chart | Time | Categories | Proportions | Distribution | Flow | Emotional |
|-------|------|------------|-------------|--------------|------|-----------|
| Area | ✅ | ❌ | ❌ | ❌ | ❌ | ⭐⭐ |
| Bar | ❌ | ✅ | ❌ | ❌ | ❌ | ⭐ |
| Donut | ❌ | ✅ | ✅ | ❌ | ❌ | ⭐⭐ |
| Stream | ✅ | ✅ | ❌ | ❌ | ❌ | ⭐⭐ |
| Radar | ❌ | ✅ | ❌ | ❌ | ❌ | ⭐⭐ |
| Sankey | ❌ | ❌ | ❌ | ❌ | ✅ | ⭐⭐⭐ |
| Violin | ❌ | ✅ | ❌ | ✅ | ❌ | ⭐⭐ |
| Chord | ❌ | ❌ | ❌ | ❌ | ✅ | ⭐⭐ |
| **Calendar** | ✅ | ❌ | ❌ | ❌ | ❌ | ⭐⭐⭐⭐⭐ |
| **Pyramid** | ❌ | ✅ | ✅ | ✅ | ❌ | ⭐⭐⭐⭐⭐ |
| **Isotype** | ❌ | ✅ | ✅ | ❌ | ❌ | ⭐⭐⭐⭐⭐ |

---

## 🎨 Color Coding Guide

### By Severity
- **Red/Destructive**: Deaths, casualties, destruction
- **Orange/Warning**: Injuries, damage, displacement
- **Blue/Primary**: General data, neutral metrics
- **Green/Success**: Aid, recovery, positive metrics

### By Category
- **Children**: Red (#ef4444)
- **Women**: Orange (#f97316)
- **Men**: Blue (#3b82f6)
- **Elderly**: Yellow (#eab308)

### By Region
- **North Gaza**: Red
- **Gaza City**: Orange
- **Central**: Yellow
- **Khan Younis**: Green
- **Rafah**: Blue

---

## 💡 Pro Tips

### For Maximum Impact
1. **Start with Isotype** - Grab attention
2. **Follow with Calendar** - Show daily reality
3. **Detail with Pyramid** - Explain demographics
4. **Support with others** - Provide depth

### For Clarity
1. Use **simple charts** for key messages
2. Use **complex charts** for detailed analysis
3. Always provide **context** and **labels**
4. Include **data source** information

### For Accessibility
1. Use **high contrast** colors
2. Provide **text alternatives**
3. Include **hover tooltips**
4. Support **keyboard navigation** (future)

---

## 🚀 Quick Start

### Need to show daily casualties?
→ **Calendar Heatmap**

### Need to show children affected?
→ **Population Pyramid** or **Isotype Chart**

### Need to show total impact?
→ **Isotype Chart**

### Need to show trends?
→ **Area Chart** or **Stream Graph**

### Need to show comparisons?
→ **Bar Chart** or **Radar Chart**

### Need to show flows?
→ **Sankey** or **Chord Diagram**

---

## 📚 Learn More

- **Implementation**: See individual chart files in `src/components/charts/demo/`
- **Examples**: Visit `/demo/interactive-charts` in the app
- **Documentation**: Read `CHART_LIBRARY_EXPANSION.md`
- **Integration**: See `COMPLETE_DEMO_SHOWCASE.md`

---

**Remember**: The best chart is the one that tells your story most clearly and respectfully. For humanitarian data, always prioritize dignity and accuracy over visual flair.
