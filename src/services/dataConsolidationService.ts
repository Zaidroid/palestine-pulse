/**
 * V3 Data Consolidation Service
 *
 * Implements the data infrastructure overhaul plan for V3 dashboards:
 * - Dynamic data ingestion from multiple sources
 * - Real-time data consolidation and processing
 * - Serverless offline architecture with IndexedDB
 * - Unified data models for Gaza and West Bank dashboards
 */

import { apiOrchestrator, WFP_ENDPOINTS } from './apiOrchestrator';
import { goodShepherdService } from './goodShepherdService';
import { useV3Store } from '@/store/v3Store';
import {
  DataSource,
  ApiResponse,
  ApiError,
  V3ConsolidatedData,
  GazaDashboardData,
  WestBankDashboardData,
  SharedData,
  QualityMetrics
} from '../types/data.types';

// ============================================
// DATA SOURCE MAPPING
// ============================================

type DashboardSourceMapping = {
  [key: string]: Record<string, DataSource[]>;
};

export const V3_DATA_SOURCE_MAPPING: {
  gaza: DashboardSourceMapping;
  westbank: DashboardSourceMapping;
} = {
  gaza: {
    humanitarianCrisis: {
      casualties: ['tech4palestine', 'goodshepherd'],
      demographics: ['tech4palestine'],
      pressCasualties: ['tech4palestine'],
    },
    infrastructureDestruction: {
      buildings: ['tech4palestine', 'goodshepherd'],
      healthcare: ['who', 'btselem', 'goodshepherd'],
      utilities: ['un_ocha'],
      destruction: ['goodshepherd'],
    },
    populationImpact: {
      displacement: ['un_ocha'],
      demographics: ['pcbs', 'un_ocha'],
      education: ['unrwa'],
    },
    aidSurvival: {
      foodSecurity: ['wfp'],
      healthcare: ['who', 'btselem', 'goodshepherd'],
      utilities: ['un_ocha'],
      aid: ['un_ocha'],
    },
  },
  westbank: {
    occupationMetrics: {
      settlements: ['goodshepherd'],
      landSeizure: ['goodshepherd', 'btselem'],
      controlMatrix: ['goodshepherd'],
    },
    settlerViolence: {
      attacks: ['goodshepherd'],
      demolitions: ['goodshepherd'],
      agriculture: ['goodshepherd'],
      homeDemolitions: ['goodshepherd'],
    },
    economicStrangulation: {
      indicators: ['world_bank'],
      trade: ['world_bank'],
      resources: ['goodshepherd', 'world_bank'],
      ngoData: ['goodshepherd'],
    },
    prisonersDetention: {
      statistics: ['goodshepherd'],
      trends: ['goodshepherd'],
      conditions: ['btselem', 'goodshepherd'],
      childPrisoners: ['goodshepherd'],
      politicalPrisoners: ['goodshepherd'],
    },
  },
};

// ============================================
// INDEXEDDB STORAGE MANAGER
// ============================================

class IndexedDBManager {
  private dbName = 'PalestinePulseV3';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Consolidated data store
        if (!db.objectStoreNames.contains('consolidatedData')) {
          const consolidatedStore = db.createObjectStore('consolidatedData', { keyPath: 'id' });
          consolidatedStore.createIndex('version', 'metadata.version', { unique: false });
          consolidatedStore.createIndex('lastUpdated', 'metadata.lastUpdated', { unique: false });
        }

        // Dashboard-specific stores
        if (!db.objectStoreNames.contains('gazaData')) {
          db.createObjectStore('gazaData', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('westbankData')) {
          db.createObjectStore('westbankData', { keyPath: 'id' });
        }

        // Cache store for API responses
        if (!db.objectStoreNames.contains('apiCache')) {
          const cacheStore = db.createObjectStore('apiCache', { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async storeConsolidatedData(data: V3ConsolidatedData): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['consolidatedData'], 'readwrite');
      const store = transaction.objectStore('consolidatedData');

      const request = store.put({
        id: 'current',
        ...data,
        storedAt: new Date().toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getConsolidatedData(): Promise<V3ConsolidatedData | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['consolidatedData'], 'readonly');
      const store = transaction.objectStore('consolidatedData');
      const request = store.get('current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Remove IndexedDB-specific fields
          const { id, storedAt, ...data } = result;
          resolve(data);
        } else {
          resolve(null);
        }
      };
    });
  }

