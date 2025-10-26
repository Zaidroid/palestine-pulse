/**
 * ResponsiveGrid Component
 * Adaptive grid layout with configurable columns per breakpoint
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBreakpoint, type Breakpoint } from '@/hooks/useBreakpoint';

export interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: number;
  className?: string;
  animate?: boolean;
}

/**
 * ResponsiveGrid component with adaptive column layout
 * Automatically adjusts columns based on viewport breakpoint
 */
export function ResponsiveGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = 24,
  className,
  animate = false,
}: ResponsiveGridProps) {
  const { breakpoint } = useBreakpoint();

  // Get column count for current breakpoint
  const columnCount = columns[breakpoint] ?? columns.desktop ?? 3;

  // Generate grid template columns
  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns,
    gap: `${gap}px`,
  };

  if (animate) {
    return (
      <motion.div
        className={cn('w-full', className)}
        style={gridStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn('w-full', className)} style={gridStyles}>
      {children}
    </div>
  );
}

/**
 * ResponsiveGridItem component for individual grid items
 * Supports custom column spans per breakpoint
 */
export interface ResponsiveGridItemProps {
  children: React.ReactNode;
  colSpan?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  className?: string;
}

export function ResponsiveGridItem({
  children,
  colSpan,
  className,
}: ResponsiveGridItemProps) {
  const { breakpoint } = useBreakpoint();

  // Get column span for current breakpoint
  const span = colSpan?.[breakpoint] ?? 1;

  const itemStyles = {
    gridColumn: span > 1 ? `span ${span}` : undefined,
  };

  return (
    <div className={cn('w-full', className)} style={itemStyles}>
      {children}
    </div>
  );
}

/**
 * Utility function to get responsive column configuration
 */
export function getResponsiveColumns(
  breakpoint: Breakpoint,
  columns?: ResponsiveGridProps['columns']
): number {
  const defaultColumns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  };

  const config = { ...defaultColumns, ...columns };
  return config[breakpoint];
}
