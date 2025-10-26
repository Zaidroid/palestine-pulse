import { useState, lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { SwipeableTabs } from "@/components/ui/swipeable-tabs";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { MobileOptimizedContainer } from "@/components/ui/mobile-optimized-container";
import { TabTransition } from "@/components/ui/page-transition";
import { AlertCircle, Building2, Users, Heart, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useV3Store } from "@/store/v3Store";
import { dataConsolidationService } from "@/services/dataConsolidationService";
import { useRecentData, useSingleData } from "@/hooks/useUnifiedData";
import { useDisplacementEstimates, usePopulationStatistics } from "@/hooks/usePopulation";
import { useWFPCommodityTrends, useWFPLatestPrices } from "@/hooks/useWFPData";
import { useHealthFacilityStats } from "@/hooks/useHealthFacilities";
import { HelpPanel } from "@/components/ui/help-panel";
import { helpCategories } from "@/data/help-content";
import { useBreakpoint } from "@/hooks/useBreakpoint";

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

  // Fetch all Gaza data from Tech4Palestine using unified hooks
  const { data: killedData, refetch: refetchKilled } = useRecentData(
    'tech4palestine',
    'killed-in-gaza',
    'https://data.techforpalestine.org/api/v3/killed-in-gaza.min.json'
  );

  const { data: pressData, refetch: refetchPress } = useSingleData(
    'tech4palestine',
    'press-killed',
    'https://data.techforpalestine.org/api/v2/press_killed_in_gaza.json'
  );

  const { data: summaryData, isLoading: summaryLoading, refetch: refetchSummary } = useSingleData(
    'tech4palestine',
    'summary',
    'https://data.techforpalestine.org/api/v3/summary.json'
  );

  const { data: casualtiesData, isLoading: casualtiesLoading, refetch: refetchCasualties } = useRecentData(
    'tech4palestine',
    'casualties',
    'https://data.techforpalestine.org/api/v2/casualties_daily.json'
  );

  const { data: infrastructureData, isLoading: infrastructureLoading, refetch: refetchInfrastructure } = useRecentData(
    'tech4palestine',
    'infrastructure',
    'https://data.techforpalestine.org/api/v3/infrastructure-damaged.json'
  );

  // Fetch additional data sources
  const displacementData = useDisplacementEstimates();
  const { data: wfpPrices, isLoading: wfpLoading, refetch: refetchWFPPrices } = useWFPCommodityTrends();
  const { data: wfpLatest, isLoading: wfpLatestLoading, refetch: refetchWFPLatest } = useWFPLatestPrices();
  const healthStats = useHealthFacilityStats();
  const populationStats = usePopulationStatistics();

  const gazaMetrics = summaryData?.gaza || {};

  // Refresh handler for pull-to-refresh
  const handleRefresh = async () => {
    // Refetch all data sources that support refetch
    await Promise.all([
      refetchKilled(),
      refetchPress(),
      refetchSummary(),
      refetchCasualties(),
      refetchInfrastructure(),
      refetchWFPPrices(),
      refetchWFPLatest(),
      fetchConsolidatedData()
    ]);
    // Note: displacementData, healthStats, and populationStats are derived from
    // other queries and will update automatically when their parent queries refetch
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

  // Calculate days since conflict began (October 7, 2023)
  const conflictStartDate = new Date('2023-10-07');
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - conflictStartDate.getTime()) / (1000 * 60 * 60 * 24));

  // Animated counter for days with easing
  const [displayDays, setDisplayDays] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const startTime = Date.now();

    // Easing function - ease out cubic for smooth deceleration
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayDays(Math.floor(easedProgress * daysSinceStart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayDays(daysSinceStart);
      }
    };

    requestAnimationFrame(animate);
  }, [daysSinceStart]);

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

  return (
    <MobileOptimizedContainer spacing="md" fullWidth>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-6 page-transition">
          {/* Ultra-Compact Interactive Banner */}
          <div>
            <div className="relative rounded-xl border border-border/50 bg-gradient-to-r from-card/50 via-destructive/5 to-card/50 backdrop-blur-md overflow-hidden group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
              {/* Animated Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Single Horizontal Row */}
              <div className="relative flex items-center justify-between gap-4 px-4 md:px-6 py-3.5">
                {/* Left: Title + Live */}
                <div className="flex items-center gap-3 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                    War On Gaza
                  </h1>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Center: Metric Pills - Interactive */}
                <div className="flex items-center gap-2">
                  {/* Casualties Pill */}
                  {!summaryLoading && gazaMetrics?.killed && typeof gazaMetrics.killed === 'number' && (
                    <div className="group/pill relative">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-destructive/15 to-destructive/5 border border-destructive/30 hover:border-destructive/50 hover:shadow-md hover:shadow-destructive/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold tabular-nums text-destructive leading-none">{(gazaMetrics.killed / 1000).toFixed(1)}k</span>
                          <span className="text-[8px] text-destructive/70 uppercase tracking-wider font-medium">Killed</span>
                        </div>
                      </div>
                      {/* Hover Popup */}
                      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover/pill:opacity-100 scale-90 group-hover/pill:scale-100 transition-all duration-200 pointer-events-none z-50">
                        <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg p-3 whitespace-nowrap">
                          <div className="text-xs font-semibold mb-1.5">{gazaMetrics.killed.toLocaleString()} total casualties</div>
                          <div className="space-y-0.5 text-[10px] text-muted-foreground">
                            {gazaMetrics.killed_children && <div>{gazaMetrics.killed_children.toLocaleString()} children</div>}
                            {gazaMetrics.killed_women && <div>{gazaMetrics.killed_women.toLocaleString()} women</div>}
                            <div className="pt-1 mt-1 border-t border-border/50 text-destructive font-medium">{Math.floor(gazaMetrics.killed / daysSinceStart)} per day avg</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Injured Pill */}
                  {!summaryLoading && gazaMetrics?.injured && typeof gazaMetrics.injured === 'number' && (
                    <div className="group/pill relative hidden sm:block">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-warning/15 to-warning/5 border border-warning/30 hover:border-warning/50 hover:shadow-md hover:shadow-warning/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold tabular-nums text-warning leading-none">{(gazaMetrics.injured / 1000).toFixed(1)}k</span>
                          <span className="text-[8px] text-warning/70 uppercase tracking-wider font-medium">Injured</span>
                        </div>
                      </div>
                      {/* Hover Popup */}
                      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover/pill:opacity-100 scale-90 group-hover/pill:scale-100 transition-all duration-200 pointer-events-none z-50">
                        <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg p-3 whitespace-nowrap">
                          <div className="text-xs font-semibold mb-1">{gazaMetrics.injured.toLocaleString()} injured</div>
                          <div className="text-[10px] text-muted-foreground">Requiring medical care</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Impact Pill */}
                  {!summaryLoading && gazaMetrics?.killed && typeof gazaMetrics.killed === 'number' && (
                    <div className="group/pill relative hidden lg:block">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold tabular-nums text-primary leading-none">{((gazaMetrics.killed / 2300000) * 100).toFixed(2)}%</span>
                          <span className="text-[8px] text-primary/70 uppercase tracking-wider font-medium">Impact</span>
                        </div>
                      </div>
                      {/* Hover Popup */}
                      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover/pill:opacity-100 scale-90 group-hover/pill:scale-100 transition-all duration-200 pointer-events-none z-50">
                        <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg p-3 whitespace-nowrap">
                          <div className="text-xs font-semibold mb-1">Population Impact</div>
                          <div className="text-[10px] text-muted-foreground">Of ~2.3M Gaza population</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Animated Duration Counter */}
                <div className="group/duration relative">
                  <div className="flex items-baseline gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <span className="text-2xl md:text-3xl font-bold tabular-nums text-foreground group-hover/duration:text-primary transition-colors duration-300">
                      {displayDays}
                    </span>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground group-hover/duration:text-primary/70 uppercase tracking-wider font-medium leading-tight transition-colors">days</span>
                      <span className="text-[8px] text-muted-foreground/60 group-hover/duration:text-primary/50 transition-colors">since Oct 7</span>
                    </div>
                  </div>
                  {/* Hover Popup - Fixed positioning */}
                  <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover/duration:opacity-100 group-hover/duration:visible scale-95 group-hover/duration:scale-100 transition-all duration-200 z-50">
                    <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-2xl rounded-lg p-3 min-w-[180px]">
                      <div className="text-xs font-semibold mb-2 text-center">Time Breakdown</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <span className="text-muted-foreground">Weeks:</span>
                        <span className="font-bold text-right">{Math.floor(displayDays / 7)}</span>
                        <span className="text-muted-foreground">Months:</span>
                        <span className="font-bold text-right">{Math.floor(displayDays / 30)}</span>
                        <span className="text-muted-foreground">Hours:</span>
                        <span className="font-bold text-right">{(displayDays * 24).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <TabsContent value="humanitarian" className="space-y-6">
                    <TabTransition tabKey="humanitarian">
                      <HumanitarianCrisis
                        gazaMetrics={gazaMetrics}
                        casualtiesData={casualtiesData}
                        pressData={pressData}
                        loading={summaryLoading || casualtiesLoading}
                        killedData={killedData}
                      />
                    </TabTransition>
                  </TabsContent>

                  <TabsContent value="infrastructure" className="space-y-6">
                    <TabTransition tabKey="infrastructure">
                      <InfrastructureDestruction
                        infrastructureData={infrastructureData}
                        gazaMetrics={gazaMetrics}
                        healthStats={healthStats}
                        loading={infrastructureLoading || summaryLoading || healthStats.isLoading}
                      />
                    </TabTransition>
                  </TabsContent>

                  <TabsContent value="population" className="space-y-6">
                    <TabTransition tabKey="population">
                      <PopulationImpact
                        gazaMetrics={gazaMetrics}
                        casualtiesData={casualtiesData}
                        displacementData={displacementData}
                        infrastructureData={infrastructureData}
                        populationStats={populationStats}
                        loading={summaryLoading || casualtiesLoading || displacementData.isLoading || infrastructureLoading || populationStats.isLoading}
                        killedData={killedData}
                      />
                    </TabTransition>
                  </TabsContent>

                  <TabsContent value="aid" className="space-y-6">
                    <TabTransition tabKey="aid">
                      <AidSurvival
                        gazaMetrics={gazaMetrics}
                        wfpPrices={wfpPrices}
                        wfpLatest={wfpLatest}
                        healthStats={healthStats}
                        loading={summaryLoading || wfpLoading || wfpLatestLoading || healthStats.isLoading}
                      />
                    </TabTransition>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-6">
                    <TabTransition tabKey="analytics">
                      <AnalyticsPanel region="gaza" />
                    </TabTransition>
                  </TabsContent>
                </Tabs>
              </SwipeableTabs>
            ) : (
              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
                <TabsContent value="humanitarian" className="space-y-6">
                  <TabTransition tabKey="humanitarian">
                    <HumanitarianCrisis
                      gazaMetrics={gazaMetrics}
                      casualtiesData={casualtiesData}
                      pressData={pressData}
                      loading={summaryLoading || casualtiesLoading}
                      killedData={killedData}
                    />
                  </TabTransition>
                </TabsContent>

                <TabsContent value="infrastructure" className="space-y-6">
                  <TabTransition tabKey="infrastructure">
                    <InfrastructureDestruction
                      infrastructureData={infrastructureData}
                      gazaMetrics={gazaMetrics}
                      healthStats={healthStats}
                      loading={infrastructureLoading || summaryLoading || healthStats.isLoading}
                    />
                  </TabTransition>
                </TabsContent>

                <TabsContent value="population" className="space-y-6">
                  <TabTransition tabKey="population">
                    <PopulationImpact
                      gazaMetrics={gazaMetrics}
                      casualtiesData={casualtiesData}
                      displacementData={displacementData}
                      infrastructureData={infrastructureData}
                      populationStats={populationStats}
                      loading={summaryLoading || casualtiesLoading || displacementData.isLoading || infrastructureLoading || populationStats.isLoading}
                      killedData={killedData}
                    />
                  </TabTransition>
                </TabsContent>

                <TabsContent value="aid" className="space-y-6">
                  <TabTransition tabKey="aid">
                    <AidSurvival
                      gazaMetrics={gazaMetrics}
                      wfpPrices={wfpPrices}
                      wfpLatest={wfpLatest}
                      healthStats={healthStats}
                      loading={summaryLoading || wfpLoading || wfpLatestLoading || healthStats.isLoading}
                    />
                  </TabTransition>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <TabTransition tabKey="analytics">
                    <AnalyticsPanel region="gaza" />
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

export default GazaWarDashboard;