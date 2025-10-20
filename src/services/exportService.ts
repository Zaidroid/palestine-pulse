/**
 * Export Service
 * 
 * Handles data export in multiple formats:
 * - CSV export
 * - JSON export
 * - PDF export (basic)
 * 
 * All processing done client-side (serverless)
 */

import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import { ExportFormat, ExportConfig } from './types/data.types';

// ============================================
// CSV EXPORT
// ============================================

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string = 'export.csv'): void => {
  try {
    // Convert to CSV using papaparse
    const csv = Papa.unparse(data);
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('CSV export failed:', error);
    throw new Error('Failed to export CSV');
  }
};

// ============================================
// JSON EXPORT
// ============================================

/**
 * Export data to JSON format
 */
export const exportToJSON = (data: any, filename: string = 'export.json'): void => {
  try {
    // Convert to formatted JSON
    const json = JSON.stringify(data, null, 2);
    
    // Create blob and download
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('JSON export failed:', error);
    throw new Error('Failed to export JSON');
  }
};

// ============================================
// PDF EXPORT (Basic)
// ============================================

/**
 * Export data to PDF format (basic text export)
 */
export const exportToPDF = (
  title: string, 
  data: Array<{ label: string; value: string | number }>,
  filename: string = 'export.pdf'
): void => {
  try {
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add data
    doc.setFontSize(12);
    let yPos = 45;
    
    data.forEach((item, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`${item.label}: ${item.value}`, 20, yPos);
      yPos += 10;
    });
    
    // Add footer
    doc.setFontSize(8);
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount} | Palestine Humanitarian Dashboard`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save PDF
    doc.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF');
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Download blob as file
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (
  base: string,
  extension: string,
  includeTimestamp: boolean = true
): string => {
  const timestamp = includeTimestamp 
    ? `_${new Date().toISOString().split('T')[0]}`
    : '';
  return `${base}${timestamp}.${extension}`;
};

/**
 * Format data for export based on configuration
 */
export const formatDataForExport = (
  data: any[],
  config?: Partial<ExportConfig>
): any[] => {
  let formattedData = [...data];
  
  // Apply date range filter if provided
  if (config?.dateRange) {
    const { start, end } = config.dateRange;
    formattedData = formattedData.filter((item: any) => {
      const itemDate = new Date(item.date || item.report_date);
      return itemDate >= new Date(start) && itemDate <= new Date(end);
    });
  }
  
  return formattedData;
};

/**
 * Export data with auto-format detection
 */
export const exportData = (
  data: any,
  format: ExportFormat,
  filename?: string,
  config?: Partial<ExportConfig>
): void => {
  try {
    switch (format) {
      case 'csv':
        exportToCSV(
          Array.isArray(data) ? data : [data],
          filename || generateFilename('palestine_data', 'csv')
        );
        break;
        
      case 'json':
        exportToJSON(
          data,
          filename || generateFilename('palestine_data', 'json')
        );
        break;
        
      case 'pdf':
        // Convert object to key-value pairs for PDF
        const pdfData = Array.isArray(data) 
          ? data.map((item, i) => ({ label: `Item ${i + 1}`, value: JSON.stringify(item) }))
          : Object.entries(data).map(([key, value]) => ({ 
              label: key, 
              value: String(value) 
            }));
        
        exportToPDF(
          'Palestine Humanitarian Dashboard - Data Export',
          pdfData,
          filename || generateFilename('palestine_data', 'pdf')
        );
        break;
        
      case 'excel':
        // For now, export as CSV (can be opened in Excel)
        exportToCSV(
          Array.isArray(data) ? data : [data],
          filename || generateFilename('palestine_data', 'csv')
        );
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

// ============================================
// EXPORT TEMPLATES
// ============================================

/**
 * Export casualties data
 */
export const exportCasualties = (data: any[], format: ExportFormat = 'csv'): void => {
  const filename = generateFilename('casualties', format);
  exportData(data, format, filename);
};

/**
 * Export infrastructure data
 */
export const exportInfrastructure = (data: any[], format: ExportFormat = 'csv'): void => {
  const filename = generateFilename('infrastructure', format);
  exportData(data, format, filename);
};

/**
 * Export summary statistics
 */
export const exportSummary = (data: any, format: ExportFormat = 'json'): void => {
  const filename = generateFilename('summary', format);
  exportData(data, format, filename);
};

/**
 * Export all data as archive
 */
export const exportAll = async (allData: Record<string, any>): Promise<void> => {
  // Export each dataset separately
  Object.entries(allData).forEach(([key, value]) => {
    const format: ExportFormat = Array.isArray(value) ? 'csv' : 'json';
    const filename = generateFilename(key, format);
    exportData(value, format, filename);
  });
};