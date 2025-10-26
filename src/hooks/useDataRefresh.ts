/**
 * useDataRefresh Hook
 * 
 * React hook for managing data refresh in components:
 * - Access to refresh status and controls
 * - Manual refresh triggers
 * - Loading state management
 * - Error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { dataRefreshService, RefreshStatus, RefreshConfig } from '@/services/dataRefreshService';
import { DataSource } from '@/types/data.types';

export interface UseDataRefreshReturn {
  // Status
  status: RefreshStatus;
  isRefreshing: boolean;
  lastRefresh: Date | null;
  nextRefresh: Date | null;
  progress: number;
  errors: RefreshStatus['errors'];
  
  // Actions
  refresh: (options?: { sources?: DataSource[]; forceRefresh?: boolean }) => Promise<void>;
  retryFailed: () => Promise<void>;
  clearErrors: () => void;
  
  // Configuration
  config: RefreshConfig;
  updateConfig: (config: Partial<RefreshConfig>) => void;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

/**
 * Hook for managing data refresh
 */
export function useDataRefresh(): UseDataRefreshReturn {
  const [status, setStatus] = useState<RefreshStatus>(dataRefreshService.getStatus());
  const [config, setConfig] = useState<RefreshConfig>(dataRefreshService.getConfig());

  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = dataRefreshService.onRefreshStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  // Manual refresh
  const refresh = useCallback(async (options?: { sources?: DataSource[]; forceRefresh?: boolean }) => {
    await dataRefreshService.refreshData({
      background: false,
      ...options,
    });
  }, []);

  // Retry failed sources
  const retryFailed = useCallback(async () => {
    await dataRefreshService.retryFailedSources();
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    dataRefreshService.clearErrors();
  }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<RefreshConfig>) => {
    dataRefreshService.updateConfig(newConfig);
    setConfig(dataRefreshService.getConfig());
  }, []);

  // Start auto-refresh
  const startAutoRefresh = useCallback(() => {
    dataRefreshService.startAutoRefresh();
    setConfig(dataRefreshService.getConfig());
  }, []);

  // Stop auto-refresh
  const stopAutoRefresh = useCallback(() => {
    dataRefreshService.stopAutoRefresh();
    setConfig(dataRefreshService.getConfig());
  }, []);

  return {
    // Status
    status,
    isRefreshing: status.isRefreshing,
    lastRefresh: status.lastRefresh,
    nextRefresh: status.nextRefresh,
    progress: status.refreshProgress,
    errors: status.errors,
    
    // Actions
    refresh,
    retryFailed,
    clearErrors,
    
    // Configuration
    config,
    updateConfig,
    startAutoRefresh,
    stopAutoRefresh,
  };
}

/**
 * Hook for simple refresh button
 */
export function useRefreshButton() {
  const { isRefreshing, refresh } = useDataRefresh();

  const handleRefresh = useCallback(async () => {
    if (!isRefreshing) {
      await refresh({ forceRefresh: true });
    }
  }, [isRefreshing, refresh]);

  return {
    isRefreshing,
    refresh: handleRefresh,
  };
}

/**
 * Hook for monitoring specific data sources
 */
export function useSourceRefresh(sources: DataSource[]) {
  const { status, refresh } = useDataRefresh();

  const refreshSources = useCallback(async () => {
    await refresh({ sources, forceRefresh: true });
  }, [sources, refresh]);

  const sourceErrors = status.errors.filter(error => 
    sources.includes(error.source)
  );

  return {
    isRefreshing: status.isRefreshing && sources.includes(status.currentSource!),
    refresh: refreshSources,
    errors: sourceErrors,
    hasErrors: sourceErrors.length > 0,
  };
}
