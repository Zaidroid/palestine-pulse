/**
 * Gaza Data Validation Service
 * 
 * Validates that Gaza dashboard components are using real data from verified sources
 * and not falling back to fake/hardcoded values
 */

import { 
  validateCasualtyData,
  CasualtyRecord 
} from '@/utils/gazaCasualtyTransformations';
import { 
  validateInfrastructureData,
  InfrastructureRecord 
} from '@/utils/gazaInfrastructureTransformations';
import { 
  validateHumanitarianData 
} from '@/utils/gazaHumanitarianTransformations';

export interface DataValidationResult {
  component: string;
  isValid: boolean;
  dataSource: string;
  issues: string[];
  completeness: number;
  timestamp: string;
}

export interface GazaDataValidationReport {
  overallValid: boolean;
  totalComponents: number;
  validComponents: number;
  invalidComponents: number;
  results: DataValidationResult[];
  timestamp: string;
}

/**
 * Validate Gaza casualty data from Tech4Palestine
 */
export function validateGazaCasualtyData(
  killedData: CasualtyRecord[],
  casualtiesDaily: any[]
): DataValidationResult {
  const issues: string[] = [];
  let completeness = 0;

  // Validate killed-in-gaza data
  if (killedData && Array.isArray(killedData) && killedData.length > 0) {
    const validation = validateCasualtyData(killedData);
    completeness = validation.completeness;
    issues.push(...validation.issues);

    if (killedData.length < 1000) {
      issues.push('Killed data appears incomplete (less than 1000 records)');
    }
  } else {
    issues.push('No killed-in-gaza data available');
    completeness = 0;
  }

  // Validate casualties daily data
  if (!casualtiesDaily || !Array.isArray(casualtiesDaily) || casualtiesDaily.length === 0) {
    issues.push('No casualties daily data available');
  } else if (casualtiesDaily.length < 30) {
    issues.push('Casualties daily data appears incomplete (less than 30 days)');
  }

  return {
    component: 'HumanitarianCrisis',
    isValid: issues.length === 0,
    dataSource: 'tech4palestine',
    issues,
    completeness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate Gaza press casualty data
 */
export function validateGazaPressData(pressData: any[]): DataValidationResult {
  const issues: string[] = [];
  let completeness = 100;

  if (!pressData || !Array.isArray(pressData)) {
    issues.push('No press casualty data available');
    completeness = 0;
  } else if (pressData.length === 0) {
    issues.push('Press casualty data is empty');
    completeness = 0;
  } else {
    // Check data structure
    const hasRequiredFields = pressData.every(item => 
      item.name && (item.date || item.killed_date)
    );

    if (!hasRequiredFields) {
      issues.push('Some press records missing required fields (name, date)');
      completeness = 75;
    }

    if (pressData.length < 50) {
      issues.push('Press casualty count seems low (less than 50)');
    }
  }

  return {
    component: 'PressCasualtiesWidget',
    isValid: issues.length === 0,
    dataSource: 'tech4palestine',
    issues,
    completeness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate Gaza infrastructure data
 */
export function validateGazaInfrastructureData(
  infrastructureData: InfrastructureRecord[]
): DataValidationResult {
  const issues: string[] = [];
  let completeness = 0;

  if (!infrastructureData || !Array.isArray(infrastructureData) || infrastructureData.length === 0) {
    issues.push('No infrastructure data available');
    completeness = 0;
  } else {
    const validation = validateInfrastructureData(infrastructureData);
    completeness = validation.completeness;
    issues.push(...validation.issues);

    // Check for recent data
    const latest = infrastructureData[infrastructureData.length - 1];
    if (latest && latest.report_date) {
      const latestDate = new Date(latest.report_date);
      const daysSinceUpdate = (Date.now() - latestDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate > 7) {
        issues.push(`Infrastructure data is ${Math.floor(daysSinceUpdate)} days old`);
      }
    }
  }

  return {
    component: 'InfrastructureDestruction',
    isValid: issues.length === 0,
    dataSource: 'tech4palestine/goodshepherd',
    issues,
    completeness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate Gaza humanitarian/aid data
 */
export function validateGazaHumanitarianData(
  wfpData: any,
  ochaData: any
): DataValidationResult {
  const issues: string[] = [];
  let completeness = 0;
  let fieldsPresent = 0;
  const totalFields = 2;

  if (wfpData) {
    fieldsPresent++;
    const validation = validateHumanitarianData(wfpData);
    if (!validation.isValid) {
      issues.push(...validation.issues);
    }
  } else {
    issues.push('No WFP data available');
  }

  if (ochaData) {
    fieldsPresent++;
  } else {
    issues.push('No OCHA data available');
  }

  completeness = (fieldsPresent / totalFields) * 100;

  return {
    component: 'AidSurvival',
    isValid: issues.length === 0,
    dataSource: 'wfp/un_ocha',
    issues,
    completeness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate Gaza population impact data
 */
export function validateGazaPopulationData(
  killedData: CasualtyRecord[],
  displacementData: any
): DataValidationResult {
  const issues: string[] = [];
  let completeness = 0;
  let fieldsPresent = 0;
  const totalFields = 2;

  if (killedData && Array.isArray(killedData) && killedData.length > 0) {
    fieldsPresent++;
    const validation = validateCasualtyData(killedData);
    if (!validation.isValid) {
      issues.push(...validation.issues.map(issue => `Casualty data: ${issue}`));
    }
  } else {
    issues.push('No casualty data for population calculations');
  }

  if (displacementData && displacementData.internally_displaced) {
    fieldsPresent++;
  } else {
    issues.push('No displacement data available');
  }

  completeness = (fieldsPresent / totalFields) * 100;

  return {
    component: 'PopulationImpact',
    isValid: issues.length === 0,
    dataSource: 'tech4palestine/un_ocha',
    issues,
    completeness,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run comprehensive Gaza data validation
 */
export function validateAllGazaData(data: {
  killedData?: CasualtyRecord[];
  casualtiesDaily?: any[];
  pressData?: any[];
  infrastructureData?: InfrastructureRecord[];
  wfpData?: any;
  ochaData?: any;
  displacementData?: any;
}): GazaDataValidationReport {
  const results: DataValidationResult[] = [];

  // Validate each component's data
  results.push(validateGazaCasualtyData(
    data.killedData || [],
    data.casualtiesDaily || []
  ));

  results.push(validateGazaPressData(data.pressData || []));

  results.push(validateGazaInfrastructureData(data.infrastructureData || []));

  results.push(validateGazaHumanitarianData(data.wfpData, data.ochaData));

  results.push(validateGazaPopulationData(
    data.killedData || [],
    data.displacementData
  ));

  // Calculate overall statistics
  const validComponents = results.filter(r => r.isValid).length;
  const invalidComponents = results.length - validComponents;
  const overallValid = invalidComponents === 0;

  return {
    overallValid,
    totalComponents: results.length,
    validComponents,
    invalidComponents,
    results,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Monitor data quality in real-time
 */
export class GazaDataQualityMonitor {
  private validationHistory: GazaDataValidationReport[] = [];
  private maxHistorySize = 100;

  /**
   * Add validation result to history
   */
  addValidation(report: GazaDataValidationReport): void {
    this.validationHistory.push(report);
    
    // Keep only recent validations
    if (this.validationHistory.length > this.maxHistorySize) {
      this.validationHistory.shift();
    }
  }

  /**
   * Get validation history
   */
  getHistory(): GazaDataValidationReport[] {
    return this.validationHistory;
  }

  /**
   * Get latest validation
   */
  getLatest(): GazaDataValidationReport | null {
    return this.validationHistory.length > 0 
      ? this.validationHistory[this.validationHistory.length - 1]
      : null;
  }

  /**
   * Get data quality trend
   */
  getQualityTrend(): {
    improving: boolean;
    averageCompleteness: number;
    validationCount: number;
  } {
    if (this.validationHistory.length < 2) {
      return {
        improving: true,
        averageCompleteness: 0,
        validationCount: this.validationHistory.length,
      };
    }

    const recent = this.validationHistory.slice(-10);
    const totalCompleteness = recent.reduce((sum, report) => {
      const avgCompleteness = report.results.reduce((s, r) => s + r.completeness, 0) / report.results.length;
      return sum + avgCompleteness;
    }, 0);

    const averageCompleteness = totalCompleteness / recent.length;

    // Compare first half vs second half of recent validations
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + r.validComponents, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.validComponents, 0) / secondHalf.length;

    return {
      improving: secondAvg >= firstAvg,
      averageCompleteness,
      validationCount: this.validationHistory.length,
    };
  }

  /**
   * Clear validation history
   */
  clearHistory(): void {
    this.validationHistory = [];
  }
}

// Singleton instance
export const gazaDataQualityMonitor = new GazaDataQualityMonitor();
