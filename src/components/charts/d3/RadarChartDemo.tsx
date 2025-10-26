/**
 * RadarChart Demo Component
 * 
 * Demonstrates the RadarChart component with sample data
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, RadarDataPoint, RadarSeries } from './RadarChart';
import { Activity } from 'lucide-react';

/**
 * Sample data for single series radar chart
 */
const singleSeriesData: RadarDataPoint[] = [
  { axis: 'Healthcare', value: 75, maxValue: 100, unit: '%' },
  { axis: 'Education', value: 60, maxValue: 100, unit: '%' },
  { axis: 'Infrastructure', value: 45, maxValue: 100, unit: '%' },
  { axis: 'Economy', value: 30, maxValue: 100, unit: '%' },
  { axis: 'Security', value: 20, maxValue: 100, unit: '%' },
  { axis: 'Food Access', value: 40, maxValue: 100, unit: '%' },
];

/**
 * Sample data for comparison mode
 */
const comparisonData: RadarSeries[] = [
  {
    name: 'Pre-Conflict (2022)',
    data: [
      { axis: 'Healthcare', value: 85, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 90, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 75, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 65, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 70, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 80, maxValue: 100, unit: '%' },
    ],
    color: '#10b981', // green
  },
  {
    name: 'Current (2024)',
    data: [
      { axis: 'Healthcare', value: 25, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 30, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 15, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 20, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 10, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 18, maxValue: 100, unit: '%' },
    ],
    color: '#ef4444', // red
  },
];

/**
 * Economic indicators sample data
 */
const economicData: RadarDataPoint[] = [
  { axis: 'GDP Growth', value: -8.5, maxValue: 10, unit: '%' },
  { axis: 'Unemployment', value: 45, maxValue: 100, unit: '%' },
  { axis: 'Inflation', value: 12, maxValue: 20, unit: '%' },
  { axis: 'Trade Balance', value: -2.5, maxValue: 5, unit: 'B$' },
  { axis: 'FDI', value: 0.5, maxValue: 5, unit: 'B$' },
  { axis: 'Poverty Rate', value: 65, maxValue: 100, unit: '%' },
];

export const RadarChartDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Radar Chart Component</h2>
        <p className="text-muted-foreground">
          Multi-axis radar charts for visualizing multi-dimensional data with comparison capabilities
        </p>
      </div>

      {/* Single Series */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Humanitarian Impact Assessment</CardTitle>
          </div>
          <CardDescription>
            Current status across multiple sectors (single series)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart
            data={singleSeriesData}
            height={500}
            animated={true}
            interactive={true}
            showAxisLabels={true}
            showGrid={true}
            levels={5}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </CardContent>
      </Card>

      {/* Comparison Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Pre-Conflict vs Current Comparison</CardTitle>
          </div>
          <CardDescription>
            Comparing humanitarian indicators before and after conflict (comparison mode)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart
            data={comparisonData}
            height={500}
            animated={true}
            interactive={true}
            showAxisLabels={true}
            showGrid={true}
            showLegend={true}
            levels={5}
            fillOpacity={0.25}
            strokeWidth={2}
            comparisonMode={true}
          />
        </CardContent>
      </Card>

      {/* Economic Indicators */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Economic Indicators</CardTitle>
          </div>
          <CardDescription>
            Multi-dimensional economic analysis with mixed positive/negative values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart
            data={economicData}
            height={500}
            animated={true}
            interactive={true}
            showAxisLabels={true}
            showGrid={true}
            levels={5}
            fillOpacity={0.3}
            strokeWidth={2}
            valueFormatter={(value, axis) => {
              if (axis === 'Trade Balance' || axis === 'FDI') {
                return `$${value.toFixed(1)}B`;
              }
              return `${value.toFixed(1)}%`;
            }}
          />
        </CardContent>
      </Card>

      {/* Compact Version */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Compact Radar Chart</CardTitle>
          </div>
          <CardDescription>
            Smaller version with fewer grid levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart
            data={singleSeriesData}
            height={350}
            animated={true}
            interactive={true}
            showAxisLabels={true}
            showGrid={true}
            levels={3}
            fillOpacity={0.35}
            strokeWidth={2}
            radiusRatio={0.7}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RadarChartDemo;
