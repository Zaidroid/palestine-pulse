/**
 * Casualties Timeline Chart - D3.js
 * Interactive area chart with crosshair and tooltip
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface DataPoint {
  date: Date;
  deaths: number;
  injured: number;
}

export const CasualtiesTimelineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    visible: boolean;
    date: string;
    deaths: number;
    injured: number;
  }>({
    x: 0,
    y: 0,
    visible: false,
    date: '',
    deaths: 0,
    injured: 0
  });

  const dataRef = useRef<DataPoint[]>([]);
  const scalesRef = useRef<{ x: any; y: any; bisect: any }>({ x: null, y: null, bisect: null });

  useEffect(() => {
    if (!svgRef.current) return;

    const data: DataPoint[] = [
      { date: new Date('2023-10-07'), deaths: 200, injured: 500 },
      { date: new Date('2023-10-14'), deaths: 1500, injured: 3200 },
      { date: new Date('2023-10-21'), deaths: 5000, injured: 12000 },
      { date: new Date('2023-10-28'), deaths: 8500, injured: 21000 },
      { date: new Date('2023-11-04'), deaths: 12000, injured: 32000 },
      { date: new Date('2023-11-11'), deaths: 15500, injured: 42000 },
      { date: new Date('2023-11-18'), deaths: 19000, injured: 52000 },
      { date: new Date('2023-11-25'), deaths: 23000, injured: 62000 },
      { date: new Date('2023-12-02'), deaths: 27000, injured: 72000 },
      { date: new Date('2023-12-09'), deaths: 31000, injured: 82000 },
      { date: new Date('2023-12-16'), deaths: 35000, injured: 90000 },
      { date: new Date('2023-12-23'), deaths: 39000, injured: 96000 },
      { date: new Date('2024-01-01'), deaths: 42000, injured: 100000 },
      { date: new Date('2024-01-08'), deaths: 45000, injured: 102000 },
    ];

    dataRef.current = data;

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.deaths, d.injured)) as number])
      .nice()
      .range([height, 0]);

    const bisect = d3.bisector<DataPoint, Date>(d => d.date).left;

    scalesRef.current = { x, y, bisect };

    const deathsColor = theme === 'dark' ? '#ef4444' : '#dc2626';
    const injuredColor = theme === 'dark' ? '#f59e0b' : '#d97706';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', gridColor);

    // Gradients
    const gradientInjured = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient-injured')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    gradientInjured.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', injuredColor)
      .attr('stop-opacity', 0.6);

    gradientInjured.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', injuredColor)
      .attr('stop-opacity', 0.1);

    const gradientDeaths = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient-deaths')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    gradientDeaths.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', deathsColor)
      .attr('stop-opacity', 0.8);

    gradientDeaths.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', deathsColor)
      .attr('stop-opacity', 0.2);

    // Areas
    const areaInjured = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.injured))
      .curve(d3.curveMonotoneX);

    const areaDeaths = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.deaths))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#gradient-injured)')
      .attr('d', areaInjured)
      .attr('opacity', 0)
      .transition().duration(1500)
      .attr('opacity', 1);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#gradient-deaths)')
      .attr('d', areaDeaths)
      .attr('opacity', 0)
      .transition().duration(1500).delay(300)
      .attr('opacity', 1);

    // Lines
    const lineInjured = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.injured))
      .curve(d3.curveMonotoneX);

    const lineDeaths = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.deaths))
      .curve(d3.curveMonotoneX);

    const injuredPath = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', injuredColor)
      .attr('stroke-width', 2)
      .attr('d', lineInjured);

    const deathsPath = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', deathsColor)
      .attr('stroke-width', 3)
      .attr('d', lineDeaths);

    const pathLength = (deathsPath.node() as SVGPathElement).getTotalLength();
    deathsPath
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition().duration(2000)
      .attr('stroke-dashoffset', 0);

    const injuredPathLength = (injuredPath.node() as SVGPathElement).getTotalLength();
    injuredPath
      .attr('stroke-dasharray', `${injuredPathLength} ${injuredPathLength}`)
      .attr('stroke-dashoffset', injuredPathLength)
      .transition().duration(2000)
      .attr('stroke-dashoffset', 0);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => d3.format('.2s')(d)))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '12px');

    svg.selectAll('.domain').attr('stroke', gridColor);
    svg.selectAll('.tick line').attr('stroke', gridColor);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 10)`);

    legend.append('line')
      .attr('x1', 0).attr('x2', 30)
      .attr('y1', 0).attr('y2', 0)
      .attr('stroke', deathsColor)
      .attr('stroke-width', 3);

    legend.append('text')
      .attr('x', 35).attr('y', 4)
      .attr('fill', textColor)
      .style('font-size', '12px')
      .text('Deaths');

    legend.append('line')
      .attr('x1', 0).attr('x2', 30)
      .attr('y1', 20).attr('y2', 20)
      .attr('stroke', injuredColor)
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 35).attr('y', 24)
      .attr('fill', textColor)
      .style('font-size', '12px')
      .text('Injured');

  }, [theme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !containerRef.current) return;

    const { x, y, bisect } = scalesRef.current;
    if (!x || !y || !bisect) return;

    const data = dataRef.current;
    const svgRect = svgRef.current.getBoundingClientRect();
    const margin = { left: 60, top: 20 };

    const mouseX = e.clientX - svgRect.left - margin.left;
    const x0 = x.invert(mouseX);
    const i = bisect(data, x0, 1);

    if (i === 0 || i >= data.length) {
      setTooltip(prev => ({ ...prev, visible: false }));
      return;
    }

    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;

    // Debug: log coordinates
    console.log('Mouse coords:', { clientX: e.clientX, clientY: e.clientY, pageX: e.pageX, pageY: e.pageY });

    setTooltip({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      date: d3.timeFormat('%B %d, %Y')(d.date),
      deaths: d.deaths,
      injured: d.injured
    });
  };

  const deathsColor = theme === 'dark' ? '#ef4444' : '#dc2626';
  const injuredColor = theme === 'dark' ? '#f59e0b' : '#d97706';

  return (
    <div className="w-full relative" ref={containerRef}>
      <div
        className="absolute inset-0 z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
        style={{ cursor: 'crosshair' }}
      />
      <svg ref={svgRef} className="w-full" />
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none bg-card border border-border rounded-lg p-3 shadow-xl z-50"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            maxWidth: '300px'
          }}
        >
          <div className="font-semibold mb-2 text-base">{tooltip.date}</div>
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: deathsColor }}></div>
                <span className="text-muted-foreground">Deaths:</span>
              </div>
              <span className="font-bold text-destructive">{tooltip.deaths.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: injuredColor }}></div>
                <span className="text-muted-foreground">Injured:</span>
              </div>
              <span className="font-bold text-warning">{tooltip.injured.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-border/50 flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold">{(tooltip.deaths + tooltip.injured).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
