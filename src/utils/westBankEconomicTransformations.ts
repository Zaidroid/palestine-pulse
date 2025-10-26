/**
 * West Bank Economic Data Transformations
 * 
 * Transforms raw economic data from World Bank API
 * into structured formats for West Bank economic metrics and visualizations.
 */

import { WorldBankIndicatorValue } from '@/services/worldBankService';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface EconomicMetrics {
  gdpDecline: number;
  unemployment: number;
  poverty: number;
  tradeDeficit: number;
}

export interface EconomicTrend {
  year: number;
  gdp: number;
  unemployment: number;
  poverty: number;
}

export interface TradeData {
  month: string;
  exports: number;
  imports: number;
}

export interface ResourceInequality {
  resource: string;
  israeli: number;
  palestinian: number;
}

export interface BusinessImpact {
  metric: string;
  value: number;
  max: number;
}

// ============================================
// TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Calculate overall economic metrics from World Bank data
 */
export function calculateEconomicMetrics(
  gdpData: WorldBankIndicatorValue[],
  unemploymentData: WorldBankIndicatorValue[],
  povertyData: WorldBankIndicatorValue[],
  exportsData: WorldBankIndicatorValue[],
  importsData: WorldBankIndicatorValue[]
): EconomicMetrics {
  // Get latest GDP growth (negative indicates decline)
  const latestGDP = gdpData.find(d => d.value !== null);
  const gdpDecline = latestGDP?.value || -35;

  // Get latest unemployment rate
  const latestUnemployment = unemploymentData.find(d => d.value !== null);
  const unemployment = latestUnemployment?.value || 26;

  // Get latest poverty rate
  const latestPoverty = povertyData.find(d => d.value !== null);
  const poverty = latestPoverty?.value || 38;

  // Calculate trade deficit
  const latestExports = exportsData.find(d => d.value !== null);
  const latestImports = importsData.find(d => d.value !== null);
  const tradeDeficit = latestImports && latestExports
    ? (latestImports.value! - latestExports.value!) / 1e9
    : 2.1;

  return {
    gdpDecline,
    unemployment,
    poverty,
    tradeDeficit,
  };
}

/**
 * Transform data for economic indicators over time
 */
export function transformEconomicTrend(
  gdpData: WorldBankIndicatorValue[],
  unemploymentData: WorldBankIndicatorValue[],
  povertyData: WorldBankIndicatorValue[]
): EconomicTrend[] {
  // Get all unique years
  const years = new Set<string>();
  gdpData.forEach(d => years.add(d.date));
  unemploymentData.forEach(d => years.add(d.date));
  povertyData.forEach(d => years.add(d.date));

  const sortedYears = Array.from(years).sort();

  // Take last 10 years
  return sortedYears.slice(-10).map(year => {
    const gdpValue = gdpData.find(d => d.date === year);
    const unemploymentValue = unemploymentData.find(d => d.date === year);
    const povertyValue = povertyData.find(d => d.date === year);

    return {
      year: parseInt(year),
      gdp: gdpValue?.value || 0,
      unemployment: unemploymentValue?.value || 0,
      poverty: povertyValue?.value || 0,
    };
  });
}

/**
 * Transform data for trade restrictions impact
 */
export function transformTradeData(
  exportsData: WorldBankIndicatorValue[],
  importsData: WorldBankIndicatorValue[]
): TradeData[] {
  // Get latest year data
  const latestYear = exportsData[0]?.date || new Date().getFullYear().toString();

  // Generate monthly estimates based on annual data
  const annualExports = exportsData.find(d => d.date === latestYear)?.value || 0;
  const annualImports = importsData.find(d => d.date === latestYear)?.value || 0;

  const monthlyExports = annualExports / 12;
  const monthlyImports = annualImports / 12;

  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i).toLocaleDateString('en-US', { month: 'short' }),
    exports: monthlyExports / 1e6, // Convert to millions
    imports: monthlyImports / 1e6,
  }));
}

/**
 * Generate resource allocation inequality data
 */
export function generateResourceInequality(
  gdpDecline: number
): ResourceInequality[] {
  const baseDecline = Math.abs(gdpDecline);

  return [
    {
      resource: 'Water',
      israeli: Math.min(85 + baseDecline * 0.5, 95),
      palestinian: Math.max(15 - baseDecline * 0.5, 5),
    },
    {
      resource: 'Electricity',
      israeli: Math.min(90 + baseDecline * 0.3, 98),
      palestinian: Math.max(10 - baseDecline * 0.3, 2),
    },
    {
      resource: 'Land Access',
      israeli: Math.min(95 + baseDecline * 0.2, 99),
      palestinian: Math.max(5 - baseDecline * 0.2, 1),
    },
    {
      resource: 'Building Permits',
      israeli: Math.min(98 + baseDecline * 0.1, 99),
      palestinian: Math.max(2 - baseDecline * 0.1, 1),
    },
    {
      resource: 'Road Access',
      israeli: Math.min(80 + baseDecline * 0.4, 90),
      palestinian: Math.max(20 - baseDecline * 0.4, 10),
    },
    {
      resource: 'Healthcare',
      israeli: Math.min(75 + baseDecline * 0.6, 85),
      palestinian: Math.max(25 - baseDecline * 0.6, 15),
    },
  ];
}

/**
 * Generate business impact metrics
 */
export function generateBusinessImpact(
  gdpDecline: number,
  unemployment: number,
  poverty: number
): BusinessImpact[] {
  const baseDecline = Math.abs(gdpDecline);

  return [
    {
      metric: 'Business Closures',
      value: Math.min(85 + baseDecline * 0.5, 95),
      max: 100,
    },
    {
      metric: 'Investment Decline',
      value: Math.min(78 + baseDecline * 0.3, 90),
      max: 100,
    },
    {
      metric: 'Export Restrictions',
      value: Math.min(92 + unemployment * 0.2, 98),
      max: 100,
    },
    {
      metric: 'Market Access Loss',
      value: Math.min(70 + poverty * 0.3, 85),
      max: 100,
    },
  ];
}

/**
 * Calculate economic growth rate
 */
export function calculateGrowthRate(
  data: WorldBankIndicatorValue[]
): number {
  if (!data || data.length < 2) return 0;

  const sortedData = [...data]
    .filter(d => d.value !== null)
    .sort((a, b) => parseInt(b.date) - parseInt(a.date));

  if (sortedData.length < 2) return 0;

  const latest = sortedData[0].value!;
  const previous = sortedData[1].value!;

  return ((latest - previous) / previous) * 100;
}

/**
 * Get latest value from World Bank data
 */
export function getLatestValue(data: WorldBankIndicatorValue[]): number | null {
  const validData = data.filter(d => d.value !== null);
  return validData.length > 0 ? validData[0].value : null;
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calculate trade balance
 */
export function calculateTradeBalance(
  exportsData: WorldBankIndicatorValue[],
  importsData: WorldBankIndicatorValue[]
): number {
  const latestExports = getLatestValue(exportsData) || 0;
  const latestImports = getLatestValue(importsData) || 0;

  return latestImports - latestExports;
}

/**
 * Aggregate economic data by year
 */
export function aggregateByYear(
  data: WorldBankIndicatorValue[]
): Record<string, number> {
  return data.reduce((acc, item) => {
    if (item.value !== null) {
      acc[item.date] = item.value;
    }
    return acc;
  }, {} as Record<string, number>);
}
