/**
 * API Orchestrator Service
 * 
 * Handles data fetching from multiple sources with:
 * - Parallel API calls for performance
 * - Error handling and fallbacks
 * - Data normalization
 * - Client-side caching
 * - Retry logic
 * 
 * Fully serverless compatible - runs entirely in the browser
 */

// NOTE: Several data sources are disabled due to CORS restrictions.
// A proxy server is required to bypass these restrictions in a development environment.

import { 
  DataSource, 
  DataSourceConfig, 
  ApiResponse, 
  ApiError 
} from '../types/data.types';

// ============================================
// DATA SOURCE CONFIGURATIONS
// ============================================

export const DATA_SOURCES: Record<DataSource, DataSourceConfig> = {
  tech4palestine: {
    name: 'tech4palestine',
    baseUrl: '/api/tech4palestine',
    enabled: true,
    priority: 1,
    cache_ttl: 5 * 60 * 1000, // 5 minutes
    retry_attempts: 3,
  },
  un_ocha: {
    name: 'un_ocha',
    baseUrl: 'https://data.humdata.org/api/action',
    enabled: true, // ✅ ENABLED: HDX CKAN API for multiple datasets
    priority: 2,
    cache_ttl: 60 * 60 * 1000, // 1 hour (HDX data updates vary)
    retry_attempts: 2,
  },
  who: {
    name: 'who',
    baseUrl: 'https://www.who.int/api',
    enabled: false,
    priority: 3,
    cache_ttl: 30 * 60 * 1000, // 30 minutes
    retry_attempts: 2,
  },
  world_bank: {
    name: 'world_bank',
    baseUrl: '/api/worldbank',
    enabled: true, // ✅ ENABLED: World Bank Open Data API
    priority: 3,
    cache_ttl: 24 * 60 * 60 * 1000, // 24 hours (economic data updates slowly)
    retry_attempts: 2,
  },
  unrwa: {
    name: 'unrwa',
    baseUrl: 'https://www.unrwa.org/api',
    enabled: false,
    priority: 5,
    cache_ttl: 60 * 60 * 1000, // 1 hour
    retry_attempts: 2,
  },
  pcbs: {
    name: 'pcbs',
    baseUrl: 'https://www.pcbs.gov.ps/api',
    enabled: false,
    priority: 6,
    cache_ttl: 24 * 60 * 60 * 1000, // 24 hours
    retry_attempts: 2,
  },
  btselem: {
    name: 'btselem',
    baseUrl: '/api/btselem',
    enabled: true,
    priority: 7,
    cache_ttl: 60 * 60 * 1000, // 1 hour
    retry_attempts: 2,
  },
  wfp: {
    name: 'wfp',
    baseUrl: 'https://api.wfp.org/api',
    enabled: false,
    priority: 8,
    cache_ttl: 60 * 60 * 1000, // 1 hour
    retry_attempts: 2,
  },
  goodshepherd: {
    name: 'goodshepherd',
    baseUrl: '/api/goodshepherd',
    enabled: true,
    priority: 2,
    cache_ttl: 60 * 60 * 1000, // 1 hour (data doesn't change frequently)
    retry_attempts: 2,
  },
  custom: {
    name: 'custom',
    baseUrl: '',
    enabled: false,
    priority: 10,
    cache_ttl: 5 * 60 * 1000,
    retry_attempts: 1,
  },
};

// ============================================
// TECH FOR PALESTINE ENDPOINTS
// ============================================

export const TECH4PALESTINE_ENDPOINTS = {
  killedInGaza: '/v3/killed-in-gaza.min.json',
  pressKilled: '/v2/press_killed_in_gaza.json',
  summary: '/v3/summary.json',
  casualtiesDaily: '/v2/casualties_daily.json',
  westBankDaily: '/v2/west_bank_daily.json',
  infrastructure: '/v3/infrastructure-damaged.json',
} as const;

// ============================================
// GOOD SHEPHERD COLLECTIVE ENDPOINTS
// ============================================

export const GOODSHEPHERD_ENDPOINTS = {
  childPrisoners: 'child_prisoners.json',
  wbData: 'wb_data.json',
  healthcareAttacks: 'healthcare_attacks.json',
  homeDemolitions: 'home_demolitions.json',
  ngoData: 'ngo_data.json',
  prisonerData: 'prisoner_data.json',
} as const;

// ============================================
// WFP (WORLD FOOD PROGRAMME) ENDPOINTS
// ============================================

export const WFP_ENDPOINTS = {
  foodPrices: 'food_prices_palestine.json',
  marketMonitoring: 'market_monitoring.json',
  foodSecurity: 'food_security_assessment.json',
  nutrition: 'nutrition_survey.json',
} as const;

// ============================================
// ERROR HANDLING
// ============================================

class ApiOrchestratorError extends Error {
  constructor(
    message: string,
    public source: DataSource,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiOrchestratorError';
  }
}

// ============================================
// CACHE MANAGEMENT (In-Memory)
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  source: DataSource;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, source: DataSource): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      source,
    });
  }

  get<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

const cache = new CacheManager();

// ============================================
// FETCH WITH RETRY
// ============================================

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (response.ok) {
        return response;
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Retry on 5xx errors (server errors)
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on network errors for the last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}

// ============================================
// API ORCHESTRATOR CLASS
// ============================================

export class ApiOrchestrator {
  private sources: Map<DataSource, DataSourceConfig> = new Map();

