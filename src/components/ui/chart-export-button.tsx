/**
 * Chart Export Button Component
 * 
 * Provides a button to export charts in multiple formats with high resolution
 * Supports: PNG (2x), SVG, JPG, WebP
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileImage, Loader2 } from 'lucide-react';
import { buttonInteraction } from '@/lib/interaction-polish';
import { 
  exportChart, 
  generateChartFilename,
  ChartExportOptions 
} from '@/lib/chart-export';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  showChartExportNotification,
  showExportErrorNotification,
  getResolutionString
} from '@/lib/export-notifications';

interface ChartExportButtonProps {
  chartElement: HTMLElement | null;
  chartTitle?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const ChartExportButton = ({
  chartElement,
  chartTitle,
  className,
  variant = 'outline',
  size = 'sm',
  showLabel = true,
}: ChartExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'png' | 'svg' | 'jpg' | 'webp') => {
    if (!chartElement) {
      toast({
        title: 'Export Failed',
        description: 'Chart element not found',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const filename = generateChartFilename(chartTitle, format);
      const options: ChartExportOptions = {
        filename,
        format,
        scale: 2, // High resolution (2x pixel density)
        quality: format === 'png' ? 1.0 : 0.95,
      };

      await exportChart(chartElement, options);

      showChartExportNotification(
        format,
        getResolutionString(options.scale || 2)
      );
    } catch (error) {
      console.error('Chart export failed:', error);
      showExportErrorNotification(error as Error, format);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div {...buttonInteraction}>
          <Button
            variant={variant}
            size={size}
            className={cn('gap-2', className)}
            disabled={isExporting || !chartElement}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {showLabel && (size !== 'icon') && (
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            )}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('png')}>
          <FileImage className="h-4 w-4 mr-2 text-purple-500" />
          PNG (High-res 2x)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('jpg')}>
          <FileImage className="h-4 w-4 mr-2 text-orange-500" />
          JPG (Compressed)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('webp')}>
          <FileImage className="h-4 w-4 mr-2 text-green-500" />
          WebP (Modern)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('svg')}>
          <FileImage className="h-4 w-4 mr-2 text-blue-500" />
          SVG (Vector)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
