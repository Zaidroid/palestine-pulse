/**
 * D3 Chart Component Library
 * 
 * Centralized exports for all D3 chart components and utilities
 */

// Core components
export { ChartCard } from './ChartCard';

// Chart components
export { InteractiveBarChart } from './InteractiveBarChart';
export { InteractiveBarChartWithFilters } from './InteractiveBarChartWithFilters';

// Chart component types
export type { InteractiveBarChartProps } from './InteractiveBarChart';
export type { InteractiveBarChartWithFiltersProps } from './InteractiveBarChartWithFilters';

// Types
export type {
  D3ChartProps,
  ChartCardProps,
  DataSourceMetadata,
  TimeFilter,
  ChartType,
  FilterConfig,
  TimeSeriesData,
  CategoryData,
  FlowData,
  PyramidData,
  CalendarData,
  EventData,
} from './types';

// Color utilities
export {
  getD3Colors,
  getD3Color,
  getD3ColorWithOpacity,
  getD3Gradient,
  createSVGGradient,
  getD3TextColor,
  getD3GridColor,
  getD3AxisColor,
  getSemanticColor,
  d3ColorScales,
  chartColorPalette,
} from './colors';

// Re-export chart color utilities for convenience
export {
  getChartColor,
  getAllChartColors,
  getChartColorWithOpacity as getColorWithOpacity,
} from '@/lib/chart-colors';
