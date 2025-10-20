/**
 * Export Dialog Component
 * 
 * UI for exporting data in various formats
 */

import { useState } from 'react';
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
import { 
  Download, 
  FileJson, 
  FileText, 
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { 
  exportToCSV,
  exportToJSON,
  exportToPDF,
  generateFilename
} from '@/services/exportService';
import { useToast } from '@/hooks/use-toast';
// Using generic type for export format

interface ExportDialogProps {
  data: any;
  dataType: string;
  trigger?: React.ReactNode;
}

export const ExportDialog = ({ 
  data, 
  dataType,
  trigger 
}: ExportDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    { 
      format: 'csv',
      label: 'CSV', 
      description: 'Comma-separated values (Excel compatible)',
      icon: FileSpreadsheet,
      color: 'text-chart-2'
    },
    { 
      format: 'json',
      label: 'JSON', 
      description: 'JavaScript Object Notation (Developer friendly)',
      icon: FileJson,
      color: 'text-chart-4'
    },
    { 
      format: 'pdf',
      label: 'PDF', 
      description: 'Portable Document Format (Print friendly)',
      icon: FileText,
      color: 'text-chart-1'
    },
  ];

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const filename = generateFilename(dataType, selectedFormat);
      
      switch (selectedFormat) {
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
      
      toast({
        title: 'Export Successful',
        description: `Data exported as ${selectedFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose a format to export {dataType} data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {exportFormats.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <button
                key={fmt.format}
                onClick={() => setSelectedFormat(fmt.format)}
                className={`w-full text-left p-4 border rounded-lg transition-all ${
                  selectedFormat === fmt.format 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${fmt.color}`} />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {fmt.label}
                        {selectedFormat === fmt.format && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {fmt.description}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {Array.isArray(data) ? `${data.length} records` : '1 dataset'}
          </div>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};