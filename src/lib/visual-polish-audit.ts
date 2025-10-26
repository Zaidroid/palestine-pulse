/**
 * Visual Polish Audit Utilities
 * 
 * This module provides utilities to ensure visual consistency across the application:
 * - Animation smoothness checks
 * - Spacing and alignment verification
 * - Color contrast ratio validation
 * - Theme consistency checks
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Animation timing constants for consistent motion design
 */
export const ANIMATION_TIMINGS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 600,
  slowest: 1000,
} as const;

/**
 * Animation easing functions for smooth transitions
 */
export const ANIMATION_EASINGS = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/**
 * Spring physics configurations for natural motion
 */
export const SPRING_CONFIGS = {
  gentle: { stiffness: 200, damping: 20, mass: 1 },
  default: { stiffness: 300, damping: 25, mass: 1 },
  snappy: { stiffness: 400, damping: 30, mass: 1 },
  bouncy: { stiffness: 500, damping: 20, mass: 1 },
} as const;

/**
 * Spacing scale for consistent layout
 */
export const SPACING_SCALE = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
} as const;

/**
 * Border radius scale for consistent rounded corners
 */
export const RADIUS_SCALE = {
  none: '0',
  sm: '0.125rem',   // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * Shadow elevation scale for consistent depth
 */
export const SHADOW_SCALE = {
  none: 'none',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  glow: 'var(--shadow-glow)',
  glowPrimary: 'var(--shadow-glow-primary)',
} as const;

/**
 * Utility to merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if an element has sufficient color contrast
 * @param foreground - Foreground color in HSL format
 * @param background - Background color in HSL format
 * @returns Contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Parse HSL values
  const parseForeground = parseHSL(foreground);
  const parseBackground = parseHSL(background);
  
  if (!parseForeground || !parseBackground) return 0;
  
  // Convert to relative luminance
  const l1 = getRelativeLuminance(parseForeground);
  const l2 = getRelativeLuminance(parseBackground);
  
  // Calculate contrast ratio
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse HSL color string
 */
function parseHSL(hsl: string): { h: number; s: number; l: number } | null {
  const match = hsl.match(/hsl\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/);
  if (!match) return null;
  
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]) / 100,
    l: parseInt(match[3]) / 100,
  };
}

/**
 * Get relative luminance from HSL color
 */
function getRelativeLuminance(hsl: { h: number; s: number; l: number }): number {
  // Convert HSL to RGB
  const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
  
  // Convert to relative luminance
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const r2 = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g2 = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b2 = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Validate WCAG contrast requirements
 * @param ratio - Contrast ratio
 * @param level - WCAG level ('AA' or 'AAA')
 * @param size - Text size ('normal' or 'large')
 * @returns Whether the contrast meets the requirement
 */
export function meetsWCAGContrast(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get animation duration based on distance
 * @param distance - Distance in pixels
 * @returns Duration in milliseconds
 */
export function getAnimationDuration(distance: number): number {
  // Base duration + distance factor
  const base = ANIMATION_TIMINGS.fast;
  const factor = Math.min(distance / 1000, 0.5);
  return Math.round(base + factor * ANIMATION_TIMINGS.slow);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe animation duration respecting user preferences
 */
export function getSafeAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Validate spacing consistency
 * @param value - Spacing value in pixels
 * @returns Whether the spacing follows the scale
 */
export function isValidSpacing(value: number): boolean {
  const validValues = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
  return validValues.includes(value);
}

/**
 * Get nearest valid spacing value
 */
export function getNearestSpacing(value: number): number {
  const validValues = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
  return validValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Visual polish checklist for components
 */
export interface VisualPolishChecklist {
  animations: {
    smoothTransitions: boolean;
    consistentDurations: boolean;
    respectsReducedMotion: boolean;
    gpuAccelerated: boolean;
  };
  spacing: {
    consistentPadding: boolean;
    consistentMargins: boolean;
    followsScale: boolean;
  };
  colors: {
    sufficientContrast: boolean;
    themeConsistent: boolean;
    accessibleText: boolean;
  };
  layout: {
    properAlignment: boolean;
    responsiveBreakpoints: boolean;
    noOverflow: boolean;
  };
}

/**
 * Create a visual polish report
 */
export function createPolishReport(
  componentName: string,
  checklist: VisualPolishChecklist
): string {
  const issues: string[] = [];
  
  // Check animations
  if (!checklist.animations.smoothTransitions) {
    issues.push('- Transitions are not smooth');
  }
  if (!checklist.animations.consistentDurations) {
    issues.push('- Animation durations are inconsistent');
  }
  if (!checklist.animations.respectsReducedMotion) {
    issues.push('- Does not respect prefers-reduced-motion');
  }
  if (!checklist.animations.gpuAccelerated) {
    issues.push('- Animations are not GPU-accelerated');
  }
  
  // Check spacing
  if (!checklist.spacing.consistentPadding) {
    issues.push('- Padding is inconsistent');
  }
  if (!checklist.spacing.consistentMargins) {
    issues.push('- Margins are inconsistent');
  }
  if (!checklist.spacing.followsScale) {
    issues.push('- Spacing does not follow the design scale');
  }
  
  // Check colors
  if (!checklist.colors.sufficientContrast) {
    issues.push('- Color contrast is insufficient');
  }
  if (!checklist.colors.themeConsistent) {
    issues.push('- Colors are not theme-consistent');
  }
  if (!checklist.colors.accessibleText) {
    issues.push('- Text colors are not accessible');
  }
  
  // Check layout
  if (!checklist.layout.properAlignment) {
    issues.push('- Elements are not properly aligned');
  }
  if (!checklist.layout.responsiveBreakpoints) {
    issues.push('- Responsive breakpoints are not properly implemented');
  }
  if (!checklist.layout.noOverflow) {
    issues.push('- Content overflow detected');
  }
  
  if (issues.length === 0) {
    return `✅ ${componentName}: All visual polish checks passed!`;
  }
  
  return `⚠️ ${componentName}: ${issues.length} issue(s) found:\n${issues.join('\n')}`;
}

/**
 * GPU-accelerated transform utilities
 */
export const gpuTransform = {
  translate: (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`,
  scale: (s: number) => `scale3d(${s}, ${s}, 1)`,
  rotate: (deg: number) => `rotate3d(0, 0, 1, ${deg}deg)`,
} as const;

/**
 * Common animation variants for Framer Motion
 */
export const polishedVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
} as const;
