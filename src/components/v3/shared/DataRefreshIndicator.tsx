/**
 * Data Refresh Indicator Component
 * 
 * Visual loading indicators for data refresh operations:
 * - Progress bar for refresh status
 * - Manual refresh button
 * - Error display and retry
 * - Last update timestamp
 */

import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedTooltip, AnimatedTooltipContent, AnimatedTooltipProvider, AnimatedTooltipTrigger } from '@/components/ui/animated-tooltip';
import { cn } from '@/lib/utils';
import { buttonInteraction, iconButtonInteraction } from '@/lib/interaction-polish';

interface DataRefreshIndicatorProps {
  variant?: 'full' | 'compact' | 'button-only';
  showProgress?: boolean;
  showErrors?: boolean;
  showLastUpdate?: boolean;
  className?: string;
}

export function DataRefreshIndicator({
  variant = 'compact',
  showProgress = true,
  showErrors = true,
  showLastUpdate = true,
  className,
}: DataRefreshIndicatorProps) {
  const {
    isRefreshing,
    lastRefresh,
    nextRefresh,
    progress,
    errors,
    refresh,
    retryFailed,
    clearErrors,
  } = useDataRefresh();

  const formatTimestamp = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const formatNextRefresh = (date: Date | null) => {
    if (!date) return null;
    
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `in ${seconds}s`;
    return `in ${minutes}m`;
  };

  // Button-only variant
  if (variant === 'button-only') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refresh({ forceRefresh: true })}
              disabled={isRefreshing}
              className={cn('relative', className)}
            >
              <RefreshCw
                className={cn(
                  'h-4 w-4',
                  isRefreshing && 'animate-spin'
                )}
              />
              {errors.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh data</p>
            {lastRefresh && <p className="text-xs text-muted-foreground">Last: {formatTimestamp(lastRefresh)}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh({ forceRefresh: true })}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw
            className={cn(
              'h-3.5 w-3.5',
              isRefreshing && 'animate-spin'
            )}
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>

        {showLastUpdate && lastRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(lastRefresh)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last updated: {lastRefresh.toLocaleString()}</p>
                {nextRefresh && <p>Next refresh: {formatNextRefresh(nextRefresh)}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {errors.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={retryFailed}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{errors.length} source(s) failed</p>
                <p className="text-xs">Click to retry</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Data Status</h3>
          {!isRefreshing && errors.length === 0 && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh({ forceRefresh: true })}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw
            className={cn(
              'h-3.5 w-3.5',
              isRefreshing && 'animate-spin'
            )}
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </Button>
      </div>

      {/* Progress bar */}
      {showProgress && isRefreshing && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Refreshing data... {progress}%
          </p>
        </div>
      )}

      {/* Last update info */}
      {showLastUpdate && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Last updated: {formatTimestamp(lastRefresh)}</span>
          </div>
          {nextRefresh && (
            <span>Next refresh: {formatNextRefresh(nextRefresh)}</span>
          )}
        </div>
      )}

      {/* Errors */}
      {showErrors && errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {errors.length} data source(s) failed to refresh
              </p>
              <ul className="mt-1 text-xs list-disc list-inside">
                {errors.slice(0, 3).map((error, index) => (
                  <li key={index}>
                    {error.source}: {error.message}
                  </li>
                ))}
                {errors.length > 3 && (
                  <li>...and {errors.length - 3} more</li>
                )}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={retryFailed}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearErrors}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Inline refresh button for use in headers
 */
export function InlineRefreshButton({ className }: { className?: string }) {
  return <DataRefreshIndicator variant="button-only" className={className} />;
}

/**
 * Compact refresh status for use in toolbars
 */
export function CompactRefreshStatus({ className }: { className?: string }) {
  return <DataRefreshIndicator variant="compact" className={className} />;
}
