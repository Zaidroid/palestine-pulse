# Loading States System - Quick Reference

## Import

```tsx
import {
  LoadingSkeleton,
  ProgressIndicator,
  ErrorCard,
  ErrorModal,
  errorToast,
} from '@/components/ui/loading-states';
```

## LoadingSkeleton

```tsx
// Card
<LoadingSkeleton variant="card" />

// Chart
<LoadingSkeleton variant="chart" />

// Text (3 lines)
<LoadingSkeleton variant="text" count={3} />

// Avatar
<LoadingSkeleton variant="avatar" />

// Custom
<LoadingSkeleton variant="custom" height={100} width="100%" />
```

## ProgressIndicator

```tsx
// Linear
<ProgressIndicator progress={75} label="Loading..." />

// Circular
<ProgressIndicator progress={50} variant="circular" size="md" />

// Indeterminate
<ProgressIndicator progress={0} indeterminate />

// Colors
<ProgressIndicator progress={75} color="success" />
<ProgressIndicator progress={50} color="warning" />
<ProgressIndicator progress={25} color="destructive" />
```

## ErrorCard

```tsx
// Basic
<ErrorCard
  title="Error"
  message="Something went wrong"
  onRetry={() => refetch()}
/>

// With error object
<ErrorCard error={error} onRetry={() => refetch()} />

// Warning
<ErrorCard
  title="Warning"
  message="Data may be incomplete"
  severity="warning"
  showRetry={false}
/>
```

## ErrorToast

```tsx
// Generic error
errorToast({
  title: 'Error',
  message: 'Something went wrong',
});

// Network error
networkErrorToast(error);

// Data error
dataErrorToast(error);

// Validation error
validationErrorToast('Invalid input');

// Warning
warningToast('This action cannot be undone');

// Info
infoToast('Feature is in beta');
```

## ErrorModal

```tsx
<ErrorModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Critical Error"
  message="System error occurred"
  error={error}
  onRetry={handleRetry}
  showDetails
/>
```

## Common Patterns

### Data Fetching
```tsx
if (isLoading) return <LoadingSkeleton variant="card" />;
if (error) return <ErrorCard error={error} onRetry={refetch} />;
return <DataDisplay data={data} />;
```

### File Upload
```tsx
{uploading && (
  <ProgressIndicator progress={progress} label="Uploading..." />
)}
```

### Error Handling
```tsx
try {
  await operation();
} catch (error) {
  if (critical) {
    setCriticalError(error);
  } else {
    errorToast({ error });
  }
}
```

## Props Quick Reference

### LoadingSkeleton
- `variant`: 'card' | 'chart' | 'text' | 'avatar' | 'custom'
- `count`: number (for multiple)
- `height`: number (custom only)
- `width`: number | string (custom only)
- `animate`: boolean (default: true)

### ProgressIndicator
- `progress`: number (0-100)
- `variant`: 'linear' | 'circular'
- `size`: 'sm' | 'md' | 'lg'
- `indeterminate`: boolean
- `showPercentage`: boolean
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
- `label`: string

### ErrorCard
- `title`: string
- `message`: string
- `error`: Error | null
- `severity`: 'error' | 'warning' | 'info'
- `onRetry`: () => void
- `retrying`: boolean
- `showRetry`: boolean
- `actions`: ReactNode

### ErrorModal
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `title`: string
- `message`: string
- `error`: Error | null
- `severity`: 'error' | 'warning' | 'info'
- `onRetry`: () => void
- `retrying`: boolean
- `showRetry`: boolean
- `showClose`: boolean
- `showDetails`: boolean
- `actions`: ReactNode

## Sizes

### ProgressIndicator
- **sm**: Linear 1px, Circular 48px
- **md**: Linear 2px, Circular 64px
- **lg**: Linear 3px, Circular 96px

## Colors

- **primary**: Default theme primary
- **secondary**: Theme secondary
- **success**: Green
- **warning**: Yellow/Orange
- **destructive**: Red

## Animation Durations

- **Shimmer**: 1500ms linear infinite
- **Progress**: 600ms easeInOut
- **Error entrance**: 300ms
- **Indeterminate**: 1500-2000ms continuous
