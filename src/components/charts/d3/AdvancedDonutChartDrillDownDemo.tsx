/**
 * Advanced Donut Chart Drill-Down Demo Component
 * 
 * Demonstrates the AdvancedDonutChart with hierarchical drill-down functionality.
 */

import { useState } from 'react';
import { AdvancedDonutChart, HierarchicalCategoryData } from './AdvancedDonutChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, PieChart, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Hierarchical sample data for demonstration
 */
const hierarchicalCasualtyData: HierarchicalCategoryData[] = [
  {
    category: 'Gaza Strip',
    value: 45000,
    color: '#ef4444',
    children: [
      {
        category: 'Children',
        value: 18000,
        color: '#dc2626',
        children: [
          { category: '0-5 years', value: 7200, color: '#991b1b' },
          { category: '6-12 years', value: 6300, color: '#b91c1c' },
          { category: '13-17 years', value: 4500, color: '#dc2626' },
        ],
      },
      {
        category: 'Women',
        value: 13500,
        color: '#f97316',
        children: [
          { category: '18-30 years', value: 5400, color: '#c2410c' },
          { category: '31-50 years', value: 5400, color: '#ea580c' },
          { category: '51+ years', value: 2700, color: '#f97316' },
        ],
      },
      {
        category: 'Men',
        value: 11250,
        color: '#f59e0b',
        children: [
          { category: '18-30 years', value: 4500, color: '#b45309' },
          { category: '31-50 years', value: 4500, color: '#d97706' },
          { category: '51+ years', value: 2250, color: '#f59e0b' },
        ],
      },
      {
        category: 'Elderly',
        value: 2250,
        color: '#eab308',
      },
    ],
  },
  {
    category: 'West Bank',
    value: 580,
    color: '#3b82f6',
    children: [
      {
        category: 'Children',
        value: 145,
        color: '#1d4ed8',
      },
      {
        category: 'Adults',
        value: 435,
        color: '#3b82f6',
        children: [
          { category: 'Men', value: 348, color: '#2563eb' },
          { category: 'Women', value: 87, color: '#60a5fa' },
        ],
      },
    ],
  },
];

const healthcareFacilityData: HierarchicalCategoryData[] = [
  {
    category: 'Hospitals',
    value: 36,
    color: '#ef4444',
    children: [
      { category: 'Destroyed', value: 12, color: '#dc2626' },
      { category: 'Partially Operational', value: 18, color: '#f97316' },
      { category: 'Operational', value: 6, color: '#10b981' },
    ],
  },
  {
    category: 'Clinics',
    value: 28,
    color: '#f97316',
    children: [
      { category: 'Destroyed', value: 10, color: '#dc2626' },
      { category: 'Damaged', value: 12, color: '#f97316' },
      { category: 'Operational', value: 6, color: '#10b981' },
    ],
  },
];

/**
 * AdvancedDonutChartDrillDownDemo Component
 */
export const AdvancedDonutChartDrillDownDemo: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDataset, setSelectedDataset] = useState<'casualties' | 'healthcare'>('casualties');
  const [drillDownPath, setDrillDownPath] = useState<string[]>([]);

  // Get current dataset
  const getCurrentData = () => {
    switch (selectedDataset) {
      case 'casualties':
        return hierarchicalCasualtyData;
      case 'healthcare':
        return healthcareFacilityData;
      default:
        return hierarchicalCasualtyData;
    }
  };

  const getCurrentTitle = () => {
    switch (selectedDataset) {
      case 'casualties':
        return 'Casualties by Region (Hierarchical)';
      case 'healthcare':
        return 'Healthcare Facilities by Type';
      default:
        return 'Data Visualization';
    }
  };

  const getCurrentCenterLabel = () => {
    if (drillDownPath.length === 0) {
      return selectedDataset === 'casualties' ? 'Total Deaths' : 'Total Facilities';
    }
    return drillDownPath[drillDownPath.length - 1];
  };

  const handleDrillDownChange = (path: string[]) => {
    setDrillDownPath(path);
    console.log('Drill-down path changed:', path);
  };

  const handleExport = () => {
    console.log('Export chart as PNG');
  };

  const handleShare = () => {
    console.log('Share chart');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <CardTitle>{getCurrentTitle()}</CardTitle>
              </div>
              <CardDescription>
                Click on any segment to drill down into subcategories
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Dataset selector */}
          <div className="flex items-center gap-2 pt-4">
            <Badge
              variant={selectedDataset === 'casualties' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                setSelectedDataset('casualties');
                setDrillDownPath([]);
              }}
            >
              Casualties
            </Badge>
            <Badge
              variant={selectedDataset === 'healthcare' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                setSelectedDataset('healthcare');
                setDrillDownPath([]);
              }}
            >
              Healthcare
            </Badge>
          </div>

          {/* Current path indicator */}
          {drillDownPath.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Current view:</span>
                <div className="flex items-center gap-1">
                  {drillDownPath.map((segment, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {index > 0 && <ChevronRight className="h-3 w-3" />}
                      <Badge variant="secondary">{segment}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <AdvancedDonutChart
            data={getCurrentData()}
            height={450}
            animated={true}
            interactive={true}
            showPercentageLabels={true}
            showLegend={true}
            centerLabel={getCurrentCenterLabel()}
            enableDrillDown={true}
            onDrillDownChange={handleDrillDownChange}
          />
        </CardContent>
      </Card>

      {/* Feature showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Drill-Down Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Click on segments with children to drill down into subcategories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Breadcrumb navigation shows current path and allows quick navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Smooth animated transitions between hierarchy levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Tooltips indicate when segments can be expanded</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Center statistics update to reflect current level</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Legend updates dynamically based on current view</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Click "Home" in breadcrumb to return to root level</span>
            </li>
          </ul>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Try it out:</h4>
            <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
              <li>Click on "Gaza Strip" to see casualty breakdown by demographic</li>
              <li>Click on "Children" to see age group distribution</li>
              <li>Use breadcrumbs to navigate back to any level</li>
              <li>Switch datasets to explore healthcare facility hierarchy</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDonutChartDrillDownDemo;
