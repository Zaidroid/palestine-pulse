# Help Content Quick Start Guide

Get the help system up and running in 5 minutes.

## Step 1: Import (30 seconds)

Add these two imports to your dashboard file:

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
```

## Step 2: Add Component (1 minute)

Add the HelpPanel to your dashboard header:

```tsx
export const GazaWarDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Your existing header */}
      <div className="flex items-center justify-between">
        <h1>Gaza War Dashboard</h1>
        
        {/* Add this */}
        <HelpPanel
          categories={helpCategories}
          triggerVariant="icon"
        />
      </div>
      
      {/* Rest of your dashboard */}
    </div>
  );
};
```

## Step 3: Test (30 seconds)

1. Click the help icon (?)
2. Try searching for "casualty"
3. Click an article to read
4. Click "Back to categories"

Done! ✅

## Optional: Context-Specific Help

Want help that opens to a specific article? Add `defaultArticleId`:

```tsx
{/* In Humanitarian Crisis section */}
<HelpPanel
  categories={helpCategories}
  defaultArticleId="casualty-data"
  triggerVariant="icon"
/>
```

## Available Article IDs

Quick reference for `defaultArticleId`:

**Understanding Data:**
- `casualty-data` - Casualty metrics
- `infrastructure-damage` - Building damage
- `displacement-data` - Population displacement
- `humanitarian-crisis` - Food security & aid

**Data Sources:**
- `data-sources` - Where data comes from
- `data-quality` - Quality indicators
- `data-updates` - Update frequency
- `methodology` - How data is collected

**How to Use:**
- `navigation` - Dashboard navigation
- `interacting-charts` - Chart interactions
- `metric-cards` - Understanding cards
- `filtering-data` - Using filters
- `exporting-data` - Export & share
- `accessibility` - Accessibility features

**FAQ:**
- `data-accuracy` - Data accuracy
- `update-frequency` - Update timing
- `missing-data` - Data gaps
- `compare-sources` - Source differences
- `mobile-usage` - Mobile features
- `data-usage` - Using data in research
- `contribute` - Contributing

## Customization Options

### Button Instead of Icon
```tsx
<HelpPanel
  categories={helpCategories}
  triggerVariant="button"
  triggerLabel="Get Help"
/>
```

### Add External Docs Link
```tsx
<HelpPanel
  categories={helpCategories}
  externalDocsUrl="https://docs.example.com"
/>
```

### Floating Help Button
```tsx
<div className="fixed bottom-6 right-6 z-50">
  <HelpPanel
    categories={helpCategories}
    triggerVariant="button"
    triggerLabel="Need Help?"
  />
</div>
```

## That's It!

You now have a fully functional help system with:
- ✅ 22 comprehensive articles
- ✅ Searchable content
- ✅ Related articles
- ✅ Mobile-responsive
- ✅ Accessible

## Need More?

- **Full documentation:** See `help-content-README.md`
- **Integration examples:** See `help-content-integration-guide.md`
- **Implementation details:** See `HELP_CONTENT_IMPLEMENTATION_SUMMARY.md`
- **Demo component:** Import `HelpPanelDemo` from `@/components/ui/help-panel-demo`

## Troubleshooting

**Help panel not opening?**
- Check imports are correct
- Verify `helpCategories` is defined
- Look for console errors

**Articles not showing?**
- Check article ID spelling
- Verify `defaultArticleId` matches an actual article
- Check TypeScript errors

**Search not working?**
- Articles need tags to be searchable
- Check search query is being passed
- Verify filter logic

## Support

Questions? Check the FAQ articles in the help panel itself! 😊
