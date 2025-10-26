/**
 * Enhanced Chart Tooltip
 * 
 * Interactive tooltip with:
 * - Frosted glass effect
 * - Fade + slide animation from cursor direction
 * - Rich content display with trends
 * - Responsive positioning
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animation';

export interface TooltipPayload {
  name?: string;
  value?: number | string;
  dataKey?: string;
  color?: string;
  payload?: any;
  unit?: string;
}

export interface EnhancedChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  coordinate?: { x: number; y: number };
  viewBox?: { width: number; height: number };
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (label: string) => React.ReactNode;
  showTrend?: boolean;
  showComparison?: boolean;
  className?: string;
}

export const EnhancedChartTooltip: React.FC<EnhancedChartTooltipProps> = ({
  active,
  payload,
  label,
  coordinate,
  viewBox,
  formatter,
  labelFormatter,
  showTrend = false,
  showComparison = false,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Calculate animation direction based on cursor position
  const animationDirection = useMemo(() => {
    if (!coordinate || !viewBox) return { x: 0, y: 10 };

    const { x, y } = coordinate;
    const { width, height } = viewBox;

    // Determine slide direction based on quadrant
    const fromLeft = x < width / 2;
    const fromTop = y < height / 2;

    return {
      x: fromLeft ? -10 : 10,
      y: fromTop ? -10 : 10,
    };
  }, [coordinate, viewBox]);

  // Calculate trend if previous data is available
  const trendData = useMemo(() => {
    if (!showTrend || !payload || payload.length === 0) return null;

    const currentValue = payload[0]?.value;
    const previousValue = payload[0]?.payload?.previousValue;

    if (typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      return null;
    }

    const change = currentValue - previousValue;
    const percentChange = previousValue !== 0 
      ? ((change / previousValue) * 100).toFixed(1)
      : '0.0';

    return {
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  }, [payload, showTrend]);

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : {
          opacity: 0,
          x: animationDirection.x,
          y: animationDirection.y,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        }}
        exit={prefersReducedMotion ? { opacity: 0 } : {
          opacity: 0,
          scale: 0.95,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.15,
          ease: 'easeOut',
        }}
        className={cn(
          'rounded-lg border border-border/50 shadow-xl',
          'bg-background/95 backdrop-blur-md',
          'px-3 py-2.5 min-w-[160px]',
          className
        )}
      >
        {/* Label */}
        {label && (
          <div className="text-sm font-medium text-foreground mb-2 pb-2 border-b border-border/50">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}

        {/* Payload Items */}
        <div className="space-y-2">
          {payload.map((item, index) => {
            const displayValue = formatter
              ? formatter(item.value, item.name || '', item)
              : typeof item.value === 'number'
              ? item.value.toLocaleString()
              : item.value;

            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Color Indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  
                  {/* Name */}
                  <span className="text-xs text-muted-foreground truncate">
                    {item.name || item.dataKey}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {displayValue}
                    {item.unit && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {item.unit}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trend Indicator */}
        {trendData && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs">
              {trendData.trend === 'up' && (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    +{trendData.percentChange}%
                  </span>
                </>
              )}
              {trendData.trend === 'down' && (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {trendData.percentChange}%
                  </span>
                </>
              )}
              {trendData.trend === 'neutral' && (
                <>
                  <Minus className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">
                    No change
                  </span>
                </>
              )}
              <span className="text-muted-foreground">vs previous</span>
            </div>
          </div>
        )}

        {/* Comparison Data */}
        {showComparison && payload[0]?.payload?.comparison && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-1">
              Comparison
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {payload[0].payload.comparison.label}
              </span>
              <span className="text-xs font-mono font-medium">
                {typeof payload[0].payload.comparison.value === 'number'
                  ? payload[0].payload.comparison.value.toLocaleString()
                  : payload[0].payload.comparison.value}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

EnhancedChartTooltip.displayName = 'EnhancedChartTooltip';

// ============================================
// SIMPLE TOOLTIP VARIANT
// ============================================

export interface SimpleChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  className?: string;
}

export const SimpleChartTooltip: React.FC<SimpleChartTooltipProps> = ({
  active,
  payload,
  label,
  className,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-md border border-border/50 shadow-lg',
        'bg-background/95 backdrop-blur-sm',
        'px-2.5 py-2 text-xs',
        className
      )}
    >
      {label && (
        <div className="font-medium text-foreground mb-1">
          {label}
        </div>
      )}
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.name}:</span>
          <span className="font-mono font-medium text-foreground">
            {typeof item.value === 'number'
              ? item.value.toLocaleString()
              : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

SimpleChartTooltip.displayName = 'SimpleChartTooltip';

// ============================================
// TREND INDICATOR COMPONENT
// ============================================

export interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  showPercentage?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  showPercentage = true,
  showIcon = true,
  className,
}) => {
  const change = value - previousValue;
  const percentChange = previousValue !== 0
    ? ((change / previousValue) * 100).toFixed(1)
    : '0.0';
  
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  const trendConfig = {
    up: {
      icon: ArrowUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-950',
      prefix: '+',
    },
    down: {
      icon: ArrowDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-950',
      prefix: '',
    },
    neutral: {
      icon: Minus,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      prefix: '',
    },
  };

  const config = trendConfig[trend];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
        config.bg,
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {showPercentage && (
        <span>
          {config.prefix}{percentChange}%
        </span>
      )}
    </div>
  );
};

TrendIndicator.displayName = 'TrendIndicator';
