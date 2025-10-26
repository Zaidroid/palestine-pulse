/**
 * Dashboard D3 Redesign - Data Type Definitions
 * 
 * Comprehensive TypeScript interfaces for all data structures used in the dashboard redesign.
 * Based on data source analysis from /public/data/ directory.
 * 
 * @see .kiro/specs/dashboard-d3-redesign/data-source-analysis.md
 */

// ============================================================================
// COMMON DATA STRUCTURES
// ============================================================================

/**
 * Time series data point for line/area charts
 */
export interface TimeSeriesData {
  date: string | Date;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Category data for bar/donut charts
 */
export interface CategoryData {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Flow data for Sankey diagrams
 */
export interface FlowData {
  source: string;
  target: string;
  value: number;
  metadata?: Record<string, any>;
}

/**
 * Pyramid data for demographic visualizations
 */
export interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
  total?: number;
}

/**
 * Calendar heatmap data
 */
export interface CalendarData {
  date: string;
  value: number;
  intensity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}


/**
 * Event data for timeline charts
 */
export interface EventData {
  date: string;
  title: string;
  description: string;
  type: 'ceasefire' | 'escalation' | 'humanitarian' | 'political' | 'attack' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  casualties?: number;
  location?: string;
}

/**
 * Geographic coordinate data
 */
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  location?: string;
}

// ============================================================================
// DATA SOURCE METADATA
// ============================================================================

/**
 * Data source reliability levels
 */
export type DataReliability = 'high' | 'medium' | 'low';

/**
 * Data source metadata for attribution
 */
export interface DataSourceMetadata {
  source: string;
  url?: string;
  lastUpdated: string;
  reliability: DataReliability;
  methodology: string;
  recordCount?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  updateFrequency?: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
}

/**
 * Data quality validation metrics
 */
export interface DataQualityMetrics {
  qualityScore: number; // 0.0 - 1.0
  completeness: number; // 0.0 - 1.0
  meetsThreshold: boolean;
  errorCount: number;
  warningCount: number;
  validatedAt?: string;
}


// ============================================================================
// TECH4PALESTINE DATA TYPES
// ============================================================================

/**
 * Tech4Palestine summary data structure
 */
export interface Tech4PalestineSummary {
  metadata: {
    source: string;
    last_updated: string;
  };
  data: {
    gaza: GazaSummaryData;
    west_bank: WestBankSummaryData;
    known_killed_in_gaza: KnownKilledSummary;
    known_press_killed_in_gaza: {
      records: number;
    };
  };
}

export interface GazaSummaryData {
  reports: number;
  last_update: string;
  massacres: number;
  killed: {
    total: number;
    children: number;
    women: number;
    civil_defence: number;
    press: number;
    medical: number;
  };
  famine?: {
    total: number;
    children: number;
  };
  aid_seeker?: {
    killed: number;
    injured: number;
  };
  injured: {
    total: number;
  };
}

export interface WestBankSummaryData {
  reports: number;
  last_update: string;
  settler_attacks: number;
  killed: {
    total: number;
    children: number;
  };
  injured: {
    total: number;
    children: number;
  };
}

export interface KnownKilledSummary {
  records: number;
  pages: number;
  page_size: number;
  male: {
    adult: number;
    senior: number;
    child: number;
  };
  female: {
    adult: number;
    senior: number;
    child: number;
  };
  last_update: string;
  includes_until: string;
}


/**
 * Daily casualty record from Tech4Palestine
 */
export interface DailyCasualtyRecord {
  date: string;
  killed: number;
  injured: number;
  children_killed?: number;
  women_killed?: number;
  press_killed?: number;
  medical_killed?: number;
  metadata?: Record<string, any>;
}

/**
 * Individual victim record from killed-in-gaza dataset
 */
export interface VictimRecord {
  id?: string;
  name?: string;
  age?: number;
  gender: 'male' | 'female';
  ageCategory: 'child' | 'adult' | 'senior';
  date?: string;
  location?: string;
  circumstances?: string;
}

/**
 * Press casualty record
 */
