import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, XCircle, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

export interface ErrorModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when the modal should close
   */
  onOpenChange: (open: boolean) => void;
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
   * Whether to show the close button
   */
  showClose?: boolean;
  /**
   * Custom action buttons
   */
  actions?: React.ReactNode;
  /**
   * Additional details to show (like stack trace)
   */
  details?: string;
  /**
   * Whether to show error details
   */
  showDetails?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onOpenChange,
  title,
  message,
  error,
  onRetry,
  retrying = false,
  severity = 'error',
  showRetry = true,
  showClose = true,
  actions,
  details,
  showDetails = false,
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  const errorMessage = message || error?.message || 'An unexpected error occurred';
  const errorTitle = title || (severity === 'error' ? 'Critical Error' : severity === 'warning' ? 'Warning' : 'Information');
  const errorDetails = details || (error && 'stack' in error ? (error as any).stack : undefined);

  const iconMap = {
    error: XCircle,
    warning: AlertTriangle,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={cn('rounded-full p-2', bgMap[severity])}>
              <Icon className={cn('h-6 w-6', colorMap[severity])} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{errorTitle}</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {errorMessage}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {showDetails && errorDetails && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="text-xs"
            >
              {detailsExpanded ? 'Hide' : 'Show'} technical details
            </Button>
            
            {detailsExpanded && (
              <div className="rounded-lg bg-muted p-3 max-h-48 overflow-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                  {errorDetails}
                </pre>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              disabled={retrying}
              variant="default"
              className="w-full sm:w-auto"
            >
              <RefreshCw className={cn(
                'mr-2 h-4 w-4',
                retrying && 'animate-spin'
              )} />
              {retrying ? 'Retrying...' : 'Retry'}
            </Button>
          )}
          
          {actions}
          
          {showClose && (
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ErrorModal.displayName = 'ErrorModal';

export { ErrorModal };
