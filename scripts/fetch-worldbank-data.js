#!/usr/bin/env node

/**
 * World Bank Data Fetcher
 * 
 * Fetches economic indicators for Palestine from World Bank Open Data API
 * No API key required - public data
 * 
 * Usage: node scripts/fetch-worldbank-data.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchJSONWithRetry, createRateLimitedFetcher } from './utils/fetch-with-retry.js';
import { createLogger } from './utils/logger.js';
import { validateDataset } from './utils/data-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../public/data/worldbank');
const WB_API_BASE = 'https://api.worldbank.org/v2';
const COUNTRY_CODE = 'PSE'; // Palestine
const RATE_LIMIT_DELAY = 500; // 0.5 seconds

// Initialize logger
const logger = createLogger({ 
  context: 'WorldBank-Fetcher',
  logLevel: 'INFO',
});

// Create rate-limited fetcher
const rateLimitedFetch = createRateLimitedFetcher(RATE_LIMIT_DELAY);

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
};

const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    await logger.debug(`Wrote file: ${filePath}`);
  } catch (error) {
    await logger.error(`Failed to write file: ${filePath}`, error);
    throw error;
  }
};

// Categorize indicators for better organization
const getIndicatorCategory = (indicatorCode) => {
  // Poverty indicators
  if (indicatorCode.startsWith('SI.POV') || indicatorCode.startsWith('SI.DST')) {
    return 'poverty';
  }
  // Trade indicators
  if (indicatorCode.startsWith('TG.VAL') || indicatorCode.startsWith('BN.CAB') || 
      indicatorCode.startsWith('BX.GSR') || indicatorCode.startsWith('BM.GSR') ||
      indicatorCode.startsWith('TX.VAL') || indicatorCode.startsWith('TM.VAL')) {
    return 'trade';
  }
  // Infrastructure indicators
  if (indicatorCode.startsWith('EG.ELC') || indicatorCode.startsWith('IS.') || 
      indicatorCode.startsWith('IT.MLT') || indicatorCode.startsWith('IT.NET.BBND')) {
    return 'infrastructure';
  }
  // Social development indicators
  if (indicatorCode.startsWith('SH.STA.SUIC') || indicatorCode.startsWith('SH.PRV') ||
      indicatorCode.startsWith('SP.DYN.CDRT') || indicatorCode.startsWith('SH.H2O') ||
      indicatorCode.startsWith('SP.DYN.CBRT')) {
    return 'social';
  }
  // Economic indicators
  if (indicatorCode.startsWith('NY.') || indicatorCode.startsWith('NE.') || 
      indicatorCode.startsWith('GC.') || indicatorCode.startsWith('FP.')) {
    return 'economic';
  }
  // Population indicators
  if (indicatorCode.startsWith('SP.POP') || indicatorCode.startsWith('SP.URB') || 
      indicatorCode.startsWith('SP.DYN.TFRT') || indicatorCode.startsWith('SP.DYN.LE')) {
    return 'population';
  }
  // Labor indicators
  if (indicatorCode.startsWith('SL.')) {
    return 'labor';
  }
  // Education indicators
  if (indicatorCode.startsWith('SE.')) {
    return 'education';
  }
  // Health indicators
  if (indicatorCode.startsWith('SH.')) {
    return 'health';
  }
  // Environment indicators
  if (indicatorCode.startsWith('EN.') || indicatorCode.startsWith('AG.LND') || 
      indicatorCode.startsWith('ER.H2O')) {
    return 'environment';
  }
  // Financial indicators
  if (indicatorCode.startsWith('FB.') || indicatorCode.startsWith('FS.') || 
      indicatorCode.startsWith('FM.')) {
    return 'financial';
  }
  return 'other';
};

// Extract unit from indicator name
const getIndicatorUnit = (indicatorName) => {
  if (indicatorName.includes('(% of')) return 'percentage';
  if (indicatorName.includes('(%)')) return 'percentage';
  if (indicatorName.includes('US$')) return 'currency_usd';
  if (indicatorName.includes('per 1,000')) return 'per_1000';
  if (indicatorName.includes('per 100,000')) return 'per_100000';
  if (indicatorName.includes('per 100 people')) return 'per_100';
  if (indicatorName.includes('kWh')) return 'kwh';
  if (indicatorName.includes('metric tons')) return 'metric_tons';
  if (indicatorName.includes('births per woman')) return 'births_per_woman';
  if (indicatorName.includes('years')) return 'years';
  if (indicatorName.includes('TEU:')) return 'teu';
  return 'number';
};

// Generate category summary
const getCategorySummary = (results) => {
  const categories = {};
  Object.entries(results).forEach(([code, data]) => {
    const category = getIndicatorCategory(code);
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        indicators: [],
      };
    }
    categories[category].count++;
    categories[category].indicators.push({
      code,
      name: data.indicator_name,
    });
  });
  return categories;
};

// Fetch with retry (using new utility)
async function fetchWithRetry(url, retries = 3) {
  try {
    const data = await rateLimitedFetch(url, {}, {
      maxRetries: retries,
      initialDelay: 1000,
      backoffMultiplier: 2,
      onRetry: async (attempt, delay, reason) => {
        await logger.warn(`Retry ${attempt}/${retries} for ${url} (${reason}), waiting ${delay}ms`);
      },
    });
    
    // Parse JSON response
    const jsonData = await data.json();
    return jsonData;
  } catch (error) {
    await logger.error(`Failed to fetch ${url} after ${retries} retries`, error);
    throw error;
  }
}

// Comprehensive economic and social indicators for Palestine
const INDICATORS = {
  // Economic Indicators
  'NY.GDP.MKTP.CD': 'GDP (current US$)',
  'NY.GDP.MKTP.KD.ZG': 'GDP growth (annual %)',
  'NY.GDP.PCAP.CD': 'GDP per capita (current US$)',
  'NY.GDP.PCAP.KD.ZG': 'GDP per capita growth (annual %)',
  'NE.EXP.GNFS.ZS': 'Exports of goods and services (% of GDP)',
  'NE.IMP.GNFS.ZS': 'Imports of goods and services (% of GDP)',
  'GC.TAX.TOTL.GD.ZS': 'Tax revenue (% of GDP)',
  'FP.CPI.TOTL.ZG': 'Inflation, consumer prices (annual %)',
  'NY.GNP.PCAP.CD': 'GNI per capita, Atlas method (current US$)',
  
  // Population & Demographics
  'SP.POP.TOTL': 'Population, total',
  'SP.POP.GROW': 'Population growth (annual %)',
  'SP.URB.TOTL.IN.ZS': 'Urban population (% of total)',
  'SP.URB.GROW': 'Urban population growth (annual %)',
  'SP.POP.0014.TO.ZS': 'Population ages 0-14 (% of total)',
  'SP.POP.1564.TO.ZS': 'Population ages 15-64 (% of total)',
  'SP.POP.65UP.TO.ZS': 'Population ages 65 and above (% of total)',
  'SP.DYN.TFRT.IN': 'Fertility rate, total (births per woman)',
  'SP.DYN.LE00.IN': 'Life expectancy at birth, total (years)',
  
  // Labor & Employment
  'SL.UEM.TOTL.ZS': 'Unemployment, total (% of total labor force)',
  'SL.UEM.TOTL.FE.ZS': 'Unemployment, female (% of female labor force)',
  'SL.UEM.TOTL.MA.ZS': 'Unemployment, male (% of male labor force)',
  'SL.TLF.CACT.ZS': 'Labor force participation rate, total (% of total population ages 15+)',
  'SL.TLF.CACT.FE.ZS': 'Labor force participation rate, female (% of female population ages 15+)',
  'SL.TLF.CACT.MA.ZS': 'Labor force participation rate, male (% of male population ages 15+)',
  
  // Poverty & Inequality (EXPANDED)
  'SI.POV.GINI': 'Gini index',
  'SI.POV.DDAY': 'Poverty headcount ratio at $2.15 a day (2017 PPP) (% of population)',
  'SI.POV.NAHC': 'Poverty headcount ratio at national poverty lines (% of population)',
  'SI.POV.GAPS': 'Poverty gap at $2.15 a day (2017 PPP) (%)',
  'SI.POV.LMIC': 'Poverty headcount ratio at $3.65 a day (2017 PPP) (% of population)',
  'SI.POV.UMIC': 'Poverty headcount ratio at $6.85 a day (2017 PPP) (% of population)',
  'SI.POV.LMIC.GP': 'Poverty gap at $3.65 a day (2017 PPP) (%)',
  'SI.DST.FRST.20': 'Income share held by lowest 20%',
  'SI.DST.05TH.20': 'Income share held by highest 20%',
  
  // Education
  'SE.PRM.ENRR': 'School enrollment, primary (% gross)',
  'SE.SEC.ENRR': 'School enrollment, secondary (% gross)',
  'SE.TER.ENRR': 'School enrollment, tertiary (% gross)',
  'SE.PRM.CMPT.ZS': 'Primary completion rate, total (% of relevant age group)',
  'SE.ADT.LITR.ZS': 'Literacy rate, adult total (% of people ages 15 and above)',
  'SE.XPD.TOTL.GD.ZS': 'Government expenditure on education, total (% of GDP)',
  
  // Health
  'SH.DYN.MORT': 'Mortality rate, under-5 (per 1,000 live births)',
  'SH.DYN.NMRT': 'Mortality rate, neonatal (per 1,000 live births)',
  'SH.STA.MMRT': 'Maternal mortality ratio (per 100,000 live births)',
  'SH.MED.PHYS.ZS': 'Physicians (per 1,000 people)',
  'SH.MED.BEDS.ZS': 'Hospital beds (per 1,000 people)',
  'SH.XPD.CHEX.GD.ZS': 'Current health expenditure (% of GDP)',
  'SH.IMM.IDPT': 'Immunization, DPT (% of children ages 12-23 months)',
  
  // Infrastructure & Technology (EXPANDED)
  'IT.NET.USER.ZS': 'Individuals using the Internet (% of population)',
  'IT.CEL.SETS.P2': 'Mobile cellular subscriptions (per 100 people)',
  'EG.ELC.ACCS.ZS': 'Access to electricity (% of population)',
  'EG.USE.ELEC.KH.PC': 'Electric power consumption (kWh per capita)',
  'IS.ROD.PAVE.ZP': 'Roads, paved (% of total roads)',
  'EG.ELC.LOSS.ZS': 'Electric power transmission and distribution losses (% of output)',
  'IT.MLT.MAIN.P2': 'Fixed telephone subscriptions (per 100 people)',
  'IT.NET.BBND.P2': 'Fixed broadband subscriptions (per 100 people)',
  'IS.AIR.DPRT': 'Air transport, registered carrier departures worldwide',
  'IS.SHP.GOOD.TU': 'Container port traffic (TEU: 20 foot equivalent units)',
  
  // Environment
  'EN.ATM.CO2E.PC': 'CO2 emissions (metric tons per capita)',
  'AG.LND.FRST.ZS': 'Forest area (% of land area)',
  'ER.H2O.FWTL.ZS': 'Annual freshwater withdrawals, total (% of internal resources)',
  
  // Trade & Business (EXPANDED)
  'NE.TRD.GNFS.ZS': 'Trade (% of GDP)',
  'BX.KLT.DINV.WD.GD.ZS': 'Foreign direct investment, net inflows (% of GDP)',
  'IC.BUS.EASE.XQ': 'Ease of doing business score (0=lowest to 100=highest)',
  'TG.VAL.TOTL.GD.ZS': 'Merchandise trade (% of GDP)',
  'BN.CAB.XOKA.GD.ZS': 'Current account balance (% of GDP)',
  'BX.GSR.GNFS.CD': 'Exports of goods and services (BoP, current US$)',
  'BM.GSR.GNFS.CD': 'Imports of goods and services (BoP, current US$)',
  'TX.VAL.MRCH.CD.WT': 'Merchandise exports (current US$)',
  'TM.VAL.MRCH.CD.WT': 'Merchandise imports (current US$)',
  
  // Financial
  'FB.BNK.CAPA.ZS': 'Bank capital to assets ratio (%)',
  'FS.AST.DOMS.GD.ZS': 'Domestic credit to private sector (% of GDP)',
  'FM.LBL.BMNY.GD.ZS': 'Broad money (% of GDP)',
  
  // Social Development (EXPANDED)
  'SH.STA.SUIC.P5': 'Suicide mortality rate (per 100,000 population)',
  'SH.PRV.SMOK': 'Smoking prevalence, total (ages 15+)',
  'SP.DYN.CDRT.IN': 'Death rate, crude (per 1,000 people)',
  'SH.H2O.SMDW.ZS': 'People using safely managed drinking water services (% of population)',
  'SH.STA.SMSS.ZS': 'People using safely managed sanitation services (% of population)',
  'SH.STA.BASS.ZS': 'People using at least basic sanitation services (% of population)',
  'SP.DYN.CBRT.IN': 'Birth rate, crude (per 1,000 people)',
};

// Fetch indicator data
async function fetchIndicator(indicatorCode, indicatorName) {
  await logger.info(`📊 Fetching: ${indicatorName}...`);
  
  try {
    // Fetch data from 2010 onwards
    const url = `${WB_API_BASE}/country/${COUNTRY_CODE}/indicator/${indicatorCode}?format=json&date=2010:2024&per_page=100`;
    const response = await fetchWithRetry(url);
    
    // World Bank API returns [metadata, data]
    if (!response || response.length < 2) {
      await logger.warn(`No data available for ${indicatorCode}`);
      return null;
    }
    
    const [metadata, data] = response;
    
    if (!data || data.length === 0) {
      await logger.warn(`No data points found for ${indicatorCode}`);
      return null;
    }
    
    await logger.success(`Found ${data.length} data points for ${indicatorCode}`);
    
    // Transform data
    const transformed = data
      .filter(item => item.value !== null)
      .map(item => ({
        year: parseInt(item.date),
        value: item.value,
        indicator: indicatorCode,
        indicator_name: indicatorName,
        country: item.country.value,
        source: 'worldbank',
      }))
      .sort((a, b) => a.year - b.year);
    
    return {
      indicator: indicatorCode,
      indicator_name: indicatorName,
      data: transformed,
      metadata: {
        source: 'World Bank Open Data',
        last_updated: new Date().toISOString(),
        total_points: transformed.length,
      },
    };
  } catch (error) {
    await logger.error(`Failed to fetch ${indicatorName} (${indicatorCode})`, error);
    return null;
  }
}

// Main execution
async function main() {
  await logger.info('🚀 World Bank Data Fetcher');
  await logger.info('==========================');
  await logger.info(`Country: Palestine (${COUNTRY_CODE})`);
  await logger.info(`Data Directory: ${DATA_DIR}`);
  
  try {
    await ensureDir(DATA_DIR);
    
    const results = {};
    const allData = [];
    const errors = [];
    
    // Fetch all indicators
    for (const [code, name] of Object.entries(INDICATORS)) {
      try {
        const indicatorData = await fetchIndicator(code, name);
        if (indicatorData) {
          results[code] = indicatorData;
          allData.push(...indicatorData.data);
        } else {
          errors.push({ code, name, error: 'No data returned' });
        }
      } catch (indicatorError) {
        await logger.error(`Error processing indicator ${code}`, indicatorError);
        errors.push({ code, name, error: indicatorError.message });
        // Continue processing remaining indicators
      }
    }
    
    // Validate and save individual indicator files
    const validationResults = {};
    for (const [code, data] of Object.entries(results)) {
      try {
        // Validate indicator data
        let validationResult = null;
        try {
          validationResult = await validateDataset(data.data, 'worldbank');
          
          if (validationResult.meetsThreshold) {
            await logger.success(`Validation passed for ${code} (score: ${(validationResult.qualityScore * 100).toFixed(1)}%)`);
          } else {
            await logger.warn(`Validation quality below threshold for ${code} (score: ${(validationResult.qualityScore * 100).toFixed(1)}%)`);
          }
          
          if (validationResult.errors.length > 0) {
            await logger.warn(`Found ${validationResult.errors.length} validation errors in ${code}`);
          }
          
          validationResults[code] = {
            qualityScore: validationResult.qualityScore,
            completeness: validationResult.completeness,
            meetsThreshold: validationResult.meetsThreshold,
            errorCount: validationResult.errors.length,
            warningCount: validationResult.warnings.length,
          };
        } catch (validationError) {
          await logger.warn(`Validation failed for ${code}`, validationError);
        }
        
        // Add validation info to data
        const dataWithValidation = {
          ...data,
          validation: validationResult ? {
            qualityScore: validationResult.qualityScore,
            completeness: validationResult.completeness,
            consistency: validationResult.consistency,
            accuracy: validationResult.accuracy,
            meetsThreshold: validationResult.meetsThreshold,
            errorCount: validationResult.errors.length,
            warningCount: validationResult.warnings.length,
          } : null,
        };
        
        const fileName = `${code.toLowerCase().replace(/\./g, '_')}.json`;
        await writeJSON(path.join(DATA_DIR, fileName), dataWithValidation);
        await logger.success(`Saved ${fileName}`);
        
        // Save validation report
        if (validationResult) {
          const validationFileName = `${code.toLowerCase().replace(/\./g, '_')}_validation.json`;
          await writeJSON(path.join(DATA_DIR, validationFileName), validationResult);
        }
      } catch (saveError) {
        await logger.error(`Failed to save indicator ${code}`, saveError);
        errors.push({ code, error: `Save failed: ${saveError.message}` });
      }
    }
    
    // Save combined data with category information
    const combined = {
      metadata: {
        source: 'worldbank',
        country: 'Palestine',
        country_code: COUNTRY_CODE,
        last_updated: new Date().toISOString(),
        indicators: Object.keys(results).length,
        total_data_points: allData.length,
      },
      indicators: Object.entries(results).map(([code, data]) => ({
        code,
        name: data.indicator_name,
        category: getIndicatorCategory(code),
        data_points: data.data.length,
        unit: getIndicatorUnit(data.indicator_name),
        validation: validationResults[code] || null,
      })),
    };
    
    await writeJSON(path.join(DATA_DIR, 'metadata.json'), combined);
    await logger.success('Saved metadata.json');
    
    // Save all data in one file for easy access with enhanced metadata
    const allDataFile = {
      metadata: {
        ...combined.metadata,
        categories: getCategorySummary(results),
      },
      data: allData.sort((a, b) => a.year - b.year),
    };
    
    await writeJSON(path.join(DATA_DIR, 'all-indicators.json'), allDataFile);
    await logger.success('Saved all-indicators.json');
    
    await logger.success('✅ World Bank data fetch completed successfully!');
    await logger.info('Summary:');
    await logger.info(`  Indicators fetched: ${Object.keys(results).length}/${Object.keys(INDICATORS).length}`);
    await logger.info(`  Total data points: ${allData.length}`);
    
    if (errors.length > 0) {
      await logger.warn(`  Failed indicators: ${errors.length}`);
      await logger.warn('Failed indicators:', { errors });
    }
    
    await logger.info('Indicators:');
    Object.entries(results).forEach(([code, data]) => {
      logger.info(`  - ${data.indicator_name}: ${data.data.length} points`);
    });
    
    // Log operation summary
    await logger.logSummary();
    
  } catch (error) {
    await logger.error('Fatal error in World Bank fetch script', error);
    await logger.logSummary();
    process.exit(1);
  }
}

// Run
main();
