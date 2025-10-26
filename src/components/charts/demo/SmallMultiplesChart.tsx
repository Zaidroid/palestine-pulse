/**
 * Small Multiples Chart - D3.js
 * Features: Regional comparison, synchronized scales, coordinated tooltips
 * Perfect for: Comparing patterns across regions, identifying disparities
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface RegionData {
  region: string;
  data: Array<{ date: Date; value: number }>;
  total: number;
}

export const SmallMultiplesChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      region: string;
      date: Date;
      value: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const regions = ['North Gaza', 'Gaza City', 'Central', 'Khan Younis', 'Rafah'];
    
    // Generate data for each region
    const regionData: RegionData[] = regions.map((region, regionIndex) => {
      const data = Array.from({ length: 60 }, (_, i) => {
        const baseValue = 50 + regionIndex * 20;
        const trend = i * (2 + regionIndex);
        const noise = Math.random() * 30;
        return {
          date: new Date(2023, 9, 7 + i), // Oct 7 + i days
          value: baseValue + trend + noise
        };
      });
      
      return {
        region,
        data,
        total: d3.sum(data, d => d.value)
      };
    });

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 50, right: 20, bottom: 40, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Calculate small multiple dimensions
    const cols = 2;
    const rows = Math.ceil(regions.length / cols);
    const chartWidth = width / cols - 20;
    const chartHeight = height / rows - 30;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      area: theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.3)',
      line: theme === 'dark' ? '#3b82f6' : '#2563eb',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };

    // Shared scales
    const xScale = d3.scaleTime()
      .domain([
        d3.min(regionData, r => d3.min(r.data, d => d.date)) as Date,
        d3.max(regionData, r => d3.max(r.data, d => d.date)) as Date
      ])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(regionData, r => d3.max(r.data, d => d.value)) as number])
      .nice()
      .range([chartHeight, 0]);

    // Area and line generators
    const areaGen = d3.area<{ date: Date; value: number }>()
      .x(d => xScale(d.date))
      .y0(chartHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const lineGen = d3.line<{ date: Date; value: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw each small multiple
    regionData.forEach((region, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = col * (chartWidth + 40);
      const offsetY = row * (chartHeight + 50);

      const chartGroup = svg.append('g')
        .attr('class', 'small-multiple')
        .attr('transform', `translate(${offsetX}, ${offsetY})`);

      // Background
      chartGroup.append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .attr('stroke', colors.grid)
        .attr('stroke-width', 1)
        .attr('rx', 4);

      // Area
      chartGroup.append('path')
        .datum(region.data)
        .attr('fill', colors.area)
        .attr('d', areaGen)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .delay(i * 150)
        .attr('opacity', 1);

      // Line
      const linePath = chartGroup.append('path')
        .datum(region.data)
        .attr('fill', 'none')
        .attr('stroke', colors.line)
        .attr('stroke-width', 2)
        .attr('d', lineGen);

      const lineLength = (linePath.node() as SVGPathElement).getTotalLength();
      linePath
        .attr('stroke-dasharray', `${lineLength} ${lineLength}`)
        .attr('stroke-dashoffset', lineLength)
        .transition()
        .duration(1500)
        .delay(i * 150)
        .attr('stroke-dashoffset', 0);

      // Title
      chartGroup.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('opacity', 0)
        .text(region.region)
        .transition()
        .duration(600)
        .delay(i * 150 + 1500)
        .attr('opacity', 1);

      // Total label
      chartGroup.append('text')
        .attr('x', chartWidth - 5)
        .attr('y', 15)
        .attr('text-anchor', 'end')
        .attr('fill', colors.text)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text(`Total: ${Math.round(region.total).toLocaleString()}`)
        .transition()
        .duration(600)
        .delay(i * 150 + 1700)
        .attr('opacity', 0.7);

      // Axes (minimal)
      chartGroup.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale).ticks(3).tickFormat(d3.timeFormat('%b') as any))
        .selectAll('text')
        .attr('fill', colors.text)
        .style('font-size', '9px');

      chartGroup.append('g')
        .call(d3.axisLeft(yScale).ticks(4).tickFormat(d => d3.format('.0s')(d)))
        .selectAll('text')
        .attr('fill', colors.text)
        .style('font-size', '9px');

      chartGroup.selectAll('.domain, .tick line').attr('stroke', colors.grid).attr('opacity', 0.3);

      // Interactive overlay
      chartGroup.append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .style('pointer-events', 'all')
        .style('cursor', 'crosshair')
        .on('mousemove', function(event) {
          const [mouseX] = d3.pointer(event);
          const date = xScale.invert(mouseX);
          const bisect = d3.bisector<{ date: Date; value: number }, Date>(d => d.date).left;
          const index = bisect(region.data, date);
          const point = region.data[index];

          if (point) {
            setTooltip({
              visible: true,
              x: margin.left + offsetX + xScale(point.date),
              y: margin.top + offsetY + yScale(point.value),
              data: {
                region: region.region,
                date: point.date,
                value: point.value
              }
            });
          }
        })
        .on('mouseout', () => {
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    });

    // Main title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Regional Casualty Comparison')
      .transition()
      .duration(800)
      .delay(3000)
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
          <div className="font-semibold mb-2 text-sm">{tooltip.data.region}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{d3.timeFormat('%b %d')(tooltip.data.date)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Casualties:</span>
              <span className="font-bold text-destructive">{Math.round(tooltip.data.value)}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                Daily casualties in {tooltip.data.region}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
