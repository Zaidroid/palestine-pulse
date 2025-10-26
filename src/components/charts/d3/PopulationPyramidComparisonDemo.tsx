/**
 * Population Pyramid Comparison Demo
 * 
 * Demonstrates the PopulationPyramidChartWithFilters component with
 * pre/post conflict comparison data and demographic filtering.
 */

import { PopulationPyramidChartWithFilters, DemographicFilters } from './PopulationPyramidChartWithFilters';
import { PyramidData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

/**
 * Pre-conflict Gaza population data (October 2023)
 */
const preConflictGazaData: PyramidData[] = [
  { ageGroup: '0-4', male: 125000, female: 118000 },
  { ageGroup: '5-9', male: 135000, female: 128000 },
  { ageGroup: '10-14', male: 142000, female: 135000 },
  { ageGroup: '15-19', male: 138000, female: 132000 },
  { ageGroup: '20-24', male: 128000, female: 125000 },
  { ageGroup: '25-29', male: 115000, female: 118000 },
  { ageGroup: '30-34', male: 105000, female: 108000 },
  { ageGroup: '35-39', male: 95000, female: 98000 },
  { ageGroup: '40-44', male: 82000, female: 85000 },
  { ageGroup: '45-49', male: 68000, female: 72000 },
  { ageGroup: '50-54', male: 55000, female: 58000 },
  { ageGroup: '55-59', male: 42000, female: 45000 },
  { ageGroup: '60-64', male: 32000, female: 35000 },
  { ageGroup: '65-69', male: 22000, female: 25000 },
  { ageGroup: '70-74', male: 15000, female: 18000 },
  { ageGroup: '75-79', male: 9000, female: 12000 },
  { ageGroup: '80+', male: 6000, female: 9000 },
];

/**
 * Current Gaza population data (with conflict impact)
 */
const currentGazaData: PyramidData[] = [
  { ageGroup: '0-4', male: 118000, female: 112000 },
  { ageGroup: '5-9', male: 128000, female: 122000 },
  { ageGroup: '10-14', male: 134000, female: 128000 },
  { ageGroup: '15-19', male: 130000, female: 125000 },
  { ageGroup: '20-24', male: 120000, female: 118000 },
  { ageGroup: '25-29', male: 108000, female: 112000 },
  { ageGroup: '30-34', male: 98000, female: 102000 },
  { ageGroup: '35-39', male: 88000, female: 92000 },
  { ageGroup: '40-44', male: 76000, female: 80000 },
  { ageGroup: '45-49', male: 63000, female: 68000 },
  { ageGroup: '50-54', male: 51000, female: 55000 },
  { ageGroup: '55-59', male: 39000, female: 42000 },
  { ageGroup: '60-64', male: 29000, female: 33000 },
  { ageGroup: '65-69', male: 20000, female: 23000 },
  { ageGroup: '70-74', male: 13000, female: 16000 },
  { ageGroup: '75-79', male: 8000, female: 11000 },
  { ageGroup: '80+', male: 5000, female: 8000 },
];

/**
 * Pre-conflict West Bank population data
 */
const preConflictWestBankData: PyramidData[] = [
  { ageGroup: '0-4', male: 165000, female: 158000 },
  { ageGroup: '5-9', male: 175000, female: 168000 },
  { ageGroup: '10-14', male: 182000, female: 175000 },
  { ageGroup: '15-19', male: 178000, female: 172000 },
  { ageGroup: '20-24', male: 168000, female: 165000 },
  { ageGroup: '25-29', male: 155000, female: 158000 },
  { ageGroup: '30-34', male: 145000, female: 148000 },
  { ageGroup: '35-39', male: 135000, female: 138000 },
  { ageGroup: '40-44', male: 122000, female: 125000 },
  { ageGroup: '45-49', male: 108000, female: 112000 },
  { ageGroup: '50-54', male: 95000, female: 98000 },
  { ageGroup: '55-59', male: 82000, female: 85000 },
  { ageGroup: '60-64', male: 68000, female: 72000 },
  { ageGroup: '65-69', male: 52000, female: 58000 },
  { ageGroup: '70-74', male: 38000, female: 45000 },
  { ageGroup: '75-79', male: 25000, female: 32000 },
  { ageGroup: '80+', male: 18000, female: 28000 },
];

/**
 * Current West Bank population data
 */
const currentWestBankData: PyramidData[] = [
  { ageGroup: '0-4', male: 162000, female: 155000 },
  { ageGroup: '5-9', male: 172000, female: 165000 },
  { ageGroup: '10-14', male: 179000, female: 172000 },
  { ageGroup: '15-19', male: 175000, female: 169000 },
  { ageGroup: '20-24', male: 165000, female: 162000 },
  { ageGroup: '25-29', male: 152000, female: 155000 },
  { ageGroup: '30-34', male: 142000, female: 145000 },
  { ageGroup: '35-39', male: 132000, female: 135000 },
  { ageGroup: '40-44', male: 119000, female: 122000 },
  { ageGroup: '45-49', male: 105000, female: 109000 },
  { ageGroup: '50-54', male: 92000, female: 95000 },
  { ageGroup: '55-59', male: 79000, female: 82000 },
  { ageGroup: '60-64', male: 65000, female: 69000 },
  { ageGroup: '65-69', male: 49000, female: 55000 },
  { ageGroup: '70-74', male: 35000, female: 42000 },
  { ageGroup: '75-79', male: 22000, female: 29000 },
  { ageGroup: '80+', male: 15000, female: 25000 },
];

/**
 * PopulationPyramidComparisonDemo Component
 */
export const PopulationPyramidComparisonDemo: React.FC = () => {
  const handleFiltersChange = (filters: DemographicFilters) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Population Pyramid with Demographic Filtering</h2>
        <p className="text-muted-foreground">
          Interactive demographic visualization with age group selection and pre/post conflict comparison
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Use the filters to focus on specific age groups or compare pre-conflict and current population distributions.
          The chart animates smoothly when filters change.
        </AlertDescription>
      </Alert>

      {/* Gaza Strip with Comparison */}
      <PopulationPyramidChartWithFilters
        data={currentGazaData}
        preConflictData={preConflictGazaData}
        title="Gaza Strip Population Distribution"
        description="Current population with pre-conflict comparison"
        dataSource="Estimated Data"
        defaultComparisonMode={false}
        defaultDisplayMode="absolute"
        onFiltersChange={handleFiltersChange}
      />

      {/* West Bank with Comparison */}
      <PopulationPyramidChartWithFilters
        data={currentWestBankData}
        preConflictData={preConflictWestBankData}
        title="West Bank Population Distribution"
        description="Current population with pre-conflict comparison"
        dataSource="Estimated Data"
        defaultComparisonMode={false}
        defaultDisplayMode="absolute"
        onFiltersChange={handleFiltersChange}
      />

      {/* Features showcase */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Age Group Filtering</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Filter by children (0-19), working age (20-64), or elderly (65+) to focus on specific demographics
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Compare pre-conflict and current population distributions to visualize demographic changes
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Animated Transitions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Smooth animations when switching between filters or comparison modes for better visual continuity
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistics Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Real-time statistics showing total population, age distribution, and gender ratio
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display Modes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Toggle between absolute numbers and percentage distribution for different analytical perspectives
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter Reset</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Quickly reset all filters to default state with a single click
          </CardContent>
        </Card>
      </div>

      {/* Usage notes */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Age Categories:</strong> Use checkboxes to show/hide entire age categories. 
            Uncheck "Children" to focus on adult population, or uncheck "Working Age" to see dependency ratios.
          </p>
          <p>
            <strong>Comparison Mode:</strong> Select "Pre-Conflict" to overlay historical data and visualize 
            demographic changes. This is useful for understanding conflict impact on population structure.
          </p>
          <p>
            <strong>Display Mode:</strong> Switch between "Absolute" (actual population numbers) and 
            "Percentage" (proportion of total) to analyze different aspects of the demographic distribution.
          </p>
          <p>
            <strong>Interactive Features:</strong> Hover over bars to see detailed information. 
            Click on bars to trigger custom actions (logged to console in this demo).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopulationPyramidComparisonDemo;
