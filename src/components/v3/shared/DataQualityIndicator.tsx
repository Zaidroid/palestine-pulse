import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface DataQualityIndicatorProps {
  quality: 'high' | 'medium' | 'low';
  source?: string;
  lastUpdated?: Date;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DataQualityIndicator = ({
  quality,
  source,
  lastUpdated,
  showLabel = true,
  size = 'md',
  className
}: DataQualityIndicatorProps) => {
  const config = {
    high: {
      icon: CheckCircle2,
      color: 'bg-secondary text-secondary-foreground',
      label: 'High Quality',
      description: 'Verified from primary sources'
    },
    medium: {
      icon: AlertTriangle,
      color: 'bg-warning text-warning-foreground',
      label: 'Medium Quality',
      description: 'Estimated or aggregated data'
    },
    low: {
      icon: AlertCircle,
      color: 'bg-destructive text-destructive-foreground',
      label: 'Low Quality',
      description: 'Unverified or incomplete data'
    }
  };

  const { icon: Icon, color, label, description } = config[quality];

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <Badge variant="outline" className={cn(color, "gap-1.5")}>
        <Icon className={sizeClasses[size]} />
        {showLabel && <span className="text-xs">{label}</span>}
      </Badge>
      {source && (
        <Badge variant="secondary" className="text-xs">
          {source}
        </Badge>
      )}
    </motion.div>
  );

  const tooltipText = (
    <div className="space-y-1">
      <p className="font-semibold">{description}</p>
      {source && <p className="text-xs">Source: {source}</p>}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </p>
      )}
    </div>
  );

  if (lastUpdated || description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

// Freshness indicator for last update time
export const FreshnessIndicator = ({ 
  lastUpdated, 
  thresholdMinutes = 10 
}: { 
  lastUpdated: Date;
  thresholdMinutes?: number;
}) => {
  const minutesAgo = (new Date().getTime() - lastUpdated.getTime()) / 60000;
  const isFresh = minutesAgo < thresholdMinutes;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            animate={isFresh ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-1.5"
          >
            <Clock className={cn(
              "h-3 w-3",
              isFresh ? "text-secondary" : minutesAgo < 60 ? "text-warning" : "text-destructive"
            )} />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {isFresh ? "Data is fresh" : minutesAgo < 60 ? "Data may be outdated" : "Data needs refresh"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};