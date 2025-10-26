import { toast } from '@/hooks/use-toast';
import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

export interface ErrorToastOptions {
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
   * Severity of the error
   */
  severity?: 'error' | 'warning' | 'info';
  /**
   * Duration in milliseconds (default: 5000)
   */
  duration?: number;
  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Display an error toast notification
 */
export function errorToast({
  title,
  message,
  error,
  severity = 'error',
  duration = 5000,
  action,
}: ErrorToastOptions) {
  const errorMessage = message || error?.message || 'An unexpected error occurred';
  const errorTitle = title || (severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Information');

  const iconMap = {
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle,
  };

  const Icon = iconMap[severity];

  return toast({
    title: (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{errorTitle}</span>
      </div>
    ),
    description: errorMessage,
    variant: severity === 'error' ? 'destructive' : 'default',
    duration,
    action: action ? {
      altText: action.label,
      onClick: action.onClick,
      children: action.label,
    } as any : undefined,
  });
}

/**
 * Display a network error toast
 */
export function networkErrorToast(error?: Error | null) {
  return errorToast({
    title: 'Network Error',
    message: error?.message || 'Unable to connect to the server. Please check your internet connection.',
    error,
    severity: 'error',
  });
}

/**
 * Display a data loading error toast
 */
export function dataErrorToast(error?: Error | null) {
  return errorToast({
    title: 'Data Loading Error',
    message: error?.message || 'Failed to load data. Please try again.',
    error,
    severity: 'error',
  });
}

/**
 * Display a validation error toast
 */
export function validationErrorToast(message: string) {
  return errorToast({
    title: 'Validation Error',
    message,
    severity: 'warning',
  });
}

/**
 * Display a generic warning toast
 */
export function warningToast(message: string, title?: string) {
  return errorToast({
    title: title || 'Warning',
    message,
    severity: 'warning',
  });
}

/**
 * Display an info toast
 */
export function infoToast(message: string, title?: string) {
  return errorToast({
    title: title || 'Information',
    message,
    severity: 'info',
  });
}
