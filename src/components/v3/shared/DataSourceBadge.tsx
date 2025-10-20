import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DataSourceBadgeProps {
  sources: string[];
  quality: "high" | "medium" | "low";
  className?: string;
  lastUpdated?: string;
  updateFrequency?: string;
}

const qualityConfig = {
  high: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950",
    borderColor: "border-green-300 dark:border-green-800",
    label: "High Quality",
    description: "Verified data from authoritative sources with recent updates"
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-950",
    borderColor: "border-yellow-300 dark:border-yellow-800",
    label: "Medium Quality",
    description: "Reliable data that may have moderate delays or aggregation"
  },
  low: {
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950",
    borderColor: "border-orange-300 dark:border-orange-800",
    label: "Low Quality",
    description: "Estimated or modeled data pending verification"
  }
};

export const DataSourceBadge = ({
  sources,
  quality,
  className,
  lastUpdated,
  updateFrequency
}: DataSourceBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = qualityConfig[quality];
  const QualityIcon = config.icon;
  const primarySource = sources[0] || "Unknown";
  const additionalSources = sources.length - 1;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center cursor-help transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
            isHovered && "ring-2 ring-primary/20 rounded-md",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Badge clicked - sources:", sources, "quality:", quality);
          }}
        >
          <Badge
            variant="outline"
            className={cn(
              "transition-all duration-200",
              config.bgColor,
              config.borderColor
            )}
          >
            <QualityIcon className={cn("h-3 w-3 mr-1 transition-colors", config.color)} />
            <span className="text-xs font-medium">{primarySource}</span>
            {additionalSources > 0 && (
              <span className="ml-1 text-xs opacity-70">+{additionalSources}</span>
            )}
          </Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" side="top">
        <div className="space-y-3">
          {/* Quality Header */}
          <div className="flex items-center gap-2">
            <QualityIcon className={cn("h-4 w-4 transition-all duration-200", config.color)} />
            <div>
              <h4 className="text-sm font-semibold transition-colors">{config.label}</h4>
              <p className="text-xs text-muted-foreground transition-colors">{config.description}</p>
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide transition-colors">
              Data Sources
            </h5>
            <div className="flex flex-wrap gap-1">
              {sources.map((source, index) => (
                <Badge key={index} variant="secondary" className="text-xs transition-all duration-200 hover:bg-secondary/80 hover:scale-105 cursor-pointer">
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metadata */}
          {(lastUpdated || updateFrequency) && (
            <div className="pt-2 border-t text-xs space-y-1">
              {lastUpdated && (
                <div className="flex justify-between transition-colors">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{lastUpdated}</span>
                </div>
              )}
              {updateFrequency && (
                <div className="flex justify-between transition-colors">
                  <span className="text-muted-foreground">Update Frequency:</span>
                  <span className="font-medium">{updateFrequency}</span>
                </div>
              )}
            </div>
          )}

          {/* Info Footer */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0 transition-colors" />
              <span>Hover over any badge to see detailed source information and data quality indicators.</span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};