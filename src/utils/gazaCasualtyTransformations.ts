/**
 * Gaza Casualty Data Transformations
 * 
 * Transforms raw Tech4Palestine API data into structured metrics
 * for Gaza dashboard components
 */

export interface CasualtyRecord {
  id?: string;
  name?: string;
  name_en?: string;
  age?: number;
  sex?: 'male' | 'female' | 'm' | 'f' | string;
  date?: string;
  killed_date?: string;
  [key: string]: any;
}

export interface CasualtyMetrics {
  totalKilled: number;
  childrenKilled: number;
  womenKilled: number;
  menKilled: number;
  childrenPercentage: number;
  womenPercentage: number;
  menPercentage: number;
}

export interface DemographicBreakdown {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

/**
 * Parse Tech4Palestine array format to objects
 * The API returns data as [header_row, ...data_rows]
 */
function parseArrayFormatData(data: any[]): CasualtyRecord[] {
  if (!data || data.length < 2) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  // Find column indices
  const ageIndex = headers.indexOf('age');
  const sexIndex = headers.indexOf('sex');
  
  return rows.map((row: any[]) => ({
    age: row[ageIndex],
    sex: row[sexIndex],
  }));
}

/**
 * Calculate comprehensive casualty metrics from raw data
 */
export function calculateCasualtyMetrics(data: CasualtyRecord[] | any[]): CasualtyMetrics {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      totalKilled: 0,
      childrenKilled: 0,
      womenKilled: 0,
      menKilled: 0,
      childrenPercentage: 0,
      womenPercentage: 0,
      menPercentage: 0,
    };
  }

  // Check if data is in array format (Tech4Palestine format)
  let records: CasualtyRecord[];
  if (Array.isArray(data[0])) {
    records = parseArrayFormatData(data);
  } else {
    records = data as CasualtyRecord[];
  }

  const totalKilled = records.length;
  
  // Count children (age < 18)
  const childrenKilled = records.filter(record => {
    const age = record.age;
    return age !== undefined && age !== null && age < 18;
  }).length;

  // Count women (sex === 'female' or 'f')
  const womenKilled = records.filter(record => {
    const sex = record.sex?.toLowerCase();
    return sex === 'female' || sex === 'f';
  }).length;

  // Men are the remainder
  const menKilled = totalKilled - childrenKilled - womenKilled;

  console.log(`Calculated: children=${childrenKilled}, women=${womenKilled}, men=${menKilled}`);

  return {
    totalKilled,
    childrenKilled,
    womenKilled,
    menKilled,
    childrenPercentage: totalKilled > 0 ? (childrenKilled / totalKilled) * 100 : 0,
    womenPercentage: totalKilled > 0 ? (womenKilled / totalKilled) * 100 : 0,
    menPercentage: totalKilled > 0 ? (menKilled / totalKilled) * 100 : 0,
  };
}

/**
 * Get demographic breakdown for charts
 */
export function getDemographicBreakdown(metrics: CasualtyMetrics): DemographicBreakdown[] {
  return [
    {
      name: 'Children',
      value: metrics.childrenKilled,
      color: 'hsl(var(--destructive))',
      percentage: metrics.childrenPercentage,
    },
    {
      name: 'Women',
      value: metrics.womenKilled,
      color: 'hsl(var(--warning))',
      percentage: metrics.womenPercentage,
    },
    {
      name: 'Men',
      value: metrics.menKilled,
      color: 'hsl(var(--primary))',
      percentage: metrics.menPercentage,
    },
  ];
}

/**
 * Calculate daily casualties from cumulative data
 */
