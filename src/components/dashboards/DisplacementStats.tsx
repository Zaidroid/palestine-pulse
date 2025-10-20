/**
 * Displacement Statistics Component
 *
 * Tracks displacement and refugee data:
 * - Internally displaced persons (IDPs)
 * - Shelter status and capacity
 * - Displacement by region
 * - Refugee camp populations
 * - Movement patterns
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Progress } from './components/ui/progress';
import {
  Users,
  Home,
  AlertCircle,
  Building,
  MapPin,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';
import { usePopulation, usePopulationStatistics, useDisplacementEstimates } from './hooks/usePopulation';
import { DataQualityBadge, DataLoadingBadge } from './components/ui/data-quality-badge';

// ============================================
// SAMPLE DATA
// ============================================

const DISPLACEMENT_TREND = [
  { month: 'Oct 2023', idps: 450000, shelters: 89 },
  { month: 'Nov 2023', idps: 920000, shelters: 156 },
  { month: 'Dec 2023', idps: 1350000, shelters: 234 },
  { month: 'Jan 2024', idps: 1620000, shelters: 287 },
  { month: 'Feb 2024', idps: 1750000, shelters: 312 },
  { month: 'Mar 2024', idps: 1820000, shelters: 298 },
  { month: 'Apr 2024', idps: 1850000, shelters: 276 },
  { month: 'May 2024', idps: 1900000, shelters: 267 },
];

const DISPLACEMENT_BY_REGION = [
  { region: 'Rafah', idps: 1200000, percentage: 63 },
  { region: 'Khan Younis', idps: 380000, percentage: 20 },
  { region: 'Deir al-Balah', idps: 180000, percentage: 9 },
  { region: 'Gaza City', idps: 95000, percentage: 5 },
  { region: 'Northern Gaza', idps: 45000, percentage: 3 },
];

const SHELTER_TYPES = [
  { type: 'UNRWA Facilities', count: 156, capacity: 680000, current: 890000 },
  { type: 'Public Buildings', count: 78, capacity: 120000, current: 245000 },
  { type: 'Informal Tents', count: 0, capacity: 0, current: 450000 },
  { type: 'Host Families', count: 0, capacity: 0, current: 315000 },
];

interface DisplacementStatsProps {
  loading?: boolean;
}

export const DisplacementStats = ({ loading: externalLoading = false }: DisplacementStatsProps) => {
  // Fetch population data
  const { data: populationData, isLoading: populationLoading, error: populationError } = usePopulation();
  const popStats = usePopulationStatistics();
  const displacementEstimates = useDisplacementEstimates();
  
  const loading = externalLoading || populationLoading;
  
  // Determine if we have real population data
  const hasPopulationData = !populationError && populationData && populationData.total > 0;
  
  // Use real population baseline if available, otherwise use sample
  const baselinePopulation = hasPopulationData ? popStats.total : 2245000;
  const gazaPopulation = hasPopulationData ? popStats.gaza : 2200000;
  
  // IDP numbers are estimates (UNRWA partnership pending)
  const latestData = DISPLACEMENT_TREND[DISPLACEMENT_TREND.length - 1];
  const totalIDPs = latestData.idps;
  const totalShelters = latestData.shelters;
  
  const totalCapacity = SHELTER_TYPES.reduce((sum, s) => sum + s.capacity, 0);
  const currentOccupancy = SHELTER_TYPES.reduce((sum, s) => sum + s.current, 0);
  const overcrowding = Math.round(((currentOccupancy - totalCapacity) / totalCapacity) * 100);
  
  // Calculate displacement rate
  const displacementRate = hasPopulationData && displacementEstimates.baselinePopulation > 0
    ? displacementEstimates.displacementRate
    : Math.round((totalIDPs / gazaPopulation) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Displacement Statistics</h2>
          <p className="text-muted-foreground">
            Tracking internal displacement and shelter conditions
          </p>
          <div className="mt-2">
            {loading ? (
              <DataLoadingBadge />
            ) : (
              <div className="flex gap-2 flex-wrap">
                <DataQualityBadge
                  source={hasPopulationData ? "PCBS (population baseline)" : "Sample data"}
                  isRealData={hasPopulationData}
                  recordCount={populationData?.total}
                  showDetails={true}
                />
                <Badge variant="secondary" className="text-xs">
                  ⚠️ IDP estimates - UNRWA partnership pending
                </Badge>
              </div>
            )}
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {totalIDPs.toLocaleString()} Displaced ({Math.round(displacementRate)}%)
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Internally Displaced"
          value={`${(totalIDPs / 1000000).toFixed(1)}M`}
          icon={Users}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          subtitle="85% of Gaza population"
        />
        
        <ExpandableMetricCard
          title="Active Shelters"
          value={totalShelters}
          icon={Building}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
          subtitle="UNRWA and public facilities"
        />
        
        <ExpandableMetricCard
          title="Shelter Capacity"
          value={totalCapacity.toLocaleString()}
          icon={Home}
          loading={loading}
          gradient="from-chart-2/20 to-transparent"
          subtitle="Maximum capacity"
        />
        
        <ExpandableMetricCard
          title="Overcrowding"
          value={`${overcrowding > 0 ? '+' : ''}${overcrowding}%`}
          icon={AlertCircle}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          subtitle="Above capacity"
        />
      </div>

      {/* Displacement Trend */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-destructive" />
            Displacement Over Time
          </CardTitle>
          <CardDescription>Growth of internally displaced population</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={DISPLACEMENT_TREND}>
                <defs>
                  <linearGradient id="idpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="idps" 
                  stroke="hsl(var(--destructive))" 
                  fill="url(#idpGradient)"
                  strokeWidth={3}
                  name="Displaced Persons"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Displacement by Region */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-chart-1" />
            Displacement Distribution by Region
          </CardTitle>
          <CardDescription>Current IDP distribution across Gaza Strip</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="space-y-4">
              {DISPLACEMENT_BY_REGION.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {region.idps.toLocaleString()} people
                      </span>
                      <Badge variant={region.percentage > 50 ? 'destructive' : 'secondary'}>
                        {region.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={region.percentage} className="h-3" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shelter Status */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-chart-3" />
            Shelter Status
          </CardTitle>
          <CardDescription>Shelter capacity vs. current occupancy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SHELTER_TYPES.map((shelter, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{shelter.type}</div>
                    {shelter.count > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {shelter.count} facilities
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {shelter.current.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {shelter.capacity > 0 && `Capacity: ${shelter.capacity.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                
                {shelter.capacity > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Occupancy Rate</span>
                      <span>{Math.round((shelter.current / shelter.capacity) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((shelter.current / shelter.capacity) * 100, 100)} 
                      className="h-2"
                    />
                    {shelter.current > shelter.capacity && (
                      <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {((shelter.current - shelter.capacity) / shelter.capacity * 100).toFixed(0)}% over capacity
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Living Conditions Alert */}
      <Card className="border-border bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Critical Shelter Crisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>UNRWA facilities operating at 130% capacity with severe overcrowding</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>450,000 people living in makeshift tents with no sanitation</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Repeated forced displacement as evacuation zones shift</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Inadequate access to clean water, food, and healthcare in shelters</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Winter conditions exacerbating suffering with inadequate shelter</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        {hasPopulationData ? (
          <p>
            ✅ Real <strong>population baseline</strong> from <strong>PCBS via HDX</strong> ({baselinePopulation.toLocaleString()} total).
            {' '}⚠️ IDP numbers and shelter data are estimates - UNRWA partnership pending for real-time displacement tracking.
            {' '}Last updated: {new Date().toLocaleDateString()}
          </p>
        ) : (
          <p>
            ⚠️ Sample/estimated data. Integration with PCBS for population baseline and UNRWA for IDP tracking in progress.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplacementStats;