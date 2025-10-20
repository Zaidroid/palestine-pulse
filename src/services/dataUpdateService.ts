/**
 * Data Update Service for Serverless Deployment
 *
 * Handles automatic data updates in serverless environments:
 * - Background sync when online
 * - Scheduled updates via service worker
 * - Offline queue management
 * - Update notifications and callbacks
 * - Integration with existing data consolidation service
 */

import { DataConsolidationService } from './dataConsolidationService';
import { V3ConsolidatedData } from './types/data.types';

export interface UpdateConfig {
  enabled: boolean;
  intervalMinutes: number;
  backgroundSync: boolean;
  notifyOnUpdate: boolean;
  preloadCriticalData: boolean;
  maxRetries: number;
  retryDelay: number;
}

export interface UpdateStatus {
  lastUpdate: string | null;
  nextUpdate: string | null;
  isUpdating: boolean;
  lastError: string | null;
  updateCount: number;
  dataAge: number; // minutes since last update
}

export class DataUpdateService {
  private consolidationService: DataConsolidationService;
  private config: UpdateConfig;
  private status: UpdateStatus;
  private updateTimer: NodeJS.Timeout | null = null;
  private updateCallbacks: Set<(data: V3ConsolidatedData) => void> = new Set();
  private errorCallbacks: Set<(error: Error) => void> = new Set();
  private isOnline: boolean = navigator.onLine;

  constructor(
    consolidationService: DataConsolidationService,
    config: Partial<UpdateConfig> = {}
  ) {
    this.consolidationService = consolidationService;

    // Default configuration
    this.config = {
      enabled: true,
      intervalMinutes: 60, // Update every hour
      backgroundSync: true,
      notifyOnUpdate: true,
      preloadCriticalData: true,
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      ...config,
    };

    this.status = {
      lastUpdate: null,
      nextUpdate: null,
      isUpdating: false,
      lastError: null,
      updateCount: 0,
      dataAge: Infinity,
    };

    this.initialize();
  }

  /**
   * Initialize the update service
   */
  private async initialize(): Promise<void> {
    console.log('Initializing Data Update Service...');

    // Set up online/offline event listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Initialize consolidation service
    await this.consolidationService.initialize();

    // Set up background sync if supported
    if (this.config.backgroundSync && 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.setupBackgroundSync();
    }

    // Preload critical data if enabled
    if (this.config.preloadCriticalData) {
      await this.preloadCriticalData();
    }

    // Start scheduled updates if enabled
    if (this.config.enabled) {
      this.startScheduledUpdates();
    }

    // Perform initial update
    await this.performUpdate();

    console.log('Data Update Service initialized successfully');
  }

