/**
 * EnhancedMetricCard Component
 * Display key metrics with rich animations, sparklines, and expandable content
 */

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "../../lib/utils";
import { useReducedMotion, useIntersectionAnimation } from "../../lib/animation/hooks";
import { animationTokens } from "../../lib/animation/tokens";
import { AnimatedCounter } from "./animated-counter";
import { MiniSparkline, type SparklineDataPoint } from "./mini-sparkline";
import { EnhancedCard, type GradientConfig } from "./enhanced-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Badge } from "./badge";
import { EnhancedDataSourceBadge } from "../v3/shared/EnhancedDataSourceBadge";
import { type DataSource } from "../../types/data.types";
import { MetricTooltip } from "./metric-tooltip";
import { DataQualityWarning, type QualityIssue } from "./data-quality-warning";
import { cardInteraction, iconButtonInteraction } from "@/lib/interaction-polish";

export interface MetricChange {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

export interface MetricDefinition {
  definition: string;
  formula?: string;
  example?: string;
  source?: string;
}

export interface EnhancedMetricCardProps {
  title: string;
  value: number | string;
  change?: MetricChange;
  icon: LucideIcon;
  gradient?: GradientConfig;
  sparkline?: {
    data: SparklineDataPoint[];
    color: string;
  };
  expandable?: boolean;
  expandedContent?: React.ReactNode;
  realTime?: boolean;
  dataSources?: DataSource[];
  quality?: 'high' | 'medium' | 'low';
  loading?: boolean;
  className?: string;
  lastUpdated?: Date;
  description?: string;
  unit?: string;
  formatValue?: (value: number | string) => string;
  metricDefinition?: MetricDefinition;
  qualityIssues?: QualityIssue[];
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'neutral':
      return Minus;
  }
};

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return 'text-green-600 dark:text-green-400';
    case 'down':
      return 'text-red-600 dark:text-red-400';
    case 'neutral':
      return 'text-muted-foreground';
  }
};

export const EnhancedMetricCard = React.forwardRef<HTMLDivElement, EnhancedMetricCardProps>(
  (
    {
      title,
      value,
      change,
      icon: Icon,
      gradient,
      sparkline,
      expandable = false,
      expandedContent,
      realTime = false,
      dataSources = [],
      quality = 'high',
      loading = false,
      className,
      lastUpdated,
      description,
      unit,
      formatValue,
      metricDefinition,
      qualityIssues,
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { ref: intersectionRef, isInView } = useIntersectionAnimation({
      threshold: 0.1,
      triggerOnce: true,
    });

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLDivElement) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, intersectionRef]
    );

    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: animationTokens.duration.slow / 1000,
          ease: animationTokens.easing.easeOut,
        },
      },
    };

    const handleClick = (e: React.MouseEvent) => {
      if (expandable && expandedContent) {
        // Close any open hover cards by triggering a blur event
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Force close any hover cards by moving focus
        const body = document.body;
        body.focus();
        
        setIsExpanded(true);
      }
    };

    const isNumericValue = typeof value === 'number';
    const displayValue = formatValue ? formatValue(value) : value;

    return (
      <>
        <motion.div
          ref={combinedRef}
          variants={prefersReducedMotion ? undefined : cardVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion || isInView ? "visible" : "hidden"}
          className={cn("relative", className)}
        >
          <EnhancedCard
            gradient={gradient}
            loading={loading}
            hoverable={expandable}
            onClick={(e) => handleClick(e)}
            onMouseLeave={() => {
              // Ensure hover cards close when mouse leaves
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
            className="p-6 h-full"
            aria-label={`${title}: ${displayValue}`}
          >
            {!loading && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-muted-foreground truncate">
                        {title}
                      </h3>
                      {metricDefinition && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="inline-flex"
                        >
                          <MetricTooltip
                            title={title}
                            definition={metricDefinition.definition}
                            formula={metricDefinition.formula}
                            example={metricDefinition.example}
                            source={metricDefinition.source}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Value */}
                    <div className="flex items-baseline gap-2">
                      {isNumericValue ? (
                        <AnimatedCounter
                          value={value as number}
                          className="text-3xl font-bold font-mono"
                          suffix={unit}
                        />
                      ) : (
                        <span className="text-3xl font-bold font-mono">{displayValue}</span>
                      )}
                    </div>

                    {/* Change Indicator */}
                    {change && (
                      <div className="flex items-center gap-1.5 mt-2">
                        {React.createElement(getTrendIcon(change.trend), {
                          className: cn("h-4 w-4", getTrendColor(change.trend)),
                        })}
                        <span className={cn("text-sm font-medium", getTrendColor(change.trend))}>
                          {change.value > 0 ? '+' : ''}
                          {change.value}%
                        </span>
                        <span className="text-xs text-muted-foreground">{change.period}</span>
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      gradient
                        ? "bg-white/10 dark:bg-black/10"
                        : "bg-primary/10 dark:bg-primary/20"
                    )}
                  >
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Sparkline */}
                {sparkline && sparkline.data.length > 0 && (
                  <div className="mt-4">
                    <MiniSparkline
                      data={sparkline.data}
                      color={sparkline.color}
                      height={40}
                      showGradient={true}
                    />
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <div 
                    className="flex items-center gap-2 flex-1 min-w-0 pointer-events-auto" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    {/* Data Source Badge */}
                    {dataSources.length > 0 && (
                      <EnhancedDataSourceBadge
                        sources={dataSources}
                        lastRefresh={lastUpdated}
                        compact={false}
                        showRefreshTime={false}
                        showLinks={true}
                      />
                    )}
                    
                    {/* Data Quality Warning */}
                    {quality && quality !== 'high' && (
                      <DataQualityWarning
                        quality={quality}
                        issues={qualityIssues}
                        lastUpdated={lastUpdated}
                        variant="icon"
                      />
                    )}
                  </div>

                  {/* Real-time Indicator */}
                  {realTime && (
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-green-500"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: animationTokens.duration.pulse / 1000,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  )}

                  {/* Expandable Indicator */}
                  {expandable && expandedContent && (
                    <Badge variant="outline" className="text-xs">
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </EnhancedCard>
        </motion.div>

        {/* Expanded Modal */}
        {expandable && expandedContent && (
          <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
              <div className="mt-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                    <div className="text-2xl font-bold font-mono">
                      {displayValue}
                      {unit && <span className="text-lg ml-1">{unit}</span>}
                    </div>
                  </div>
                  {change && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Change</div>
                      <div className="flex items-center gap-2">
                        {React.createElement(getTrendIcon(change.trend), {
                          className: cn("h-5 w-5", getTrendColor(change.trend)),
                        })}
                        <span className={cn("text-2xl font-bold", getTrendColor(change.trend))}>
                          {change.value > 0 ? '+' : ''}
                          {change.value}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{change.period}</div>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedContent}

                {/* Data Sources */}
                {dataSources.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium mb-3">Data Sources</h4>
                    <EnhancedDataSourceBadge
                      sources={dataSources}
                      lastRefresh={lastUpdated}
                      compact={false}
                      showRefreshTime={true}
                      showLinks={true}
                      disableHoverCard={true}
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
);

EnhancedMetricCard.displayName = "EnhancedMetricCard";
