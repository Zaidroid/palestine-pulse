import { useMemo } from "react";
import { ExpandableMetricCard } from "./ExpandableMetricCard";
import { DemographicCharts } from "./DemographicCharts";
import {
  Users, AlertCircle, Newspaper, Flame, Heart, Activity,
  TrendingUp, Baby, UserX, Stethoscope, Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, PieChart, Pie, Cell
} from "recharts";
import { UnifiedBadge as DataQualityBadge } from "@/components/ui/unified-badge";
import { UnifiedBadge as DataLoadingBadge } from "@/components/ui/unified-badge";
import { useHealthFacilityStats } from "./hooks/useHealthFacilities";

interface GazaOverviewProps {
  gazaMetrics: any;
  pressCount: number;
  loading: boolean;
  casualtiesData: any[];
  dateRange: string;
}

export const GazaOverview = ({
  gazaMetrics,
  pressCount,
  loading,
  casualtiesData,
  dateRange
}: GazaOverviewProps) => {
  // Fetch health facilities data
  const healthStats = useHealthFacilityStats();

  // Process filtered trend data
  const filteredTrendData = useMemo(() => {
    const days = parseInt(dateRange);
    return casualtiesData?.slice(-days) || [];
  }, [casualtiesData, dateRange]);

  // Calculate trends for cards
  const killedTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    return filteredTrendData.map(item => ({
      value: item.killed || item.ext_killed || 0
    }));
  }, [filteredTrendData]);

  const injuredTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    return filteredTrendData.map(item => ({
      value: item.injured || item.ext_injured || 0
    }));
  }, [filteredTrendData]);

  // Calculate change percentage
  const calculateChange = (data: any[], key: string) => {
    if (!data || data.length < 2) return undefined;
    const recent = data.slice(-7).reduce((sum, item) => sum + (item[key] || item[`ext_${key}`] || 0), 0);
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + (item[key] || item[`ext_${key}`] || 0), 0);
    if (previous === 0) return undefined;
    return Math.round(((recent - previous) / previous) * 100);
  };

  // Calculate demographic breakdown for pie chart
  const demographicBreakdown = useMemo(() => {
    const total = gazaMetrics.killed?.total || 0;
    const children = gazaMetrics.killed?.children || 0;
    const women = gazaMetrics.killed?.women || 0;
    const medical = gazaMetrics.killed?.medical || 0;
    const civilDefence = gazaMetrics.killed?.civil_defence || 0;
    const men = total - children - women - medical - civilDefence;

    return [
      { name: 'Children', value: children, color: 'hsl(var(--chart-1))' },
      { name: 'Women', value: women, color: 'hsl(var(--chart-2))' },
      { name: 'Medical Personnel', value: medical, color: 'hsl(var(--chart-3))' },
      { name: 'Civil Defense', value: civilDefence, color: 'hsl(var(--chart-4))' },
      { name: 'Men (Non-Medical/Defense)', value: men > 0 ? men : 0, color: 'hsl(var(--chart-5))' }
    ].filter(item => item.value > 0);
  }, [gazaMetrics]);

  // Daily casualties trend - calculate daily children from cumulative
  const dailyTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    
    return filteredTrendData.map((item, index) => {
      // Calculate daily children killed from cumulative difference
      const currentChildrenCum = item.ext_killed_children_cum || 0;
      const prevChildrenCum = index > 0 ? (filteredTrendData[index - 1].ext_killed_children_cum || 0) : 0;
      const dailyChildren = index > 0 ? Math.max(0, currentChildrenCum - prevChildrenCum) : 0;
      
      return {
        date: new Date(item.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        killed: item.killed || item.ext_killed || 0,
        injured: item.injured || item.ext_injured || 0,
        children: dailyChildren
      };
    });
  }, [filteredTrendData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold">{entry.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get dynamic date range label
  const getDateRangeLabel = () => {
    const days = parseInt(dateRange);
    if (days === 7) return "Last 7 Days";
    if (days === 30) return "Last 30 Days";
    if (days === 60) return "Last 60 Days";
    if (days === 90) return "Last 90 Days";
    if (days >= 365) return "All Time";
    return `Last ${days} Days`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Data Quality Badge */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gaza Casualties</h2>
          <p className="text-muted-foreground">
            Real-time casualty tracking and demographic breakdown
          </p>
          <div className="mt-2">
            {loading ? (
              <DataLoadingBadge />
            ) : (
              <DataQualityBadge
                source="Tech4Palestine"
                isRealData={casualtiesData && casualtiesData.length > 0}
                recordCount={casualtiesData?.length}
                showDetails={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Primary Metrics - Enhanced Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpandableMetricCard
          title="Total Killed in Gaza"
          value={gazaMetrics.killed?.total || 0}
          icon={Users}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          trendData={killedTrend}
          change={calculateChange(filteredTrendData, 'killed')}
          subtitle={`Since October 7, 2023 • Updated ${gazaMetrics.last_update || ''}`}
          detailContent={
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-chart-1/10">
                  <div className="text-sm text-muted-foreground">Children</div>
                  <div className="text-2xl font-bold text-chart-1">
                    {(gazaMetrics.killed?.children || 0).toLocaleString()}
                  </div>
                  <Progress
                    value={(gazaMetrics.killed?.children / gazaMetrics.killed?.total) * 100 || 0}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="p-4 border rounded-lg bg-chart-2/10">
                  <div className="text-sm text-muted-foreground">Women</div>
                  <div className="text-2xl font-bold text-chart-2">
                    {(gazaMetrics.killed?.women || 0).toLocaleString()}
                  </div>
                  <Progress
                    value={(gazaMetrics.killed?.women / gazaMetrics.killed?.total) * 100 || 0}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="p-4 border rounded-lg bg-chart-3/10">
                  <div className="text-sm text-muted-foreground">Medical Personnel</div>
                  <div className="text-2xl font-bold text-chart-3">
                    {(gazaMetrics.killed?.medical || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-chart-4/10">
                  <div className="text-sm text-muted-foreground">Civil Defense</div>
                  <div className="text-2xl font-bold text-chart-4">
                    {(gazaMetrics.killed?.civil_defence || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <ExpandableMetricCard
          title="Total Injured in Gaza"
          value={gazaMetrics.injured?.total || 0}
          icon={AlertCircle}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          trendData={injuredTrend}
          change={calculateChange(filteredTrendData, 'injured')}
          subtitle="Many with life-changing injuries"
        />
      </div>

      {/* Secondary Metrics - 4 Columns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Massacres"
          value={gazaMetrics.massacres || 0}
          icon={Flame}
          loading={loading}
          gradient="from-destructive/30 to-transparent"
          subtitle="Family wipeouts"
        />
        <ExpandableMetricCard
          title="Famine Deaths"
          value={gazaMetrics.famine?.total || 0}
          subtitle={`${(gazaMetrics.famine?.children || 0).toLocaleString()} children`}
          icon={Heart}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
        />
        <ExpandableMetricCard
          title="Aid Seekers Killed"
          value={gazaMetrics.aid_seeker?.killed || 0}
          icon={Activity}
          loading={loading}
          gradient="from-chart-1/20 to-transparent"
          subtitle={`${(gazaMetrics.aid_seeker?.injured || 0).toLocaleString()} injured`}
        />
        <ExpandableMetricCard
          title="Press Killed"
          value={pressCount}
          icon={Newspaper}
          loading={loading}
          gradient="from-primary/20 to-transparent"
          subtitle="Journalists & media workers"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-1" />
              Demographic Breakdown of Fatalities
            </CardTitle>
            <CardDescription>Distribution of killed individuals by demographic group.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={demographicBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {demographicBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
