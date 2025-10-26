/**
 * Enhanced Chart Component
 * 
 * A unified wrapper for all chart types with:
 * - Intersection observer for viewport-triggered animations
 * - Loading and error states
 * - Data source attribution
 * - Export functionality
 * - Consistent styling and animations
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  AreaChart,
  ComposedChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersectionAnimation } from '@/lib/animation';
import { ChartConfig, ChartContainer } from './chart';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription } from './alert';
import { DataSource } from '@/types/data.types';
import { EnhancedDataSourceBadge } from '@/components/v3/shared/EnhancedDataSourceBadge';

export type ChartType = 'line' | 'bar' | 'area' | 'composed' | 'pie';

export interface EnhancedChartProps {
  type: ChartType;
  data: any[];
  config: ChartConfig;
  title?: string;
  description?: string;
  height?: number;
  loading?: boolean;
  error?: Error | null;
  dataSources?: DataSource[];
  onExport?: () => void;
  interactive?: boolean;
  animationDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export const EnhancedChart: React.FC<EnhancedChartProps> = ({
  type,
  data,
  config,
  title,
  description,
  height = 350,
  loading = false,
  error = null,
  dataSources = [],
  onExport,
  interactive = true,
  animationDuration = 1200,
  className,
  children,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { ref: intersectionRef, isInView, shouldAnimate } = useIntersectionAnimation({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Combine refs
  useEffect(() => {
    if (chartRef.current && intersectionRef) {
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = chartRef.current;
    }
  }, [intersectionRef]);

  // Handle export
  const handleExport = async () => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Card className={cn('w-full', className)} ref={chartRef}>
        {(title || description) && (
          <CardHeader>
            {title && <Skeleton className="h-6 w-48" />}
            {description && <Skeleton className="h-4 w-64 mt-2" />}
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-[350px] w-full" />
            {dataSources.length > 0 && (
              <Skeleton className="h-6 w-32" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className={cn('w-full', className)} ref={chartRef}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load chart data: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (!data || data.length === 0) {
    return (
      <Card className={cn('w-full', className)} ref={chartRef}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)} ref={chartRef}>
      {(title || description || onExport) && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex-shrink-0"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <AnimatePresence mode="wait">
          {shouldAnimate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChartContainer config={config} className="w-full" style={{ height }}>
                {children}
              </ChartContainer>
            </motion.div>
          )}
        </AnimatePresence>

        {dataSources.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <EnhancedDataSourceBadge
              sources={dataSources}
              compact
              showRefreshTime
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

EnhancedChart.displayName = 'EnhancedChart';
