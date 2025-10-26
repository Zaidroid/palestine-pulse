/**
 * Data Source Metadata Service
 * 
 * Provides comprehensive metadata about all data sources including:
 * - Source information and attribution
 * - Quality indicators and reliability metrics
 * - Update frequencies and freshness tracking
 * - Links to original sources for verification
 */

import { DataSource } from '@/types/data.types';

export interface DataSourceMetadata {
  id: DataSource;
  name: string;
  fullName: string;
  description: string;
  url: string;
  verificationUrl?: string;
  reliability: 'high' | 'medium' | 'low';
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  dataTypes: string[];
  methodology?: string;
  lastVerified?: Date;
  credibilityScore: number; // 0-100
  icon?: string;
  color?: string;
}

export interface MetricAttribution {
  metricName: string;
  primarySource: DataSource;
  secondarySources?: DataSource[];
  lastUpdated: Date;
  quality: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  verificationLinks: string[];
  methodology?: string;
}

export interface DataQualityBadge {
  level: 'verified' | 'reliable' | 'estimated' | 'unverified';
  color: string;
  icon: string;
  description: string;
  showWarning: boolean;
}

export interface FreshnessIndicator {
  status: 'fresh' | 'recent' | 'stale' | 'outdated';
  color: string;
  icon: string;
  description: string;
  minutesAgo: number;
}

// ============================================
// DATA SOURCE METADATA REGISTRY
// ============================================

export const DATA_SOURCE_REGISTRY: Record<DataSource, DataSourceMetadata> = {
  tech4palestine: {
    id: 'tech4palestine',
    name: 'Tech4Palestine',
    fullName: 'Tech for Palestine',
    description: 'Comprehensive database of casualties and infrastructure damage in Gaza, verified through multiple sources',
    url: 'https://data.techforpalestine.org',
    verificationUrl: 'https://data.techforpalestine.org/docs/methodology',
    reliability: 'high',
    updateFrequency: 'daily',
    dataTypes: ['casualties', 'demographics', 'infrastructure', 'press casualties'],
    methodology: 'Cross-referenced data from Palestinian Ministry of Health, UN agencies, and verified media reports',
    credibilityScore: 95,
    icon: '🔬',
    color: '#3b82f6',
  },
  goodshepherd: {
    id: 'goodshepherd',
    name: 'Good Shepherd',
    fullName: 'Good Shepherd Collective',
    description: 'Detailed documentation of violence, demolitions, and human rights violations in Palestine',
    url: 'https://www.goodshepherdcollective.org',
    verificationUrl: 'https://www.goodshepherdcollective.org/data',
    reliability: 'high',
    updateFrequency: 'daily',
    dataTypes: ['violence', 'demolitions', 'settlements', 'prisoners', 'healthcare attacks'],
    methodology: 'Field documentation, witness testimonies, and verified incident reports',
    credibilityScore: 92,
    icon: '📋',
    color: '#10b981',
  },
  un_ocha: {
    id: 'un_ocha',
    name: 'UN OCHA',
    fullName: 'United Nations Office for the Coordination of Humanitarian Affairs',
    description: 'Official UN humanitarian data on displacement, aid, and crisis response',
    url: 'https://www.ochaopt.org',
    verificationUrl: 'https://data.humdata.org/organization/ocha-opt',
    reliability: 'high',
    updateFrequency: 'daily',
    dataTypes: ['displacement', 'humanitarian aid', 'utilities', 'access restrictions'],
    methodology: 'UN field assessments and humanitarian partner reports',
    credibilityScore: 98,
    icon: '🇺🇳',
    color: '#0ea5e9',
  },
  world_bank: {
    id: 'world_bank',
    name: 'World Bank',
    fullName: 'World Bank Open Data',
    description: 'Economic indicators and development data for Palestinian territories',
    url: 'https://data.worldbank.org',
    verificationUrl: 'https://data.worldbank.org/country/west-bank-and-gaza',
    reliability: 'high',
    updateFrequency: 'monthly',
    dataTypes: ['economic indicators', 'GDP', 'unemployment', 'trade'],
    methodology: 'Official economic statistics and World Bank assessments',
    credibilityScore: 94,
    icon: '🏦',
    color: '#8b5cf6',
  },
  wfp: {
    id: 'wfp',
    name: 'WFP',
    fullName: 'World Food Programme',
    description: 'Food security assessments and humanitarian food assistance data',
    url: 'https://www.wfp.org',
    verificationUrl: 'https://data.humdata.org/organization/wfp',
    reliability: 'high',
    updateFrequency: 'weekly',
    dataTypes: ['food security', 'nutrition', 'humanitarian assistance'],
    methodology: 'Food security assessments and household surveys',
    credibilityScore: 96,
    icon: '🌾',
    color: '#f59e0b',
  },
  btselem: {
    id: 'btselem',
    name: "B'Tselem",
    fullName: "B'Tselem - The Israeli Information Center for Human Rights",
    description: 'Comprehensive documentation of human rights violations and occupation policies',
    url: 'https://www.btselem.org',
    verificationUrl: 'https://www.btselem.org/statistics',
    reliability: 'high',
    updateFrequency: 'daily',
    dataTypes: ['checkpoints', 'demolitions', 'settlements', 'restrictions'],
    methodology: 'Field research, legal documentation, and verified testimonies',
    credibilityScore: 93,
    icon: '⚖️',
    color: '#ef4444',
  },
  who: {
    id: 'who',
    name: 'WHO',
    fullName: 'World Health Organization',
    description: 'Health system status and medical facility damage assessments',
    url: 'https://www.who.int',
    verificationUrl: 'https://www.emro.who.int/countries/pse/index.html',
    reliability: 'high',
    updateFrequency: 'weekly',
    dataTypes: ['healthcare facilities', 'medical supplies', 'health emergencies'],
    methodology: 'WHO field assessments and health partner reports',
    credibilityScore: 97,
    icon: '🏥',
    color: '#06b6d4',
  },
  unrwa: {
    id: 'unrwa',
    name: 'UNRWA',
    fullName: 'United Nations Relief and Works Agency',
    description: 'Palestinian refugee services and education data',
    url: 'https://www.unrwa.org',
    verificationUrl: 'https://www.unrwa.org/resources/reports',
    reliability: 'high',
    updateFrequency: 'weekly',
    dataTypes: ['education', 'refugees', 'schools', 'services'],
    methodology: 'UNRWA operational data and field reports',
    credibilityScore: 96,
    icon: '🎓',
    color: '#14b8a6',
  },
  pcbs: {
    id: 'pcbs',
    name: 'PCBS',
    fullName: 'Palestinian Central Bureau of Statistics',
    description: 'Official Palestinian demographic and statistical data',
    url: 'http://www.pcbs.gov.ps',
    verificationUrl: 'http://www.pcbs.gov.ps/default.aspx',
    reliability: 'high',
    updateFrequency: 'monthly',
    dataTypes: ['demographics', 'population', 'census', 'statistics'],
    methodology: 'Official census and statistical surveys',
    credibilityScore: 91,
    icon: '📊',
    color: '#a855f7',
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    fullName: 'Custom Data Source',
    description: 'User-provided or aggregated data',
    url: '',
    reliability: 'medium',
    updateFrequency: 'daily',
    dataTypes: ['various'],
    credibilityScore: 70,
    icon: '📁',
    color: '#6b7280',
  },
};

