/**
 * Horizon Chart - D3.js
 * Features: Space-efficient time series, color bands, mirrored visualization, compact display
 * Perfect for: Comparing multiple metrics in limited space, dashboard overviews, dense data
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface HorizonData {
  metric: string;
  data: Array<{ date: Date; value: number }>;
  baseline: number;
}

export const HorizonChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      metric: string;
      date: Date;
      value: number;
      deviation: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Generate data for multiple metrics
    const metrics = [
      'Daily Casualties',
      'Airstrikes',
      'Displaced Persons',
      'Aid Deliveries',
      'Hospital Capacity'
    ];

    const startDate = new Date('2023-10-07');
    const days = 90;

    const horizonData: HorizonData[] = metrics.map((metric, metricIndex) => {
      const baseline = 100 + metricIndex * 20;
      const data = Array.from({ length: days }, (_, i) => {
        const t = i / days;
        // Create varied patterns for each metric
        const wave1 = Math.sin(t * Math.PI * 4 + metricIndex) * 30;
        const wave2 = Math.sin(t * Math.PI * 8 + metricIndex * 2) * 15;
        const trend = (t - 0.5) * 40;
        const noise = (Math.random() - 0.5) * 20;
        
        return {
          date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
          value: baseline + wave1 + wave2 + trend + noise
        };
      });

      return { metric, data, baseline };
    });

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const bandHeight = 50; // Height for each horizon band
    const height = horizonData.length * bandHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      positive: theme === 'dark' 
        ? ['#1e3a8a', '#2563eb', '#60a5fa', '#93c5fd']
        : ['#1e40af', '#3b82f6', '#60a5fa', '#bfdbfe'],
      negative: theme === 'dark'
        ? ['#7f1d1d', '#dc2626', '#f87171', '#fca5a5']
        : ['#991b1b', '#dc2626', '#ef4444', '#fca5a5'],
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      baseline: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
    };

    // Scales
    const x = d3.scaleTime()
      .domain([
        d3.min(horizonData, h => d3.min(h.data, d => d.date)) as Date,
        d3.max(horizonData, h => d3.max(h.data, d => d.date)) as Date
      ])
      .range([0, width]);

    // Number of bands for horizon chart
    const numBands = 4;

    // Create horizon chart for each metric
    horizonData.forEach((horizon, index) => {
      const yOffset = index * bandHeight;

      // Calculate deviation from baseline
      const deviations = horizon.data.map(d => d.value - horizon.baseline);
      const maxDeviation = d3.max(deviations.map(Math.abs)) as number;

      // Scale for the bands
      const y = d3.scaleLinear()
        .domain([0, maxDeviation])
        .range([0, bandHeight]);

      const chartGroup = svg.append('g')
        .attr('class', 'horizon-band')
        .attr('transform', `translate(0, ${yOffset})`);

      // Background
      chartGroup.append('rect')
        .attr('width', width)
        .attr('height', bandHeight)
        .attr('fill', theme === 'dark' ? '#1f2937' : '#f9fafb')
        .attr('stroke', colors.grid)
        .attr('stroke-width', 0.5);

      // Baseline
      chartGroup.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', bandHeight / 2)
        .attr('y2', bandHeight / 2)
        .attr('stroke', colors.baseline)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');

      // Create area generator
      const areaPositive = d3.area<{ date: Date; value: number }>()
        .x(d => x(d.date))
        .y0(bandHeight / 2)
        .y1(d => {
          const deviation = d.value - horizon.baseline;
          return deviation > 0 ? bandHeight / 2 - y(deviation) : bandHeight / 2;
        })
        .curve(d3.curveMonotoneX);

      const areaNegative = d3.area<{ date: Date; value: number }>()
        .x(d => x(d.date))
        .y0(bandHeight / 2)
        .y1(d => {
          const deviation = d.value - horizon.baseline;
          return deviation < 0 ? bandHeight / 2 + y(Math.abs(deviation)) : bandHeight / 2;
        })
        .curve(d3.curveMonotoneX);

      // Draw bands (horizon layers)
      for (let band = 0; band < numBands; band++) {
        const bandThreshold = (maxDeviation / numBands) * band;
        const nextBandThreshold = (maxDeviation / numBands) * (band + 1);

        // Positive bands (above baseline)
        const positiveData = horizon.data.map(d => ({
          ...d,
          value: horizon.baseline + Math.max(0, Math.min(
            d.value - horizon.baseline - bandThreshold,
            nextBandThreshold - bandThreshold
          ))
        }));

        chartGroup.append('path')
          .datum(positiveData)
          .attr('fill', colors.positive[band])
          .attr('d', areaPositive)
          .attr('opacity', 0)
          .transition()
          .duration(1200)
          .delay(index * 100 + band * 150)
          .attr('opacity', 0.8);

        // Negative bands (below baseline)
        const negativeData = horizon.data.map(d => ({
          ...d,
          value: horizon.baseline - Math.max(0, Math.min(
            horizon.baseline - d.value - bandThreshold,
            nextBandThreshold - bandThreshold
          ))
        }));

        chartGroup.append('path')
          .datum(negativeData)
          .attr('fill', colors.negative[band])
          .attr('d', areaNegative)
          .attr('opacity', 0)
          .transition()
          .duration(1200)
          .delay(index * 100 + band * 150)
          .attr('opacity', 0.8);
      }

      // Metric label
      chartGroup.append('text')
        .attr('x', -10)
        .attr('y', bandHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('opacity', 0)
        .text(horizon.metric)
        .transition()
        .duration(600)
        .delay(index * 100 + 1500)
        .attr('opacity', 1);

      // Baseline value label
      chartGroup.append('text')
        .attr('x', width + 10)
        .attr('y', bandHeight / 2)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', '10px')
        .attr('opacity', 0)
        .text(`±${Math.round(maxDeviation)}`)
        .transition()
        .duration(600)
        .delay(index * 100 + 1700)
        .attr('opacity', 0.6);

      // Interactive overlay
      chartGroup.append('rect')
        .attr('width', width)
        .attr('height', bandHeight)
        .attr('fill', 'none')
        .style('pointer-events', 'all')
        .style('cursor', 'crosshair')
        .on('mousemove', function(event) {
          const [mouseX] = d3.pointer(event);
          const date = x.invert(mouseX);
          const bisect = d3.bisector<{ date: Date; value: number }, Date>(d => d.date).left;
          const idx = bisect(horizon.data, date);
          const point = horizon.data[idx];

          if (point) {
            const deviation = point.value - horizon.baseline;
            setTooltip({
              visible: true,
              x: margin.left + x(point.date),
              y: margin.top + yOffset + bandHeight / 2,
              data: {
                metric: horizon.metric,
                date: point.date,
                value: point.value,
                deviation
              }
            });

            // Highlight line
            const parent = d3.select(this.parentNode as Element);
            parent.selectAll('.hover-line').remove();

            parent
              .append('line')
              .attr('class', 'hover-line')
              .attr('x1', x(point.date))
              .attr('x2', x(point.date))
              .attr('y1', 0)
              .attr('y2', bandHeight)
              .attr('stroke', colors.text)
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '2,2')
              .attr('opacity', 0.5);
          }
        })
        .on('mouseout', function() {
          setTooltip(prev => ({ ...prev, visible: false }));
          d3.select(this.parentNode as Element)
            .selectAll('.hover-line')
            .remove();
        });
    });

    // X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '10px');

    svg.selectAll('.domain, .tick line').attr('stroke', colors.grid);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Compact Multi-Metric Timeline (Horizon Chart)')
      .transition()
      .duration(800)
      .delay(2500)
      .attr('opacity', 1);

    // Legend
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - 150}, -30)`);

    legendGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', colors.text)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text('Above baseline')
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay(3000)
      .attr('opacity', 0.7);

    colors.positive.forEach((color, i) => {
      legendGroup.append('rect')
        .attr('x', i * 20 + 90)
        .attr('y', -8)
        .attr('width', 15)
        .attr('height', 8)
        .attr('fill', color)
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(3000 + i * 100)
        .attr('opacity', 0.8);
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
            transform: 'translate(-50%, -50%)',
            maxWidth: '260px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.metric}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{d3.timeFormat('%b %d, %Y')(tooltip.data.date)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-bold">{Math.round(tooltip.data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Deviation:</span>
              <span className={`font-bold ${tooltip.data.deviation >= 0 ? 'text-blue-500' : 'text-destructive'}`}>
                {tooltip.data.deviation >= 0 ? '+' : ''}{Math.round(tooltip.data.deviation)}
              </span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.deviation >= 0 ? 'Above' : 'Below'} baseline by {Math.abs(Math.round(tooltip.data.deviation))} units
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
