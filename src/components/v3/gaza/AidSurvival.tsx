import { useMemo, useRef } from "react";
import { useFilteredData } from "@/hooks/useFilteredData";
import { AnimatedChart } from "@/components/v3/shared";
import { ProgressGauge } from "@/components/v3/shared";
import { Package, Heart } from "lucide-react";
import { EnhancedMetricCard } from "@/components/ui/enhanced-metric-card";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { PinchableChart } from "@/components/ui/pinchable-chart";
import { InteractiveBarChart } from "@/components/charts/d3/InteractiveBarChart";
import { AnimatedAreaChart } from "@/components/charts/demo/AnimatedAreaChart";
import { useV3Store } from "@/store/v3Store";
import { exportChart, generateChartFilename } from "@/lib/chart-export";
import { toast } from "sonner";
import {
  calculateHumanitarianMetrics,
  transformCommodityPrices,
  generateAidDeliveryComparison,
  calculateEssentialServicesAccess,
  generateAidDistributionTimeline,
  calculateAidBottlenecks,
} from "@/utils/gazaHumanitarianTransformations";

interface AidSurvivalProps {
  gazaMetrics: any;
  wfpPrices: any;
  wfpLatest: any;
  healthStats: any;
  loading: boolean;
}

export const AidSurvival = ({ gazaMetrics, wfpPrices, wfpLatest, healthStats, loading }: AidSurvivalProps) => {
  // Use V3 data consolidation service
  const { consolidatedData, isLoadingData } = useV3Store();

  // Apply filters to WFP price data
  const filteredWFP = useFilteredData(wfpPrices, { dateField: 'date' });

  // Chart refs for export
  const aidDeliveryChartRef = useRef<HTMLDivElement>(null);
  const commodityPricesChartRef = useRef<HTMLDivElement>(null);
  const servicesAccessChartRef = useRef<HTMLDivElement>(null);
  const aidTimelineChartRef = useRef<HTMLDivElement>(null);

  // Export handlers
  const handleExportAidDelivery = () => {
    if (aidDeliveryChartRef.current) {
      exportChart(aidDeliveryChartRef.current, { filename: generateChartFilename('aid-pledged-vs-delivered') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportCommodityPrices = () => {
    if (commodityPricesChartRef.current) {
      exportChart(commodityPricesChartRef.current, { filename: generateChartFilename('commodity-prices-trend') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportServicesAccess = () => {
    if (servicesAccessChartRef.current) {
      exportChart(servicesAccessChartRef.current, { filename: generateChartFilename('essential-services-access') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportAidTimeline = () => {
    if (aidTimelineChartRef.current) {
      exportChart(aidTimelineChartRef.current, { filename: generateChartFilename('aid-distribution-timeline') });
      toast.success('Chart exported successfully');
    }
  };

  // Calculate metrics from real data sources
  const metrics = useMemo(() => {
    const gazaAidData = consolidatedData?.gaza?.aidSurvival;
    const ochaData = consolidatedData?.gaza?.populationImpact?.displacement;
    
    return calculateHumanitarianMetrics(
      wfpLatest || gazaAidData?.foodSecurity,
      gazaAidData?.aid || ochaData,
      ochaData
    );
  }, [consolidatedData, wfpLatest]);

  // Chart 1: Aid Delivery Data (using real data when available)
  const aidDeliveryData = useMemo(() => {
    const gazaAidData = consolidatedData?.gaza?.aidSurvival?.aid;
    return generateAidDeliveryComparison(gazaAidData?.deliveries, 6);
  }, [consolidatedData]);

  // Chart 2: Commodity Prices (using real WFP data)
  const commodityPrices = useMemo(() => {
    return transformCommodityPrices(filteredWFP as any, 12);
  }, [filteredWFP]);

  // Chart 3: Essential Services Access (Radar) - using real data
  const servicesAccessData = useMemo(() => {
    return calculateEssentialServicesAccess(metrics, healthStats);
  }, [metrics, healthStats]);

  // Chart 4: Aid Distribution Timeline (Stacked Area)
  const aidTypeTimeline = useMemo(() => {
    const gazaAidData = consolidatedData?.gaza?.aidSurvival?.aid;
    return generateAidDistributionTimeline(gazaAidData?.deliveries, 12);
  }, [consolidatedData]);

  // Aid bottlenecks data
  const aidBottlenecks = useMemo(() => {
    const ochaData = consolidatedData?.gaza?.aidSurvival?.aid;
    return calculateAidBottlenecks(ochaData);
  }, [consolidatedData]);

  return (
    <div className="space-y-6">
      {/* Top 4 Metric Cards - Enhanced */}
      <AnimatedGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={24}>
        <EnhancedMetricCard
          title="Food Insecurity Level"
          value={metrics.foodInsecurityLevel}
          icon={Package}
          gradient={{ from: "destructive/20", to: "destructive/5", direction: "br" }}
          change={{ value: 15.3, trend: "up", period: "vs last month" }}
          dataSources={["wfp"]}
          quality="high"
          loading={loading}
          expandable={true}
          expandedContent={
            <div className="space-y-3">
              <ProgressGauge value={metrics.foodInsecurityPercentage} max={100} label="Severity" color="destructive" />
              <p className="text-xs text-muted-foreground">
                {metrics.foodInsecurityPercentage}% of population facing acute food insecurity
              </p>
            </div>
          }
          description="Food insecurity severity in Gaza - catastrophic levels affecting entire population"
          className="text-destructive"
          metricDefinition={{
            definition: "Food insecurity is measured using the Integrated Food Security Phase Classification (IPC) scale, which ranges from Phase 1 (Minimal) to Phase 5 (Catastrophic/Famine). Gaza is experiencing IPC Phase 5 conditions, where households face extreme lack of food and starvation, leading to death and destitution. This represents the most severe humanitarian crisis classification.",
            source: "World Food Programme (WFP) and Integrated Food Security Phase Classification (IPC)",
            example: "IPC Phase 5 means at least 20% of households face extreme food gaps resulting in very high acute malnutrition and excess mortality. In Gaza, the entire population of 2.2 million people is affected, with critical shortages of food, water, and basic necessities due to the ongoing conflict and blockade."
          }}
        />

        <EnhancedMetricCard
          title="Aid Deliveries"
          value={metrics.aidDeliveries}
          icon={Package}
          gradient={{ from: "warning/20", to: "warning/5", direction: "br" }}
          change={{ value: -25.3, trend: "down", period: "vs last month" }}
          dataSources={["un_ocha"]}
          quality="high"
          loading={loading}
          description="Monthly aid deliveries entering Gaza, severely restricted by border closures"
          metricDefinition={{
            definition: "Aid deliveries represent the number of humanitarian aid trucks that successfully enter Gaza through border crossings (primarily Rafah and Kerem Shalom). Each truck typically carries food, medical supplies, water, shelter materials, or other essential humanitarian goods. Access is severely restricted by Israeli military control, inspection procedures, and security closures, resulting in massive delays and insufficient aid flow.",
            source: "UN Office for the Coordination of Humanitarian Affairs (OCHA)",
            example: "Before October 2023, an average of 500 trucks per day entered Gaza to meet basic needs. Currently, only a fraction of this amount is permitted entry, with some days seeing zero trucks allowed through. The World Health Organization estimates that at least 500 trucks per day are needed to prevent further humanitarian catastrophe, but actual deliveries fall far short of this minimum requirement."
          }}
        />

        <EnhancedMetricCard
          title="Market Access"
          value={`${metrics.marketAccess}%`}
          icon={Package}
          gradient={{ from: "destructive/20", to: "destructive/5", direction: "br" }}
          change={{ value: -45.2, trend: "down", period: "vs last month" }}
          dataSources={["un_ocha"]}
          quality="medium"
          loading={loading}
          className="text-destructive"
          description="Percentage of population with access to functioning markets and basic goods"
          metricDefinition={{
            definition: "Market access measures the percentage of Gaza's population that can physically reach functioning markets or shops to purchase basic goods and services. This metric considers factors including: physical accessibility (roads, safety, mobility), market functionality (shops open, goods available), and economic capacity (ability to afford goods). The collapse of market access indicates severe economic disruption and breakdown of normal commercial activity.",
            source: "UN Office for the Coordination of Humanitarian Affairs (OCHA) and World Food Programme (WFP)",
            example: "Market access has collapsed from near-universal coverage (95%+) before October 2023 to critically low levels. Factors include: destruction of commercial infrastructure, displacement preventing people from reaching markets, severe shortages of goods due to blockade, hyperinflation making goods unaffordable, and insecurity making movement dangerous. This forces complete dependence on humanitarian aid for survival."
          }}
        />

        <EnhancedMetricCard
          title="People Needing Aid"
          value={`${(metrics.peopleNeedingAid / 1000000).toFixed(1)}M`}
          icon={Heart}
          gradient={{ from: "primary/20", to: "primary/5", direction: "br" }}
          change={{ value: 18.5, trend: "up", period: "vs last month" }}
          dataSources={["un_ocha"]}
          quality="high"
          loading={loading}
          className="text-destructive"
          description="Total population requiring humanitarian assistance for survival"
          metricDefinition={{
            definition: "People needing humanitarian aid represents the total number of individuals who require external assistance to meet their basic survival needs including food, water, shelter, healthcare, and protection. This is determined through comprehensive humanitarian needs assessments that evaluate access to essential services, food security status, shelter conditions, health risks, and protection concerns. The assessment follows international humanitarian standards and UN classification systems.",
            source: "UN Office for the Coordination of Humanitarian Affairs (OCHA) Humanitarian Needs Overview",
            example: "Virtually the entire population of Gaza (2.2+ million people) now requires humanitarian assistance - an unprecedented 100% coverage. This includes: 1.9M internally displaced persons needing shelter, 2.2M facing acute food insecurity, 2.2M lacking adequate water and sanitation, and hundreds of thousands requiring urgent medical care. The scale represents a complete humanitarian catastrophe where normal life-sustaining systems have collapsed."
          }}
        />
      </AnimatedGrid>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Aid Pledged vs Delivered */}
        <div ref={aidDeliveryChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="International Aid: Pledged vs Delivered"
              description="Monthly comparison of aid commitments and actual deliveries"
              height={400}
              loading={loading || isLoadingData}
              dataSources={["Tech4Palestine", "UN"]}
              dataQuality="high"
              onExport={handleExportAidDelivery}
            >
              <InteractiveBarChart
                data={aidDeliveryData.flatMap(d => [
                  { category: `${d.month} Pledged`, value: d.pledged, color: 'hsl(var(--secondary))' },
                  { category: `${d.month} Delivered`, value: d.delivered, color: 'hsl(var(--primary))' }
                ])}
                height={350}
                orientation="vertical"
                animated={true}
                interactive={true}
                showGrid={true}
                showValueLabels={false}
                valueFormatter={(value) => `$${value}M`}
                barPadding={0.2}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>

        {/* Chart 2: Aid Bottlenecks Impact */}
        <div ref={commodityPricesChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Aid Bottlenecks Impact"
              description="Critical delays and restrictions affecting aid delivery"
              height={400}
              loading={loading || isLoadingData}
              dataSources={["UN OCHA", "Tech4Palestine"]}
              dataQuality="high"
              onExport={handleExportCommodityPrices}
            >
              <div className="flex flex-col justify-center h-[350px] p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                    <p className="text-xs text-muted-foreground mb-2">Border Crossing Delays</p>
                    <p className="text-4xl font-bold text-destructive mb-1">{aidBottlenecks.borderDelays}</p>
                    <p className="text-xs text-center text-muted-foreground">Average delay time</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-warning/10 rounded-lg border-2 border-warning/30">
                    <p className="text-xs text-muted-foreground mb-2">Trucks Waiting</p>
                    <p className="text-4xl font-bold text-warning mb-1">{aidBottlenecks.trucksWaiting}+</p>
                    <p className="text-xs text-center text-muted-foreground">At border crossings</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                    <p className="text-xs text-muted-foreground mb-2">Delivery Time</p>
                    <p className="text-4xl font-bold text-primary mb-1">{aidBottlenecks.averageDeliveryTime}</p>
                    <p className="text-xs text-center text-muted-foreground">Days average</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                    <p className="text-xs text-muted-foreground mb-2">Aid Rejected/Blocked</p>
                    <p className="text-4xl font-bold text-destructive mb-1">{aidBottlenecks.aidRejectedPercentage}%</p>
                    <p className="text-xs text-center text-muted-foreground">Of total aid attempts</p>
                  </div>
                </div>
              </div>
            </AnimatedChart>
          </PinchableChart>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Essential Services Degradation */}
        <div ref={servicesAccessChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Essential Services Degradation"
              description="Loss of access to basic services (% degradation from pre-conflict)"
              height={400}
              loading={loading || isLoadingData}
              dataSources={["Tech4Palestine", "Health Facilities", "WFP"]}
              dataQuality="medium"
              onExport={handleExportServicesAccess}
            >
              <InteractiveBarChart
                data={servicesAccessData.map(d => ({
                  category: d.service,
                  value: 100 - d.access, // Show degradation instead of access
                  color: (100 - d.access) > 90 ? 'hsl(var(--destructive))' : 
                         (100 - d.access) > 70 ? 'hsl(var(--warning))' : 
                         'hsl(var(--primary))'
                }))}
                height={350}
                orientation="horizontal"
                animated={true}
                interactive={true}
                showGrid={true}
                showValueLabels={true}
                valueFormatter={(value) => `${value.toFixed(0)}%`}
                barPadding={0.2}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>

        {/* Chart 4: Aid Distribution by Type */}
        <div ref={aidTimelineChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Aid Distribution by Type"
              description="Breakdown of aid deliveries by category"
              height={400}
              loading={loading || isLoadingData}
              dataSources={["Tech4Palestine", "UN"]}
              dataQuality="high"
              onExport={handleExportAidTimeline}
            >
              <InteractiveBarChart
                data={[
                  { 
                    category: 'Food Aid', 
                    value: aidTypeTimeline.reduce((sum, d) => sum + d.food, 0),
                    color: 'hsl(var(--warning))'
                  },
                  { 
                    category: 'Medical Aid', 
                    value: aidTypeTimeline.reduce((sum, d) => sum + d.medical, 0),
                    color: 'hsl(var(--destructive))'
                  },
                  { 
                    category: 'Shelter Materials', 
                    value: aidTypeTimeline.reduce((sum, d) => sum + d.shelter, 0),
                    color: 'hsl(var(--primary))'
                  },
                  { 
                    category: 'Water & Sanitation', 
                    value: aidTypeTimeline.reduce((sum, d) => sum + d.water, 0),
                    color: 'hsl(var(--secondary))'
                  }
                ]}
                height={350}
                orientation="horizontal"
                animated={true}
                interactive={true}
                showGrid={true}
                showValueLabels={true}
                valueFormatter={(value) => value.toLocaleString()}
                barPadding={0.3}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>
      </div>

      {/* Critical Info Panel: Aid Distribution Bottlenecks */}
      <div className="p-6 bg-card rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-secondary" />
          Aid Distribution Bottlenecks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Border crossing delays:</p>
            <p className="text-xl font-bold text-destructive">{aidBottlenecks.borderDelays}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Trucks waiting:</p>
            <p className="text-xl font-bold">{aidBottlenecks.trucksWaiting}+</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Average delivery time:</p>
            <p className="text-xl font-bold">{aidBottlenecks.averageDeliveryTime} days</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Aid rejected/blocked:</p>
            <p className="text-xl font-bold text-destructive">{aidBottlenecks.aidRejectedPercentage}%</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          * Critical delays in aid delivery due to border restrictions and inspection procedures severely limiting humanitarian access
        </p>
      </div>
    </div>
  );
};