/**
 * Mobile Navigation System
 * Complete mobile navigation solution with drawer and scrollable tabs
 */

import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { MobileMenu, MobileMenuItem } from './mobile-menu';
import { ScrollableTabs, ScrollableTab } from './scrollable-tabs';
import { PillTabs } from '@/components/v3/shared/PillTabs';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavigationTab {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  badge?: number;
}

export interface MobileNavigationProps {
  tabs: NavigationTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: 'main' | 'sub';
  menuItems?: MobileMenuItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Adaptive navigation that switches between desktop and mobile layouts
 */
export function MobileNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant = 'sub',
  menuItems,
  header,
  footer,
  className,
}: MobileNavigationProps) {
  const { isMobile, isTablet } = useBreakpoint();

  // Convert tabs to scrollable format
  const scrollableTabs: ScrollableTab[] = tabs.map((tab) => ({
    value: tab.value,
    label: tab.label,
    icon: <tab.icon className={cn('h-4 w-4', tab.color)} />,
    badge: tab.badge,
  }));

  // Mobile: Use drawer menu for main nav, scrollable tabs for sub nav
  if (isMobile) {
    if (variant === 'main' && menuItems) {
      return (
        <div className={className}>
          <MobileMenu
            items={menuItems}
            activeItem={activeTab}
            onItemClick={onTabChange}
            header={header}
            footer={footer}
          />
        </div>
      );
    }

    // Sub navigation uses PillTabs in 2-column grid
    return (
      <div className={className}>
        <PillTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          isMobile={true}
          variant={variant}
        />
      </div>
    );
  }

  // Tablet: Use scrollable tabs if tabs overflow
  if (isTablet && tabs.length > 4) {
    return (
      <div className={className}>
        <ScrollableTabs
          tabs={scrollableTabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          variant="pills"
        />
      </div>
    );
  }

  // Desktop: Use standard PillTabs
  return (
    <div className={className}>
      <PillTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isMobile={false}
        variant={variant}
      />
    </div>
  );
}

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

/**
 * Mobile-optimized header component
 */
export function MobileHeader({
  title,
  subtitle,
  actions,
  showBackButton,
  onBack,
  className,
}: MobileHeaderProps) {
  const { isMobile } = useBreakpoint();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 md:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex-shrink-0 p-2 -ml-2 hover:bg-accent rounded-lg transition-colors touch-manipulation"
              aria-label="Go back"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1
              className={cn(
                'font-bold truncate',
                isMobile ? 'text-lg' : 'text-xl'
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export interface MobileBottomNavProps {
  items: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }>;
  activeItem: string;
  onItemClick: (value: string) => void;
  className?: string;
}

/**
 * Bottom navigation bar for mobile
 */
export function MobileBottomNav({
  items,
  activeItem,
  onItemClick,
  className,
}: MobileBottomNavProps) {
  const { isMobile } = useBreakpoint();

  if (!isMobile) return null;

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'safe-area-inset-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = activeItem === item.value;

          return (
            <button
              key={item.value}
              onClick={() => onItemClick(item.value)}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'min-w-[64px] h-12 px-2 rounded-lg',
                'transition-colors touch-manipulation',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
