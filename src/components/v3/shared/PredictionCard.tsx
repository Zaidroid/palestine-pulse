/**
 * V3 Prediction Card Component
 *
 * Displays predictive analytics and forecasting insights
 */

import React, { useMemo } from 'react';
import { useV3Store } from '@/store/v3Store';
import { createAnalyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';

interface PredictionCardProps {
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ className }) => {
  const { consolidatedData, isLoadingData } = useV3Store();

  const predictions = useMemo(() => {
    if (!consolidatedData) return [];
    const service = createAnalyticsService();
    return service.generatePredictions(consolidatedData);
  }, [consolidatedData]);

  if (isLoadingData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>Loading predictions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>No predictions available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>
            AI-powered forecasts for key humanitarian metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{prediction.metric} Forecast</h4>
                  <div className="flex items-center gap-2">
                    {prediction.predictedValue > prediction.currentValue ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant="outline">
                      {prediction.confidence.toFixed(0)}% confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-xl font-bold">{prediction.currentValue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Predicted</p>
                    <p className="text-xl font-bold text-destructive">
                      {prediction.predictedValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence Level</span>
                      <span>{prediction.confidence.toFixed(0)}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Timeframe: {prediction.timeframe}</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Methodology: {prediction.methodology}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};