# Interactive Theme - Quick Reference

## 🎯 When to Use What

### Cards

| Use Case | Classes | Effect |
|----------|---------|--------|
| **Hero/Featured Card** | `card-gradient card-elevated` | Animated gradient border, lifts on hover |
| **Section Card** | `card-gradient-bg card-elevated` | Subtle gradient background, lifts on hover |
| **Stat/Metric Card** | `stat-card animate-counter-delay-1` | Animated top border sweep, counter animation |
| **Clickable Card** | `card-interactive` | Lifts and glows on hover |
| **Critical Alert** | `glow-primary card-elevated` | Glowing effect, elevated |
| **Featured Content** | `glow-secondary card-elevated` | Secondary glow, elevated |
| **Basic Card** | `card-elevated` | Simple lift on hover |

### Text

| Use Case | Classes | Effect |
|----------|---------|--------|
| **Main Title** | `text-gradient-animated` | Flowing gradient animation |
| **Section Title** | `text-gradient` | Static gradient |
| **Stat Number** | `text-gradient` | Gradient on numbers |
| **Interactive Link** | `highlight-hover` | Animated underline on hover |

### Backgrounds

| Use Case | Classes | Effect |
|----------|---------|--------|
| **Hero Section** | `gradient-bg-mesh` | Multi-color gradient |
| **Section Background** | `gradient-bg-subtle` | Gentle gradient |
| **Spotlight Area** | `gradient-bg-radial` | Radial gradient |
| **Subtle Pattern** | `bg-dots` or `bg-grid` | Dot/grid pattern |
| **Glass Overlay** | `glass-effect` | Frosted glass blur |

### Animations

| Use Case | Classes | Effect |
|----------|---------|--------|
| **Counter (1st)** | `animate-counter-delay-1` | Count up with 0.1s delay |
| **Counter (2nd)** | `animate-counter-delay-2` | Count up with 0.2s delay |
| **Counter (3rd)** | `animate-counter-delay-3` | Count up with 0.3s delay |
| **Counter (4th)** | `animate-counter-delay-4` | Count up with 0.4s delay |
| **Pulsing Badge** | `animate-pulse-glow` | Pulsing glow (3s) |
| **Floating Element** | `animate-float` | Gentle float (6s) |
| **Slide In** | `animate-slide-in` | Slide from bottom |
| **Scale In** | `animate-scale-in` | Scale up |
| **Stagger Children** | `stagger-children` | Children fade in sequence |

### Loading States

| Use Case | Classes | Effect |
|----------|---------|--------|
| **Skeleton** | `skeleton h-20 w-full` | Pulsing skeleton |
| **Shimmer** | `animate-shimmer-wave` | Shimmer wave |

## 📋 Common Patterns

### Stat Card Grid
```tsx
<div className="grid grid-cols-4 gap-4">
  <Card className="stat-card animate-counter-delay-1">
    <CardContent className="pt-6">
      <p className="text-sm text-muted-foreground">Label</p>
      <p className="text-3xl font-bold text-gradient">{number}</p>
    </CardContent>
  </Card>
  {/* Repeat with delay-2, delay-3, delay-4 */}
</div>
```

### Hero Section
```tsx
<div className="gradient-bg-mesh rounded-2xl p-8 mb-6">
  <h1 className="text-4xl font-bold text-gradient-animated mb-2">
    Title
  </h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Section with Cards
```tsx
<div className="stagger-children space-y-6">
  <Card className="card-gradient-bg card-elevated">
    <CardHeader>
      <CardTitle className="text-gradient">Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
  </Card>
  {/* More cards */}
</div>
```

### Critical Alert
```tsx
<Card className="glow-primary card-elevated border-destructive">
  <CardHeader>
    <CardTitle className="text-destructive">Alert</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Message</p>
    <Badge variant="destructive" className="animate-pulse-glow">
      Urgent
    </Badge>
  </CardContent>
</Card>
```

### Loading State
```tsx
{isLoading ? (
  <div className="space-y-4">
    <div className="skeleton h-32 w-full" />
    <div className="skeleton h-64 w-full" />
  </div>
) : (
  <div className="page-transition">
    {/* Content */}
  </div>
)}
```

## 🎨 Color Classes

### Gradients
- `text-gradient` - Primary to secondary gradient
- `text-gradient-animated` - Animated gradient

### Glows
- `glow-primary` - Primary color glow
- `glow-secondary` - Secondary color glow

## ⚡ Performance Tips

1. **Don't overuse animations** - 1-2 animated borders per page max
2. **Use delays wisely** - Stagger animations for polish
3. **Combine classes** - Mix effects for unique looks
4. **Test on mobile** - Animations are simplified automatically
5. **Respect motion preferences** - All animations honor `prefers-reduced-motion`

## 🚫 What NOT to Do

❌ Every card with `card-gradient`
❌ Multiple `glow-primary` elements competing
❌ `text-gradient-animated` on every heading
❌ Too many different effects on one page
❌ Animations on every element

## ✅ What TO Do

✅ Use `card-gradient` on 1-2 hero cards
✅ Apply glows to critical elements only
✅ Use `text-gradient-animated` for main title
✅ Keep most cards with subtle effects
✅ Mix and match thoughtfully

## 🎯 Priority Guide

### High Priority (Use These)
1. `page-transition` on main container
2. `stat-card` + `animate-counter-delay-*` on metrics
3. `text-gradient` on stat numbers
4. `card-elevated` on most cards
5. `gradient-bg-mesh` on hero section

### Medium Priority (Use Selectively)
1. `card-gradient-bg` on section cards
2. `text-gradient-animated` on main title
3. `stagger-children` on tab content
4. `glow-primary` on critical alerts
5. `animate-pulse-glow` on live badges

### Low Priority (Use Sparingly)
1. `card-gradient` on 1-2 featured cards
2. `animate-float` on special elements
3. `bg-dots` or `bg-grid` on specific sections
4. `glass-effect` on overlays
5. `spotlight-effect` on interactive areas

## 📱 Mobile Considerations

On mobile, these are automatically simplified:
- Animations run faster (0.2s instead of 0.4s)
- Shadows are reduced
- Complex effects are simplified
- Touch targets are enlarged

## 🔍 Debug Tips

If something doesn't look right:
1. Check if parent has `overflow: hidden`
2. Verify z-index stacking
3. Test in both light and dark mode
4. Check browser console for errors
5. Ensure Tailwind classes are not conflicting

## 📚 Full Documentation

- `MODERN_THEME_UPDATE.md` - Complete feature list
- `APPLY_INTERACTIVE_THEME.md` - Step-by-step guide
- `EXAMPLE_DASHBOARD_UPGRADE.md` - Real examples
- `INTERACTIVE_THEME_SUMMARY.md` - Overview

---

**Remember**: Subtle sophistication > overwhelming animation!
