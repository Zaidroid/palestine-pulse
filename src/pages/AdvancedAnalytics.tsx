/**
 * Advanced Analytics Page
 * 
 * AI and statistical analysis features:
 * - Predictive forecasting
 * - Correlation analysis
 * - Anomaly detection
 * - Trend analysis
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Brain,
  TrendingUp,
  Network,
  AlertCircle,
  Home,
  Activity,
  ArrowUpDown
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import PredictiveAnalytics from './components/analytics/PredictiveAnalytics';
import CorrelationMatrix from './components/analytics/CorrelationMatrix';
import AnomalyDetector from './components/analytics/AnomalyDetector';
import ComparisonView from './components/analytics/ComparisonView';
import { useCasualtiesDaily } from './hooks/useDataFetching';

const AdvancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState('predictive');
  const { data: casualtiesData } = useCasualtiesDaily();

  // Prepare data for predictive analytics
  const casualtyTrend = casualtiesData?.slice(-60).map(item => ({
    date: item.report_date,
    value: item.killed || 0
  })) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-lg opacity-50 rounded-lg" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Advanced Analytics
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-powered insights, predictions, and statistical analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Main Tabs */}
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 bg-muted text-xs md:text-sm">
            <TabsTrigger value="predictive">
              <TrendingUp className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              <span className="hidden sm:inline">Predictive</span>
              <span className="sm:hidden">Predict</span>
            </TabsTrigger>
            <TabsTrigger value="correlation">
              <Network className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              <span className="hidden sm:inline">Correlation</span>
              <span className="sm:hidden">Corr</span>
            </TabsTrigger>
            <TabsTrigger value="anomalies">
              <Activity className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              <span className="hidden sm:inline">Anomalies</span>
              <span className="sm:hidden">Anom</span>
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <ArrowUpDown className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              <span className="hidden sm:inline">Comparison</span>
              <span className="sm:hidden">Comp</span>
            </TabsTrigger>
          </TabsList>

          {/* Predictive Analytics Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalytics
              historicalData={casualtyTrend}
              metricName="Daily Casualties"
              forecastDays={30}
              loading={!casualtiesData}
            />
          </TabsContent>

          {/* Correlation Matrix Tab */}
          <TabsContent value="correlation" className="space-y-6">
            <CorrelationMatrix loading={false} />
          </TabsContent>

          {/* Anomaly Detection Tab */}
          <TabsContent value="anomalies" className="space-y-6">
            <AnomalyDetector
              data={casualtyTrend}
              metricName="Daily Casualties"
              threshold={2}
              loading={!casualtiesData}
            />
          </TabsContent>

          {/* Comparison View Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <ComparisonView loading={!casualtiesData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Statistical models and predictions based on historical data patterns.
              Actual outcomes may vary based on interventions and changing conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdvancedAnalytics;