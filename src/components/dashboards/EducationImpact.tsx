/**
 * Education Impact Component
 *
 * Tracks education system disruption:
 * - Schools damaged and destroyed
 * - Students unable to access education
 * - Teacher casualties
 * - Learning loss estimates
 * - University impact
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Progress } from './components/ui/progress';
import {
  GraduationCap,
  School,
  AlertCircle,
  BookOpen,
  Users,
  TrendingDown
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
import { useSchools, useSchoolStatistics } from './hooks/useSchools';
import { DataQualityBadge, DataLoadingBadge } from './components/ui/data-quality-badge';

// ============================================
// SAMPLE DATA
// ============================================

const SCHOOL_STATUS = [
  { status: 'Operational', count: 0, percentage: 0, color: '#10B981' },
  { status: 'Damaged', count: 342, percentage: 48, color: '#F59E0B' },
  { status: 'Destroyed', count: 372, percentage: 52, color: '#EF4444' },
];

const EDUCATION_LEVELS = [
  { level: 'Elementary', schools: 418, students: 280000, affected: 280000 },
  { level: 'Middle School', schools: 178, students: 125000, affected: 125000 },
  { level: 'High School', schools: 118, students: 95000, affected: 95000 },
];

const UNIVERSITIES = [
  { name: 'Islamic University of Gaza', status: 'Destroyed', students: 20000 },
  { name: 'Al-Azhar University', status: 'Severely Damaged', students: 18000 },
  { name: 'Gaza University', status: 'Damaged', students: 12000 },
  { name: 'University College', status: 'Partially Damaged', students: 8000 },
  { name: 'Al-Aqsa University', status: 'Damaged', students: 15000 },
];

const MONTHLY_IMPACT = [
  { month: 'Oct 2023', schools: 89, students: 125000 },
  { month: 'Nov 2023', schools: 234, students: 285000 },
  { month: 'Dec 2023', schools: 412, students: 425000 },
  { month: 'Jan 2024', schools: 556, students: 475000 },
  { month: 'Feb 2024', schools: 628, students: 490000 },
  { month: 'Mar 2024', schools: 681, students: 497000 },
  { month: 'Apr 2024', schools: 698, students: 499000 },
  { month: 'May 2024', schools: 714, students: 500000 },
];

interface EducationImpactProps {
  loading?: boolean;
}

export const EducationImpact = ({ loading: externalLoading = false }: EducationImpactProps) => {
  // Fetch real schools data
  const { data: schoolsData, isLoading: schoolsLoading, error: schoolsError } = useSchools();
  const schoolStats = useSchoolStatistics();
  
  const loading = externalLoading || schoolsLoading;
  
  // Determine if we have real data
  const hasSchoolsData = !schoolsError && schoolsData && schoolsData.total > 0;
  
  // Use real data if available, fallback to sample
  const totalSchools = hasSchoolsData ? schoolsData.total : SCHOOL_STATUS.reduce((sum, s) => sum + s.count, 0);
  const totalStudents = hasSchoolsData ? schoolStats.totalStudents : EDUCATION_LEVELS.reduce((sum, l) => sum + l.students, 0);
  const totalAffected = EDUCATION_LEVELS.reduce((sum, l) => sum + l.affected, 0);
  const universityStudents = UNIVERSITIES.reduce((sum, u) => sum + u.students, 0);
  
  // Create region breakdown for display
  const regionData = hasSchoolsData ? [
    { region: 'Gaza', schools: schoolStats.gaza, students: Math.round(schoolStats.totalStudents * (schoolStats.gaza / totalSchools)) },
    { region: 'West Bank', schools: schoolStats.westBank, students: Math.round(schoolStats.totalStudents * (schoolStats.westBank / totalSchools)) },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Education Impact</h2>
          <p className="text-muted-foreground">
            Tracking disruption to education system and student welfare
          </p>
          <div className="mt-2">
            {loading ? (
              <DataLoadingBadge />
            ) : (
              <DataQualityBadge
                source={hasSchoolsData ? "PA Ministry of Education via HDX" : "Sample data"}
                isRealData={hasSchoolsData}
                recordCount={schoolsData?.total}
                showDetails={true}
              />
            )}
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {hasSchoolsData ? `${totalSchools.toLocaleString()} Schools` : '100% Schools Non-Functional'}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpandableMetricCard
          title={hasSchoolsData ? "Total Schools" : "Schools Damaged/Destroyed"}
          value={totalSchools}
          icon={School}
          loading={loading}
          gradient="from-destructive/20 to-transparent"
          subtitle={hasSchoolsData ? `${schoolStats.gaza} Gaza, ${schoolStats.westBank} West Bank` : "Out of 714 total schools"}
        />
        
        <ExpandableMetricCard
          title="Students"
          value={totalStudents > 0 ? totalStudents.toLocaleString() : "500K+"}
          icon={Users}
          loading={loading}
          gradient="from-chart-1/20 to-transparent"
          subtitle={hasSchoolsData ? "Enrolled students" : "Unable to access education"}
        />
        
        <ExpandableMetricCard
          title="Teachers & Staff"
          value="349"
          icon={GraduationCap}
          loading={loading}
          gradient="from-chart-3/20 to-transparent"
          subtitle="Killed in attacks"
        />
        
        <ExpandableMetricCard
          title="Universities Damaged"
          value="12"
          icon={BookOpen}
          loading={loading}
          gradient="from-chart-4/20 to-transparent"
          subtitle={`${universityStudents.toLocaleString()} students`}
        />
      </div>

      {/* School Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Pie Chart */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-destructive" />
                  {hasSchoolsData ? "Schools by Region" : "School Status Breakdown"}
                </CardTitle>
                <CardDescription>{hasSchoolsData ? "Distribution across Palestine" : "Distribution of school conditions"}</CardDescription>
              </div>
              <DataQualityBadge
                source={hasSchoolsData ? "PA MoE" : "Sample"}
                isRealData={hasSchoolsData}
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
                    data={hasSchoolsData && regionData.length > 0 ? regionData : SCHOOL_STATUS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => hasSchoolsData ? `${entry.region}: ${entry.schools}` : `${entry.status}: ${entry.percentage}%`}
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey={hasSchoolsData ? "schools" : "count"}
                    paddingAngle={2}
                  >
                    {(hasSchoolsData && regionData.length > 0 ? regionData : SCHOOL_STATUS).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={hasSchoolsData ? (index === 0 ? '#EF4444' : '#F59E0B') : entry.color}
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
                    formatter={(value: number) => `${value} schools`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Students by Level */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-1" />
              Students Affected by Level
            </CardTitle>
            <CardDescription>Educational impact across grade levels</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={EDUCATION_LEVELS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="level" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                  <Bar 
                    dataKey="students" 
                    fill="hsl(var(--chart-1))" 
                    name="Total Students"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar 
                    dataKey="affected" 
                    fill="hsl(var(--destructive))" 
                    name="Affected Students"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Universities Status */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-chart-3" />
            Universities and Higher Education
          </CardTitle>
          <CardDescription>Status of higher education institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {UNIVERSITIES.map((uni, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{uni.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {uni.students.toLocaleString()} students enrolled
                  </div>
                </div>
                <Badge 
                  variant={
                    uni.status === 'Destroyed' ? 'destructive' :
                    uni.status === 'Severely Damaged' ? 'destructive' :
                    'secondary'
                  }
                >
                  {uni.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-sm font-medium mb-2">Total Higher Education Impact</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Universities Affected:</span>
                <span className="ml-2 font-bold">{UNIVERSITIES.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Students Impacted:</span>
                <span className="ml-2 font-bold">{universityStudents.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Loss & Impact */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Educational Crisis Indicators
          </CardTitle>
          <CardDescription>Long-term impact on education system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">Learning Loss</div>
                <div className="text-sm text-muted-foreground">Estimated academic years lost</div>
              </div>
              <div className="text-3xl font-bold text-destructive">2-3 years</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">School Days Lost</div>
                <div className="text-sm text-muted-foreground">Since October 7, 2023</div>
              </div>
              <div className="text-3xl font-bold text-destructive">220+</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">UNRWA Schools Damaged</div>
                <div className="text-sm text-muted-foreground">Out of 288 total facilities</div>
              </div>
              <div className="text-3xl font-bold text-destructive">190</div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">Children Out of School</div>
                <div className="text-sm text-muted-foreground">Percentage of school-age children</div>
              </div>
              <div className="text-3xl font-bold text-destructive">100%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Situation Alert */}
      <Card className="border-border bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Education System Collapse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>All 714 schools in Gaza non-operational since early October 2023</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>500,000+ students have lost access to education for over 7 months</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>349 teachers and education staff killed in attacks</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>190 UNRWA schools damaged, many used as shelters for displaced</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>All universities severely damaged or destroyed</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <span>Estimated 2-3 years of learning loss for entire student population</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Long-term Impact */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-chart-4/10">
          <CardHeader>
            <CardTitle className="text-sm">Immediate Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Psychosocial support for traumatized students</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Temporary learning spaces and safe environments</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Educational materials and supplies</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-chart-4 mt-0.5" />
                <span>Teacher training and support programs</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-chart-1/10">
          <CardHeader>
            <CardTitle className="text-sm">Long-term Consequences</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Generation-wide learning gap and educational setback</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Decreased literacy and numeracy rates</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Limited higher education and career opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                <span>Long-term economic and development impact</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Note */}
      <div className="text-xs text-muted-foreground text-center p-4 border-t">
        {hasSchoolsData ? (
          <p>
            ✅ Real data from <strong>PA Ministry of Education via HDX</strong> ({totalSchools.toLocaleString()} schools database).
            {' '}School damage estimates and student impact data are based on reports from UNRWA and UNESCO.
            {' '}Last updated: {new Date().toLocaleDateString()}
          </p>
        ) : (
          <p>
            Sample/estimated data. Integration with PA Ministry of Education database in progress.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationImpact;