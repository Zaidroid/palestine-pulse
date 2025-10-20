/**
 * Settlement Expansion Component
 *
 * Tracks Israeli settlement expansion in West Bank:
 * - Settlement growth and population
 * - Land confiscation statistics
 * - House demolitions
 * - Settler attacks
 * - Impact on Palestinian communities
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import {
  Home,
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Building
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';
import { DataQualityBadge } from './components/ui/data-quality-badge';

// ============================================
// SAMPLE DATA
// ============================================

const SETTLEMENT_GROWTH = [
  { year: '2020', settlements: 132, population: 465000, landKm2: 542 },
  { year: '2021', settlements: 135, population: 475000, landKm2: 548 },
  { year: '2022', settlements: 138, population: 485000, landKm2: 556 },
  { year: '2023', settlements: 142, population: 502000, landKm2: 574 },
  { year: '2024', settlements: 146, population: 525000, landKm2: 598 },
];

const DEMOLITIONS_BY_REASON = [
  { reason: 'Lack of Permit', count: 3420, affected: 15600 },
  { reason: 'Punitive', count: 890, affected: 4200 },
  { reason: 'Military Zones', count: 1240, affected: 5800 },
  { reason: 'Security Pretext', count: 780, affected: 3500 },
];

const SETTLER_ATTACKS_TREND = [
  { month: 'Oct 2023', attacks: 127, injuries: 89 },
  { month: 'Nov 2023', attacks: 145, injuries: 102 },
  { month: 'Dec 2023', attacks: 156, injuries: 114 },
  { month: 'Jan 2024', attacks: 178, injuries: 125 },
  { month: 'Feb 2024', attacks: 192, injuries: 137 },
  { month: 'Mar 2024', attacks: 201, injuries: 148 },
  { month: 'Apr 2024', attacks: 219, injuries: 162 },
  { month: 'May 2024', attacks: 234, injuries: 175 },
];

const MAJOR_SETTLEMENTS = [
  { name: 'Maale Adumim', population: 38000, established: 1975, expandedRecently: true },
  { name: 'Ariel', population: 20000, established: 1978, expandedRecently: true },
  { name: 'Beitar Illit', population: 58000, established: 1985, expandedRecently: false },
  { name: 'Modiin Illit', population: 76000, established: 1996, expandedRecently: true },
  { name: 'Givat Zeev', population: 17000, established: 1983, expandedRecently: false },
];

interface SettlementExpansionProps {
  loading?: boolean;
}

export const SettlementExpansion = ({ loading = false }: SettlementExpansionProps) => {
  
  const latestData = SETTLEMENT_GROWTH[SETTLEMENT_GROWTH.length - 1];
  const totalDemolitions = DEMOLITIONS_BY_REASON.reduce((sum, d) => sum + d.count, 0);
  const totalAffected = DEMOLITIONS_BY_REASON.reduce((sum, d) => sum + d.affected, 0);
  const totalAttacks = SETTLER_ATTACKS_TREND.reduce((sum, a) => sum + a.attacks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settlement Expansion</h2>
          <p className="text-muted-foreground">
            Tracking Israeli settlement growth and impact in West Bank
          </p>
          <div className="mt-2">
            <DataQualityBadge
              source="B'Tselem partnership pending"
              isRealData={false}
              showDetails={true}
            />
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {latestData.settlements} Settlements
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Total Settlements"
          value={latestData.settlements}
          icon={Building}
          loading={loading}
          gradient="from-chart-1/20 to-transparent"
          subtitle="Across West Bank"
        />
        
        <ExpandableMetricCard
          title="Settler Population"
          value={`${(latestData.population / 1000).toFixed(0)}K`}
          icon={Users}
          loading={loading}
          gradient="from-chart-2/20 to-transparent"
          subtitle="Israeli settlers in West Bank"
        />
        
        <ExpandableMetricCard
          title="Land Seized"
          value={`${latestData.landKm2} km²`}
          icon={MapPin}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
          subtitle="Palestinian land confiscated"
        />
        
        <ExpandableMetricCard
          title="Settler Attacks"
          value={totalAttacks}
          icon={AlertTriangle}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          subtitle="Since Oct 7, 2023"
        />
      </div>

      {/* Settlement Growth Trend */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            Settlement Expansion Over Time
          </CardTitle>
          <CardDescription>Growth in settlements, population, and land seizure</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={SETTLEMENT_GROWTH}>
                <defs>
                  <linearGradient id="landGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Land (km²)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Settlements', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="landKm2" 
                  stroke="hsl(var(--chart-1))" 
                  fill="url(#landGradient)"
                  strokeWidth={3}
                  name="Land Seized (km²)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="settlements" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  name="Number of Settlements"
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Demolitions */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-destructive" />
            House Demolitions
          </CardTitle>
          <CardDescription>Palestinian homes demolished by reason</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DEMOLITIONS_BY_REASON} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  type="category" 
                  dataKey="reason" 
                  stroke="hsl(var(--muted-foreground))"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number, name: string) => 
                    name === 'count' ? `${value} demolitions` : `${value} people affected`
                  }
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--destructive))"
                  radius={[0, 8, 8, 0]}
                  name="Demolitions"
                />
                <Bar 
                  dataKey="affected" 
                  fill="hsl(var(--chart-4))"
                  radius={[0, 8, 8, 0]}
                  name="People Affected"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Settler Attacks */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Settler Violence Attacks
          </CardTitle>
          <CardDescription>Monthly settler attacks and injuries (Since Oct 7, 2023)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={SETTLER_ATTACKS_TREND}>
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
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="attacks" 
                  fill="hsl(var(--destructive))"
                  radius={[8, 8, 0, 0]}
                  name="Attacks"
                />
                <Line 
                  type="monotone" 
                  dataKey="injuries" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={3}
                  name="Injuries"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Major Settlements Table */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle>Major Settlements</CardTitle>
          <CardDescription>Largest Israeli settlements in West Bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MAJOR_SETTLEMENTS.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{settlement.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Established {settlement.established} • {settlement.population.toLocaleString()} population
                  </div>
                </div>
                {settlement.expandedRecently && (
                  <Badge variant="destructive">
                    Recently Expanded
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-gradient-to-br from-destructive/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Demolitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{totalDemolitions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Palestinian homes destroyed
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-4/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              People Displaced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAffected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due to demolitions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-1/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              International Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Illegal</div>
            <p className="text-xs text-muted-foreground mt-1">
              Under international law
            </p>
          </CardContent>
        </Card>
      </div>

      {/* International Law Context */}
      <Card className="border-border bg-chart-3/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            International Law Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3 mt-1.5" />
              <span>UN Security Council Resolution 2334 (2016): Settlements are illegal under international law</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3 mt-1.5" />
              <span>Geneva Convention IV: Prohibits transfer of civilian population to occupied territory</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3 mt-1.5" />
              <span>International Court of Justice (2004): Settlements violate international law</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3 mt-1.5" />
              <span>Rome Statute: Transfer of population to occupied territory is a war crime</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        <p>
          ⚠️ Sample data based on reports. Automated data integration requires partnership with <strong>B'Tselem</strong> and <strong>Peace Now</strong>.
          Manual updates from UN OCHA and human rights organizations.
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default SettlementExpansion;