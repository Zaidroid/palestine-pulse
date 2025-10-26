/**
 * AnimatedGrid Component
 * ResponsiveGrid with staggered entrance animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useIntersectionAnimation, useStaggerAnimation } from '@/lib/animation/hooks';
import { animationTokens } from '@/lib/animation/tokens';

export interface AnimatedGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: number;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * AnimatedGrid component with staggered fade-in animations
 * Uses intersection observer to trigger animations when entering viewport
 */
export function AnimatedGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = 24,
  className,
  staggerDelay = animationTokens.stagger.normal,
  threshold = 0.1,
  triggerOnce = true,
}: AnimatedGridProps) {
  const { breakpoint } = useBreakpoint();
  
  // Get intersection animation controls
  const { ref, controls } = useIntersectionAnimation({
    threshold,
    triggerOnce,
  });

  // Get column count for current breakpoint
  const columnCount = columns[breakpoint] ?? columns.desktop ?? 3;

  // Count children for stagger animation
  const childCount = React.Children.count(children);
  
  // Get stagger animation variants
  const { containerVariants, itemVariants } = useStaggerAnimation(childCount, {
    staggerDelay,
  });

  // Generate grid template columns
  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns,
    gap: `${gap}px`,
  };

  return (
    <motion.div
      ref={ref}
      className={cn('w-full', className)}
      style={gridStyles}
      variants={containerVariants}
      initial={controls.initial}
      animate={controls.animate}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * AnimatedGridItem component for individual animated grid items
 * Can be used within AnimatedGrid for more control over individual items
 */
export interface AnimatedGridItemProps {
  children: React.ReactNode;
  colSpan?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  className?: string;
  delay?: number;
}

export function AnimatedGridItem({
  children,
  colSpan,
  className,
  delay = 0,
}: AnimatedGridItemProps) {
  const { breakpoint } = useBreakpoint();

  // Get column span for current breakpoint
  const span = colSpan?.[breakpoint] ?? 1;

  const itemStyles = {
    gridColumn: span > 1 ? `span ${span}` : undefined,
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationTokens.duration.slow / 1000,
        ease: animationTokens.easing.easeOut,
        delay: delay / 1000,
      },
    },
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      style={itemStyles}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * SimpleAnimatedGrid - Lightweight version without intersection observer
 * Animates immediately on mount
 */
export interface SimpleAnimatedGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: number;
  className?: string;
  staggerDelay?: number;
}

export function SimpleAnimatedGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = 24,
  className,
  staggerDelay = animationTokens.stagger.normal,
}: SimpleAnimatedGridProps) {
  const { breakpoint } = useBreakpoint();

  // Get column count for current breakpoint
  const columnCount = columns[breakpoint] ?? columns.desktop ?? 3;

  // Count children for stagger animation
  const childCount = React.Children.count(children);
  
  // Get stagger animation variants
  const { containerVariants, itemVariants } = useStaggerAnimation(childCount, {
    staggerDelay,
  });

  // Generate grid template columns
  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns,
    gap: `${gap}px`,
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      style={gridStyles}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
