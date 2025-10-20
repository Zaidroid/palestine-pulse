import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrendIndicator = ({
  value,
  trend,
  showIcon = true,
  className,
  size = 'md'
}: TrendIndicatorProps) => {
  // Auto-determine trend if not provided
  const determinedTrend = trend || (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral');
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getTrendColor = () => {
    switch (determinedTrend) {
      case 'up':
        return 'text-destructive';
      case 'down':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (determinedTrend) {
      case 'up':
        return <TrendingUp className={iconSizes[size]} />;
      case 'down':
        return <TrendingDown className={iconSizes[size]} />;
      default:
        return <Minus className={iconSizes[size]} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        sizeClasses[size],
        getTrendColor(),
        className
      )}
    >
      {showIcon && getTrendIcon()}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value > 0 ? '+' : ''}{value}%
      </span>
    </motion.div>
  );
};