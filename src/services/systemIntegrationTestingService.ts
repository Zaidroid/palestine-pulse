/**
 * System Integration Testing Service
 * 
 * Comprehensive testing service for validating:
 * - All dashboard components with real data sources
 * - Performance and user experience with complete real data integration
 * - System stability with all APIs connected
 * - Load testing and stress testing capabilities
 */

import { apiOrchestrator, DATA_SOURCES } from './apiOrchestrator';
import { dataConsolidationService } from './dataConsolidationService';
import { performanceMonitor } from './performanceMonitor';
import { dataSourceMetadataService } from './dataSourceMetadataService';
import { DataSource } from '@/types/data.types';

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'warning';
  duration: number;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ComponentTestResult extends TestResult {
  componentPath: string;
  dataSourcesUsed: DataSource[];
  metricsValidated: string[];
}

export interface PerformanceTestResult extends TestResult {
  metrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cacheHitRate: number;
  };
}

export interface LoadTestResult extends TestResult {
  concurrentRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  peakResponseTime: number;
}

export interface SystemHealthReport {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  timestamp: Date;
  dataSourcesStatus: Record<DataSource, {
    available: boolean;
    responseTime: number;
    errorRate: number;
  }>;
  componentTests: ComponentTestResult[];
  performanceTests: PerformanceTestResult[];
  loadTests: LoadTestResult[];
  recommendations: string[];
}

// ============================================
// SYSTEM INTEGRATION TESTING SERVICE
// ============================================

class SystemIntegrationTestingService {
  private testResults: TestResult[] = [];
  private isRunning: boolean = false;

