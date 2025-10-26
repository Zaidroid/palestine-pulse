/**
 * RadarChart with Filters Demo Component
 * 
 * Demonstrates the RadarChart component with comparison mode and interactive filters
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, RadarSeries } from './RadarChart';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Sample data for multiple time periods
 */
const timeSeriesData: Record<string, RadarSeries> = {
  '2020': {
    name: '2020',
    data: [
      { axis: 'Healthcare', value: 90, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 88, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 82, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 70, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 75, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 85, maxValue: 100, unit: '%' },
    ],
    color: '#3b82f6', // blue
  },
  '2021': {
    name: '2021',
    data: [
      { axis: 'Healthcare', value: 85, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 82, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 78, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 65, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 70, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 80, maxValue: 100, unit: '%' },
    ],
    color: '#8b5cf6', // purple
  },
  '2022': {
    name: '2022',
    data: [
      { axis: 'Healthcare', value: 80, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 78, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 72, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 60, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 65, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 75, maxValue: 100, unit: '%' },
    ],
    color: '#10b981', // green
  },
  '2023': {
    name: '2023',
    data: [
      { axis: 'Healthcare', value: 50, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 45, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 35, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 30, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 25, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 40, maxValue: 100, unit: '%' },
    ],
    color: '#f59e0b', // amber
  },
  '2024': {
    name: '2024',
    data: [
      { axis: 'Healthcare', value: 20, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 25, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 15, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 18, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 10, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 15, maxValue: 100, unit: '%' },
    ],
    color: '#ef4444', // red
  },
};

/**
 * Regional comparison data
 */
const regionalData: Record<string, RadarSeries> = {
  'Gaza': {
    name: 'Gaza Strip',
    data: [
      { axis: 'Healthcare', value: 15, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 20, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 10, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 12, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 5, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 8, maxValue: 100, unit: '%' },
    ],
    color: '#ef4444', // red
  },
  'West Bank': {
    name: 'West Bank',
    data: [
      { axis: 'Healthcare', value: 55, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 60, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 50, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 45, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 40, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 52, maxValue: 100, unit: '%' },
    ],
    color: '#f59e0b', // amber
  },
  'East Jerusalem': {
    name: 'East Jerusalem',
    data: [
      { axis: 'Healthcare', value: 65, maxValue: 100, unit: '%' },
      { axis: 'Education', value: 70, maxValue: 100, unit: '%' },
      { axis: 'Infrastructure', value: 60, maxValue: 100, unit: '%' },
      { axis: 'Economy', value: 55, maxValue: 100, unit: '%' },
      { axis: 'Security', value: 50, maxValue: 100, unit: '%' },
      { axis: 'Food Access', value: 62, maxValue: 100, unit: '%' },
    ],
    color: '#3b82f6', // blue
  },
};

export const RadarChartWithFilters: React.FC = () => {
  const [selectedYears, setSelectedYears] = useState<string[]>(['2022', '2024']);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Gaza', 'West Bank']);
  const [comparisonType, setComparisonType] = useState<'time' | 'region'>('time');

  const availableYears = Object.keys(timeSeriesData);
  const availableRegions = Object.keys(regionalData);

  const toggleYear = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const getComparisonData = (): RadarSeries[] => {
    if (comparisonType === 'time') {
      return selectedYears.map(year => timeSeriesData[year]);
    } else {
      return selectedRegions.map(region => regionalData[region]);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Radar Chart with Comparison Filters</h2>
        <p className="text-muted-foreground">
          Interactive comparison mode with time series and regional filters
        </p>
      </div>

      {/* Comparison Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Comparison Type</CardTitle>
          <CardDescription>
            Choose what to compare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={comparisonType === 'time' ? 'default' : 'outline'}
              onClick={() => setComparisonType('time')}
            >
              Time Series
            </Button>
            <Button
              variant={comparisonType === 'region' ? 'default' : 'outline'}
              onClick={() => setComparisonType('region')}
            >
              Regional
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Comparison */}
      {comparisonType === 'time' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Humanitarian Impact Over Time</CardTitle>
            </div>
            <CardDescription>
              Select years to compare (2020-2024)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Year Filters */}
            <div>
              <div className="text-sm font-medium mb-3">Select Years to Compare:</div>
              <div className="flex flex-wrap gap-2">
                {availableYears.map(year => (
                  <Button
                    key={year}
                    variant={selectedYears.includes(year) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleYear(year)}
                    style={{
                      backgroundColor: selectedYears.includes(year) 
                        ? timeSeriesData[year].color 
                        : undefined,
                      borderColor: timeSeriesData[year].color,
                    }}
                  >
                    {year}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {selectedYears.length === 0 && 'Select at least one year'}
                {selectedYears.length === 1 && 'Select another year to compare'}
                {selectedYears.length > 1 && `Comparing ${selectedYears.length} years`}
              </div>
            </div>

            {/* Chart */}
            {selectedYears.length > 0 && (
              <RadarChart
                data={getComparisonData()}
                height={550}
                animated={true}
                interactive={true}
                showAxisLabels={true}
                showGrid={true}
                showLegend={true}
                levels={5}
                fillOpacity={0.2}
                strokeWidth={2}
                comparisonMode={true}
              />
            )}

            {selectedYears.length === 0 && (
              <div className="h-[550px] flex items-center justify-center text-muted-foreground">
                <p>Select at least one year to display the chart</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Regional Comparison */}
      {comparisonType === 'region' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Regional Humanitarian Status</CardTitle>
            </div>
            <CardDescription>
              Compare current status across different regions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Region Filters */}
            <div>
              <div className="text-sm font-medium mb-3">Select Regions to Compare:</div>
              <div className="flex flex-wrap gap-2">
                {availableRegions.map(region => (
                  <Button
                    key={region}
                    variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleRegion(region)}
                    style={{
                      backgroundColor: selectedRegions.includes(region) 
                        ? regionalData[region].color 
                        : undefined,
                      borderColor: regionalData[region].color,
                    }}
                  >
                    {region}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {selectedRegions.length === 0 && 'Select at least one region'}
                {selectedRegions.length === 1 && 'Select another region to compare'}
                {selectedRegions.length > 1 && `Comparing ${selectedRegions.length} regions`}
              </div>
            </div>

            {/* Chart */}
            {selectedRegions.length > 0 && (
              <RadarChart
                data={getComparisonData()}
                height={550}
                animated={true}
                interactive={true}
                showAxisLabels={true}
                showGrid={true}
                showLegend={true}
                levels={5}
                fillOpacity={0.2}
                strokeWidth={2}
                comparisonMode={true}
              />
            )}

            {selectedRegions.length === 0 && (
              <div className="h-[550px] flex items-center justify-center text-muted-foreground">
                <p>Select at least one region to display the chart</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Radar Charts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Radar charts</strong> (also known as spider charts or star plots) are ideal for 
            visualizing multi-dimensional data and comparing multiple entities across several metrics.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Multi-axis visualization for comparing multiple metrics simultaneously</li>
            <li>Comparison mode for overlaying multiple data series</li>
            <li>Interactive tooltips showing detailed metric values</li>
            <li>Animated transitions when switching between comparisons</li>
            <li>RTL (Right-to-Left) layout support for Arabic language</li>
            <li>Theme-aware colors that adapt to light/dark mode</li>
          </ul>
          <p>
            <strong>Use cases:</strong> Multi-dimensional impact assessment, sector analysis, 
            pre/post comparison, regional comparisons, performance metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadarChartWithFilters;
