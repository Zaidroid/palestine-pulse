import { ReactNode, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus, Expand, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardModal } from "./CardModal";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { EnhancedDataSourceBadge } from "./EnhancedDataSourceBadge";
import { EnhancedDataSourceAttribution } from "./EnhancedDataSourceAttribution";
import { useCountUp } from "@/hooks/use-count-up";
import { DataSource } from "@/types/data.types";

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
    'MOH': 'tech4palestine', // Ministry of Health data comes through Tech4Palestine
    'UNICEF': 'un_ocha', // UNICEF data typically through UN OCHA
    'Save the Children': 'un_ocha',
    'Health Facilities': 'who',
  };

  return sources
    .map(source => mapping[source] || 'tech4palestine' as DataSource)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
};

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const countUpRef = useCountUp({
    from: 0,
    to: value,
    duration: 1.5,
  });

  return <span ref={countUpRef} className={className} />;
};

interface UnifiedMetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  gradient?: string;
  sparklineData?: any[];
  expandable?: boolean;
  expandedContent?: ReactNode;
  realTimeUpdate?: boolean;
  lastUpdated?: Date;
  onClick?: () => void;
  dataQuality?: 'high' | 'medium' | 'low';
  dataSources?: string[];
  dataSourcesTyped?: DataSource[];
  useEnhancedAttribution?: boolean;
  className?: string;
  valueColor?: string;
  loading?: boolean;
}

export const UnifiedMetricCard = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  gradient = "from-card to-card/80",
  sparklineData,
  expandable = false,
  expandedContent,
  realTimeUpdate = false,
  lastUpdated,
  onClick,
  dataQuality = 'high',
  dataSources = [],
  dataSourcesTyped = [],
  useEnhancedAttribution = false,
  className,
  valueColor,
  loading = false,
}: UnifiedMetricCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (expandable) {
      setIsModalOpen(true);
    }
    onClick?.();
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-secondary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return <Skeleton className={cn("h-[190px] w-full", className)} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
      }}
      whileHover={expandable ? { scale: 1.03, zIndex: 10 } : {}}
      className={cn("group h-full", className)}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/10",
          expandable && "cursor-pointer",
          `bg-gradient-to-br ${gradient}`
        )}
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {realTimeUpdate && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-2 w-2 rounded-full bg-destructive"
              />
            )}
            <Icon className="h-4 w-4 text-muted-foreground" />
            {expandable && <Expand className="h-4 w-4 text-muted-foreground" />}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div
                className={cn(
                  "text-3xl font-bold tracking-tight font-mono",
                  valueColor || "text-foreground"
                )}
              >
                {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
              </div>
              {change !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon()}
                  <span className={cn(
                    "font-medium",
                    trend === 'up' && "text-destructive",
                    trend === 'down' && "text-secondary",
                    trend === 'neutral' && "text-muted-foreground"
                  )}>
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                </div>
              )}
            </div>

            {sparklineData && sparklineData.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-12"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <defs>
                      <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={false}
                      animationDuration={800}
                      strokeDasharray="500 500"
                      style={{ animation: 'draw-line 1.2s ease-out forwards' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            <div className="flex items-center justify-between text-xs pt-2">
              {useEnhancedAttribution ? (
                <EnhancedDataSourceAttribution
                  sources={dataSourcesTyped.length > 0 ? dataSourcesTyped : mapStringToDataSource(dataSources)}
                  lastUpdated={lastUpdated ? new Date(lastUpdated) : new Date()}
                  compact={true}
                  showQuality={true}
                  showFreshness={true}
                />
              ) : (
                <EnhancedDataSourceBadge
                  sources={dataSourcesTyped.length > 0 ? dataSourcesTyped : mapStringToDataSource(dataSources)}
                  lastRefresh={lastUpdated ? new Date(lastUpdated) : new Date()}
                  showRefreshTime={true}
                  showLinks={true}
                  compact={false}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {expandable && expandedContent && (
        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          className="sm:max-w-4xl"
        >
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            {expandedContent}
          </Suspense>
        </CardModal>
      )}
    </motion.div>
  );
};