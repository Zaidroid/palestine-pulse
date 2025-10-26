/**
 * Advanced Donut Chart Demo Component
 * 
 * Demonstrates the AdvancedDonutChart with sample data and interactive features.
 */

import { useState } from 'react';
import { AdvancedDonutChart } from './AdvancedDonutChart';
import { CategoryData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Sample data for demonstration
 */
const sampleData: CategoryData[] = [
  { category: 'Children', value: 18000, color: '#ef4444' },
  { category: 'Women', value: 13500, color: '#f97316' },
  { category: 'Men', value: 11250, color: '#f59e0b' },
  { category: 'Elderly', value: 2250, color: '#eab308' },
];

const healthcareFacilityData: CategoryData[] = [
  { category: 'Operational', value: 12, color: '#10b981' },
  { category: 'Partially Operational', value: 18, color: '#f59e0b' },
  { category: 'Non-Operational', value: 34, color: '#ef4444' },
];

const educationDamageData: CategoryData[] = [
  { category: 'Destroyed', value: 156, color: '#dc2626' },
  { category: 'Damaged', value: 234, color: '#f97316' },
  { category: 'Operational', value: 89, color: '#10b981' },
];

/**
 * AdvancedDonutChartDemo Component
 */
export const AdvancedDonutChartDemo: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDataset, setSelectedDataset] = useState<'casualties' | 'healthcare' | 'education'>('casualties');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get current dataset
  const getCurrentData = () => {
    switch (selectedDataset) {
      case 'casualties':
        return sampleData;
      case 'healthcare':
        return healthcareFacilityData;
      case 'education':
        return educationDamageData;
      default:
        return sampleData;
    }
  };

  const getCurrentTitle = () => {
    switch (selectedDataset) {
      case 'casualties':
        return 'Casualties by Category';
      case 'healthcare':
        return 'Healthcare Facility Status';
      case 'education':
        return 'School Damage Assessment';
      default:
        return 'Data Visualization';
    }
  };

  const getCurrentCenterLabel = () => {
    switch (selectedDataset) {
      case 'casualties':
        return 'Total Deaths';
      case 'healthcare':
        return 'Total Facilities';
      case 'education':
        return 'Total Schools';
      default:
        return 'Total';
    }
  };

  const handleArcClick = (data: CategoryData) => {
    setSelectedCategory(data.category);
    console.log('Arc clicked:', data);
  };

  const handleArcHover = (data: CategoryData | null) => {
    if (data) {
      console.log('Arc hovered:', data.category);
    }
  };

  const handleExport = () => {
    console.log('Export chart as PNG');
    // Implementation would go here
  };

  const handleShare = () => {
    console.log('Share chart');
    // Implementation would go here
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
                Interactive donut chart with animated arcs and center statistics
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
              onClick={() => setSelectedDataset('casualties')}
            >
              Casualties
            </Badge>
            <Badge
              variant={selectedDataset === 'healthcare' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDataset('healthcare')}
            >
              Healthcare
            </Badge>
            <Badge
              variant={selectedDataset === 'education' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDataset('education')}
            >
              Education
            </Badge>
          </div>
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
            onArcClick={handleArcClick}
            onArcHover={handleArcHover}
          />
          
          {selectedCategory && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-semibold text-foreground">{selectedCategory}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Animated arc transitions with staggered delays</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Hover expansion with elastic easing effect</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Center statistics showing total value and label</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Interactive legend with hover synchronization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Percentage labels on arcs (hidden for small segments)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Smart tooltips with detailed information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Click handlers for drill-down functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>RTL layout support for Arabic language</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Theme-aware colors (light/dark mode)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDonutChartDemo;
