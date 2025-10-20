import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressGaugeProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  type?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'destructive' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressGauge = ({
  value,
  max = 100,
  label,
  showValue = true,
  type = 'linear',
  color = 'primary',
  size = 'md',
  className
}: ProgressGaugeProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    destructive: 'bg-destructive',
    warning: 'bg-warning'
  };

  const sizeClasses = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    circular: {
      sm: 'h-16 w-16',
      md: 'h-24 w-24',
      lg: 'h-32 w-32'
    }
  };

  if (type === 'circular') {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn("relative", sizeClasses.circular[size], className)}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke={`hsl(var(--${color}))`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-2xl font-bold"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {Math.round(percentage)}%
            </motion.span>
            {label && (
              <span className="text-xs text-muted-foreground mt-1">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Linear progress bar
  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </div>
      )}
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeClasses.linear[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className={cn("h-full rounded-full", colorClasses[color])}
        />
      </div>
    </div>
  );
};