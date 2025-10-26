/**
 * Swipeable Tabs Component
 * Tabs with swipe gesture support for mobile navigation
 */

import React, { useRef, useEffect } from 'react';
import { useSwipeGesture } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';

export interface SwipeableTabsProps {
  children: React.ReactNode;
  activeTab: string;
  tabs: string[];
  onTabChange: (tab: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Swipeable tabs container with gesture support
 * Allows users to swipe left/right to navigate between tabs
 */
export function SwipeableTabs({
  children,
  activeTab,
  tabs,
  onTabChange,
  className,
  disabled = false,
}: SwipeableTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = tabs.indexOf(activeTab);

  const handleSwipeLeft = () => {
    if (disabled) return;
    // Swipe left = next tab
    const nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
    if (nextIndex !== currentIndex) {
      onTabChange(tabs[nextIndex]);
    }
  };

  const handleSwipeRight = () => {
    if (disabled) return;
    // Swipe right = previous tab
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex !== currentIndex) {
      onTabChange(tabs[prevIndex]);
    }
  };

  useSwipeGesture(containerRef, {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    velocityThreshold: 0.3,
  });

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full touch-pan-y', className)}
    >
      {children}
    </div>
  );
}

/**
 * Swipeable content wrapper with slide animation
 */
export interface SwipeableContentProps {
  children: React.ReactNode;
  isActive: boolean;
  direction?: 'left' | 'right' | 'none';
  className?: string;
}

export function SwipeableContent({
  children,
  isActive,
  direction = 'none',
  className,
}: SwipeableContentProps) {
  const [shouldRender, setShouldRender] = React.useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'w-full transition-all duration-300 ease-out',
        isActive ? 'opacity-100 translate-x-0' : 'opacity-0',
        !isActive && direction === 'left' && '-translate-x-4',
        !isActive && direction === 'right' && 'translate-x-4',
        className
      )}
    >
      {children}
    </div>
  );
}
