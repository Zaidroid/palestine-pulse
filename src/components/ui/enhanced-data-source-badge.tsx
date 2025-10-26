/**
 * Enhanced Data Source Badge Component
 * 
 * A modern, animated badge system for displaying data source information with:
 * - Quality indicators (high/medium/low) with icons
 * - Freshness indicators with color coding
 * - Hover popover with detailed information
 * - Click modal for full source attribution
 * - Smooth animations (fade-in, slide-up, hover scale, pulse for stale data)
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Database,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './hover-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { animationTokens } from '@/lib/animation/tokens';
import { slideUpVariants, pulseVariants } from '@/lib/animation/variants';

// ============================================
// TYPES
// ============================================

export interface DataSourceInfo {
  name: string;
  url: string;
  description?: string;
  methodology?: string;
  reliability?: string;
  updateFrequency?: string;
  verificationUrl?: string;
}

export type DataQuality = 'high' | 'medium' | 'low';

export interface EnhancedDataSourceBadgeProps {
  sources: DataSourceInfo[];
  quality: DataQuality;
  lastRefresh: Date;
  className?: string;
  showRefreshTime?: boolean;
  showLinks?: boolean;
  compact?: boolean;
  interactive?: boolean;
  onRefresh?: () => Promise<void>;
}

// ============================================
// QUALITY CONFIGURATION
// ============================================

const qualityConfig = {
  high: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    borderColor: 'border-green-200 dark:border-green-800',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/50',
    label: 'High Quality',
    description: 'Verified data from authoritative sources with recent updates',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    hoverBg: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
    label: 'Medium Quality',
    description: 'Reliable data that may have moderate delays or aggregation',
  },
  low: {
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    borderColor: 'border-orange-200 dark:border-orange-800',
    hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
    label: 'Low Quality',
    description: 'Estimated or modeled data pending verification',
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

const getFreshnessStatus = (lastRefresh: Date) => {
  const minutes = (Date.now() - lastRefresh.getTime()) / 60000;
  
  if (minutes < 60) {
    return {
      label: 'Fresh',
      color: 'text-green-600 dark:text-green-400',
      dotColor: 'bg-green-500',
      isStale: false,
    };
  }
  if (minutes < 1440) {
    return {
      label: 'Recent',
      color: 'text-blue-600 dark:text-blue-400',
      dotColor: 'bg-blue-500',
      isStale: false,
    };
  }
  if (minutes < 10080) {
    return {
      label: 'Stale',
      color: 'text-yellow-600 dark:text-yellow-400',
      dotColor: 'bg-yellow-500',
      isStale: true,
    };
  }
  return {
    label: 'Outdated',
    color: 'text-red-600 dark:text-red-400',
    dotColor: 'bg-red-500',
    isStale: true,
  };
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const badgeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

const hoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

const stalePulseVariants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: animationTokens.easing.easeInOut,
    },
  },
};

// ============================================
// MAIN COMPONENT
// ============================================

export const EnhancedDataSourceBadge = ({
  sources,
  quality,
  lastRefresh,
  className,
  showRefreshTime = true,
  showLinks = true,
  compact = false,
  interactive = true,
  onRefresh,
}: EnhancedDataSourceBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const config = qualityConfig[quality];
  const QualityIcon = config.icon;
  const primarySource = sources[0];
  const additionalSources = sources.slice(1);
  
  const timeAgo = useMemo(() => formatTimeAgo(lastRefresh), [lastRefresh]);
  const freshnessStatus = useMemo(() => getFreshnessStatus(lastRefresh), [lastRefresh]);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleSourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (interactive) {
      setIsModalOpen(true);
    }
  };

  // Compact version for minimal display
  if (compact) {
    return (
      <motion.div
        variants={badgeVariants}
        initial="hidden"
        animate="visible"
        className={cn('inline-flex items-center gap-2', className)}
      >
        <Badge variant="outline" className="text-xs">
          <Database className="h-3 w-3 mr-1" />
          {primarySource?.name || 'Unknown'}
          {additionalSources.length > 0 && ` +${additionalSources.length}`}
        </Badge>
        {showRefreshTime && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className={cn('inline-flex items-center gap-2', className)}
          >
            {/* Main Badge */}
            <motion.div
              variants={freshnessStatus.isStale ? stalePulseVariants : hoverVariants}
              initial="rest"
              whileHover="hover"
              animate={freshnessStatus.isStale ? 'pulse' : 'rest'}
            >
              <Badge
                variant="outline"
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  config.bgColor,
                  config.borderColor,
                  config.hoverBg,
                  'hover:shadow-md'
                )}
                onClick={handleBadgeClick}
              >
                <QualityIcon className={cn('h-3 w-3 mr-1.5', config.color)} />
                <span className="text-xs font-medium">{primarySource?.name || 'Unknown'}</span>
                {additionalSources.length > 0 && (
                  <span className="ml-1 text-xs opacity-70">+{additionalSources.length}</span>
                )}
                {showLinks && interactive && (
                  <Info className="h-3 w-3 ml-1.5 opacity-50" />
                )}
              </Badge>
            </motion.div>

            {/* Freshness Indicator */}
            {showRefreshTime && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <motion.div
                  className={cn('h-2 w-2 rounded-full', freshnessStatus.dotColor)}
                  animate={freshnessStatus.isStale ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={
                    freshnessStatus.isStale
                      ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      : {}
                  }
                />
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefresh();
                    }}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={cn('h-3 w-3', isRefreshing && 'animate-spin')}
                    />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </HoverCardTrigger>

        {/* Hover Popover */}
        <HoverCardContent className="w-80 p-4" side="top" align="start">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Quality Header */}
            <div className="flex items-center gap-2">
              <QualityIcon className={cn('h-4 w-4', config.color)} />
              <div>
                <h4 className="text-sm font-semibold">{config.label}</h4>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </div>

            {/* Primary Source */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Primary Source
              </h5>
              <div
                className="p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                onClick={() => primarySource && handleSourceClick(primarySource.url)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{primarySource?.name}</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </div>
                {primarySource?.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {primarySource.description}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Sources */}
            {additionalSources.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Additional Sources ({additionalSources.length})
                </h5>
                {additionalSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 rounded hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleSourceClick(source.url)}
                  >
                    <span className="text-sm">{source.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </div>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Last Updated
                </span>
                <span className={cn('font-medium', freshnessStatus.color)}>
                  {timeAgo} • {freshnessStatus.label}
                </span>
              </div>
            </div>

            {/* Click for more info */}
            {interactive && (
              <div className="pt-2 border-t">
                <button
                  className="w-full text-xs text-primary hover:text-primary/80 flex items-center justify-center gap-1.5 py-1 transition-colors"
                  onClick={handleBadgeClick}
                >
                  <Info className="h-3 w-3" />
                  Click badge for full details
                </button>
              </div>
            )}
          </motion.div>
        </HoverCardContent>
      </HoverCard>

      {/* Full Details Modal */}
      <DataSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sources={sources}
        quality={quality}
        lastRefresh={lastRefresh}
        freshnessStatus={freshnessStatus}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        handleSourceClick={handleSourceClick}
      />
    </>
  );
};

// ============================================
// DATA SOURCE MODAL COMPONENT
// ============================================

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DataSourceInfo[];
  quality: DataQuality;
  lastRefresh: Date;
  freshnessStatus: ReturnType<typeof getFreshnessStatus>;
  onRefresh?: () => Promise<void>;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleSourceClick: (url: string) => void;
}

