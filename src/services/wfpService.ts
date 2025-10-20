/**
 * World Food Programme (WFP) Data Service
 * 
 * Provides access to WFP food price data via UN OCHA HDX platform
 * Data Source: WFP Price Database via Humanitarian Data Exchange
 * 
 * Dataset: State of Palestine - Food Prices
 * Coverage: 2007 - Present
 * Update Frequency: Weekly/Monthly
 * Markets: 20 markets across Palestine
 * 
 * Features:
 * - No authentication required
 * - CSV format with HXL tags
 * - 18,000+ price records
 * - Geographic and commodity breakdowns
 */

import Papa from 'papaparse';

// ============================================
// CONSTANTS
// ============================================

// Use CORS proxy for HDX WFP data
const CORS_PROXY = 'https://corsproxy.io/?';

const WFP_FOOD_PRICES_CSV_URL =
  'https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/b82509ec-d48e-41d7-b376-af51c7f66737/download/wfp_food_prices_pse.csv';

const WFP_MARKETS_CSV_URL =
  'https://data.humdata.org/dataset/7d06b059-5831-4101-aa68-6d9123ad65b7/resource/11b2782c-65c4-403c-9984-68c99edc72f8/download/wfp_markets_pse.csv';

// ============================================
// TYPES
// ============================================

export interface WFPFoodPrice {
  date: string;
  admin1: string;
  admin2: string;
  market: string;
  market_id: string;
  latitude: number;
  longitude: number;
  category: string;
  commodity: string;
  commodity_id: string;
  unit: string;
  priceflag: string;
  pricetype: string;
  currency: string;
  price: number;
  usdprice: number;
}

export interface WFPMarket {
  market_id: string;
  market: string;
  countryiso3: string;
  admin1: string;
  admin2: string;
  latitude: number;
  longitude: number;
}

export interface WFPAggregatedPrice {
  month: string;
  commodity: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  marketCount: number;
}

export interface WFPCommodityTrend {
  commodity: string;
  data: Array<{
    date: string;
    price: number;
  }>;
}

// ============================================
// ERROR HANDLING
// ============================================

export class WFPServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'WFPServiceError';
  }
}

// ============================================
// CORE API FUNCTIONS
// ============================================

/**
 * Fetch WFP food prices (full dataset)
 * Warning: This is a large dataset (18K+ records, ~2MB)
 */
export const fetchWFPFoodPrices = async (): Promise<WFPFoodPrice[]> => {
  try {
    // Use CORS proxy
    const proxiedUrl = CORS_PROXY + encodeURIComponent(WFP_FOOD_PRICES_CSV_URL);
    console.log('Fetching WFP food prices via CORS proxy...');
    
    const response = await fetch(proxiedUrl);
    
    if (!response.ok) {
      throw new WFPServiceError(
        `Failed to fetch WFP food prices: ${response.statusText}`,
        response.status
      );
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('WFP CSV parsing warnings:', results.errors);
          }
          resolve(results.data as WFPFoodPrice[]);
        },
        error: (error) => {
          reject(new WFPServiceError(`CSV parsing error: ${error.message}`));
        },
      });
    });
  } catch (error) {
    if (error instanceof WFPServiceError) {
      throw error;
    }
    throw new WFPServiceError(
      `Failed to fetch WFP food prices: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Fetch WFP markets data
 */
export const fetchWFPMarkets = async (): Promise<WFPMarket[]> => {
  try {
    const response = await fetch(WFP_MARKETS_CSV_URL);
    
    if (!response.ok) {
      throw new WFPServiceError(
        `Failed to fetch WFP markets: ${response.statusText}`,
        response.status
      );
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as WFPMarket[]);
        },
        error: (error) => {
          reject(new WFPServiceError(`CSV parsing error: ${error.message}`));
        },
      });
    });
  } catch (error) {
    throw new WFPServiceError(
      `Failed to fetch WFP markets: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// ============================================
// DATA PROCESSING FUNCTIONS
// ============================================

/**
 * Filter food prices by date range
 */
export const filterByDateRange = (
  data: WFPFoodPrice[],
  startDate: string,
  endDate: string
): WFPFoodPrice[] => {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });
};

/**
 * Filter by commodity
 */
export const filterByCommodity = (
  data: WFPFoodPrice[],
  commodities: string[]
): WFPFoodPrice[] => {
  return data.filter(item => commodities.includes(item.commodity));
};

/**
 * Filter by region
 */
export const filterByRegion = (
  data: WFPFoodPrice[],
  admin1?: string,
  admin2?: string
): WFPFoodPrice[] => {
  let filtered = data;
  
  if (admin1) {
    filtered = filtered.filter(item => item.admin1 === admin1);
  }
  
  if (admin2) {
    filtered = filtered.filter(item => item.admin2 === admin2);
  }
  
  return filtered;
};

/**
 * Aggregate prices by month and commodity
 */
export const aggregateByMonth = (data: WFPFoodPrice[]): WFPAggregatedPrice[] => {
  const grouped: Record<string, WFPFoodPrice[]> = {};
  
  data.forEach(item => {
    const month = item.date.substring(0, 7); // YYYY-MM
    const key = `${month}-${item.commodity}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return Object.entries(grouped).map(([key, items]) => {
    const [month, commodity] = key.split('-');
    const prices = items.map(i => i.usdprice);
    
    return {
      month,
      commodity,
      avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      marketCount: new Set(items.map(i => i.market_id)).size,
    };
  });
};

/**
 * Get commodity trends
 */
export const getCommodityTrends = (
  data: WFPFoodPrice[],
  commodities?: string[]
): WFPCommodityTrend[] => {
  const filtered = commodities
    ? filterByCommodity(data, commodities)
    : data;
  
  const grouped: Record<string, WFPFoodPrice[]> = {};
  
  filtered.forEach(item => {
    if (!grouped[item.commodity]) {
      grouped[item.commodity] = [];
    }
    grouped[item.commodity].push(item);
  });
  
  return Object.entries(grouped).map(([commodity, items]) => {
    // Group by date and average prices
    const dateGroups: Record<string, number[]> = {};
    
    items.forEach(item => {
      if (!dateGroups[item.date]) {
        dateGroups[item.date] = [];
      }
      dateGroups[item.date].push(item.usdprice);
    });
    
    const data = Object.entries(dateGroups)
      .map(([date, prices]) => ({
        date,
        price: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return { commodity, data };
  });
};

/**
 * Get latest prices for each commodity
 */
export const getLatestPrices = (data: WFPFoodPrice[]): WFPFoodPrice[] => {
  const latestByCommodity: Record<string, WFPFoodPrice> = {};
  
  data.forEach(item => {
    const existing = latestByCommodity[item.commodity];
    if (!existing || item.date > existing.date) {
      latestByCommodity[item.commodity] = item;
    }
  });
  
  return Object.values(latestByCommodity);
};

/**
 * Calculate price change percentage
 */
export const calculatePriceChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get top commodities by price increase
 */
export const getTopPriceIncreases = (
  data: WFPFoodPrice[],
  count = 5
): Array<{ commodity: string; change: number; currentPrice: number }> => {
  const trends = getCommodityTrends(data);
  
  const changes = trends
    .map(trend => {
      if (trend.data.length < 2) return null;
      
      const latest = trend.data[trend.data.length - 1];
      const previous = trend.data[trend.data.length - 2];
      
      return {
        commodity: trend.commodity,
        change: calculatePriceChange(latest.price, previous.price),
        currentPrice: latest.price,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.change - a.change);
  
  return changes.slice(0, count);
};