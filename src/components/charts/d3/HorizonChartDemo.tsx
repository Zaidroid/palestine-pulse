/**
 * Horizon Chart Demo Component
 * 
 * Demonstrates the HorizonChart component with sample economic data
 */

import { useState } from 'react';
import { HorizonChart, HorizonMetric } from './HorizonChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

// Generate sample economic data
const generateSampleData = (name: string, baseValue: number, volatility: number, trend: number): HorizonMetric => {
  const data = [];
  const startDate = new Date('2023-01-01');
  let value = baseValue;

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Add trend
    value += trend;
    
    // Add random volatility
    value += (Math.random() - 0.5) * volatility;
    
    // Add seasonal pattern
    value += Math.sin(i / 30) * volatility * 0.5;
    
    data.push({
      date: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }

  return {
    name,
    data,
    unit: name.includes('GDP') || name.includes('Income') ? '$' : '%',
  };
};

const sampleMetrics: HorizonMetric[] = [
  generateSampleData('GDP Growth', 2.5, 1.5, 0.01),
  generateSampleData('Unemployment Rate', 5.0, 0.8, -0.005),
  generateSampleData('Inflation Rate', 3.0, 1.2, 0.008),
  generateSampleData('Trade Balance', -2.0, 2.5, 0.015),
  generateSampleData('Consumer Confidence', 0, 5, 0.02),
  generateSampleData('Industrial Production', 1.5, 2.0, 0.012),
];

export const HorizonChartDemo: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [bands, setBands] = useState(4);

  const handleMetricClick = (metric: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const displayedMetrics = selectedMetrics.length > 0 
    ? sampleMetrics.filter(m => selectedMetrics.includes(m.name))
    : sampleMetrics;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Economic Indicators - Horizon Chart</CardTitle>
                <CardDescription>
                  Compact multi-metric visualization with layered bands
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Horizon Chart</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Metrics:</label>
              <div className="flex flex-wrap gap-2">
                {sampleMetrics.map(metric => (
                  <Badge
                    key={metric.name}
                    variant={selectedMetrics.includes(metric.name) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleMetricClick(metric.name)}
                  >
                    {metric.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Band Count: {bands}</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(count => (
                  <button
                    key={count}
                    onClick={() => setBands(count)}
                    className={`px-3 py-1 rounded text-sm ${
                      bands === count
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="min-h-[300px]">
            <HorizonChart
              metrics={displayedMetrics}
              bands={bands}
              animated={true}
              interactive={true}
              showLabels={true}
              showAxes={true}
              bandHeight={50}
              onDataPointClick={(metric, data) => {
                console.log('Clicked:', metric, data);
              }}
              onDataPointHover={(metric, data) => {
                if (data) {
                  console.log('Hovered:', metric, data);
                }
              }}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Positive Values</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Negative Values</span>
            </div>
            <div className="text-xs">
              Darker bands = Higher magnitude
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded">
            <p><strong>Horizon Charts</strong> display multiple time-series metrics in a compact format using layered color bands.</p>
            <p>• Positive values shown in green, negative in red</p>
            <p>• Band intensity increases with value magnitude</p>
            <p>• Hover over any metric to see detailed values</p>
            <p>• Click metric badges to filter the display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorizonChartDemo;
