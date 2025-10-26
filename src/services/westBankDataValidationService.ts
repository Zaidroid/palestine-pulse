/**
 * West Bank Data Validation Service
 * 
 * Validates that West Bank dashboard components use only real data
 * and monitors data quality for West Bank metrics.
 */

import { JerusalemWestBankData, PoliticalPrisonersData, ChildPrisonersData, HomeDemolitionsData } from './goodShepherdService';
import { WorldBankIndicatorValue } from './worldBankService';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataQuality: 'high' | 'medium' | 'low';
}

export interface WestBankDataQuality {
  violence: ValidationResult;
  demolitions: ValidationResult;
  prisoners: ValidationResult;
  economic: ValidationResult;
  settlements: ValidationResult;
  overall: 'high' | 'medium' | 'low';
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate West Bank violence data
 */
export function validateViolenceData(
  westBankData: JerusalemWestBankData[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!westBankData || westBankData.length === 0) {
    errors.push('No violence data available');
    return {
      isValid: false,
      errors,
      warnings,
      dataQuality: 'low',
    };
  }

  // Check data structure
  westBankData.forEach((item, index) => {
    if (!item.date) {
      errors.push(`Violence data item ${index} missing date`);
    }
    if (!item.location) {
      warnings.push(`Violence data item ${index} missing location`);
    }
    if (!item.incident_type) {
      warnings.push(`Violence data item ${index} missing incident type`);
    }
  });

  // Check data freshness (should have data from last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentData = westBankData.filter(item => new Date(item.date) >= thirtyDaysAgo);

  if (recentData.length === 0) {
    warnings.push('No violence data from last 30 days');
  }

  const dataQuality = errors.length > 0 ? 'low' : warnings.length > 5 ? 'medium' : 'high';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataQuality,
  };
}

/**
 * Validate West Bank demolition data
 */
export function validateDemolitionData(
  demolitionData: HomeDemolitionsData[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!demolitionData || demolitionData.length === 0) {
    errors.push('No demolition data available');
    return {
      isValid: false,
      errors,
      warnings,
      dataQuality: 'low',
    };
  }

  // Check data structure
  demolitionData.forEach((item, index) => {
    if (!item.date) {
      errors.push(`Demolition data item ${index} missing date`);
    }
    if (!item.location) {
      warnings.push(`Demolition data item ${index} missing location`);
    }
    if (item.homes_demolished === undefined || item.homes_demolished === null) {
      errors.push(`Demolition data item ${index} missing homes_demolished`);
    }
  });

  const dataQuality = errors.length > 0 ? 'low' : warnings.length > 5 ? 'medium' : 'high';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataQuality,
  };
}

/**
 * Validate West Bank prisoner data
 */
export function validatePrisonerData(
  politicalPrisoners: PoliticalPrisonersData[],
  childPrisoners: ChildPrisonersData[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if ((!politicalPrisoners || politicalPrisoners.length === 0) && 
      (!childPrisoners || childPrisoners.length === 0)) {
    errors.push('No prisoner data available');
    return {
      isValid: false,
      errors,
      warnings,
      dataQuality: 'low',
    };
  }

  // Check political prisoners data structure
  politicalPrisoners?.forEach((item, index) => {
    if (!item.name) {
      warnings.push(`Political prisoner ${index} missing name`);
    }
    if (!item.date_of_arrest) {
      errors.push(`Political prisoner ${index} missing date_of_arrest`);
    }
    if (!item.location) {
      warnings.push(`Political prisoner ${index} missing location`);
    }
  });

  // Check child prisoners data structure
  childPrisoners?.forEach((item, index) => {
    if (!item.name) {
      warnings.push(`Child prisoner ${index} missing name`);
    }
    if (!item.age) {
      warnings.push(`Child prisoner ${index} missing age`);
    }
    if (!item.date_of_arrest) {
      errors.push(`Child prisoner ${index} missing date_of_arrest`);
    }
  });

  const dataQuality = errors.length > 0 ? 'low' : warnings.length > 10 ? 'medium' : 'high';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataQuality,
  };
}

/**
 * Validate West Bank economic data
 */
export function validateEconomicData(
  gdpData: WorldBankIndicatorValue[],
  unemploymentData: WorldBankIndicatorValue[],
  povertyData: WorldBankIndicatorValue[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!gdpData || gdpData.length === 0) {
    errors.push('No GDP data available');
  }
  if (!unemploymentData || unemploymentData.length === 0) {
    errors.push('No unemployment data available');
  }
  if (!povertyData || povertyData.length === 0) {
    warnings.push('No poverty data available');
  }

  // Check data structure
  [gdpData, unemploymentData, povertyData].forEach((dataset, datasetIndex) => {
    const datasetName = ['GDP', 'Unemployment', 'Poverty'][datasetIndex];
    dataset?.forEach((item, index) => {
      if (!item.date) {
        errors.push(`${datasetName} data item ${index} missing date`);
      }
      if (item.value === null || item.value === undefined) {
        warnings.push(`${datasetName} data item ${index} has null value`);
      }
    });
  });

  // Check data freshness (should have data from last 3 years)
  const threeYearsAgo = new Date().getFullYear() - 3;
  const recentGDP = gdpData?.filter(item => parseInt(item.date) >= threeYearsAgo);

  if (!recentGDP || recentGDP.length === 0) {
    warnings.push('No GDP data from last 3 years');
  }

  const dataQuality = errors.length > 0 ? 'low' : warnings.length > 3 ? 'medium' : 'high';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataQuality,
  };
}

