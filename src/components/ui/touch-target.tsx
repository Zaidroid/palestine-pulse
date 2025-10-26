/**
 * Touch Target Component
 * Ensures proper touch target sizes and press feedback
 */

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  getTouchTargetClasses,
  getPressFeedbackClasses,
  touchTargetSizes,
  pressFeedbackClasses,
} from '@/lib/touch-target-utils';

export interface TouchTargetProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  size?: keyof typeof touchTargetSizes;
  feedback?: keyof typeof pressFeedbackClasses;
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Touch-optimized button/interactive element
 */
export const TouchTarget = forwardRef<HTMLButtonElement, TouchTargetProps>(
  ({ size = 'sm', feedback = 'scale', children, className, asChild, ...props }, ref) => {
    const Component = asChild ? motion.div : motion.button;

    return (
      <Component
        ref={ref as any}
        className={cn(
          getTouchTargetClasses(size),
          getPressFeedbackClasses(feedback),
          'touch-manipulation select-none',
          className
        )}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

TouchTarget.displayName = 'TouchTarget';

export interface TouchTargetGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

/**
 * Group of touch targets with proper spacing
 */
export const TouchTargetGroup = forwardRef<HTMLDivElement, TouchTargetGroupProps>(
  ({ spacing = 'sm', orientation = 'horizontal', children, className, ...props }, ref) => {
    const spacingMap = {
      xs: 'gap-1', // 4px
      sm: 'gap-2', // 8px
      md: 'gap-3', // 12px
      lg: 'gap-4', // 16px
      xl: 'gap-6', // 24px
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          spacingMap[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTargetGroup.displayName = 'TouchTargetGroup';

export interface TouchableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pressScale?: number;
  disabled?: boolean;
}

/**
 * Card with touch feedback
 */
export const TouchableCard = forwardRef<HTMLDivElement, TouchableCardProps>(
  ({ children, pressScale = 0.95, disabled = false, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'touch-manipulation select-none',
          !disabled && 'cursor-pointer',
          className
        )}
        whileTap={!disabled ? { scale: pressScale } : undefined}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TouchableCard.displayName = 'TouchableCard';

export interface TouchableIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Icon button optimized for touch
 */
export const TouchableIconButton = forwardRef<HTMLButtonElement, TouchableIconButtonProps>(
  ({ icon, label, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-11 w-11', // 44px
      md: 'h-12 w-12', // 48px
      lg: 'h-14 w-14', // 56px
    };

    const iconSizes = {
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-7 w-7',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'touch-manipulation select-none',
          'bg-background hover:bg-accent',
          'border border-border',
          'transition-colors',
          sizeClasses[size],
          className
        )}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        aria-label={label}
        {...props}
      >
        <span className={iconSizes[size]}>{icon}</span>
      </motion.button>
    );
  }
);

TouchableIconButton.displayName = 'TouchableIconButton';
