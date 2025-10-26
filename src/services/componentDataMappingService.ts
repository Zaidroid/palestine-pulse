/**
 * Component Data Mapping Service
 * 
 * Creates comprehensive mappings between dashboard components and real data sources.
 * Maps each metric to corresponding verified data sources.
 * Documents data transformation requirements and prioritizes replacements.
 */

import { DataSource } from '../types/data.types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MetricMapping {
  metricName: string;
  displayName: string;
  currentImplementation: 'fake' | 'real' | 'mixed' | 'partial';
  targetDataSource: DataSource;
  fallbackDataSources: DataSource[];
  transformationRequired: boolean;
  transformationDescription?: string;
  replacementPriority: number; // 1-10, 10 being highest priority
  estimatedEffort: string;
  dataPath?: string; // Path to data in API response
}

export interface DataDependency {
  dependsOn: string; // Component or service name
  reason: string;
  type: 'component' | 'service' | 'api';
  critical: boolean;
}

export interface TransformationSpec {
  inputFormat: string;
  outputFormat: string;
  transformationSteps: string[];
  validationRules: string[];
  exampleInput?: any;
  exampleOutput?: any;
}

export interface ComponentDataMapping {
  componentPath: string;
  componentName: string;
  dashboardSection: 'gaza' | 'westbank' | 'shared';
  metrics: MetricMapping[];
  dataDependencies: DataDependency[];
  transformationRequirements: TransformationSpec[];
  overallPriority: number;
  estimatedTotalEffort: string;
}

export interface GlobalDataMapping {
  timestamp: string;
  totalComponents: number;
  totalMetrics: number;
  gazaMappings: ComponentDataMapping[];
  westBankMappings: ComponentDataMapping[];
  sharedMappings: ComponentDataMapping[];
  prioritizedComponents: string[];
  dataFlowDiagram: DataFlowNode[];
}

export interface DataFlowNode {
  id: string;
  type: 'source' | 'service' | 'component';
  name: string;
  connections: string[];
  status: 'operational' | 'needs_work' | 'not_implemented';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface OptimizedDataFlow {
  parallelFetches: string[][];
  sequentialSteps: string[];
  estimatedLoadTime: number;
  bottlenecks: string[];
  optimizations: string[];
}

// ============================================
// COMPONENT DATA MAPPING SERVICE CLASS
// ============================================

export class ComponentDataMappingService {
  private mappings: Map<string, ComponentDataMapping> = new Map();
  
  /**
   * Create mapping for a single component
   */
  createComponentMapping(componentPath: string): ComponentDataMapping {
    const componentName = this.extractComponentName(componentPath);
    const dashboardSection = this.determineDashboardSection(componentPath);
    
    const metrics = this.identifyMetrics(componentName, dashboardSection);
    const dataDependencies = this.identifyDependencies(componentName, dashboardSection);
    const transformationRequirements = this.identifyTransformations(componentName, metrics);
    
    const overallPriority = this.calculateOverallPriority(metrics);
    const estimatedTotalEffort = this.estimateTotalEffort(metrics);
    
    const mapping: ComponentDataMapping = {
      componentPath,
      componentName,
      dashboardSection,
      metrics,
      dataDependencies,
      transformationRequirements,
      overallPriority,
      estimatedTotalEffort,
    };
    
    this.mappings.set(componentPath, mapping);
    return mapping;
  }
  
