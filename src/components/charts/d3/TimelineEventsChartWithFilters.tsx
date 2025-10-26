/**
 * Timeline Events Chart with Filters
 * 
 * Wrapper component that adds filtering controls to TimelineEventsChart:
 * - Event type filters (ceasefire, escalation, humanitarian, political, attack, other)
 * - Date range selection (7D, 1M, 3M, 1Y, All)
 * - Animated transitions between filter states
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.1, 8.2, 8.4)
 */

import { useState, useMemo } from 'react';
import { TimelineEventsChart, TimelineEventsChartProps } from './TimelineEventsChart';
import { TimeSeriesData, EventData, TimeRange } from '@/types/dashboard-data.types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Filter, 
  X,
  AlertCircle,
  TrendingUp,
  Heart,
  Users,
  Swords,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Props for TimelineEventsChartWithFilters
 */
export interface TimelineEventsChartWithFiltersProps extends Omit<TimelineEventsChartProps, 'eventTypeFilter' | 'dateRange'> {
  /** Show filter controls */
  showFilters?: boolean;
  /** Default time range */
  defaultTimeRange?: TimeRange;
  /** Default event types to show */
  defaultEventTypes?: EventData['type'][];
  /** Callback when filters change */
  onFiltersChange?: (filters: { timeRange: TimeRange; eventTypes: EventData['type'][] }) => void;
}

/**
 * TimelineEventsChartWithFilters Component
 * 
 * Enhanced timeline chart with built-in filtering controls for event types and date ranges.
 */
