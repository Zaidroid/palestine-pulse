/**
 * West Bank Violence Data Transformations
 * 
 * Transforms raw data from Good Shepherd Collective and other sources
 * into structured formats for West Bank violence metrics and visualizations.
 */

import { JerusalemWestBankData } from '@/services/goodShepherdService';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface WestBankViolenceMetrics {
  killedBySettlers: number;
  settlerAttacks: number;
  demolitions: number;
  agriculturalLand: number;
}

export interface ViolenceIncident {
  date: string;
  killed: number;
  injured: number;
  attacks: number;
}

export interface MonthlyEscalation {
  month: string;
  attacks: number;
  casualties: number;
}

export interface RegionalDemolition {
  region: string;
  count: number;
}

export interface AgriculturalDestruction {
  region: string;
  trees: number;
  farmland: number;
  wells: number;
  livestock: number;
}

// ============================================
// TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Calculate overall violence metrics from Good Shepherd data
 */
export function calculateViolenceMetrics(
  westBankData: JerusalemWestBankData[]
): WestBankViolenceMetrics {
  if (!westBankData || westBankData.length === 0) {
    return {
      killedBySettlers: 0,
      settlerAttacks: 0,
      demolitions: 0,
      agriculturalLand: 0,
    };
  }

  // Filter for settler violence incidents
  const settlerIncidents = westBankData.filter(
    item => item.incident_type?.toLowerCase().includes('settler') ||
            item.description?.toLowerCase().includes('settler')
  );

  // Calculate killed by settlers
  const killedBySettlers = settlerIncidents.reduce(
    (sum, item) => sum + (item.casualties?.killed || 0),
    0
  );

  // Count total settler attacks
  const settlerAttacks = settlerIncidents.length;

  // Filter for demolition incidents
  const demolitionIncidents = westBankData.filter(
    item => item.incident_type?.toLowerCase().includes('demolition') ||
            item.description?.toLowerCase().includes('demolition')
  );

  const demolitions = demolitionIncidents.length;

  // Filter for agricultural destruction
  const agricultureIncidents = westBankData.filter(
    item => item.incident_type?.toLowerCase().includes('agricultur') ||
            item.description?.toLowerCase().includes('tree') ||
            item.description?.toLowerCase().includes('farm')
  );

  const agriculturalLand = agricultureIncidents.length * 10; // Estimate acres per incident

  return {
    killedBySettlers,
    settlerAttacks,
    demolitions,
    agriculturalLand,
  };
}

/**
 * Transform data for daily violence trend chart
 */
export function transformDailyViolenceTrend(
  westBankData: JerusalemWestBankData[],
  days: number = 30
): ViolenceIncident[] {
  if (!westBankData || westBankData.length === 0) {
    return [];
  }

  // Sort by date
  const sortedData = [...westBankData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Take last N days
  const recentData = sortedData.slice(-days);

  // Group by date
  const dailyData = recentData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        killed: 0,
        injured: 0,
        attacks: 0,
      };
    }

    acc[date].killed += item.casualties?.killed || 0;
    acc[date].injured += item.casualties?.injured || 0;
    acc[date].attacks += 1;

    return acc;
  }, {} as Record<string, ViolenceIncident>);

  return Object.values(dailyData);
}

/**
 * Transform data for monthly escalation timeline
 */
export function transformMonthlyEscalation(
  westBankData: JerusalemWestBankData[]
): MonthlyEscalation[] {
  if (!westBankData || westBankData.length === 0) {
    return [];
  }

  // Group by month
  const monthlyData = westBankData.reduce((acc, item) => {
    const monthKey = item.date.slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: '',
        attacks: 0,
        casualties: 0,
      };
    }

    acc[monthKey].attacks += 1;
    acc[monthKey].casualties += (item.casualties?.killed || 0) + (item.casualties?.injured || 0);

    return acc;
  }, {} as Record<string, MonthlyEscalation>);

  // Sort by month and format
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, data]) => ({
      ...data,
      month: new Date(monthKey + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    }));
}

