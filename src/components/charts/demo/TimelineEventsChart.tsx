/**
 * Timeline with Events Chart - D3.js
 * Features: Casualty timeline with event markers, annotations, phase shading, interactive zoom
 * Perfect for: Showing context, connecting data to events, storytelling
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { AlertTriangle, Shield, Heart, Flag } from 'lucide-react';

interface TimelineEvent {
  date: Date;
  title: string;
  description: string;
  type: 'escalation' | 'ceasefire' | 'humanitarian' | 'political';
  severity: 'critical' | 'high' | 'medium';
}

interface CasualtyPoint {
  date: Date;
  casualties: number;
}

export const TimelineEventsChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: TimelineEvent | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Generate casualty data
    const startDate = new Date('2023-10-07');
    const endDate = new Date('2024-01-31');
    const casualtyData: CasualtyPoint[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const daysSinceStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const baseValue = 150 + daysSinceStart * 2;
      const noise = Math.random() * 100;
      casualtyData.push({
        date: new Date(d),
        casualties: baseValue + noise
      });
    }

    // Define major events
    const events: TimelineEvent[] = [
      {
        date: new Date('2023-10-07'),
        title: 'Conflict Begins',
        description: 'October 7 attacks trigger military response',
        type: 'escalation',
        severity: 'critical'
      },
      {
        date: new Date('2023-10-27'),
        title: 'Ground Invasion',
        description: 'Ground operations intensify in northern Gaza',
        type: 'escalation',
        severity: 'critical'
      },
      {
        date: new Date('2023-11-24'),
        title: 'First Ceasefire',
        description: 'Temporary humanitarian pause begins',
        type: 'ceasefire',
        severity: 'medium'
      },
      {
        date: new Date('2023-12-01'),
        title: 'Ceasefire Ends',
        description: 'Military operations resume',
        type: 'escalation',
        severity: 'high'
      },
      {
        date: new Date('2023-12-15'),
        title: 'Humanitarian Crisis',
        description: 'UN declares severe humanitarian emergency',
        type: 'humanitarian',
        severity: 'critical'
      },
      {
        date: new Date('2024-01-15'),
        title: 'ICJ Hearing',
        description: 'International Court of Justice preliminary hearing',
        type: 'political',
        severity: 'high'
      }
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 60, right: 40, bottom: 60, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      area: theme === 'dark' ? 'rgba(239,68,68,0.3)' : 'rgba(220,38,38,0.3)',
      line: theme === 'dark' ? '#ef4444' : '#dc2626',
      escalation: theme === 'dark' ? '#ef4444' : '#dc2626',
      ceasefire: theme === 'dark' ? '#10b981' : '#059669',
      humanitarian: theme === 'dark' ? '#f59e0b' : '#d97706',
      political: theme === 'dark' ? '#3b82f6' : '#2563eb',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      phase: theme === 'dark' ? 'rgba(16,185,129,0.1)' : 'rgba(5,150,105,0.1)'
    };

    // Scales
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(casualtyData, d => d.casualties) as number])
      .nice()
      .range([height, 0]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', colors.grid);

    // Phase shading (ceasefire period)
    svg.append('rect')
      .attr('x', x(new Date('2023-11-24')))
      .attr('y', 0)
      .attr('width', x(new Date('2023-12-01')) - x(new Date('2023-11-24')))
      .attr('height', height)
      .attr('fill', colors.phase)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay(500)
      .attr('opacity', 1);

    // Gradient for area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'timeline-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.line)
      .attr('stop-opacity', 0.6);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.line)
      .attr('stop-opacity', 0.1);

    // Area
    const area = d3.area<CasualtyPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.casualties))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(casualtyData)
      .attr('fill', 'url(#timeline-gradient)')
      .attr('d', area)
      .attr('opacity', 0)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);

    // Line
    const line = d3.line<CasualtyPoint>()
      .x(d => x(d.date))
      .y(d => y(d.casualties))
      .curve(d3.curveMonotoneX);

    const path = svg.append('path')
      .datum(casualtyData)
      .attr('fill', 'none')
      .attr('stroke', colors.line)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    const pathLength = (path.node() as SVGPathElement).getTotalLength();
    path
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Event markers
    const eventGroups = svg.selectAll('.event')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event')
      .attr('transform', d => `translate(${x(d.date)}, 0)`)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Event lines
    eventGroups.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', d => colors[d.type])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.6);

    // Event circles
    eventGroups.append('circle')
      .attr('cx', 0)
      .attr('cy', d => {
        const casualty = casualtyData.find(c => 
          Math.abs(c.date.getTime() - d.date.getTime()) < 1000 * 60 * 60 * 24
        );
        return casualty ? y(casualty.casualties) : height / 2;
      })
      .attr('r', 6)
      .attr('fill', d => colors[d.type])
      .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff')
      .attr('stroke-width', 2);

    // Event labels
    eventGroups.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text(d => d.title)
      .each(function() {
        const text = d3.select(this);
        const words = text.text().split(' ');
        text.text('');
        
        words.forEach((word, i) => {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : '1.1em')
            .text(word);
        });
      });

    // Animate event markers
    eventGroups
      .transition()
      .duration(600)
      .delay((d, i) => 2000 + i * 200)
      .attr('opacity', 1);

    // Interaction
    eventGroups
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 10);

        d3.select(this).select('line')
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);

        setTooltip({
          visible: true,
          x: margin.left + x(d.date),
          y: margin.top + height / 2,
          data: d
        });
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 6);

        d3.select(this).select('line')
          .transition()
          .duration(200)
          .attr('opacity', 0.6)
          .attr('stroke-width', 2);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '11px');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => d3.format('.2s')(d)))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '11px');

    svg.selectAll('.domain, .tick line').attr('stroke', colors.grid);

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Daily Casualties');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Casualties Timeline with Major Events')
      .transition()
      .duration(800)
      .delay(3000)
      .attr('opacity', 1);

  }, [theme]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'escalation': return <AlertTriangle className="h-4 w-4" />;
      case 'ceasefire': return <Shield className="h-4 w-4" />;
      case 'humanitarian': return <Heart className="h-4 w-4" />;
      case 'political': return <Flag className="h-4 w-4" />;
      default: return null;
    }
  };

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
            maxWidth: '280px'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {getEventIcon(tooltip.data.type)}
            <div className="font-semibold text-sm">{tooltip.data.title}</div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{d3.timeFormat('%B %d, %Y')(tooltip.data.date)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{tooltip.data.type}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
