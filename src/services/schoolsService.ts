/**
 * Schools Service
 * 
 * Fetches Palestinian schools database from HDX
 * Data: PA Ministry of Education schools database (2,000+ schools, West Bank + Gaza)
 */

import * as XLSX from 'xlsx';

export interface School {
  name: string;
  code?: string;
  district: string;
  region: string; // West Bank or Gaza
  type: string; // primary, secondary, etc.
  sector?: string; // government, UNRWA, private
  students?: number;
  location?: string;
}

export interface SchoolsSummary {
  total: number;
  byRegion: Record<string, number>;
  byDistrict: Record<string, number>;
  byType: Record<string, number>;
  bySector: Record<string, number>;
  totalStudents: number;
  schools: School[];
  lastUpdated: string;
}

// Use CORS proxy to access HDX files
const CORS_PROXY = 'https://corsproxy.io/?';
const SCHOOLS_XLSX_URL =
  'https://data.humdata.org/dataset/f54aea1b-ad53-4cce-9051-788e164189d5/resource/fb673d75-7100-4c53-b88b-7fe651c491bb/download/schools_opt_.xlsx';

/**
 * Fetch and parse schools data from HDX
 */
export const fetchSchools = async (): Promise<SchoolsSummary> => {
  try {
    // Use CORS proxy to bypass restrictions
    const proxiedUrl = CORS_PROXY + encodeURIComponent(SCHOOLS_XLSX_URL);
    console.log('Fetching schools via CORS proxy...');
    
    const response = await fetch(proxiedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schools data: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('Schools XLSX fetched, size:', arrayBuffer.byteLength, 'bytes');
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Empty file received from HDX');
    }
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log('Workbook sheets:', workbook.SheetNames);
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<any>(worksheet, { defval: '' });
    console.log('Parsed schools data:', data.length, 'rows');
    
    if (data.length > 0) {
      console.log('Sample school row:', data[0]);
      console.log('Available keys:', Object.keys(data[0]));
    }
    
    // Transform to School objects using actual field names from data
    const schools: School[] = data.map((row: any) => {
      // Actual fields: name, Name_Arabic, national_code, type, DISTRICT, Region
      const name = row.name || row.Name_Arabic || 'Unknown';
      const code = row.national_code ? String(row.national_code) : undefined;
      const district = row.DISTRICT || 'Unknown';
      const region = row.Region || 'Unknown';
      const type = row.type || 'Unknown';
      const sector = row.type; // 'government', 'unrwa', 'private' etc.
      const students = row.students || row.enrollment || row.number_of_students || row.student_count;
      
      return {
        name: String(name).trim(),
        code: code ? String(code).trim() : undefined,
        district: String(district).trim(),
        region: String(region).trim(),
        type: String(type).trim().toLowerCase(),
        sector: sector ? String(sector).trim().toLowerCase() : undefined,
        students: students ? parseInt(String(students)) : undefined,
      };
    });
    
    // Calculate summary statistics
    const byRegion: Record<string, number> = {};
    const byDistrict: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const bySector: Record<string, number> = {};
    let totalStudents = 0;
    
    schools.forEach(school => {
      // Count by region
      byRegion[school.region] = (byRegion[school.region] || 0) + 1;
      
      // Count by district
      byDistrict[school.district] = (byDistrict[school.district] || 0) + 1;
      
      // Count by type
      byType[school.type] = (byType[school.type] || 0) + 1;
      
      // Count by sector
      if (school.sector) {
        bySector[school.sector] = (bySector[school.sector] || 0) + 1;
      }
      
      // Sum students
      if (school.students) {
        totalStudents += school.students;
      }
    });
    
    const summary = {
      total: schools.length,
      byRegion,
      byDistrict,
      byType,
      bySector,
      totalStudents,
      schools,
      lastUpdated: new Date().toISOString(),
    };
    
    console.log('Schools summary:', {
      total: summary.total,
      regions: Object.keys(byRegion),
      totalStudents: summary.totalStudents
    });
    
    return summary;
  } catch (error) {
    console.error('Error fetching schools data:', error);
    throw error;
  }
};

/**
 * Get schools by region
 */
export const getSchoolsByRegion = (
  schools: School[],
  region: string
): School[] => {
  return schools.filter(s => 
    s.region.toLowerCase().includes(region.toLowerCase())
  );
};

/**
 * Get schools by district
 */
export const getSchoolsByDistrict = (
  schools: School[],
  district: string
): School[] => {
  return schools.filter(s => 
    s.district.toLowerCase().includes(district.toLowerCase())
  );
};

/**
 * Get schools by type
 */
export const getSchoolsByType = (
  schools: School[],
  type: string
): School[] => {
  return schools.filter(s => 
    s.type.toLowerCase().includes(type.toLowerCase())
  );
};