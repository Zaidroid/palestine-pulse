/**
 * Performance Monitor Service
 * 
 * Implements comprehensive performance monitoring:
 * - API response time tracking
 * - Success/failure rate monitoring
 * - Performance degradation detection
 * - Alerting for performance issues
 * - Performance dashboards and metrics
 */

import { DataSource } from '@/types/data.types';

// ============================================
// PERFORMANCE METRICS
// ============================================

export interface PerformanceMetrics {
  source: DataSource;
  endpoint: string;
  
  // Response time metrics
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  
  // Request metrics
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  
  // Error metrics
  errors: PerformanceError[];
  errorRate: number;
  
  // Time window
  windowStart: Date;
  windowEnd: Date;
}

export interface PerformanceError {
  timestamp: Date;
  message: string;
  statusCode?: number;
  responseTime?: number;
}

export interface PerformanceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  source: DataSource;
  message: string;
  timestamp: Date;
  metrics: Partial<PerformanceMetrics>;
  acknowledged: boolean;
}

// ============================================
// PERFORMANCE THRESHOLDS
// ============================================

export interface PerformanceThresholds {
  maxAvgResponseTime: number; // ms
  maxP95ResponseTime: number; // ms
  minSuccessRate: number; // percentage (0-100)
  maxErrorRate: number; // percentage (0-100)
  degradationThreshold: number; // percentage increase
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxAvgResponseTime: 5000, // 5 seconds
  maxP95ResponseTime: 10000, // 10 seconds
  minSuccessRate: 95, // 95%
  maxErrorRate: 5, // 5%
  degradationThreshold: 50, // 50% increase
};

// ============================================
// REQUEST RECORD
// ============================================

interface RequestRecord {
  source: DataSource;
  endpoint: string;
  timestamp: Date;
  responseTime: number;
  success: boolean;
  error?: string;
  statusCode?: number;
}

// ============================================
// PERFORMANCE MONITOR
// ============================================

