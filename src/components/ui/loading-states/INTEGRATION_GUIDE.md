# Loading States System - Integration Guide

## Quick Start

### Installation

The loading states system is already integrated into the project. Import components as needed:

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

## Common Integration Patterns

### 1. Data Fetching with React Query

Replace loading states in data fetching components:

**Before:**
```tsx
function MetricCard() {
  const { data, isLoading, error } = useQuery('metrics', fetchMetrics);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <Card>{/* render data */}</Card>;
}
```

**After:**
```tsx
function MetricCard() {
  const { data, isLoading, error, refetch } = useQuery('metrics', fetchMetrics);

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
  
  return <Card>{/* render data */}</Card>;
}
```

### 2. Chart Components

Add loading and error states to charts:

```tsx
function ChartComponent({ data, isLoading, error }) {
  if (isLoading) {
    return <LoadingSkeleton variant="chart" />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Chart Loading Error"
        message="Unable to load chart data"
        error={error}
        onRetry={refetch}
        severity="error"
      />
    );
  }

  return <EnhancedChart data={data} />;
}
```

### 3. File Upload with Progress

Show upload progress:

```tsx
function FileUploader() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      await uploadFile(file, (progressValue) => {
        setProgress(progressValue);
      });
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      errorToast({
        title: 'Upload Failed',
        error,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      {uploading && (
        <ProgressIndicator
          progress={progress}
          label="Uploading file..."
          showPercentage
        />
      )}
      <Button onClick={() => handleUpload(file)}>
        Upload
      </Button>
    </div>
  );
}
```

### 4. Long-Running Operations

Show indeterminate progress for operations without known duration:

```tsx
function DataProcessor() {
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      await processData();
      toast({ title: 'Processing complete' });
    } catch (error) {
      errorToast({ title: 'Processing failed', error });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {processing && (
        <ProgressIndicator
          progress={0}
          indeterminate
          label="Processing data..."
        />
      )}
      <Button onClick={handleProcess} disabled={processing}>
        Process Data
      </Button>
    </div>
  );
}
```

### 5. Critical Error Handling

Use ErrorModal for critical errors that require user attention:

```tsx
function Dashboard() {
  const [criticalError, setCriticalError] = useState<Error | null>(null);
  const { data, error } = useQuery('dashboard', fetchDashboard, {
    onError: (err) => {
      if (err.status === 500) {
        setCriticalError(err);
      } else {
        dataErrorToast(err);
      }
    },
  });

  return (
    <>
      <DashboardContent data={data} />
      
      <ErrorModal
        open={!!criticalError}
        onOpenChange={() => setCriticalError(null)}
        title="Critical System Error"
        message="The dashboard encountered a critical error."
        error={criticalError}
        onRetry={() => {
          setCriticalError(null);
          refetch();
        }}
        showDetails
      />
    </>
  );
}
```

### 6. Network Error Handling

Centralized network error handling:

```tsx
// In your API client
async function apiRequest(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      networkErrorToast(error);
    } else {
      // Other errors
      errorToast({ error });
    }
    throw error;
  }
}
```

### 7. Form Validation Errors

Show validation errors:

