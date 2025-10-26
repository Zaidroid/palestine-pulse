/**
 * Export and Share Components
 * 
 * Centralized exports for all export and share functionality
 */

// Main components
export { ExportDialog } from './ExportDialog';
export { ChartExportButton } from '../ui/chart-export-button';
export { CopyDataButton } from '../ui/copy-data-button';
export { ShareButton } from '../ui/share-button';

// Demo component
export { ExportShareDemo } from './ExportShareDemo';

// Utilities
export {
  exportChart,
  exportChartAsPNG,
  exportChartAsSVG,
  exportChartAsJPG,
  exportChartAsWebP,
  generateChartFilename,
  isChartExportSupported,
  getOptimalExportScale,
  exportMultipleCharts,
  copyChartToClipboard,
  type ChartExportOptions,
} from '../../lib/chart-export';

export {
  copyDataToClipboard,
  formatAsCSV,
  formatAsJSON,
  formatAsText,
  formatAsMarkdown,
  getDataSize,
  formatDataSize,
  isClipboardSupported,
  copyWithFallback,
  type CopyFormat,
  type CopyOptions,
} from '../../lib/data-copy';

export {
  showExportSuccessNotification,
  showExportErrorNotification,
  showExportProgressNotification,
  showExportWarningNotification,
  showCopySuccessNotification,
  showShareSuccessNotification,
  showChartExportNotification,
  showBatchExportNotification,
  formatFileSize,
  getResolutionString,
  type ExportNotificationOptions,
} from '../../lib/export-notifications';

// Hooks
export {
  useShareableState,
  useRestoreFromUrl,
  generateShareableUrl,
  parseStateFromUrl,
} from '../../hooks/useShareableState';

// Types
export type { ExportFormat } from './ExportDialog';
