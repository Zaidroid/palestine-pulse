/**
 * Mobile Polish Utilities
 * 
 * Provides utilities for mobile-specific optimizations:
 * - Touch target verification
 * - Performance optimization
 * - Responsive behavior
 * - Mobile-specific interactions
 */

/**
 * Minimum touch target size (WCAG 2.1 Level AAA)
 */
export const MIN_TOUCH_TARGET_SIZE = 44; // pixels

/**
 * Minimum spacing between touch targets
 */
export const MIN_TOUCH_SPACING = 8; // pixels

/**
 * Mobile breakpoints
 */
export const MOBILE_BREAKPOINTS = {
  mobile: 0,
  mobileLarge: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

/**
 * Check if current viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINTS.tablet;
}

/**
 * Check if current viewport is tablet
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= MOBILE_BREAKPOINTS.tablet && 
         window.innerWidth < MOBILE_BREAKPOINTS.desktop;
}

/**
 * Check if current viewport is desktop
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= MOBILE_BREAKPOINTS.desktop;
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): keyof typeof MOBILE_BREAKPOINTS {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < MOBILE_BREAKPOINTS.mobileLarge) return 'mobile';
  if (width < MOBILE_BREAKPOINTS.tablet) return 'mobileLarge';
  if (width < MOBILE_BREAKPOINTS.desktop) return 'tablet';
  if (width < MOBILE_BREAKPOINTS.wide) return 'desktop';
  return 'wide';
}

/**
 * Verify touch target size
 */
export function verifyTouchTarget(element: HTMLElement): {
  valid: boolean;
  width: number;
  height: number;
  issues: string[];
} {
  const rect = element.getBoundingClientRect();
  const issues: string[] = [];
  
  if (rect.width < MIN_TOUCH_TARGET_SIZE) {
    issues.push(`Width ${rect.width}px is below minimum ${MIN_TOUCH_TARGET_SIZE}px`);
  }
  
  if (rect.height < MIN_TOUCH_TARGET_SIZE) {
    issues.push(`Height ${rect.height}px is below minimum ${MIN_TOUCH_TARGET_SIZE}px`);
  }
  
  return {
    valid: issues.length === 0,
    width: rect.width,
    height: rect.height,
    issues,
  };
}

/**
 * Verify spacing between touch targets
 */
export function verifyTouchSpacing(
  element1: HTMLElement,
  element2: HTMLElement
): {
  valid: boolean;
  distance: number;
  issues: string[];
} {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  
  // Calculate minimum distance between elements
  const horizontalDistance = Math.max(
    0,
    rect2.left - rect1.right,
    rect1.left - rect2.right
  );
  
  const verticalDistance = Math.max(
    0,
    rect2.top - rect1.bottom,
    rect1.top - rect2.bottom
  );
  
  const distance = Math.min(horizontalDistance, verticalDistance);
  const issues: string[] = [];
  
  if (distance < MIN_TOUCH_SPACING) {
    issues.push(`Spacing ${distance}px is below minimum ${MIN_TOUCH_SPACING}px`);
  }
  
  return {
    valid: issues.length === 0,
    distance,
    issues,
  };
}

/**
 * Audit all touch targets on page
 */
export function auditTouchTargets(): {
  total: number;
  valid: number;
  invalid: number;
  issues: Array<{
    element: string;
    problems: string[];
  }>;
} {
  const interactiveSelectors = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[tabindex]:not([tabindex="-1"])',
  ];
  
  const elements = document.querySelectorAll(interactiveSelectors.join(', '));
  let valid = 0;
  let invalid = 0;
  const issues: Array<{ element: string; problems: string[] }> = [];
  
  elements.forEach((el) => {
    const result = verifyTouchTarget(el as HTMLElement);
    if (result.valid) {
      valid++;
    } else {
      invalid++;
      issues.push({
        element: getElementSelector(el as HTMLElement),
        problems: result.issues,
      });
    }
  });
  
  return {
    total: elements.length,
    valid,
    invalid,
    issues,
  };
}

/**
 * Get a readable selector for an element
 */
function getElementSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c.length > 0);
    if (classes.length > 0) return `.${classes[0]}`;
  }
  return element.tagName.toLowerCase();
}

/**
 * Optimize images for mobile
 */
export function optimizeImageForMobile(
  src: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  // This is a placeholder - in production, you'd use a service like Cloudinary or imgix
  const { width = 800, quality = 80, format = 'webp' } = options;
  
  // For now, just return the original src
  // In production, you'd construct a URL with optimization parameters
  return src;
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          const src = image.dataset.src;
          if (src) {
            image.src = src;
            image.removeAttribute('data-src');
          }
          observer.unobserve(image);
        }
      });
    });
    
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
  }
}