export interface PressCasualtyRecord {
  id?: string;
  name: string;
  organization?: string;
  date: string;
  location?: string;
  circumstances?: string;
}

// ============================================================================
// GOOD SHEPHERD COLLECTIVE DATA TYPES
// ============================================================================

/**
 * Healthcare attack record
 */
export interface HealthcareAttackRecord {
  date: string;
  facility_name: string;
  facility_type: 'hospital' | 'clinic' | 'ambulance' | 'healthcare' | 'medical_center' | string;
  location: string;
  incident_type: 'attack' | 'bombing' | 'raid' | 'siege' | string;
  description: string;
  casualties: {
    killed: number;
    injured: number;
    kidnapped: number;
  };
  latitude: number;
  longitude: number;
  source: string;
}

/**
 * Aggregated healthcare attack summary
 */
export interface HealthcareAttackSummary {
  totalAttacks: number;
  totalCasualties: {
    killed: number;
    injured: number;
    kidnapped: number;
  };
  byFacilityType: CategoryData[];
  byLocation: CategoryData[];
  byIncidentType: CategoryData[];
  timeline: TimeSeriesData[];
  recentAttacks: HealthcareAttackRecord[];
}


/**
 * Home demolition record
 */
export interface HomeDemolitionRecord {
  date: string;
  region: string;
  type: 'punitive' | 'administrative' | 'military' | string;
  structures: number;
  affectedPeople: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  source: string;
}

/**
 * Aggregated demolition summary
 */
export interface DemolitionSummary {
  totalDemolitions: number;
  totalStructures: number;
  totalAffectedPeople: number;
  byRegion: CategoryData[];
  byType: CategoryData[];
  timeline: TimeSeriesData[];
  recentDemolitions: HomeDemolitionRecord[];
}

/**
 * Child prisoner data (monthly time series)
 */
export interface ChildPrisonerData {
  childPrisonersData: {
    '12 to 15 year olds': YearlyMonthlyData[];
    'Administrative detention': YearlyMonthlyData[];
    'Detention': YearlyMonthlyData[];
    'Female': YearlyMonthlyData[];
  };
}

export interface YearlyMonthlyData {
  year: string;
  months: {
    [month: string]: string | number; // Can be numeric value or "-" for missing data
  };
  timestamp: string;
}

/**
 * Political prisoner record
 */
export interface PoliticalPrisonerRecord {
  id?: string;
  name?: string;
  age?: number;
  gender: string;
  detentionDate: string;
  releaseDate?: string;
  status: 'detained' | 'released' | 'administrative_detention' | string;
  charges?: string;
  location?: string;
  city?: string;
}

/**
 * Aggregated prisoner statistics
 */
export interface PrisonerStatistics {
  total: number;
  children: number;
  political: number;
  byGender: CategoryData[];
  byStatus: CategoryData[];
  byAgeGroup: CategoryData[];
  timeline: TimeSeriesData[];
  averageDetentionDays?: number;
}


/**
 * NGO organization data
 */
export interface NGOOrganization {
  id?: string;
  name: string;
  sector: string;
  operations: string[];
  coverage: string[];
  established?: string;
  beneficiaries?: number;
  funding?: number;
  website?: string;
}

/**
 * NGO data summary
 */
export interface NGODataSummary {
  organizations: NGOOrganization[];
  totalOrganizations: number;
  totalFunding: number;
  totalBeneficiaries: number;
  bySector: CategoryData[];
  byRegion: CategoryData[];
}

// ============================================================================
// WORLD BANK DATA TYPES
// ============================================================================

/**
 * World Bank indicator metadata
 */
export interface WorldBankIndicator {
  code: string;
  name: string;
  category: 'economic' | 'population' | 'labor' | 'poverty' | 'education' | 'health' | 
           'infrastructure' | 'environment' | 'trade' | 'financial' | 'social' | 'other';
  data_points: number;
  unit: string;
  validation: DataQualityMetrics;
}

/**
 * World Bank indicator data point
 */
export interface WorldBankDataPoint {
  year: number;
  value: number;
  indicator: string;
  country: string;
  countryCode: string;
}

/**
 * World Bank metadata
 */
