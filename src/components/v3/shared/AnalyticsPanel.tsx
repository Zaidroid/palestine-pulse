/**
 * V3 Analytics Panel Component
 *
 * Displays comprehensive analytics insights including:
 * - Correlation analysis between different metrics
 * - Predictions and forecasts
 * - Food security alerts
 * - Economic impact forecasts
 * - Infrastructure recovery projections
 */

import React, { useMemo, useEffect } from 'react';
import { useV3Store } from '@/store/v3Store';
import { createAnalyticsService, generateAnalyticsReport } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Activity } from 'lucide-react';

interface AnalyticsPanelProps {
  className?: string;
  region?: 'gaza' | 'westbank' | 'both';
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className, region = 'both' }) => {
  const { consolidatedData, isLoadingData, fetchConsolidatedData } = useV3Store();

  // Auto-fetch data on component mount
  useEffect(() => {
    if (!consolidatedData && !isLoadingData) {
      fetchConsolidatedData();
    }
  }, [consolidatedData, isLoadingData, fetchConsolidatedData]);

  const analyticsReport = useMemo(() => {
    // Generate region-specific analytics data
    if (!consolidatedData) {
      // Sample data based on region
      if (region === 'gaza') {
        return generateGazaAnalyticsSample();
      } else if (region === 'westbank') {
        return generateWestBankAnalyticsSample();
      } else {
        return generateCombinedAnalyticsSample();
      }
    }

    // Process real data based on region - with safety checks
    if (region === 'gaza' && consolidatedData.gaza) {
      try {
        const gazaData = {
          metadata: consolidatedData.metadata,
          gaza: consolidatedData.gaza,
          westbank: {} as any,
          shared: consolidatedData.shared
        };
        return generateAnalyticsReport(gazaData);
      } catch (error) {
        console.warn('Error processing Gaza analytics data:', error);
      }
    } else if (region === 'westbank' && consolidatedData.westbank) {
      try {
        const westBankData = {
          metadata: consolidatedData.metadata,
          gaza: {} as any,
          westbank: consolidatedData.westbank,
          shared: consolidatedData.shared
        };
        return generateAnalyticsReport(westBankData);
      } catch (error) {
        console.warn('Error processing West Bank analytics data:', error);
      }
    }

    return generateAnalyticsReport(consolidatedData);
  }, [consolidatedData, region]);

  // Helper functions for generating sample analytics data
  function generateGazaAnalyticsSample() {
    return {
      correlations: [
        {
          metric1: 'Daily Casualties',
          metric2: 'Infrastructure Destruction',
          correlation: 0.82,
          strength: 'very-strong' as const,
          significance: 0.01,
          trend: 'positive' as const,
          insights: [
            'High correlation suggests military operations target both civilians and infrastructure',
            'Infrastructure destruction may be used as a tactic to increase civilian suffering',
            'Recovery efforts should prioritize both humanitarian aid and infrastructure repair'
          ]
        }
      ],
      predictions: [
        {
          metric: 'Daily Casualties',
          currentValue: 85,
          predictedValue: 92,
          confidence: 0.75,
          timeframe: '7 days',
          factors: ['Military escalation patterns', 'International diplomatic efforts', 'Ceasefire negotiations'],
          methodology: 'Trend analysis with seasonal adjustment'
        }
      ],
      foodSecurityAlerts: [
        {
          level: 'critical' as const,
          region: 'Gaza',
          indicators: {
            foodPrices: 150,
            marketAccess: 30,
            displacement: 85,
            aidDelivery: 45
          },
          riskFactors: [
            'High food prices due to import restrictions',
            'Limited market access from infrastructure damage',
            'Large displaced population increasing demand',
            'Inconsistent aid delivery due to access restrictions'
          ],
          recommendations: [
            'Increase food aid shipments through alternative routes',
            'Establish local food production initiatives',
            'Improve market infrastructure repair priority',
            'Advocate for unrestricted humanitarian access'
          ],
          projectedTimeline: '3-6 months for significant improvement'
        }
      ],
      economicForecasts: [
        {
          region: 'Gaza',
          timeframe: '12 months',
          gdpImpact: -15.5,
          unemploymentImpact: 25.0,
          reconstructionCost: 20000000000,
          tradeImpact: -35.0,
          confidence: 0.78,
          keyDrivers: [
            'Infrastructure destruction',
            'Population displacement',
            'Trade restrictions',
            'Investment withdrawal'
          ]
        }
      ],
      recoveryProjections: [
        {
          facility: 'Al-Shifa Hospital',
          currentStatus: 'partially operational',
          estimatedRecoveryTime: '8-12 months',
          cost: 50000000,
          priority: 'critical' as const,
          dependencies: ['Electricity supply', 'Medical equipment', 'Specialized staff'],
          riskFactors: ['Ongoing conflict', 'Supply chain disruption', 'Brain drain']
        }
      ],
      summary: {
        overallRisk: 'critical' as const,
        keyInsights: [
          'Humanitarian crisis shows strong correlation with infrastructure destruction',
          'Economic impact extends beyond immediate conflict zones',
          'Food security requires immediate international attention'
        ],
        priorityActions: [
          'Increase humanitarian aid delivery capacity',
          'Advocate for ceasefire and unrestricted access',
          'Initiate parallel reconstruction planning'
        ]
      }
    };
  }

  function generateWestBankAnalyticsSample() {
    return {
      correlations: [
        {
          metric1: 'Settlement Expansion',
          metric2: 'Economic Indicators',
          correlation: -0.78,
          strength: 'strong' as const,
          significance: 0.01,
          trend: 'negative' as const,
          insights: [
            'Settlement expansion strongly correlates with economic decline',
            'Land confiscation severely impacts agricultural and economic activity',
            'Settlement growth displaces Palestinian communities and businesses'
          ]
        }
      ],
      predictions: [
        {
          metric: 'Settlement Population',
          currentValue: 700000,
          predictedValue: 750000,
          confidence: 0.82,
          timeframe: '12 months',
          factors: ['Government policy', 'International pressure', 'Economic incentives'],
          methodology: 'Regression analysis with policy factors'
        }
      ],
      foodSecurityAlerts: [
        {
          level: 'warning' as const,
          region: 'West Bank',
          indicators: {
            foodPrices: 120,
            marketAccess: 60,
            displacement: 40,
            aidDelivery: 70
          },
          riskFactors: [
            'Settlement expansion reducing agricultural land',
            'Movement restrictions affecting market access',
            'Economic pressures increasing food insecurity'
          ],
          recommendations: [
            'Protect agricultural land from settlement expansion',
            'Improve transportation infrastructure',
            'Support local farming cooperatives'
          ],
          projectedTimeline: '6-12 months for stabilization'
        }
      ],
      economicForecasts: [
        {
          region: 'West Bank',
          timeframe: '12 months',
          gdpImpact: -8.5,
          unemploymentImpact: 15.0,
          reconstructionCost: 5000000000,
          tradeImpact: -20.0,
          confidence: 0.82,
          keyDrivers: [
            'Settlement expansion',
            'Movement restrictions',
            'Land confiscation',
            'Economic isolation'
          ]
        }
      ],
      recoveryProjections: [
        {
          facility: 'Palestinian Agricultural Sector',
          currentStatus: 'severely impacted',
          estimatedRecoveryTime: '18-24 months',
          cost: 200000000,
          priority: 'high' as const,
          dependencies: ['Land access', 'Water rights', 'Market access'],
          riskFactors: ['Ongoing settlement expansion', 'Water resource control', 'Movement restrictions']
        }
      ],
      summary: {
        overallRisk: 'high' as const,
        keyInsights: [
          'Settlement expansion is primary driver of economic decline',
          'Systematic displacement affects agricultural productivity',
          'Movement restrictions create fragmented economic zones'
        ],
        priorityActions: [
          'Stop settlement expansion and land confiscation',
          'Restore freedom of movement',
          'Support Palestinian agricultural sector'
        ]
      }
    };
  }

  function generateCombinedAnalyticsSample() {
    return {
      correlations: [
        {
          metric1: 'Gaza Casualties',
          metric2: 'West Bank Settlement Growth',
          correlation: 0.65,
          strength: 'strong' as const,
          significance: 0.05,
          trend: 'positive' as const,
          insights: [
            'Escalation in Gaza correlates with accelerated settlement expansion in West Bank',
            'Political dynamics connect both regions despite geographic separation',
            'International attention to Gaza may enable West Bank settlement growth'
          ]
        }
      ],
      predictions: [
        {
          metric: 'Regional Instability Index',
          currentValue: 8.5,
          predictedValue: 9.2,
          confidence: 0.71,
          timeframe: '6 months',
          factors: ['Settlement expansion', 'Military operations', 'International response'],
          methodology: 'Multi-factor regression analysis'
        }
      ],
      foodSecurityAlerts: [
        {
          level: 'warning' as const,
          region: 'West Bank',
          indicators: {
            foodPrices: 120,
            marketAccess: 60,
            displacement: 40,
            aidDelivery: 70
          },
          riskFactors: [
            'Settlement expansion reducing agricultural land',
            'Movement restrictions affecting market access'
          ],
          recommendations: [
            'Protect agricultural land from settlement expansion',
            'Improve transportation infrastructure'
          ],
          projectedTimeline: '6-12 months for stabilization'
        }
      ],
      economicForecasts: [
        {
          region: 'Occupied Palestinian Territory',
          timeframe: '12 months',
          gdpImpact: -12.0,
          unemploymentImpact: 20.0,
          reconstructionCost: 25000000000,
          tradeImpact: -28.0,
          confidence: 0.75,
          keyDrivers: [
            'Combined impact of Gaza destruction and West Bank settlement expansion',
            'Movement restrictions across all occupied territories',
            'International trade barriers and restrictions'
          ]
        }
      ],
      recoveryProjections: [
        {
          facility: 'Palestinian Economy',
          currentStatus: 'severely fragmented',
          estimatedRecoveryTime: '24-36 months',
          cost: 1000000000,
          priority: 'critical' as const,
          dependencies: ['Freedom of movement', 'Land rights', 'Market access'],
          riskFactors: ['Ongoing occupation', 'Settlement expansion', 'Economic isolation']
        }
      ],
      summary: {
        overallRisk: 'critical' as const,
        keyInsights: [
          'Gaza and West Bank crises are interconnected and mutually reinforcing',
          'Settlement expansion in West Bank exploits international attention on Gaza',
          'Economic fragmentation affects entire occupied Palestinian territory'
        ],
        priorityActions: [
          'Address both Gaza humanitarian crisis and West Bank settlement expansion',
          'Restore Palestinian freedom of movement and land rights',
          'Support unified Palestinian economic development'
        ]
      }
    };
  }

  if (isLoadingData || !analyticsReport) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
          <CardDescription>Loading analytics insights...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { correlations, predictions, foodSecurityAlerts, economicForecasts, recoveryProjections, summary } = analyticsReport;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Alert */}
      <Alert className={`border-l-4 ${
        summary.overallRisk === 'critical' ? 'border-l-destructive' :
        summary.overallRisk === 'high' ? 'border-l-warning' :
        summary.overallRisk === 'moderate' ? 'border-l-primary' : 'border-l-secondary'
      }`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          Overall Risk Assessment: {summary.overallRisk.toUpperCase()}
          <Badge variant={
            summary.overallRisk === 'critical' ? 'destructive' :
            summary.overallRisk === 'high' ? 'secondary' : 'outline'
          }>
            {summary.overallRisk}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          {summary.keyInsights[0]}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="correlations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="correlations" className="space-y-4">
          <div className="grid gap-4">
            {correlations.map((correlation, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {correlation.metric1} vs {correlation.metric2}
                    <Badge variant={
                      correlation.strength === 'very-strong' || correlation.strength === 'strong' ? 'default' :
                      correlation.strength === 'moderate' ? 'secondary' : 'outline'
                    }>
                      {correlation.strength} correlation
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Correlation coefficient: {correlation.correlation.toFixed(3)} ({correlation.trend})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {correlation.insights.map((insight, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {insight}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {predictions.map((prediction, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {prediction.metric} Prediction
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
                  </CardTitle>
                  <CardDescription>
                    Current: {prediction.currentValue.toLocaleString()} →
                    Predicted: {prediction.predictedValue.toLocaleString()} ({prediction.timeframe})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Factors:</p>
                    {prediction.factors.map((factor, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {factor}</p>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      Methodology: {prediction.methodology}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {foodSecurityAlerts.map((alert, index) => (
              <Card key={index} className={`border-l-4 ${
                alert.level === 'critical' ? 'border-l-destructive' :
                alert.level === 'warning' ? 'border-l-warning' : 'border-l-primary'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Food Security Alert - {alert.region}
                    <Badge variant={
                      alert.level === 'critical' ? 'destructive' :
                      alert.level === 'warning' ? 'secondary' : 'outline'
                    }>
                      {alert.level}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Risk indicators and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(alert.indicators).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Risk Factors:</p>
                    {alert.riskFactors.map((factor, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {factor}</p>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Recommendations:</p>
                    {alert.recommendations.map((rec, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {rec}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <div className="grid gap-4">
            {recoveryProjections.map((projection, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {projection.facility} Recovery
                    <Badge variant={
                      projection.priority === 'critical' ? 'destructive' :
                      projection.priority === 'high' ? 'secondary' : 'outline'
                    }>
                      {projection.priority} priority
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Current: {projection.currentStatus} → Target: Operational
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Est. Time</p>
                      <p className="text-lg font-bold">{projection.estimatedRecoveryTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="text-lg font-bold">${(projection.cost / 1000000).toFixed(0)}M</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <p className="text-lg font-bold capitalize">{projection.priority}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Dependencies</p>
                      <p className="text-lg font-bold">{projection.dependencies.length}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Risk Factors:</p>
                    {projection.riskFactors.map((risk, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {risk}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};