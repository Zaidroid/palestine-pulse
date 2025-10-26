/**
 * Chart Accessibility Utilities
 * Provides keyboard navigation, ARIA support, and screen reader compatibility for D3 charts
 */

export interface ChartAccessibilityConfig {
  chartType: string;
  dataPoints: number;
  hasInteraction: boolean;
  description?: string;
}

/**
 * Generate comprehensive ARIA label for charts
 */
export function generateChartAriaLabel(config: ChartAccessibilityConfig, t: (key: string, fallback: string) => string): string {
  const { chartType, dataPoints, hasInteraction, description } = config;
  
  let label = `${chartType} with ${dataPoints} data points`;
  
  if (hasInteraction) {
    label += '. Interactive chart - use arrow keys to navigate, Enter to select';
  }
  
  if (description) {
    label += `. ${description}`;
  }
  
  return label;
}

/**
 * Add keyboard navigation to chart elements
 */
export function addKeyboardNavigation(
  svg: SVGSVGElement,
  elements: SVGElement[],
  onSelect: (index: number) => void
): () => void {
  let currentIndex = -1;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!elements.length) return;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        currentIndex = (currentIndex + 1) % elements.length;
        focusElement(currentIndex);
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        currentIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
        focusElement(currentIndex);
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentIndex >= 0) {
          onSelect(currentIndex);
        }
        break;
        
      case 'Home':
        e.preventDefault();
        currentIndex = 0;
        focusElement(currentIndex);
        break;
        
      case 'End':
        e.preventDefault();
        currentIndex = elements.length - 1;
        focusElement(currentIndex);
        break;
    }
  };
  
  const focusElement = (index: number) => {
    elements.forEach((el, i) => {
      if (i === index) {
        el.setAttribute('tabindex', '0');
        el.focus();
        el.setAttribute('aria-selected', 'true');
      } else {
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-selected', 'false');
      }
    });
  };
  
  // Make SVG focusable
  svg.setAttribute('tabindex', '0');
  svg.addEventListener('keydown', handleKeyDown);
  
  // Initialize first element
  if (elements.length > 0) {
    elements[0].setAttribute('tabindex', '0');
  }
  
  // Return cleanup function
  return () => {
    svg.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce changes to screen readers
 */
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Create accessible data table from chart data
 */
export function createAccessibleDataTable(
  data: Array<{ label: string; value: number }>,
  caption: string
): string {
  let table = `<table role="table" aria-label="${caption}">`;
  table += '<thead><tr><th scope="col">Category</th><th scope="col">Value</th></tr></thead>';
  table += '<tbody>';
  
  data.forEach(item => {
    table += `<tr><td>${item.label}</td><td>${item.value}</td></tr>`;
  });
  
  table += '</tbody></table>';
  return table;
}

/**
 * Add focus indicators to chart elements
 */
export function addFocusIndicators(element: SVGElement): void {
  element.setAttribute('class', `${element.getAttribute('class') || ''} focus:outline-2 focus:outline-primary focus:outline-offset-2`);
}
