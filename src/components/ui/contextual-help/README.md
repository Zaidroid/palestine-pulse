# Contextual Help System

A comprehensive help system providing tooltips, modals, onboarding tours, and documentation panels to guide users through the dashboard.

## Components

### 1. MetricTooltip

Display metric definitions and contextual information on hover.

```tsx
import { MetricTooltip } from '@/components/ui/metric-tooltip';

<MetricTooltip
  title="Total Revenue"
  definition="Total revenue represents the sum of all income generated from sales and services."
  formula="Revenue = Sum(Sales) + Sum(Services)"
  example="If you sold $100k in products and $25k in services, total revenue is $125k"
  source="Financial System"
  icon="info"
  side="top"
/>
```

**Props:**
- `title` - Metric name
- `definition` - Clear explanation of the metric
- `formula?` - Mathematical formula (optional)
- `example?` - Practical example (optional)
- `source?` - Data source (optional)
- `icon?` - 'info' | 'help' (default: 'info')
- `side?` - Tooltip placement (default: 'top')

### 2. ExplanationModal

Detailed explanations for complex visualizations with sections and related links.

```tsx
import { ExplanationModal } from '@/components/ui/explanation-modal';

<ExplanationModal
  title="Understanding Revenue Distribution"
  description="Learn how revenue is categorized and calculated"
  sections={[
    {
      title: 'What is Revenue Distribution?',
      content: <p>Revenue distribution shows...</p>,
      icon: <PieChart className="h-4 w-4" />,
    },
  ]}
  relatedLinks={[
    { label: 'Revenue Guide', url: 'https://docs.example.com/revenue' },
  ]}
  triggerVariant="icon"
/>
```

**Props:**
- `title` - Modal title
- `description?` - Brief description
- `sections` - Array of content sections
- `relatedLinks?` - External documentation links
- `triggerVariant?` - 'icon' | 'button' | 'badge' (default: 'icon')
- `triggerLabel?` - Custom trigger text (default: 'Learn more')

### 3. OnboardingTour

Step-by-step guided tour for first-time users with spotlight highlighting.

```tsx
import { OnboardingTour } from '@/components/ui/onboarding-tour';

<OnboardingTour
  steps={[
    {
      target: '[data-tour="metrics"]',
      title: 'Welcome to Your Dashboard',
      content: <p>This dashboard provides real-time insights...</p>,
      placement: 'bottom',
      spotlightPadding: 8,
    },
  ]}
  storageKey="dashboard"
  autoStart={true}
  onComplete={() => console.log('Tour completed')}
  onSkip={() => console.log('Tour skipped')}
/>
```

**Props:**
- `steps` - Array of tour steps
- `storageKey?` - LocalStorage key for completion state (default: 'default')
- `autoStart?` - Start tour automatically (default: false)
- `onComplete?` - Callback when tour finishes
- `onSkip?` - Callback when tour is skipped

**Step Configuration:**
- `target` - CSS selector for element to highlight
- `title` - Step title
- `content` - Step content (React node)
- `placement?` - 'top' | 'right' | 'bottom' | 'left' (default: 'bottom')
- `spotlightPadding?` - Padding around spotlight (default: 8)

**Hooks:**

```tsx
import { useOnboardingTourCompleted, useResetOnboardingTour } from '@/components/ui/onboarding-tour';

// Check if tour has been completed
const isCompleted = useOnboardingTourCompleted('dashboard');

// Reset tour completion
const resetTour = useResetOnboardingTour();
resetTour('dashboard');
```

### 4. HelpPanel

Slide-over panel with searchable documentation and help articles.

```tsx
import { HelpPanel } from '@/components/ui/help-panel';

<HelpPanel
  categories={[
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <BookOpen className="h-4 w-4" />,
      articles: [
        {
          id: 'dashboard-overview',
          category: 'Getting Started',
          title: 'Dashboard Overview',
          content: <div>...</div>,
          tags: ['overview', 'basics'],
          relatedArticles: ['understanding-metrics'],
        },
      ],
    },
  ]}
  defaultArticleId="dashboard-overview"
  externalDocsUrl="https://docs.example.com"
  triggerVariant="button"
  triggerLabel="Help"
/>
```

