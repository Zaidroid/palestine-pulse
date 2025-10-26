/**
 * Sankey Flow Chart with D3.js
 * 
 * Features:
 * - Node and link rendering with D3 Sankey layout
 * - Flow animations along paths
 * - Interactive node dragging
 * - Tooltips with flow details
 * - RTL flow direction support
 * - Minimum flow threshold filtering
 * - Node selection to highlight paths
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 2.3, 3.2, 3.3, 3.8, 8.4, 8.5)
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  sankey, 
  sankeyLinkHorizontal, 
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
  SankeyNode, 
  SankeyLink 
} from 'd3-sankey';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTranslation } from 'react-i18next';
import { FlowData } from '@/types/dashboard-data.types';
import { getAllChartColors } from '@/lib/chart-colors';

/**
 * Extended Sankey node with additional properties
 */
interface ExtendedSankeyNode {
  name: string;
  color?: string;
  metadata?: any;
}

/**
 * Extended Sankey link with additional properties
 */
interface ExtendedSankeyLink {
  source: number | string;
  target: number | string;
  value: number;
  metadata?: any;
}

/**
 * Props for SankeyFlowChart component
 */
export interface SankeyFlowChartProps {
  /** Array of flow data points */
  data: FlowData[];
  /** Width of the chart (optional, defaults to container width) */
  width?: number;
  /** Height of the chart (optional, defaults to 600px) */
  height?: number;
  /** Margin configuration */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Color palette for nodes */
  colors?: string[];
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Enable/disable node dragging */
  enableDragging?: boolean;
  /** Callback when node is clicked */
  onNodeClick?: (node: string) => void;
  /** Callback when link is clicked */
  onLinkClick?: (link: FlowData) => void;
  /** Callback when node is hovered */
  onNodeHover?: (node: string | null) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Minimum flow threshold (0-1, filters out small flows) */
  minFlowThreshold?: number;
  /** Selected node to highlight paths */
  selectedNode?: string | null;
  /** Node padding (vertical space between nodes) */
  nodePadding?: number;
  /** Node width */
  nodeWidth?: number;
  /** Number of iterations for layout optimization */
  iterations?: number;
  /** Node alignment: 'left' | 'right' | 'center' | 'justify' */
  nodeAlign?: 'left' | 'right' | 'center' | 'justify';
}

/**
 * SankeyFlowChart Component
 * 
 * A D3-powered Sankey diagram showing flows between nodes with smooth animations,
 * interactive dragging, and path highlighting. Supports RTL layouts and theme switching.
 */
