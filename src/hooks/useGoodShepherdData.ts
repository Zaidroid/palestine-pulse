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
} from './services/apiOrchestrator';
import {
  aggregateHealthcareAttacks,
  aggregateHomeDemolitions,
} from './utils/dataAggregation';
import {
  ChildPrisonerData,
  WestBankData,
  HealthcareAttackRaw,
  HealthcareAttackSummary,
  HomeDemolitionRaw,
  HomeDemolitionSummary,
  NGOData,
  PrisonerData,
} from './types/goodshepherd.types';

// ============================================================================
// CHILD PRISONERS HOOK
// ============================================================================

export const useChildPrisoners = () => {
  return useQuery<ChildPrisonerData>({
    queryKey: ['goodshepherd', 'childPrisoners'],
    queryFn: async () => {
      const response = await fetchChildPrisoners();
      if (!response.success) {
        throw new Error('Failed to fetch child prisoners data');
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
      const response = await fetchPrisonerData();
      if (!response.success) {
        throw new Error('Failed to fetch prisoner data');
      }
      return response.data as PrisonerData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    enabled: true, // ✅ VERIFIED: Endpoint working (6.2KB, HTTP 200)
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