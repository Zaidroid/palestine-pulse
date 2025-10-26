/**
 * AnimatedAreaChart Usage Example
 * 
 * Demonstrates how to use the AnimatedAreaChart component with time-based filtering.
 * This example can be used as a reference for implementing area charts in dashboards.
 */

import { AnimatedAreaChartWithFilters } from './AnimatedAreaChartWithFilters';
import { TimeSeriesData, DataSourceMetadata } from '@/types/dashboard-data.types';
import { TrendingUp } from 'lucide-react';

/**
 * Example: Casualties Timeline Chart
 */
export const CasualtiesTimelineExample = () => {
  // Sample data - in production, this would come from a data hook
  const sampleData: TimeSeriesData[] = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (90 - i));
    
    return {
      date: date.toISOString(),
      value: Math.floor(Math.random() * 500) + 100 + i * 5,
      category: 'casualties',
    };
  });

  // Data source metadata
  const dataSource: DataSourceMetadata = {
    source: 'Tech4Palestine',
    url: 'https://data.techforpalestine.org',
    lastUpdated: new Date().toISOString(),
    reliability: 'high',
    methodology: 'Daily aggregated casualty reports from verified sources',
    recordCount: sampleData.length,
  };

  return (
    <AnimatedAreaChartWithFilters
      title="Daily Casualties Timeline"
      icon={<TrendingUp className="h-5 w-5" />}
      badge="Area Chart"
      rawData={sampleData}
      dataSource={dataSource}
      initialTimeRange="1m"
      color="hsl(var(--chart-1))"
      animated={true}
      interactive={true}
      showGrid={true}
      curveType="monotone"
      enableExport={true}
      enableShare={true}
      showFilteredBy={true}
    />
  );
};

/**
 * Example: Economic Indicators Chart
 */
export const EconomicIndicatorsExample = () => {
  // Sample economic data
  const sampleData: TimeSeriesData[] = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - i));
    
    return {
      date: date.toISOString(),
      value: 1000 + Math.sin(i / 30) * 200 + Math.random() * 100,
      category: 'gdp',
    };
  });

  const dataSource: DataSourceMetadata = {
    source: 'World Bank',
    url: 'https://data.worldbank.org',
    lastUpdated: new Date().toISOString(),
    reliability: 'high',
    methodology: 'World Bank Open Data API - GDP indicators',
    recordCount: sampleData.length,
  };

  return (
    <AnimatedAreaChartWithFilters
      title="GDP Trends"
      icon={<TrendingUp className="h-5 w-5" />}
      badge="Economic"
      rawData={sampleData}
      dataSource={dataSource}
      initialTimeRange="1y"
      color="hsl(var(--chart-5))"
      animated={true}
      interactive={true}
      showGrid={true}
      curveType="monotone"
      valueFormatter={(value) => `$${(value / 1000).toFixed(1)}B`}
      enableExport={true}
      enableShare={true}
    />
  );
};

/**
 * Example: Healthcare Attacks Timeline
 */
export const HealthcareAttacksExample = () => {
  // Sample healthcare attack data
  const sampleData: TimeSeriesData[] = Array.from({ length: 180 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (180 - i));
    
    return {
      date: date.toISOString(),
      value: Math.floor(Math.random() * 10) + 1,
      category: 'healthcare_attacks',
    };
  });

  const dataSource: DataSourceMetadata = {
    source: 'Good Shepherd Collective',
    url: 'https://goodshepherd.org',
    lastUpdated: new Date().toISOString(),
    reliability: 'high',
    methodology: 'Verified reports of attacks on healthcare facilities',
    recordCount: sampleData.length,
  };

  return (
    <AnimatedAreaChartWithFilters
      title="Healthcare Facility Attacks"
      icon={<TrendingUp className="h-5 w-5" />}
      badge="Healthcare"
      rawData={sampleData}
      dataSource={dataSource}
      initialTimeRange="3m"
      color="hsl(var(--chart-4))"
      animated={true}
      interactive={true}
      showGrid={true}
      curveType="step"
      enableExport={true}
      enableShare={true}
      onDataPointClick={(data) => {
        console.log('Clicked data point:', data);
      }}
    />
  );
};

/**
 * Example: Simple Area Chart (without filters)
 */
export const SimpleAreaChartExample = () => {
  const sampleData: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    
    return {
      date: date.toISOString(),
      value: Math.floor(Math.random() * 100) + 50,
    };
  });

  const dataSource: DataSourceMetadata = {
    source: 'Sample Data',
    lastUpdated: new Date().toISOString(),
    reliability: 'medium',
    methodology: 'Generated sample data for demonstration',
  };

  return (
    <AnimatedAreaChartWithFilters
      title="Simple Area Chart"
      rawData={sampleData}
      dataSource={dataSource}
      initialTimeRange="all"
      animated={true}
      interactive={true}
      enableExport={false}
      enableShare={false}
      showFilteredBy={false}
    />
  );
};

/**
 * Example: All Examples in a Grid
 */
export const AnimatedAreaChartExamples = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AnimatedAreaChart Examples</h1>
        <p className="text-muted-foreground">
          Demonstrations of the AnimatedAreaChart component with various configurations
        </p>
      </div>

      <div className="grid gap-6">
        <CasualtiesTimelineExample />
        <EconomicIndicatorsExample />
        <HealthcareAttacksExample />
        <SimpleAreaChartExample />
      </div>
    </div>
  );
};

export default AnimatedAreaChartExamples;
