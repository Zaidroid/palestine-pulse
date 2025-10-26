/**
 * West Bank Demolition Data Transformations
 * 
 * Transforms raw demolition data from Good Shepherd Collective and B'Tselem
 * into structured formats for West Bank demolition metrics and visualizations.
 */

import { HomeDemolitionsData } from '@/services/goodShepherdService';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface DemolitionMetrics {
  totalDemolitions: number;
  peopleHomeless: number;
  childrenAffected: number;
  administrativeDemolitions: number;
  punitiveDemolitions: number;
}

export interface RegionalDemolitionData {
  region: string;
  count: number;
  peopleAffected: number;
}

export interface DemolitionTimeline {
  month: string;
  demolitions: number;
  peopleAffected: number;
}

export interface DemolitionImpact {
  people_homeless: number;
  children_affected: number;
  administrative_demolitions: number;
  punitive_demolitions: number;
}

// ============================================
// TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Calculate overall demolition metrics from Good Shepherd data
 */
export function calculateDemolitionMetrics(
  demolitionData: HomeDemolitionsData[]
): DemolitionMetrics {
  if (!demolitionData || demolitionData.length === 0) {
    return {
      totalDemolitions: 0,
      peopleHomeless: 0,
      childrenAffected: 0,
      administrativeDemolitions: 0,
      punitiveDemolitions: 0,
    };
  }

  const totalDemolitions = demolitionData.reduce(
    (sum, item) => sum + (item.homes_demolished || 0),
    0
  );

  const peopleHomeless = demolitionData.reduce(
    (sum, item) => sum + (item.people_affected || 0),
    0
  );

  // Estimate children affected (approximately 40% of affected people)
  const childrenAffected = Math.round(peopleHomeless * 0.4);

  // Categorize by reason
  const administrativeDemolitions = demolitionData.filter(
    item => item.reason?.toLowerCase().includes('administrative') ||
            item.reason?.toLowerCase().includes('permit')
  ).reduce((sum, item) => sum + (item.homes_demolished || 0), 0);

  const punitiveDemolitions = demolitionData.filter(
    item => item.reason?.toLowerCase().includes('punitive') ||
            item.reason?.toLowerCase().includes('punishment')
  ).reduce((sum, item) => sum + (item.homes_demolished || 0), 0);

  return {
    totalDemolitions,
    peopleHomeless,
    childrenAffected,
    administrativeDemolitions,
    punitiveDemolitions,
  };
}

/**
 * Transform data for regional demolition breakdown
 */
export function transformRegionalDemolitions(
  demolitionData: HomeDemolitionsData[]
): RegionalDemolitionData[] {
  if (!demolitionData || demolitionData.length === 0) {
    return [];
  }

  // Group by location/region
  const regionalData = demolitionData.reduce((acc, item) => {
    const region = item.location || 'Unknown';
    if (!acc[region]) {
      acc[region] = {
        region,
        count: 0,
        peopleAffected: 0,
      };
    }

    acc[region].count += item.homes_demolished || 0;
    acc[region].peopleAffected += item.people_affected || 0;

    return acc;
  }, {} as Record<string, RegionalDemolitionData>);

  // Convert to array and sort by count
  return Object.values(regionalData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 regions
}

/**
 * Transform data for demolition timeline
 */
export function transformDemolitionTimeline(
  demolitionData: HomeDemolitionsData[]
): DemolitionTimeline[] {
  if (!demolitionData || demolitionData.length === 0) {
    return [];
  }

  // Group by month
  const monthlyData = demolitionData.reduce((acc, item) => {
    const monthKey = item.date.slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: '',
        demolitions: 0,
        peopleAffected: 0,
      };
    }

    acc[monthKey].demolitions += item.homes_demolished || 0;
    acc[monthKey].peopleAffected += item.people_affected || 0;

    return acc;
  }, {} as Record<string, DemolitionTimeline>);

  // Sort by month and format
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, data]) => ({
      ...data,
      month: new Date(monthKey + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    }));
}

/**
 * Calculate demolition impact statistics
 */
export function calculateDemolitionImpact(
  demolitionData: HomeDemolitionsData[]
): DemolitionImpact {
  const metrics = calculateDemolitionMetrics(demolitionData);

  return {
    people_homeless: metrics.peopleHomeless,
    children_affected: metrics.childrenAffected,
    administrative_demolitions: metrics.administrativeDemolitions,
    punitive_demolitions: metrics.punitiveDemolitions,
  };
}

/**
 * Aggregate demolitions by reason
 */
export function aggregateDemolitionsByReason(
  demolitionData: HomeDemolitionsData[]
): Record<string, number> {
  if (!demolitionData || demolitionData.length === 0) {
    return {};
  }

  return demolitionData.reduce((acc, item) => {
    const reason = item.reason || 'Unknown';
    if (!acc[reason]) {
      acc[reason] = 0;
    }
    acc[reason] += item.homes_demolished || 0;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate demolition rate over time
 */
export function calculateDemolitionRate(
  demolitionData: HomeDemolitionsData[],
  periodDays: number = 30
): { period: string; rate: number }[] {
  if (!demolitionData || demolitionData.length === 0) {
    return [];
  }

  // Sort by date
  const sortedData = [...demolitionData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedData.length === 0) return [];

  const startDate = new Date(sortedData[0].date);
  const endDate = new Date(sortedData[sortedData.length - 1].date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const periods: { period: string; rate: number }[] = [];

  for (let i = 0; i < totalDays; i += periodDays) {
    const periodStart = new Date(startDate);
    periodStart.setDate(periodStart.getDate() + i);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    const periodDemolitions = sortedData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= periodStart && itemDate < periodEnd;
      })
      .reduce((sum, item) => sum + (item.homes_demolished || 0), 0);

    periods.push({
      period: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: periodDemolitions,
    });
  }

  return periods;
}

/**
 * Filter demolitions by date range
 */
export function filterDemolitionsByDateRange(
  demolitionData: HomeDemolitionsData[],
  startDate: Date,
  endDate: Date
): HomeDemolitionsData[] {
  if (!demolitionData || demolitionData.length === 0) {
    return [];
  }

  return demolitionData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
}
