/**
 * D3 Chart Component Types
 * 
 * Common interfaces and types for all D3 chart components
 */

export type TimeFilter = 'week' | 'month' | 'quarter' | 'year' | 'all';

export type ChartType = 
  | 'area' 
  | 'bar' 
  | 'donut' 
  | 'stream' 
  | 'radar' 
  | 'sankey' 
  | 'violin' 
  | 'chord' 
  | 'calendar' 
  | 'pyramid' 
  | 'isotype' 
  | 'waffle' 
  | 'timeline' 
  | 'smallmultiples' 
  | 'horizon';

/**
 * Data source metadata for attribution
 */
export interface DataSourceMetadata {
  source: string;
  url?: string;
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  methodology: string;
  recordCount?: number;
}

/**
 * Base props for all D3 chart components
 */
export interface D3ChartProps {
  data: any[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  theme?: 'light' | 'dark';
  locale?: 'en' | 'ar';
  animated?: boolean;
  interactive?: boolean;
  onDataPointClick?: (data: any) => void;
  onDataPointHover?: (data: any) => void;
}

/**
 * Props for ChartCard wrapper component
 */
export interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  badge: string;
  children: React.ReactNode;
  dataSource: DataSourceMetadata;
  chartType: ChartType;
  filters?: {
    enabled: boolean;
    defaultFilter?: TimeFilter;
    onFilterChange?: (filter: TimeFilter) => void;
  };
  exportEnabled?: boolean;
  shareEnabled?: boolean;
  onExport?: () => void;
  onShare?: () => void;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  id: TimeFilter;
  label: string;
}

/**
 * Common data structures for charts
 */
export interface TimeSeriesData {
  date: string | Date;
  value: number;
  category?: string;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface FlowData {
  source: string;
  target: string;
  value: number;
}

export interface PyramidData {
  ageGroup: string;
  male: number;
  female: number;
}

export interface CalendarData {
  date: string;
  value: number;
  intensity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface EventData {
  date: string;
  title: string;
  description: string;
  type: 'ceasefire' | 'escalation' | 'humanitarian' | 'political';
}
