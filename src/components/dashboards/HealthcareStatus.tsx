/**
 * Healthcare System Status Component
 *
 * Tracks healthcare infrastructure and services:
 * - Hospital operational status
 * - Bed capacity and occupancy
 * - Medical supply availability
 * - Healthcare worker casualties
 * - Medical services accessibility
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Progress } from './components/ui/progress';
import {
  Activity,
  Building2,
  Package,
  Users,
  AlertTriangle,
  TrendingDown,
  Stethoscope,
  Target
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ExpandableMetricCard } from '../dashboard/ExpandableMetricCard';
import { useHealthcareAttacksSummary } from './hooks/useGoodShepherdData';
import { useHealthFacilities, useHealthFacilityStats } from './hooks/useHealthFacilities';
import { getTopN } from './utils/dataAggregation';
import { DataQualityBadge, DataLoadingBadge } from './components/ui/data-quality-badge';

// ============================================
// SAMPLE DATA
// ============================================

const HOSPITAL_STATUS = [
  { 
    name: 'Al-Shifa Hospital',
    status: 'non_operational',
    beds: 750,
    occupancy: 0,
    location: 'Gaza City',
    type: 'Major Hospital'
  },
  { 
    name: 'Al-Quds Hospital',
    status: 'partially_operational',
    beds: 250,
    occupancy: 180,
    location: 'Gaza City',
    type: 'Hospital'
  },
  { 
    name: 'Nasser Hospital',
    status: 'non_operational',
    beds: 350,
    occupancy: 0,
    location: 'Khan Younis',
    type: 'Hospital'
  },
  { 
    name: 'European Hospital',
    status: 'partially_operational',
    beds: 230,
    occupancy: 210,
    location: 'Khan Younis',
    type: 'Hospital'
  },
  { 
    name: 'Indonesian Hospital',
    status: 'non_operational',
    beds: 150,
    occupancy: 0,
    location: 'Northern Gaza',
    type: 'Hospital'
  },
];

const STATUS_BREAKDOWN = [
  { status: 'Operational', count: 0, color: '#10B981', beds: 0 },
  { status: 'Partially Operational', count: 12, color: '#F59E0B', beds: 850 },
  { status: 'Non-Operational', count: 24, color: '#EF4444', beds: 1650 },
];

const MEDICAL_SUPPLIES = [
  { item: 'Anesthetics', availability: 5, status: 'critical' },
  { item: 'Antibiotics', availability: 12, status: 'critical' },
  { item: 'Surgical Supplies', availability: 8, status: 'critical' },
  { item: 'Pain Medication', availability: 15, status: 'limited' },
  { item: 'Bandages', availability: 22, status: 'limited' },
  { item: 'IV Fluids', availability: 18, status: 'limited' },
  { item: 'Blood Bags', availability: 7, status: 'critical' },
  { item: 'Dialysis Supplies', availability: 3, status: 'critical' },
];

const HEALTHCARE_WORKERS = {
  doctors: 498,
  nurses: 1049,
  paramedics: 387,
  casualties: 1034,
  detained: 310,
};

interface HealthcareStatusProps {
  loading?: boolean;
}

export const HealthcareStatus = ({ loading: externalLoading = false }: HealthcareStatusProps) => {
  // Fetch real healthcare data
  const { data: healthcareAttacks, isLoading: attacksLoading, error: attacksError } = useHealthcareAttacksSummary();
  const { data: facilitiesData, isLoading: facilitiesLoading, error: facilitiesError } = useHealthFacilities();
  const facilityStats = useHealthFacilityStats();
  
  const loading = externalLoading || attacksLoading || facilitiesLoading;
  
  // Determine if we have real data
  const hasFacilitiesData = !facilitiesError && facilitiesData && facilitiesData.total > 0;
  const hasAttacksData = !attacksError && healthcareAttacks;
  
  // Use real data if available, fallback to sample
  const totalHospitals = hasFacilitiesData ? facilitiesData.total : STATUS_BREAKDOWN.reduce((sum, item) => sum + item.count, 0);
  const operationalCount = hasFacilitiesData ? facilityStats.operational : (STATUS_BREAKDOWN.find(s => s.status === 'Operational')?.count || 0);
  const partialCount = hasFacilitiesData ? facilityStats.partiallyOperational : (STATUS_BREAKDOWN.find(s => s.status === 'Partially Operational')?.count || 0);
  const nonOperationalCount = hasFacilitiesData ? facilityStats.nonOperational : (STATUS_BREAKDOWN.find(s => s.status === 'Non-Operational')?.count || 0);
  
  const totalBeds = STATUS_BREAKDOWN.reduce((sum, item) => sum + item.beds, 0);
  const operationalPercentage = totalHospitals > 0 ? Math.round(((operationalCount + partialCount * 0.5) / totalHospitals) * 100) : 0;

  const criticalSupplies = MEDICAL_SUPPLIES.filter(s => s.status === 'critical').length;
  const totalWorkers = HEALTHCARE_WORKERS.doctors + HEALTHCARE_WORKERS.nurses + HEALTHCARE_WORKERS.paramedics;
  
  // Process healthcare attacks data
  const attacksByType = healthcareAttacks ? getTopN(healthcareAttacks.byType, 5) : [];
  const attacksByGovernorate = healthcareAttacks ? getTopN(healthcareAttacks.byGovernorate, 8) : [];
  const attackTrend = healthcareAttacks?.byMonth.slice(-12) || [];
  
  // Create status breakdown from real data if available
  const statusBreakdown = hasFacilitiesData ? [
    { status: 'Operational', count: operationalCount, color: '#10B981', beds: 0 },
    { status: 'Partially Operational', count: partialCount, color: '#F59E0B', beds: 0 },
    { status: 'Non-Operational', count: nonOperationalCount, color: '#EF4444', beds: 0 },
  ] : STATUS_BREAKDOWN;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Healthcare System Status</h2>
          <p className="text-muted-foreground">
            Monitoring medical infrastructure, supplies, and personnel
          </p>
          <div className="mt-2">
            {loading ? (
              <DataLoadingBadge />
            ) : (
              <DataQualityBadge
                source={hasFacilitiesData ? "Ministry of Health via HDX" : "Sample data"}
                isRealData={hasFacilitiesData}
                recordCount={facilitiesData?.total}
                showDetails={true}
              />
            )}
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {operationalPercentage}% Functional
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title="Total Hospitals"
          value={totalHospitals}
          icon={Building2}
          loading={loading}
          gradient="from-primary/20 to-transparent"
          subtitle={`${operationalCount + partialCount} functional`}
        />
        
        <ExpandableMetricCard
          title="Bed Capacity"
          value={totalBeds.toLocaleString()}
          icon={Activity}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
          subtitle="Total hospital beds"
        />
        
        <ExpandableMetricCard
          title="Healthcare Workers"
          value={totalWorkers.toLocaleString()}
          icon={Users}
          loading={loading}
          gradient="from-chart-2/20 to-transparent"
          subtitle={`${HEALTHCARE_WORKERS.casualties} casualties`}
        />
        
        <ExpandableMetricCard
          title="Critical Shortages"
          value={criticalSupplies}
          icon={AlertTriangle}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          subtitle="Essential supplies depleted"
        />
      </div>

      {/* Hospital Status Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Pie Chart */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Hospital Operational Status
                </CardTitle>
                <CardDescription>Distribution of hospital functionality</CardDescription>
              </div>
              <DataQualityBadge
                source={hasFacilitiesData ? "MoH" : "Sample"}
                isRealData={hasFacilitiesData}
                showDetails={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {statusBreakdown.map((entry, index) => (
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
                    formatter={(value: number) => `${value} facilities`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Healthcare Workers */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-chart-3" />
              Healthcare Personnel
            </CardTitle>
            <CardDescription>Medical staff available and casualties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Doctors</div>
                  <div className="text-2xl font-bold text-chart-3">{HEALTHCARE_WORKERS.doctors}</div>
                </div>
                <Users className="h-8 w-8 text-chart-3 opacity-50" />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Nurses</div>
                  <div className="text-2xl font-bold text-chart-2">{HEALTHCARE_WORKERS.nurses}</div>
                </div>
                <Users className="h-8 w-8 text-chart-2 opacity-50" />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/10">
                <div className="space-y-1">
                  <div className="font-medium">Casualties</div>
                  <div className="text-2xl font-bold text-destructive">{HEALTHCARE_WORKERS.casualties}</div>
                  <div className="text-xs text-muted-foreground">
                    {HEALTHCARE_WORKERS.detained} detained
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Supplies Availability */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-chart-4" />
            Medical Supplies Availability
          </CardTitle>
          <CardDescription>Stock levels of essential medical supplies (%)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="space-y-4">
              {MEDICAL_SUPPLIES.map((supply, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{supply.item}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {supply.availability}% available
                      </span>
                      <Badge variant={supply.status === 'critical' ? 'destructive' : 'secondary'}>
                        {supply.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={supply.availability} 
                    className={`h-2 ${supply.availability < 10 ? 'bg-destructive/20' : 'bg-chart-4/20'}`}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Healthcare Attacks Data (Real Data) */}
      {healthcareAttacks && healthcareAttacks.totalAttacks > 0 && (
        <>
          {/* Attacks Summary Card */}
          <Card className="border-border bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Target className="h-5 w-5" />
                Healthcare Attacks (Real Data)
              </CardTitle>
              <CardDescription>Documented attacks on healthcare facilities from Good Shepherd Collective</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Total Attacks</div>
                  <div className="text-3xl font-bold text-destructive mt-1">
                    {healthcareAttacks.totalAttacks.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Attack Types</div>
                  <div className="text-3xl font-bold mt-1">
                    {Object.keys(healthcareAttacks.byType).length}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Affected Governorates</div>
                  <div className="text-3xl font-bold mt-1">
                    {Object.keys(healthcareAttacks.byGovernorate).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attacks Trend and Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Attacks by Type */}
            {attacksByType.length > 0 && (
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Attacks by Type</CardTitle>
                  <CardDescription>Most targeted healthcare facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={attacksByType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                        <YAxis 
                          type="category" 
                          dataKey="category" 
                          stroke="hsl(var(--muted-foreground))"
                          width={100}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="hsl(var(--destructive))"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Attacks by Governorate */}
            {attacksByGovernorate.length > 0 && (
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Attacks by Governorate</CardTitle>
                  <CardDescription>Geographic distribution of attacks</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="space-y-3">
                      {attacksByGovernorate.slice(0, 6).map((gov, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{gov.category}</div>
                            <div className="text-sm text-muted-foreground">
                              {gov.percentage.toFixed(1)}% of total
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-destructive">
                            {gov.count.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Attacks Trend Over Time */}
          {attackTrend.length > 0 && (
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Healthcare Attacks Trend (Real Data)
                </CardTitle>
                <CardDescription>Monthly attacks on healthcare facilities (Last 12 months)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attackTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
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
                        formatter={(value: number) => [`${value} attacks`, 'Attacks']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Healthcare Attacks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}


      {/* Major Hospitals Table */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle>Major Hospitals Status</CardTitle>
          <CardDescription>Detailed status of key medical facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {HOSPITAL_STATUS.map((hospital, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{hospital.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {hospital.location} • {hospital.type} • {hospital.beds} beds
                  </div>
                  {hospital.occupancy > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Occupancy: {hospital.occupancy} / {hospital.beds} ({Math.round((hospital.occupancy / hospital.beds) * 100)}%)
                    </div>
                  )}
                </div>
                <Badge 
                  variant={
                    hospital.status === 'operational' ? 'default' :
                    hospital.status === 'partially_operational' ? 'secondary' :
                    'destructive'
                  }
                  className="whitespace-nowrap"
                >
                  {hospital.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Healthcare Crisis Indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Critical Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <span>Only 33% of hospitals partially functional</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <span>Severe shortage of anesthetics and surgical supplies</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <span>Over 1,000 healthcare workers killed or injured</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <span>Critical bed shortage with 66% capacity lost</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <span>Limited electricity for life-saving equipment</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-chart-4/10">
          <CardHeader>
            <CardTitle>Immediate Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Package className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Emergency surgical kits for trauma care</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Antibiotics and pain management medications</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Blood and blood products</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Fuel for hospital generators</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Clean water and sanitation supplies</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        {hasFacilitiesData || hasAttacksData ? (
          <p>
            ✅ Real data from{' '}
            {hasFacilitiesData && <><strong>Ministry of Health via HDX</strong> (facility status)</>}
            {hasFacilitiesData && hasAttacksData && ', '}
            {hasAttacksData && <><strong>Good Shepherd Collective</strong> (healthcare attacks)</>}.
            {' '}Medical supplies and worker data are estimated.
            {' '}Last updated: {new Date().toLocaleDateString()}
          </p>
        ) : (
          <p>
            Sample/estimated data. Integration with Ministry of Health and WHO data sources in progress.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthcareStatus;