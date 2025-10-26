/**
 * Full Features Example
 * 
 * Comprehensive example showing all ChartCard features
 */

import { useState } from 'react';
import { ChartCard, TimeFilter } from '../index';
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';
import { InteractiveBarChart } from '@/components/charts/demo/InteractiveBarChart';
import { TrendingUp, Building2 } from 'lucide-react';

export const FullFeaturesExample = () => {
  const [areaFilter, setAreaFilter] = useState<TimeFilter>('all');
  const [barFilter, setBarFilter] = useState<TimeFilter>('month');

  const handleAreaExport = async () => {
    console.log('Exporting area chart...');
    // Implement actual export logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Area chart exported!');
  };

  const handleAreaShare = async () => {
    console.log('Sharing area chart...');
    const url = `${window.location.href}?chart=area&filter=${areaFilter}`;
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleBarExport = async () => {
    console.log('Exporting bar chart...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Bar chart exported!');
  };

  return (
    <div className="min-h-screen p-6 space-y-8 bg-background">
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          D3 Chart Library - Full Features Demo
        </h1>
        <p className="text-muted-foreground">
          Demonstrating all ChartCard features with real chart components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart with All Features */}
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
            methodology: "Direct hospital reports with daily aggregation and field verification from multiple sources"
          }}
          filters={{
            enabled: true,
            defaultFilter: 'all',
            onFilterChange: (filter) => {
              console.log('Area chart filter changed:', filter);
              setAreaFilter(filter);
            }
          }}
          exportEnabled={true}
          shareEnabled={true}
          onExport={handleAreaExport}
          onShare={handleAreaShare}
        >
          <AnimatedAreaChart />
        </ChartCard>

        {/* Bar Chart with Custom Configuration */}
        <ChartCard
          title="Infrastructure Damage"
          icon={<Building2 className="h-5 w-5 text-warning" />}
          badge="Bar Chart"
          chartType="bar"
          dataSource={{
            source: "UN OCHA",
            url: "https://www.unocha.org",
            lastUpdated: "6 hours ago",
            reliability: "high",
            methodology: "Satellite imagery analysis combined with ground verification teams and local reports"
          }}
          filters={{
            enabled: true,
            defaultFilter: 'month',
            onFilterChange: (filter) => {
              console.log('Bar chart filter changed:', filter);
              setBarFilter(filter);
            }
          }}
          exportEnabled={true}
          shareEnabled={false}
          onExport={handleBarExport}
        >
          <InteractiveBarChart />
        </ChartCard>

        {/* Chart with Filters Disabled */}
        <ChartCard
          title="Static Overview"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          badge="Area Chart"
          chartType="area"
          dataSource={{
            source: "Multiple Sources",
            lastUpdated: "Daily",
            reliability: "high",
            methodology: "Aggregated data from multiple verified humanitarian sources"
          }}
          filters={{
            enabled: false
          }}
          exportEnabled={true}
          shareEnabled={true}
        >
          <AnimatedAreaChart />
        </ChartCard>

        {/* Minimal Configuration */}
        <ChartCard
          title="Simple Chart"
          icon={<Building2 className="h-5 w-5 text-secondary" />}
          badge="Bar Chart"
          chartType="bar"
          dataSource={{
            source: "Local Data",
            lastUpdated: "Real-time",
            reliability: "medium",
            methodology: "Automated data collection from public sources"
          }}
        >
          <InteractiveBarChart />
        </ChartCard>
      </div>

      {/* Feature Summary */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Features Demonstrated</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">ChartCard Features:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>✅ Time filter tabs (7D, 1M, 3M, 1Y, All)</li>
              <li>✅ Export functionality with loading states</li>
              <li>✅ Share functionality with URL generation</li>
              <li>✅ Data source badges with hover panels</li>
              <li>✅ Configurable filters with callbacks</li>
              <li>✅ Optional export/share buttons</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Current Filter States:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>Area Chart: <span className="font-medium text-foreground">{areaFilter}</span></li>
              <li>Bar Chart: <span className="font-medium text-foreground">{barFilter}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
