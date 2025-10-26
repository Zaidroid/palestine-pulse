/**
 * AnimatedCounter Component
 * Smoothly animates numeric values from 0 to target with count-up animation
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { useCountUp } from "../../lib/animation/hooks";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * Format number with thousand separators
 */
function formatNumber(value: number, decimals: number, separator: string): string {
  const fixed = value.toFixed(decimals);
  const [integer, decimal] = fixed.split('.');
  
  // Add thousand separators
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
}

export const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      value,
      duration = 1500,
      decimals = 0,
      prefix = '',
      suffix = '',
      separator = ',',
      className,
      onComplete,
    },
    ref
  ) => {
    const { count } = useCountUp({
      start: 0,
      end: value,
      duration,
      decimals,
      onComplete,
    });

    const formattedValue = React.useMemo(() => {
      return formatNumber(count, decimals, separator);
    }, [count, decimals, separator]);

    return (
      <span
        ref={ref}
        className={cn("font-mono tabular-nums", className)}
        aria-live="polite"
        aria-atomic="true"
      >
        {prefix}
        {formattedValue}
        {suffix}
      </span>
    );
  }
);

AnimatedCounter.displayName = "AnimatedCounter";