/**
 * Transform data for regional demolition breakdown
 */
export function transformRegionalDemolitions(
  demolitionData: any[]
): RegionalDemolition[] {
  if (!demolitionData || demolitionData.length === 0) {
    return [];
  }

  // Group by location/region
  const regionalData = demolitionData.reduce((acc, item) => {
    const region = item.location || 'Unknown';
    if (!acc[region]) {
      acc[region] = 0;
    }
    acc[region] += item.homes_demolished || 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by count
  return Object.entries(regionalData)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 regions
}

/**
 * Transform data for agricultural destruction by region
 */
export function transformAgriculturalDestruction(
  westBankData: JerusalemWestBankData[]
): AgriculturalDestruction[] {
  if (!westBankData || westBankData.length === 0) {
    return [];
  }

  // Filter for agricultural incidents
  const agricultureIncidents = westBankData.filter(
    item => item.incident_type?.toLowerCase().includes('agricultur') ||
            item.description?.toLowerCase().includes('tree') ||
            item.description?.toLowerCase().includes('farm')
  );

  // Group by location
  const regionalData = agricultureIncidents.reduce((acc, item) => {
    const region = item.location || 'Unknown';
    if (!acc[region]) {
      acc[region] = {
        region,
        trees: 0,
        farmland: 0,
        wells: 0,
        livestock: 0,
      };
    }

    // Estimate destruction based on incident description
    if (item.description?.toLowerCase().includes('tree')) {
      acc[region].trees += 100; // Estimate trees per incident
    }
    if (item.description?.toLowerCase().includes('farm')) {
      acc[region].farmland += 5; // Estimate acres per incident
    }
    if (item.description?.toLowerCase().includes('well')) {
      acc[region].wells += 1;
    }
    if (item.description?.toLowerCase().includes('livestock')) {
      acc[region].livestock += 10; // Estimate animals per incident
    }

    return acc;
  }, {} as Record<string, AgriculturalDestruction>);

  // Convert to array and sort by total impact
  return Object.values(regionalData)
    .sort((a, b) => (b.trees + b.farmland * 100) - (a.trees + a.farmland * 100))
    .slice(0, 5); // Top 5 regions
}

/**
 * Aggregate violence data by region and time period
 */
export function aggregateViolenceByRegion(
  westBankData: JerusalemWestBankData[],
  startDate?: Date,
  endDate?: Date
): Record<string, { attacks: number; casualties: number }> {
  if (!westBankData || westBankData.length === 0) {
    return {};
  }

  // Filter by date range if provided
  let filteredData = westBankData;
  if (startDate || endDate) {
    filteredData = westBankData.filter(item => {
      const itemDate = new Date(item.date);
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      return true;
    });
  }

  // Group by location
  return filteredData.reduce((acc, item) => {
    const region = item.location || 'Unknown';
    if (!acc[region]) {
      acc[region] = { attacks: 0, casualties: 0 };
    }

    acc[region].attacks += 1;
    acc[region].casualties += (item.casualties?.killed || 0) + (item.casualties?.injured || 0);

    return acc;
  }, {} as Record<string, { attacks: number; casualties: number }>);
}

/**
 * Calculate attack frequency over time
 */
export function calculateAttackFrequency(
  westBankData: JerusalemWestBankData[],
  periodDays: number = 7
): { period: string; frequency: number }[] {
  if (!westBankData || westBankData.length === 0) {
    return [];
  }

  // Sort by date
  const sortedData = [...westBankData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedData.length === 0) return [];

  const startDate = new Date(sortedData[0].date);
  const endDate = new Date(sortedData[sortedData.length - 1].date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const periods: { period: string; frequency: number }[] = [];

  for (let i = 0; i < totalDays; i += periodDays) {
    const periodStart = new Date(startDate);
    periodStart.setDate(periodStart.getDate() + i);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    const periodAttacks = sortedData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= periodStart && itemDate < periodEnd;
    }).length;

    periods.push({
      period: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      frequency: periodAttacks,
    });
  }

  return periods;
}
