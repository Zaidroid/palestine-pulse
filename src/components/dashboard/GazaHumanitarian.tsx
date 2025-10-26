import { useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area
} from "recharts";
import { UnifiedBadge as DataQualityBadge } from "@/components/ui/unified-badge";
import { UnifiedBadge as DataLoadingBadge } from "@/components/ui/unified-badge";
import { TrendingUp } from "lucide-react";
import { FoodSecurity } from "./FoodSecurity";

interface GazaHumanitarianProps {
  loading: boolean;
  casualtiesData: any[];
  dateRange: string;
}

export const GazaHumanitarian = ({
  loading,
  casualtiesData,
  dateRange
}: GazaHumanitarianProps) => {

  // Process filtered trend data
  const filteredTrendData = useMemo(() => {
    const days = parseInt(dateRange);
    return casualtiesData?.slice(-days) || [];
  }, [casualtiesData, dateRange]);

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
        <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-destructive" />
                  Daily Casualties Trend
                </CardTitle>
                <CardDescription>Daily reported killed and injured in Gaza ({getDateRangeLabel()})</CardDescription>
              </div>
              <DataQualityBadge
                source="Tech4Palestine"
                isRealData={casualtiesData && casualtiesData.length > 0}
                recordCount={casualtiesData?.length}
                showDetails={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={dailyTrend} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="killedAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
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
                  <Area
                    type="monotone"
                    dataKey="killed"
                    fill="url(#killedAreaGradient)"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2.5}
                    name="Daily Killed"
                  />
                  <Bar
                    dataKey="injured"
                    fill="hsl(var(--chart-4))"
                    name="Daily Injured"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="children"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2.5}
                    name="Children Killed"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <FoodSecurity />
    </div>
  );
};