/**
 * Data Aggregation Utilities
 * 
 * Functions to aggregate large datasets into summary statistics
 * Specifically designed for Good Shepherd Collective APIs with 1M+ records
 */

import {
  HealthcareAttackRaw,
  HealthcareAttackSummary,
  HomeDemolitionRaw,
  HomeDemolitionSummary,
  TimeSeriesDataPoint,
  CategoryBreakdown,
} from './types/goodshepherd.types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Group array items by a key function
 */
export const groupBy = <T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, number> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Sum values from array items by a key function
 */
export const sumBy = <T>(
  array: T[],
  keyFn: (item: T) => number
): number => {
  return array.reduce((sum, item) => sum + keyFn(item), 0);
};

/**
 * Get year from date string
 */
export const getYear = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  } catch {
    return 'Unknown';
  }
};

/**
 * Get month from date string (YYYY-MM format)
 */
export const getYearMonth = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  } catch {
    return 'Unknown';
  }
};

/**
 * Calculate monthly trend from date-based data
 */
export const calculateMonthlyTrend = <T>(
  array: T[],
  dateFn: (item: T) => string,
  valueFn?: (item: T) => number
): TimeSeriesDataPoint[] => {
  const monthlyData = array.reduce((acc, item) => {
    const month = getYearMonth(dateFn(item));
    if (!acc[month]) {
      acc[month] = { count: 0, value: 0 };
    }
    acc[month].count += 1;
    if (valueFn) {
      acc[month].value += valueFn(item);
    }
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  return Object.entries(monthlyData)
    .map(([date, data]) => ({
      date,
      value: valueFn ? data.value : data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get top N items from a record
 */
export const getTopN = (
  record: Record<string, number>,
  n: number = 10
): CategoryBreakdown[] => {
  const total = Object.values(record).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
};

// ============================================================================
// HEALTHCARE ATTACKS AGGREGATION
// ============================================================================

/**
 * Aggregate healthcare attacks data into summary statistics
 * Handles large datasets (1M+ records) efficiently
 */
export const aggregateHealthcareAttacks = (
  rawData: HealthcareAttackRaw[]
): HealthcareAttackSummary => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return {
      totalAttacks: 0,
      byType: {},
      byGovernorate: {},
      byYear: {},
      byMonth: [],
      mostRecentAttacks: [],
    };
  }

  // Group by type
  const byType = groupBy(rawData, (item) => item.type || 'Unknown');

  // Group by governorate
  const byGovernorate = groupBy(
    rawData,
    (item) => item.governorate || 'Unknown'
  );

  // Group by year
  const byYear = groupBy(rawData, (item) => getYear(item.date));

  // Calculate monthly trend with proper count field
  const monthlyTrendData = calculateMonthlyTrend(rawData, (item) => item.date);
  const byMonth = monthlyTrendData.map((point) => ({
    date: point.date,
    count: point.value,
  }));

  // Get most recent attacks (last 50)
  const mostRecentAttacks = [...rawData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);

  return {
    totalAttacks: rawData.length,
    byType,
    byGovernorate,
    byYear,
    byMonth,
    mostRecentAttacks,
  };
};

// ============================================================================
// HOME DEMOLITIONS AGGREGATION
// ============================================================================

/**
 * Aggregate home demolitions data into summary statistics
 * Handles large datasets efficiently
 */
export const aggregateHomeDemolitions = (
  rawData: HomeDemolitionRaw[]
): HomeDemolitionSummary => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return {
      totalDemolitions: 0,
      totalStructures: 0,
      totalAffectedPeople: 0,
      byRegion: {},
      byType: {},
      byYear: {},
      byMonth: [],
      recentDemolitions: [],
    };
  }

  // Calculate totals
  const totalStructures = sumBy(rawData, (item) => item.structures || 0);
  const totalAffectedPeople = sumBy(rawData, (item) => item.affectedPeople || 0);

  // Group by region
  const byRegion = groupBy(rawData, (item) => item.region || 'Unknown');

  // Group by type
  const byType = groupBy(rawData, (item) => item.type || 'Unknown');

  // Group by year
  const byYear = groupBy(rawData, (item) => getYear(item.date));

  // Calculate monthly trend with affected people
  const byMonth = calculateMonthlyTrend(
    rawData,
    (item) => item.date,
    (item) => item.affectedPeople || 0
  ).map((point, idx) => {
    // Count demolitions per month
    const monthData = rawData.filter(
      (item) => getYearMonth(item.date) === point.date
    );
    return {
      date: point.date,
      count: monthData.length,
      affectedPeople: point.value,
    };
  });

  // Get most recent demolitions (last 50)
  const recentDemolitions = [...rawData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);

  return {
    totalDemolitions: rawData.length,
    totalStructures,
    totalAffectedPeople,
    byRegion,
    byType,
    byYear,
    byMonth,
    recentDemolitions,
  };
};

// ============================================================================
// CHILD PRISONERS AGGREGATION
// ============================================================================

/**
 * Extract latest statistics from child prisoners time series data
 */
export const getLatestChildPrisonerStats = (
  data: any
): { category: string; count: number }[] => {
  if (!data || !data.childPrisonersData) {
    return [];
  }

  const categories = Object.keys(data.childPrisonersData);
  const stats: { category: string; count: number }[] = [];

  categories.forEach((category) => {
    const timeSeriesData = data.childPrisonersData[category];
    if (Array.isArray(timeSeriesData) && timeSeriesData.length > 0) {
      // Get most recent year
      const latest = timeSeriesData[timeSeriesData.length - 1];
      if (latest && latest.months) {
        // Get the most recent month with data
        const months = Object.keys(latest.months);
        const recentMonth = months[months.length - 1];
        const value = latest.months[recentMonth];
        
        // Convert to number (handle "-" as 0)
        const count = value === '-' ? 0 : parseInt(String(value), 10) || 0;
        
        stats.push({
          category,
          count,
        });
      }
    }
  });

  return stats;
};

/**
 * Calculate total child prisoners trend over time
 */
export const calculateChildPrisonerTrend = (
  data: any
): TimeSeriesDataPoint[] => {
  if (!data || !data.childPrisonersData || !data.childPrisonersData.Detention) {
    return [];
  }

  const detentionData = data.childPrisonersData.Detention;
  const trend: TimeSeriesDataPoint[] = [];

  detentionData.forEach((yearData: any) => {
    if (yearData.months) {
      Object.entries(yearData.months).forEach(([month, value]) => {
        if (value !== '-') {
          const monthNum = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04',
            May: '05', Jun: '06', Jul: '07', Aug: '08',
            Sep: '09', Oct: '10', Nov: '11', Dec: '12',
          }[month] || '01';
          
          trend.push({
            date: `${yearData.year}-${monthNum}`,
            value: parseInt(String(value), 10) || 0,
          });
        }
      });
    }
  });

  return trend.sort((a, b) => a.date.localeCompare(b.date));
};

// ============================================================================
// GENERAL STATISTICS
// ============================================================================

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate average from array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

/**
 * Format large numbers with K, M suffixes
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};