**Props:**
- `categories` - Array of help categories with articles
- `defaultArticleId?` - Article to show on open
- `externalDocsUrl?` - Link to full documentation
- `triggerVariant?` - 'icon' | 'button' (default: 'icon')
- `triggerLabel?` - Button text (default: 'Help')

### 5. DataQualityWarning

Display warning indicators for data quality issues with detailed explanations.

```tsx
import { DataQualityWarning } from '@/components/ui/data-quality-warning';

<DataQualityWarning
  quality="medium"
  issues={[
    {
      type: 'outdated',
      description: 'Data is 2 hours old due to sync delay',
    },
  ]}
  lastUpdated={new Date()}
  source="Analytics API"
  variant="icon"
  showLabel={false}
/>
```

**Props:**
- `quality` - 'high' | 'medium' | 'low' | 'unknown'
- `issues?` - Array of quality issues
- `lastUpdated?` - Last update timestamp
- `source?` - Data source name
- `variant?` - 'icon' | 'badge' | 'inline' (default: 'icon')
- `showLabel?` - Show quality label (default: false)

**Issue Types:**
- `missing` - Missing data
- `outdated` - Outdated data
- `estimated` - Estimated values
- `incomplete` - Incomplete data
- `unverified` - Unverified data
- `other` - Other issues

**DataQualityWarningList:**

```tsx
import { DataQualityWarningList } from '@/components/ui/data-quality-warning';

<DataQualityWarningList
  items={[
    {
      label: 'Mobile App Analytics',
      quality: 'medium',
      issues: [{ type: 'outdated', description: 'Data is 3 hours old' }],
      lastUpdated: new Date(),
      source: 'Mobile Analytics API',
    },
  ]}
/>
```

## Integration with EnhancedMetricCard

The `EnhancedMetricCard` component now supports contextual help features:

```tsx
import { EnhancedMetricCard } from '@/components/ui/enhanced-metric-card';

<EnhancedMetricCard
  title="Total Revenue"
  value={125000}
  icon={DollarSign}
  
  // Metric definition tooltip
  metricDefinition={{
    definition: 'Total revenue represents...',
    formula: 'Revenue = Sum(Sales) + Sum(Services)',
    example: 'If you sold $100k...',
    source: 'Financial System',
  }}
  
  // Data quality warning
  quality="medium"
  qualityIssues={[
    {
      type: 'outdated',
      description: 'Data is 2 hours old',
    },
  ]}
/>
```

## Best Practices

### Tooltips
- Keep definitions concise and clear
- Include formulas for calculated metrics
- Provide practical examples
- Cite data sources

### Explanation Modals
- Use for complex visualizations
- Break content into logical sections
- Include visual aids when helpful
- Link to related documentation

### Onboarding Tours
- Keep tours short (4-6 steps)
- Focus on key features only
- Use clear, action-oriented language
- Allow users to skip or exit
- Store completion state to avoid repetition

### Help Panel
- Organize content into logical categories
- Make articles searchable
- Include related article links
- Provide external documentation links
- Keep articles focused and scannable

### Data Quality Warnings
- Only show warnings for medium/low quality
- Provide specific issue descriptions
- Include timestamps when relevant
- Explain impact on reliability

## Accessibility

All components follow accessibility best practices:

- Keyboard navigation support
- ARIA labels and descriptions
- Focus management
- Screen reader friendly
- Reduced motion support

## Demo

See `src/components/ui/contextual-help-demo.tsx` for a comprehensive demonstration of all features.

## Requirements

Implements requirements:
- 14.1: Metric tooltips with definitions
- 14.2: Explanation modals for visualizations
- 14.3: Onboarding tour with localStorage persistence
- 14.4: Contextual documentation panel
- 14.5: Data quality warnings with explanations
