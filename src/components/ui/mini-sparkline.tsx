/**
 * MiniSparkline Component
 * Compact line chart with stroke-dasharray draw animation and gradient fill
 */

import * as React from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/animation/hooks";
import { animationTokens } from "../../lib/animation/tokens";

export interface SparklineDataPoint {
  value: number;
  date?: string;
}

export interface MiniSparklineProps {
  data: SparklineDataPoint[];
  color?: string;
  height?: number;
  showGradient?: boolean;
  animate?: boolean;
  className?: string;
}

export const MiniSparkline = React.forwardRef<HTMLDivElement, MiniSparklineProps>(
  (
    {
      data,
      color = "hsl(var(--primary))",
      height = 40,
      showGradient = true,
      animate = true,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isAnimated, setIsAnimated] = React.useState(false);
    const shouldAnimate = animate && !prefersReducedMotion;

    // Trigger animation on mount
    React.useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
      } else {
        setIsAnimated(true);
      }
    }, [shouldAnimate]);

    // Generate gradient ID
    const gradientId = React.useId();

    // Prepare data for Recharts
    const chartData = React.useMemo(() => {
      return data.map((point, index) => ({
        index,
        value: point.value,
        date: point.date,
      }));
    }, [data]);

    if (!data || data.length === 0) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={cn("w-full", className)}
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: animationTokens.duration.normal / 1000,
          ease: animationTokens.easing.easeOut,
        }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
            <defs>
              {showGradient && (
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            
            <YAxis hide domain={['dataMin', 'dataMax']} />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              fill={showGradient ? `url(#${gradientId})` : "none"}
              isAnimationActive={shouldAnimate}
              animationDuration={animationTokens.duration.draw}
              animationEasing="ease-out"
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }
);

MiniSparkline.displayName = "MiniSparkline";