  /**
   * Generate global mapping for all components
   */
  generateGlobalMapping(): GlobalDataMapping {
    const gazaComponents = [
      'src/components/v3/gaza/HumanitarianCrisis.tsx',
      'src/components/v3/gaza/InfrastructureDestruction.tsx',
      'src/components/v3/gaza/PopulationImpact.tsx',
      'src/components/v3/gaza/AidSurvival.tsx',
      'src/components/v3/gaza/CasualtyDetails.tsx',
    ];
    
    const westBankComponents = [
      'src/components/v3/westbank/OccupationMetrics.tsx',
      'src/components/v3/westbank/SettlerViolence.tsx',
      'src/components/v3/westbank/EconomicStrangulation.tsx',
      'src/components/v3/westbank/PrisonersDetention.tsx',
    ];
    
    const sharedComponents = [
      'src/components/v3/shared/UnifiedMetricCard.tsx',
      'src/components/v3/shared/AnimatedChart.tsx',
      'src/components/v3/shared/PressCasualtiesWidget.tsx',
    ];
    
    const gazaMappings = gazaComponents.map(path => this.createComponentMapping(path));
    const westBankMappings = westBankComponents.map(path => this.createComponentMapping(path));
    const sharedMappings = sharedComponents.map(path => this.createComponentMapping(path));
    
    const allMappings = [...gazaMappings, ...westBankMappings, ...sharedMappings];
    const prioritizedComponents = allMappings
      .sort((a, b) => b.overallPriority - a.overallPriority)
      .map(m => m.componentPath);
    
    const dataFlowDiagram = this.generateDataFlowDiagram(allMappings);
    
    return {
      timestamp: new Date().toISOString(),
      totalComponents: allMappings.length,
      totalMetrics: allMappings.reduce((sum, m) => sum + m.metrics.length, 0),
      gazaMappings,
      westBankMappings,
      sharedMappings,
      prioritizedComponents,
      dataFlowDiagram,
    };
  }
  
