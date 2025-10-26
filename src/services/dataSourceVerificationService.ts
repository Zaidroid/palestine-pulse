/**
 * Data Source Verification Service
 * 
 * Tests connectivity and functionality of all existing data source APIs.
 * Validates data structure and format from each verified source.
 * Documents actual data availability and identifies gaps.
 */

import { apiOrchestrator, DATA_SOURCES, TECH4PALESTINE_ENDPOINTS, GOODSHEPHERD_ENDPOINTS, WFP_ENDPOINTS } from './apiOrchestrator';
import { DataSource, ApiResponse, ApiError } from '../types/data.types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ConnectivityResult {
  source: DataSource;
  endpoint: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: string;
}

export interface StructureValidation {
  source: DataSource;
  endpoint: string;
  isValid: boolean;
  expectedFields: string[];
  actualFields: string[];
  missingFields: string[];
  extraFields: string[];
  dataType: string;
  sampleData?: any;
}

export interface QualityMetrics {
  completeness: number; // 0-1 score
  freshness: number; // 0-1 score (based on last update)
  consistency: number; // 0-1 score
  reliability: number; // 0-1 score (based on uptime)
  overallScore: number; // 0-1 score
  issues: string[];
}

export interface DataGap {
  requiredData: string;
  description: string;
  availableSources: DataSource[];
  alternativeSources: DataSource[];
  severity: 'blocking' | 'workaround_available' | 'minor';
  recommendation: string;
}

export interface SourceVerificationReport {
  timestamp: string;
  totalSources: number;
  workingSources: number;
  failingSources: DataSource[];
  sourceResults: Map<DataSource, SourceVerificationResult>;
  dataGaps: DataGap[];
  qualityAssessment: Record<DataSource, QualityMetrics>;
  recommendations: string[];
}

export interface SourceVerificationResult {
  source: DataSource;
  enabled: boolean;
  connectivity: ConnectivityResult[];
  structureValidations: StructureValidation[];
  qualityMetrics: QualityMetrics;
  availableEndpoints: EndpointInfo[];
  overallStatus: 'operational' | 'degraded' | 'failed';
}

export interface EndpointInfo {
  path: string;
  method: 'GET' | 'POST';
  dataFormat: 'json' | 'csv' | 'xml';
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  lastTested: string;
  status: 'working' | 'failed' | 'untested';
  sampleResponse?: any;
}

// ============================================
// EXPECTED DATA STRUCTURES
// ============================================

const EXPECTED_STRUCTURES: Record<string, string[]> = {
  'tech4palestine:killedInGaza': ['id', 'name', 'age', 'sex', 'date'],
  'tech4palestine:pressKilled': ['name', 'organization', 'date'],
  'tech4palestine:summary': ['gaza', 'west_bank', 'total'],
  'tech4palestine:casualtiesDaily': ['report_date', 'ext_killed_cum', 'ext_injured_cum'],
  'tech4palestine:westBankDaily': ['report_date', 'verified'],
  'tech4palestine:infrastructure': ['report_date', 'residential', 'health_facilities'],
  'goodshepherd:childPrisoners': ['name', 'age', 'detention_date'],
  'goodshepherd:wbData': ['incident_type', 'date', 'location'],
  'goodshepherd:healthcareAttacks': ['facility_name', 'attack_date', 'casualties'],
  'goodshepherd:homeDemolitions': ['location', 'date', 'people_affected'],
  'wfp:foodPrices': ['commodity', 'price', 'date', 'market'],
};

// ============================================
// DATA SOURCE VERIFICATION SERVICE CLASS
// ============================================

export class DataSourceVerificationService {
  private verificationHistory: Map<DataSource, SourceVerificationResult[]> = new Map();
  
