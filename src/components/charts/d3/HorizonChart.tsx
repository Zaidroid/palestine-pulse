/**
 * Horizon Chart with D3.js
 * 
 * Features:
 * - Horizon bands for compact display
 * - Color bands for positive/negative values
 * - Tooltips with metric details
 * - Metric labels and axes
 * - RTL layout support
 * - Metric selection filtering
 * - Band count adjustment
 * - Animated band transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.6, 3.2, 3.3, 8.4, 8.5)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { getAllChartColors } from '@/lib/chart-colors';

/**
 * Horizon data point for a single metric
 */
export interface HorizonDataPoint {
  /** Date/time for this data point */
  date: Date | string;
  /** Value for this data point */
  value: number;
}

/**
 * Horizon metric series
 */
export interface HorizonMetric {
  /** Metric name/label */
  name: string;
  /** Data points for this metric */
  data: HorizonDataPoint[];
  /** Unit of measurement */
  unit?: string;
  /** Color for positive values */
  positiveColor?: string;
  /** Color for negative values */
  negativeColor?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Props for HorizonChart component
 */
export interface HorizonChartProps {
  /** Array of metrics to display */
  metrics: HorizonMetric[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height per metric band (optional, defaults to 40px) */
  bandHeight?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Number of horizon bands (2-6, default 4) */
  bands?: number;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when data point is clicked */
  onDataPointClick?: (metric: string, data: HorizonDataPoint) => void;
  /** Callback when data point is hovered */
  onDataPointHover?: (metric: string, data: HorizonDataPoint | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number, metric: string) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Show metric labels */
  showLabels?: boolean;
  /** Show axes */
  showAxes?: boolean;
  /** Curve type */
  curveType?: 'linear' | 'monotone' | 'step' | 'basis';
  /** Selected metrics (for filtering) */
  selectedMetrics?: string[];
}

/**
 * Internal processed data structure
 */
interface ProcessedMetric {
  name: string;
  data: Array<{ date: Date; value: number }>;
  unit?: string;
  positiveColor: string;
  negativeColor: string;
  metadata?: Record<string, any>;
}

/**
 * HorizonChart Component
 * 
 * A D3-powered horizon chart that displays multiple time-series metrics in a compact,
 * layered format. Uses color bands to represent positive and negative values efficiently.
 */
export const HorizonChart: React.FC<HorizonChartProps> = ({
  metrics,
  width: propWidth,
  bandHeight = 40,
  margin: propMargin,
  bands = 4,
  animated = true,
  interactive = true,
  onDataPointClick,
  onDataPointHover,
  valueFormatter,
  dateFormatter,
  showLabels = true,
  showAxes = true,
  curveType = 'monotone',
  selectedMetrics,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    metric: string;
    data: { date: Date; value: number } | null;
  }>({ visible: false, x: 0, y: 0, metric: '', data: null });

  // Default margin
  const margin = propMargin || { top: 20, right: 60, bottom: 30, left: showLabels ? 120 : 20 };

  // Clamp bands to valid range
  const numBands = Math.max(2, Math.min(6, bands));

  // Get color palette
  const colorPalette = useMemo(() => getAllChartColors(), []);

  // Default colors for positive/negative
  const defaultPositiveColor = '#10b981'; // green
  const defaultNegativeColor = '#ef4444'; // red

  // Process and normalize data
  const processedMetrics = useMemo<ProcessedMetric[]>(() => {
    if (!metrics || metrics.length === 0) return [];

    let processed = metrics.map((m, i) => {
      const data = m.data
        .map(d => ({
          date: d.date instanceof Date ? d.date : new Date(d.date),
          value: d.value,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      return {
        name: m.name,
        data,
        unit: m.unit,
        positiveColor: m.positiveColor || defaultPositiveColor,
        negativeColor: m.negativeColor || defaultNegativeColor,
        metadata: m.metadata,
      };
    });

    // Filter by selected metrics if provided
    if (selectedMetrics && selectedMetrics.length > 0) {
      processed = processed.filter(m => selectedMetrics.includes(m.name));
    }

    return processed;
  }, [metrics, selectedMetrics, defaultPositiveColor, defaultNegativeColor]);

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
  const defaultValueFormatter = (value: number, metric: string) => {
    const m = processedMetrics.find(pm => pm.name === metric);
    const unit = m?.unit || '';
    const formatted = Math.abs(value) >= 1000 
      ? d3.format('.2s')(value) 
      : d3.format('.1f')(value);
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const defaultDateFormatter = (date: Date) => {
    return d3.timeFormat('%b %d, %Y')(date);
  };

  const formatValue = valueFormatter || defaultValueFormatter;
  const formatDate = dateFormatter || defaultDateFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedMetrics.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const totalHeight = processedMetrics.length * bandHeight + margin.top + margin.bottom;

    if (width <= 0 || bandHeight <= 0) return;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', totalHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Theme-aware colors
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const mutedTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    // Get global date extent
    const allDates = processedMetrics.flatMap(m => m.data.map(d => d.date));
    const dateExtent = d3.extent(allDates) as [Date, Date];

    // X scale (time) - adjust for RTL
    const xRange = isRTL ? [width, 0] : [0, width];
    const xScale = d3.scaleTime()
      .domain(dateExtent)
      .range(xRange);

    // Draw time axis at bottom (if enabled)
    if (showAxes) {
      const xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickFormat(d3.timeFormat('%b %d') as any);

      const xAxisGroup = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${processedMetrics.length * bandHeight})`)
        .call(xAxis);

      xAxisGroup.selectAll('text')
        .attr('fill', mutedTextColor)
        .style('font-size', '10px');

      xAxisGroup.selectAll('.domain, .tick line')
        .attr('stroke', gridColor);
    }

    // Draw each metric as a horizon chart
    processedMetrics.forEach((metric, metricIndex) => {
      const metricGroup = svg.append('g')
        .attr('class', `metric-${metricIndex}`)
        .attr('transform', `translate(0,${metricIndex * bandHeight})`);

      // Get value extent for this metric
      const values = metric.data.map(d => d.value);
      const maxAbsValue = d3.max(values.map(Math.abs)) || 1;

      // Y scale for this metric (maps values to band height)
      const yScale = d3.scaleLinear()
        .domain([0, maxAbsValue])
        .range([0, bandHeight]);

      // Create area generator
      const area = d3.area<{ date: Date; value: number }>()
        .x(d => xScale(d.date))
        .y0(bandHeight)
        .y1(d => {
          const absValue = Math.abs(d.value);
          return bandHeight - yScale(absValue);
        })
        .curve(getCurve(curveType));

      // Separate positive and negative data
      const positiveData = metric.data.map(d => ({
        date: d.date,
        value: Math.max(0, d.value),
      }));

      const negativeData = metric.data.map(d => ({
        date: d.date,
        value: Math.abs(Math.min(0, d.value)),
      }));

      // Create color scales for bands
      const positiveColorScale = d3.scaleLinear<string>()
        .domain([0, maxAbsValue / numBands, maxAbsValue])
        .range(['rgba(255,255,255,0)', metric.positiveColor, metric.positiveColor])
        .interpolate(d3.interpolateRgb);

      const negativeColorScale = d3.scaleLinear<string>()
        .domain([0, maxAbsValue / numBands, maxAbsValue])
        .range(['rgba(255,255,255,0)', metric.negativeColor, metric.negativeColor])
        .interpolate(d3.interpolateRgb);

      // Draw horizon bands for positive values
      for (let band = 0; band < numBands; band++) {
        const bandThreshold = (maxAbsValue / numBands) * band;
        const nextBandThreshold = (maxAbsValue / numBands) * (band + 1);

        // Clip data to this band
        const bandData = positiveData.map(d => ({
          date: d.date,
          value: Math.max(0, Math.min(d.value - bandThreshold, maxAbsValue / numBands)),
        }));

        const bandPath = metricGroup.append('path')
          .datum(bandData)
          .attr('class', `positive-band-${band}`)
          .attr('fill', positiveColorScale(nextBandThreshold))
          .attr('opacity', 0.7 + (band * 0.3 / numBands))
          .attr('d', area);

        if (animated) {
          bandPath
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(metricIndex * 100 + band * 50)
            .ease(d3.easeCubicOut)
            .attr('opacity', 0.7 + (band * 0.3 / numBands));
        }
      }

      // Draw horizon bands for negative values
      for (let band = 0; band < numBands; band++) {
        const bandThreshold = (maxAbsValue / numBands) * band;
        const nextBandThreshold = (maxAbsValue / numBands) * (band + 1);

        // Clip data to this band
        const bandData = negativeData.map(d => ({
          date: d.date,
          value: Math.max(0, Math.min(d.value - bandThreshold, maxAbsValue / numBands)),
        }));

        const bandPath = metricGroup.append('path')
          .datum(bandData)
          .attr('class', `negative-band-${band}`)
          .attr('fill', negativeColorScale(nextBandThreshold))
          .attr('opacity', 0.7 + (band * 0.3 / numBands))
          .attr('d', area);

        if (animated) {
          bandPath
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(metricIndex * 100 + band * 50)
            .ease(d3.easeCubicOut)
            .attr('opacity', 0.7 + (band * 0.3 / numBands));
        }
      }

      // Draw baseline
      metricGroup.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', bandHeight)
        .attr('y2', bandHeight)
        .attr('stroke', gridColor)
        .attr('stroke-width', 1);

      // Metric label (if enabled)
      if (showLabels) {
        const labelX = isRTL ? width + 10 : -10;
        const labelAnchor = isRTL ? 'start' : 'end';

        metricGroup.append('text')
          .attr('x', labelX)
          .attr('y', bandHeight / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', labelAnchor)
          .attr('fill', textColor)
          .attr('font-size', '11px')
          .attr('font-weight', '500')
          .text(metric.name);
      }

      // Interactive overlay (if enabled)
      if (interactive) {
        const bisect = d3.bisector<{ date: Date; value: number }, Date>(d => d.date).left;

        const overlay = metricGroup.append('rect')
          .attr('class', 'overlay')
          .attr('width', width)
          .attr('height', bandHeight)
          .style('fill', 'none')
          .style('pointer-events', 'all')
          .style('cursor', 'crosshair');

        overlay
          .on('mouseenter', () => {
            setHoveredMetric(metric.name);
            // Highlight this metric
            metricGroup.selectAll('path')
              .transition()
              .duration(200)
              .attr('opacity', (d, i, nodes) => {
                const currentOpacity = parseFloat(d3.select(nodes[i]).attr('opacity'));
                return Math.min(1, currentOpacity * 1.3);
              });
          })
          .on('mouseleave', () => {
            setHoveredMetric(null);
            setTooltip(prev => ({ ...prev, visible: false }));
            // Restore opacity for all bands
            for (let band = 0; band < numBands; band++) {
              metricGroup.selectAll(`.positive-band-${band}, .negative-band-${band}`)
                .transition()
                .duration(200)
                .attr('opacity', 0.7 + (band * 0.3 / numBands));
            }

            if (onDataPointHover) {
              onDataPointHover(metric.name, null);
            }
          })
          .on('mousemove', function(event) {
            const [mouseX] = d3.pointer(event);
            const x0 = xScale.invert(mouseX);
            const i = bisect(metric.data, x0, 1);
            const d0 = metric.data[i - 1];
            const d1 = metric.data[i];
            if (!d0 || !d1) return;
            
            const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;

            // Calculate tooltip position
            const rect = (this as SVGRectElement).getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            
            setTooltip({
              visible: true,
              x: rect.left - containerRect.left + (mouseX - xScale(d.date)) + xScale(d.date),
              y: rect.top - containerRect.top + bandHeight / 2,
              metric: metric.name,
              data: d
            });

            if (onDataPointHover) {
              onDataPointHover(metric.name, {
                date: d.date.toISOString(),
                value: d.value,
              });
            }
          })
          .on('click', function(event) {
            if (!onDataPointClick) return;
            
            const [mouseX] = d3.pointer(event);
            const x0 = xScale.invert(mouseX);
            const i = bisect(metric.data, x0, 1);
            const d0 = metric.data[i - 1];
            const d1 = metric.data[i];
            if (!d0 || !d1) return;
            
            const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
            
            onDataPointClick(metric.name, {
              date: d.date.toISOString(),
              value: d.value,
            });
          });
      }
    });

  }, [processedMetrics, theme, isRTL, animated, interactive, numBands, bandHeight, 
      showLabels, showAxes, curveType, propWidth, margin, formatValue, formatDate, 
      onDataPointClick, onDataPointHover]);

  // Handle empty data
  if (!processedMetrics || processedMetrics.length === 0) {
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
        aria-label={t('charts.horizonChart', 'Horizon chart visualization')}
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
          <div className="font-semibold mb-2 text-xs text-primary">
            {tooltip.metric}
          </div>
          <div className="font-semibold mb-2 text-sm">
            {formatDate(tooltip.data.date)}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
              <span className="font-bold">{formatValue(tooltip.data.value, tooltip.metric)}</span>
            </div>
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.trend', 'Trend')}:</span>
              <span className={`font-medium ${tooltip.data.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tooltip.data.value >= 0 ? '↑ ' + t('charts.positive', 'Positive') : '↓ ' + t('charts.negative', 'Negative')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default HorizonChart;
