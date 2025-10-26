/**
 * Hook to fetch home demolitions data from Good Shepherd Collective
 */

import { useQuery } from "@tanstack/react-query";

export interface DemolitionRecord {
  date: string;
  incidents: number;
  displacedPeople: number;
  structures: number;
  menDisplaced: number;
  womenDisplaced: number;
  childrenDisplaced: number;
}

export interface DemolitionsResponse {
  totalIncidents: number;
  fiveDayIncidents: number;
  thirtyDayIncidents: number;
  displacedPeople: number;
  structures: number;
  menDisplaced: number;
  womenDisplaced: number;
  childrenDisplaced: number;
  oldestDateofincident: string;
  newestDateofincident: string;
  mostRecentTimestamp: string;
  fiveDayAverage: {
    incidents: number;
    structures: number;
    displacedPeople: number;
    menDisplaced: number;
    womenDisplaced: number;
    childrenDisplaced: number;
  };
  thirtyDayAverage: {
    incidents: number;
    structures: number;
    displacedPeople: number;
    menDisplaced: number;
    womenDisplaced: number;
    childrenDisplaced: number;
  };
  chartData: DemolitionRecord[];
}

const fetchDemolitions = async (): Promise<DemolitionsResponse> => {
  const response = await fetch('https://goodshepherdcollective.org/api/home_demolitions.json');
  if (!response.ok) {
    throw new Error('Failed to fetch demolitions data');
  }
  return response.json();
};

export const useGoodShepherdDemolitions = () => {
  return useQuery({
    queryKey: ['goodshepherd-demolitions'],
    queryFn: fetchDemolitions,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
};
