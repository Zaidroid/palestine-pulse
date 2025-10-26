/**
 * Scroll Restoration Hook
 * Saves and restores scroll position on navigation
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Storage key for scroll positions
 */
const SCROLL_STORAGE_KEY = 'scroll-positions';

/**
 * Interface for stored scroll position
 */
interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * In-memory cache for scroll positions
 * Persists across navigation within the same session
 */
const scrollCache = new Map<string, ScrollPosition>();

/**
 * Maximum age for cached scroll positions (5 minutes)
 */
const MAX_CACHE_AGE = 5 * 60 * 1000;

/**
 * Save scroll position for a given path
 */
function saveScrollPosition(path: string): void {
  const position: ScrollPosition = {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now(),
  };

  scrollCache.set(path, position);

  // Also save to sessionStorage for persistence across page reloads
  try {
    const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    const positions = stored ? JSON.parse(stored) : {};
    positions[path] = position;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
  } catch (error) {
    console.warn('[ScrollRestoration] Failed to save to sessionStorage:', error);
  }
}

/**
 * Get saved scroll position for a given path
 */
function getScrollPosition(path: string): ScrollPosition | null {
  // Check in-memory cache first
  const cached = scrollCache.get(path);
  if (cached) {
    // Check if cache is still valid
    if (Date.now() - cached.timestamp < MAX_CACHE_AGE) {
      return cached;
    } else {
      // Remove stale cache
      scrollCache.delete(path);
    }
  }

  // Check sessionStorage
  try {
    const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (stored) {
      const positions = JSON.parse(stored);
      const position = positions[path];
      
      if (position && Date.now() - position.timestamp < MAX_CACHE_AGE) {
        // Update in-memory cache
        scrollCache.set(path, position);
        return position;
      }
    }
  } catch (error) {
    console.warn('[ScrollRestoration] Failed to read from sessionStorage:', error);
  }

  return null;
}

/**
 * Restore scroll position for a given path
 */
function restoreScrollPosition(path: string, smooth: boolean = false): void {
  const position = getScrollPosition(path);
  
  if (position) {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior: smooth ? 'smooth' : 'auto',
      });
      console.log(`[ScrollRestoration] Restored scroll position for ${path}:`, position);
    });
  } else {
    // No saved position, scroll to top
    requestAnimationFrame(() => {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'auto',
      });
    });
  }
}

/**
 * Clear all saved scroll positions
 */
export function clearScrollPositions(): void {
  scrollCache.clear();
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch (error) {
    console.warn('[ScrollRestoration] Failed to clear sessionStorage:', error);
  }
}

/**
 * Hook for automatic scroll restoration
 * Automatically saves scroll position on navigation and restores on back/forward
 * 
 * @example
 * ```tsx
 * function App() {
 *   useScrollRestoration();
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
export function useScrollRestoration(options: {
  /**
   * Enable smooth scrolling when restoring
   */
  smooth?: boolean;
  /**
   * Disable automatic restoration (manual control)
   */
  manual?: boolean;
  /**
   * Debounce delay for saving scroll position (ms)
   */
  saveDelay?: number;
} = {}) {
  const { smooth = false, manual = false, saveDelay = 100 } = options;
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathRef = useRef<string>(location.pathname);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Save scroll position when navigating away
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    // Save previous path's scroll position
    if (previousPath !== currentPath) {
      saveScrollPosition(previousPath);
    }

    // Update ref
    previousPathRef.current = currentPath;
  }, [location.pathname]);

  // Restore scroll position on mount and navigation
  useEffect(() => {
    if (manual) return;

    const currentPath = location.pathname;

    // Only restore on POP (back/forward navigation)
    if (navigationType === 'POP') {
      restoreScrollPosition(currentPath, smooth);
    } else {
      // For PUSH/REPLACE, scroll to top
      requestAnimationFrame(() => {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'auto',
        });
      });
    }
  }, [location.pathname, navigationType, smooth, manual]);

  // Save scroll position on scroll (debounced)
  useEffect(() => {
    const handleScroll = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveScrollPosition(location.pathname);
      }, saveDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [location.pathname, saveDelay]);

  // Save scroll position before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  // Manual control functions
  const save = useCallback(() => {
    saveScrollPosition(location.pathname);
  }, [location.pathname]);

  const restore = useCallback((path?: string) => {
    restoreScrollPosition(path || location.pathname, smooth);
  }, [location.pathname, smooth]);

  const clear = useCallback(() => {
    clearScrollPositions();
  }, []);

  return {
    save,
    restore,
    clear,
  };
}

/**
 * Hook for scroll position management within a specific container
 * Useful for scrollable sections within a page
 * 
 * @example
 * ```tsx
 * const { ref, save, restore } = useContainerScrollRestoration('my-section');
 * 
 * <div ref={ref} className="overflow-auto">
 *   {content}
 * </div>
 * ```
 */
export function useContainerScrollRestoration(containerId: string) {
  const containerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const storageKey = `${SCROLL_STORAGE_KEY}-${containerId}`;

  const save = useCallback(() => {
    if (!containerRef.current) return;

    const position: ScrollPosition = {
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop,
      timestamp: Date.now(),
    };

    const key = `${location.pathname}-${containerId}`;
    scrollCache.set(key, position);

    try {
      const stored = sessionStorage.getItem(storageKey);
      const positions = stored ? JSON.parse(stored) : {};
      positions[location.pathname] = position;
      sessionStorage.setItem(storageKey, JSON.stringify(positions));
    } catch (error) {
      console.warn('[ContainerScrollRestoration] Failed to save:', error);
    }
  }, [location.pathname, containerId, storageKey]);

  const restore = useCallback(() => {
    if (!containerRef.current) return;

    const key = `${location.pathname}-${containerId}`;
    let position = scrollCache.get(key);

    if (!position) {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          const positions = JSON.parse(stored);
          position = positions[location.pathname];
        }
      } catch (error) {
        console.warn('[ContainerScrollRestoration] Failed to restore:', error);
      }
    }

    if (position && containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = position.x;
          containerRef.current.scrollTop = position.y;
        }
      });
    }
  }, [location.pathname, containerId, storageKey]);

  // Auto-save on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(save, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [save]);

  // Auto-restore on mount
  useEffect(() => {
    restore();
  }, [restore]);

  return {
    ref: containerRef,
    save,
    restore,
  };
}

/**
 * Get current scroll position
 */
export function getCurrentScrollPosition(): ScrollPosition {
  return {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now(),
  };
}

/**
 * Scroll to top utility
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Scroll to element utility
 */
export function scrollToElement(
  element: HTMLElement | string,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    offset?: number;
  } = {}
): void {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 0,
  } = options;

  const el = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element;

  if (!el) {
    console.warn('[ScrollRestoration] Element not found:', element);
    return;
  }

  if (offset !== 0) {
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  } else {
    el.scrollIntoView({
      behavior,
      block,
      inline,
    });
  }
}