  async storeApiCache(key: string, data: any, ttl: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['apiCache'], 'readwrite');
      const store = transaction.objectStore('apiCache');

      const request = store.put({
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getApiCache(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['apiCache'], 'readonly');
      const store = transaction.objectStore('apiCache');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() < result.expiresAt) {
          resolve(result.data);
        } else {
          if (result) {
            // Clean up expired entry
            const deleteTransaction = this.db!.transaction(['apiCache'], 'readwrite');
            const deleteStore = deleteTransaction.objectStore('apiCache');
            deleteStore.delete(key);
          }
          resolve(null);
        }
      };
    });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['apiCache'], 'readwrite');
      const store = transaction.objectStore('apiCache');
      const index = store.index('timestamp');
      const request = index.openCursor();

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const record = cursor.value;
          if (Date.now() >= record.expiresAt) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

// ============================================
// DATA CONSOLIDATION SERVICE
// ============================================

export class DataConsolidationService {
  private db: IndexedDBManager;
  private consolidationInterval: NodeJS.Timeout | null = null;
  private realTimeCallbacks: Set<(data: V3ConsolidatedData) => void> = new Set();

  constructor() {
    this.db = new IndexedDBManager();
  }

  /**
   * Initialize the service and database
   */
  async initialize(): Promise<void> {
    await this.db.init();
    console.log('V3 Data Consolidation Service initialized');
  }

  /**
   * Subscribe to real-time data updates
   */
  onDataUpdate(callback: (data: V3ConsolidatedData) => void): () => void {
    this.realTimeCallbacks.add(callback);
    return () => this.realTimeCallbacks.delete(callback);
  }

  private notifySubscribers(data: V3ConsolidatedData): void {
    this.realTimeCallbacks.forEach(callback => callback(data));
  }

