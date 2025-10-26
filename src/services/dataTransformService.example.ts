/**
 * DataTransformService Usage Examples
 * 
 * This file demonstrates how to use the DataTransformService to transform
 * raw data into formats suitable for D3 visualizations.
 * 
 * @see src/services/dataTransformService.ts
 */

import { dataTransformService } from './dataTransformService';

// ============================================================================
// Example 1: Time-Series Aggregation for Area Charts
// ============================================================================

/**
 * Transform daily casualty data for an animated area chart
 */
export function transformCasualtyDataForAreaChart() {
  // Sample data from tech4palestine/casualties
  const dailyCasualties = [
    { date: '2024-01-01', killed: 50, injured: 120 },
    { date: '2024-01-02', killed: 75, injured: 150 },
    { date: '2024-01-03', killed: 60, injured: 130 },
    // ... more data
  ];

  // Filter to last 30 days
  const last30Days = dataTransformService.aggregateByTimeRange(
    dailyCasualties.map(d => ({ ...d, value: d.killed })),
    '1m',
    'date'
  );

  // Aggregate by week for smoother visualization
  const weeklyData = dataTransformService.aggregateByTimeRange(
    dailyCasualties.map(d => ({ ...d, value: d.killed })),
    '3m',
    'date',
    'weekly'
  );

  return { last30Days, weeklyData };
}

// ============================================================================
// Example 2: Category Grouping for Bar Charts
// ============================================================================

/**
 * Transform healthcare attack data for an interactive bar chart
 */
export function transformHealthcareAttacksForBarChart() {
  // Sample data from goodshepherd/healthcare
  const healthcareAttacks = [
    { facility_type: 'hospital', casualties: 50 },
    { facility_type: 'clinic', casualties: 30 },
    { facility_type: 'hospital', casualties: 20 },
    { facility_type: 'ambulance', casualties: 15 },
    { facility_type: 'clinic', casualties: 25 },
    // ... more data
  ];

  // Group by facility type and sort by value
  const groupedData = dataTransformService.groupByCategory(
    healthcareAttacks,
    'facility_type',
    'casualties',
    {
      sortBy: 'value',
      sortOrder: 'desc',
      limit: 10, // Top 10 facility types
    }
  );

  return groupedData;
}

// ============================================================================
// Example 3: Demographic Pyramid for Population Charts
// ============================================================================

/**
 * Transform victim data for a population pyramid chart
 */
export function transformVictimsForPyramidChart() {
  // Sample data from tech4palestine/killed-in-gaza
  const victims = [
    { age: 5, gender: 'male' },
    { age: 8, gender: 'female' },
    { age: 12, gender: 'male' },
    { age: 25, gender: 'female' },
    { age: 30, gender: 'male' },
    // ... more data
  ];

  // Create 5-year age groups
  const pyramidData = dataTransformService.transformToPyramid(
    victims,
    'age',
    'gender',
    {
      ageGroupSize: 5,
      maxAge: 100,
    }
  );

  return pyramidData;
}

/**
 * Transform victim data using predefined age categories
 */
export function transformVictimsByCategoryForPyramid() {
  // Sample data with age categories
  const victims = [
    { ageCategory: 'child', gender: 'male' },
    { ageCategory: 'adult', gender: 'female' },
    { ageCategory: 'child', gender: 'female' },
    { ageCategory: 'senior', gender: 'male' },
    // ... more data
  ];

  // Use predefined categories
  const pyramidData = dataTransformService.transformToPyramid(
    victims,
    'ageCategory',
    'gender',
    {
      ageCategories: ['child', 'adult', 'senior'],
    }
  );

  return pyramidData;
}

// ============================================================================
// Example 4: Flow Data for Sankey Diagrams
// ============================================================================

/**
 * Transform displacement data for a Sankey flow diagram
 */
export function transformDisplacementForSankeyChart() {
  // Sample data from hdx/displacement
  const displacementData = [
    { origin: 'Gaza City', destination: 'Rafah', idps: 1000 },
    { origin: 'Gaza City', destination: 'Khan Younis', idps: 500 },
    { origin: 'Gaza City', destination: 'Rafah', idps: 300 },
    { origin: 'Khan Younis', destination: 'Rafah', idps: 200 },
    // ... more data
  ];

  // Transform to flow format
  const flowData = dataTransformService.transformToFlow(
    displacementData,
    'origin',
    'destination',
    'idps',
    {
      minValue: 100, // Only show flows with at least 100 IDPs
    }
  );

  return flowData;
}

/**
 * Transform aid distribution data for a Sankey diagram
 */
export function transformAidDistributionForSankey() {
  // Sample aid distribution data
  const aidData = [
    { source: 'UNRWA', target: 'Gaza City', tons: 500 },
    { source: 'UNRWA', target: 'Rafah', tons: 300 },
    { source: 'WFP', target: 'Khan Younis', tons: 400 },
    { source: 'Red Cross', target: 'Gaza City', tons: 200 },
    // ... more data
  ];

  // Transform to flow format (no value field means count)
  const flowData = dataTransformService.transformToFlow(
    aidData,
    'source',
    'target',
    'tons'
  );

  return flowData;
}

