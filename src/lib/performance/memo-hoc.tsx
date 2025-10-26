/**
 * Memoization Higher Order Components
 * 
 * Provides HOCs for optimizing component rendering with React.memo
 */

import React, { ComponentType, memo } from 'react';
import { shallowEqual, deepEqual } from './rendering-optimizations';

/**
 * Memoize component with shallow prop comparison
 */
export function withShallowMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return shallowEqual(prevProps, nextProps);
  });

  MemoizedComponent.displayName = displayName || `ShallowMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * Memoize component with deep prop comparison
 * Use sparingly as deep comparison is expensive
 */
export function withDeepMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  });

  MemoizedComponent.displayName = displayName || `DeepMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * Memoize component with custom comparison function
 */
export function withCustomMemo<P extends object>(
  Component: ComponentType<P>,
  areEqual: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component, areEqual);

  MemoizedComponent.displayName = displayName || `CustomMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * Memoize component but only for specific props
 */
export function withSelectiveMemo<P extends object>(
  Component: ComponentType<P>,
  propsToCompare: (keyof P)[],
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return propsToCompare.every(
      prop => prevProps[prop] === nextProps[prop]
    );
  });

  MemoizedComponent.displayName = displayName || `SelectiveMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * Memoize pure component (no props comparison needed)
 */
export function withPureMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> {
  const MemoizedComponent = memo(Component);

  MemoizedComponent.displayName = displayName || `PureMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
}

/**
 * Example usage:
 * 
 * // Shallow comparison (default)
 * const MemoizedCard = withShallowMemo(Card);
 * 
 * // Deep comparison (for complex props)
 * const MemoizedChart = withDeepMemo(Chart);
 * 
 * // Custom comparison
 * const MemoizedList = withCustomMemo(
 *   List,
 *   (prev, next) => prev.items.length === next.items.length
 * );
 * 
 * // Selective comparison (only compare specific props)
 * const MemoizedMetric = withSelectiveMemo(
 *   MetricCard,
 *   ['value', 'title']
 * );
 */
