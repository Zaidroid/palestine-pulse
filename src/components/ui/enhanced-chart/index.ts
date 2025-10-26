/**
 * Enhanced Chart System
 * 
 * Centralized export for all enhanced chart components and utilities
 */

// Main chart wrapper
export { EnhancedChart } from '../enhanced-chart';
export type { EnhancedChartProps, ChartType } from '../enhanced-chart';

// Animated chart variants
export {
  AnimatedLineChart,
  AnimatedBarChart,
  AnimatedAreaChart,
  AnimatedPieChart,
  AnimatedAxes,
} from '../animated-chart-variants';
export type {
  AnimatedLineChartProps,
  AnimatedBarChartProps,
  AnimatedAreaChartProps,
  AnimatedPieChartProps,
  AnimatedAxesProps,
} from '../animated-chart-variants';

// Enhanced tooltips
export {
  EnhancedChartTooltip,
  SimpleChartTooltip,
  TrendIndicator,
} from '../enhanced-chart-tooltip';
export type {
  EnhancedChartTooltipProps,
  SimpleChartTooltipProps,
  TrendIndicatorProps,
  TooltipPayload,
} from '../enhanced-chart-tooltip';

// Export utilities
export {
  exportChart,
  exportChartAsPNG,
  exportChartAsSVG,
  exportMultipleCharts,
  copyChartToClipboard,
  generateChartFilename,
  isChartExportSupported,
  getOptimalExportScale,
} from '../../../lib/chart-export';
export type { ChartExportOptions } from '../../../lib/chart-export';

// Demo component
export { EnhancedChartDemo } from '../enhanced-chart-demo';
