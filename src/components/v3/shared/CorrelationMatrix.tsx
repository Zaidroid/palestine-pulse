/**
 * V3 Correlation Matrix Component
 *
 * Displays correlation analysis between different data metrics
 * in an interactive matrix format
 */

import React, { useMemo } from 'react';
import { useV3Store } from '@/store/v3Store';
import { createAnalyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CorrelationMatrixProps {
  className?: string;
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ className }) => {
  const { consolidatedData, isLoadingData } = useV3Store();

  const correlations = useMemo(() => {
    if (!consolidatedData) return [];
    const service = createAnalyticsService();
    return service.analyzeCorrelations(consolidatedData);
  }, [consolidatedData]);

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'bg-destructive/20 text-destructive';
    if (abs >= 0.6) return 'bg-warning/20 text-warning-foreground';
    if (abs >= 0.4) return 'bg-primary/20 text-primary';
    if (abs >= 0.2) return 'bg-secondary/20 text-secondary-foreground';
    return 'bg-muted/20 text-muted-foreground';
  };

  const getCorrelationIcon = (correlation: number) => {
    if (correlation > 0.3) return <TrendingUp className="h-3 w-3" />;
    if (correlation < -0.3) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  if (isLoadingData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>Loading correlation data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (correlations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>No correlation data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
        <CardDescription>
          Statistical relationships between different humanitarian metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {correlations.map((correlation, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{correlation.metric1}</span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="font-medium">{correlation.metric2}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getCorrelationIcon(correlation.correlation)}
                  <span className={`text-sm font-mono ${getCorrelationColor(correlation.correlation)}`}>
                    {correlation.correlation.toFixed(3)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {correlation.strength}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {correlation.trend}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Significance</div>
                <div className="font-mono text-sm">{correlation.significance}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};