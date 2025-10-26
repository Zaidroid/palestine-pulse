# Example: Upgrading Gaza Dashboard with Interactive Theme

This shows how to apply the new interactive theme features to your existing dashboard.

## Before & After Comparison

### BEFORE - Basic Stats Section
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Deaths</p>
          <p className="text-3xl font-bold">{deaths}</p>
        </div>
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Injured</p>
          <p className="text-3xl font-bold">{injured}</p>
        </div>
        <Heart className="h-8 w-8 text-warning" />
      </div>
    </CardContent>
  </Card>
  
  {/* More cards... */}
</div>
```

### AFTER - Interactive Stats with Animations
```tsx
{/* Add hero section at the top */}
<div className="gradient-bg-mesh rounded-2xl p-6 md:p-8 mb-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-gradient-animated mb-2">
        Gaza War Dashboard
      </h1>
      <p className="text-muted-foreground">
        Real-time humanitarian crisis monitoring
      </p>
    </div>
    <Badge variant="destructive" className="animate-pulse-glow">
      Live
    </Badge>
  </div>
</div>

{/* Enhanced stats grid with animations */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <Card className="stat-card animate-counter-delay-1">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Deaths</p>
          <p className="text-3xl font-bold text-gradient">
            {deaths.toLocaleString()}
          </p>
        </div>
        <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
      </div>
    </CardContent>
  </Card>
  
  <Card className="stat-card animate-counter-delay-2">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Injured</p>
          <p className="text-3xl font-bold text-gradient">
            {injured.toLocaleString()}
          </p>
        </div>
        <Heart className="h-8 w-8 text-warning opacity-50" />
      </div>
    </CardContent>
  </Card>
  
  <Card className="stat-card animate-counter-delay-3">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Displaced</p>
          <p className="text-3xl font-bold text-gradient">
            {displaced.toLocaleString()}
          </p>
        </div>
        <Users className="h-8 w-8 text-secondary opacity-50" />
      </div>
    </CardContent>
  </Card>
  
  <Card className="stat-card animate-counter-delay-4">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Buildings Destroyed</p>
          <p className="text-3xl font-bold text-gradient">
            {buildings.toLocaleString()}
          </p>
        </div>
        <Building2 className="h-8 w-8 text-primary opacity-50" />
      </div>
    </CardContent>
  </Card>
</div>
```

## Section Cards Enhancement

### BEFORE - Basic Section Card
```tsx
<Card className="mb-6">
  <CardHeader>
    <CardTitle>Humanitarian Crisis</CardTitle>
    <CardDescription>Current situation overview</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### AFTER - Interactive Section Card
```tsx
<Card className="card-gradient-bg card-elevated mb-6">
  <CardHeader>
    <CardTitle className="text-gradient">Humanitarian Crisis</CardTitle>
    <CardDescription>Current situation overview</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Critical Alert Enhancement

### BEFORE - Basic Alert
```tsx
<Card className="border-destructive">
  <CardHeader>
    <CardTitle className="text-destructive">Critical Alert</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Urgent humanitarian situation</p>
  </CardContent>
</Card>
```

### AFTER - Glowing Alert
```tsx
<Card className="glow-primary card-elevated border-destructive">
  <CardHeader>
    <CardTitle className="text-destructive">Critical Alert</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Urgent humanitarian situation</p>
    <Badge variant="destructive" className="animate-pulse-glow mt-2">
      Urgent
    </Badge>
  </CardContent>
</Card>
```

## Complete Page Wrapper

### Add to your main return:

```tsx
export const GazaWarDashboard = () => {
  // ... your existing code ...

  return (
    <div className="page-transition"> {/* Add this wrapper */}
      <MobileOptimizedContainer>
        {/* Hero Section - NEW */}
        <div className="gradient-bg-mesh rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-animated mb-2">
                Gaza War Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time humanitarian crisis monitoring and analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="animate-pulse-glow">
                Live
              </Badge>
              <Badge variant="secondary">
                Updated {lastUpdate}
              </Badge>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem href="/" icon={Home}>Home</BreadcrumbItem>
          <BreadcrumbItem>Gaza War</BreadcrumbItem>
        </Breadcrumbs>

        {/* Stats Grid - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Your stat cards with new classes */}
        </div>

        {/* Rest of your dashboard */}
        {/* ... */}
      </MobileOptimizedContainer>
    </div>
  );
};
```

## Loading States

### BEFORE
```tsx
{isLoading && <div>Loading...</div>}
```

### AFTER
```tsx
{isLoading && (
  <div className="space-y-4">
    <div className="skeleton h-32 w-full" />
    <div className="skeleton h-64 w-full" />
    <div className="skeleton h-48 w-full" />
  </div>
)}
```

## Tab Content Enhancement

### Wrap tab content with stagger animation:

```tsx
<TabsContent value="humanitarian">
  <div className="stagger-children space-y-6">
    <Card className="card-gradient-bg card-elevated">
      {/* Content */}
    </Card>
    <Card className="card-gradient-bg card-elevated">
      {/* Content */}
    </Card>
    <Card className="card-gradient-bg card-elevated">
      {/* Content */}
    </Card>
  </div>
</TabsContent>
```

## Quick Checklist for Your Dashboard

- [ ] Add `page-transition` wrapper to main container
- [ ] Add hero section with `gradient-bg-mesh`
- [ ] Update stat cards with `stat-card` and `animate-counter-delay-*`
- [ ] Add `text-gradient` to stat numbers
- [ ] Update section cards with `card-gradient-bg card-elevated`
- [ ] Add `glow-primary` to critical alerts
- [ ] Use `animate-pulse-glow` on live badges
- [ ] Wrap tab content with `stagger-children`
- [ ] Update loading states with `skeleton`
- [ ] Add `.toLocaleString()` to numbers for formatting

## Result

Your dashboard will have:
- ✨ Animated background that flows subtly
- 🎯 Numbers that count up smoothly
- 💫 Cards that respond to hover
- 🌈 Beautiful gradient text
- ⚡ Smooth transitions between states
- 🎨 Rich, layered colors instead of flat grays
- 🔥 Professional, modern appearance

All while maintaining the serious, respectful tone appropriate for humanitarian data!
