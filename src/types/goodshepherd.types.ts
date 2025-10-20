/**
 * Good Shepherd Collective API Type Definitions
 * 
 * Type definitions for the 6 new data sources from Good Shepherd Collective
 */

// ============================================================================
// CHILD PRISONERS DATA
// ============================================================================

export interface YearlyMonthlyData {
  year: string;
  months: {
    [month: string]: string | number; // Can be numeric value or "-" for missing data
  };
  timestamp: string;
}

export interface ChildPrisonerData {
  childPrisonersData: {
    "12 to 15 year olds": YearlyMonthlyData[];
    "Administrative detention": YearlyMonthlyData[];
    "Detention": YearlyMonthlyData[];
    "Female": YearlyMonthlyData[];
  };
}

// ============================================================================
// HEALTHCARE ATTACKS DATA (Large Dataset - Needs Aggregation)
// ============================================================================

export interface HealthcareAttackRaw {
  date: string;
  type: string; // hospital, clinic, ambulance, etc.
  governorate: string;
  description?: string;
  casualties?: number;
}

export interface HealthcareAttackSummary {
  totalAttacks: number;
  byType: Record<string, number>;
  byGovernorate: Record<string, number>;
  byYear: Record<string, number>;
  byMonth: Array<{
    date: string;
    count: number;
  }>;
  mostRecentAttacks: HealthcareAttackRaw[];
}

// ============================================================================
// HOME DEMOLITIONS DATA (Large Dataset - Needs Aggregation)
// ============================================================================

export interface HomeDemolitionRaw {
  date: string;
  region: string;
  type: string; // punitive, administrative, etc.
  affectedPeople: number;
  structures: number;
}

export interface HomeDemolitionSummary {
  totalDemolitions: number;
  totalStructures: number;
  totalAffectedPeople: number;
  byRegion: Record<string, number>;
  byType: Record<string, number>;
  byYear: Record<string, number>;
  byMonth: Array<{
    date: string;
    count: number;
    affectedPeople: number;
  }>;
  recentDemolitions: HomeDemolitionRaw[];
}

// ============================================================================
// WEST BANK DATA
// ============================================================================

export interface WestBankData {
  economic: {
    gdp?: number;
    gdpPerCapita?: number;
    unemployment?: number;
    poverty?: number;
    tradeBalance?: number;
  };
  demographic: {
    population?: number;
    refugees?: number;
    density?: number;
    growthRate?: number;
  };
  infrastructure?: {
    checkpoints?: number;
    settlements?: number;
    settlers?: number;
  };
  lastUpdated?: string;
}

// ============================================================================
// NGO DATA
// ============================================================================

export interface NGO {
  id?: string;
  name: string;
  sector: string; // health, education, humanitarian, etc.
  operations: string[];
  coverage: string[]; // geographic areas
  established?: string;
  beneficiaries?: number;
  website?: string;
}

export interface NGOData {
  organizations: NGO[];
  summary?: {
    total: number;
    bySector: Record<string, number>;
    byRegion: Record<string, number>;
    totalBeneficiaries: number;
  };
}

// ============================================================================
// PRISONER DATA
// ============================================================================

export interface Prisoner {
  id?: string;
  name?: string;
  age?: number;
  gender: string;
  detentionDate: string;
  releaseDate?: string;
  status: string; // detained, released, administrative_detention, etc.
  charges?: string;
  location?: string;
  city?: string;
}

export interface PrisonerData {
  prisoners: Prisoner[];
  summary: {
    total: number;
    detained: number;
    released: number;
    administrativeDetention: number;
    byGender: Record<string, number>;
    byStatus: Record<string, number>;
    byAge: {
      children: number; // under 18
      youth: number; // 18-30
      adults: number; // 31-50
      elderly: number; // 51+
    };
    averageDetentionDays: number;
  };
  timestamp?: string;
}

// ============================================================================
// AGGREGATION HELPERS
// ============================================================================

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  daily?: TimeSeriesDataPoint[];
  weekly?: TimeSeriesDataPoint[];
  monthly?: TimeSeriesDataPoint[];
  yearly?: TimeSeriesDataPoint[];
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp?: string;
}

export interface AggregatedDataResponse<T> {
  summary: T;
  rawDataAvailable: boolean;
  aggregationMethod: string;
  dataPoints: number;
}