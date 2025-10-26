/**
 * Population Pyramid Chart with Demographic Filtering
 * 
 * Features:
 * - Age group selection
 * - Comparison mode (pre/post conflict)
 * - Animated demographic transitions
 * - Filter controls integrated with chart
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.4, 8.5)
 */

import { useState, useMemo } from 'react';
import { PopulationPyramidChart } from './PopulationPyramidChart';
import { PyramidData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Users, Filter, GitCompare, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Props for PopulationPyramidChartWithFilters component
 */
export interface PopulationPyramidChartWithFiltersProps {
  /** Current population data */
  data: PyramidData[];
  /** Pre-conflict population data (for comparison) */
  preConflictData?: PyramidData[];
  /** Post-conflict population data (for comparison) */
  postConflictData?: PyramidData[];
  /** Chart title */
  title?: string;
  /** Chart description */
  description?: string;
  /** Data source information */
  dataSource?: string;
  /** Enable comparison mode by default */
  defaultComparisonMode?: boolean;
  /** Default display mode */
  defaultDisplayMode?: 'absolute' | 'percentage';
  /** Callback when filters change */
  onFiltersChange?: (filters: DemographicFilters) => void;
}

/**
 * Demographic filter configuration
 */
export interface DemographicFilters {
  ageGroups: string[];
  comparisonMode: 'none' | 'pre-post' | 'overlay';
  displayMode: 'absolute' | 'percentage';
  showChildren: boolean;
  showWorkingAge: boolean;
  showElderly: boolean;
}

/**
 * Age group categories
 */
const AGE_CATEGORIES = {
  children: ['0-4', '5-9', '10-14', '15-19'],
  workingAge: ['20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64'],
  elderly: ['65-69', '70-74', '75-79', '80+'],
};

/**
 * PopulationPyramidChartWithFilters Component
 * 
 * Enhanced population pyramid with demographic filtering and comparison capabilities.
 */
export const PopulationPyramidChartWithFilters: React.FC<PopulationPyramidChartWithFiltersProps> = ({
  data,
  preConflictData,
  postConflictData,
  title = 'Population Distribution',
  description = 'Age and gender breakdown with demographic filters',
  dataSource = 'Sample Data',
  defaultComparisonMode = false,
  defaultDisplayMode = 'absolute',
  onFiltersChange,
}) => {
  const { t } = useTranslation();
  
  const [filters, setFilters] = useState<DemographicFilters>({
    ageGroups: [],
    comparisonMode: defaultComparisonMode ? 'pre-post' : 'none',
    displayMode: defaultDisplayMode,
    showChildren: true,
    showWorkingAge: true,
    showElderly: true,
  });

  const [hoveredData, setHoveredData] = useState<{ ageGroup: string; gender: string; value: number } | null>(null);

  // Filter data based on age group selections
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by age categories
    if (!filters.showChildren) {
      filtered = filtered.filter(d => !AGE_CATEGORIES.children.includes(d.ageGroup));
    }
    if (!filters.showWorkingAge) {
      filtered = filtered.filter(d => !AGE_CATEGORIES.workingAge.includes(d.ageGroup));
    }
    if (!filters.showElderly) {
      filtered = filtered.filter(d => !AGE_CATEGORIES.elderly.includes(d.ageGroup));
    }

    // Filter by specific age groups if selected
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(d => filters.ageGroups.includes(d.ageGroup));
    }

    return filtered;
  }, [data, filters]);

  // Get comparison data based on mode
  const comparisonData = useMemo(() => {
    if (filters.comparisonMode === 'none') return null;
    
    if (filters.comparisonMode === 'pre-post') {
      return preConflictData || null;
    }
    
    return postConflictData || null;
  }, [filters.comparisonMode, preConflictData, postConflictData]);

  // Calculate demographic statistics
  const statistics = useMemo(() => {
    const totalMale = filteredData.reduce((sum, d) => sum + d.male, 0);
    const totalFemale = filteredData.reduce((sum, d) => sum + d.female, 0);
    const total = totalMale + totalFemale;

    const children = filteredData
      .filter(d => AGE_CATEGORIES.children.includes(d.ageGroup))
      .reduce((sum, d) => sum + d.male + d.female, 0);

    const workingAge = filteredData
      .filter(d => AGE_CATEGORIES.workingAge.includes(d.ageGroup))
      .reduce((sum, d) => sum + d.male + d.female, 0);

    const elderly = filteredData
      .filter(d => AGE_CATEGORIES.elderly.includes(d.ageGroup))
      .reduce((sum, d) => sum + d.male + d.female, 0);

    return {
      total,
      totalMale,
      totalFemale,
      children,
      workingAge,
      elderly,
      childrenPercentage: total > 0 ? (children / total) * 100 : 0,
      workingAgePercentage: total > 0 ? (workingAge / total) * 100 : 0,
      elderlyPercentage: total > 0 ? (elderly / total) * 100 : 0,
      malePercentage: total > 0 ? (totalMale / total) * 100 : 0,
      femalePercentage: total > 0 ? (totalFemale / total) * 100 : 0,
    };
  }, [filteredData]);

  // Handle filter changes
  const updateFilters = (updates: Partial<DemographicFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

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

  // Reset filters
  const resetFilters = () => {
    updateFilters({
      ageGroups: [],
      comparisonMode: 'none',
      displayMode: 'absolute',
      showChildren: true,
      showWorkingAge: true,
      showElderly: true,
    });
  };

  const hasActiveFilters = 
    filters.ageGroups.length > 0 ||
    !filters.showChildren ||
    !filters.showWorkingAge ||
    !filters.showElderly ||
    filters.comparisonMode !== 'none';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Demographics
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 text-xs"
              >
                Reset
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Age Category Filters */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground">
                Age Categories
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="children"
                    checked={filters.showChildren}
                    onCheckedChange={(checked) => 
                      updateFilters({ showChildren: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="children"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Children (0-19)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="working-age"
                    checked={filters.showWorkingAge}
                    onCheckedChange={(checked) => 
                      updateFilters({ showWorkingAge: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="working-age"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Working Age (20-64)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="elderly"
                    checked={filters.showElderly}
                    onCheckedChange={(checked) => 
                      updateFilters({ showElderly: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="elderly"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Elderly (65+)
                  </label>
                </div>
              </div>
            </div>

            {/* Comparison Mode */}
            {(preConflictData || postConflictData) && (
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Comparison Mode
                </Label>
                <Select
                  value={filters.comparisonMode}
                  onValueChange={(value) => 
                    updateFilters({ comparisonMode: value as 'none' | 'pre-post' | 'overlay' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Comparison</SelectItem>
                    {preConflictData && (
                      <SelectItem value="pre-post">Pre-Conflict</SelectItem>
                    )}
                    {postConflictData && (
                      <SelectItem value="overlay">Post-Conflict</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Display Mode */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground">
                Display Mode
              </Label>
              <div className="flex gap-1">
                <Button
                  variant={filters.displayMode === 'absolute' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ displayMode: 'absolute' })}
                  className="flex-1"
                >
                  Absolute
                </Button>
                <Button
                  variant={filters.displayMode === 'percentage' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ displayMode: 'percentage' })}
                  className="flex-1"
                >
                  Percentage
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">Total Population</div>
            <div className="text-2xl font-bold">{statistics.total.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">Children (0-19)</div>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.childrenPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">Working Age (20-64)</div>
            <div className="text-2xl font-bold text-green-600">
              {statistics.workingAgePercentage.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">Elderly (65+)</div>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.elderlyPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">Gender Ratio</div>
            <div className="text-lg font-bold">
              {(statistics.totalMale / statistics.totalFemale).toFixed(2)}:1
            </div>
          </div>
        </div>

        {/* Comparison indicator */}
        {filters.comparisonMode !== 'none' && comparisonData && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
            <div className="flex items-center gap-2 text-sm">
              <GitCompare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Comparison Mode Active
              </span>
              <span className="text-blue-700 dark:text-blue-300">
                - Showing {filters.comparisonMode === 'pre-post' ? 'pre-conflict' : 'post-conflict'} data
              </span>
            </div>
          </div>
        )}

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
            data={filteredData}
            height={600}
            displayMode={filters.displayMode}
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
            <span className="text-xs text-muted-foreground">
              ({statistics.malePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-pink-500"></div>
            <span className="text-sm font-medium">Female</span>
            <span className="text-xs text-muted-foreground">
              ({statistics.femalePercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Data source */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {dataSource}
            </Badge>
            <span>
              Filtered by: {hasActiveFilters ? 'Custom filters applied' : 'All age groups'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopulationPyramidChartWithFilters;
