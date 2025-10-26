import { useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import { UnifiedBadge as DataQualityBadge } from "@/components/ui/unified-badge";
import { useWFPGazaPrices, useWFPCommodityTrends } from "@/hooks/useWFPData";
import { DollarSign, TrendingUp } from "lucide-react";
import { getCommodityTrends } from "@/services/wfpService";

export const FoodSecurity = () => {
  const { data: gazaPrices, isLoading: pricesLoading, error: pricesError } = useWFPGazaPrices();
  
  const commodityTrends = useMemo(() => {
    if (!gazaPrices) return [];
    return getCommodityTrends(gazaPrices, ["Wheat", "Tomatoes", "Fuel (diesel)"]);
  }, [gazaPrices]);

  const latestPrices = useMemo(() => {
    if (!gazaPrices) return [];
    const latest: { [key: string]: any } = {};
    gazaPrices.forEach(price => {
      if (!latest[price.commodity] || new Date(price.date) > new Date(latest[price.commodity].date)) {
        latest[price.commodity] = price;
      }
    });
    return Object.values(latest);
  }, [gazaPrices]);

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
  
  const trendData = useMemo(() => {
    if (!commodityTrends.length) return [];

    const allDates = new Set<string>();
    commodityTrends.forEach(trend => {
      trend.data.forEach(d => allDates.add(d.date));
    });

    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(date => {
      const entry: { [key: string]: any } = { date };
      commodityTrends.forEach(trend => {
        const dataPoint = trend.data.find(d => d.date === date);
        entry[trend.commodity] = dataPoint ? dataPoint.price : null;
      });
      return entry;
    });
  }, [commodityTrends]);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Food & Fuel Prices in Gaza
              </CardTitle>
              <CardDescription>Latest commodity prices from the World Food Programme</CardDescription>
            </div>
            <DataQualityBadge
              source="WFP"
              isRealData={!!gazaPrices && gazaPrices.length > 0}
              recordCount={gazaPrices?.length}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {pricesLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : pricesError ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load price data
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {latestPrices.slice(0, 3).map((price, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">{price.commodity}</div>
                  <div className="text-2xl font-bold mt-1">
                    {price.price.toLocaleString()} <span className="text-sm text-muted-foreground">{price.currency}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(price.date).toLocaleDateString()} in {price.market}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-destructive" />
                Commodity Price Trends
              </CardTitle>
              <CardDescription>Price trends for key commodities in Gaza</CardDescription>
            </div>
            <DataQualityBadge
              source="WFP"
              isRealData={!!commodityTrends && commodityTrends.length > 0}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {pricesLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : pricesError ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load trend data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
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
                  label={{ value: 'Price', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                {commodityTrends.map((trend, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={trend.commodity}
                    stroke={`hsl(var(--chart-${index + 1}))`}
                    strokeWidth={2.5}
                    name={trend.commodity}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};