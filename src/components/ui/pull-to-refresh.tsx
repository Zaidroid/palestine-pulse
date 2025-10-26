/**
 * Pull to Refresh Component
 * Implements pull-to-refresh gesture for mobile devices
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2 } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';

export interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Pull-to-refresh container
 * Wraps content and enables pull-to-refresh gesture
 */
export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isRefreshing, pullDistance, progress } = usePullToRefresh(
    containerRef,
    {
      onRefresh,
      threshold,
      maxPullDistance,
      disabled,
    }
  );

  const showIndicator = pullDistance > 0 || isRefreshing;
  const isReady = progress >= 1;

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-auto', className)}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-sm border rounded-full shadow-lg">
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">Refreshing...</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: isReady ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RefreshCw
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isReady ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </motion.div>
                  <span className="text-sm font-medium">
                    {isReady ? 'Release to refresh' : 'Pull to refresh'}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{
          y: isRefreshing ? 60 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Simple refresh button for non-touch devices
 */
export interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
  className?: string;
}

export function RefreshButton({
  onRefresh,
  isRefreshing = false,
  className,
}: RefreshButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (loading || isRefreshing) return;

    setLoading(true);
    try {
      await onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || isRefreshing}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-md',
        'bg-background border hover:bg-accent',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      aria-label="Refresh data"
    >
      {loading || isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">Refresh</span>
    </button>
  );
}
