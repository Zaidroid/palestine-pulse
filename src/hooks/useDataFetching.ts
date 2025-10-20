/**
 * Data Fetching Hooks
 * 
 * React Query hooks for fetching data
 * Uses direct API calls for Tech for Palestine (proven to work)
 * API Orchestrator available for additional sources
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { 
  KilledPerson,
  PressKilled,
  SummaryData,
  CasualtyData,
  WestBankData,
  InfrastructureData,
} from "./types/data.types";

// API URLs - Direct fetch for reliability
const API_BASE = "https://data.techforpalestine.org/api";

// Fetching function
const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
};

// ============================================
// QUERY OPTIONS
// ============================================

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

// ============================================
// HOOKS - Direct API calls (V1 proven method)
// ============================================

/**
 * Fetch list of killed people in Gaza
 */
export const useKilledInGaza = (): UseQueryResult<KilledPerson[], Error> => {
  return useQuery({
    queryKey: ["killedInGaza"],
    queryFn: () => fetchJson(`${API_BASE}/v3/killed-in-gaza.min.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Fetch list of press/journalists killed
 */
export const usePressKilled = (): UseQueryResult<PressKilled[], Error> => {
  return useQuery({
    queryKey: ["pressKilled"],
    queryFn: () => fetchJson(`${API_BASE}/v2/press_killed_in_gaza.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Fetch summary statistics for Gaza and West Bank
 */
export const useSummary = (): UseQueryResult<SummaryData, Error> => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () => fetchJson(`${API_BASE}/v3/summary.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Fetch daily casualties data for Gaza
 */
export const useCasualtiesDaily = (): UseQueryResult<CasualtyData[], Error> => {
  return useQuery({
    queryKey: ["casualties"],
    queryFn: () => fetchJson(`${API_BASE}/v2/casualties_daily.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Fetch daily casualties data for West Bank
 */
export const useWestBankDaily = (): UseQueryResult<WestBankData[], Error> => {
  return useQuery({
    queryKey: ["westBank"],
    queryFn: () => fetchJson(`${API_BASE}/v2/west_bank_daily.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Fetch infrastructure damage data
 */
export const useInfrastructure = (): UseQueryResult<InfrastructureData[], Error> => {
  return useQuery({
    queryKey: ["infrastructure"],
    queryFn: () => fetchJson(`${API_BASE}/v3/infrastructure-damaged.json`),
    ...DEFAULT_QUERY_OPTIONS,
  });
};

// ============================================
// COMBINED DATA HOOKS
// ============================================

/**
 * Fetch all core data in parallel
 */
export const useAllCoreData = () => {
  const killedData = useKilledInGaza();
  const pressData = usePressKilled();
  const summaryData = useSummary();
  const casualtiesData = useCasualtiesDaily();
  const westBankData = useWestBankDaily();
  const infrastructureData = useInfrastructure();

  return {
    killedData,
    pressData,
    summaryData,
    casualtiesData,
    westBankData,
    infrastructureData,
    isLoading:
      killedData.isLoading ||
      pressData.isLoading ||
      summaryData.isLoading ||
      casualtiesData.isLoading ||
      westBankData.isLoading ||
      infrastructureData.isLoading,
    isError:
      killedData.isError ||
      pressData.isError ||
      summaryData.isError ||
      casualtiesData.isError ||
      westBankData.isError ||
      infrastructureData.isError,
    errors: {
      killed: killedData.error,
      press: pressData.error,
      summary: summaryData.error,
      casualties: casualtiesData.error,
      westBank: westBankData.error,
      infrastructure: infrastructureData.error,
    },
  };
};

/**
 * Hook to check if any data is stale and needs refresh
 */
export const useDataFreshness = () => {
  const { data: summaryData } = useSummary();
  
  return {
    lastUpdate: summaryData?.gaza?.last_update || null,
    isStale: false,
  };
};

/**
 * Hook to manually refetch all data
 */
export const useRefetchAll = () => {
  const killedData = useKilledInGaza();
  const pressData = usePressKilled();
  const summaryData = useSummary();
  const casualtiesData = useCasualtiesDaily();
  const westBankData = useWestBankDaily();
  const infrastructureData = useInfrastructure();

  return async () => {
    await Promise.all([
      killedData.refetch(),
      pressData.refetch(),
      summaryData.refetch(),
      casualtiesData.refetch(),
      westBankData.refetch(),
      infrastructureData.refetch(),
    ]);
  };
};
