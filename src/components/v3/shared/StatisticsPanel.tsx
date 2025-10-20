import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Statistic {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  color?: string;
  suffix?: string;
  description?: string;
}

interface StatisticsPanelProps {
  title?: string;
  statistics: Statistic[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'grid' | 'list';
  className?: string;
}

export const StatisticsPanel = ({
  title,
  statistics,
  columns = 2,
  variant = 'grid',
  className
}: StatisticsPanelProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const formatValue = (val: number | string, suffix?: string) => {
    const formatted = typeof val === 'number' ? val.toLocaleString() : val;
    return suffix ? `${formatted} ${suffix}` : formatted;
  };

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <div className="space-y-4">
              {statistics.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {idx > 0 && <Separator className="mb-4" />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <div className={cn("p-2 rounded-lg", stat.color || "bg-primary/10")}>
                            <Icon className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          {stat.description && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              {stat.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatValue(stat.value, stat.suffix)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className={cn("grid gap-6", gridCols[columns])}>
            {statistics.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <div className={cn("p-2 rounded-lg", stat.color || "bg-primary/10")}>
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                  <p className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatValue(stat.value, stat.suffix)}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};