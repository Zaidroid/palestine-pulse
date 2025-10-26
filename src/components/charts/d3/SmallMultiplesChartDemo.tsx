/**
 * Small Multiples Chart Demo
 * 
 * Demonstrates the SmallMultiplesChart component with sample data
 * showing regional casualty comparisons across Gaza governorates.
 */

import { SmallMultiplesChartWithFilters } from './SmallMultiplesChartWithFilters';
import { RegionalData } from './SmallMultiplesChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';
import * as d3 from 'd3';

/**
 * Generate sample regional data for demonstration
 */
const generateSampleData = (): RegionalData[] => {
  const regions = ['North Gaza', 'Gaza City', 'Central Gaza', 'Khan Younis', 'Rafah'];
  const startDate = new Date(2023, 9, 7); // Oct 7, 2023
  const days = 60;

  return regions.map((region, regionIndex) => {
    const baseValue = 50 + regionIndex * 20;
    const trendFactor = 2 + regionIndex;
    
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const trend = i * trendFactor;
      const noise = Math.random() * 30;
      const value = baseValue + trend + noise;
      
      return {
        date: date.toISOString(),
        value: Math.round(value),
        category: 'casualties',
      };
    });

    const total = d3.sum(data, d => d.value);

    return {
      region,
      data,
      total,
      metadata: {
        population: 300000 + regionIndex * 100000,
        area: 50 + regionIndex * 20,
      },
    };
  });
};

/**
 * SmallMultiplesChartDemo Component
 */
export const SmallMultiplesChartDemo: React.FC = () => {
  const { t } = useTranslation();
  const sampleData = generateSampleData();

  const handleRegionClick = (region: RegionalData) => {
    console.log('Region clicked:', region);
  };

  const valueFormatter = (value: number) => {
    return value >= 1000 ? d3.format('.2s')(value) : d3.format(',')(value);
  };

  const dateFormatter = (date: Date) => {
    return d3.timeFormat('%b %d, %Y')(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>
            {t('charts.smallMultiplesDemo', 'Small Multiples Chart - Regional Comparison')}
          </CardTitle>
        </div>
        <CardDescription>
          {t('charts.smallMultiplesDescription', 
            'Compare patterns across multiple regions with synchronized or independent scales. ' +
            'Hover over charts to see details, click to drill down into specific regions.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SmallMultiplesChartWithFilters
          regions={sampleData}
          height={600}
          columns={2}
          animated={true}
          interactive={true}
          onRegionClick={handleRegionClick}
          valueFormatter={valueFormatter}
          dateFormatter={dateFormatter}
          showGrid={true}
          showArea={true}
          showTotals={true}
          initialSynchronizeScales={true}
        />

        {/* Usage Notes */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2">
            {t('charts.features', 'Features')}:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>{t('charts.feature1', 'Synchronized scales for direct comparison across regions')}</li>
            <li>{t('charts.feature2', 'Independent scales to highlight individual patterns')}</li>
            <li>{t('charts.feature3', 'Region filtering to focus on specific areas')}</li>
            <li>{t('charts.feature4', 'Interactive tooltips with detailed information')}</li>
            <li>{t('charts.feature5', 'Click on any chart to drill down into regional details')}</li>
            <li>{t('charts.feature6', 'Smooth animations and transitions')}</li>
            <li>{t('charts.feature7', 'RTL layout support for Arabic language')}</li>
          </ul>
        </div>

        {/* Data Source Attribution */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            {t('charts.demoNote', 'Note: This is a demonstration with sample data. ' +
              'In production, this would display real casualty data from Tech4Palestine and HDX sources.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Default export
export default SmallMultiplesChartDemo;
