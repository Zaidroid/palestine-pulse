/**
 * Animated Chart Variants
 * 
 * Provides animated versions of chart components with:
 * - Line charts: stroke-dasharray draw animation
 * - Bar charts: height scale animation with stagger
 * - Area charts: gradient fill + line draw
 * - Pie charts: rotate + scale with stagger
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  AreaChart,
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
import { useReducedMotion } from '@/lib/animation';

// ============================================
// ANIMATED LINE CHART
// ============================================

export interface AnimatedLineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  stroke?: string;
  strokeWidth?: number;
  animationDuration?: number;
  isInView?: boolean;
  children?: React.ReactNode;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  stroke = 'hsl(var(--primary))',
  strokeWidth = 2,
  animationDuration = 1200,
  isInView = true,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setAnimationProgress(1);
      return;
    }

    setAnimationProgress(0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease out function
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, animationDuration, prefersReducedMotion]);

  return (
    <LineChart data={data}>
      {children}
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dot={false}
        animationDuration={prefersReducedMotion ? 0 : animationDuration}
        animationBegin={0}
        strokeDasharray={prefersReducedMotion ? undefined : `${animationProgress * 100}% ${100 - animationProgress * 100}%`}
      />
    </LineChart>
  );
};

// ============================================
// ANIMATED BAR CHART
// ============================================

export interface AnimatedBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  fill?: string;
  animationDuration?: number;
  staggerDelay?: number;
  isInView?: boolean;
  children?: React.ReactNode;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  fill = 'hsl(var(--primary))',
  animationDuration = 800,
  staggerDelay = 50,
  isInView = true,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [visibleBars, setVisibleBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setVisibleBars(data.map((_, i) => i));
      return;
    }

    setVisibleBars([]);
    
    data.forEach((_, index) => {
      setTimeout(() => {
        setVisibleBars(prev => [...prev, index]);
      }, index * staggerDelay);
    });
  }, [isInView, data, staggerDelay, prefersReducedMotion]);

  return (
    <BarChart data={data}>
      {children}
      <Bar
        dataKey={dataKey}
        fill={fill}
        animationDuration={prefersReducedMotion ? 0 : animationDuration}
        animationBegin={0}
        animationEasing="ease-out"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={fill}
            opacity={visibleBars.includes(index) ? 1 : 0}
            style={{
              transition: prefersReducedMotion ? 'none' : `opacity ${animationDuration}ms ease-out`,
            }}
          />
        ))}
      </Bar>
    </BarChart>
  );
};

// ============================================
// ANIMATED AREA CHART
// ============================================

export interface AnimatedAreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  animationDuration?: number;
  isInView?: boolean;
  children?: React.ReactNode;
}

export const AnimatedAreaChart: React.FC<AnimatedAreaChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  stroke = 'hsl(var(--primary))',
  fill = 'hsl(var(--primary) / 0.2)',
  strokeWidth = 2,
  animationDuration = 1000,
  isInView = true,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [lineProgress, setLineProgress] = useState(0);
  const [fillOpacity, setFillOpacity] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setLineProgress(1);
      setFillOpacity(1);
      return;
    }

    setLineProgress(0);
    setFillOpacity(0);
    const startTime = Date.now();
    const lineDuration = animationDuration * 0.7; // Line draws first
    const fillDelay = lineDuration;
    const fillDuration = animationDuration * 0.3;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Animate line
      if (elapsed < lineDuration) {
        const progress = elapsed / lineDuration;
        const eased = 1 - Math.pow(1 - progress, 3);
        setLineProgress(eased);
      } else {
        setLineProgress(1);
      }

      // Animate fill after line
      if (elapsed > fillDelay) {
        const fillElapsed = elapsed - fillDelay;
        const progress = Math.min(fillElapsed / fillDuration, 1);
        setFillOpacity(progress);
      }

      if (elapsed < animationDuration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, animationDuration, prefersReducedMotion]);

  return (
    <AreaChart data={data}>
      {children}
      <defs>
        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.3 * fillOpacity} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={`url(#gradient-${dataKey})`}
        animationDuration={prefersReducedMotion ? 0 : animationDuration}
        animationBegin={0}
        strokeDasharray={prefersReducedMotion ? undefined : `${lineProgress * 100}% ${100 - lineProgress * 100}%`}
      />
    </AreaChart>
  );
};

// ============================================
// ANIMATED PIE CHART
// ============================================

export interface AnimatedPieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  animationDuration?: number;
  staggerDelay?: number;
  isInView?: boolean;
  children?: React.ReactNode;
}

export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  dataKey,
  nameKey,
  colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ],
  animationDuration = 1000,
  staggerDelay = 100,
  isInView = true,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [visibleSlices, setVisibleSlices] = useState<number[]>([]);
  const [rotationProgress, setRotationProgress] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setVisibleSlices(data.map((_, i) => i));
      setRotationProgress(1);
      return;
    }

    setVisibleSlices([]);
    setRotationProgress(0);

    // Animate rotation
    const startTime = Date.now();
    const rotationDuration = animationDuration * 0.5;

    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / rotationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRotationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      }
    };

    requestAnimationFrame(animateRotation);

    // Stagger slice appearance
    data.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSlices(prev => [...prev, index]);
      }, rotationDuration + index * staggerDelay);
    });
  }, [isInView, data, animationDuration, staggerDelay, prefersReducedMotion]);

  const rotation = prefersReducedMotion ? 0 : -90 + (rotationProgress * 90);

  return (
    <PieChart>
      {children}
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        startAngle={rotation}
        endAngle={rotation + 360}
        animationDuration={prefersReducedMotion ? 0 : animationDuration}
        animationBegin={0}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            opacity={visibleSlices.includes(index) ? 1 : 0}
            style={{
              transition: prefersReducedMotion ? 'none' : `opacity ${animationDuration}ms ease-out`,
            }}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

// ============================================
// HELPER: ANIMATED AXES
// ============================================

export interface AnimatedAxesProps {
  isInView?: boolean;
  animationDelay?: number;
}

export const AnimatedAxes: React.FC<AnimatedAxesProps> = ({
  isInView = true,
  animationDelay = 200,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [opacity, setOpacity] = useState(prefersReducedMotion ? 1 : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setOpacity(1);
      return;
    }

    setTimeout(() => {
      setOpacity(1);
    }, animationDelay);
  }, [isInView, animationDelay, prefersReducedMotion]);

  return (
    <>
      <CartesianGrid
        strokeDasharray="3 3"
        opacity={opacity}
        style={{
          transition: prefersReducedMotion ? 'none' : 'opacity 400ms ease-out',
        }}
      />
      <XAxis
        opacity={opacity}
        style={{
          transition: prefersReducedMotion ? 'none' : 'opacity 600ms ease-out',
        }}
      />
      <YAxis
        opacity={opacity}
        style={{
          transition: prefersReducedMotion ? 'none' : 'opacity 600ms ease-out',
        }}
      />
    </>
  );
};
