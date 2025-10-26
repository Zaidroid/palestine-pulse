/**
 * PageTransition Component
 * Provides smooth transitions between pages/routes with loading states
 */

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/lib/animation/variants';
import { useReducedMotion } from '@/lib/animation/hooks';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

export type TransitionMode = 'fade' | 'slide' | 'scale';

export interface PageTransitionProps {
  children: ReactNode;
  mode?: TransitionMode;
  duration?: number;
  className?: string;
  /**
   * Unique key for the page - changes trigger transition
   */
  pageKey?: string;
  /**
   * Show loading skeleton if transition takes longer than this (ms)
   */
  loadingThreshold?: number;
  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;
  /**
   * Callback when transition completes
   */
  onTransitionComplete?: () => void;
}

/**
 * Default loading skeleton for page transitions
 */
function DefaultLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      
      {/* Chart skeleton */}
      <div className="space-y-3 p-6 border rounded-lg">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

/**
 * PageTransition Component
 * 
 * Wraps page content with smooth transitions. Automatically shows loading
 * skeleton if content takes longer than threshold to render.
 * 
 * @example
 * ```tsx
 * <PageTransition mode="fade" pageKey={currentRoute}>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  mode = 'fade',
  duration,
  className,
  pageKey,
  loadingThreshold = 500,
  loadingComponent,
  onTransitionComplete,
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showLoading, setShowLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get the appropriate variant based on mode
  const variants = pageVariants[mode];

  // Custom duration if provided
  const customVariants = duration ? {
    ...variants,
    animate: {
      ...variants.animate,
      transition: {
        ...variants.animate.transition,
        duration: duration / 1000,
      },
    },
    exit: {
      ...variants.exit,
      transition: {
        ...variants.exit.transition,
        duration: duration / 1000,
      },
    },
  } : variants;

  // Handle loading state for slow transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setShowLoading(true);
    }, loadingThreshold);

    return () => {
      clearTimeout(timer);
      setShowLoading(false);
    };
  }, [isTransitioning, loadingThreshold]);

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setIsTransitioning(true);
        setShowLoading(false);
      }}
    >
      <motion.div
        key={pageKey}
        variants={customVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn('w-full', className)}
        onAnimationStart={() => setIsTransitioning(true)}
        onAnimationComplete={() => {
          setIsTransitioning(false);
          setShowLoading(false);
          onTransitionComplete?.();
        }}
      >
        {showLoading ? (
          loadingComponent || <DefaultLoadingSkeleton />
        ) : (
          children
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * TabTransition Component
 * Optimized for tab content transitions (faster, cross-fade only)
 */
export interface TabTransitionProps {
  children: ReactNode;
  tabKey: string;
  className?: string;
  onTransitionComplete?: () => void;
}

export function TabTransition({
  children,
  tabKey,
  className,
  onTransitionComplete,
}: TabTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  const tabVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn('w-full', className)}
        onAnimationComplete={onTransitionComplete}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * SectionTransition Component
 * For transitioning between sections within a page (minimal animation)
 */
export interface SectionTransitionProps {
  children: ReactNode;
  sectionKey: string;
  className?: string;
}

export function SectionTransition({
  children,
  sectionKey,
  className,
}: SectionTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sectionKey}
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn('w-full', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