export const TimelineEventsChartWithFilters: React.FC<TimelineEventsChartWithFiltersProps> = ({
  data,
  events,
  showFilters = true,
  defaultTimeRange = 'all',
  defaultEventTypes,
  onFiltersChange,
  ...chartProps
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventData['type'][]>(
    defaultEventTypes || ['ceasefire', 'escalation', 'humanitarian', 'political', 'attack', 'other']
  );

  // Available event types with icons and labels
  const eventTypes: Array<{ 
    value: EventData['type']; 
    label: string; 
    icon: React.ReactNode;
    color: string;
  }> = [
    { 
      value: 'ceasefire', 
      label: t('charts.eventTypes.ceasefire', 'Ceasefire'),
      icon: <Heart className="w-3.5 h-3.5" />,
      color: 'text-green-600'
    },
    { 
      value: 'escalation', 
      label: t('charts.eventTypes.escalation', 'Escalation'),
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: 'text-red-600'
    },
    { 
      value: 'humanitarian', 
      label: t('charts.eventTypes.humanitarian', 'Humanitarian'),
      icon: <Heart className="w-3.5 h-3.5" />,
      color: 'text-blue-600'
    },
    { 
      value: 'political', 
      label: t('charts.eventTypes.political', 'Political'),
      icon: <Users className="w-3.5 h-3.5" />,
      color: 'text-purple-600'
    },
    { 
      value: 'attack', 
      label: t('charts.eventTypes.attack', 'Attack'),
      icon: <Swords className="w-3.5 h-3.5" />,
      color: 'text-red-700'
    },
    { 
      value: 'other', 
      label: t('charts.eventTypes.other', 'Other'),
      icon: <MoreHorizontal className="w-3.5 h-3.5" />,
      color: 'text-gray-600'
    },
  ];

  // Time range options
  const timeRangeOptions: Array<{ value: TimeRange; label: string }> = [
    { value: '7d', label: t('charts.timeRange.7d', 'Last 7 Days') },
    { value: '1m', label: t('charts.timeRange.1m', 'Last Month') },
    { value: '3m', label: t('charts.timeRange.3m', 'Last 3 Months') },
    { value: '1y', label: t('charts.timeRange.1y', 'Last Year') },
    { value: 'all', label: t('charts.timeRange.all', 'All Time') },
  ];

  // Calculate date range based on time range filter
  const dateRange = useMemo(() => {
    if (timeRange === 'all') return undefined;

    const now = new Date();
    const start = new Date();

    switch (timeRange) {
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '1m':
        start.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        start.setMonth(now.getMonth() - 3);
        break;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  }, [timeRange]);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!dateRange) return data;

    return data.filter(d => {
      const date = typeof d.date === 'string' ? new Date(d.date) : d.date;
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [data, dateRange]);

  // Handle time range change
  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    if (onFiltersChange) {
      onFiltersChange({ timeRange: newRange, eventTypes: selectedEventTypes });
    }
  };

  // Handle event type toggle
  const handleEventTypeToggle = (eventType: EventData['type']) => {
    const newTypes = selectedEventTypes.includes(eventType)
      ? selectedEventTypes.filter(t => t !== eventType)
      : [...selectedEventTypes, eventType];
    
    setSelectedEventTypes(newTypes);
    if (onFiltersChange) {
      onFiltersChange({ timeRange, eventTypes: newTypes });
    }
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setTimeRange('all');
    setSelectedEventTypes(['ceasefire', 'escalation', 'humanitarian', 'political', 'attack', 'other']);
    if (onFiltersChange) {
      onFiltersChange({ 
        timeRange: 'all', 
        eventTypes: ['ceasefire', 'escalation', 'humanitarian', 'political', 'attack', 'other'] 
      });
    }
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (timeRange !== 'all') count++;
    if (selectedEventTypes.length < 6) count++;
    return count;
  }, [timeRange, selectedEventTypes]);

  // Count filtered events
  const filteredEventsCount = useMemo(() => {
    let filtered = events;

    // Apply event type filter
    if (selectedEventTypes.length < 6) {
      filtered = filtered.filter(e => selectedEventTypes.includes(e.type));
    }

    // Apply date range filter
    if (dateRange) {
      filtered = filtered.filter(e => {
        const date = typeof e.date === 'string' ? new Date(e.date) : e.date;
        return date >= dateRange.start && date <= dateRange.end;
      });
    }

    return filtered.length;
  }, [events, selectedEventTypes, dateRange]);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {showFilters && (
        <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Time Range Filter */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {timeRangeOptions.map(option => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeRangeChange(option.value)}
                  className="h-8 px-3 text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Event Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {t('charts.eventTypes.label', 'Event Types')}
                </span>
                {selectedEventTypes.length < 6 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {selectedEventTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'end' : 'start'} className="w-56">
              <DropdownMenuLabel className={isRTL ? 'text-right' : ''}>
                {t('charts.selectEventTypes', 'Select Event Types')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {eventTypes.map(type => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={selectedEventTypes.includes(type.value)}
                  onCheckedChange={() => handleEventTypeToggle(type.value)}
                  className={isRTL ? 'flex-row-reverse' : ''}
                >
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={type.color}>{type.icon}</span>
                    <span className="text-xs">{type.label}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active Filters Indicator */}
          {activeFiltersCount > 0 && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="secondary" className="h-7 gap-1.5">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">
                  {activeFiltersCount} {t('charts.activeFilters', 'active filter(s)')}
                </span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 px-2 text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                {t('charts.clearFilters', 'Clear')}
              </Button>
            </div>
          )}

          {/* Filtered Events Count */}
          <div className={`ml-auto text-xs text-muted-foreground ${isRTL ? 'mr-auto ml-0' : ''}`}>
            {t('charts.showingEvents', 'Showing {{count}} of {{total}} events', {
              count: filteredEventsCount,
              total: events.length
            })}
          </div>
        </div>
      )}

      {/* Chart */}
      <TimelineEventsChart
        data={filteredData}
        events={events}
        eventTypeFilter={selectedEventTypes.length < 6 ? selectedEventTypes : undefined}
        dateRange={dateRange}
        {...chartProps}
      />

      {/* Filter Summary */}
      {showFilters && activeFiltersCount > 0 && (
        <div className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
          <span className="font-medium">{t('charts.filteredBy', 'Filtered by')}:</span>
          {' '}
          {timeRange !== 'all' && (
            <span>
              {timeRangeOptions.find(o => o.value === timeRange)?.label}
            </span>
          )}
          {timeRange !== 'all' && selectedEventTypes.length < 6 && ' • '}
          {selectedEventTypes.length < 6 && (
            <span>
              {selectedEventTypes.length} {t('charts.eventTypesSelected', 'event type(s)')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default TimelineEventsChartWithFilters;
