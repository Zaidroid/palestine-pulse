import { useState, lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { SwipeableTabs } from "@/components/ui/swipeable-tabs";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { MobileOptimizedContainer } from "@/components/ui/mobile-optimized-container";
import { TabTransition } from "@/components/ui/page-transition";
import { Building2, AlertTriangle, DollarSign, Users, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useV3Store } from "@/store/v3Store";
import { dataConsolidationService } from "@/services/dataConsolidationService";
import { useRecentData, useSingleData } from "@/hooks/useUnifiedData";
import { useEconomicSnapshot } from "@/hooks/useWorldBankData";
import { useOchaSettlements } from "@/hooks/useOCHAData";
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
import { useBreakpoint } from "@/hooks/useBreakpoint";

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
  const { isMobile } = useBreakpoint();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

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

  // Fetch West Bank data using unified hooks
  const { data: westBankData, isLoading: westBankLoading, refetch: refetchWestBank } = useRecentData(
    'tech4palestine',
    'westbank',
    'https://data.techforpalestine.org/api/v2/west_bank_daily.json'
  );
  
  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useSingleData(
    'tech4palestine',
    'summary',
    'https://data.techforpalestine.org/api/v3/summary.json'
  );
  const { data: economicData, isLoading: economicLoading, refetch: refetchEconomic } = useEconomicSnapshot(2014, 2023);
  const { data: ochaSettlementsData, isLoading: ochaSettlementsLoading, refetch: refetchOcha } = useOchaSettlements();

  // Refresh handler for pull-to-refresh
  const handleRefresh = async () => {
    // Refetch all data sources in parallel
    await Promise.all([
      refetchWestBank(),
      refetchSummary(),
      refetchEconomic(),
      refetchOcha(),
      fetchConsolidatedData()
    ]);
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



  // Scroll active tab into view on mobile
  useEffect(() => {
    if (isMobile && tabsContainerRef.current) {
      const activeButton = tabsContainerRef.current.querySelector(`[data-state="active"]`);
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeSubTab, isMobile]);

  // Calculate years since Nakba (May 15, 1948)
  const nakbaStartDate = new Date('1948-05-15');
  const today = new Date();
  const daysSinceNakba = Math.floor((today.getTime() - nakbaStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const yearsSinceNakba = Math.floor(daysSinceNakba / 365.25);

  // Animated counter for years with easing
  const [displayYears, setDisplayYears] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const startTime = Date.now();

    // Easing function - ease out cubic for smooth deceleration
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayYears(Math.floor(easedProgress * yearsSinceNakba));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayYears(yearsSinceNakba);
      }
    };

    requestAnimationFrame(animate);
  }, [yearsSinceNakba]);

  // Calculate last update time
  const lastUpdateTime = useMemo(() => {
    if (summaryData?.last_update) {
      const updateDate = new Date(summaryData.last_update);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
    return 'Live';
  }, [summaryData]);

  const westBankMetrics = summaryData?.west_bank || {};

  return (
    <MobileOptimizedContainer spacing="md" fullWidth>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-6">
          {/* Ultra-Compact Interactive Banner */}
          <div>
            <div className="relative rounded-xl border border-border/50 bg-gradient-to-r from-card/50 via-secondary/5 to-card/50 backdrop-blur-md overflow-hidden group hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-500">
              {/* Animated Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Single Horizontal Row */}
              <div className="relative flex items-center justify-between gap-4 px-4 md:px-6 py-3.5">
                {/* Left: Title + Live */}
                <div className="flex items-center gap-3 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                    West Bank Occupation
                  </h1>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Center: Metric Pills - No Hover */}
                <div className="flex items-center gap-2">
                  {/* Killed Pill */}
                  {!summaryLoading && westBankMetrics?.killed && typeof westBankMetrics.killed === 'number' && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-destructive/15 to-destructive/5 border border-destructive/30 hover:border-destructive/50 hover:shadow-md hover:shadow-destructive/20 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold tabular-nums text-destructive leading-none">{westBankMetrics.killed.toLocaleString()}</span>
                        <span className="text-[8px] text-destructive/70 uppercase tracking-wider font-medium">Killed</span>
                      </div>
                    </div>
                  )}

                  {/* Injured Pill */}
                  {!summaryLoading && westBankMetrics?.injured && typeof westBankMetrics.injured === 'number' && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-warning/15 to-warning/5 border border-warning/30 hover:border-warning/50 hover:shadow-md hover:shadow-warning/20 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold tabular-nums text-warning leading-none">{westBankMetrics.injured.toLocaleString()}</span>
                        <span className="text-[8px] text-warning/70 uppercase tracking-wider font-medium">Injured</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Animated Years Counter */}
                <div className="group/duration relative">
                  <div className="flex items-baseline gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <span className="text-2xl md:text-3xl font-bold tabular-nums text-foreground group-hover/duration:text-secondary transition-colors duration-300">
                      {displayYears}
                    </span>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground group-hover/duration:text-secondary/70 uppercase tracking-wider font-medium leading-tight transition-colors">years</span>
                      <span className="text-[8px] text-muted-foreground/60 group-hover/duration:text-secondary/50 transition-colors">since 1948</span>
                    </div>
                  </div>
                  {/* Hover Popup - Fixed positioning */}
                  <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover/duration:opacity-100 group-hover/duration:visible scale-95 group-hover/duration:scale-100 transition-all duration-200 z-50">
                    <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg p-3 min-w-[180px]">
                      <div className="text-xs font-semibold mb-2 text-center">Since Nakba</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <span className="text-muted-foreground">Days:</span>
                        <span className="font-bold text-right">{daysSinceNakba.toLocaleString()}</span>
                        <span className="text-muted-foreground">Months:</span>
                        <span className="font-bold text-right">{Math.floor(daysSinceNakba / 30).toLocaleString()}</span>
                        <span className="text-muted-foreground">Since:</span>
                        <span className="font-bold text-right">May 15, 1948</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Floating Help Button */}
          <div className="fixed bottom-6 right-6 z-[100]">
            <HelpPanel
              categories={helpCategories}
              triggerVariant="pill"
            />
          </div>

          {/* Sub-Tabs Navigation */}
          <div 
            ref={tabsContainerRef}
            className={cn(
              "flex",
              isMobile ? "overflow-x-auto scrollbar-hide px-4" : "justify-center"
            )}
          >
            <div className={cn(isMobile && "min-w-max mx-auto")}>
              <PillTabs
                tabs={subTabs}
                activeTab={activeSubTab}
                onTabChange={setActiveSubTab}
                variant="sub"
                isMobile={false}
              />
            </div>
          </div>

        <Suspense fallback={<TabLoader />}>
          {isMobile ? (
            <SwipeableTabs
              activeTab={activeSubTab}
              tabs={subTabs.map(tab => tab.value)}
              onTabChange={setActiveSubTab}
            >
              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
            <TabsContent value="occupation" className="space-y-6">
              <TabTransition tabKey="occupation">
                <OccupationMetrics
                  summaryData={summaryData}
                  ochaSettlementsData={ochaSettlementsData}
                  loading={summaryLoading || ochaSettlementsLoading}
                />
              </TabTransition>
            </TabsContent>

            <TabsContent value="violence" className="space-y-6">
              <TabTransition tabKey="violence">
                <SettlerViolence
                  westBankData={westBankData}
                  summaryData={summaryData}
                  loading={westBankLoading || summaryLoading}
                />
              </TabTransition>
            </TabsContent>

            <TabsContent value="economic" className="space-y-6">
              <TabTransition tabKey="economic">
                <EconomicStrangulation
                  summaryData={summaryData}
                  westBankData={westBankData}
                  economicData={economicData}
                  loading={summaryLoading || westBankLoading || economicLoading}
                />
              </TabTransition>
            </TabsContent>

            <TabsContent value="prisoners" className="space-y-6">
              <TabTransition tabKey="prisoners">
                <PrisonersDetention
                  summaryData={summaryData}
                  westBankData={westBankData}
                  loading={summaryLoading || westBankLoading}
                />
              </TabTransition>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <TabTransition tabKey="analytics">
                <AnalyticsPanel region="westbank" />
              </TabTransition>
            </TabsContent>
          </Tabs>
            </SwipeableTabs>
          ) : (
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
              <TabsContent value="occupation" className="space-y-6">
                <TabTransition tabKey="occupation">
                  <OccupationMetrics
                    summaryData={summaryData}
                    ochaSettlementsData={ochaSettlementsData}
                    loading={summaryLoading || ochaSettlementsLoading}
                  />
                </TabTransition>
              </TabsContent>

              <TabsContent value="violence" className="space-y-6">
                <TabTransition tabKey="violence">
                  <SettlerViolence
                    westBankData={westBankData}
                    summaryData={summaryData}
                    loading={westBankLoading || summaryLoading}
                  />
                </TabTransition>
              </TabsContent>

              <TabsContent value="economic" className="space-y-6">
                <TabTransition tabKey="economic">
                  <EconomicStrangulation
                    summaryData={summaryData}
                    westBankData={westBankData}
                    economicData={economicData}
                    loading={summaryLoading || westBankLoading || economicLoading}
                  />
                </TabTransition>
              </TabsContent>

              <TabsContent value="prisoners" className="space-y-6">
                <TabTransition tabKey="prisoners">
                  <PrisonersDetention
                    summaryData={summaryData}
                    westBankData={westBankData}
                    loading={summaryLoading || westBankLoading}
                  />
                </TabTransition>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <TabTransition tabKey="analytics">
                  <AnalyticsPanel region="westbank" />
                </TabTransition>
              </TabsContent>
            </Tabs>
          )}
        </Suspense>
        </div>
      </PullToRefresh>
    </MobileOptimizedContainer>
  );
};

export default WestBankDashboard;