// ============================================================================
// Example 5: Calendar Heatmap Data
// ============================================================================

/**
 * Transform daily casualty data for a calendar heatmap
 */
export function transformCasualtiesForCalendarHeatmap() {
  // Sample daily casualty data
  const dailyData = [
    { date: '2024-01-01', casualties: 50 },
    { date: '2024-01-02', casualties: 100 },
    { date: '2024-01-03', casualties: 75 },
    { date: '2024-01-05', casualties: 200 }, // Jan 4 missing
    { date: '2024-01-06', casualties: 30 },
    // ... more data
  ];

  // Transform to calendar format with automatic intensity calculation
  const calendarData = dataTransformService.transformToCalendar(
    dailyData,
    'date',
    'casualties'
  );

  // Transform with custom intensity thresholds
  const calendarDataCustom = dataTransformService.transformToCalendar(
    dailyData,
    'date',
    'casualties',
    {
      intensityThresholds: {
        low: 40,
        medium: 80,
        high: 150,
      },
    }
  );

  // Transform with missing dates filled
  const calendarDataFilled = dataTransformService.transformToCalendar(
    dailyData,
    'date',
    'casualties',
    {
      fillMissingDates: true,
    }
  );

  return { calendarData, calendarDataCustom, calendarDataFilled };
}

/**
 * Transform healthcare attack data for a calendar heatmap
 */
export function transformHealthcareAttacksForCalendar() {
  // Sample healthcare attack data
  const attacks = [
    { date: '2024-01-01', facility_name: 'Hospital A', casualties: 10 },
    { date: '2024-01-01', facility_name: 'Clinic B', casualties: 5 },
    { date: '2024-01-02', facility_name: 'Hospital C', casualties: 20 },
    // ... more data
  ];

  // Transform to calendar format (will aggregate multiple attacks per day)
  const calendarData = dataTransformService.transformToCalendar(
    attacks,
    'date',
    'casualties',
    {
      fillMissingDates: true,
    }
  );

  return calendarData;
}

// ============================================================================
// Example 6: Combined Transformations
// ============================================================================

/**
 * Transform data for a comprehensive dashboard with multiple chart types
 */
export function transformDataForComprehensiveDashboard() {
  // Sample comprehensive dataset
  const rawData = [
    {
      date: '2024-01-01',
      region: 'Gaza City',
      type: 'hospital',
      casualties: 50,
      age: 25,
      gender: 'male',
    },
    {
      date: '2024-01-02',
      region: 'Rafah',
      type: 'clinic',
      casualties: 30,
      age: 35,
      gender: 'female',
    },
    // ... more data
  ];

  // Time-series for area chart
  const timeSeriesData = dataTransformService.aggregateByTimeRange(
    rawData.map(d => ({ ...d, value: d.casualties })),
    '3m',
    'date',
    'weekly'
  );

  // Category breakdown for bar chart
  const categoryData = dataTransformService.groupByCategory(
    rawData,
    'type',
    'casualties',
    {
      sortBy: 'value',
      sortOrder: 'desc',
    }
  );

  // Regional breakdown for donut chart
  const regionalData = dataTransformService.groupByCategory(
    rawData,
    'region',
    'casualties'
  );

  // Demographic pyramid
  const pyramidData = dataTransformService.transformToPyramid(
    rawData,
    'age',
    'gender'
  );

  // Calendar heatmap
  const calendarData = dataTransformService.transformToCalendar(
    rawData,
    'date',
    'casualties',
    {
      fillMissingDates: true,
    }
  );

  return {
    timeSeriesData,
    categoryData,
    regionalData,
    pyramidData,
    calendarData,
  };
}

// ============================================================================
// Example 7: Real-World Integration with React Hooks
// ============================================================================

/**
 * Example React hook using DataTransformService
 * 
 * This demonstrates how to integrate the service in a React component
 */
export function useTransformedHealthcareData(timeRange: '7d' | '1m' | '3m' | '1y' | 'all') {
  // In a real component, you would use React hooks like useMemo
  // const transformedData = useMemo(() => {
  //   return dataTransformService.aggregateByTimeRange(rawData, timeRange, 'date');
  // }, [rawData, timeRange]);

  // Example transformation
  const rawHealthcareData = [
    { date: '2024-01-01', facility_type: 'hospital', casualties: 50 },
    // ... more data
  ];

  const timeSeriesData = dataTransformService.aggregateByTimeRange(
    rawHealthcareData.map(d => ({ ...d, value: d.casualties })),
    timeRange,
    'date'
  );

  const categoryData = dataTransformService.groupByCategory(
    rawHealthcareData,
    'facility_type',
    'casualties'
  );

  return { timeSeriesData, categoryData };
}