/**
 * Validate West Bank settlement data
 */
export function validateSettlementData(
  westBankData: JerusalemWestBankData[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!westBankData || westBankData.length === 0) {
    errors.push('No settlement data available');
    return {
      isValid: false,
      errors,
      warnings,
      dataQuality: 'low',
    };
  }

  // Filter for settlement-related incidents
  const settlementIncidents = westBankData.filter(
    item => item.incident_type?.toLowerCase().includes('settlement') ||
            item.description?.toLowerCase().includes('settlement')
  );

  if (settlementIncidents.length === 0) {
    warnings.push('No settlement-specific incidents found in data');
  }

  const dataQuality = errors.length > 0 ? 'low' : warnings.length > 2 ? 'medium' : 'high';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dataQuality,
  };
}

/**
 * Validate all West Bank data
 */
export function validateAllWestBankData(data: {
  violence: JerusalemWestBankData[];
  demolitions: HomeDemolitionsData[];
  politicalPrisoners: PoliticalPrisonersData[];
  childPrisoners: ChildPrisonersData[];
  gdp: WorldBankIndicatorValue[];
  unemployment: WorldBankIndicatorValue[];
  poverty: WorldBankIndicatorValue[];
  settlements: JerusalemWestBankData[];
}): WestBankDataQuality {
  const violence = validateViolenceData(data.violence);
  const demolitions = validateDemolitionData(data.demolitions);
  const prisoners = validatePrisonerData(data.politicalPrisoners, data.childPrisoners);
  const economic = validateEconomicData(data.gdp, data.unemployment, data.poverty);
  const settlements = validateSettlementData(data.settlements);

  // Calculate overall quality
  const qualities = [
    violence.dataQuality,
    demolitions.dataQuality,
    prisoners.dataQuality,
    economic.dataQuality,
    settlements.dataQuality,
  ];

  const highCount = qualities.filter(q => q === 'high').length;
  const lowCount = qualities.filter(q => q === 'low').length;

  let overall: 'high' | 'medium' | 'low';
  if (lowCount > 2) {
    overall = 'low';
  } else if (highCount >= 4) {
    overall = 'high';
  } else {
    overall = 'medium';
  }

  return {
    violence,
    demolitions,
    prisoners,
    economic,
    settlements,
    overall,
  };
}

/**
 * Check if component is using real data (not hardcoded values)
 */
export function isUsingRealData(componentData: any): boolean {
  // Check if data has metadata indicating it's from a real source
  if (componentData?.metadata?.source) {
    return true;
  }

  // Check if data has expected structure from real sources
  if (Array.isArray(componentData) && componentData.length > 0) {
    const firstItem = componentData[0];
    // Real data should have date fields
    if (firstItem.date || firstItem.date_of_arrest) {
      return true;
    }
  }

  return false;
}

/**
 * Monitor data quality over time
 */
export class WestBankDataQualityMonitor {
  private qualityHistory: Array<{ timestamp: Date; quality: WestBankDataQuality }> = [];

  recordQuality(quality: WestBankDataQuality): void {
    this.qualityHistory.push({
      timestamp: new Date(),
      quality,
    });

    // Keep only last 100 records
    if (this.qualityHistory.length > 100) {
      this.qualityHistory.shift();
    }
  }

  getQualityTrend(): 'improving' | 'stable' | 'declining' {
    if (this.qualityHistory.length < 2) {
      return 'stable';
    }

    const recent = this.qualityHistory.slice(-10);
    const highCount = recent.filter(r => r.quality.overall === 'high').length;
    const lowCount = recent.filter(r => r.quality.overall === 'low').length;

    const older = this.qualityHistory.slice(-20, -10);
    const olderHighCount = older.filter(r => r.quality.overall === 'high').length;
    const olderLowCount = older.filter(r => r.quality.overall === 'low').length;

    if (highCount > olderHighCount && lowCount < olderLowCount) {
      return 'improving';
    } else if (highCount < olderHighCount && lowCount > olderLowCount) {
      return 'declining';
    }

    return 'stable';
  }

  getLatestQuality(): WestBankDataQuality | null {
    if (this.qualityHistory.length === 0) {
      return null;
    }
    return this.qualityHistory[this.qualityHistory.length - 1].quality;
  }
}

// Export singleton instance
export const westBankDataQualityMonitor = new WestBankDataQualityMonitor();
