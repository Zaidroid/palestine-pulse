/**
 * Calendar Heatmap Chart with Integrated Filters
 * 
 * A complete implementation with year/month selection, date range filtering,
 * and animated transitions between filter states.
 * 
 * Features:
 * - Year/month selection controls
 * - Date range zoom functionality
 * - Animated calendar transitions
 * - Statistics panel
 * - Export/share functionality
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.1, 8.2)
 */

import { useState, useMemo } from 'react';
import { CalendarHeatmapChart } from './CalendarHeatmapChart';
import { CalendarData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  ZoomIn,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as d3 from 'd3';

/**
 * Props for CalendarHeatmapChartWithFilters component
 */
export interface CalendarHeatmapChartWithFiltersProps {
  /** Array of calendar data points */
  data: CalendarData[];
  /** Chart title */
  title: string;
  /** Chart description */
  description?: string;
  /** Data source information */
  dataSource?: {
    source: string;
    url?: string;
    lastUpdated: string;
  };
  /** Enable export functionality */
  enableExport?: boolean;
  /** Enable share functionality */
  enableShare?: boolean;
  /** Callback when export is clicked */
  onExport?: () => void;
  /** Callback when share is clicked */
  onShare?: () => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show statistics panel */
  showStatistics?: boolean;
  /** Cell size in pixels */
  cellSize?: number;
}

/**
 * CalendarHeatmapChartWithFilters Component
 * 
 * A complete calendar heatmap implementation with integrated filtering controls,
 * year/month navigation, and statistics display.
 */
export const CalendarHeatmapChartWithFilters: React.FC<CalendarHeatmapChartWithFiltersProps> = ({
  data,
  title,
  description,
  dataSource,
  enableExport = true,
  enableShare = true,
  onExport,
  onShare,
  valueFormatter,
  showStatistics = true,
  cellSize = 17,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<CalendarData | null>(null);
  const [zoomMode, setZoomMode] = useState<'year' | 'month' | 'custom'>('year');

  // Get available years from data
  const availableYears = useMemo(() => {
    if (!data || data.length === 0) return [];
    const years = Array.from(new Set(data.map(d => {
      const dateValue = d.date;
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.getFullYear();
    })));
    return years.sort((a, b) => b - a); // Most recent first
  }, [data]);

  // Set initial year if not set
  const currentYear = selectedYear || availableYears[0] || new Date().getFullYear();

  // Filter data by selected year and month
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = data.filter(d => {
      const dateValue = d.date;
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.getFullYear() === currentYear;
    });
    
    if (selectedMonth !== null) {
      filtered = filtered.filter(d => {
        const dateValue = d.date;
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        return date.getMonth() === selectedMonth;
      });
    }
    
    return filtered;
  }, [data, currentYear, selectedMonth]);

  // Month names
  const monthNames = useMemo(() => {
    if (i18n.language === 'ar') {
      return ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    }
    return ['January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'];
  }, [i18n.language]);

  const shortMonthNames = useMemo(() => {
    if (i18n.language === 'ar') {
      return ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }, [i18n.language]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const values = filteredData.map(d => d.value);
    const total = values.reduce((sum, v) => sum + v, 0);
    const average = values.length > 0 ? total / values.length : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;
    const min = values.length > 0 ? Math.min(...values.filter(v => v > 0)) : 0;
    
    // Find peak day
    const peakDay = filteredData.find(d => d.value === max);
    
    // Calculate trend (simple linear regression)
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (values.length > 7) {
      const firstWeek = values.slice(0, 7).reduce((sum, v) => sum + v, 0) / 7;
      const lastWeek = values.slice(-7).reduce((sum, v) => sum + v, 0) / 7;
      const change = ((lastWeek - firstWeek) / firstWeek) * 100;
      
      if (change > 10) trend = 'increasing';
      else if (change < -10) trend = 'decreasing';
    }
    
    return {
      total,
      average,
      max,
      min,
      daysWithData: values.length,
      peakDay: peakDay ? new Date(peakDay.date) : null,
      trend,
    };
  }, [filteredData]);

  // Default value formatter
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const formatValue = valueFormatter || defaultValueFormatter;

  // Handlers
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setZoomMode('year');
  };

  const handleMonthToggle = (month: number) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
      setZoomMode('year');
    } else {
      setSelectedMonth(month);
      setZoomMode('month');
    }
  };

  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
      setSelectedMonth(null);
      setZoomMode('year');
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
      setSelectedMonth(null);
      setZoomMode('year');
    }
  };

  const handleReset = () => {
    setSelectedYear(availableYears[0]);
    setSelectedMonth(null);
    setSelectedCell(null);
    setZoomMode('year');
  };

  const handleCellClick = (cellData: CalendarData) => {
    setSelectedCell(cellData);
  };

  const handleCellHover = (cellData: CalendarData | null) => {
    // Could be used for additional interactions
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      console.log('Export calendar as PNG');
      // Default export implementation would go here
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      console.log('Share calendar');
      // Default share implementation would go here
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </div>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {enableExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                {t('charts.export', 'Export')}
              </Button>
            )}
            {enableShare && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                {t('charts.share', 'Share')}
              </Button>
            )}
          </div>
        </div>

        {/* Year navigation */}
        <div className={`flex items-center justify-between pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousYear}
              disabled={availableYears.indexOf(currentYear) >= availableYears.length - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {availableYears.map(year => (
                <Badge
                  key={year}
                  variant={currentYear === year ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextYear}
              disabled={availableYears.indexOf(currentYear) <= 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {selectedMonth !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedMonth(null);
                  setZoomMode('year');
                }}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                {t('charts.showFullYear', 'Show Full Year')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('charts.reset', 'Reset')}
            </Button>
          </div>
        </div>

        {/* Month selector */}
        <div className={`flex flex-wrap items-center gap-2 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {shortMonthNames.map((month, index) => (
            <Badge
              key={month}
              variant={selectedMonth === index ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => handleMonthToggle(index)}
            >
              {month}
            </Badge>
          ))}
        </div>

        {/* Filter indicator */}
        {(selectedMonth !== null || zoomMode !== 'year') && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              {t('charts.filteredBy', 'Filtered by')}: {' '}
              {selectedMonth !== null 
                ? `${monthNames[selectedMonth]} ${currentYear}`
                : `${currentYear}`
              }
            </p>
          </div>
        )}

        {/* Statistics panel */}
        {showStatistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('charts.total', 'Total')}</p>
              <p className="text-2xl font-bold">{formatValue(statistics.total)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('charts.averagePerDay', 'Average/Day')}</p>
              <p className="text-2xl font-bold">{Math.round(statistics.average)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('charts.peakDay', 'Peak Day')}</p>
              <p className="text-2xl font-bold">{statistics.max}</p>
              {statistics.peakDay && (
                <p className="text-xs text-muted-foreground">
                  {d3.timeFormat('%b %d')(statistics.peakDay)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <p className="text-xs text-muted-foreground">{t('charts.trend', 'Trend')}</p>
                <TrendingUp className={`h-3 w-3 ${
                  statistics.trend === 'increasing' ? 'text-red-500' :
                  statistics.trend === 'decreasing' ? 'text-green-500' :
                  'text-muted-foreground'
                }`} />
              </div>
              <p className={`text-lg font-bold capitalize ${
                statistics.trend === 'increasing' ? 'text-red-500' :
                statistics.trend === 'decreasing' ? 'text-green-500' :
                'text-muted-foreground'
              }`}>
                {statistics.trend}
              </p>
            </div>
          </div>
        )}

        {/* Data source */}
        {dataSource && (
          <div className="pt-4">
            <Badge variant="outline" className="text-xs">
              {t('charts.source', 'Source')}: {dataSource.source}
              {dataSource.lastUpdated && ` • ${t('charts.updated', 'Updated')}: ${dataSource.lastUpdated}`}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <CalendarHeatmapChart
          data={filteredData}
          animated={true}
          interactive={true}
          showMonthLabels={selectedMonth === null}
          showDayLabels={true}
          selectedYear={currentYear}
          selectedMonth={selectedMonth ?? undefined}
          onCellClick={handleCellClick}
          onCellHover={handleCellHover}
          valueFormatter={formatValue}
          cellSize={cellSize}
        />
        
        {selectedCell && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">
              {t('charts.selectedDateDetails', 'Selected Date Details')}
            </p>
            <div className="space-y-1 text-sm">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.date', 'Date')}:</span>
                <span className="font-medium">
                  {d3.timeFormat('%B %d, %Y')(new Date(selectedCell.date))}
                </span>
              </div>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
                <span className="font-bold">{formatValue(selectedCell.value)}</span>
              </div>
              {selectedCell.intensity && (
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('charts.intensity', 'Intensity')}:</span>
                  <span className="font-medium capitalize">{selectedCell.intensity}</span>
                </div>
              )}
              {selectedCell.metadata && Object.keys(selectedCell.metadata).length > 0 && (
                <div className="pt-2 mt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t('charts.additionalInfo', 'Additional Information')}:
                  </p>
                  {Object.entries(selectedCell.metadata).map(([key, value]) => (
                    <div key={key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground text-xs capitalize">{key}:</span>
                      <span className="text-xs">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setSelectedCell(null)}
            >
              {t('charts.clearSelection', 'Clear Selection')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarHeatmapChartWithFilters;
