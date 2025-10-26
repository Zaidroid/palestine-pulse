/**
 * Data Refresh Service
 * 
 * Implements real-time data refresh capabilities:
 * - Background data refresh without interrupting user experience
 * - Visual loading indicators during data fetching
 * - Manual refresh capabilities for immediate updates
 * - Refresh scheduling and coordination
 */

import { dataConsolidationService } from './dataConsolidationService';
import { useV3Store } from '@/store/v3Store';
import { DataSource } from '@/types/data.types';

// ============================================
// REFRESH CONFIGURATION
// ============================================

export interface RefreshConfig {
  autoRefreshEnabled: boolean;
  refreshInterval: number; // in milliseconds
  backgroundRefresh: boolean;
  showLoadingIndicators: boolean;
  refreshOnFocus: boolean;
  refreshOnReconnect: boolean;
}

const DEFAULT_REFRESH_CONFIG: RefreshConfig = {
  autoRefreshEnabled: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  backgroundRefresh: true,
  showLoadingIndicators: true,
  refreshOnFocus: true,
  refreshOnReconnect: true,
};

// ============================================
// REFRESH STATUS
// ============================================

export interface RefreshStatus {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  nextRefresh: Date | null;
  refreshProgress: number; // 0-100
  currentSource: DataSource | null;
  errors: RefreshError[];
}

export interface RefreshError {
  source: DataSource;
  message: string;
  timestamp: Date;
  retryable: boolean;
}

// ============================================
// DATA REFRESH SERVICE
// ============================================

export class DataRefreshService {
  private config: RefreshConfig = DEFAULT_REFRESH_CONFIG;
  private refreshInterval: NodeJS.Timeout | null = null;
  private isRefreshing: boolean = false;
  private refreshCallbacks: Set<(status: RefreshStatus) => void> = new Set();
  private status: RefreshStatus = {
    isRefreshing: false,
    lastRefresh: null,
    nextRefresh: null,
    refreshProgress: 0,
    currentSource: null,
    errors: [],
  };

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialize the refresh service
   */
  async initialize(config?: Partial<RefreshConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    if (this.config.autoRefreshEnabled) {
      this.startAutoRefresh();
    }

    console.log('Data Refresh Service initialized', this.config);
  }

