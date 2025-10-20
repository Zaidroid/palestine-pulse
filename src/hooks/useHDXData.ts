/**
 * HDX Data Hooks
 * 
 * React Query hooks for fetching data from HDX (Humanitarian Data Exchange)
 */

import { useQuery } from '@tanstack/react-query';
import { 
  searchHDXDatasets,
  getHDXDataset,
  searchHumanitarianData,
  getHumanitarianDataSummary,
  type HDXDataset,
  type HDXSearchResult
} from './services/hdxService';

/**
 * Hook to search HDX datasets
 */
export const useHDXSearch = (query: string, rows: number = 10) => {
  return useQuery<HDXSearchResult>({
    queryKey: ['hdx', 'search', query, rows],
    queryFn: () => searchHDXDatasets(query, rows),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get specific HDX dataset
 */
export const useHDXDataset = (datasetId: string) => {
  return useQuery<HDXDataset>({
    queryKey: ['hdx', 'dataset', datasetId],
    queryFn: () => getHDXDataset(datasetId),
    enabled: datasetId.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to search humanitarian/aid-related datasets
 */
export const useHumanitarianData = () => {
  return useQuery<HDXSearchResult>({
    queryKey: ['hdx', 'humanitarian'],
    queryFn: searchHumanitarianData,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get humanitarian data summary
 */
export const useHumanitarianDataSummary = () => {
  return useQuery({
    queryKey: ['hdx', 'humanitarian', 'summary'],
    queryFn: getHumanitarianDataSummary,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get aid-specific datasets
 */
export const useAidDatasets = () => {
  const { data, isLoading, error } = useHumanitarianData();
  
  // Filter for aid-related datasets
  const aidDatasets = data?.results.filter(dataset => 
    dataset.tags.some(tag => 
      tag.toLowerCase().includes('aid') ||
      tag.toLowerCase().includes('humanitarian') ||
      tag.toLowerCase().includes('assistance')
    ) ||
    dataset.title.toLowerCase().includes('aid') ||
    dataset.title.toLowerCase().includes('humanitarian')
  ) || [];
  
  return {
    datasets: aidDatasets,
    count: aidDatasets.length,
    isLoading,
    error,
  };
};

/**
 * Hook to aggregate aid statistics from multiple sources
 */
export const useAidStatistics = () => {
  const { data, isLoading, error } = useHumanitarianDataSummary();
  
  if (!data) {
    return {
      availableDatasets: 0,
      organizations: [],
      formats: [],
      totalResources: 0,
      isLoading,
      error,
    };
  }
  
  return {
    availableDatasets: data.totalDatasets,
    organizations: Object.keys(data.byOrganization),
    formats: Object.keys(data.byFormat),
    totalResources: data.totalResources,
    isLoading,
    error,
  };
};