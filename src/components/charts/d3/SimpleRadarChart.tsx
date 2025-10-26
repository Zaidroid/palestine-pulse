/**
 * Simple Radar Chart - Built from scratch
 * A clean, working implementation of a radar/spider chart with relative scaling
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface RadarDataPoint {
    axis: string;
    value: number;
}

export interface SimpleRadarChartProps {
    data: RadarDataPoint[];
    width?: number;
    height?: number;
    maxValue?: number;
    levels?: number;
    color?: string;
    animated?: boolean;
    interactive?: boolean;
    useRelativeScale?: boolean;
}

export const SimpleRadarChart: React.FC<SimpleRadarChartProps> = ({
    data,
    width = 400,
    height = 400,
    maxValue = 100,
    levels = 5,
    color = 'hsl(var(--destructive))',
    animated = true,
    interactive = true,
    useRelativeScale = true,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || !data || data.length === 0) return;

        // Clear previous content
        d3.select(svgRef.current).selectAll('*').remove();

        // Get actual container dimensions
        const containerWidth = containerRef.current.clientWidth || width;
        const containerHeight = containerRef.current.clientHeight || height;

        // Minimal margin for maximum space usage
        const margin = 35;
        const radius = Math.min(containerWidth, containerHeight) / 2 - margin;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', containerHeight);

        const g = svg.append('g')
            .attr('transform', `translate(${centerX}, ${centerY})`);

        // Calculate angle for each axis
        const angleSlice = (Math.PI * 2) / data.length;

        // Find min/max values for relative scaling
        const minValue = Math.min(...data.map(d => d.value));
        const maxDataValue = Math.max(...data.map(d => d.value));

        // Use relative scale to make small values fill the space
        const scaleMin = useRelativeScale ? Math.max(0, minValue - 5) : 0;
        const scaleMax = useRelativeScale ? Math.min(maxValue, maxDataValue + 10) : maxValue;

        const rScale = d3.scaleLinear()
            .domain([scaleMin, scaleMax])
            .range([0, radius]);

        // Draw circular grid levels
        const gridGroup = g.append('g').attr('class', 'grid');

        for (let i = 1; i <= levels; i++) {
            const levelRadius = (radius / levels) * i;
            const levelValue = scaleMin + ((scaleMax - scaleMin) / levels) * i;

            // Draw circle
            gridGroup.append('circle')
                .attr('r', levelRadius)
                .attr('fill', 'none')
                .attr('stroke', 'currentColor')
                .attr('stroke-width', 1)
                .attr('opacity', 0.2)
                .attr('class', 'text-muted-foreground');

            // Add level label
            if (i === levels) {
                gridGroup.append('text')
                    .attr('x', 5)
                    .attr('y', -levelRadius)
                    .attr('fill', 'currentColor')
                    .attr('class', 'text-muted-foreground text-xs')
                    .attr('opacity', 0.6)
                    .text(`${levelValue.toFixed(0)}%`);
            }
        }

        // Draw axis lines
        const axisGroup = g.append('g').attr('class', 'axes');

        data.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const lineCoord = {
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle),
            };

            // Draw axis line
            axisGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', lineCoord.x)
                .attr('y2', lineCoord.y)
                .attr('stroke', 'currentColor')
                .attr('stroke-width', 1)
                .attr('opacity', 0.2)
                .attr('class', 'text-muted-foreground');

            // Add axis label
            const labelRadius = radius + 18;
            const labelCoord = {
                x: labelRadius * Math.cos(angle),
                y: labelRadius * Math.sin(angle),
            };

            // Determine text anchor based on position
            let textAnchor = 'middle';
            if (Math.abs(labelCoord.x) > 10) {
                textAnchor = labelCoord.x > 0 ? 'start' : 'end';
            }

            axisGroup.append('text')
                .attr('x', labelCoord.x)
                .attr('y', labelCoord.y)
                .attr('dy', '0.35em')
                .attr('text-anchor', textAnchor)
                .attr('fill', 'currentColor')
                .attr('class', 'text-foreground text-xs font-semibold')
                .text(d.axis);

            // Add value label below axis name
            axisGroup.append('text')
                .attr('x', labelCoord.x)
                .attr('y', labelCoord.y + 14)
                .attr('dy', '0.35em')
                .attr('text-anchor', textAnchor)
                .attr('fill', color)
                .attr('class', 'text-xs font-bold')
                .text(`${d.value.toFixed(0)}%`);
        });

        // Draw the data polygon
        const dataGroup = g.append('g').attr('class', 'data');

        // Create polygon points
        const polygonPoints = data.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const r = rScale(d.value);
            return {
                x: r * Math.cos(angle),
                y: r * Math.sin(angle),
            };
        });

        // Create path string manually
        const createPathString = (points: { x: number; y: number }[], scale: number = 1) => {
            if (points.length === 0) return '';
            const scaledPoints = points.map(p => ({ x: p.x * scale, y: p.y * scale }));
            const pathData = scaledPoints.map((p, i) =>
                `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
            ).join(' ') + ' Z';
            return pathData;
        };

        const path = dataGroup.append('path')
            .attr('fill', color)
            .attr('fill-opacity', 0.4)
            .attr('stroke', color)
            .attr('stroke-width', 3)
            .attr('stroke-linejoin', 'round');

        if (animated) {
            // Animate from center
            path
                .attr('d', createPathString(polygonPoints, 0))
                .transition()
                .duration(1000)
                .ease(d3.easeCubicOut)
                .attr('d', createPathString(polygonPoints, 1));
        } else {
            path.attr('d', createPathString(polygonPoints, 1));
        }

        // Add interactive data points
        if (interactive) {
            const pointsGroup = dataGroup.append('g').attr('class', 'points');

            data.forEach((d, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                const pointRadius = rScale(d.value);
                const pointCoord = {
                    x: pointRadius * Math.cos(angle),
                    y: pointRadius * Math.sin(angle),
                };

                const point = pointsGroup.append('circle')
                    .attr('cx', pointCoord.x)
                    .attr('cy', pointCoord.y)
                    .attr('r', 0)
                    .attr('fill', color)
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 2.5)
                    .style('cursor', 'pointer');

                if (animated) {
                    point
                        .transition()
                        .duration(600)
                        .delay(1000 + i * 50)
                        .attr('r', 6);
                } else {
                    point.attr('r', 6);
                }

                // Add hover effects
                point
                    .on('mouseenter', function () {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr('r', 10);
                        setHoveredAxis(d.axis);
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr('r', 6);
                        setHoveredAxis(null);
                    });
            });
        }

    }, [data, width, height, maxValue, levels, color, animated, interactive, useRelativeScale]);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No data available</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
            <svg ref={svgRef} className="w-full h-full" />
            {hoveredAxis && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none z-10">
                    <div className="text-sm font-semibold">{hoveredAxis}</div>
                    <div className="text-xs text-muted-foreground">
                        {data.find(d => d.axis === hoveredAxis)?.value.toFixed(0)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleRadarChart;