  constructor() {
    // Initialize with configured sources
    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      this.sources.set(key as DataSource, config);
    });
  }

  /**
   * Fetch data from a specific source
   */
  async fetch<T>(
    source: DataSource,
    endpoint: string,
    options: {
      useCache?: boolean;
      cacheKey?: string;
      params?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const config = this.sources.get(source);
    
    if (!config) {
      throw new ApiOrchestratorError(
        `Data source ${source} not configured`,
        source
      );
    }

    if (!config.enabled) {
      throw new ApiOrchestratorError(
        `Data source ${source} is disabled`,
        source
      );
    }

    const { useCache = true, cacheKey, params } = options;
    const finalCacheKey = cacheKey || `${source}:${endpoint}`;

    // Check cache first
    if (useCache) {
      const cachedData = cache.get<T>(finalCacheKey, config.cache_ttl);
      if (cachedData) {
        return {
          data: cachedData,
          success: true,
          timestamp: new Date().toISOString(),
          source,
        };
      }
    }

    try {
      // Build URL with params
      const url = new URL(endpoint, config.baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      // Fetch with retry
      const response = await fetchWithRetry(
        url.toString(),
        {},
        config.retry_attempts
      );

      const data = await response.json();

      // Cache the result
      if (useCache) {
        cache.set(finalCacheKey, data, source);
      }

      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        source,
      };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'FETCH_ERROR',
        status: 0,
        source,
        timestamp: new Date().toISOString(),
      };

      throw new ApiOrchestratorError(
        apiError.message,
        source,
        apiError.status,
        error as Error
      );
    }
  }

  /**
   * Fetch from multiple sources in parallel
   */
  async fetchMultiple<T>(
    requests: Array<{
      source: DataSource;
      endpoint: string;
      options?: Parameters<typeof this.fetch>[2];
    }>
  ): Promise<Array<ApiResponse<T> | ApiError>> {
    const promises = requests.map(async ({ source, endpoint, options }) => {
      try {
        return await this.fetch<T>(source, endpoint, options);
      } catch (error) {
        return {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'FETCH_ERROR',
          status: 0,
          source,
          timestamp: new Date().toISOString(),
        } as ApiError;
      }
    });

    return Promise.all(promises);
  }

  /**
   * Fetch with fallback sources
   */
  async fetchWithFallback<T>(
    primarySource: DataSource,
    fallbackSources: DataSource[],
    endpoint: string,
    options?: Parameters<typeof this.fetch>[2]
  ): Promise<ApiResponse<T>> {
    // Try primary source first
    try {
      return await this.fetch<T>(primarySource, endpoint, options);
    } catch (primaryError) {
      console.warn(`Primary source ${primarySource} failed, trying fallbacks...`);

      // Try fallback sources in order
      for (const fallbackSource of fallbackSources) {
        try {
          return await this.fetch<T>(fallbackSource, endpoint, options);
        } catch (fallbackError) {
          console.warn(`Fallback source ${fallbackSource} failed`);
        }
      }

      // All sources failed
      throw new ApiOrchestratorError(
        'All data sources failed',
        primarySource,
        0,
        primaryError as Error
      );
    }
  }

  /**
   * Clear cache for a specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      cache.remove(key);
    } else {
      cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }

  /**
   * Enable/disable a data source
   */
  setSourceEnabled(source: DataSource, enabled: boolean): void {
    const config = this.sources.get(source);
    if (config) {
      config.enabled = enabled;
    }
  }

  /**
   * Get all enabled sources
   */
  getEnabledSources(): DataSource[] {
    return Array.from(this.sources.entries())
      .filter(([_, config]) => config.enabled)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([source, _]) => source);
  }

  /**
   * Update source configuration
   */
  updateSourceConfig(source: DataSource, updates: Partial<DataSourceConfig>): void {
    const config = this.sources.get(source);
    if (config) {
      Object.assign(config, updates);
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const apiOrchestrator = new ApiOrchestrator();

// ============================================
// CONVENIENCE FUNCTIONS FOR TECH4PALESTINE
// ============================================

export const fetchKilledInGaza = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.killedInGaza);

export const fetchPressKilled = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.pressKilled);

export const fetchSummary = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.summary);

export const fetchCasualtiesDaily = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.casualtiesDaily);

export const fetchWestBankDaily = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.westBankDaily);

export const fetchInfrastructure = () =>
  apiOrchestrator.fetch('tech4palestine', TECH4PALESTINE_ENDPOINTS.infrastructure);

// ============================================
// CONVENIENCE FUNCTIONS FOR GOOD SHEPHERD COLLECTIVE
// ============================================

export const fetchChildPrisoners = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.childPrisoners);

export const fetchWestBankData = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.wbData);

export const fetchHealthcareAttacks = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.healthcareAttacks);

// ============================================
// CONVENIENCE FUNCTIONS FOR WFP
// ============================================

export const fetchFoodPrices = () =>
  apiOrchestrator.fetch('wfp', WFP_ENDPOINTS.foodPrices);

export const fetchMarketMonitoring = () =>
  apiOrchestrator.fetch('wfp', WFP_ENDPOINTS.marketMonitoring);

export const fetchFoodSecurity = () =>
  apiOrchestrator.fetch('wfp', WFP_ENDPOINTS.foodSecurity);

export const fetchNutrition = () =>
  apiOrchestrator.fetch('wfp', WFP_ENDPOINTS.nutrition);

export const fetchHomeDemolitions = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.homeDemolitions);

export const fetchNGOData = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.ngoData);

export const fetchPrisonerData = () =>
  apiOrchestrator.fetch('goodshepherd', GOODSHEPHERD_ENDPOINTS.prisonerData);

// Export for use in hooks
export default apiOrchestrator;