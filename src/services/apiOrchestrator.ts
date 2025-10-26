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
import { rateLimitManager } from './rateLimitManager';
import { performanceMonitor } from './performanceMonitor';

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
    enabled: false, // Disabled due to rate limiting
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
    baseUrl: '/api/goodshepherd', // Proxied to https://goodshepherdcollective.org/api
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
  private useRateLimiting: boolean = true;

  constructor() {
    // Initialize with configured sources
    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      this.sources.set(key as DataSource, config);
    });

    // Initialize rate limit manager
    if (this.useRateLimiting) {
      rateLimitManager.initialize();
    }
  }

  /**
   * Fetch data from a specific source with rate limiting
   */
  async fetch<T>(
    source: DataSource,
    endpoint: string,
    options: {
      useCache?: boolean;
      cacheKey?: string;
      params?: Record<string, string>;
      priority?: number;
      bypassRateLimit?: boolean;
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

    const { useCache = true, cacheKey, params, priority = 0, bypassRateLimit = false } = options;
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

    // Execute fetch with or without rate limiting
    const executeFetch = async (): Promise<ApiResponse<T>> => {
      const startTime = Date.now();
      
      try {
        // Build URL - handle both absolute and relative base URLs
        let urlString: string;
        if (config.baseUrl.startsWith('http://') || config.baseUrl.startsWith('https://')) {
          // Absolute URL
          const url = new URL(endpoint, config.baseUrl);
          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              url.searchParams.append(key, value);
            });
          }
          urlString = url.toString();
        } else {
          // Relative URL (like /api/goodshepherd)
          urlString = `${config.baseUrl}/${endpoint}`;
          if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              searchParams.append(key, value);
            });
            urlString += `?${searchParams.toString()}`;
          }
        }

        // Fetch with retry
        const response = await fetchWithRetry(
          urlString,
          {},
          config.retry_attempts
        );

        const data = await response.json();

        // Record successful request
        const responseTime = Date.now() - startTime;
        performanceMonitor.recordRequest(
          source,
          endpoint,
          responseTime,
          true
        );

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
        // Record failed request
        const responseTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        performanceMonitor.recordRequest(
          source,
          endpoint,
          responseTime,
          false,
          errorMessage
        );

        const apiError: ApiError = {
          message: errorMessage,
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
    };

    // Use rate limiting if enabled and not bypassed
    if (this.useRateLimiting && !bypassRateLimit) {
      return rateLimitManager.enqueueRequest(source, executeFetch, priority);
    } else {
      return executeFetch();
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
   * Get rate limit statistics
   */
  getRateLimitStats() {
    return rateLimitManager.getAllSourcesStatus();
  }

  /**
   * Get rate limit status for a specific source
   */
  getRateLimitStatus(source: DataSource) {
    return rateLimitManager.getSourceStatus(source);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return performanceMonitor.getAllSourcesMetrics();
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return performanceMonitor.getSummary();
  }

  /**
   * Get performance alerts
   */
  getPerformanceAlerts() {
    return performanceMonitor.getAlerts();
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
   * Enable/disable rate limiting
   */
  setRateLimitingEnabled(enabled: boolean): void {
    this.useRateLimiting = enabled;
    if (enabled) {
      rateLimitManager.initialize();
    } else {
      rateLimitManager.shutdown();
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