import { useState, lazy, Suspense, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { Building2, AlertTriangle, DollarSign, Users, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useV3Store } from "@/store/v3Store";
import { dataConsolidationService } from "@/services/dataConsolidationService";
import { useWestBankDaily, useSummary } from "@/hooks/useDataFetching";
import { useEconomicSnapshot } from "@/hooks/useWorldBankData";
import { useOchaSettlements } from "@/hooks/useOCHAData";

// Lazy load sub-tab components
const OccupationMetrics = lazy(() => import("@/components/v3/westbank/OccupationMetrics").then(m => ({ default: m.OccupationMetrics })));
const SettlerViolence = lazy(() => import("@/components/v3/westbank/SettlerViolence").then(m => ({ default: m.SettlerViolence })));
const EconomicStrangulation = lazy(() => import("@/components/v3/westbank/EconomicStrangulation").then(m => ({ default: m.EconomicStrangulation })));
const PrisonersDetention = lazy(() => import("@/components/v3/westbank/PrisonersDetention").then(m => ({ default: m.PrisonersDetention })));
const AnalyticsPanel = lazy(() => import("@/components/v3/shared/AnalyticsPanel").then(m => ({ default: m.AnalyticsPanel })));

const TabLoader = () => (
  <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

export const WestBankDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState("occupation");
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

  const { data: westBankData, isLoading: westBankLoading, refetch } = useWestBankDaily();
  const { data: summaryData, isLoading: summaryLoading } = useSummary();
  const { data: economicData, isLoading: economicLoading } = useEconomicSnapshot(2014, 2023);
  const { data: ochaSettlementsData, isLoading: ochaSettlementsLoading } = useOchaSettlements();

  const lastUpdated = new Date();

  const handleRefresh = () => {
    refetch();
  };

  const exportData = {
    westBank: westBankData,
    summary: summaryData,
    ochaSettlements: ochaSettlementsData
  };

  const subTabs = [
    {
      value: "occupation",
      label: "Occupation Metrics",
      icon: Building2,
      color: "text-secondary"
    },
    {
      value: "violence",
      label: "Settler Violence",
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      value: "economic",
      label: "Economic Strangulation",
      icon: DollarSign,
      color: "text-warning"
    },
    {
      value: "prisoners",
      label: "Prisoners & Detention",
      icon: Users,
      color: "text-primary"
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          West Bank Occupation
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Documenting systematic oppression, land theft, and settler violence
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
          <TabsContent value="occupation" className="space-y-6">
            <OccupationMetrics
              summaryData={summaryData}
              ochaSettlementsData={ochaSettlementsData}
              loading={summaryLoading || ochaSettlementsLoading}
            />
          </TabsContent>

          <TabsContent value="violence" className="space-y-6">
            <SettlerViolence
              westBankData={westBankData}
              summaryData={summaryData}
              loading={westBankLoading || summaryLoading}
            />
          </TabsContent>

          <TabsContent value="economic" className="space-y-6">
            <EconomicStrangulation
              summaryData={summaryData}
              westBankData={westBankData}
              economicData={economicData}
              loading={summaryLoading || westBankLoading || economicLoading}
            />
          </TabsContent>

          <TabsContent value="prisoners" className="space-y-6">
             <PrisonersDetention
               summaryData={summaryData}
               westBankData={westBankData}
               loading={summaryLoading || westBankLoading}
             />
           </TabsContent>

           <TabsContent value="analytics" className="space-y-6">
             <AnalyticsPanel region="westbank" />
           </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
};

export default WestBankDashboard;