/**
 * Detect slow network connection
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }
  
  const connection = (navigator as any).connection;
  if (!connection) return false;
  
  // Check for slow connection types
  const slowTypes = ['slow-2g', '2g', '3g'];
  if (slowTypes.includes(connection.effectiveType)) {
    return true;
  }
  
  // Check for save-data preference
  if (connection.saveData) {
    return true;
  }
  
  return false;
}

/**
 * Get optimal animation duration based on device performance
 */
export function getOptimalAnimationDuration(baseDuration: number): number {
  // Reduce animations on slow connections
  if (isSlowConnection()) {
    return baseDuration * 0.5;
  }
  
  // Check device memory (if available)
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory < 4) {
      return baseDuration * 0.75;
    }
  }
  
  return baseDuration;
}

/**
 * Prevent zoom on double-tap (for specific elements)
 */
export function preventDoubleTapZoom(element: HTMLElement): void {
  let lastTap = 0;
  
  element.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
      event.preventDefault();
    }
    
    lastTap = currentTime;
  });
}

/**
 * Enable momentum scrolling on iOS
 */
export function enableMomentumScrolling(element: HTMLElement): void {
  element.style.webkitOverflowScrolling = 'touch';
  element.style.overflowY = 'auto';
}

/**
 * Disable pull-to-refresh on specific elements
 */
export function disablePullToRefresh(element: HTMLElement): void {
  let startY = 0;
  
  element.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
  });
  
  element.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    
    // Prevent pull-to-refresh if scrolling down at the top
    if (element.scrollTop === 0 && y > startY) {
      e.preventDefault();
    }
  }, { passive: false });
}

/**
 * Mobile-specific CSS classes
 */
export const mobileClasses = {
  touchTarget: 'min-h-[44px] min-w-[44px]',
  touchSpacing: 'gap-2',
  mobileOnly: 'block md:hidden',
  desktopOnly: 'hidden md:block',
  mobileText: 'text-base md:text-sm',
  mobilePadding: 'p-4 md:p-6',
  mobileMargin: 'm-4 md:m-6',
} as const;

/**
 * Performance monitoring for mobile
 */
export class MobilePerformanceMonitor {
  private metrics: {
    fps: number[];
    memoryUsage: number[];
    loadTime: number;
  } = {
    fps: [],
    memoryUsage: [],
    loadTime: 0,
  };
  
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private rafId: number | null = null;
  
  start(): void {
    this.metrics.loadTime = performance.now();
    this.monitorFPS();
    this.monitorMemory();
  }
  
  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  private monitorFPS(): void {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      const fps = 1000 / delta;
      
      this.metrics.fps.push(fps);
      if (this.metrics.fps.length > 60) {
        this.metrics.fps.shift();
      }
      
      this.lastFrameTime = now;
      this.frameCount++;
      
      this.rafId = requestAnimationFrame(measureFPS);
    };
    
    this.rafId = requestAnimationFrame(measureFPS);
  }
  
  private monitorMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage.push(memory.usedJSHeapSize / 1048576); // Convert to MB
    }
  }
  
  getMetrics(): {
    averageFPS: number;
    minFPS: number;
    maxFPS: number;
    averageMemory: number;
    loadTime: number;
  } {
    const avgFPS = this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length;
    const minFPS = Math.min(...this.metrics.fps);
    const maxFPS = Math.max(...this.metrics.fps);
    const avgMemory = this.metrics.memoryUsage.reduce((a, b) => a + b, 0) / this.metrics.memoryUsage.length;
    
    return {
      averageFPS: Math.round(avgFPS),
      minFPS: Math.round(minFPS),
      maxFPS: Math.round(maxFPS),
      averageMemory: Math.round(avgMemory),
      loadTime: Math.round(this.metrics.loadTime),
    };
  }
  
  isPerformanceGood(): boolean {
    const metrics = this.getMetrics();
    return metrics.averageFPS >= 50 && metrics.minFPS >= 30;
  }
}

/**
 * Create a mobile performance report
 */
export function createMobilePerformanceReport(monitor: MobilePerformanceMonitor): string {
  const metrics = monitor.getMetrics();
  const isGood = monitor.isPerformanceGood();
  
  return `
Mobile Performance Report:
${isGood ? '✅' : '⚠️'} Overall Performance: ${isGood ? 'Good' : 'Needs Improvement'}

Frame Rate:
- Average: ${metrics.averageFPS} FPS
- Min: ${metrics.minFPS} FPS
- Max: ${metrics.maxFPS} FPS

Memory:
- Average Usage: ${metrics.averageMemory} MB

Load Time: ${metrics.loadTime}ms

${!isGood ? '\nRecommendations:\n- Reduce animation complexity\n- Optimize images\n- Minimize JavaScript execution' : ''}
  `.trim();
}
