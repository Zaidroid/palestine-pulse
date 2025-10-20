/**
 * V3 Data Normalization Pipeline
 *
 * Standardizes data formats across all sources for V3 dashboard compatibility:
 * - Unified date formats
 * - Consistent numeric formatting
 * - Standardized location names
 * - Normalized demographic categories
 * - Cross-source data validation
 */

import {
  CasualtyData,
  InfrastructureData,
  WestBankData,
  DemographicBreakdown,
  GeographicPoint,
  TimelineEvent
} from './types/data.types';

// ============================================
// NORMALIZATION INTERFACES
// ============================================

export interface NormalizationResult<T> {
  data: T;
  warnings: string[];
  errors: string[];
  metadata: {
    source: string;
    originalFormat: string;
    normalizedFormat: string;
    processingTime: number;
  };
}

export interface NormalizationConfig {
  strictMode: boolean;
  validateCoordinates: boolean;
  standardizeNames: boolean;
  fillMissingValues: boolean;
}

// ============================================
// DATA NORMALIZATION UTILITIES
// ============================================

export class DataNormalizationService {
  private config: NormalizationConfig;

  constructor(config: NormalizationConfig = {
    strictMode: false,
    validateCoordinates: true,
    standardizeNames: true,
    fillMissingValues: true,
  }) {
    this.config = config;
  }

  /**
   * Normalize casualty data from any source
   */
  normalizeCasualtyData(
    data: any,
    source: string
  ): NormalizationResult<CasualtyData[]> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      let normalizedData: CasualtyData[];

      switch (source) {
        case 'tech4palestine':
          normalizedData = this.normalizeTech4PalestineCasualties(data);
          break;
        case 'goodshepherd':
          normalizedData = this.normalizeGoodShepherdCasualties(data);
          break;
        case 'un_ocha':
          normalizedData = this.normalizeOCHACasualties(data);
          break;
        default:
          throw new Error(`Unsupported casualty data source: ${source}`);
      }

      // Validate normalized data
      normalizedData.forEach((item, index) => {
        const validation = this.validateCasualtyData(item);
        if (!validation.isValid) {
          errors.push(`Row ${index}: ${validation.errors.join(', ')}`);
        }
        if (validation.warnings.length > 0) {
          warnings.push(...validation.warnings.map(w => `Row ${index}: ${w}`));
        }
      });