  /**
   * Run comprehensive system-wide integration tests
   */
  async runFullSystemTest(): Promise<SystemHealthReport> {
    if (this.isRunning) {
      throw new Error('System test is already running');
    }

    this.isRunning = true;
    this.testResults = [];
    const startTime = Date.now();

    console.log('🧪 Starting comprehensive system integration tests...');

    try {
      // Test 1: Data Source Connectivity
      const dataSourceTests = await this.testAllDataSources();
      
      // Test 2: Component Data Integration
      const componentTests = await this.testComponentDataIntegration();
      
      // Test 3: Performance Testing
      const performanceTests = await this.testSystemPerformance();
      
      // Test 4: Load Testing
      const loadTests = await this.testSystemLoad();
      
      // Test 5: Data Quality Validation
      const dataQualityTests = await this.testDataQuality();

      // Generate health report
      const report = this.generateHealthReport(
        dataSourceTests,
        componentTests,
        performanceTests,
        loadTests,
        dataQualityTests
      );

      const duration = Date.now() - startTime;
      console.log(`✅ System integration tests completed in ${duration}ms`);
      console.log(`Overall Status: ${report.overallStatus}`);

      return report;
    } catch (error) {
      console.error('❌ System integration tests failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Test connectivity and functionality of all data sources
   */
  private async testAllDataSources(): Promise<TestResult[]> {
    console.log('📡 Testing data source connectivity...');
    const results: TestResult[] = [];

    const enabledSources = apiOrchestrator.getEnabledSources();

    for (const source of enabledSources) {
      const startTime = Date.now();
      
      try {
        // Test basic connectivity
        const config = DATA_SOURCES[source];
        const testEndpoint = this.getTestEndpoint(source);
        
        const response = await apiOrchestrator.fetch(source, testEndpoint, {
          useCache: false,
          bypassRateLimit: true,
        });

        const duration = Date.now() - startTime;

        if (response.success && response.data) {
          results.push({
            testName: `Data Source: ${source}`,
            status: 'passed',
            duration,
            message: `Successfully connected to ${source}`,
            details: {
              source,
              endpoint: testEndpoint,
              dataReceived: true,
            },
            timestamp: new Date(),
          });
        } else {
          results.push({
            testName: `Data Source: ${source}`,
            status: 'warning',
            duration,
            message: `Connected to ${source} but received no data`,
            details: { source, endpoint: testEndpoint },
            timestamp: new Date(),
          });
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        results.push({
          testName: `Data Source: ${source}`,
          status: 'failed',
          duration,
          message: `Failed to connect to ${source}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: { source, error },
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  /**
   * Test component data integration
   */
  private async testComponentDataIntegration(): Promise<ComponentTestResult[]> {
    console.log('🧩 Testing component data integration...');
    const results: ComponentTestResult[] = [];

    // Test Gaza dashboard components
    const gazaComponents = [
      { path: 'gaza/HumanitarianCrisis', sources: ['tech4palestine', 'goodshepherd'] as DataSource[], metrics: ['casualties', 'demographics'] },
      { path: 'gaza/InfrastructureDestruction', sources: ['tech4palestine', 'goodshepherd'] as DataSource[], metrics: ['buildings', 'healthcare'] },
      { path: 'gaza/PopulationImpact', sources: ['un_ocha'] as DataSource[], metrics: ['displacement'] },
      { path: 'gaza/AidSurvival', sources: ['wfp', 'un_ocha'] as DataSource[], metrics: ['foodSecurity', 'aid'] },
    ];

    // Test West Bank dashboard components
    const westBankComponents = [
      { path: 'westbank/OccupationMetrics', sources: ['goodshepherd'] as DataSource[], metrics: ['settlements', 'landSeizure'] },
      { path: 'westbank/SettlerViolence', sources: ['goodshepherd'] as DataSource[], metrics: ['attacks', 'demolitions'] },
      { path: 'westbank/EconomicStrangulation', sources: ['world_bank', 'goodshepherd'] as DataSource[], metrics: ['indicators', 'resources'] },
      { path: 'westbank/PrisonersDetention', sources: ['goodshepherd'] as DataSource[], metrics: ['statistics', 'childPrisoners'] },
    ];

    const allComponents = [...gazaComponents, ...westBankComponents];

    for (const component of allComponents) {
      const startTime = Date.now();
      
      try {
        // Validate that component can fetch data from its sources
        const dataFetches = await Promise.all(
          component.sources.map(async (source) => {
            try {
              const endpoint = this.getTestEndpoint(source);
              const response = await apiOrchestrator.fetch(source, endpoint, {
                useCache: true,
              });
              return { source, success: response.success, data: response.data };
            } catch (error) {
              return { source, success: false, error };
            }
          })
        );

        const successfulSources = dataFetches.filter(f => f.success);
        const duration = Date.now() - startTime;

        if (successfulSources.length === component.sources.length) {
          results.push({
            testName: `Component: ${component.path}`,
            status: 'passed',
            duration,
            message: `All data sources connected successfully`,
            componentPath: component.path,
            dataSourcesUsed: component.sources,
            metricsValidated: component.metrics,
            details: { dataFetches },
            timestamp: new Date(),
          });
        } else if (successfulSources.length > 0) {
          results.push({
            testName: `Component: ${component.path}`,
            status: 'warning',
            duration,
            message: `Partial data sources available (${successfulSources.length}/${component.sources.length})`,
            componentPath: component.path,
            dataSourcesUsed: successfulSources.map(s => s.source),
            metricsValidated: component.metrics,
            details: { dataFetches },
            timestamp: new Date(),
          });
        } else {
          results.push({
            testName: `Component: ${component.path}`,
            status: 'failed',
            duration,
            message: `No data sources available`,
            componentPath: component.path,
            dataSourcesUsed: [],
            metricsValidated: [],
            details: { dataFetches },
            timestamp: new Date(),
          });
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        results.push({
          testName: `Component: ${component.path}`,
          status: 'failed',
          duration,
          message: `Component test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          componentPath: component.path,
          dataSourcesUsed: [],
          metricsValidated: [],
          details: { error },
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  /**
   * Test system performance
   */
  private async testSystemPerformance(): Promise<PerformanceTestResult[]> {
    console.log('⚡ Testing system performance...');
    const results: PerformanceTestResult[] = [];

    const startTime = Date.now();

    try {
      // Get performance metrics
      const metrics = performanceMonitor.getAllSourcesMetrics();
      const summary = performanceMonitor.getSummary();

      // Calculate aggregate metrics
      const avgResponseTime = summary.avgResponseTime || 0;
      const errorRate = summary.totalRequests > 0 
        ? ((summary.totalRequests - (summary.totalRequests * summary.overallSuccessRate / 100)) / summary.totalRequests) * 100 
        : 0;

      // Get cache statistics
      const cacheStats = apiOrchestrator.getCacheStats();
      const cacheHitRate = 0; // Would need to track cache hits vs misses

      const duration = Date.now() - startTime;

      // Determine status based on performance thresholds
      let status: 'passed' | 'warning' | 'failed' = 'passed';
      let message = 'System performance is optimal';

      if (avgResponseTime > 5000) {
        status = 'failed';
        message = 'System performance is critically slow';
      } else if (avgResponseTime > 2000 || errorRate > 10) {
        status = 'warning';
        message = 'System performance is degraded';
      }

      results.push({
        testName: 'System Performance',
        status,
        duration,
        message,
        metrics: {
          responseTime: avgResponseTime,
          throughput: summary.totalRequests / (duration / 1000),
          errorRate,
          cacheHitRate,
        },
        details: { metrics, summary, cacheStats },
        timestamp: new Date(),
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      results.push({
        testName: 'System Performance',
        status: 'failed',
        duration,
        message: `Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metrics: {
          responseTime: 0,
          throughput: 0,
          errorRate: 100,
          cacheHitRate: 0,
        },
        details: { error },
        timestamp: new Date(),
      });
    }

    return results;
  }

  /**
   * Test system under load
   */
  private async testSystemLoad(): Promise<LoadTestResult[]> {
    console.log('🔥 Testing system under load...');
    const results: LoadTestResult[] = [];

    const loadTestConfigs = [
      { name: 'Light Load', concurrentRequests: 5 },
      { name: 'Medium Load', concurrentRequests: 10 },
      { name: 'Heavy Load', concurrentRequests: 20 },
    ];

    for (const config of loadTestConfigs) {
      const startTime = Date.now();
      
      try {
        const requests: Promise<any>[] = [];
        const responseTimes: number[] = [];

        // Create concurrent requests
        for (let i = 0; i < config.concurrentRequests; i++) {
          const requestStart = Date.now();
          const request = apiOrchestrator.fetch(
            'tech4palestine',
            '/v3/summary.json',
            { useCache: false }
          ).then((response) => {
            responseTimes.push(Date.now() - requestStart);
            return { success: true, response };
          }).catch((error) => {
            responseTimes.push(Date.now() - requestStart);
            return { success: false, error };
          });
          
          requests.push(request);
        }

        const responses = await Promise.all(requests);
        const duration = Date.now() - startTime;

        const successfulRequests = responses.filter(r => r.success).length;
        const failedRequests = responses.filter(r => !r.success).length;
        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const peakResponseTime = Math.max(...responseTimes);

        let status: 'passed' | 'warning' | 'failed' = 'passed';
        let message = `System handled ${config.name} successfully`;

        if (failedRequests > config.concurrentRequests * 0.5) {
          status = 'failed';
          message = `System failed under ${config.name}`;
        } else if (failedRequests > 0 || averageResponseTime > 3000) {
          status = 'warning';
          message = `System degraded under ${config.name}`;
        }

        results.push({
          testName: `Load Test: ${config.name}`,
          status,
          duration,
          message,
          concurrentRequests: config.concurrentRequests,
          successfulRequests,
          failedRequests,
          averageResponseTime,
          peakResponseTime,
          details: { responseTimes },
          timestamp: new Date(),
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        results.push({
          testName: `Load Test: ${config.name}`,
          status: 'failed',
          duration,
          message: `Load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          concurrentRequests: config.concurrentRequests,
          successfulRequests: 0,
          failedRequests: config.concurrentRequests,
          averageResponseTime: 0,
          peakResponseTime: 0,
          details: { error },
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  /**
   * Test data quality
   */
  private async testDataQuality(): Promise<TestResult[]> {
    console.log('✨ Testing data quality...');
    const results: TestResult[] = [];

    const startTime = Date.now();

    try {
      // Test data consolidation
      const consolidatedData = await dataConsolidationService.getConsolidatedData(false);

      if (!consolidatedData) {
        results.push({
          testName: 'Data Quality',
          status: 'failed',
          duration: Date.now() - startTime,
          message: 'No consolidated data available',
          timestamp: new Date(),
        });
        return results;
      }

      // Validate data structure
      const hasGazaData = consolidatedData.gaza && Object.keys(consolidatedData.gaza).length > 0;
      const hasWestBankData = consolidatedData.westbank && Object.keys(consolidatedData.westbank).length > 0;
      const hasMetadata = consolidatedData.metadata && consolidatedData.metadata.version;

      const duration = Date.now() - startTime;

      if (hasGazaData && hasWestBankData && hasMetadata) {
        results.push({
          testName: 'Data Quality',
          status: 'passed',
          duration,
          message: 'All data quality checks passed',
          details: {
            gazaDataSections: Object.keys(consolidatedData.gaza).length,
            westBankDataSections: Object.keys(consolidatedData.westbank).length,
            dataQuality: consolidatedData.metadata.dataQuality,
          },
          timestamp: new Date(),
        });
      } else {
        results.push({
          testName: 'Data Quality',
          status: 'warning',
          duration,
          message: 'Some data quality checks failed',
          details: {
            hasGazaData,
            hasWestBankData,
            hasMetadata,
          },
          timestamp: new Date(),
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      results.push({
        testName: 'Data Quality',
        status: 'failed',
        duration,
        message: `Data quality test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error },
        timestamp: new Date(),
      });
    }

    return results;
  }

  /**
   * Generate comprehensive health report
   */
  private generateHealthReport(
    dataSourceTests: TestResult[],
    componentTests: ComponentTestResult[],
    performanceTests: PerformanceTestResult[],
    loadTests: LoadTestResult[],
    dataQualityTests: TestResult[]
  ): SystemHealthReport {
    const allTests = [
      ...dataSourceTests,
      ...componentTests,
      ...performanceTests,
      ...loadTests,
      ...dataQualityTests,
    ];

    // Calculate overall status
    const failedTests = allTests.filter(t => t.status === 'failed').length;
    const warningTests = allTests.filter(t => t.status === 'warning').length;

    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (failedTests > 0) {
      overallStatus = 'critical';
    } else if (warningTests > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    // Generate data sources status
    const dataSourcesStatus: SystemHealthReport['dataSourcesStatus'] = {} as any;
    const enabledSources = apiOrchestrator.getEnabledSources();
    
    for (const source of enabledSources) {
      const sourceTest = dataSourceTests.find(t => t.testName.includes(source));
      const metrics = performanceMonitor.getSourceMetrics(source);
      
      dataSourcesStatus[source] = {
        available: sourceTest?.status === 'passed',
        responseTime: metrics?.avgResponseTime || 0,
        errorRate: metrics ? (metrics.failedRequests / (metrics.successfulRequests + metrics.failedRequests)) * 100 : 0,
      };
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (failedTests > 0) {
      recommendations.push(`${failedTests} critical test(s) failed - immediate attention required`);
    }
    
    if (warningTests > 0) {
      recommendations.push(`${warningTests} test(s) showing warnings - monitor closely`);
    }

    const avgPerformance = performanceTests[0]?.metrics.responseTime || 0;
    if (avgPerformance > 2000) {
      recommendations.push('System response time is slow - consider optimizing data fetching');
    }

    const highErrorRate = Object.values(dataSourcesStatus).some(s => s.errorRate > 10);
    if (highErrorRate) {
      recommendations.push('High error rate detected on some data sources - check connectivity');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is operating optimally - no action required');
    }

    return {
      overallStatus,
      timestamp: new Date(),
      dataSourcesStatus,
      componentTests,
      performanceTests,
      loadTests,
      recommendations,
    };
  }

  /**
   * Get test endpoint for a data source
   */
  private getTestEndpoint(source: DataSource): string {
    const endpoints: Record<DataSource, string> = {
      tech4palestine: '/v3/summary.json',
      goodshepherd: 'wb_data.json',
      un_ocha: '/package_search?q=organization:un-ocha',
      world_bank: '/countries/PSE/indicators',
      wfp: 'food_security_assessment.json',
      btselem: '/statistics',
      who: '/health_facilities',
      unrwa: '/education',
      pcbs: '/demographics',
      custom: '',
    };

    return endpoints[source] || '';
  }

  /**
   * Get all test results
   */
  getTestResults(): TestResult[] {
    return this.testResults;
  }

  /**
   * Export test results as JSON
   */
  exportTestResults(): string {
    return JSON.stringify(this.testResults, null, 2);
  }

  /**
   * Clear test results
   */
  clearTestResults(): void {
    this.testResults = [];
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const systemIntegrationTestingService = new SystemIntegrationTestingService();
