/**
 * Scrollable Tabs Component
 * Horizontal scrolling tabs with snap behavior for mobile
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface ScrollableTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

export interface ScrollableTabsProps {
  tabs: ScrollableTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: 'default' | 'pills';
  showScrollButtons?: boolean;
  className?: string;
}

/**
 * Horizontal scrollable tabs with snap behavior
 */
export function ScrollableTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  showScrollButtons = true,
  className,
}: ScrollableTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { isMobile } = useBreakpoint();

  // Check scroll position
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [tabs]);

  // Scroll to active tab
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeElement = container.querySelector(`[data-value="${activeTab}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('relative', className)}>
      {/* Left scroll button */}
      {showScrollButtons && canScrollLeft && !isMobile && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background to-transparent pl-2 pr-8">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full shadow-md"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          'flex gap-2 overflow-x-auto scrollbar-hide',
          'scroll-smooth snap-x snap-mandatory',
          'px-1 py-2',
          // Hide scrollbar
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <motion.button
              key={tab.value}
              data-value={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2',
                'text-sm font-medium whitespace-nowrap',
                'transition-colors touch-manipulation',
                'snap-start flex-shrink-0',
                'min-h-[44px]',
                variant === 'pills' && 'rounded-full',
                variant === 'default' && 'rounded-lg',
                isActive
                  ? variant === 'pills'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground">
                  {tab.badge}
                </span>
              )}

              {/* Active indicator for default variant */}
              {isActive && variant === 'default' && (
                <motion.div
                  layoutId="scrollable-tabs-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right scroll button */}
      {showScrollButtons && canScrollRight && !isMobile && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background to-transparent pr-2 pl-8">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full shadow-md"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Scroll hint for mobile */}
      {isMobile && (canScrollLeft || canScrollRight) && (
        <div className="text-center mt-1">
          <p className="text-xs text-muted-foreground">
            Swipe to see more
          </p>
        </div>
      )}
    </div>
  );
}

export interface ScrollableTabPanelProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tab panel content
 */
export function ScrollableTabPanel({
  value,
  activeTab,
  children,
  className,
}: ScrollableTabPanelProps) {
  if (value !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