export interface WorldBankMetadata {
  metadata: {
    source: string;
    country: string;
    country_code: string;
    last_updated: string;
    indicators: number;
    total_data_points: number;
  };
  indicators: WorldBankIndicator[];
}

/**
 * Economic indicators aggregated
 */
export interface EconomicIndicators {
  gdp: TimeSeriesData[];
  gdpGrowth: TimeSeriesData[];
  gdpPerCapita: TimeSeriesData[];
  unemployment: {
    total: TimeSeriesData[];
    male: TimeSeriesData[];
    female: TimeSeriesData[];
  };
  poverty: {
    gini: TimeSeriesData[];
    headcountRatio: TimeSeriesData[];
    povertyGap: TimeSeriesData[];
  };
  trade: {
    exports: TimeSeriesData[];
    imports: TimeSeriesData[];
    balance: TimeSeriesData[];
  };
}


/**
 * Population indicators aggregated
 */
export interface PopulationIndicators {
  total: TimeSeriesData[];
  growth: TimeSeriesData[];
  urban: TimeSeriesData[];
  ageGroups: {
    children: TimeSeriesData[]; // 0-14
    workingAge: TimeSeriesData[]; // 15-64
    elderly: TimeSeriesData[]; // 65+
  };
  fertility: TimeSeriesData[];
  lifeExpectancy: TimeSeriesData[];
}

/**
 * Education indicators aggregated
 */
export interface EducationIndicators {
  enrollment: {
    primary: TimeSeriesData[];
    secondary: TimeSeriesData[];
    tertiary: TimeSeriesData[];
  };
  completion: TimeSeriesData[];
  literacy: TimeSeriesData[];
  expenditure: TimeSeriesData[];
}

/**
 * Health indicators aggregated
 */
export interface HealthIndicators {
  mortality: {
    underFive: TimeSeriesData[];
    neonatal: TimeSeriesData[];
    maternal: TimeSeriesData[];
  };
  healthcare: {
    physicians: TimeSeriesData[];
    hospitalBeds: TimeSeriesData[];
    expenditure: TimeSeriesData[];
  };
  immunization: TimeSeriesData[];
  sanitation: {
    water: TimeSeriesData[];
    safelyManaged: TimeSeriesData[];
    basicServices: TimeSeriesData[];
  };
}

/**
 * Infrastructure indicators aggregated
 */
export interface InfrastructureIndicators {
  electricity: {
    access: TimeSeriesData[];
    consumption: TimeSeriesData[];
    losses: TimeSeriesData[];
  };
  telecommunications: {
    internet: TimeSeriesData[];
    mobile: TimeSeriesData[];
    fixedLine: TimeSeriesData[];
    broadband: TimeSeriesData[];
  };
}


// ============================================================================
// HDX DATA TYPES
// ============================================================================

/**
 * HDX dataset metadata
 */
export interface HDXDataset {
  id: string;
  name: string;
  title: string;
  recordCount: number;
  partitioned: boolean;
  partitionCount: number;
  dateRange: string;
  lastModified: string;
  organization: string;
  tags: string[];
  sourceUrl: string;
}

/**
 * HDX catalog structure
 */
export interface HDXCatalog {
  source: string;
  generated_at: string;
  baseline_date: string;
  summary: {
    totalCategories: number;
    totalDatasets: number;
    totalRecords: number;
    totalPartitioned: number;
  };
  categories: {
    [category: string]: {
      name: string;
      datasetCount: number;
      totalRecords: number;
      partitionedDatasets: number;
      datasets: HDXDataset[];
    };
  };
}

// ============================================================================
// DASHBOARD-SPECIFIC AGGREGATED TYPES
// ============================================================================

/**
 * Gaza Healthcare Dashboard data
 */
export interface GazaHealthcareDashboardData {
  summary: {
    totalAttacks: number;
    totalCasualties: number;
    operationalFacilities: number;
    damagedFacilities: number;
    destroyedFacilities: number;
  };
  attacks: HealthcareAttackSummary;
  timeline: TimeSeriesData[];
  facilityStatus: CategoryData[];
  regionalComparison: {
    region: string;
    data: TimeSeriesData[];
  }[];
  dataSource: DataSourceMetadata;
}

