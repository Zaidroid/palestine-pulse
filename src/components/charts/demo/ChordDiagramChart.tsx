/**
 * Chord Diagram Chart with D3.js
 * Features: Relationship visualization, animated ribbons, interactive arcs, flow highlighting
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

export const ChordDiagramChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      source: string;
      target: string;
      value: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Define regions
    const regions = ['North Gaza', 'Gaza City', 'Central', 'Khan Younis', 'Rafah'];
    
    // Create flow matrix (region to region displacement)
    const matrix = [
      [0, 5000, 3000, 2000, 1000],    // North Gaza
      [4000, 0, 6000, 3000, 2000],    // Gaza City
      [2000, 5000, 0, 4000, 3000],    // Central
      [1000, 2000, 3000, 0, 5000],    // Khan Younis
      [500, 1000, 2000, 4000, 0]      // Rafah
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const outerRadius = Math.min(width, height) * 0.4;
    const innerRadius = outerRadius - 30;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const colors = {
      regions: theme === 'dark' 
        ? ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16']
        : ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d'],
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      ribbon: theme === 'dark' ? 0.4 : 0.3
    };

    // Create chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
      .radius(innerRadius);

    const chords = chord(matrix);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(regions)
      .range(colors.regions);

    // Draw groups (arcs)
    const group = svg.append('g')
      .selectAll('g')
      .data(chords.groups)
      .enter()
      .append('g');

    const groupArc = group.append('path')
      .attr('fill', d => color(regions[d.index]) as string)
      .attr('stroke', d => d3.rgb(color(regions[d.index]) as string).darker().toString())
      .attr('stroke-width', 2)
      .attr('d', arc as any)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Animate arcs
    groupArc
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .ease(d3.easeCubicOut)
      .attr('opacity', 0.9);

    // Add labels
    group.append('text')
      .each(d => { (d as any).angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('transform', (d: any) => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 15})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', (d: any) => d.angle > Math.PI ? 'end' : 'start')
      .attr('fill', colors.text)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => regions[d.index])
      .transition()
      .duration(600)
      .delay((d, i) => 1000 + i * 100)
      .attr('opacity', 1);

    // Draw ribbons
    const ribbons = svg.append('g')
      .attr('fill-opacity', colors.ribbon)
      .selectAll('path')
      .data(chords)
      .enter()
      .append('path')
      .attr('d', ribbon as any)
      .attr('fill', d => color(regions[d.source.index]) as string)
      .attr('stroke', d => d3.rgb(color(regions[d.source.index]) as string).darker().toString())
      .attr('stroke-width', 0.5)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Animate ribbons
    ribbons
      .transition()
      .duration(1500)
      .delay((d, i) => 1500 + i * 50)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);

    // Ribbon interaction
    ribbons
      .on('mouseover', function(event, d) {
        // Highlight this ribbon
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 2);

        // Dim other ribbons
        ribbons
          .filter(function(p: any) { return p !== d; })
          .transition()
          .duration(200)
          .attr('opacity', 0.1);

        // Highlight connected arcs
        groupArc
          .transition()
          .duration(200)
          .attr('opacity', (g: any) => 
            g.index === d.source.index || g.index === d.target.index ? 1 : 0.3
          );

        const [mouseX, mouseY] = d3.pointer(event, svg.node());
        setTooltip({
          visible: true,
          x: width / 2 + mouseX + 15,
          y: height / 2 + mouseY,
          data: {
            source: regions[d.source.index],
            target: regions[d.target.index],
            value: d.source.value
          }
        });
      })
      .on('mousemove', function(event) {
        const [mouseX, mouseY] = d3.pointer(event, svg.node());
        setTooltip(prev => ({
          ...prev,
          x: width / 2 + mouseX + 15,
          y: height / 2 + mouseY
        }));
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 0.5);

        ribbons
          .transition()
          .duration(200)
          .attr('opacity', 1);

        groupArc
          .transition()
          .duration(200)
          .attr('opacity', 0.9);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Arc interaction
    groupArc
      .on('mouseover', function(event, d) {
        const index = d.index;

        // Highlight this arc
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        // Highlight connected ribbons
        ribbons
          .transition()
          .duration(200)
          .attr('opacity', (r: any) => 
            r.source.index === index || r.target.index === index ? 1 : 0.1
          );

        // Dim other arcs
        groupArc
          .filter(function(g: any) { return g.index !== index; })
          .transition()
          .duration(200)
          .attr('opacity', 0.3);
      })
      .on('mouseout', function() {
        groupArc
          .transition()
          .duration(200)
          .attr('opacity', 0.9);

        ribbons
          .transition()
          .duration(200)
          .attr('opacity', 1);
      });

    // Center title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text('Population')
      .transition()
      .duration(800)
      .delay(3000)
      .attr('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 10)
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text('Movement')
      .transition()
      .duration(800)
      .delay(3000)
      .attr('opacity', 1);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${-outerRadius - 80}, ${-outerRadius + 20})`);

    legend.append('text')
      .attr('fill', colors.text)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Hover ribbons to see flows')
      .transition()
      .duration(600)
      .delay(3500)
      .attr('opacity', 0.7);

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
          <div className="font-semibold mb-2 text-sm">Population Flow</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{tooltip.data.source}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">{tooltip.data.target}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">People:</span>
              <span className="font-bold text-secondary">{tooltip.data.value.toLocaleString()}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                Internal displacement between regions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
