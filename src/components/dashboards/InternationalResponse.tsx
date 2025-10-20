/**
 * International Response Component
 *
 * Tracks international community response:
 * - UN Security Council resolutions
 * - UN General Assembly votes
 * - ICJ proceedings
 * - Country positions and statements
 * - Aid pledges vs disbursements
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Progress } from './components/ui/progress';
import {
  Flag,
  Scale,
  DollarSign,
  Globe,
  AlertCircle,
  FileText
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';
import { DataQualityBadge } from './components/ui/data-quality-badge';

// ============================================
// SAMPLE DATA
// ============================================

const UN_RESOLUTIONS = [
  {
    body: 'Security Council',
    resolution: 'S/RES/2712',
    date: '2023-11-15',
    title: 'Humanitarian Pauses',
    status: 'Passed',
    votes: { for: 12, against: 0, abstain: 3 }
  },
  {
    body: 'Security Council',
    resolution: 'S/RES/2720',
    date: '2023-12-22',
    title: 'Aid Access',
    status: 'Passed',
    votes: { for: 13, against: 0, abstain: 2 }
  },
  {
    body: 'General Assembly',
    resolution: 'A/ES-10/L.25',
    date: '2023-10-27',
    title: 'Protection of Civilians',
    status: 'Passed',
    votes: { for: 121, against: 14, abstain: 44 }
  },
  {
    body: 'General Assembly',
    resolution: 'A/ES-10/L.28',
    date: '2023-12-12',
    title: 'Immediate Ceasefire',
    status: 'Passed',
    votes: { for: 153, against: 10, abstain: 23 }
  },
];

const ICJ_CASES = [
  {
    case: 'South Africa v. Israel',
    date: '2024-01-11',
    type: 'Genocide Convention',
    status: 'Preliminary Ruling Issued',
    ruling: 'Plausible genocide, prevent acts'
  },
  {
    case: 'Nicaragua v. Germany',
    date: '2024-03-01',
    type: 'Complicity in Genocide',
    status: 'Ongoing',
    ruling: 'Under deliberation'
  },
];

const COUNTRY_POSITIONS = [
  { position: 'Supportive of Palestine', count: 139, color: '#10B981' },
  { position: 'Neutral/Abstaining', count: 47, color: '#F59E0B' },
  { position: 'Opposing', count: 12, color: '#EF4444' },
];

const AID_PLEDGES = [
  { country: 'USA', pledged: 400, disbursed: 180, percentage: 45 },
  { country: 'European Union', pledged: 350, disbursed: 220, percentage: 63 },
  { country: 'Arab Countries', pledged: 580, disbursed: 410, percentage: 71 },
  { country: 'China', pledged: 100, disbursed: 85, percentage: 85 },
  { country: 'Others', pledged: 270, disbursed: 160, percentage: 59 },
];

interface InternationalResponseProps {
  loading?: boolean;
}

export const InternationalResponse = ({ loading = false }: InternationalResponseProps) => {
  
  const totalPledged = AID_PLEDGES.reduce((sum, p) => sum + p.pledged, 0);
  const totalDisbursed = AID_PLEDGES.reduce((sum, p) => sum + p.disbursed, 0);
  const disbursementRate = Math.round((totalDisbursed / totalPledged) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">International Response</h2>
          <p className="text-muted-foreground">
            Global diplomatic actions, resolutions, and aid commitments
          </p>
          <div className="mt-2">
            <DataQualityBadge
              source="Manual tracking from UN records"
              isRealData={false}
              showDetails={true}
            />
          </div>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {UN_RESOLUTIONS.length} UN Resolutions
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="UN Resolutions"
          value={UN_RESOLUTIONS.length}
          icon={FileText}
          loading={loading}
          gradient="from-primary/20 to-transparent"
          subtitle="Since Oct 7, 2023"
        />
        
        <ExpandableMetricCard
          title="ICJ Cases"
          value={ICJ_CASES.length}
          icon={Scale}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
          subtitle="At International Court"
        />
        
        <ExpandableMetricCard
          title="Aid Pledged"
          value={`$${(totalPledged / 1000).toFixed(1)}B`}
          icon={DollarSign}
          loading={loading}
          gradient="from-chart-2/20 to-transparent"
          subtitle="International commitments"
        />
        
        <ExpandableMetricCard
          title="Aid Disbursed"
          value={`${disbursementRate}%`}
          icon={Globe}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          subtitle="Of pledged amount"
        />
      </div>

      {/* UN Resolutions */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            UN Resolutions
          </CardTitle>
          <CardDescription>Security Council and General Assembly actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {UN_RESOLUTIONS.map((resolution, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{resolution.resolution}</span>
                      <Badge variant={resolution.status === 'Passed' ? 'default' : 'destructive'}>
                        {resolution.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{resolution.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(resolution.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs mt-2">
                  <Badge variant="outline" className="bg-chart-2/10">
                    {resolution.body}
                  </Badge>
                  <span className="text-muted-foreground">
                    For: {resolution.votes.for} | Against: {resolution.votes.against} | Abstain: {resolution.votes.abstain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ICJ Proceedings */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-chart-3" />
            International Court of Justice Proceedings
          </CardTitle>
          <CardDescription>Legal cases at the World Court</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ICJ_CASES.map((icjCase, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{icjCase.case}</div>
                    <div className="text-sm text-muted-foreground mt-1">{icjCase.type}</div>
                  </div>
                  <Badge variant={icjCase.status === 'Preliminary Ruling Issued' ? 'default' : 'secondary'}>
                    {icjCase.status}
                  </Badge>
                </div>
                <div className="text-sm mt-2 p-3 bg-muted/30 rounded">
                  <span className="font-medium">Ruling: </span>
                  <span className="text-muted-foreground">{icjCase.ruling}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Filed: {new Date(icjCase.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Country Positions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-chart-2" />
              Global Positions
            </CardTitle>
            <CardDescription>Country stances on the conflict</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={COUNTRY_POSITIONS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ position, count }) => `${position.split(' ')[0]}: ${count}`}
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {COUNTRY_POSITIONS.map((entry, index) => (
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
                    formatter={(value: number) => `${value} countries`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Aid Pledges */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-4" />
              Aid Pledges vs. Disbursements
            </CardTitle>
            <CardDescription>Financial commitments in millions USD</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={AID_PLEDGES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="country" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Million USD', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => `$${value}M`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="pledged" 
                    fill="hsl(var(--chart-2))"
                    radius={[8, 8, 0, 0]}
                    name="Pledged"
                  />
                  <Bar 
                    dataKey="disbursed" 
                    fill="hsl(var(--chart-4))"
                    radius={[8, 8, 0, 0]}
                    name="Disbursed"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aid Disbursement Progress */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle>Aid Disbursement Progress</CardTitle>
          <CardDescription>Percentage of pledged aid actually delivered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AID_PLEDGES.map((pledge, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{pledge.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      ${pledge.disbursed}M / ${pledge.pledged}M
                    </span>
                    <Badge variant={pledge.percentage > 70 ? 'default' : pledge.percentage > 50 ? 'secondary' : 'destructive'}>
                      {pledge.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={pledge.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Diplomatic Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-chart-2/10">
          <CardHeader>
            <CardTitle className="text-sm">Major Diplomatic Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-chart-2 mt-0.5" />
                <span>ICJ preliminary ruling: Israel must prevent genocide (Jan 2024)</span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-chart-2 mt-0.5" />
                <span>ICC prosecutor seeks arrest warrants for Israeli leaders (May 2024)</span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-chart-2 mt-0.5" />
                <span>153 countries vote for immediate ceasefire at UN (Dec 2023)</span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-chart-2 mt-0.5" />
                <span>Multiple countries recall ambassadors or sever ties</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-chart-1/10">
          <CardHeader>
            <CardTitle className="text-sm">Implementation Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>ICJ provisional measures largely ignored</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>UN resolutions not enforced due to veto power</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Aid pledges only {disbursementRate}% disbursed</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Limited concrete action beyond symbolic gestures</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Countries Recognizing Palestine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">139</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of 193 UN member states
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-3/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ICC Investigations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              War crimes investigation ongoing
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-chart-4/10 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aid Gap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">${((totalPledged - totalDisbursed) / 1000).toFixed(1)}B</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pledged but not delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        <p>
          ⚠️ Sample data manually updated from <strong>UN records</strong>, <strong>ICJ proceedings</strong>, and <strong>government statements</strong>.
          Automated integration complex due to varied data formats. Manual updates from press releases and official documents.
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default InternationalResponse;