/**
 * Population Pyramid Chart with D3.js
 * Features: Age/gender distribution, mirrored bars, demographic analysis
 * Perfect for: Showing vulnerable groups (children, elderly), gender breakdown
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
  total: number;
}

export const PopulationPyramidChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      ageGroup: string;
      gender: string;
      value: number;
      percentage: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Generate realistic casualty data by age/gender
    const data: PyramidData[] = [
      { ageGroup: '0-4', male: 2800, female: 2600, total: 5400 },
      { ageGroup: '5-9', male: 3200, female: 3000, total: 6200 },
      { ageGroup: '10-14', male: 2900, female: 2700, total: 5600 },
      { ageGroup: '15-19', male: 2400, female: 2200, total: 4600 },
      { ageGroup: '20-24', male: 2600, female: 1800, total: 4400 },
      { ageGroup: '25-29', male: 3000, female: 1600, total: 4600 },
      { ageGroup: '30-34', male: 2800, female: 1400, total: 4200 },
      { ageGroup: '35-39', male: 2400, female: 1200, total: 3600 },
      { ageGroup: '40-44', male: 2000, female: 1000, total: 3000 },
      { ageGroup: '45-49', male: 1600, female: 800, total: 2400 },
      { ageGroup: '50-54', male: 1200, female: 600, total: 1800 },
      { ageGroup: '55-59', male: 900, female: 500, total: 1400 },
      { ageGroup: '60-64', male: 700, female: 400, total: 1100 },
      { ageGroup: '65+', male: 800, female: 600, total: 1400 }
    ];

    const totalCasualties = d3.sum(data, d => d.total);

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      male: theme === 'dark' ? '#3b82f6' : '#2563eb',
      female: theme === 'dark' ? '#ec4899' : '#db2777',
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };

    // Scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.ageGroup))
      .range([height, 0])
      .padding(0.2);

    const maxValue = d3.max(data, d => Math.max(d.male, d.female)) as number;
    const x = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, width / 2 - 20]);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .selectAll('line')
      .data(x.ticks(5))
      .enter()
      .append('line')
      .attr('x1', d => width / 2 - 20 - x(d))
      .attr('x2', d => width / 2 + 20 + x(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', colors.grid);

    // Center line
    svg.append('line')
      .attr('x1', width / 2)
      .attr('x2', width / 2)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', colors.grid)
      .attr('stroke-width', 2);

    // Male bars (left side)
    const maleBars = svg.selectAll('.bar-male')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-male')
      .attr('x', width / 2 - 20)
      .attr('y', d => y(d.ageGroup) as number)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', colors.male)
      .attr('rx', 3)
      .style('cursor', 'pointer');

    // Animate male bars
    maleBars
      .transition()
      .duration(1200)
      .delay((d, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('x', d => width / 2 - 20 - x(d.male))
      .attr('width', d => x(d.male));

    // Female bars (right side)
    const femaleBars = svg.selectAll('.bar-female')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-female')
      .attr('x', width / 2 + 20)
      .attr('y', d => y(d.ageGroup) as number)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', colors.female)
      .attr('rx', 3)
      .style('cursor', 'pointer');

    // Animate female bars
    femaleBars
      .transition()
      .duration(1200)
      .delay((d, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('width', d => x(d.female));

    // Interaction - Male bars
    maleBars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);

        setTooltip({
          visible: true,
          x: margin.left + width / 2 - 20 - x(d.male) / 2,
          y: margin.top + (y(d.ageGroup) as number) + y.bandwidth() / 2,
          data: {
            ageGroup: d.ageGroup,
            gender: 'Male',
            value: d.male,
            percentage: (d.male / totalCasualties) * 100
          }
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Interaction - Female bars
    femaleBars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);

        setTooltip({
          visible: true,
          x: margin.left + width / 2 + 20 + x(d.female) / 2,
          y: margin.top + (y(d.ageGroup) as number) + y.bandwidth() / 2,
          data: {
            ageGroup: d.ageGroup,
            gender: 'Female',
            value: d.female,
            percentage: (d.female / totalCasualties) * 100
          }
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Age group labels (center)
    svg.selectAll('.age-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'age-label')
      .attr('x', width / 2)
      .attr('y', d => (y(d.ageGroup) as number) + y.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => d.ageGroup)
      .transition()
      .duration(600)
      .delay((d, i) => 1200 + i * 50)
      .attr('opacity', 1);

    // X-axis labels
    const xAxisLeft = d3.axisBottom(x)
      .ticks(5)
      .tickFormat(d => d3.format('.1s')(d));

    svg.append('g')
      .attr('transform', `translate(${width / 2 - 20 - width / 2 + 20}, ${height})`)
      .call(xAxisLeft)
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${width / 2 + 20}, ${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d3.format('.1s')(d)))
      .selectAll('text')
      .attr('fill', colors.text)
      .style('font-size', '10px');

    svg.selectAll('.domain, .tick line').attr('stroke', colors.grid);

    // Gender labels
    svg.append('text')
      .attr('x', width / 4 - 10)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.male)
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text('Male')
      .transition()
      .duration(600)
      .delay(2000)
      .attr('opacity', 1);

    svg.append('text')
      .attr('x', width * 3 / 4 + 10)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.female)
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text('Female')
      .transition()
      .duration(600)
      .delay(2000)
      .attr('opacity', 1);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text('Casualty Distribution by Age and Gender')
      .transition()
      .duration(800)
      .delay(2500)
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
            transform: 'translate(-50%, -50%)',
            maxWidth: '240px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {tooltip.data.gender} • Age {tooltip.data.ageGroup}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Casualties:</span>
              <span className="font-bold text-destructive">{tooltip.data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Percentage:</span>
              <span className="font-bold">{tooltip.data.percentage.toFixed(2)}%</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.ageGroup.startsWith('0-') || tooltip.data.ageGroup.startsWith('5-') || tooltip.data.ageGroup.startsWith('10-') || tooltip.data.ageGroup.startsWith('15-') 
                  ? 'Children and youth' 
                  : tooltip.data.ageGroup === '65+' 
                  ? 'Elderly population' 
                  : 'Working age adults'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
