import { useState, lazy, Suspense, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { AlertCircle, Building2, Users, Heart, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useV3Store } from "@/store/v3Store";
import { dataConsolidationService } from "@/services/dataConsolidationService";
import { useKilledInGaza, usePressKilled, useSummary, useCasualtiesDaily, useInfrastructure } from "@/hooks/useDataFetching";
import { useDisplacementEstimates, usePopulationStatistics } from "@/hooks/usePopulation";
import { useWFPCommodityTrends, useWFPLatestPrices } from "@/hooks/useWFPData";
import { useHealthFacilityStats } from "@/hooks/useHealthFacilities";

// Lazy load sub-tab components
const HumanitarianCrisis = lazy(() => import("@/components/v3/gaza/HumanitarianCrisis").then(m => ({ default: m.HumanitarianCrisis })));
const InfrastructureDestruction = lazy(() => import("@/components/v3/gaza/InfrastructureDestruction").then(m => ({ default: m.InfrastructureDestruction })));
const PopulationImpact = lazy(() => import("@/components/v3/gaza/PopulationImpact").then(m => ({ default: m.PopulationImpact })));
const AidSurvival = lazy(() => import("@/components/v3/gaza/AidSurvival").then(m => ({ default: m.AidSurvival })));
const AnalyticsPanel = lazy(() => import("@/components/v3/shared/AnalyticsPanel").then(m => ({ default: m.AnalyticsPanel })));

const TabLoader = () => (
  <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

export const GazaWarDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState("humanitarian");
  const { fetchConsolidatedData } = useV3Store();

  // Initialize V3 data consolidation service
  useEffect(() => {
    const initializeData = async () => {
      try {
        await dataConsolidationService.initialize();
        // Auto-fetch consolidated data for analytics
        fetchConsolidatedData();
      } catch (error) {
        console.error('Failed to initialize V3 data service:', error);
      }
    };

    initializeData();
  }, [fetchConsolidatedData]);

  // Fetch all Gaza data from Tech4Palestine
  const { data: killedData, isLoading: killedLoading, refetch: refetchKilled } = useKilledInGaza();
  const { data: pressData, isLoading: pressLoading } = usePressKilled();
  const { data: summaryData, isLoading: summaryLoading } = useSummary();
  const { data: casualtiesData, isLoading: casualtiesLoading } = useCasualtiesDaily();
  const { data: infrastructureData, isLoading: infrastructureLoading } = useInfrastructure();
  
  // Fetch additional data sources
  const displacementData = useDisplacementEstimates();
  const { data: wfpPrices, isLoading: wfpLoading } = useWFPCommodityTrends();
  const { data: wfpLatest, isLoading: wfpLatestLoading } = useWFPLatestPrices();
  const healthStats = useHealthFacilityStats();
  const populationStats = usePopulationStatistics();

  const gazaMetrics = summaryData?.gaza || {};
  const lastUpdated = new Date();

  const handleRefresh = () => {
    refetchKilled();
  };

  const exportData = {
    casualties: casualtiesData,
    infrastructure: infrastructureData,
    press: pressData,
    summary: summaryData
  };

  const subTabs = [
    {
      value: "humanitarian",
      label: "Humanitarian Crisis",
      icon: AlertCircle,
      color: "text-destructive"
    },
    {
      value: "infrastructure",
      label: "Infrastructure",
      icon: Building2,
      color: "text-warning"
    },
    {
      value: "population",
      label: "Population Impact",
      icon: Users,
      color: "text-primary"
    },
    {
      value: "aid",
      label: "Aid & Survival",
      icon: Heart,
      color: "text-secondary"
    },
    {
      value: "analytics",
      label: "Advanced Analytics",
      icon: Activity,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
          War On Gaza
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Documenting the humanitarian catastrophe and ongoing assault
        </p>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex justify-center">
        <PillTabs
          tabs={subTabs}
          activeTab={activeSubTab}
          onTabChange={setActiveSubTab}
        />
      </div>

      <Suspense fallback={<TabLoader />}>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
          <TabsContent value="humanitarian" className="space-y-6">
            <HumanitarianCrisis
              gazaMetrics={gazaMetrics}
              casualtiesData={casualtiesData}
              pressData={pressData}
              loading={summaryLoading || casualtiesLoading || pressLoading}
            />
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <InfrastructureDestruction
              infrastructureData={infrastructureData}
              gazaMetrics={gazaMetrics}
              healthStats={healthStats}
              loading={infrastructureLoading || summaryLoading || healthStats.isLoading}
            />
          </TabsContent>

          <TabsContent value="population" className="space-y-6">
            <PopulationImpact
              gazaMetrics={gazaMetrics}
              casualtiesData={casualtiesData}
              displacementData={displacementData}
              infrastructureData={infrastructureData}
              populationStats={populationStats}
              loading={summaryLoading || casualtiesLoading || displacementData.isLoading || infrastructureLoading || populationStats.isLoading}
            />
          </TabsContent>

          <TabsContent value="aid" className="space-y-6">
             <AidSurvival
               gazaMetrics={gazaMetrics}
               wfpPrices={wfpPrices}
               wfpLatest={wfpLatest}
               healthStats={healthStats}
               loading={summaryLoading || wfpLoading || wfpLatestLoading || healthStats.isLoading}
             />
           </TabsContent>

           <TabsContent value="analytics" className="space-y-6">
             <AnalyticsPanel region="gaza" />
           </TabsContent>
        </Tabs>
       </Suspense>
    </div>
  );
};

export default GazaWarDashboard;