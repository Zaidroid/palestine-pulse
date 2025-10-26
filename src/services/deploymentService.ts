/**
 * Deployment Service
 * 
 * Manages deployment of real data integration with:
 * - Proper rollback procedures
 * - Performance and data quality monitoring during deployment
 * - User acceptance testing support
 * - Deployment health checks
 */

import { systemIntegrationTestingService, SystemHealthReport } from './systemIntegrationTestingService';
import { performanceMonitor } from './performanceMonitor';
import { dataConsolidationService } from './dataConsolidationService';
import { apiOrchestrator } from './apiOrchestrator';

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  enableRollback: boolean;
  healthCheckInterval: number; // milliseconds
  performanceThreshold: {
    maxResponseTime: number;
    maxErrorRate: number;
  };
  autoRollbackOnFailure: boolean;
}

export interface DeploymentStatus {
  phase: 'pre-check' | 'deploying' | 'monitoring' | 'completed' | 'rolled-back' | 'failed';
  startTime: Date;
  endTime?: Date;
  healthChecks: SystemHealthReport[];
  issues: DeploymentIssue[];
  metrics: DeploymentMetrics;
}

export interface DeploymentIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface DeploymentMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  peakResponseTime: number;
  errorRate: number;
  dataQualityScore: number;
}

export interface RollbackSnapshot {
  timestamp: Date;
  configuration: any;
  cacheState: any;
  reason: string;
}

// ============================================
// DEPLOYMENT SERVICE
// ============================================

class DeploymentService {
  private config: DeploymentConfig;
  private status: DeploymentStatus | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private rollbackSnapshots: RollbackSnapshot[] = [];
  private maxRollbackSnapshots = 5;

  constructor() {
    this.config = {
      environment: 'production',
      enableRollback: true,
      healthCheckInterval: 60000, // 1 minute
      performanceThreshold: {
        maxResponseTime: 3000, // 3 seconds
        maxErrorRate: 10, // 10%
      },
      autoRollbackOnFailure: true,
    };
  }

  /**
   * Configure deployment settings
   */
  configure(config: Partial<DeploymentConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Deployment configuration updated:', this.config);
  }

  /**
   * Get current deployment status
   */
  getStatus(): DeploymentStatus | null {
    return this.status;
  }

  /**
   * Deploy real data integration
   */
  async deploy(): Promise<DeploymentStatus> {
    console.log('🚀 Starting deployment of real data integration...');

    // Initialize deployment status
    this.status = {
      phase: 'pre-check',
      startTime: new Date(),
      healthChecks: [],
      issues: [],
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        peakResponseTime: 0,
        errorRate: 0,
        dataQualityScore: 0,
      },
    };

