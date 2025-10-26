import { ReactNode, useState, forwardRef, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { DataQualityWarning, DataQuality, QualityIssue } from "@/components/ui/data-quality-warning";
import { ShareButton } from "@/components/ui/share-button";
import { ExportDialog } from "@/components/export/ExportDialog";
import { cn } from "@/lib/utils";
import { EnhancedDataSourceBadge } from "./EnhancedDataSourceBadge";
import { DataSource } from "@/types/data.types";
import { generateShareableUrl } from "@/hooks/useShareableState";

// Helper function to map old string source names to DataSource types
const mapStringToDataSource = (sources: string[]): DataSource[] => {
  const mapping: Record<string, DataSource> = {
    'T4P': 'tech4palestine',
    'Tech4Palestine': 'tech4palestine',
    'Tech for Palestine': 'tech4palestine',
    'WFP': 'wfp',
    'World Food Programme': 'wfp',
    'UN': 'un_ocha',
    'UN OCHA': 'un_ocha',
    'OCHA': 'un_ocha',
    'HDX': 'un_ocha',
    'WHO': 'who',
    'World Health Organization': 'who',
    'UNRWA': 'unrwa',
    'PCBS': 'pcbs',
    'Palestinian Central Bureau of Statistics': 'pcbs',
    'World Bank': 'world_bank',
    'B\'Tselem': 'btselem',
    'Btselem': 'btselem',
    'Good Shepherd': 'goodshepherd',
    'Good Shepherd Collective': 'goodshepherd',
    'MOH': 'tech4palestine',
    'UNICEF': 'un_ocha',
    'Save the Children': 'un_ocha',
    'Health Facilities': 'who',
  };

  return sources
    .map(source => mapping[source] || 'tech4palestine' as DataSource)
    .filter((value, index, self) => self.indexOf(value) === index);
};

interface QualityWarningConfig {
  quality: DataQuality;
  issues?: QualityIssue[];
  lastUpdated?: Date;
  source?: string;
}

interface AnimatedChartProps {
  title?: string;
  description?: string;
  children: ReactNode;
  height?: number;
  loading?: boolean;
  error?: Error | null;
  animationDuration?: number;
  onExport?: () => void;
  className?: string;
  showHeader?: boolean;
  dataSources?: string[];
  dataSourcesTyped?: DataSource[];
  dataQuality?: "high" | "medium" | "low";
  qualityWarning?: QualityWarningConfig;
  shareState?: Record<string, any>;
  enableShare?: boolean;
  enableImageExport?: boolean;
  chartData?: any; // Data for CSV/JSON export
  dataType?: string; // Type of data for export filename
}

export const AnimatedChart = forwardRef<HTMLDivElement, AnimatedChartProps>(({
  title,
  description,
  children,
  height = 400,
  loading = false,
  error = null,
  onExport,
  className,
  showHeader = true,
  dataSources = [],
  dataSourcesTyped = [],
  qualityWarning,
  shareState,
  enableShare = true,
  enableImageExport = true,
  chartData,
  dataType,
}, forwardedRef) => {
  const [isInView, setIsInView] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Combine refs using useCallback
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    // Simple intersection observer
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(node);
    }
    
    // Set internal ref
    if (chartRef) {
      (chartRef as any).current = node;
    }
    
    // Set forwarded ref
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    }
  }, [forwardedRef]);

  // Prepare data for export dialog
  const exportData = chartData || [];
  const exportDataType = dataType || title || 'chart';

  // Generate shareable URL with chart state
  const generateChartShareUrl = useCallback((): string => {
    const state: Record<string, any> = {
      chart: title || 'chart',
      ...shareState,
    };
    
    return generateShareableUrl(state);
  }, [title, shareState]);

  if (error) {
    return (
      <Card className={className} ref={forwardedRef}>
        {showHeader && (title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Failed to load chart data"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div ref={forwardedRef}>
        <LoadingSkeleton variant="chart" height={height} className={className} />
      </div>
    );
  }

  return (
    <motion.div
      ref={setRefs}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
        {showHeader && (title || description || onExport || qualityWarning || enableShare) && (
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
                {qualityWarning && (
                  <DataQualityWarning
                    quality={qualityWarning.quality}
                    issues={qualityWarning.issues}
                    lastUpdated={qualityWarning.lastUpdated}
                    source={qualityWarning.source}
                    variant="icon"
                    showLabel={false}
                  />
                )}
              </div>
              {description && (
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {enableImageExport && (
                <ExportDialog
                  data={exportData}
                  dataType={exportDataType}
                  chartElement={chartRef.current}
                  onExportComplete={(format) => {
                    console.log(`Chart exported as ${format}`);
                    onExport?.();
                  }}
                />
              )}
              {onExport && !enableImageExport && (
                <ExportDialog
                  data={exportData}
                  dataType={exportDataType}
                  chartElement={chartRef.current}
                  onExportComplete={(format) => {
                    console.log(`Chart exported as ${format}`);
                    onExport?.();
                  }}
                />
              )}
              {enableShare && (
                <ShareButton
                  title={title || 'Chart'}
                  description={description || 'View this chart from Palestine Humanitarian Dashboard'}
                  url={generateChartShareUrl()}
                  state={shareState}
                  variant="ghost"
                  size="sm"
                  showLabel={false}
                />
              )}
            </div>
          </CardHeader>
        )}

        <CardContent className="pt-2">
          <div
            style={{ height: `${height}px` }}
            className="w-full"
          >
            {children}
          </div>

          {(dataSources.length > 0 || dataSourcesTyped.length > 0) && (
            <div className="mt-4 flex justify-end" onClick={(e) => e.stopPropagation()}>
              <EnhancedDataSourceBadge
                sources={dataSourcesTyped.length > 0 ? dataSourcesTyped : mapStringToDataSource(dataSources)}
                lastRefresh={new Date()}
                showRefreshTime={false}
                showLinks={true}
                compact={false}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

AnimatedChart.displayName = "AnimatedChart";

// Skeleton for loading state
export const ChartSkeleton = ({ height = 400, className }: { height?: number, className?: string }) => {
  return (
    <div className={cn("space-y-4 p-4 bg-card rounded-lg", className)}>
      <div className="h-6 w-48 bg-muted animate-shimmer rounded" />
      <div
        className="w-full bg-muted animate-shimmer rounded-lg"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};