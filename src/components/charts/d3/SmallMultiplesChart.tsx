/**
 * Small Multiples Chart with D3.js
 * 
 * Features:
 * - Grid of mini charts for regional comparison
 * - Synchronized axes across charts
 * - Tooltips with regional details
 * - Highlighting on hover
 * - RTL grid layout support
 * - Regional filtering
 * - Scale synchronization toggle
 * - Animated chart transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.9, 3.2, 3.3, 3.8, 8.4, 8.5, 8.7)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { TimeSeriesData } from '@/types/dashboard-data.types';

/**
 * Regional data for small multiples
 */
export interface RegionalData {
  region: string;
  data: TimeSeriesData[];
  total?: number;
  metadata?: Record<string, any>;
}

/**
 * Props for SmallMultiplesChart component
 */
export interface SmallMultiplesChartProps {
  /** Array of regional data */
  regions: RegionalData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 600px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Number of columns in the grid */
  columns?: number;
  /** Color for the data lines */
  lineColor?: string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when region is clicked */
  onRegionClick?: (region: RegionalData) => void;
  /** Callback when data point is hovered */
  onDataHover?: (data: { region: string; date: Date; value: number } | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show area fill under lines */
  showArea?: boolean;
  /** Synchronize Y-axis scales across all charts */
  synchronizeScales?: boolean;
  /** Selected regions to display (filters others) */
  selectedRegions?: string[];
  /** Show total labels */
  showTotals?: boolean;
}

/**
 * Internal processed data point
 */
interface ProcessedDataPoint {
  date: Date;
  value: number;
  category?: string;
}

/**
 * Internal processed regional data
 */
interface ProcessedRegionalData {
  region: string;
  data: ProcessedDataPoint[];
  total: number;
  metadata?: Record<string, any>;
}

/**
 * SmallMultiplesChart Component
 * 
 * A D3-powered small multiples visualization showing synchronized regional comparisons.
 * Supports filtering, scale synchronization, and RTL layouts.
 */
export const SmallMultiplesChart: React.FC<SmallMultiplesChartProps> = ({
  regions,
  width: propWidth,
  height: propHeight = 600,
  margin: propMargin,
  columns = 2,
  lineColor,
  animated = true,
  interactive = true,
  onRegionClick,
  onDataHover,
  valueFormatter,
  dateFormatter,
  showGrid = true,
  showArea = true,
  synchronizeScales = true,
  selectedRegions,
  showTotals = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      region: string;
      date: Date;
      value: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Adjust margins
  const margin = useMemo(() => {
    if (propMargin) return propMargin;
    return { top: 60, right: 20, bottom: 40, left: 50 };
  }, [propMargin]);

  // Process and normalize data
  const processedRegions = useMemo<ProcessedRegionalData[]>(() => {
    if (!regions || regions.length === 0) return [];
    
    let processed = regions.map(r => {
      const data = r.data.map(d => ({
        date: typeof d.date === 'string' ? new Date(d.date) : d.date,
        value: d.value,
        category: d.category,
      })).sort((a, b) => a.date.getTime() - b.date.getTime());

      const total = r.total !== undefined ? r.total : d3.sum(data, d => d.value);

      return {
        region: r.region,
        data,
        total,
        metadata: r.metadata,
      };
    });

    // Apply region filter
    if (selectedRegions && selectedRegions.length > 0) {
      processed = processed.filter(r => selectedRegions.includes(r.region));
    }

    return processed;
  }, [regions, selectedRegions]);

  // Default formatters
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const defaultDateFormatter = (date: Date) => {
    return d3.timeFormat('%b %d')(date);
  };

  const formatValue = valueFormatter || defaultValueFormatter;
  const formatDate = dateFormatter || defaultDateFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedRegions.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = propHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    // Calculate small multiple dimensions
    const cols = Math.min(columns, processedRegions.length);
    const rows = Math.ceil(processedRegions.length / cols);
    const chartWidth = width / cols - 20;
    const chartHeight = height / rows - 30;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Theme-aware colors
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const defaultLineColor = lineColor || (theme === 'dark' ? '#60a5fa' : '#3b82f6');
    const areaColor = theme === 'dark' ? 'rgba(96,165,250,0.3)' : 'rgba(59,130,246,0.3)';

    // Determine date extent from all regions
    const allDates = processedRegions.flatMap(r => r.data.map(d => d.date));
    const dateExtent = d3.extent(allDates) as [Date, Date];

    // Determine value extent
    let valueExtent: [number, number];
    if (synchronizeScales) {
      // Use global max for synchronized scales
      const maxValue = d3.max(processedRegions, r => d3.max(r.data, d => d.value)) || 100;
      valueExtent = [0, maxValue];
    } else {
      valueExtent = [0, 100]; // Will be overridden per chart
    }

    // Shared X scale
    const xScale = d3.scaleTime()
      .domain(dateExtent)
      .range(isRTL ? [chartWidth, 0] : [0, chartWidth]);

    // Shared Y scale (if synchronized)
    const globalYScale = d3.scaleLinear()
      .domain(valueExtent)
      .nice()
      .range([chartHeight, 0]);

    // Area and line generators
    const areaGen = d3.area<ProcessedDataPoint>()
      .x(d => xScale(d.date))
      .y0(chartHeight)
      .y1(d => synchronizeScales ? globalYScale(d.value) : 0) // Will be updated per chart
      .curve(d3.curveMonotoneX);

    const lineGen = d3.line<ProcessedDataPoint>()
      .x(d => xScale(d.date))
      .y(d => synchronizeScales ? globalYScale(d.value) : 0) // Will be updated per chart
      .curve(d3.curveMonotoneX);

    // Draw each small multiple
    processedRegions.forEach((region, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = isRTL ? (cols - 1 - col) * (chartWidth + 40) : col * (chartWidth + 40);
      const offsetY = row * (chartHeight + 50);

      const chartGroup = svg.append('g')
        .attr('class', 'small-multiple')
        .attr('data-region', region.region)
        .attr('transform', `translate(${offsetX}, ${offsetY})`);

      // Local Y scale (if not synchronized)
      let yScale = globalYScale;
      if (!synchronizeScales) {
        const localMax = d3.max(region.data, d => d.value) || 100;
        yScale = d3.scaleLinear()
          .domain([0, localMax])
          .nice()
          .range([chartHeight, 0]);

        // Update generators with local scale
        areaGen.y1(d => yScale(d.value));
        lineGen.y(d => yScale(d.value));
      }

      // Background
      chartGroup.append('rect')
        .attr('class', 'chart-background')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .attr('stroke', gridColor)
        .attr('stroke-width', 1)
        .attr('rx', 4);

      // Grid (if enabled)
      if (showGrid) {
        chartGroup.append('g')
          .attr('class', 'grid')
          .attr('opacity', 0.15)
          .call(d3.axisLeft(yScale).ticks(4).tickSize(-chartWidth).tickFormat(() => ''))
          .selectAll('line')
          .attr('stroke', gridColor);
      }

      // Area (if enabled)
      if (showArea) {
        const areaPath = chartGroup.append('path')
          .datum(region.data)
          .attr('class', 'area')
          .attr('fill', areaColor)
          .attr('d', areaGen);

        if (animated) {
          areaPath
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(i * 150)
            .attr('opacity', 1);
        }
      }

      // Line
      const linePath = chartGroup.append('path')
        .datum(region.data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', defaultLineColor)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      if (animated) {
        const lineLength = (linePath.node() as SVGPathElement).getTotalLength();
        linePath
          .attr('stroke-dasharray', `${lineLength} ${lineLength}`)
          .attr('stroke-dashoffset', lineLength)
          .transition()
          .duration(1500)
          .delay(i * 150)
          .attr('stroke-dashoffset', 0);
      }

      // Title
      const titleText = chartGroup.append('text')
        .attr('class', 'chart-title')
        .attr('x', chartWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .text(region.region);

      if (animated) {
        titleText
          .attr('opacity', 0)
          .transition()
          .duration(600)
          .delay(i * 150 + 1500)
          .attr('opacity', 1);
      }

      // Total label (if enabled)
      if (showTotals) {
        const totalLabel = chartGroup.append('text')
          .attr('class', 'total-label')
          .attr('x', isRTL ? 5 : chartWidth - 5)
          .attr('y', 15)
          .attr('text-anchor', isRTL ? 'start' : 'end')
          .attr('fill', textColor)
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .text(`${t('charts.total', 'Total')}: ${formatValue(region.total)}`);

        if (animated) {
          totalLabel
            .attr('opacity', 0)
            .transition()
            .duration(600)
            .delay(i * 150 + 1700)
            .attr('opacity', 0.7);
        }
      }

      // Axes (minimal)
      const xAxis = d3.axisBottom(xScale)
        .ticks(3)
        .tickFormat(d3.timeFormat('%b') as any);

      const xAxisGroup = chartGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis);

      xAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '9px')
        .attr('text-anchor', isRTL ? 'start' : 'middle');

      const yAxis = d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d => d3.format('.0s')(d));

      const yAxisGroup = chartGroup.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

      yAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '9px')
        .attr('text-anchor', isRTL ? 'start' : 'end');

      chartGroup.selectAll('.domain, .tick line')
        .attr('stroke', gridColor)
        .attr('opacity', 0.3);

      // Interactive overlay
      if (interactive) {
        const overlay = chartGroup.append('rect')
          .attr('class', 'interactive-overlay')
          .attr('width', chartWidth)
          .attr('height', chartHeight)
          .attr('fill', 'none')
          .style('pointer-events', 'all')
          .style('cursor', 'crosshair');

        overlay
          .on('mouseenter', function() {
            setHoveredRegion(region.region);
            
            // Highlight this chart
            chartGroup.select('.chart-background')
              .transition()
              .duration(200)
              .attr('stroke-width', 2)
              .attr('stroke', defaultLineColor);

            chartGroup.select('.line')
              .transition()
              .duration(200)
              .attr('stroke-width', 3);
          })
          .on('mousemove', function(event) {
            const [mouseX] = d3.pointer(event);
            const date = xScale.invert(mouseX);
            const bisect = d3.bisector<ProcessedDataPoint, Date>(d => d.date).left;
            const index = bisect(region.data, date);
            const point = region.data[index];

            if (point) {
              const containerRect = containerRef.current!.getBoundingClientRect();
              
              setTooltip({
                visible: true,
                x: margin.left + offsetX + xScale(point.date),
                y: margin.top + offsetY + yScale(point.value),
                data: {
                  region: region.region,
                  date: point.date,
                  value: point.value
                }
              });

              if (onDataHover) {
                onDataHover({
                  region: region.region,
                  date: point.date,
                  value: point.value
                });
              }
            }
          })
          .on('mouseleave', function() {
            setHoveredRegion(null);
            
            // Remove highlight
            chartGroup.select('.chart-background')
              .transition()
              .duration(200)
              .attr('stroke-width', 1)
              .attr('stroke', gridColor);

            chartGroup.select('.line')
              .transition()
              .duration(200)
              .attr('stroke-width', 2);

            setTooltip(prev => ({ ...prev, visible: false }));

            if (onDataHover) {
              onDataHover(null);
            }
          })
          .on('click', function() {
            if (onRegionClick) {
              onRegionClick({
                region: region.region,
                data: region.data.map(d => ({
                  date: d.date.toISOString(),
                  value: d.value,
                  category: d.category,
                })),
                total: region.total,
                metadata: region.metadata,
              });
            }
          });
      }
    });

    // Main title
    const mainTitle = svg.append('text')
      .attr('class', 'main-title')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(t('charts.regionalComparison', 'Regional Comparison'));

    if (animated) {
      mainTitle
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(processedRegions.length * 150 + 2000)
        .attr('opacity', 1);
    }

  }, [processedRegions, theme, isRTL, animated, interactive, lineColor, showGrid, showArea,
      synchronizeScales, showTotals, columns, propWidth, propHeight, margin, formatValue,
      formatDate, onRegionClick, onDataHover, t]);

  // Handle empty data
  if (!processedRegions || processedRegions.length === 0) {
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
        aria-label={t('charts.smallMultiples', 'Small multiples regional comparison visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '220px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.region}</div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.date', 'Date')}:</span>
              <span className="font-medium">{formatDate(tooltip.data.date)}</span>
            </div>
            <div className={`flex justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
              <span className="font-bold">{formatValue(tooltip.data.value)}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {t('charts.clickForDetails', 'Click for more details')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default SmallMultiplesChart;
