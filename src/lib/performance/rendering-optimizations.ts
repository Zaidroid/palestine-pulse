/**
 * Rendering Optimization Utilities
 * 
 * Utilities for optimizing React rendering performance using memoization,
 * React.memo, and useCallback. Implements requirement 11.5.
 */

import { useCallback, useMemo, useRef, useEffect, DependencyList } from 'react';

/**
 * Deep comparison for objects and arrays
 * Used for custom comparison in React.memo
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Shallow comparison for props
 * More performant than deep comparison for most cases
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

/**
 * Hook for memoizing expensive computations
 * Wrapper around useMemo with better type inference
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Hook for memoizing callback functions
 * Wrapper around useCallback with better type inference
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Hook for debounced value
 * Useful for expensive operations triggered by user input
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

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
 * Hook for throttled value
 * Updates at most once per specified interval
 */
export function useThrottledValue<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook for previous value
 * Useful for comparing current and previous props
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Hook for detecting if component is mounted
 * Prevents state updates on unmounted components
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

/**
 * Hook for safe state updates
 * Only updates state if component is still mounted
 */
export function useSafeState<T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState(initialState);
  const isMounted = useIsMounted();

  const setSafeState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (isMounted()) {
        setState(value);
      }
    },
    [isMounted]
  );

  return [state, setSafeState];
}

/**
 * Hook for memoizing array of objects
 * Useful for lists that don't change often
 */
export function useMemoizedArray<T>(
  array: T[],
  compareFn: (a: T, b: T) => boolean = (a, b) => a === b
): T[] {
  const prevArray = useRef<T[]>(array);

  return useMemo(() => {
    if (array.length !== prevArray.current.length) {
      prevArray.current = array;
      return array;
    }

    const hasChanged = array.some((item, index) => 
      !compareFn(item, prevArray.current[index])
    );

    if (hasChanged) {
      prevArray.current = array;
      return array;
    }

    return prevArray.current;
  }, [array, compareFn]);
}

/**
 * Hook for computing derived state
 * Memoizes computation based on dependencies
 */
export function useDerivedState<T, D extends DependencyList>(
  compute: (...deps: D) => T,
  deps: D
): T {
  return useMemo(() => compute(...deps), deps);
}

/**
 * Hook for lazy initialization
 * Useful for expensive initial state calculations
 */
export function useLazyState<T>(
  initializer: () => T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initializer);
  return [state, setState];
}

/**
 * Batch multiple state updates
 * Reduces number of re-renders
 */
export function batchUpdates(callback: () => void): void {
  // React 18+ automatically batches updates
  // This is a no-op but kept for API compatibility
  callback();
}

/**
 * Create a memoized selector
 * Useful for deriving data from props or state
 */
export function createSelector<T, R>(
  selector: (input: T) => R,
  equalityFn: (a: R, b: R) => boolean = (a, b) => a === b
): (input: T) => R {
  let lastInput: T;
  let lastResult: R;
  let hasRun = false;

  return (input: T): R => {
    if (!hasRun || input !== lastInput) {
      const result = selector(input);
      
      if (!hasRun || !equalityFn(result, lastResult)) {
        lastResult = result;
      }
      
      lastInput = input;
      hasRun = true;
    }
    
    return lastResult;
  };
}

/**
 * Hook for stable callback reference
 * Callback always has latest values but stable reference
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Hook for computed value with custom equality
 * Only recomputes when dependencies change based on custom comparison
 */
export function useComputedValue<T>(
  compute: () => T,
  deps: DependencyList,
  equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
): T {
  const prevValue = useRef<T>();
  const prevDeps = useRef<DependencyList>();

  return useMemo(() => {
    const depsChanged = !prevDeps.current || 
      deps.some((dep, i) => dep !== prevDeps.current![i]);

    if (depsChanged) {
      const newValue = compute();
      
      if (!prevValue.current || !equalityFn(newValue, prevValue.current)) {
        prevValue.current = newValue;
      }
      
      prevDeps.current = deps;
    }

    return prevValue.current!;
  }, deps);
}

// Import React for hooks
import * as React from 'react';
