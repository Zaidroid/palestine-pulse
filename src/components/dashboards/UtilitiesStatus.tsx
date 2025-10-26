/**
 * Utilities Infrastructure Status Component
 *
 * Tracks essential utilities and services:
 * - Water supply and availability
 * - Electricity access and blackouts
 * - Sewage and sanitation
 * - Telecommunications and internet
 * - Fuel availability
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Droplet,
  Zap,
  Wifi,
  Fuel,
  AlertTriangle,
  TrendingDown,
  WavesIcon
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
  LineChart,
  Line
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';
import { UnifiedBadge as DataQualityBadge } from '@/components/ui/unified-badge';

// ============================================
// SAMPLE DATA
// ============================================

const UTILITIES_OVERVIEW = [
  { 
    utility: 'Water',
    availability: 7,
    status: 'critical',
    icon: Droplet,
    detail: '93% below pre-war levels',
    color: 'text-chart-4'
  },
  { 
    utility: 'Electricity',
    availability: 0,
    status: 'critical',
    icon: Zap,
    detail: 'Complete blackout',
    color: 'text-chart-5'
  },
  { 
    utility: 'Internet',
    availability: 12,
    status: 'critical',
    icon: Wifi,
    detail: 'Intermittent access',
    color: 'text-chart-1'
  },
  { 
    utility: 'Fuel',
    availability: 3,
    status: 'critical',
    icon: Fuel,
    detail: '97% shortage',
    color: 'text-destructive'
  },
];

const WATER_TREND = [
  { month: 'Oct 2023', availability: 40, production: 85000 },
  { month: 'Nov 2023', availability: 25, production: 52000 },
  { month: 'Dec 2023', availability: 15, production: 31000 },
  { month: 'Jan 2024', availability: 10, production: 21000 },
  { month: 'Feb 2024', availability: 8, production: 17000 },
  { month: 'Mar 2024', availability: 7, production: 14000 },
  { month: 'Apr 2024', availability: 7, production: 14000 },
  { month: 'May 2024', availability: 7, production: 14000 },
];

const ELECTRICITY_HOURS = [
  { region: 'Gaza City', hours: 0, blackout: 24 },
  { region: 'Khan Younis', hours: 0, blackout: 24 },
  { region: 'Rafah', hours: 0, blackout: 24 },
  { region: 'Northern Gaza', hours: 0, blackout: 24 },
  { region: 'Middle Area', hours: 0, blackout: 24 },
];

const SEWAGE_STATUS = {
  treatmentCapacity: 15, // percentage
  untreatDailyM3: 90000,
  overflowSites: 67,
  healthRisk: 'Extreme',
};

interface UtilitiesStatusProps {
  loading?: boolean;
}

export const UtilitiesStatus = ({ loading = false }: UtilitiesStatusProps) => {
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Utilities Infrastructure</h2>
          <p className="text-muted-foreground">
            Essential services availability and infrastructure status
          </p>
          <div className="mt-2">
            <DataQualityBadge
              source="Inferred from infrastructure damage"
              isRealData={false}
              showDetails={true}
            />
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          System Collapse
        </Badge>
      </div>

      {/* Utilities Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {UTILITIES_OVERVIEW.map((util, index) => {
          const Icon = util.icon;
          return (
            <Card key={index} className={`border-border bg-gradient-to-br from-destructive/20 to-transparent`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {util.utility}
                </CardTitle>
                <Icon className={`h-5 w-5 ${util.color}`} />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{util.availability}%</div>
                  <p className="text-xs text-muted-foreground">{util.detail}</p>
                  <Badge variant="destructive" className="text-xs">
                    {util.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Water Availability Trend */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-chart-4" />
            Water Availability Over Time
          </CardTitle>
          <CardDescription>Daily water production and availability percentage</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={WATER_TREND}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
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
                  label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number, name: string) => 
                    name === 'availability' ? `${value}%` : `${value.toLocaleString()} m³/day`
                  }
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="availability" 
                  stroke="hsl(var(--chart-4))" 
                  fill="url(#waterGradient)"
                  strokeWidth={3}
                  name="Availability %"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Electricity Status */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-5" />
            Electricity Access by Region
          </CardTitle>
          <CardDescription>Daily electricity hours vs blackout hours</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ELECTRICITY_HOURS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="region" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  domain={[0, 24]}
                  label={{ value: 'Hours per Day', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => `${value} hours`}
                />
                <Legend />
                <Bar 
                  dataKey="blackout" 
                  fill="hsl(var(--destructive))" 
                  name="Blackout Hours"
                  radius={[8, 8, 0, 0]}
                  stackId="a"
                />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--chart-5))" 
                  name="Electricity Hours"
                  radius={[8, 8, 0, 0]}
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Utilities Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Water Details */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Water Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Daily Production</span>
                <span className="font-bold">14,000 m³</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Daily Need</span>
                <span className="font-bold text-destructive">200,000 m³</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Desalination Plants</span>
                <span className="font-bold text-destructive">3/3 Damaged</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Wells Operational</span>
                <span className="font-bold">12/95</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sewage & Sanitation */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Sewage & Sanitation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Treatment Capacity</span>
                <span className="font-bold text-destructive">{SEWAGE_STATUS.treatmentCapacity}%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Untreated Discharge</span>
                <span className="font-bold text-destructive">{SEWAGE_STATUS.untreatDailyM3.toLocaleString()} m³/day</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Overflow Sites</span>
                <span className="font-bold text-destructive">{SEWAGE_STATUS.overflowSites}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-muted-foreground">Health Risk</span>
                <Badge variant="destructive">{SEWAGE_STATUS.healthRisk}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Infrastructure Alerts */}
      <Card className="border-border bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Infrastructure Crisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Electricity:</strong> Complete blackout across all of Gaza since October 2023</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Water:</strong> Only 7% of pre-war water production, severe shortages</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Sewage:</strong> 90,000 m³/day of untreated sewage, major health hazard</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Telecommunications:</strong> Frequent blackouts, limited connectivity</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Fuel:</strong> Critical shortage, only 3% of needs met</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span><strong>Impact:</strong> Hospitals, water pumps, and bakeries cannot operate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Availability Progress Bars */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle>Essential Services Availability</CardTitle>
          <CardDescription>Percentage of pre-war service levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {UTILITIES_OVERVIEW.map((util, index) => {
              const Icon = util.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${util.color}`} />
                      <span className="font-medium">{util.utility}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{util.detail}</span>
                      <Badge variant={util.availability < 20 ? 'destructive' : 'secondary'}>
                        {util.availability}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={util.availability} 
                    className={`h-3 ${util.availability < 20 ? 'bg-destructive/20' : 'bg-chart-2/20'}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impact on Daily Life */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-chart-1/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              People Without Clean Water
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">2.1M</div>
            <p className="text-xs text-muted-foreground mt-1">
              93% of population
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-chart-4/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Days Without Electricity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">220+</div>
            <p className="text-xs text-muted-foreground mt-1">
              Continuous blackout
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-destructive/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disease Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">Extreme</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sewage overflow & contamination
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Health Consequences */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WavesIcon className="h-5 w-5 text-chart-4" />
            Health & Hygiene Consequences
          </CardTitle>
          <CardDescription>Impact of utilities collapse on public health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-medium text-sm">Water-Related Risks</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Dehydration and waterborne diseases</li>
                <li>• Contaminated water consumption</li>
                <li>• Skin diseases and infections</li>
                <li>• Diarrheal diseases in children</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">Sanitation Risks</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sewage overflow in living areas</li>
                <li>• Cholera and typhoid risk</li>
                <li>• Environmental contamination</li>
                <li>• Vector-borne disease spread</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        <p>
          ⚠️ Sample/estimated data inferred from infrastructure damage reports.
          Direct utilities monitoring data integration requires partnerships with Palestinian Water Authority and Gaza Electricity Company.
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UtilitiesStatus;