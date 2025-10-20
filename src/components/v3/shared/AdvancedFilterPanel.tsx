import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { X, Save, Trash2, RotateCcw } from "lucide-react";
import { DateRangeSelector } from "@/components/v3/shared/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useV3Store } from "@/store/v3Store";

interface AdvancedFilterPanelProps {
  onClose?: () => void;
}

export const AdvancedFilterPanel = ({ onClose }: AdvancedFilterPanelProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filters,
    setFilters,
    resetFilters,
    filterPresets,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset
  } = useV3Store();

  const [presetName, setPresetName] = useState("");

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.regions.length > 0) {
      params.set('regions', filters.regions.join(','));
    }
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    if (filters.severity > 0) {
      params.set('severity', filters.severity.toString());
    }
    if (filters.dataSources.length > 0) {
      params.set('sources', filters.dataSources.join(','));
    }
    if (filters.dataQuality.length < 3) {
      params.set('quality', filters.dataQuality.join(','));
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Load filters from URL on mount
  useEffect(() => {
    const regions = searchParams.get('regions')?.split(',').filter(Boolean) || [];
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const severity = parseInt(searchParams.get('severity') || '0');
    const dataSources = searchParams.get('sources')?.split(',').filter(Boolean) || [];
    const dataQuality = (searchParams.get('quality')?.split(',').filter(Boolean) || ['high', 'medium', 'low']) as ('high' | 'medium' | 'low')[];

    if (regions.length > 0 || categories.length > 0 || severity > 0 || dataSources.length > 0) {
      setFilters({ regions, categories, severity, dataSources, dataQuality });
    }
  }, []); // Only on mount

  const availableRegions = ['Gaza Strip', 'West Bank', 'Jerusalem', 'All Territories'];
  const availableCategories = ['Casualties', 'Infrastructure', 'Economic', 'Humanitarian', 'Displacement'];
  const availableDataSources = ['Tech4Palestine', 'UN OCHA', 'WHO', 'World Bank', 'WFP'];
  const dataQualityOptions: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveFilterPreset(presetName, filters);
      setPresetName("");
    }
  };

  const activeFilterCount = 
    filters.regions.length +
    filters.categories.length +
    filters.dataSources.length +
    (filters.severity > 0 ? 1 : 0) +
    (filters.dataQuality.length < 3 ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Advanced Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Timeframe */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Timeframe</Label>
          <DateRangeSelector />
        </div>

        <Separator />

        {/* Geographic Regions */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Geographic Regions</Label>
          <div className="space-y-2">
            {availableRegions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={filters.regions.includes(region)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      regions: checked
                        ? [...filters.regions, region]
                        : filters.regions.filter((r) => r !== region)
                    });
                  }}
                />
                <label
                  htmlFor={`region-${region}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Data Categories */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Data Categories</Label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setFilters({
                    categories: filters.categories.includes(category)
                      ? filters.categories.filter((c) => c !== category)
                      : [...filters.categories, category]
                  });
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Severity Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Severity Level</Label>
            <span className="text-sm text-muted-foreground">
              {filters.severity}% minimum
            </span>
          </div>
          <Slider
            value={[filters.severity]}
            onValueChange={([value]) => setFilters({ severity: value })}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>All</span>
            <span>Critical Only</span>
          </div>
        </div>

        <Separator />

        {/* Data Sources */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Data Sources</Label>
          <div className="space-y-2">
            {availableDataSources.map((source) => (
              <div key={source} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${source}`}
                  checked={filters.dataSources.includes(source)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      dataSources: checked
                        ? [...filters.dataSources, source]
                        : filters.dataSources.filter((s) => s !== source)
                    });
                  }}
                />
                <label
                  htmlFor={`source-${source}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Data Quality */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Minimum Data Quality</Label>
          <div className="flex gap-2">
            {dataQualityOptions.map((quality) => (
              <Badge
                key={quality}
                variant={filters.dataQuality.includes(quality) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => {
                  setFilters({
                    dataQuality: filters.dataQuality.includes(quality)
                      ? filters.dataQuality.filter((q) => q !== quality)
                      : [...filters.dataQuality, quality]
                  });
                }}
              >
                {quality}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Filter Presets */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Filter Presets</Label>
          
          {/* Save Current */}
          <div className="flex gap-2">
            <Input
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePreset();
              }}
            />
            <Button
              size="sm"
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>

          {/* Saved Presets */}
          {Object.keys(filterPresets).length > 0 && (
            <div className="space-y-2">
              {Object.entries(filterPresets).map(([name, preset]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => loadFilterPreset(name)}
                    className="flex-1 text-left text-sm font-medium"
                  >
                    {name}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteFilterPreset(name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t space-y-3">
        <Button onClick={onClose} className="w-full">
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            resetFilters();
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset All Filters
        </Button>
        <div className="text-xs text-center text-muted-foreground pt-1">
          Filters are automatically saved and synced to the URL
        </div>
      </div>
    </motion.div>
  );
};