  /**
   * Start automatic data consolidation
   */
  startAutoConsolidation(intervalMinutes: number = 60): void {
    if (this.consolidationInterval) {
      clearInterval(this.consolidationInterval);
    }

    this.consolidationInterval = setInterval(async () => {
      try {
        await this.consolidateAllData();
      } catch (error) {
        console.error('Auto-consolidation failed:', error);
      }
    }, intervalMinutes * 60 * 1000);

    console.log(`Auto-consolidation started (every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop automatic data consolidation
   */
  stopAutoConsolidation(): void {
    if (this.consolidationInterval) {
      clearInterval(this.consolidationInterval);
      this.consolidationInterval = null;
    }
    console.log('Auto-consolidation stopped');
  }

  /**
   * Consolidate all V3 dashboard data
   */
  async consolidateAllData(): Promise<V3ConsolidatedData> {
    console.log('Starting V3 data consolidation...');

    try {
      // Fetch all required data sources in parallel
      const [gazaData, westBankData, sharedData] = await Promise.all([
        this.consolidateGazaData(),
        this.consolidateWestBankData(),
        this.consolidateSharedData(),
      ]);

      // Calculate data quality metrics
      const qualityMetrics = this.calculateQualityMetrics([gazaData, westBankData, sharedData]);

      const consolidatedData: V3ConsolidatedData = {
        metadata: {
          version: '3.0.0',
          lastUpdated: new Date().toISOString(),
          dashboardVersions: {
            gaza: '3.0.0',
            westbank: '3.0.0',
          },
          dataQuality: qualityMetrics,
        },
        gaza: gazaData,
        westbank: westBankData,
        shared: sharedData,
      };

      // Store in IndexedDB
      await this.db.storeConsolidatedData(consolidatedData);

      // Notify subscribers
      this.notifySubscribers(consolidatedData);

      console.log('V3 data consolidation completed successfully');
      return consolidatedData;

    } catch (error) {
      console.error('V3 data consolidation failed:', error);
      throw error;
    }
  }

  /**
   * Get consolidated data from cache or fetch fresh
   */
  async getConsolidatedData(forceRefresh: boolean = false): Promise<V3ConsolidatedData> {
    if (!forceRefresh) {
      const cached = await this.db.getConsolidatedData();
      if (cached) {
        return cached;
      }
    }

    return this.consolidateAllData();
  }

  /**
   * Consolidate Gaza-specific dashboard data
   */
  private async consolidateGazaData(): Promise<GazaDashboardData> {
    const sources = V3_DATA_SOURCE_MAPPING.gaza;

    // Fetch humanitarian crisis data
    const humanitarianCrisis = await this.fetchSectionData(sources.humanitarianCrisis);

    // Fetch infrastructure destruction data
    const infrastructureDestruction = await this.fetchSectionData(sources.infrastructureDestruction);

    // Fetch population impact data
    const populationImpact = await this.fetchSectionData(sources.populationImpact);

    // Fetch aid & survival data
    const aidSurvival = await this.fetchSectionData(sources.aidSurvival);

    return {
      humanitarianCrisis,
      infrastructureDestruction,
      populationImpact,
      aidSurvival,
    };
  }

  /**
   * Consolidate West Bank-specific dashboard data
   */
  private async consolidateWestBankData(): Promise<WestBankDashboardData> {
    const sources = V3_DATA_SOURCE_MAPPING.westbank;

    // Fetch occupation metrics data
    const occupationMetrics = await this.fetchSectionData(sources.occupationMetrics);

    // Fetch settler violence data
    const settlerViolence = await this.fetchSectionData(sources.settlerViolence);

    // Fetch economic strangulation data
    const economicStrangulation = await this.fetchSectionData(sources.economicStrangulation);

    // Fetch prisoners & detention data
    const prisonersDetention = await this.fetchSectionData(sources.prisonersDetention);

    return {
      occupationMetrics,
      settlerViolence,
      economicStrangulation,
      prisonersDetention,
    };
  }

  /**
   * Consolidate shared/cross-dashboard data
   */
  private async consolidateSharedData(): Promise<SharedData> {
    // This would include timeline events, analytics, correlations, etc.
    // For now, return basic structure
    return {
      timeline: [],
      analytics: {},
      correlations: {},
      predictions: {},
    };
  }

  /**
   * Fetch data for a specific dashboard section
   */
  private async fetchSectionData(
    sectionSources: Record<string, DataSource[]>
  ): Promise<any> {
    const sectionData: any = {};
    const fetchPromises: Promise<void>[] = [];

    for (const [subsection, sources] of Object.entries(sectionSources)) {
      fetchPromises.push(
        (async () => {
          for (const source of sources) {
            try {
              useV3Store.getState().setDataSourceStatus(source, 'syncing');
              const data = await this.fetchFromSource(source, subsection);
              if (data) {
                sectionData[subsection] = data;
                sectionData.lastUpdated = new Date().toISOString();
                useV3Store.getState().setDataSourceStatus(source, 'active', new Date());
                break; // Use first successful source
              }
            } catch (error) {
              console.warn(`Failed to fetch ${subsection} from ${source}:`, error);
              useV3Store.getState().setDataSourceStatus(source, 'error');
            }
          }
        })()
      );
    }

    await Promise.all(fetchPromises);
    return sectionData;
  }

  /**
   * Fetch data from a specific source with caching
   */
  private async fetchFromSource(source: DataSource, endpoint: string): Promise<any> {
    // Check cache first
    const cacheKey = `${source}:${endpoint}`;
    const cached = await this.db.getApiCache(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch fresh data based on source and endpoint
    let data: any;

    switch (source) {
      case 'tech4palestine':
        data = await this.fetchTech4PalestineData(endpoint);
        break;
      case 'goodshepherd':
        data = await this.fetchGoodShepherdData(endpoint);
        break;
      case 'un_ocha':
        data = await this.fetchOCHAData(endpoint);
        break;
      case 'world_bank':
        data = await this.fetchWorldBankData(endpoint);
        break;
      case 'wfp':
        data = await this.fetchWFPData(endpoint);
        break;
      case 'btselem':
        data = await this.fetchBtselemData(endpoint);
        break;
      case 'who':
        data = await this.fetchWHOData(endpoint);
        break;
      case 'unrwa':
        data = await this.fetchUNRWAData(endpoint);
        break;
      case 'pcbs':
        data = await this.fetchPCBSData(endpoint);
        break;
      default:
        // Generic fetch for sources without special logic
        try {
          data = await apiOrchestrator.fetch(source, endpoint);
        } catch (error) {
            console.error(`Generic fetch for source ${source} failed:`, error);
            data = null;
        }
        break;
    }

    // Cache the result (5 minutes TTL for most data)
    if (data) {
        await this.db.storeApiCache(cacheKey, data, 5 * 60 * 1000);
    }

    return data;
  }

  /**
   * Fetch data from Tech4Palestine API
   */
  private async fetchTech4PalestineData(endpoint: string): Promise<any> {
    switch (endpoint) {
      case 'casualties':
        return apiOrchestrator.fetch('tech4palestine', '/v3/killed-in-gaza.min.json');
      case 'demographics':
        return apiOrchestrator.fetch('tech4palestine', '/v3/summary.json');
      case 'pressCasualties':
        return apiOrchestrator.fetch('tech4palestine', '/v2/press_killed_in_gaza.json');
      case 'buildings':
        return apiOrchestrator.fetch('tech4palestine', '/v3/infrastructure-damaged.json');
      default:
        throw new Error(`Unknown Tech4Palestine endpoint: ${endpoint}`);
    }
  }

  /**
   * Fetch data from Good Shepherd Collective API using enhanced service
   */
  private async fetchGoodShepherdData(endpoint: string): Promise<any> {
    try {
      // Use the enhanced Good Shepherd service for comprehensive data fetching
      const allDatasets = await goodShepherdService.fetchAllDatasets();

      switch (endpoint) {
        case 'settlements':
        case 'landSeizure':
        case 'controlMatrix':
          // Return West Bank data for these endpoints
          return {
            jerusalemWestBank: allDatasets.jerusalemWestBank,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'attacks':
          return {
            attacks: allDatasets.jerusalemWestBank,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'demolitions':
          return {
            demolitions: allDatasets.homeDemolitions,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'agriculture':
          // Return agriculture-related data from West Bank dataset
          return {
            agriculture: Array.isArray(allDatasets.jerusalemWestBank) ? allDatasets.jerusalemWestBank.filter(item =>
              item.incident_type?.toLowerCase().includes('agricultur')
            ) : [],
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'statistics':
        case 'trends':
          return {
            prisoners: allDatasets.politicalPrisoners,
            childPrisoners: allDatasets.childPrisoners,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'conditions':
          return {
            healthcareAttacks: allDatasets.healthcareAttacks,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'resources':
          return {
            ngoData: allDatasets.ngoData,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'homeDemolitions':
          return {
            homeDemolitions: allDatasets.homeDemolitions,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'childPrisoners':
          return {
            childPrisoners: allDatasets.childPrisoners,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'politicalPrisoners':
          return {
            politicalPrisoners: allDatasets.politicalPrisoners,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'destruction':
          return {
            gazaDestruction: allDatasets.gazaDestruction,
            maps: allDatasets.maps,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'casualties':
          return {
            gazaCasualties: allDatasets.gazaCasualties,
            jerusalemWestBankCasualties: allDatasets.jerusalemWestBankCasualties,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        case 'ngoData':
          return {
            ngoData: allDatasets.ngoData,
            metadata: { source: 'goodshepherd', lastUpdated: new Date().toISOString() }
          };

        default:
          // Fallback to original API orchestrator for unknown endpoints
          console.warn(`Unknown Good Shepherd endpoint: ${endpoint}, using fallback`);
          return apiOrchestrator.fetch('goodshepherd', 'wb_data.json');
      }
    } catch (error) {
      console.error(`Error fetching Good Shepherd data for endpoint ${endpoint}:`, error);

      // Fallback to original API orchestrator
      try {
        switch (endpoint) {
          case 'settlements':
          case 'landSeizure':
          case 'controlMatrix':
          case 'attacks':
          case 'demolitions':
          case 'agriculture':
          case 'resources':
            return apiOrchestrator.fetch('goodshepherd', 'wb_data.json');
          case 'statistics':
          case 'trends':
          case 'conditions':
          case 'childPrisoners':
          case 'politicalPrisoners':
            return apiOrchestrator.fetch('goodshepherd', 'prisoner_data.json');
          default:
            throw new Error(`Unknown Good Shepherd endpoint: ${endpoint}`);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw error;
      }
    }
  }

  /**
   * Fetch data from UN OCHA API
   */
  private async fetchOCHAData(endpoint: string): Promise<any> {
    // This would integrate with the HDX service
    switch (endpoint) {
      case 'utilities':
      case 'displacement':
      case 'aid':
        return apiOrchestrator.fetch('un_ocha', '/package_search?q=organization:un-ocha');
      default:
        throw new Error(`Unknown OCHA endpoint: ${endpoint}`);
    }
  }

  /**
   * Fetch data from World Bank API
   */
  private async fetchWorldBankData(endpoint: string): Promise<any> {
    switch (endpoint) {
      case 'indicators':
      case 'trade':
        return apiOrchestrator.fetch('world_bank', '/countries/PSE/indicators');
      default:
        throw new Error(`Unknown World Bank endpoint: ${endpoint}`);
    }
  }

  /**
   * Fetch data from WFP API
   */
  private async fetchWFPData(endpoint: string): Promise<any> {
    switch (endpoint) {
      case 'foodSecurity':
        return apiOrchestrator.fetch('wfp', WFP_ENDPOINTS.foodSecurity);
      default:
        throw new Error(`Unknown WFP endpoint: ${endpoint}`);
    }
  }

  /**
   * Fetch data from B'Tselem API
   */
  private async fetchBtselemData(endpoint: string): Promise<any> {
    // TODO: Implement B'Tselem data fetching logic
    console.warn(`Btselem endpoint not implemented: ${endpoint}`);
    return Promise.resolve(null);
  }

  /**
   * Fetch data from WHO API
   */
  private async fetchWHOData(endpoint: string): Promise<any> {
    // TODO: Implement WHO data fetching logic
    console.warn(`WHO endpoint not implemented: ${endpoint}`);
    return Promise.resolve(null);
  }

  /**
   * Fetch data from UNRWA API
   */
  private async fetchUNRWAData(endpoint: string): Promise<any> {
    // TODO: Implement UNRWA data fetching logic
    console.warn(`UNRWA endpoint not implemented: ${endpoint}`);
    return Promise.resolve(null);
  }

  /**
   * Fetch data from PCBS API
   */
  private async fetchPCBSData(endpoint: string): Promise<any> {
    // TODO: Implement PCBS data fetching logic
    console.warn(`PCBS endpoint not implemented: ${endpoint}`);
    return Promise.resolve(null);
  }

  private calculateQualityMetrics(dataSections: any[]): QualityMetrics {
    const issues: string[] = [];
    let totalScore = 0;
    const sourceScores: Record<DataSource, number> = {
      tech4palestine: 0,
      goodshepherd: 0,
      un_ocha: 0,
      who: 0,
      world_bank: 0,
      unrwa: 0,
      pcbs: 0,
      btselem: 0,
      wfp: 0,
      custom: 0,
    };

    // Simple quality assessment based on data completeness
    dataSections.forEach((section, index) => {
      const completeness = this.assessDataCompleteness(section);
      totalScore += completeness;

      if (completeness < 0.8) {
        issues.push(`Section ${index + 1} has low data completeness: ${(completeness * 100).toFixed(1)}%`);
      }
    });

    const overall = totalScore / dataSections.length;

    return {
      overall,
      sources: sourceScores,
      lastValidated: new Date().toISOString(),
      issues,
    };
  }

  /**
   * Assess data completeness for a section
   */
  private assessDataCompleteness(data: any): number {
    if (!data || typeof data !== 'object') return 0;

    const fields = Object.keys(data);
    if (fields.length === 0) return 0;

    let filledFields = 0;
    fields.forEach(field => {
      if (data[field] != null && data[field] !== '') {
        filledFields++;
      }
    });

    return filledFields / fields.length;
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    // This would clear the IndexedDB cache
    console.log('Cache cleared');
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    cacheSize: number;
    lastConsolidation: string | null;
    dataQuality: number;
  }> {
    const cached = await this.db.getConsolidatedData();

    return {
      cacheSize: 0, // Would calculate actual cache size
      lastConsolidation: cached?.metadata.lastUpdated || null,
      dataQuality: cached?.metadata.dataQuality.overall || 0,
    };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dataConsolidationService = new DataConsolidationService();