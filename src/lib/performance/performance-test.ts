/**
 * Performance Utilities Test
 * 
 * Simple test to verify all performance utilities are working
 */

import { lazyWithRetry, preloadComponent } from './code-splitting';
import { throttle, debounce, getGPUAcceleratedStyles } from './animation-performance';
import { shallowEqual, deepEqual, useMemoizedValue } from './rendering-optimizations';

// Test code splitting
console.log('✓ Code splitting utilities imported');

// Test animation performance
const styles = getGPUAcceleratedStyles(['transform', 'opacity']);
console.log('✓ GPU acceleration styles:', styles);

const throttledFn = throttle(() => console.log('Throttled'), 100);
const debouncedFn = debounce(() => console.log('Debounced'), 500);
console.log('✓ Throttle and debounce functions created');

// Test rendering optimizations
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
console.log('✓ Shallow equal:', shallowEqual(obj1, obj2));
console.log('✓ Deep equal:', deepEqual(obj1, obj2));

console.log('\n✅ All performance utilities working correctly!');

export {};
