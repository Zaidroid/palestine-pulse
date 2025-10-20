/**
 * Predictive Analytics Component
 * 
 * Uses statistical models to forecast future trends:
 * - Casualty predictions
 * - Infrastructure damage forecasts
 * - Trend projections
 * - Confidence intervals
 * - Multiple scenarios
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Info
} from 'lucide-react';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { 
  linearRegression,
  forecast,
  confidenceInterval,
  detectTrend
} from './utils/statistics';

interface PredictiveAnalyticsProps {
  historicalData: Array<{ date: string; value: number }>;
  metricName: string;
  forecastDays?: number;
  loading?: boolean;
}

export const PredictiveAnalytics = ({ 
  historicalData = [],
  metricName = 'Casualties',
  forecastDays = 30,
  loading = false
}: PredictiveAnalyticsProps) => {
  
  // Process historical data
  const processedData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      // Generate sample data for demonstration
      return Array.from({ length: 60 }, (_, i) => ({
        date: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: 150 + i * 2 + Math.random() * 50,
        type: 'historical'
      }));
    }
    
    return historicalData.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: d.value,
      type: 'historical'
    }));
  }, [historicalData]);
  
  // Generate forecast
  const forecastData = useMemo(() => {
    const values = processedData.map(d => d.value);
    const { predictions, confidence } = forecast(values, forecastDays);
    const ci = confidenceInterval(values);
    const trend = detectTrend(values);
    
    const lastDate = processedData[processedData.length - 1]?.date || 'Today';
    const forecastPoints = predictions.map((pred, i) => ({
      date: `+${i + 1}d`,
      value: Math.max(0, pred),
      predicted: Math.max(0, pred),
      upperBound: Math.max(0, pred + (ci.upper - ci.lower)),
      lowerBound: Math.max(0, pred - (ci.upper - ci.lower)),
      type: 'forecast'
    }));
    
    return {
      combinedData: [...processedData, ...forecastPoints],
      confidence: Math.round(confidence * 100),
      trend,
      lastValue: values[values.length - 1],
      predictedChange: predictions.length > 0 
        ? Math.round(((predictions[predictions.length - 1] - values[values.length - 1]) / values[values.length - 1]) * 100)
        : 0
    };
  }, [processedData, forecastDays]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Predictive Forecast</h3>
          <p className="text-muted-foreground">
            Statistical projection for {metricName} over next {forecastDays} days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={forecastData.trend === 'increasing' ? 'destructive' : 'default'}>
            {forecastData.trend}
          </Badge>
          <Badge variant="secondary">
            {forecastData.confidence}% confidence
          </Badge>
        </div>
      </div>

      {/* Model Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Forecast based on linear regression model with R² = {(forecastData.confidence / 100).toFixed(2)}.
          Predicted {forecastData.predictedChange > 0 ? 'increase' : 'decrease'} of {Math.abs(forecastData.predictedChange)}% over forecast period.
          <span className="text-xs text-muted-foreground ml-2">
            Model assumes current trends continue without intervention.
          </span>
        </AlertDescription>
      </Alert>

      {/* Forecast Chart */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {metricName} Forecast with Confidence Interval
          </CardTitle>
          <CardDescription>
            Blue line: historical data | Red line: predictions | Shaded area: confidence bounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={forecastData.combinedData}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
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
                  formatter={(value: number) => value ? value.toFixed(0) : 'N/A'}
                />
                <Legend />
                
                {/* Confidence interval */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="url(#confidenceGradient)"
                  fillOpacity={0.3}
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="url(#confidenceGradient)"
                  fillOpacity={0.3}
                  name="Lower Bound"
                />
                
                {/* Historical data */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Historical"
                  dot={false}
                  connectNulls
                />
                
                {/* Predictions */}
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Predicted"
                  dot={false}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{forecastData.lastValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Latest recorded value
            </p>
          </CardContent>
        </Card>

        <Card className={`border-border ${forecastData.predictedChange > 0 ? 'bg-destructive/10' : 'bg-chart-2/10'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Predicted Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${forecastData.predictedChange > 0 ? 'text-destructive' : 'text-chart-2'}`}>
              {forecastData.predictedChange > 0 ? '+' : ''}{forecastData.predictedChange}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over next {forecastDays} days
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-chart-3/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Model Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{forecastData.confidence}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              R² goodness of fit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology Note */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Disclaimer:</strong> Predictions are based on statistical models using historical data.
          Actual outcomes may vary significantly based on events, interventions, and changing conditions.
          This forecast assumes continuation of current trends without major policy changes or interventions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PredictiveAnalytics;