/**
 * Gaza Economic Dashboard data
 */
export interface GazaEconomicDashboardData {
  economic: EconomicIndicators;
  population: PopulationIndicators;
  dataSource: DataSourceMetadata;
}


/**
 * Gaza Education Dashboard data
 */
export interface GazaEducationDashboardData {
  education: EducationIndicators;
  schoolDamage?: {
    destroyed: number;
    damaged: number;
    operational: number;
  };
  dataSource: DataSourceMetadata;
  notes?: string; // For indicating estimated/sample data
}

/**
 * Gaza Utilities Dashboard data
 */
export interface GazaUtilitiesDashboardData {
  infrastructure: InfrastructureIndicators;
  health: {
    water: TimeSeriesData[];
    sanitation: TimeSeriesData[];
  };
  dataSource: DataSourceMetadata;
  notes?: string;
}

/**
 * West Bank Prisoners Dashboard data
 */
export interface WestBankPrisonersDashboardData {
  statistics: PrisonerStatistics;
  childPrisoners: ChildPrisonerData;
  politicalPrisoners: PoliticalPrisonerRecord[];
  timeline: TimeSeriesData[];
  demographics: PyramidData[];
  dataSource: DataSourceMetadata;
}

/**
 * West Bank Settlement Dashboard data
 */
export interface WestBankSettlementDashboardData {
  demolitions: DemolitionSummary;
  timeline: TimeSeriesData[];
  regionalImpact: CategoryData[];
  dataSource: DataSourceMetadata;
  notes?: string; // For settlement expansion estimates
}

/**
 * West Bank Economic Dashboard data
 */
export interface WestBankEconomicDashboardData {
  economic: EconomicIndicators;
  population: PopulationIndicators;
  dataSource: DataSourceMetadata;
}

/**
 * Main Casualties Dashboard data
 */
export interface CasualtiesDashboardData {
  summary: GazaSummaryData & WestBankSummaryData;
  dailyCasualties: DailyCasualtyRecord[];
  knownKilled: KnownKilledSummary;
  demographics: PyramidData[];
  timeline: TimeSeriesData[];
  calendarData: CalendarData[];
  categoryBreakdown: CategoryData[];
  weeklyPatterns: {
    category: string;
    data: TimeSeriesData[];
  }[];
  dataSource: DataSourceMetadata;
}


// ============================================================================
// DATA TRANSFORMATION TYPES
// ============================================================================

/**
 * Time range filter options
 */
export type TimeRange = '7d' | '1m' | '3m' | '1y' | 'all';

/**
 * Aggregation period options
 */
export type AggregationPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Data transformation options
 */
export interface TransformOptions {
  timeRange?: TimeRange;
  aggregation?: AggregationPeriod;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Filtered data result
 */
export interface FilteredDataResult<T> {
  data: T[];
  total: number;
  filtered: number;
  filters: TransformOptions;
  metadata: {
    dateRange: {
      start: string;
      end: string;
    };
    appliedFilters: string[];
  };
}

// ============================================================================
// CHART CONFIGURATION TYPES
// ============================================================================

/**
 * Chart data source configuration
 */
export interface ChartDataSource {
  primary: DataSourceMetadata;
  secondary?: DataSourceMetadata[];
  combined?: boolean;
}

/**
 * Chart filter configuration
 */
export interface ChartFilterConfig {
  timeRange: TimeRange[];
  categories?: string[];
  regions?: string[];
  customFilters?: Record<string, any>;
}

/**
 * Complete chart data package
 */
export interface ChartDataPackage<T> {
  data: T;
  metadata: ChartDataSource;
  filters: ChartFilterConfig;
  lastUpdated: string;
  quality: DataQualityMetrics;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  // Re-export commonly used types for convenience
  TimeSeriesData as TimeSeriesDataPoint,
  CategoryData as CategoryDataPoint,
  FlowData as FlowDataPoint,
  PyramidData as PyramidDataPoint,
  CalendarData as CalendarDataPoint,
  EventData as EventDataPoint,
};
