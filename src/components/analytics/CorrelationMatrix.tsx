/**
 * Correlation Matrix Component
 * 
 * Analyzes relationships between different metrics:
 * - Correlation coefficients
 * - Heatmap visualization
 * - Statistical significance
 * - Scatter plots for relationships
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { 
  Network,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';
import { correlation } from './utils/statistics';
import { Alert, AlertDescription } from './components/ui/alert';

// ============================================
// SAMPLE DATA
// ============================================

const METRICS = [
  { name: 'Casualties', key: 'casualties', values: [50, 65, 78, 92, 105, 118, 132, 145] },
  { name: 'Infrastructure', key: 'infrastructure', values: [120, 180, 245, 310, 385, 460, 540, 625] },
  { name: 'Aid Blocked', key: 'aidBlocked', values: [45, 58, 72, 89, 105, 123, 142, 165] },
  { name: 'Displacement', key: 'displacement', values: [450, 920, 1350, 1620, 1750, 1820, 1850, 1900] },
];

interface CorrelationMatrixProps {
  loading?: boolean;
}

export const CorrelationMatrix = ({ loading = false }: CorrelationMatrixProps) => {
  
  // Calculate all correlations
  const correlations = useMemo(() => {
    const results: Array<{
      metric1: string;
      metric2: string;
      correlation: number;
      strength: string;
      color: string;
    }> = [];
    
    for (let i = 0; i < METRICS.length; i++) {
      for (let j = i + 1; j < METRICS.length; j++) {
        const corr = correlation(METRICS[i].values, METRICS[j].values);
        const absCorr = Math.abs(corr);
        
        let strength = 'Weak';
        let color = 'bg-muted';
        
        if (absCorr > 0.9) {
          strength = 'Very Strong';
          color = corr > 0 ? 'bg-destructive' : 'bg-chart-2';
        } else if (absCorr > 0.7) {
          strength = 'Strong';
          color = corr > 0 ? 'bg-destructive/70' : 'bg-chart-2/70';
        } else if (absCorr > 0.5) {
          strength = 'Moderate';
          color = corr > 0 ? 'bg-chart-4' : 'bg-chart-3';
        }
        
        results.push({
          metric1: METRICS[i].name,
          metric2: METRICS[j].name,
          correlation: corr,
          strength,
          color
        });
      }
    }
    
    return results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, []);
  
  // Prepare scatter plot data
  const scatterData = useMemo(() => {
    const casualties = METRICS.find(m => m.key === 'casualties')?.values || [];
    const infrastructure = METRICS.find(m => m.key === 'infrastructure')?.values || [];
    
    return casualties.map((c, i) => ({
      casualties: c,
      infrastructure: infrastructure[i] || 0,
      day: i + 1
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Correlation Analysis</h3>
          <p className="text-muted-foreground">
            Statistical relationships between different metrics
          </p>
        </div>
        <Badge variant="secondary">
          {correlations.length} Correlations Analyzed
        </Badge>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Correlation values range from -1 to +1. Values near +1 indicate strong positive relationship,
          near -1 indicate strong negative relationship, and near 0 indicate little to no relationship.
        </AlertDescription>
      </Alert>

      {/* Correlation Results */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Correlation Coefficients
          </CardTitle>
          <CardDescription>Pearson correlation between key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.map((corr, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{corr.metric1} ↔ {corr.metric2}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {corr.correlation > 0 ? 'Positive' : 'Negative'} {corr.strength.toLowerCase()} correlation
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{corr.correlation.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">r value</div>
                  </div>
                  <div className={`w-16 h-16 rounded flex items-center justify-center ${corr.color}`}>
                    <span className="text-xs font-bold text-white">{corr.strength}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scatter Plot Example */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            Casualties vs Infrastructure Damage
          </CardTitle>
          <CardDescription>Scatter plot showing relationship between metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  type="number"
                  dataKey="casualties" 
                  name="Daily Casualties"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Daily Casualties', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number"
                  dataKey="infrastructure"
                  name="Infrastructure Damaged"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Infrastructure Damaged', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis range={[60, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Scatter 
                  name="Daily Data Points" 
                  data={scatterData} 
                  fill="hsl(var(--chart-1))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Interpretation Guide */}
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Correlation Strength Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-destructive" />
              <span>Very Strong (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-destructive/70" />
              <span>Strong (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-chart-4" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-chart-2/70" />
              <span>Strong (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-chart-2" />
              <span>Very Strong (-)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationMatrix;