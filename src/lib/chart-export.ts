/**
 * Chart Export Utilities
 * 
 * Provides functionality to export charts as high-resolution images:
 * - PNG export at 2x pixel density
 * - SVG export for vector graphics
 * - Automatic filename generation
 * - Loading state management
 */

import html2canvas from 'html2canvas';

export interface ChartExportOptions {
  filename?: string;
  format?: 'png' | 'svg' | 'jpg' | 'webp';
  scale?: number;
  backgroundColor?: string;
  quality?: number;
}

/**
 * Export a chart element as a high-resolution PNG image
 */
export async function exportChartAsPNG(
  element: HTMLElement,
  options: ChartExportOptions = {}
): Promise<void> {
  const {
    filename = `chart-${Date.now()}.png`,
    scale = 2, // 2x pixel density for high resolution
    backgroundColor = '#ffffff',
    quality = 1.0,
  } = options;

  try {
    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        quality
      );
    });

    // Download
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    throw error;
  }
}

/**
 * Export a chart element as SVG
 */
export async function exportChartAsSVG(
  element: HTMLElement,
  options: ChartExportOptions = {}
): Promise<void> {
  const {
    filename = `chart-${Date.now()}.svg`,
  } = options;

  try {
    // Find SVG element within the chart
    const svgElement = element.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('No SVG element found in chart');
    }

    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;

    // Get computed styles and apply them inline
    const styles = getComputedStyle(svgElement);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Apply background if needed
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', styles.backgroundColor || 'white');
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);

    // Serialize SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    
    // Create blob
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    
    // Download
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to export chart as SVG:', error);
    throw error;
  }
}

/**
 * Export chart as JPG image
 */
export async function exportChartAsJPG(
  element: HTMLElement,
  options: ChartExportOptions = {}
): Promise<void> {
  const {
    filename = `chart-${Date.now()}.jpg`,
    scale = 2,
    backgroundColor = '#ffffff',
    quality = 0.95,
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    });

    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to export chart as JPG:', error);
    throw error;
  }
}

/**
 * Export chart as WebP image
 */
export async function exportChartAsWebP(
  element: HTMLElement,
  options: ChartExportOptions = {}
): Promise<void> {
  const {
    filename = `chart-${Date.now()}.webp`,
    scale = 2,
    backgroundColor = '#ffffff',
    quality = 0.95,
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/webp',
        quality
      );
    });

    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to export chart as WebP:', error);
    throw error;
  }
}

/**
 * Export chart with automatic format detection
 */
export async function exportChart(
  element: HTMLElement,
  options: ChartExportOptions = {}
): Promise<void> {
  const { format = 'png' } = options;

  switch (format) {
    case 'svg':
      return exportChartAsSVG(element, options);
    case 'jpg':
      return exportChartAsJPG(element, options);
    case 'webp':
      return exportChartAsWebP(element, options);
    case 'png':
    default:
      return exportChartAsPNG(element, options);
  }
}

/**
 * Helper function to download a blob
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a filename for chart export
 */
export function generateChartFilename(
  chartTitle?: string,
  format: 'png' | 'svg' | 'jpg' | 'webp' = 'png'
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedTitle = chartTitle
    ? chartTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'chart';
  
  return `${sanitizedTitle}-${timestamp}.${format}`;
}

/**
 * Check if chart export is supported in the current browser
 */
export function isChartExportSupported(): boolean {
  return (
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof Blob !== 'undefined' &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function'
  );
}

/**
 * Get the optimal export scale based on device pixel ratio
 */
export function getOptimalExportScale(): number {
  if (typeof window === 'undefined') return 2;
  
  const dpr = window.devicePixelRatio || 1;
  
  // Cap at 3x for performance reasons
  return Math.min(Math.max(dpr, 2), 3);
}

/**
 * Export multiple charts as a single image
 */
export async function exportMultipleCharts(
  elements: HTMLElement[],
  options: ChartExportOptions = {}
): Promise<void> {
  const {
    filename = `charts-${Date.now()}.png`,
    scale = 2,
    backgroundColor = '#ffffff',
  } = options;

  try {
    // Create a container for all charts
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.backgroundColor = backgroundColor;
    container.style.padding = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '20px';

    // Clone and append all chart elements
    elements.forEach(element => {
      const clone = element.cloneNode(true) as HTMLElement;
      container.appendChild(clone);
    });

    document.body.appendChild(container);

    // Export the container
    await exportChartAsPNG(container, { ...options, filename });

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('Failed to export multiple charts:', error);
    throw error;
  }
}

/**
 * Copy chart to clipboard as image
 */
export async function copyChartToClipboard(
  element: HTMLElement,
  options: Omit<ChartExportOptions, 'filename'> = {}
): Promise<void> {
  const {
    scale = 2,
    backgroundColor = '#ffffff',
    quality = 1.0,
  } = options;

  try {
    // Check if clipboard API is supported
    if (!navigator.clipboard || !ClipboardItem) {
      throw new Error('Clipboard API not supported');
    }

    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        quality
      );
    });

    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } catch (error) {
    console.error('Failed to copy chart to clipboard:', error);
    throw error;
  }
}