```tsx
function FormComponent() {
  const handleSubmit = (data: FormData) => {
    const errors = validateForm(data);
    
    if (errors.length > 0) {
      validationErrorToast(errors.join(', '));
      return;
    }
    
    // Submit form
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Migration Checklist

### Phase 1: Replace Loading States
- [ ] Identify all loading indicators in the codebase
- [ ] Replace with appropriate LoadingSkeleton variants
- [ ] Test loading states on slow connections

### Phase 2: Replace Error States
- [ ] Identify all error displays
- [ ] Replace with ErrorCard components
- [ ] Add retry functionality where applicable

### Phase 3: Add Progress Indicators
- [ ] Identify long-running operations
- [ ] Add ProgressIndicator components
- [ ] Implement progress tracking

### Phase 4: Implement Error Toasts
- [ ] Replace alert() calls with errorToast
- [ ] Add toast notifications for async operations
- [ ] Implement specialized toast functions

### Phase 5: Add Error Modals
- [ ] Identify critical error scenarios
- [ ] Implement ErrorModal for critical errors
- [ ] Add error boundaries with ErrorModal fallback

## Component Selection Guide

### When to use LoadingSkeleton
- ✅ Initial page load
- ✅ Component-level loading
- ✅ Replacing content that will appear
- ❌ Button loading states (use spinner)
- ❌ Inline loading (use small spinner)

### When to use ProgressIndicator
- ✅ File uploads/downloads
- ✅ Multi-step processes
- ✅ Data processing operations
- ✅ Known progress operations
- ❌ Unknown duration operations (use indeterminate)

### When to use ErrorCard
- ✅ Component-level errors
- ✅ Recoverable errors with retry
- ✅ Data loading failures
- ❌ Form validation errors (use inline)
- ❌ Critical system errors (use ErrorModal)

### When to use ErrorToast
- ✅ Non-critical errors
- ✅ Background operation failures
- ✅ Network errors
- ✅ Validation errors
- ❌ Critical errors requiring action

### When to use ErrorModal
- ✅ Critical system errors
- ✅ Errors requiring user decision
- ✅ Errors blocking functionality
- ❌ Minor errors
- ❌ Recoverable errors

## Best Practices

### 1. Match Skeleton to Content
Always use skeleton variants that match the actual content layout:

```tsx
// Good
{isLoading ? (
  <LoadingSkeleton variant="card" />
) : (
  <MetricCard data={data} />
)}

// Bad - mismatched layout
{isLoading ? (
  <LoadingSkeleton variant="text" />
) : (
  <MetricCard data={data} />
)}
```

### 2. Provide Retry Functionality
Always provide retry for recoverable errors:

```tsx
// Good
<ErrorCard
  error={error}
  onRetry={() => refetch()}
/>

// Bad - no way to recover
<ErrorCard error={error} showRetry={false} />
```

### 3. Use Appropriate Severity
Choose the right severity level:

```tsx
// Critical error
<ErrorCard severity="error" />

// Data quality issue
<ErrorCard severity="warning" />

// Informational message
<ErrorCard severity="info" />
```

### 4. Show Progress When Possible
Prefer determinate progress over indeterminate:

```tsx
// Good - shows actual progress
<ProgressIndicator progress={uploadProgress} />

// Less ideal - no progress indication
<ProgressIndicator progress={0} indeterminate />
```

### 5. Provide Context in Error Messages
Make error messages actionable:

```tsx
// Good
errorToast({
  title: 'Network Error',
  message: 'Unable to connect to the server. Please check your internet connection and try again.',
});

// Bad - not actionable
errorToast({
  title: 'Error',
  message: 'Something went wrong',
});
```

## Performance Tips

### 1. Lazy Load Heavy Components
```tsx
const LoadingStatesDemo = lazy(() => 
  import('@/components/ui/loading-states/LoadingStatesDemo')
);
```

### 2. Memoize Skeleton Components
```tsx
const MemoizedSkeleton = memo(LoadingSkeleton);
```

### 3. Debounce Progress Updates
```tsx
const debouncedSetProgress = useMemo(
  () => debounce(setProgress, 100),
  []
);
```

### 4. Batch Error Notifications
```tsx
// Instead of multiple toasts
errors.forEach(error => errorToast({ error }));

// Batch into one
errorToast({
  title: 'Multiple Errors',
  message: `${errors.length} errors occurred`,
});
```

## Troubleshooting

### Skeleton Not Matching Content
**Problem**: Skeleton layout doesn't match actual content  
**Solution**: Use the correct variant or create a custom skeleton

### Progress Not Updating
**Problem**: Progress indicator stuck at 0%  
**Solution**: Ensure progress value is being updated correctly (0-100)

### Toast Not Appearing
**Problem**: Error toast not showing  
**Solution**: Ensure Toaster component is rendered in your app root

### Modal Not Closing
**Problem**: Error modal won't close  
**Solution**: Check onOpenChange handler is updating state correctly

## Support

For issues or questions:
1. Check the README.md for API documentation
2. Review the LoadingStatesDemo.tsx for examples
3. Consult the design document for specifications

## Next Steps

After integration:
1. Test all loading states on slow connections
2. Verify error handling in all scenarios
3. Ensure accessibility with keyboard and screen readers
4. Monitor error rates and user feedback
5. Iterate on error messages based on user needs
