/**
 * Simple endpoint testing utility
 * Run this in the browser console to test data endpoints
 */

// Test basic connectivity to Good Shepherd Collective
async function testGoodShepherdBase() {
  console.log('🔍 Testing Good Shepherd Collective base URL...');
  try {
    const response = await fetch('https://goodshepherdcollective.org/');
    console.log(`✅ Base URL accessible: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`❌ Base URL error:`, error);
    return false;
  }
}

// Test API endpoints
async function testGoodShepherdAPI() {
  console.log('🔍 Testing Good Shepherd Collective API endpoints...');

  const endpoints = [
    'child-prisoners',
    'jerusalem-westbank',
    'jerusalem-westbank-casualties',
    'gaza-casualties',
    'gaza-destruction',
    'healthcare-attacks',
    'home-demolitions',
    'ngo-data',
    'political-prisoners',
    'map-destruction',
    'map-road_destruction'
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`https://goodshepherdcollective.org/api/${endpoint}`);
      results[endpoint] = {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      };

      if (response.ok) {
        console.log(`✅ ${endpoint}: ${response.status}`);
      } else {
        console.log(`⚠️  ${endpoint}: ${response.status}`);
      }
    } catch (error) {
      results[endpoint] = {
        error: error.message,
        ok: false
      };
      console.error(`❌ ${endpoint}:`, error.message);
    }
  }

  return results;
}

// Test existing data sources
async function testExistingSources() {
  console.log('🔍 Testing existing data sources...');

  const sources = [
    {
      name: 'Tech4Palestine',
      url: 'https://data.techforpalestine.org/api/v1/casualties'
    },
    {
      name: 'UN OCHA HDX',
      url: 'https://data.humdata.org/api/3/action/organization_show?id=un-ocha'
    },
    {
      name: 'World Bank',
      url: 'https://api.worldbank.org/v2/country/PSE/indicator/NY.GDP.MKTP.CD?format=json&per_page=1'
    }
  ];

  const results = {};

  for (const source of sources) {
    try {
      console.log(`Testing ${source.name}...`);
      const response = await fetch(source.url);
      results[source.name] = {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      };

      if (response.ok) {
        console.log(`✅ ${source.name}: ${response.status}`);
      } else {
        console.log(`⚠️  ${source.name}: ${response.status}`);
      }
    } catch (error) {
      results[source.name] = {
        error: error.message,
        ok: false
      };
      console.error(`❌ ${source.name}:`, error.message);
    }
  }

  return results;
}

// Test fallback data functionality
async function testFallbackData() {
  console.log('🔄 Testing fallback data functionality...');

  try {
    // Import the Good Shepherd service dynamically
    const { goodShepherdService } = await import('./services/goodShepherdService');

    console.log('Testing Gaza casualties with fallback...');
    const gazaData = await goodShepherdService.fetchGazaCasualtiesData();
    console.log('✅ Gaza casualties fallback:', gazaData?.length || 0, 'records');

    console.log('Testing political prisoners with fallback...');
    const prisonersData = await goodShepherdService.fetchPoliticalPrisonersData();
    console.log('✅ Political prisoners fallback:', prisonersData?.length || 0, 'records');

    console.log('Testing child prisoners with fallback...');
    const childData = await goodShepherdService.fetchChildPrisonersData();
    console.log('✅ Child prisoners fallback:', childData?.length || 0, 'records');

    console.log('Testing home demolitions with fallback...');
    const demolitionsData = await goodShepherdService.fetchHomeDemolitionsData();
    console.log('✅ Home demolitions fallback:', demolitionsData?.length || 0, 'records');

    return {
      gazaCasualties: gazaData,
      politicalPrisoners: prisonersData,
      childPrisoners: childData,
      homeDemolitions: demolitionsData
    };
  } catch (error) {
    console.error('❌ Fallback data test failed:', error);
    return null;
  }
}

// Run all tests
async function runAllEndpointTests() {
  console.log('🚀 Running all endpoint tests...\n');

  const results = {
    baseURL: await testGoodShepherdBase(),
    apiEndpoints: await testGoodShepherdAPI(),
    existingSources: await testExistingSources(),
    fallbackData: await testFallbackData()
  };

  console.log('\n📋 === TEST RESULTS SUMMARY ===');
  console.log('Base URL:', results.baseURL ? '✅' : '❌');

  const apiSuccessCount = Object.values(results.apiEndpoints).filter((r: any) => r.ok).length;
  const apiTotalCount = Object.keys(results.apiEndpoints).length;
  console.log(`API Endpoints: ${apiSuccessCount}/${apiTotalCount} ✅`);

  const sourceSuccessCount = Object.values(results.existingSources).filter((r: any) => r.ok).length;
  const sourceTotalCount = Object.keys(results.existingSources).length;
  console.log(`Existing Sources: ${sourceSuccessCount}/${sourceTotalCount} ✅`);

  const fallbackSuccess = results.fallbackData ? '✅' : '❌';
  console.log(`Fallback Data: ${fallbackSuccess}`);

  return results;
}

// Make functions available globally for console testing
(window as any).testGoodShepherdBase = testGoodShepherdBase;
(window as any).testGoodShepherdAPI = testGoodShepherdAPI;
(window as any).testExistingSources = testExistingSources;
(window as any).runAllEndpointTests = runAllEndpointTests;

console.log('💡 Test functions available in console:');
console.log('  - testGoodShepherdBase()');
console.log('  - testGoodShepherdAPI()');
console.log('  - testExistingSources()');
console.log('  - runAllEndpointTests()');

// Auto-run tests if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode detected. Running endpoint tests...');
  setTimeout(() => {
    runAllEndpointTests();
  }, 2000); // Wait 2 seconds for everything to load
}

export { testGoodShepherdBase, testGoodShepherdAPI, testExistingSources, runAllEndpointTests };