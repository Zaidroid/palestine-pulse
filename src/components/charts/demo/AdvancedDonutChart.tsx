/**
 * Advanced Donut Chart with D3.js
 * Features: Animated arcs, hover expansion, center stats, smart tooltips
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface DonutData {
  category: string;
  value: number;
  color: string;
}

export const AdvancedDonutChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: DonutData | null;
    percentage: number;
  }>({ visible: false, x: 0, y: 0, data: null, percentage: 0 });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const data: DonutData[] = [
      { category: 'Children', value: 18000, color: '#ef4444' },
      { category: 'Women', value: 13500, color: '#f97316' },
      { category: 'Men', value: 11250, color: '#f59e0b' },
      { category: 'Elderly', value: 2250, color: '#eab308' }
    ];

    const total = d3.sum(data, d => d.value);

    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 50;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const colors = {
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      border: theme === 'dark' ? '#1f2937' : '#ffffff'
    };

    // Arc generators
    const arc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .cornerRadius(4);

    const arcHover = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius + 12)
      .cornerRadius(4);

    const pie = d3.pie<DonutData>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    // Draw arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    const paths = arcs.append('path')
      .attr('fill', d => d.data.color)
      .attr('stroke', colors.border)
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .attr('opacity', 0);

    // Animate arcs
    paths
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150)
      .ease(d3.easeCubicOut)
      .attr('opacity', 0.9)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t) as any) as string;
        };
      });

    // Add percentage labels
    const labels = arcs.append('text')
      .attr('transform', d => {
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => `${((d.data.value / total) * 100).toFixed(0)}%`);

    labels
      .transition()
      .duration(600)
      .delay((d, i) => i * 150 + 1000)
      .attr('opacity', 1);

    // Interaction
    paths
      .on('mouseover', function(event, d) {
        // Expand arc
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeElastic.period(0.4))
          .attr('d', arcHover as any)
          .attr('opacity', 1);

        // Dim others
        arcs.selectAll('path')
          .filter(function(p: any) { return p !== d; })
          .transition()
          .duration(200)
          .attr('opacity', 0.3);

        // Get centroid for tooltip positioning
        const [cx, cy] = arc.centroid(d);
        setTooltip({
          visible: true,
          x: width / 2 + cx + 20,
          y: height / 2 + cy,
          data: d.data,
          percentage: (d.data.value / total) * 100
        });
      })
      .on('mousemove', function(event, d) {
        const [cx, cy] = arc.centroid(d);
        setTooltip(prev => ({
          ...prev,
          x: width / 2 + cx + 20,
          y: height / 2 + cy
        }));
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('d', arc as any)
          .attr('opacity', 0.9);

        arcs.selectAll('path')
          .transition()
          .duration(200)
          .attr('opacity', 0.9);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Center text - total
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -15)
      .attr('fill', colors.text)
      .attr('font-size', '36px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(total.toLocaleString())
      .transition()
      .duration(800)
      .delay(1500)
      .attr('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 15)
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('opacity', 0)
      .text('Total Deaths')
      .transition()
      .duration(800)
      .delay(1500)
      .attr('opacity', 0.7);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${radius + 50}, ${-radius + 30})`);

    data.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 28})`)
        .attr('opacity', 0);

      legendRow.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('rx', 4)
        .attr('fill', d.color);

      legendRow.append('text')
        .attr('x', 26)
        .attr('y', 13)
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .text(d.category);

      legendRow.append('text')
        .attr('x', 26)
        .attr('y', 13)
        .attr('fill', colors.text)
        .attr('font-size', '11px')
        .attr('opacity', 0.6)
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(80, 0)')
        .text(d.value.toLocaleString());

      legendRow
        .transition()
        .duration(500)
        .delay(2000 + i * 100)
        .attr('opacity', 1);
    });

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
            maxWidth: '260px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.category}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Deaths:</span>
              <span className="font-bold text-destructive">{tooltip.data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Percentage:</span>
              <span className="font-bold">{tooltip.percentage.toFixed(1)}%</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.category === 'Children' && 'Victims under 18 years old'}
                {tooltip.data.category === 'Women' && 'Female casualties'}
                {tooltip.data.category === 'Men' && 'Male casualties (18-60)'}
                {tooltip.data.category === 'Elderly' && 'Victims over 60 years old'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
