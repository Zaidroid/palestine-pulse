/**
 * Performance Dashboard Component
 * 
 * Displays comprehensive performance metrics:
 * - API response times
 * - Success/failure rates
 * - Active alerts
 * - Source-specific metrics
 */

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { performanceMonitor, PerformanceMetrics, PerformanceAlert } from '@/services/performanceMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { DataSource } from '@/types/data.types';

export function PerformanceDashboard() {
  const [summary, setSummary] = useState(performanceMonitor.getSummary());
  const [metrics, setMetrics] = useState(performanceMonitor.getAllSourcesMetrics());
  const [alerts, setAlerts] = useState(performanceMonitor.getAlerts());

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setSummary(performanceMonitor.getSummary());
      setMetrics(performanceMonitor.getAllSourcesMetrics());
      setAlerts(performanceMonitor.getAlerts());
    }, 5000);

    // Subscribe to alerts
    const unsubscribe = performanceMonitor.onAlert((alert) => {
      setAlerts(performanceMonitor.getAlerts());
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary.avgResponseTime)}ms</div>
            <p className="text-xs text-muted-foreground">Average across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.overallSuccessRate.toFixed(1)}%</div>
            <Progress value={summary.overallSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {summary.sourcesWithIssues} source(s) with issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.severity === 'critical' ? 'destructive' : 'default'}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.source}</p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Source Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source Performance</CardTitle>
          <CardDescription>Detailed metrics for each data source</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="response-times">Response Times</TabsTrigger>
              <TabsTrigger value="success-rates">Success Rates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {Object.entries(metrics).map(([source, metric]) => (
                <SourceMetricCard
                  key={source}
                  source={source as DataSource}
                  metric={metric}
                />
              ))}
            </TabsContent>

            <TabsContent value="response-times" className="space-y-4">
              {Object.entries(metrics)
                .sort((a, b) => b[1].avgResponseTime - a[1].avgResponseTime)
                .map(([source, metric]) => (
                  <ResponseTimeCard
                    key={source}
                    source={source as DataSource}
                    metric={metric}
                  />
                ))}
            </TabsContent>

            <TabsContent value="success-rates" className="space-y-4">
              {Object.entries(metrics)
                .sort((a, b) => a[1].successRate - b[1].successRate)
                .map(([source, metric]) => (
                  <SuccessRateCard
                    key={source}
                    source={source as DataSource}
                    metric={metric}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function SourceMetricCard({ source, metric }: { source: DataSource; metric: PerformanceMetrics }) {
  if (metric.totalRequests === 0) {
    return null;
  }

  const isHealthy = metric.successRate >= 95 && metric.avgResponseTime < 5000;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{source}</h4>
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{metric.totalRequests} requests</span>
          <span>{Math.round(metric.avgResponseTime)}ms avg</span>
          <span>{metric.successRate.toFixed(1)}% success</span>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={isHealthy ? 'default' : 'secondary'}>
          {isHealthy ? 'Healthy' : 'Degraded'}
        </Badge>
      </div>
    </div>
  );
}

function ResponseTimeCard({ source, metric }: { source: DataSource; metric: PerformanceMetrics }) {
  if (metric.totalRequests === 0) {
    return null;
  }

  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{source}</h4>
        <span className="text-sm text-muted-foreground">
          {metric.totalRequests} requests
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Min</p>
          <p className="font-medium">{Math.round(metric.minResponseTime)}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">P50</p>
          <p className="font-medium">{Math.round(metric.p50ResponseTime)}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">Avg</p>
          <p className="font-medium">{Math.round(metric.avgResponseTime)}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">P95</p>
          <p className="font-medium">{Math.round(metric.p95ResponseTime)}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">Max</p>
          <p className="font-medium">{Math.round(metric.maxResponseTime)}ms</p>
        </div>
      </div>
    </div>
  );
}

function SuccessRateCard({ source, metric }: { source: DataSource; metric: PerformanceMetrics }) {
  if (metric.totalRequests === 0) {
    return null;
  }

  const isGood = metric.successRate >= 95;

  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{source}</h4>
        <div className="flex items-center gap-2">
          {isGood ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={cn(
            'text-lg font-bold',
            isGood ? 'text-green-500' : 'text-red-500'
          )}>
            {metric.successRate.toFixed(1)}%
          </span>
        </div>
      </div>
      <Progress value={metric.successRate} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{metric.successfulRequests} successful</span>
        <span>{metric.failedRequests} failed</span>
      </div>
    </div>
  );
}
