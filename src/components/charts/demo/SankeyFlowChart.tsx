/**
 * Sankey Flow Chart with D3.js
 * Features: Flow visualization, animated transitions, interactive nodes and links
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface SankeyNode {
  name: string;
  value?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export const SankeyFlowChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const nodes: SankeyNode[] = [
      { name: 'North Gaza' },
      { name: 'Gaza City' },
      { name: 'Central Gaza' },
      { name: 'Khan Younis' },
      { name: 'Rafah' },
      { name: 'UNRWA Shelters' },
      { name: 'With Family' },
      { name: 'Informal Camps' }
    ];

    const links: SankeyLink[] = [
      { source: 0, target: 5, value: 390000 },
      { source: 0, target: 6, value: 260000 },
      { source: 1, target: 5, value: 378000 },
      { source: 1, target: 6, value: 252000 },
      { source: 2, target: 5, value: 240000 },
      { source: 2, target: 7, value: 160000 },
      { source: 3, target: 5, value: 300000 },
      { source: 3, target: 6, value: 200000 },
      { source: 4, target: 6, value: 240000 },
      { source: 4, target: 7, value: 160000 }
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 150, bottom: 20, left: 150 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      node: theme === 'dark' ? '#3b82f6' : '#2563eb',
      link: theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.3)',
      linkHover: theme === 'dark' ? 'rgba(59,130,246,0.6)' : 'rgba(37,99,235,0.6)',
      text: theme === 'dark' ? '#e5e7eb' : '#374151'
    };

    // Calculate node positions manually (simplified Sankey layout)
    const nodeWidth = 20;
    const nodePadding = 30;
    const sourceX = 0;
    const targetX = width - nodeWidth;

    // Position source nodes (left side)
    const sourceNodes = nodes.slice(0, 5);
    const sourceHeight = height / sourceNodes.length;
    
    // Position target nodes (right side)
    const targetNodes = nodes.slice(5);
    const targetHeight = height / targetNodes.length;

    // Create positioned nodes
    const positionedNodes = nodes.map((node, i) => {
      if (i < 5) {
        return {
          ...node,
          x: sourceX,
          y: i * sourceHeight + sourceHeight / 2,
          width: nodeWidth,
          height: sourceHeight - nodePadding
        };
      } else {
        const targetIndex = i - 5;
        return {
          ...node,
          x: targetX,
          y: targetIndex * targetHeight + targetHeight / 2,
          width: nodeWidth,
          height: targetHeight - nodePadding
        };
      }
    });

    // Draw links
    const linkGenerator = d3.linkHorizontal<any, any>()
      .source(d => [d.source.x + nodeWidth, d.source.y])
      .target(d => [d.target.x, d.target.y]);

    const linkData = links.map(link => ({
      source: positionedNodes[link.source],
      target: positionedNodes[link.target],
      value: link.value
    }));

    const linkPaths = svg.selectAll('.link')
      .data(linkData)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', colors.link)
      .attr('stroke-width', d => Math.max(1, d.value / 10000))
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Animate links
    linkPaths
      .transition()
      .duration(1500)
      .delay((d, i) => i * 100)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);

    // Link interaction
    linkPaths
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', colors.linkHover)
          .attr('opacity', 1);

        const [mouseX, mouseY] = d3.pointer(event);
        setTooltip({
          visible: true,
          x: margin.left + mouseX + 15,
          y: margin.top + mouseY,
          content: `${d.source.name} → ${d.target.name}`,
          value: d.value
        });
      })
      .on('mousemove', function(event, d) {
        const [mouseX, mouseY] = d3.pointer(event);
        setTooltip({
          visible: true,
          x: margin.left + mouseX + 15,
          y: margin.top + mouseY,
          content: `${d.source.name} → ${d.target.name}`,
          value: d.value
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', colors.link)
          .attr('opacity', 1);

        setTooltip(null);
      });

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
      .data(positionedNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y - d.height / 2})`);

    nodeGroups.append('rect')
      .attr('width', nodeWidth)
      .attr('height', d => d.height)
      .attr('fill', colors.node)
      .attr('rx', 4)
      .attr('opacity', 0)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        setTooltip({
          visible: true,
          x: margin.left + d.x + nodeWidth + 15,
          y: margin.top + d.y,
          content: d.name,
          value: 0
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);

        setTooltip(null);
      })
      .transition()
      .duration(800)
      .delay((d, i) => 1500 + i * 80)
      .attr('opacity', 0.8);

    // Node labels
    nodeGroups.append('text')
      .attr('x', (d, i) => i < 5 ? -10 : nodeWidth + 10)
      .attr('y', d => d.height / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d, i) => i < 5 ? 'end' : 'start')
      .attr('fill', colors.text)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('opacity', 0)
      .text(d => d.name)
      .transition()
      .duration(600)
      .delay((d, i) => 2300 + i * 80)
      .attr('opacity', 1);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Population Displacement Flow')
      .transition()
      .duration(800)
      .delay(3000)
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
            maxWidth: '260px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.content}</div>
          {tooltip.value > 0 && (
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Displaced:</span>
                <span className="font-bold text-secondary">{tooltip.value.toLocaleString()}</span>
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-border/50">
                <p className="text-muted-foreground leading-relaxed">
                  Population movement flow
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
