/**
 * Interaction Feedback Utilities
 * Reusable components and utilities for micro-interactions
 * Provides button press, hover, and focus animations
 */

import * as React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { cn } from '../utils';
import { animationTokens } from './tokens';
import { useReducedMotion } from './hooks';

/**
 * Button press animation variants
 * Scale down to 0.95 on press
 */
export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  press: {
    scale: 0.95,
    transition: {
      duration: animationTokens.duration.instant / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Hover scale effect variants
 * Scale up to 1.05 on hover
 */
export const hoverScaleVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Focus ring animation variants
 * Animated focus ring with scale and opacity
 */
export const focusRingVariants: Variants = {
  blur: {
    scale: 0.95,
    opacity: 0,
  },
  focus: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Interactive Button Component
 * Button with press and hover animations
 */
export interface InteractiveButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'press' | 'hover' | 'both';
  className?: string;
}

export const InteractiveButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveButtonProps
>(({ children, variant = 'both', className, ...props }, ref) => {
  const prefersReducedMotion = useReducedMotion();

  // Choose variants based on variant prop
  const variants = variant === 'hover' ? hoverScaleVariants : buttonPressVariants;

  // If reduced motion, don't animate
  if (prefersReducedMotion) {
    return (
      <button ref={ref} className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap={variant !== 'hover' ? 'press' : undefined}
      {...props}
    >
      {children}
    </motion.button>
  );
});

InteractiveButton.displayName = 'InteractiveButton';

/**
 * Interactive Element Component
 * Generic interactive element with hover and press animations
 */
export interface InteractiveElementProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'press' | 'hover' | 'both';
  className?: string;
  as?: 'div' | 'span' | 'a';
}

export const InteractiveElement = React.forwardRef<
  HTMLDivElement,
  InteractiveElementProps
>(({ children, variant = 'both', className, as = 'div', ...props }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as];

  // Choose variants based on variant prop
  const variants = variant === 'hover' ? hoverScaleVariants : buttonPressVariants;

  // If reduced motion, render static element
  if (prefersReducedMotion) {
    const Component = as;
    return (
      <Component ref={ref as any} className={className} {...(props as any)}>
        {children}
      </Component>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap={variant !== 'hover' ? 'press' : undefined}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

InteractiveElement.displayName = 'InteractiveElement';

/**
 * Focus Ring Component
 * Animated focus ring overlay
 */
export interface FocusRingProps {
  isFocused: boolean;
  className?: string;
  color?: string;
}

export const FocusRing: React.FC<FocusRingProps> = ({
  isFocused,
  className,
  color = 'hsl(var(--primary))',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return isFocused ? (
      <div
        className={cn(
          'absolute inset-0 rounded-md pointer-events-none',
          className
        )}
        style={{
          boxShadow: `0 0 0 2px ${color}`,
        }}
      />
    ) : null;
  }

  return (
    <motion.div
      className={cn(
        'absolute inset-0 rounded-md pointer-events-none',
        className
      )}
      variants={focusRingVariants}
      initial="blur"
      animate={isFocused ? 'focus' : 'blur'}
      style={{
        boxShadow: `0 0 0 2px ${color}`,
      }}
    />
  );
};

/**
 * Hook for managing interaction states
 */
export interface UseInteractionStateOptions {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useInteractionState(options: UseInteractionStateOptions = {}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleHoverStart = React.useCallback(() => {
    setIsHovered(true);
    options.onHoverStart?.();
  }, [options]);

  const handleHoverEnd = React.useCallback(() => {
    setIsHovered(false);
    options.onHoverEnd?.();
  }, [options]);

  const handlePressStart = React.useCallback(() => {
    setIsPressed(true);
    options.onPressStart?.();
  }, [options]);

  const handlePressEnd = React.useCallback(() => {
    setIsPressed(false);
    options.onPressEnd?.();
  }, [options]);

  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
    options.onFocus?.();
  }, [options]);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
    options.onBlur?.();
  }, [options]);

  const interactionProps = {
    onMouseEnter: handleHoverStart,
    onMouseLeave: handleHoverEnd,
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const animationState = prefersReducedMotion
    ? 'rest'
    : isPressed
    ? 'press'
    : isHovered
    ? 'hover'
    : 'rest';

  return {
    isHovered,
    isPressed,
    isFocused,
    animationState,
    interactionProps,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Utility function to create interaction variants
 */
export interface CreateInteractionVariantsOptions {
  hoverScale?: number;
  pressScale?: number;
  hoverDuration?: number;
  pressDuration?: number;
}

export function createInteractionVariants(
  options: CreateInteractionVariantsOptions = {}
): Variants {
  const {
    hoverScale = 1.05,
    pressScale = 0.95,
    hoverDuration = animationTokens.duration.fast,
    pressDuration = animationTokens.duration.instant,
  } = options;

  return {
    rest: { scale: 1 },
    hover: {
      scale: hoverScale,
      transition: {
        duration: hoverDuration / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    press: {
      scale: pressScale,
      transition: {
        duration: pressDuration / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  };
}
