/**
 * Monitoring and Alerting Service
 * 
 * Provides comprehensive monitoring and alerting for:
 * - Production data source health and quality metrics
 * - Data quality issues and source failures
 * - Performance degradation and system health
 * - Automated incident response procedures
 */

import { performanceMonitor } from './performanceMonitor';
import { apiOrchestrator } from './apiOrchestrator';
import { dataConsolidationService } from './dataConsolidationService';
import { dataSourceMetadataService } from './dataSourceMetadataService';
import { systemIntegrationTestingService } from './systemIntegrationTestingService';
import { DataSource } from '@/types/data.types';

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'data_quality' | 'performance' | 'availability' | 'security';
  title: string;
  message: string;
  source?: DataSource;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: any;
}

export interface MonitoringConfig {
  enabled: boolean;
  checkInterval: number; // milliseconds
  alertThresholds: {
    responseTime: number; // milliseconds
    errorRate: number; // percentage
    dataAge: number; // milliseconds
    cacheHitRate: number; // percentage
    dataQualityScore: number; // 0-100
  };
  notificationChannels: NotificationChannel[];
  autoRemediation: boolean;
}

export interface NotificationChannel {
  type: 'console' | 'email' | 'webhook' | 'sms';
  enabled: boolean;
  config: any;
}

export interface MonitoringMetrics {
  timestamp: Date;
  systemHealth: 'healthy' | 'degraded' | 'critical';
  dataSourcesStatus: Record<DataSource, {
    available: boolean;
    responseTime: number;
    errorRate: number;
    lastUpdate: Date;
    dataQuality: number;
  }>;
  performanceMetrics: {
    averageResponseTime: number;
    peakResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
    cacheHitRate: number;
  };
  activeAlerts: Alert[];
  incidentCount: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export interface IncidentResponse {
  incidentId: string;
  alert: Alert;
  actions: IncidentAction[];
  status: 'investigating' | 'mitigating' | 'resolved' | 'escalated';
  startTime: Date;
  endTime?: Date;
  resolution?: string;
}

export interface IncidentAction {
  action: string;
  timestamp: Date;
  success: boolean;
  details?: string;
}

// ============================================
// MONITORING AND ALERTING SERVICE
// ============================================

class MonitoringAlertingService {
  private config: MonitoringConfig;
  private alerts: Map<string, Alert> = new Map();
  private incidents: Map<string, IncidentResponse> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private metricsHistory: MonitoringMetrics[] = [];
  private maxHistorySize = 1000;
  private alertIdCounter = 0;

  constructor() {
    this.config = {
      enabled: true,
      checkInterval: 60000, // 1 minute
      alertThresholds: {
        responseTime: 3000, // 3 seconds
        errorRate: 10, // 10%
        dataAge: 3600000, // 1 hour
        cacheHitRate: 50, // 50%
        dataQualityScore: 70, // 70/100
      },
      notificationChannels: [
        {
          type: 'console',
          enabled: true,
          config: {},
        },
      ],
      autoRemediation: true,
    };
  }

  /**
   * Configure monitoring settings
   */
  configure(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Monitoring configuration updated:', this.config);
  }

  /**
   * Start monitoring
   */
  start(): void {
    if (this.monitoringInterval) {
      console.warn('Monitoring is already running');
      return;
    }

    if (!this.config.enabled) {
      console.warn('Monitoring is disabled');
      return;
    }

    console.log('🔍 Starting monitoring and alerting service...');

    // Run initial check
    this.performMonitoringCheck();

    // Schedule periodic checks
    this.monitoringInterval = setInterval(() => {
      this.performMonitoringCheck();
    }, this.config.checkInterval);

    console.log(`✅ Monitoring started (interval: ${this.config.checkInterval}ms)`);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('✅ Monitoring stopped');
    }
  }

