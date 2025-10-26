/**
 * Gaza Infrastructure Data Transformations
 * 
 * Transforms raw infrastructure data from multiple sources into structured metrics
 * for Gaza infrastructure dashboard components
 */

export interface InfrastructureRecord {
  report_date?: string;
  date?: string;
  residential?: {
    destroyed?: number;
    damaged?: number;
    partially_damaged?: number;
  };
  educational_buildings?: {
    destroyed?: number;
    damaged?: number;
  };
  health_facilities?: {
    destroyed?: number;
    damaged?: number;
    out_of_service?: number;
  };
  mosques?: {
    destroyed?: number;
    damaged?: number;
  };
  churches?: {
    destroyed?: number;
    damaged?: number;
  };
  [key: string]: any;
}

export interface HealthcareAttack {
  date?: string;
  facility_name?: string;
  facility_type?: string;
  casualties?: number;
  workers_killed?: number;
  [key: string]: any;
}

export interface InfrastructureMetrics {
  residentialDestroyed: number;
  residentialDamaged: number;
  totalResidential: number;
  hospitalsAffected: number;
  schoolsAffected: number;
  healthWorkersKilled: number;
  mosquesAffected: number;
  churchesAffected: number;
}

/**
 * Get latest infrastructure data from time series
 */
export function getLatestInfrastructureData(data: InfrastructureRecord[]): InfrastructureRecord | null {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Return the most recent record
  return data[data.length - 1];
}

/**
 * Calculate comprehensive infrastructure metrics
 */
export function calculateInfrastructureMetrics(
  infrastructureData: InfrastructureRecord[],
  healthcareAttacks?: HealthcareAttack[]
): InfrastructureMetrics {
  const latest = getLatestInfrastructureData(infrastructureData);

  if (!latest) {
    return {
      residentialDestroyed: 0,
      residentialDamaged: 0,
      totalResidential: 0,
      hospitalsAffected: 0,
      schoolsAffected: 0,
      healthWorkersKilled: 0,
      mosquesAffected: 0,
      churchesAffected: 0,
    };
  }

  // Residential units - use ext_destroyed field from Tech4Palestine API
  const residentialDestroyed = latest.residential?.ext_destroyed || latest.residential?.destroyed || 0;
  const residentialDamaged = latest.residential?.ext_damaged || latest.residential?.damaged || 0;
  const totalResidential = residentialDestroyed + residentialDamaged;

  // Educational facilities - use ext_ fields from Tech4Palestine API
  const schoolsDestroyed = latest.educational_buildings?.ext_destroyed || latest.educational_buildings?.destroyed || 0;
  const schoolsDamaged = latest.educational_buildings?.ext_damaged || latest.educational_buildings?.damaged || 0;
  const schoolsAffected = schoolsDestroyed + schoolsDamaged;

  // Healthcare facilities - NOT available in Tech4Palestine infrastructure API
  // This will be 0 unless provided from another real source
  const hospitalsDestroyed = latest.health_facilities?.ext_destroyed || latest.health_facilities?.destroyed || 0;
  const hospitalsDamaged = latest.health_facilities?.ext_damaged || latest.health_facilities?.damaged || 0;
  const hospitalsOutOfService = latest.health_facilities?.out_of_service || 0;
  const hospitalsAffected = Math.max(hospitalsDestroyed + hospitalsDamaged, hospitalsOutOfService);

  // Religious sites - use ext_ fields from Tech4Palestine API
  const mosquesDestroyed = latest.places_of_worship?.ext_mosques_destroyed || 0;
  const mosquesDamaged = latest.places_of_worship?.ext_mosques_damaged || 0;
  const mosquesAffected = mosquesDestroyed + mosquesDamaged;

  const churchesDestroyed = latest.places_of_worship?.ext_churches_destroyed || 0;
  const churchesDamaged = latest.places_of_worship?.ext_churches_damaged || 0;
  const churchesAffected = churchesDestroyed + churchesDamaged;

  // Healthcare workers killed - NOT calculated here, should come from Tech4Palestine summary API
  let healthWorkersKilled = 0;
  if (healthcareAttacks && Array.isArray(healthcareAttacks)) {
    healthWorkersKilled = healthcareAttacks.reduce((sum, attack) => {
      return sum + (attack.workers_killed || 0);
    }, 0);
  }

  return {
    residentialDestroyed,
    residentialDamaged,
    totalResidential,
    hospitalsAffected,
    schoolsAffected,
    healthWorkersKilled,
    mosquesAffected,
    churchesAffected,
  };
}

