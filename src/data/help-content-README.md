# Help Content Documentation

This directory contains comprehensive help content for the Palestine Pulse Dashboard, organized into four main categories.

## Content Structure

### 1. Understanding the Data
Articles explaining how to interpret and contextualize the data presented in the dashboard.

**Articles:**
- **Understanding Casualty Data** - Explains casualty metrics, data limitations, and trend interpretation
- **Infrastructure Damage Metrics** - Details damage categories, healthcare facilities, and educational facilities
- **Displacement and Population Data** - Covers types of displacement, population impact, and humanitarian implications
- **Humanitarian Crisis Indicators** - Explains food security (IPC phases), aid access, and critical thresholds

### 2. Data Sources & Methodology
Information about where data comes from and how it's collected and verified.

**Articles:**
- **Primary Data Sources** - Lists and describes all major data sources (MoH, OCHA, WFP, B'Tselem, World Bank)
- **Data Quality Indicators** - Explains quality levels (high/medium/low) and freshness indicators
- **How Data is Updated** - Details update frequencies, auto-refresh, and data lag
- **Data Collection Methodology** - Describes collection methods, limitations, and challenges

### 3. How to Use the Dashboard
Practical guides for navigating and interacting with dashboard features.

**Articles:**
- **Navigating the Dashboard** - Main navigation, section tabs, mobile navigation, and breadcrumbs
- **Interacting with Charts** - Hover interactions, chart types, mobile gestures, and legend controls
- **Understanding Metric Cards** - Card components, real-time indicators, expandable cards, and contextual help
- **Filtering and Customizing Views** - Filter panel, date ranges, category filters, and saving presets
- **Exporting and Sharing Data** - Export formats (PNG, SVG, PDF, CSV, JSON), sharing views, and attribution
- **Accessibility Features** - Keyboard navigation, screen reader support, visual accessibility, and reduced motion

### 4. Frequently Asked Questions
Common questions and detailed answers about data accuracy, updates, usage, and more.

**Articles:**
- **How accurate is the data?** - Data confidence levels, limitations, cross-verification, and conservative estimates
- **How often is data updated?** - Update frequencies by data type, auto-refresh, and last updated timestamps
- **Why is some data missing or incomplete?** - Access restrictions, infrastructure damage, verification delays, and resource constraints
- **Why do different sources show different numbers?** - Methodology differences, timing, scope, and interpretation guidance
- **Can I use this dashboard on mobile?** - Mobile features, touch gestures, navigation, and performance
- **Can I use this data in my research or reporting?** - Usage rights, attribution requirements, citation examples, and data integrity
- **How can I contribute or report issues?** - Reporting data/technical issues, suggesting features, contributing data, and providing feedback

## Usage

### Basic Implementation

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";

function MyComponent() {
  return (
    <HelpPanel
      categories={helpCategories}
      triggerVariant="icon"
      externalDocsUrl="https://docs.example.com"
    />
  );
}
```

### With Default Article

Open directly to a specific article:

```tsx
<HelpPanel
  categories={helpCategories}
  defaultArticleId="navigation"
  triggerVariant="button"
  triggerLabel="Quick Start"
/>
```

### Integration in Dashboard Header

```tsx
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";

function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <h1>Dashboard</h1>
      <div className="flex items-center gap-2">
        {/* Other header actions */}
        <HelpPanel
          categories={helpCategories}
          triggerVariant="icon"
        />
      </div>
    </header>
  );
}
```

## Content Guidelines

### Adding New Articles

When adding new help articles, follow this structure:

```tsx
{
  id: "unique-article-id",
  title: "Article Title",
  category: "Category Name",
  tags: ["tag1", "tag2", "tag3"],
  content: (
    <div className="space-y-4">
      <p>Introduction paragraph...</p>
      
      <h4 className="font-semibold mt-4">Section Heading</h4>
      <p>Section content...</p>
      
      <ul className="list-disc pl-5 space-y-2">
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    </div>
  ),
  relatedArticles: ["related-id-1", "related-id-2"],
}
```

### Content Best Practices

1. **Clear and Concise** - Use simple language and short paragraphs
2. **Structured** - Use headings, lists, and spacing for readability
3. **Contextual** - Provide relevant examples and use cases
4. **Linked** - Connect related articles for deeper exploration
5. **Tagged** - Use descriptive tags for searchability
6. **Accessible** - Ensure content works with screen readers

### Styling Guidelines

- Use `<h4>` for section headings with `font-semibold mt-4`
- Use `<ul>` with `list-disc pl-5 space-y-2` for lists
- Use `<strong>` for emphasis within paragraphs
- Use `space-y-4` on container divs for consistent spacing
- Use bordered boxes for highlighting important information:
  ```tsx
  <div className="p-3 border rounded-lg">
    <h5 className="font-semibold">Title</h5>
    <p className="text-sm text-muted-foreground mt-1">Content</p>
  </div>
  ```

## Utility Functions

### Get All Articles

```tsx
import { getAllArticles } from "@/data/help-content";

const articles = getAllArticles();
```

### Get Article by ID

```tsx
import { getArticleById } from "@/data/help-content";

const article = getArticleById("navigation");
```

### Search Articles

```tsx
import { searchArticles } from "@/data/help-content";

const results = searchArticles("casualty");
```

## Maintenance

### Updating Content

1. Edit the relevant article in `src/data/help-content.tsx`
2. Ensure TypeScript types are correct
3. Test the changes in the HelpPanel component
4. Update related articles if necessary

### Adding Categories

To add a new category:

1. Create a new articles array (e.g., `newCategoryArticles`)
2. Add articles following the structure above
3. Add the category to the `helpCategories` export:

```tsx
export const helpCategories: HelpCategory[] = [
  // ... existing categories
  {
    id: "new-category",
    name: "New Category Name",
    icon: <IconComponent className="h-4 w-4" />,
    articles: newCategoryArticles,
  },
];
```

## Testing

Test the help content by:

1. Running the demo: Import and render `HelpPanelDemo`
2. Searching for articles using various keywords
3. Navigating between related articles
4. Testing on mobile devices
5. Verifying accessibility with screen readers

## Related Components

- `src/components/ui/help-panel.tsx` - The HelpPanel component
- `src/components/ui/help-panel-demo.tsx` - Demo implementation
- `src/components/ui/sheet.tsx` - Underlying sheet component
- `src/components/ui/scroll-area.tsx` - Scrollable content area
