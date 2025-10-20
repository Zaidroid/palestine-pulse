import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  title: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeValue: number | string;
  afterValue: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  beforeDescription?: string;
  afterDescription?: string;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
}

export const ComparisonCard = ({
  title,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeValue,
  afterValue,
  change,
  trend,
  changeLabel,
  beforeDescription,
  afterDescription,
  variant = 'default',
  className
}: ComparisonCardProps) => {
  const variantColors = {
    default: {
      bg: 'from-primary/10 to-primary/5',
      border: 'border-primary/20',
      text: 'text-primary'
    },
    destructive: {
      bg: 'from-destructive/10 to-destructive/5',
      border: 'border-destructive/20',
      text: 'text-destructive'
    },
    success: {
      bg: 'from-secondary/10 to-secondary/5',
      border: 'border-secondary/20',
      text: 'text-secondary'
    }
  };

  const colors = variantColors[variant];

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Before Value */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-2"
            >
              <p className="text-sm text-muted-foreground font-medium">{beforeLabel}</p>
              <p className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatValue(beforeValue)}
              </p>
              {beforeDescription && (
                <p className="text-xs text-muted-foreground">{beforeDescription}</p>
              )}
            </motion.div>

            {/* Arrow & Change */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <ArrowRight className={cn("h-6 w-6", colors.text)} />
              {change !== undefined && (
                <Badge variant={variant === 'destructive' ? 'destructive' : 'secondary'} className="gap-1">
                  {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span>{change > 0 ? '+' : ''}{change}%</span>
                </Badge>
              )}
              {changeLabel && (
                <p className="text-xs text-muted-foreground text-center">{changeLabel}</p>
              )}
            </motion.div>

            {/* After Value */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "text-center space-y-2 p-4 rounded-lg bg-gradient-to-br border-2",
                colors.bg,
                colors.border
              )}
            >
              <p className="text-sm text-muted-foreground font-medium">{afterLabel}</p>
              <p className={cn("text-3xl font-bold", colors.text)} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatValue(afterValue)}
              </p>
              {afterDescription && (
                <p className="text-xs text-muted-foreground">{afterDescription}</p>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};