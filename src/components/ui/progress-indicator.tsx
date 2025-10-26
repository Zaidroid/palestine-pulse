import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  progress: number;
  /**
   * Optional label to display
   */
  label?: string;
  /**
   * Variant of the progress indicator
   */
  variant?: 'linear' | 'circular';
  /**
   * Size of the indicator
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show the progress as indeterminate (unknown progress)
   */
  indeterminate?: boolean;
  /**
   * Whether to show the percentage text
   */
  showPercentage?: boolean;
  /**
   * Color variant
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
}

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ 
    progress = 0,
    label,
    variant = 'linear',
    size = 'md',
    indeterminate = false,
    showPercentage = true,
    color = 'primary',
    className,
    ...props
  }, ref) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-green-500',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
    };

    const sizeClasses = {
      linear: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
      circular: {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
      },
    };

    if (variant === 'circular') {
      const circleSize = size === 'sm' ? 48 : size === 'md' ? 64 : 96;
      const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
      const radius = (circleSize - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = indeterminate ? 0 : circumference - (clampedProgress / 100) * circumference;

      return (
        <div 
          ref={ref}
          className={cn('inline-flex flex-col items-center gap-2', className)}
          {...props}
        >
          <div className={cn('relative', sizeClasses.circular[size])}>
            <svg
              className="transform -rotate-90"
              width={circleSize}
              height={circleSize}
            >
              {/* Background circle */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-muted"
              />
              
              {/* Progress circle */}
              {indeterminate ? (
                <motion.circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={cn('text-primary', {
                    'text-primary': color === 'primary',
                    'text-secondary': color === 'secondary',
                    'text-green-500': color === 'success',
                    'text-warning': color === 'warning',
                    'text-destructive': color === 'destructive',
                  })}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference * 0.75 }}
                  animate={{
                    strokeDashoffset: [
                      circumference * 0.75,
                      circumference * 0.25,
                      circumference * 0.75,
                    ],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ) : (
                <motion.circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={cn('text-primary', {
                    'text-primary': color === 'primary',
                    'text-secondary': color === 'secondary',
                    'text-green-500': color === 'success',
                    'text-warning': color === 'warning',
                    'text-destructive': color === 'destructive',
                  })}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </svg>
            
            {/* Center text */}
            {!indeterminate && showPercentage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  'font-mono font-semibold',
                  size === 'sm' && 'text-xs',
                  size === 'md' && 'text-sm',
                  size === 'lg' && 'text-base'
                )}>
                  {Math.round(clampedProgress)}%
                </span>
              </div>
            )}
          </div>
          
          {label && (
            <span className={cn(
              'text-sm text-muted-foreground text-center',
              size === 'sm' && 'text-xs',
              size === 'lg' && 'text-base'
            )}>
              {label}
            </span>
          )}
        </div>
      );
    }

    // Linear variant
    return (
      <div 
        ref={ref}
        className={cn('w-full space-y-2', className)}
        {...props}
      >
        {(label || showPercentage) && (
          <div className="flex items-center justify-between text-sm">
            {label && (
              <span className="text-muted-foreground">{label}</span>
            )}
            {!indeterminate && showPercentage && (
              <span className="font-mono font-medium">
                {Math.round(clampedProgress)}%
              </span>
            )}
          </div>
        )}
        
        <div className={cn(
          'w-full rounded-full bg-muted overflow-hidden',
          sizeClasses.linear[size]
        )}>
          {indeterminate ? (
            <motion.div
              className={cn(
                'h-full rounded-full',
                colorClasses[color]
              )}
              initial={{ x: '-100%', width: '40%' }}
              animate={{
                x: ['100%', '-100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <motion.div
              className={cn(
                'h-full rounded-full',
                colorClasses[color]
              )}
              initial={{ width: 0 }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

ProgressIndicator.displayName = 'ProgressIndicator';

export { ProgressIndicator };
