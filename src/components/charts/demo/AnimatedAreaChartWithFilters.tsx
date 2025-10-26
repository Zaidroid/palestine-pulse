/**
 * AnimatedAreaChart with Time-Based Filtering
 * 
 * Wrapper component that integrates AnimatedAreaChart with ChartCard
 * and provides time-based filtering functionality.
 * 
 * Features:
 * - Time range filters (7D, 1M, 3M, 1Y, All)
 * - Data aggregation by time range
 * - Animated transitions between filter states
 * - Export and share functionality
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.1, 8.2, 8.3)
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { AnimatedAreaChart, AnimatedAreaChartProps } from './AnimatedAreaChart';
import { dataTransformService } from '@/services/dataTransformService';
import { TimeSeriesData, TimeRange, DataSourceMetadata } from '@/types/dashboard-data.types';
import { Download, Share2, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Time filter option
 */
interface TimeFilterOption {
  id: TimeRange;
  label: string;
}

/**
 * Props for AnimatedAreaChartWithFilters
 */
export interface AnimatedAreaChartWithFiltersProps extends Omit<AnimatedAreaChartProps, 'data' | 'timeRange'> {
  /** Title of the chart */
  title: string;
  /** Icon for the chart header */
  icon?: React.ReactNode;
  /** Badge text */
  badge?: string;
  /** Raw data (will be filtered based on time range) */
  rawData: TimeSeriesData[];
  /** Data source metadata */
  dataSource: DataSourceMetadata;
  /** Initial time range filter */
  initialTimeRange?: TimeRange;
  /** Enable/disable export functionality */
  enableExport?: boolean;
  /** Enable/disable share functionality */
  enableShare?: boolean;
  /** Custom export handler */
  onExport?: () => void;
  /** Custom share handler */
  onShare?: () => void;
  /** Show filtered by indicator */
  showFilteredBy?: boolean;
}

/**
 * AnimatedAreaChartWithFilters Component
 * 
 * Provides a complete chart experience with filtering, export, and share capabilities.
 */
export const AnimatedAreaChartWithFilters: React.FC<AnimatedAreaChartWithFiltersProps> = ({
  title,
  icon,
  badge = 'Area Chart',
  rawData,
  dataSource,
  initialTimeRange = 'all',
  enableExport = true,
  enableShare = true,
  onExport,
  onShare,
  showFilteredBy = true,
  ...chartProps
}) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<TimeRange>(initialTimeRange);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Filter options
  const filters: TimeFilterOption[] = [
    { id: '7d', label: t('charts.filters.7d', '7D') },
    { id: '1m', label: t('charts.filters.1m', '1M') },
    { id: '3m', label: t('charts.filters.3m', '3M') },
    { id: '1y', label: t('charts.filters.1y', '1Y') },
    { id: 'all', label: t('charts.filters.all', 'All') },
  ];

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    
    return dataTransformService.aggregateByTimeRange(
      rawData,
      activeFilter,
      'date'
    );
  }, [rawData, activeFilter]);

  // Get filter label for display
  const getFilterLabel = (filterId: TimeRange): string => {
    const filter = filters.find(f => f.id === filterId);
    return filter?.label || 'All';
  };

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    
    if (onExport) {
      onExport();
    } else {
      // Default export behavior
      console.log(`Exporting ${title} as PNG/CSV`);
      // TODO: Implement actual export functionality
    }
    
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  // Handle share
  const handleShare = () => {
    setIsSharing(true);
    
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      const url = new URL(window.location.href);
      url.searchParams.set('filter', activeFilter);
      
      navigator.clipboard.writeText(url.toString()).then(() => {
        console.log(`Shared URL: ${url.toString()}`);
      });
    }
    
    setTimeout(() => {
      setIsSharing(false);
    }, 800);
  };

  // Handle filter change with animation
  const handleFilterChange = (filterId: TimeRange) => {
    setActiveFilter(filterId);
  };

  return (
    <Card className="card-elevated group hover:shadow-theme-lg transition-all duration-500">
      <CardHeader className="space-y-4">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-medium">
            {badge}
          </Badge>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
            <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`
                  px-3 py-1 rounded text-xs font-medium transition-all duration-300
                  ${activeFilter === filter.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
                aria-label={`Filter by ${filter.label}`}
                aria-pressed={activeFilter === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {enableExport && (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                  bg-background border border-border rounded-lg
                  hover:bg-muted hover:border-primary/50 hover:text-primary
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  group/btn"
                aria-label={t('charts.actions.export', 'Export chart')}
              >
                <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce' : 'group-hover/btn:translate-y-0.5'} transition-transform`} />
                {t('charts.actions.export', 'Export')}
              </button>
            )}
            {enableShare && (
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                  bg-background border border-border rounded-lg
                  hover:bg-muted hover:border-secondary/50 hover:text-secondary
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  group/btn"
                aria-label={t('charts.actions.share', 'Share chart')}
              >
                <Share2 className={`h-3.5 w-3.5 ${isSharing ? 'animate-pulse' : 'group-hover/btn:scale-110'} transition-transform`} />
                {t('charts.actions.share', 'Share')}
              </button>
            )}
          </div>
        </div>

        {/* Data Source Badge */}
        <div className="flex items-center justify-between">
          <DataSourceBadge
            source={dataSource.source}
            url={dataSource.url}
            lastUpdated={dataSource.lastUpdated}
            reliability={dataSource.reliability}
            methodology={dataSource.methodology}
          />
          {showFilteredBy && activeFilter !== 'all' && (
            <span className="text-xs text-muted-foreground">
              {t('charts.filteredBy', 'Filtered by')}: {getFilterLabel(activeFilter)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <AnimatedAreaChart
          data={filteredData}
          timeRange={activeFilter}
          {...chartProps}
        />
        
        {/* Data Summary */}
        {filteredData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t('charts.dataPoints', 'Data points')}: {filteredData.length}
            </span>
            <span>
              {t('charts.dateRange', 'Range')}: {' '}
              {new Date(filteredData[0].date).toLocaleDateString()} - {' '}
              {new Date(filteredData[filteredData.length - 1].date).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Default export for lazy loading
export default AnimatedAreaChartWithFilters;
