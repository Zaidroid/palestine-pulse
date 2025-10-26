/**
 * Unified Badge Component
 * Single source of truth for all data source and quality badges
 */

import { EnhancedDataSourceBadge } from '@/components/v3/shared/EnhancedDataSourceBadge';
import { DataSource } from '@/types/data.types';

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

interface UnifiedBadgeProps {
  source: string;
  lastUpdated?: Date | string;
  className?: string;
  compact?: boolean;
  showRefreshTime?: boolean;
}

/**
 * Unified Badge - Use this for all data source badges
 */
export const UnifiedBadge = ({
  source,
  lastUpdated,
  className,
  compact = true,
  showRefreshTime = true,
}: UnifiedBadgeProps) => {
  const sources = mapStringToDataSource(source);
  const updateDate = lastUpdated ? new Date(lastUpdated) : new Date();

  return (
    <EnhancedDataSourceBadge
      sources={sources}
      lastRefresh={updateDate}
      showRefreshTime={showRefreshTime}
      showLinks={true}
      compact={compact}
      className={className}
    />
  );
};

// Export for backward compatibility
export { UnifiedBadge as DataQualityBadge };
export { UnifiedBadge as DataSourceBadge };
export { UnifiedBadge as DataLoadingBadge };
