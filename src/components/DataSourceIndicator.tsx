/**
 * Data Source Indicator
 * 
 * Shows whether data is loaded from local cache or API
 * Helps verify the local data infrastructure is working
 */

import { Database, Cloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSourceIndicatorProps {
  source: 'local' | 'api' | 'loading' | 'error';
  dataset?: string;
  recordCount?: number;
  className?: string;
}

export function DataSourceIndicator({ 
  source, 
  dataset, 
  recordCount,
  className 
}: DataSourceIndicatorProps) {
  const config = {
    local: {
      icon: Database,
      label: 'Local Data',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    api: {
      icon: Cloud,
      label: 'API',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    loading: {
      icon: AlertCircle,
      label: 'Loading...',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950/30',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
    error: {
      icon: AlertCircle,
      label: 'Error',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  };

  const { icon: Icon, label, color, bgColor, borderColor } = config[source];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium',
        bgColor,
        borderColor,
        color,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {dataset && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs">{dataset}</span>
        </>
      )}
      {recordCount !== undefined && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs font-mono">{recordCount.toLocaleString()} records</span>
        </>
      )}
      {source === 'local' && (
        <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
      )}
    </div>
  );
}
