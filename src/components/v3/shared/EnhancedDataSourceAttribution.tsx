/**
 * Enhanced Data Source Attribution Component
 * 
 * Provides comprehensive, clickable data source attribution with:
 * - Clear source labels and metadata
 * - Quality indicators and reliability scores
 * - Links to original data sources for verification
 * - Detailed hover information
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Shield,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Info,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonInteraction, badgeInteraction } from '@/lib/interaction-polish';
import { DataSource } from '@/types/data.types';
import {
  dataSourceMetadataService,
  DataSourceMetadata,
} from '@/services/dataSourceMetadataService';

interface EnhancedDataSourceAttributionProps {
  sources: DataSource[];
  lastUpdated?: Date;
  className?: string;
  showQuality?: boolean;
  showFreshness?: boolean;
  compact?: boolean;
  onClick?: (source: DataSource) => void;
}

export const EnhancedDataSourceAttribution = ({
  sources,
  lastUpdated = new Date(),
  className,
  showQuality = true,
  showFreshness = true,
  compact = false,
}: EnhancedDataSourceAttributionProps) => {
  const [hoveredSource, setHoveredSource] = useState<DataSource | null>(null);

  if (!sources || sources.length === 0) {
    return null;
  }

  const primarySource = sources[0];
  const secondarySources = sources.slice(1);
  const primaryMetadata = dataSourceMetadataService.getSourceMetadata(primarySource);
  const qualityBadge = dataSourceMetadataService.getQualityBadge(primarySource, lastUpdated);
  const freshnessIndicator = dataSourceMetadataService.getFreshnessIndicator(
    lastUpdated,
    primaryMetadata.updateFrequency
  );

  const QualityIcon = {
    CheckCircle2,
    Shield,
    AlertCircle,
    AlertTriangle,
  }[qualityBadge.icon] || CheckCircle2;

  const FreshnessIcon = {
    CheckCircle2,
    Clock,
    AlertCircle,
    AlertTriangle,
  }[freshnessIndicator.icon] || Clock;

  const handleSourceClick = (source: DataSource, url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (compact) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn('inline-flex items-center gap-1 cursor-pointer', className)}
          >
            <Badge
              variant="outline"
              className={cn(
                'text-xs transition-all duration-200',
                qualityBadge.color
              )}
            >
              <QualityIcon className="h-3 w-3 mr-1" />
              {primaryMetadata.name}
              {secondarySources.length > 0 && (
                <span className="ml-1 opacity-70">+{secondarySources.length}</span>
              )}
            </Badge>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="top">
          <SourceDetailCard
            metadata={primaryMetadata}
            qualityBadge={qualityBadge}
            freshnessIndicator={freshnessIndicator}
            lastUpdated={lastUpdated}
            secondarySources={secondarySources}
            onSourceClick={handleSourceClick}
          />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Primary Source */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredSource(primarySource)}
            onHoverEnd={() => setHoveredSource(null)}
          >
            <Badge
              variant="outline"
              className={cn(
                'cursor-pointer transition-all duration-200 gap-1.5',
                qualityBadge.color,
                hoveredSource === primarySource && 'ring-2 ring-primary/20'
              )}
              onClick={() => handleSourceClick(primarySource, primaryMetadata.url)}
            >
              {showQuality && <QualityIcon className="h-3 w-3" />}
              <span className="font-medium">{primaryMetadata.name}</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </Badge>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="top">
          <SourceDetailCard
            metadata={primaryMetadata}
            qualityBadge={qualityBadge}
            freshnessIndicator={freshnessIndicator}
            lastUpdated={lastUpdated}
            secondarySources={secondarySources}
            onSourceClick={handleSourceClick}
          />
        </HoverCardContent>
      </HoverCard>

      {/* Secondary Sources */}
      {secondarySources.length > 0 && (
        <AnimatePresence>
          {secondarySources.map((source, index) => {
            const metadata = dataSourceMetadataService.getSourceMetadata(source);
            return (
              <motion.div
                key={source}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer text-xs transition-all duration-200 hover:bg-secondary/80"
                      onClick={() => handleSourceClick(source, metadata.url)}
                    >
                      {metadata.name}
                      <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-50" />
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72" side="top">
                    <SecondarySourceCard metadata={metadata} />
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Freshness Indicator */}
      {showFreshness && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <FreshnessIcon className={cn('h-3 w-3', freshnessIndicator.color)} />
          <span>{dataSourceMetadataService.formatTimeAgo(lastUpdated)}</span>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SOURCE DETAIL CARD
// ============================================

interface SourceDetailCardProps {
  metadata: DataSourceMetadata;
  qualityBadge: ReturnType<typeof dataSourceMetadataService.getQualityBadge>;
  freshnessIndicator: ReturnType<typeof dataSourceMetadataService.getFreshnessIndicator>;
  lastUpdated: Date;
  secondarySources: DataSource[];
  onSourceClick: (source: DataSource, url: string) => void;
}

const SourceDetailCard = ({
  metadata,
  qualityBadge,
  freshnessIndicator,
  lastUpdated,
  secondarySources,
  onSourceClick,
}: SourceDetailCardProps) => {
  const QualityIcon = {
    CheckCircle2,
    Shield,
    AlertCircle,
    AlertTriangle,
  }[qualityBadge.icon] || CheckCircle2;

  const FreshnessIcon = {
    CheckCircle2,
    Clock,
    AlertCircle,
    AlertTriangle,
  }[freshnessIndicator.icon] || Clock;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">{metadata.icon}</span>
            {metadata.fullName}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {metadata.description}
          </p>
        </div>
      </div>

      {/* Quality & Freshness */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <QualityIcon className={cn('h-3.5 w-3.5', qualityBadge.color.split(' ')[2])} />
            <span className="text-xs font-medium">Quality</span>
          </div>
          <Badge variant="outline" className={cn('text-xs', qualityBadge.color)}>
            {qualityBadge.level}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <FreshnessIcon className={cn('h-3.5 w-3.5', freshnessIndicator.color)} />
            <span className="text-xs font-medium">Freshness</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {freshnessIndicator.status}
          </Badge>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-1.5 pt-2 border-t text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Reliability:</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="font-medium">{metadata.credibilityScore}%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Update Frequency:</span>
          <span className="font-medium capitalize">{metadata.updateFrequency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="font-medium">
            {dataSourceMetadataService.formatTimeAgo(lastUpdated)}
          </span>
        </div>
      </div>

      {/* Data Types */}
      {metadata.dataTypes.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Data Types
          </h5>
          <div className="flex flex-wrap gap-1">
            {metadata.dataTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Methodology */}
      {metadata.methodology && (
        <div className="space-y-1.5 pt-2 border-t">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Methodology
          </h5>
          <p className="text-xs text-muted-foreground">{metadata.methodology}</p>
        </div>
      )}

      {/* Secondary Sources */}
      {secondarySources.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Additional Sources
          </h5>
          <div className="flex flex-wrap gap-1">
            {secondarySources.map((source) => {
              const secMetadata = dataSourceMetadataService.getSourceMetadata(source);
              return (
                <Badge
                  key={source}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => onSourceClick(source, secMetadata.url)}
                >
                  {secMetadata.name}
                  <ExternalLink className="h-2.5 w-2.5 ml-1" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => onSourceClick(metadata.id, metadata.url)}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Source
        </Button>
        {metadata.verificationUrl && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => onSourceClick(metadata.id, metadata.verificationUrl!)}
          >
            <Info className="h-3 w-3 mr-1" />
            Methodology
          </Button>
        )}
      </div>

      {/* Warning */}
      {qualityBadge.showWarning && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            This data may be outdated. Please verify with the original source.
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// SECONDARY SOURCE CARD
// ============================================

interface SecondarySourceCardProps {
  metadata: DataSourceMetadata;
}

const SecondarySourceCard = ({ metadata }: SecondarySourceCardProps) => {
  return (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <span>{metadata.icon}</span>
          {metadata.fullName}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          {metadata.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t">
        <span className="text-muted-foreground">Reliability:</span>
        <Badge variant="outline" className="text-xs">
          {metadata.credibilityScore}%
        </Badge>
      </div>
    </div>
  );
};
