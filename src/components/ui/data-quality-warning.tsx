/**
 * DataQualityWarning Component
 * Display warning indicators for medium/low quality data with explanations
 */

import * as React from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Badge } from "./badge";

export type DataQuality = 'high' | 'medium' | 'low' | 'unknown';

export interface QualityIssue {
  type: 'missing' | 'outdated' | 'estimated' | 'incomplete' | 'unverified' | 'other';
  description: string;
}

export interface DataQualityWarningProps {
  quality: DataQuality;
  issues?: QualityIssue[];
  lastUpdated?: Date;
  source?: string;
  variant?: 'icon' | 'badge' | 'inline';
  showLabel?: boolean;
  className?: string;
}

const getQualityConfig = (quality: DataQuality) => {
  switch (quality) {
    case 'high':
      return {
        icon: CheckCircle,
        label: 'High Quality',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-300 dark:border-green-700',
        description: 'Data is verified, complete, and up-to-date',
      };
    case 'medium':
      return {
        icon: AlertCircle,
        label: 'Medium Quality',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        description: 'Data may have minor issues or be slightly outdated',
      };
    case 'low':
      return {
        icon: AlertTriangle,
        label: 'Low Quality',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-300 dark:border-orange-700',
        description: 'Data has significant issues or is outdated',
      };
    case 'unknown':
    default:
      return {
        icon: Info,
        label: 'Unknown Quality',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        borderColor: 'border-muted',
        description: 'Data quality has not been assessed',
      };
  }
};

const getIssueTypeLabel = (type: QualityIssue['type']) => {
  switch (type) {
    case 'missing':
      return 'Missing Data';
    case 'outdated':
      return 'Outdated';
    case 'estimated':
      return 'Estimated';
    case 'incomplete':
      return 'Incomplete';
    case 'unverified':
      return 'Unverified';
    case 'other':
    default:
      return 'Issue';
  }
};

export const DataQualityWarning: React.FC<DataQualityWarningProps> = ({
  quality,
  issues = [],
  lastUpdated,
  source,
  variant = 'icon',
  showLabel = false,
  className,
}) => {
  const config = getQualityConfig(quality);
  const Icon = config.icon;

  // Don't show warning for high quality data unless explicitly requested
  if (quality === 'high' && variant === 'icon' && !showLabel) {
    return null;
  }

  const tooltipContent = (
    <div className="space-y-3 max-w-xs">
      <div>
        <div className="font-semibold text-sm mb-1">{config.label}</div>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>

      {issues.length > 0 && (
        <div className="pt-2 border-t space-y-2">
          <div className="text-xs font-medium">Known Issues:</div>
          <ul className="space-y-1.5">
            {issues.map((issue, index) => (
              <li key={index} className="text-xs">
                <span className="font-medium">{getIssueTypeLabel(issue.type)}:</span>{' '}
                <span className="text-muted-foreground">{issue.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lastUpdated && (
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleDateString()} at{' '}
          {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {source && (
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Source: {source}
        </div>
      )}
    </div>
  );

  if (variant === 'badge') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 cursor-help",
                config.color,
                config.borderColor,
                className
              )}
            >
              <Icon className="h-3 w-3" />
              {showLabel && config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'inline') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
                config.bgColor,
                config.borderColor,
                "cursor-help",
                className
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
              <span className={cn("text-sm font-medium", config.color)}>
                {config.label}
              </span>
              {issues.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default: icon variant
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-1.5",
              "text-sm cursor-help",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
              config.color,
              className
            )}
            aria-label={`Data quality: ${config.label}`}
          >
            <Icon className="h-4 w-4" />
            {showLabel && <span className="font-medium">{config.label}</span>}
          </button>
        </TooltipTrigger>
        <TooltipContent className="p-4">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

DataQualityWarning.displayName = "DataQualityWarning";

// Helper component for displaying multiple quality warnings in a list
export interface DataQualityWarningListProps {
  items: Array<{
    label: string;
    quality: DataQuality;
    issues?: QualityIssue[];
    lastUpdated?: Date;
    source?: string;
  }>;
  className?: string;
}

export const DataQualityWarningList: React.FC<DataQualityWarningListProps> = ({
  items,
  className,
}) => {
  // Filter to only show items with quality issues
  const itemsWithIssues = items.filter(
    item => item.quality === 'medium' || item.quality === 'low' || item.quality === 'unknown'
  );

  if (itemsWithIssues.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium text-muted-foreground">
        Data Quality Notices:
      </div>
      <div className="space-y-1.5">
        {itemsWithIssues.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <DataQualityWarning
              quality={item.quality}
              issues={item.issues}
              lastUpdated={item.lastUpdated}
              source={item.source}
              variant="icon"
            />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

DataQualityWarningList.displayName = "DataQualityWarningList";
