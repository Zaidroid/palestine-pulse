import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataConsolidationService } from '@/services/dataConsolidationService';
import { V3ConsolidatedData } from '@/types/data.types';
import { DATA_SOURCES } from '@/services/apiOrchestrator';

export interface DateRange {
  start: Date;
  end: Date;
  preset?: '7d' | '30d' | '60d' | '90d' | '1y' | 'all' | 'custom';
}

export interface FilterState {
  regions: string[];
  categories: string[];
  severity: number;
  dataSources: string[];
  dataQuality: ('high' | 'medium' | 'low')[];
}

export type DataSourceStatus = 'active' | 'syncing' | 'error' | 'disabled';

export interface DataSourceState {
  name: string;
  status: DataSourceStatus;
  lastSync?: Date;
}

interface V3StoreState {
  // Date Range
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setDatePreset: (preset: DateRange['preset']) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Filter Presets
  filterPresets: Record<string, FilterState>;
  saveFilterPreset: (name: string, filters: FilterState) => void;
  loadFilterPreset: (name: string) => void;
  deleteFilterPreset: (name: string) => void;

  // UI State
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;

  // Data Management
  consolidatedData: V3ConsolidatedData | null;
  isLoadingData: boolean;
  dataError: string | null;
  lastDataFetch: Date | null;
  isOnline: boolean;
  dataSourceStatus: Record<string, DataSourceState>;

  // Data Actions
  fetchConsolidatedData: (forceRefresh?: boolean) => Promise<void>;
  subscribeToDataUpdates: () => () => void;
  clearDataCache: () => Promise<void>;
  setOnlineStatus: (online: boolean) => void;
  setDataSourceStatus: (source: string, status: DataSourceStatus, lastSync?: Date) => void;

  // Last Update
  lastUpdated: Date;
  updateTimestamp: () => void;

  // First Visit
  isFirstVisit: boolean;
  setFirstVisit: (isFirst: boolean) => void;
}

const getPresetDates = (preset: DateRange['preset']): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (preset) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '60d':
      start.setDate(end.getDate() - 60);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'all':
      start.setFullYear(2023, 9, 7); // October 7, 2023
      break;
    default:
      start.setDate(end.getDate() - 60);
  }
  
  return { start, end };
};

const defaultFilters: FilterState = {
  regions: [],
  categories: [],
  severity: 0,
  dataSources: [],
  dataQuality: ['high', 'medium', 'low']
};

const initialDataSourceStatus = Object.entries(DATA_SOURCES).reduce((acc, [key, config]) => {
  acc[key] = {
    name: config.name,
    status: config.enabled ? 'active' : 'disabled',
    lastSync: undefined,
  };
  return acc;
}, {} as Record<string, DataSourceState>);


export const useV3Store = create<V3StoreState>()(
  persist(
    (set, get) => ({
      // Date Range
      dateRange: {
        ...getPresetDates('60d'),
        preset: '60d'
      },

      setDateRange: (range) => set({ dateRange: range }),

      setDatePreset: (preset) => {
        const dates = getPresetDates(preset);
        set({
          dateRange: {
            ...dates,
            preset
          }
        });
      },

      // Filters
      filters: defaultFilters,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),

      resetFilters: () => set({ filters: defaultFilters }),

      // Filter Presets
      filterPresets: {},

      saveFilterPreset: (name, filters) =>
        set((state) => ({
          filterPresets: {
            ...state.filterPresets,
            [name]: filters
          }
        })),

      loadFilterPreset: (name) => {
        const preset = get().filterPresets[name];
        if (preset) {
          set({ filters: preset });
        }
      },

      deleteFilterPreset: (name) =>
        set((state) => {
          const { [name]: _, ...rest } = state.filterPresets;
          return { filterPresets: rest };
        }),

      // UI State
      filtersOpen: false,
      setFiltersOpen: (open) => set({ filtersOpen: open }),

      // Data Management
      consolidatedData: null,
      isLoadingData: false,
      dataError: null,
      lastDataFetch: null,
      isOnline: navigator.onLine,
      dataSourceStatus: initialDataSourceStatus,

      // Data Actions
      setDataSourceStatus: (source, status, lastSync) =>
        set(state => ({
          dataSourceStatus: {
            ...state.dataSourceStatus,
            [source]: {
              ...state.dataSourceStatus[source],
              status,
              lastSync: lastSync || state.dataSourceStatus[source]?.lastSync,
            },
          },
        })),

      fetchConsolidatedData: async (forceRefresh = false) => {
        set({ isLoadingData: true, dataError: null });

        try {
          const data = await dataConsolidationService.getConsolidatedData(forceRefresh);
          set({
            consolidatedData: data,
            lastDataFetch: new Date(),
            isLoadingData: false
          });
        } catch (error) {
          set({
            dataError: error instanceof Error ? error.message : 'Failed to fetch data',
            isLoadingData: false
          });
        }
      },

      subscribeToDataUpdates: () => {
        return dataConsolidationService.onDataUpdate((data) => {
          set({
            consolidatedData: data,
            lastDataFetch: new Date()
          });
        });
      },

      clearDataCache: async () => {
        try {
          await dataConsolidationService.clearCache();
          set({ consolidatedData: null, lastDataFetch: null });
        } catch (error) {
          set({
            dataError: error instanceof Error ? error.message : 'Failed to clear cache'
          });
        }
      },

      setOnlineStatus: (online) => set({ isOnline: online }),

      // Last Update
      lastUpdated: new Date(),
      updateTimestamp: () => set({ lastUpdated: new Date() }),

      // First Visit
      isFirstVisit: true,
      setFirstVisit: (isFirst) => set({ isFirstVisit: isFirst }),
    }),
    {
      name: 'v3-store',
      partialize: (state) => ({
        dateRange: state.dateRange,
        filters: state.filters,
        filterPresets: state.filterPresets,
        isFirstVisit: state.isFirstVisit,
        // Don't persist runtime data
        // consolidatedData: state.consolidatedData,
        // isLoadingData: state.isLoadingData,
        // dataError: state.dataError,
        // lastDataFetch: state.lastDataFetch,
        // isOnline: state.isOnline,
      })
    }
  )
);