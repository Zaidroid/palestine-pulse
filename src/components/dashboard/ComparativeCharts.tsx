import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ArrowUpDown, BarChart3 } from "lucide-react";

interface ComparativeChartsProps {
  casualtiesData: any[];
  infrastructureData: any[];
  dateRange: string;
  loading: boolean;
}

export const ComparativeCharts = ({ casualtiesData, infrastructureData, dateRange, loading }: ComparativeChartsProps) => {
  const combinedData = useMemo(() => {
    const days = parseInt(dateRange);
    const casualties = casualtiesData?.slice(-days) || [];
    const infrastructure = infrastructureData?.slice(-days) || [];
    
    return casualties.map((item, index) => {
      const infraItem = infrastructure[index] || {};
      return {
        date: new Date(item.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        killed: item.killed || 0,
        massacres: item.massacres_cum || 0,
        residential: infraItem.residential?.destroyed || infraItem.residential?.ext_destroyed || 0,
      };
    });
  }, [casualtiesData, infrastructureData, dateRange]);

  const cumulativeData = useMemo(() => {
    const days = parseInt(dateRange);
    return casualtiesData?.slice(-days).map((item: any) => ({
      date: new Date(item.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      killed: item.killed_cum || 0,
      injured: item.injured_cum || 0,
      children: item.killed_children_cum || 0,
    })) || [];
  }, [casualtiesData, dateRange]);

  return (
    <div className="grid gap-4 md:grid-cols-1">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            Cumulative Casualties Over Time (Last {dateRange} Days)
          </CardTitle>
          <CardDescription>Total accumulated casualties since October 7, 2023</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="killedCumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="injuredCumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 12 }}
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area 
                  type="monotone" 
                  dataKey="killed" 
                  stroke="hsl(var(--destructive))" 
                  fill="url(#killedCumGradient)"
                  strokeWidth={3}
                  name="Total Killed"
                  activeDot={{ r: 6 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="injured" 
                  stroke="hsl(var(--chart-4))" 
                  fill="url(#injuredCumGradient)"
                  strokeWidth={3}
                  name="Total Injured"
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="children" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Children Killed"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-destructive" />
            Daily Casualties vs Infrastructure Destruction
          </CardTitle>
          <CardDescription>Correlation between casualties and residential destruction (Last {dateRange} Days)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar 
                  yAxisId="left"
                  dataKey="killed" 
                  fill="hsl(var(--destructive))" 
                  name="Daily Killed"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="residential" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  name="Residential Destroyed (Cumulative)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};