export function calculateDailyCasualties(
  cumulativeData: Array<{ report_date: string; ext_killed_cum?: number; ext_injured_cum?: number }>
): Array<{ date: string; killed: number; injured: number }> {
  if (!cumulativeData || cumulativeData.length < 2) {
    return [];
  }

  return cumulativeData.slice(1).map((item, index) => {
    const prevItem = cumulativeData[index];
    const dailyKilled = Math.max(0, (item.ext_killed_cum || 0) - (prevItem.ext_killed_cum || 0));
    const dailyInjured = Math.max(0, (item.ext_injured_cum || 0) - (prevItem.ext_injured_cum || 0));

    return {
      date: new Date(item.report_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      killed: dailyKilled,
      injured: dailyInjured,
    };
  });
}

/**
 * Calculate age group distribution
 */
export function calculateAgeGroupDistribution(data: CasualtyRecord[] | any[]): Array<{ group: string; value: number }> {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Parse array format if needed
  let records: CasualtyRecord[];
  if (Array.isArray(data[0])) {
    records = parseArrayFormatData(data);
  } else {
    records = data as CasualtyRecord[];
  }

  const ageGroups = {
    'Children (0-17)': 0,
    'Adults (18-64)': 0,
    'Elderly (65+)': 0,
    'Unknown': 0,
  };

  records.forEach(record => {
    const age = record.age;
    if (age === undefined || age === null) {
      ageGroups['Unknown']++;
    } else if (age < 18) {
      ageGroups['Children (0-17)']++;
    } else if (age < 65) {
      ageGroups['Adults (18-64)']++;
    } else {
      ageGroups['Elderly (65+)']++;
    }
  });

  return Object.entries(ageGroups)
    .filter(([_, value]) => value > 0)
    .map(([group, value]) => ({ group, value }));
}

/**
 * Calculate student casualties (age 5-18)
 */
export function calculateStudentCasualties(data: CasualtyRecord[] | any[]): number {
  if (!data || !Array.isArray(data)) {
    return 0;
  }

  // Parse array format if needed
  let records: CasualtyRecord[];
  if (Array.isArray(data[0])) {
    records = parseArrayFormatData(data);
  } else {
    records = data as CasualtyRecord[];
  }

  return records.filter(record => {
    const age = record.age;
    return age !== undefined && age !== null && age >= 5 && age <= 18;
  }).length;
}

/**
 * Estimate orphaned children based on casualty data
 * Uses demographic assumptions: average family size and parent age ranges
 */
export function estimateOrphanedChildren(data: CasualtyRecord[] | any[]): number {
  if (!data || !Array.isArray(data)) {
    return 0;
  }

  // Parse array format if needed
  let records: CasualtyRecord[];
  if (Array.isArray(data[0])) {
    records = parseArrayFormatData(data);
  } else {
    records = data as CasualtyRecord[];
  }

  // Count adults killed (age 25-50, typical parent age range)
  const parentsKilled = records.filter(record => {
    const age = record.age;
    return age !== undefined && age !== null && age >= 25 && age <= 50;
  }).length;

  // Estimate: Average 2.5 children per parent, 30% chance both parents killed
  const estimatedOrphans = Math.round(parentsKilled * 2.5 * 0.3);

  return estimatedOrphans;
}

/**
 * Get latest cumulative totals from daily data
 */
export function getLatestCumulativeTotals(
  cumulativeData: Array<{ report_date: string; ext_killed_cum?: number; ext_injured_cum?: number }>
): { killed: number; injured: number; date: string } {
  if (!cumulativeData || cumulativeData.length === 0) {
    return { killed: 0, injured: 0, date: new Date().toISOString() };
  }

  const latest = cumulativeData[cumulativeData.length - 1];
  return {
    killed: latest.ext_killed_cum || 0,
    injured: latest.ext_injured_cum || 0,
    date: latest.report_date,
  };
}

/**
 * Validate casualty data quality
 */
export function validateCasualtyData(data: CasualtyRecord[] | any[]): {
  isValid: boolean;
  issues: string[];
  completeness: number;
} {
  const issues: string[] = [];
  
  if (!data || !Array.isArray(data)) {
    return { isValid: false, issues: ['Data is not an array'], completeness: 0 };
  }

  if (data.length === 0) {
    return { isValid: false, issues: ['Data array is empty'], completeness: 0 };
  }

  // Parse array format if needed
  let records: CasualtyRecord[];
  if (Array.isArray(data[0])) {
    records = parseArrayFormatData(data);
  } else {
    records = data as CasualtyRecord[];
  }

  let recordsWithAge = 0;
  let recordsWithSex = 0;
  let recordsWithDate = 0;

  records.forEach((record, index) => {
    if (record.age !== undefined && record.age !== null) recordsWithAge++;
    if (record.sex) recordsWithSex++;
    if (record.date || record.killed_date) recordsWithDate++;
  });

  const completeness = ((recordsWithAge + recordsWithSex + recordsWithDate) / (records.length * 3)) * 100;

  if (recordsWithAge < records.length * 0.5) {
    issues.push('More than 50% of records missing age data');
  }

  if (recordsWithSex < records.length * 0.5) {
    issues.push('More than 50% of records missing sex data');
  }

  return {
    isValid: issues.length === 0,
    issues,
    completeness,
  };
}
