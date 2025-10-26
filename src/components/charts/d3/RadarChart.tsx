/**
 * Radar Chart with D3.js
 * 
 * Features:
 * - Multi-axis radar grid
 * - Data polygon with fill
 * - Axis labels and scales
 * - Tooltips with metric details
 * - RTL text positioning support
 * - Multiple polygon overlays for comparison
 * - Animated polygon transitions
 * - Interactive legend
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.6, 3.2, 3.3, 8.5)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { getAllChartColors } from '@/lib/chart-colors';

/**
 * Radar data point for a single metric
 */
export interface RadarDataPoint {
  /** Metric/axis name */
  axis: string;
  /** Value for this metric (0-1 normalized or raw) */
  value: number;
  /** Maximum value for this axis (for normalization) */
  maxValue?: number;
  /** Unit of measurement */
  unit?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Radar series for comparison mode
 */
export interface RadarSeries {
  /** Series name/label */
  name: string;
  /** Data points for this series */
  data: RadarDataPoint[];
  /** Color for this series */
  color?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Props for RadarChart component
 */
export interface RadarChartProps {
  /** Array of data points (single series) or array of series (comparison mode) */
  data: RadarDataPoint[] | RadarSeries[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 400px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Color palette for series */
  colors?: string[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when data point is clicked */
  onDataPointClick?: (data: RadarDataPoint, seriesName?: string) => void;
  /** Callback when data point is hovered */
  onDataPointHover?: (data: RadarDataPoint | null, seriesName?: string) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number, axis: string) => string;
  /** Number of circular grid levels */
  levels?: number;
  /** Maximum value for all axes (if not provided, uses max from data) */
  maxValue?: number;
  /** Radius ratio (0-1, default 0.8) */
  radiusRatio?: number;
  /** Show axis labels */
  showAxisLabels?: boolean;
  /** Show grid circles */
  showGrid?: boolean;
  /** Show legend (for comparison mode) */
  showLegend?: boolean;
  /** Polygon fill opacity */
  fillOpacity?: number;
  /** Polygon stroke width */
  strokeWidth?: number;
  /** Enable comparison mode */
  comparisonMode?: boolean;
}

/**
 * Internal processed data structure
 */
interface ProcessedRadarData {
  axis: string;
  value: number;
  normalizedValue: number;
  maxValue: number;
  unit?: string;
  metadata?: Record<string, any>;
}

/**
 * Internal series structure
 */
interface ProcessedSeries {
  name: string;
  data: ProcessedRadarData[];
  color: string;
  metadata?: Record<string, any>;
}

/**
 * RadarChart Component
 * 
 * A D3-powered radar chart with multi-axis visualization, comparison mode,
 * and smooth animations. Supports RTL layouts and theme switching.
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 400,
  margin: propMargin,
  colors,
  animated = true,
  interactive = true,
  onDataPointClick,
  onDataPointHover,
  valueFormatter,
  levels = 5,
  maxValue: propMaxValue,
  radiusRatio = 0.8,
  showAxisLabels = true,
  showGrid = true,
  showLegend = true,
  fillOpacity = 0.25,
  strokeWidth = 2,
  comparisonMode = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredPoint, setHoveredPoint] = useState<{ axis: string; seriesName?: string } | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: ProcessedRadarData | null;
    seriesName?: string;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Default margin
  const margin = propMargin || { top: 60, right: 60, bottom: 60, left: 60 };

  // Get color palette
  const colorPalette = useMemo(() => {
    if (colors) return colors;
    return getAllChartColors();
  }, [colors]);

  // Determine if data is in comparison mode
  const isComparisonData = useMemo(() => {
    if (!data || data.length === 0) return false;
    return comparisonMode || 'name' in data[0];
  }, [data, comparisonMode]);

  // Process and normalize data
  const processedSeries = useMemo<ProcessedSeries[]>(() => {
    if (!data || data.length === 0) return [];

    let series: ProcessedSeries[];

    if (isComparisonData) {
      // Multiple series for comparison
      const seriesData = data as RadarSeries[];
      
      // Get all unique axes
      const allAxes = Array.from(
        new Set(seriesData.flatMap(s => s.data.map(d => d.axis)))
      );

      // Find global max value
      const globalMax = propMaxValue || d3.max(
        seriesData.flatMap(s => s.data.map(d => d.maxValue || d.value))
      ) || 100;

      series = seriesData.map((s, i) => {
        // Ensure all axes are present in each series
        const dataMap = new Map(s.data.map(d => [d.axis, d]));
        const completeData = allAxes.map(axis => {
          const point = dataMap.get(axis);
          if (point) {
            const max = point.maxValue || globalMax;
            return {
              axis,
              value: point.value,
              normalizedValue: point.value / max,
              maxValue: max,
              unit: point.unit,
              metadata: point.metadata,
            };
          }
          // Fill missing axes with 0
          return {
            axis,
            value: 0,
            normalizedValue: 0,
            maxValue: globalMax,
          };
        });

        return {
          name: s.name,
          data: completeData,
          color: s.color || colorPalette[i % colorPalette.length],
          metadata: s.metadata,
        };
      });
    } else {
      // Single series
      const singleData = data as RadarDataPoint[];
      const globalMax = propMaxValue || d3.max(
        singleData.map(d => d.maxValue || d.value)
      ) || 100;

      const processedData = singleData.map(d => {
        const max = d.maxValue || globalMax;
        return {
          axis: d.axis,
          value: d.value,
          normalizedValue: d.value / max,
          maxValue: max,
          unit: d.unit,
          metadata: d.metadata,
        };
      });

      series = [{
        name: t('charts.data', 'Data'),
        data: processedData,
        color: colorPalette[0],
      }];
    }

    return series;
  }, [data, isComparisonData, propMaxValue, colorPalette, t]);

  // Get all axes
  const axes = useMemo(() => {
    if (processedSeries.length === 0) return [];
    return processedSeries[0].data.map(d => d.axis);
  }, [processedSeries]);

  // Default value formatter
  const defaultValueFormatter = (value: number, axis: string) => {
    const point = processedSeries[0]?.data.find(d => d.axis === axis);
    const unit = point?.unit || '';
    const formatted = value >= 1000 ? d3.format('.2s')(value) : d3.format('.1f')(value);
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const formatValue = valueFormatter || defaultValueFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedSeries.length === 0 || axes.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = propHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const radius = Math.min(width, height) / 2 * radiusRatio;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Theme-aware colors
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const mutedTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

    // Angle scale
    const angleSlice = (Math.PI * 2) / axes.length;

    // Radius scale
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    // Draw circular grid
    if (showGrid) {
      const gridGroup = svg.append('g').attr('class', 'grid');

      // Circular grid lines
      for (let i = 1; i <= levels; i++) {
        const levelRadius = radius * (i / levels);
        
        gridGroup.append('circle')
          .attr('r', levelRadius)
          .attr('fill', 'none')
          .attr('stroke', gridColor)
          .attr('stroke-width', 1)
          .attr('opacity', animated ? 0 : 0.5);

        if (animated) {
          gridGroup.selectAll('circle')
            .transition()
            .duration(800)
            .delay(i * 100)
            .attr('opacity', 0.5);
        }

        // Level labels
        gridGroup.append('text')
          .attr('x', 5)
          .attr('y', -levelRadius)
          .attr('fill', mutedTextColor)
          .attr('font-size', '10px')
          .attr('opacity', animated ? 0 : 0.6)
          .text((i / levels * 100).toFixed(0) + '%');

        if (animated) {
          gridGroup.selectAll('text')
            .transition()
            .duration(800)
            .delay(i * 100)
            .attr('opacity', 0.6);
        }
      }

      // Radial axis lines
      axes.forEach((axis, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        gridGroup.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', gridColor)
          .attr('stroke-width', 1)
          .attr('opacity', animated ? 0 : 0.5);
      });

      if (animated) {
        gridGroup.selectAll('line')
          .transition()
          .duration(800)
          .attr('opacity', 0.5);
      }
    }

    // Draw axis labels
    if (showAxisLabels) {
      const labelGroup = svg.append('g').attr('class', 'axis-labels');

      axes.forEach((axis, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = labelRadius * Math.cos(angle);
        const y = labelRadius * Math.sin(angle);

        // Determine text anchor based on position
        let textAnchor: string;
        if (Math.abs(x) < 10) {
          textAnchor = 'middle';
        } else if (x > 0) {
          textAnchor = isRTL ? 'end' : 'start';
        } else {
          textAnchor = isRTL ? 'start' : 'end';
        }

        const label = labelGroup.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', '0.35em')
          .attr('text-anchor', textAnchor)
          .attr('fill', textColor)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .text(axis);

        if (animated) {
          label
            .attr('opacity', 0)
            .transition()
            .duration(800)
            .delay(1000)
            .attr('opacity', 1);
        }
      });
    }

    // Line generator for radar polygon
    const radarLine = d3.lineRadial<ProcessedRadarData>()
      .angle((d, i) => angleSlice * i)
      .radius(d => rScale(d.normalizedValue))
      .curve(d3.curveLinearClosed);

    // Draw radar polygons for each series
    const polygonGroup = svg.append('g').attr('class', 'polygons');

    processedSeries.forEach((series, seriesIndex) => {
      const seriesGroup = polygonGroup.append('g')
        .attr('class', `series-${seriesIndex}`);

      // Draw polygon area
      const polygon = seriesGroup.append('path')
        .datum(series.data)
        .attr('class', 'radar-area')
        .attr('fill', series.color)
        .attr('fill-opacity', fillOpacity)
        .attr('stroke', series.color)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linejoin', 'round');

      if (animated) {
        // Animate from center
        polygon
          .attr('d', radarLine.radius(0) as any)
          .transition()
          .duration(1200)
          .delay(seriesIndex * 200 + 1200)
          .ease(d3.easeCubicOut)
          .attr('d', radarLine as any);
      } else {
        polygon.attr('d', radarLine as any);
      }

      // Draw data points
      if (interactive) {
        const points = seriesGroup.selectAll('.data-point')
          .data(series.data)
          .enter()
          .append('circle')
          .attr('class', 'data-point')
          .attr('cx', (d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return rScale(d.normalizedValue) * Math.cos(angle);
          })
          .attr('cy', (d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return rScale(d.normalizedValue) * Math.sin(angle);
          })
          .attr('r', 0)
          .attr('fill', series.color)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer');

        if (animated) {
          points
            .transition()
            .duration(600)
            .delay((d, i) => seriesIndex * 200 + 1200 + i * 50)
            .attr('r', 5);
        } else {
          points.attr('r', 5);
        }

        // Interactive effects
        points
          .on('mouseenter', function(event, d) {
            // Clear any pending hide timeout
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current);
              tooltipTimeoutRef.current = null;
            }
            
            const point = d3.select(this);
            
            // Enlarge point
            point
              .transition()
              .duration(200)
              .attr('r', 8);

            setHoveredPoint({ axis: d.axis, seriesName: series.name });

            // Calculate tooltip position
            const rect = (this as SVGCircleElement).getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            
            setTooltip({
              visible: true,
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top,
              data: d,
              seriesName: series.name
            });

            if (onDataPointHover) {
              onDataPointHover({
                axis: d.axis,
                value: d.value,
                maxValue: d.maxValue,
                unit: d.unit,
                metadata: d.metadata,
              }, series.name);
            }
          })
          .on('mouseleave', function(event, d) {
            const point = d3.select(this);
            
            // Restore point size
            point
              .transition()
              .duration(200)
              .attr('r', 5);

            setHoveredPoint(null);
            
            // Delay hiding tooltip to prevent flickering
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = setTimeout(() => {
              setTooltip(prev => ({ ...prev, visible: false }));
            }, 100);

            if (onDataPointHover) {
              onDataPointHover(null);
            }
          })
          .on('click', function(event, d) {
            if (onDataPointClick) {
              onDataPointClick({
                axis: d.axis,
                value: d.value,
                maxValue: d.maxValue,
                unit: d.unit,
                metadata: d.metadata,
              }, series.name);
            }
          });
      }
    });

    // Legend (for comparison mode)
    if (showLegend && processedSeries.length > 1) {
      const legendX = isRTL ? -radius - 80 : radius + 40;
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, ${-radius + 20})`);

      processedSeries.forEach((series, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 28})`)
          .attr('opacity', 0)
          .style('cursor', interactive ? 'pointer' : 'default');

        // Color indicator
        legendRow.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('rx', 3)
          .attr('fill', series.color)
          .attr('fill-opacity', fillOpacity)
          .attr('stroke', series.color)
          .attr('stroke-width', strokeWidth)
          .attr('x', isRTL ? 82 : 0);

        // Series name
        legendRow.append('text')
          .attr('x', isRTL ? 76 : 26)
          .attr('y', 13)
          .attr('fill', textColor)
          .attr('font-size', '12px')
          .attr('text-anchor', isRTL ? 'end' : 'start')
          .text(series.name);

        // Animate legend
        if (animated) {
          legendRow
            .transition()
            .duration(500)
            .delay(2000 + i * 100)
            .attr('opacity', 1);
        } else {
          legendRow.attr('opacity', 1);
        }

        // Interactive legend
        if (interactive) {
          legendRow
            .on('mouseenter', function() {
              // Highlight corresponding polygon
              polygonGroup.selectAll(`.series-${i} .radar-area`)
                .transition()
                .duration(200)
                .attr('fill-opacity', fillOpacity * 2)
                .attr('stroke-width', strokeWidth + 1);

              // Dim other polygons
              processedSeries.forEach((_, j) => {
                if (j !== i) {
                  polygonGroup.selectAll(`.series-${j} .radar-area`)
                    .transition()
                    .duration(200)
                    .attr('fill-opacity', fillOpacity * 0.3)
                    .attr('stroke-opacity', 0.3);
                }
              });
            })
            .on('mouseleave', function() {
              // Restore all polygons
              processedSeries.forEach((_, j) => {
                polygonGroup.selectAll(`.series-${j} .radar-area`)
                  .transition()
                  .duration(200)
                  .attr('fill-opacity', fillOpacity)
                  .attr('stroke-opacity', 1)
                  .attr('stroke-width', strokeWidth);
              });
            });
        }
      });
    }

  }, [processedSeries, axes, theme, isRTL, animated, interactive, levels, radiusRatio, 
      showAxisLabels, showGrid, showLegend, fillOpacity, strokeWidth, propWidth, propHeight, 
      margin, formatValue, onDataPointClick, onDataPointHover, t]);

  // Handle empty data
  if (!processedSeries || processedSeries.length === 0 || axes.length === 0) {
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
        aria-label={t('charts.radarChart', 'Radar chart visualization')}
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
          {tooltip.seriesName && processedSeries.length > 1 && (
            <div className="font-semibold mb-2 text-xs text-primary">
              {tooltip.seriesName}
            </div>
          )}
          <div className="font-semibold mb-2 text-sm">
            {tooltip.data.axis}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
              <span className="font-bold">{formatValue(tooltip.data.value, tooltip.data.axis)}</span>
            </div>
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.percentage', 'Percentage')}:</span>
              <span className="font-medium">{(tooltip.data.normalizedValue * 100).toFixed(1)}%</span>
            </div>
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
export default RadarChart;
