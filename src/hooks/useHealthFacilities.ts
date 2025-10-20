/**
 * Health Facilities Hooks
 * 
 * React Query hooks for fetching Gaza health facilities data
 */

import { useQuery } from '@tanstack/react-query';
import { 
  fetchHealthFacilities,
  getFacilitiesByStatus,
  getFacilitiesByType,
  getFacilitiesByGovernorate,
  type HealthFacilitiesSummary,
  type HealthFacility
} from '../services/healthFacilitiesService';

/**
 * Main hook to fetch all health facilities
 */
export const useHealthFacilities = () => {
  return useQuery<HealthFacilitiesSummary>({
    queryKey: ['healthFacilities'],
    queryFn: fetchHealthFacilities,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours (data updates infrequently)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    enabled: true, // ✅ Explicitly enable the query
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Enable initial fetch
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get facilities by operational status
 */
export const useHealthFacilitiesByStatus = (status: string) => {
  const { data, isLoading, error } = useHealthFacilities();
  
  const facilities = data?.facilities 
    ? getFacilitiesByStatus(data.facilities, status)
    : [];
    
  return {
    facilities,
    count: facilities.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get facilities by type
 */
export const useHealthFacilitiesByType = (type: string) => {
  const { data, isLoading, error } = useHealthFacilities();
  
  const facilities = data?.facilities 
    ? getFacilitiesByType(data.facilities, type)
    : [];
    
  return {
    facilities,
    count: facilities.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get facilities by governorate
 */
export const useHealthFacilitiesByGovernorate = (governorate: string) => {
  const { data, isLoading, error } = useHealthFacilities();
  
  const facilities = data?.facilities 
    ? getFacilitiesByGovernorate(data.facilities, governorate)
    : [];
    
  return {
    facilities,
    count: facilities.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get health facility statistics
 */
export const useHealthFacilityStats = () => {
  const { data, isLoading, error } = useHealthFacilities();
  
  if (!data) {
    return {
      total: 0,
      operational: 0,
      partiallyOperational: 0,
      nonOperational: 0,
      hospitals: 0,
      clinics: 0,
      healthCenters: 0,
      byGovernorate: {},
      isLoading,
      error,
    };
  }
  
  // Calculate operational status counts
  const operational = data.byStatus['operational'] || 0;
  const partiallyOperational = 
    (data.byStatus['partially operational'] || 0) + 
    (data.byStatus['partial'] || 0);
  const nonOperational = 
    (data.byStatus['non-operational'] || 0) + 
    (data.byStatus['closed'] || 0) +
    (data.byStatus['damaged'] || 0) +
    (data.byStatus['destroyed'] || 0);
  
  // Calculate type counts
  const hospitals = 
    (data.byType['hospital'] || 0) + 
    (data.byType['hospitals'] || 0);
  const clinics = 
    (data.byType['clinic'] || 0) + 
    (data.byType['clinics'] || 0);
  const healthCenters = 
    (data.byType['health center'] || 0) + 
    (data.byType['health centre'] || 0) +
    (data.byType['phc'] || 0) + // Primary Health Care
    (data.byType['primary health care'] || 0);
  
  return {
    total: data.total,
    operational,
    partiallyOperational,
    nonOperational,
    hospitals,
    clinics,
    healthCenters,
    byGovernorate: data.byGovernorate,
    isLoading,
    error,
  };
};