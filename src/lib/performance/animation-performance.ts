/**
 * Animation Performance Optimizations
 * 
 * Utilities for optimizing animation performance using GPU acceleration,
 * will-change property, and throttling. Implements requirement 11.2.
 */

import { CSSProperties, useEffect, useRef, useCallback } from 'react';

/**
 * CSS properties that trigger GPU acceleration
 */
const GPU_ACCELERATED_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
] as const;

/**
 * Get optimized animation styles for GPU acceleration
 */
export function getGPUAcceleratedStyles(
  properties: string[] = ['transform']
): CSSProperties {
  return {
    // Force GPU acceleration
    transform: 'translateZ(0)',
    // Enable hardware acceleration
    backfaceVisibility: 'hidden',
    // Optimize for animations
    perspective: 1000,
    // Hint browser about upcoming changes
    willChange: properties.join(', '),
  };
}

/**
 * Hook to manage will-change property strategically
 * Only applies will-change when animation is about to happen
 */
export function useWillChange(
  properties: string[],
  isAnimating: boolean
): CSSProperties {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Remove will-change after animation completes
    if (!isAnimating) {
      timeoutRef.current = setTimeout(() => {
        // Will-change is removed by returning empty object
      }, 1000); // Wait 1s after animation ends
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating]);

  return isAnimating
    ? { willChange: properties.join(', ') }
    : {};
}

/**
 * Throttle function for scroll-based animations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  };
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Hook for throttled scroll handler
 */
export function useThrottledScroll(
  callback: (event: Event) => void,
  delay: number = 16 // ~60fps
): void {
  const throttledCallback = useCallback(
    throttle(callback, delay),
    [callback, delay]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
}

/**
 * Hook for throttled resize handler
 */
export function useThrottledResize(
  callback: (event: Event) => void,
  delay: number = 100
): void {
  const throttledCallback = useCallback(
    throttle(callback, delay),
    [callback, delay]
  );

  useEffect(() => {
    window.addEventListener('resize', throttledCallback, { passive: true });
    
    return () => {
      window.removeEventListener('resize', throttledCallback);
    };
  }, [throttledCallback]);
}

/**
 * Request animation frame wrapper for smooth animations
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  isActive: boolean = true
): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isActive]);
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(
    prefersReducedMotion()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setShouldReduceMotion(mediaQuery.matches);
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
  }, []);

  return shouldReduceMotion;
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedMotion: boolean = prefersReducedMotion()
): number {
  return reducedMotion ? 0 : normalDuration;
}

/**
 * Optimize animation for performance
 */
export function optimizeAnimation(element: HTMLElement): void {
  // Apply GPU acceleration
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
}

/**
 * Clean up animation optimizations
 */
export function cleanupAnimation(element: HTMLElement): void {
  element.style.willChange = 'auto';
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
}

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  read(callback: () => void): void {
    this.readQueue.push(callback);
    this.schedule();
  }

  write(callback: () => void): void {
    this.writeQueue.push(callback);
    this.schedule();
  }

  private schedule(): void {
    if (this.scheduled) return;
    
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush(): void {
    // Execute all reads first
    const reads = this.readQueue.splice(0);
    reads.forEach(callback => callback());

    // Then execute all writes
    const writes = this.writeQueue.splice(0);
    writes.forEach(callback => callback());

    this.scheduled = false;
  }
}

// Export singleton instance
export const domBatcher = new DOMBatcher();

// Fix: Import React for useReducedMotion hook
import * as React from 'react';
