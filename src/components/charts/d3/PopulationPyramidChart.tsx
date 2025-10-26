/**
 * Population Pyramid Chart with D3.js
 * 
 * Features:
 * - Age group bars for male/female
 * - Center axis with age labels
 * - Tooltips with demographic details
 * - Percentage or absolute value toggle
 * - RTL mirroring support
 * - Hover interactions with visual feedback
 * - Animated bar transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.2, 3.2, 3.3)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { PyramidData } from '@/types/dashboard-data.types';
import { chartColorPalette } from '@/lib/chart-colors';

/**
 * Props for PopulationPyramidChart component
 */
export interface PopulationPyramidChartProps {
  /** Array of pyramid data points */
  data: PyramidData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 500px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Color for male bars */
  maleColor?: string;
  /** Color for female bars */
  femaleColor?: string;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when bar is clicked */
  onBarClick?: (data: PyramidData, gender: 'male' | 'female') => void;
  /** Callback when bar is hovered */
  onBarHover?: (data: PyramidData | null, gender?: 'male' | 'female') => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Display mode: absolute values or percentages */
  displayMode?: 'absolute' | 'percentage';
  /** Bar padding (0-1) */
  barPadding?: number;
  /** Show value labels on bars */
  showValueLabels?: boolean;
}

/**
 * Internal data point structure with computed values
 */
interface ProcessedPyramidData extends PyramidData {
  malePercentage: number;
  femalePercentage: number;
}

/**
 * PopulationPyramidChart Component
 * 
 * A D3-powered population pyramid showing age/gender distribution with mirrored bars.
 * Supports RTL layouts, theme switching, and smooth animations.
 */
