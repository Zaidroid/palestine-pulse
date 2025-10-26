/**
 * Stream Graph Chart with D3.js
 * Features: Flowing animations, stacked areas, interactive layers
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface StreamData {
  date: Date;
  [key: string]: number | Date;
}

export const StreamGraphChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    category: string;
    value: number;
    date: Date;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const categories = ['Children', 'Women', 'Men', 'Elderly'];
    const data: StreamData[] = Array.from({ length: 30 }, (_, i) => {
      const point: StreamData = { date: new Date(2024, 0, i + 1) };
      categories.forEach(cat => {
        point[cat] = Math.floor(Math.random() * 100) + 50 + Math.sin(i / 3) * 30;
      });
      return point;
    });

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 30, right: 120, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      Children: theme === 'dark' ? '#ef4444' : '#dc2626',
      Women: theme === 'dark' ? '#f97316' : '#ea580c',
      Men: theme === 'dark' ? '#f59e0b' : '#d97706',
      Elderly: theme === 'dark' ? '#eab308' : '#ca8a04',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    // Stack data
    const stack = d3.stack<StreamData>()
      .keys(categories)
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut);

    const series = stack(data);

    const y = d3.scaleLinear()
      .domain([
        d3.min(series, s => d3.min(s, d => d[0])) as number,
        d3.max(series, s => d3.max(s, d => d[1])) as number
      ])
      .range([height, 0]);

    // Area generator
    const area = d3.area<d3.SeriesPoint<StreamData>>()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveBasis);

    // Draw layers
    const layers = svg.selectAll('.layer')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'layer');

    layers.append('path')
      .attr('class', 'area')
      .attr('fill', d => colors[d.key as keyof typeof colors])
      .attr('d', area)
      .attr('opacity', 0)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        // Dim others
        layers.selectAll('.area')
          .filter(function(p: any) { return p !== d; })
          .transition()
          .duration(200)
          .attr('opacity', 0.3);

        const [mouseX] = d3.pointer(event);
        const date = x.invert(mouseX);
        const bisect = d3.bisector<StreamData, Date>(d => d.date).left;
        const index = bisect(data, date);
        const point = data[index];
        
        if (point) {
          setTooltip({
            visible: true,
            x: margin.left + mouseX + 15,
            y: margin.top + 50,
            category: d.key,
            value: point[d.key] as number,
            date: point.date
          });
        }
      })
      .on('mousemove', function(event, d) {
        const [mouseX] = d3.pointer(event);
        const date = x.invert(mouseX);
        const bisect = d3.bisector<StreamData, Date>(d => d.date).left;
        const index = bisect(data, date);
        const point = data[index];
        
        if (point && tooltip) {
          setTooltip({
            visible: true,
            x: margin.left + mouseX + 15,
            y: margin.top + 50,
            category: d.key,
            value: point[d.key] as number,
            date: point.date
          });
        }
      })
      .on('mouseout', function() {
        layers.selectAll('.area')
          .transition()
          .duration(200)
          .attr('opacity', 0.8);

        setTooltip(null);
      })
      .transition()
      .duration(1500)
      .delay((d, i) => i * 100)
      .ease(d3.easeCubicOut)
      .attr('opacity', 0.8);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '11px');

    svg.selectAll('.domain, .tick line').attr('stroke', colors.grid);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 20)`);

    categories.forEach((cat, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`)
        .attr('opacity', 0);

      legendRow.append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('rx', 3)
        .attr('fill', colors[cat as keyof typeof colors])
        .attr('opacity', 0.8);

      legendRow.append('text')
        .attr('x', 22)
        .attr('y', 12)
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .text(cat);

      legendRow
        .transition()
        .duration(500)
        .delay(1500 + i * 100)
        .attr('opacity', 1);
    });

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Daily Casualty Distribution Over Time')
      .transition()
      .duration(800)
      .delay(2000)
      .attr('opacity', 1);

  }, [theme]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      {tooltip && tooltip.visible && (
        <div
          className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            maxWidth: '240px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.category}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{d3.timeFormat('%b %d')(tooltip.date)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Casualties:</span>
              <span className="font-bold text-destructive">{Math.round(tooltip.value).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