  /**
   * Verify all data sources
   */
  async verifyAllSources(): Promise<SourceVerificationReport> {
    const timestamp = new Date().toISOString();
    const sourceResults = new Map<DataSource, SourceVerificationResult>();
    const enabledSources = apiOrchestrator.getEnabledSources();
    
    console.log(`Starting verification of ${enabledSources.length} enabled sources...`);
    
    // Verify each enabled source
    for (const source of enabledSources) {
      try {
        const result = await this.verifySource(source);
        sourceResults.set(source, result);
      } catch (error) {
        console.error(`Failed to verify source ${source}:`, error);
        sourceResults.set(source, {
          source,
          enabled: true,
          connectivity: [],
          structureValidations: [],
          qualityMetrics: this.getDefaultQualityMetrics(),
          availableEndpoints: [],
          overallStatus: 'failed',
        });
      }
    }
    
    // Calculate summary statistics
    const workingSources = Array.from(sourceResults.values())
      .filter(r => r.overallStatus === 'operational').length;
    
    const failingSources = Array.from(sourceResults.entries())
      .filter(([_, r]) => r.overallStatus === 'failed')
      .map(([source, _]) => source);
    
    // Identify data gaps
    const dataGaps = await this.identifyDataGaps(sourceResults);
    
    // Generate quality assessment
    const qualityAssessment: Record<DataSource, QualityMetrics> = {};
    sourceResults.forEach((result, source) => {
      qualityAssessment[source] = result.qualityMetrics;
    });
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(sourceResults, dataGaps);
    
    return {
      timestamp,
      totalSources: enabledSources.length,
      workingSources,
      failingSources,
      sourceResults,
      dataGaps,
      qualityAssessment,
      recommendations,
    };
  }
  
  /**
   * Verify a single data source
   */
  private async verifySource(source: DataSource): Promise<SourceVerificationResult> {
    console.log(`Verifying source: ${source}`);
    
    const connectivity: ConnectivityResult[] = [];
    const structureValidations: StructureValidation[] = [];
    const availableEndpoints: EndpointInfo[] = [];
    
    // Get endpoints for this source
    const endpoints = this.getEndpointsForSource(source);
    
    // Test each endpoint
    for (const endpoint of endpoints) {
      const connectivityResult = await this.testSourceConnectivity(source, endpoint.path);
      connectivity.push(connectivityResult);
      
      if (connectivityResult.success) {
        const structureValidation = await this.validateDataStructure(source, endpoint.path);
        structureValidations.push(structureValidation);
        
        availableEndpoints.push({
          ...endpoint,
          lastTested: new Date().toISOString(),
          status: 'working',
        });
      } else {
        availableEndpoints.push({
          ...endpoint,
          lastTested: new Date().toISOString(),
          status: 'failed',
        });
      }
    }
    
    // Calculate quality metrics
    const qualityMetrics = await this.benchmarkDataQuality(source, connectivity, structureValidations);
    
    // Determine overall status
    const workingEndpoints = connectivity.filter(c => c.success).length;
    const overallStatus: 'operational' | 'degraded' | 'failed' = 
      workingEndpoints === 0 ? 'failed' :
      workingEndpoints < endpoints.length / 2 ? 'degraded' :
      'operational';
    
    const result: SourceVerificationResult = {
      source,
      enabled: DATA_SOURCES[source].enabled,
      connectivity,
      structureValidations,
      qualityMetrics,
      availableEndpoints,
      overallStatus,
    };
    
    // Store in history
    const history = this.verificationHistory.get(source) || [];
    history.push(result);
    this.verificationHistory.set(source, history);
    
    return result;
  }
  
