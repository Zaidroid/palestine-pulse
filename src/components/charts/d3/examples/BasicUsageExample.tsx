/**
 * Basic Usage Example
 * 
 * Demonstrates how to use the ChartCard wrapper with a D3 chart component
 */

import { ChartCard } from '../ChartCard';
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';
import { TrendingUp } from 'lucide-react';

export const BasicUsageExample = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">ChartCard Usage Example</h2>
      
      <ChartCard
        title="Casualties Timeline"
        icon={<TrendingUp className="h-5 w-5 text-destructive" />}
        badge="Area Chart"
        chartType="area"
        dataSource={{
          source: "Gaza Ministry of Health",
          url: "https://example.com",
          lastUpdated: "2 hours ago",
          reliability: "high",
          methodology: "Direct hospital reports with daily aggregation and field verification"
        }}
        filters={{
          enabled: true,
          defaultFilter: 'all',
          onFilterChange: (filter) => console.log('Filter changed:', filter)
        }}
        onExport={() => console.log('Export clicked')}
        onShare={() => console.log('Share clicked')}
      >
        <AnimatedAreaChart />
      </ChartCard>
    </div>
  );
};
