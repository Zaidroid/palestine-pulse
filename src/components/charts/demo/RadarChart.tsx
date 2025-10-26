/**
 * Radar Chart with D3.js
 * Features: Multi-dimensional visualization, smooth animations, interactive axes
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface RadarData {
  axis: string;
  value: number;
  maxValue: number;
}

export const RadarChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: RadarData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const data: RadarData[] = [
      { axis: 'Casualties', value: 85, maxValue: 100 },
      { axis: 'Infrastructure', value: 95, maxValue: 100 },
      { axis: 'Displacement', value: 90, maxValue: 100 },
      { axis: 'Healthcare', value: 100, maxValue: 100 },
      { axis: 'Food Security', value: 75, maxValue: 100 },
      { axis: 'Water Access', value: 80, maxValue: 100 }
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 80;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / data.length;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const colors = {
      primary: theme === 'dark' ? '#ef4444' : '#dc2626',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      fill: theme === 'dark' ? 'rgba(239,68,68,0.3)' : 'rgba(220,38,38,0.3)'
    };

    // Scale
    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    // Draw circular grid
    for (let level = 0; level < levels; level++) {
      const levelRadius = radius * ((level + 1) / levels);
      
      svg.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', colors.grid)
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(level * 100)
        .attr('opacity', 1);

      // Level labels
      svg.append('text')
        .attr('x', 5)
        .attr('y', -levelRadius)
        .attr('fill', colors.text)
        .attr('font-size', '10px')
        .attr('opacity', 0)
        .text(`${((level + 1) * 20)}%`)
        .transition()
        .duration(500)
        .delay(800 + level * 100)
        .attr('opacity', 0.5);
    }

    // Draw axes
    const axes = svg.selectAll('.axis')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .attr('stroke', colors.grid)
      .attr('stroke-width', 2)
      .transition()
      .duration(1000)
      .delay((d, i) => 500 + i * 100)
      .attr('x2', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2));

    // Axis labels
    axes.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => (rScale(100) + 30) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => (rScale(100) + 30) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('fill', colors.text)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => d.axis)
      .transition()
      .duration(600)
      .delay((d, i) => 1500 + i * 100)
      .attr('opacity', 1);

    // Draw radar area
    const radarLine = d3.lineRadial<RadarData>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const radarArea = svg.append('path')
      .datum(data)
      .attr('class', 'radar-area')
      .attr('d', radarLine as any)
      .attr('fill', colors.fill)
      .attr('stroke', colors.primary)
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    // Animate radar area
    const totalLength = (radarArea.node() as SVGPathElement).getTotalLength();
    radarArea
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .delay(1500)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0)
      .attr('opacity', 1);

    // Draw data points
    const points = svg.selectAll('.radar-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radar-point')
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('r', 0)
      .attr('fill', colors.primary)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    points
      .transition()
      .duration(600)
      .delay((d, i) => 3500 + i * 100)
      .ease(d3.easeElasticOut)
      .attr('r', 6);

    // Interaction
    points
      .on('mouseover', function(event, d) {
        const i = data.indexOf(d);
        const pointX = rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        const pointY = rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 10);

        setTooltip({
          visible: true,
          x: width / 2 + pointX + 15,
          y: height / 2 + pointY,
          data: d
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);

        setTooltip(prev => ({ ...prev, visible: false }));
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
            maxWidth: '240px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.axis}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Impact Level:</span>
              <span className="font-bold text-destructive">{tooltip.data.value}%</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.value >= 90 ? 'Critical impact' : 
                 tooltip.data.value >= 75 ? 'Severe impact' : 
                 'High impact'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
