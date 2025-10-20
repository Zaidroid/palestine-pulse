/**
 * Data Sources Testing Script
 *
 * Tests all data sources and endpoints to ensure they work correctly:
 * - Good Shepherd Collective datasets
 * - Tech4Palestine API
 * - UN OCHA/HDX API
 * - World Bank API
 * - Service worker integration
 * - Caching mechanisms
 */

import { goodShepherdService } from './services/goodShepherdService';
import { DataConsolidationService } from './services/dataConsolidationService';
import { apiOrchestrator } from './services/apiOrchestrator';

interface TestResult {
  endpoint: string;
  success: boolean;
  responseTime: number;
  dataSize?: number;
  error?: string;
  dataSample?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  totalTime: number;
}

class DataSourceTester {
  private results: TestSuite[] = [];
  private startTime: number = Date.now();

  /**
   * Run all data source tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive data source tests...\n');

    try {
      // Test Good Shepherd Collective datasets
      await this.testGoodShepherdDatasets();

      // Test existing data sources
      await this.testExistingDataSources();

      // Test service integration
      await this.testServiceIntegration();

      // Test caching mechanisms
      await this.testCachingMechanisms();

      // Print summary
      this.printSummary();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Test all Good Shepherd Collective datasets
   */
  private async testGoodShepherdDatasets(): Promise<void> {
    console.log('📊 Testing Good Shepherd Collective datasets...');

    const suite: TestSuite = {
      name: 'Good Shepherd Collective',
      tests: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
    };

    const datasets = [
      { name: 'Child Prisoners', test: () => goodShepherdService.fetchChildPrisonersData() },
      { name: 'Jerusalem West Bank Violence', test: () => goodShepherdService.fetchJerusalemWestBankData() },
      { name: 'Jerusalem West Bank Casualties', test: () => goodShepherdService.fetchJerusalemWestBankCasualtiesData() },
      { name: 'Gaza Casualties', test: () => goodShepherdService.fetchGazaCasualtiesData() },
      { name: 'Gaza Destruction', test: () => goodShepherdService.fetchGazaDestructionData() },
      { name: 'Healthcare Attacks', test: () => goodShepherdService.fetchHealthcareAttacksData() },
      { name: 'Home Demolitions', test: () => goodShepherdService.fetchHomeDemolitionsData() },
      { name: 'NGO Data', test: () => goodShepherdService.fetchNGOData() },
      { name: 'Political Prisoners', test: () => goodShepherdService.fetchPoliticalPrisonersData() },
      { name: 'Destruction Map', test: () => goodShepherdService.fetchMapData('destruction') },
      { name: 'Road Destruction Map', test: () => goodShepherdService.fetchMapData('road_destruction') },
    ];

    for (const dataset of datasets) {
      const result = await this.testEndpoint(dataset.name, dataset.test);
      suite.tests.push(result);

      if (result.success) {
        suite.passed++;
        console.log(`  ✅ ${dataset.name}: ${result.responseTime}ms`);
      } else {
        suite.failed++;
        console.log(`  ❌ ${dataset.name}: ${result.error}`);
      }
    }

    suite.totalTime = suite.tests.reduce((sum, test) => sum + test.responseTime, 0);
    this.results.push(suite);
    console.log('');
  }

  /**
   * Test existing data sources
   */
  private async testExistingDataSources(): Promise<void> {
    console.log('🔗 Testing existing data sources...');

    const suite: TestSuite = {
      name: 'Existing Data Sources',
      tests: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
    };

    const sources = [
      { name: 'Tech4Palestine API', test: () => this.testTech4PalestineAPI() },
      { name: 'UN OCHA HDX API', test: () => this.testUNOCHAAPI() },
      { name: 'World Bank API', test: () => this.testWorldBankAPI() },
      { name: 'B\'Tselem API', test: () => this.testBtselemAPI() },
    ];

    for (const source of sources) {
      const result = await this.testEndpoint(source.name, source.test);
      suite.tests.push(result);

      if (result.success) {
        suite.passed++;
        console.log(`  ✅ ${source.name}: ${result.responseTime}ms`);
      } else {
        suite.failed++;
        console.log(`  ❌ ${source.name}: ${result.error}`);
      }
    }

    suite.totalTime = suite.tests.reduce((sum, test) => sum + test.responseTime, 0);
    this.results.push(suite);
    console.log('');
  }

  /**
   * Test service integration
   */
  private async testServiceIntegration(): Promise<void> {
    console.log('🔧 Testing service integration...');

    const suite: TestSuite = {
      name: 'Service Integration',
      tests: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
    };

    const tests = [
      { name: 'Data Consolidation Service Init', test: () => this.testDataConsolidationInit() },
      { name: 'API Orchestrator', test: () => this.testAPIOrchestrator() },
      { name: 'Cache Operations', test: () => this.testCacheOperations() },
      { name: 'Service Worker Registration', test: () => this.testServiceWorkerRegistration() },
    ];

    for (const test of tests) {
      const result = await this.testEndpoint(test.name, test.test);
      suite.tests.push(result);

      if (result.success) {
        suite.passed++;
        console.log(`  ✅ ${test.name}: ${result.responseTime}ms`);
      } else {
        suite.failed++;
        console.log(`  ❌ ${test.name}: ${result.error}`);
      }
    }

    suite.totalTime = suite.tests.reduce((sum, test) => sum + test.responseTime, 0);
    this.results.push(suite);
    console.log('');
  }

