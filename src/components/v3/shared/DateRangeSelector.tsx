import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useV3Store } from "@/store/v3Store";
import { buttonInteraction } from "@/lib/interaction-polish";

const presets = [
  { label: 'Last 7 days', value: '7d' as const },
  { label: 'Last 30 days', value: '30d' as const },
  { label: 'Last 60 days', value: '60d' as const },
  { label: 'Last 90 days', value: '90d' as const },
  { label: 'Last year', value: '1y' as const },
  { label: 'All time', value: 'all' as const }
];

interface DateRangeSelectorProps {
  className?: string;
  compact?: boolean;
}

export const DateRangeSelector = ({ className, compact = false }: DateRangeSelectorProps) => {
  const { dateRange, setDatePreset, setDateRange } = useV3Store();
  const [customOpen, setCustomOpen] = useState(false);

  const handlePresetClick = (preset: typeof presets[number]['value']) => {
    setDatePreset(preset);
  };

  if (compact) {
    return (
      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("gap-2", className)}>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">
              {dateRange.preset ? presets.find(p => p.value === dateRange.preset)?.label : 'Custom'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 space-y-2">
            <div className="space-y-1">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={dateRange.preset === preset.value ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    handlePresetClick(preset.value);
                    setCustomOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <span className="text-sm font-medium text-muted-foreground">
        <Calendar className="inline h-4 w-4 mr-1" />
        Time Range:
      </span>
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={dateRange.preset === preset.value ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetClick(preset.value)}
          className="transition-all"
        >
          {preset.label}
        </Button>
      ))}
      
      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={dateRange.preset === 'custom' ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            Custom
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <CalendarComponent
                mode="single"
                selected={dateRange.start}
                onSelect={(date) => {
                  if (date) {
                    setDateRange({
                      start: date,
                      end: dateRange.end,
                      preset: 'custom'
                    });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <CalendarComponent
                mode="single"
                selected={dateRange.end}
                onSelect={(date) => {
                  if (date) {
                    setDateRange({
                      start: dateRange.start,
                      end: date,
                      preset: 'custom'
                    });
                  }
                }}
              />
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => setCustomOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {dateRange.preset === 'custom' && (
        <Badge variant="secondary" className="text-xs">
          {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d, yyyy')}
        </Badge>
      )}
    </motion.div>
  );
};