export const SankeyFlowChart: React.FC<SankeyFlowChartProps> = ({
  data,
  width: propWidth,
  height: propHeight = 600,
  margin: propMargin,
  colors,
  animated = true,
  interactive = true,
  enableDragging = true,
  onNodeClick,
  onLinkClick,
  onNodeHover,
  valueFormatter,
  minFlowThreshold = 0,
  selectedNode = null,
  nodePadding = 20,
  nodeWidth = 20,
  iterations = 6,
  nodeAlign = 'justify',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemePreference();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<{ source: string; target: string } | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: 'node' | 'link';
    data: any;
  }>({ visible: false, x: 0, y: 0, type: 'node', data: null });

  // Adjust margins based on RTL
  const margin = useMemo(() => {
    if (propMargin) return propMargin;
    return isRTL 
      ? { top: 20, right: 150, bottom: 20, left: 150 }
      : { top: 20, right: 150, bottom: 20, left: 150 };
  }, [propMargin, isRTL]);

  // Process and filter data
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { nodes: [], links: [] };
    
    // Filter by minimum threshold
    const totalFlow = d3.sum(data, d => d.value);
    const filteredData = minFlowThreshold > 0
      ? data.filter(d => d.value / totalFlow >= minFlowThreshold)
      : data;

    // Extract unique nodes
    const nodeNames = new Set<string>();
    filteredData.forEach(d => {
      nodeNames.add(d.source);
      nodeNames.add(d.target);
    });

    const nodes: ExtendedSankeyNode[] = Array.from(nodeNames).map(name => ({
      name,
      metadata: {},
    }));

    // Create links
    const links: ExtendedSankeyLink[] = filteredData.map(d => ({
      source: nodes.findIndex(n => n.name === d.source),
      target: nodes.findIndex(n => n.name === d.target),
      value: d.value,
      metadata: d.metadata,
    }));

    return { nodes, links };
  }, [data, minFlowThreshold]);

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

  // Get node alignment function
  const getNodeAlign = (align: string) => {
    switch (align) {
      case 'left': return sankeyLeft;
      case 'right': return sankeyRight;
      case 'center': return sankeyCenter;
      case 'justify':
      default: return sankeyJustify;
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || processedData.nodes.length === 0) return;

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
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const linkColor = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    const linkHoverColor = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    // Create Sankey generator
    const sankeyGenerator = sankey<any, any>()
      .nodeId((d: any) => d.name)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([[0, 0], [width, height]])
      .nodeAlign(getNodeAlign(nodeAlign))
      .iterations(iterations);

    // Generate Sankey layout
    const graph = sankeyGenerator({
      nodes: processedData.nodes.map(d => ({ ...d })),
      links: processedData.links.map(d => ({ ...d })),
    });
    
    const nodes = graph.nodes;
    const links = graph.links;

    // Assign colors to nodes
    nodes.forEach((node: any, i: number) => {
      node.color = node.color || colorPalette[i % colorPalette.length];
    });

    // Helper function to check if node/link is highlighted
    const isHighlighted = (node: any) => {
      if (!selectedNode) return true;
      if (node.name === selectedNode) return true;
      
      // Check if node is connected to selected node
      const connectedLinks = links.filter(
        (l: any) => (l.source as any).name === selectedNode || 
             (l.target as any).name === selectedNode
      );
      
      return connectedLinks.some(
        (l: any) => (l.source as any).name === node.name || 
             (l.target as any).name === node.name
      );
    };

    const isLinkHighlighted = (link: any) => {
      if (!selectedNode) return true;
      return (link.source as any).name === selectedNode || 
             (link.target as any).name === selectedNode;
    };

    // Draw links
    const linkGroup = svg.append('g')
      .attr('class', 'links')
      .attr('fill', 'none');

    const linkPaths = linkGroup.selectAll('.link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'link');

    const linkPathElements = linkPaths.append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => {
        const sourceNode = d.source as any;
        return sourceNode.color || linkColor;
      })
      .attr('stroke-width', (d: any) => Math.max(1, d.width || 0))
      .attr('opacity', (d: any) => isLinkHighlighted(d) ? 0.5 : 0.15)
      .style('cursor', interactive ? 'pointer' : 'default');

    // Animate links
    if (animated) {
      linkPathElements
        .attr('stroke-dasharray', function() {
          const length = (this as SVGPathElement).getTotalLength();
          return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function() {
          return (this as SVGPathElement).getTotalLength();
        })
        .transition()
        .duration(2000)
        .delay((d, i) => i * 50)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', function() {
          d3.select(this).attr('stroke-dasharray', 'none');
        });
    }

    // Interactive link effects
    if (interactive) {
      linkPaths
        .on('mouseenter', function(event, d: any) {
          const sourceNode = d.source as any;
          const targetNode = d.target as any;
          
          // Highlight link
          d3.select(this).select('path')
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke-width', Math.max(2, (d.width || 0) + 2));

          setHoveredLink({ source: sourceNode.name, target: targetNode.name });

          // Calculate tooltip position
          const path = this.querySelector('path') as SVGPathElement;
          const pathLength = path.getTotalLength();
          const midPoint = path.getPointAtLength(pathLength / 2);
          
          setTooltip({
            visible: true,
            x: margin.left + midPoint.x,
            y: margin.top + midPoint.y,
            type: 'link',
            data: {
              source: sourceNode.name,
              target: targetNode.name,
              value: d.value,
              metadata: d.metadata,
            }
          });
        })
        .on('mouseleave', function(event, d: any) {
          // Restore link
          d3.select(this).select('path')
            .transition()
            .duration(200)
            .attr('opacity', isLinkHighlighted(d) ? 0.5 : 0.15)
            .attr('stroke-width', Math.max(1, d.width || 0));

          setHoveredLink(null);
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', function(event, d: any) {
          if (onLinkClick) {
            const sourceNode = d.source as any;
            const targetNode = d.target as any;
            onLinkClick({
              source: sourceNode.name,
              target: targetNode.name,
              value: d.value || 0,
              metadata: d.metadata,
            });
          }
        });
    }

    // Draw nodes
    const nodeGroup = svg.append('g')
      .attr('class', 'nodes');

    const nodeElements = nodeGroup.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Node rectangles
    const nodeRects = nodeElements.append('rect')
      .attr('height', (d: any) => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', nodeWidth)
      .attr('fill', (d: any) => d.color || colorPalette[0])
      .attr('stroke', theme === 'dark' ? '#1f2937' : '#ffffff')
      .attr('stroke-width', 2)
      .attr('rx', 4)
      .attr('opacity', (d: any) => isHighlighted(d) ? 0.9 : 0.3)
      .style('cursor', interactive ? (enableDragging ? 'move' : 'pointer') : 'default');

    // Animate nodes
    if (animated) {
      nodeRects
        .attr('height', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .ease(d3.easeCubicOut)
        .attr('height', (d: any) => (d.y1 || 0) - (d.y0 || 0));
    }

    // Node labels
    const nodeLabels = nodeElements.append('text')
      .attr('x', (d: any) => {
        // Position label based on node position
        const isLeftSide = (d.x0 || 0) < width / 2;
        return isRTL ? (isLeftSide ? nodeWidth + 6 : -6) : (isLeftSide ? -6 : nodeWidth + 6);
      })
      .attr('y', (d: any) => ((d.y1 || 0) - (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => {
        const isLeftSide = (d.x0 || 0) < width / 2;
        if (isRTL) {
          return isLeftSide ? 'start' : 'end';
        }
        return isLeftSide ? 'end' : 'start';
      })
      .attr('fill', textColor)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text((d: any) => d.name);

    if (animated) {
      nodeLabels
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 1000)
        .attr('opacity', 1);
    }

    // Node value labels
    const nodeValueLabels = nodeElements.append('text')
      .attr('x', (d: any) => {
        const isLeftSide = (d.x0 || 0) < width / 2;
        return isRTL ? (isLeftSide ? nodeWidth + 6 : -6) : (isLeftSide ? -6 : nodeWidth + 6);
      })
      .attr('y', (d: any) => ((d.y1 || 0) - (d.y0 || 0)) / 2 + 16)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => {
        const isLeftSide = (d.x0 || 0) < width / 2;
        if (isRTL) {
          return isLeftSide ? 'start' : 'end';
        }
        return isLeftSide ? 'end' : 'start';
      })
      .attr('fill', textColor)
      .attr('font-size', '10px')
      .attr('opacity', 0.7)
      .text((d: any) => formatValue(d.value || 0));

    if (animated) {
      nodeValueLabels
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 1000)
        .attr('opacity', 0.7);
    }

    // Interactive node effects
    if (interactive) {
      nodeElements
        .on('mouseenter', function(event, d: any) {
          // Highlight node
          d3.select(this).select('rect')
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke-width', 3);

          // Highlight connected links
          linkPaths.each(function(l: any) {
            const sourceNode = l.source as any;
            const targetNode = l.target as any;
            if (sourceNode.name === d.name || targetNode.name === d.name) {
              d3.select(this).select('path')
                .transition()
                .duration(200)
                .attr('opacity', 0.8);
            }
          });

          setHoveredNode(d.name);

          // Calculate tooltip position
          const rect = this.querySelector('rect') as SVGRectElement;
          const bbox = rect.getBBox();
          
          setTooltip({
            visible: true,
            x: margin.left + (d.x0 || 0) + nodeWidth / 2,
            y: margin.top + (d.y0 || 0) + bbox.height / 2,
            type: 'node',
            data: {
              name: d.name,
              value: d.value,
              metadata: d.metadata,
            }
          });

          if (onNodeHover) {
            onNodeHover(d.name);
          }
        })
        .on('mouseleave', function(event, d: any) {
          // Restore node
          d3.select(this).select('rect')
            .transition()
            .duration(200)
            .attr('opacity', isHighlighted(d) ? 0.9 : 0.3)
            .attr('stroke-width', 2);

          // Restore links
          linkPaths.each(function(l: any) {
            d3.select(this).select('path')
              .transition()
              .duration(200)
              .attr('opacity', isLinkHighlighted(l) ? 0.5 : 0.15);
          });

          setHoveredNode(null);
          setTooltip(prev => ({ ...prev, visible: false }));

          if (onNodeHover) {
            onNodeHover(null);
          }
        })
        .on('click', function(event, d: any) {
          if (onNodeClick) {
            onNodeClick(d.name);
          }
        });

      // Node dragging
      if (enableDragging) {
        const drag = d3.drag<SVGGElement, any>()
          .on('start', function(event, d) {
            d3.select(this).raise();
          })
          .on('drag', function(event, d) {
            const y = Math.max(0, Math.min(height - ((d.y1 || 0) - (d.y0 || 0)), event.y));
            const heightDiff = (d.y1 || 0) - (d.y0 || 0);
            d.y0 = y;
            d.y1 = y + heightDiff;
            
            d3.select(this)
              .attr('transform', `translate(${d.x0},${d.y0})`);

            // Update connected links
            sankeyGenerator.update(graph);
            linkPathElements.attr('d', sankeyLinkHorizontal());
          })
          .on('end', function(event, d) {
            // Snap to final position
            sankeyGenerator.update(graph);
            linkPathElements
              .transition()
              .duration(300)
              .attr('d', sankeyLinkHorizontal());
          });

        nodeElements.call(drag as any);
      }
    }

  }, [processedData, theme, isRTL, animated, interactive, enableDragging, colorPalette, propWidth, propHeight, margin, formatValue, selectedNode, nodePadding, nodeWidth, iterations, nodeAlign, onNodeClick, onLinkClick, onNodeHover]);

  // Handle empty data
  if (!processedData || processedData.nodes.length === 0) {
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
        aria-label={t('charts.sankeyChart', 'Sankey flow diagram visualization')}
      />
      {tooltip.visible && tooltip.data && (
        <div
          className={`absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-50 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            left: isRTL ? 'auto' : `${tooltip.x}px`,
            right: isRTL ? `${containerRef.current ? containerRef.current.clientWidth - tooltip.x : 0}px` : 'auto',
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '280px'
          }}
        >
          {tooltip.type === 'node' ? (
            <>
              <div className="font-semibold mb-2 text-sm">
                {tooltip.data.name}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('charts.totalFlow', 'Total Flow')}:</span>
                  <span className="font-bold">{formatValue(tooltip.data.value)}</span>
                </div>
                {enableDragging && (
                  <div className="pt-1.5 mt-1.5 border-t border-border/50">
                    <span className="text-muted-foreground text-xs">
                      {t('charts.dragToReposition', 'Drag to reposition')}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold mb-2 text-sm">
                {tooltip.data.source} → {tooltip.data.target}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('charts.flow', 'Flow')}:</span>
                  <span className="font-bold">{formatValue(tooltip.data.value)}</span>
                </div>
                {tooltip.data.metadata && Object.keys(tooltip.data.metadata).length > 0 && (
                  <div className="pt-1.5 mt-1.5 border-t border-border/50">
                    <span className="text-muted-foreground text-xs">
                      {t('charts.clickForDetails', 'Click for more details')}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default SankeyFlowChart;