export const PopulationPyramidChart: React.FC<PopulationPyramidChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 500,
  margin: propMargin,
  maleColor,
  femaleColor,
  animated = true,
  interactive = true,
  onBarClick,
  onBarHover,
  valueFormatter,
  showGrid = true,
  displayMode = 'absolute',
  barPadding = 0.15,
  showValueLabels = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredBar, setHoveredBar] = useState<{ ageGroup: string; gender: 'male' | 'female' } | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: ProcessedPyramidData | null;
    gender: 'male' | 'female' | null;
  }>({ visible: false, x: 0, y: 0, data: null, gender: null });

  // Adjust margins
  const margin = useMemo(() => {
    if (propMargin) return propMargin;
    return { top: 20, right: 40, bottom: 40, left: 40 };
  }, [propMargin]);

  // Process and normalize data with percentages
  const processedData = useMemo<ProcessedPyramidData[]>(() => {
    if (!data || data.length === 0) return [];
    
    const totalMale = d3.sum(data, d => d.male);
    const totalFemale = d3.sum(data, d => d.female);
    
    return data.map(d => ({
      ...d,
      total: d.total || d.male + d.female,
      malePercentage: totalMale > 0 ? (d.male / totalMale) * 100 : 0,
      femalePercentage: totalFemale > 0 ? (d.female / totalFemale) * 100 : 0,
    }));
  }, [data]);

  // Get colors
  const colors = useMemo(() => {
    const defaultMaleColor = chartColorPalette.info; // Blue for male
    const defaultFemaleColor = chartColorPalette.highlight; // Pink for female
    
    return {
      male: maleColor || defaultMaleColor,
      female: femaleColor || defaultFemaleColor,
    };
  }, [maleColor, femaleColor, theme]);

  // Default value formatter
  const defaultValueFormatter = (value: number) => {
    if (displayMode === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const formatValue = valueFormatter || defaultValueFormatter;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedData.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const containerWidth = propWidth || containerRef.current.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = propHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Theme-aware colors
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const centerLineColor = theme === 'dark' ? '#4b5563' : '#9ca3af';

    // Calculate max value for scale
    const maxValue = displayMode === 'percentage'
      ? d3.max(processedData, d => Math.max(d.malePercentage, d.femalePercentage)) as number
      : d3.max(processedData, d => Math.max(d.male, d.female)) as number;

    // Scales
    const yScale = d3.scaleBand()
      .domain(processedData.map(d => d.ageGroup))
      .range([0, height])
      .padding(barPadding);

    // X scale for male (left side)
    const xScaleMale = d3.scaleLinear()
      .domain([0, maxValue])
      .range(isRTL ? [width / 2, width] : [width / 2, 0]);

    // X scale for female (right side)
    const xScaleFemale = d3.scaleLinear()
      .domain([0, maxValue])
      .range(isRTL ? [0, width / 2] : [width / 2, width]);

    // Grid (if enabled)
    if (showGrid) {
      // Vertical grid lines for male side
      const maleGridValues = xScaleMale.ticks(5);
      svg.append('g')
        .attr('class', 'grid-male')
        .selectAll('line')
        .data(maleGridValues)
        .enter()
        .append('line')
        .attr('x1', d => xScaleMale(d))
        .attr('x2', d => xScaleMale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', gridColor)
        .attr('stroke-dasharray', '2,2')
        .attr('opacity', 0.5);

      // Vertical grid lines for female side
      const femaleGridValues = xScaleFemale.ticks(5);
      svg.append('g')
        .attr('class', 'grid-female')
        .selectAll('line')
        .data(femaleGridValues)
        .enter()
        .append('line')
        .attr('x1', d => xScaleFemale(d))
        .attr('x2', d => xScaleFemale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', gridColor)
        .attr('stroke-dasharray', '2,2')
        .attr('opacity', 0.5);
    }

    // Center line
    svg.append('line')
      .attr('x1', width / 2)
      .attr('x2', width / 2)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', centerLineColor)
      .attr('stroke-width', 2);

    // Male bars (left side)
    const maleBars = svg.append('g')
      .attr('class', 'male-bars')
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('class', 'male-bar')
      .attr('fill', colors.male)
      .attr('stroke', 'none')
      .attr('y', d => yScale(d.ageGroup) as number)
      .attr('height', yScale.bandwidth())
      .style('cursor', interactive ? 'pointer' : 'default')
      .attr('opacity', 0.85);

    // Initial position for male bars
    maleBars
      .attr('x', width / 2)
      .attr('width', 0);

    // Animate male bars
    if (animated) {
      maleBars
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .ease(d3.easeCubicOut)
        .attr('x', d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return Math.min(xScaleMale(value), xScaleMale(0));
        })
        .attr('width', d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return Math.abs(xScaleMale(0) - xScaleMale(value));
        });
    } else {
      maleBars
        .attr('x', d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return Math.min(xScaleMale(value), xScaleMale(0));
        })
        .attr('width', d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return Math.abs(xScaleMale(0) - xScaleMale(value));
        });
    }

    // Female bars (right side)
    const femaleBars = svg.append('g')
      .attr('class', 'female-bars')
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('class', 'female-bar')
      .attr('fill', colors.female)
      .attr('stroke', 'none')
      .attr('y', d => yScale(d.ageGroup) as number)
      .attr('height', yScale.bandwidth())
      .style('cursor', interactive ? 'pointer' : 'default')
      .attr('opacity', 0.85);

    // Initial position for female bars
    femaleBars
      .attr('x', width / 2)
      .attr('width', 0);

    // Animate female bars
    if (animated) {
      femaleBars
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .ease(d3.easeCubicOut)
        .attr('x', width / 2)
        .attr('width', d => {
          const value = displayMode === 'percentage' ? d.femalePercentage : d.female;
          return Math.abs(xScaleFemale(value) - xScaleFemale(0));
        });
    } else {
      femaleBars
        .attr('x', width / 2)
        .attr('width', d => {
          const value = displayMode === 'percentage' ? d.femalePercentage : d.female;
          return Math.abs(xScaleFemale(value) - xScaleFemale(0));
        });
    }

    // Interactive effects for male bars
    if (interactive) {
      maleBars
        .on('mouseenter', function(event, d) {
          const bar = d3.select(this);
          
          // Highlight effect
          bar
            .attr('opacity', 1)
            .attr('stroke', textColor)
            .attr('stroke-width', 2);

          // Dim other bars
          svg.selectAll('.male-bar, .female-bar')
            .filter(function(p: any) { return p !== d; })
            .transition()
            .duration(200)
            .attr('opacity', 0.3);

          setHoveredBar({ ageGroup: d.ageGroup, gender: 'male' });

          // Calculate tooltip position
          const rect = (this as SVGRectElement).getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            data: d,
            gender: 'male'
          });

          if (onBarHover) {
            onBarHover(d, 'male');
          }
        })
        .on('mouseleave', function(event, d) {
          const bar = d3.select(this);
          
          // Remove highlight
          bar
            .attr('opacity', 0.85)
            .attr('stroke', 'none');

          // Restore other bars
          svg.selectAll('.male-bar, .female-bar')
            .transition()
            .duration(200)
            .attr('opacity', 0.85);

          setHoveredBar(null);
          setTooltip(prev => ({ ...prev, visible: false }));

          if (onBarHover) {
            onBarHover(null);
          }
        })
        .on('click', function(event, d) {
          if (onBarClick) {
            onBarClick(d, 'male');
          }
        });

      // Interactive effects for female bars
      femaleBars
        .on('mouseenter', function(event, d) {
          const bar = d3.select(this);
          
          // Highlight effect
          bar
            .attr('opacity', 1)
            .attr('stroke', textColor)
            .attr('stroke-width', 2);

          // Dim other bars
          svg.selectAll('.male-bar, .female-bar')
            .filter(function(p: any) { return p !== d; })
            .transition()
            .duration(200)
            .attr('opacity', 0.3);

          setHoveredBar({ ageGroup: d.ageGroup, gender: 'female' });

          // Calculate tooltip position
          const rect = (this as SVGRectElement).getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            data: d,
            gender: 'female'
          });

          if (onBarHover) {
            onBarHover(d, 'female');
          }
        })
        .on('mouseleave', function(event, d) {
          const bar = d3.select(this);
          
          // Remove highlight
          bar
            .attr('opacity', 0.85)
            .attr('stroke', 'none');

          // Restore other bars
          svg.selectAll('.male-bar, .female-bar')
            .transition()
            .duration(200)
            .attr('opacity', 0.85);

          setHoveredBar(null);
          setTooltip(prev => ({ ...prev, visible: false }));

          if (onBarHover) {
            onBarHover(null);
          }
        })
        .on('click', function(event, d) {
          if (onBarClick) {
            onBarClick(d, 'female');
          }
        });
    }

    // Value labels (if enabled)
    if (showValueLabels) {
      // Male labels
      const maleLabels = svg.append('g')
        .attr('class', 'male-labels')
        .selectAll('text')
        .data(processedData)
        .enter()
        .append('text')
        .attr('fill', textColor)
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('y', d => (yScale(d.ageGroup) as number) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text(d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return formatValue(value);
        });

      maleLabels
        .attr('x', d => {
          const value = displayMode === 'percentage' ? d.malePercentage : d.male;
          return xScaleMale(value) + (isRTL ? 5 : -5);
        })
        .attr('text-anchor', isRTL ? 'start' : 'end');

      // Female labels
      const femaleLabels = svg.append('g')
        .attr('class', 'female-labels')
        .selectAll('text')
        .data(processedData)
        .enter()
        .append('text')
        .attr('fill', textColor)
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('y', d => (yScale(d.ageGroup) as number) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text(d => {
          const value = displayMode === 'percentage' ? d.femalePercentage : d.female;
          return formatValue(value);
        });

      femaleLabels
        .attr('x', d => {
          const value = displayMode === 'percentage' ? d.femalePercentage : d.female;
          return xScaleFemale(value) + (isRTL ? -5 : 5);
        })
        .attr('text-anchor', isRTL ? 'end' : 'start');

      if (animated) {
        maleLabels.attr('opacity', 0)
          .transition()
          .duration(600)
          .delay((d, i) => i * 50 + 1000)
          .attr('opacity', 1);

        femaleLabels.attr('opacity', 0)
          .transition()
          .duration(600)
          .delay((d, i) => i * 50 + 1000)
          .attr('opacity', 1);
      }
    }

    // Age group labels (center axis)
    const ageLabels = svg.append('g')
      .attr('class', 'age-labels')
      .selectAll('text')
      .data(processedData)
      .enter()
      .append('text')
      .attr('x', width / 2)
      .attr('y', d => (yScale(d.ageGroup) as number) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(d => d.ageGroup);

    if (animated) {
      ageLabels.attr('opacity', 0)
        .transition()
        .duration(600)
        .delay(800)
        .attr('opacity', 1);
    }

    // X-axis for male side
    const xAxisMale = d3.axisBottom(xScaleMale)
      .ticks(5)
      .tickFormat(d => formatValue(Math.abs(d as number)));

    const xAxisMaleGroup = svg.append('g')
      .attr('class', 'x-axis-male')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisMale);

    xAxisMaleGroup.selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px');

    // X-axis for female side
    const xAxisFemale = d3.axisBottom(xScaleFemale)
      .ticks(5)
      .tickFormat(d => formatValue(d as number));

    const xAxisFemaleGroup = svg.append('g')
      .attr('class', 'x-axis-female')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisFemale);

    xAxisFemaleGroup.selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px');

    // Style axes
    svg.selectAll('.domain, .tick line').attr('stroke', gridColor);

    // Gender labels
    const genderLabelY = height + 35;
    
    // Male label
    svg.append('text')
      .attr('x', isRTL ? width * 0.75 : width * 0.25)
      .attr('y', genderLabelY)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.male)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text(t('charts.male', 'Male'))
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay(animated ? 1200 : 0)
      .attr('opacity', 1);

    // Female label
    svg.append('text')
      .attr('x', isRTL ? width * 0.25 : width * 0.75)
      .attr('y', genderLabelY)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.female)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text(t('charts.female', 'Female'))
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay(animated ? 1200 : 0)
      .attr('opacity', 1);

  }, [processedData, theme, isRTL, animated, interactive, colors, showGrid, showValueLabels, 
      displayMode, propWidth, propHeight, margin, formatValue, barPadding, onBarClick, onBarHover, t]);

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

  return (
    <div ref={containerRef} className="relative w-full">
      <svg 
        ref={svgRef} 
        className="w-full" 
        role="img"
        aria-label={t('charts.populationPyramid', 'Population pyramid visualization')}
      />
      {tooltip.visible && tooltip.data && tooltip.gender && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '280px'
          }}
        >
          <div className="font-semibold mb-2 text-sm">
            {tooltip.data.ageGroup}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: tooltip.gender === 'male' ? colors.male : colors.female }}
                ></div>
                <span className="text-muted-foreground">
                  {tooltip.gender === 'male' ? t('charts.male', 'Male') : t('charts.female', 'Female')}:
                </span>
              </div>
              <span className="font-bold">
                {formatValue(tooltip.gender === 'male' 
                  ? (displayMode === 'percentage' ? tooltip.data.malePercentage : tooltip.data.male)
                  : (displayMode === 'percentage' ? tooltip.data.femalePercentage : tooltip.data.female)
                )}
              </span>
            </div>
            {displayMode === 'absolute' && (
              <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('charts.percentage', 'Percentage')}:</span>
                <span className="font-medium">
                  {(tooltip.gender === 'male' ? tooltip.data.malePercentage : tooltip.data.femalePercentage).toFixed(1)}%
                </span>
              </div>
            )}
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t('charts.total', 'Total')}:</span>
              <span className="font-medium">
                {displayMode === 'percentage' 
                  ? `${(tooltip.data.malePercentage + tooltip.data.femalePercentage).toFixed(1)}%`
                  : formatValue(tooltip.data.total || tooltip.data.male + tooltip.data.female)
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default PopulationPyramidChart;