// ============================================
// DATA SOURCE METADATA SERVICE
// ============================================

class DataSourceMetadataService {
  /**
   * Get metadata for a specific data source
   */
  getSourceMetadata(source: DataSource): DataSourceMetadata {
    return DATA_SOURCE_REGISTRY[source] || DATA_SOURCE_REGISTRY.custom;
  }

  /**
   * Get metadata for multiple sources
   */
  getMultipleSourceMetadata(sources: DataSource[]): DataSourceMetadata[] {
    return sources.map(source => this.getSourceMetadata(source));
  }

  /**
   * Get quality badge information based on source reliability
   */
  getQualityBadge(source: DataSource, lastUpdated?: Date): DataQualityBadge {
    const metadata = this.getSourceMetadata(source);
    const minutesAgo = lastUpdated ? (Date.now() - lastUpdated.getTime()) / 60000 : Infinity;

    // Determine quality level based on reliability and freshness
    let level: DataQualityBadge['level'];
    let showWarning = false;

    if (metadata.reliability === 'high' && minutesAgo < 1440) { // Less than 24 hours
      level = 'verified';
    } else if (metadata.reliability === 'high' || (metadata.reliability === 'medium' && minutesAgo < 1440)) {
      level = 'reliable';
    } else if (metadata.reliability === 'medium') {
      level = 'estimated';
      showWarning = minutesAgo > 10080; // More than 7 days
    } else {
      level = 'unverified';
      showWarning = true;
    }

    const badgeConfig = {
      verified: {
        color: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800',
        icon: 'CheckCircle2',
        description: 'Verified data from authoritative sources with recent updates',
      },
      reliable: {
        color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        icon: 'Shield',
        description: 'Reliable data from trusted sources',
      },
      estimated: {
        color: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        icon: 'AlertCircle',
        description: 'Estimated or aggregated data that may have moderate delays',
      },
      unverified: {
        color: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        icon: 'AlertTriangle',
        description: 'Unverified data pending confirmation from primary sources',
      },
    };

    return {
      level,
      showWarning,
      ...badgeConfig[level],
    };
  }

