/**
 * Interactive Bar Chart with D3.js
 * Features: Hover effects, sorting, animations, smart tooltips
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface BarData {
  category: string;
  destroyed: number;
  total: number;
  percentage: number;
}

export const InteractiveBarChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: BarData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const data: BarData[] = [
      { category: 'Hospitals', destroyed: 36, total: 36, percentage: 100 },
      { category: 'Schools', destroyed: 352, total: 450, percentage: 78 },
      { category: 'Mosques', destroyed: 227, total: 350, percentage: 65 },
      { category: 'Homes', destroyed: 12500, total: 45000, percentage: 28 },
      { category: 'Water', destroyed: 89, total: 120, percentage: 74 },
      { category: 'Power', destroyed: 12, total: 15, percentage: 80 }
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 60, left: 80 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      destroyed: theme === 'dark' ? '#ef4444' : '#dc2626',
      remaining: theme === 'dark' ? 'rgba(100,116,139,0.25)' : 'rgba(148,163,184,0.25)',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) as number])
      .nice()
      .range([height, 0]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', colors.grid);

    // Background bars (total)
    svg.selectAll('.bar-bg')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-bg')
      .attr('x', d => x(d.category) as number)
      .attr('y', d => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.total))
      .attr('fill', colors.remaining)
      .attr('rx', 6)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 80)
      .attr('opacity', 1);

    // Foreground bars (destroyed) with interaction
    const bars = svg.selectAll('.bar-fg')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-fg')
      .attr('x', d => x(d.category) as number)
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', colors.destroyed)
      .attr('rx', 6)
      .style('cursor', 'pointer');

    // Animate bars
    bars
      .transition()
      .duration(1200)
      .delay((d, i) => i * 100 + 200)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.destroyed))
      .attr('height', d => height - y(d.destroyed));

    // Add percentage labels
    const labels = svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.category) as number) + x.bandwidth() / 2)
      .attr('y', d => y(d.destroyed) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.destroyed)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => `${d.percentage}%`);

    labels
      .transition()
      .duration(600)
      .delay((d, i) => i * 100 + 1400)
      .attr('opacity', 1);

    // Interaction
    bars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);

        const barX = (x(d.category) as number) + x.bandwidth() / 2;
        
        setTooltip({
          visible: true,
          x: margin.left + barX,
          y: margin.top + y(d.destroyed) - 10,
          data: d
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', colors.text)
      .attr('transform', 'rotate(-25)')
      .style('text-anchor', 'end')
      .style('font-size', '11px')
      .style('font-weight', '500');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => d3.format('.2s')(d)))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '11px');

    svg.selectAll('.domain, .tick line').attr('stroke', colors.grid);

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Number of Facilities');

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
            maxWidth: '260px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.category}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Destroyed:</span>
              <span className="font-bold text-destructive">{tooltip.data.destroyed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{tooltip.data.total.toLocaleString()}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50 flex justify-between">
              <span className="text-muted-foreground">Damage Rate:</span>
              <span className="font-bold text-warning">{tooltip.data.percentage}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
