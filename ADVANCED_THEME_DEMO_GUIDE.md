# Advanced Theme Demo Guide

## 🎨 Overview

The Advanced Theme Demo is a comprehensive showcase of the humanitarian crisis dashboard theme with cutting-edge interactive components, stunning visuals, and respectful design principles.

## 🚀 Quick Start

### Access the Demo

Navigate to: **`http://localhost:5173/demo/advanced-theme`**

Or add a link in your navigation:

```tsx
<Link to="/demo/advanced-theme">Advanced Theme Demo</Link>
```

## ✨ Features

### 1. **Expandable Stat Cards**

Interactive cards that expand to show detailed breakdowns and can open full modals.

**Features:**
- Click to expand inline
- "View Full Details" button opens modal
- Animated transitions
- Data source badges
- Trend indicators
- Detailed breakdowns

**Usage:**

```tsx
import { ExpandableStatCard } from '@/components/ui/expandable-stat-card';
import { AlertTriangle } from 'lucide-react';

<ExpandableStatCard
  title="Confirmed Deaths"
  value={45000}
  icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
  accentColor="destructive"
  breakdown={[
    { label: "Children", value: 18000, description: "40% of total casualties" },
    { label: "Women", value: 13500, description: "30% of total casualties" },
    // ... more items
  ]}
  source="Gaza Ministry of Health"
  sourceUrl="https://example.com"
  lastUpdated="Updated 2 hours ago"
  methodology="Direct hospital reports and field documentation"
  additionalInfo={
    <p>Additional context about the data...</p>
  }
  trend={{ value: 12, label: "from last week", direction: "up" }}
/>
```

### 2. **Data Source Badges**

Transparent sourcing with hover details showing methodology and reliability.

**Features:**
- Verified indicator
- Hover to see full details
- Reliability rating (high/medium/low)
- Methodology description
- Last updated timestamp
- External link to source

**Usage:**

```tsx
import { DataSourceBadge } from '@/components/ui/data-source-badge';

<DataSourceBadge 
  source="Gaza Ministry of Health"
  url="https://example.com"
  verified={true}
  lastUpdated="Updated 2 hours ago"
  methodology="Direct hospital reports verified by international observers"
  reliability="high"
/>
```

### 3. **Animated Tab System**

Smooth tab navigation with animated transitions.

**Features:**
- Active tab highlighting
- Smooth transitions
- Icon support
- Responsive design

**Implementation:**

```tsx
const tabs = [
  { id: 'overview', label: 'Overview', icon: <Home className="h-4 w-4" /> },
  { id: 'statistics', label: 'Statistics', icon: <TrendingUp className="h-4 w-4" /> },
];

<div className="flex gap-2 p-1 bg-muted/50 rounded-lg border border-border">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`
        flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md
        font-medium text-sm transition-all duration-300
        ${activeTab === tab.id
          ? 'bg-background text-foreground shadow-theme-md'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }
      `}
    >
      {tab.icon}
      <span>{tab.label}</span>
    </button>
  ))}
</div>
```

### 4. **Interactive Charts**

Stunning visual representations with animations.

**Features:**
- Animated bar charts
- Progress indicators
- Gradient fills
- Data source attribution
- Responsive design

**Example:**

```tsx
<Card className="card-gradient-bg">
  <CardHeader>
    <CardTitle>Casualties Over Time</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.month}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-8 bg-muted rounded-lg overflow-hidden">
            <div 
              className="h-full bg-destructive transition-all duration-1000"
              style={{ 
                width: `${item.value}%`,
                animationDelay: `${i * 100}ms`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

### 5. **Glass Morphism Effects**

Ultra-realistic frosted glass with proper light refraction.

**Features:**
- 140px blur
- 500% saturation
- Neutral gray in dark mode (no blue tint)
- Multiple shadow layers
- Reflection gradients

**Usage:**

```tsx
<div className="glass-effect rounded-xl p-6">
  <h2>Glass Content</h2>
  <p>Beautiful frosted glass effect</p>