const DataSourceModal = ({
  isOpen,
  onClose,
  sources,
  quality,
  lastRefresh,
  freshnessStatus,
  onRefresh,
  isRefreshing,
  handleRefresh,
  handleSourceClick,
}: DataSourceModalProps) => {
  const config = qualityConfig[quality];
  const QualityIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Source Attribution
          </DialogTitle>
          <DialogDescription>
            Detailed information about data sources, quality, and methodology
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 mt-4"
        >
          {/* Quality Overview */}
          <div className={cn('p-4 rounded-lg border', config.bgColor, config.borderColor)}>
            <div className="flex items-start gap-3">
              <QualityIcon className={cn('h-5 w-5 mt-0.5', config.color)} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{config.label}</h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {formatTimeAgo(lastRefresh)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn('text-xs', freshnessStatus.color)}
                  >
                    <div className={cn('h-2 w-2 rounded-full mr-1', freshnessStatus.dotColor)} />
                    {freshnessStatus.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Data Sources ({sources.length})</h3>
            {sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="space-y-3">
                  {/* Source Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{source.name}</h4>
                      {source.description && (
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSourceClick(source.url)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Source Metadata */}
                  {(source.reliability || source.updateFrequency) && (
                    <div className="flex flex-wrap gap-2">
                      {source.reliability && (
                        <Badge variant="outline" className="text-xs">
                          Reliability: {source.reliability}
                        </Badge>
                      )}
                      {source.updateFrequency && (
                        <Badge variant="outline" className="text-xs">
                          Updates: {source.updateFrequency}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Methodology */}
                  {source.methodology && (
                    <div className="pt-2 border-t">
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Methodology
                      </h5>
                      <p className="text-sm text-muted-foreground">{source.methodology}</p>
                    </div>
                  )}

                  {/* Verification Link */}
                  {source.verificationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleSourceClick(source.verificationUrl!)}
                    >
                      <Info className="h-3 w-3 mr-2" />
                      View Verification Details
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
                {isRefreshing ? 'Refreshing Data...' : 'Refresh Data'}
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
