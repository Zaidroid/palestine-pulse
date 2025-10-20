/**
 * WFP (World Food Programme) Data Hooks
 * 
 * Custom React Query hooks for fetching WFP food price data
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchWFPFoodPrices,
  fetchWFPMarkets,
  filterByDateRange,
  filterByCommodity,
  filterByRegion,
  aggregateByMonth,
  getCommodityTrends,
  getLatestPrices,
  getTopPriceIncreases,
  WFPFoodPrice,
  WFPMarket,
} from '../services/wfpService';
import { useMemo } from 'react';

// ============================================
// CORE HOOKS
// ============================================

/**
 * Fetch full WFP food prices dataset
 * Warning: Large dataset (18K+ records)
 * Use with caution - consider using filtered/aggregated versions
 */
export const useWFPFoodPrices = () => {
  return useQuery({
    queryKey: ['wfp', 'foodPrices'],
    queryFn: fetchWFPFoodPrices,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Fetch WFP markets data
 */
export const useWFPMarkets = () => {
  return useQuery({
    queryKey: ['wfp', 'markets'],
    queryFn: fetchWFPMarkets,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ============================================
// FILTERED HOOKS
// ============================================

/**
 * Fetch food prices for a specific date range
 */
export const useWFPFoodPricesByDateRange = (
  startDate: string,
  endDate: string
) => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const filteredData = useMemo(() => {
    if (!allPrices) return [];
    return filterByDateRange(allPrices, startDate, endDate);
  }, [allPrices, startDate, endDate]);
  
  return {
    ...queryState,
    data: filteredData,
  };
};

/**
 * Fetch food prices for specific commodities
 */
export const useWFPFoodPricesByCommodity = (commodities: string[]) => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const filteredData = useMemo(() => {
    if (!allPrices) return [];
    return filterByCommodity(allPrices, commodities);
  }, [allPrices, commodities]);
  
  return {
    ...queryState,
    data: filteredData,
  };
};

/**
 * Fetch food prices for a specific region
 */
export const useWFPFoodPricesByRegion = (admin1?: string, admin2?: string) => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const filteredData = useMemo(() => {
    if (!allPrices) return [];
    return filterByRegion(allPrices, admin1, admin2);
  }, [allPrices, admin1, admin2]);
  
  return {
    ...queryState,
    data: filteredData,
  };
};

// ============================================
// AGGREGATED HOOKS
// ============================================

/**
 * Get aggregated monthly prices
 * Optimized for charts - much smaller dataset
 */
export const useWFPMonthlyAggregated = () => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const aggregatedData = useMemo(() => {
    if (!allPrices) return [];
    return aggregateByMonth(allPrices);
  }, [allPrices]);
  
  return {
    ...queryState,
    data: aggregatedData,
  };
};

/**
 * Get commodity trends for charts
 */
export const useWFPCommodityTrends = (commodities?: string[]) => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const trends = useMemo(() => {
    if (!allPrices) return [];
    return getCommodityTrends(allPrices, commodities);
  }, [allPrices, commodities]);
  
  return {
    ...queryState,
    data: trends,
  };
};

/**
 * Get latest prices for dashboard summary
 */
export const useWFPLatestPrices = () => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const latestPrices = useMemo(() => {
    if (!allPrices) return [];
    return getLatestPrices(allPrices);
  }, [allPrices]);
  
  return {
    ...queryState,
    data: latestPrices,
  };
};

/**
 * Get top price increases
 */
export const useWFPTopPriceIncreases = (count = 5) => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const topIncreases = useMemo(() => {
    if (!allPrices) return [];
    return getTopPriceIncreases(allPrices, count);
  }, [allPrices, count]);
  
  return {
    ...queryState,
    data: topIncreases,
  };
};

// ============================================
// REGIONAL HOOKS
// ============================================

/**
 * Get Gaza Strip food prices
 */
export const useWFPGazaPrices = () => {
  return useWFPFoodPricesByRegion('Gaza Strip');
};

/**
 * Get West Bank food prices
 */
export const useWFPWestBankPrices = () => {
  return useWFPFoodPricesByRegion('West Bank');
};

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Get available commodities list
 */
export const useWFPCommodities = () => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const commodities = useMemo(() => {
    if (!allPrices) return [];
    const unique = new Set(allPrices.map(item => item.commodity));
    return Array.from(unique).sort();
  }, [allPrices]);
  
  return {
    ...queryState,
    data: commodities,
  };
};

/**
 * Get date range covered in dataset
 */
export const useWFPDateRange = () => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const dateRange = useMemo(() => {
    if (!allPrices || allPrices.length === 0) {
      return { start: null, end: null };
    }
    
    const dates = allPrices.map(item => new Date(item.date));
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime()))),
    };
  }, [allPrices]);
  
  return {
    ...queryState,
    data: dateRange,
  };
};

/**
 * Get data statistics
 */
export const useWFPStatistics = () => {
  const { data: allPrices, ...queryState } = useWFPFoodPrices();
  
  const stats = useMemo(() => {
    if (!allPrices) {
      return {
        totalRecords: 0,
        uniqueCommodities: 0,
        uniqueMarkets: 0,
        dateRange: { start: null, end: null },
      };
    }
    
    return {
      totalRecords: allPrices.length,
      uniqueCommodities: new Set(allPrices.map(i => i.commodity)).size,
      uniqueMarkets: new Set(allPrices.map(i => i.market)).size,
      dateRange: {
        start: allPrices.reduce((min, item) => 
          item.date < min ? item.date : min, allPrices[0]?.date || ''),
        end: allPrices.reduce((max, item) => 
          item.date > max ? item.date : max, allPrices[0]?.date || ''),
      },
    };
  }, [allPrices]);
  
  return {
    ...queryState,
    data: stats,
  };
};