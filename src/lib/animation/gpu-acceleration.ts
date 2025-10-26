/**
 * GPU Acceleration Utilities for Animations
 * 
 * Provides utilities to optimize animations using GPU acceleration
 * and strategic will-change property usage.
 */

import { CSSProperties } from 'react';

/**
 * Base GPU acceleration styles
 * Forces hardware acceleration for smoother animations
 */
export const gpuAccelerationStyles: CSSProperties = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  perspective: 1000,
};

/**
 * Get optimized styles for specific animation properties
 */
export function getOptimizedAnimationStyles(
  properties: string[] = ['transform', 'opacity']
): CSSProperties {
  return {
    ...gpuAccelerationStyles,
    willChange: properties.join(', '),
  };
}

/**
 * Framer Motion transition with GPU optimization
 */
export const gpuOptimizedTransition = {
  type: 'tween',
  ease: 'easeOut',
  // Use transform instead of position properties
  layout: false,
};

/**
 * Spring transition optimized for GPU
 */
export const gpuOptimizedSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/**
 * Variants optimized for GPU acceleration
 * Uses only transform and opacity for best performance
 */
export const gpuOptimizedVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, transform: 'translateY(20px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    exit: { opacity: 0, transform: 'translateY(-20px)' },
  },
  slideDown: {
    initial: { opacity: 0, transform: 'translateY(-20px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    exit: { opacity: 0, transform: 'translateY(20px)' },
  },
  slideLeft: {
    initial: { opacity: 0, transform: 'translateX(20px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
    exit: { opacity: 0, transform: 'translateX(-20px)' },
  },
  slideRight: {
    initial: { opacity: 0, transform: 'translateX(-20px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
    exit: { opacity: 0, transform: 'translateX(20px)' },
  },
  scale: {
    initial: { opacity: 0, transform: 'scale(0.95)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(1.05)' },
  },
  scaleUp: {
    initial: { opacity: 0, transform: 'scale(0.8)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.8)' },
  },
};

/**
 * CSS class for GPU acceleration
 * Can be applied to any element that will be animated
 */
export const GPU_ACCELERATION_CLASS = 'gpu-accelerated';

/**
 * Generate CSS for GPU acceleration
 * Add this to your global styles
 */
export const gpuAccelerationCSS = `
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

.will-change-transform-opacity {
  will-change: transform, opacity;
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
`;
