/**
 * Export Notifications
 * 
 * Provides enhanced toast notifications for export operations
 * with download links and progress indicators
 */

import { toast } from '@/hooks/use-toast';

export interface ExportNotificationOptions {
  format: string;
  filename?: string;
  downloadUrl?: string;
  size?: string;
  duration?: number;
}

/**
 * Show success notification for completed export
 */
export function showExportSuccessNotification(options: ExportNotificationOptions) {
  const { format, filename, size, duration = 5000 } = options;

  let description = `Data exported as ${format.toUpperCase()}`;
  if (size) description += ` (${size})`;
  if (filename) description += `\n${filename}`;

  toast({
    title: 'Export Successful',
    description,
    duration,
  });
}

/**
 * Show error notification for failed export
 */
export function showExportErrorNotification(
  error: string | Error,
  format?: string
) {
  const errorMessage = error instanceof Error ? error.message : error;

  let description = '';
  if (format) description = `Failed to export as ${format.toUpperCase()}\n`;
  description += errorMessage;

  toast({
    title: 'Export Failed',
    description,
    variant: 'destructive',
    duration: 7000,
  });
}

/**
 * Show progress notification for ongoing export
 */
export function showExportProgressNotification(
  format: string,
  progress?: number
) {
  let description = `Preparing ${format.toUpperCase()} export`;
  if (progress !== undefined) {
    description += ` (${progress}%)`;
  }

  return toast({
    title: 'Exporting...',
    description,
    duration: Infinity, // Keep open until dismissed
  });
}

/**
 * Show warning notification for large exports
 */
export function showExportWarningNotification(
  size: string,
  format: string
) {
  toast({
    title: 'Large Export',
    description: `This export is quite large (${size}). ${format.toUpperCase()} generation may take a moment.`,
    duration: 5000,
  });
}

/**
 * Show notification for copy to clipboard
 */
export function showCopySuccessNotification(format: string, size?: string) {
  let description = `Data copied as ${format.toUpperCase()}`;
  if (size) description += ` (${size})`;
  description += '. Ready to paste into your application.';

  toast({
    title: 'Copied to Clipboard',
    description,
    duration: 3000,
  });
}

/**
 * Show notification for share link
 */
export function showShareSuccessNotification(copied: boolean = false) {
  toast({
    title: copied ? 'Link Copied' : 'Share Link Generated',
    description: copied
      ? 'Shareable link copied to clipboard'
      : 'Share link is ready to use',
    duration: 3000,
  });
}

/**
 * Show notification for chart export
 */
export function showChartExportNotification(
  format: string,
  resolution?: string
) {
  let description = `Chart saved as ${format.toUpperCase()}`;
  if (resolution) description += `\nResolution: ${resolution}`;

  toast({
    title: 'Chart Exported',
    description,
    duration: 4000,
  });
}

/**
 * Batch export notification
 */
export function showBatchExportNotification(
  completed: number,
  total: number,
  format: string
) {
  if (completed === total) {
    toast({
      title: 'Batch Export Complete',
      description: `Successfully exported ${total} items as ${format.toUpperCase()}`,
      duration: 5000,
    });
  } else {
    toast({
      title: 'Batch Export in Progress',
      description: `Exported ${completed} of ${total} items`,
      duration: 2000,
    });
  }
}

/**
 * Helper to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Helper to get resolution string
 */
export function getResolutionString(scale: number): string {
  return `${scale}x (${scale === 2 ? 'High-res' : scale === 3 ? 'Ultra-res' : 'Standard'})`;
}
