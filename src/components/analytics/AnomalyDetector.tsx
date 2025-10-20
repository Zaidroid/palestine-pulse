/**
 * Anomaly Detection Component
 * 
 * Identifies unusual patterns in data:
 * - Statistical outlier detection
 * - Spike identification
 * - Change point detection
 * - Anomaly timeline
 * - Alert system
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  AlertTriangle,
  TrendingUp,
  Activity,
  Info
} from 'lucide-react';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { 
  detectAnomalies,
  mean,
  standardDeviation
} from './utils/statistics';

interface AnomalyDetectorProps {
  data: Array<{ date: string; value: number }>;
  metricName?: string;
  threshold?: number;
  loading?: boolean;
}

export const AnomalyDetector = ({ 
  data = [],
  metricName = 'Casualties',
  threshold = 2,
  loading = false
}: AnomalyDetectorProps) => {
  
  // Generate sample data if none provided
  const sampleData = useMemo(() => {
    if (data.length > 0) return data;
    
    // Generate 60 days of sample data with some anomalies
    return Array.from({ length: 60 }, (_, i) => ({
      date: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: 100 + Math.random() * 50 + (i % 10 === 0 ? Math.random() * 200 : 0) // Add spikes every 10 days
    }));
  }, [data]);
  
  // Detect anomalies
  const analysis = useMemo(() => {
    const values = sampleData.map(d => d.value);
    const anomalyResults = detectAnomalies(values, threshold);
    const avg = mean(values);
    const stdDev = standardDeviation(values);
    
    // Add anomaly flags to data
    const dataWithAnomalies = sampleData.map((d, i) => ({
      ...d,
      isAnomaly: anomalyResults.indices.includes(i),
      avgLine: avg,
      upperBound: avg + threshold * stdDev,
      lowerBound: avg - threshold * stdDev
    }));
    
    // Create anomaly details
    const anomalies = anomalyResults.indices.map(idx => ({
      date: sampleData[idx].date,
      value: sampleData[idx].value,
      deviation: ((sampleData[idx].value - avg) / stdDev).toFixed(2),
      severity: Math.abs((sampleData[idx].value - avg) / stdDev) > 3 ? 'critical' : 'high'
    }));
    
    return {
      dataWithAnomalies,
      anomalies,
      stats: { mean: avg, stdDev, upperBound: avg + threshold * stdDev, lowerBound: avg - threshold * stdDev },
      count: anomalyResults.indices.length
    };
  }, [sampleData, threshold]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Anomaly Detection</h3>
          <p className="text-muted-foreground">
            Identifying unusual patterns and spikes in {metricName}
          </p>
        </div>
        <Badge variant={analysis.count > 0 ? 'destructive' : 'default'}>
          {analysis.count} Anomalies Detected
        </Badge>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Anomalies are detected using statistical thresholds ({threshold} standard deviations from mean).
          Mean: {analysis.stats.mean.toFixed(1)} | Std Dev: {analysis.stats.stdDev.toFixed(1)} |
          Upper Bound: {analysis.stats.upperBound.toFixed(1)} | Lower Bound: {analysis.stats.lowerBound.toFixed(1)}
        </AlertDescription>
      </Alert>

      {/* Anomaly Chart */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {metricName} with Anomaly Detection
          </CardTitle>
          <CardDescription>
            Red dots indicate detected anomalies | Dashed lines show statistical bounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analysis.dataWithAnomalies}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
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
                  formatter={(value: number) => value.toFixed(1)}
                />
                <Legend />
                
                {/* Statistical bounds */}
                <ReferenceLine 
                  y={analysis.stats.mean} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  label="Mean"
                />
                <ReferenceLine 
                  y={analysis.stats.upperBound} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label="Upper Bound"
                />
                <ReferenceLine 
                  y={analysis.stats.lowerBound} 
                  stroke="hsl(var(--chart-2))" 
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label="Lower Bound"
                />
                
                {/* Data line */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  name={metricName}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.isAnomaly) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="hsl(var(--destructive))"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Anomaly List */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Detected Anomalies
          </CardTitle>
          <CardDescription>Statistically significant deviations from normal patterns</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.anomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No significant anomalies detected in the selected period
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{anomaly.date}</span>
                      <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'default'}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Value: {anomaly.value.toFixed(1)} | Z-score: {anomaly.deviation}σ
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-destructive">{anomaly.value.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.abs(parseFloat(anomaly.deviation))}σ from mean
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Detection Methodology</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Method:</strong> Standard deviation-based outlier detection
          </p>
          <p>
            <strong>Threshold:</strong> Values beyond {threshold} standard deviations from the mean
          </p>
          <p>
            <strong>Classification:</strong> Z-score {'>'} 3σ = Critical | Z-score {'>'} 2σ = High
          </p>
          <p>
            <strong>Purpose:</strong> Identify unusual events, data quality issues, or significant changes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetector;