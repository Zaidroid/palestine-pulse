// V3 Data Types for Palestine Dashboard V3

// ============================================
// V3 CONSOLIDATED DATA TYPES
// ============================================

export interface V3ConsolidatedData {
  metadata: {
    version: string;
    lastUpdated: string;
    dashboardVersions: Record<string, string>;
    dataQuality: QualityMetrics;
  };
  gaza: GazaDashboardData;
  westbank: WestBankDashboardData;
  shared: SharedData;
}

export interface QualityMetrics {
  overall: number;
  sources: Record<DataSource, number>;
  lastValidated: string;
  issues: string[];
}

export interface GazaDashboardData {
  humanitarianCrisis: {
    casualties: any[];
    demographics: any;
    pressCasualties: any[];
    lastUpdated: string;
  };
  infrastructureDestruction: {
    buildings: any;
    healthcare: any;
    utilities: any;
    lastUpdated: string;
  };
  populationImpact: {
    displacement: any;
    demographics: any;
    education: any;
    lastUpdated: string;
  };
  aidSurvival: {
    foodSecurity: any;
    healthcare: any;
    utilities: any;
    aid: any;
    lastUpdated: string;
  };
}

export interface WestBankDashboardData {
  occupationMetrics: {
    settlements: any;
    landSeizure: any;
    controlMatrix: any;
    lastUpdated: string;
  };
  settlerViolence: {
    attacks: any;
    demolitions: any;
    agriculture: any;
    lastUpdated: string;
  };
  economicStrangulation: {
    indicators: any;
    trade: any;
    resources: any;
    lastUpdated: string;
  };
  prisonersDetention: {
    statistics: any;
    trends: any;
    conditions: any;
    lastUpdated: string;
  };
}

export interface SharedData {
  timeline: any[];
  analytics: any;
  correlations: any;
  predictions: any;
}

// ============================================
// DASHBOARD CONFIGURATION TYPES
// ============================================

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DATA SOURCE TYPES
// ============================================

export type DataSource =
  | 'tech4palestine'
  | 'un_ocha'
  | 'who'
  | 'world_bank'
  | 'unrwa'
  | 'pcbs'
  | 'btselem'
  | 'wfp'
  | 'goodshepherd'
  | 'custom';

export interface DataSourceConfig {
  name: DataSource;
  baseUrl: string;
  enabled: boolean;
  priority: number;
  cache_ttl: number;
  retry_attempts: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: string;
  source: DataSource;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  source: DataSource;
  timestamp: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface FilterConfig {
  dateRange: {
    start: string;
    end: string;
  };
  regions?: string[];
  demographics?: string[];
  eventTypes?: string[];
  minCasualties?: number;
  maxCasualties?: number;
}

// ============================================
// USER PREFERENCES TYPES
// ============================================

export interface UserPreferences {
  language: 'en' | 'ar' | 'fr' | 'es' | 'he';
  theme: 'light' | 'dark' | 'system';
  defaultDateRange: number;
  notifications: {
    enabled: boolean;
    threshold: number;
    types: string[];
  };
  dashboardLayout?: DashboardLayout;
}