/**
 * Analytics Page
 *
 * Advanced analytics and insights including:
 * - Economic impact
 * - Predictive models
 * - Correlation analysis
 * - Comparative views
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Heart,
  Activity,
  Users,
  GraduationCap,
  Droplet,
  Lock,
  Building2,
  Apple,
  Flag
} from 'lucide-react';
import { AppLayout } from './components/layout/AppLayout';
import EconomicImpact from './components/dashboards/EconomicImpact';
import AidTracker from './components/dashboards/AidTracker';
import HealthcareStatus from './components/dashboards/HealthcareStatus';
import DisplacementStats from './components/dashboards/DisplacementStats';
import EducationImpact from './components/dashboards/EducationImpact';
import UtilitiesStatus from './components/dashboards/UtilitiesStatus';
import PrisonersStats from './components/dashboards/PrisonersStats';
import SettlementExpansion from './components/dashboards/SettlementExpansion';
import FoodSecurity from './components/dashboards/FoodSecurity';
import InternationalResponse from './components/dashboards/InternationalResponse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

const Analytics = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('economic');
  const [regionTab, setRegionTab] = useState('gaza');
  const [dateRange, setDateRange] = useState("60");

  return (
    <AppLayout showFilters={false} showExport={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Time Range Selector */}
        <div className="mb-6 flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg w-fit">
          <TrendingUp className="h-4 w-4 text-primary" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] border-0 bg-transparent focus:ring-0">
              <SelectValue placeholder={t('timeRange.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('timeRange.last7Days')}</SelectItem>
              <SelectItem value="30">{t('timeRange.lastMonth')}</SelectItem>
              <SelectItem value="60">{t('timeRange.last60Days')}</SelectItem>
              <SelectItem value="90">{t('timeRange.last90Days')}</SelectItem>
              <SelectItem value="180">{t('timeRange.last6Months')}</SelectItem>
              <SelectItem value="365">{t('timeRange.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Region Selector */}
        <div className="mb-6">
          <Tabs value={regionTab} onValueChange={setRegionTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted">
              <TabsTrigger value="gaza">{t('analytics.gazaStrip')}</TabsTrigger>
              <TabsTrigger value="westbank">{t('analytics.westBankRegion')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Gaza Tabs */}
          {regionTab === 'gaza' && (
            <>
              <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-7 bg-muted text-xs md:text-sm">
                <TabsTrigger value="economic">
                  <DollarSign className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden sm:inline">{t('analytics.economic')}</span>
                  <span className="sm:hidden">{t('analytics.economicShort')}</span>
                </TabsTrigger>
                <TabsTrigger value="aid">
                  <Heart className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  {t('analytics.aid')}
                </TabsTrigger>
                <TabsTrigger value="healthcare">
                  <Activity className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden sm:inline">{t('analytics.healthcare')}</span>
                  <span className="sm:hidden">{t('analytics.healthcareShort')}</span>
                </TabsTrigger>
                <TabsTrigger value="displacement">
                  <Users className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden sm:inline">{t('analytics.displacement')}</span>
                  <span className="sm:hidden">{t('analytics.displacementShort')}</span>
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden sm:inline">{t('analytics.education')}</span>
                  <span className="sm:hidden">{t('analytics.educationShort')}</span>
                </TabsTrigger>
                <TabsTrigger value="utilities">
                  <Droplet className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden sm:inline">{t('analytics.utilities')}</span>
                  <span className="sm:hidden">{t('analytics.utilitiesShort')}</span>
                </TabsTrigger>
                <TabsTrigger value="food">
                  <Apple className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  {t('analytics.food')}
                </TabsTrigger>
              </TabsList>

          {/* Economic Impact Tab */}
          <TabsContent value="economic" className="space-y-6">
            <EconomicImpact dateRange={dateRange} loading={false} />
          </TabsContent>

          {/* Aid Tracker Tab */}
          <TabsContent value="aid" className="space-y-6">
            <AidTracker dateRange={dateRange} loading={false} />
          </TabsContent>

          {/* Healthcare Status Tab */}
          <TabsContent value="healthcare" className="space-y-6">
            <HealthcareStatus loading={false} />
          </TabsContent>

          {/* Displacement Stats Tab */}
          <TabsContent value="displacement" className="space-y-6">
            <DisplacementStats loading={false} />
          </TabsContent>

          {/* Education Impact Tab */}
          <TabsContent value="education" className="space-y-6">
            <EducationImpact loading={false} />
          </TabsContent>

              {/* Utilities Status Tab */}
              <TabsContent value="utilities" className="space-y-6">
                <UtilitiesStatus loading={false} />
              </TabsContent>

              {/* Food Security Tab */}
              <TabsContent value="food" className="space-y-6">
                <FoodSecurity loading={false} />
              </TabsContent>
            </>
          )}

          {/* West Bank Tabs */}
          {regionTab === 'westbank' && (
            <>
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 bg-muted">
                <TabsTrigger value="prisoners">
                  <Lock className="mr-2 h-4 w-4" />
                  {t('analytics.prisoners')}
                </TabsTrigger>
                <TabsTrigger value="settlements">
                  <Building2 className="mr-2 h-4 w-4" />
                  {t('analytics.settlements')}
                </TabsTrigger>
                <TabsTrigger value="international">
                  <Flag className="mr-2 h-4 w-4" />
                  {t('analytics.international')}
                </TabsTrigger>
              </TabsList>

              {/* Prisoners Tab */}
              <TabsContent value="prisoners" className="space-y-6">
                <PrisonersStats loading={false} />
              </TabsContent>

              {/* Settlements Tab */}
              <TabsContent value="settlements" className="space-y-6">
                <SettlementExpansion loading={false} />
              </TabsContent>

              {/* International Response Tab */}
              <TabsContent value="international" className="space-y-6">
                <InternationalResponse loading={false} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;