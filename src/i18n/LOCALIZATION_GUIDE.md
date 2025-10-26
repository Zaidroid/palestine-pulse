# Localization Infrastructure Guide

This guide explains how to use the comprehensive localization infrastructure for the Palestine Humanitarian Dashboard.

## Features

- ✅ Complete English and Arabic translations
- ✅ Automatic RTL/LTR layout switching
- ✅ Language persistence in localStorage
- ✅ Locale-aware number and date formatting
- ✅ CSS logical properties for RTL support
- ✅ React hooks for easy integration

## Quick Start

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboards.gaza.healthcare.title')}</h1>
      <p>{t('dashboards.gaza.healthcare.subtitle')}</p>
    </div>
  );
}
```

### 2. Using Locale Formatters

```tsx
import { useLocaleFormatters } from '@/hooks/useLocaleFormatters';

function MetricCard() {
  const { formatNumberWithCommas, formatDateShort, formatPercentage } = useLocaleFormatters();
  
  return (
    <div>
      <p>Total: {formatNumberWithCommas(45000)}</p>
      <p>Date: {formatDateShort(new Date())}</p>
      <p>Rate: {formatPercentage(0.75)}</p>
    </div>
  );
}
```

### 3. Using RTL-Aware Styling

```tsx
// Use logical properties instead of left/right
<div className="ms-4 me-2">  {/* margin-inline-start and margin-inline-end */}
  <span className="text-start">Text</span>  {/* text-align: start */}
</div>

// Or use the RTL utility classes
<div className="ps-4 pe-2">  {/* padding-inline-start and padding-inline-end */}
  Content
</div>
```

## Translation Keys Structure

### Dashboard Translations

```typescript
// Gaza Dashboards
t('dashboards.gaza.healthcare.title')
t('dashboards.gaza.healthcare.hospitalStatus')
t('dashboards.gaza.displacement.title')
t('dashboards.gaza.education.title')
t('dashboards.gaza.economic.title')
t('dashboards.gaza.foodSecurity.title')
t('dashboards.gaza.utilities.title')

// West Bank Dashboards
t('dashboards.westBank.prisoners.title')
t('dashboards.westBank.settlements.title')
t('dashboards.westBank.economic.title')

// Casualties
t('dashboards.casualties.title')
t('dashboards.casualties.mainTimeline')
```

### Chart Translations

```typescript
// Chart filters
t('charts.filters.7d')  // "7D" or "٧ أيام"
t('charts.filters.1m')  // "1M" or "شهر"
t('charts.filters.all') // "All" or "الكل"

// Chart actions
t('charts.actions.export')     // "Export" or "تصدير"
t('charts.actions.exportPNG')  // "Export as PNG"
t('charts.actions.share')      // "Share" or "مشاركة"

// Data source
t('charts.dataSource.source')       // "Source" or "المصدر"
t('charts.dataSource.lastUpdated')  // "Last Updated"
t('charts.dataSource.reliability')  // "Reliability"

// Chart types
t('charts.types.area')    // "Area Chart"
t('charts.types.bar')     // "Bar Chart"
t('charts.types.donut')   // "Donut Chart"
```

### Common Translations

```typescript
t('common.loading')      // "Loading..." or "جاري التحميل..."
t('common.error')        // "Error loading data"
t('common.noData')       // "No data available"
t('common.export')       // "Export" or "تصدير"
t('common.share')        // "Share" or "مشاركة"
t('common.filter')       // "Filter" or "تصفية"
t('common.total')        // "Total" or "الإجمالي"
t('common.average')      // "Average" or "المتوسط"
```

## Locale Formatters API

### Number Formatters

```typescript
const { 
  formatNumber,
  formatNumberWithCommas,
  formatPercentage,
  formatCurrency,
  formatCompactNumber,
  formatDecimal 
} = useLocaleFormatters();

// Examples
formatNumber(1234.56)              // "1,234.56" or "١٬٢٣٤٫٥٦"
formatNumberWithCommas(1000000)    // "1,000,000" or "١٬٠٠٠٬٠٠٠"
formatPercentage(0.75)             // "75%" or "٧٥٪"
formatCurrency(1000, 'USD')        // "$1,000" or "١٬٠٠٠ US$"
formatCompactNumber(1500000)       // "1.5M" or "١٫٥ مليون"
formatDecimal(3.14159, 2)          // "3.14" or "٣٫١٤"
```

### Date Formatters

```typescript
const {
  formatDate,
  formatDateShort,
  formatDateMedium,
  formatDateLong,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDateRange,
  formatMonthYear,
  formatYear,
  formatDayOfWeek
} = useLocaleFormatters();

const date = new Date('2024-01-15');

// Examples
formatDateShort(date)        // "1/15/2024" or "١٥/١/٢٠٢٤"
formatDateMedium(date)       // "Jan 15, 2024" or "١٥ يناير ٢٠٢٤"
formatDateLong(date)         // "January 15, 2024" or "١٥ يناير ٢٠٢٤"
formatDateTime(date)         // "Jan 15, 2024, 10:30 AM"
formatTime(date)             // "10:30 AM" or "١٠:٣٠ ص"
formatRelativeTime(date)     // "2 hours ago" or "منذ ساعتين"
formatMonthYear(date)        // "January 2024" or "يناير ٢٠٢٤"
formatYear(date)             // "2024" or "٢٠٢٤"
formatDayOfWeek(date)        // "Monday" or "الاثنين"

