/**
 * Event Timeline Component
 * 
 * Displays a chronological timeline of major events with:
 * - Scrollable horizontal/vertical layout
 * - Event markers with severity indicators
 * - Filterable by event type
 * - Interactive event details
 * - Responsive design
 */

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  AlertCircle, 
  Shield, 
  Heart, 
  Building2, 
  Flag,
  Filter
} from 'lucide-react';
import { TimelineEvent } from './types/data.types';
import { format, parseISO } from 'date-fns';

// ============================================
// TYPES
// ============================================

interface EventTimelineProps {
  events?: TimelineEvent[];
  loading?: boolean;
  title?: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical';
  maxHeight?: string;
}

// ============================================
// SAMPLE EVENTS DATA
// ============================================

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: '2023-10-07T00:00:00Z',
    title: 'Al-Aqsa Flood Operation Begins',
    description: 'Hamas launches Operation Al-Aqsa Flood, breaking through Gaza border fence',
    type: 'military_operation',
    severity: 'critical',
    location: 'Gaza Strip',
    sources: ['Multiple news sources'],
  },
  {
    id: '2',
    date: '2023-10-07T12:00:00Z',
    title: 'Israel Declares War',
    description: 'Israeli government declares war on Gaza, begins airstrikes',
    type: 'military_operation',
    severity: 'critical',
    casualties: { killed: 0, injured: 0 },
  },
  {
    id: '3',
    date: '2023-10-09T00:00:00Z',
    title: 'Complete Siege Imposed',
    description: 'Israel announces complete siege on Gaza - no electricity, food, water, or fuel',
    type: 'humanitarian',
    severity: 'critical',
  },
  {
    id: '4',
    date: '2023-10-17T00:00:00Z',
    title: 'Al-Ahli Hospital Bombing',
    description: 'Explosion at Al-Ahli Arab Hospital kills hundreds of civilians',
    type: 'massacre',
    severity: 'critical',
    casualties: { killed: 471, injured: 342 },
    location: 'Gaza City',
  },
  {
    id: '5',
    date: '2023-10-27T00:00:00Z',
    title: 'Ground Invasion Begins',
    description: 'Israeli ground forces enter northern Gaza Strip',
    type: 'military_operation',
    severity: 'critical',
  },
  {
    id: '6',
    date: '2023-11-24T00:00:00Z',
    title: 'Temporary Ceasefire',
    description: 'Four-day humanitarian pause begins, hostage exchange initiated',
    type: 'ceasefire',
    severity: 'medium',
  },
  {
    id: '7',
    date: '2024-01-11T00:00:00Z',
    title: 'ICJ Preliminary Ruling',
    description: 'International Court of Justice orders Israel to prevent genocide',
    type: 'political',
    severity: 'high',
  },
  {
    id: '8',
    date: '2024-05-20T00:00:00Z',
    title: 'ICC Arrest Warrants Sought',
    description: 'International Criminal Court prosecutor seeks arrest warrants for Israeli leaders',
    type: 'political',
    severity: 'high',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'military_operation':
      return Shield;
    case 'massacre':
      return AlertCircle;
    case 'ceasefire':
      return Heart;
    case 'humanitarian':
      return Heart;
    case 'political':
      return Flag;
    default:
      return Building2;
  }
};

const getSeverityColor = (severity: TimelineEvent['severity']) => {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTypeColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'military_operation':
      return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
    case 'massacre':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'ceasefire':
      return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
    case 'humanitarian':
      return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
    case 'political':
      return 'bg-chart-5/20 text-chart-5 border-chart-5/30';
    default:
      return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

// ============================================
// EVENT CARD COMPONENT
// ============================================

const EventCard = ({ event }: { event: TimelineEvent }) => {
  const Icon = getEventIcon(event.type);
  
  return (
    <div className="flex gap-4 group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getTypeColor(event.type)}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-0.5 h-full bg-border group-last:hidden" />
      </div>
      
      {/* Event content */}
      <div className="flex-1 pb-8 group-last:pb-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                {event.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(parseISO(event.date), 'PPP')}
            </div>
          </div>
          <Badge variant="outline" className="capitalize whitespace-nowrap">
            {event.type.replace('_', ' ')}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {event.description}
        </p>
        
        {/* Casualties */}
        {event.casualties && (
          <div className="flex gap-4 text-sm mb-2">
            {event.casualties.killed > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Killed:</span>
                <span className="font-semibold text-destructive">
                  {event.casualties.killed.toLocaleString()}
                </span>
              </div>
            )}
            {event.casualties.injured > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Injured:</span>
                <span className="font-semibold text-chart-4">
                  {event.casualties.injured.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Location */}
        {event.location && (
          <div className="text-xs text-muted-foreground">
            📍 {event.location}
          </div>
        )}
        
        {/* Sources */}
        {event.sources && event.sources.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Sources: {event.sources.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const EventTimeline = ({
  events = SAMPLE_EVENTS,
  loading = false,
  title = 'Historical Timeline',
  description = 'Major events and milestones since October 7, 2023',
  orientation = 'vertical',
  maxHeight = '800px',
}: EventTimelineProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = new Set(events.map(e => e.type));
    return Array.from(types);
  }, [events]);
  
  // Filter events
  const filteredEvents = useMemo(() => {
    if (selectedTypes.length === 0) return events;
    return events.filter(e => selectedTypes.includes(e.type));
  }, [events, selectedTypes]);
  
  // Sort events by date (newest first)
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredEvents]);
  
  // Toggle event type filter
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  return (
    <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        
        {/* Event Type Filters */}
        {!loading && eventTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            {eventTypes.map(type => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(type)}
                className="capitalize"
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTypes([])}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mb-4 opacity-50" />
            <p>No events found for the selected filters</p>
          </div>
        ) : (
          <div 
            className="space-y-0 overflow-y-auto pr-2"
            style={{ maxHeight }}
          >
            {sortedEvents.map((event, index) => (
              <EventCard key={event.id || index} event={event} />
            ))}
          </div>
        )}
        
        {/* Summary */}
        {!loading && sortedEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing {sortedEvents.length} of {events.length} events
              </span>
              <Badge variant="secondary">
                {selectedTypes.length > 0 ? 'Filtered' : 'All Events'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Export sample data for testing
export { SAMPLE_EVENTS };