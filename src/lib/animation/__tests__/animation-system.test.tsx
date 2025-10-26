/**
 * Animation System Tests
 * Basic tests to verify animation utilities work correctly
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  useReducedMotion, 
  useCountUp,
  useAnimationConfig,
  useDelayedAnimation,
} from '../hooks';
import { animationTokens } from '../tokens';

describe('Animation Tokens', () => {
  it('should have correct duration values', () => {
    expect(animationTokens.duration.instant).toBe(100);
    expect(animationTokens.duration.fast).toBe(200);
    expect(animationTokens.duration.normal).toBe(300);
  });

  it('should have spring presets', () => {
    expect(animationTokens.spring.default).toHaveProperty('stiffness');
    expect(animationTokens.spring.default).toHaveProperty('damping');
    expect(animationTokens.spring.navigation.stiffness).toBe(350);
  });

  it('should have stagger delays', () => {
    expect(animationTokens.stagger.fast).toBe(50);
    expect(animationTokens.stagger.normal).toBe(100);
  });
});

describe('useReducedMotion', () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  it('should return false when reduced motion is not preferred', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when reduced motion is preferred', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe('useAnimationConfig', () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  it('should return shouldAnimate true when motion is not reduced', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.shouldAnimate).toBe(true);
  });

  it('should return duration 0 when reduced motion is preferred', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.duration(300)).toBe(0);
  });

  it('should return original duration when motion is not reduced', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.duration(300)).toBe(300);
  });
});

describe('useDelayedAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start as not ready with delay', () => {
    const { result } = renderHook(() => useDelayedAnimation(500));
    expect(result.current.isReady).toBe(false);
  });

  it('should become ready after delay', () => {
    const { result } = renderHook(() => useDelayedAnimation(500));
    
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.isReady).toBe(true);
  });

  it('should be immediately ready with 0 delay', () => {
    const { result } = renderHook(() => useDelayedAnimation(0));
    expect(result.current.isReady).toBe(true);
  });
});

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start at start value', () => {
    const { result } = renderHook(() => useCountUp({ start: 0, end: 100 }));
    expect(result.current.count).toBe(0);
  });

  it('should format count with decimals', () => {
    const { result } = renderHook(() => 
      useCountUp({ start: 0, end: 100, decimals: 2 })
    );
    expect(result.current.formattedCount).toMatch(/^\d+\.\d{2}$/);
  });

  it('should indicate animation state', () => {
    const { result } = renderHook(() => useCountUp({ start: 0, end: 100 }));
    expect(result.current.isAnimating).toBe(true);
  });
});