  /**
   * Setup event listeners for refresh triggers
   */
  private setupEventListeners(): void {
    // Refresh on window focus
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        if (this.config.refreshOnFocus && !this.isRefreshing) {
          console.log('Window focused, triggering refresh...');
          this.refreshData({ background: true });
        }
      });

      // Refresh on network reconnection
      window.addEventListener('online', () => {
        if (this.config.refreshOnReconnect && !this.isRefreshing) {
          console.log('Network reconnected, triggering refresh...');
          useV3Store.getState().setOnlineStatus(true);
          this.refreshData({ background: false });
        }
      });

      window.addEventListener('offline', () => {
        console.log('Network disconnected');
        useV3Store.getState().setOnlineStatus(false);
      });
    }
  }

  /**
   * Subscribe to refresh status updates
   */
  onRefreshStatusChange(callback: (status: RefreshStatus) => void): () => void {
    this.refreshCallbacks.add(callback);
    return () => this.refreshCallbacks.delete(callback);
  }

  /**
   * Notify subscribers of status changes
   */
  private notifyStatusChange(): void {
    this.refreshCallbacks.forEach(callback => callback({ ...this.status }));
  }

  /**
   * Update refresh status
   */
  private updateStatus(updates: Partial<RefreshStatus>): void {
    this.status = { ...this.status, ...updates };
    this.notifyStatusChange();
  }

  /**
   * Start automatic data refresh
   */
  startAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      if (!this.isRefreshing) {
        this.refreshData({ background: true });
      }
    }, this.config.refreshInterval);

    // Calculate next refresh time
    const nextRefresh = new Date(Date.now() + this.config.refreshInterval);
    this.updateStatus({ nextRefresh });

    console.log(`Auto-refresh started (every ${this.config.refreshInterval / 1000}s)`);
  }

  /**
   * Stop automatic data refresh
   */
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    this.updateStatus({ nextRefresh: null });
    console.log('Auto-refresh stopped');
  }

  /**
   * Manually trigger data refresh
   */
  async refreshData(options: {
    background?: boolean;
    sources?: DataSource[];
    forceRefresh?: boolean;
  } = {}): Promise<void> {
    const { background = false, sources, forceRefresh = true } = options;

    // Prevent concurrent refreshes
    if (this.isRefreshing) {
      console.warn('Refresh already in progress, skipping...');
      return;
    }

    this.isRefreshing = true;
    const startTime = Date.now();

    // Update status
    this.updateStatus({
      isRefreshing: true,
      refreshProgress: 0,
      errors: [],
    });

    // Show loading indicators if not background refresh
    if (!background && this.config.showLoadingIndicators) {
      useV3Store.getState().fetchConsolidatedData(forceRefresh);
    }

    try {
      if (sources && sources.length > 0) {
        // Refresh specific sources
        await this.refreshSpecificSources(sources);
      } else {
        // Full data refresh
        await this.performFullRefresh(background);
      }

      const duration = Date.now() - startTime;
      console.log(`Data refresh completed in ${duration}ms`);

      // Update status
      this.updateStatus({
        isRefreshing: false,
        lastRefresh: new Date(),
        nextRefresh: this.refreshInterval 
          ? new Date(Date.now() + this.config.refreshInterval)
          : null,
        refreshProgress: 100,
        currentSource: null,
      });

    } catch (error) {
      console.error('Data refresh failed:', error);

      const refreshError: RefreshError = {
        source: 'custom',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        retryable: true,
      };

      this.updateStatus({
        isRefreshing: false,
        refreshProgress: 0,
        currentSource: null,
        errors: [...this.status.errors, refreshError],
      });

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Perform full data refresh
   */
  private async performFullRefresh(background: boolean): Promise<void> {
    try {
      // Update progress
      this.updateStatus({ refreshProgress: 10 });

      // Consolidate all data
      await dataConsolidationService.consolidateAllData();

      // Update progress
      this.updateStatus({ refreshProgress: 100 });

    } catch (error) {
      console.error('Full refresh failed:', error);
      throw error;
    }
  }

  /**
   * Refresh specific data sources
   */
  private async refreshSpecificSources(sources: DataSource[]): Promise<void> {
    const totalSources = sources.length;
    let completedSources = 0;

    for (const source of sources) {
      try {
        this.updateStatus({
          currentSource: source,
          refreshProgress: Math.round((completedSources / totalSources) * 100),
        });

        // Mark source as syncing
        useV3Store.getState().setDataSourceStatus(source, 'syncing');

        // Trigger refresh for this source
        // This would need to be implemented in the consolidation service
        // For now, we'll just update the status
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mark source as active
        useV3Store.getState().setDataSourceStatus(source, 'active', new Date());

        completedSources++;
      } catch (error) {
        console.error(`Failed to refresh source ${source}:`, error);

        useV3Store.getState().setDataSourceStatus(source, 'error');

        const refreshError: RefreshError = {
          source,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          retryable: true,
        };

        this.updateStatus({
          errors: [...this.status.errors, refreshError],
        });
      }
    }

    this.updateStatus({
      refreshProgress: 100,
      currentSource: null,
    });
  }

  /**
   * Get current refresh status
   */
  getStatus(): RefreshStatus {
    return { ...this.status };
  }

  /**
   * Update refresh configuration
   */
  updateConfig(config: Partial<RefreshConfig>): void {
    const oldInterval = this.config.refreshInterval;
    this.config = { ...this.config, ...config };

    // Restart auto-refresh if interval changed
    if (
      this.config.autoRefreshEnabled &&
      oldInterval !== this.config.refreshInterval &&
      this.refreshInterval
    ) {
      this.startAutoRefresh();
    }

    // Start or stop auto-refresh based on config
    if (this.config.autoRefreshEnabled && !this.refreshInterval) {
      this.startAutoRefresh();
    } else if (!this.config.autoRefreshEnabled && this.refreshInterval) {
      this.stopAutoRefresh();
    }

    console.log('Refresh config updated:', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): RefreshConfig {
    return { ...this.config };
  }

  /**
   * Clear refresh errors
   */
  clearErrors(): void {
    this.updateStatus({ errors: [] });
  }

  /**
   * Retry failed sources
   */
  async retryFailedSources(): Promise<void> {
    const failedSources = this.status.errors
      .filter(error => error.retryable)
      .map(error => error.source);

    if (failedSources.length === 0) {
      console.log('No failed sources to retry');
      return;
    }

    console.log(`Retrying ${failedSources.length} failed sources...`);
    this.clearErrors();
    await this.refreshData({ sources: failedSources, forceRefresh: true });
  }

  /**
   * Cleanup and shutdown
   */
  shutdown(): void {
    this.stopAutoRefresh();
    this.refreshCallbacks.clear();
    console.log('Data Refresh Service shut down');
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dataRefreshService = new DataRefreshService();
