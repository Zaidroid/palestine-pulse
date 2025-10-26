/**
 * Small Multiples Chart with Filters
 * 
 * Wrapper component that adds filtering controls to SmallMultiplesChart:
 * - Region selection
 * - Scale synchronization toggle
 * - Animated chart transitions
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.4, 8.5, 8.7)
 */

import { useState, useMemo } from 'react';
import { SmallMultiplesChart, RegionalData } from './SmallMultiplesChart';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

/**
 * Props for SmallMultiplesChartWithFilters component
 */
export interface SmallMultiplesChartWithFiltersProps {
  /** Array of regional data */
  regions: RegionalData[];
  /** Width of the chart (optional) */
  width?: number;
  /** Height of the chart (optional) */
  height?: number;
  /** Number of columns in the grid */
  columns?: number;
  /** Enable/disable animations */
  animated?: boolean;
  /** Enable/disable interactivity */
  interactive?: boolean;
  /** Callback when region is clicked */
  onRegionClick?: (region: RegionalData) => void;
  /** Custom value formatter */
  valueFormatter?: (value: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show area fill under lines */
  showArea?: boolean;
  /** Show total labels */
  showTotals?: boolean;
  /** Initial scale synchronization state */
  initialSynchronizeScales?: boolean;
  /** Initial selected regions */
  initialSelectedRegions?: string[];
}

/**
 * SmallMultiplesChartWithFilters Component
 * 
 * Adds region filtering and scale synchronization controls to SmallMultiplesChart.
 */
export const SmallMultiplesChartWithFilters: React.FC<SmallMultiplesChartWithFiltersProps> = ({
  regions,
  width,
  height,
  columns = 2,
  animated = true,
  interactive = true,
  onRegionClick,
  valueFormatter,
  dateFormatter,
  showGrid = true,
  showArea = true,
  showTotals = true,
  initialSynchronizeScales = true,
  initialSelectedRegions,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Filter states
  const [synchronizeScales, setSynchronizeScales] = useState(initialSynchronizeScales);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    initialSelectedRegions || regions.map(r => r.region)
  );

  // Available regions
  const availableRegions = useMemo(() => {
    return regions.map(r => r.region);
  }, [regions]);

  // Toggle region selection
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        // Don't allow deselecting all regions
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };

  // Select all regions
  const selectAllRegions = () => {
    setSelectedRegions(availableRegions);
  };

  // Clear all regions (keep at least one)
  const clearRegions = () => {
    if (availableRegions.length > 0) {
      setSelectedRegions([availableRegions[0]]);
    }
  };

  // Check if all regions are selected
  const allRegionsSelected = selectedRegions.length === availableRegions.length;

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className={`flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-border ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Scale Synchronization Toggle */}
        <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Switch
              id="sync-scales"
              checked={synchronizeScales}
              onCheckedChange={setSynchronizeScales}
            />
            <Label htmlFor="sync-scales" className="cursor-pointer">
              {t('charts.synchronizeScales', 'Synchronize Scales')}
            </Label>
          </div>
          <Badge variant="outline" className="text-xs">
            {synchronizeScales 
              ? t('charts.synchronized', 'Synchronized') 
              : t('charts.independent', 'Independent')}
          </Badge>
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Label className="text-sm font-semibold">
              {t('charts.selectRegions', 'Select Regions')}
            </Label>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllRegions}
                disabled={allRegionsSelected}
                className="h-7 text-xs"
              >
                {t('charts.selectAll', 'Select All')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRegions}
                disabled={selectedRegions.length === 1}
                className="h-7 text-xs"
              >
                {t('charts.clear', 'Clear')}
              </Button>
            </div>
          </div>

          {/* Region Badges */}
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {availableRegions.map(region => {
              const isSelected = selectedRegions.includes(region);
              return (
                <Badge
                  key={region}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                    isSelected ? 'hover:opacity-80' : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleRegion(region)}
                >
                  <span>{region}</span>
                  {isSelected && selectedRegions.length > 1 && (
                    <X className={`h-3 w-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                  )}
                </Badge>
              );
            })}
          </div>

          {/* Selected count */}
          <div className="text-xs text-muted-foreground">
            {t('charts.regionsSelected', {
              count: selectedRegions.length,
              total: availableRegions.length,
              defaultValue: `${selectedRegions.length} of ${availableRegions.length} regions selected`
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <SmallMultiplesChart
        regions={regions}
        width={width}
        height={height}
        columns={columns}
        animated={animated}
        interactive={interactive}
        onRegionClick={onRegionClick}
        valueFormatter={valueFormatter}
        dateFormatter={dateFormatter}
        showGrid={showGrid}
        showArea={showArea}
        showTotals={showTotals}
        synchronizeScales={synchronizeScales}
        selectedRegions={selectedRegions}
      />
    </div>
  );
};

// Default export for lazy loading
export default SmallMultiplesChartWithFilters;
