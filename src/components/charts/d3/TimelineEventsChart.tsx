/**
 * Timeline Events Chart with D3.js
 * 
 * Features:
 * - Time axis with event markers
 * - Event annotations with descriptions
 * - Data line with events overlay
 * - Tooltips with event details
 * - RTL timeline direction support
 * - Event type filters
 * - Date range selection
 * - Animated timeline transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.1, 3.2, 3.3, 8.1, 8.2, 8.4)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { TimeSeriesData, EventData } from '@/types/dashboard-data.types';

/**
 * Props for TimelineEventsChart component
 */
export interface TimelineEventsChartProps {
  /** Array of time-series data points for the main line */
  data: TimeSeriesData[];
  /** Array of event markers to display on timeline */
  events: EventData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 500px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Color for the data line */
  lineColor?: string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when event is clicked */
  onEventClick?: (event: EventData) => void;
  /** Callback when event is hovered */
  onEventHover?: (event: EventData | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show event labels */
  showEventLabels?: boolean;
  /** Event type filter */
  eventTypeFilter?: EventData['type'][];
  /** Date range filter */
  dateRange?: { start: Date; end: Date };
}

/**
 * Internal data point structure
 */
interface ProcessedDataPoint {
  date: Date;
  value: number;
  category?: string;
  metadata?: any;
}

/**
 * Internal event structure
 */
interface ProcessedEvent {
  date: Date;
  title: string;
  description: string;
  type: EventData['type'];
  severity?: EventData['severity'];
  casualties?: number;
  location?: string;
}

/**
 * TimelineEventsChart Component
 * 
 * A D3-powered timeline chart showing data trends with annotated events.
 * Supports event filtering, RTL layouts, and smooth animations.
 */
export const TimelineEventsChart: React.FC<TimelineEventsChartProps> = ({
  data,
  events,
  width: propWidth,
  height: propHeight = 500,
  margin: propMargin,
  lineColor,
  animated = true,
  interactive = true,
  onEventClick,
  onEventHover,
  valueFormatter,
  dateFormatter,
  showGrid = true,
  showEventLabels = true,
  eventTypeFilter,
  dateRange,
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
    data: ProcessedEvent | null;
    type: 'event' | 'data';
  }>({ visible: false, x: 0, y: 0, data: null, type: 'event' });

  // Adjust margins for event annotations
  const margin = useMemo(() => {
    if (propMargin) return propMargin;
    return { top: 80, right: 30, bottom: 60, left: 60 };
  }, [propMargin]);

  // Process and normalize data
  const processedData = useMemo<ProcessedDataPoint[]>(() => {
    if (!data || data.length === 0) return [];
    
    let processed = data.map(d => ({
      date: typeof d.date === 'string' ? new Date(d.date) : d.date,
      value: d.value,
      category: d.category,
      metadata: d.metadata,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Apply date range filter
    if (dateRange) {
      processed = processed.filter(d => 
        d.date >= dateRange.start && d.date <= dateRange.end
      );
    }

    return processed;
  }, [data, dateRange]);

  // Process and filter events
  const processedEvents = useMemo<ProcessedEvent[]>(() => {
    if (!events || events.length === 0) return [];
    
    let processed = events.map(e => ({
      date: typeof e.date === 'string' ? new Date(e.date) : e.date,
      title: e.title,
      description: e.description,
      type: e.type,
      severity: e.severity,
      casualties: e.casualties,
      location: e.location,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Apply event type filter
    if (eventTypeFilter && eventTypeFilter.length > 0) {
      processed = processed.filter(e => eventTypeFilter.includes(e.type));
    }

    // Apply date range filter
    if (dateRange) {
      processed = processed.filter(e => 
        e.date >= dateRange.start && e.date <= dateRange.end
      );
    }

    return processed;
  }, [events, eventTypeFilter, dateRange]);

  // Event type colors
  const eventTypeColors = useMemo(() => {
    const baseColors = {
      ceasefire: '#10b981',
      escalation: '#ef4444',
      humanitarian: '#3b82f6',
      political: '#8b5cf6',
      attack: '#dc2626',
      other: '#6b7280',
    };

    // Adjust for dark theme
    if (theme === 'dark') {
      return {
        ceasefire: '#34d399',
        escalation: '#f87171',
        humanitarian: '#60a5fa',
        political: '#a78bfa',
        attack: '#f87171',
        other: '#9ca3af',
      };
    }

    return baseColors;
  }, [theme]);

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
    if (!svgRef.current || !containerRef.current) return;
    if (processedData.length === 0 && processedEvents.length === 0) return;

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
    const defaultLineColor = lineColor || (theme === 'dark' ? '#60a5fa' : '#3b82f6');

    // Determine date extent from both data and events
    const allDates = [
      ...processedData.map(d => d.date),
      ...processedEvents.map(e => e.date)
    ];
    const dateExtent = d3.extent(allDates) as [Date, Date];

    // Scales
    const xRange = isRTL ? [width, 0] : [0, width];
    const x = d3.scaleTime()
      .domain(dateExtent)
      .range(xRange);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value) || 100])
      .nice()
      .range([height, 0]);

    // Grid (if enabled)
    if (showGrid) {
      svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.15)
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', gridColor);
    }

    // Draw data line if data exists
    if (processedData.length > 0) {
      const line = d3.line<ProcessedDataPoint>()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

      const linePath = svg.append('path')
        .datum(processedData)
        .attr('fill', 'none')
        .attr('stroke', defaultLineColor)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Animate line
      if (animated) {
        const length = (linePath.node() as SVGPathElement).getTotalLength();
        linePath
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
      }
    }

    // Draw event markers
    const eventGroup = svg.append('g').attr('class', 'events');

    const eventMarkers = eventGroup.selectAll('.event-marker')
      .data(processedEvents)
      .enter()
      .append('g')
      .attr('class', 'event-marker')
      .attr('transform', d => `translate(${x(d.date)},0)`)
      .style('cursor', interactive ? 'pointer' : 'default');

    // Event vertical lines
    eventMarkers.append('line')
      .attr('class', 'event-line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', -margin.top + 20)
      .attr('y2', height)
      .attr('stroke', d => eventTypeColors[d.type])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.6);

    // Event circles at top
    const eventCircles = eventMarkers.append('circle')
      .attr('class', 'event-circle')
      .attr('cx', 0)
      .attr('cy', -margin.top + 40)
      .attr('r', 6)
      .attr('fill', d => eventTypeColors[d.type])
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Event labels (if enabled)
    if (showEventLabels) {
      const eventLabels = eventMarkers.append('text')
        .attr('class', 'event-label')
        .attr('x', 0)
        .attr('y', -margin.top + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title);

      if (animated) {
        eventLabels.attr('opacity', 0)
          .transition()
          .duration(800)
          .delay((d, i) => i * 100 + 1000)
          .attr('opacity', 1);
      }
    }

    // Animate event markers
    if (animated) {
      eventMarkers.attr('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 1000)
        .attr('opacity', 1);
    }

    // Interactive effects
    if (interactive) {
      eventMarkers
        .on('mouseenter', function(event, d) {
          // Highlight effect
          d3.select(this).select('.event-circle')
            .transition()
            .duration(200)
            .attr('r', 9)
            .attr('stroke-width', 3);

          d3.select(this).select('.event-line')
            .transition()
            .duration(200)
            .attr('stroke-width', 3)
            .attr('opacity', 1);

          // Calculate tooltip position
          const markerX = x(d.date);
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: margin.left + markerX,
            y: margin.top - 20,
            data: d,
            type: 'event'
          });

          if (onEventHover) {
            onEventHover({
              date: d.date.toISOString(),
              title: d.title,
              description: d.description,
              type: d.type,
              severity: d.severity,
              casualties: d.casualties,
              location: d.location,
            });
          }
        })
        .on('mouseleave', function(event, d) {
          // Remove highlight
          d3.select(this).select('.event-circle')
            .transition()
            .duration(200)
            .attr('r', 6)
            .attr('stroke-width', 2);

          d3.select(this).select('.event-line')
            .transition()
            .duration(200)
            .attr('stroke-width', 2)
            .attr('opacity', 0.6);

          setTooltip(prev => ({ ...prev, visible: false }));

          if (onEventHover) {
            onEventHover(null);
          }
        })
        .on('click', function(event, d) {
          if (onEventClick) {
            onEventClick({
              date: d.date.toISOString(),
              title: d.title,
              description: d.description,
              type: d.type,
              severity: d.severity,
              casualties: d.casualties,
              location: d.location,
            });
          }
        });
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

    // Y-axis (only if data exists)
    if (processedData.length > 0) {
      const yAxisGroup = svg.append('g')
        .call(yAxis);

      yAxisGroup.selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '11px')
        .attr('text-anchor', isRTL ? 'start' : 'end');
    }

    svg.selectAll('.domain, .tick line').attr('stroke', gridColor);

  }, [processedData, processedEvents, theme, isRTL, animated, interactive, lineColor, 
      showGrid, showEventLabels, eventTypeColors, propWidth, propHeight, margin, 
      formatValue, formatDate, onEventClick, onEventHover]);

  // Handle empty data
  if (processedData.length === 0 && processedEvents.length === 0) {
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
        aria-label={t('charts.timelineEvents', 'Timeline with events visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '320px'
          }}
        >
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: eventTypeColors[tooltip.data.type] }}
              ></div>
              <div className="font-semibold text-sm">{tooltip.data.title}</div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {formatDate(tooltip.data.date)}
            </div>

            <div className="text-xs leading-relaxed">
              {tooltip.data.description}
            </div>

            {tooltip.data.location && (
              <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.location', 'Location')}:</span>
                <span className="font-medium">{tooltip.data.location}</span>
              </div>
            )}

            {tooltip.data.casualties !== undefined && tooltip.data.casualties > 0 && (
              <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.casualties', 'Casualties')}:</span>
                <span className="font-bold text-destructive">{formatValue(tooltip.data.casualties)}</span>
              </div>
            )}

            {tooltip.data.severity && (
              <div className={`flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.severity', 'Severity')}:</span>
                <span className={`font-medium capitalize ${
                  tooltip.data.severity === 'critical' ? 'text-destructive' :
                  tooltip.data.severity === 'high' ? 'text-orange-500' :
                  tooltip.data.severity === 'medium' ? 'text-yellow-500' :
                  'text-muted-foreground'
                }`}>
                  {tooltip.data.severity}
                </span>
              </div>
            )}

            <div className="pt-1.5 mt-1.5 border-t border-border/50 text-xs">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${isRTL ? 'ml-auto' : 'mr-auto'}`}
                style={{ 
                  backgroundColor: `${eventTypeColors[tooltip.data.type]}20`,
                  color: eventTypeColors[tooltip.data.type]
                }}
              >
                {tooltip.data.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default TimelineEventsChart;
