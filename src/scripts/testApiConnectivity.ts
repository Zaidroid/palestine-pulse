/**
 * API Connectivity Test Script
 * 
 * Tests all configured API endpoints to verify proxy setup.
 * 
 * IMPORTANT: This script tests the APIs directly (not through the Vite proxy).
 * To test the proxy, use the browser-based test in the dev tools console.
 * 
 * Run with: npx tsx src/scripts/testApiConnectivity.ts
 */

import { TECH4PALESTINE_ENDPOINTS, GOODSHEPHERD_ENDPOINTS } from '../services/apiOrchestrator';

// ============================================
// TEST CONFIGURATION
// ============================================

interface TestResult {
  source: string;
  endpoint: string;
  status: 'success' | 'failed';
  responseTime: number;
  error?: string;
  dataPreview?: any;
}

// ============================================
// TEST FUNCTIONS
// ============================================

// Direct API base URLs (not using proxy)
const API_BASES = {
  tech4palestine: 'https://data.techforpalestine.org/api',
  goodshepherd: 'https://goodshepherdcollective.org/api',
  world_bank: 'https://api.worldbank.org/v2',
  un_ocha: 'https://data.humdata.org/api/action',
  btselem: 'https://www.btselem.org/api',
};

async function testEndpoint(
  source: string,
  endpoint: string,
  description: string
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log(`Testing ${source}: ${description}...`);
    
    // Construct full URL
    const baseUrl = API_BASES[source as keyof typeof API_BASES];
    if (!baseUrl) {
      throw new Error(`Unknown source: ${source}`);
    }
    
    const fullUrl = `${baseUrl}${endpoint}`;
    
    // Make direct fetch request
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Palestine-Pulse-Dashboard/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    // Get a preview of the data
    let dataPreview: any = null;
    if (data) {
      if (Array.isArray(data)) {
        dataPreview = {
          type: 'array',
          length: data.length,
          sample: data[0],
        };
      } else if (typeof data === 'object') {
        dataPreview = {
          type: 'object',
          keys: Object.keys(data).slice(0, 5),
        };
      }
    }
    
    console.log(`  ✓ Success (${responseTime}ms)`);
    
    return {
      source,
      endpoint,
      status: 'success',
      responseTime,
      dataPreview,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.log(`  ✗ Failed (${responseTime}ms): ${errorMessage}`);
    
    return {
      source,
      endpoint,
      status: 'failed',
      responseTime,
      error: errorMessage,
    };
  }
}

// ============================================
// MAIN TEST SUITE
// ============================================

async function runConnectivityTests() {
  console.log('🔌 API Connectivity Test Suite\n');
  console.log('Testing all configured API endpoints...\n');
  
  const results: TestResult[] = [];
  
  // Test Tech4Palestine endpoints
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Tech4Palestine API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.summary,
      'Summary statistics'
    )
  );
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.killedInGaza,
      'Gaza casualties'
    )
  );
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.pressKilled,
      'Press casualties'
    )
  );
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.casualtiesDaily,
      'Daily casualties'
    )
  );
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.westBankDaily,
      'West Bank daily data'
    )
  );
  
  results.push(
    await testEndpoint(
      'tech4palestine',
      TECH4PALESTINE_ENDPOINTS.infrastructure,
      'Infrastructure damage'
    )
  );
  
  // Test Good Shepherd endpoints
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🐑 Good Shepherd Collective API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(
    await testEndpoint(
      'goodshepherd',
      '/' + GOODSHEPHERD_ENDPOINTS.wbData,
      'West Bank incidents'
    )
  );
  
  results.push(
    await testEndpoint(
      'goodshepherd',
      '/' + GOODSHEPHERD_ENDPOINTS.childPrisoners,
      'Child prisoners'
    )
  );
  
  results.push(
    await testEndpoint(
      'goodshepherd',
      '/' + GOODSHEPHERD_ENDPOINTS.healthcareAttacks,
      'Healthcare attacks'
    )
  );
  
  results.push(
    await testEndpoint(
      'goodshepherd',
      '/' + GOODSHEPHERD_ENDPOINTS.homeDemolitions,
      'Home demolitions'
    )
  );
  
  results.push(
    await testEndpoint(
      'goodshepherd',
      '/' + GOODSHEPHERD_ENDPOINTS.prisonerData,
      'Prisoner statistics'
    )
  );
  
  // Test World Bank
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏦 World Bank API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(
    await testEndpoint(
      'world_bank',
      '/countries/PSE/indicators?format=json',
      'Palestine indicators'
    )
  );
  
  // Test UN OCHA (direct, no proxy)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 UN OCHA / HDX API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(
    await testEndpoint(
      'un_ocha',
      '/package_search?q=organization:un-ocha&rows=1',
      'OCHA datasets'
    )
  );
  
  // Test B'Tselem
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 B\'Tselem API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(
    await testEndpoint(
      'btselem',
      '/checkpoints',
      'Checkpoint data'
    )
  );
  
  // Print summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 Test Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  console.log(`Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  
  if (successful.length > 0) {
    console.log('\n✅ Working Endpoints:');
    successful.forEach(r => {
      console.log(`  • ${r.source}: ${r.endpoint} (${r.responseTime}ms)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    failed.forEach(r => {
      console.log(`  • ${r.source}: ${r.endpoint}`);
      console.log(`    Error: ${r.error}`);
    });
  }
  
  // Average response time for successful requests
  if (successful.length > 0) {
    const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    console.log(`\n⚡ Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  }
  
  // Recommendations
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 Recommendations');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (failed.length === 0) {
    console.log('✨ All APIs are working! You can now:');
    console.log('  1. Re-run the data audit: npx tsx src/scripts/runDataAudit.ts');
    console.log('  2. Start replacing fake data following REPLACEMENT_PLAN.md');
    console.log('  3. Begin Task 2: Gaza Dashboard Real Data Integration');
  } else if (successful.length > 0) {
    console.log('⚠️  Some APIs are working, but others need attention:');
    console.log('  1. Check the failed endpoints above');
    console.log('  2. Verify proxy configuration in vite.config.ts');
    console.log('  3. Check if APIs require authentication');
    console.log('  4. Consult docs/API_PROXY_SETUP.md for troubleshooting');
  } else {
    console.log('🔴 All APIs failed. Possible issues:');
    console.log('  1. Dev server not running (run: npm run dev)');
    console.log('  2. Proxy configuration incorrect');
    console.log('  3. Network connectivity issues');
    console.log('  4. APIs may be down or URLs changed');
    console.log('\nTroubleshooting steps:');
    console.log('  1. Ensure dev server is running');
    console.log('  2. Check vite.config.ts proxy configuration');
    console.log('  3. Review docs/API_PROXY_SETUP.md');
    console.log('  4. Test APIs directly in browser');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Exit with appropriate code
  process.exit(failed.length > 0 ? 1 : 0);
}

// ============================================
// RUN TESTS
// ============================================

runConnectivityTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
