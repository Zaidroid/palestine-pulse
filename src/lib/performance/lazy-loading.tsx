/**
 * Lazy Loading Utilities
 * 
 * Utilities for lazy loading images and deferring non-critical animations.
 * Implements requirement 11.3 for lazy loading.
 */

import React, { useState, useEffect, useRef, ImgHTMLAttributes, ReactNode } from 'react';

/**
 * Hook for intersection observer
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isIntersecting];
}

/**
 * Props for LazyImage component
 */
export interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  className,
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isIntersecting) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      onError?.();
    };

    img.src = src;
  }, [isIntersecting, src, onLoad, onError]);

  return (
    <img
      ref={imageRef as any}
      src={imageSrc}
      alt={alt}
      className={className}
      data-loaded={isLoaded}
      data-error={hasError}
      {...props}
    />
  );
}

/**
 * Props for LazyComponent
 */
export interface LazyComponentProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  delay?: number;
}

/**
 * Lazy load component when it enters viewport
 */
export function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  delay = 0,
}: LazyComponentProps) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isIntersecting) return;

    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
    }
  }, [isIntersecting, delay]);

  return (
    <div ref={ref as any}>
      {shouldRender ? children : placeholder}
    </div>
  );
}

/**
 * Hook for lazy loading data
 */
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  options: {
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = {}
): {
  ref: React.RefObject<HTMLElement>;
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { threshold = 0.1, rootMargin = '50px', enabled = true } = options;
  const [ref, isIntersecting] = useIntersectionObserver({ threshold, rootMargin });
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!enabled || !isIntersecting || hasLoaded.current) return;

    hasLoaded.current = true;
    setIsLoading(true);

    loadFn()
      .then(result => {
        setData(result);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isIntersecting, enabled, loadFn]);

  return { ref, data, isLoading, error };
}

/**
 * Defer non-critical animations until after initial render
 */
export function useDeferredAnimation(delay: number = 100): boolean {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldAnimate;
}

/**
 * Hook to defer rendering until idle
 */
export function useIdleCallback(
  callback: () => void,
  options: { timeout?: number } = {}
): void {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, options);
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      const timer = setTimeout(callback, options.timeout || 1);
      return () => clearTimeout(timer);
    }
  }, [callback, options.timeout]);
}

/**
 * Component that defers rendering until browser is idle
 */
export function IdleComponent({
  children,
  timeout = 1000,
  placeholder,
}: {
  children: ReactNode;
  timeout?: number;
  placeholder?: ReactNode;
}) {
  const [shouldRender, setShouldRender] = useState(false);

  useIdleCallback(() => {
    setShouldRender(true);
  }, { timeout });

  return <>{shouldRender ? children : placeholder}</>;
}

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * Hook to preload images on hover
 */
export function usePreloadOnHover(
  images: string[]
): {
  onMouseEnter: () => void;
  isPreloaded: boolean;
} {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const hasPreloaded = useRef(false);

  const handleMouseEnter = () => {
    if (hasPreloaded.current) return;

    hasPreloaded.current = true;
    preloadImages(images)
      .then(() => setIsPreloaded(true))
      .catch(err => console.error('Failed to preload images:', err));
  };

  return {
    onMouseEnter: handleMouseEnter,
    isPreloaded,
  };
}

/**
 * Background image with lazy loading
 */
export interface LazyBackgroundProps {
  src: string;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyBackground({
  src,
  placeholder,
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyBackgroundProps) {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    placeholder ? `url(${placeholder})` : undefined
  );
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const img = new Image();
    img.onload = () => {
      setBackgroundImage(`url(${src})`);
    };
    img.src = src;
  }, [isIntersecting, src]);

  return (
    <div
      ref={ref as any}
      className={className}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Example usage:
 * 
 * // Lazy load image
 * <LazyImage
 *   src="/large-image.jpg"
 *   alt="Description"
 *   placeholder="/placeholder.jpg"
 * />
 * 
 * // Lazy load component
 * <LazyComponent
 *   threshold={0.1}
 *   placeholder={<Skeleton />}
 * >
 *   <HeavyComponent />
 * </LazyComponent>
 * 
 * // Defer animation
 * const shouldAnimate = useDeferredAnimation(200);
 * 
 * // Lazy load data
 * const { ref, data, isLoading } = useLazyLoad(
 *   () => fetchData()
 * );
 * 
 * // Idle rendering
 * <IdleComponent placeholder={<Skeleton />}>
 *   <NonCriticalComponent />
 * </IdleComponent>
 */
