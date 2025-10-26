# Quick Reference - Advanced Theme Demo

## 🚀 Access Demo

```
http://localhost:5173/demo/advanced-theme
```

## 📦 Import Components

```tsx
// Expandable Stat Card
import { ExpandableStatCard } from '@/components/ui/expandable-stat-card';

// Data Source Badge
import { DataSourceBadge } from '@/components/ui/data-source-badge';

// Full Demo
import { AdvancedThemeDemo } from '@/components/ui/advanced-theme-demo';
```

## 🎨 Quick Examples

### Expandable Stat Card

```tsx
<ExpandableStatCard
  title="Confirmed Deaths"
  value={45000}
  icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
  accentColor="destructive"
  breakdown={[
    { label: "Children", value: 18000 },
    { label: "Women", value: 13500 }
  ]}
  source="Gaza Ministry of Health"
  sourceUrl="https://example.com"
  lastUpdated="2 hours ago"
/>
```

### Data Source Badge

```tsx
<DataSourceBadge 
  source="UN OCHA"
  url="https://example.com"
  verified={true}
  lastUpdated="Daily"
  reliability="high"
/>
```

### Glass Effect

```tsx
<div className="glass-effect rounded-xl p-6">
  Content with frosted glass background
</div>
```

### Animated Tabs

```tsx
const [activeTab, setActiveTab] = useState('overview');

<div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
  <button
    onClick={() => setActiveTab('overview')}
    className={activeTab === 'overview' 
      ? 'bg-background shadow-theme-md' 
      : 'hover:bg-background/50'
    }
  >
    Overview
  </button>
</div>
```

## 🎭 CSS Classes

### Cards
```css
.stat-card              /* Stat card with hover */
.card-elevated          /* Elevated shadow */
.card-gradient-bg       /* Gradient background */
.card-interactive       /* Interactive glow */
.glass-effect           /* Frosted glass */
```

### Animations
```css
.animate-fade-in        /* Fade in */
.animate-slide-in       /* Slide in */
.animate-scale-in       /* Scale in */
.animate-counter        /* Counter animation */
```

### Shadows
```css
.shadow-theme-sm        /* Small */
.shadow-theme-md        /* Medium */
.shadow-theme-lg        /* Large */
.shadow-theme-xl        /* Extra large */
```

## 🎨 Accent Colors

```tsx
accentColor="destructive"      // Red - Critical
accentColor="warning"          // Amber - Warning
accentColor="secondary"        // Green - Neutral
accentColor="muted-foreground" // Gray - Infrastructure
accentColor="primary"          // Deep red - Primary
```

## 📊 Badge Variants

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
```

## ⚡ Animation Timing

```css
--duration-fast: 200ms      /* Micro-interactions */
--duration-normal: 400ms    /* Standard transitions */
--duration-slow: 600ms      /* Emphasis */
```

## 🎯 Key Features

✅ **Expandable stat cards** with modal details  
✅ **Data source badges** with hover menus  
✅ **Interactive charts** with animations  
✅ **Animated tab system**  
✅ **Glass morphism** effects  
✅ **Dark/light theme** support  
✅ **Fully responsive**  
✅ **Accessibility compliant**  

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🔧 Theme Toggle

```tsx
import { useThemePreference } from '@/hooks/useThemePreference';

const { theme, toggleTheme } = useThemePreference();

<button onClick={toggleTheme}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

## 💡 Pro Tips

1. **Always include data sources** for transparency
2. **Use somber colors** for crisis data
3. **Provide context** in additionalInfo
4. **Test in both themes** (light/dark)
5. **Check mobile responsiveness**
6. **Add loading states** for async data
7. **Use trend indicators** for time-series data
8. **Include methodology** for credibility

## 🐛 Common Issues

**Glass not visible?**
- Add colorful background behind it
- Check browser support for backdrop-filter

**Animations not working?**
- Check prefers-reduced-motion
- Verify CSS is loaded

**Modal not closing?**
- Check event.stopPropagation()
- Verify state management

## 📚 Documentation

- Full Guide: `ADVANCED_THEME_DEMO_GUIDE.md`
- Theme Summary: `FINAL_THEME_SUMMARY.md`
- Visual Guide: `VISUAL_GUIDE.md`

---

**Quick. Simple. Respectful.**
