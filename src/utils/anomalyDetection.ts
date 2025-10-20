export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface Anomaly {
  date: string;
  value: number;
  anomaly: boolean;
}

/**
 * Detects anomalies in a time series data using the 3-sigma rule.
 * @param data - The time series data.
 * @param threshold - The number of standard deviations for the threshold.
 * @returns Data with an 'anomaly' flag.
 */
export const detectAnomalies = (data: TimeSeriesData[], threshold: number = 2): (TimeSeriesData & { anomalyValue?: number })[] => {
  if (data.length < 2) return data;

  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);

  const thresholdValue = threshold * stdDev;

  return data.map(point => {
    const isAnomaly = Math.abs(point.value - mean) > thresholdValue;
    return {
      ...point,
      ...(isAnomaly && { anomalyValue: point.value })
    };
  });
};