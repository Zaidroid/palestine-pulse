# Help Content Integration Guide

This guide shows how to integrate the HelpPanel with comprehensive help content into the Gaza and West Bank dashboards.

## Quick Integration

### Step 1: Import Required Components

Add these imports to your dashboard file:

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
```

### Step 2: Add HelpPanel to Dashboard Header

Add the HelpPanel component to your dashboard's header or action bar:

```tsx
// In GazaWarDashboard.tsx or WestBankDashboard.tsx

export const GazaWarDashboard = () => {
  // ... existing code ...

  return (
    <div className="space-y-6">
      {/* Header with Help Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gaza War Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time humanitarian crisis monitoring
          </p>
        </div>
        
        {/* Add Help Panel here */}
        <div className="flex items-center gap-2">
          {/* Other action buttons */}
          <HelpPanel
            categories={helpCategories}
            triggerVariant="button"
            triggerLabel="Help"
            externalDocsUrl="/docs"
          />
        </div>
      </div>

      {/* Rest of dashboard content */}
    </div>
  );
};
```

### Step 3: Add Context-Specific Help

For section-specific help, you can open to a specific article:

```tsx
// In a specific section like HumanitarianCrisis.tsx

<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-semibold">Humanitarian Crisis</h2>
  
  <HelpPanel
    categories={helpCategories}
    defaultArticleId="casualty-data"
    triggerVariant="icon"
  />
</div>
```

## Integration Examples

### Example 1: Main Dashboard Header

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
import { HelpCircle } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Palestine Pulse</h1>
          {/* Navigation tabs */}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme toggle, language switcher, etc. */}
          
          {/* Help Panel */}
          <HelpPanel
            categories={helpCategories}
            triggerVariant="icon"
            externalDocsUrl="https://docs.example.com"
          />
        </div>
      </div>
    </header>
  );
}
```

### Example 2: Floating Help Button

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";

function DashboardWithFloatingHelp() {
  return (
    <div className="relative">
      {/* Dashboard content */}
      <div className="space-y-6">
        {/* Your dashboard components */}
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <HelpPanel
          categories={helpCategories}
          triggerVariant="button"
          triggerLabel="Need Help?"
          className="shadow-lg"
        />
      </div>
    </div>
  );
}
```

### Example 3: Section-Specific Help

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";

function HumanitarianCrisisSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Humanitarian Crisis</h2>
          <p className="text-sm text-muted-foreground">
            Casualty data and human impact metrics
          </p>
        </div>
        
        {/* Context-specific help */}
        <HelpPanel
          categories={helpCategories}
          defaultArticleId="casualty-data"
          triggerVariant="icon"
        />
      </div>

      {/* Section content */}
    </div>
  );
}
```

### Example 4: Help in Metric Cards

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
import { EnhancedMetricCard } from "@/components/ui/enhanced-metric-card";

function MetricCardWithHelp() {
  return (
    <EnhancedMetricCard
      title="Total Casualties"
      value={12345}
      icon={AlertCircle}
      // Add help button in the card header
      headerAction={
        <HelpPanel
          categories={helpCategories}
          defaultArticleId="casualty-data"
          triggerVariant="icon"
        />
      }
    />
  );
}
```

## Recommended Placements

### Gaza War Dashboard

1. **Main Header** - General help button (icon variant)
2. **Humanitarian Crisis Tab** - Opens to "Understanding Casualty Data"
3. **Infrastructure Tab** - Opens to "Infrastructure Damage Metrics"
4. **Population Impact Tab** - Opens to "Displacement and Population Data"
5. **Aid & Survival Tab** - Opens to "Humanitarian Crisis Indicators"

### West Bank Dashboard

1. **Main Header** - General help button (icon variant)
2. **Occupation Metrics Tab** - Opens to relevant occupation data article
3. **Prisoners & Detention Tab** - Opens to detention data article
4. **Economic Strangulation Tab** - Opens to economic indicators article

## Article ID Reference

Use these article IDs for `defaultArticleId` prop:

### Understanding the Data
- `casualty-data` - Understanding Casualty Data
- `infrastructure-damage` - Infrastructure Damage Metrics
- `displacement-data` - Displacement and Population Data
- `humanitarian-crisis` - Humanitarian Crisis Indicators

### Data Sources & Methodology
- `data-sources` - Primary Data Sources
- `data-quality` - Data Quality Indicators
- `data-updates` - How Data is Updated
- `methodology` - Data Collection Methodology

### How to Use the Dashboard
- `navigation` - Navigating the Dashboard
- `interacting-charts` - Interacting with Charts
- `metric-cards` - Understanding Metric Cards
- `filtering-data` - Filtering and Customizing Views
- `exporting-data` - Exporting and Sharing Data
- `accessibility` - Accessibility Features

### Frequently Asked Questions
- `data-accuracy` - How accurate is the data?
- `update-frequency` - How often is data updated?
- `missing-data` - Why is some data missing or incomplete?
- `compare-sources` - Why do different sources show different numbers?
- `mobile-usage` - Can I use this dashboard on mobile?
- `data-usage` - Can I use this data in my research or reporting?
- `contribute` - How can I contribute or report issues?

## Customization Options

### Trigger Variants

```tsx
// Icon button (minimal)
<HelpPanel
  categories={helpCategories}
  triggerVariant="icon"
/>

// Text button (more prominent)
<HelpPanel
  categories={helpCategories}
  triggerVariant="button"
  triggerLabel="Get Help"
/>
```

### External Documentation Link

```tsx
<HelpPanel
  categories={helpCategories}
  externalDocsUrl="https://docs.palestinepulse.org"
/>
```

### Default Article

```tsx
<HelpPanel
  categories={helpCategories}
  defaultArticleId="navigation"
/>
```

## Best Practices

1. **Main Navigation** - Use icon variant to save space
2. **Section Headers** - Use icon variant with context-specific article
3. **First-Time Users** - Consider showing help panel on first visit
4. **Mobile** - Help panel automatically adapts to mobile screens
5. **Accessibility** - Help panel is fully keyboard navigable

## Testing Checklist

- [ ] Help button is visible and accessible
- [ ] Panel opens smoothly with animation
- [ ] Search functionality works
- [ ] All articles render correctly
- [ ] Related articles links work
- [ ] External docs link works (if provided)
- [ ] Panel closes properly
- [ ] Works on mobile devices
- [ ] Keyboard navigation works
- [ ] Screen reader announces content

## Troubleshooting

### Help Panel Not Opening
- Check that `helpCategories` is imported correctly
- Verify Sheet component is available
- Check for z-index conflicts

### Articles Not Displaying
- Verify article IDs match in `defaultArticleId`
- Check that content is valid React nodes
- Look for TypeScript errors in help-content.tsx

### Search Not Working
- Ensure articles have tags
- Check that search query is being passed correctly
- Verify filter logic in HelpPanel component

## Next Steps

After integration:

1. Test all help articles for accuracy
2. Update content based on user feedback
3. Add more context-specific help where needed
4. Consider adding video tutorials
5. Track which articles are most viewed
6. Update content as dashboard features change
