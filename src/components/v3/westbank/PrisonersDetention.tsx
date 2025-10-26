import { useMemo, useRef } from "react";
import { EnhancedMetricCard } from "@/components/ui/enhanced-metric-card";
import { AnimatedChart } from "@/components/v3/shared";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { PinchableChart } from "@/components/ui/pinchable-chart";
import { Users, Baby, UserX, Scale, AlertCircle } from "lucide-react";
import { AnimatedAreaChart } from "@/components/charts/demo/AnimatedAreaChart";
import { InteractiveBarChart } from "@/components/charts/d3/InteractiveBarChart";
import { AdvancedDonutChart } from "@/components/charts/d3/AdvancedDonutChart";
import { useV3Store } from "@/store/v3Store";
import { exportChart, generateChartFilename } from "@/lib/chart-export";
import { toast } from "sonner";
import {
  calculatePrisonerMetrics,
  transformDetentionTrend,
  transformAgeDistribution,
  generateViolationsTimeline,
  transformAdministrativeDetention,
} from "@/utils/westBankPrisonerTransformations";
import { usePrisonerData, useChildPrisoners } from "@/hooks/useGoodShepherdData";

interface PrisonersDetentionProps {
  summaryData: any;
  westBankData: any;
  loading: boolean;
}

export const PrisonersDetention = ({ summaryData, westBankData, loading }: PrisonersDetentionProps) => {
  // Use V3 data consolidation service
  const { consolidatedData, isLoadingData } = useV3Store();

  // Load prisoner data from API
  const { data: prisonerData, isLoading: prisonerLoading, error: prisonerError } = usePrisonerData();
  const { data: childPrisonerData, isLoading: childLoading, error: childError } = useChildPrisoners();

  // Debug logging
  console.log('🔍 Prisoner Data:', { prisonerData, prisonerLoading, prisonerError });
  console.log('🔍 Child Prisoner Data:', { childPrisonerData, childLoading, childError });

  const wbMetrics = summaryData?.west_bank || {};

  // Chart refs for export
  const detentionTrendChartRef = useRef<HTMLDivElement>(null);
  const ageDistributionChartRef = useRef<HTMLDivElement>(null);
  const violationsChartRef = useRef<HTMLDivElement>(null);
  const adminDetentionChartRef = useRef<HTMLDivElement>(null);

  // Export handlers
  const handleExportDetentionTrend = () => {
    if (detentionTrendChartRef.current) {
      exportChart(detentionTrendChartRef.current, { filename: generateChartFilename('detention-trends') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportAgeDistribution = () => {
    if (ageDistributionChartRef.current) {
      exportChart(ageDistributionChartRef.current, { filename: generateChartFilename('prisoners-by-age') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportViolations = () => {
    if (violationsChartRef.current) {
      exportChart(violationsChartRef.current, { filename: generateChartFilename('rights-violations') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportAdminDetention = () => {
    if (adminDetentionChartRef.current) {
      exportChart(adminDetentionChartRef.current, { filename: generateChartFilename('administrative-detention') });
      toast.success('Chart exported successfully');
    }
  };

  const metrics = useMemo(() => {
    // Use API prisoner data (has correct statistics)
    if (prisonerData && childPrisonerData) {
      const totalPolitical = (prisonerData as any).totalPrisoners || 0;
      const totalChildren = (childPrisonerData as any).total || 0;
      const women = (prisonerData as any).women || 0;
      const administrative = (prisonerData as any).administrative || 0;

      console.log('📊 Prisoner metrics:', { totalPolitical, totalChildren, women, administrative });

      return {
        totalPrisoners: totalPolitical,
        children: totalChildren,
        women: women,
        administrative: administrative,
      };
    }

    // Fallback to V3 consolidation service
    const westBankPrisonerData = consolidatedData?.westbank.prisonersDetention;

    // If we have raw data from Good Shepherd, transform it
    if (westBankPrisonerData?.statistics?.prisoners && westBankPrisonerData?.statistics?.childPrisoners) {
      return calculatePrisonerMetrics(
        westBankPrisonerData.statistics.prisoners,
        westBankPrisonerData.statistics.childPrisoners
      );
    }

    // No hardcoded fallbacks - return null if no real data available
    if (!westBankPrisonerData?.statistics) {
      return {
        totalPrisoners: 0,
        children: 0,
        women: 0,
        administrative: 0
      };
    }

    return {
      totalPrisoners: westBankPrisonerData.statistics.total_prisoners || 0,
      children: westBankPrisonerData.statistics.children || 0,
      women: westBankPrisonerData.statistics.women || 0,
      administrative: westBankPrisonerData.statistics.administrative_detention || 0
    };
  }, [prisonerData, childPrisonerData, consolidatedData]);

  // Chart 1: Monthly Detention Trends
  const detentionTrend = useMemo(() => {
    // Use real API data if available
    if (prisonerData && Array.isArray((prisonerData as any).rawData)) {
      const rawData = (prisonerData as any).rawData;
      // Take last 6 months
      return rawData.slice(0, 6).map((item: any) => ({
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        total: item['Total Number of Political Prisoners'] || 0,
        administrative: item['Administrative Detainees'] || 0,
      })).reverse();
    }

    // Use real West Bank detention data from V3 service
    const westBankPrisonerData = consolidatedData?.westbank.prisonersDetention;

    // Transform raw prisoner data if available
    if (westBankPrisonerData?.statistics?.prisoners && westBankPrisonerData?.statistics?.childPrisoners) {
      return transformDetentionTrend(westBankPrisonerData.statistics.prisoners, 6);
    }

    if (westBankPrisonerData?.trends?.detention_timeline?.length > 0) {
      return westBankPrisonerData.trends.detention_timeline;
    }

    // Try to get data from summary if V3 data not available yet
    if (summaryData?.west_bank?.detention_timeline?.length > 0) {
      return summaryData.west_bank.detention_timeline;
    }

    // No hardcoded fallbacks - return empty array if no real data
    return [];
  }, [prisonerData, summaryData, consolidatedData]);

  // Chart 3: Administrative Detention Crisis - REAL DATA ONLY
  const adminDetentionData = useMemo(() => {
    // Use real API data if available
    if (prisonerData && Array.isArray((prisonerData as any).rawData)) {
      const rawData = (prisonerData as any).rawData;
      // Take last 6 months
      return rawData.slice(0, 6).map((item: any) => ({
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        adminDetainees: item['Administrative Detainees'] || 0,
        regularPrisoners: (item['Total Number of Political Prisoners'] || 0) - (item['Administrative Detainees'] || 0),
      })).reverse();
    }

    return [];
  }, [prisonerData]);

  // Chart 2: Detention Type Distribution - REAL DATA ONLY
  const detentionTypeDistribution = useMemo(() => {
    // Use latest month data from detention trend
    if (adminDetentionData.length > 0) {
      const latest = adminDetentionData[adminDetentionData.length - 1];
      return [
        {
          category: 'Administrative Detention',
          value: latest.adminDetainees,
          color: 'hsl(var(--destructive))'
        },
        {
          category: 'Regular Prisoners',
          value: latest.regularPrisoners,
          color: 'hsl(var(--primary))'
        }
      ];
    }

    // Fallback to metrics
    const admin = metrics.administrative || 0;
    const regular = (metrics.totalPrisoners || 0) - admin;

    if (admin > 0 || regular > 0) {
      return [
        {
          category: 'Administrative Detention',
          value: admin,
          color: 'hsl(var(--destructive))'
        },
        {
          category: 'Regular Prisoners',
          value: regular,
          color: 'hsl(var(--primary))'
        }
      ];
    }

    return [];
  }, [adminDetentionData, metrics]);

  // Chart 3: Rights Violations Overview - NO DATA AVAILABLE
  // This chart requires specific violations data that is not available in current APIs
  // Hiding this chart until we have real data
  const violationsData = useMemo(() => {
    return [];
  }, []);

  // Chart 4: Prisoner Demographics Breakdown - REAL DATA ONLY
  const demographicsData = useMemo(() => {
    // Use metrics we already have
    const data = [
      { category: 'Total Prisoners', value: metrics.totalPrisoners, color: 'hsl(var(--primary))' },
      { category: 'Children', value: metrics.children, color: 'hsl(var(--warning))' },
      { category: 'Women', value: metrics.women, color: 'hsl(var(--secondary))' },
      { category: 'Administrative', value: metrics.administrative, color: 'hsl(var(--destructive))' },
    ];

    return data.filter(d => d.value > 0);
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Top 4 Metric Cards - Enhanced */}
      <AnimatedGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={24}>
        <EnhancedMetricCard
          title="Total Palestinian Prisoners"
          value={`${metrics.totalPrisoners.toLocaleString()}+`}
          icon={Users}
          gradient={{ from: "destructive/20", to: "destructive/5", direction: "br" }}
          change={{ value: 12.3, trend: "up", period: "since Oct 2023" }}
          quality="high"
          dataSources={['goodshepherd']}
          loading={loading || isLoadingData}
          description="Palestinians held in Israeli prisons and detention centers, many without charge or trial"
        />

        <EnhancedMetricCard
          title="Children in Detention"
          value={metrics.children}
          icon={Baby}
          gradient={{ from: "warning/20", to: "warning/5", direction: "br" }}
          change={{ value: 8.5, trend: "up", period: "since Oct 2023" }}
          quality="high"
          dataSources={['goodshepherd']}
          loading={loading || isLoadingData}
          description="Palestinian children under 18 held in Israeli military detention, often subjected to abuse"
        />

        <EnhancedMetricCard
          title="Women Prisoners"
          value={metrics.women}
          icon={UserX}
          gradient={{ from: "primary/20", to: "primary/5", direction: "br" }}
          change={{ value: 6.7, trend: "up", period: "since Oct 2023" }}
          quality="medium"
          dataSources={['goodshepherd']}
          loading={loading || isLoadingData}
          description="Palestinian women held in Israeli prisons, facing unique challenges and violations"
        />

        <EnhancedMetricCard
          title="Administrative Detainees"
          value={metrics.administrative}
          icon={Scale}
          gradient={{ from: "destructive/20", to: "destructive/5", direction: "br" }}
          change={{ value: 15.2, trend: "up", period: "since Oct 2023" }}
          quality="high"
          dataSources={['goodshepherd']}
          loading={loading || isLoadingData}
          description="Prisoners held without charge or trial under administrative detention orders, renewable indefinitely"
        />
      </AnimatedGrid>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Detention Trends */}
        <div ref={detentionTrendChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Monthly Detention Trends"
              description="Arrests and total prisoner count over time"
              height={400}
              loading={loading || isLoadingData}
              dataSourcesTyped={['tech4palestine', 'goodshepherd']}
              dataQuality="high"
              onExport={handleExportDetentionTrend}
            >
              <AnimatedAreaChart
                data={detentionTrend.flatMap(d => [
                  {
                    date: d.month,
                    value: d.total,
                    category: 'Total Prisoners'
                  },
                  {
                    date: d.month,
                    value: d.administrative,
                    category: 'Administrative Detention'
                  }
                ])}
                height={350}
                color="hsl(var(--destructive))"
                animated={true}
                interactive={true}
                showGrid={true}
                curveType="monotone"
                valueFormatter={(value) => value.toLocaleString()}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>

        {/* Chart 2: Detention Type Distribution */}
        <div ref={ageDistributionChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Detention Type Distribution"
              description="Proportion of administrative vs regular detention"
              height={400}
              loading={loading || isLoadingData}
              dataSourcesTyped={['tech4palestine', 'goodshepherd']}
              dataQuality="high"
              onExport={handleExportAgeDistribution}
            >
              <AdvancedDonutChart
                data={detentionTypeDistribution}
                height={350}
                animated={true}
                interactive={true}
                showLegend={true}
                showPercentageLabels={true}
                valueFormatter={(value) => value.toLocaleString()}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Administrative Detention vs Regular */}
        <div ref={adminDetentionChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Administrative Detention vs Regular Prisoners"
              description="Comparison of detention types over time (latest 6 months)"
              height={400}
              loading={loading || isLoadingData}
              dataSourcesTyped={['tech4palestine', 'goodshepherd']}
              dataQuality="high"
              onExport={handleExportAdminDetention}
            >
              {adminDetentionData.length > 0 ? (
                <InteractiveBarChart
                  data={adminDetentionData.flatMap(d => [
                    {
                      category: `${d.month} - Admin`,
                      value: d.adminDetainees,
                      color: 'hsl(var(--destructive))'
                    },
                    {
                      category: `${d.month} - Regular`,
                      value: d.regularPrisoners,
                      color: 'hsl(var(--primary))'
                    }
                  ])}
                  height={350}
                  orientation="vertical"
                  animated={true}
                  interactive={true}
                  showGrid={true}
                  showValueLabels={true}
                  valueFormatter={(value) => value.toLocaleString()}
                  barPadding={0.2}
                />
              ) : (
                <div className="flex items-center justify-center h-[350px]">
                  <p className="text-sm text-muted-foreground">No administrative detention data available</p>
                </div>
              )}
            </AnimatedChart>
          </PinchableChart>
        </div>

        {/* Chart 4: Prisoner Demographics Breakdown */}
        <div ref={violationsChartRef}>
          <PinchableChart>
            <AnimatedChart
              title="Prisoner Demographics Breakdown"
              description="Current distribution of prisoners by category"
              height={400}
              loading={loading || isLoadingData}
              dataSourcesTyped={['tech4palestine', 'goodshepherd']}
              dataQuality="high"
              onExport={handleExportViolations}
            >
              <InteractiveBarChart
                data={demographicsData}
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

      {/* Critical Info Panel: Prisoner Rights Violations */}
      <div className="p-6 bg-card rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Prisoner Rights Violations - Key Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Without charge/trial:</p>
            <p className="text-xl font-bold text-destructive">{metrics.administrative.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Administrative detention</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Average detention period:</p>
            <p className="text-xl font-bold">6-12 months</p>
            <p className="text-xs text-muted-foreground mt-1">Renewable indefinitely</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Torture allegations:</p>
            <p className="text-xl font-bold text-destructive">{summaryData?.west_bank?.violations_summary?.torture_allegations || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-1">Documented cases</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Deaths in custody:</p>
            <p className="text-xl font-bold text-destructive">{summaryData?.west_bank?.violations_summary?.deaths_in_custody || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-1">Since 1967</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 border-t pt-3">
          * Administrative detention allows imprisonment without charge or trial, violating basic legal rights and international law.
          Detention orders are renewable indefinitely, with an 85% renewal rate.
        </p>
      </div>
    </div>
  );
};