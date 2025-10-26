/**
 * Route Preloading Hook
 * Implements hover-based route preloading and data prefetching
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Route configuration for preloading
 */
export interface RoutePreloadConfig {
  /**
   * Route path to preload
   */
  path: string;
  /**
   * Optional data fetching function to prefetch
   */
  prefetchData?: () => Promise<void>;
  /**
   * Delay before starting preload (ms)
   */
  delay?: number;
}

/**
 * Cache for preloaded routes to avoid duplicate preloads
 */
const preloadCache = new Set<string>();

/**
 * Cache for prefetched data
 */
const dataCache = new Map<string, any>();

/**
 * Preload a route by triggering its lazy import
 */
async function preloadRoute(path: string): Promise<void> {
  // Skip if already preloaded
  if (preloadCache.has(path)) {
    return;
  }

  try {
    // Mark as preloading
    preloadCache.add(path);

    // Map paths to their lazy imports
    // This should match the lazy imports in App.tsx
    const routeModules: Record<string, () => Promise<any>> = {
      '/gaza': () => import('@/pages/v3/GazaWarDashboard'),
      '/west-bank': () => import('@/pages/v3/WestBankDashboard'),
      '/demo/enhanced-components': () => 
        import('@/components/ui/enhanced/EnhancedComponentsDemo'),
    };

    const moduleLoader = routeModules[path];
    if (moduleLoader) {
      await moduleLoader();
      console.log(`[RoutePreload] Preloaded route: ${path}`);
    }
  } catch (error) {
    console.error(`[RoutePreload] Failed to preload route ${path}:`, error);
    // Remove from cache on error so it can be retried
    preloadCache.delete(path);
  }
}

/**
 * Prefetch data for a route
 */
async function prefetchRouteData(
  path: string,
  fetcher?: () => Promise<void>
): Promise<void> {
  if (!fetcher) return;

  // Skip if already cached
  if (dataCache.has(path)) {
    return;
  }

  try {
    await fetcher();
    dataCache.set(path, true);
    console.log(`[RoutePreload] Prefetched data for: ${path}`);
  } catch (error) {
    console.error(`[RoutePreload] Failed to prefetch data for ${path}:`, error);
  }
}

/**
 * Hook for route preloading on hover
 * 
 * @example
 * ```tsx
 * const preloadProps = useRoutePreload({
 *   path: '/gaza',
 *   prefetchData: async () => {
 *     await fetchGazaData();
 *   },
 *   delay: 100,
 * });
 * 
 * <Link to="/gaza" {...preloadProps}>Gaza Dashboard</Link>
 * ```
 */
export function useRoutePreload(config: RoutePreloadConfig) {
  const { path, prefetchData, delay = 100 } = config;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isPreloadingRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start preload after delay
    timeoutRef.current = setTimeout(async () => {
      if (isPreloadingRef.current) return;
      
      isPreloadingRef.current = true;
      
      // Preload route and data in parallel
      await Promise.all([
        preloadRoute(path),
        prefetchRouteData(path, prefetchData),
      ]);
      
      isPreloadingRef.current = false;
    }, delay);
  }, [path, prefetchData, delay]);

  const handleMouseLeave = useCallback(() => {
    // Cancel preload if user leaves before delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter, // Also preload on keyboard focus
    onBlur: handleMouseLeave,
  };
}

/**
 * Hook for preloading multiple routes
 * Useful for preloading likely next routes based on current location
 * 
 * @example
 * ```tsx
 * useRoutePreloadMultiple([
 *   { path: '/gaza', prefetchData: fetchGazaData },
 *   { path: '/west-bank', prefetchData: fetchWestBankData },
 * ]);
 * ```
 */
export function useRoutePreloadMultiple(configs: RoutePreloadConfig[]) {
  useEffect(() => {
    // Preload all routes after a short delay
    const timer = setTimeout(() => {
      configs.forEach(async ({ path, prefetchData }) => {
        await Promise.all([
          preloadRoute(path),
          prefetchRouteData(path, prefetchData),
        ]);
      });
    }, 1000); // Wait 1s after mount to avoid blocking initial render

    return () => clearTimeout(timer);
  }, [configs]);
}

/**
 * Hook for intelligent route preloading based on current route
 * Automatically preloads likely next routes
 * 
 * @example
 * ```tsx
 * useIntelligentPreload();
 * ```
 */
export function useIntelligentPreload() {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Define likely next routes based on current location
    const preloadMap: Record<string, RoutePreloadConfig[]> = {
      '/': [
        { path: '/gaza' },
        { path: '/west-bank' },
      ],
      '/gaza': [
        { path: '/west-bank' },
      ],
      '/west-bank': [
        { path: '/gaza' },
      ],
    };

    const routesToPreload = preloadMap[currentPath] || [];
    
    if (routesToPreload.length > 0) {
      // Preload after a delay to not interfere with current page
      const timer = setTimeout(() => {
        routesToPreload.forEach(async ({ path, prefetchData }) => {
          await Promise.all([
            preloadRoute(path),
            prefetchRouteData(path, prefetchData),
          ]);
        });
      }, 2000); // Wait 2s to ensure current page is fully loaded

      return () => clearTimeout(timer);
    }
  }, [navigate]);
}

/**
 * Utility to manually preload a route
 * Useful for programmatic preloading
 */
export async function manualPreloadRoute(
  path: string,
  prefetchData?: () => Promise<void>
): Promise<void> {
  await Promise.all([
    preloadRoute(path),
    prefetchRouteData(path, prefetchData),
  ]);
}

/**
 * Clear preload cache (useful for testing or memory management)
 */
export function clearPreloadCache(): void {
  preloadCache.clear();
  dataCache.clear();
}

/**
 * Get preload cache status
 */
export function getPreloadCacheStatus() {
  return {
    preloadedRoutes: Array.from(preloadCache),
    cachedDataRoutes: Array.from(dataCache.keys()),
  };
}
