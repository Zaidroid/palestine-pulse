/**
 * Breakpoint Hook
 * Provides responsive breakpoint detection and utilities
 */

import { useEffect, useState } from 'react';

/**
 * Breakpoint definitions matching Tailwind CSS defaults
 */
export const breakpoints = {
  mobile: 0,      // < 768px
  tablet: 768,    // 768px - 1024px
  desktop: 1024,  // 1024px - 1440px
  wide: 1440,     // > 1440px
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get current breakpoint based on window width
 */
function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Hook to get current breakpoint
 * Returns the current breakpoint and helper functions
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getCurrentBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint(window.innerWidth);
      setBreakpoint(newBreakpoint);
    };

    // Set initial value
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  const isWide = breakpoint === 'wide';
  
  const isMobileOrTablet = isMobile || isTablet;
  const isDesktopOrWide = isDesktop || isWide;
  
  const isAtLeast = (bp: Breakpoint) => {
    const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
    const currentIndex = order.indexOf(breakpoint);
    const targetIndex = order.indexOf(bp);
    return currentIndex >= targetIndex;
  };

  const isAtMost = (bp: Breakpoint) => {
    const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
    const currentIndex = order.indexOf(breakpoint);
    const targetIndex = order.indexOf(bp);
    return currentIndex <= targetIndex;
  };

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isMobileOrTablet,
    isDesktopOrWide,
    isAtLeast,
    isAtMost,
  };
}

/**
 * Hook to check if a specific breakpoint is active
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Breakpoint-aware value selector
 * Returns different values based on current breakpoint
 */
export function useBreakpointValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
  default: T;
}): T {
  const { breakpoint } = useBreakpoint();
  
  // Return breakpoint-specific value or fall back to default
  return values[breakpoint] ?? values.default;
}
