/**
 * Infrastructure Damage Chart - D3.js
 * Interactive bar chart showing infrastructure destruction
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface InfrastructureData {
  category: string;
  destroyed: number;
  total: number;
}

export const InfrastructureDamageChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const data: InfrastructureData[] = [
      { category: 'Hospitals', destroyed: 36, total: 36 },
      { category: 'Schools', destroyed: 352, total: 450 },
      { category: 'Mosques', destroyed: 227, total: 350 },
      { category: 'Homes', destroyed: 12500, total: 45000 },
      { category: 'Water', destroyed: 89, total: 120 },
      { category: 'Power', destroyed: 12, total: 15 },
    ];

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const margin = { top: 40, right: 30, bottom: 80, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Colors
    const destroyedColor = theme === 'dark' ? '#ef4444' : '#dc2626';
    const remainingColor = theme === 'dark' ? 'rgba(100,116,139,0.3)' : 'rgba(148,163,184,0.3)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) as number])
      .nice()
      .range([height, 0]);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', gridColor);

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Draw remaining bars (background)
    svg.selectAll('.bar-remaining')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-remaining')
      .attr('x', d => x(d.category) as number)
      .attr('y', d => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.total))
      .attr('fill', remainingColor)
      .attr('rx', 6);

    // Draw destroyed bars (foreground) with animation
    svg.selectAll('.bar-destroyed')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-destroyed')
      .attr('x', d => x(d.category) as number)
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', destroyedColor)
      .attr('rx', 6)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);

        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-semibold mb-2 text-base">${d.category}</div>
            <div class="text-sm space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Destroyed:</span>
                <span class="text-destructive font-bold">${d.destroyed.toLocaleString()}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Total:</span>
                <span class="font-medium">${d.total.toLocaleString()}</span>
              </div>
              <div class="flex justify-between gap-4 pt-1 border-t border-border/50">
                <span class="text-muted-foreground">Percentage:</span>
                <span class="text-warning font-bold">${((d.destroyed / d.total) * 100).toFixed(1)}%</span>
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
          .attr('stroke-width', 0);

        tooltip.style('opacity', '0');
      })
      .transition()
      .duration(1500)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.destroyed))
      .attr('height', d => height - y(d.destroyed));

    // Add percentage labels on bars
    svg.selectAll('.label-percentage')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label-percentage')
      .attr('x', d => (x(d.category) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.destroyed) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', destroyedColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => `${((d.destroyed / d.total) * 100).toFixed(0)}%`)
      .transition()
      .duration(500)
      .delay((d, i) => 1500 + i * 100)
      .attr('opacity', 1);



    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', textColor)
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickFormat(d => d3.format('.2s')(d))
      )
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px');

    // Axis lines
    svg.selectAll('.domain')
      .attr('stroke', gridColor);

    svg.selectAll('.tick line')
      .attr('stroke', gridColor);

    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Number of Facilities');

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
