/**
 * Schools Hooks
 * 
 * React Query hooks for fetching Palestinian schools database
 */

import { useQuery } from '@tanstack/react-query';
import { 
  fetchSchools,
  getSchoolsByRegion,
  getSchoolsByDistrict,
  getSchoolsByType,
  type SchoolsSummary,
  type School
} from './services/schoolsService';

/**
 * Main hook to fetch all schools
 */
export const useSchools = () => {
  return useQuery<SchoolsSummary>({
    queryKey: ['schools'],
    queryFn: fetchSchools,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (data updates infrequently)
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
    retry: 2,
    enabled: true, // ✅ Explicitly enable the query
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Enable initial fetch
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get schools by region
 */
export const useSchoolsByRegion = (region: string) => {
  const { data, isLoading, error } = useSchools();
  
  const schools = data?.schools 
    ? getSchoolsByRegion(data.schools, region)
    : [];
    
  return {
    schools,
    count: schools.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get schools by district
 */
export const useSchoolsByDistrict = (district: string) => {
  const { data, isLoading, error } = useSchools();
  
  const schools = data?.schools 
    ? getSchoolsByDistrict(data.schools, district)
    : [];
    
  return {
    schools,
    count: schools.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get schools by type
 */
export const useSchoolsByType = (type: string) => {
  const { data, isLoading, error } = useSchools();
  
  const schools = data?.schools 
    ? getSchoolsByType(data.schools, type)
    : [];
    
  return {
    schools,
    count: schools.length,
    isLoading,
    error,
  };
};

/**
 * Hook to get school statistics
 */
export const useSchoolStatistics = () => {
  const { data, isLoading, error } = useSchools();
  
  if (!data) {
    return {
      total: 0,
      westBank: 0,
      gaza: 0,
      primary: 0,
      secondary: 0,
      government: 0,
      unrwa: 0,
      private: 0,
      totalStudents: 0,
      byDistrict: {},
      isLoading,
      error,
    };
  }
  
  // Calculate region counts
  const westBank = 
    (data.byRegion['West Bank'] || 0) + 
    (data.byRegion['west bank'] || 0) +
    (data.byRegion['WB'] || 0);
  const gaza = 
    (data.byRegion['Gaza'] || 0) + 
    (data.byRegion['gaza'] || 0) +
    (data.byRegion['Gaza Strip'] || 0);
  
  // Calculate type counts
  const primary = 
    (data.byType['primary'] || 0) + 
    (data.byType['elementary'] || 0);
  const secondary = 
    (data.byType['secondary'] || 0) + 
    (data.byType['high school'] || 0);
  
  // Calculate sector counts
  const government = 
    (data.bySector['government'] || 0) + 
    (data.bySector['public'] || 0);
  const unrwa = 
    (data.bySector['unrwa'] || 0) + 
    (data.bySector['UNRWA'] || 0);
  const priv = 
    (data.bySector['private'] || 0);
  
  return {
    total: data.total,
    westBank,
    gaza,
    primary,
    secondary,
    government,
    unrwa,
    private: priv,
    totalStudents: data.totalStudents,
    byDistrict: data.byDistrict,
    isLoading,
    error,
  };
};