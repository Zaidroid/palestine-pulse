/**
 * Mobile Responsive Utilities
 * Utilities for optimizing layouts on mobile devices
 */

import { type Breakpoint } from '@/hooks/useBreakpoint';

/**
 * Get responsive spacing value based on breakpoint
 */
export function getResponsiveSpacing(
  breakpoint: Breakpoint,
  config?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  }
): number {
  const defaultSpacing = {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 32,
  };

  const spacing = { ...defaultSpacing, ...config };
  return spacing[breakpoint];
}

/**
 * Get responsive font size based on breakpoint
 */
export function getResponsiveFontSize(
  breakpoint: Breakpoint,
  baseSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
): string {
  const fontSizeMap = {
    mobile: {
      xs: '0.625rem',    // 10px
      sm: '0.75rem',     // 12px
      base: '0.875rem',  // 14px
      lg: '1rem',        // 16px
      xl: '1.125rem',    // 18px
      '2xl': '1.25rem',  // 20px
      '3xl': '1.5rem',   // 24px
      '4xl': '1.875rem', // 30px
    },
    tablet: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    desktop: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    wide: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
  };

  return fontSizeMap[breakpoint][baseSize];
}

/**
 * Get responsive chart height based on breakpoint
 */
export function getResponsiveChartHeight(breakpoint: Breakpoint): number {
  const heights = {
    mobile: 280,
    tablet: 350,
    desktop: 400,
    wide: 450,
  };

  return heights[breakpoint];
}

/**
 * Get responsive padding based on breakpoint
 */
export function getResponsivePadding(
  breakpoint: Breakpoint,
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const paddingMap = {
    mobile: {
      sm: '0.5rem',   // 8px
      md: '0.75rem',  // 12px
      lg: '1rem',     // 16px
    },
    tablet: {
      sm: '0.75rem',  // 12px
      md: '1rem',     // 16px
      lg: '1.25rem',  // 20px
    },
    desktop: {
      sm: '0.75rem',  // 12px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
    },
    wide: {
      sm: '1rem',     // 16px
      md: '1.25rem',  // 20px
      lg: '1.5rem',   // 24px
    },
  };

  return paddingMap[breakpoint][size];
}

/**
 * Check if viewport is mobile-sized
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if viewport is tablet-sized
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Get responsive container max-width
 */
export function getResponsiveContainerWidth(breakpoint: Breakpoint): string {
  const widths = {
    mobile: '100%',
    tablet: '100%',
    desktop: '1280px',
    wide: '1536px',
  };

  return widths[breakpoint];
}

/**
 * Get responsive grid gap
 */
export function getResponsiveGridGap(breakpoint: Breakpoint): number {
  const gaps = {
    mobile: 12,
    tablet: 16,
    desktop: 24,
    wide: 32,
  };

  return gaps[breakpoint];
}
