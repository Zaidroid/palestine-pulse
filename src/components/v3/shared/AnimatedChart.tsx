import { ReactNode, useState } from "react";
import { motion, easeInOut } from "framer-motion";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { DataSourceBadge } from "./DataSourceBadge";

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
  dataQuality?: "high" | "medium" | "low";
}

export const AnimatedChart = ({
  title,
  description,
  children,
  height = 400,
  loading = false,
  error = null,
  animationDuration = 800,
  onExport,
  className,
  showHeader = true,
  dataSources = [],
  dataQuality = "high"
}: AnimatedChartProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (error) {
    return (
      <Card className={className}>
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
    return <ChartSkeleton height={height} className={className} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, duration: 0.5, ease: "easeInOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
        {showHeader && (title || description || onExport) && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1.5">
                {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
                {description && (
                  <CardDescription className="text-sm text-muted-foreground">
                    {description}
                  </CardDescription>
                )}
              </div>
              {onExport && (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExport}
                    className="gap-2 text-muted-foreground"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </motion.div>
              )}
            </CardHeader>
          </motion.div>
        )}
        
        <CardContent className="pt-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ height: `${height}px` }}
            className="w-full"
          >
            {children}
          </motion.div>

          {dataSources.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="mt-4 flex justify-end">
              <DataSourceBadge
                sources={dataSources}
                quality={dataQuality}
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

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