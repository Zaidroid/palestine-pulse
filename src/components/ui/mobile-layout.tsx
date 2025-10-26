/**
 * Mobile Layout Components
 * Provides mobile-optimized layouts for metric cards and charts
 */

import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';

export interface MobileMetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  mobileColumns?: 1 | 2;
  tabletColumns?: 2 | 3;
  desktopColumns?: 3 | 4;
}

/**
 * Responsive metric card grid with mobile-first layout
 */
export function MobileMetricGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  className,
  ...props
}: MobileMetricGridProps) {
  const columnClasses = {
    mobile: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
    },
    tablet: {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
    },
    desktop: {
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
    },
  };

  return (
    <div
      className={cn(
        'grid gap-4',
        columnClasses.mobile[mobileColumns],
        columnClasses.tablet[tabletColumns],
        columnClasses.desktop[desktopColumns],
        'md:gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MobileChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  mobileHeight?: number;
  desktopHeight?: number;
  simplifyOnMobile?: boolean;
}

/**
 * Chart container with mobile-optimized height
 */
export function MobileChartContainer({
  children,
  mobileHeight = 300,
  desktopHeight = 400,
  simplifyOnMobile = true,
  className,
  ...props
}: MobileChartContainerProps) {
  const { isMobile } = useBreakpoint();
  const height = isMobile ? mobileHeight : desktopHeight;

  return (
    <div
      className={cn('w-full', className)}
      style={{ height: `${height}px` }}
      data-simplified={simplifyOnMobile && isMobile}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MobileStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * Vertical stack layout for mobile
 */
export function MobileStack({
  children,
  spacing = 'md',
  className,
  ...props
}: MobileStackProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <div className={cn('flex flex-col', spacingClasses[spacing], className)} {...props}>
      {children}
    </div>
  );
}

export interface MobileSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  compact?: boolean;
}

/**
 * Section container with mobile-optimized spacing
 */
export function MobileSection({
  title,
  description,
  children,
  compact = false,
  className,
  ...props
}: MobileSectionProps) {
  return (
    <section
      className={cn(
        'w-full',
        compact ? 'py-4 md:py-6' : 'py-6 md:py-8',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className={cn('mb-4 md:mb-6', compact && 'mb-3')}>
          {title && (
            <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-sm md:text-base text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  compact?: boolean;
}

/**
 * Card with mobile-optimized padding
 */
export function MobileCard({
  children,
  compact = false,
  className,
  ...props
}: MobileCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        compact ? 'p-3 md:p-4' : 'p-4 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Container with responsive max-width and padding
 */
export function ResponsiveContainer({
  children,
  maxWidth = 'xl',
  className,
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 md:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
