/**
 * DEPRECATED: Use EnhancedDataSourceBadge instead
 * 
 * This file provides backward compatibility wrappers
 * All new code should use EnhancedDataSourceBadge from @/components/v3/shared/EnhancedDataSourceBadge
 */

import { EnhancedDataSourceBadge } from '@/components/v3/shared/EnhancedDataSourceBadge';
import { DataSource } from '@/types/data.types';

export interface DataQualityBadgeProps {
  source: string;
  isRealData: boolean;
  recordCount?: number;
  lastUpdated?: Date | string;
  className?: string;
  showDetails?: boolean;
}

// Helper to map string sources to DataSource types
const mapStringToDataSource = (source: string): DataSource[] => {
  const mapping: Record<string, DataSource> = {
    'T4P': 'tech4palestine',
    'Tech4Palestine': 'tech4palestine',
    'Tech for Palestine': 'tech4palestine',
    'WFP': 'wfp',
    'World Food Programme': 'wfp',
    'UN': 'un_ocha',
    'UN OCHA': 'un_ocha',
    'OCHA': 'un_ocha',
    'HDX': 'un_ocha',
    'WHO': 'who',
    'World Health Organization': 'who',
    'UNRWA': 'unrwa',
    'PCBS': 'pcbs',
    'Palestinian Central Bureau of Statistics': 'pcbs',
    'World Bank': 'world_bank',
    'B\'Tselem': 'btselem',
    'Btselem': 'btselem',
    'Good Shepherd': 'goodshepherd',
    'Good Shepherd Collective': 'goodshepherd',
    'MOH': 'tech4palestine',
    'UNICEF': 'un_ocha',
    'Save the Children': 'un_ocha',
    'Health Facilities': 'who',
    'Manual tracking from UN records': 'un_ocha',
    'B\'Tselem partnership pending': 'btselem',
    'Inferred from infrastructure damage': 'tech4palestine',
  };

  // Handle compound sources like "Tech4Palestine + Good Shepherd + World Bank"
  const sources = source.split(/\s*\+\s*/).map(s => s.trim());
  return sources
    .map(s => mapping[s] || 'tech4palestine' as DataSource)
    .filter((value, index, self) => self.indexOf(value) === index);
};

/**
 * @deprecated Use EnhancedDataSourceBadge instead
 */
export const DataQualityBadge = ({
  source,
  isRealData,
  lastUpdated,
  className,
}: DataQualityBadgeProps) => {
  const sources = mapStringToDataSource(source);
  const updateDate = lastUpdated ? new Date(lastUpdated) : new Date();

  return (
    <EnhancedDataSourceBadge
      sources={sources}
      lastRefresh={updateDate}
      showRefreshTime={true}
      showLinks={true}
      compact={true}
      className={className}
    />
  );
};

/**
 * @deprecated Use EnhancedDataSourceBadge instead
 */
export const DataSourceBadge = ({
  source,
  isRealData,
  className,
}: Pick<DataQualityBadgeProps, 'source' | 'isRealData' | 'className'>) => {
  const sources = mapStringToDataSource(source);

  return (
    <EnhancedDataSourceBadge
      sources={sources}
      lastRefresh={new Date()}
      showRefreshTime={false}
      showLinks={true}
      compact={true}
      className={className}
    />
  );
};

/**
 * @deprecated Use EnhancedDataSourceBadge with loading state instead
 */
export const DataLoadingBadge = ({ 
  className 
}: { 
  className?: string 
}) => {
  return (
    <EnhancedDataSourceBadge
      sources={['tech4palestine']}
      lastRefresh={new Date()}
      showRefreshTime={false}
      showLinks={false}
      compact={true}
      className={className}
    />
  );
};

/**
 * @deprecated Use EnhancedDataSourceBadge instead
 */
export const DataErrorBadge = ({ 
  className,
  message = "Data unavailable"
}: { 
  className?: string;
  message?: string;
}) => {
  return (
    <EnhancedDataSourceBadge
      sources={['tech4palestine']}
      lastRefresh={new Date()}
      showRefreshTime={false}
      showLinks={false}
      compact={true}
      className={className}
    />
  );
};