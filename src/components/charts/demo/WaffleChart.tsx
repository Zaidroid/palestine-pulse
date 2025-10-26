/**
 * Waffle Chart with D3.js
 * Features: 10x10 grid showing proportions, color-coded categories, fill animation
 * Perfect for: Showing casualties as percentage, visual proportions, category breakdown
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';

interface WaffleData {
  category: string;
  value: number;
  color: string;
}

export const WaffleChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: WaffleData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Data: 100 squares representing 100%
    const categories: WaffleData[] = [
      { category: 'Children (0-17)', value: 40, color: theme === 'dark' ? '#ef4444' : '#dc2626' },
      { category: 'Women', value: 21, color: theme === 'dark' ? '#f97316' : '#ea580c' },
      { category: 'Men', value: 34, color: theme === 'dark' ? '#3b82f6' : '#2563eb' },
      { category: 'Elderly (65+)', value: 5, color: theme === 'dark' ? '#eab308' : '#ca8a04' }
    ];

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 60, right: 40, bottom: 80, left: 40 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = {
      text: theme === 'dark' ? '#e5e7eb' : '#374151',
      empty: theme === 'dark' ? '#1f2937' : '#f3f4f6'
    };

    // Grid configuration
    const gridSize = 10; // 10x10 = 100 squares
    const squareSize = Math.min(width, height) / gridSize - 4;
    const squarePadding = 2;

    // Create data for 100 squares
    const squareData: Array<{
      index: number;
      row: number;
      col: number;
      category: WaffleData | null;
    }> = [];

    let currentIndex = 0;
    categories.forEach(category => {
      for (let i = 0; i < category.value; i++) {
        const row = Math.floor(currentIndex / gridSize);
        const col = currentIndex % gridSize;
        squareData.push({
          index: currentIndex,
          row,
          col,
          category
        });
        currentIndex++;
      }
    });

    // Fill remaining squares with empty
    while (currentIndex < 100) {
      const row = Math.floor(currentIndex / gridSize);
      const col = currentIndex % gridSize;
      squareData.push({
        index: currentIndex,
        row,
        col,
        category: null
      });
      currentIndex++;
    }

    // Center the grid
    const gridWidth = gridSize * (squareSize + squarePadding);
    const gridHeight = gridSize * (squareSize + squarePadding);
    const offsetX = (width - gridWidth) / 2;
    const offsetY = (height - gridHeight) / 2;

    // Draw squares
    const squares = svg.selectAll('.square')
      .data(squareData)
      .enter()
      .append('rect')
      .attr('class', 'square')
      .attr('x', d => offsetX + d.col * (squareSize + squarePadding))
      .attr('y', d => offsetY + d.row * (squareSize + squarePadding))
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('rx', 2)
      .attr('fill', colors.empty)
      .attr('stroke', theme === 'dark' ? '#374151' : '#d1d5db')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .style('cursor', d => d.category ? 'pointer' : 'default');

    // Animate squares filling in
    squares
      .transition()
      .duration(600)
      .delay((d, i) => i * 15)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1)
      .attr('fill', d => d.category ? d.category.color : colors.empty);

    // Interaction
    squares
      .on('mouseover', function(event, d) {
        if (!d.category) return;

        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('stroke', theme === 'dark' ? '#ffffff' : '#000000');

        setTooltip({
          visible: true,
          x: margin.left + offsetX + d.col * (squareSize + squarePadding) + squareSize / 2,
          y: margin.top + offsetY + d.row * (squareSize + squarePadding),
          data: d.category
        });
      })
      .on('mouseout', function(event, d) {
        if (!d.category) return;

        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 1)
          .attr('stroke', theme === 'dark' ? '#374151' : '#d1d5db');

        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text('Casualty Demographics')
      .transition()
      .duration(800)
      .delay(1500)
      .attr('opacity', 1);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '12px')
      .attr('opacity', 0)
      .text('Each square represents 1% of total casualties')
      .transition()
      .duration(800)
      .delay(1700)
      .attr('opacity', 0.7);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${offsetX}, ${offsetY + gridHeight + 30})`);

    const legendItemWidth = gridWidth / categories.length;
    
    categories.forEach((cat, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * legendItemWidth}, 0)`)
        .attr('opacity', 0);

      legendItem.append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('rx', 2)
        .attr('fill', cat.color);

      legendItem.append('text')
        .attr('x', 22)
        .attr('y', 8)
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('dominant-baseline', 'middle')
        .text(cat.category);

      legendItem.append('text')
        .attr('x', 22)
        .attr('y', 24)
        .attr('fill', colors.text)
        .attr('font-size', '11px')
        .attr('opacity', 0.7)
        .attr('dominant-baseline', 'middle')
        .text(`${cat.value}%`);

      legendItem
        .transition()
        .duration(600)
        .delay(2000 + i * 100)
        .attr('opacity', 1);
    });

    // Add percentage annotations
    let cumulativeValue = 0;
    categories.forEach((cat, i) => {
      if (i < categories.length - 1) { // Don't annotate the last one
        cumulativeValue += cat.value;
        const squareIndex = cumulativeValue - 1;
        const row = Math.floor(squareIndex / gridSize);
        const col = squareIndex % gridSize;

        // Add a subtle divider line
        if (col === gridSize - 1) {
          // Horizontal divider
          svg.append('line')
            .attr('x1', offsetX)
            .attr('x2', offsetX + gridWidth)
            .attr('y1', offsetY + (row + 1) * (squareSize + squarePadding) - squarePadding / 2)
            .attr('y2', offsetY + (row + 1) * (squareSize + squarePadding) - squarePadding / 2)
            .attr('stroke', theme === 'dark' ? '#4b5563' : '#9ca3af')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0)
            .transition()
            .duration(400)
            .delay(2500 + i * 100)
            .attr('opacity', 0.5);
        }
      }
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
            transform: 'translate(-50%, -100%)',
            maxWidth: '220px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">{tooltip.data.category}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Percentage:</span>
              <span className="font-bold text-destructive">{tooltip.data.value}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Squares:</span>
              <span className="font-medium">{tooltip.data.value} of 100</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                {tooltip.data.value}% of all casualties
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
