/**
 * Horizon Chart with Filters Component
 * 
 * Wraps HorizonChart with metric selection and band count controls
 */

import { useState, useMemo } from 'react';
import { HorizonChart, HorizonMetric, HorizonChartProps } from './HorizonChart';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Filter, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface HorizonChartWithFiltersProps extends Omit<HorizonChartProps, 'selectedMetrics' | 'bands'> {
  /** Initial selected metrics */
  initialSelectedMetrics?: string[];
  /** Initial band count */
  initialBands?: number;
  /** Show filter controls */
  showFilters?: boolean;
  /** Compact mode for filters */
  compactFilters?: boolean;
}

/**
 * HorizonChartWithFilters Component
 * 
 * Provides a complete horizon chart experience with metric selection,
 * band count adjustment, and animated transitions.
 */
export const HorizonChartWithFilters: React.FC<HorizonChartWithFiltersProps> = ({
  metrics,
  initialSelectedMetrics = [],
  initialBands = 4,
  showFilters = true,
  compactFilters = false,
  ...chartProps
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(initialSelectedMetrics);
  const [bands, setBands] = useState(initialBands);

  // Get all available metric names
  const availableMetrics = useMemo(() => {
    return metrics.map(m => m.name);
  }, [metrics]);

  // Filter metrics based on selection
  const displayedMetrics = useMemo(() => {
    if (selectedMetrics.length === 0) {
      return metrics;
    }
    return metrics.filter(m => selectedMetrics.includes(m.name));
  }, [metrics, selectedMetrics]);

  // Toggle metric selection
  const toggleMetric = (metricName: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricName)) {
        return prev.filter(m => m !== metricName);
      }
      return [...prev, metricName];
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMetrics([]);
  };

  // Select all metrics
  const selectAll = () => {
    setSelectedMetrics(availableMetrics);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {showFilters && (
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className={`flex flex-col gap-4 ${compactFilters ? 'lg:flex-row lg:items-center' : ''}`}>
              {/* Metric Selection */}
              <div className="flex-1 space-y-2">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">
                      {t('charts.filters.selectMetrics', 'Select Metrics')}
                    </label>
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAll}
                      className="h-7 text-xs"
                    >
                      {t('charts.filters.selectAll', 'Select All')}
                    </Button>
                    {selectedMetrics.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t('charts.filters.clear', 'Clear')}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableMetrics.map(metricName => {
                    const isSelected = selectedMetrics.includes(metricName);
                    return (
                      <Badge
                        key={metricName}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleMetric(metricName)}
                      >
                        {metricName}
                        {isSelected && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
                {selectedMetrics.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t('charts.filters.showing', 'Showing')} {displayedMetrics.length} {t('charts.filters.of', 'of')} {availableMetrics.length} {t('charts.filters.metrics', 'metrics')}
                  </p>
                )}
              </div>

              {/* Band Count Selection */}
              <div className="space-y-2 min-w-[200px]">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">
                    {t('charts.filters.bandCount', 'Band Count')}
                  </label>
                </div>
                <Select
                  value={bands.toString()}
                  onValueChange={(value) => setBands(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 {t('charts.filters.bands', 'bands')}</SelectItem>
                    <SelectItem value="3">3 {t('charts.filters.bands', 'bands')}</SelectItem>
                    <SelectItem value="4">4 {t('charts.filters.bands', 'bands')} ({t('charts.filters.default', 'default')})</SelectItem>
                    <SelectItem value="5">5 {t('charts.filters.bands', 'bands')}</SelectItem>
                    <SelectItem value="6">6 {t('charts.filters.bands', 'bands')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('charts.filters.moreBands', 'More bands = finer detail')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <div className="min-h-[200px]">
        {displayedMetrics.length > 0 ? (
          <HorizonChart
            {...chartProps}
            metrics={displayedMetrics}
            bands={bands}
            selectedMetrics={selectedMetrics}
          />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[200px]">
              <div className="text-center text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">
                  {t('charts.noMetricsSelected', 'No metrics selected')}
                </p>
                <p className="text-xs mt-1">
                  {t('charts.selectMetricsToDisplay', 'Select metrics above to display the chart')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters Summary */}
      {showFilters && (selectedMetrics.length > 0 || bands !== 4) && (
        <div className={`flex flex-wrap items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium">{t('charts.filters.activeFilters', 'Active filters')}:</span>
          {selectedMetrics.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedMetrics.length} {t('charts.filters.metricsSelected', 'metrics selected')}
            </Badge>
          )}
          {bands !== 4 && (
            <Badge variant="secondary" className="text-xs">
              {bands} {t('charts.filters.bands', 'bands')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default HorizonChartWithFilters;