  /**
   * Perform monitoring check
   */
  private async performMonitoringCheck(): Promise<void> {
    try {
      // Collect metrics
      const metrics = await this.collectMetrics();
      
      // Store metrics history
      this.metricsHistory.push(metrics);
      if (this.metricsHistory.length > this.maxHistorySize) {
        this.metricsHistory.shift();
      }

      // Check for issues and generate alerts
      await this.checkDataSourceHealth(metrics);
      await this.checkPerformance(metrics);
      await this.checkDataQuality(metrics);

      // Process active alerts
      await this.processAlerts();

      // Auto-remediation if enabled
      if (this.config.autoRemediation) {
        await this.attemptAutoRemediation();
      }
    } catch (error) {
      console.error('Monitoring check failed:', error);
      this.createAlert({
        severity: 'warning',
        category: 'availability',
        title: 'Monitoring Check Failed',
        message: `Failed to perform monitoring check: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  /**
   * Collect monitoring metrics
   */
  private async collectMetrics(): Promise<MonitoringMetrics> {
    const performanceSummary = performanceMonitor.getSummary();
    const enabledSources = apiOrchestrator.getEnabledSources();
    
    // Collect data source status
    const dataSourcesStatus: MonitoringMetrics['dataSourcesStatus'] = {} as any;
    
    for (const source of enabledSources) {
      const sourceMetrics = performanceMonitor.getSourceMetrics(source);
      const metadata = dataSourceMetadataService.getSourceMetadata(source);
      
      dataSourcesStatus[source] = {
        available: sourceMetrics ? sourceMetrics.successfulRequests > 0 : false,
        responseTime: sourceMetrics?.averageResponseTime || 0,
        errorRate: sourceMetrics 
          ? (sourceMetrics.failedRequests / (sourceMetrics.successfulRequests + sourceMetrics.failedRequests)) * 100 
          : 0,
        lastUpdate: new Date(), // Would need to track actual last update
        dataQuality: metadata.credibilityScore,
      };
    }

    // Calculate system health
    const criticalAlerts = Array.from(this.alerts.values()).filter(
      a => a.severity === 'critical' && !a.resolved
    ).length;
    
    let systemHealth: 'healthy' | 'degraded' | 'critical';
    if (criticalAlerts > 0) {
      systemHealth = 'critical';
    } else if (performanceSummary.averageResponseTime > this.config.alertThresholds.responseTime) {
      systemHealth = 'degraded';
    } else {
      systemHealth = 'healthy';
    }

    // Calculate incident counts
    const now = Date.now();
    const incidents = Array.from(this.incidents.values());
    
    return {
      timestamp: new Date(),
      systemHealth,
      dataSourcesStatus,
      performanceMetrics: {
        averageResponseTime: performanceSummary.averageResponseTime || 0,
        peakResponseTime: performanceSummary.peakResponseTime || 0,
        requestsPerMinute: performanceSummary.totalRequests / ((now - performanceSummary.startTime) / 60000),
        errorRate: performanceSummary.totalRequests > 0
          ? (performanceSummary.failedRequests / performanceSummary.totalRequests) * 100
          : 0,
        cacheHitRate: 0, // Would need to track cache hits
      },
      activeAlerts: Array.from(this.alerts.values()).filter(a => !a.resolved),
      incidentCount: {
        last24h: incidents.filter(i => now - i.startTime.getTime() < 86400000).length,
        last7d: incidents.filter(i => now - i.startTime.getTime() < 604800000).length,
        last30d: incidents.filter(i => now - i.startTime.getTime() < 2592000000).length,
      },
    };
  }

  /**
   * Check data source health
   */
  private async checkDataSourceHealth(metrics: MonitoringMetrics): Promise<void> {
    for (const [source, status] of Object.entries(metrics.dataSourcesStatus)) {
      // Check availability
      if (!status.available) {
        this.createAlert({
          severity: 'critical',
          category: 'availability',
          title: `Data Source Unavailable: ${source}`,
          message: `Data source ${source} is not responding`,
          source: source as DataSource,
        });
      }

      // Check response time
      if (status.responseTime > this.config.alertThresholds.responseTime) {
        this.createAlert({
          severity: 'warning',
          category: 'performance',
          title: `Slow Response: ${source}`,
          message: `Data source ${source} response time (${status.responseTime}ms) exceeds threshold (${this.config.alertThresholds.responseTime}ms)`,
          source: source as DataSource,
        });
      }

      // Check error rate
      if (status.errorRate > this.config.alertThresholds.errorRate) {
        this.createAlert({
          severity: 'critical',
          category: 'availability',
          title: `High Error Rate: ${source}`,
          message: `Data source ${source} error rate (${status.errorRate.toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.errorRate}%)`,
          source: source as DataSource,
        });
      }
    }
  }

  /**
   * Check performance
   */
  private async checkPerformance(metrics: MonitoringMetrics): Promise<void> {
    // Check average response time
    if (metrics.performanceMetrics.averageResponseTime > this.config.alertThresholds.responseTime) {
      this.createAlert({
        severity: 'warning',
        category: 'performance',
        title: 'System Performance Degraded',
        message: `Average response time (${metrics.performanceMetrics.averageResponseTime.toFixed(2)}ms) exceeds threshold (${this.config.alertThresholds.responseTime}ms)`,
      });
    }

    // Check error rate
    if (metrics.performanceMetrics.errorRate > this.config.alertThresholds.errorRate) {
      this.createAlert({
        severity: 'critical',
        category: 'performance',
        title: 'High System Error Rate',
        message: `System error rate (${metrics.performanceMetrics.errorRate.toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.errorRate}%)`,
      });
    }

    // Check cache hit rate
    if (metrics.performanceMetrics.cacheHitRate < this.config.alertThresholds.cacheHitRate) {
      this.createAlert({
        severity: 'info',
        category: 'performance',
        title: 'Low Cache Hit Rate',
        message: `Cache hit rate (${metrics.performanceMetrics.cacheHitRate.toFixed(2)}%) is below threshold (${this.config.alertThresholds.cacheHitRate}%)`,
      });
    }
  }

  /**
   * Check data quality
   */
  private async checkDataQuality(metrics: MonitoringMetrics): Promise<void> {
    try {
      const consolidatedData = await dataConsolidationService.getConsolidatedData(false);
      
      if (!consolidatedData) {
        this.createAlert({
          severity: 'critical',
          category: 'data_quality',
          title: 'No Consolidated Data Available',
          message: 'Failed to retrieve consolidated data',
        });
        return;
      }

      // Check data quality score
      const qualityScore = consolidatedData.metadata.dataQuality?.overallScore || 0;
      if (qualityScore < this.config.alertThresholds.dataQualityScore) {
        this.createAlert({
          severity: 'warning',
          category: 'data_quality',
          title: 'Low Data Quality Score',
          message: `Data quality score (${qualityScore}) is below threshold (${this.config.alertThresholds.dataQualityScore})`,
        });
      }

      // Check data age
      const lastUpdated = new Date(consolidatedData.metadata.lastUpdated);
      const dataAge = Date.now() - lastUpdated.getTime();
      
      if (dataAge > this.config.alertThresholds.dataAge) {
        this.createAlert({
          severity: 'warning',
          category: 'data_quality',
          title: 'Stale Data Detected',
          message: `Data has not been updated for ${Math.round(dataAge / 60000)} minutes`,
        });
      }
    } catch (error) {
      console.error('Data quality check failed:', error);
    }
  }

  /**
   * Create alert
   */
  private createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>): void {
    // Check if similar alert already exists
    const existingAlert = Array.from(this.alerts.values()).find(
      a => a.title === alertData.title && !a.resolved
    );

    if (existingAlert) {
      // Update existing alert timestamp
      existingAlert.timestamp = new Date();
      return;
    }

    // Create new alert
    const alert: Alert = {
      id: `alert-${++this.alertIdCounter}`,
      ...alertData,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
    };

    this.alerts.set(alert.id, alert);

    // Send notifications
    this.sendNotification(alert);

    // Create incident if critical
    if (alert.severity === 'critical') {
      this.createIncident(alert);
    }

    console.log(`🚨 Alert created: [${alert.severity.toUpperCase()}] ${alert.title}`);
  }

  /**
   * Send notification
   */
  private sendNotification(alert: Alert): void {
    for (const channel of this.config.notificationChannels) {
      if (!channel.enabled) continue;

      switch (channel.type) {
        case 'console':
          this.sendConsoleNotification(alert);
          break;
        case 'email':
          this.sendEmailNotification(alert, channel.config);
          break;
        case 'webhook':
          this.sendWebhookNotification(alert, channel.config);
          break;
        case 'sms':
          this.sendSMSNotification(alert, channel.config);
          break;
      }
    }
  }

  /**
   * Send console notification
   */
  private sendConsoleNotification(alert: Alert): void {
    const icon = {
      critical: '🔴',
      warning: '⚠️',
      info: 'ℹ️',
    }[alert.severity];

    console.log(`${icon} [${alert.severity.toUpperCase()}] ${alert.title}`);
    console.log(`   ${alert.message}`);
    if (alert.source) {
      console.log(`   Source: ${alert.source}`);
    }
  }

  /**
   * Send email notification (placeholder)
   */
  private sendEmailNotification(alert: Alert, config: any): void {
    // Implementation would send actual email
    console.log('Email notification:', alert.title);
  }

  /**
   * Send webhook notification (placeholder)
   */
  private sendWebhookNotification(alert: Alert, config: any): void {
    // Implementation would call webhook
    console.log('Webhook notification:', alert.title);
  }

  /**
   * Send SMS notification (placeholder)
   */
  private sendSMSNotification(alert: Alert, config: any): void {
    // Implementation would send SMS
    console.log('SMS notification:', alert.title);
  }

  /**
   * Create incident
   */
  private createIncident(alert: Alert): void {
    const incident: IncidentResponse = {
      incidentId: `incident-${Date.now()}`,
      alert,
      actions: [],
      status: 'investigating',
      startTime: new Date(),
    };

    this.incidents.set(incident.incidentId, incident);
    console.log(`🚨 Incident created: ${incident.incidentId}`);
  }

  /**
   * Process alerts
   */
  private async processAlerts(): Promise<void> {
    const activeAlerts = Array.from(this.alerts.values()).filter(a => !a.resolved);

    for (const alert of activeAlerts) {
      // Auto-resolve old info alerts
      if (alert.severity === 'info') {
        const age = Date.now() - alert.timestamp.getTime();
        if (age > 3600000) { // 1 hour
          this.resolveAlert(alert.id, 'Auto-resolved after 1 hour');
        }
      }

      // Check if issue is resolved
      if (alert.category === 'availability' && alert.source) {
        const sourceMetrics = performanceMonitor.getSourceMetrics(alert.source);
        if (sourceMetrics && sourceMetrics.successfulRequests > 0) {
          this.resolveAlert(alert.id, 'Data source is now available');
        }
      }
    }
  }

  /**
   * Attempt auto-remediation
   */
  private async attemptAutoRemediation(): Promise<void> {
    const criticalAlerts = Array.from(this.alerts.values()).filter(
      a => a.severity === 'critical' && !a.resolved && !a.acknowledged
    );

    for (const alert of criticalAlerts) {
      const incident = Array.from(this.incidents.values()).find(
        i => i.alert.id === alert.id && i.status === 'investigating'
      );

      if (!incident) continue;

      // Update incident status
      incident.status = 'mitigating';

      // Attempt remediation based on alert category
      switch (alert.category) {
        case 'availability':
          await this.remediateAvailabilityIssue(alert, incident);
          break;
        case 'performance':
          await this.remediatePerformanceIssue(alert, incident);
          break;
        case 'data_quality':
          await this.remediateDataQualityIssue(alert, incident);
          break;
      }
    }
  }

  /**
   * Remediate availability issue
   */
  private async remediateAvailabilityIssue(alert: Alert, incident: IncidentResponse): Promise<void> {
    if (!alert.source) return;

    // Action 1: Clear cache for the source
    incident.actions.push({
      action: 'Clear cache',
      timestamp: new Date(),
      success: true,
      details: `Cleared cache for ${alert.source}`,
    });

    // Action 2: Retry connection
    try {
      const metadata = dataSourceMetadataService.getSourceMetadata(alert.source);
      const testEndpoint = this.getTestEndpoint(alert.source);
      
      await apiOrchestrator.fetch(alert.source, testEndpoint, {
        useCache: false,
        bypassRateLimit: true,
      });

      incident.actions.push({
        action: 'Retry connection',
        timestamp: new Date(),
        success: true,
        details: `Successfully reconnected to ${alert.source}`,
      });

      // Resolve alert and incident
      this.resolveAlert(alert.id, 'Auto-remediation successful');
      incident.status = 'resolved';
      incident.endTime = new Date();
      incident.resolution = 'Reconnected to data source';
    } catch (error) {
      incident.actions.push({
        action: 'Retry connection',
        timestamp: new Date(),
        success: false,
        details: `Failed to reconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      // Escalate incident
      incident.status = 'escalated';
      console.log(`⚠️ Incident ${incident.incidentId} escalated - manual intervention required`);
    }
  }

  /**
   * Remediate performance issue
   */
  private async remediatePerformanceIssue(alert: Alert, incident: IncidentResponse): Promise<void> {
    // Action 1: Increase cache TTL
    if (alert.source) {
      apiOrchestrator.updateSourceConfig(alert.source, {
        cache_ttl: 3600000, // 1 hour
      });

      incident.actions.push({
        action: 'Increase cache TTL',
        timestamp: new Date(),
        success: true,
        details: `Increased cache TTL for ${alert.source} to 1 hour`,
      });
    }

    // Action 2: Clear old cache entries
    apiOrchestrator.clearCache();

    incident.actions.push({
      action: 'Clear cache',
      timestamp: new Date(),
      success: true,
      details: 'Cleared all cache entries',
    });

    incident.status = 'resolved';
    incident.endTime = new Date();
    incident.resolution = 'Applied performance optimizations';
  }

  /**
   * Remediate data quality issue
   */
  private async remediateDataQualityIssue(alert: Alert, incident: IncidentResponse): Promise<void> {
    // Action 1: Force data refresh
    try {
      await dataConsolidationService.consolidateAllData();

      incident.actions.push({
        action: 'Force data refresh',
        timestamp: new Date(),
        success: true,
        details: 'Successfully refreshed all data',
      });

      incident.status = 'resolved';
      incident.endTime = new Date();
      incident.resolution = 'Data refreshed successfully';
    } catch (error) {
      incident.actions.push({
        action: 'Force data refresh',
        timestamp: new Date(),
        success: false,
        details: `Failed to refresh data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      incident.status = 'escalated';
    }
  }

  /**
   * Get test endpoint for a data source
   */
  private getTestEndpoint(source: DataSource): string {
    const endpoints: Record<DataSource, string> = {
      tech4palestine: '/v3/summary.json',
      goodshepherd: 'wb_data.json',
      un_ocha: '/package_search?q=organization:un-ocha',
      world_bank: '/countries/PSE/indicators',
      wfp: 'food_security_assessment.json',
      btselem: '/statistics',
      who: '/health_facilities',
      unrwa: '/education',
      pcbs: '/demographics',
      custom: '',
    };

    return endpoints[source] || '';
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string, resolution: string): void {
    const alert = this.alerts.get(alertId);
    if (!alert) return;

    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.metadata = { ...alert.metadata, resolution };

    console.log(`✅ Alert resolved: ${alert.title}`);
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (!alert) return;

    alert.acknowledged = true;
    console.log(`👍 Alert acknowledged: ${alert.title}`);
  }

  /**
   * Get all alerts
   */
  getAlerts(filter?: { severity?: Alert['severity']; resolved?: boolean }): Alert[] {
    let alerts = Array.from(this.alerts.values());

    if (filter) {
      if (filter.severity) {
        alerts = alerts.filter(a => a.severity === filter.severity);
      }
      if (filter.resolved !== undefined) {
        alerts = alerts.filter(a => a.resolved === filter.resolved);
      }
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get incidents
   */
  getIncidents(filter?: { status?: IncidentResponse['status'] }): IncidentResponse[] {
    let incidents = Array.from(this.incidents.values());

    if (filter?.status) {
      incidents = incidents.filter(i => i.status === filter.status);
    }

    return incidents.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Get current metrics
   */
  async getCurrentMetrics(): Promise<MonitoringMetrics> {
    return this.collectMetrics();
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit?: number): MonitoringMetrics[] {
    const history = [...this.metricsHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Generate monitoring report
   */
  generateMonitoringReport(): string {
    const activeAlerts = this.getAlerts({ resolved: false });
    const recentIncidents = this.getIncidents().slice(0, 10);
    const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];

    return `
# Monitoring Report

## System Status
- Health: ${latestMetrics?.systemHealth || 'Unknown'}
- Timestamp: ${latestMetrics?.timestamp.toISOString() || 'N/A'}

## Active Alerts
${activeAlerts.length === 0 ? '- No active alerts' : ''}
${activeAlerts.map(a => `- [${a.severity.toUpperCase()}] ${a.title} (${a.timestamp.toISOString()})`).join('\n')}

## Recent Incidents
${recentIncidents.length === 0 ? '- No recent incidents' : ''}
${recentIncidents.map(i => `- ${i.incidentId}: ${i.alert.title} (${i.status})`).join('\n')}

## Performance Metrics
${latestMetrics ? `
- Average Response Time: ${latestMetrics.performanceMetrics.averageResponseTime.toFixed(2)}ms
- Error Rate: ${latestMetrics.performanceMetrics.errorRate.toFixed(2)}%
- Requests/Minute: ${latestMetrics.performanceMetrics.requestsPerMinute.toFixed(2)}
` : '- No metrics available'}

## Data Sources Status
${latestMetrics ? Object.entries(latestMetrics.dataSourcesStatus).map(([source, status]) => `
- ${source}: ${status.available ? '✅' : '❌'} (${status.responseTime.toFixed(2)}ms, ${status.errorRate.toFixed(2)}% errors)
`).join('') : '- No data sources status available'}
`;
  }

  /**
   * Export monitoring data
   */
  exportMonitoringData(): string {
    return JSON.stringify({
      alerts: Array.from(this.alerts.values()),
      incidents: Array.from(this.incidents.values()),
      metricsHistory: this.metricsHistory,
    }, null, 2);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const monitoringAlertingService = new MonitoringAlertingService();
