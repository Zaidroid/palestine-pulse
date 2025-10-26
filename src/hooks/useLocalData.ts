/**
 * Local Data Loading Hook
 * 
 * Loads data from local JSON files with fallback to API
 * Supports time-series partitioning and date range filtering
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Types
export interface DataManifest {
  generated_at: string;
  version: string;
  baseline_date: string;
  datasets: Record<string, any>;
}

export interface DataIndex {
  dataset: string;
  date_range: {
    start: string;
    end: string;
    baseline_date: string;
  };
  files: Array<{
    file: string;
    date_range?: { start: string; end: string };
    quarter?: string;
    records: number;
    size_kb?: number;
  }>;
  last_updated: string;
}

export interface TimeSeriesData<T = any> {
  metadata: {
    source: string;
    dataset: string;
    date_range?: { start: string; end: string };
    record_count: number;
    last_updated: string;
  };
  data: T[];
}

// Helper: Fetch JSON from public directory
async function fetchLocalJSON<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

// Helper: Check if date is in range
function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

// Helper: Find files that overlap with date range
function findOverlappingFiles(
  index: DataIndex,
  startDate: string,
  endDate: string
): string[] {
  return index.files
    .filter(file => {
      if (!file.date_range) return true; // Include files without date range
      
      // Check if file's date range overlaps with requested range
      return (
        file.date_range.start <= endDate &&
        file.date_range.end >= startDate
      );
    })
    .map(file => file.file);
}

/**
 * Hook to load the global data manifest
 */
