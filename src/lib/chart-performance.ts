/**
 * Chart Performance Optimization Utilities
 * Provides lazy loading, memoization, and performance monitoring for charts
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer hook for lazy loading charts
 */
export function useChartLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
}

/**
 * Debounce hook for resize events
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Performance monitoring for chart rendering
 */
export function useChartPerformance(chartName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    
    if (lastRenderTime.current > 0) {
      const timeSinceLastRender = now - lastRenderTime.current;
      
      // Log if re-renders are happening too frequently
      if (timeSinceLastRender < 100 && renderCount.current > 5) {
        console.warn(
          `[Performance] ${chartName} is re-rendering frequently. ` +
          `Render count: ${renderCount.current}, ` +
          `Time since last render: ${timeSinceLastRender.toFixed(2)}ms`
        );
      }
    }
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    resetCount: () => { renderCount.current = 0; }
  };
}

/**
 * Throttle function for expensive operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if chart data should trigger re-render
 */
export function shouldUpdateChart<T>(prevData: T[], newData: T[]): boolean {
  if (prevData.length !== newData.length) return true;
  
  // Deep comparison for first and last items (heuristic)
  if (prevData.length > 0) {
    const firstChanged = JSON.stringify(prevData[0]) !== JSON.stringify(newData[0]);
    const lastChanged = JSON.stringify(prevData[prevData.length - 1]) !== JSON.stringify(newData[newData.length - 1]);
    
    if (firstChanged || lastChanged) return true;
  }
  
  return false;
}

/**
 * Optimize SVG rendering by reducing precision
 */
export function optimizeSVGPath(path: string, precision = 2): string {
  return path.replace(/(\d+\.\d+)/g, (match) => {
    return parseFloat(match).toFixed(precision);
  });
}

/**
 * Batch DOM updates for better performance
 */
export function batchDOMUpdates(updates: Array<() => void>): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}
