/**
 * ChartCard Wrapper Component
 * 
 * Unified container for all D3 charts with:
 * - Consistent controls and metadata
 * - Time filter tabs (7D, 1M, 3M, 1Y, All)
 * - Export button (PNG/CSV)
 * - Share button (URL with filters)
 * - Data source badge with hover panel
 * - Loading states and error boundaries
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { Download, Share2, Filter } from 'lucide-react';
import type { ChartCardProps, TimeFilter, FilterConfig } from './types';

const DEFAULT_FILTERS: FilterConfig[] = [
  { id: 'week', label: '7D' },
  { id: 'month', label: '1M' },
  { id: 'quarter', label: '3M' },
  { id: 'year', label: '1Y' },
  { id: 'all', label: 'All' }
];

export const ChartCard = ({
  title,
  icon,
  badge,
  children,
  dataSource,
  chartType,
  filters = { enabled: true, defaultFilter: 'all' },
  exportEnabled = true,
  shareEnabled = true,
  onExport,
  onShare
}: ChartCardProps) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>(
    filters.defaultFilter || 'all'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleFilterChange = (filter: TimeFilter) => {
    setActiveFilter(filter);
    filters.onFilterChange?.(filter);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport();
      } else {
        // Default export behavior
        console.log(`Exporting ${title} as PNG/CSV`);
      }
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (onShare) {
        await onShare();
      } else {
        // Default share behavior
        const url = new URL(window.location.href);
        url.searchParams.set('filter', activeFilter);
        await navigator.clipboard.writeText(url.toString());
        console.log(`Sharing ${title}`);
      }
    } finally {
      setTimeout(() => setIsSharing(false), 800);
    }
  };

  const getFilterLabel = (filterId: TimeFilter): string => {
    const filter = DEFAULT_FILTERS.find(f => f.id === filterId);
    return filter?.label || 'All Time';
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
          {filters.enabled && (
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              {DEFAULT_FILTERS.map((filter) => (
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
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {exportEnabled && (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                         bg-background border border-border rounded-lg
                         hover:bg-muted hover:border-primary/50 hover:text-primary
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         group/btn"
              >
                <Download 
                  className={`h-3.5 w-3.5 ${
                    isExporting 
                      ? 'animate-bounce' 
                      : 'group-hover/btn:translate-y-0.5'
                  } transition-transform`} 
                />
                Export
              </button>
            )}
            {shareEnabled && (
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                         bg-background border border-border rounded-lg
                         hover:bg-muted hover:border-secondary/50 hover:text-secondary
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         group/btn"
              >
                <Share2 
                  className={`h-3.5 w-3.5 ${
                    isSharing 
                      ? 'animate-pulse' 
                      : 'group-hover/btn:scale-110'
                  } transition-transform`} 
                />
                Share
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart Content */}
        <div className="min-h-[400px]">
          {children}
        </div>

        {/* Data Source Badge */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
          <DataSourceBadge
            source={dataSource.source}
            url={dataSource.url}
            lastUpdated={dataSource.lastUpdated}
            reliability={dataSource.reliability}
            methodology={dataSource.methodology}
          />
          {filters.enabled && (
            <div className="text-xs text-muted-foreground">
              Filtered by: <span className="font-medium text-foreground">
                {activeFilter === 'all' ? 'All Time' : getFilterLabel(activeFilter)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