  /**
   * Identify metrics for a component
   */
  private identifyMetrics(componentName: string, section: 'gaza' | 'westbank' | 'shared'): MetricMapping[] {
    const metricsMap: Record<string, MetricMapping[]> = {
      // Gaza Components
      'HumanitarianCrisis': [
        {
          metricName: 'totalKilled',
          displayName: 'Total Killed',
          currentImplementation: 'mixed',
          targetDataSource: 'tech4palestine',
          fallbackDataSources: ['goodshepherd'],
          transformationRequired: false,
          replacementPriority: 10,
          estimatedEffort: '1-2 hours',
          dataPath: 'data[data.length - 1].ext_killed_cum',
        },
        {
          metricName: 'childrenKilled',
          displayName: 'Children Killed',
          currentImplementation: 'mixed',
          targetDataSource: 'tech4palestine',
          fallbackDataSources: [],
          transformationRequired: true,
          transformationDescription: 'Calculate from demographic breakdown in API response',
          replacementPriority: 10,
          estimatedEffort: '2-3 hours',
          dataPath: 'data.filter(d => d.age < 18).length',
        },
        {
          metricName: 'womenKilled',
          displayName: 'Women Killed',
          currentImplementation: 'mixed',
          targetDataSource: 'tech4palestine',
          fallbackDataSources: [],
          transformationRequired: true,
          transformationDescription: 'Calculate from gender breakdown in API response',
          replacementPriority: 9,
          estimatedEffort: '2-3 hours',
          dataPath: 'data.filter(d => d.sex === "female").length',
        },
        {
          metricName: 'pressKilled',
          displayName: 'Press Casualties',
          currentImplementation: 'real',
          targetDataSource: 'tech4palestine',
          fallbackDataSources: [],
          transformationRequired: false,
          replacementPriority: 8,
          estimatedEffort: '1 hour',
          dataPath: 'data.length',
        },
      ],
      
      'InfrastructureDestruction': [
        {
          metricName: 'residentialDestroyed',
          displayName: 'Residential Units Destroyed',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['tech4palestine', 'un_ocha'],
          transformationRequired: true,
          transformationDescription: 'Aggregate destruction data from Good Shepherd API',
          replacementPriority: 9,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'hospitalsAffected',
          displayName: 'Hospitals Affected',
          currentImplementation: 'fake',
          targetDataSource: 'who',
          fallbackDataSources: ['goodshepherd', 'un_ocha'],
          transformationRequired: true,
          transformationDescription: 'Count unique healthcare facilities from attacks data',
          replacementPriority: 9,
          estimatedEffort: '2-3 hours',
        },
        {
          metricName: 'schoolsAffected',
          displayName: 'Schools Damaged',
          currentImplementation: 'fake',
          targetDataSource: 'un_ocha',
          fallbackDataSources: ['goodshepherd'],
          transformationRequired: true,
          replacementPriority: 8,
          estimatedEffort: '2-3 hours',
        },
        {
          metricName: 'healthWorkersKilled',
          displayName: 'Healthcare Workers Killed',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['who'],
          transformationRequired: true,
          transformationDescription: 'Extract healthcare worker casualties from attacks data',
          replacementPriority: 8,
          estimatedEffort: '2-3 hours',
        },
      ],
      
      'PopulationImpact': [
        {
          metricName: 'displaced',
          displayName: 'Internally Displaced',
          currentImplementation: 'fake',
          targetDataSource: 'un_ocha',
          fallbackDataSources: [],
          transformationRequired: true,
          replacementPriority: 9,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'orphanedChildren',
          displayName: 'Orphaned Children',
          currentImplementation: 'fake',
          targetDataSource: 'un_ocha',
          fallbackDataSources: ['goodshepherd'],
          transformationRequired: true,
          transformationDescription: 'Estimate based on casualty data and family size',
          replacementPriority: 7,
          estimatedEffort: '4-5 hours',
        },
        {
          metricName: 'studentCasualties',
          displayName: 'Student Casualties',
          currentImplementation: 'fake',
          targetDataSource: 'tech4palestine',
          fallbackDataSources: ['un_ocha'],
          transformationRequired: true,
          transformationDescription: 'Filter casualties by age range (5-18)',
          replacementPriority: 7,
          estimatedEffort: '2-3 hours',
        },
      ],
      
      'AidSurvival': [
        {
          metricName: 'foodPrices',
          displayName: 'Food Prices',
          currentImplementation: 'fake',
          targetDataSource: 'wfp',
          fallbackDataSources: [],
          transformationRequired: true,
          replacementPriority: 8,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'aidDeliveries',
          displayName: 'Aid Deliveries',
          currentImplementation: 'fake',
          targetDataSource: 'un_ocha',
          fallbackDataSources: ['wfp'],
          transformationRequired: true,
          replacementPriority: 7,
          estimatedEffort: '3-4 hours',
        },
      ],
      
      // West Bank Components
      'OccupationMetrics': [
        {
          metricName: 'settlements',
          displayName: 'Israeli Settlements',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['un_ocha', 'btselem'],
          transformationRequired: true,
          replacementPriority: 9,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'settlerPopulation',
          displayName: 'Settler Population',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['un_ocha'],
          transformationRequired: true,
          replacementPriority: 8,
          estimatedEffort: '2-3 hours',
        },
        {
          metricName: 'checkpoints',
          displayName: 'Checkpoints & Barriers',
          currentImplementation: 'mixed',
          targetDataSource: 'btselem',
          fallbackDataSources: ['un_ocha', 'goodshepherd'],
          transformationRequired: false,
          replacementPriority: 9,
          estimatedEffort: '2 hours',
        },
      ],
      
      'SettlerViolence': [
        {
          metricName: 'killedBySettlers',
          displayName: 'Palestinians Killed by Settlers',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['btselem'],
          transformationRequired: true,
          transformationDescription: 'Filter casualties by perpetrator type',
          replacementPriority: 10,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'settlerAttacks',
          displayName: 'Settler Attacks',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['un_ocha', 'btselem'],
          transformationRequired: true,
          replacementPriority: 10,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'demolitions',
          displayName: 'Home Demolitions',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['btselem'],
          transformationRequired: true,
          replacementPriority: 9,
          estimatedEffort: '3-4 hours',
        },
      ],
      
      'EconomicStrangulation': [
        {
          metricName: 'gdpDecline',
          displayName: 'GDP Decline',
          currentImplementation: 'fake',
          targetDataSource: 'world_bank',
          fallbackDataSources: ['pcbs'],
          transformationRequired: true,
          transformationDescription: 'Calculate percentage change from World Bank GDP data',
          replacementPriority: 8,
          estimatedEffort: '4-5 hours',
        },
        {
          metricName: 'unemployment',
          displayName: 'Unemployment Rate',
          currentImplementation: 'fake',
          targetDataSource: 'world_bank',
          fallbackDataSources: ['pcbs'],
          transformationRequired: true,
          replacementPriority: 8,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'poverty',
          displayName: 'Poverty Rate',
          currentImplementation: 'fake',
          targetDataSource: 'world_bank',
          fallbackDataSources: ['pcbs'],
          transformationRequired: true,
          replacementPriority: 7,
          estimatedEffort: '3-4 hours',
        },
      ],
      
      'PrisonersDetention': [
        {
          metricName: 'totalPrisoners',
          displayName: 'Total Political Prisoners',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['btselem'],
          transformationRequired: true,
          replacementPriority: 9,
          estimatedEffort: '3-4 hours',
        },
        {
          metricName: 'childPrisoners',
          displayName: 'Child Prisoners',
          currentImplementation: 'fake',
          targetDataSource: 'goodshepherd',
          fallbackDataSources: ['btselem'],
          transformationRequired: false,
          replacementPriority: 9,
          estimatedEffort: '2-3 hours',
        },
      ],
    };
    
    return metricsMap[componentName] || [];
  }
  
