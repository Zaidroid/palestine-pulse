# Loading States System

A comprehensive system for handling loading, progress, and error states in the Palestine Pulse dashboard.

## Overview

This system provides three main categories of components:

1. **Loading Skeletons** - Content-aware placeholders with shimmer animation
2. **Progress Indicators** - Linear and circular progress displays
3. **Error States** - Cards, toasts, and modals for error handling

## Components

### LoadingSkeleton

Content-aware loading placeholders that match the layout of actual content.

#### Variants

- `card` - Skeleton for metric cards with header, content, and footer
- `chart` - Skeleton for chart components with axes
- `text` - Multiple text lines with varying widths
- `avatar` - Avatar with text lines
- `custom` - Flexible custom dimensions

#### Usage

```tsx
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// Card skeleton
<LoadingSkeleton variant="card" />

// Chart skeleton
<LoadingSkeleton variant="chart" />

// Text skeleton (multiple lines)
<LoadingSkeleton variant="text" count={4} />

// Custom skeleton
<LoadingSkeleton variant="custom" height={100} width="100%" />

// Multiple custom skeletons
<LoadingSkeleton variant="custom" height={20} count={3} />

// Disable animation
<LoadingSkeleton variant="card" animate={false} />
```

#### Props

```typescript
interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'text' | 'avatar' | 'custom';
  count?: number;
  height?: number;
  width?: number | string;
  animate?: boolean;
  className?: string;
}
```

### ProgressIndicator

Smooth progress indicators with linear and circular variants.

#### Variants

- `linear` - Horizontal progress bar
- `circular` - Circular progress indicator

#### Usage

```tsx
import { ProgressIndicator } from '@/components/ui/progress-indicator';

// Linear progress
<ProgressIndicator 
  progress={75} 
  label="Loading data..." 
/>

// Circular progress
<ProgressIndicator 
  progress={50} 
  variant="circular" 
  size="md"
  label="Processing"
/>

// Indeterminate (unknown progress)
<ProgressIndicator 
  progress={0} 
  indeterminate 
  label="Loading..."
/>

// Different colors
<ProgressIndicator progress={75} color="success" />
<ProgressIndicator progress={50} color="warning" />
<ProgressIndicator progress={25} color="destructive" />

// Different sizes
<ProgressIndicator progress={50} size="sm" />
<ProgressIndicator progress={50} size="md" />
<ProgressIndicator progress={50} size="lg" />
```

#### Props

```typescript
interface ProgressIndicatorProps {
  progress: number; // 0-100
  label?: string;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  className?: string;
}
```

### ErrorCard

Display error messages with retry functionality.

#### Usage

```tsx
import { ErrorCard } from '@/components/ui/error-card';

// Basic error card
<ErrorCard
  title="Network Error"
  message="Unable to connect to the server."
  onRetry={() => refetch()}
/>

// With error object
<ErrorCard
  error={error}
  onRetry={() => refetch()}
  retrying={isRetrying}
/>

// Warning severity
<ErrorCard
  title="Data Quality Warning"
  message="Some data may be incomplete."
  severity="warning"
  showRetry={false}
/>

// Custom actions
<ErrorCard
  title="Error"
  message="Something went wrong."
  actions={
    <>
      <Button onClick={handleAction1}>Action 1</Button>
      <Button onClick={handleAction2}>Action 2</Button>
    </>
  }
/>
```

#### Props

```typescript
interface ErrorCardProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retrying?: boolean;
  severity?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  actions?: React.ReactNode;
  className?: string;
}
```

### ErrorToast

Display non-critical error notifications.

#### Usage

```tsx
import { 
  errorToast, 
  networkErrorToast, 
  dataErrorToast,
  validationErrorToast,
  warningToast,
  infoToast
} from '@/components/ui/error-toast';

// Generic error toast
errorToast({
  title: 'Error',
  message: 'Something went wrong!',
  severity: 'error',
});

// Network error
networkErrorToast(error);

// Data loading error
dataErrorToast(error);

// Validation error
validationErrorToast('Please fill in all required fields');

// Warning
warningToast('This action cannot be undone');

// Info
infoToast('Feature is in beta');

// With action button
errorToast({
  title: 'Error',
  message: 'Failed to save',
  action: {
    label: 'Retry',
    onClick: () => save(),
  },
});
```