  /**
   * Test connectivity to a data source
   */
  async testSourceConnectivity(source: DataSource, endpoint: string): Promise<ConnectivityResult> {
    const startTime = Date.now();
    
    try {
      const response = await apiOrchestrator.fetch(source, endpoint, { useCache: false });
      const responseTime = Date.now() - startTime;
      
      return {
        source,
        endpoint,
        success: true,
        responseTime,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        source,
        endpoint,
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Validate data structure from a source
   */
  async validateDataStructure(source: DataSource, endpoint: string): Promise<StructureValidation> {
    const structureKey = `${source}:${endpoint.split('/').pop()?.replace('.json', '')}`;
    const expectedFields = EXPECTED_STRUCTURES[structureKey] || [];
    
    try {
      const response = await apiOrchestrator.fetch(source, endpoint, { useCache: false });
      const data = response.data;
      
      // Determine data type and extract fields
      let actualFields: string[] = [];
      let dataType = 'unknown';
      let sampleData: any = null;
      
      if (Array.isArray(data)) {
        dataType = 'array';
        if (data.length > 0) {
          actualFields = Object.keys(data[0]);
          sampleData = data[0];
        }
      } else if (typeof data === 'object' && data !== null) {
        dataType = 'object';
        actualFields = Object.keys(data);
        sampleData = data;
      }
      
      // Compare fields
      const missingFields = expectedFields.filter(f => !actualFields.includes(f));
      const extraFields = actualFields.filter(f => !expectedFields.includes(f));
      const isValid = missingFields.length === 0 || expectedFields.length === 0;
      
      return {
        source,
        endpoint,
        isValid,
        expectedFields,
        actualFields,
        missingFields,
        extraFields,
        dataType,
        sampleData,
      };
    } catch (error) {
      return {
        source,
        endpoint,
        isValid: false,
        expectedFields,
        actualFields: [],
        missingFields: expectedFields,
        extraFields: [],
        dataType: 'error',
      };
    }
  }
  
  /**
   * Benchmark data quality for a source
   */
  async benchmarkDataQuality(
    source: DataSource,
    connectivity: ConnectivityResult[],
    structureValidations: StructureValidation[]
  ): Promise<QualityMetrics> {
    const issues: string[] = [];
    
    // Calculate completeness (based on structure validation)
    const validStructures = structureValidations.filter(v => v.isValid).length;
    const completeness = structureValidations.length > 0 
      ? validStructures / structureValidations.length 
      : 0;
    
    if (completeness < 0.8) {
      issues.push(`Data structure completeness is low: ${(completeness * 100).toFixed(0)}%`);
    }
    
    // Calculate reliability (based on connectivity)
    const successfulConnections = connectivity.filter(c => c.success).length;
    const reliability = connectivity.length > 0 
      ? successfulConnections / connectivity.length 
      : 0;
    
    if (reliability < 0.9) {
      issues.push(`Connection reliability is low: ${(reliability * 100).toFixed(0)}%`);
    }
    
    // Calculate freshness (placeholder - would need actual timestamp data)
    const freshness = 0.8; // Default assumption
    
    // Calculate consistency (based on response times)
    const responseTimes = connectivity.filter(c => c.success).map(c => c.responseTime);
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;
    
    const consistency = avgResponseTime < 2000 ? 1.0 : avgResponseTime < 5000 ? 0.8 : 0.6;
    
    if (consistency < 0.8) {
      issues.push(`Response times are inconsistent (avg: ${avgResponseTime.toFixed(0)}ms)`);
    }
    
    // Calculate overall score
    const overallScore = (completeness + freshness + consistency + reliability) / 4;
    
    return {
      completeness,
      freshness,
      consistency,
      reliability,
      overallScore,
      issues,
    };
  }
  
  /**
   * Identify data gaps between required and available data
   */
  private async identifyDataGaps(
    sourceResults: Map<DataSource, SourceVerificationResult>
  ): Promise<DataGap[]> {
    const gaps: DataGap[] = [];
    
    // Define required data for Gaza dashboard
    const gazaRequirements = [
      { data: 'Gaza Casualties', sources: ['tech4palestine'] },
      { data: 'Gaza Infrastructure Damage', sources: ['tech4palestine', 'goodshepherd'] },
      { data: 'Gaza Displacement', sources: ['un_ocha'] },
      { data: 'Gaza Food Security', sources: ['wfp'] },
      { data: 'Gaza Healthcare Status', sources: ['who'] },
    ];
    
    // Define required data for West Bank dashboard
    const westBankRequirements = [
      { data: 'West Bank Violence', sources: ['goodshepherd', 'btselem'] },
      { data: 'West Bank Settlements', sources: ['goodshepherd', 'un_ocha'] },
      { data: 'West Bank Prisoners', sources: ['goodshepherd', 'btselem'] },
      { data: 'West Bank Economic Data', sources: ['world_bank'] },
    ];
    
    // Check each requirement
    [...gazaRequirements, ...westBankRequirements].forEach(req => {
      const availableSources = req.sources.filter(source => {
        const result = sourceResults.get(source as DataSource);
        return result && result.overallStatus === 'operational';
      }) as DataSource[];
      
      if (availableSources.length === 0) {
        gaps.push({
          requiredData: req.data,
          description: `No working sources available for ${req.data}`,
          availableSources: [],
          alternativeSources: req.sources as DataSource[],
          severity: 'blocking',
          recommendation: `Enable and fix ${req.sources[0]} or find alternative data source`,
        });
      } else if (availableSources.length < req.sources.length) {
        gaps.push({
          requiredData: req.data,
          description: `Some sources unavailable for ${req.data}`,
          availableSources,
          alternativeSources: req.sources.filter(s => !availableSources.includes(s as DataSource)) as DataSource[],
          severity: 'workaround_available',
          recommendation: `Consider enabling backup sources: ${req.sources.filter(s => !availableSources.includes(s as DataSource)).join(', ')}`,
        });
      }
    });
    
    return gaps;
  }
  
  /**
   * Generate recommendations based on verification results
   */
  private generateRecommendations(
    sourceResults: Map<DataSource, SourceVerificationResult>,
    dataGaps: DataGap[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Check for failed sources
    const failedSources = Array.from(sourceResults.entries())
      .filter(([_, result]) => result.overallStatus === 'failed')
      .map(([source, _]) => source);
    
    if (failedSources.length > 0) {
      recommendations.push(
        `Fix connectivity issues with: ${failedSources.join(', ')}`
      );
    }
    
    // Check for degraded sources
    const degradedSources = Array.from(sourceResults.entries())
      .filter(([_, result]) => result.overallStatus === 'degraded')
      .map(([source, _]) => source);
    
    if (degradedSources.length > 0) {
      recommendations.push(
        `Investigate performance issues with: ${degradedSources.join(', ')}`
      );
    }
    
    // Check for blocking data gaps
    const blockingGaps = dataGaps.filter(g => g.severity === 'blocking');
    if (blockingGaps.length > 0) {
      recommendations.push(
        `Critical: Resolve blocking data gaps for: ${blockingGaps.map(g => g.requiredData).join(', ')}`
      );
    }
    
    // Check for low quality sources
    const lowQualitySources = Array.from(sourceResults.entries())
      .filter(([_, result]) => result.qualityMetrics.overallScore < 0.7)
      .map(([source, _]) => source);
    
    if (lowQualitySources.length > 0) {
      recommendations.push(
        `Improve data quality for: ${lowQualitySources.join(', ')}`
      );
    }
    
    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('All data sources are operational and meeting quality standards');
      recommendations.push('Continue monitoring data source health and performance');
    }
    
    return recommendations;
  }
  
  /**
   * Get endpoints for a specific source
   */
  private getEndpointsForSource(source: DataSource): EndpointInfo[] {
    switch (source) {
      case 'tech4palestine':
        return Object.entries(TECH4PALESTINE_ENDPOINTS).map(([key, path]) => ({
          path,
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'daily' as const,
          lastTested: '',
          status: 'untested' as const,
        }));
      
      case 'goodshepherd':
        return Object.entries(GOODSHEPHERD_ENDPOINTS).map(([key, path]) => ({
          path,
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'weekly' as const,
          lastTested: '',
          status: 'untested' as const,
        }));
      
      case 'wfp':
        return Object.entries(WFP_ENDPOINTS).map(([key, path]) => ({
          path,
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'weekly' as const,
          lastTested: '',
          status: 'untested' as const,
        }));
      
      case 'world_bank':
        return [{
          path: '/countries/PSE/indicators',
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'daily' as const,
          lastTested: '',
          status: 'untested' as const,
        }];
      
      case 'un_ocha':
        return [{
          path: '/package_search?q=organization:un-ocha',
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'daily' as const,
          lastTested: '',
          status: 'untested' as const,
        }];
      
      case 'btselem':
        return [{
          path: '/checkpoints',
          method: 'GET' as const,
          dataFormat: 'json' as const,
          updateFrequency: 'weekly' as const,
          lastTested: '',
          status: 'untested' as const,
        }];
      
      default:
        return [];
    }
  }
  
  /**
   * Get default quality metrics
   */
  private getDefaultQualityMetrics(): QualityMetrics {
    return {
      completeness: 0,
      freshness: 0,
      consistency: 0,
      reliability: 0,
      overallScore: 0,
      issues: ['Source verification failed'],
    };
  }
  
  /**
   * Get verification history for a source
   */
  getVerificationHistory(source: DataSource): SourceVerificationResult[] {
    return this.verificationHistory.get(source) || [];
  }
  
  /**
   * Export verification report as JSON
   */
  exportReport(report: SourceVerificationReport): string {
    return JSON.stringify(report, (key, value) => {
      // Convert Map to object for JSON serialization
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    }, 2);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dataSourceVerificationService = new DataSourceVerificationService();