  /**
   * Set up background sync for service worker
   */
  private async setupBackgroundSync(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      // Use type assertion for Background Sync API (not yet in TypeScript definitions)
      await (registration as any).sync.register('palestine-data-update');
      console.log('Background sync registered');
    } catch (error) {
      console.warn('Background sync not available:', error);
    }
  }

  /**
   * Handle coming back online
   */
  private handleOnline(): void {
    console.log('Device came online, checking for updates...');
    this.isOnline = true;

    // Perform immediate update when coming online
    setTimeout(() => {
      this.performUpdate();
    }, 1000);
  }

  /**
   * Handle going offline
   */
  private handleOffline(): void {
    console.log('Device went offline');
    this.isOnline = false;
  }

  /**
   * Preload critical datasets for offline use
   */
  private async preloadCriticalData(): Promise<void> {
    try {
      console.log('Preloading critical data for offline use...');

      // Get consolidated data (this will cache it locally)
      await this.consolidationService.getConsolidatedData();

      console.log('Critical data preloaded successfully');
    } catch (error) {
      console.error('Failed to preload critical data:', error);
    }
  }

  /**
   * Start scheduled updates
   */
  startScheduledUpdates(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }

    this.updateTimer = setInterval(() => {
      this.performUpdate();
    }, this.config.intervalMinutes * 60 * 1000);

    this.updateNextUpdateTime();
    console.log(`Scheduled updates started (every ${this.config.intervalMinutes} minutes)`);
  }

  /**
   * Stop scheduled updates
   */
  stopScheduledUpdates(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    console.log('Scheduled updates stopped');
  }

  /**
   * Update the next update time in status
   */
  private updateNextUpdateTime(): void {
    if (this.updateTimer) {
      this.status.nextUpdate = new Date(Date.now() + this.config.intervalMinutes * 60 * 1000).toISOString();
    }
  }

  /**
   * Perform a data update
   */
  async performUpdate(): Promise<V3ConsolidatedData> {
    if (this.status.isUpdating) {
      console.log('Update already in progress, skipping...');
      throw new Error('Update already in progress');
    }

    if (!this.isOnline) {
      console.log('Device offline, skipping update...');
      throw new Error('Device is offline');
    }

    this.status.isUpdating = true;
    this.status.lastError = null;

    let retries = 0;

    while (retries <= this.config.maxRetries) {
      try {
        console.log(`Performing data update (attempt ${retries + 1}/${this.config.maxRetries + 1})...`);

        // Consolidate all data
        const consolidatedData = await this.consolidationService.consolidateAllData();

        // Update status
        this.status.lastUpdate = new Date().toISOString();
        this.status.updateCount++;
        this.status.dataAge = 0;
        this.status.isUpdating = false;

        this.updateNextUpdateTime();

        // Notify callbacks
        this.notifyUpdateCallbacks(consolidatedData);

        console.log('Data update completed successfully');
        return consolidatedData;

      } catch (error) {
        retries++;
        this.status.lastError = error instanceof Error ? error.message : String(error);

        console.error(`Update attempt ${retries} failed:`, error);

        if (retries <= this.config.maxRetries) {
          console.log(`Retrying in ${this.config.retryDelay / 1000} seconds...`);
          await this.delay(this.config.retryDelay);
        }
      }
    }

    this.status.isUpdating = false;
    this.notifyErrorCallbacks(new Error(`Update failed after ${this.config.maxRetries + 1} attempts`));
    throw new Error(`Update failed after ${this.config.maxRetries + 1} attempts`);
  }

  /**
   * Force immediate update regardless of schedule
   */
  async forceUpdate(): Promise<V3ConsolidatedData> {
    console.log('Forcing immediate data update...');
    return this.performUpdate();
  }

  /**
   * Subscribe to update notifications
   */
  onUpdate(callback: (data: V3ConsolidatedData) => void): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  /**
   * Subscribe to error notifications
   */
  onError(callback: (error: Error) => void): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  /**
   * Notify update callbacks
   */
  private notifyUpdateCallbacks(data: V3ConsolidatedData): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  /**
   * Notify error callbacks
   */
  private notifyErrorCallbacks(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }

  /**
   * Get current status
   */
  getStatus(): UpdateStatus {
    // Calculate current data age
    if (this.status.lastUpdate) {
      this.status.dataAge = Math.floor((Date.now() - new Date(this.status.lastUpdate).getTime()) / (60 * 1000));
    }

    return { ...this.status };
  }

  /**
   * Get current configuration
   */
  getConfig(): UpdateConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<UpdateConfig>): void {
    const oldEnabled = this.config.enabled;
    this.config = { ...this.config, ...newConfig };

    // Restart scheduled updates if enabled state changed
    if (oldEnabled !== this.config.enabled) {
      if (this.config.enabled) {
        this.startScheduledUpdates();
      } else {
        this.stopScheduledUpdates();
      }
    }

    console.log('Update service configuration updated:', this.config);
  }

  /**
   * Check if an update is needed based on data age
   */
  isUpdateNeeded(maxAgeMinutes: number = 60): boolean {
    return this.status.dataAge > maxAgeMinutes;
  }

  /**
   * Get cached data if available
   */
  async getCachedData(): Promise<V3ConsolidatedData | null> {
    return this.consolidationService.getConsolidatedData();
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    await this.consolidationService.clearCache();
    console.log('All cached data cleared');
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this.stopScheduledUpdates();
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    this.updateCallbacks.clear();
    this.errorCallbacks.clear();
    console.log('Data Update Service destroyed');
  }
}

// Export singleton instance factory
export function createDataUpdateService(
  consolidationService: DataConsolidationService,
  config?: Partial<UpdateConfig>
): DataUpdateService {
  return new DataUpdateService(consolidationService, config);
}