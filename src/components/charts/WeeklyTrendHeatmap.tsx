/**
 * Weekly Trend Heatmap - D3.js
 * Interactive heatmap showing casualty intensity by week
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface HeatmapData {
  week: string;
  day: string;
  value: number;
}

export const WeeklyTrendHeatmap = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    // Generate sample data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const data: HeatmapData[] = [];
    weeks.forEach(week => {
      days.forEach(day => {
        data.push({
          week,
          day,
          value: Math.floor(Math.random() * 500) + 100
        });
      });
    });

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const margin = { top: 60, right: 30, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const tooltip = d3.select(tooltipRef.current);

    // Scales
    const x = d3.scaleBand()
      .domain(weeks)
      .range([0, width])
      .padding(0.05);

    const y = d3.scaleBand()
      .domain(days)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.value) as number])
      .interpolator(theme === 'dark' 
        ? d3.interpolateRgb('#1f2937', '#ef4444')
        : d3.interpolateRgb('#fee2e2', '#dc2626')
      );

    // Draw cells
    svg.selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => x(d.week) as number)
      .attr('y', d => y(d.day) as number)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('opacity', 0)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 4)
          .attr('stroke', theme === 'dark' ? '#ffffff' : '#000000');

        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-semibold mb-2">${d.week} - ${d.day}</div>
            <div class="text-sm space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Casualties:</span>
                <span class="text-destructive font-bold">${d.value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Intensity:</span>
                <span class="font-bold">${d.value > 400 ? 'High' : d.value > 250 ? 'Medium' : 'Low'}</span>
              </div>
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('stroke-width', 2)
          .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff');

        tooltip.style('opacity', '0');
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 20)
      .attr('opacity', 0.9);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Remove axis lines
    svg.selectAll('.domain').remove();
    svg.selectAll('.tick line').remove();

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .text('Daily Casualty Intensity by Week');

    // Color legend
    const legendWidth = 200;
    const legendHeight = 10;
    
    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => d3.format('.0f')(d));

    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth}, ${height + 30})`);

    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient');

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
      .style('fill', 'url(#legend-gradient)');

    legend.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px');

    legend.selectAll('.domain, .tick line').remove();

  }, [theme]);

  return (
    <div className="w-full relative">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none opacity-0 transition-opacity duration-200 bg-card border border-border rounded-lg p-3 shadow-xl z-50"
        style={{ maxWidth: '280px' }}
      />
    </div>
  );
};