export function useDataManifest(): UseQueryResult<DataManifest, Error> {
  return useQuery({
    queryKey: ['data', 'manifest'],
    queryFn: () => fetchLocalJSON<DataManifest>('/data/manifest.json'),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Hook to load a dataset index
 */
export function useDataIndex(
  source: string,
  dataset: string
): UseQueryResult<DataIndex, Error> {
  return useQuery({
    queryKey: ['data', 'index', source, dataset],
    queryFn: () => fetchLocalJSON<DataIndex>(`/data/${source}/${dataset}/index.json`),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Hook to load recent data (last 30 days)
 */
export function useRecentData<T = any>(
  source: string,
  dataset: string,
  enabled: boolean = true
): UseQueryResult<TimeSeriesData<T>, Error> {
  return useQuery({
    queryKey: ['data', 'recent', source, dataset],
    queryFn: () => fetchLocalJSON<TimeSeriesData<T>>(`/data/${source}/${dataset}/recent.json`),
    staleTime: 1000 * 60 * 5, // 5 minutes (recent data updates frequently)
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    enabled,
  });
}

/**
 * Hook to load data for a specific date range
 */
export function useDateRangeData<T = any>(
  source: string,
  dataset: string,
  startDate: string,
  endDate: string,
  enabled: boolean = true
): UseQueryResult<T[], Error> {
  const { data: index, isLoading: indexLoading } = useDataIndex(source, dataset);
  
  return useQuery({
    queryKey: ['data', 'range', source, dataset, startDate, endDate],
    queryFn: async () => {
      if (!index) throw new Error('Index not loaded');
      
      // Find files that overlap with the date range
      const files = findOverlappingFiles(index, startDate, endDate);
      
      if (files.length === 0) {
        console.warn(`No files found for date range ${startDate} to ${endDate}`);
        return [];
      }
      
      console.log(`Loading ${files.length} files for date range ${startDate} to ${endDate}`);
      
      // Load all files in parallel
      const fileDataPromises = files.map(file =>
        fetchLocalJSON<TimeSeriesData<T>>(`/data/${source}/${dataset}/${file}`)
      );
      
      const fileDataArray = await Promise.all(fileDataPromises);
      
      // Combine all data
      const allData = fileDataArray.flatMap(fileData => fileData.data);
      
      // Filter to exact date range
      const filtered = allData.filter(record => {
        const recordDate = (record as any).date;
        if (!recordDate) return true; // Include records without date
        return isDateInRange(recordDate, startDate, endDate);
      });
      
      // Sort by date
      filtered.sort((a, b) => {
        const dateA = (a as any).date || '';
        const dateB = (b as any).date || '';
        return dateA.localeCompare(dateB);
      });
      
      console.log(`Loaded ${filtered.length} records for date range ${startDate} to ${endDate}`);
      
      return filtered;
    },
    enabled: enabled && !indexLoading && !!index,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Hook to load a specific quarter's data
 */
export function useQuarterData<T = any>(
  source: string,
  dataset: string,
  quarter: string, // e.g., "2024-Q3"
  enabled: boolean = true
): UseQueryResult<TimeSeriesData<T>, Error> {
  return useQuery({
    queryKey: ['data', 'quarter', source, dataset, quarter],
    queryFn: () => fetchLocalJSON<TimeSeriesData<T>>(`/data/${source}/${dataset}/${quarter}.json`),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (historical data is immutable)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
    enabled,
  });
}

/**
 * Hook to load complete dataset (all quarters)
 */
export function useCompleteData<T = any>(
  source: string,
  dataset: string,
  enabled: boolean = true
): UseQueryResult<T[], Error> {
  const { data: index, isLoading: indexLoading } = useDataIndex(source, dataset);
  
  return useQuery({
    queryKey: ['data', 'complete', source, dataset],
    queryFn: async () => {
      if (!index) throw new Error('Index not loaded');
      
      console.log(`Loading complete dataset: ${source}/${dataset}`);
      
      // Load all files in parallel
      const fileDataPromises = index.files.map(file =>
        fetchLocalJSON<TimeSeriesData<T>>(`/data/${source}/${dataset}/${file.file}`)
      );
      
      const fileDataArray = await Promise.all(fileDataPromises);
      
      // Combine all data
      const allData = fileDataArray.flatMap(fileData => fileData.data);
      
      // Sort by date
      allData.sort((a, b) => {
        const dateA = (a as any).date || '';
        const dateB = (b as any).date || '';
        return dateA.localeCompare(dateB);
      });
      
      console.log(`Loaded ${allData.length} total records`);
      
      return allData;
    },
    enabled: enabled && !indexLoading && !!index,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Hook to check data freshness
 */
export function useDataFreshness(source: string, dataset: string) {
  const [isFresh, setIsFresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkFreshness() {
      try {
        const metadata = await fetchLocalJSON<any>(`/data/${source}/${dataset}/metadata.json`);
        const lastUpdated = new Date(metadata.last_updated);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        setLastUpdate(metadata.last_updated);
        setIsFresh(hoursSinceUpdate < 6); // Fresh if updated within 6 hours
      } catch (error) {
        console.error('Failed to check data freshness:', error);
        setIsFresh(false);
      }
    }
    
    checkFreshness();
  }, [source, dataset]);
  
  return { isFresh, lastUpdate };
}

/**
 * Preset date ranges
 */
export const DATE_RANGES = {
  LAST_7_DAYS: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },
  LAST_30_DAYS: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },
  LAST_90_DAYS: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  },
  SINCE_OCT_7: () => ({
    start: '2023-10-07',
    end: new Date().toISOString().split('T')[0],
  }),
  CUSTOM: (start: string, end: string) => ({ start, end }),
};

/**
 * Hook for easy date range selection
 */
export function useDateRange(preset: keyof typeof DATE_RANGES = 'LAST_30_DAYS') {
  const [range, setRange] = useState(DATE_RANGES[preset]());
  
  const setPreset = (newPreset: keyof typeof DATE_RANGES) => {
    setRange(DATE_RANGES[newPreset]());
  };
  
  const setCustomRange = (start: string, end: string) => {
    setRange({ start, end });
  };
  
  return {
    range,
    setPreset,
    setCustomRange,
  };
}
