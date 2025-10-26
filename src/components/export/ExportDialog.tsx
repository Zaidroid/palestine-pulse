/**
 * Export Dialog Component
 * 
 * Enhanced UI for exporting data in various formats with preview support
 * Supports: PNG, PDF, CSV, JSON
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  FileJson, 
  FileText, 
  FileSpreadsheet,
  FileImage,
  Check,
  Eye,
  Loader2
} from 'lucide-react';
import { 
  exportToCSV,
  exportToJSON,
  exportToPDF,
  generateFilename
} from '@/services/exportService';
import { exportChartAsPNG } from '@/lib/chart-export';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  showExportSuccessNotification,
  showExportErrorNotification,
  formatFileSize,
  getResolutionString
} from '@/lib/export-notifications';

export type ExportFormat = 'png' | 'pdf' | 'csv' | 'json';

interface ExportDialogProps {
  data: any;
  dataType: string;
  trigger?: React.ReactNode;
  chartElement?: HTMLElement | null;
  onExportComplete?: (format: ExportFormat) => void;
}

export const ExportDialog = ({ 
  data, 
  dataType,
  trigger,
  chartElement,
  onExportComplete
}: ExportDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const exportFormats: Array<{
    format: ExportFormat;
    label: string;
    description: string;
    icon: any;
    color: string;
    supportsPreview: boolean;
  }> = [
    { 
      format: 'png',
      label: 'PNG Image', 
      description: 'High-resolution image (2x pixel density)',
      icon: FileImage,
      color: 'text-purple-500',
      supportsPreview: true
    },
    { 
      format: 'csv',
      label: 'CSV', 
      description: 'Comma-separated values (Excel compatible)',
      icon: FileSpreadsheet,
      color: 'text-green-500',
      supportsPreview: true
    },
    { 
      format: 'json',
      label: 'JSON', 
      description: 'JavaScript Object Notation (Developer friendly)',
      icon: FileJson,
      color: 'text-blue-500',
      supportsPreview: true
    },
    { 
      format: 'pdf',
      label: 'PDF', 
      description: 'Portable Document Format (Print friendly)',
      icon: FileText,
      color: 'text-red-500',
      supportsPreview: false
    },
  ];

  // Generate preview when format changes
  useEffect(() => {
    if (!showPreview) return;

    const generatePreview = async () => {
      try {
        switch (selectedFormat) {
          case 'png':
            if (chartElement) {
              // Generate preview image
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = 400;
                canvas.height = 300;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.font = '16px sans-serif';
                ctx.fillText('Chart Preview', 20, 40);
                ctx.fillText('(Actual export will be high-res)', 20, 70);
                setPreviewImage(canvas.toDataURL());
              }
            }
            break;
          case 'csv':
            const csvPreview = Array.isArray(data) 
              ? data.slice(0, 5).map(row => 
                  Object.values(row).join(', ')
                ).join('\n')
              : 'No preview available';
            setPreviewData(csvPreview + '\n...');
            break;
          case 'json':
            setPreviewData(JSON.stringify(data, null, 2).substring(0, 500) + '\n...');
            break;
        }
      } catch (error) {
        console.error('Preview generation failed:', error);
      }
    };

    generatePreview();
  }, [selectedFormat, showPreview, data, chartElement]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filename = generateFilename(dataType, selectedFormat);
      
      switch (selectedFormat) {
        case 'png':
          if (chartElement) {
            await exportChartAsPNG(chartElement, { 
              filename,
              scale: 2 // 2x pixel density for high resolution
            });
          } else {
            throw new Error('No chart element available for PNG export');
          }
          break;
        case 'csv':
          exportToCSV(Array.isArray(data) ? data : [data], filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'pdf':
          // Convert data to key-value for PDF
          const pdfData = Array.isArray(data)
            ? data.slice(0, 100).map((item, i) => ({ 
                label: `Record ${i + 1}`, 
                value: JSON.stringify(item).substring(0, 100) 
              }))
            : Object.entries(data).slice(0, 50).map(([key, value]) => ({ 
                label: key, 
                value: String(value) 
              }));
          exportToPDF(`${dataType} Data Export`, pdfData, filename);
          break;
      }
      
      // Show success notification with details
      const dataSize = new Blob([JSON.stringify(data)]).size;
      showExportSuccessNotification({
        format: selectedFormat,
        filename,
        size: formatFileSize(dataSize),
      });

      onExportComplete?.(selectedFormat);
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      showExportErrorNotification(error as Error, selectedFormat);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedFormatInfo = exportFormats.find(f => f.format === selectedFormat);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose a format to export {dataType} data
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Select Format</h4>
            {exportFormats.map((fmt) => {
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.format}
                  onClick={() => {
                    setSelectedFormat(fmt.format);
                    setShowPreview(false);
                    setPreviewImage(null);
                    setPreviewData('');
                  }}
                  className={cn(
                    "w-full text-left p-3 border rounded-lg transition-all",
                    selectedFormat === fmt.format 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("h-5 w-5 mt-0.5", fmt.color)} />
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {fmt.label}
                        {selectedFormat === fmt.format && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {fmt.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Preview</h4>
              {selectedFormatInfo?.supportsPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Hide' : 'Show'}
                </Button>
              )}
            </div>
            
            {showPreview && selectedFormatInfo?.supportsPreview ? (
              <div className="border rounded-lg p-4 bg-muted/30 min-h-[200px]">
                {selectedFormat === 'png' && previewImage ? (
                  <div className="space-y-2">
                    <img 
                      src={previewImage} 
                      alt="Export preview" 
                      className="w-full rounded border"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Actual export will be high-resolution (2x)
                    </p>
                  </div>
                ) : (selectedFormat === 'csv' || selectedFormat === 'json') && previewData ? (
                  <ScrollArea className="h-[200px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {previewData}
                    </pre>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/30 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {selectedFormatInfo?.supportsPreview 
                      ? 'Click "Show" to preview' 
                      : 'Preview not available for this format'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {Array.isArray(data) ? `${data.length} records` : '1 dataset'}
            {selectedFormat === 'png' && !chartElement && (
              <Badge variant="destructive" className="ml-2">Chart not available</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting || (selectedFormat === 'png' && !chartElement)}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export as {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};