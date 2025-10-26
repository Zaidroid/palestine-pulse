/**
 * Timeline Events Chart Demo
 * 
 * Demonstration component showcasing TimelineEventsChart with sample data.
 * Shows various event types overlaid on a time-series data line.
 */

import { useState } from 'react';
import { TimelineEventsChartWithFilters } from './TimelineEventsChartWithFilters';
import { TimeSeriesData, EventData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Calendar, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Generate sample time-series data
 */
const generateSampleData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const startDate = new Date('2023-10-01');
  const endDate = new Date('2024-01-31');
  
  let currentDate = new Date(startDate);
  let baseValue = 100;
  
  while (currentDate <= endDate) {
    // Add some variation to simulate real data
    const variation = Math.random() * 40 - 20;
    const trend = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) * 0.5;
    const value = Math.max(0, baseValue + variation + trend);
    
    data.push({
      date: new Date(currentDate).toISOString(),
      value: Math.round(value),
      category: 'casualties',
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

/**
 * Generate sample events
 */
const generateSampleEvents = (): EventData[] => {
  return [
    {
      date: '2023-10-07',
      title: 'Conflict Escalation',
      description: 'Major escalation in hostilities leading to increased casualties and displacement.',
      type: 'escalation',
      severity: 'critical',
      casualties: 1200,
      location: 'Gaza Strip',
    },
    {
      date: '2023-10-15',
      title: 'Humanitarian Corridor Opened',
      description: 'Temporary humanitarian corridor established to allow aid delivery and civilian evacuation.',
      type: 'humanitarian',
      severity: 'medium',
      location: 'Rafah Crossing',
    },
    {
      date: '2023-10-21',
      title: 'Hospital Attack',
      description: 'Major healthcare facility struck, resulting in significant casualties and infrastructure damage.',
      type: 'attack',
      severity: 'critical',
      casualties: 471,
      location: 'Gaza City',
    },
    {
      date: '2023-11-01',
      title: 'UN Resolution Passed',
      description: 'United Nations Security Council passes resolution calling for humanitarian pause.',
      type: 'political',
      severity: 'high',
    },
    {
      date: '2023-11-10',
      title: 'Aid Convoy Enters',
      description: 'First major humanitarian aid convoy enters Gaza with medical supplies and food.',
      type: 'humanitarian',
      severity: 'medium',
      location: 'Rafah Crossing',
    },
    {
      date: '2023-11-24',
      title: 'Temporary Ceasefire',
      description: 'Four-day humanitarian ceasefire agreed upon to allow aid delivery and hostage exchange.',
      type: 'ceasefire',
      severity: 'high',
    },
    {
      date: '2023-11-28',
      title: 'Ceasefire Extended',
      description: 'Humanitarian ceasefire extended for additional two days following negotiations.',
      type: 'ceasefire',
      severity: 'medium',
    },
    {
      date: '2023-12-01',
      title: 'Hostilities Resume',
      description: 'Fighting resumes after ceasefire expires, leading to renewed escalation.',
      type: 'escalation',
      severity: 'critical',
      casualties: 350,
    },
    {
      date: '2023-12-15',
      title: 'International Aid Conference',
      description: 'Major international donors conference pledges $1.2 billion in humanitarian assistance.',
      type: 'political',
      severity: 'medium',
    },
    {
      date: '2023-12-22',
      title: 'School Shelter Attack',
      description: 'UN-run school serving as civilian shelter struck, causing multiple casualties.',
      type: 'attack',
      severity: 'critical',
      casualties: 89,
      location: 'Khan Younis',
    },
    {
      date: '2024-01-05',
      title: 'Medical Supplies Delivered',
      description: 'WHO delivers critical medical supplies to remaining operational hospitals.',
      type: 'humanitarian',
      severity: 'medium',
      location: 'Multiple Locations',
    },
    {
      date: '2024-01-15',
      title: 'Diplomatic Talks',
      description: 'Regional leaders meet to discuss potential framework for lasting ceasefire.',
      type: 'political',
      severity: 'high',
    },
    {
      date: '2024-01-28',
      title: 'Refugee Camp Strike',
      description: 'Densely populated refugee camp struck, resulting in high civilian casualties.',
      type: 'attack',
      severity: 'critical',
      casualties: 156,
      location: 'Jabalia',
    },
  ];
};

/**
 * TimelineEventsChartDemo Component
 */
export const TimelineEventsChartDemo: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const sampleData = generateSampleData();
  const sampleEvents = generateSampleEvents();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>{t('charts.timelineEventsDemo', 'Timeline Events Chart Demo')}</CardTitle>
          </div>
          <CardDescription>
            {t('charts.timelineEventsDemoDesc', 'Interactive timeline showing data trends with annotated events. Filter by event type and date range.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineEventsChartWithFilters
            data={sampleData}
            events={sampleEvents}
            height={500}
            animated={true}
            interactive={true}
            showGrid={true}
            showEventLabels={true}
            showFilters={true}
            defaultTimeRange="all"
            onEventClick={(event) => setSelectedEvent(event)}
            onEventHover={(event) => {
              // Optional: handle hover events
            }}
            valueFormatter={(value) => value.toLocaleString()}
          />
        </CardContent>
      </Card>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">{t('charts.selectedEvent', 'Selected Event')}: {selectedEvent.title}</div>
              <div className="text-sm">
                <div><strong>{t('charts.date', 'Date')}:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</div>
                <div><strong>{t('charts.type', 'Type')}:</strong> {selectedEvent.type}</div>
                {selectedEvent.location && (
                  <div><strong>{t('charts.location', 'Location')}:</strong> {selectedEvent.location}</div>
                )}
                {selectedEvent.casualties && (
                  <div><strong>{t('charts.casualties', 'Casualties')}:</strong> {selectedEvent.casualties.toLocaleString()}</div>
                )}
                <div className="mt-2">{selectedEvent.description}</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('charts.features', 'Features')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ {t('charts.feature1', 'Time-series data line with smooth animations')}</li>
            <li>✓ {t('charts.feature2', 'Event markers with color-coded types')}</li>
            <li>✓ {t('charts.feature3', 'Interactive tooltips with detailed event information')}</li>
            <li>✓ {t('charts.feature4', 'Filter by event type (ceasefire, escalation, humanitarian, political, attack)')}</li>
            <li>✓ {t('charts.feature5', 'Filter by date range (7D, 1M, 3M, 1Y, All)')}</li>
            <li>✓ {t('charts.feature6', 'RTL layout support for Arabic language')}</li>
            <li>✓ {t('charts.feature7', 'Theme-aware colors (light/dark mode)')}</li>
            <li>✓ {t('charts.feature8', 'Click events for drill-down functionality')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

// Default export
export default TimelineEventsChartDemo;
