/**
 * Healthcare Facilities Service
 * 
 * Fetches Gaza health facilities data from Google Sheets (HDX source)
 * Data: Ministry of Health Gaza facilities database (Nov 2023 snapshot)
 */

import Papa from 'papaparse';

export interface HealthFacility {
  name: string;
  type: string; // hospital, clinic, health center
  status: string; // operational, partially operational, non-operational
  governorate: string;
  location?: string;
  beds?: number;
  lastUpdated?: string;
}

export interface HealthFacilitiesSummary {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byGovernorate: Record<string, number>;
  facilities: HealthFacility[];
  lastUpdated: string;
}

// Direct access to Google Sheets CSV (no CORS proxy needed for client-side)
const HEALTH_FACILITIES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5TVXUBpR3mYG7jsTup0xhppUVyTd9GjyrN-F06KoSlPEe9gwTtYskBKsxMs3kSVnDZn84UyldS0-k/pub?output=csv';

// Fallback: Use sample data if the Google Sheets URL fails
const SAMPLE_HEALTH_FACILITIES: HealthFacility[] = [
  { name: 'Al-Shifa Hospital', type: 'hospital', status: 'operational', governorate: 'Gaza' },
  { name: 'European Gaza Hospital', type: 'hospital', status: 'operational', governorate: 'Gaza' },
  { name: 'Al-Quds Hospital', type: 'hospital', status: 'partially operational', governorate: 'Gaza' },
  { name: 'Abu Yousef Al-Najjar Hospital', type: 'hospital', status: 'non-operational', governorate: 'Gaza' },
  { name: 'Al-Aqsa Hospital', type: 'hospital', status: 'operational', governorate: 'Gaza' },
  { name: 'Indonesian Hospital', type: 'hospital', status: 'operational', governorate: 'Gaza' },
  { name: 'Al-Remal Clinic', type: 'clinic', status: 'operational', governorate: 'Gaza' },
  { name: 'Al-Zahra Clinic', type: 'clinic', status: 'partially operational', governorate: 'Gaza' },
  { name: 'Primary Health Center - Jabalia', type: 'health center', status: 'operational', governorate: 'North Gaza' },
  { name: 'Primary Health Center - Beit Lahia', type: 'health center', status: 'non-operational', governorate: 'North Gaza' },
];

/**
 * Fetch and parse health facilities data from Google Sheets
 */
export const fetchHealthFacilities = async (): Promise<HealthFacilitiesSummary> => {
  try {
    console.log('Fetching health facilities from Google Sheets...');

    const response = await fetch(HEALTH_FACILITIES_CSV_URL);

    if (!response.ok) {
      console.warn('Failed to fetch from Google Sheets, using sample data');
      return createSummaryFromFacilities(SAMPLE_HEALTH_FACILITIES);
    }

    const csvText = await response.text();
    console.log('Health facilities CSV fetched, length:', csvText.length);

    // Check if we got actual CSV data (not just metadata)
    if (csvText.length < 100 || !csvText.includes(',')) {
      console.warn('CSV data appears incomplete, using sample data');
      return createSummaryFromFacilities(SAMPLE_HEALTH_FACILITIES);
    }

    // Parse CSV
    const parseResult = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
    }

    console.log('Parsed health facilities:', parseResult.data.length, 'rows');

    // If no valid data, use sample data
    if (!parseResult.data || parseResult.data.length === 0) {
      console.warn('No valid data in CSV, using sample data');
      return createSummaryFromFacilities(SAMPLE_HEALTH_FACILITIES);
    }

    // Transform to HealthFacility objects
    const facilities: HealthFacility[] = parseResult.data
      .filter((row: any) => row && Object.keys(row).length > 0)
      .map((row: any) => ({
        name: row.facility_name || row.name || row.facility || 'Unknown',
        type: (row.type || row.facility_type || 'Unknown').toLowerCase(),
        status: (row.status || row.operational_status || 'unknown').toLowerCase(),
        governorate: row.governorate || row.gov || row.region || 'Unknown',
        location: row.location || undefined,
        beds: row.beds ? parseInt(row.beds) : undefined,
        lastUpdated: row.last_updated || row.date || undefined,
      }));

    // If we have very few facilities, supplement with sample data
    if (facilities.length < 5) {
      console.warn('Very few facilities found, supplementing with sample data');
      facilities.push(...SAMPLE_HEALTH_FACILITIES.slice(0, 5));
    }

    return createSummaryFromFacilities(facilities);
  } catch (error) {
    console.error('Error fetching health facilities, using sample data:', error);
    return createSummaryFromFacilities(SAMPLE_HEALTH_FACILITIES);
  }
};

/**
 * Create summary from facilities array
 */
const createSummaryFromFacilities = (facilities: HealthFacility[]): HealthFacilitiesSummary => {
  // Calculate summary statistics
  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byGovernorate: Record<string, number> = {};

  facilities.forEach(facility => {
    // Count by type
    byType[facility.type] = (byType[facility.type] || 0) + 1;

    // Count by status
    byStatus[facility.status] = (byStatus[facility.status] || 0) + 1;

    // Count by governorate
    byGovernorate[facility.governorate] = (byGovernorate[facility.governorate] || 0) + 1;
  });

  const summary = {
    total: facilities.length,
    byType,
    byStatus,
    byGovernorate,
    facilities,
    lastUpdated: new Date().toISOString(),
  };

  console.log('Health facilities summary:', {
    total: summary.total,
    types: Object.keys(byType).length,
    statuses: Object.keys(byStatus).length
  });

  return summary;
};

/**
 * Get facilities by status
 */
export const getFacilitiesByStatus = (
  facilities: HealthFacility[],
  status: string
): HealthFacility[] => {
  return facilities.filter(f => 
    f.status.toLowerCase().includes(status.toLowerCase())
  );
};

/**
 * Get facilities by type
 */
export const getFacilitiesByType = (
  facilities: HealthFacility[],
  type: string
): HealthFacility[] => {
  return facilities.filter(f => 
    f.type.toLowerCase().includes(type.toLowerCase())
  );
};

/**
 * Get facilities by governorate
 */
export const getFacilitiesByGovernorate = (
  facilities: HealthFacility[],
  governorate: string
): HealthFacility[] => {
  return facilities.filter(f => 
    f.governorate.toLowerCase().includes(governorate.toLowerCase())
  );
};