/**
 * Calculate destruction timeline for charts
 */
export function calculateDestructionTimeline(
  data: InfrastructureRecord[],
  lastNDays: number = 30
): Array<{ date: string; Residential: number; Schools: number; Hospitals: number }> {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const recentData = data.slice(-lastNDays);

  return recentData.map(item => ({
    date: new Date(item.report_date || item.date || '').toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    Residential: item.residential?.destroyed || 0,
    Schools: item.educational_buildings?.damaged || 0,
    Hospitals: item.health_facilities?.destroyed || 0,
  }));
}

/**
 * Get housing status breakdown for pie charts
 */
export function getHousingStatusBreakdown(metrics: InfrastructureMetrics): Array<{
  name: string;
  value: number;
  color: string;
}> {
  return [
    {
      name: 'Destroyed',
      value: metrics.residentialDestroyed,
      color: 'hsl(var(--destructive))',
    },
    {
      name: 'Damaged',
      value: metrics.residentialDamaged,
      color: 'hsl(var(--warning))',
    },
  ];
}

/**
 * Get critical infrastructure summary
 */
export function getCriticalInfrastructureSummary(metrics: InfrastructureMetrics): Array<{
  name: string;
  value: number;
  icon: string;
}> {
  return [
    { name: 'Hospitals', value: metrics.hospitalsAffected, icon: 'Hospital' },
    { name: 'Schools', value: metrics.schoolsAffected, icon: 'School' },
    { name: 'Mosques', value: metrics.mosquesAffected, icon: 'Mosque' },
    { name: 'Churches', value: metrics.churchesAffected, icon: 'Church' },
  ];
}

/**
 * Calculate healthcare system impact metrics
 */
export function calculateHealthcareImpact(
  metrics: InfrastructureMetrics,
  totalHospitals: number = 36
): {
  workersKilled: number;
  operationalPercentage: number;
  outOfServicePercentage: number;
  operationalCount: number;
} {
  const operationalCount = Math.max(0, totalHospitals - metrics.hospitalsAffected);
  const operationalPercentage = (operationalCount / totalHospitals) * 100;
  const outOfServicePercentage = 100 - operationalPercentage;

  return {
    workersKilled: metrics.healthWorkersKilled,
    operationalPercentage,
    outOfServicePercentage,
    operationalCount,
  };
}

/**
 * Validate infrastructure data quality
 */
export function validateInfrastructureData(data: InfrastructureRecord[]): {
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

  let recordsWithResidential = 0;
  let recordsWithEducation = 0;
  let recordsWithHealth = 0;
  let recordsWithDate = 0;

  data.forEach(record => {
    if (record.residential) recordsWithResidential++;
    if (record.educational_buildings) recordsWithEducation++;
    if (record.health_facilities) recordsWithHealth++;
    if (record.report_date || record.date) recordsWithDate++;
  });

  const completeness = ((recordsWithResidential + recordsWithEducation + recordsWithHealth + recordsWithDate) / (data.length * 4)) * 100;

  if (recordsWithDate < data.length * 0.9) {
    issues.push('More than 10% of records missing date information');
  }

  if (recordsWithResidential < data.length * 0.5) {
    issues.push('More than 50% of records missing residential data');
  }

  return {
    isValid: issues.length === 0,
    issues,
    completeness,
  };
}
