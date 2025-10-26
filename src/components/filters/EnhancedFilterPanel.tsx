/**
 * Enhanced Filter Panel Component
 * 
 * Advanced filtering system with:
 * - Slide-in animation from right edge
 * - Backdrop fade animation
 * - Active filter count badge
 * - Date range picker with presets
 * - Debounced filter updates
 * - Animated filter chips
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Filter,
  X,
  Save,
  RotateCcw,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';
import { FilterConfig } from '@/types/data.types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { 
  drawerVariants, 
  modalBackdropVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/animation/variants';
import { animationTokens } from '@/lib/animation/tokens';

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

const DATE_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last year', days: 365 },
];

interface EnhancedFilterPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedFilterPanel = ({ isOpen, onOpenChange }: EnhancedFilterPanelProps) => {
  const { filters, setFilters, resetFilters } = useGlobalStore();
  const [localFilters, setLocalFilters] = useState<FilterConfig>(filters);
  const [isApplying, setIsApplying] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(filters.dateRange.start),
    to: new Date(filters.dateRange.end),
  });

  // Debounced filter application
  const [debouncedFilters, setDebouncedFilters] = useState<FilterConfig>(localFilters);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(localFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.regions && localFilters.regions.length > 0) count += localFilters.regions.length;
    if (localFilters.demographics && localFilters.demographics.length > 0) count += localFilters.demographics.length;
    if (localFilters.eventTypes && localFilters.eventTypes.length > 0) count += localFilters.eventTypes.length;
    if (localFilters.minCasualties !== undefined) count++;
    if (localFilters.maxCasualties !== undefined) count++;
    return count;
  }, [localFilters]);

  const handleApplyFilters = useCallback(async () => {
    setIsApplying(true);
    
    // Simulate async filter application
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setFilters(localFilters);
    setIsApplying(false);
    onOpenChange(false);
  }, [localFilters, setFilters, onOpenChange]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setLocalFilters(filters);
    setDateRange({
      from: new Date(filters.dateRange.start),
      to: new Date(filters.dateRange.end),
    });
  }, [resetFilters, filters]);

  const handleDatePreset = useCallback((days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setDateRange({ from: start, to: end });
    setLocalFilters({
      ...localFilters,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  }, [localFilters]);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setLocalFilters({
        ...localFilters,
        dateRange: {
          start: range.from.toISOString(),
          end: range.to.toISOString(),
        },
      });
    }
  }, [localFilters]);

  const toggleRegion = useCallback((region: string) => {
    const current = localFilters.regions || [];
    setLocalFilters({
      ...localFilters,
      regions: current.includes(region)
        ? current.filter(r => r !== region)
        : [...current, region],
    });
  }, [localFilters]);

  const toggleDemographic = useCallback((demo: string) => {
    const current = localFilters.demographics || [];
    setLocalFilters({
      ...localFilters,
      demographics: current.includes(demo)
        ? current.filter(d => d !== demo)
        : [...current, demo],
    });
  }, [localFilters]);

  const toggleEventType = useCallback((type: string) => {
    const current = localFilters.eventTypes || [];
    setLocalFilters({
      ...localFilters,
      eventTypes: current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type],
    });
  }, [localFilters]);

  const removeFilter = useCallback((type: 'region' | 'demographic' | 'eventType', value: string) => {
    switch (type) {
      case 'region':
        setLocalFilters({
          ...localFilters,
          regions: (localFilters.regions || []).filter(r => r !== value),
        });
        break;
      case 'demographic':
        setLocalFilters({
          ...localFilters,
          demographics: (localFilters.demographics || []).filter(d => d !== value),
        });
        break;
      case 'eventType':
        setLocalFilters({
          ...localFilters,
          eventTypes: (localFilters.eventTypes || []).filter(t => t !== value),
        });
        break;
    }
  }, [localFilters]);

  const clearAllFilters = useCallback(() => {
    handleResetFilters();
  }, [handleResetFilters]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <motion.div
            variants={drawerVariants.right}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-background border-l shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Advanced Filters</h2>
                  <p className="text-sm text-muted-foreground">
                    Refine your data view
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 bg-muted/50 border-b"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="gap-1">
                      {activeFilterCount} Active
                    </Badge>
                    {isApplying && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Applying...</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Filter Chips */}
            {activeFilterCount > 0 && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 py-3 border-b"
              >
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {localFilters.regions?.map((region) => (
                      <motion.div
                        key={`region-${region}`}
                        variants={staggerItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                        >
                          {region}
                          <button
                            onClick={() => removeFilter('region', region)}
                            className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                    {localFilters.demographics?.map((demo) => (
                      <motion.div
                        key={`demo-${demo}`}
                        variants={staggerItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                        >
                          {demo}
                          <button
                            onClick={() => removeFilter('demographic', demo)}
                            className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                    {localFilters.eventTypes?.map((type) => (
                      <motion.div
                        key={`event-${type}`}
                        variants={staggerItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                        >
                          {type}
                          <button
                            onClick={() => removeFilter('eventType', type)}
                            className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Range */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date Range
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Select a date range or use presets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Date Presets */}
                  <div className="flex flex-wrap gap-2">
                    {DATE_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDatePreset(preset.days)}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>

                  {/* Calendar Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'LLL dd, y')} -{' '}
                              {format(dateRange.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Label htmlFor="minCasualties" className="text-xs">
                      Minimum Casualties
                    </Label>
                    <Input
                      id="minCasualties"
                      type="number"
                      placeholder="e.g., 10"
                      value={localFilters.minCasualties || ''}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          minCasualties: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxCasualties" className="text-xs">
                      Maximum Casualties
                    </Label>
                    <Input
                      id="maxCasualties"
                      type="number"
                      placeholder="e.g., 1000"
                      value={localFilters.maxCasualties || ''}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          maxCasualties: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-background border-t p-6 space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyFilters}
                  disabled={isApplying}
                  className="flex-1 gap-2"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Apply Filters
                    </>
                  )}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
