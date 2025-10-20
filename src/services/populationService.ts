/**
 * Population Service
 * 
 * Fetches Palestinian population statistics from HDX (PCBS data)
 * Data: Palestinian Central Bureau of Statistics baseline population
 */

import Papa from 'papaparse';

export interface PopulationData {
  region: string;
  governorate?: string;
  total: number;
  male: number;
  female: number;
  children: number; // under 18
  adults: number;
  elderly: number; // 65+
  refugees?: number;
}

export interface PopulationSummary {
  total: number;
  male: number;
  female: number;
  children: number;
  adults: number;
  elderly: number;
  byRegion: Record<string, number>;
  byGovernorate: Record<string, number>;
  refugeePopulation: number;
  populationData: PopulationData[];
  ageSexDistribution: { ageGroup: string; male: number; female: number; }[];
  lastUpdated: string;
}

// Use CORS proxy to access HDX files
const CORS_PROXY = 'https://corsproxy.io/?';
const POPULATION_CSV_URL =
  'https://data.humdata.org/dataset/36271e9b-9ec2-4c1c-bfff-82848eba0b2f/resource/f7e802cb-9701-4624-a348-13e52103e27f/download/pse_admpop_adm1_2023.csv';

/**
 * Fetch and parse population data from HDX
 */
export const fetchPopulation = async (): Promise<PopulationSummary> => {
  try {
    // Use CORS proxy
    const proxiedUrl = CORS_PROXY + encodeURIComponent(POPULATION_CSV_URL);
    console.log('Fetching population data via CORS proxy...');
    
    const response = await fetch(proxiedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch population data: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('Population CSV fetched, length:', csvText.length);
    
    // Parse CSV
    const parseResult = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });
    
    if (parseResult.errors.length > 0) {
      console.warn('Population CSV parsing warnings:', parseResult.errors);
    }
    
    console.log('Parsed population data:', parseResult.data.length, 'rows');
    
    if (parseResult.data.length > 0) {
      console.log('Sample population row:', parseResult.data[0]);
      console.log('Available keys:', Object.keys(parseResult.data[0]));
    }
    
    // Transform to PopulationData objects
    const gazaGovernorates = ['North Gaza', 'Gaza', 'Deir al-Balah', 'Khan Yunis', 'Rafah'];

    const populationData: PopulationData[] = parseResult.data.map((row: any) => {
      const governorate = (row.adm1_en || row.governorate || '').trim();
      const region = gazaGovernorates.includes(governorate) ? 'Gaza Strip' : 'West Bank';

      const total = parseInt(row.t_tl || row.total || '0');
      const male = parseInt(row.m_tl || row.male || '0');
      const female = parseInt(row.f_tl || row.female || '0');
      
      const children = [
        't_00_04', 't_05_09', 't_10_14', 't_15_19'
      ].reduce((sum, key) => sum + parseInt(row[key] || '0'), 0);
      
      const elderly = [
        't_65_69', 't_70_74', 't_75_79', 't_80plus'
      ].reduce((sum, key) => sum + parseInt(row[key] || '0'), 0);
      
      const adults = total - children - elderly;
      
      return {
        region,
        governorate,
        total,
        male,
        female,
        children,
        adults: Math.max(0, adults),
        elderly,
        refugees: parseInt(row.refugees || '0') || undefined,
      };
    });
    
    // Calculate summary statistics
    const byRegion: Record<string, number> = {};
    const byGovernorate: Record<string, number> = {};
    let totalPop = 0;
    let totalMale = 0;
    let totalFemale = 0;
    let totalChildren = 0;
    let totalAdults = 0;
    let totalElderly = 0;
    let refugeePopulation = 0;
    
    populationData.forEach(pop => {
      totalPop += pop.total;
      totalMale += pop.male;
      totalFemale += pop.female;
      totalChildren += pop.children;
      totalAdults += pop.adults;
      totalElderly += pop.elderly;
      
      if (pop.refugees) {
        refugeePopulation += pop.refugees;
      }
      
      // Count by region
      byRegion[pop.region] = (byRegion[pop.region] || 0) + pop.total;
      
      // Count by governorate
      if (pop.governorate) {
        byGovernorate[pop.governorate] = (byGovernorate[pop.governorate] || 0) + pop.total;
      }
    });
    
    const ageGroups = [
      '00_04', '05_09', '10_14', '15_19', '20_24', '25_29', '30_34',
      '35_39', '40_44', '45_49', '50_54', '55_59', '60_64', '65_69',
      '70_74', '75_79', '80plus'
    ];

    const ageSexDistribution = ageGroups.map(age => {
      const male = parseResult.data.reduce((sum, row) => sum + parseInt(row[`m_${age}`] || '0'), 0);
      const female = parseResult.data.reduce((sum, row) => sum + parseInt(row[`f_${age}`] || '0'), 0);
      return {
        ageGroup: age.replace('_', '-').replace('plus', '+'),
        male: -male,
        female: female
      };
    });

    const summary = {
      total: totalPop,
      male: totalMale,
      female: totalFemale,
      children: totalChildren,
      adults: totalAdults,
      elderly: totalElderly,
      byRegion,
      byGovernorate,
      refugeePopulation,
      populationData,
      ageSexDistribution,
      lastUpdated: new Date().toISOString(),
    };
    
    console.log('Population summary:', {
      total: summary.total,
      regions: Object.keys(byRegion).length,
      refugees: summary.refugeePopulation
    });
    
    return summary;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw error;
  }
};

/**
 * Get population by region
 */
export const getPopulationByRegion = (
  populationData: PopulationData[],
  region: string
): PopulationData[] => {
  return populationData.filter(p => 
    p.region.toLowerCase().includes(region.toLowerCase())
  );
};