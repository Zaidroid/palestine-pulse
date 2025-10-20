/**
 * World Bank Open Data API Service
 * 
 * Provides access to World Bank economic indicators for Palestine
 * API Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 * 
 * Country Code: PSE (West Bank and Gaza)
 * API Base: https://api.worldbank.org/v2
 * 
 * Features:
 * - No authentication required
 * - Free access
 * - JSON format
 * - Historical data available
 */

// ============================================
// CONSTANTS
// ============================================

const WORLD_BANK_BASE = 'https://api.worldbank.org/v2';
const PALESTINE_CODE = 'PSE';

/**
 * Available World Bank Indicators for Palestine
 * Full list: https://data.worldbank.org/country/west-bank-and-gaza
 */
export const WORLDBANK_INDICATORS = {
  // Economic Indicators
  GDP: 'NY.GDP.MKTP.CD',              // GDP (current US$)
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',    // GDP growth (annual %)
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',   // GDP per capita (current US$)
  
  // Labor Market
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',     // Unemployment, total (% of total labor force)
  UNEMPLOYMENT_YOUTH: 'SL.UEM.1524.ZS', // Unemployment, youth total (% of total labor force ages 15-24)
  
  // Poverty & Inequality
  POVERTY: 'SI.POV.DDAY',             // Poverty headcount ratio at $2.15 a day
  POVERTY_GAP: 'SI.POV.GAPS',         // Poverty gap at $2.15 a day (%)
  
  // Prices & Inflation
  INFLATION: 'FP.CPI.TOTL.ZG',        // Inflation, consumer prices (annual %)
  CPI: 'FP.CPI.TOTL',                 // Consumer price index (2010 = 100)
  
  // Trade & Balance of Payments
  TRADE_GOODS: 'TG.VAL.TOTL.GD.ZS',   // Merchandise trade (% of GDP)
  EXPORTS: 'NE.EXP.GNFS.CD',          // Exports of goods and services (current US$)
  IMPORTS: 'NE.IMP.GNFS.CD',          // Imports of goods and services (current US$)
  
  // Development Indicators
  LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',  // Life expectancy at birth, total (years)
  INFANT_MORTALITY: 'SP.DYN.IMRT.IN', // Mortality rate, infant (per 1,000 live births)
  
  // Agriculture
  AGRICULTURE_GDP: 'NV.AGR.TOTL.ZS',  // Agriculture, forestry, and fishing, value added (% of GDP)
} as const;

// ============================================
// TYPES
// ============================================

export interface WorldBankIndicatorValue {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface WorldBankResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

export interface WorldBankApiResponse {
  metadata: WorldBankResponse;
  data: WorldBankIndicatorValue[];
}

// ============================================
// ERROR HANDLING
// ============================================

export class WorldBankError extends Error {
  constructor(
    message: string,
    public indicator?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'WorldBankError';
  }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch a single indicator for Palestine
 * @param indicator - Indicator ID (e.g., 'NY.GDP.MKTP.CD')
 * @param startYear - Start year (e.g., 2020)
 * @param endYear - End year (e.g., 2024)
 * @returns Array of indicator values
 */
export const fetchWorldBankIndicator = async (
  indicator: string,
  startYear: number,
  endYear: number
): Promise<WorldBankIndicatorValue[]> => {
  try {
    const url = `${WORLD_BANK_BASE}/countries/${PALESTINE_CODE}/indicators/${indicator}?format=json&date=${startYear}:${endYear}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new WorldBankError(
        `World Bank API error: ${response.statusText}`,
        indicator,
        response.status
      );
    }
    
    const data = await response.json();
    
    // World Bank API returns [metadata, data]
    // If no data, returns [metadata, null]
    if (!data[1]) {
      return [];
    }
    
    return data[1] as WorldBankIndicatorValue[];
  } catch (error) {
    if (error instanceof WorldBankError) {
      throw error;
    }
    throw new WorldBankError(
      `Failed to fetch indicator ${indicator}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      indicator
    );
  }
};

/**
 * Fetch multiple indicators at once
 * @param indicators - Array of indicator IDs
 * @param startYear - Start year
 * @param endYear - End year
 * @returns Object with indicator IDs as keys
 */
export const fetchMultipleIndicators = async (
  indicators: string[],
  startYear: number,
  endYear: number
): Promise<Record<string, WorldBankIndicatorValue[]>> => {
  const results = await Promise.allSettled(
    indicators.map(indicator =>
      fetchWorldBankIndicator(indicator, startYear, endYear)
    )
  );
  
  const data: Record<string, WorldBankIndicatorValue[]> = {};
  
  results.forEach((result, index) => {
    const indicator = indicators[index];
    if (result.status === 'fulfilled') {
      data[indicator] = result.value;
    } else {
      console.warn(`Failed to fetch ${indicator}:`, result.reason);
      data[indicator] = [];
    }
  });
  
  return data;
};

/**
 * Fetch economic snapshot (GDP, unemployment, inflation)
 * @param year - Year to fetch (default: latest available)
 * @returns Object with key economic indicators
 */
export const fetchEconomicSnapshot = async (
  startYear: number,
  endYear: number
) => {
  const indicators = [
    WORLDBANK_INDICATORS.GDP,
    WORLDBANK_INDICATORS.GDP_GROWTH,
    WORLDBANK_INDICATORS.UNEMPLOYMENT,
    WORLDBANK_INDICATORS.INFLATION,
    WORLDBANK_INDICATORS.GDP_PER_CAPITA,
  ];
  
  return fetchMultipleIndicators(indicators, startYear, endYear);
};

/**
 * Get latest value for an indicator
 * @param data - Array of indicator values
 * @returns Latest non-null value
 */
export const getLatestValue = (
  data: WorldBankIndicatorValue[]
): WorldBankIndicatorValue | null => {
  const validData = data.filter(item => item.value !== null);
  return validData.length > 0 ? validData[0] : null;
};

/**
 * Format currency value
 * @param value - Value in US dollars
 * @returns Formatted string (e.g., "$18.08B")
 */
export const formatCurrency = (value: number | null): string => {
  if (value === null) return 'N/A';
  
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  
  return `$${value.toFixed(2)}`;
};

/**
 * Format percentage value
 * @param value - Percentage value
 * @returns Formatted string (e.g., "5.2%")
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
};

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export const fetchGDP = (startYear: number, endYear: number) =>
  fetchWorldBankIndicator(WORLDBANK_INDICATORS.GDP, startYear, endYear);

export const fetchUnemployment = (startYear: number, endYear: number) =>
  fetchWorldBankIndicator(WORLDBANK_INDICATORS.UNEMPLOYMENT, startYear, endYear);

export const fetchInflation = (startYear: number, endYear: number) =>
  fetchWorldBankIndicator(WORLDBANK_INDICATORS.INFLATION, startYear, endYear);

export const fetchGDPPerCapita = (startYear: number, endYear: number) =>
  fetchWorldBankIndicator(WORLDBANK_INDICATORS.GDP_PER_CAPITA, startYear, endYear);