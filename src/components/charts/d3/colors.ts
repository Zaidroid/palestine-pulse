/**
 * D3 Chart Color System
 * 
 * Theme-aware color utilities for D3 charts
 * Integrates with the existing chart-colors.ts system
 */

import { 
  getChartColor, 
  getAllChartColors, 
  chartColorPalette,
  getChartColorWithOpacity 
} from '@/lib/chart-colors';

/**
 * Get D3-compatible color array for charts
 * Returns colors that work with D3 scales
 */
export const getD3Colors = (count?: number): string[] => {
  const allColors = getAllChartColors();
  if (!count) return allColors;
  
  // If more colors needed than available, cycle through
  return Array.from({ length: count }, (_, i) => 
    allColors[i % allColors.length]
  );
};

/**
 * Get a single D3 color by index
 */
export const getD3Color = (index: number): string => {
  return getChartColor(index);
};

/**
 * D3 Color scales for different chart types
 */
export const d3ColorScales = {
  // Sequential scale for heatmaps and intensity visualizations
  sequential: (theme: 'light' | 'dark' = 'light') => {
    return theme === 'dark'
      ? [
          'hsl(var(--chart-1) / 0.2)',
          'hsl(var(--chart-1) / 0.4)',
          'hsl(var(--chart-1) / 0.6)',
          'hsl(var(--chart-1) / 0.8)',
          'hsl(var(--chart-1))',
        ]
      : [
          'hsl(var(--chart-1) / 0.3)',
          'hsl(var(--chart-1) / 0.5)',
          'hsl(var(--chart-1) / 0.7)',
          'hsl(var(--chart-1) / 0.9)',
          'hsl(var(--chart-1))',
        ];
  },

  // Diverging scale for comparison visualizations
  diverging: (theme: 'light' | 'dark' = 'light') => {
    return [
      chartColorPalette.crisis,
      'hsl(var(--chart-4) / 0.7)',
      chartColorPalette.neutral,
      'hsl(var(--chart-2) / 0.7)',
      chartColorPalette.hope,
    ];
  },

  // Categorical scale for distinct categories
  categorical: getAllChartColors(),

  // Crisis-focused palette
  crisis: [
    chartColorPalette.crisis,
    chartColorPalette.warning,
    chartColorPalette.neutral,
    chartColorPalette.secondary,
  ],

  // Hope-focused palette
  hope: [
    chartColorPalette.hope,
    chartColorPalette.info,
    chartColorPalette.data,
    chartColorPalette.analysis,
  ],
};

/**
 * Get gradient definition for D3 SVG
 */
export const getD3Gradient = (
  id: string,
  color: string,
  opacity: { start: number; end: number } = { start: 0.8, end: 0.1 }
) => {
  return {
    id,
    stops: [
      { offset: '0%', color, opacity: opacity.start },
      { offset: '100%', color, opacity: opacity.end },
    ],
  };
};

/**
 * Create SVG gradient element for D3 charts
 */
export const createSVGGradient = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  gradientId: string,
  color: string,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const defs = svg.append('defs');
  
  const gradient = defs
    .append('linearGradient')
    .attr('id', gradientId)
    .attr('x1', '0%')
    .attr('y1', direction === 'vertical' ? '0%' : '50%')
    .attr('x2', direction === 'vertical' ? '0%' : '100%')
    .attr('y2', direction === 'vertical' ? '100%' : '50%');

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', color)
    .attr('stop-opacity', 0.8);

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', color)
    .attr('stop-opacity', 0.1);

  return gradientId;
};

/**
 * Get color with opacity for D3 fills and strokes
 */
export const getD3ColorWithOpacity = (index: number, opacity: number): string => {
  return getChartColorWithOpacity(index, opacity);
};

/**
 * Theme-aware text color for D3 labels
 */
export const getD3TextColor = (theme: 'light' | 'dark' = 'light'): string => {
  return theme === 'dark' 
    ? 'hsl(var(--foreground))' 
    : 'hsl(var(--foreground))';
};

/**
 * Theme-aware grid color for D3 axes
 */
export const getD3GridColor = (theme: 'light' | 'dark' = 'light'): string => {
  return theme === 'dark'
    ? 'hsl(var(--border) / 0.3)'
    : 'hsl(var(--border) / 0.5)';
};

/**
 * Theme-aware axis color for D3 charts
 */
export const getD3AxisColor = (theme: 'light' | 'dark' = 'light'): string => {
  return theme === 'dark'
    ? 'hsl(var(--border))'
    : 'hsl(var(--border))';
};

/**
 * Get semantic color for specific data types
 */
export const getSemanticColor = (type: keyof typeof chartColorPalette): string => {
  return chartColorPalette[type];
};

/**
 * Color interpolation for smooth transitions
 */
export const interpolateColor = (
  color1: string,
  color2: string,
  t: number
): string => {
  // This is a simplified version - in production, use d3.interpolate
  // For now, return the appropriate color based on threshold
  return t < 0.5 ? color1 : color2;
};

/**
 * Export all color utilities
 */
export {
  getChartColor,
  getAllChartColors,
  chartColorPalette,
  getChartColorWithOpacity,
};
