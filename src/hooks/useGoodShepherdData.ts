/**
 * Good Shepherd Collective Data Hooks
 * 
 * Custom React Query hooks for fetching data from Good Shepherd Collective APIs
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchChildPrisoners,
  fetchWestBankData,
  fetchHealthcareAttacks,
  fetchHomeDemolitions,
  fetchNGOData,
  fetchPrisonerData,
} from '@/services/apiOrchestrator';
import {
  aggregateHealthcareAttacks,
  aggregateHomeDemolitions,
} from '@/utils/dataAggregation';
import {
  ChildPrisonerData,
  WestBankData,
  HealthcareAttackRaw,
  HealthcareAttackSummary,
  HomeDemolitionRaw,
  HomeDemolitionSummary,
  NGOData,
  PrisonerData,
} from '@/types/goodshepherd.types';

// ============================================================================
// CHILD PRISONERS HOOK
// ============================================================================

export const useChildPrisoners = () => {
  return useQuery<ChildPrisonerData>({
    queryKey: ['goodshepherd', 'childPrisoners'],
    queryFn: async () => {
      // Try local data first
      try {
        const response = await fetch('/data/goodshepherd/prisoners/statistics/child-age-groups.json');
        if (response.ok) {
          const localData = await response.json();
          const childData = localData.data?.childPrisonersData;
          
          if (childData) {
            // Get latest year's data for total count
            let total = 0;
            if (childData.Detention) {
              const detentionData = childData.Detention;
              const latestYear = detentionData[detentionData.length - 1];
              const months = latestYear.months;
              for (const month in months) {
                const value = parseInt(months[month]);
                if (!isNaN(value) && value > 0) {
                  total = Math.max(total, value);
                }
              }
            }
            
            console.log('✅ Loaded child prisoner statistics from local data:', total);
            return {
              total,
              lastUpdated: localData.metadata.last_updated,
              rawData: childData,
            } as any;
          }
        }
      } catch (error) {
        console.log('⚠️ Local child prisoner statistics not available, using API fallback');
      }
      
      // Fallback to API
      console.log('📡 Fetching child prisoner statistics from API');
      const response = await fetchChildPrisoners();
      if (!response.success) {
        throw new Error('Failed to fetch child prisoners data');
      }
      
      const data = response.data as any;
      if (data?.childPrisonersData) {
        const childData = data.childPrisonersData;
        
        let total = 0;
        if (childData.Detention) {
          const detentionData = childData.Detention;
          const latestYear = detentionData[detentionData.length - 1];
          const months = latestYear.months;
          for (const month in months) {
            const value = parseInt(months[month]);
            if (!isNaN(value) && value > 0) {
              total = Math.max(total, value);
            }
          }
        }
        
        console.log('✅ Loaded child prisoner statistics from API:', total);
        return {
          total,
          lastUpdated: new Date().toISOString(),
          rawData: childData,
        } as any;
      }
      
      return response.data as ChildPrisonerData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// WEST BANK DATA HOOK
// ============================================================================

export const useWestBankData = () => {
  return useQuery<WestBankData>({
    queryKey: ['goodshepherd', 'wbData'],
    queryFn: async () => {
      const response = await fetchWestBankData();
      if (!response.success) {
        throw new Error('Failed to fetch West Bank data');
      }
      return response.data as WestBankData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// HEALTHCARE ATTACKS HOOK (With Aggregation)
// ============================================================================

export const useHealthcareAttacksSummary = () => {
  return useQuery<HealthcareAttackSummary>({
    queryKey: ['goodshepherd', 'healthcareAttacksSummary'],
    queryFn: async () => {
      const response = await fetchHealthcareAttacks();
      if (!response.success) {
        throw new Error('Failed to fetch healthcare attacks data');
      }
      
      // Aggregate the large dataset
      const rawData = response.data as HealthcareAttackRaw[];
      return aggregateHealthcareAttacks(rawData);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    enabled: false, // Disable for now - very large dataset
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// HOME DEMOLITIONS HOOK (With Aggregation)
// ============================================================================

export const useHomeDemolitionsSummary = () => {
  return useQuery<HomeDemolitionSummary>({
    queryKey: ['goodshepherd', 'homeDemolitionsSummary'],
    queryFn: async () => {
      const response = await fetchHomeDemolitions();
      if (!response.success) {
        throw new Error('Failed to fetch home demolitions data');
      }
      
      // Aggregate the large dataset
      const rawData = response.data as HomeDemolitionRaw[];
      return aggregateHomeDemolitions(rawData);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    enabled: false, // Disable for now - endpoint may not exist or is too large
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// NGO DATA HOOK
// ============================================================================

export const useNGOData = () => {
  return useQuery<NGOData>({
    queryKey: ['goodshepherd', 'ngoData'],
    queryFn: async () => {
      const response = await fetchNGOData();
      if (!response.success) {
        throw new Error('Failed to fetch NGO data');
      }
      return response.data as NGOData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    enabled: true, // ✅ VERIFIED: Endpoint working (346KB, HTTP 200)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// PRISONER DATA HOOK
// ============================================================================

export const usePrisonerData = () => {
  return useQuery<PrisonerData>({
    queryKey: ['goodshepherd', 'prisonerData'],
    queryFn: async () => {
      // Try local data first
      try {
        const response = await fetch('/data/goodshepherd/prisoners/statistics/monthly-totals.json');
        if (response.ok) {
          const localData = await response.json();
          const data = localData.data;
          if (Array.isArray(data) && data.length > 0) {
            const latest = data[0];
            console.log('✅ Loaded prisoner statistics from local data:', latest);
            return {
              totalPrisoners: latest['Total Number of Political Prisoners'] || 0,
              administrative: latest['Administrative Detainees'] || 0,
              women: latest['Female prisoners'] || 0,
              lastUpdated: latest.date,
              rawData: data,
            } as any;
          }
        }
      } catch (error) {
        console.log('⚠️ Local prisoner statistics not available, using API fallback');
      }
      
      // Fallback to API
      console.log('📡 Fetching prisoner statistics from API');
      const response = await fetchPrisonerData();
      if (!response.success) {
        throw new Error('Failed to fetch prisoner data');
      }
      
      const data = response.data as any[];
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        console.log('✅ Loaded prisoner statistics from API:', latest);
        return {
          totalPrisoners: latest['Total Number of Political Prisoners'] || 0,
          administrative: latest['Administrative Detainees'] || 0,
          women: latest['Female prisoners'] || 0,
          lastUpdated: latest.date,
          rawData: data,
        } as any;
      }
      
      return response.data as PrisonerData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// ============================================================================
// COMBINED DATA HOOK (Fetch Multiple Sources)
// ============================================================================

export const useGoodShepherdData = () => {
  const childPrisoners = useChildPrisoners();
  const westBankData = useWestBankData();
  const healthcareAttacks = useHealthcareAttacksSummary();
  const homeDemolitions = useHomeDemolitionsSummary();
  const ngoData = useNGOData();
  const prisonerData = usePrisonerData();

  return {
    childPrisoners,
    westBankData,
    healthcareAttacks,
    homeDemolitions,
    ngoData,
    prisonerData,
    isLoading:
      childPrisoners.isLoading ||
      westBankData.isLoading ||
      healthcareAttacks.isLoading ||
      homeDemolitions.isLoading ||
      ngoData.isLoading ||
      prisonerData.isLoading,
    isError:
      childPrisoners.isError ||
      westBankData.isError ||
      healthcareAttacks.isError ||
      homeDemolitions.isError ||
      ngoData.isError ||
      prisonerData.isError,
  };
};