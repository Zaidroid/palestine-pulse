/**
 * Global State Store using Zustand
 * 
 * Manages application-wide state including:
 * - User preferences
 * - Notifications
 * - Dashboard layouts
 * - Filters
 * - UI state
 * 
 * Fully serverless - all state persists in localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserPreferences, 
  Notification, 
  DashboardLayout,
  FilterConfig 
} from './types/data.types';

// ============================================
// STATE INTERFACE
// ============================================

interface GlobalState {
  // User Preferences
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Dashboard Layouts
  dashboardLayouts: DashboardLayout[];
  activeDashboardId: string | null;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  deleteDashboardLayout: (id: string) => void;
  setActiveDashboard: (id: string | null) => void;

  // Filters
  filters: FilterConfig;
  setFilters: (filters: Partial<FilterConfig>) => void;
  resetFilters: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading States
  isLoading: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;

  // Error States
  errors: Record<string, string>;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;

  // Data Refresh
  lastDataRefresh: string | null;
  setLastDataRefresh: (timestamp: string) => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'system',
  defaultDateRange: 60,
  notifications: {
    enabled: true,
    threshold: 100,
    types: ['casualty_spike', 'data_update', 'system'],
  },
};

const DEFAULT_FILTERS: FilterConfig = {
  dateRange: {
    start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    end: new Date().toISOString(),
  },
  regions: [],
  demographics: [],
  eventTypes: [],
};

// ============================================
// STORE CREATION
// ============================================

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // =====================================
      // USER PREFERENCES
      // =====================================
      preferences: DEFAULT_PREFERENCES,

      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      resetPreferences: () =>
        set({ preferences: DEFAULT_PREFERENCES }),

      // =====================================
      // NOTIFICATIONS
      // =====================================
      notifications: [],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}-${Math.random()}`,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // Keep only last 50 notifications
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAllNotifications: () =>
        set({ notifications: [] }),

      // =====================================
      // DASHBOARD LAYOUTS
      // =====================================
      dashboardLayouts: [],
      activeDashboardId: null,

      saveDashboardLayout: (layout) =>
        set((state) => {
          const existingIndex = state.dashboardLayouts.findIndex(
            (l) => l.id === layout.id
          );

          if (existingIndex >= 0) {
            // Update existing layout
            const newLayouts = [...state.dashboardLayouts];
            newLayouts[existingIndex] = {
              ...layout,
              updatedAt: new Date().toISOString(),
            };
            return { dashboardLayouts: newLayouts };
          } else {
            // Add new layout
            return {
              dashboardLayouts: [
                ...state.dashboardLayouts,
                {
                  ...layout,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }
        }),

      deleteDashboardLayout: (id) =>
        set((state) => ({
          dashboardLayouts: state.dashboardLayouts.filter((l) => l.id !== id),
          activeDashboardId:
            state.activeDashboardId === id ? null : state.activeDashboardId,
        })),

      setActiveDashboard: (id) =>
        set({ activeDashboardId: id }),

      // =====================================
      // FILTERS
      // =====================================
      filters: DEFAULT_FILTERS,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () =>
        set({ filters: DEFAULT_FILTERS }),

      // =====================================
      // UI STATE
      // =====================================
      sidebarOpen: true,

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // =====================================
      // LOADING STATES
      // =====================================
      isLoading: {},

      setLoading: (key, loading) =>
        set((state) => ({
          isLoading: { ...state.isLoading, [key]: loading },
        })),

      // =====================================
      // ERROR STATES
      // =====================================
      errors: {},

      setError: (key, error) =>
        set((state) => ({
          errors: { ...state.errors, [key]: error },
        })),

      clearError: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.errors;
          return { errors: rest };
        }),

      clearAllErrors: () =>
        set({ errors: {} }),

      // =====================================
      // DATA REFRESH
      // =====================================
      lastDataRefresh: null,

      setLastDataRefresh: (timestamp) =>
        set({ lastDataRefresh: timestamp }),
    }),
    {
      name: 'palestine-dashboard-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        preferences: state.preferences,
        dashboardLayouts: state.dashboardLayouts,
        activeDashboardId: state.activeDashboardId,
        filters: state.filters,
        notifications: state.notifications.slice(0, 10), // Only persist last 10 notifications
      }),
    }
  )
);

// ============================================
// SELECTOR HOOKS
// ============================================

// Convenience hooks for common selectors
export const usePreferences = () => useGlobalStore((state) => state.preferences);
export const useNotifications = () => useGlobalStore((state) => state.notifications);
export const useUnreadNotificationsCount = () =>
  useGlobalStore((state) => state.notifications.filter((n) => !n.read).length);
export const useFilters = () => useGlobalStore((state) => state.filters);
export const useSidebarOpen = () => useGlobalStore((state) => state.sidebarOpen);
export const useActiveDashboard = () => {
  const { dashboardLayouts, activeDashboardId } = useGlobalStore((state) => ({
    dashboardLayouts: state.dashboardLayouts,
    activeDashboardId: state.activeDashboardId,
  }));
  return dashboardLayouts.find((l) => l.id === activeDashboardId) || null;
};
export const useIsLoading = (key: string) =>
  useGlobalStore((state) => state.isLoading[key] || false);
export const useError = (key: string) =>
  useGlobalStore((state) => state.errors[key] || null);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a notification helper
 */
export const notify = {
  success: (title: string, message: string) =>
    useGlobalStore.getState().addNotification({
      type: 'success',
      title,
      message,
    }),

  error: (title: string, message: string) =>
    useGlobalStore.getState().addNotification({
      type: 'error',
      title,
      message,
    }),

  warning: (title: string, message: string) =>
    useGlobalStore.getState().addNotification({
      type: 'warning',
      title,
      message,
    }),

  info: (title: string, message: string) =>
    useGlobalStore.getState().addNotification({
      type: 'info',
      title,
      message,
    }),
};

/**
 * Get date range in days
 */
export const getDateRangeInDays = (): number => {
  const { filters } = useGlobalStore.getState();
  const start = new Date(filters.dateRange.start);
  const end = new Date(filters.dateRange.end);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Update date range by days
 */
export const setDateRangeByDays = (days: number) => {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  useGlobalStore.getState().setFilters({
    dateRange: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });
};

/**
 * Export store state for debugging
 */
export const exportStoreState = () => {
  const state = useGlobalStore.getState();
  return JSON.stringify(state, null, 2);
};

/**
 * Reset entire store
 */
export const resetStore = () => {
  const { resetPreferences, resetFilters, clearAllNotifications } = useGlobalStore.getState();
  resetPreferences();
  resetFilters();
  clearAllNotifications();
  useGlobalStore.setState({
    dashboardLayouts: [],
    activeDashboardId: null,
    sidebarOpen: true,
    isLoading: {},
    errors: {},
    lastDataRefresh: null,
  });
};