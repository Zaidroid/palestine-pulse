/**
 * Sankey Flow Chart Demo
 * 
 * Demonstrates the SankeyFlowChart component with sample displacement flow data.
 */

import { SankeyFlowChartWithFilters } from './SankeyFlowChartWithFilters';
import { FlowData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

/**
 * Sample displacement flow data for Gaza
 */
const sampleDisplacementData: FlowData[] = [
  // North Gaza to other regions
  { source: 'North Gaza', target: 'Gaza City', value: 45000 },
  { source: 'North Gaza', target: 'Deir al-Balah', value: 32000 },
  { source: 'North Gaza', target: 'Khan Younis', value: 28000 },
  { source: 'North Gaza', target: 'Rafah', value: 15000 },
  
  // Gaza City to other regions
  { source: 'Gaza City', target: 'Deir al-Balah', value: 38000 },
  { source: 'Gaza City', target: 'Khan Younis', value: 42000 },
  { source: 'Gaza City', target: 'Rafah', value: 25000 },
  
  // Deir al-Balah to southern regions
  { source: 'Deir al-Balah', target: 'Khan Younis', value: 18000 },
  { source: 'Deir al-Balah', target: 'Rafah', value: 22000 },
  
  // Khan Younis to Rafah
  { source: 'Khan Younis', target: 'Rafah', value: 35000 },
  
  // Smaller flows
  { source: 'North Gaza', target: 'Shelters (North)', value: 8000 },
  { source: 'Gaza City', target: 'Shelters (Central)', value: 12000 },
  { source: 'Deir al-Balah', target: 'Shelters (Central)', value: 6000 },
  { source: 'Khan Younis', target: 'Shelters (South)', value: 15000 },
  { source: 'Rafah', target: 'Shelters (South)', value: 20000 },
  
  // Cross-border (smaller flows)
  { source: 'Rafah', target: 'Egypt Border', value: 3500 },
];

/**
 * Sample aid distribution flow data
 */
const sampleAidDistributionData: FlowData[] = [
  // International aid sources
  { source: 'UN Agencies', target: 'Rafah Crossing', value: 120000 },
  { source: 'International NGOs', target: 'Rafah Crossing', value: 85000 },
  { source: 'Arab Countries', target: 'Rafah Crossing', value: 65000 },
  { source: 'Western Countries', target: 'Rafah Crossing', value: 95000 },
  
  // Distribution from crossing to regions
  { source: 'Rafah Crossing', target: 'Rafah Distribution', value: 95000 },
  { source: 'Rafah Crossing', target: 'Khan Younis Distribution', value: 110000 },
  { source: 'Rafah Crossing', target: 'Central Gaza Distribution', value: 85000 },
  { source: 'Rafah Crossing', target: 'Gaza City Distribution', value: 55000 },
  { source: 'Rafah Crossing', target: 'North Gaza Distribution', value: 20000 },
  
  // Final distribution to beneficiaries
  { source: 'Rafah Distribution', target: 'Food Aid', value: 45000 },
  { source: 'Rafah Distribution', target: 'Medical Aid', value: 30000 },
  { source: 'Rafah Distribution', target: 'Shelter Aid', value: 20000 },
  
  { source: 'Khan Younis Distribution', target: 'Food Aid', value: 55000 },
  { source: 'Khan Younis Distribution', target: 'Medical Aid', value: 35000 },
  { source: 'Khan Younis Distribution', target: 'Shelter Aid', value: 20000 },
  
  { source: 'Central Gaza Distribution', target: 'Food Aid', value: 40000 },
  { source: 'Central Gaza Distribution', target: 'Medical Aid', value: 28000 },
  { source: 'Central Gaza Distribution', target: 'Shelter Aid', value: 17000 },
  
  { source: 'Gaza City Distribution', target: 'Food Aid', value: 25000 },
  { source: 'Gaza City Distribution', target: 'Medical Aid', value: 18000 },
  { source: 'Gaza City Distribution', target: 'Shelter Aid', value: 12000 },
  
  { source: 'North Gaza Distribution', target: 'Food Aid', value: 10000 },
  { source: 'North Gaza Distribution', target: 'Medical Aid', value: 6000 },
  { source: 'North Gaza Distribution', target: 'Shelter Aid', value: 4000 },
];

/**
 * SankeyFlowChartDemo Component
 */
export const SankeyFlowChartDemo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {t('charts.sankeyFlowChart', 'Sankey Flow Chart')}
        </h1>
        <p className="text-muted-foreground">
          {t('charts.sankeyDescription', 'Visualize flows between nodes with interactive Sankey diagrams')}
        </p>
      </div>

      {/* Displacement Flow Example */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('dashboards.displacementFlow', 'Internal Displacement Flow')}
          </CardTitle>
          <CardDescription>
            {t('dashboards.displacementFlowDesc', 'Movement of displaced persons between Gaza governorates')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SankeyFlowChartWithFilters
            data={sampleDisplacementData}
            height={600}
            animated={true}
            interactive={true}
            enableDragging={true}
            showFilters={true}
            enableNodeSelection={true}
            initialThreshold={0}
            nodePadding={25}
            nodeWidth={20}
            nodeAlign="justify"
            onNodeClick={(node) => {
              console.log('Node clicked:', node);
            }}
            onLinkClick={(link) => {
              console.log('Link clicked:', link);
            }}
          />
        </CardContent>
      </Card>

      {/* Aid Distribution Example */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('dashboards.aidDistribution', 'Humanitarian Aid Distribution')}
          </CardTitle>
          <CardDescription>
            {t('dashboards.aidDistributionDesc', 'Flow of humanitarian aid from sources to beneficiaries')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SankeyFlowChartWithFilters
            data={sampleAidDistributionData}
            height={700}
            animated={true}
            interactive={true}
            enableDragging={true}
            showFilters={true}
            enableNodeSelection={true}
            initialThreshold={5}
            nodePadding={20}
            nodeWidth={18}
            nodeAlign="left"
            onNodeClick={(node) => {
              console.log('Node clicked:', node);
            }}
            onLinkClick={(link) => {
              console.log('Link clicked:', link);
            }}
          />
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('charts.features', 'Features')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature1', 'Interactive node dragging to reposition elements')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature2', 'Minimum flow threshold filter to hide small flows')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature3', 'Node selection to highlight connected paths')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature4', 'Smooth animations on data updates and interactions')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature5', 'Tooltips with detailed flow information')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature6', 'RTL layout support for Arabic language')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature7', 'Theme-aware colors (light/dark mode)')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{t('charts.sankeyFeature8', 'Configurable node alignment (left, right, center, justify)')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

// Default export for lazy loading
export default SankeyFlowChartDemo;
