import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

export interface ErrorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message or description
   */
  message?: string;
  /**
   * Error object (will extract message if provided)
   */
  error?: Error | null;
  /**
   * Retry callback function
   */
  onRetry?: () => void;
  /**
   * Whether the retry action is loading
   */
  retrying?: boolean;
  /**
   * Severity of the error
   */
  severity?: 'error' | 'warning' | 'info';
  /**
   * Whether to show the retry button
   */
  showRetry?: boolean;
  /**
   * Custom action buttons
   */
  actions?: React.ReactNode;
}

const ErrorCard = React.forwardRef<HTMLDivElement, ErrorCardProps>(
  ({ 
    title,
    message,
    error,
    onRetry,
    retrying = false,
    severity = 'error',
    showRetry = true,
    actions,
    className,
    ...props
  }, ref) => {
    const errorMessage = message || error?.message || 'An unexpected error occurred';
    const errorTitle = title || (severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Information');

    const iconMap = {
      error: XCircle,
      warning: AlertCircle,
      info: AlertCircle,
    };

    const colorMap = {
      error: 'text-destructive',
      warning: 'text-warning',
      info: 'text-blue-500',
    };

    const bgMap = {
      error: 'bg-destructive/10',
      warning: 'bg-warning/10',
      info: 'bg-blue-500/10',
    };

    const Icon = iconMap[severity];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn('border-2', className)} {...props}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className={cn('rounded-full p-2', bgMap[severity])}>
                <Icon className={cn('h-5 w-5', colorMap[severity])} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{errorTitle}</CardTitle>
                <CardDescription className="mt-1.5">
                  {errorMessage}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          {(showRetry || actions) && (
            <CardFooter className="flex gap-2">
              {showRetry && onRetry && (
                <Button
                  onClick={onRetry}
                  disabled={retrying}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={cn(
                    'mr-2 h-4 w-4',
                    retrying && 'animate-spin'
                  )} />
                  {retrying ? 'Retrying...' : 'Retry'}
                </Button>
              )}
              {actions}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  }
);

ErrorCard.displayName = 'ErrorCard';

export { ErrorCard };
