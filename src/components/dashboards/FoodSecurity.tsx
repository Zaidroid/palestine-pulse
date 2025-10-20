/**
 * Food Security Component
 *
 * Tracks food security and hunger crisis:
 * - Food insecurity levels
 * - Malnutrition rates (sample data pending IPC integration)
 * - Food supply and prices (✅ NOW WITH REAL WFP DATA)
 * - Agricultural impact
 * - Famine risk assessment
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Progress } from './components/ui/progress';
import {
  Apple,
  AlertTriangle,
  TrendingDown,
  Package,
  Baby,
  Wheat
} from 'lucide-react';
import { useWFPLatestPrices, useWFPCommodityTrends, useWFPStatistics, useWFPTopPriceIncreases } from './hooks/useWFPData';
import { DataQualityBadge, DataLoadingBadge } from './components/ui/data-quality-badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';

// ============================================
// SAMPLE DATA
// ============================================

const FOOD_INSECURITY_LEVELS = [
  { level: 'Catastrophic (IPC 5)', population: 1100000, percentage: 49, color: '#7F1D1D' },
  { level: 'Emergency (IPC 4)', population: 900000, percentage: 40, color: '#DC2626' },
  { level: 'Crisis (IPC 3)', population: 200000, percentage: 9, color: '#F59E0B' },
  { level: 'Stressed (IPC 2)', population: 45000, percentage: 2, color: '#EAB308' },
];

const FOOD_AVAILABILITY_TREND = [
  { month: 'Oct 2023', availability: 65, price: 120 },
  { month: 'Nov 2023', availability: 42, price: 185 },
  { month: 'Dec 2023', availability: 28, price: 267 },
  { month: 'Jan 2024', availability: 18, price: 345 },
  { month: 'Feb 2024', availability: 12, price: 412 },
  { month: 'Mar 2024', availability: 8, price: 487 },
  { month: 'Apr 2024', availability: 6, price: 523 },
  { month: 'May 2024', availability: 5, price: 578 },
];

const MALNUTRITION_DATA = [
  { ageGroup: 'Children <5', acute: 28, severe: 12 },
  { ageGroup: 'Children 5-12', acute: 22, severe: 8 },
  { ageGroup: 'Pregnant Women', acute: 31, severe: 14 },
  { ageGroup: 'Nursing Mothers', acute: 29, severe: 11 },
];

const FOOD_TYPES_SHORTAGE = [
  { type: 'Bread/Flour', shortage: 94 },
  { type: 'Fresh Vegetables', shortage: 97 },
  { type: 'Meat/Protein', shortage: 99 },
  { type: 'Dairy Products', shortage: 98 },
  { type: 'Cooking Oil', shortage: 96 },
  { type: 'Clean Water', shortage: 93 },
];

interface FoodSecurityProps {
  loading?: boolean;
}

export const FoodSecurity = ({ loading = false }: FoodSecurityProps) => {
  
  // ============================================
  // FETCH REAL WFP FOOD PRICE DATA
  // ============================================
  
  const { data: latestPrices, isLoading: pricesLoading, error: pricesError } = useWFPLatestPrices();
  const { data: topIncreases, isLoading: increasesLoading } = useWFPTopPriceIncreases(5);
  const { data: wfpStats, isLoading: statsLoading } = useWFPStatistics();
  const { data: breadTrend } = useWFPCommodityTrends(['Bread']);
  
  // ============================================
  // PROCESS WFP DATA
  // ============================================
  
  // Calculate average price increase from WFP data
  const avgPriceIncrease = useMemo(() => {
    if (!topIncreases || topIncreases.length === 0) return 478; // Fallback to sample
    
    const avgChange = topIncreases.reduce((sum, item) => sum + item.change, 0) / topIncreases.length;
    return Math.round(avgChange);
  }, [topIncreases]);
  
  // Transform bread trend for chart (if available)
  const breadPriceTrend = useMemo(() => {
    if (!breadTrend || breadTrend.length === 0) return FOOD_AVAILABILITY_TREND;
    
    const trend = breadTrend[0];
    if (!trend || !trend.data) return FOOD_AVAILABILITY_TREND;
    
    // Take last 8 months for comparison with sample data
    return trend.data.slice(-8).map(item => ({
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: item.price * 10, // Scale for visibility (WFP prices are in USD)
      availability: null, // Not available from WFP
    }));
  }, [breadTrend]);
  
  const hasRealPriceData = !pricesError && latestPrices && latestPrices.length > 0;
  const isLoadingData = loading || pricesLoading || increasesLoading || statsLoading;
  
  // ============================================
  // SAMPLE DATA (for IPC levels - pending integration)
  // ============================================
  
  const catastrophicPop = FOOD_INSECURITY_LEVELS[0].population;
  const totalInsecure = FOOD_INSECURITY_LEVELS.reduce((sum, l) => sum + l.population, 0);
  const insecurePercentage = Math.round((totalInsecure / 2245000) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Food Security Crisis</h2>
          <p className="text-muted-foreground">
            Tracking hunger, malnutrition, and famine risk
          </p>
          <div className="mt-2">
            {isLoadingData ? (
              <DataLoadingBadge />
            ) : (
              <div className="flex gap-2 flex-wrap">
                <DataQualityBadge
                  source="WFP"
                  isRealData={hasRealPriceData}
                  recordCount={wfpStats?.totalRecords}
                  showDetails={true}
                />
                {!hasRealPriceData && (
                  <Badge variant="secondary" className="text-xs">
                    ⚠️ Using sample IPC data
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {insecurePercentage}% Food Insecure
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Catastrophic Hunger"
          value={`${(catastrophicPop / 1000000).toFixed(1)}M`}
          icon={AlertTriangle}
          loading={loading}
          gradient="from-destructive/30 to-transparent"
          subtitle="IPC Phase 5 (Famine)"
        />
        
        <ExpandableMetricCard
          title="Food Insecure"
          value={`${insecurePercentage}%`}
          icon={Apple}
          loading={loading}
          gradient="from-chart-1/20 to-transparent"
          subtitle="Of total population"
        />
        
        <ExpandableMetricCard
          title="Children Malnourished"
          value="28%"
          icon={Baby}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          subtitle="Acute malnutrition rate"
        />
        
        <ExpandableMetricCard
          title="Food Price Increase"
          value={`+${avgPriceIncrease}%`}
          icon={TrendingDown}
          loading={isLoadingData}
          gradient="from-chart-5/20 to-transparent"
          subtitle={hasRealPriceData ? `Real WFP data (${wfpStats?.uniqueCommodities} commodities)` : "Estimated since October 2023"}
        />
      </div>

      {/* Food Insecurity Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Food Insecurity Levels (IPC Scale)
            </CardTitle>
            <CardDescription>Population distribution by hunger severity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={FOOD_INSECURITY_LEVELS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ level, percentage }) => `${level.split(' ')[0]}: ${percentage}%`}
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="population"
                    paddingAngle={2}
                  >
                    {FOOD_INSECURITY_LEVELS.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Malnutrition Rates */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-chart-4" />
              Malnutrition Rates
            </CardTitle>
            <CardDescription>Acute and severe malnutrition by age group</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MALNUTRITION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="ageGroup" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="acute" 
                    fill="hsl(var(--chart-4))"
                    radius={[8, 8, 0, 0]}
                    name="Acute Malnutrition"
                  />
                  <Bar 
                    dataKey="severe" 
                    fill="hsl(var(--destructive))"
                    radius={[8, 8, 0, 0]}
                    name="Severe Malnutrition"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Food Availability Trend */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-chart-2" />
                Food Prices Trend
              </CardTitle>
              <CardDescription>
                {hasRealPriceData ? 'Real commodity prices from WFP market monitoring' : 'Food availability percentage vs. price index over time'}
              </CardDescription>
            </div>
            <DataQualityBadge
              source="WFP"
              isRealData={hasRealPriceData}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={hasRealPriceData ? breadPriceTrend : FOOD_AVAILABILITY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Availability %', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Price Index', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="availability" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3}
                  name="Food Availability %"
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  name="Price Index (100=baseline)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Food Shortages */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-chart-5" />
            Food Type Shortages
          </CardTitle>
          <CardDescription>Percentage shortage of essential food items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FOOD_TYPES_SHORTAGE.map((food, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{food.type}</span>
                  <Badge variant="destructive">
                    {food.shortage}% shortage
                  </Badge>
                </div>
                <Progress value={100 - food.shortage} className="h-2 bg-destructive/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Famine Crisis Alert */}
      <Card className="border-border bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Famine Crisis - IPC Phase 5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>1.1 million people (49% of population) in catastrophic hunger (IPC 5)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>98% of population (2.2M) experiencing high levels of food insecurity</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Children under 5 showing 28% acute malnutrition, 12% severe malnutrition</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Food prices increased by 478% since start of conflict</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Only 5% of pre-war food availability reaching Gaza</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>WFP warns of full-scale famine without immediate intervention</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-gradient-to-br from-destructive/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Famine Deaths Reported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">37</div>
            <p className="text-xs text-muted-foreground mt-1">
              Including 32 children
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-1/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bakeries Operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">2/380</div>
            <p className="text-xs text-muted-foreground mt-1">
              99.5% non-functional
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-4/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agricultural Land Damaged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Crops and farmland destroyed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        <p>
          {hasRealPriceData ? (
            <>
              ✅ Food price data from <strong>WFP Price Database</strong> via HDX ({wfpStats?.totalRecords.toLocaleString()} records, {wfpStats?.uniqueMarkets} markets, {wfpStats?.dateRange.start} to {wfpStats?.dateRange.end}).
              IPC food insecurity and malnutrition data pending integration.
              Last updated: {new Date().toLocaleDateString()}
            </>
          ) : (
            <>
              Food security data from WFP, FAO, IPC, UNICEF, and humanitarian assessments (sample estimates).
              Integration with WFP database in progress. Last updated: {new Date().toLocaleDateString()}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FoodSecurity;