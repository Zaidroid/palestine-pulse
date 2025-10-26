/**
 * Animation Utility Hooks
 * Custom hooks for animation utilities including reduced motion, intersection animations, and stagger
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { animationTokens } from './tokens';

/**
 * Hook to detect if user prefers reduced motion
 * Respects system accessibility preferences
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for intersection-based animations
 * Triggers animations when element enters viewport
 */
export interface UseIntersectionAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useIntersectionAnimation(
  options: UseIntersectionAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
  });
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, always show content
  const shouldAnimate = !prefersReducedMotion;
  const isVisible = prefersReducedMotion ? true : isInView;

  return {
    ref,
    isInView: isVisible,
    shouldAnimate,
    controls: {
      initial: shouldAnimate ? 'hidden' : 'visible',
      animate: isVisible ? 'visible' : 'hidden',
    },
  };
}

/**
 * Hook for staggered animations
 * Provides stagger delay for child elements
 */
export interface UseStaggerAnimationOptions {
  staggerDelay?: number;
  delayChildren?: number;
  staggerDirection?: 1 | -1;
}

export function useStaggerAnimation(
  itemCount: number,
  options: UseStaggerAnimationOptions = {}
) {
  const {
    staggerDelay = animationTokens.stagger.normal,
    delayChildren = 0,
    staggerDirection = 1,
  } = options;

  const prefersReducedMotion = useReducedMotion();

  const containerVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
    }

    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay / 1000,
          delayChildren: delayChildren / 1000,
          staggerDirection,
        },
      },
    };
  }, [staggerDelay, delayChildren, staggerDirection, prefersReducedMotion]);

  const itemVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      };
    }

    return {
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
  }, [prefersReducedMotion]);

  return {
    containerVariants,
    itemVariants,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook for custom animation controls with reduced motion support
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldAnimate: !prefersReducedMotion,
    duration: (duration: number) => prefersReducedMotion ? 0 : duration,
    transition: (transition: any) => 
      prefersReducedMotion ? { duration: 0 } : transition,
  };
}

/**
 * Hook for scroll-based animations
 * Provides scroll progress for parallax and reveal effects
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(1);
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? scrolled / documentHeight : 0;
      setScrollProgress(progress);
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  return scrollProgress;
}

/**
 * Hook for hover animation state
 * Manages hover state with animation support
 */
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const animationState = prefersReducedMotion ? 'rest' : (isHovered ? 'hover' : 'rest');

  return {
    isHovered,
    hoverProps,
    animationState,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook for press/tap animation state
 */
export function usePressAnimation() {
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const pressProps = {
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    onTouchStart: () => setIsPressed(true),
    onTouchEnd: () => setIsPressed(false),
  };

  const animationState = prefersReducedMotion 
    ? 'rest' 
    : (isPressed ? 'press' : 'rest');

  return {
    isPressed,
    pressProps,
    animationState,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook for delayed animation
 * Useful for sequential animations
 */
export function useDelayedAnimation(delay: number = 0) {
  const [isReady, setIsReady] = useState(delay === 0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsReady(true);
      return;
    }

    if (delay === 0) {
      setIsReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, prefersReducedMotion]);

  return {
    isReady,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook for count-up animation
 * Animates numbers from start to end value
 */
export interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  onComplete?: () => void;
}

export function useCountUp(options: UseCountUpOptions) {
  const {
    start = 0,
    end,
    duration = animationTokens.duration.counter,
    decimals = 0,
    onComplete,
  } = options;

  const [count, setCount] = useState(start);
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // If reduced motion, jump to end value immediately
    if (prefersReducedMotion) {
      setCount(end);
      onComplete?.();
      return;
    }

    // Reset for new animation
    setCount(start);
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo function for natural deceleration
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = start + (end - start) * easeOutExpo;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, end, duration, prefersReducedMotion, onComplete]);

  const formattedCount = useMemo(() => {
    return count.toFixed(decimals);
  }, [count, decimals]);

  return {
    count,
    formattedCount,
    isAnimating: count !== end,
  };
}
