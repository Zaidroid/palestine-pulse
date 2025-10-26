/**
 * Mobile Chart Configuration
 * Utilities for optimizing charts on mobile devices
 */

import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface MobileChartConfig {
  height: number;
  fontSize: number;
  tickCount: number;
  showGrid: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  strokeWidth: number;
  dotSize: number;
}

/**
 * Default chart configurations for different breakpoints
 */
export const chartConfigs = {
  mobile: {
    height: 300,
    fontSize: 11,
    tickCount: 4,
    showGrid: true,
    showLegend: true,
    legendPosition: 'bottom' as const,
    margin: { top: 10, right: 10, bottom: 30, left: 10 },
    strokeWidth: 2,
    dotSize: 4,
  },
  tablet: {
    height: 350,
    fontSize: 12,
    tickCount: 6,
    showGrid: true,
    showLegend: true,
    legendPosition: 'bottom' as const,
    margin: { top: 15, right: 15, bottom: 40, left: 15 },
    strokeWidth: 2,
    dotSize: 5,
  },
  desktop: {
    height: 400,
    fontSize: 13,
    tickCount: 8,
    showGrid: true,
    showLegend: true,
    legendPosition: 'bottom' as const,
    margin: { top: 20, right: 20, bottom: 50, left: 20 },
    strokeWidth: 2.5,
    dotSize: 6,
  },
} as const;

/**
 * Hook to get responsive chart configuration
 */
export function useMobileChartConfig(
  overrides?: Partial<MobileChartConfig>
): MobileChartConfig {
  const { isMobile, isTablet } = useBreakpoint();

  const baseConfig = isMobile
    ? chartConfigs.mobile
    : isTablet
    ? chartConfigs.tablet
    : chartConfigs.desktop;

  return {
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Simplify axis labels for mobile
 */
export function simplifyAxisLabel(label: string, maxLength: number = 10): string {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + '...';
}

/**
 * Format tick values for mobile displays
 */
export function formatMobileTick(value: number, isMobile: boolean): string {
  if (!isMobile) return value.toLocaleString();

  // Simplify large numbers on mobile
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Get responsive chart props for Recharts
 */
export function getResponsiveChartProps(isMobile: boolean) {
  const config = isMobile ? chartConfigs.mobile : chartConfigs.desktop;

  return {
    height: config.height,
    margin: config.margin,
    style: {
      fontSize: config.fontSize,
    },
  };
}

/**
 * Get responsive axis props
 */
export function getResponsiveAxisProps(isMobile: boolean) {
  const config = isMobile ? chartConfigs.mobile : chartConfigs.desktop;

  return {
    tick: { fontSize: config.fontSize },
    tickCount: config.tickCount,
    tickFormatter: (value: number) => formatMobileTick(value, isMobile),
  };
}

/**
 * Get responsive legend props
 */
export function getResponsiveLegendProps(isMobile: boolean) {
  const config = isMobile ? chartConfigs.mobile : chartConfigs.desktop;

  return {
    wrapperStyle: { fontSize: config.fontSize },
    iconSize: isMobile ? 10 : 14,
    verticalAlign: config.legendPosition === 'top' || config.legendPosition === 'bottom' 
      ? config.legendPosition 
      : 'middle' as const,
    align: config.legendPosition === 'left' || config.legendPosition === 'right'
      ? config.legendPosition
      : 'center' as const,
  };
}

/**
 * Calculate optimal number of ticks based on container width
 */
export function calculateOptimalTicks(containerWidth: number): number {
  if (containerWidth < 400) return 4;
  if (containerWidth < 600) return 6;
  if (containerWidth < 800) return 8;
  return 10;
}

/**
 * Determine if chart should show grid based on screen size
 */
export function shouldShowGrid(isMobile: boolean, chartType: string): boolean {
  // Always show grid for line and area charts
  if (chartType === 'line' || chartType === 'area') return true;
  
  // Hide grid on mobile for bar charts to reduce clutter
  if (chartType === 'bar' && isMobile) return false;
  
  return true;
}

/**
 * Get touch-optimized tooltip props
 */
export function getTouchTooltipProps(isMobile: boolean) {
  return {
    cursor: isMobile ? { strokeWidth: 2 } : { strokeWidth: 1 },
    wrapperStyle: {
      fontSize: isMobile ? 12 : 13,
      zIndex: 1000,
    },
    contentStyle: {
      padding: isMobile ? '8px' : '12px',
      borderRadius: '8px',
    },
  };
}
