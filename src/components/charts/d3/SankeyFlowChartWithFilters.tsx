/**
 * Sankey Flow Chart with Filtering Controls
 * 
 * Features:
 * - Minimum flow threshold filter
 * - Node selection to highlight paths
 * - Animated flow changes
 * - Filter controls UI
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.4, 8.5)
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SankeyFlowChart, SankeyFlowChartProps } from './SankeyFlowChart';
import { FlowData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

/**
 * Props for SankeyFlowChartWithFilters component
 */
export interface SankeyFlowChartWithFiltersProps extends Omit<SankeyFlowChartProps, 'minFlowThreshold' | 'selectedNode'> {
  /** Show filter controls */
  showFilters?: boolean;
  /** Initial minimum flow threshold (0-100) */
  initialThreshold?: number;
  /** Enable node selection filter */
  enableNodeSelection?: boolean;
}

/**
 * SankeyFlowChartWithFilters Component
 * 
 * Wraps SankeyFlowChart with filtering controls for minimum flow threshold
 * and node selection to highlight specific paths.
 */
export const SankeyFlowChartWithFilters: React.FC<SankeyFlowChartWithFiltersProps> = ({
  data,
  showFilters = true,
  initialThreshold = 0,
  enableNodeSelection = true,
  ...chartProps
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [minFlowThreshold, setMinFlowThreshold] = useState<number>(initialThreshold);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Extract unique node names from data
  const nodeNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach(d => {
      names.add(d.source);
      names.add(d.target);
    });
    return Array.from(names).sort();
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFlow = data.reduce((sum, d) => sum + d.value, 0);
    const thresholdValue = totalFlow * (minFlowThreshold / 100);
    const filteredData = data.filter(d => d.value >= thresholdValue);
    const filteredFlow = filteredData.reduce((sum, d) => sum + d.value, 0);
    
    return {
      totalFlows: data.length,
      filteredFlows: filteredData.length,
      totalFlow,
      filteredFlow,
      percentageShown: totalFlow > 0 ? (filteredFlow / totalFlow) * 100 : 0,
    };
  }, [data, minFlowThreshold]);

  // Handle node selection
  const handleNodeSelect = (value: string) => {
    if (value === 'all') {
      setSelectedNode(null);
    } else {
      setSelectedNode(value);
    }
  };

  // Handle threshold change
  const handleThresholdChange = (value: number[]) => {
    setMinFlowThreshold(value[0]);
  };

  // Reset filters
  const handleResetFilters = () => {
    setMinFlowThreshold(0);
    setSelectedNode(null);
  };

  const hasActiveFilters = minFlowThreshold > 0 || selectedNode !== null;

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-base font-semibold">
                {t('charts.filters', 'Filters')}
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className={`h-8 px-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <X className="h-3 w-3 mr-1" />
                  {t('charts.resetFilters', 'Reset')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Minimum Flow Threshold Filter */}
            <div className="space-y-2">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label htmlFor="flow-threshold" className="text-sm font-medium">
                  {t('charts.minFlowThreshold', 'Minimum Flow Threshold')}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {minFlowThreshold}%
                </span>
              </div>
              <Slider
                id="flow-threshold"
                min={0}
                max={50}
                step={1}
                value={[minFlowThreshold]}
                onValueChange={handleThresholdChange}
                className="w-full"
              />
              <div className={`flex items-center justify-between text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>
                  {t('charts.showing', 'Showing')} {stats.filteredFlows} / {stats.totalFlows} {t('charts.flows', 'flows')}
                </span>
                <span>
                  {stats.percentageShown.toFixed(1)}% {t('charts.ofTotalFlow', 'of total flow')}
                </span>
              </div>
            </div>

            {/* Node Selection Filter */}
            {enableNodeSelection && nodeNames.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="node-select" className="text-sm font-medium">
                  {t('charts.highlightNode', 'Highlight Node')}
                </Label>
                <Select
                  value={selectedNode || 'all'}
                  onValueChange={handleNodeSelect}
                >
                  <SelectTrigger id="node-select" className="w-full">
                    <SelectValue placeholder={t('charts.selectNode', 'Select a node')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('charts.allNodes', 'All Nodes')}
                    </SelectItem>
                    {nodeNames.map(name => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedNode && (
                  <p className="text-xs text-muted-foreground">
                    {t('charts.highlightingPaths', 'Highlighting paths connected to')} <span className="font-semibold">{selectedNode}</span>
                  </p>
                )}
              </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {t('charts.activeFilters', 'Active Filters')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {minFlowThreshold > 0 && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      <span>{t('charts.threshold', 'Threshold')}: {minFlowThreshold}%</span>
                      <button
                        onClick={() => setMinFlowThreshold(0)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedNode && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      <span>{t('charts.node', 'Node')}: {selectedNode}</span>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sankey Chart */}
      <SankeyFlowChart
        data={data}
        minFlowThreshold={minFlowThreshold / 100}
        selectedNode={selectedNode}
        {...chartProps}
      />
    </div>
  );
};

// Default export for lazy loading
export default SankeyFlowChartWithFilters;