// Date range
formatDateRange(startDate, endDate)  // "1/1/2024 - 1/15/2024"
```

### Other Formatters

```typescript
const {
  formatDuration,
  formatFileSize,
  formatList,
  formatOrdinal
} = useLocaleFormatters();

// Examples
formatDuration(3600000)           // "1 hour" or "ساعة"
formatFileSize(1048576)           // "1.00 MB" or "١٫٠٠ ميجابايت"
formatList(['A', 'B', 'C'])       // "A, B, and C" or "A و B و C"
formatOrdinal(1)                  // "1st" or "١"
```

## RTL CSS Utilities

### Logical Properties (Recommended)

Use these instead of `left`/`right` for automatic RTL support:

```css
/* Margin */
.ms-4  /* margin-inline-start: 1rem */
.me-4  /* margin-inline-end: 1rem */

/* Padding */
.ps-4  /* padding-inline-start: 1rem */
.pe-4  /* padding-inline-end: 1rem */

/* Text alignment */
.text-start  /* text-align: start (left in LTR, right in RTL) */
.text-end    /* text-align: end (right in LTR, left in RTL) */

/* Positioning */
.start-0  /* inset-inline-start: 0 */
.end-0    /* inset-inline-end: 0 */

/* Border radius */
.rounded-s  /* border-start-start-radius and border-end-start-radius */
.rounded-e  /* border-start-end-radius and border-end-end-radius */
```

### RTL-Specific Selectors

```css
/* Target RTL mode specifically */
[dir="rtl"] .my-element {
  /* RTL-specific styles */
}

/* Target LTR mode specifically */
[dir="ltr"] .my-element {
  /* LTR-specific styles */
}
```

### Chart RTL Support

```css
/* Charts maintain LTR data flow but labels are RTL */
[dir="rtl"] .chart-container {
  direction: ltr; /* Keep data LTR */
}

[dir="rtl"] .chart-label {
  text-anchor: end; /* Align labels for RTL */
}

[dir="rtl"] .chart-legend {
  direction: rtl; /* Legend text is RTL */
}
```

## Best Practices

### 1. Always Use Translation Keys

❌ **Don't:**
```tsx
<h1>Healthcare System Status</h1>
```

✅ **Do:**
```tsx
<h1>{t('dashboards.gaza.healthcare.title')}</h1>
```

### 2. Use Locale Formatters for Numbers

❌ **Don't:**
```tsx
<span>{value.toLocaleString()}</span>
```

✅ **Do:**
```tsx
<span>{formatNumberWithCommas(value)}</span>
```

### 3. Use Logical Properties for Spacing

❌ **Don't:**
```tsx
<div className="ml-4 mr-2">Content</div>
```

✅ **Do:**
```tsx
<div className="ms-4 me-2">Content</div>
```

### 4. Keep Numbers LTR in RTL Context

```tsx
// Numbers should always be LTR for consistency
<span className="number">{formatNumber(12345)}</span>
```

### 5. Test Both Languages

Always test your components in both English and Arabic to ensure:
- Text doesn't overflow
- Layout adapts correctly
- Numbers display properly
- Icons flip appropriately (arrows, etc.)

## Adding New Translations

### 1. Add to English (`src/i18n/locales/en.json`)

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

### 2. Add to Arabic (`src/i18n/locales/ar.json`)

```json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "وصف الميزة"
  }
}
```

### 3. Use in Component

```tsx
function MyFeature() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
    </div>
  );
}
```

## Language Switching

The `LanguageSwitcher` component handles:
- Language selection UI
- localStorage persistence
- RTL/LTR direction switching
- Global state synchronization

Users can switch languages, and their preference is automatically saved and restored on next visit.

## Troubleshooting

### Issue: Text not translating

**Solution:** Check that:
1. Translation key exists in both `en.json` and `ar.json`
2. You're using `useTranslation()` hook correctly
3. i18n is properly initialized in your app

### Issue: RTL layout not working

**Solution:** Check that:
1. `rtl-utils.css` is imported in `index.css`
2. You're using logical properties (`ms-`, `me-`, `ps-`, `pe-`)
3. `document.documentElement.dir` is set correctly

### Issue: Numbers displaying incorrectly

**Solution:** 
- Use `useLocaleFormatters()` hook instead of native JavaScript formatting
- Wrap numbers in elements with `className="number"` to keep them LTR

### Issue: Language not persisting

**Solution:** Check that:
1. localStorage is available in the browser
2. i18n config is properly setting up language change listener
3. Global store is syncing with i18n

## Performance Considerations

1. **Translation files are loaded once** at app initialization
2. **Formatters are memoized** in the hook
3. **RTL CSS is minimal** and uses modern CSS features
4. **Language switching is instant** (no page reload needed)

## Accessibility

The localization infrastructure includes:
- Proper `lang` attribute on `<html>`
- Proper `dir` attribute for screen readers
- ARIA labels in both languages
- Keyboard navigation support in both directions

## Future Enhancements

Potential additions:
- French translation
- Spanish translation
- Hebrew translation (RTL)
- Automatic language detection from browser
- Translation management UI
- Pluralization rules
- Context-specific translations
