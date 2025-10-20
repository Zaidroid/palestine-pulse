/**
 * Advanced Filters Component
 * 
 * Multi-criteria filtering system:
 * - Date range selection
 * - Region filtering
 * - Demographic filters
 * - Event type filters
 * - Metric thresholds
 * - Save filter presets
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './components/ui/sheet';
import { 
  Filter,
  X,
  Save,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { useGlobalStore } from './store/globalStore';
import { FilterConfig } from './types/data.types';

const REGIONS = [
  'Gaza City',
  'Khan Younis',
  'Rafah',
  'Northern Gaza',
  'Ramallah',
  'Hebron',
  'Nablus',
  'Jenin',
];

const DEMOGRAPHICS = [
  'Children',
  'Women',
  'Medical Personnel',
  'Civil Defense',
  'Press/Journalists',
];

const EVENT_TYPES = [
  'Military Operation',
  'Massacre',
  'Ceasefire',
  'Humanitarian Crisis',
  'Political Event',
];

export const AdvancedFilters = () => {
  const { filters, setFilters, resetFilters } = useGlobalStore();
  const [localFilters, setLocalFilters] = useState<FilterConfig>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.regions && localFilters.regions.length > 0) count++;
    if (localFilters.demographics && localFilters.demographics.length > 0) count++;
    if (localFilters.eventTypes && localFilters.eventTypes.length > 0) count++;
    if (localFilters.minCasualties !== undefined) count++;
    if (localFilters.maxCasualties !== undefined) count++;
    return count;
  }, [localFilters]);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters(filters);
  };

  const toggleRegion = (region: string) => {
    const current = localFilters.regions || [];
    setLocalFilters({
      ...localFilters,
      regions: current.includes(region)
        ? current.filter(r => r !== region)
        : [...current, region],
    });
  };

  const toggleDemographic = (demo: string) => {
    const current = localFilters.demographics || [];
    setLocalFilters({
      ...localFilters,
      demographics: current.includes(demo)
        ? current.filter(d => d !== demo)
        : [...current, demo],
    });
  };

  const toggleEventType = (type: string) => {
    const current = localFilters.eventTypes || [];
    setLocalFilters({
      ...localFilters,
      eventTypes: current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type],
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-5 min-w-5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>
            Apply multi-criteria filters to refine your data view
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Date Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={localFilters.dateRange.start.split('T')[0]}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    dateRange: { ...localFilters.dateRange, start: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={localFilters.dateRange.end.split('T')[0]}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    dateRange: { ...localFilters.dateRange, end: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Regions</CardTitle>
              <CardDescription className="text-xs">
                Select specific regions to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {REGIONS.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={localFilters.regions?.includes(region)}
                      onCheckedChange={() => toggleRegion(region)}
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
            </CardContent>
          </Card>

          {/* Demographics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demographics</CardTitle>
              <CardDescription className="text-xs">
                Filter by demographic groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DEMOGRAPHICS.map((demo) => (
                  <div key={demo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`demo-${demo}`}
                      checked={localFilters.demographics?.includes(demo)}
                      onCheckedChange={() => toggleDemographic(demo)}
                    />
                    <label
                      htmlFor={`demo-${demo}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {demo}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Event Types</CardTitle>
              <CardDescription className="text-xs">
                Filter by event categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {EVENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`event-${type}`}
                      checked={localFilters.eventTypes?.includes(type)}
                      onCheckedChange={() => toggleEventType(type)}
                    />
                    <label
                      htmlFor={`event-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Casualty Thresholds */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Casualty Thresholds</CardTitle>
              <CardDescription className="text-xs">
                Filter events by casualty count
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="minCasualties" className="text-xs">Minimum Casualties</Label>
                <Input
                  id="minCasualties"
                  type="number"
                  placeholder="e.g., 10"
                  value={localFilters.minCasualties || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    minCasualties: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxCasualties" className="text-xs">Maximum Casualties</Label>
                <Input
                  id="maxCasualties"
                  type="number"
                  placeholder="e.g., 1000"
                  value={localFilters.maxCasualties || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    maxCasualties: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-background border-t pt-4 space-y-3">
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleResetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {activeFilterCount > 0 && (
            <div className="text-xs text-center text-muted-foreground">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};