/**
 * MetricTooltip Component
 * Display metric definitions and contextual help on hover
 */

import * as React from "react";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface MetricTooltipProps {
  title: string;
  definition: string;
  formula?: string;
  example?: string;
  source?: string;
  icon?: 'info' | 'help';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  triggerClassName?: string;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  title,
  definition,
  formula,
  example,
  source,
  icon = 'info',
  side = 'top',
  className,
  triggerClassName,
}) => {
  const IconComponent = icon === 'help' ? HelpCircle : Info;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center",
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
              triggerClassName
            )}
            aria-label={`Information about ${title}`}
          >
            <IconComponent className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "max-w-xs p-4 space-y-2",
            "bg-popover/95 backdrop-blur-sm",
            "border shadow-lg",
            className
          )}
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {definition}
            </p>
            
            {formula && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-foreground mb-1">Formula:</div>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono block">
                  {formula}
                </code>
              </div>
            )}
            
            {example && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-foreground mb-1">Example:</div>
                <p className="text-xs text-muted-foreground italic">
                  {example}
                </p>
              </div>
            )}
            
            {source && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Source: {source}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

MetricTooltip.displayName = "MetricTooltip";
