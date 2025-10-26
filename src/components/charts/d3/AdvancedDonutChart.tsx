/**
 * Advanced Donut Chart with D3.js
 * 
 * Features:
 * - Donut chart with center statistics
 * - Animated arc transitions
 * - Interactive legend
 * - Percentage labels on arcs
 * - RTL text positioning support
 * - Hover expansion effects
 * - Click handlers for drill-down
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.2, 3.2, 3.3, 3.8)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { CategoryData } from '@/types/dashboard-data.types';
import { getAllChartColors } from '@/lib/chart-colors';

/**
 * Hierarchical category data for drill-down
 */
export interface HierarchicalCategoryData extends CategoryData {
  /** Child categories for drill-down */
  children?: HierarchicalCategoryData[];
  /** Parent category reference */
  parent?: string;
  /** Level in hierarchy (0 = root) */
  level?: number;
}

/**
 * Props for AdvancedDonutChart component
 */
export interface AdvancedDonutChartProps {
  /** Array of category data points */
  data: CategoryData[] | HierarchicalCategoryData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 400px) */
  height?: number;
  /** Inner radius ratio (0-1, default 0.6 for donut) */
  innerRadiusRatio?: number;
  /** Outer radius ratio (0-1, default 0.9) */
  outerRadiusRatio?: number;
  /** Color palette for arcs */
  colors?: string[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when arc is clicked */
  onArcClick?: (data: CategoryData) => void;
  /** Callback when arc is hovered */
  onArcHover?: (data: CategoryData | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show percentage labels on arcs */
  showPercentageLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Center statistic label */
  centerLabel?: string;
  /** Custom center value (if not provided, uses total) */
  centerValue?: number;
  /** Corner radius for arcs */
  cornerRadius?: number;
  /** Padding angle between arcs (in radians) */
  padAngle?: number;
  /** Hover expansion amount (in pixels) */
  hoverExpansion?: number;
  /** Enable drill-down functionality */
  enableDrillDown?: boolean;
  /** Callback when drill-down level changes */
  onDrillDownChange?: (path: string[]) => void;
}

/**
 * Internal data point structure with computed values
 */
interface DataPointWithPercentage extends CategoryData {
  percentage: number;
  startAngle?: number;
  endAngle?: number;
}

/**
 * AdvancedDonutChart Component
 * 
 * A D3-powered donut chart with smooth animations, hover expansion, center statistics,
 * and interactive legend. Supports RTL layouts and theme switching.
 */
export const AdvancedDonutChart: React.FC<AdvancedDonutChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 400,
  innerRadiusRatio = 0.6,
  outerRadiusRatio = 0.9,
  colors,
  animated = true,
  interactive = true,
  onArcClick,
  onArcHover,
  valueFormatter,
  showPercentageLabels = true,
  showLegend = true,
  centerLabel,
  centerValue,
  cornerRadius = 4,
  padAngle = 0.02,
  hoverExpansion = 12,
  enableDrillDown = false,
  onDrillDownChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredArc, setHoveredArc] = useState<string | null>(null);
  const [drillDownPath, setDrillDownPath] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: DataPointWithPercentage | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Get current level data based on drill-down path
  const getCurrentLevelData = useMemo(() => {
    if (!enableDrillDown || drillDownPath.length === 0) {
      return data;
    }

    let currentData: (CategoryData | HierarchicalCategoryData)[] = data;
    for (const pathSegment of drillDownPath) {
      const item = currentData.find(d => d.category === pathSegment) as HierarchicalCategoryData | undefined;
      if (item && item.children) {
        currentData = item.children;
      } else {
        return data; // Fallback to root if path is invalid
      }
    }
    return currentData;
  }, [data, drillDownPath, enableDrillDown]);

  // Process and normalize data with percentages
  const processedData = useMemo<DataPointWithPercentage[]>(() => {
    const currentData = getCurrentLevelData;
    if (!currentData || currentData.length === 0) return [];
    
    const total = d3.sum(currentData, (d: CategoryData | HierarchicalCategoryData) => d.value);
    
    return currentData.map((d: CategoryData | HierarchicalCategoryData) => ({
      ...d,
      percentage: total > 0 ? (d.value / total) * 100 : 0,
    }));
  }, [getCurrentLevelData]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return centerValue !== undefined ? centerValue : d3.sum(processedData, d => d.value);
  }, [processedData, centerValue]);

  // Get color palette
  const colorPalette = useMemo(() => {
    if (colors) return colors;
    return getAllChartColors();
  }, [colors]);

  // Default value formatter
  const defaultValueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const formatValue = valueFormatter || defaultValueFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedData.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth;
    const height = propHeight;
    const radius = Math.min(width, height) / 2 - 60; // Leave space for legend

    if (radius <= 0) return;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create main group for the donut
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Theme-aware colors
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const borderColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    const mutedTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

    // Arc generators
    const arc = d3.arc<d3.PieArcDatum<DataPointWithPercentage>>()
      .innerRadius(radius * innerRadiusRatio)
      .outerRadius(radius * outerRadiusRatio)
      .cornerRadius(cornerRadius);

    const arcHover = d3.arc<d3.PieArcDatum<DataPointWithPercentage>>()
      .innerRadius(radius * innerRadiusRatio - 2)
      .outerRadius(radius * outerRadiusRatio + hoverExpansion)
      .cornerRadius(cornerRadius);

    // Pie layout
    const pie = d3.pie<DataPointWithPercentage>()
      .value(d => d.value)
      .sort(null)
      .padAngle(padAngle);

    const pieData = pie(processedData);

    // Draw arcs
    const arcs = chartGroup.selectAll('.arc')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'arc');

    const paths = arcs.append('path')
      .attr('fill', (d, i) => d.data.color || colorPalette[i % colorPalette.length])
      .attr('stroke', borderColor)
      .attr('stroke-width', 3)
      .style('cursor', interactive ? 'pointer' : 'default')
      .attr('opacity', 0);

    // Animate arcs
    if (animated) {
      paths
        .transition()
        .duration(1000)
        .delay((d, i) => i * 150)
        .ease(d3.easeCubicOut)
        .attr('opacity', 0.9)
        .attrTween('d', function(d) {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function(t) {
            return arc(interpolate(t) as any) as string;
          };
        });
    } else {
      paths
        .attr('opacity', 0.9)
        .attr('d', arc as any);
    }

    // Add percentage labels on arcs
    if (showPercentageLabels) {
      const labels = arcs.append('text')
        .attr('transform', d => {
          const [x, y] = arc.centroid(d);
          return `translate(${x},${y})`;
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('opacity', 0)
        .text(d => d.data.percentage >= 5 ? `${d.data.percentage.toFixed(0)}%` : '');

      if (animated) {
        labels
          .transition()
          .duration(600)
          .delay((d, i) => i * 150 + 1000)
          .attr('opacity', 1);
      } else {
        labels.attr('opacity', 1);
      }
    }

    // Interactive effects
    if (interactive) {
      paths
        .on('mouseenter', function(event, d) {
          const path = d3.select(this);
          
          // Expand arc with elastic effect
          path
            .transition()
            .duration(300)
            .ease(d3.easeElastic.period(0.4))
            .attr('d', arcHover as any)
            .attr('opacity', 1);

          // Dim other arcs
          arcs.selectAll('path')
            .filter(function(p: any) { return p !== d; })
            .transition()
            .duration(200)
            .attr('opacity', 0.3);

          setHoveredArc(d.data.category);

          // Calculate tooltip position
          const [cx, cy] = arc.centroid(d);
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: width / 2 + cx,
            y: height / 2 + cy,
            data: d.data
          });

          if (onArcHover) {
            onArcHover(d.data);
          }
        })
        .on('mousemove', function(event, d) {
          const [cx, cy] = arc.centroid(d);
          setTooltip(prev => ({
            ...prev,
            x: width / 2 + cx,
            y: height / 2 + cy
          }));
        })
        .on('mouseleave', function(event, d) {
          const path = d3.select(this);
          
          // Restore arc
          path
            .transition()
            .duration(300)
            .attr('d', arc as any)
            .attr('opacity', 0.9);

          // Restore other arcs
          arcs.selectAll('path')
            .transition()
            .duration(200)
            .attr('opacity', 0.9);

          setHoveredArc(null);
          setTooltip(prev => ({ ...prev, visible: false }));

          if (onArcHover) {
            onArcHover(null);
          }
        })
        .on('click', function(event, d) {
          // Handle drill-down
          if (enableDrillDown && (d.data as any).children && (d.data as any).children.length > 0) {
            const newPath = [...drillDownPath, d.data.category];
            setDrillDownPath(newPath);
            if (onDrillDownChange) {
              onDrillDownChange(newPath);
            }
          }
          
          if (onArcClick) {
            onArcClick(d.data);
          }
        });
    }

    // Center statistics
    const centerGroup = chartGroup.append('g')
      .attr('class', 'center-stats');

    // Center value
    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -15)
      .attr('fill', textColor)
      .attr('font-size', '36px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(formatValue(totalValue))
      .transition()
      .duration(800)
      .delay(animated ? 1500 : 0)
      .attr('opacity', 1);

    // Center label
    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 15)
      .attr('fill', mutedTextColor)
      .attr('font-size', '14px')
      .attr('opacity', 0)
      .text(centerLabel || t('charts.total', 'Total'))
      .transition()
      .duration(800)
      .delay(animated ? 1500 : 0)
      .attr('opacity', 0.7);

    // Legend
    if (showLegend) {
      const legendX = isRTL ? -radius - 50 : radius + 50;
      const legend = chartGroup.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, ${-radius + 30})`);

      processedData.forEach((d, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 28})`)
          .attr('opacity', 0)
          .style('cursor', interactive ? 'pointer' : 'default');

        // Color box
        legendRow.append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('rx', 4)
          .attr('fill', d.color || colorPalette[i % colorPalette.length])
          .attr('x', isRTL ? 82 : 0);

        // Category name
        legendRow.append('text')
          .attr('x', isRTL ? 76 : 26)
          .attr('y', 13)
          .attr('fill', textColor)
          .attr('font-size', '12px')
          .attr('text-anchor', isRTL ? 'end' : 'start')
          .text(d.category);

        // Value
        legendRow.append('text')
          .attr('x', isRTL ? -10 : 106)
          .attr('y', 13)
          .attr('fill', mutedTextColor)
          .attr('font-size', '11px')
          .attr('opacity', 0.8)
          .attr('text-anchor', isRTL ? 'start' : 'end')
          .text(formatValue(d.value));

        // Animate legend
        if (animated) {
          legendRow
            .transition()
            .duration(500)
            .delay(2000 + i * 100)
            .attr('opacity', 1);
        } else {
          legendRow.attr('opacity', 1);
        }

        // Interactive legend
        if (interactive) {
          legendRow
            .on('mouseenter', function() {
              // Highlight corresponding arc
              arcs.selectAll('path')
                .filter((p: any) => p.data.category === d.category)
                .transition()
                .duration(300)
                .ease(d3.easeElastic.period(0.4))
                .attr('d', arcHover as any)
                .attr('opacity', 1);

              // Dim other arcs
              arcs.selectAll('path')
                .filter((p: any) => p.data.category !== d.category)
                .transition()
                .duration(200)
                .attr('opacity', 0.3);

              setHoveredArc(d.category);
            })
            .on('mouseleave', function() {
              // Restore all arcs
              arcs.selectAll('path')
                .transition()
                .duration(300)
                .attr('d', arc as any)
                .attr('opacity', 0.9);

              setHoveredArc(null);
            })
            .on('click', function() {
              if (onArcClick) {
                onArcClick(d);
              }
            });
        }
      });
    }

  }, [processedData, theme, isRTL, animated, interactive, colorPalette, showPercentageLabels, showLegend, propWidth, propHeight, formatValue, totalValue, centerLabel, innerRadiusRatio, outerRadiusRatio, cornerRadius, padAngle, hoverExpansion, onArcClick, onArcHover, t]);

  // Handle empty data
  if (!processedData || processedData.length === 0) {
    return (
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">{t('charts.noData', 'No data available')}</p>
        </div>
      </div>
    );
  }

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (index: number) => {
    const newPath = drillDownPath.slice(0, index);
    setDrillDownPath(newPath);
    if (onDrillDownChange) {
      onDrillDownChange(newPath);
    }
  };

  // Check if current item has children for drill-down indicator
  const hasChildren = (item: any) => {
    return enableDrillDown && item.children && item.children.length > 0;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Breadcrumb navigation */}
      {enableDrillDown && drillDownPath.length > 0 && (
        <div className={`mb-4 flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => {
              setDrillDownPath([]);
              if (onDrillDownChange) {
                onDrillDownChange([]);
              }
            }}
            className="text-primary hover:underline font-medium"
          >
            {t('charts.home', 'Home')}
          </button>
          {drillDownPath.map((segment, index) => (
            <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{isRTL ? '←' : '→'}</span>
              <button
                onClick={() => handleBreadcrumbClick(index + 1)}
                className={`hover:underline ${
                  index === drillDownPath.length - 1
                    ? 'text-foreground font-semibold'
                    : 'text-primary'
                }`}
              >
                {segment}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <svg 
        ref={svgRef} 
        className="w-full" 
        role="img"
        aria-label={t('charts.donutChart', 'Donut chart visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x + 20}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x + 20 : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            maxWidth: '280px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {tooltip.data.category}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: tooltip.data.color || colorPalette[0] }}
                ></div>
                <span className="text-muted-foreground">{t('charts.value', 'Value')}:</span>
              </div>
              <span className="font-bold">{formatValue(tooltip.data.value)}</span>
            </div>
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.percentage', 'Percentage')}:</span>
              <span className="font-medium">{tooltip.data.percentage.toFixed(1)}%</span>
            </div>
            {(tooltip.data.metadata && Object.keys(tooltip.data.metadata).length > 0) || hasChildren(tooltip.data) ? (
              <div className="pt-1.5 mt-1.5 border-t border-border/50">
                <span className="text-muted-foreground text-xs">
                  {hasChildren(tooltip.data)
                    ? t('charts.clickToDrillDown', 'Click to drill down')
                    : t('charts.clickForDetails', 'Click for more details')}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default AdvancedDonutChart;
