import * as React from 'react';
import { LoadingSkeleton } from '../loading-skeleton';
import { ProgressIndicator } from '../progress-indicator';
import { ErrorCard } from '../error-card';
import { ErrorModal } from '../error-modal';
import { errorToast, networkErrorToast, dataErrorToast } from '../error-toast';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';

/**
 * Demo component showcasing all loading states components
 */
export function LoadingStatesDemo() {
  const [progress, setProgress] = React.useState(0);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);

  // Simulate progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setErrorModalOpen(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Loading States System</h1>
        <p className="text-muted-foreground">
          Comprehensive loading, progress, and error state components
        </p>
      </div>

      {/* Loading Skeletons */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Loading Skeletons</h2>
          <p className="text-muted-foreground mb-6">
            Content-aware loading placeholders with shimmer animation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Card Skeleton</h3>
            <LoadingSkeleton variant="card" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Chart Skeleton</h3>
            <LoadingSkeleton variant="chart" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Text Skeleton</h3>
            <LoadingSkeleton variant="text" count={4} />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Avatar Skeleton</h3>
            <LoadingSkeleton variant="avatar" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Custom Skeleton</h3>
            <LoadingSkeleton variant="custom" height={100} width="100%" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Multiple Custom</h3>
            <LoadingSkeleton variant="custom" height={20} count={3} />
          </div>
        </div>
      </section>

      {/* Progress Indicators */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Progress Indicators</h2>
          <p className="text-muted-foreground mb-6">
            Linear and circular progress indicators with smooth transitions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Linear Progress</CardTitle>
              <CardDescription>Horizontal progress bars</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Default</p>
                <ProgressIndicator progress={progress} label="Loading data..." />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Small</p>
                <ProgressIndicator progress={progress} size="sm" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Large</p>
                <ProgressIndicator progress={progress} size="lg" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Indeterminate</p>
                <ProgressIndicator progress={0} indeterminate label="Processing..." />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Color Variants</p>
                <ProgressIndicator progress={75} color="success" label="Success" />
                <ProgressIndicator progress={50} color="warning" label="Warning" className="mt-2" />
                <ProgressIndicator progress={25} color="destructive" label="Error" className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Circular Progress</CardTitle>
              <CardDescription>Circular progress indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center">Small</p>
                  <ProgressIndicator 
                    progress={progress} 
                    variant="circular" 
                    size="sm"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-center">Medium</p>
                  <ProgressIndicator 
                    progress={progress} 
                    variant="circular" 
                    size="md"
                    label="Loading"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-center">Large</p>
                  <ProgressIndicator 
                    progress={progress} 
                    variant="circular" 
                    size="lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center">Indeterminate</p>
                  <ProgressIndicator 
                    progress={0} 
                    variant="circular" 
                    size="md"
                    indeterminate
                    label="Processing"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-center">Success</p>
                  <ProgressIndicator 
                    progress={100} 
                    variant="circular" 
                    size="md"
                    color="success"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Error States */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Error States</h2>
          <p className="text-muted-foreground mb-6">
            Error cards, toasts, and modals for different error scenarios
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Error Cards</h3>
            
            <ErrorCard
              title="Network Error"
              message="Unable to connect to the server. Please check your internet connection."
              severity="error"
              onRetry={() => console.log('Retrying...')}
            />

            <ErrorCard
              title="Data Quality Warning"
              message="Some data may be incomplete or outdated."
              severity="warning"
              showRetry={false}
            />

            <ErrorCard
              title="Information"
              message="This feature is currently in beta."
              severity="info"
              showRetry={false}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Error Toasts & Modals</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Toast Notifications</CardTitle>
                <CardDescription>Non-critical error notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => errorToast({
                    title: 'Error',
                    message: 'Something went wrong!',
                    severity: 'error',
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Show Error Toast
                </Button>
                
                <Button
                  onClick={() => networkErrorToast()}
                  variant="outline"
                  className="w-full"
                >
                  Show Network Error
                </Button>
                
                <Button
                  onClick={() => dataErrorToast()}
                  variant="outline"
                  className="w-full"
                >
                  Show Data Error
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Modal</CardTitle>
                <CardDescription>Critical error dialog</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setErrorModalOpen(true)}
                  variant="destructive"
                  className="w-full"
                >
                  Show Error Modal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Error Modal */}
      <ErrorModal
        open={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        title="Critical System Error"
        message="The application encountered a critical error and needs to reload."
        error={new Error('Failed to fetch data from API')}
        severity="error"
        onRetry={handleRetry}
        retrying={retrying}
        showDetails
      />
    </div>
  );
}
