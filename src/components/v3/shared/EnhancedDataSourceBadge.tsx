/**
 * Enhanced Data Source Badge System
 * 
 * Replaces the current badge system with:
 * - Clickable links to original data sources
 * - Last refresh timestamps with relative time
 * - Better visual presentation
 * - More detailed source information
 */

import React, { useState, useMemo, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataSource } from "@/types/data.types";
import { dataSourceMetadataService } from "@/services/dataSourceMetadataService";

interface EnhancedDataSourceBadgeProps {
  sources: DataSource[];
  lastRefresh?: Date;
  className?: string;
  showRefreshTime?: boolean;
  showLinks?: boolean;
  compact?: boolean;
  onRefresh?: () => void;
  disableHoverCard?: boolean;
  forceClose?: boolean;
}

export const EnhancedDataSourceBadge = ({
  sources,
  lastRefresh = new Date(),
  className,
  showRefreshTime = true,
  showLinks = true,
  compact = false,
  onRefresh,
  disableHoverCard = false,
  forceClose = false
}: EnhancedDataSourceBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get metadata for all sources
  const sourcesMetadata = useMemo(() => {
    return sources.map(source => dataSourceMetadataService.getSourceMetadata(source));
  }, [sources]);

  // Calculate time ago
  const timeAgo = useMemo(() => {
    const seconds = Math.floor((Date.now() - lastRefresh.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, [lastRefresh]);

  // Determine freshness status
  const freshnessStatus = useMemo(() => {
    const minutes = (Date.now() - lastRefresh.getTime()) / 60000;
    
    if (minutes < 60) return { label: 'Fresh', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-950' };
    if (minutes < 1440) return { label: 'Recent', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950' };
    if (minutes < 10080) return { label: 'Stale', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-950' };
    return { label: 'Outdated', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950' };
  }, [lastRefresh]);

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

  const primarySource = sourcesMetadata[0];
  const additionalSources = sourcesMetadata.slice(1);

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
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
      </div>
    );
  }

  // Badge trigger content
  const badgeContent = (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        !disableHoverCard && "cursor-pointer",
        className
      )}
      onClick={(e) => {
        if (disableHoverCard) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
          {/* Primary Source Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "transition-all duration-150 text-xs font-medium",
              !disableHoverCard && "hover:bg-accent",
              freshnessStatus.bg,
              freshnessStatus.color
            )}
          >
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            <span>{primarySource?.name || 'Unknown'}</span>
            {additionalSources.length > 0 && (
              <span className="ml-1 opacity-70">+{additionalSources.length}</span>
            )}
            {showLinks && !disableHoverCard && (
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-50" />
            )}
          </Badge>

          {/* Refresh Time */}
          {showRefreshTime && (
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          )}
        </div>
      );

  // Close hover card when forceClose is true
  useEffect(() => {
    if (forceClose) {
      setIsOpen(false);
    }
  }, [forceClose]);

  if (disableHoverCard) {
    return badgeContent;
  }

  // Get quality badge info
  const qualityBadge = useMemo(() => {
    const metadata = primarySource;
    if (!metadata) return { label: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    
    const score = metadata.credibilityScore || 0;
    if (score >= 90) return { label: 'verified', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950' };
    if (score >= 75) return { label: 'reliable', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950' };
    if (score >= 60) return { label: 'moderate', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950' };
    return { label: 'limited', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950' };
  }, [primarySource]);

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        {badgeContent}
      </HoverCardTrigger>

      <HoverCardContent 
        className="w-[340px] p-0 border-0 shadow-2xl backdrop-blur-xl bg-background/95 dark:bg-background/90" 
        side="top" 
        align="start" 
        sideOffset={8}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Header with Icon and Title */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold leading-tight">{primarySource?.fullName || primarySource?.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {primarySource?.description}
                </p>
              </div>
            </div>

            {/* Quality and Freshness Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-medium">Quality</span>
                </div>
                <Badge className={cn("text-xs font-medium px-2 py-0.5", qualityBadge.bg, qualityBadge.color, "border-0")}>
                  {qualityBadge.label}
                </Badge>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">Freshness</span>
                </div>
                <Badge className={cn("text-xs font-medium px-2 py-0.5", freshnessStatus.bg, freshnessStatus.color, "border-0")}>
                  {freshnessStatus.label.toLowerCase()}
                </Badge>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reliability:</span>
                <span className="font-semibold flex items-center gap-0.5">
                  <span className="text-green-600 text-sm">↗</span>
                  {primarySource?.credibilityScore || 95}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Update Frequency:</span>
                <span className="font-semibold capitalize">{primarySource?.updateFrequency || 'Daily'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-semibold">{timeAgo}</span>
              </div>
            </div>

            {/* Data Types */}
            {primarySource?.dataTypes && primarySource.dataTypes.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Data Types
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {primarySource.dataTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology */}
            {primarySource?.methodology && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Methodology
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {primarySource.methodology}
                </p>
              </div>
            )}

            {/* Additional Sources */}
            {additionalSources.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Additional Sources
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {additionalSources.map((source, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-[10px] font-medium cursor-pointer hover:bg-accent transition-colors px-2 py-0.5"
                      onClick={() => handleSourceClick(source.url)}
                    >
                      {source.name}
                      <ExternalLink className="h-2.5 w-2.5 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => primarySource && handleSourceClick(primarySource.url)}
              >
                <ExternalLink className="h-3 w-3 mr-1.5" />
                View Source
              </Button>
              {primarySource?.verificationUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={() => primarySource.verificationUrl && handleSourceClick(primarySource.verificationUrl)}
                >
                  <AlertCircle className="h-3 w-3 mr-1.5" />
                  Methodology
                </Button>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
