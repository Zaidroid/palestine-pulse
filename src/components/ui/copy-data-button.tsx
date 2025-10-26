/**
 * Copy Data Button Component
 * 
 * Provides a button to copy data to clipboard in various formats
 * Supports: CSV, JSON, Plain Text, Markdown
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Copy, 
  Check, 
  FileText, 
  FileJson,
  Table,
  FileCode,
  Loader2
} from 'lucide-react';
import { 
  copyDataToClipboard, 
  CopyFormat,
  getDataSize,
  formatDataSize
} from '@/lib/data-copy';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  showCopySuccessNotification,
  showExportErrorNotification,
  formatFileSize as formatSize
} from '@/lib/export-notifications';

interface CopyDataButtonProps {
  data: any;
  dataLabel?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  defaultFormat?: CopyFormat;
}

export const CopyDataButton = ({
  data,
  dataLabel = 'data',
  className,
  variant = 'outline',
  size = 'sm',
  showLabel = true,
  defaultFormat = 'csv',
}: CopyDataButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (format: CopyFormat) => {
    setIsCopying(true);

    try {
      await copyDataToClipboard(data, { 
        format,
        includeHeaders: true,
        pretty: format === 'json'
      });

      setCopied(true);
      
      showCopySuccessNotification(format, formatSize(dataSize));

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      showExportErrorNotification(error as Error, format);
    } finally {
      setIsCopying(false);
    }
  };

  const dataSize = getDataSize(data);
  const formattedSize = formatDataSize(dataSize);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('gap-2', className)}
          disabled={isCopying || !data}
        >
          {isCopying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {showLabel && size !== 'icon' && (
            <span>{isCopying ? 'Copying...' : copied ? 'Copied!' : 'Copy'}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Copy Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleCopy('csv')}>
          <Table className="h-4 w-4 mr-2 text-green-500" />
          <div className="flex-1">
            <div>CSV</div>
            <div className="text-xs text-muted-foreground">
              Comma-separated values
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy('json')}>
          <FileJson className="h-4 w-4 mr-2 text-blue-500" />
          <div className="flex-1">
            <div>JSON (Pretty)</div>
            <div className="text-xs text-muted-foreground">
              Formatted with indentation
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy('json-minified')}>
          <FileJson className="h-4 w-4 mr-2 text-blue-400" />
          <div className="flex-1">
            <div>JSON (Minified)</div>
            <div className="text-xs text-muted-foreground">
              Compact, no whitespace
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy('text')}>
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          <div className="flex-1">
            <div>Plain Text</div>
            <div className="text-xs text-muted-foreground">
              Aligned table format
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy('markdown')}>
          <FileCode className="h-4 w-4 mr-2 text-purple-500" />
          <div className="flex-1">
            <div>Markdown</div>
            <div className="text-xs text-muted-foreground">
              Markdown table syntax
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Data size: {formattedSize}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