</div>
```

## 🎨 Design Principles

### Color System

**Light Mode:**
- Warm, sophisticated palette
- Soft gray backgrounds
- Muted accent colors
- High contrast for readability

**Dark Mode:**
- Rich, layered dark theme
- Neutral gray glass (NO blue tint)
- Visible but respectful colors
- Glowing borders and shadows

### Accent Colors

```tsx
accentColor options:
- 'destructive' - Red for critical data
- 'warning' - Amber for concerning data
- 'secondary' - Green for neutral data
- 'muted-foreground' - Gray for infrastructure
- 'primary' - Deep red for primary actions
```

### Animation Timing

- **Fast:** 200ms - Micro-interactions
- **Normal:** 400ms - Standard transitions
- **Slow:** 600ms - Emphasis animations
- **Counter:** 1500ms - Number animations

## 📱 Responsive Design

All components are fully responsive:

- **Mobile:** Stacked layouts, touch-friendly targets
- **Tablet:** Optimized spacing and sizing
- **Desktop:** Full feature set with hover effects

## ♿ Accessibility

- High contrast ratios (WCAG AA compliant)
- Keyboard navigation support
- Screen reader friendly
- Focus visible states
- Reduced motion support

## 🎭 Available CSS Classes

### Animations

```css
.animate-fade-in          /* Fade in with slide up */
.animate-slide-in         /* Slide in from bottom */
.animate-scale-in         /* Scale in */
.animate-counter          /* Counter animation */
.animate-pulse-glow       /* Subtle glow pulse */
.animate-shimmer-wave     /* Loading shimmer */
.animate-slide-down       /* Expand down */
.animate-bounce-in        /* Bounce in modal */
.animate-glow-pulse       /* Interactive glow */
```

### Card Variants

```css
.stat-card               /* Stat card with hover lift */
.card-elevated           /* Elevated with shadow */
.card-gradient-bg        /* Subtle gradient background */
.card-interactive        /* Interactive with glow */
.glass-effect            /* Frosted glass morphism */
```

### Shadows

```css
.shadow-theme-sm         /* Small shadow */
.shadow-theme-md         /* Medium shadow */
.shadow-theme-lg         /* Large shadow */
.shadow-theme-xl         /* Extra large shadow */
.shadow-theme-2xl        /* 2X large shadow */
.shadow-theme-glow       /* Glow effect */
```

## 🔧 Customization

### Modify Accent Colors

Edit `src/index.css`:

```css
:root {
  --primary: 0 70% 45%;        /* Deep red */
  --destructive: 0 75% 52%;    /* Danger red */
  --warning: 35 85% 52%;       /* Amber */
  --secondary: 150 15% 40%;    /* Muted green */
}
```

### Adjust Animation Speed

```css
:root {
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 600ms;
}
```

### Customize Glass Effect

```css
.glass-effect {
  backdrop-filter: blur(140px) saturate(500%);
  /* Adjust blur and saturation */
}
```

## 📊 Integration Examples

### In Gaza Dashboard

```tsx
import { ExpandableStatCard } from '@/components/ui/expandable-stat-card';

// Replace existing stat cards
<ExpandableStatCard
  title="Casualties"
  value={casualties.total}
  icon={<AlertTriangle />}
  accentColor="destructive"
  breakdown={casualties.breakdown}
  source="Gaza Ministry of Health"
  // ... other props
/>
```

### In West Bank Dashboard

```tsx
import { DataSourceBadge } from '@/components/ui/data-source-badge';

// Add source attribution
<DataSourceBadge 
  source="Palestinian Prisoners Society"
  url="https://example.com"
  lastUpdated="Daily updates"
/>
```

## 🎯 Best Practices

### 1. **Respectful Data Presentation**

- Use somber colors for tragedy
- Avoid cheerful animations
- Provide context and sources
- Honor the gravity of content

### 2. **Performance**

- Use `will-change` sparingly
- Lazy load heavy components
- Optimize animations for mobile
- Reduce motion for accessibility

### 3. **Data Transparency**

- Always include data sources
- Show last updated time
- Explain methodology
- Indicate reliability

### 4. **User Experience**

- Progressive disclosure (expand for details)
- Clear visual hierarchy
- Consistent interactions
- Helpful feedback

## 🐛 Troubleshooting

### Glass Effect Not Visible

**Issue:** Glass effect appears solid or not blurred.

**Solution:**
1. Ensure colorful background behind glass
2. Check browser support for `backdrop-filter`
3. Verify CSS is loaded correctly

### Animations Not Working

**Issue:** Elements don't animate.

**Solution:**
1. Check `prefers-reduced-motion` setting
2. Verify animation classes are applied
3. Ensure CSS is loaded

### Modal Not Closing

**Issue:** Modal stays open when clicking backdrop.

**Solution:**
1. Check event propagation (`stopPropagation`)
2. Verify state management
3. Test click handlers

## 📚 Additional Resources

- **Theme Documentation:** `FINAL_THEME_SUMMARY.md`
- **Visual Guide:** `VISUAL_GUIDE.md`
- **Component Examples:** `/demo/advanced-theme`
- **CSS Reference:** `src/index.css`

## 🎉 What's Next?

1. **Integrate into main dashboards**
2. **Add real data connections**
3. **Implement chart libraries** (Recharts, Chart.js)
4. **Add more interactive visualizations**
5. **Create mobile-optimized views**
6. **Add export/share functionality**

---

**Built with respect and dignity for humanitarian crisis documentation.**
