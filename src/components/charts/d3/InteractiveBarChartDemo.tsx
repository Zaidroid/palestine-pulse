/**
 * Interactive Bar Chart Demo
 * 
 * Demonstration component showing InteractiveBarChart capabilities
 */

import { InteractiveBarChartWithFilters } from './InteractiveBarChartWithFilters';
import { ChartCard } from './ChartCard';
import { BarChart3 } from 'lucide-react';
import { CategoryData } from '@/types/dashboard-data.types';

// Sample data for demonstration
const sampleData: CategoryData[] = [
  { category: 'Healthcare Attacks', value: 2900, percentage: 35.2 },
  { category: 'School Damage', value: 1850, percentage: 22.5 },
  { category: 'Home Demolitions', value: 1000, percentage: 12.1 },
  { category: 'Infrastructure Damage', value: 890, percentage: 10.8 },
  { category: 'Displacement Events', value: 750, percentage: 9.1 },
  { category: 'Aid Distribution Points', value: 520, percentage: 6.3 },
  { category: 'Water Facilities', value: 330, percentage: 4.0 },
];

export const InteractiveBarChartDemo = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interactive Bar Chart Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating the InteractiveBarChart component with filtering and sorting capabilities
        </p>
      </div>

      {/* Vertical Bar Chart with Filters */}
      <ChartCard
        title="Humanitarian Impact by Category"
        icon={<BarChart3 className="h-5 w-5" />}
        badge="Vertical"
        chartType="bar"
        dataSource={{
          source: 'Sample Data',
          lastUpdated: new Date().toISOString(),
          reliability: 'high',
          methodology: 'Aggregated from multiple humanitarian data sources',
        }}
        filters={{ enabled: false }}
      >
        <InteractiveBarChartWithFilters
          data={sampleData}
          orientation="vertical"
          animated={true}
          interactive={true}
          showValueLabels={false}
          enableCategoryFilter={true}
          enableSorting={true}
          defaultSortBy="value"
          defaultSortOrder="desc"
          onBarClick={(data) => {
            console.log('Bar clicked:', data);
            alert(`Clicked: ${data.category} - ${data.value}`);
          }}
        />
      </ChartCard>

      {/* Horizontal Bar Chart with Filters */}
      <ChartCard
        title="Humanitarian Impact by Category (Horizontal)"
        icon={<BarChart3 className="h-5 w-5" />}
        badge="Horizontal"
        chartType="bar"
        dataSource={{
          source: 'Sample Data',
          lastUpdated: new Date().toISOString(),
          reliability: 'high',
          methodology: 'Aggregated from multiple humanitarian data sources',
        }}
        filters={{ enabled: false }}
      >
        <InteractiveBarChartWithFilters
          data={sampleData}
          orientation="horizontal"
          animated={true}
          interactive={true}
          showValueLabels={true}
          enableCategoryFilter={true}
          enableSorting={true}
          defaultSortBy="category"
          defaultSortOrder="asc"
          maxBars={5}
          onBarClick={(data) => {
            console.log('Bar clicked:', data);
          }}
        />
      </ChartCard>

      {/* Vertical Bar Chart without Filters */}
      <ChartCard
        title="Top 5 Impact Categories"
        icon={<BarChart3 className="h-5 w-5" />}
        badge="Top 5"
        chartType="bar"
        dataSource={{
          source: 'Sample Data',
          lastUpdated: new Date().toISOString(),
          reliability: 'high',
          methodology: 'Aggregated from multiple humanitarian data sources',
        }}
        filters={{ enabled: false }}
      >
        <InteractiveBarChartWithFilters
          data={sampleData}
          orientation="vertical"
          animated={true}
          interactive={true}
          showValueLabels={true}
          enableCategoryFilter={false}
          enableSorting={false}
          maxBars={5}
        />
      </ChartCard>
    </div>
  );
};

export default InteractiveBarChartDemo;
