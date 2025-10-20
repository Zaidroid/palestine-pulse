/**
 * Statistical Utilities
 * 
 * Provides statistical functions for analytics:
 * - Basic statistics (mean, median, std dev)
 * - Trend analysis
 * - Correlation calculations
 * - Anomaly detection
 * - Simple forecasting
 * 
 * All serverless - runs in browser
 */

// ============================================
// BASIC STATISTICS
// ============================================

/**
 * Calculate mean (average)
 */
export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate median
 */
export const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Calculate standard deviation
 */
export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
};

/**
 * Calculate variance
 */
export const variance = (values: number[]): number => {
  return Math.pow(standardDeviation(values), 2);
};

/**
 * Calculate percentile
 */
export const percentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Calculate linear regression for trend line
 */
export const linearRegression = (values: number[]): { slope: number; intercept: number; r2: number } => {
  if (values.length < 2) return { slope: 0, intercept: 0, r2: 0 };
  
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((sum, x) => sum + x, 0);
  const sumY = values.reduce((sum, y) => sum + y, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = values.reduce((sum, y) => sum + y * y, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R²
  const yMean = mean(values);
  const ssTotal = values.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = values.reduce((sum, y, i) => {
    const predicted = slope * i + intercept;
    return sum + Math.pow(y - predicted, 2);
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  return { slope, intercept, r2 };
};

/**
 * Detect trend direction
 */
export const detectTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' => {
  const { slope, r2 } = linearRegression(values);
  if (r2 < 0.5) return 'stable'; // Low correlation, no clear trend
  return slope > 0 ? 'increasing' : 'decreasing';
};

/**
 * Calculate moving average
 */
export const movingAverage = (values: number[], window: number): number[] => {
  if (values.length < window) return values;
  
  const result: number[] = [];
  for (let i = 0; i <= values.length - window; i++) {
    const windowValues = values.slice(i, i + window);
    result.push(mean(windowValues));
  }
  return result;
};

// ============================================
// CORRELATION & COMPARISON
// ============================================

/**
 * Calculate Pearson correlation coefficient
 */
export const correlation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  
  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
  const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
  
  if (denomX === 0 || denomY === 0) return 0;
  return numerator / (denomX * denomY);
};

/**
 * Calculate percentage change
 */
export const percentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculate period over period comparison
 */
export const periodComparison = (
  period1: number[],
  period2: number[]
): {
  period1Avg: number;
  period2Avg: number;
  change: number;
  changePercent: number;
} => {
  const avg1 = mean(period1);
  const avg2 = mean(period2);
  return {
    period1Avg: avg1,
    period2Avg: avg2,
    change: avg2 - avg1,
    changePercent: percentageChange(avg1, avg2),
  };
};

// ============================================
// ANOMALY DETECTION
// ============================================

/**
 * Detect outliers using IQR method
 */
export const detectOutliers = (values: number[]): number[] => {
  if (values.length < 4) return [];
  
  const q1 = percentile(values, 25);
  const q3 = percentile(values, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return values.filter(v => v < lowerBound || v > upperBound);
};

/**
 * Detect anomalies using standard deviation
 */
export const detectAnomalies = (
  values: number[],
  threshold: number = 2
): { indices: number[]; values: number[] } => {
  if (values.length === 0) return { indices: [], values: [] };
  
  const avg = mean(values);
  const stdDev = standardDeviation(values);
  const anomalies: { indices: number[]; values: number[] } = { indices: [], values: [] };
  
  values.forEach((value, index) => {
    const zScore = Math.abs((value - avg) / stdDev);
    if (zScore > threshold) {
      anomalies.indices.push(index);
      anomalies.values.push(value);
    }
  });
  
  return anomalies;
};

// ============================================
// SIMPLE FORECASTING
// ============================================

/**
 * Simple linear extrapolation for forecasting
 */
export const forecast = (
  historicalValues: number[],
  periodsAhead: number
): { predictions: number[]; confidence: number } => {
  const { slope, intercept, r2 } = linearRegression(historicalValues);
  const startIndex = historicalValues.length;
  
  const predictions = Array.from({ length: periodsAhead }, (_, i) => {
    return slope * (startIndex + i) + intercept;
  });
  
  return {
    predictions,
    confidence: r2, // R² as confidence measure
  };
};

/**
 * Calculate confidence intervals
 */
export const confidenceInterval = (
  values: number[],
  confidenceLevel: number = 0.95
): { lower: number; upper: number } => {
  const avg = mean(values);
  const stdDev = standardDeviation(values);
  const n = values.length;
  
  // Using t-distribution approximation (z-score for large n)
  const zScore = confidenceLevel === 0.95 ? 1.96 : 2.576;
  const marginOfError = zScore * (stdDev / Math.sqrt(n));
  
  return {
    lower: avg - marginOfError,
    upper: avg + marginOfError,
  };
};

// ============================================
// DATA SMOOTHING
// ============================================

/**
 * Exponential moving average
 */
export const exponentialMovingAverage = (
  values: number[],
  alpha: number = 0.3
): number[] => {
  if (values.length === 0) return [];
  
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(alpha * values[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
};

/**
 * Remove seasonal patterns (simple deseasonalization)
 */
export const deseasonalize = (values: number[], period: number): number[] => {
  if (values.length < period) return values;
  
  const seasonalAverages: number[] = [];
  for (let i = 0; i < period; i++) {
    const seasonValues = values.filter((_, index) => index % period === i);
    seasonalAverages.push(mean(seasonValues));
  }
  
  return values.map((value, index) => {
    const seasonIndex = index % period;
    return value - seasonalAverages[seasonIndex] + mean(values);
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate growth rate
 */
export const growthRate = (values: number[]): number[] => {
  return values.slice(1).map((value, index) => {
    return percentageChange(values[index], value);
  });
};

/**
 * Normalize values to 0-100 scale
 */
export const normalize = (values: number[]): number[] => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  if (range === 0) return values.map(() => 50);
  return values.map(v => ((v - min) / range) * 100);
};

/**
 * Calculate cumulative sum
 */
export const cumulativeSum = (values: number[]): number[] => {
  let sum = 0;
  return values.map(v => (sum += v));
};