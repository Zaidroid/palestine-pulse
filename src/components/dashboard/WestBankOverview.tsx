import { useMemo } from "react";
import { ExpandableMetricCard } from "./ExpandableMetricCard";
import { Users, AlertCircle, Shield, Activity, Home, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, BarChart
} from "recharts";
import { useHomeDemolitionsSummary, useWestBankData } from "./hooks/useGoodShepherdData";
import { getTopN } from "./utils/dataAggregation";
import { DataQualityBadge, DataLoadingBadge } from "./components/ui/data-quality-badge";
import { useEconomicSnapshot, useLatestValue, calculateYoYChange, transformForChart } from "./hooks/useWorldBankData";

interface WestBankOverviewProps {
  westBankMetrics: any;
  loading: boolean;
  westBankData: any[];
  dateRange: string;
}

export const WestBankOverview = ({
  westBankMetrics,
  loading: externalLoading,
  westBankData,
  dateRange
}: WestBankOverviewProps) => {
  // Fetch Good Shepherd data
  const { data: demolitions, isLoading: demolitionsLoading, error: demolitionsError } = useHomeDemolitionsSummary();
  const { data: wbData, isLoading: wbDataLoading, error: wbDataError } = useWestBankData();

  // Fetch World Bank economic data
  const { data: economicData, isLoading: economicLoading, error: economicError } = useEconomicSnapshot(2020, 2023);

  const loading = externalLoading || demolitionsLoading || wbDataLoading || economicLoading;
  
  // Data quality tracking
  const hasTech4PalestineData = westBankData && westBankData.length > 0;
  const hasGoodShepherdWBData = !wbDataError && wbData;
  const hasGoodShepherdDemolitions = !demolitionsError && demolitions;
  const hasWorldBankData = !economicError && economicData;
  const dataSourceCount = [hasTech4PalestineData, hasGoodShepherdWBData, hasGoodShepherdDemolitions, hasWorldBankData].filter(Boolean).length;
  
  // Process demolitions data
  const demolitionsByRegion = demolitions ? getTopN(demolitions.byRegion, 8) : [];
  const demolitionTrend = demolitions?.byMonth.slice(-12) || [];
  // Process filtered trend data
  const filteredTrendData = useMemo(() => {
    const days = parseInt(dateRange);
    return westBankData?.slice(-days) || [];
  }, [westBankData, dateRange]);

  // Calculate daily values from cumulative for trend
  const killedTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    return filteredTrendData.map((item, index) => {
      // Calculate daily from cumulative difference
      const currentCum = item.killed_cum || 0;
      const prevCum = index > 0 ? (filteredTrendData[index - 1].killed_cum || 0) : 0;
      return {
        value: index > 0 ? Math.max(0, currentCum - prevCum) : 0
      };
    });
  }, [filteredTrendData]);

  // Daily casualties trend - calculate from cumulative
  const dailyCasualtiesTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    
    return filteredTrendData.map((item, index) => {
      const currentKilledCum = item.killed_cum || 0;
      const prevKilledCum = index > 0 ? (filteredTrendData[index - 1].killed_cum || 0) : 0;
      const dailyKilled = index > 0 ? Math.max(0, currentKilledCum - prevKilledCum) : 0;
      
      const currentInjuredCum = item.injured_cum || 0;
      const prevInjuredCum = index > 0 ? (filteredTrendData[index - 1].injured_cum || 0) : 0;
      const dailyInjured = index > 0 ? Math.max(0, currentInjuredCum - prevInjuredCum) : 0;
      
      return {
        date: new Date(item.report_date).toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric" 
        }),
        killed: dailyKilled,
        injured: dailyInjured
      };
    });
  }, [filteredTrendData]);

  // Settler attacks timeline with cumulative data
  const settlerAttacksTrend = useMemo(() => {
    if (!filteredTrendData.length) return [];
    
    return filteredTrendData.map((item) => ({
      date: new Date(item.report_date).toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      }),
      attacks: item.settler_attacks_cum || 0,
      killed: item.killed_cum || 0,
      injured: item.injured_cum || 0
    }));
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">West Bank Violence</h2>
          <p className="text-muted-foreground">
            Daily violence tracking and settler attacks in the West Bank
          </p>
          <div className="mt-2">
            {loading ? (
              <DataLoadingBadge />
            ) : (
              <DataQualityBadge
                source={`Tech4Palestine${hasGoodShepherdWBData || hasGoodShepherdDemolitions ? ' + Good Shepherd' : ''}${hasWorldBankData ? ' + World Bank' : ''}`}
                isRealData={dataSourceCount > 0}
                recordCount={westBankData?.length}
                showDetails={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Total Killed"
          value={westBankMetrics.killed?.total || 0}
          icon={Users}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          trendData={killedTrend}
          subtitle="Since October 7, 2023"
          detailContent={
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Adults</div>
                  <div className="text-2xl font-bold">
                    {((westBankMetrics.killed?.total || 0) - (westBankMetrics.killed?.children || 0)).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-chart-1/20">
                  <div className="text-sm text-muted-foreground">Children</div>
                  <div className="text-2xl font-bold text-chart-1">
                    {(westBankMetrics.killed?.children || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <ExpandableMetricCard
          title="Total Injured"
          value={westBankMetrics.injured?.total || 0}
          icon={AlertCircle}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          subtitle={`${(westBankMetrics.injured?.children || 0).toLocaleString()} children`}
        />
        <ExpandableMetricCard
          title="Settler Attacks"
          value={westBankMetrics.settler_attacks || 0}
          icon={Shield}
          loading={loading}
          gradient="from-chart-2/20 to-transparent"
          subtitle="Documented incidents"
        />
        <ExpandableMetricCard
          title="Children Casualties"
          value={(westBankMetrics.killed?.children || 0) + (westBankMetrics.injured?.children || 0)}
          icon={Activity}
          loading={loading}
          gradient="from-primary/20 to-transparent"
          subtitle={`${westBankMetrics.killed?.children || 0} killed, ${westBankMetrics.injured?.children || 0} injured`}
        />
      </div>

      {/* Economic Impact Overview */}
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Economic Impact Overview
              </CardTitle>
              <CardDescription>Key economic indicators for Palestine (World Bank Open Data)</CardDescription>
            </div>
            <DataQualityBadge
              source="World Bank"
              isRealData={!!economicData && Object.keys(economicData).some(key => economicData[key] && economicData[key].length > 0)}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {economicLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : economicError ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load economic data
            </div>
          ) : economicData ? (
            <div className="space-y-6">
              {/* Key Economic Metrics */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">GDP (Latest)</div>
                  <div className="text-2xl font-bold mt-1">
                    ${economicData['NY.GDP.MKTP.CD'] && (() => {
                      const val = useLatestValue(economicData['NY.GDP.MKTP.CD'])?.value;
                      if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                      if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                      return val?.toLocaleString();
                    })() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {economicData['NY.GDP.MKTP.CD'] && calculateYoYChange(economicData['NY.GDP.MKTP.CD']) !== null ?
                      `${calculateYoYChange(economicData['NY.GDP.MKTP.CD']) > 0 ? '+' : ''}${calculateYoYChange(economicData['NY.GDP.MKTP.CD'])?.toFixed(1)}% YoY` :
                      'No change data'
                    }
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="text-sm text-muted-foreground">GDP Per Capita</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    ${economicData['NY.GDP.PCAP.CD'] && useLatestValue(economicData['NY.GDP.PCAP.CD'])?.value?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    USD per person
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="text-sm text-muted-foreground">Unemployment Rate</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {economicData['SL.UEM.TOTL.ZS'] && useLatestValue(economicData['SL.UEM.TOTL.ZS'])?.value?.toFixed(1) || 'N/A'}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {economicData['SL.UEM.TOTL.ZS'] && calculateYoYChange(economicData['SL.UEM.TOTL.ZS']) !== null ?
                      `${calculateYoYChange(economicData['SL.UEM.TOTL.ZS']) > 0 ? '+' : ''}${calculateYoYChange(economicData['SL.UEM.TOTL.ZS'])?.toFixed(1)}% YoY` :
                      'No change data'
                    }
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm text-muted-foreground">Inflation Rate</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {economicData['FP.CPI.TOTL.ZG'] && useLatestValue(economicData['FP.CPI.TOTL.ZG'])?.value?.toFixed(1) || 'N/A'}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Consumer prices
                  </div>
                </div>
              </div>

              {/* Trade Data */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Exports</span>
                  </div>
                  <div className="text-xl font-bold">
                    ${economicData['NE.EXP.GNFS.CD'] && (() => {
                      const val = useLatestValue(economicData['NE.EXP.GNFS.CD'])?.value;
                      if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                      if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                      return val?.toLocaleString();
                    })() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Goods and services
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Imports</span>
                  </div>
                  <div className="text-xl font-bold">
                    ${economicData['NE.IMP.GNFS.CD'] && (() => {
                      const val = useLatestValue(economicData['NE.IMP.GNFS.CD'])?.value;
                      if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                      if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                      return val?.toLocaleString();
                    })() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Goods and services
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No economic data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Casualties Trend */}
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-destructive" />
                Daily Casualties
              </CardTitle>
              <CardDescription>Daily killed and injured Palestinians in the West Bank ({getDateRangeLabel()})</CardDescription>
            </div>
            <DataQualityBadge
              source="Tech4Palestine"
              isRealData={hasTech4PalestineData}
              recordCount={westBankData?.length}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={dailyCasualtiesTrend} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="killedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Daily Count', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                <Bar 
                  dataKey="killed" 
                  fill="hsl(var(--destructive))" 
                  name="Daily Killed"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="injured" 
                  fill="hsl(var(--chart-4))" 
                  name="Daily Injured"
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Settler Attacks & Cumulative Casualties Timeline */}
      <Card className="border-border bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Settler Violence & Cumulative Impact
                </CardTitle>
                <DataQualityBadge
                  source="Tech4Palestine"
                  isRealData={hasTech4PalestineData}
                  recordCount={westBankData?.length}
                  showDetails={false}
                />
              </div>
              <CardDescription>Cumulative settler attacks and resulting casualties ({getDateRangeLabel()})</CardDescription>
            </div>
          </div>
          {settlerAttacksTrend.length > 0 && (
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="bg-secondary/20">
                {(settlerAttacksTrend[settlerAttacksTrend.length - 1]?.attacks || 0).toLocaleString()} Attacks
              </Badge>
              <Badge variant="destructive" className="bg-destructive/20">
                {(settlerAttacksTrend[settlerAttacksTrend.length - 1]?.killed || 0).toLocaleString()} Killed
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={settlerAttacksTrend} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="attacksAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Cumulative Attacks', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Cumulative Casualties', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} 
                  iconType="line"
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="attacks" 
                  fill="url(#attacksAreaGradient)"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2.5}
                  name="Settler Attacks (Cumulative)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="killed" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  name="Total Killed (Cumulative)"
                  dot={{ r: 3, fill: "hsl(var(--destructive))" }}
                  activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="injured" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2.5}
                  name="Total Injured (Cumulative)"
                  dot={{ r: 2.5, fill: "hsl(var(--chart-4))" }}
                  activeDot={{ r: 5, stroke: "hsl(var(--chart-4))", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          {!loading && settlerAttacksTrend.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {(settlerAttacksTrend[settlerAttacksTrend.length - 1]?.attacks || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Attacks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {(settlerAttacksTrend[settlerAttacksTrend.length - 1]?.killed || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Killed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-chart-4">
                    {(settlerAttacksTrend[settlerAttacksTrend.length - 1]?.injured || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Injured</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      {/* Home Demolitions Data (Real Data) */}
      {demolitions && demolitions.totalDemolitions > 0 && (
        <>
          {/* Demolitions Summary Card */}
          <Card className="border-border bg-destructive/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Home className="h-5 w-5" />
                    Home Demolitions
                  </CardTitle>
                  <CardDescription>Documented home demolitions from Good Shepherd Collective</CardDescription>
                </div>
                <DataQualityBadge
                  source="Good Shepherd"
                  isRealData={!!hasGoodShepherdDemolitions}
                  recordCount={demolitions?.totalDemolitions}
                  showDetails={false}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Total Demolitions</div>
                  <div className="text-3xl font-bold text-destructive mt-1">
                    {demolitions.totalDemolitions.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Structures Destroyed</div>
                  <div className="text-3xl font-bold mt-1">
                    {demolitions.totalStructures.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">People Affected</div>
                  <div className="text-3xl font-bold text-chart-4 mt-1">
                    {demolitions.totalAffectedPeople.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Regions Affected</div>
                  <div className="text-3xl font-bold mt-1">
                    {Object.keys(demolitions.byRegion).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demolitions by Region and Trend */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Demolitions by Region */}
            {demolitionsByRegion.length > 0 && (
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Demolitions by Region</CardTitle>
                  <CardDescription>Geographic distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="space-y-3">
                      {demolitionsByRegion.slice(0, 6).map((region, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{region.category}</div>
                            <div className="text-sm text-muted-foreground">
                              {region.percentage.toFixed(1)}% of total
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-destructive">
                            {region.count.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Demolitions Trend */}
            {demolitionTrend.length > 0 && (
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Demolitions Trend</CardTitle>
                  <CardDescription>Monthly demolitions (Last 12 months)</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={demolitionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                          formatter={(value: number) => [`${value} demolitions`, 'Count']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          fill="hsl(var(--destructive))"
                          radius={[4, 4, 0, 0]}
                          name="Demolitions"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Data Source Footer */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        {dataSourceCount > 0 ? (
          <p>
            ✅ Real data from <strong>Tech4Palestine</strong> (daily casualties & settler attacks){hasGoodShepherdWBData && ', '}
            {hasGoodShepherdWBData && <><strong>Good Shepherd</strong> (West Bank data)</>}
            {hasGoodShepherdDemolitions && ', '}
            {hasGoodShepherdDemolitions && <><strong>Good Shepherd</strong> (home demolitions)</>}.
            {' '}Last updated: {new Date().toLocaleDateString()}
          </p>
        ) : (
          <p>
            Sample/estimated data. Integration with data sources in progress.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        )}
      </div>

      </Card>
    </div>
  );
};
