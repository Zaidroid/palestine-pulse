/**
 * Enhanced Data Quality Badge System
 * 
 * Provides comprehensive quality indicators including:
 * - Reliability levels with visual badges
 * - Data freshness indicators with timestamps
 * - Warning indicators for unavailable or stale data
 * - Animated status updates
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Shield,
  AlertCircle,
  AlertTriangle,
  Clock,
  WifiOff,
  RefreshCw,
  TrendingUp,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DataSource } from '@/types/data.types';
import {
  dataSourceMetadataService,
  DataSourceMetadata,
} from '@/services/dataSourceMetadataService';

export type QualityLevel = 'verified' | 'reliable' | 'estimated' | 'unverified' | 'unavailable';
export type FreshnessLevel = 'fresh' | 'recent' | 'stale' | 'outdated';

interface EnhancedDataQualityBadgeProps {
  source: DataSource;
  lastUpdated?: Date;
  showFreshness?: boolean;
  showReliability?: boolean;
  showWarnings?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  onRefresh?: () => void;
}

export const EnhancedDataQualityBadge = ({
  source,
  lastUpdated = new Date(),
  showFreshness = true,
  showReliability = true,
  showWarnings = true,
  size = 'md',
  animated = true,
  className,
  onRefresh,
}: EnhancedDataQualityBadgeProps) => {
  const metadata = dataSourceMetadataService.getSourceMetadata(source);
  const qualityBadge = dataSourceMetadataService.getQualityBadge(source, lastUpdated);
  const freshnessIndicator = dataSourceMetadataService.getFreshnessIndicator(
    lastUpdated,
    metadata.updateFrequency
  );

  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Quality Badge */}
      {showReliability && (
        <QualityBadge
          metadata={metadata}
          qualityBadge={qualityBadge}
          size={size}
          sizeClasses={sizeClasses}
          iconSizes={iconSizes}
          animated={animated}
        />
      )}

      {/* Freshness Badge */}
      {showFreshness && (
        <FreshnessBadge
          freshnessIndicator={freshnessIndicator}
          lastUpdated={lastUpdated}
          size={size}
          sizeClasses={sizeClasses}
          iconSizes={iconSizes}
          animated={animated}
          onRefresh={onRefresh}
        />
      )}

      {/* Warning Badge */}
      {showWarnings && qualityBadge.showWarning && (
        <WarningBadge
          size={size}
          sizeClasses={sizeClasses}
          iconSizes={iconSizes}
          animated={animated}
        />
      )}
    </div>
  );
};

// ============================================
// QUALITY BADGE
// ============================================

interface QualityBadgeProps {
  metadata: DataSourceMetadata;
  qualityBadge: ReturnType<typeof dataSourceMetadataService.getQualityBadge>;
  size: 'sm' | 'md' | 'lg';
  sizeClasses: Record<string, string>;
  iconSizes: Record<string, string>;
  animated: boolean;
}

