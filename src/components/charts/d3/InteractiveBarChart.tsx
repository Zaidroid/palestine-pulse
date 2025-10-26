/**
 * Interactive Bar Chart with D3.js
 * 
 * Features:
 * - Horizontal and vertical bar layouts
 * - Hover interactions with visual feedback
 * - Animated bar transitions
 * - Click handlers for drill-down
 * - RTL layout support for horizontal bars
 * - Category filtering and sorting
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.3, 3.2, 3.3, 3.8, 8.4, 8.5)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { CategoryData } from '@/types/dashboard-data.types';
import { chartColorPalette, getAllChartColors } from '@/lib/chart-colors';

/**
 * Props for InteractiveBarChart component
 */
export interface InteractiveBarChartProps {
  /** Array of category data points */
  data: CategoryData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 400px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Color palette for bars */
  colors?: string[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when bar is clicked */
  onBarClick?: (data: CategoryData) => void;
  /** Callback when bar is hovered */
  onBarHover?: (data: CategoryData | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show value labels on bars */
  showValueLabels?: boolean;
  /** Sort order */
  sortBy?: 'value' | 'category' | 'none';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Maximum number of bars to display */
  maxBars?: number;
  /** Bar padding (0-1) */
  barPadding?: number;
}

/**
 * Internal data point structure
 */
interface DataPoint {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
  metadata?: any;
}

/**
 * InteractiveBarChart Component
 * 
 * A D3-powered bar chart with smooth animations, hover effects, and click interactions.
 * Supports both vertical and horizontal orientations with RTL layout support.
 */
export const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 400,
  margin: propMargin,
  orientation = 'vertical',
  colors,
  animated = true,
  interactive = true,
  onBarClick,
  onBarHover,
  valueFormatter,
  showGrid = true,
  showValueLabels = false,
  sortBy = 'none',
  sortOrder = 'desc',
  maxBars,
  barPadding = 0.2,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: DataPoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Adjust margins based on orientation and RTL
  const margin = useMemo(() => {
    if (propMargin) return propMargin;
    
    if (orientation === 'horizontal') {
      return isRTL 
        ? { top: 20, right: 60, bottom: 40, left: 120 }
        : { top: 20, right: 120, bottom: 40, left: 60 };
    }
    return { top: 20, right: 30, bottom: 60, left: 60 };
  }, [propMargin, orientation, isRTL]);

  // Process and normalize data
  const processedData = useMemo<DataPoint[]>(() => {
    if (!data || data.length === 0) return [];
    
    let processed = data.map(d => ({
      category: d.category,
      value: d.value,
      percentage: d.percentage,
      color: d.color,
      metadata: d.metadata,
    }));

    // Apply sorting
    if (sortBy === 'value') {
      processed.sort((a, b) => 
        sortOrder === 'asc' ? a.value - b.value : b.value - a.value
      );
    } else if (sortBy === 'category') {
      processed.sort((a, b) => 
        sortOrder === 'asc' 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
      );
    }

    // Apply max bars limit
    if (maxBars && processed.length > maxBars) {
      processed = processed.slice(0, maxBars);
    }

    return processed;
  }, [data, sortBy, sortOrder, maxBars]);

  // Get color palette
  const colorPalette = useMemo(() => {
    if (colors) return colors;
    return getAllChartColors();
  }, [colors]);

  // Default value formatter
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const formatValue = valueFormatter || defaultValueFormatter;

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

    // Theme-aware colors
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';

    // Scales
    let xScale: any;
    let yScale: any;

    if (orientation === 'vertical') {
      // Vertical bars
      xScale = d3.scaleBand()
        .domain(processedData.map(d => d.category))
        .range(isRTL ? [width, 0] : [0, width])
        .padding(barPadding);

      yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value) as number])
        .nice()
        .range([height, 0]);
    } else {
      // Horizontal bars
      xScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value) as number])
        .nice()
        .range(isRTL ? [width, 0] : [0, width]);

      yScale = d3.scaleBand()
        .domain(processedData.map(d => d.category))
        .range([0, height])
        .padding(barPadding);
    }

    // Grid (if enabled)
    if (showGrid) {
      if (orientation === 'vertical') {
        svg.append('g')
          .attr('class', 'grid')
          .attr('opacity', 0.15)
          .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
          .selectAll('line')
          .attr('stroke', gridColor);
      } else {
        svg.append('g')
          .attr('class', 'grid')
          .attr('opacity', 0.15)
          .call(d3.axisBottom(xScale).tickSize(height).tickFormat(() => ''))
          .selectAll('line')
          .attr('stroke', gridColor);
      }
    }

    // Bars
    const bars = svg.selectAll('.bar')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', (d, i) => d.color || colorPalette[i % colorPalette.length])
      .attr('stroke', 'none')
      .style('cursor', interactive ? 'pointer' : 'default')
      .style('transition', 'all 0.3s ease');

    if (orientation === 'vertical') {
      bars
        .attr('x', d => xScale(d.category) as number)
        .attr('width', xScale.bandwidth())
        .attr('y', height)
        .attr('height', 0);

      if (animated) {
        bars
          .transition()
          .duration(800)
          .delay((d, i) => i * 50)
          .ease(d3.easeCubicOut)
          .attr('y', d => yScale(d.value))
          .attr('height', d => height - yScale(d.value));
      } else {
        bars
          .attr('y', d => yScale(d.value))
          .attr('height', d => height - yScale(d.value));
      }
    } else {
      bars
        .attr('y', d => yScale(d.category) as number)
        .attr('height', yScale.bandwidth())
        .attr('x', isRTL ? width : 0)
        .attr('width', 0);

      if (animated) {
        bars
          .transition()
          .duration(800)
          .delay((d, i) => i * 50)
          .ease(d3.easeCubicOut)
          .attr('x', d => isRTL ? xScale(d.value) : 0)
          .attr('width', d => isRTL ? width - xScale(d.value) : xScale(d.value));
      } else {
        bars
          .attr('x', d => isRTL ? xScale(d.value) : 0)
          .attr('width', d => isRTL ? width - xScale(d.value) : xScale(d.value));
      }
    }

    // Interactive effects
    if (interactive) {
      bars
        .on('mouseenter', function(event, d) {
          const bar = d3.select(this);
          
          // Highlight effect
          bar
            .attr('opacity', 0.8)
            .attr('stroke', textColor)
            .attr('stroke-width', 2);

          setHoveredBar(d.category);

          // Calculate tooltip position
          const rect = (this as SVGRectElement).getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
            data: d
          });

          if (onBarHover) {
            onBarHover({
              category: d.category,
              value: d.value,
              percentage: d.percentage,
              color: d.color,
              metadata: d.metadata,
            });
          }
        })
        .on('mouseleave', function(event, d) {
          const bar = d3.select(this);
          
          // Remove highlight
          bar
            .attr('opacity', 1)
            .attr('stroke', 'none');

          setHoveredBar(null);
          setTooltip(prev => ({ ...prev, visible: false }));

          if (onBarHover) {
            onBarHover(null);
          }
        })
        .on('click', function(event, d) {
          if (onBarClick) {
            onBarClick({
              category: d.category,
              value: d.value,
              percentage: d.percentage,
              color: d.color,
              metadata: d.metadata,
            });
          }
        });
    }

    // Value labels (if enabled)
    if (showValueLabels) {
      const labels = svg.selectAll('.value-label')
        .data(processedData)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('fill', textColor)
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .text(d => formatValue(d.value));

      if (orientation === 'vertical') {
        labels
          .attr('x', d => (xScale(d.category) as number) + xScale.bandwidth() / 2)
          .attr('y', d => yScale(d.value) - 5)
          .attr('text-anchor', 'middle');
      } else {
        labels
          .attr('x', d => isRTL ? xScale(d.value) - 5 : xScale(d.value) + 5)
          .attr('y', d => (yScale(d.category) as number) + yScale.bandwidth() / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', isRTL ? 'end' : 'start');
      }

      if (animated) {
        labels.attr('opacity', 0)
          .transition()
          .duration(800)
          .delay((d, i) => i * 50 + 400)
          .attr('opacity', 1);
      }
    }

    // Axes
    if (orientation === 'vertical') {
      // X-axis (categories)
      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      xAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '11px')
        .attr('text-anchor', isRTL ? 'start' : 'end')
        .attr('transform', 'rotate(-45)')
        .attr('dx', isRTL ? '0.5em' : '-0.5em')
        .attr('dy', '0.5em');

      // Y-axis (values)
      const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d => formatValue(d as number));

      const yAxisGroup = svg.append('g').call(yAxis);

      yAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '11px')
        .attr('text-anchor', isRTL ? 'start' : 'end');
    } else {
      // X-axis (values)
      const xAxis = d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d => formatValue(d as number));

      const xAxisGroup = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      xAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '11px');

      // Y-axis (categories)
      const yAxis = d3.axisLeft(yScale);
      const yAxisGroup = svg.append('g')
        .attr('transform', isRTL ? `translate(${width},0)` : 'translate(0,0)')
        .call(isRTL ? d3.axisRight(yScale) : yAxis);

      yAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '11px')
        .attr('text-anchor', isRTL ? 'start' : 'end');
    }

    svg.selectAll('.domain, .tick line').attr('stroke', gridColor);

  }, [processedData, theme, isRTL, animated, interactive, orientation, colorPalette, showGrid, showValueLabels, propWidth, propHeight, margin, formatValue, barPadding, onBarClick, onBarHover]);

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
        aria-label={t('charts.barChart', 'Bar chart visualization')}
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
            {tooltip.data.category}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: tooltip.data.color || colorPalette[0] }}
                ></div>
                <span className="text-muted-foreground">{tooltip.data.category || t('charts.value', 'Value')}:</span>
              </div>
              <span className="font-bold">{formatValue(tooltip.data.value)}</span>
            </div>
            {tooltip.data.percentage !== undefined && (
              <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.percentage', 'Percentage')}:</span>
                <span className="font-medium">{tooltip.data.percentage.toFixed(1)}%</span>
              </div>
            )}
            {tooltip.data.metadata && Object.keys(tooltip.data.metadata).length > 0 && (
              <div className="pt-1.5 mt-1.5 border-t border-border/50 space-y-1">
                {tooltip.data.metadata.killed !== undefined && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Killed:</span>
                    <span className="font-medium text-destructive">{formatValue(tooltip.data.metadata.killed)} ({tooltip.data.metadata.killedPercentage}%)</span>
                  </div>
                )}
                {tooltip.data.metadata.injured !== undefined && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Injured:</span>
                    <span className="font-medium text-warning">{formatValue(tooltip.data.metadata.injured)} ({tooltip.data.metadata.injuredPercentage}%)</span>
                  </div>
                )}
                {tooltip.data.metadata.residential !== undefined && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Residential:</span>
                    <span className="font-medium text-destructive">{formatValue(tooltip.data.metadata.residential)} ({tooltip.data.metadata.residentialPercentage}%)</span>
                  </div>
                )}
                {tooltip.data.metadata.schools !== undefined && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Schools:</span>
                    <span className="font-medium text-warning">{formatValue(tooltip.data.metadata.schools)} ({tooltip.data.metadata.schoolsPercentage}%)</span>
                  </div>
                )}
                {tooltip.data.metadata.hospitals !== undefined && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Hospitals:</span>
                    <span className="font-medium text-primary">{formatValue(tooltip.data.metadata.hospitals)} ({tooltip.data.metadata.hospitalsPercentage}%)</span>
                  </div>
                )}
                {tooltip.data.metadata.ageRange && (
                  <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">Age Range:</span>
                    <span className="font-medium">{tooltip.data.metadata.ageRange}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default InteractiveBarChart;
