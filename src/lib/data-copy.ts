/**
 * Data Copy Utilities
 * 
 * Provides functionality to copy data to clipboard in various formats:
 * - CSV with headers
 * - JSON (formatted and minified)
 * - Plain text table
 * - Markdown table
 */

export type CopyFormat = 'csv' | 'json' | 'json-minified' | 'text' | 'markdown';

export interface CopyOptions {
  format?: CopyFormat;
  includeHeaders?: boolean;
  delimiter?: string;
  pretty?: boolean;
}

/**
 * Copy data to clipboard in specified format
 */
export async function copyDataToClipboard(
  data: any,
  options: CopyOptions = {}
): Promise<void> {
  const {
    format = 'csv',
    includeHeaders = true,
    delimiter = ',',
    pretty = true,
  } = options;

  try {
    let formattedData: string;

    switch (format) {
      case 'csv':
        formattedData = formatAsCSV(data, includeHeaders, delimiter);
        break;
      case 'json':
        formattedData = formatAsJSON(data, pretty);
        break;
      case 'json-minified':
        formattedData = formatAsJSON(data, false);
        break;
      case 'text':
        formattedData = formatAsText(data, includeHeaders);
        break;
      case 'markdown':
        formattedData = formatAsMarkdown(data, includeHeaders);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    await navigator.clipboard.writeText(formattedData);
  } catch (error) {
    console.error('Failed to copy data to clipboard:', error);
    throw error;
  }
}

/**
 * Format data as CSV
 */
export function formatAsCSV(
  data: any,
  includeHeaders: boolean = true,
  delimiter: string = ','
): string {
  if (!data) return '';

  // Handle array of objects
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows: string[] = [];

    // Add headers
    if (includeHeaders) {
      rows.push(headers.map(escapeCSVValue).join(delimiter));
    }

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        return escapeCSVValue(value);
      });
      rows.push(row.join(delimiter));
    });

    return rows.join('\n');
  }

  // Handle single object
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data);
    const rows: string[] = [];

    if (includeHeaders) {
      rows.push(['Key', 'Value'].join(delimiter));
    }

    entries.forEach(([key, value]) => {
      rows.push([escapeCSVValue(key), escapeCSVValue(value)].join(delimiter));
    });

    return rows.join('\n');
  }

  // Handle primitive values
  return String(data);
}

/**
 * Format data as JSON
 */
export function formatAsJSON(data: any, pretty: boolean = true): string {
  if (pretty) {
    return JSON.stringify(data, null, 2);
  }
  return JSON.stringify(data);
}

/**
 * Format data as plain text table
 */
export function formatAsText(data: any, includeHeaders: boolean = true): string {
  if (!data) return '';

  // Handle array of objects
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows: string[] = [];

    // Calculate column widths
    const columnWidths = headers.map(header => {
      const headerWidth = header.length;
      const maxValueWidth = Math.max(
        ...data.map(item => String(item[header] ?? '').length)
      );
      return Math.max(headerWidth, maxValueWidth);
    });

    // Add headers
    if (includeHeaders) {
      const headerRow = headers
        .map((header, i) => header.padEnd(columnWidths[i]))
        .join('  ');
      rows.push(headerRow);
      rows.push(columnWidths.map(w => '-'.repeat(w)).join('  '));
    }

    // Add data rows
    data.forEach(item => {
      const row = headers
        .map((header, i) => {
          const value = String(item[header] ?? '');
          return value.padEnd(columnWidths[i]);
        })
        .join('  ');
      rows.push(row);
    });

    return rows.join('\n');
  }

  // Handle single object
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data);
    const maxKeyLength = Math.max(...entries.map(([key]) => key.length));

    return entries
      .map(([key, value]) => {
        const paddedKey = key.padEnd(maxKeyLength);
        return `${paddedKey}  ${value}`;
      })
      .join('\n');
  }

  // Handle primitive values
  return String(data);
}

/**
 * Format data as Markdown table
 */
export function formatAsMarkdown(data: any, includeHeaders: boolean = true): string {
  if (!data) return '';

  // Handle array of objects
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows: string[] = [];

    // Add headers
    if (includeHeaders) {
      rows.push('| ' + headers.join(' | ') + ' |');
      rows.push('| ' + headers.map(() => '---').join(' | ') + ' |');
    }

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        return escapeMarkdownValue(value);
      });
      rows.push('| ' + row.join(' | ') + ' |');
    });

    return rows.join('\n');
  }

  // Handle single object
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data);
    const rows: string[] = [];

    if (includeHeaders) {
      rows.push('| Key | Value |');
      rows.push('| --- | --- |');
    }

    entries.forEach(([key, value]) => {
      rows.push(`| ${escapeMarkdownValue(key)} | ${escapeMarkdownValue(value)} |`);
    });

    return rows.join('\n');
  }

  // Handle primitive values
  return String(data);
}

/**
 * Escape CSV value
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Escape Markdown value
 */
function escapeMarkdownValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  return String(value)
    .replace(/\|/g, '\\|')
    .replace(/\n/g, '<br>');
}

/**
 * Get data size in bytes
 */
export function getDataSize(data: any): number {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size;
}

/**
 * Format data size for display
 */
export function formatDataSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if clipboard API is supported
 */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

/**
 * Copy with fallback for older browsers
 */
export async function copyWithFallback(text: string): Promise<void> {
  if (isClipboardSupported()) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
