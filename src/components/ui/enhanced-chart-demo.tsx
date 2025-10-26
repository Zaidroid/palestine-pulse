/**
 * Enhanced Chart System Demo
 * 
 * Demonstrates usage of the enhanced chart system with:
 * - All chart types with animations
 * - Interactive tooltips
 * - Export functionality
 * - Loading and error states
 */

import React, { useState, useRef } from 'react';
import { EnhancedChart } from './enhanced-chart';
import {
  AnimatedLineChart,
  AnimatedBarChart,
  AnimatedAreaChart,
  AnimatedPieChart,
  AnimatedAxes,
} from './animated-chart-variants';
import { EnhancedChartTooltip, SimpleChartTooltip } from './enhanced-chart-tooltip';
import { ChartConfig } from './chart';
import { DataSource } from '@/types/data.types';
import { exportChart, generateChartFilename } from '@/lib/chart-export';
import { XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

// Sample data
const lineChartData = [
  { month: 'Jan', value: 400, previousValue: 350 },
  { month: 'Feb', value: 300, previousValue: 400 },
  { month: 'Mar', value: 600, previousValue: 300 },
  { month: 'Apr', value: 800, previousValue: 600 },
  { month: 'May', value: 500, previousValue: 800 },
  { month: 'Jun', value: 700, previousValue: 500 },
];

const barChartData = [
  { category: 'A', value: 400 },
  { category: 'B', value: 300 },
  { category: 'C', value: 600 },
  { category: 'D', value: 800 },
  { category: 'E', value: 500 },
];

const areaChartData = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 300 },
  { month: 'Mar', value: 600 },
  { month: 'Apr', value: 800 },
  { month: 'May', value: 500 },
  { month: 'Jun', value: 700 },
];

const pieChartData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
];

const chartConfig: ChartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
};

const dataSources: DataSource[] = ['tech4palestine', 'un_ocha'];

export const EnhancedChartDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  const handleExport = async (ref: React.RefObject<HTMLDivElement>, title: string) => {
    if (!ref.current) return;

    try {
      const filename = generateChartFilename(title, 'png');
      await exportChart(ref.current, { filename, scale: 2 });
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Enhanced Chart System</h1>
        <p className="text-muted-foreground">
          Demonstration of animated charts with interactive tooltips and export functionality
        </p>
      </div>

      {/* Line Chart */}
      <div ref={lineChartRef}>
        <EnhancedChart
          type="line"
          data={lineChartData}
          config={chartConfig}
          title="Animated Line Chart"
          description="Line chart with stroke-dasharray draw animation"
          dataSources={dataSources}
          onExport={() => handleExport(lineChartRef, 'line-chart')}
          loading={loading}
          error={error}
        >
          <AnimatedLineChart
            data={lineChartData}
            dataKey="value"
            xAxisKey="month"
            stroke="hsl(var(--chart-1))"
            isInView={true}
          >
            <AnimatedAxes />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<EnhancedChartTooltip showTrend />} />
            <Legend />
          </AnimatedLineChart>
        </EnhancedChart>
      </div>

      {/* Bar Chart */}
      <div ref={barChartRef}>
        <EnhancedChart
          type="bar"
          data={barChartData}
          config={chartConfig}
          title="Animated Bar Chart"
          description="Bar chart with staggered height scale animation"
          dataSources={dataSources}
          onExport={() => handleExport(barChartRef, 'bar-chart')}
        >
          <AnimatedBarChart
            data={barChartData}
            dataKey="value"
            xAxisKey="category"
            fill="hsl(var(--chart-2))"
            staggerDelay={50}
            isInView={true}
          >
            <AnimatedAxes />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<SimpleChartTooltip />} />
            <Legend />
          </AnimatedBarChart>
        </EnhancedChart>
      </div>

      {/* Area Chart */}
      <EnhancedChart
        type="area"
        data={areaChartData}
        config={chartConfig}
        title="Animated Area Chart"
        description="Area chart with gradient fill and line draw animation"
        dataSources={dataSources}
      >
        <AnimatedAreaChart
          data={areaChartData}
          dataKey="value"
          xAxisKey="month"
          stroke="hsl(var(--chart-3))"
          isInView={true}
        >
          <AnimatedAxes />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<EnhancedChartTooltip />} />
          <Legend />
        </AnimatedAreaChart>
      </EnhancedChart>

      {/* Pie Chart */}
      <EnhancedChart
        type="pie"
        data={pieChartData}
        config={chartConfig}
        title="Animated Pie Chart"
        description="Pie chart with rotate and scale animation"
        dataSources={dataSources}
        height={400}
      >
        <AnimatedPieChart
          data={pieChartData}
          dataKey="value"
          nameKey="name"
          isInView={true}
        >
          <Tooltip content={<SimpleChartTooltip />} />
          <Legend />
        </AnimatedPieChart>
      </EnhancedChart>

      {/* Loading State Demo */}
      <Card>
        <CardHeader>
          <CardTitle>State Demos</CardTitle>
          <CardDescription>Test loading and error states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setLoading(!loading)}>
              Toggle Loading
            </Button>
            <Button
              variant="destructive"
              onClick={() => setError(error ? null : new Error('Sample error message'))}
            >
              Toggle Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State Example */}
      {loading && (
        <EnhancedChart
          type="line"
          data={lineChartData}
          config={chartConfig}
          title="Loading Chart"
          description="This chart is in loading state"
          loading={true}
        >
          <AnimatedLineChart
            data={lineChartData}
            dataKey="value"
            xAxisKey="month"
          />
        </EnhancedChart>
      )}

      {/* Error State Example */}
      {error && (
        <EnhancedChart
          type="line"
          data={lineChartData}
          config={chartConfig}
          title="Error Chart"
          description="This chart has an error"
          error={error}
        >
          <AnimatedLineChart
            data={lineChartData}
            dataKey="value"
            xAxisKey="month"
          />
        </EnhancedChart>
      )}
    </div>
  );
};

EnhancedChartDemo.displayName = 'EnhancedChartDemo';
