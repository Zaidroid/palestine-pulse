/**
 * Mobile Enhanced Chart
 * Chart component with mobile-specific optimizations
 */

import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useMobileChartConfig } from '@/lib/mobile-chart-config';
import { MobileChartContainer } from './mobile-layout';
import { PinchableChart } from './pinchable-chart';
import { cn } from '@/lib/utils';

export interface MobileEnhancedChartProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  mobileHeight?: number;
  desktopHeight?: number;
  enablePinchZoom?: boolean;
  simplifyOnMobile?: boolean;
  className?: string;
}

/**
 * Chart wrapper with mobile optimizations
 */
export function MobileEnhancedChart({
  children,
  title,
  description,
  mobileHeight = 300,
  desktopHeight = 400,
  enablePinchZoom = true,
  simplifyOnMobile = true,
  className,
}: MobileEnhancedChartProps) {
  const { isMobile, isMobileOrTablet } = useBreakpoint();
  const chartConfig = useMobileChartConfig();

  const chartContent = (
    <MobileChartContainer
      mobileHeight={mobileHeight}
      desktopHeight={desktopHeight}
      simplifyOnMobile={simplifyOnMobile}
      className={cn('relative', className)}
    >
      {children}
    </MobileChartContainer>
  );

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className={cn(
              'font-semibold',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn(
              'text-muted-foreground',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      {enablePinchZoom && isMobileOrTablet ? (
        <PinchableChart showControls={false}>
          {chartContent}
        </PinchableChart>
      ) : (
        chartContent
      )}

      {/* Mobile hint */}
      {isMobile && enablePinchZoom && (
        <p className="text-xs text-center text-muted-foreground">
          Pinch to zoom • Swipe to pan
        </p>
      )}
    </div>
  );
}

export interface MobileChartGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 2 | 3 | 4;
  };
  className?: string;
}

/**
 * Grid layout for multiple charts with mobile optimization
 */
export function MobileChartGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 2 },
  className,
}: MobileChartGridProps) {
  const columnClasses = {
    mobile: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
    },
    tablet: {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
    },
    desktop: {
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
    },
  };

  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        columnClasses.mobile[columns.mobile || 1],
        columnClasses.tablet[columns.tablet || 2],
        columnClasses.desktop[columns.desktop || 2],
        className
      )}
    >
      {children}
    </div>
  );
}
