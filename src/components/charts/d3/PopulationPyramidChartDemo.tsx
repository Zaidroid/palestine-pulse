/**
 * Population Pyramid Chart Demo
 * 
 * Demonstrates the PopulationPyramidChart component with sample demographic data.
 */

import { useState } from 'react';
import { PopulationPyramidChart } from './PopulationPyramidChart';
import { PyramidData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp } from 'lucide-react';

/**
 * Sample demographic data for Gaza population
 */
const gazaPopulationData: PyramidData[] = [
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
 * Sample demographic data for West Bank population
 */
const westBankPopulationData: PyramidData[] = [
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
 * PopulationPyramidChartDemo Component
 */
export const PopulationPyramidChartDemo: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<'absolute' | 'percentage'>('absolute');
  const [selectedRegion, setSelectedRegion] = useState<'gaza' | 'westbank'>('gaza');
  const [hoveredData, setHoveredData] = useState<{ ageGroup: string; gender: string; value: number } | null>(null);

  const currentData = selectedRegion === 'gaza' ? gazaPopulationData : westBankPopulationData;

  const handleBarHover = (data: PyramidData | null, gender?: 'male' | 'female') => {
    if (data && gender) {
      setHoveredData({
        ageGroup: data.ageGroup,
        gender: gender,
        value: gender === 'male' ? data.male : data.female,
      });
    } else {
      setHoveredData(null);
    }
  };

  const handleBarClick = (data: PyramidData, gender: 'male' | 'female') => {
    console.log('Clicked:', data.ageGroup, gender, gender === 'male' ? data.male : data.female);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Population Pyramid Chart</h2>
        <p className="text-muted-foreground">
          Interactive demographic visualization showing age and gender distribution
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>
                  {selectedRegion === 'gaza' ? 'Gaza Strip' : 'West Bank'} Population Distribution
                </CardTitle>
              </div>
              <CardDescription>
                Age and gender breakdown of the population
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Demographics
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Region selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Region:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedRegion === 'gaza' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion('gaza')}
                >
                  Gaza Strip
                </Button>
                <Button
                  variant={selectedRegion === 'westbank' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion('westbank')}
                >
                  West Bank
                </Button>
              </div>
            </div>

            {/* Display mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Display:</span>
              <div className="flex gap-1">
                <Button
                  variant={displayMode === 'absolute' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplayMode('absolute')}
                >
                  Absolute
                </Button>
                <Button
                  variant={displayMode === 'percentage' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplayMode('percentage')}
                >
                  Percentage
                </Button>
              </div>
            </div>
          </div>

          {/* Hovered data display */}
          {hoveredData && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">Hovered: </span>
              <span className="text-muted-foreground">
                {hoveredData.ageGroup} years, {hoveredData.gender} - {hoveredData.value.toLocaleString()}
              </span>
            </div>
          )}

          {/* Chart */}
          <div className="w-full">
            <PopulationPyramidChart
              data={currentData}
              height={600}
              displayMode={displayMode}
              animated={true}
              interactive={true}
              showGrid={true}
              showValueLabels={false}
              onBarHover={handleBarHover}
              onBarClick={handleBarClick}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm font-medium">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-500"></div>
              <span className="text-sm font-medium">Female</span>
            </div>
          </div>

          {/* Data source */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Sample Data
              </Badge>
              <span>
                Estimated population distribution based on demographic patterns
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features showcase */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mirrored Layout</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Male population on the left, female on the right, with age groups in the center
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interactive Tooltips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Hover over bars to see detailed demographic information for each age group
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display Modes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Toggle between absolute population numbers and percentage distribution
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">RTL Support</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Automatically mirrors layout for Arabic language with proper text alignment
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smooth Animations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Bars animate in with staggered timing for a polished visual experience
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Theme Aware</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Adapts colors and styling automatically for light and dark themes
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PopulationPyramidChartDemo;
