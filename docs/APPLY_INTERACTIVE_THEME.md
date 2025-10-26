# How to Apply Interactive Theme Features

Quick guide to add the new interactive features to your existing dashboard components.

## 1. Animated Background (Already Applied)

The animated mesh gradient background is **automatically active** on all pages. No changes needed!

## 2. Upgrade Your Cards

### Before:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Statistics</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### After (Choose one style):

**Option A: Animated Gradient Border**
```tsx
<Card className="card-gradient card-elevated">
  <CardHeader>
    <CardTitle>Statistics</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Option B: Gradient Background**
```tsx
<Card className="card-gradient-bg card-elevated">
  <CardHeader>
    <CardTitle>Statistics</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Option C: Interactive (for clickable cards)**
```tsx
<Card className="card-interactive">
  <CardHeader>
    <CardTitle>Statistics</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Option D: Stat Cards (for metrics)**
```tsx
<Card className="stat-card">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Total</p>
        <p className="text-3xl font-bold text-gradient">12,543</p>
      </div>
      <Icon className="h-8 w-8 text-primary opacity-50" />
    </div>
  </CardContent>
</Card>
```

## 3. Add Counter Animations

### For Stat Numbers:

```tsx
// Wrap your stat grid with stagger animation
<div className="grid grid-cols-4 gap-4 stagger-children">
  <Card className="stat-card">
    <CardContent className="pt-6">
      <p className="text-3xl font-bold text-gradient animate-counter">
        {yourNumber.toLocaleString()}
      </p>
    </CardContent>
  </Card>
  {/* More cards... */}
</div>
```

### For Multiple Counters with Stagger:

```tsx
<div className="grid grid-cols-4 gap-4">
  <Card className="stat-card animate-counter-delay-1">...</Card>
  <Card className="stat-card animate-counter-delay-2">...</Card>
  <Card className="stat-card animate-counter-delay-3">...</Card>
  <Card className="stat-card animate-counter-delay-4">...</Card>
</div>
```

## 4. Enhance Text

### Make Titles Stand Out:

```tsx
// Static gradient
<h1 className="text-4xl font-bold text-gradient">
  Dashboard Title
</h1>

// Animated gradient (for hero sections)
<h1 className="text-4xl font-bold text-gradient-animated">
  Welcome to Dashboard
</h1>
```

### Interactive Links:

```tsx
<a href="#" className="highlight-hover">
  Learn More
</a>
```

## 5. Add Glow to Important Elements

```tsx
// Important alerts or critical stats
<Card className="glow-primary card-elevated">
  <CardHeader>
    <CardTitle>Critical Alert</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// Featured content
<Card className="glow-secondary card-elevated">
  <CardHeader>
    <CardTitle>Featured</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

## 6. Hero Sections

```tsx
<div className="gradient-bg-mesh rounded-2xl p-8 mb-8">
  <h1 className="text-4xl font-bold text-gradient-animated mb-4">
    Gaza War Dashboard
  </h1>
  <p className="text-lg text-muted-foreground">
    Real-time humanitarian crisis monitoring
  </p>
</div>
```

## 7. Loading States

```tsx
// Skeleton loader
<div className="skeleton h-20 w-full" />

// Shimmer effect
<div className="animate-shimmer-wave h-20 w-full rounded-lg" />
```

## 8. Background Patterns (Optional)

Add subtle patterns to specific sections:

```tsx
// Dot pattern
<section className="bg-dots p-8">
  {/* Content */}
</section>

// Grid pattern
<section className="bg-grid p-8">
  {/* Content */}
</section>

// Radial gradient
<section className="gradient-bg-radial p-8">
  {/* Content */}
</section>
```

## Quick Wins for Your Dashboard

### 1. Update Main Container:
```tsx
<div className="page-transition">
  {/* Your dashboard content */}
</div>
```

### 2. Update Stat Cards Grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="stat-card animate-counter-delay-1">
    <CardContent className="pt-6">
      <p className="text-sm text-muted-foreground">Deaths</p>
      <p className="text-3xl font-bold text-gradient">{deaths}</p>
    </CardContent>
  </Card>
  {/* Repeat with delay-2, delay-3, delay-4 */}
</div>
```

### 3. Update Section Cards:
```tsx
<Card className="card-gradient-bg card-elevated">
  <CardHeader>
    <CardTitle>Humanitarian Crisis</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Your content */}
  </CardContent>
</Card>
```

### 4. Add Hero Section:
```tsx
<div className="gradient-bg-mesh rounded-2xl p-8 mb-8">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gradient-animated mb-2">
        {dashboardTitle}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Badge variant="destructive" className="animate-pulse-glow">
      Live
    </Badge>
  </div>
</div>
```

## Performance Notes

- All animations respect `prefers-reduced-motion`
- GPU-accelerated transforms for smooth performance
- Animations are optimized for 60fps
- Mobile devices get simplified animations automatically

## Mix and Match

You can combine multiple classes:

```tsx
// Gradient border + glow + elevation
<Card className="card-gradient glow-primary card-elevated">
  ...
</Card>

// Interactive + gradient background
<Card className="card-interactive card-gradient-bg">
  ...
</Card>

// Stat card + counter animation + delay
<Card className="stat-card animate-counter-delay-1">
  ...
</Card>
```

## Don't Overdo It!

**Good Practice:**
- Use animated borders on 1-2 hero cards per page
- Apply glows only to critical/important elements
- Use text gradients for main titles only
- Keep most cards with subtle effects

**Avoid:**
- Every card having animated borders
- Multiple glowing elements competing for attention
- Animated text everywhere
- Too many different effects on one page

The key is **subtle sophistication**, not overwhelming animation!