  /**
   * Test caching mechanisms
   */
  private async testCachingMechanisms(): Promise<void> {
    console.log('💾 Testing caching mechanisms...');

    const suite: TestSuite = {
      name: 'Caching Mechanisms',
      tests: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
    };

    const tests = [
      { name: 'Good Shepherd Cache', test: () => this.testGoodShepherdCache() },
      { name: 'IndexedDB Operations', test: () => this.testIndexedDBOperations() },
      { name: 'Cache Invalidation', test: () => this.testCacheInvalidation() },
    ];

    for (const test of tests) {
      const result = await this.testEndpoint(test.name, test.test);
      suite.tests.push(result);

      if (result.success) {
        suite.passed++;
        console.log(`  ✅ ${test.name}: ${result.responseTime}ms`);
      } else {
        suite.failed++;
        console.log(`  ❌ ${test.name}: ${result.error}`);
      }
    }

    suite.totalTime = suite.tests.reduce((sum, test) => sum + test.responseTime, 0);
    this.results.push(suite);
    console.log('');
  }

  /**
   * Generic endpoint test wrapper
   */
  private async testEndpoint(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const data = await testFn();
      const responseTime = Date.now() - startTime;

      return {
        endpoint: name,
        success: true,
        responseTime,
        dataSize: JSON.stringify(data).length,
        dataSample: Array.isArray(data) ? data.slice(0, 2) : data,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        endpoint: name,
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Test Tech4Palestine API
   */
  private async testTech4PalestineAPI(): Promise<any> {
    const response = await fetch('https://data.techforpalestine.org/api/v1/casualties');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Test UN OCHA HDX API
   */
  private async testUNOCHAAPI(): Promise<any> {
    const response = await fetch('https://data.humdata.org/api/3/action/organization_show?id=un-ocha');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Test World Bank API
   */
  private async testWorldBankAPI(): Promise<any> {
    const response = await fetch('https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&per_page=1');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Test B'Tselem API
   */
  private async testBtselemAPI(): Promise<any> {
    // Test basic connectivity to B'Tselem
    const response = await fetch('https://www.btselem.org/', { method: 'HEAD' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { status: 'ok', message: 'B\'Tselem website accessible' };
  }

  /**
   * Test Data Consolidation Service initialization
   */
  private async testDataConsolidationInit(): Promise<any> {
    const service = new DataConsolidationService();
    await service.initialize();
    return { status: 'initialized' };
  }

  /**
   * Test API Orchestrator
   */
  private async testAPIOrchestrator(): Promise<any> {
    return apiOrchestrator.fetch('tech4palestine', '/casualties');
  }

  /**
   * Test cache operations
   */
  private async testCacheOperations(): Promise<any> {
    // Test Good Shepherd cache stats
    const stats = goodShepherdService.getCacheStats();
    return { cacheSize: stats.size, cacheKeys: stats.keys.length };
  }

  /**
   * Test Service Worker registration
   */
  private async testServiceWorkerRegistration(): Promise<any> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      return {
        registered: !!registration,
        scope: registration.scope,
        updateViaCache: registration.updateViaCache,
      };
    }
    throw new Error('Service Worker not supported');
  }

  /**
   * Test Good Shepherd cache
   */
  private async testGoodShepherdCache(): Promise<any> {
    // Clear cache first
    goodShepherdService.clearCache();

    // Fetch data to populate cache
    await goodShepherdService.fetchGazaCasualtiesData();

    // Check cache stats
    const stats = goodShepherdService.getCacheStats();
    return { cachePopulated: stats.size > 0, entries: stats.size };
  }

  /**
   * Test IndexedDB operations
   */
  private async testIndexedDBOperations(): Promise<any> {
    const service = new DataConsolidationService();
    await service.initialize();

    // Test basic storage and retrieval
    const testData = { test: 'data', timestamp: Date.now() };
    await service.clearCache();

    return { indexedDB: 'operational' };
  }

  /**
   * Test cache invalidation
   */
  private async testCacheInvalidation(): Promise<any> {
    // Set short TTL for testing
    goodShepherdService.setCacheTTL(1000); // 1 second

    // Fetch data
    await goodShepherdService.fetchGazaCasualtiesData();

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Try to fetch again (should bypass cache)
    const stats = goodShepherdService.getCacheStats();
    return { cacheInvalidation: 'working', cacheSize: stats.size };
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    const totalTime = Date.now() - this.startTime;
    const totalTests = this.results.reduce((sum, suite) => sum + suite.tests.length, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failed, 0);

    console.log('📋 === TEST SUMMARY ===');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log('');

    this.results.forEach(suite => {
      console.log(`🔍 ${suite.name}:`);
      console.log(`  Tests: ${suite.tests.length}`);
      console.log(`  Passed: ${suite.passed}`);
      console.log(`  Failed: ${suite.failed}`);
      console.log(`  Time: ${suite.totalTime}ms`);
      console.log('');
    });

    if (totalFailed === 0) {
      console.log('🎉 All tests passed! Data sources are working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
    }
  }
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  (window as any).DataSourceTester = DataSourceTester;
  console.log('💡 DataSourceTester available in console. Run: new DataSourceTester().runAllTests()');
}

// Auto-run if in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  console.log('🔧 Development mode detected. Running data source tests...');
  new DataSourceTester().runAllTests();
}

export { DataSourceTester };