/**
 * Interaction Polish Utilities
 * 
 * Provides consistent interaction patterns across the application:
 * - Hover states
 * - Click feedback
 * - Smooth transitions
 * - Touch interactions
 */

import { type MotionProps } from 'framer-motion';

/**
 * Standard hover scale animation
 */
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
};

/**
 * Standard tap/click scale animation
 */
export const tapScale = {
  scale: 0.95,
  transition: {
    duration: 0.1,
    ease: [0.4, 0, 0.2, 1],
  },
};

/**
 * Button interaction variants
 */
export const buttonInteraction: MotionProps = {
  whileHover: hoverScale,
  whileTap: tapScale,
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
};

/**
 * Card interaction variants
 */
export const cardInteraction: MotionProps = {
  whileHover: {
    scale: 1.02,
    boxShadow: 'var(--shadow-lg)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Icon button interaction variants
 */
export const iconButtonInteraction: MotionProps = {
  whileHover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  whileTap: {
    scale: 0.9,
    rotate: -5,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Link interaction variants
 */
export const linkInteraction: MotionProps = {
  whileHover: {
    x: 2,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Badge interaction variants
 */
export const badgeInteraction: MotionProps = {
  whileHover: {
    scale: 1.05,
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Switch/Toggle interaction variants
 */
export const switchInteraction = {
  spring: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  },
};

/**
 * Tooltip interaction variants
 */
export const tooltipInteraction: MotionProps = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Modal/Dialog interaction variants
 */
export const modalInteraction: MotionProps = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Dropdown interaction variants
 */
export const dropdownInteraction: MotionProps = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Slide panel interaction variants
 */
export const slidePanelInteraction = {
  right: {
    initial: { x: '100%' },
    animate: { 
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: { 
      x: '100%',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
  left: {
    initial: { x: '-100%' },
    animate: { 
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: { 
      x: '-100%',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
};

/**
 * Backdrop interaction variants
 */
export const backdropInteraction: MotionProps = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * List item interaction variants
 */
export const listItemInteraction: MotionProps = {
  whileHover: {
    backgroundColor: 'hsl(var(--accent))',
    x: 4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Stagger children animation
 */
export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item animation
 */
export const staggerItem: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Ripple effect for buttons (CSS-based)
 */
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
  
  setTimeout(() => circle.remove(), 600);
};

/**
 * Check if device supports hover
 */
export const supportsHover = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Check if device is touch-enabled
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get appropriate interaction variant based on device
 */
export const getDeviceInteraction = (
  hoverVariant: MotionProps,
  touchVariant: MotionProps
): MotionProps => {
  return isTouchDevice() ? touchVariant : hoverVariant;
};

/**
 * Debounce function for interaction handlers
 */
export function debounceInteraction<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for interaction handlers
 */
export function throttleInteraction<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * CSS classes for common interaction states
 */
export const interactionClasses = {
  button: 'transition-all duration-200 ease-out hover:scale-105 active:scale-95',
  card: 'transition-all duration-300 ease-out hover:scale-102 hover:shadow-lg active:scale-98',
  link: 'transition-all duration-200 ease-out hover:translate-x-1',
  badge: 'transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5',
  icon: 'transition-all duration-200 ease-out hover:scale-110 hover:rotate-6 active:scale-90 active:-rotate-6',
} as const;

/**
 * Haptic feedback for touch devices (if supported)
 */
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[style]);
  }
};