  /**
   * Get freshness indicator based on last update time
   */
  getFreshnessIndicator(lastUpdated: Date, updateFrequency: DataSourceMetadata['updateFrequency']): FreshnessIndicator {
    const minutesAgo = (Date.now() - lastUpdated.getTime()) / 60000;

    // Define freshness thresholds based on update frequency
    const thresholds = {
      'real-time': { fresh: 5, recent: 15, stale: 60 },
      'hourly': { fresh: 60, recent: 180, stale: 360 },
      'daily': { fresh: 1440, recent: 2880, stale: 7200 },
      'weekly': { fresh: 10080, recent: 20160, stale: 43200 },
      'monthly': { fresh: 43200, recent: 86400, stale: 129600 },
    };

    const threshold = thresholds[updateFrequency];

    let status: FreshnessIndicator['status'];
    let color: string;
    let icon: string;
    let description: string;

    if (minutesAgo < threshold.fresh) {
      status = 'fresh';
      color = 'text-green-600 dark:text-green-400';
      icon = 'CheckCircle2';
      description = 'Data is up to date';
    } else if (minutesAgo < threshold.recent) {
      status = 'recent';
      color = 'text-blue-600 dark:text-blue-400';
      icon = 'Clock';
      description = 'Data is recent';
    } else if (minutesAgo < threshold.stale) {
      status = 'stale';
      color = 'text-yellow-600 dark:text-yellow-400';
      icon = 'AlertCircle';
      description = 'Data may be outdated';
    } else {
      status = 'outdated';
      color = 'text-red-600 dark:text-red-400';
      icon = 'AlertTriangle';
      description = 'Data needs refresh';
    }

    return {
      status,
      color,
      icon,
      description,
      minutesAgo,
    };
  }

  /**
   * Create metric attribution information
   */
  createMetricAttribution(
    metricName: string,
    primarySource: DataSource,
    lastUpdated: Date,
    secondarySources?: DataSource[]
  ): MetricAttribution {
    const primaryMetadata = this.getSourceMetadata(primarySource);
    const qualityBadge = this.getQualityBadge(primarySource, lastUpdated);

    // Calculate confidence based on source reliability and freshness
    const freshnessIndicator = this.getFreshnessIndicator(lastUpdated, primaryMetadata.updateFrequency);
    const freshnessScore = {
      fresh: 100,
      recent: 85,
      stale: 60,
      outdated: 40,
    }[freshnessIndicator.status];

    const confidence = Math.round((primaryMetadata.credibilityScore + freshnessScore) / 2);

    // Determine quality level
    let quality: 'high' | 'medium' | 'low';
    if (qualityBadge.level === 'verified') {
      quality = 'high';
    } else if (qualityBadge.level === 'reliable' || qualityBadge.level === 'estimated') {
      quality = 'medium';
    } else {
      quality = 'low';
    }

    // Build verification links
    const verificationLinks: string[] = [primaryMetadata.url];
    if (primaryMetadata.verificationUrl) {
      verificationLinks.push(primaryMetadata.verificationUrl);
    }

    return {
      metricName,
      primarySource,
      secondarySources,
      lastUpdated,
      quality,
      confidence,
      verificationLinks,
      methodology: primaryMetadata.methodology,
    };
  }

  /**
   * Get all available data sources
   */
  getAllSources(): DataSourceMetadata[] {
    return Object.values(DATA_SOURCE_REGISTRY).filter(source => source.id !== 'custom');
  }

  /**
   * Get sources by reliability level
   */
  getSourcesByReliability(reliability: 'high' | 'medium' | 'low'): DataSourceMetadata[] {
    return this.getAllSources().filter(source => source.reliability === reliability);
  }

  /**
   * Get sources by data type
   */
  getSourcesByDataType(dataType: string): DataSourceMetadata[] {
    return this.getAllSources().filter(source =>
      source.dataTypes.some(type => type.toLowerCase().includes(dataType.toLowerCase()))
    );
  }

  /**
   * Format time ago string
   */
  formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dataSourceMetadataService = new DataSourceMetadataService();
