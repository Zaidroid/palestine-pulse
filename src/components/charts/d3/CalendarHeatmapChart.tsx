/**
 * Calendar Heatmap Chart with D3.js
 * 
 * Features:
 * - Calendar grid with month/week structure
 * - Color scale for intensity values
 * - Tooltips with daily details
 * - Month labels and navigation
 * - RTL calendar layout support
 * - Year/month selection
 * - Zoom to specific date ranges
 * - Animated calendar transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.1, 3.2, 3.3, 8.1, 8.2)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { CalendarData } from '@/types/dashboard-data.types';

/**
 * Props for CalendarHeatmapChart component
 */
export interface CalendarHeatmapChartProps {
  /** Array of calendar data points */
  data: CalendarData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to auto-calculated) */
  height?: number;
  /** Cell size in pixels */
  cellSize?: number;
  /** Color scale for intensity */
  colorScale?: string[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when cell is clicked */
  onCellClick?: (data: CalendarData) => void;
  /** Callback when cell is hovered */
  onCellHover?: (data: CalendarData | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show month labels */
  showMonthLabels?: boolean;
  /** Show day labels (Mon, Tue, etc.) */
  showDayLabels?: boolean;
  /** Selected year (for filtering) */
  selectedYear?: number;
  /** Selected month (0-11, for filtering) */
  selectedMonth?: number;
  /** Callback when year changes */
  onYearChange?: (year: number) => void;
  /** Callback when month changes */
  onMonthChange?: (month: number | null) => void;
}

/**
 * Internal data point structure
 */
interface ProcessedCalendarData {
  date: Date;
  value: number;
  intensity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
}

/**
 * CalendarHeatmapChart Component
 * 
 * A D3-powered calendar heatmap showing daily patterns with color-coded intensity.
 * Supports year/month filtering, RTL layouts, and smooth animations.
 */
export const CalendarHeatmapChart: React.FC<CalendarHeatmapChartProps> = ({
  data,
  width: propWidth,
  height: propHeight,
  cellSize = 17,
  colorScale,
  animated = true,
  interactive = true,
  onCellClick,
  onCellHover,
  valueFormatter,
  showMonthLabels = true,
  showDayLabels = true,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: ProcessedCalendarData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Process and normalize data
  const processedData = useMemo<ProcessedCalendarData[]>(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(d => ({
      date: typeof d.date === 'string' ? new Date(d.date) : d.date,
      value: d.value,
      intensity: d.intensity,
      metadata: d.metadata,
    }));
  }, [data]);

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, ProcessedCalendarData>();
    processedData.forEach(d => {
      const key = d3.timeFormat('%Y-%m-%d')(d.date);
      map.set(key, d);
    });
    return map;
  }, [processedData]);

  // Get available years from data
  const availableYears = useMemo(() => {
    if (processedData.length === 0) return [];
    const years = Array.from(new Set(processedData.map(d => d.date.getFullYear())));
    return years.sort((a, b) => b - a); // Most recent first
  }, [processedData]);

  // Determine current year to display
  const currentYear = selectedYear || availableYears[0] || new Date().getFullYear();

  // Filter data by selected year and month
  const filteredData = useMemo(() => {
    let filtered = processedData.filter(d => d.date.getFullYear() === currentYear);
    
    if (selectedMonth !== undefined && selectedMonth !== null) {
      filtered = filtered.filter(d => d.date.getMonth() === selectedMonth);
    }
    
    return filtered;
  }, [processedData, currentYear, selectedMonth]);

  // Default color scale (low to high intensity)
  const defaultColorScale = useMemo(() => {
    if (colorScale) return colorScale;
    
    if (theme === 'dark') {
      return ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];
    }
    return ['#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'];
  }, [colorScale, theme]);

  // Get color scale function
  const getColorScale = useMemo(() => {
    const values = filteredData.map(d => d.value).filter(v => v > 0);
    if (values.length === 0) return () => defaultColorScale[0];
    
    const maxValue = d3.max(values) as number;
    
    return d3.scaleQuantize<string>()
      .domain([0, maxValue])
      .range(defaultColorScale);
  }, [filteredData, defaultColorScale]);

  // Default value formatter
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const formatValue = valueFormatter || defaultValueFormatter;

  // Month names
  const monthNames = useMemo(() => {
    if (i18n.language === 'ar') {
      return ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }, [i18n.language]);

  // Day names
  const dayNames = useMemo(() => {
    if (i18n.language === 'ar') {
      return ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    }
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }, [i18n.language]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const dayLabelWidth = showDayLabels ? 40 : 0;
    const monthLabelHeight = showMonthLabels ? 20 : 0;
    
    // Calculate number of weeks to display
    let startDate: Date;
    let endDate: Date;
    
    if (selectedMonth !== undefined && selectedMonth !== null) {
      // Show specific month
      startDate = new Date(currentYear, selectedMonth, 1);
      endDate = new Date(currentYear, selectedMonth + 1, 0);
    } else {
      // Show full year
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);
    }

    // Adjust start to beginning of week
    const startDay = startDate.getDay();
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() - startDay);

    // Calculate number of weeks
    const weeks = d3.timeWeeks(startDate, endDate).length + 1;
    
    const width = containerWidth - dayLabelWidth - 40;
    const height = propHeight || (7 * cellSize + monthLabelHeight + 40);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + dayLabelWidth + 40)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${isRTL ? width + 20 : dayLabelWidth + 20},${monthLabelHeight + 20})`);

    // Theme-aware colors
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const emptyColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';

    // Day labels (Mon, Tue, etc.)
    if (showDayLabels) {
      const dayLabels = svg.append('g')
        .attr('class', 'day-labels')
        .selectAll('text')
        .data(d3.range(7))
        .enter()
        .append('text')
        .attr('x', isRTL ? cellSize * weeks + 10 : -10)
        .attr('y', d => d * cellSize + cellSize / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', isRTL ? 'start' : 'end')
        .attr('fill', textColor)
        .attr('font-size', '10px')
        .text(d => dayNames[d]);

      if (animated) {
        dayLabels.attr('opacity', 0)
          .transition()
          .duration(500)
          .attr('opacity', 1);
      }
    }

    // Month labels
    if (showMonthLabels && selectedMonth === undefined) {
      const monthStarts = d3.timeMonths(startDate, endDate);
      
      const monthLabels = svg.append('g')
        .attr('class', 'month-labels')
        .selectAll('text')
        .data(monthStarts)
        .enter()
        .append('text')
        .attr('x', d => {
          const weekIndex = d3.timeWeek.count(startDate, d);
          return isRTL ? (weeks - weekIndex) * cellSize - cellSize / 2 : weekIndex * cellSize + cellSize / 2;
        })
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .text(d => monthNames[d.getMonth()]);

      if (animated) {
        monthLabels.attr('opacity', 0)
          .transition()
          .duration(500)
          .delay(200)
          .attr('opacity', 1);
      }
    }

    // Generate all days in range
    const allDays = d3.timeDays(startDate, d3.timeDay.offset(endDate, 1));

    // Create cells
    const cells = svg.append('g')
      .attr('class', 'cells')
      .selectAll('rect')
      .data(allDays)
      .enter()
      .append('rect')
      .attr('class', 'day-cell')
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('x', d => {
        const weekIndex = d3.timeWeek.count(startDate, d);
        return isRTL ? (weeks - weekIndex - 1) * cellSize + 1 : weekIndex * cellSize + 1;
      })
      .attr('y', d => d.getDay() * cellSize + 1)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('fill', d => {
        const key = d3.timeFormat('%Y-%m-%d')(d);
        const dataPoint = dataMap.get(key);
        
        // Only show cells for current year/month
        if (d.getFullYear() !== currentYear) return 'transparent';
        if (selectedMonth !== undefined && selectedMonth !== null && d.getMonth() !== selectedMonth) {
          return 'transparent';
        }
        
        return dataPoint && dataPoint.value > 0 ? getColorScale(dataPoint.value) : emptyColor;
      })
      .attr('stroke', borderColor)
      .attr('stroke-width', 1)
      .style('cursor', interactive ? 'pointer' : 'default');

    // Animation
    if (animated) {
      cells
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => Math.floor(i / 7) * 20)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1);
    }

    // Interactive effects
    if (interactive) {
      cells
        .on('mouseenter', function(event, d) {
          const key = d3.timeFormat('%Y-%m-%d')(d);
          const dataPoint = dataMap.get(key);
          
          if (!dataPoint) return;

          // Highlight effect
          d3.select(this)
            .attr('stroke', textColor)
            .attr('stroke-width', 2)
            .attr('transform', 'scale(1.1)')
            .style('transform-origin', 'center');

          // Calculate tooltip position
          const rect = (this as SVGRectElement).getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
            data: dataPoint
          });

          if (onCellHover) {
            onCellHover({
              date: d3.timeFormat('%Y-%m-%d')(dataPoint.date),
              value: dataPoint.value,
              intensity: dataPoint.intensity,
              metadata: dataPoint.metadata,
            });
          }
        })
        .on('mouseleave', function(event, d) {
          // Remove highlight
          d3.select(this)
            .attr('stroke', borderColor)
            .attr('stroke-width', 1)
            .attr('transform', 'scale(1)');

          setTooltip(prev => ({ ...prev, visible: false }));

          if (onCellHover) {
            onCellHover(null);
          }
        })
        .on('click', function(event, d) {
          const key = d3.timeFormat('%Y-%m-%d')(d);
          const dataPoint = dataMap.get(key);
          
          if (!dataPoint || !onCellClick) return;
          
          onCellClick({
            date: d3.timeFormat('%Y-%m-%d')(dataPoint.date),
            value: dataPoint.value,
            intensity: dataPoint.intensity,
            metadata: dataPoint.metadata,
          });
        });
    }

  }, [filteredData, dataMap, theme, isRTL, animated, interactive, cellSize, currentYear, selectedMonth, 
      showMonthLabels, showDayLabels, monthNames, dayNames, getColorScale, propWidth, propHeight, 
      onCellClick, onCellHover]);

  // Handle empty data
  if (!processedData || processedData.length === 0) {
    return (
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">{t('charts.noData', 'No data available')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <svg 
        ref={svgRef} 
        className="w-full" 
        role="img"
        aria-label={t('charts.calendarHeatmap', 'Calendar heatmap visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y - 10}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '280px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {d3.timeFormat('%B %d, %Y')(tooltip.data.date)}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: getColorScale(tooltip.data.value) }}
                ></div>
                <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
              </div>
              <span className="font-bold">{formatValue(tooltip.data.value)}</span>
            </div>
            {tooltip.data.intensity && (
              <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.intensity', 'Intensity')}:</span>
                <span className="font-medium capitalize">{tooltip.data.intensity}</span>
              </div>
            )}
            {tooltip.data.metadata && Object.keys(tooltip.data.metadata).length > 0 && (
              <div className="pt-1.5 mt-1.5 border-t border-border/50">
                <span className="text-muted-foreground text-xs">
                  {t('charts.clickForDetails', 'Click for more details')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default CalendarHeatmapChart;
