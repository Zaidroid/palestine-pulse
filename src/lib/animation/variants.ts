/**
 * Framer Motion Variants Library
 * Reusable animation patterns for consistent motion design
 */

import { Variants } from 'framer-motion';
import { animationTokens } from './tokens';

/**
 * Fade animations
 */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Slide animations
 */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Scale animations
 */
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Page transition variants
 */
export const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeInOut,
      },
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeInOut,
      },
    },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  },
} as const;

/**
 * Interaction variants
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

export const pressScaleVariants: Variants = {
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

export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  hover: { 
    scale: 1.03,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Stagger container variants
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.normal / 1000,
      delayChildren: 0,
    },
  },
};

export const staggerFastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.fast / 1000,
      delayChildren: 0,
    },
  },
};

export const staggerSlowContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.slow / 1000,
      delayChildren: 0,
    },
  },
};

/**
 * Stagger item variants
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Tooltip variants
 */
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Modal/Dialog variants
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Drawer/Panel variants
 */
export const drawerVariants = {
  left: {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  },
  right: {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  },
  top: {
    hidden: { y: '-100%' },
    visible: { 
      y: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { 
      y: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  },
} as const;

/**
 * Loading/Pulse variants
 */
export const pulseVariants: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: animationTokens.duration.pulse / 1000,
      repeat: Infinity,
      ease: animationTokens.easing.easeInOut,
    },
  },
};

export const spinVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Chart animation variants
 */
export const chartLineVariants: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: animationTokens.duration.draw / 1000,
        ease: animationTokens.easing.easeOut,
      },
      opacity: {
        duration: animationTokens.duration.fast / 1000,
      },
    },
  },
};

export const chartBarVariants: Variants = {
  hidden: { 
    scaleY: 0,
    opacity: 0,
  },
  visible: { 
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: animationTokens.duration.slower / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};
