/**
 * Animated Area Chart with D3.js
 * 
 * Features:
 * - Smooth area path with gradient fills
 * - Animated transitions on data updates
 * - Theme-aware colors
 * - Smart tooltips with data insights
 * - RTL layout support
 * - Time-based filtering integration
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.1, 3.2, 3.3, 3.10, 8.1, 8.2, 8.3)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { TimeSeriesData, TimeRange } from '@/types/dashboard-data.types';
import { chartColorPalette, getChartColorWithOpacity } from '@/lib/chart-colors';

/**
 * Props for AnimatedAreaChart component
 */
export interface AnimatedAreaChartProps {
  /** Array of time-series data points */
  data: TimeSeriesData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 400px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Color for the area fill */
  color?: string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Time range filter */
  timeRange?: TimeRange;
  /** Callback when data point is clicked */
  onDataPointClick?: (data: TimeSeriesData) => void;
  /** Callback when data point is hovered */
  onDataPointHover?: (data: TimeSeriesData | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Curve type for the area */
  curveType?: 'linear' | 'monotone' | 'step' | 'basis';
  /** Multiple series data (for stacked areas) */
  series?: Array<{ key: string; color?: string; label?: string }>;
}

/**
 * Internal data point structure
 */
interface DataPoint {
  date: Date;
  value: number;
  category?: string;
  metadata?: any;
}

/**
 * AnimatedAreaChart Component
 * 
 * A D3-powered area chart with smooth animations, gradient fills, and interactive tooltips.
 * Supports theme switching, RTL layouts, and time-based filtering.
 */
export const AnimatedAreaChart: React.FC<AnimatedAreaChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 60 },
  color = chartColorPalette.crisis,
  animated = true,
  interactive = true,
  timeRange = 'all',
  onDataPointClick,
  onDataPointHover,
  valueFormatter,
  dateFormatter,
  showGrid = true,
  curveType = 'monotone',
  series,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onDataPointClickRef = useRef(onDataPointClick);
  const onDataPointHoverRef = useRef(onDataPointHover);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const hasAnimatedRef = useRef<boolean>(false);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Update refs when callbacks change
  useEffect(() => {
    onDataPointClickRef.current = onDataPointClick;
    onDataPointHoverRef.current = onDataPointHover;
  }, [onDataPointClick, onDataPointHover]);
  
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: DataPoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Process and normalize data
  const processedData = useMemo<DataPoint[]>(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(d => ({
      date: d.date instanceof Date ? d.date : new Date(d.date),
      value: d.value,
      category: d.category,
      metadata: d.metadata,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  // Get curve function based on type
  const getCurve = (type: string) => {
    switch (type) {
      case 'linear': return d3.curveLinear;
      case 'step': return d3.curveStep;
      case 'basis': return d3.curveBasis;
      case 'monotone':
      default: return d3.curveMonotoneX;
    }
  };

  // Default formatters
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const defaultDateFormatter = (date: Date) => {
    return d3.timeFormat('%b %d, %Y')(date);
  };

  const formatValue = valueFormatter || defaultValueFormatter;
  const formatDate = dateFormatter || defaultDateFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedData.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = propHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales - adjust for RTL if needed
    const xRange = isRTL ? [width, 0] : [0, width];
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range(xRange);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value) as number])
      .nice()
      .range([height, 0]);

    // Theme-aware colors
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const areaColor = color || chartColorPalette.crisis;

    // Grid (if enabled)
    if (showGrid) {
      svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.15)
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', gridColor);
    }

    // Gradient definition
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', `area-gradient-${Math.random().toString(36).substr(2, 9)}`)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', areaColor)
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', areaColor)
      .attr('stop-opacity', 0.1);

    const gradientId = gradient.attr('id');

    // Area generator
    const area = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(getCurve(curveType));

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(getCurve(curveType));

    // Draw area with animation (only on first render)
    const areaPath = svg.append('path')
      .datum(processedData)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    if (animated && !hasAnimatedRef.current) {
      areaPath
        .attr('opacity', 0)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1);
    }

    // Draw line with animation (only on first render)
    const linePath = svg.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', areaColor)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    if (animated && !hasAnimatedRef.current) {
      const length = (linePath.node() as SVGPathElement).getTotalLength();
      linePath
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
      hasAnimatedRef.current = true;
    }

    // Axes
    const xAxis = d3.axisBottom(x)
      .ticks(8)
      .tickFormat(d3.timeFormat('%b %d') as any);

    const yAxis = d3.axisLeft(y)
      .ticks(6)
      .tickFormat(d => formatValue(d as number));

    // X-axis
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    xAxisGroup.selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '11px')
      .attr('text-anchor', isRTL ? 'start' : 'middle');

    // Y-axis
    const yAxisGroup = svg.append('g')
      .call(yAxis);

    yAxisGroup.selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '11px')
      .attr('text-anchor', isRTL ? 'start' : 'end');

    svg.selectAll('.domain, .tick line').attr('stroke', gridColor);

    // Interactive overlay (if enabled)
    if (interactive) {
      const bisect = d3.bisector<DataPoint, Date>(d => d.date).left;
      const focus = svg.append('g').style('display', 'none');

      // Crosshair line
      focus.append('line')
        .attr('class', 'crosshair-y')
        .attr('stroke', textColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.5);

      // Focus circle
      focus.append('circle')
        .attr('class', 'focus-point')
        .attr('r', 5)
        .attr('fill', areaColor)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Overlay for mouse events
      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', () => {
          focus.style('display', null);
        })
        .on('mouseout', () => {
          focus.style('display', 'none');
          // Delay hiding tooltip to prevent flickering
          if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = setTimeout(() => {
            setTooltip(prev => ({ ...prev, visible: false }));
          }, 100);
          if (onDataPointHoverRef.current) onDataPointHoverRef.current(null);
        })
        .on('mousemove', function(event) {
          // Throttle updates to prevent excessive re-renders
          const now = Date.now();
          if (now - lastUpdateRef.current < 50) return; // Throttle to 20fps
          lastUpdateRef.current = now;
          
          // Clear any pending hide timeout
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
          }
          
          const [mouseX] = d3.pointer(event);
          const x0 = x.invert(mouseX);
          const i = bisect(processedData, x0, 1);
          const d0 = processedData[i - 1];
          const d1 = processedData[i];
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;

          // Update crosshair and focus point
          focus.select('.crosshair-y')
            .attr('x1', x(d.date))
            .attr('x2', x(d.date))
            .attr('y1', 0)
            .attr('y2', height);

          focus.select('.focus-point')
            .attr('cx', x(d.date))
            .attr('cy', y(d.value));

          // Calculate tooltip position (adjust for RTL)
          const tooltipX = isRTL 
            ? margin.left + x(d.date) - 15
            : margin.left + x(d.date) + 15;

          // Update tooltip
          setTooltip({
            visible: true,
            x: tooltipX,
            y: margin.top + 20,
            data: d
          });

          // Call hover callback
          if (onDataPointHoverRef.current) {
            onDataPointHoverRef.current({
              date: d.date.toISOString(),
              value: d.value,
              category: d.category,
              metadata: d.metadata,
            });
          }
        })
        .on('click', function(event) {
          if (!onDataPointClickRef.current) return;
          
          const [mouseX] = d3.pointer(event);
          const x0 = x.invert(mouseX);
          const i = bisect(processedData, x0, 1);
          const d0 = processedData[i - 1];
          const d1 = processedData[i];
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          onDataPointClickRef.current({
            date: d.date.toISOString(),
            value: d.value,
            category: d.category,
            metadata: d.metadata,
          });
        });
    }

  }, [processedData, theme, isRTL, animated, interactive, color, showGrid, curveType, propWidth, propHeight, margin, formatValue, formatDate]);

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
        aria-label={t('charts.areaChart', 'Area chart visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            maxWidth: '280px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {formatDate(tooltip.data.date)}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-muted-foreground">{tooltip.data.category || t('charts.value', 'Value')}:</span>
              </div>
              <span className="font-bold">{formatValue(tooltip.data.value)}</span>
            </div>
            {tooltip.data.metadata && Object.keys(tooltip.data.metadata).length > 0 && (
              <div className="pt-1.5 mt-1.5 border-t border-border/50">
                <span className="text-muted-foreground text-xs">
                  {t('charts.additionalInfo', 'Additional information available')}
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
export default AnimatedAreaChart;
