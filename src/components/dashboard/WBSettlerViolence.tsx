import { useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { Badge } from "./components/ui/badge";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area
} from "recharts";
import { UnifiedBadge as DataQualityBadge } from "./components/ui/unified-badge";
import { Activity, Shield } from "lucide-react";
import { AttackAnalysis } from "./AttackAnalysis";

interface WBSettlerViolenceProps {
  loading: boolean;
  westBankData: any[];
  dateRange: string;
}

export const WBSettlerViolence = ({
  loading,
  westBankData,
  dateRange
}: WBSettlerViolenceProps) => {

  // Process filtered trend data
  const filteredTrendData = useMemo(() => {
    const days = parseInt(dateRange);
    return westBankData?.slice(-days) || [];
  }, [westBankData, dateRange]);

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
              isRealData={westBankData && westBankData.length > 0}
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
                  isRealData={westBankData && westBankData.length > 0}
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
                  strokeWidth={2}
                  name="Total Injured (Cumulative)"
                  dot={{ r: 3, fill: "hsl(var(--chart-4))" }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-4))", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <AttackAnalysis />
    </div>
  );
};