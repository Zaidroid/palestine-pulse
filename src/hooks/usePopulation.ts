/**
 * Population Hooks
 * 
 * React Query hooks for fetching Palestinian population statistics
 */

import { useQuery } from '@tanstack/react-query';
import { 
  fetchPopulation,
  getPopulationByRegion,
  type PopulationSummary,
  type PopulationData
} from '../services/populationService';

/**
 * Main hook to fetch population data
 */
export const usePopulation = () => {
  return useQuery<PopulationSummary>({
    queryKey: ['population'],
    queryFn: fetchPopulation,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days (population data updates rarely)
    gcTime: 1000 * 60 * 60 * 24 * 14, // 14 days
    retry: 2,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to get population by region
 */
export const usePopulationByRegion = (region: string) => {
  const { data, isLoading, error } = usePopulation();
  
  const population = data?.populationData 
    ? getPopulationByRegion(data.populationData, region)
    : [];
    
  const total = population.reduce((sum, p) => sum + p.total, 0);
    
  return {
    population,
    total,
    isLoading,
    error,
  };
};

/**
 * Hook to get population statistics
 */
export const usePopulationStatistics = () => {
  const { data, isLoading, error } = usePopulation();
  
  if (!data) {
    return {
      total: 0,
      gaza: 0,
      westBank: 0,
      male: 0,
      female: 0,
      children: 0,
      adults: 0,
      elderly: 0,
      refugees: 0,
      byGovernorate: {},
      ageSexDistribution: [],
      isLoading,
      error,
    };
  }
  
  // Calculate region totals
  const gaza = data.byRegion['Gaza Strip'] || 0;
  const westBank = data.byRegion['West Bank'] || 0;
  
  return {
    total: data.total,
    gaza,
    westBank,
    male: data.male,
    female: data.female,
    children: data.children,
    adults: data.adults,
    elderly: data.elderly,
    refugees: data.refugeePopulation,
    byGovernorate: data.byGovernorate,
    ageSexDistribution: data.ageSexDistribution,
    isLoading,
    error,
  };
};

/**
 * Hook to calculate displacement estimates
 */
export const useDisplacementEstimates = () => {
  const popStats = usePopulationStatistics();
  
  if (popStats.isLoading || !popStats.total) {
    return {
      baselinePopulation: 0,
      estimatedDisplaced: 0,
      displacementRate: 0,
      gazaDisplaced: 0,
      isLoading: true,
      error: popStats.error,
    };
  }
  
  // Estimates based on reports (to be replaced with UNRWA data when available)
  const gazaDisplaced = Math.round(popStats.gaza * 0.85); // ~85% of Gaza displaced
  const westBankDisplaced = Math.round(popStats.westBank * 0.02); // ~2% of WB displaced
  const totalDisplaced = gazaDisplaced + westBankDisplaced;
  const displacementRate = (totalDisplaced / popStats.total) * 100;
  
  return {
    baselinePopulation: popStats.total,
    estimatedDisplaced: totalDisplaced,
    displacementRate,
    gazaDisplaced,
    westBankDisplaced,
    isLoading: popStats.isLoading,
    error: popStats.error,
  };
};