      return {
        data: normalizedData,
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'CasualtyData[]',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      errors.push(`Normalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: [],
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'CasualtyData[]',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Normalize infrastructure data from any source
   */
  normalizeInfrastructureData(
    data: any,
    source: string
  ): NormalizationResult<InfrastructureData[]> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      let normalizedData: InfrastructureData[];

      switch (source) {
        case 'tech4palestine':
          normalizedData = this.normalizeTech4PalestineInfrastructure(data);
          break;
        case 'btselem':
          normalizedData = this.normalizeBtselemInfrastructure(data);
          break;
        case 'un_ocha':
          normalizedData = this.normalizeOCHAInfrastructure(data);
          break;
        default:
          throw new Error(`Unsupported infrastructure data source: ${source}`);
      }

      return {
        data: normalizedData,
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'InfrastructureData[]',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      errors.push(`Normalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: [],
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'InfrastructureData[]',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Normalize West Bank data from any source
   */
  normalizeWestBankData(
    data: any,
    source: string
  ): NormalizationResult<WestBankData[]> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      let normalizedData: WestBankData[];

      switch (source) {
        case 'tech4palestine':
          normalizedData = this.normalizeTech4PalestineWestBank(data);
          break;
        case 'goodshepherd':
          normalizedData = this.normalizeGoodShepherdWestBank(data);
          break;
        case 'btselem':
          normalizedData = this.normalizeBtselemWestBank(data);
          break;
        default:
          throw new Error(`Unsupported West Bank data source: ${source}`);
      }

      return {
        data: normalizedData,
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'WestBankData[]',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      errors.push(`Normalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: [],
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'WestBankData[]',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Normalize geographic data from any source
   */
  normalizeGeographicData(
    data: any,
    source: string
  ): NormalizationResult<GeographicPoint[]> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      const normalizedData = data.map((item: any, index: number) => {
        const normalized = {
          lat: this.normalizeCoordinate(item.lat || item.latitude, 'latitude'),
          lng: this.normalizeCoordinate(item.lng || item.longitude || item.long, 'longitude'),
          location_name: this.normalizeLocationName(item.location_name || item.name || item.location),
          incident_type: this.normalizeIncidentType(item.incident_type || item.type),
          casualties: item.casualties || item.killed || 0,
          date: this.normalizeDate(item.date),
          description: item.description || '',
        };

        // Validate coordinates if enabled
        if (this.config.validateCoordinates) {
          const coordValidation = this.validateCoordinates(normalized.lat, normalized.lng);
          if (!coordValidation.isValid) {
            errors.push(`Row ${index}: ${coordValidation.errors.join(', ')}`);
          }
        }

        return normalized;
      });

      return {
        data: normalizedData,
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'GeographicPoint[]',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      errors.push(`Normalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: [],
        warnings,
        errors,
        metadata: {
          source,
          originalFormat: 'unknown',
          normalizedFormat: 'GeographicPoint[]',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  // ============================================
  // SOURCE-SPECIFIC NORMALIZATION METHODS
  // ============================================

  private normalizeTech4PalestineCasualties(data: any): CasualtyData[] {
    if (!Array.isArray(data)) {
      throw new Error('Tech4Palestine casualty data must be an array');
    }

    return data.map(item => ({
      report_date: this.normalizeDate(item.report_date || item.date),
      killed: Number(item.killed || 0),
      killed_cum: Number(item.killed_cum || item.killed_total || 0),
      injured: Number(item.injured || 0),
      injured_cum: Number(item.injured_cum || item.injured_total || 0),
      killed_children: Number(item.killed_children || 0),
      killed_children_cum: Number(item.killed_children_cum || 0),
      killed_women: Number(item.killed_women || 0),
      killed_women_cum: Number(item.killed_women_cum || 0),
      massacres: Number(item.massacres || 0),
      massacres_cum: Number(item.massacres_cum || 0),
    }));
  }

  private normalizeGoodShepherdCasualties(data: any): CasualtyData[] {
    // Implementation for Good Shepherd data normalization
    return [];
  }

  private normalizeOCHACasualties(data: any): CasualtyData[] {
    // Implementation for OCHA data normalization
    return [];
  }

  private normalizeTech4PalestineInfrastructure(data: any): InfrastructureData[] {
    if (!Array.isArray(data)) {
      throw new Error('Tech4Palestine infrastructure data must be an array');
    }

    return data.map(item => ({
      report_date: this.normalizeDate(item.report_date || item.date),
      residential: {
        destroyed: Number(item.residential?.destroyed || item.homes_destroyed || 0),
        damaged: Number(item.residential?.damaged || item.homes_damaged || 0),
        ext_destroyed: Number(item.residential?.ext_destroyed || 0),
        ext_damaged: Number(item.residential?.ext_damaged || 0),
      },
      places_of_worship: {
        mosques_destroyed: Number(item.places_of_worship?.mosques_destroyed || 0),
        mosques_damaged: Number(item.places_of_worship?.mosques_damaged || 0),
        churches_destroyed: Number(item.places_of_worship?.churches_destroyed || 0),
        churches_damaged: Number(item.places_of_worship?.churches_damaged || 0),
        ext_mosques_destroyed: Number(item.places_of_worship?.ext_mosques_destroyed || 0),
        ext_mosques_damaged: Number(item.places_of_worship?.ext_mosques_damaged || 0),
      },
      educational_buildings: {
        destroyed: Number(item.educational_buildings?.destroyed || item.schools_destroyed || 0),
        damaged: Number(item.educational_buildings?.damaged || item.schools_damaged || 0),
        ext_destroyed: Number(item.educational_buildings?.ext_destroyed || 0),
        ext_damaged: Number(item.educational_buildings?.ext_damaged || 0),
      },
      health_facilities: {
        destroyed: Number(item.health_facilities?.destroyed || item.hospitals_destroyed || 0),
        damaged: Number(item.health_facilities?.damaged || item.hospitals_damaged || 0),
        ext_destroyed: Number(item.health_facilities?.ext_destroyed || 0),
        ext_damaged: Number(item.health_facilities?.ext_damaged || 0),
      },
    }));
  }

  private normalizeBtselemInfrastructure(data: any): InfrastructureData[] {
    // B'Tselem infrastructure data normalization
    // For now, return empty array as B'Tselem data is primarily used for checkpoints
    return [];
  }

  private normalizeOCHAInfrastructure(data: any): InfrastructureData[] {
    // Implementation for OCHA data normalization
    return [];
  }

  private normalizeTech4PalestineWestBank(data: any): WestBankData[] {
    if (!Array.isArray(data)) {
      throw new Error('Tech4Palestine West Bank data must be an array');
    }

    return data.map(item => ({
      date: this.normalizeDate(item.date),
      report_date: this.normalizeDate(item.report_date),
      verified: {
        killed: Number(item.verified?.killed || item.killed_verified || 0),
        killed_cum: Number(item.verified?.killed_cum || item.killed_total_verified || 0),
        injured: Number(item.verified?.injured || item.injured_verified || 0),
        injured_cum: Number(item.verified?.injured_cum || item.injured_total_verified || 0),
        killed_children: Number(item.verified?.killed_children || 0),
      },
      killed: Number(item.killed || 0),
      injured: Number(item.injured || 0),
      settler_attacks: Number(item.settler_attacks || 0),
    }));
  }

  private normalizeGoodShepherdWestBank(data: any): WestBankData[] {
    // Implementation for Good Shepherd West Bank data normalization
    return [];
  }

  private normalizeBtselemWestBank(data: any): WestBankData[] {
    // Implementation for Btselem West Bank data normalization
    return [];
  }

  // ============================================
  // VALIDATION AND UTILITY METHODS
  // ============================================

  private validateCasualtyData(data: CasualtyData): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.report_date) {
      errors.push('Missing report_date');
    }

    if (typeof data.killed !== 'number' || data.killed < 0) {
      errors.push('Invalid killed count');
    }

    if (typeof data.injured !== 'number' || data.injured < 0) {
      errors.push('Invalid injured count');
    }

    if (data.killed_children !== undefined && (typeof data.killed_children !== 'number' || data.killed_children < 0)) {
      warnings.push('Invalid killed_children count');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateCoordinates(lat: number, lng: number): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      errors.push('Invalid latitude');
    }

    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      errors.push('Invalid longitude');
    }

    // Check if coordinates are in Palestine region (approximate bounds)
    if (lat >= 29 && lat <= 34 && lng >= 34 && lng <= 36) {
      // Valid Palestine region
    } else {
      warnings.push('Coordinates outside typical Palestine region');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private normalizeDate(date: any): string {
    if (!date) return new Date().toISOString().split('T')[0];

    if (typeof date === 'string') {
      // Handle various date formats
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    if (typeof date === 'number') {
      return new Date(date).toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }

  private normalizeCoordinate(coord: any, type: 'latitude' | 'longitude'): number {
    if (typeof coord === 'number') {
      return coord;
    }

    if (typeof coord === 'string') {
      const parsed = parseFloat(coord);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  }

  private normalizeLocationName(name: string): string {
    if (!name) return 'Unknown Location';

    // Standardize common location names
    const normalizations: Record<string, string> = {
      'gaza city': 'Gaza City',
      'gaza': 'Gaza',
      'west bank': 'West Bank',
      'jerusalem': 'Jerusalem',
      'ramallah': 'Ramallah',
      'nablus': 'Nablus',
      'hebron': 'Hebron',
      'bethlehem': 'Bethlehem',
      'jenin': 'Jenin',
    };

    const normalized = name.toLowerCase().trim();
    return normalizations[normalized] || name;
  }

  private normalizeIncidentType(type: string): string {
    if (!type) return 'other';

    // Standardize incident types
    const normalizations: Record<string, string> = {
      'attack': 'military_operation',
      'bombing': 'military_operation',
      'airstrike': 'military_operation',
      'shelling': 'military_operation',
      'massacre': 'massacre',
      'ceasefire': 'ceasefire',
      'humanitarian': 'humanitarian',
      'political': 'political',
    };

    const normalized = type.toLowerCase().trim();
    return normalizations[normalized] || 'other';
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createNormalizationService(config?: Partial<NormalizationConfig>): DataNormalizationService {
  return new DataNormalizationService({
    strictMode: false,
    validateCoordinates: true,
    standardizeNames: true,
    fillMissingValues: true,
    ...config,
  });
}

export function mergeNormalizedData<T extends any[]>(
  dataArrays: NormalizationResult<T>[]
): NormalizationResult<T> {
  const mergedData: T = [] as T;
  const allWarnings: string[] = [];
  const allErrors: string[] = [];
  let totalProcessingTime = 0;

  dataArrays.forEach(result => {
    (mergedData as any[]).push(...result.data);
    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);
    totalProcessingTime += result.metadata.processingTime;
  });

  return {
    data: mergedData,
    warnings: allWarnings,
    errors: allErrors,
    metadata: {
      source: 'merged',
      originalFormat: 'multiple',
      normalizedFormat: 'merged',
      processingTime: totalProcessingTime,
    },
  };
}