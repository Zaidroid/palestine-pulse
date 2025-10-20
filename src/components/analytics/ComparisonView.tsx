/**
 * Comparison View Component
 * 
 * Side-by-side comparison of different time periods:
 * - Period selection
 * - Metric comparison
 * - Percentage changes
 * - Visual diff displays
 * - Statistical significance
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Skeleton } from './components/ui/skeleton';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { periodComparison, percentageChange } from './utils/statistics';

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_DATA = {
  period1: {
    name: 'Oct-Dec 2023',
    casualties: 18750,
    infrastructure: 22500,
    displacement: 1200000,
    aid: 890
  },
  period2: {
    name: 'Mar-May 2024',
    casualties: 8420,
    infrastructure: 6890,
    displacement: 1850000,
    aid: 620
  }
};

interface ComparisonViewProps {
  period1Data?: any;
  period2Data?: any;
  loading?: boolean;
}

export const ComparisonView = ({ 
  period1Data = SAMPLE_DATA.period1,
  period2Data = SAMPLE_DATA.period2,
  loading = false 
}: ComparisonViewProps) => {
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'casualties', 'infrastructure', 'displacement', 'aid'
  ]);

  // Calculate comparisons
  const comparisons = useMemo(() => {
    const metrics = [
      { 
        key: 'casualties', 
        label: 'Daily Casualties',
        period1: period1Data.casualties,
        period2: period2Data.casualties,
        unit: '',
        goodIfLower: true
      },
      { 
        key: 'infrastructure', 
        label: 'Infrastructure Damaged',
        period1: period1Data.infrastructure,
        period2: period2Data.infrastructure,
        unit: '',
        goodIfLower: true
      },
      { 
        key: 'displacement', 
        label: 'Displaced Persons',
        period1: period1Data.displacement,
        period2: period2Data.displacement,
        unit: '',
        goodIfLower: true
      },
      { 
        key: 'aid', 
        label: 'Aid Deliveries',
        period1: period1Data.aid,
        period2: period2Data.aid,
        unit: ' trucks',
        goodIfLower: false
      }
    ];

    return metrics.map(metric => {
      const change = metric.period2 - metric.period1;
      const changePercent = percentageChange(metric.period1, metric.period2);
      const isImprovement = metric.goodIfLower ? change < 0 : change > 0;
      
      return {
        ...metric,
        change,
        changePercent,
        isImprovement,
        direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable'
      };
    });
  }, [period1Data, period2Data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return comparisons.filter(c => selectedMetrics.includes(c.key)).map(c => ({
      metric: c.label,
      [period1Data.name]: c.period1,
      [period2Data.name]: c.period2
    }));
  }, [comparisons, selectedMetrics, period1Data.name, period2Data.name]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Period Comparison</h3>
          <p className="text-muted-foreground">
            Compare metrics between {period1Data.name} and {period2Data.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{period1Data.name}</Badge>
          <ArrowUpDown className="h-4 w-4" />
          <Badge variant="outline">{period2Data.name}</Badge>
        </div>
      </div>

      {/* Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Comparing two 3-month periods. Green indicates improvement, red indicates worsening.
          Percentage changes calculated relative to first period.
        </AlertDescription>
      </Alert>

      {/* Comparison Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {comparisons.map((comp, index) => (
          <Card 
            key={index} 
            className={`border-border ${
              comp.isImprovement ? 'bg-chart-2/10' : 'bg-destructive/10'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>{comp.label}</span>
                {comp.direction === 'increase' && <TrendingUp className="h-4 w-4 text-destructive" />}
                {comp.direction === 'decrease' && <TrendingDown className="h-4 w-4 text-chart-2" />}
                {comp.direction === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{period1Data.name}</div>
                  <div className="text-2xl font-bold">{comp.period1.toLocaleString()}{comp.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{period2Data.name}</div>
                  <div className="text-2xl font-bold">{comp.period2.toLocaleString()}{comp.unit}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-muted-foreground">Change:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${comp.isImprovement ? 'text-chart-2' : 'text-destructive'}`}>
                    {comp.change > 0 ? '+' : ''}{comp.change.toLocaleString()}{comp.unit}
                  </span>
                  <Badge variant={comp.isImprovement ? 'default' : 'destructive'}>
                    {comp.changePercent > 0 ? '+' : ''}{comp.changePercent.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Chart */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            Side-by-Side Comparison
          </CardTitle>
          <CardDescription>Visual comparison of key metrics between periods</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="metric" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  angle={-15}
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
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Bar 
                  dataKey={period1Data.name} 
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey={period2Data.name} 
                  fill="hsl(var(--chart-4))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary Analysis */}
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comparisons.map((comp, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{comp.label}:</span>
              <div className="flex items-center gap-2">
                <span className={comp.isImprovement ? 'text-chart-2' : 'text-destructive'}>
                  {comp.isImprovement ? '↓ Improved' : '↑ Worsened'}
                </span>
                <span className="font-medium">
                  ({Math.abs(comp.changePercent).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonView;