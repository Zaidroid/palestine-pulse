/**
 * Isotype/Pictogram Chart with D3.js
 * Features: Human icons representing casualties, color-coded by age group, wave animation
 * Perfect for: Humanizing statistics, emotional impact, showing scale
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

export const IsotypeChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: {
      category: string;
      count: number;
      iconValue: number;
    } | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Data: Each icon represents 100 people
    const totalCasualties = 45000;
    const iconValue = 100;
    const totalIcons = Math.ceil(totalCasualties / iconValue);

    const categories = [
      { name: 'Children', percentage: 0.40, color: theme === 'dark' ? '#ef4444' : '#dc2626' },
      { name: 'Women', percentage: 0.21, color: theme === 'dark' ? '#f97316' : '#ea580c' },
      { name: 'Men', percentage: 0.34, color: theme === 'dark' ? '#3b82f6' : '#2563eb' },
      { name: 'Elderly', percentage: 0.05, color: theme === 'dark' ? '#eab308' : '#ca8a04' }
    ];

    // Calculate icons per category
    const categoryData = categories.map(cat => ({
      ...cat,
      count: Math.round(totalCasualties * cat.percentage),
      icons: Math.round(totalIcons * cat.percentage)
    }));

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 60, right: 20, bottom: 80, left: 20 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      text: theme === 'dark' ? '#e5e7eb' : '#374151'
    };

    // Calculate grid layout to use full width
    const iconSize = 14;
    const iconPadding = 3;
    const iconsPerRow = Math.floor(width / (iconSize + iconPadding));
    const rows = Math.ceil(totalIcons / iconsPerRow);
    
    // Center the grid horizontally
    const gridWidth = iconsPerRow * (iconSize + iconPadding);
    const offsetX = (width - gridWidth) / 2;

    // Create icon data with categories
    const iconData: Array<{
      index: number;
      x: number;
      y: number;
      category: typeof categoryData[0];
    }> = [];

    let currentIndex = 0;
    categoryData.forEach(category => {
      for (let i = 0; i < category.icons; i++) {
        const row = Math.floor(currentIndex / iconsPerRow);
        const col = currentIndex % iconsPerRow;
        
        iconData.push({
          index: currentIndex,
          x: offsetX + col * (iconSize + iconPadding),
          y: row * (iconSize + iconPadding),
          category
        });
        
        currentIndex++;
      }
    });

    // Human icon path (simplified person silhouette)
    const personPath = "M6,2 C6,0.9 6.9,0 8,0 C9.1,0 10,0.9 10,2 C10,3.1 9.1,4 8,4 C6.9,4 6,3.1 6,2 Z M4,6 L5,6 L5,12 L7,12 L7,16 L9,16 L9,12 L11,12 L11,6 L12,6 C12.6,6 13,5.6 13,5 C13,4.4 12.6,4 12,4 L4,4 C3.4,4 3,4.4 3,5 C3,5.6 3.4,6 4,6 Z";

    // Draw icons
    const icons = svg.selectAll('.icon')
      .data(iconData)
      .enter()
      .append('g')
      .attr('class', 'icon')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    icons.append('path')
      .attr('d', personPath)
      .attr('fill', d => d.category.color)
      .attr('opacity', 0)
      .attr('transform', `scale(${iconSize / 16})`)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', `scale(${(iconSize + 2) / 16})`);

        setTooltip({
          visible: true,
          x: margin.left + d.x + iconSize / 2,
          y: margin.top + d.y,
          data: {
            category: d.category.name,
            count: d.category.count,
            iconValue
          }
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('transform', `scale(${iconSize / 16})`);

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Animate icons in waves
    icons.selectAll('path')
      .transition()
      .duration(800)
      .delay((d, i) => (i % iconsPerRow) * 10 + Math.floor(i / iconsPerRow) * 50)
      .ease(d3.easeCubicOut)
      .attr('opacity', 0.9);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${totalCasualties.toLocaleString()} Lives Lost`)
      .transition()
      .duration(800)
      .delay(2000)
      .attr('opacity', 1);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '12px')
      .attr('opacity', 0)
      .text(`Each icon represents ${iconValue} people`)
      .transition()
      .duration(800)
      .delay(2200)
      .attr('opacity', 0.7);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(0, ${height + 20})`);

    const legendItemWidth = width / categories.length;
    
    categories.forEach((cat, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * legendItemWidth}, 0)`)
        .attr('opacity', 0);

      legendItem.append('path')
        .attr('d', personPath)
        .attr('fill', cat.color)
        .attr('transform', 'scale(1.2)');

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text(cat.name);

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 25)
        .attr('fill', colors.text)
        .attr('font-size', '11px')
        .attr('opacity', 0.7)
        .text(`${(cat.percentage * 100).toFixed(0)}% • ${Math.round(totalCasualties * cat.percentage).toLocaleString()}`);

      legendItem
        .transition()
        .duration(600)
        .delay(2500 + i * 100)
        .attr('opacity', 1);
    });

  }, [theme]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in"
          style={{
            left: `${tooltip.x + 20}px`,
            top: `${tooltip.y + 60}px`,
            maxWidth: '220px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.category}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-destructive">{tooltip.data.count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Per Icon:</span>
              <span className="font-medium">{tooltip.data.iconValue} people</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                Each icon represents {tooltip.data.iconValue} lives lost
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
