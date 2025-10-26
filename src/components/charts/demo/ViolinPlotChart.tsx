/**
 * Violin Plot Chart with D3.js
 * Features: Distribution visualization, interactive quartiles, smooth curves, hover details
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface ViolinData {
  category: string;
  values: number[];
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
}

export const ViolinPlotChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      category: string;
      median: number;
      q1: number;
      q3: number;
      range: string;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Generate violin plot data
    const categories = ['North', 'Central', 'South', 'Coastal'];
    const data: ViolinData[] = categories.map((cat, i) => {
      // Generate distribution data
      const mean = 100 + i * 50;
      const stdDev = 30 + i * 10;
      const values = Array.from({ length: 100 }, () => {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + z * stdDev;
      }).sort((a, b) => a - b);

      return {
        category: cat,
        values,
        median: d3.quantile(values, 0.5) as number,
        q1: d3.quantile(values, 0.25) as number,
        q3: d3.quantile(values, 0.75) as number,
        min: d3.min(values) as number,
        max: d3.max(values) as number
      };
    });

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
      violin: theme === 'dark' ? '#3b82f6' : '#2563eb',
      violinFill: theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.3)',
      median: theme === 'dark' ? '#ef4444' : '#dc2626',
      box: theme === 'dark' ? '#f59e0b' : '#d97706',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };

    // Scales
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.min) as number - 20,
        d3.max(data, d => d.max) as number + 20
      ])
      .nice()
      .range([height, 0]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', colors.grid);

    // Create violin shapes
    data.forEach((d, i) => {
      const violinWidth = x.bandwidth();
      
      // Kernel density estimation
      const kde = kernelDensityEstimator(kernelEpanechnikov(7), y.ticks(50));
      const density = kde(d.values);

      // Scale for violin width
      const xNum = d3.scaleLinear()
        .domain([0, d3.max(density, d => d[1]) as number])
        .range([0, violinWidth / 2]);

      // Create area for violin
      const violinX = x(d.category) as number;
      const area = d3.area<[number, number]>()
        .x0(point => violinX + violinWidth / 2 - xNum(point[1]))
        .x1(point => violinX + violinWidth / 2 + xNum(point[1]))
        .y(point => point[0])
        .curve(d3.curveCatmullRom);

      const violinGroup = svg.append('g')
        .attr('class', 'violin')
        .style('cursor', 'pointer');

      // Draw violin shape
      const violinPath = violinGroup.append('path')
        .datum(density.map(d => [d[0], d[1]] as [number, number]))
        .attr('d', area as any)
        .attr('fill', colors.violinFill)
        .attr('stroke', colors.violin)
        .attr('stroke-width', 2)
        .attr('opacity', 0);

      // Animate violin
      violinPath
        .transition()
        .duration(1200)
        .delay(i * 150)
        .ease(d3.easeCubicOut)
        .attr('opacity', 0.8);

      // Box plot overlay
      const boxWidth = 20;
      const boxX = (x(d.category) as number) + violinWidth / 2 - boxWidth / 2;

      // IQR box
      const box = violinGroup.append('rect')
        .attr('x', boxX)
        .attr('y', y(d.q3))
        .attr('width', boxWidth)
        .attr('height', 0)
        .attr('fill', colors.box)
        .attr('stroke', colors.text)
        .attr('stroke-width', 1.5)
        .attr('rx', 3)
        .attr('opacity', 0);

      box
        .transition()
        .duration(800)
        .delay(i * 150 + 1200)
        .attr('height', y(d.q1) - y(d.q3))
        .attr('opacity', 0.9);

      // Median line
      const medianLine = violinGroup.append('line')
        .attr('x1', boxX)
        .attr('x2', boxX + boxWidth)
        .attr('y1', y(d.median))
        .attr('y2', y(d.median))
        .attr('stroke', colors.median)
        .attr('stroke-width', 3)
        .attr('opacity', 0);

      medianLine
        .transition()
        .duration(600)
        .delay(i * 150 + 2000)
        .attr('opacity', 1);

      // Whiskers
      const whiskerWidth = 12;
      const whiskerX = (x(d.category) as number) + violinWidth / 2;

      // Top whisker
      violinGroup.append('line')
        .attr('x1', whiskerX)
        .attr('x2', whiskerX)
        .attr('y1', y(d.q3))
        .attr('y2', y(d.q3))
        .attr('stroke', colors.text)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(i * 150 + 2200)
        .attr('y2', y(d.max))
        .attr('opacity', 0.7);

      violinGroup.append('line')
        .attr('x1', whiskerX - whiskerWidth / 2)
        .attr('x2', whiskerX + whiskerWidth / 2)
        .attr('y1', y(d.max))
        .attr('y2', y(d.max))
        .attr('stroke', colors.text)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(i * 150 + 2400)
        .attr('opacity', 0.7);

      // Bottom whisker
      violinGroup.append('line')
        .attr('x1', whiskerX)
        .attr('x2', whiskerX)
        .attr('y1', y(d.q1))
        .attr('y2', y(d.q1))
        .attr('stroke', colors.text)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(i * 150 + 2200)
        .attr('y2', y(d.min))
        .attr('opacity', 0.7);

      violinGroup.append('line')
        .attr('x1', whiskerX - whiskerWidth / 2)
        .attr('x2', whiskerX + whiskerWidth / 2)
        .attr('y1', y(d.min))
        .attr('y2', y(d.min))
        .attr('stroke', colors.text)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(i * 150 + 2400)
        .attr('opacity', 0.7);

      // Interaction
      violinGroup
        .on('mouseover', function() {
          d3.select(this).select('path')
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke-width', 3);

          setTooltip({
            visible: true,
            x: (x(d.category) as number) + violinWidth / 2,
            y: y(d.median),
            data: {
              category: d.category,
              median: d.median,
              q1: d.q1,
              q3: d.q3,
              range: `${d.min.toFixed(0)} - ${d.max.toFixed(0)}`
            }
          });
        })
        .on('mouseout', function() {
          d3.select(this).select('path')
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke-width', 2);

          setTooltip(prev => ({ ...prev, visible: false }));
        });
    });

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '12px')
      .style('font-weight', '500');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(8).tickFormat(d => d3.format('.0f')(d)))
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
      .style('font-size', '13px')
      .style('font-weight', '600')
      .text('Casualty Count Distribution');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Regional Casualty Distribution')
      .transition()
      .duration(800)
      .delay(3000)
      .attr('opacity', 1);

    // Helper function for kernel density estimation
    function kernelDensityEstimator(kernel: (v: number) => number, X: number[]) {
      return function(V: number[]) {
        return X.map(x => [x, d3.mean(V, v => kernel(x - v)) as number]);
      };
    }

    function kernelEpanechnikov(k: number) {
      return function(v: number) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }

  }, [theme]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in"
          style={{
            left: `${tooltip.x + 20}px`,
            top: `${tooltip.y}px`,
            transform: 'translateY(-50%)',
            maxWidth: '260px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.category} Region</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Median:</span>
              <span className="font-bold text-destructive">{tooltip.data.median.toFixed(0)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Q1 - Q3:</span>
              <span className="font-medium">{tooltip.data.q1.toFixed(0)} - {tooltip.data.q3.toFixed(0)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Range:</span>
              <span className="font-medium">{tooltip.data.range}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                Distribution shows casualty patterns across the region
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