#### API

```typescript
interface ErrorToastOptions {
  title?: string;
  message?: string;
  error?: Error | null;
  severity?: 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function errorToast(options: ErrorToastOptions): void;
function networkErrorToast(error?: Error | null): void;
function dataErrorToast(error?: Error | null): void;
function validationErrorToast(message: string): void;
function warningToast(message: string, title?: string): void;
function infoToast(message: string, title?: string): void;
```

### ErrorModal

Display critical errors in a modal dialog.

#### Usage

```tsx
import { ErrorModal } from '@/components/ui/error-modal';

const [errorModalOpen, setErrorModalOpen] = useState(false);

<ErrorModal
  open={errorModalOpen}
  onOpenChange={setErrorModalOpen}
  title="Critical Error"
  message="The application encountered a critical error."
  error={error}
  onRetry={handleRetry}
  retrying={isRetrying}
  showDetails
/>

// With custom actions
<ErrorModal
  open={open}
  onOpenChange={setOpen}
  title="Error"
  message="Something went wrong."
  actions={
    <>
      <Button onClick={handleAction}>Custom Action</Button>
    </>
  }
/>
```

#### Props

```typescript
interface ErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  retrying?: boolean;
  severity?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  showClose?: boolean;
  actions?: React.ReactNode;
  details?: string;
  showDetails?: boolean;
}
```

## Common Patterns

### Loading Data with Skeleton

```tsx
function DataComponent() {
  const { data, isLoading, error } = useQuery('data', fetchData);

  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  if (error) {
    return (
      <ErrorCard
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <DataDisplay data={data} />;
}
```

### Progress with Async Operation

```tsx
function UploadComponent() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      await uploadFile(file, (p) => setProgress(p));
      toast({ title: 'Upload complete!' });
    } catch (error) {
      errorToast({ error, title: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {uploading && (
        <ProgressIndicator
          progress={progress}
          label="Uploading file..."
        />
      )}
      <Button onClick={() => handleUpload(file)}>
        Upload
      </Button>
    </div>
  );
}
```

### Error Handling with Toast and Modal

```tsx
function DataFetcher() {
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const data = await api.getData();
      return data;
    } catch (error) {
      if (error.status === 500) {
        // Critical error - show modal
        setCriticalError(error);
      } else {
        // Non-critical - show toast
        dataErrorToast(error);
      }
    }
  };

  return (
    <>
      <Button onClick={fetchData}>Fetch Data</Button>
      
      <ErrorModal
        open={!!criticalError}
        onOpenChange={() => setCriticalError(null)}
        error={criticalError}
        onRetry={fetchData}
      />
    </>
  );
}
```

## Animation Details

### Shimmer Animation

The shimmer effect uses a CSS gradient animation:

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 0%,
    hsl(var(--muted-foreground) / 0.1) 50%,
    hsl(var(--muted)) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s linear infinite;
}
```

### Progress Transitions

Progress indicators use Framer Motion for smooth transitions:

- Linear: Width transition with easeInOut (600ms)
- Circular: Stroke-dashoffset animation with easeInOut (600ms)
- Indeterminate: Continuous animation with linear easing

## Accessibility

All components follow accessibility best practices:

- **Semantic HTML**: Proper use of ARIA roles and labels
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Screen Readers**: Descriptive labels and live regions for dynamic content
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: Meets WCAG 2.1 Level AA standards

## Requirements Mapping

This implementation satisfies the following requirements:

- **9.1**: LoadingSkeleton with variants matching actual content
- **9.2**: Shimmer animation for loading states
- **9.4**: ProgressIndicator with smooth transitions and indeterminate state
- **9.5**: Error states (ErrorCard, ErrorToast, ErrorModal) with retry functionality

## Demo

See `LoadingStatesDemo.tsx` for a comprehensive demonstration of all components and their variants.

## Integration

Import components from the loading-states module:

```tsx
import {
  LoadingSkeleton,
  ProgressIndicator,
  ErrorCard,
  ErrorModal,
  errorToast,
  networkErrorToast,
  dataErrorToast,
} from '@/components/ui/loading-states';
```
