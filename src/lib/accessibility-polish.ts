/**
 * Accessibility Polish Utilities
 * 
 * Provides utilities for accessibility verification and enhancement:
 * - ARIA attribute validation
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Focus management
 * - Color contrast verification
 */

/**
 * WCAG 2.1 Contrast Requirements
 */
export const WCAG_CONTRAST = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Verify element has proper ARIA attributes
 */
export function verifyARIA(element: HTMLElement): {
  valid: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Check for role
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Interactive elements should have accessible names
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem'];
  
  const isInteractive = 
    interactiveTags.includes(tagName) || 
    (role && interactiveRoles.includes(role)) ||
    element.hasAttribute('tabindex');
  
  if (isInteractive) {
    const hasAccessibleName = 
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      (element as HTMLInputElement).value ||
      element.getAttribute('title');
    
    if (!hasAccessibleName) {
      issues.push('Interactive element lacks accessible name');
    }
  }
  
  // Check for aria-hidden on focusable elements
  if (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true') {
    if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1') {
      issues.push('Focusable element should not be aria-hidden');
    }
  }
  
  // Check for proper button semantics
  if (role === 'button' && tagName !== 'button') {
    if (!element.hasAttribute('tabindex')) {
      warnings.push('Role="button" should have tabindex="0"');
    }
  }
  
  // Check for proper link semantics
  if (tagName === 'a' && !element.hasAttribute('href')) {
    warnings.push('Link without href should use role="button"');
  }
  
  // Check for form labels
  if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        warnings.push('Form control should have associated label');
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Audit all elements for accessibility issues
 */
