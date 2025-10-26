/**
 * Displacement Flow Chart - D3.js
 * Clear, interactive stacked bar chart showing displacement by region
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface DisplacementData {
  region: string;
  displaced: number;
  sheltered: number;
  withFamily: number;
  total: number;
}

export const DisplacementFlowChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const data: DisplacementData[] = [
      { region: 'North Gaza', displaced: 650000, sheltered: 390000, withFamily: 260000, total: 650000 },
      { region: 'Gaza City', displaced: 630000, sheltered: 378000, withFamily: 252000, total: 630000 },
      { region: 'Central Gaza', displaced: 400000, sheltered: 240000, withFamily: 160000, total: 400000 },
      { region: 'Khan Younis', displaced: 500000, sheltered: 300000, withFamily: 200000, total: 500000 },
      { region: 'Rafah', displaced: 400000, sheltered: 240000, withFamily: 160000, total: 400000 },
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 60, left: 100 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tooltip = d3.select(tooltipRef.current);

    // Colors
    const colors = {
      sheltered: theme === 'dark' ? '#ef4444' : '#dc2626',
      withFamily: theme === 'dark' ? '#f59e0b' : '#d97706',
    };

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.region))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) as number])
      .nice()
      .range([height, 0]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', gridColor);

    // Stack data
    const stack = d3.stack<DisplacementData>()
      .keys(['sheltered', 'withFamily'])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(data);

    // Draw stacked bars
    const groups = svg.selectAll('.series')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'series')
      .attr('fill', d => colors[d.key as keyof typeof colors]);

    groups.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => x((d.data as DisplacementData).region) as number)
      .attr('y', height)
      .attr('height', 0)
      .attr('width', x.bandwidth())
      .attr('rx', 6)
      .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const parent = this.parentNode as SVGGElement;
        const key = d3.select(parent).datum() as any;
        const keyName = key.key;
        const value = d[1] - d[0];
        
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
            <div class="font-semibold mb-2 text-base">${(d.data as DisplacementData).region}</div>
            <div class="text-sm space-y-2">
              <div class="flex justify-between gap-6">
                <span class="text-muted-foreground">Category:</span>
                <span class="font-bold capitalize">${keyName === 'sheltered' ? 'In Shelters' : 'With Family'}</span>
              </div>
              <div class="flex justify-between gap-6">
                <span class="text-muted-foreground">Count:</span>
                <span class="font-bold text-destructive">${value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between gap-6">
                <span class="text-muted-foreground">Percentage:</span>
                <span class="font-bold">${((value / (d.data as DisplacementData).total) * 100).toFixed(1)}%</span>
              </div>
              <div class="pt-2 border-t border-border/50 flex justify-between">
                <span class="text-muted-foreground">Total Displaced:</span>
                <span class="font-bold">${(d.data as DisplacementData).total.toLocaleString()}</span>
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
          .attr('stroke-width', 2);

        tooltip.style('opacity', '0');
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('opacity', 0.9);

    // Add total labels on top
    svg.selectAll('.total-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'total-label')
      .attr('x', d => (x(d.region) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.total) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => `${(d.total / 1000).toFixed(0)}K`)
      .transition()
      .duration(500)
      .delay((d, i) => 1000 + i * 100)
      .attr('opacity', 1);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', textColor)
      .attr('transform', 'rotate(-20)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', '500');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => d3.format('.2s')(d)))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px');

    svg.selectAll('.domain').attr('stroke', gridColor);
    svg.selectAll('.tick line').attr('stroke', gridColor);

    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -70)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Number of Displaced People');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .text('Displaced Population by Region');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 20)`);

    const legendData = [
      { label: 'In Shelters', color: colors.sheltered },
      { label: 'With Family', color: colors.withFamily },
    ];

    legendData.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('rx', 4)
        .attr('fill', item.color)
        .attr('opacity', 0.9);

      legendRow.append('text')
        .attr('x', 25)
        .attr('y', 13)
        .attr('fill', textColor)
        .attr('font-size', '12px')
        .text(item.label);
    });

  }, [theme]);

  return (
    <div className="w-full relative">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none opacity-0 transition-opacity duration-200 bg-card border border-border rounded-lg p-3 shadow-xl z-50"
        style={{ maxWidth: '300px' }}
      />
    </div>
  );
};
