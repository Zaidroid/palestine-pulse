/**
 * React Hook for Data Updates Integration
 *
 * Provides React integration for the DataUpdateService:
 * - Automatic data updates with configurable intervals
 * - Background sync integration with service worker
 * - Real-time update notifications
 * - Offline support and cache management
 * - Error handling and retry logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { DataConsolidationService } from './services/dataConsolidationService';
import { createDataUpdateService, DataUpdateService } from './services/dataUpdateService';
import { V3ConsolidatedData } from './types/data.types';

export interface UseDataUpdatesConfig {
  enabled?: boolean;
  intervalMinutes?: number;
  backgroundSync?: boolean;
  notifyOnUpdate?: boolean;
  preloadCriticalData?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface UseDataUpdatesReturn {
  // Current data state
  data: V3ConsolidatedData | null;
  isLoading: boolean;
  error: string | null;

  // Update status
  lastUpdate: string | null;
  nextUpdate: string | null;
  isUpdating: boolean;
  updateCount: number;
  dataAge: number;

  // Actions
  forceUpdate: () => Promise<V3ConsolidatedData>;
  clearCache: () => Promise<void>;
  updateConfig: (config: Partial<UseDataUpdatesConfig>) => void;

  // Status
  isOnline: boolean;
  isInitialized: boolean;
}

export function useDataUpdates(config: UseDataUpdatesConfig = {}): UseDataUpdatesReturn {
  // Core state
  const [data, setData] = useState<V3ConsolidatedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update service state
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [nextUpdate, setNextUpdate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [dataAge, setDataAge] = useState(Infinity);

  // Service state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for services and cleanup
  const updateServiceRef = useRef<DataUpdateService | null>(null);
  const consolidationServiceRef = useRef<DataConsolidationService | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Initialize services
   */
  const initializeServices = useCallback(async () => {
    try {
      // Create consolidation service
      consolidationServiceRef.current = new DataConsolidationService();
      await consolidationServiceRef.current.initialize();

      // Create update service
      updateServiceRef.current = createDataUpdateService(
        consolidationServiceRef.current,
        config
      );

      // Subscribe to data updates
      unsubscribeRef.current = updateServiceRef.current.onUpdate((newData) => {
        setData(newData);
        setError(null);
      });

      // Subscribe to errors
      updateServiceRef.current.onError((updateError) => {
        setError(updateError.message);
      });

      // Load initial data
      const initialData = await updateServiceRef.current.getCachedData();
      if (initialData) {
        setData(initialData);
      }

      // Get initial status
      const status = updateServiceRef.current.getStatus();
      setLastUpdate(status.lastUpdate);
      setNextUpdate(status.nextUpdate);
      setIsUpdating(status.isUpdating);
      setUpdateCount(status.updateCount);
      setDataAge(status.dataAge);

      setIsInitialized(true);
      setIsLoading(false);

      console.log('Data updates hook initialized successfully');
    } catch (initError) {
      console.error('Failed to initialize data updates:', initError);
      setError(initError instanceof Error ? initError.message : String(initError));
      setIsLoading(false);
    }
  }, [config]);

  /**
   * Update status periodically
   */
  const updateStatus = useCallback(() => {
    if (updateServiceRef.current) {
      const status = updateServiceRef.current.getStatus();
      setLastUpdate(status.lastUpdate);
      setNextUpdate(status.nextUpdate);
      setIsUpdating(status.isUpdating);
      setUpdateCount(status.updateCount);
      setDataAge(status.dataAge);
    }
  }, []);

  /**
   * Handle online/offline status changes
   */
  const handleOnlineStatusChange = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  /**
   * Handle service worker messages
   */
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === 'BACKGROUND_SYNC') {
      console.log('Received background sync message:', event.data);

      if (event.data.action === 'update-palestine-data') {
        // Trigger data update when service worker requests it
        updateServiceRef.current?.forceUpdate().catch(console.error);
      }
    }
  }, []);

  /**
   * Force immediate update
   */
  const forceUpdate = useCallback(async (): Promise<V3ConsolidatedData> => {
    if (!updateServiceRef.current) {
      throw new Error('Update service not initialized');
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateServiceRef.current.forceUpdate();
      updateStatus();
      return result;
    } catch (updateError) {
      const errorMessage = updateError instanceof Error ? updateError.message : String(updateError);
      setError(errorMessage);
      throw updateError;
    } finally {
      setIsUpdating(false);
    }
  }, [updateStatus]);

  /**
   * Clear all cached data
   */
  const clearCache = useCallback(async (): Promise<void> => {
    if (updateServiceRef.current) {
      await updateServiceRef.current.clearCache();
      setData(null);
      updateStatus();
    }
  }, [updateStatus]);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((newConfig: Partial<UseDataUpdatesConfig>) => {
    if (updateServiceRef.current) {
      updateServiceRef.current.updateConfig(newConfig);
      updateStatus();
    }
  }, [updateStatus]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    // Set up event listeners
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    // Initialize services
    initializeServices();

    // Set up status polling
    const statusInterval = setInterval(updateStatus, 10000); // Update status every 10 seconds

    return () => {
      // Cleanup
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);

      clearInterval(statusInterval);

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      if (updateServiceRef.current) {
        updateServiceRef.current.destroy();
      }
    };
  }, [initializeServices, handleOnlineStatusChange, handleServiceWorkerMessage, updateStatus]);

  return {
    // Data state
    data,
    isLoading,
    error,

    // Update status
    lastUpdate,
    nextUpdate,
    isUpdating,
    updateCount,
    dataAge,

    // Actions
    forceUpdate,
    clearCache,
    updateConfig,

    // Status
    isOnline,
    isInitialized,
  };
}