/**
 * World Bank Data Hooks
 * 
 * Custom React Query hooks for fetching World Bank economic indicators
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchWorldBankIndicator,
  fetchEconomicSnapshot,
  WORLDBANK_INDICATORS,
  WorldBankIndicatorValue,
} from '../services/worldBankService';

// ============================================
// GDP HOOKS
// ============================================

/**
 * Fetch GDP data for a date range
 */
export const useWorldBankGDP = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'gdp', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.GDP,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch GDP growth rate
 */
export const useWorldBankGDPGrowth = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'gdp-growth', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.GDP_GROWTH,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch GDP per capita
 */
export const useWorldBankGDPPerCapita = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'gdp-per-capita', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.GDP_PER_CAPITA,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// LABOR MARKET HOOKS
// ============================================

/**
 * Fetch unemployment rate
 */
export const useWorldBankUnemployment = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'unemployment', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.UNEMPLOYMENT,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch youth unemployment rate
 */
export const useWorldBankYouthUnemployment = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'youth-unemployment', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.UNEMPLOYMENT_YOUTH,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// INFLATION HOOKS
// ============================================

/**
 * Fetch inflation rate
 */
export const useWorldBankInflation = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'inflation', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.INFLATION,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch Consumer Price Index
 */
export const useWorldBankCPI = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'cpi', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.CPI,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// TRADE HOOKS
// ============================================

/**
 * Fetch exports data
 */
export const useWorldBankExports = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'exports', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.EXPORTS,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch imports data
 */
export const useWorldBankImports = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'imports', startYear, endYear],
    queryFn: () => fetchWorldBankIndicator(
      WORLDBANK_INDICATORS.IMPORTS,
      startYear,
      endYear
    ),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// COMBINED ECONOMIC SNAPSHOT HOOK
// ============================================

/**
 * Fetch all key economic indicators at once
 * Optimized for dashboard overview
 */
export const useEconomicSnapshot = (startYear: number, endYear: number) => {
  return useQuery({
    queryKey: ['worldbank', 'economic-snapshot', startYear, endYear],
    queryFn: () => fetchEconomicSnapshot(startYear, endYear),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// UTILITY FUNCTIONS FOR COMPONENTS
// ============================================

/**
 * Extract latest value from World Bank data array
 */
export const useLatestValue = (data: WorldBankIndicatorValue[] | undefined) => {
  if (!data || data.length === 0) return null;
  
  // World Bank returns data newest first
  const latestNonNull = data.find(item => item.value !== null);
  return latestNonNull || null;
};

/**
 * Calculate year-over-year change
 */
export const calculateYoYChange = (
  data: WorldBankIndicatorValue[] | undefined
): number | null => {
  if (!data || data.length < 2) return null;
  
  const current = data[0]?.value;
  const previous = data[1]?.value;
  
  if (current === null || previous === null || previous === 0) return null;
  
  return ((current - previous) / previous) * 100;
};

/**
 * Transform World Bank data for charts
 */
export const transformForChart = (
  data: WorldBankIndicatorValue[] | undefined
): Array<{ year: string; value: number }> => {
  if (!data) return [];
  
  return data
    .filter(item => item.value !== null)
    .map(item => ({
      year: item.date,
      value: item.value as number,
    }))
    .reverse(); // Reverse to show oldest to newest
};