  /**
   * Identify dependencies for a component
   */
  private identifyDependencies(componentName: string, section: 'gaza' | 'westbank' | 'shared'): DataDependency[] {
    const dependencies: DataDependency[] = [
      {
        dependsOn: 'dataConsolidationService',
        reason: 'Provides consolidated data from multiple sources',
        type: 'service',
        critical: true,
      },
      {
        dependsOn: 'apiOrchestrator',
        reason: 'Handles API calls and caching',
        type: 'service',
        critical: true,
      },
    ];
    
    // Add component-specific dependencies
    if (componentName === 'HumanitarianCrisis') {
      dependencies.push({
        dependsOn: 'CasualtyDetails',
        reason: 'Displays detailed casualty breakdowns',
        type: 'component',
        critical: false,
      });
    }
    
    return dependencies;
  }
  
  /**
   * Identify transformation requirements
   */
  private identifyTransformations(componentName: string, metrics: MetricMapping[]): TransformationSpec[] {
    const transformations: TransformationSpec[] = [];
    
    metrics.forEach(metric => {
      if (metric.transformationRequired && metric.transformationDescription) {
        transformations.push({
          inputFormat: 'API Response JSON',
          outputFormat: 'Component Metric Value',
          transformationSteps: [
            'Fetch data from API',
            metric.transformationDescription,
            'Validate transformed data',
            'Apply to component state',
          ],
          validationRules: [
            'Value must be a number',
            'Value must be non-negative',
            'Value must be within expected range',
          ],
        });
      }
    });
    
    return transformations;
  }
  
  /**
   * Calculate overall priority for a component
   */
  private calculateOverallPriority(metrics: MetricMapping[]): number {
    if (metrics.length === 0) return 0;
    
    const avgPriority = metrics.reduce((sum, m) => sum + m.replacementPriority, 0) / metrics.length;
    const fakeMetricsCount = metrics.filter(m => m.currentImplementation === 'fake').length;
    const fakePercentage = fakeMetricsCount / metrics.length;
    
    // Higher priority if more metrics are fake
    return Math.round(avgPriority * (1 + fakePercentage * 0.5));
  }
  
  /**
   * Estimate total effort for a component
   */
  private estimateTotalEffort(metrics: MetricMapping[]): string {
    const effortMap: Record<string, number> = {
      '1 hour': 1,
      '1-2 hours': 1.5,
      '2-3 hours': 2.5,
      '3-4 hours': 3.5,
      '4-5 hours': 4.5,
      '1 day': 8,
      '2 days': 16,
    };
    
    const totalHours = metrics.reduce((sum, m) => {
      return sum + (effortMap[m.estimatedEffort] || 2);
    }, 0);
    
    if (totalHours <= 4) return `${Math.ceil(totalHours)} hours`;
    if (totalHours <= 8) return '1 day';
    if (totalHours <= 16) return '2 days';
    return `${Math.ceil(totalHours / 8)} days`;
  }
  
  /**
   * Extract component name from path
   */
  private extractComponentName(componentPath: string): string {
    const parts = componentPath.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace('.tsx', '').replace('.ts', '');
  }
  