export class PerformanceMonitor {
  private records: RequestRecord[] = [];
  private maxRecords: number = 10000;
  private windowSize: number = 60 * 60 * 1000; // 1 hour
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS;
  private alerts: PerformanceAlert[] = [];
  private alertCallbacks: Set<(alert: PerformanceAlert) => void> = new Set();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  /**
   * Initialize the performance monitor
   */
  initialize(thresholds?: Partial<PerformanceThresholds>): void {
    if (thresholds) {
      this.thresholds = { ...this.thresholds, ...thresholds };
    }
    console.log('Performance Monitor initialized', this.thresholds);
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(): void {
    // Check performance every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkPerformance();
      this.cleanupOldRecords();
    }, 30000);
  }

  /**
   * Record a request
   */
  recordRequest(
    source: DataSource,
    endpoint: string,
    responseTime: number,
    success: boolean,
    error?: string,
    statusCode?: number
  ): void {
    const record: RequestRecord = {
      source,
      endpoint,
      timestamp: new Date(),
      responseTime,
      success,
      error,
      statusCode,
    };

    this.records.push(record);

    // Trim records if we exceed max
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
  }

  /**
   * Get metrics for a specific source
   */
  getSourceMetrics(source: DataSource, timeWindow?: number): PerformanceMetrics {
    const window = timeWindow || this.windowSize;
    const cutoff = Date.now() - window;
    
    const records = this.records.filter(
      r => r.source === source && r.timestamp.getTime() > cutoff
    );

    return this.calculateMetrics(source, 'all', records);
  }

  /**
   * Get metrics for a specific endpoint
   */
  getEndpointMetrics(
    source: DataSource,
    endpoint: string,
    timeWindow?: number
  ): PerformanceMetrics {
    const window = timeWindow || this.windowSize;
    const cutoff = Date.now() - window;
    
    const records = this.records.filter(
      r => r.source === source && 
           r.endpoint === endpoint && 
           r.timestamp.getTime() > cutoff
    );

    return this.calculateMetrics(source, endpoint, records);
  }

  /**
   * Get metrics for all sources
   */
  getAllSourcesMetrics(timeWindow?: number): Record<DataSource, PerformanceMetrics> {
    const sources: DataSource[] = [
      'tech4palestine',
      'goodshepherd',
      'un_ocha',
      'world_bank',
      'wfp',
      'btselem',
      'who',
      'unrwa',
      'pcbs',
      'custom',
    ];

    const metrics: any = {};
    sources.forEach(source => {
      metrics[source] = this.getSourceMetrics(source, timeWindow);
    });

    return metrics;
  }

  /**
   * Calculate metrics from records
   */
  private calculateMetrics(
    source: DataSource,
    endpoint: string,
    records: RequestRecord[]
  ): PerformanceMetrics {
    if (records.length === 0) {
      return {
        source,
        endpoint,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p50ResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        successRate: 0,
        errors: [],
        errorRate: 0,
        windowStart: new Date(),
        windowEnd: new Date(),
      };
    }

    // Response times
    const responseTimes = records.map(r => r.responseTime).sort((a, b) => a - b);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const minResponseTime = responseTimes[0];
    const maxResponseTime = responseTimes[responseTimes.length - 1];
    
    // Percentiles
    const p50Index = Math.floor(responseTimes.length * 0.5);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);
    
    const p50ResponseTime = responseTimes[p50Index];
    const p95ResponseTime = responseTimes[p95Index];
    const p99ResponseTime = responseTimes[p99Index];

    // Request counts
    const totalRequests = records.length;
    const successfulRequests = records.filter(r => r.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const successRate = (successfulRequests / totalRequests) * 100;
    const errorRate = (failedRequests / totalRequests) * 100;

    // Errors
    const errors: PerformanceError[] = records
      .filter(r => !r.success)
      .map(r => ({
        timestamp: r.timestamp,
        message: r.error || 'Unknown error',
        statusCode: r.statusCode,
        responseTime: r.responseTime,
      }));

    // Time window
    const timestamps = records.map(r => r.timestamp.getTime());
    const windowStart = new Date(Math.min(...timestamps));
    const windowEnd = new Date(Math.max(...timestamps));

    return {
      source,
      endpoint,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      p50ResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate,
      errors,
      errorRate,
      windowStart,
      windowEnd,
    };
  }

  /**
   * Check performance and generate alerts
   */
  private checkPerformance(): void {
    const metrics = this.getAllSourcesMetrics();

    Object.entries(metrics).forEach(([source, metric]) => {
      // Skip if no requests
      if (metric.totalRequests === 0) return;

      // Check average response time
      if (metric.avgResponseTime > this.thresholds.maxAvgResponseTime) {
        this.createAlert({
          severity: 'warning',
          source: source as DataSource,
          message: `Average response time (${Math.round(metric.avgResponseTime)}ms) exceeds threshold (${this.thresholds.maxAvgResponseTime}ms)`,
          metrics: metric,
        });
      }

      // Check P95 response time
      if (metric.p95ResponseTime > this.thresholds.maxP95ResponseTime) {
        this.createAlert({
          severity: 'warning',
          source: source as DataSource,
          message: `P95 response time (${Math.round(metric.p95ResponseTime)}ms) exceeds threshold (${this.thresholds.maxP95ResponseTime}ms)`,
          metrics: metric,
        });
      }

      // Check success rate
      if (metric.successRate < this.thresholds.minSuccessRate) {
        this.createAlert({
          severity: 'critical',
          source: source as DataSource,
          message: `Success rate (${metric.successRate.toFixed(1)}%) below threshold (${this.thresholds.minSuccessRate}%)`,
          metrics: metric,
        });
      }

      // Check error rate
      if (metric.errorRate > this.thresholds.maxErrorRate) {
        this.createAlert({
          severity: 'critical',
          source: source as DataSource,
          message: `Error rate (${metric.errorRate.toFixed(1)}%) exceeds threshold (${this.thresholds.maxErrorRate}%)`,
          metrics: metric,
        });
      }
    });
  }

  /**
   * Create a performance alert
   */
  private createAlert(alert: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged'>): void {
    const newAlert: PerformanceAlert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      acknowledged: false,
      ...alert,
    };

    this.alerts.push(newAlert);

    // Notify subscribers
    this.alertCallbacks.forEach(callback => callback(newAlert));

    console.warn('Performance alert:', newAlert.message);
  }

  /**
   * Subscribe to performance alerts
   */
  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  /**
   * Get all alerts
   */
  getAlerts(includeAcknowledged: boolean = false): PerformanceAlert[] {
    if (includeAcknowledged) {
      return [...this.alerts];
    }
    return this.alerts.filter(a => !a.acknowledged);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    console.log('Performance thresholds updated:', this.thresholds);
  }

  /**
   * Get current thresholds
   */
  getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }

  /**
   * Clean up old records
   */
  private cleanupOldRecords(): void {
    const cutoff = Date.now() - (this.windowSize * 2); // Keep 2x window size
    this.records = this.records.filter(r => r.timestamp.getTime() > cutoff);
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalRequests: number;
    avgResponseTime: number;
    overallSuccessRate: number;
    activeAlerts: number;
    sourcesWithIssues: number;
  } {
    const allMetrics = this.getAllSourcesMetrics();
    const metricsArray = Object.values(allMetrics);

    const totalRequests = metricsArray.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalSuccessful = metricsArray.reduce((sum, m) => sum + m.successfulRequests, 0);
    const totalResponseTime = metricsArray.reduce(
      (sum, m) => sum + (m.avgResponseTime * m.totalRequests),
      0
    );

    const avgResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0;
    const overallSuccessRate = totalRequests > 0 ? (totalSuccessful / totalRequests) * 100 : 0;
    const activeAlerts = this.getAlerts(false).length;
    const sourcesWithIssues = metricsArray.filter(
      m => m.successRate < this.thresholds.minSuccessRate || 
           m.avgResponseTime > this.thresholds.maxAvgResponseTime
    ).length;

    return {
      totalRequests,
      avgResponseTime,
      overallSuccessRate,
      activeAlerts,
      sourcesWithIssues,
    };
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    const metrics = this.getAllSourcesMetrics();
    const summary = this.getSummary();
    const alerts = this.getAlerts(true);

    return JSON.stringify({
      summary,
      metrics,
      alerts,
      thresholds: this.thresholds,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Shutdown the monitor
   */
  shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.alertCallbacks.clear();
    console.log('Performance Monitor shut down');
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const performanceMonitor = new PerformanceMonitor();
