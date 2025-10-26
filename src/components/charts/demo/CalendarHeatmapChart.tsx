/**
 * Calendar Heatmap Chart with D3.js
 * Features: Daily casualty visualization in calendar format, year-over-year view, hover details
 * Perfect for: Showing every single day of conflict, revealing patterns
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface CalendarData {
  date: Date;
  value: number;
}

export const CalendarHeatmapChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: CalendarData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Generate calendar data (Oct 7, 2023 - present)
    const startDate = new Date('2023-10-07');
    const endDate = new Date();
    const data: CalendarData[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Simulate daily casualties with realistic patterns
      const dayOfWeek = d.getDay();
      const baseValue = 100 + Math.random() * 200;
      // Lower on weekends (reporting delays)
      const weekendFactor = (dayOfWeek === 5 || dayOfWeek === 6) ? 0.7 : 1;
      // Add some spikes for major escalations
      const spike = Math.random() > 0.95 ? 2 : 1;
      
      data.push({
        date: new Date(d),
        value: Math.floor(baseValue * weekendFactor * spike)
      });
    }

    d3.select(svgRef.current).selectAll('*').remove();

    const cellSize = 18;
    const cellPadding = 3;
    const margin = { top: 50, right: 20, bottom: 30, left: 70 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    
    // Calculate height based on 7 days + spacing
    const calculatedHeight = 7 * (cellSize + cellPadding) + margin.top + margin.bottom + 40;
    const height = calculatedHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      empty: theme === 'dark' ? '#1f2937' : '#f3f4f6'
    };

    // Color scale
    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.value) as number])
      .interpolator(theme === 'dark' 
        ? d3.interpolateRgb('#1f2937', '#ef4444')
        : d3.interpolateRgb('#fee2e2', '#dc2626')
      );

    // Group data by week
    const weeks = d3.groups(data, d => d3.timeWeek.floor(d.date));

    // Day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach((day, i) => {
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * (cellSize + cellPadding) + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', '10px')
        .attr('opacity', 0)
        .text(day)
        .transition()
        .duration(400)
        .delay(i * 50)
        .attr('opacity', 0.7);
    });

    // Month labels
    const months = d3.timeMonths(startDate, endDate);
    months.forEach((month, i) => {
      const weekIndex = weeks.findIndex(([weekStart]) => 
        d3.timeWeek.floor(month).getTime() === weekStart.getTime()
      );
      
      if (weekIndex >= 0) {
        svg.append('text')
          .attr('x', weekIndex * (cellSize + cellPadding))
          .attr('y', -10)
          .attr('fill', colors.text)
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .attr('opacity', 0)
          .text(d3.timeFormat('%b')(month))
          .transition()
          .duration(400)
          .delay(1000 + i * 50)
          .attr('opacity', 1);
      }
    });

    // Draw cells
    weeks.forEach(([weekStart, weekData], weekIndex) => {
      weekData.forEach(d => {
        const dayOfWeek = d.date.getDay();
        
        const cell = svg.append('rect')
          .attr('x', weekIndex * (cellSize + cellPadding))
          .attr('y', dayOfWeek * (cellSize + cellPadding))
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('rx', 2)
          .attr('fill', colors.empty)
          .attr('stroke', colors.grid)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0)
          .style('cursor', 'pointer');

        // Animate cells
        cell
          .transition()
          .duration(600)
          .delay(weekIndex * 20)
          .attr('opacity', 1)
          .attr('fill', colorScale(d.value));

        // Interaction
        cell
          .on('mouseover', function(event) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 2)
              .attr('stroke', theme === 'dark' ? '#ffffff' : '#000000');

            setTooltip({
              visible: true,
              x: margin.left + weekIndex * (cellSize + cellPadding) + cellSize / 2,
              y: margin.top + dayOfWeek * (cellSize + cellPadding),
              data: d
            });
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 0.5)
              .attr('stroke', colors.grid);

            setTooltip(prev => ({ ...prev, visible: false }));
          });
      });
    });

    // Legend
    const legendWidth = 250;
    const legendHeight = 12;
    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth}, ${height + 15})`);

    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([0, legendWidth]);

    // Gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'calendar-legend-gradient');

    gradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * (d3.max(data, d => d.value) as number)));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('rx', 2)
      .style('fill', 'url(#calendar-legend-gradient)');

    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .attr('fill', colors.text)
      .attr('font-size', '10px')
      .text('0');

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'end')
      .attr('fill', colors.text)
      .attr('font-size', '10px')
      .text(`${Math.round(d3.max(data, d => d.value) as number)} casualties/day`);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Daily Casualties Calendar')
      .transition()
      .duration(800)
      .delay(2000)
      .attr('opacity', 1);

  }, [theme]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '220px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {d3.timeFormat('%B %d, %Y')(tooltip.data.date)}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Casualties:</span>
              <span className="font-bold text-destructive">{tooltip.data.value}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Day:</span>
              <span className="font-medium">{d3.timeFormat('%A')(tooltip.data.date)}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.value > 300 ? 'High casualty day' : 
                 tooltip.data.value > 150 ? 'Moderate casualties' : 
                 'Lower casualties'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
