/**
 * Touch Gesture Hooks
 * Provides touch gesture detection for mobile interactions
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe (default: 50px)
  velocityThreshold?: number; // Minimum velocity (default: 0.3)
}

export interface PinchGestureConfig {
  onPinchStart?: (scale: number) => void;
  onPinch?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}

export interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (default: 80px)
  maxPullDistance?: number; // Maximum pull distance (default: 150px)
  disabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

/**
 * Hook for swipe gesture detection
 */
export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement>,
  config: SwipeGestureConfig
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
  } = config;

  const touchStart = useRef<TouchPoint | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Determine if it's a horizontal or vertical swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold && velocityX > velocityThreshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold && velocityY > velocityThreshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]);
}

/**
 * Hook for pinch-to-zoom gesture detection
 */
export function usePinchGesture(
  elementRef: React.RefObject<HTMLElement>,
  config: PinchGestureConfig
) {
  const { onPinchStart, onPinch, onPinchEnd, minScale = 0.5, maxScale = 3 } = config;

  const initialDistance = useRef<number>(0);
  const currentScale = useRef<number>(1);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance.current = getDistance(e.touches);
        onPinchStart?.(currentScale.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = getDistance(e.touches);
        const scale = distance / initialDistance.current;
        const newScale = Math.max(minScale, Math.min(maxScale, currentScale.current * scale));
        
        onPinch?.(newScale);
        initialDistance.current = distance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        onPinchEnd?.(currentScale.current);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onPinchStart, onPinch, onPinchEnd, minScale, maxScale]);

  return {
    scale: currentScale.current,
    setScale: (scale: number) => {
      currentScale.current = Math.max(minScale, Math.min(maxScale, scale));
    },
  };
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(
  elementRef: React.RefObject<HTMLElement>,
  config: PullToRefreshConfig
) {
  const {
    onRefresh,
    threshold = 80,
    maxPullDistance = 150,
    disabled = false,
  } = config;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<TouchPoint | null>(null);
  const scrollTop = useRef<number>(0);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || disabled) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh, isRefreshing, disabled]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      scrollTop.current = element.scrollTop;
      
      // Only enable pull-to-refresh when at the top
      if (scrollTop.current === 0) {
        const touch = e.touches[0];
        touchStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || scrollTop.current > 0) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStart.current.y;

      // Only track downward pulls
      if (deltaY > 0) {
        const distance = Math.min(deltaY, maxPullDistance);
        setPullDistance(distance);

        // Prevent default scrolling when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
      }
      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, threshold, maxPullDistance, pullDistance, handleRefresh]);

  return {
    isRefreshing,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
  };
}

/**
 * Hook for press feedback (scale animation on touch)
 */
export function usePressGesture(elementRef: React.RefObject<HTMLElement>) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = () => setIsPressed(true);
    const handleTouchEnd = () => setIsPressed(false);
    const handleTouchCancel = () => setIsPressed(false);

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, []);

  return { isPressed };
}
