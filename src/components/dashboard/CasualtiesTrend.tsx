import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface CasualtiesTrendProps {
  data: any[];
  dateRange: string;
  loading: boolean;
  region: "gaza" | "westbank";
}

export const CasualtiesTrend = ({ data, dateRange, loading, region }: CasualtiesTrendProps) => {
  const processedData = useMemo(() => {
    const days = parseInt(dateRange);
    return data?.slice(-days).map((item: any) => ({
      date: new Date(item.report_date || item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      killed: region === "gaza" ? (item.killed || 0) : (item.verified?.killed || item.killed || 0),
      injured: region === "gaza" ? (item.injured || 0) : (item.verified?.injured || item.injured || 0),
      cumKilled: region === "gaza" ? (item.killed_cum || 0) : (item.verified?.killed_cum || 0),
      cumInjured: region === "gaza" ? (item.injured_cum || 0) : (item.verified?.injured_cum || 0),
    })) || [];
  }, [data, dateRange, region]);

  return (
    <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Daily Casualties Trend (Last {dateRange} Days)
        </CardTitle>
        <CardDescription>Daily reported casualties since October 7, 2023</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : processedData.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="killedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="injuredGradient" x1="0" y1="0" x2="0" y2="1">
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
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="killed" 
                stroke="hsl(var(--chart-1))" 
                fill="url(#killedGradient)"
                strokeWidth={3}
                name="Killed (Daily)"
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="injured" 
                stroke="hsl(var(--chart-4))" 
                fill="url(#injuredGradient)"
                strokeWidth={3}
                name="Injured (Daily)"
                activeDot={{ r: 6, stroke: "hsl(var(--chart-4))", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};