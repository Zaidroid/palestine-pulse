/**
 * V3 Food Security Alert Component
 *
 * Displays food security early warning alerts and recommendations
 */

import React, { useMemo } from 'react';
import { useV3Store } from '@/store/v3Store';
import { createAnalyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Wheat, Users, TrendingUp } from 'lucide-react';

interface FoodSecurityAlertProps {
  className?: string;
}

export const FoodSecurityAlert: React.FC<FoodSecurityAlertProps> = ({ className }) => {
  const { consolidatedData, isLoadingData } = useV3Store();

  const foodSecurityAlerts = useMemo(() => {
    if (!consolidatedData) return [];
    const service = createAnalyticsService();
    return service.generateFoodSecurityAlerts(consolidatedData);
  }, [consolidatedData]);

  if (isLoadingData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Food Security Alerts
          </CardTitle>
          <CardDescription>Loading food security data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (foodSecurityAlerts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Food Security Alerts
          </CardTitle>
          <CardDescription>No active food security alerts</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {foodSecurityAlerts.map((alert, index) => (
        <Alert key={index} className={`border-l-4 ${
          alert.level === 'critical' ? 'border-l-destructive' :
          alert.level === 'warning' ? 'border-l-warning' : 'border-l-primary'
        }`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              Food Security Alert - {alert.region}
            </div>
            <Badge variant={
              alert.level === 'critical' ? 'destructive' :
              alert.level === 'warning' ? 'secondary' : 'outline'
            }>
              {alert.level.toUpperCase()}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            <div className="mt-4 space-y-4">
              {/* Risk Indicators */}
              <div>
                <h5 className="font-medium mb-2">Risk Indicators</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(alert.indicators).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <h5 className="font-medium mb-2">Risk Factors</h5>
                <div className="flex flex-wrap gap-1">
                  {alert.riskFactors.map((factor, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h5 className="font-medium mb-2">Recommended Actions</h5>
                <div className="space-y-1">
                  {alert.recommendations.map((recommendation, i) => (
                    <p key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {recommendation}
                    </p>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Projected timeline: {alert.projectedTimeline}
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};