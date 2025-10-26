/**
 * Touch Target Utilities
 * Helpers for ensuring proper touch target sizes and spacing
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Minimum touch target size (44x44px per WCAG guidelines)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Minimum spacing between touch targets
 */
export const MIN_TOUCH_TARGET_SPACING = 8;

/**
 * Touch target size variants
 */
export const touchTargetSizes = {
  sm: 'min-h-[44px] min-w-[44px]',
  md: 'min-h-[48px] min-w-[48px]',
  lg: 'min-h-[56px] min-w-[56px]',
  xl: 'min-h-[64px] min-w-[64px]',
} as const;

/**
 * Touch target spacing variants
 */
export const touchTargetSpacing = {
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-3', // 12px
  lg: 'gap-4', // 16px
  xl: 'gap-6', // 24px
} as const;

/**
 * Get touch target class names
 */
export function getTouchTargetClasses(
  size: keyof typeof touchTargetSizes = 'sm',
  additionalClasses?: ClassValue
) {
  return twMerge(
    touchTargetSizes[size],
    'inline-flex items-center justify-center',
    clsx(additionalClasses)
  );
}

/**
 * Get touch target spacing class names
 */
export function getTouchTargetSpacing(
  spacing: keyof typeof touchTargetSpacing = 'sm',
  additionalClasses?: ClassValue
) {
  return twMerge(touchTargetSpacing[spacing], clsx(additionalClasses));
}

/**
 * Press feedback animation classes
 */
export const pressFeedbackClasses = {
  scale: 'active:scale-95 transition-transform duration-100',
  opacity: 'active:opacity-70 transition-opacity duration-100',
  both: 'active:scale-95 active:opacity-90 transition-all duration-100',
} as const;

/**
 * Get press feedback classes
 */
export function getPressFeedbackClasses(
  variant: keyof typeof pressFeedbackClasses = 'scale',
  additionalClasses?: ClassValue
) {
  return twMerge(pressFeedbackClasses[variant], clsx(additionalClasses));
}

/**
 * Check if an element meets minimum touch target size
 */
export function validateTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_TOUCH_TARGET_SIZE && rect.height >= MIN_TOUCH_TARGET_SIZE;
}

/**
 * Check if touch targets have minimum spacing
 */
export function validateTouchTargetSpacing(
  element1: HTMLElement,
  element2: HTMLElement
): boolean {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  const horizontalGap = Math.min(
    Math.abs(rect1.right - rect2.left),
    Math.abs(rect2.right - rect1.left)
  );

  const verticalGap = Math.min(
    Math.abs(rect1.bottom - rect2.top),
    Math.abs(rect2.bottom - rect1.top)
  );

  return (
    horizontalGap >= MIN_TOUCH_TARGET_SPACING ||
    verticalGap >= MIN_TOUCH_TARGET_SPACING
  );
}

/**
 * Mobile-optimized button classes
 */
export const mobileButtonClasses = {
  base: 'min-h-[44px] min-w-[44px] touch-manipulation',
  withSpacing: 'min-h-[44px] min-w-[44px] touch-manipulation m-1',
  withFeedback: 'min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 transition-transform',
} as const;

/**
 * Get mobile-optimized button classes
 */
export function getMobileButtonClasses(
  variant: keyof typeof mobileButtonClasses = 'base',
  additionalClasses?: ClassValue
) {
  return twMerge(mobileButtonClasses[variant], clsx(additionalClasses));
}