const QualityBadge = ({
  metadata,
  qualityBadge,
  size,
  sizeClasses,
  iconSizes,
  animated,
}: QualityBadgeProps) => {
  const QualityIcon = {
    CheckCircle2,
    Shield,
    AlertCircle,
    AlertTriangle,
  }[qualityBadge.icon] || CheckCircle2;

  const badgeContent = (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.2 }}
    >
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 font-medium transition-all duration-200',
          sizeClasses[size],
          qualityBadge.color
        )}
      >
        <QualityIcon className={iconSizes[size]} />
        <span className="capitalize">{qualityBadge.level}</span>
        <div className="flex items-center gap-0.5 ml-1">
          <TrendingUp className={cn(iconSizes[size], 'opacity-70')} />
          <span className="text-xs opacity-70">{metadata.credibilityScore}%</span>
        </div>
      </Badge>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-sm">{qualityBadge.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Source: {metadata.fullName}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t">
              <span className="text-muted-foreground">Credibility Score:</span>
              <span className="font-medium">{metadata.credibilityScore}%</span>
            </div>
            {metadata.methodology && (
              <div className="text-xs pt-2 border-t">
                <p className="text-muted-foreground mb-1">Methodology:</p>
                <p>{metadata.methodology}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// FRESHNESS BADGE
// ============================================

interface FreshnessBadgeProps {
  freshnessIndicator: ReturnType<typeof dataSourceMetadataService.getFreshnessIndicator>;
  lastUpdated: Date;
  size: 'sm' | 'md' | 'lg';
  sizeClasses: Record<string, string>;
  iconSizes: Record<string, string>;
  animated: boolean;
  onRefresh?: () => void;
}

const FreshnessBadge = ({
  freshnessIndicator,
  lastUpdated,
  size,
  sizeClasses,
  iconSizes,
  animated,
  onRefresh,
}: FreshnessBadgeProps) => {
  const FreshnessIcon = {
    CheckCircle2,
    Clock,
    AlertCircle,
    AlertTriangle,
  }[freshnessIndicator.icon] || Clock;

  const getBadgeColor = () => {
    switch (freshnessIndicator.status) {
      case 'fresh':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800';
      case 'recent':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'stale':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800';
      case 'outdated':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800';
    }
  };

  const badgeContent = (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="relative"
    >
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 font-medium transition-all duration-200',
          sizeClasses[size],
          getBadgeColor()
        )}
      >
        <motion.div
          animate={
            animated && freshnessIndicator.status === 'fresh'
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <FreshnessIcon className={iconSizes[size]} />
        </motion.div>
        <span>{dataSourceMetadataService.formatTimeAgo(lastUpdated)}</span>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <RefreshCw className={iconSizes[size]} />
          </motion.button>
        )}
      </Badge>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{freshnessIndicator.description}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Last updated: {lastUpdated.toLocaleString()}</p>
              <p>Status: {freshnessIndicator.status}</p>
              {onRefresh && (
                <p className="text-primary mt-1">Click refresh icon to update</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// WARNING BADGE
// ============================================

interface WarningBadgeProps {
  size: 'sm' | 'md' | 'lg';
  sizeClasses: Record<string, string>;
  iconSizes: Record<string, string>;
  animated: boolean;
}

const WarningBadge = ({
  size,
  sizeClasses,
  iconSizes,
  animated,
}: WarningBadgeProps) => {
  const badgeContent = (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8 } : false}
      animate={
        animated
          ? {
              opacity: 1,
              scale: 1,
            }
          : false
      }
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 font-medium transition-all duration-200',
          sizeClasses[size],
          'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800'
        )}
      >
        <motion.div
          animate={
            animated
              ? {
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <AlertTriangle className={iconSizes[size]} />
        </motion.div>
        <span>Verify Data</span>
      </Badge>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Data Verification Recommended</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This data may be outdated or from a less reliable source. Please verify
                  with the original source before making critical decisions.
                </p>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// UNAVAILABLE BADGE
// ============================================

interface UnavailableBadgeProps {
  source: DataSource;
  reason?: string;
  size?: 'sm' | 'md' | 'lg';
  onRetry?: () => void;
}

export const UnavailableBadge = ({
  source,
  reason = 'Data source is currently unavailable',
  size = 'md',
  onRetry,
}: UnavailableBadgeProps) => {
  const metadata = dataSourceMetadataService.getSourceMetadata(source);

  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  const badgeContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 font-medium transition-all duration-200',
          sizeClasses[size],
          'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800'
        )}
      >
        <WifiOff className={iconSizes[size]} />
        <span>Unavailable</span>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <RefreshCw className={iconSizes[size]} />
          </motion.button>
        )}
      </Badge>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <WifiOff className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Data Source Unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metadata.fullName} is currently unavailable.
                </p>
                <p className="text-xs text-muted-foreground mt-1">{reason}</p>
                {onRetry && (
                  <p className="text-xs text-primary mt-2">Click refresh to retry</p>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// COMPOSITE QUALITY INDICATOR
// ============================================

interface CompositeQualityIndicatorProps {
  sources: DataSource[];
  lastUpdated?: Date;
  className?: string;
}

export const CompositeQualityIndicator = ({
  sources,
  lastUpdated = new Date(),
  className,
}: CompositeQualityIndicatorProps) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  // Calculate overall quality from all sources
  const qualityScores = sources.map((source) => {
    const metadata = dataSourceMetadataService.getSourceMetadata(source);
    return metadata.credibilityScore;
  });

  const averageScore = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;

  let overallQuality: QualityLevel;
  if (averageScore >= 90) {
    overallQuality = 'verified';
  } else if (averageScore >= 75) {
    overallQuality = 'reliable';
  } else if (averageScore >= 60) {
    overallQuality = 'estimated';
  } else {
    overallQuality = 'unverified';
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Overall Quality:</span>
        <Badge
          variant="outline"
          className={cn(
            'text-xs',
            overallQuality === 'verified' &&
              'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
            overallQuality === 'reliable' &&
              'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
            overallQuality === 'estimated' &&
              'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
            overallQuality === 'unverified' &&
              'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
          )}
        >
          {averageScore.toFixed(0)}% {overallQuality}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {sources.map((source) => (
          <EnhancedDataQualityBadge
            key={source}
            source={source}
            lastUpdated={lastUpdated}
            size="sm"
            showFreshness={false}
            showWarnings={false}
          />
        ))}
      </div>
    </div>
  );
};