  /**
   * Determine dashboard section from path
   */
  private determineDashboardSection(componentPath: string): 'gaza' | 'westbank' | 'shared' {
    if (componentPath.includes('/gaza/')) return 'gaza';
    if (componentPath.includes('/westbank/')) return 'westbank';
    return 'shared';
  }
  
  /**
   * Generate data flow diagram
   */
  private generateDataFlowDiagram(mappings: ComponentDataMapping[]): DataFlowNode[] {
    const nodes: DataFlowNode[] = [];
    
    // Add source nodes
    const sources: DataSource[] = ['tech4palestine', 'goodshepherd', 'un_ocha', 'world_bank', 'wfp', 'btselem'];
    sources.forEach(source => {
      nodes.push({
        id: source,
        type: 'source',
        name: source,
        connections: ['apiOrchestrator'],
        status: 'operational',
      });
    });
    
    // Add service nodes
    nodes.push({
      id: 'apiOrchestrator',
      type: 'service',
      name: 'API Orchestrator',
      connections: ['dataConsolidationService'],
      status: 'operational',
    });
    
    nodes.push({
      id: 'dataConsolidationService',
      type: 'service',
      name: 'Data Consolidation Service',
      connections: mappings.map(m => m.componentName),
      status: 'operational',
    });
    
    // Add component nodes
    mappings.forEach(mapping => {
      const hasFakeData = mapping.metrics.some(m => m.currentImplementation === 'fake');
      nodes.push({
        id: mapping.componentName,
        type: 'component',
        name: mapping.componentName,
        connections: [],
        status: hasFakeData ? 'needs_work' : 'operational',
      });
    });
    
    return nodes;
  }
  
  /**
   * Validate a mapping
   */
  validateMapping(mapping: ComponentDataMapping): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Check if component has metrics
    if (mapping.metrics.length === 0) {
      errors.push('Component has no metrics defined');
    }
    
    // Check for fake data
    const fakeMetrics = mapping.metrics.filter(m => m.currentImplementation === 'fake');
    if (fakeMetrics.length > 0) {
      warnings.push(`${fakeMetrics.length} metrics still using fake data`);
    }
    
    // Check for missing data sources
    mapping.metrics.forEach(metric => {
      if (!metric.targetDataSource) {
        errors.push(`Metric "${metric.metricName}" has no target data source`);
      }
    });
    
    // Check for high complexity transformations
    const complexTransformations = mapping.transformationRequirements.filter(
      t => t.transformationSteps.length > 5
    );
    if (complexTransformations.length > 0) {
      suggestions.push('Consider simplifying complex transformations');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  /**
   * Optimize data flow
   */
  optimizeDataFlow(mapping: GlobalDataMapping): OptimizedDataFlow {
    // Group metrics by data source for parallel fetching
    const sourceGroups = new Map<DataSource, string[]>();
    
    [...mapping.gazaMappings, ...mapping.westBankMappings].forEach(compMapping => {
      compMapping.metrics.forEach(metric => {
        const existing = sourceGroups.get(metric.targetDataSource) || [];
        existing.push(`${compMapping.componentName}.${metric.metricName}`);
        sourceGroups.set(metric.targetDataSource, existing);
      });
    });
    
    const parallelFetches = Array.from(sourceGroups.values());
    
    const sequentialSteps = [
      'Initialize API Orchestrator',
      'Fetch data from all sources in parallel',
      'Transform and validate data',
      'Update component states',
      'Render UI',
    ];
    
    const estimatedLoadTime = parallelFetches.length * 500 + 1000; // Rough estimate
    
    const bottlenecks = [
      'Multiple components fetching same data',
      'Sequential transformations',
    ];
    
    const optimizations = [
      'Implement shared data cache',
      'Batch similar transformations',
      'Use web workers for heavy calculations',
      'Implement progressive loading',
    ];
    
    return {
      parallelFetches,
      sequentialSteps,
      estimatedLoadTime,
      bottlenecks,
      optimizations,
    };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const componentDataMappingService = new ComponentDataMappingService();