export function auditAccessibility(): {
  total: number;
  valid: number;
  issues: Array<{
    element: string;
    problems: string[];
    warnings: string[];
  }>;
  summary: {
    missingAltText: number;
    missingLabels: number;
    poorContrast: number;
    keyboardInaccessible: number;
  };
} {
  const elements = document.querySelectorAll('*');
  let valid = 0;
  const issues: Array<{
    element: string;
    problems: string[];
    warnings: string[];
  }> = [];
  
  const summary = {
    missingAltText: 0,
    missingLabels: 0,
    poorContrast: 0,
    keyboardInaccessible: 0,
  };
  
  elements.forEach((el) => {
    const result = verifyARIA(el as HTMLElement);
    
    if (result.valid && result.warnings.length === 0) {
      valid++;
    } else {
      if (result.issues.length > 0 || result.warnings.length > 0) {
        issues.push({
          element: getElementSelector(el as HTMLElement),
          problems: result.issues,
          warnings: result.warnings,
        });
      }
    }
    
    // Check for missing alt text
    if (el.tagName.toLowerCase() === 'img' && !el.hasAttribute('alt')) {
      summary.missingAltText++;
    }
    
    // Check for missing labels
    if (['input', 'select', 'textarea'].includes(el.tagName.toLowerCase())) {
      const hasLabel = 
        el.hasAttribute('aria-label') ||
        el.hasAttribute('aria-labelledby') ||
        (el.id && document.querySelector(`label[for="${el.id}"]`));
      
      if (!hasLabel) {
        summary.missingLabels++;
      }
    }
    
    // Check for keyboard accessibility
    const isInteractive = 
      ['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase()) ||
      el.hasAttribute('onclick') ||
      el.hasAttribute('role');
    
    if (isInteractive) {
      const tabindex = el.getAttribute('tabindex');
      if (tabindex === '-1' && !el.hasAttribute('aria-hidden')) {
        summary.keyboardInaccessible++;
      }
    }
  });
  
  return {
    total: elements.length,
    valid,
    issues,
    summary,
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
 * Create focus trap for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  let previouslyFocused: HTMLElement | null = null;
  
  const getFocusableElements = (): HTMLElement[] => {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    
    return Array.from(container.querySelectorAll(selector));
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  return {
    activate: () => {
      previouslyFocused = document.activeElement as HTMLElement;
      
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      
      container.addEventListener('keydown', handleKeyDown);
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    },
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tabindex = element.getAttribute('tabindex');
  
  // Native focusable elements
  const nativeFocusable = ['a', 'button', 'input', 'select', 'textarea'];
  if (nativeFocusable.includes(element.tagName.toLowerCase())) {
    return tabindex !== '-1';
  }
  
  // Elements with explicit tabindex
  if (tabindex !== null) {
    return tabindex !== '-1';
  }
  
  return false;
}

/**
 * Get keyboard navigation order
 */
export function getKeyboardNavigationOrder(): HTMLElement[] {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  const elements = Array.from(document.querySelectorAll(focusableSelector)) as HTMLElement[];
  
  // Sort by tabindex
  return elements.sort((a, b) => {
    const aIndex = parseInt(a.getAttribute('tabindex') || '0');
    const bIndex = parseInt(b.getAttribute('tabindex') || '0');
    
    if (aIndex === 0 && bIndex === 0) return 0;
    if (aIndex === 0) return 1;
    if (bIndex === 0) return -1;
    
    return aIndex - bIndex;
  });
}

/**
 * Verify skip link exists and works
 */
export function verifySkipLink(): {
  exists: boolean;
  works: boolean;
  target: string | null;
} {
  const skipLink = document.querySelector('a[href^="#"]:first-of-type') as HTMLAnchorElement;
  
  if (!skipLink) {
    return { exists: false, works: false, target: null };
  }
  
  const href = skipLink.getAttribute('href');
  if (!href) {
    return { exists: true, works: false, target: null };
  }
  
  const target = document.querySelector(href);
  
  return {
    exists: true,
    works: target !== null,
    target: href,
  };
}

/**
 * Check for proper heading hierarchy
 */
export function verifyHeadingHierarchy(): {
  valid: boolean;
  issues: string[];
} {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const issues: string[] = [];
  
  if (headings.length === 0) {
    issues.push('No headings found on page');
    return { valid: false, issues };
  }
  
  // Check for h1
  const h1Count = headings.filter(h => h.tagName === 'H1').length;
  if (h1Count === 0) {
    issues.push('Page should have exactly one h1');
  } else if (h1Count > 1) {
    issues.push(`Page has ${h1Count} h1 elements, should have only one`);
  }
  
  // Check for skipped levels
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && level !== 1) {
      issues.push('First heading should be h1');
    }
    
    if (level > previousLevel + 1) {
      issues.push(`Heading level skipped: ${heading.tagName} after h${previousLevel}`);
    }
    
    previousLevel = level;
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Verify landmark regions
 */
export function verifyLandmarks(): {
  valid: boolean;
  found: string[];
  missing: string[];
} {
  const requiredLandmarks = ['banner', 'main', 'contentinfo'];
  const found: string[] = [];
  const missing: string[] = [];
  
  // Check for semantic HTML5 elements
  const landmarks = {
    banner: document.querySelector('header, [role="banner"]'),
    main: document.querySelector('main, [role="main"]'),
    contentinfo: document.querySelector('footer, [role="contentinfo"]'),
    navigation: document.querySelector('nav, [role="navigation"]'),
  };
  
  Object.entries(landmarks).forEach(([name, element]) => {
    if (element) {
      found.push(name);
    } else if (requiredLandmarks.includes(name)) {
      missing.push(name);
    }
  });
  
  return {
    valid: missing.length === 0,
    found,
    missing,
  };
}

/**
 * Create accessibility report
 */
export function createAccessibilityReport(): string {
  const audit = auditAccessibility();
  const headings = verifyHeadingHierarchy();
  const landmarks = verifyLandmarks();
  const skipLink = verifySkipLink();
  
  const score = Math.round((audit.valid / audit.total) * 100);
  
  return `
Accessibility Audit Report
${score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌'} Overall Score: ${score}%

Elements Audited: ${audit.total}
Valid Elements: ${audit.valid}
Issues Found: ${audit.issues.length}

Summary:
- Missing Alt Text: ${audit.summary.missingAltText}
- Missing Labels: ${audit.summary.missingLabels}
- Keyboard Inaccessible: ${audit.summary.keyboardInaccessible}

Heading Hierarchy: ${headings.valid ? '✅ Valid' : '❌ Invalid'}
${headings.issues.length > 0 ? headings.issues.map(i => `  - ${i}`).join('\n') : ''}

Landmark Regions: ${landmarks.valid ? '✅ Valid' : '❌ Invalid'}
- Found: ${landmarks.found.join(', ')}
${landmarks.missing.length > 0 ? `- Missing: ${landmarks.missing.join(', ')}` : ''}

Skip Link: ${skipLink.exists ? (skipLink.works ? '✅ Present and working' : '⚠️ Present but broken') : '❌ Missing'}

User Preferences:
- Reduced Motion: ${prefersReducedMotion() ? 'Yes' : 'No'}
- High Contrast: ${prefersHighContrast() ? 'Yes' : 'No'}
- Dark Mode: ${prefersDarkMode() ? 'Yes' : 'No'}

${audit.issues.length > 0 ? '\nTop Issues:\n' + audit.issues.slice(0, 5).map(i => 
  `${i.element}:\n${i.problems.map(p => `  - ${p}`).join('\n')}${i.warnings.length > 0 ? '\n' + i.warnings.map(w => `  ⚠️ ${w}`).join('\n') : ''}`
).join('\n\n') : ''}
  `.trim();
}

/**
 * Accessibility CSS classes
 */
export const a11yClasses = {
  srOnly: 'sr-only',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
} as const;
