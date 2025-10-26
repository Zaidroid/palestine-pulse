/**
 * DEPRECATED: Use EnhancedDataSourceBadge instead
 * 
 * This file provides backward compatibility wrapper
 * All new code should use EnhancedDataSourceBadge from @/components/v3/shared/EnhancedDataSourceBadge
 */

import { EnhancedDataSourceBadge } from "./EnhancedDataSourceBadge";
import { DataSource } from "@/types/data.types";

interface DataSourceBadgeProps {
  sources: string[];
  quality: "high" | "medium" | "low";
  className?: string;
  lastUpdated?: string;
  updateFrequency?: string;
}

// Helper to map string sources to DataSource types
const mapStringToDataSource = (source: string): DataSource => {
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
  };

  return mapping[source] || 'tech4palestine' as DataSource;
};

/**
 * @deprecated Use EnhancedDataSourceBadge instead
 */
export const DataSourceBadge = ({
  sources,
  quality,
  className,
  lastUpdated,
  updateFrequency
}: DataSourceBadgeProps) => {
  const mappedSources = sources.map(mapStringToDataSource);
  const updateDate = lastUpdated ? new Date(lastUpdated) : new Date();

  return (
    <EnhancedDataSourceBadge
      sources={mappedSources}
      lastRefresh={updateDate}
      showRefreshTime={true}
      showLinks={true}
      compact={false}
      className={className}
    />
  );
};