/**
 * Casualty Breakdown Chart - D3.js
 * Interactive donut chart showing casualty demographics
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface CasualtyData {
  category: string;
  value: number;
  color: string;
}

export const CasualtyBreakdownChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const data: CasualtyData[] = [
      { category: 'Children', value: 18000, color: '#ef4444' },
      { category: 'Women', value: 13500, color: '#f97316' },
      { category: 'Men', value: 11250, color: '#f59e0b' },
      { category: 'Elderly', value: 2250, color: '#eab308' },
    ];

    const total = d3.sum(data, d => d.value);

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const width = svgRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const tooltip = d3.select(tooltipRef.current);

    // Create pie layout
    const pie = d3.pie<CasualtyData>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<CasualtyData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcHover = d3.arc<d3.PieArcDatum<CasualtyData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius + 10);

    // Draw arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .attr('opacity', 0)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover as any)
          .attr('opacity', 1);

        // Dim other segments
        arcs.selectAll('path')
          .filter(function(p: any) { return p !== d; })
          .transition()
          .duration(200)
          .attr('opacity', 0.3);

        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-semibold mb-2 text-base">${d.data.category}</div>
            <div class="text-sm space-y-2">
              <div class="flex justify-between gap-6">
                <span class="text-muted-foreground">Deaths:</span>
                <span class="font-bold text-destructive">${d.data.value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between gap-6">
                <span class="text-muted-foreground">Percentage:</span>
                <span class="font-bold">${((d.data.value / total) * 100).toFixed(1)}%</span>
              </div>
              <div class="pt-2 border-t border-border/50 flex justify-between">
                <span class="text-muted-foreground">Of Total:</span>
                <span class="font-bold">${total.toLocaleString()}</span>
              </div>
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
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
          .attr('d', arc as any)
          .attr('opacity', 0.9);

        // Restore all segments
        arcs.selectAll('path')
          .transition()
          .duration(200)
          .attr('opacity', 0.9);

        tooltip.style('opacity', '0');
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('opacity', 0.9)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t) as any) as string;
        };
      });

    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => {
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => `${((d.data.value / total) * 100).toFixed(0)}%`)
      .transition()
      .duration(500)
      .delay((d, i) => 1000 + i * 200)
      .attr('opacity', 1);

    // Center text - total
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .attr('fill', textColor)
      .attr('font-size', '32px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(total.toLocaleString())
      .transition()
      .duration(1000)
      .delay(1500)
      .attr('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 15)
      .attr('fill', textColor)
      .attr('font-size', '14px')
      .attr('opacity', 0)
      .text('Total Deaths')
      .transition()
      .duration(1000)
      .delay(1500)
      .attr('opacity', 0.7);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${radius + 40}, ${-radius + 20})`);

    data.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 30})`);

      legendRow.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', d.color)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(2000 + i * 100)
        .attr('opacity', 0.9);

      legendRow.append('text')
        .attr('x', 30)
        .attr('y', 15)
        .attr('fill', textColor)
        .attr('font-size', '13px')
        .attr('opacity', 0)
        .text(d.category)
        .transition()
        .duration(500)
        .delay(2000 + i * 100)
        .attr('opacity', 1);
    });

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
