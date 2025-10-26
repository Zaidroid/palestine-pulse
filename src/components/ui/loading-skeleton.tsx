import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the skeleton to display
   */
  variant?: 'card' | 'chart' | 'text' | 'avatar' | 'custom';
  /**
   * Number of skeleton elements to render
   */
  count?: number;
  /**
   * Height of the skeleton (for custom variant)
   */
  height?: number;
  /**
   * Width of the skeleton (for custom variant)
   */
  width?: number | string;
  /**
   * Whether to animate the shimmer effect
   */
  animate?: boolean;
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ 
    variant = 'custom', 
    count = 1, 
    height, 
    width, 
    animate = true,
    className, 
    ...props 
  }, ref) => {
    const renderSkeleton = () => {
      switch (variant) {
        case 'card':
          return (
            <div className={cn('rounded-xl border bg-card p-6 space-y-4', className)}>
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div 
                    className={cn(
                      'h-4 w-32 rounded-md bg-muted',
                      animate && 'animate-shimmer'
                    )} 
                  />
                  <div 
                    className={cn(
                      'h-8 w-24 rounded-md bg-muted',
                      animate && 'animate-shimmer'
                    )} 
                  />
                </div>
                <div 
                  className={cn(
                    'h-10 w-10 rounded-lg bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
              </div>
              
              {/* Card content */}
              <div className="space-y-2">
                <div 
                  className={cn(
                    'h-3 w-full rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
                <div 
                  className={cn(
                    'h-3 w-4/5 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
              </div>
              
              {/* Card footer */}
              <div className="flex items-center gap-2 pt-2">
                <div 
                  className={cn(
                    'h-5 w-20 rounded-full bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
                <div 
                  className={cn(
                    'h-5 w-16 rounded-full bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
              </div>
            </div>
          );

        case 'chart':
          return (
            <div className={cn('rounded-xl border bg-card p-6 space-y-4', className)}>
              {/* Chart header */}
              <div className="space-y-2">
                <div 
                  className={cn(
                    'h-5 w-40 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
                <div 
                  className={cn(
                    'h-3 w-64 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
              </div>
              
              {/* Chart area with axis lines */}
              <div className="relative h-64 w-full">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        'h-2 w-6 rounded bg-muted',
                        animate && 'animate-shimmer'
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                
                {/* Chart content */}
                <div className="ml-10 h-full flex items-end gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        'flex-1 rounded-t bg-muted',
                        animate && 'animate-shimmer'
                      )}
                      style={{ 
                        height: `${Math.random() * 60 + 40}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
                
                {/* X-axis */}
                <div className="ml-10 mt-2 flex justify-between">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        'h-2 w-12 rounded bg-muted',
                        animate && 'animate-shimmer'
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );

        case 'text':
          return (
            <div className={cn('space-y-2', className)}>
              {[...Array(count)].map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    'h-4 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )}
                  style={{ 
                    width: i === count - 1 ? '80%' : '100%',
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
          );

        case 'avatar':
          return (
            <div className={cn('flex items-center gap-3', className)}>
              <div 
                className={cn(
                  'h-10 w-10 rounded-full bg-muted',
                  animate && 'animate-shimmer'
                )} 
              />
              <div className="space-y-2 flex-1">
                <div 
                  className={cn(
                    'h-4 w-32 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
                <div 
                  className={cn(
                    'h-3 w-24 rounded bg-muted',
                    animate && 'animate-shimmer'
                  )} 
                />
              </div>
            </div>
          );

        case 'custom':
        default:
          return (
            <div 
              ref={ref}
              className={cn(
                'rounded bg-muted',
                animate && 'animate-shimmer',
                className
              )}
              style={{
                height: height ? `${height}px` : undefined,
                width: typeof width === 'number' ? `${width}px` : width,
              }}
              {...props}
            />
          );
      }
    };

    if (variant === 'custom' && count > 1) {
      return (
        <div className="space-y-2">
          {[...Array(count)].map((_, i) => (
            <div 
              key={i}
              ref={i === 0 ? ref : undefined}
              className={cn(
                'rounded bg-muted',
                animate && 'animate-shimmer',
                className
              )}
              style={{
                height: height ? `${height}px` : undefined,
                width: typeof width === 'number' ? `${width}px` : width,
                animationDelay: `${i * 50}ms`
              }}
              {...props}
            />
          ))}
        </div>
      );
    }

    return renderSkeleton();
  }
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

export { LoadingSkeleton };
