/**
 * Code Splitting Utilities
 * 
 * Provides utilities for lazy loading components with proper error handling
 * and loading states. Implements requirement 11.1 for code splitting.
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

interface LazyLoadOptions {
  /**
   * Delay in milliseconds before showing the component (for testing)
   */
  delay?: number;
  
  /**
   * Number of retry attempts on failure
   */
  retries?: number;
  
  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;
}

/**
 * Enhanced lazy loading with retry logic and error handling
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> {
  const { delay = 0, retries = 3, retryDelay = 1000 } = options;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = async (attemptsLeft: number) => {
        try {
          // Add artificial delay if specified (useful for testing)
          if (delay > 0) {
            await new Promise(r => setTimeout(r, delay));
          }

          const module = await importFunc();
          resolve(module);
        } catch (error) {
          if (attemptsLeft <= 1) {
            reject(error);
            return;
          }

          console.warn(
            `Failed to load component, retrying... (${attemptsLeft - 1} attempts left)`,
            error
          );

          // Wait before retrying
          setTimeout(() => {
            attemptImport(attemptsLeft - 1);
          }, retryDelay);
        }
      };

      attemptImport(retries);
    });
  });
}

/**
 * Preload a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
  lazyComponent: LazyExoticComponent<T>
): void {
  // Access the _payload to trigger the import
  const payload = (lazyComponent as any)._payload;
  if (payload && typeof payload._result === 'function') {
    payload._result();
  }
}

/**
 * Create a lazy component with named export
 */
export function lazyNamed<T extends ComponentType<any>>(
  importFunc: () => Promise<any>,
  exportName: string,
  options?: LazyLoadOptions
): LazyExoticComponent<T> {
  return lazyWithRetry(
    () => importFunc().then(module => ({ default: module[exportName] })),
    options
  );
}

/**
 * Batch preload multiple components
 */
export function preloadComponents(
  components: LazyExoticComponent<any>[]
): void {
  components.forEach(component => {
    try {
      preloadComponent(component);
    } catch (error) {
      console.warn('Failed to preload component:', error);
    }
  });
}

/**
 * Preload component on hover (for route preloading)
 */
export function createPreloadHandler(
  component: LazyExoticComponent<any>
): () => void {
  let preloaded = false;
  
  return () => {
    if (!preloaded) {
      preloadComponent(component);
      preloaded = true;
    }
  };
}
