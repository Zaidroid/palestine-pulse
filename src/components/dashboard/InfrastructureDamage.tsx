import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area
} from "recharts";
import { Building2, TrendingDown, Home, Church, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UnifiedBadge as DataQualityBadge } from "@/components/ui/unified-badge";

interface InfrastructureDamageProps {
  data: any[];
  dateRange: string;
  loading: boolean;
  viewType?: "summary" | "trend" | "detailed";
}

export const InfrastructureDamage = ({ 
  data, 
  dateRange, 
  loading, 
  viewType = "summary" 
}: InfrastructureDamageProps) => {
  const latestData = data?.[data.length - 1] || {};

  // Calculate comprehensive infrastructure metrics with correct field names
  const infrastructureMetrics = useMemo(() => {
    // Residential
    const residential = latestData?.residential?.destroyed || latestData?.residential?.ext_destroyed || 0;
    const residentialDamaged = latestData?.residential?.damaged || latestData?.residential?.ext_damaged || 0;
    
    // Mosques
    const mosques = latestData?.places_of_worship?.mosques_destroyed || latestData?.places_of_worship?.ext_mosques_destroyed || 0;
    const mosquesDamaged = latestData?.places_of_worship?.mosques_damaged || latestData?.places_of_worship?.ext_mosques_damaged || 0;
    
    // Schools (educational buildings)
    const schools = latestData?.educational_buildings?.destroyed || latestData?.educational_buildings?.ext_destroyed || 0;
    const schoolsDamaged = latestData?.educational_buildings?.damaged || latestData?.educational_buildings?.ext_damaged || 0;
    
    // Civic buildings
    const civic = latestData?.civic_buildings?.destroyed || latestData?.civic_buildings?.ext_destroyed || 0;
    const civicDamaged = latestData?.civic_buildings?.damaged || latestData?.civic_buildings?.ext_damaged || 0;

    return {
      residential: { destroyed: residential, damaged: residentialDamaged, total: residential + residentialDamaged },
      mosques: { destroyed: mosques, damaged: mosquesDamaged, total: mosques + mosquesDamaged },
      schools: { destroyed: schools, damaged: schoolsDamaged, total: schools + schoolsDamaged },
      civic: { destroyed: civic, damaged: civicDamaged, total: civic + civicDamaged },
    };
  }, [latestData]);

  // Critical infrastructure data (excluding hospitals - no data available)
  const criticalInfraData = useMemo(() => [
    {
      category: "Mosques",
      destroyed: infrastructureMetrics.mosques.destroyed,
      damaged: infrastructureMetrics.mosques.damaged,
      icon: "church",
      color: "hsl(var(--chart-1))"
    },
    {
      category: "Schools",
      destroyed: infrastructureMetrics.schools.destroyed,
      damaged: infrastructureMetrics.schools.damaged,
      icon: "school",
      color: "hsl(var(--chart-2))"
    },
    {
      category: "Civic Buildings",
      destroyed: infrastructureMetrics.civic.destroyed,
      damaged: infrastructureMetrics.civic.damaged,
      icon: "building",
      color: "hsl(var(--chart-3))"
    }
  ], [infrastructureMetrics]);

  // Trend data
  const trendData = useMemo(() => {
    const days = parseInt(dateRange);
    const slicedData = data?.slice(-days) || [];
    
    return slicedData.map((item: any) => {
      const residential = item.residential?.destroyed || item.residential?.ext_destroyed || 0;
      const mosques = item.places_of_worship?.mosques_destroyed || item.places_of_worship?.ext_mosques_destroyed || 0;
      const schools = item.educational_buildings?.destroyed || item.educational_buildings?.ext_destroyed || 0;
      const civic = item.civic_buildings?.destroyed || item.civic_buildings?.ext_destroyed || 0;
      
      return {
        date: new Date(item.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        residential: residential,
        mosques: mosques,
        schools: schools,
        civic: civic,
        criticalTotal: mosques + schools + civic
      };
    });
  }, [data, dateRange]);

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
              <span className="font-bold">{entry.value.toLocaleString()}</span>
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

  if (viewType === "summary") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Residential Units Card */}
        <Card className="border-border bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-[var(--shadow-glow)] transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-destructive" />
                Residential Units
              </CardTitle>
              <div className="flex items-center gap-2">
                <DataQualityBadge
                  source="Tech4Palestine"
                  isRealData={data && data.length > 0}
                  showDetails={false}
                />
                <Badge variant="destructive" className="text-base px-2 py-0.5">
                  {infrastructureMetrics.residential.total.toLocaleString()}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-xs">Homes destroyed and damaged in Gaza</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-destructive/20 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {infrastructureMetrics.residential.destroyed.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Destroyed</div>
                  </div>
                  <div className="text-center p-3 bg-chart-4/20 rounded-lg">
                    <div className="text-2xl font-bold text-chart-4">
                      {infrastructureMetrics.residential.damaged.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Damaged</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Est. Displaced Families</span>
                    <span className="font-bold text-sm">
                      {Math.round(infrastructureMetrics.residential.total * 5).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Critical Infrastructure Card */}
        <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Critical Infrastructure
            </CardTitle>
            <CardDescription className="text-xs">Essential public facilities damaged</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-2.5">
                {criticalInfraData.map((item) => (
                  <div key={item.category} className="p-2.5 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {item.icon === "church" && <Church className="h-3.5 w-3.5" style={{ color: item.color }} />}
                        {item.icon === "school" && <School className="h-3.5 w-3.5" style={{ color: item.color }} />}
                        {item.icon === "building" && <Building2 className="h-3.5 w-3.5" style={{ color: item.color }} />}
                        <span className="font-semibold text-sm">{item.category}</span>
                      </div>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {(item.destroyed + item.damaged).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-muted-foreground">Destroyed</span>
                        <span className="font-bold text-destructive ml-1">{item.destroyed}</span>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-muted-foreground">Damaged</span>
                        <span className="font-bold text-chart-4 ml-1">{item.damaged}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewType === "trend") {
    return (
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Critical Infrastructure Destruction Timeline
          </CardTitle>
          <CardDescription>Mosques, Schools & Civic Buildings ({getDateRangeLabel()})</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                  label={{ value: 'Facilities Destroyed', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
                <Area 
                  type="monotone" 
                  dataKey="criticalTotal" 
                  fill="url(#totalGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Total Critical Infrastructure"
                />
                <Line 
                  type="monotone" 
                  dataKey="mosques" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2.5}
                  name="Mosques"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="schools" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2.5}
                  name="Schools"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="civic" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2.5}
                  name="Civic Buildings"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  }

  // Detailed view - residential destruction
  return (
    <div className="grid gap-6">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-destructive" />
            Residential Destruction Timeline
          </CardTitle>
          <CardDescription>Housing units destroyed ({getDateRangeLabel()})</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
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
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="residential" 
                  fill="hsl(var(--destructive))" 
                  name="Residential Units"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};