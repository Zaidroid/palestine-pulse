/**
 * Unified Data Hook - Single pattern for all data loading
 * 
 * Features:
 * - Local data first, API fallback
 * - Automatic retry and error handling
 * - Consistent loading states
 * - Cache management
 * - Zero hardcoded data
 * 
 * Usage:
 * const { data, isLoading, error } = useUnifiedData({
 *   source: 'tech4palestine',
 *   dataset: 'casualties',
 *   mode: 'recent',
 *   apiEndpoint: '/api/tech4palestine/v2/casualties_daily.json'
 * });
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';

// ============================================
// TYPES
// ============================================

export type DataSource = 'tech4palestine' | 'goodshepherd' | 'worldbank' | 'hdx';

export type DataMode = 'recent' | 'dateRange' | 'quarter' | 'complete' | 'single';

export interface UseUnifiedDataOptions {
  source: DataSource;
  dataset: string;
  mode: DataMode;
  dateRange?: { start: string; end: string };
  quarter?: string;
  apiEndpoint?: string; // Fallback API endpoint
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UnifiedDataResponse<T = any> {
  data: T;
  metadata?: {
    source: string;
    dataset: string;
    record_count?: number;
    last_updated?: string;
  };
}

// ============================================
// PATH BUILDERS
// ============================================

function buildLocalPath(options: UseUnifiedDataOptions): string {
  const { source, dataset, mode, quarter, dateRange } = options;
  
  const basePath = `/data/${source}/${dataset}`;
  
  switch (mode) {
    case 'recent':
      return `${basePath}/recent.json`;
    
    case 'quarter':
      if (!quarter) throw new Error('Quarter required for quarter mode');
      return `${basePath}/${quarter}.json`;
    
    case 'complete':
      return `${basePath}/index.json`; // Will load all files
    
    case 'single':
      return `${basePath}.json`; // For non-partitioned data
    
    case 'dateRange':
      // For now, load recent and filter
      // TODO: Implement smart quarter loading
      return `${basePath}/recent.json`;
    
    default:
      return `${basePath}/recent.json`;
  }
}

// ============================================
// DATA PROCESSORS
// ============================================

function processLocalData<T>(
  rawData: any,
  options: UseUnifiedDataOptions
): T {
  // Handle different data structures
  if (rawData.data) {
    // Standard format: { metadata: {...}, data: [...] }
    return rawData.data as T;
  }
  
  // Direct data array
  if (Array.isArray(rawData)) {
    return rawData as T;
  }
  
  // Direct object
  return rawData as T;
}

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ============================================
// MAIN HOOK
// ============================================

export function useUnifiedData<T = any>(
  options: UseUnifiedDataOptions
): UseQueryResult<T, Error> {
  const {
    source,
    dataset,
    mode,
    apiEndpoint,
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes default
    gcTime = 1000 * 60 * 30, // 30 minutes default
  } = options;

  return useQuery<T, Error>({
    queryKey: [source, dataset, mode, options.quarter, options.dateRange],
    queryFn: async () => {
      // 1. Try local data first
      const localPath = buildLocalPath(options);
      
      try {
        console.log(`🔍 Trying local data: ${localPath}`);
        const response = await fetch(localPath);
        
        if (response.ok) {
          const rawData = await response.json();
          const processedData = processLocalData<T>(rawData, options);
          console.log(`✅ Loaded ${dataset} from local data (${source})`);
          return processedData;
        }
      } catch (error) {
        console.log(`⚠️ Local data unavailable for ${dataset}:`, error instanceof Error ? error.message : 'Unknown error');
      }
      
      // 2. Fallback to API if provided
      if (apiEndpoint) {
        console.log(`📡 Fetching ${dataset} from API: ${apiEndpoint}`);
        try {
          const data = await fetchFromAPI<T>(apiEndpoint);
          console.log(`✅ Loaded ${dataset} from API`);
          return data;
        } catch (error) {
          console.error(`❌ API request failed for ${dataset}:`, error);
          throw error;
        }
      }
      
      // 3. No data available
      throw new Error(`No data available for ${source}/${dataset}. Local data not found and no API endpoint provided.`);
    },
    enabled,
    staleTime,
    gcTime,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

// ============================================
// CONVENIENCE HOOKS
// ============================================

/**
 * Load recent data (last 30 days)
 */
export function useRecentData<T = any>(
  source: DataSource,
  dataset: string,
  apiEndpoint?: string
) {
  return useUnifiedData<T>({
    source,
    dataset,
    mode: 'recent',
    apiEndpoint,
  });
}

/**
 * Load data for a specific date range
 */
export function useDateRangeData<T = any>(
  source: DataSource,
  dataset: string,
  startDate: string,
  endDate: string,
  apiEndpoint?: string
) {
  return useUnifiedData<T>({
    source,
    dataset,
    mode: 'dateRange',
    dateRange: { start: startDate, end: endDate },
    apiEndpoint,
  });
}

/**
 * Load data for a specific quarter
 */
export function useQuarterData<T = any>(
  source: DataSource,
  dataset: string,
  quarter: string,
  apiEndpoint?: string
) {
  return useUnifiedData<T>({
    source,
    dataset,
    mode: 'quarter',
    quarter,
    apiEndpoint,
  });
}

/**
 * Load single file (non-partitioned data)
 */
export function useSingleData<T = any>(
  source: DataSource,
  dataset: string,
  apiEndpoint?: string
) {
  return useUnifiedData<T>({
    source,
    dataset,
    mode: 'single',
    apiEndpoint,
  });
}

// ============================================
// EXPORTS
// ============================================

export default useUnifiedData;