    try {
      // Phase 1: Pre-deployment checks
      await this.runPreDeploymentChecks();

      // Phase 2: Create rollback snapshot
      if (this.config.enableRollback) {
        await this.createRollbackSnapshot('Pre-deployment snapshot');
      }

      // Phase 3: Deploy changes
      this.status.phase = 'deploying';
      await this.deployChanges();

      // Phase 4: Start monitoring
      this.status.phase = 'monitoring';
      await this.startDeploymentMonitoring();

      // Phase 5: Run post-deployment validation
      await this.runPostDeploymentValidation();

      // Phase 6: Complete deployment
      this.status.phase = 'completed';
      this.status.endTime = new Date();
      
      console.log('✅ Deployment completed successfully');
      this.stopDeploymentMonitoring();

      return this.status;
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      
      this.status.phase = 'failed';
      this.status.endTime = new Date();
      this.status.issues.push({
        severity: 'critical',
        message: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        resolved: false,
      });

      // Auto-rollback if enabled
      if (this.config.autoRollbackOnFailure && this.config.enableRollback) {
        console.log('🔄 Initiating automatic rollback...');
        await this.rollback();
      }

      throw error;
    }
  }

  /**
   * Run pre-deployment checks
   */
  private async runPreDeploymentChecks(): Promise<void> {
    console.log('🔍 Running pre-deployment checks...');

    // Run system integration tests
    const healthReport = await systemIntegrationTestingService.runFullSystemTest();
    this.status!.healthChecks.push(healthReport);

    // Check if system is healthy enough to deploy
    if (healthReport.overallStatus === 'critical') {
      throw new Error('System health is critical - deployment aborted');
    }

    if (healthReport.overallStatus === 'degraded') {
      this.status!.issues.push({
        severity: 'warning',
        message: 'System health is degraded but deployment will proceed',
        timestamp: new Date(),
        resolved: false,
      });
    }

    // Verify all critical data sources are available
    const criticalSources = ['tech4palestine', 'goodshepherd'];
    for (const source of criticalSources) {
      const sourceStatus = healthReport.dataSourcesStatus[source as keyof typeof healthReport.dataSourcesStatus];
      if (!sourceStatus?.available) {
        throw new Error(`Critical data source ${source} is not available - deployment aborted`);
      }
    }

    console.log('✅ Pre-deployment checks passed');
  }

  /**
   * Deploy changes
   */
  private async deployChanges(): Promise<void> {
    console.log('📦 Deploying changes...');

    // Initialize data consolidation service
    await dataConsolidationService.initialize();

    // Perform initial data consolidation
    await dataConsolidationService.consolidateAllData();

    // Start auto-consolidation
    dataConsolidationService.startAutoConsolidation(60); // Every 60 minutes

    console.log('✅ Changes deployed successfully');
  }

  /**
   * Start deployment monitoring
   */
  private async startDeploymentMonitoring(): Promise<void> {
    console.log('👀 Starting deployment monitoring...');

    // Run initial health check
    await this.performHealthCheck();

    // Schedule periodic health checks
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.healthCheckInterval);

    console.log(`✅ Monitoring started (interval: ${this.config.healthCheckInterval}ms)`);
  }

  /**
   * Stop deployment monitoring
   */
  private stopDeploymentMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('✅ Monitoring stopped');
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const healthReport = await systemIntegrationTestingService.runFullSystemTest();
      this.status!.healthChecks.push(healthReport);

      // Update metrics
      const performanceSummary = performanceMonitor.getSummary();
      this.status!.metrics = {
        totalRequests: performanceSummary.totalRequests,
        successfulRequests: performanceSummary.successfulRequests,
        failedRequests: performanceSummary.failedRequests,
        averageResponseTime: performanceSummary.averageResponseTime || 0,
        peakResponseTime: performanceSummary.peakResponseTime || 0,
        errorRate: performanceSummary.totalRequests > 0
          ? (performanceSummary.failedRequests / performanceSummary.totalRequests) * 100
          : 0,
        dataQualityScore: this.calculateDataQualityScore(healthReport),
      };

      // Check for performance issues
      if (this.status!.metrics.averageResponseTime > this.config.performanceThreshold.maxResponseTime) {
        this.status!.issues.push({
          severity: 'warning',
          message: `Average response time (${this.status!.metrics.averageResponseTime}ms) exceeds threshold (${this.config.performanceThreshold.maxResponseTime}ms)`,
          timestamp: new Date(),
          resolved: false,
        });
      }

      if (this.status!.metrics.errorRate > this.config.performanceThreshold.maxErrorRate) {
        this.status!.issues.push({
          severity: 'critical',
          message: `Error rate (${this.status!.metrics.errorRate.toFixed(2)}%) exceeds threshold (${this.config.performanceThreshold.maxErrorRate}%)`,
          timestamp: new Date(),
          resolved: false,
        });

        // Trigger rollback if auto-rollback is enabled
        if (this.config.autoRollbackOnFailure && this.config.enableRollback) {
          console.log('🔄 High error rate detected - initiating automatic rollback...');
          await this.rollback();
        }
      }

      // Check for critical system status
      if (healthReport.overallStatus === 'critical') {
        this.status!.issues.push({
          severity: 'critical',
          message: 'System health is critical',
          timestamp: new Date(),
          resolved: false,
        });

        if (this.config.autoRollbackOnFailure && this.config.enableRollback) {
          console.log('🔄 Critical system health - initiating automatic rollback...');
          await this.rollback();
        }
      }
    } catch (error) {
      console.error('Health check failed:', error);
      this.status!.issues.push({
        severity: 'warning',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        resolved: false,
      });
    }
  }

  /**
   * Calculate data quality score
   */
  private calculateDataQualityScore(healthReport: SystemHealthReport): number {
    const passedTests = healthReport.componentTests.filter(t => t.status === 'passed').length;
    const totalTests = healthReport.componentTests.length;
    
    if (totalTests === 0) return 0;
    
    return (passedTests / totalTests) * 100;
  }

  /**
   * Run post-deployment validation
   */
  private async runPostDeploymentValidation(): Promise<void> {
    console.log('✅ Running post-deployment validation...');

    // Run comprehensive system test
    const healthReport = await systemIntegrationTestingService.runFullSystemTest();
    this.status!.healthChecks.push(healthReport);

    // Validate that all components are working
    const failedComponents = healthReport.componentTests.filter(t => t.status === 'failed');
    if (failedComponents.length > 0) {
      throw new Error(`${failedComponents.length} component(s) failed validation`);
    }

    // Validate performance
    const performanceTest = healthReport.performanceTests[0];
    if (performanceTest && performanceTest.status === 'failed') {
      throw new Error('Performance validation failed');
    }

    console.log('✅ Post-deployment validation passed');
  }

  /**
   * Create rollback snapshot
   */
  private async createRollbackSnapshot(reason: string): Promise<void> {
    console.log('📸 Creating rollback snapshot...');

    const snapshot: RollbackSnapshot = {
      timestamp: new Date(),
      configuration: {
        dataSources: apiOrchestrator.getEnabledSources(),
        cacheStats: apiOrchestrator.getCacheStats(),
      },
      cacheState: {
        // Store current cache state
        stats: apiOrchestrator.getCacheStats(),
      },
      reason,
    };

    this.rollbackSnapshots.push(snapshot);

    // Keep only the last N snapshots
    if (this.rollbackSnapshots.length > this.maxRollbackSnapshots) {
      this.rollbackSnapshots.shift();
    }

    console.log('✅ Rollback snapshot created');
  }

  /**
   * Rollback to previous state
   */
  async rollback(): Promise<void> {
    if (!this.config.enableRollback) {
      throw new Error('Rollback is not enabled');
    }

    if (this.rollbackSnapshots.length === 0) {
      throw new Error('No rollback snapshots available');
    }

    console.log('🔄 Rolling back deployment...');

    const snapshot = this.rollbackSnapshots[this.rollbackSnapshots.length - 1];

    try {
      // Stop monitoring
      this.stopDeploymentMonitoring();

      // Stop auto-consolidation
      dataConsolidationService.stopAutoConsolidation();

      // Clear cache
      apiOrchestrator.clearCache();

      // Update status
      if (this.status) {
        this.status.phase = 'rolled-back';
        this.status.endTime = new Date();
        this.status.issues.push({
          severity: 'info',
          message: `Rolled back to snapshot from ${snapshot.timestamp.toISOString()}`,
          timestamp: new Date(),
          resolved: true,
        });
      }

      console.log('✅ Rollback completed successfully');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }

  /**
   * Get rollback snapshots
   */
  getRollbackSnapshots(): RollbackSnapshot[] {
    return this.rollbackSnapshots;
  }

  /**
   * Generate deployment report
   */
  generateDeploymentReport(): string {
    if (!this.status) {
      return 'No deployment in progress or completed';
    }

    const duration = this.status.endTime
      ? this.status.endTime.getTime() - this.status.startTime.getTime()
      : Date.now() - this.status.startTime.getTime();

    const report = `
# Deployment Report

## Status
- Phase: ${this.status.phase}
- Start Time: ${this.status.startTime.toISOString()}
- End Time: ${this.status.endTime?.toISOString() || 'In Progress'}
- Duration: ${Math.round(duration / 1000)}s

## Metrics
- Total Requests: ${this.status.metrics.totalRequests}
- Successful Requests: ${this.status.metrics.successfulRequests}
- Failed Requests: ${this.status.metrics.failedRequests}
- Average Response Time: ${this.status.metrics.averageResponseTime.toFixed(2)}ms
- Peak Response Time: ${this.status.metrics.peakResponseTime.toFixed(2)}ms
- Error Rate: ${this.status.metrics.errorRate.toFixed(2)}%
- Data Quality Score: ${this.status.metrics.dataQualityScore.toFixed(2)}%

## Health Checks
- Total Health Checks: ${this.status.healthChecks.length}
- Latest Status: ${this.status.healthChecks[this.status.healthChecks.length - 1]?.overallStatus || 'N/A'}

## Issues
${this.status.issues.length === 0 ? '- No issues detected' : ''}
${this.status.issues.map(issue => `- [${issue.severity.toUpperCase()}] ${issue.message} (${issue.timestamp.toISOString()})`).join('\n')}

## Recommendations
${this.status.healthChecks[this.status.healthChecks.length - 1]?.recommendations.map(r => `- ${r}`).join('\n') || '- No recommendations'}
`;

    return report;
  }

  /**
   * Export deployment status as JSON
   */
  exportDeploymentStatus(): string {
    return JSON.stringify(this.status, null, 2);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const deploymentService = new DeploymentService();
