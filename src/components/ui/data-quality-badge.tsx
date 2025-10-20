/**
 * Data Quality Badge Component
 * 
 * Displays information about data source and quality
 * Shows whether data is real or sample, source attribution, and update time
 */

import { Badge } from './badge';
import { cn } from '../../lib/utils';

export interface DataQualityBadgeProps {
  /**
   * Data source name (e.g., "World Bank", "WFP", "Tech4Palestine")
   */
  source: string;
  
  /**
   * Whether this is real data or sample/estimated data
   */
  isRealData: boolean;
  
  /**
   * Number of records in the dataset (optional)
   */
  recordCount?: number;
  
  /**
   * When the data was last updated (optional)
   */
  lastUpdated?: Date | string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Show detailed information
   */
  showDetails?: boolean;
}

/**
 * Format time ago (e.g., "2 hours ago")
 */
const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

/**
 * Format large numbers (e.g., "18,448" or "18.4K")
 */
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
};

export const DataQualityBadge = ({
  source,
  isRealData,
  recordCount,
  lastUpdated,
  className,
  showDetails = true,
}: DataQualityBadgeProps) => {
  if (!isRealData) {
    return (
      <Badge 
        variant="secondary" 
        className={cn("text-xs", className)}
      >
        ℹ️ Sample data (real data integration in progress)
      </Badge>
    );
  }
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
        🟢 Real data from {source}
      </Badge>
      
      {showDetails && recordCount && (
        <Badge variant="outline" className="text-xs">
          {formatCount(recordCount)} records
        </Badge>
      )}
      
      {showDetails && lastUpdated && (
        <Badge variant="outline" className="text-xs">
          Updated {formatTimeAgo(lastUpdated)}
        </Badge>
      )}
    </div>
  );
};

/**
 * Simple version for compact display
 */
export const DataSourceBadge = ({
  source,
  isRealData,
  className,
}: Pick<DataQualityBadgeProps, 'source' | 'isRealData' | 'className'>) => {
  return (
    <Badge
      variant={isRealData ? "default" : "secondary"}
      className={cn("text-xs", isRealData && "bg-green-600 hover:bg-green-700", className)}
    >
      {isRealData ? `🟢 ${source}` : '⚠️ Sample'}
    </Badge>
  );
};

/**
 * Loading state badge
 */
export const DataLoadingBadge = ({ 
  className 
}: { 
  className?: string 
}) => {
  return (
    <Badge variant="outline" className={cn("text-xs animate-pulse", className)}>
      🔄 Loading data...
    </Badge>
  );
};

/**
 * Error state badge
 */
export const DataErrorBadge = ({ 
  className,
  message = "Data unavailable"
}: { 
  className?: string;
  message?: string;
}) => {
  return (
    <Badge variant="destructive" className={cn("text-xs", className)}>
      ⚠️ {message}
    </Badge>
  );
};