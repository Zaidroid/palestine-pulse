/**
 * Animated Switch Component
 * Toggle switch with spring physics animations
 * Provides smooth state transitions with spring motion
 */

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { animationTokens } from '../../lib/animation/tokens';
import { useReducedMotion } from '../../lib/animation/hooks';

/**
 * Spring animation configuration for switch handle
 */
const switchSpring = animationTokens.spring.snappy;

/**
 * Animated Switch Component
 */
export interface AnimatedSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom spring configuration
   */
  springConfig?: {
    stiffness: number;
    damping: number;
    mass?: number;
  };
}

const AnimatedSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  AnimatedSwitchProps
>(({ className, size = 'md', springConfig = switchSpring, ...props }, ref) => {
  const prefersReducedMotion = useReducedMotion();

  // Size configurations
  const sizeConfig = {
    sm: {
      root: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    md: {
      root: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      root: 'h-7 w-14',
      thumb: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  };

  const config = sizeConfig[size];

  // If reduced motion is preferred, use standard switch without animation
  if (prefersReducedMotion) {
    return (
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          config.root,
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            'data-[state=checked]:' + config.translate,
            'data-[state=unchecked]:translate-x-0',
            config.thumb
          )}
        />
      </SwitchPrimitives.Root>
    );
  }

  // Calculate translate distance based on size
  const translateDistance = {
    sm: 16, // 4 * 4px
    md: 20, // 5 * 4px
    lg: 28, // 7 * 4px
  }[size];

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors duration-300',
        config.root,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb asChild>
        <motion.span
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0',
            config.thumb
          )}
          animate={{
            x: props.checked ? translateDistance : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: springConfig.stiffness,
            damping: springConfig.damping,
            mass: springConfig.mass || 1,
          }}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

AnimatedSwitch.displayName = 'AnimatedSwitch';

/**
 * Animated Switch with Label
 * Convenience component with integrated label
 */
export interface AnimatedSwitchWithLabelProps extends AnimatedSwitchProps {
  label: string;
  description?: string;
  labelPosition?: 'left' | 'right';
}

export const AnimatedSwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  AnimatedSwitchWithLabelProps
>(
  (
    {
      label,
      description,
      labelPosition = 'right',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const switchId = id || React.useId();

    const switchElement = (
      <AnimatedSwitch ref={ref} id={switchId} className={className} {...props} />
    );

    const labelElement = (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={switchId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );

    return (
      <div className="flex items-center gap-3">
        {labelPosition === 'left' && labelElement}
        {switchElement}
        {labelPosition === 'right' && labelElement}
      </div>
    );
  }
);

AnimatedSwitchWithLabel.displayName = 'AnimatedSwitchWithLabel';

/**
 * Hook for managing switch state with animation callbacks
 */
export interface UseSwitchStateOptions {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export function useSwitchState(options: UseSwitchStateOptions = {}) {
  const {
    defaultChecked = false,
    onCheckedChange,
    onAnimationStart,
    onAnimationComplete,
  } = options;

  const [checked, setChecked] = React.useState(defaultChecked);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleCheckedChange = React.useCallback(
    (newChecked: boolean) => {
      setIsAnimating(true);
      setChecked(newChecked);
      onCheckedChange?.(newChecked);
      onAnimationStart?.();

      // Animation complete callback after spring settles
      setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 300);
    },
    [onCheckedChange, onAnimationStart, onAnimationComplete]
  );

  return {
    checked,
    isAnimating,
    onCheckedChange: handleCheckedChange,
  };
}

export { AnimatedSwitch };
