/**
 * Mobile Optimized Container
 * Container component with responsive spacing and padding for mobile devices
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { getResponsivePadding, getResponsiveSpacing } from '@/lib/mobile-responsive-utils';

export interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Container with mobile-optimized spacing and padding
 */
export function MobileOptimizedContainer({
  children,
  className,
  spacing = 'md',
  fullWidth = false,
}: MobileOptimizedContainerProps) {
  const { breakpoint, isMobile } = useBreakpoint();
  
  const padding = getResponsivePadding(breakpoint, spacing);
  const maxWidth = fullWidth ? '100%' : breakpoint === 'mobile' ? '100%' : '1280px';

  return (
    <div
      className={cn(
        'mx-auto w-full',
        isMobile && 'px-4',
        className
      )}
      style={{
        padding: isMobile ? padding : undefined,
        maxWidth,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Section with mobile-optimized spacing
 */
export interface MobileOptimizedSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export function MobileOptimizedSection({
  children,
  className,
  spacing = 'normal',
}: MobileOptimizedSectionProps) {
  const { breakpoint, isMobile } = useBreakpoint();
  
  const spacingValue = getResponsiveSpacing(breakpoint, {
    mobile: spacing === 'compact' ? 12 : spacing === 'normal' ? 16 : 24,
    tablet: spacing === 'compact' ? 16 : spacing === 'normal' ? 20 : 28,
    desktop: spacing === 'compact' ? 20 : spacing === 'normal' ? 24 : 32,
    wide: spacing === 'compact' ? 24 : spacing === 'normal' ? 32 : 40,
  });

  return (
    <div
      className={cn('w-full', className)}
      style={{
        marginBottom: `${spacingValue}px`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stack layout with mobile-optimized spacing
 */
export interface MobileOptimizedStackProps {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  direction?: 'vertical' | 'horizontal';
}

export function MobileOptimizedStack({
  children,
  className,
  gap,
  direction = 'vertical',
}: MobileOptimizedStackProps) {
  const { breakpoint } = useBreakpoint();
  
  const gapValue = gap ?? getResponsiveSpacing(breakpoint);

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
      style={{
        gap: `${gapValue}px`,
      }}
    >
      {children}
    </div>
  );
}
