/**
 * Data Audit Service
 * 
 * Scans dashboard components for hardcoded values, fake data, and mock calculations.
 * Generates comprehensive audit reports with severity levels and replacement complexity.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type FakeDataType = 
  | 'hardcoded_number' 
  | 'mock_calculation' 
  | 'placeholder_text' 
  | 'fake_array'
  | 'fallback_value'
  | 'static_data';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface FakeDataInstance {
  location: string;
  lineNumber: number;
  type: FakeDataType;
  currentValue: any;
  context: string;
  suggestedReplacement: string;
  dataSourceMapping: string[];
  confidence: number; // 0-1 score of how confident we are this is fake data
}

export interface FakeDataReport {
  componentPath: string;
  componentName: string;
  fakeDataInstances: FakeDataInstance[];
  severity: SeverityLevel;
  replacementComplexity: number; // 1-10 scale
  totalIssues: number;
  criticalIssues: number;
  estimatedEffort: string; // e.g., "2-4 hours"
}

export interface ComprehensiveAuditReport {
  timestamp: string;
  totalComponents: number;
  componentsWithFakeData: number;
  totalFakeDataInstances: number;
  severityBreakdown: Record<SeverityLevel, number>;
  componentReports: FakeDataReport[];
  prioritizedReplacementPlan: ReplacementPlan;
  summary: AuditSummary;
}

export interface ReplacementPlan {
  phases: ReplacementPhase[];
  estimatedTotalEffort: string;
  dependencies: string[];
}

export interface ReplacementPhase {
  phase: number;
  name: string;
  components: string[];
  estimatedEffort: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface AuditSummary {
  gazaComponents: {
    total: number;
    withFakeData: number;
    fakeDataPercentage: number;
  };
  westBankComponents: {
    total: number;
    withFakeData: number;
    fakeDataPercentage: number;
  };
  sharedComponents: {
    total: number;
    withFakeData: number;
    fakeDataPercentage: number;
  };
  topIssues: string[];
  recommendations: string[];
}

// ============================================
// DETECTION PATTERNS
// ============================================

const FAKE_DATA_PATTERNS = {
  // Hardcoded numbers that look suspicious
  hardcodedNumbers: [
    /(?:const|let|var)\s+\w+\s*=\s*(\d{3,})/g, // Large numbers assigned to variables
    /value:\s*(\d{3,})/g, // Object property values
    /\|\|\s*(\d{3,})/g, // Fallback values
  ],
  
  // Mock calculations
  mockCalculations: [
    /Math\.(round|floor|ceil)\([^)]*\*\s*[\d.]+\)/g,
    /\*\s*0\.\d+/g, // Percentage multipliers
    /\+\s*\w+\s*\*\s*[\d.]+/g, // Addition with multipliers
  ],
  
  // Fallback values (often fake)
  fallbackValues: [
    /\|\|\s*\d+/g,
    /\?\?\s*\d+/g,
    /:\s*\d+\s*}/g, // Object property defaults
  ],
  
  // Array.from with fake data generation
  fakeArrayGeneration: [
    /Array\.from\(\{[^}]*length:\s*\d+\s*\}/g,
  ],
  
  // Placeholder text
  placeholderText: [
    /'N\/A'/g,
    /"N\/A"/g,
    /'\.\.\.'/g,
    /"\.\.\."/g,
    /'TBD'/g,
    /"TBD"/g,
  ],
  
  // Static data arrays
  staticDataArrays: [
    /const\s+\w+\s*=\s*\[[\s\S]*?\{[\s\S]*?value:\s*\d+[\s\S]*?\}[\s\S]*?\]/g,
  ],
};

// Component to data source mapping
const COMPONENT_DATA_SOURCE_MAP: Record<string, string[]> = {
  // Gaza components
  'HumanitarianCrisis': ['tech4palestine', 'goodshepherd', 'un_ocha'],
  'InfrastructureDestruction': ['tech4palestine', 'goodshepherd', 'who', 'un_ocha'],
  'PopulationImpact': ['tech4palestine', 'un_ocha', 'pcbs', 'unicef'],
  'AidSurvival': ['wfp', 'who', 'un_ocha'],
  'CasualtyDetails': ['tech4palestine'],
  
  // West Bank components
  'OccupationMetrics': ['goodshepherd', 'un_ocha', 'btselem'],
  'SettlerViolence': ['goodshepherd', 'un_ocha', 'btselem'],
  'EconomicStrangulation': ['world_bank', 'pcbs', 'goodshepherd'],
  'PrisonersDetention': ['goodshepherd', 'btselem'],
};

// ============================================
// DATA AUDIT SERVICE CLASS
// ============================================

export class DataAuditService {
  private workspaceRoot: string;
  private componentPaths: string[] = [];
  
  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }
  
  /**
   * Audit a single component file
   */
  async auditComponent(componentPath: string): Promise<FakeDataReport> {
    const fullPath = path.join(this.workspaceRoot, componentPath);
    const content = await this.readFile(fullPath);
    const componentName = path.basename(componentPath, path.extname(componentPath));
    
    const fakeDataInstances = this.detectFakeData(content, componentPath);
    const severity = this.calculateSeverity(fakeDataInstances);
    const replacementComplexity = this.calculateComplexity(fakeDataInstances);
    
    const criticalIssues = fakeDataInstances.filter(
      instance => instance.confidence > 0.8
    ).length;
    
    return {
      componentPath,
      componentName,
      fakeDataInstances,
      severity,
      replacementComplexity,
      totalIssues: fakeDataInstances.length,
      criticalIssues,
      estimatedEffort: this.estimateEffort(replacementComplexity, fakeDataInstances.length),
    };
  }
  
  /**
   * Audit all components in the dashboard
   */
  async auditAllComponents(): Promise<ComprehensiveAuditReport> {
    const componentPaths = await this.discoverComponents();
    const componentReports: FakeDataReport[] = [];
    
    for (const componentPath of componentPaths) {
      try {
        const report = await this.auditComponent(componentPath);
        if (report.totalIssues > 0) {
          componentReports.push(report);
        }
      } catch (error) {
        console.error(`Failed to audit ${componentPath}:`, error);
      }
    }
    
    const severityBreakdown = this.calculateSeverityBreakdown(componentReports);
    const prioritizedReplacementPlan = this.generateReplacementPlan(componentReports);
    const summary = this.generateSummary(componentReports);
    
    return {
      timestamp: new Date().toISOString(),
      totalComponents: componentPaths.length,
      componentsWithFakeData: componentReports.length,
      totalFakeDataInstances: componentReports.reduce((sum, r) => sum + r.totalIssues, 0),
      severityBreakdown,
      componentReports,
      prioritizedReplacementPlan,
      summary,
    };
  }
  
  /**
   * Detect fake data in component code
   */
  private detectFakeData(content: string, componentPath: string): FakeDataInstance[] {
    const instances: FakeDataInstance[] = [];
    const lines = content.split('\n');
    const componentName = path.basename(componentPath, path.extname(componentPath));
    
    // Detect hardcoded numbers
    lines.forEach((line, index) => {
      // Skip imports and type definitions
      if (line.trim().startsWith('import') || line.trim().startsWith('export type')) {
        return;
      }
      
      // Detect fallback values (high confidence these are fake)
      const fallbackMatches = line.matchAll(/\|\|\s*(\d+)/g);
      for (const match of fallbackMatches) {
        const value = parseInt(match[1]);
        if (value > 100) { // Likely a fake fallback value
          instances.push({
            location: `${componentPath}:${index + 1}`,
            lineNumber: index + 1,
            type: 'fallback_value',
            currentValue: value,
            context: line.trim(),
            suggestedReplacement: this.suggestReplacement(componentName, line),
            dataSourceMapping: COMPONENT_DATA_SOURCE_MAP[componentName] || [],
            confidence: 0.9,
          });
        }
      }
      
      // Detect Array.from fake data generation
      if (line.includes('Array.from') && line.includes('length:')) {
        instances.push({
          location: `${componentPath}:${index + 1}`,
          lineNumber: index + 1,
          type: 'fake_array',
          currentValue: line.trim(),
          context: line.trim(),
          suggestedReplacement: 'Use real data from API instead of generating fake arrays',
          dataSourceMapping: COMPONENT_DATA_SOURCE_MAP[componentName] || [],
          confidence: 0.95,
        });
      }
      
      // Detect mock calculations
      if (line.includes('Math.round') && /\*\s*0\.\d+/.test(line)) {
        instances.push({
          location: `${componentPath}:${index + 1}`,
          lineNumber: index + 1,
          type: 'mock_calculation',
          currentValue: line.trim(),
          context: line.trim(),
          suggestedReplacement: 'Replace with actual calculated data from API',
          dataSourceMapping: COMPONENT_DATA_SOURCE_MAP[componentName] || [],
          confidence: 0.85,
        });
      }
      
      // Detect static data objects
      if (line.includes('{ name:') && line.includes('value:') && /value:\s*\d{2,}/.test(line)) {
        instances.push({
          location: `${componentPath}:${index + 1}`,
          lineNumber: index + 1,
          type: 'static_data',
          currentValue: line.trim(),
          context: line.trim(),
          suggestedReplacement: 'Replace with dynamic data from API',
          dataSourceMapping: COMPONENT_DATA_SOURCE_MAP[componentName] || [],
          confidence: 0.8,
        });
      }
      
      // Detect placeholder text
      if (line.includes("'N/A'") || line.includes('"N/A"')) {
        instances.push({
          location: `${componentPath}:${index + 1}`,
          lineNumber: index + 1,
          type: 'placeholder_text',
          currentValue: 'N/A',
          context: line.trim(),
          suggestedReplacement: 'Replace with real data or proper loading state',
          dataSourceMapping: COMPONENT_DATA_SOURCE_MAP[componentName] || [],
          confidence: 0.7,
        });
      }
    });
    
    return instances;
  }
  
  /**
   * Suggest replacement for fake data
   */
  private suggestReplacement(componentName: string, context: string): string {
    const sources = COMPONENT_DATA_SOURCE_MAP[componentName] || [];
    
    if (sources.length === 0) {
      return 'Identify appropriate data source and integrate';
    }
    
    if (context.includes('casualties') || context.includes('killed')) {
      return `Use Tech4Palestine API: /v3/killed-in-gaza.min.json`;
    }
    
    if (context.includes('infrastructure') || context.includes('building')) {
      return `Use Good Shepherd Collective or Tech4Palestine infrastructure data`;
    }
    
    if (context.includes('settlement') || context.includes('occupation')) {
      return `Use Good Shepherd Collective West Bank data`;
    }
    
    if (context.includes('economic') || context.includes('gdp') || context.includes('unemployment')) {
      return `Use World Bank API for economic indicators`;
    }
    
    return `Use data from: ${sources.join(', ')}`;
  }
  
  /**
   * Calculate severity level
   */
  private calculateSeverity(instances: FakeDataInstance[]): SeverityLevel {
    if (instances.length === 0) return 'low';
    
    const highConfidenceCount = instances.filter(i => i.confidence > 0.8).length;
    const criticalTypes = instances.filter(
      i => i.type === 'fake_array' || i.type === 'fallback_value'
    ).length;
    
    if (highConfidenceCount > 10 || criticalTypes > 5) return 'critical';
    if (highConfidenceCount > 5 || criticalTypes > 2) return 'high';
    if (instances.length > 5) return 'medium';
    return 'low';
  }
  
  /**
   * Calculate replacement complexity (1-10 scale)
   */
  private calculateComplexity(instances: FakeDataInstance[]): number {
    if (instances.length === 0) return 0;
    
    let complexity = Math.min(instances.length / 2, 5); // Base complexity from count
    
    // Add complexity for different types
    const uniqueTypes = new Set(instances.map(i => i.type)).size;
    complexity += uniqueTypes * 0.5;
    
    // Add complexity for high confidence issues
    const highConfidence = instances.filter(i => i.confidence > 0.8).length;
    complexity += highConfidence * 0.3;
    
    return Math.min(Math.round(complexity), 10);
  }
  
  /**
   * Estimate effort in hours
   */
  private estimateEffort(complexity: number, issueCount: number): string {
    const hours = Math.ceil((complexity * 0.5) + (issueCount * 0.2));
    
    if (hours <= 2) return '1-2 hours';
    if (hours <= 4) return '2-4 hours';
    if (hours <= 8) return '4-8 hours';
    if (hours <= 16) return '1-2 days';
    return '2+ days';
  }
  
  /**
   * Discover all component files
   */
  private async discoverComponents(): Promise<string[]> {
    const components: string[] = [];
    
    // Gaza components
    const gazaPath = 'src/components/v3/gaza';
    components.push(...await this.scanDirectory(gazaPath));
    
    // West Bank components
    const westBankPath = 'src/components/v3/westbank';
    components.push(...await this.scanDirectory(westBankPath));
    
    // Shared components
    const sharedPath = 'src/components/v3/shared';
    components.push(...await this.scanDirectory(sharedPath));
    
    return components;
  }
  
  /**
   * Scan directory for component files
   */
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const components: string[] = [];
    const fullPath = path.join(this.workspaceRoot, dirPath);
    
    try {
      const files = await fs.promises.readdir(fullPath);
      
      for (const file of files) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          components.push(path.join(dirPath, file));
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${dirPath}:`, error);
    }
    
    return components;
  }
  
  /**
   * Read file content
   */
  private async readFile(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, 'utf-8');
  }
  
  /**
   * Calculate severity breakdown
   */
  private calculateSeverityBreakdown(reports: FakeDataReport[]): Record<SeverityLevel, number> {
    return {
      critical: reports.filter(r => r.severity === 'critical').length,
      high: reports.filter(r => r.severity === 'high').length,
      medium: reports.filter(r => r.severity === 'medium').length,
      low: reports.filter(r => r.severity === 'low').length,
    };
  }
  
  /**
   * Generate replacement plan
   */
  generateReplacementPlan(reports: FakeDataReport[]): ReplacementPlan {
    // Sort by severity and complexity
    const sortedReports = [...reports].sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.replacementComplexity - a.replacementComplexity;
    });
    
    const phases: ReplacementPhase[] = [
      {
        phase: 1,
        name: 'Critical Gaza Components',
        components: sortedReports
          .filter(r => r.severity === 'critical' && r.componentPath.includes('gaza'))
          .map(r => r.componentPath),
        estimatedEffort: '1-2 weeks',
        priority: 'critical' as const,
      },
      {
        phase: 2,
        name: 'Critical West Bank Components',
        components: sortedReports
          .filter(r => r.severity === 'critical' && r.componentPath.includes('westbank'))
          .map(r => r.componentPath),
        estimatedEffort: '1-2 weeks',
        priority: 'critical' as const,
      },
      {
        phase: 3,
        name: 'High Priority Components',
        components: sortedReports
          .filter(r => r.severity === 'high')
          .map(r => r.componentPath),
        estimatedEffort: '2-3 weeks',
        priority: 'high' as const,
      },
      {
        phase: 4,
        name: 'Medium Priority Components',
        components: sortedReports
          .filter(r => r.severity === 'medium')
          .map(r => r.componentPath),
        estimatedEffort: '1-2 weeks',
        priority: 'medium' as const,
      },
    ].filter(phase => phase.components.length > 0);
    
    const totalWeeks = phases.reduce((sum, phase) => {
      const weeks = parseInt(phase.estimatedEffort.split('-')[1]);
      return sum + weeks;
    }, 0);
    
    return {
      phases,
      estimatedTotalEffort: `${totalWeeks} weeks`,
      dependencies: [
        'Data Consolidation Service must be fully functional',
        'All API endpoints must be verified and tested',
        'Component data mapping must be complete',
      ],
    };
  }
  
  /**
   * Generate audit summary
   */
  private generateSummary(reports: FakeDataReport[]): AuditSummary {
    const gazaReports = reports.filter(r => r.componentPath.includes('gaza'));
    const westBankReports = reports.filter(r => r.componentPath.includes('westbank'));
    const sharedReports = reports.filter(r => r.componentPath.includes('shared'));
    
    const topIssues = reports
      .flatMap(r => r.fakeDataInstances)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10)
      .map(i => `${i.type} at ${i.location}: ${i.context.substring(0, 60)}...`);
    
    return {
      gazaComponents: {
        total: gazaReports.length,
        withFakeData: gazaReports.filter(r => r.totalIssues > 0).length,
        fakeDataPercentage: gazaReports.length > 0 
          ? (gazaReports.filter(r => r.totalIssues > 0).length / gazaReports.length) * 100 
          : 0,
      },
      westBankComponents: {
        total: westBankReports.length,
        withFakeData: westBankReports.filter(r => r.totalIssues > 0).length,
        fakeDataPercentage: westBankReports.length > 0 
          ? (westBankReports.filter(r => r.totalIssues > 0).length / westBankReports.length) * 100 
          : 0,
      },
      sharedComponents: {
        total: sharedReports.length,
        withFakeData: sharedReports.filter(r => r.totalIssues > 0).length,
        fakeDataPercentage: sharedReports.length > 0 
          ? (sharedReports.filter(r => r.totalIssues > 0).length / sharedReports.length) * 100 
          : 0,
      },
      topIssues,
      recommendations: [
        'Prioritize Gaza humanitarian crisis components due to high visibility',
        'Integrate Tech4Palestine API for all casualty data',
        'Use Good Shepherd Collective for infrastructure and West Bank data',
        'Implement proper loading states instead of fallback values',
        'Add data quality indicators to all metrics',
        'Create automated tests to prevent fake data regression',
      ],
    };
  }
  
  /**
   * Identify hardcoded values in code
   */
  identifyHardcodedValues(code: string): Array<{ value: any; location: string; context: string }> {
    const hardcodedValues: Array<{ value: any; location: string; context: string }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      // Look for hardcoded numbers in assignments and fallbacks
      const matches = line.matchAll(/(?:=|:|\|\|)\s*(\d{3,})/g);
      for (const match of matches) {
        hardcodedValues.push({
          value: parseInt(match[1]),
          location: `Line ${index + 1}`,
          context: line.trim(),
        });
      }
    });
    
    return hardcodedValues;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dataAuditService = new DataAuditService();
