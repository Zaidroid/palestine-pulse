/**
 * Maps & Timeline Page
 *
 * Displays interactive geographic visualizations and historical timeline
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Clock } from 'lucide-react';
import { AppLayout } from './components/layout/AppLayout';
import { InteractiveMap } from './components/maps/InteractiveMap';
import { EventTimeline } from './components/timeline/EventTimeline';

const Maps = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('gaza-map');

  return (
    <AppLayout showFilters={false} showExport={false}>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Main Tabs */}
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-muted">
            <TabsTrigger value="gaza-map">
              <Map className="mr-2 h-4 w-4" />
              {t('tabs.gazaMap')}
            </TabsTrigger>
            <TabsTrigger value="westbank-map">
              <Map className="mr-2 h-4 w-4" />
              {t('tabs.westBankMap')}
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="mr-2 h-4 w-4" />
              {t('tabs.timeline')}
            </TabsTrigger>
          </TabsList>

          {/* Gaza Map */}
          <TabsContent value="gaza-map" className="space-y-6">
            <InteractiveMap
              center={[31.5, 34.45]}
              zoom={10}
              title={t('maps.gazaTitle')}
              description={t('maps.gazaDescription')}
              height="600px"
              showBoundaries={true}
            />
          </TabsContent>

          {/* West Bank Map */}
          <TabsContent value="westbank-map" className="space-y-6">
            <InteractiveMap
              center={[31.9, 35.2]}
              zoom={9}
              title={t('maps.westBankTitle')}
              description={t('maps.westBankDescription')}
              height="600px"
              showBoundaries={false}
            />
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <EventTimeline
              title={t('maps.timelineTitle')}
              description={t('maps.timelineDescription')}
              orientation="vertical"
              maxHeight="none"
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Maps;