/**
 * Rate Limit Manager Service
 * 
 * Implements intelligent rate limit handling:
 * - Request queuing and throttling
 * - Per-source rate limit tracking
 * - Automatic backoff when limits are exceeded
 * - Fallback mechanisms for rate-limited sources
 */

import { DataSource } from '@/types/data.types';

// ============================================
// RATE LIMIT CONFIGURATION
// ============================================

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxConcurrentRequests: number;
  retryAfterMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

// Default rate limits per data source
export const RATE_LIMIT_CONFIGS: Record<DataSource, RateLimitConfig> = {
  tech4palestine: {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000,
    maxConcurrentRequests: 5,
    retryAfterMs: 1000,
    backoffMultiplier: 2,
    maxBackoffMs: 60000,
  },
  goodshepherd: {
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 500,
    maxConcurrentRequests: 3,
    retryAfterMs: 2000,
    backoffMultiplier: 2,
    maxBackoffMs: 120000,
  },
  un_ocha: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 2,
    retryAfterMs: 3000,
    backoffMultiplier: 2,
    maxBackoffMs: 180000,
  },
  world_bank: {
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 500,
    maxConcurrentRequests: 3,
    retryAfterMs: 2000,
    backoffMultiplier: 2,
    maxBackoffMs: 120000,
  },
  wfp: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 2,
    retryAfterMs: 3000,
    backoffMultiplier: 2,
    maxBackoffMs: 180000,
  },
  btselem: {
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    maxConcurrentRequests: 1,
    retryAfterMs: 5000,
    backoffMultiplier: 2,
    maxBackoffMs: 300000,
  },
  who: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 2,
    retryAfterMs: 3000,
    backoffMultiplier: 2,
    maxBackoffMs: 180000,
  },
  unrwa: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 2,
    retryAfterMs: 3000,
    backoffMultiplier: 2,
    maxBackoffMs: 180000,
  },
  pcbs: {
    maxRequestsPerMinute: 15,
    maxRequestsPerHour: 200,
    maxConcurrentRequests: 2,
    retryAfterMs: 4000,
    backoffMultiplier: 2,
    maxBackoffMs: 240000,
  },
  custom: {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000,
    maxConcurrentRequests: 5,
    retryAfterMs: 1000,
    backoffMultiplier: 2,
    maxBackoffMs: 60000,
  },
};

// ============================================
// REQUEST QUEUE
// ============================================

interface QueuedRequest<T> {
  id: string;
  source: DataSource;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  priority: number;
  timestamp: number;
  retries: number;
}

// ============================================
// RATE LIMIT TRACKER
// ============================================

interface RateLimitTracker {
  requestsLastMinute: number[];
  requestsLastHour: number[];
  activeRequests: number;
  lastRequestTime: number;
  consecutiveFailures: number;
  backoffUntil: number;
}

// ============================================
// RATE LIMIT MANAGER
// ============================================

export class RateLimitManager {
  private trackers: Map<DataSource, RateLimitTracker> = new Map();
  private queues: Map<DataSource, QueuedRequest<any>[]> = new Map();
  private configs: Map<DataSource, RateLimitConfig> = new Map();
  private processingIntervals: Map<DataSource, NodeJS.Timeout> = new Map();

  constructor() {
    // Initialize trackers and configs for all sources
    Object.entries(RATE_LIMIT_CONFIGS).forEach(([source, config]) => {
      this.trackers.set(source as DataSource, {
        requestsLastMinute: [],
        requestsLastHour: [],
        activeRequests: 0,
        lastRequestTime: 0,
        consecutiveFailures: 0,
        backoffUntil: 0,
      });
      this.configs.set(source as DataSource, config);
      this.queues.set(source as DataSource, []);
    });
  }

  /**
   * Initialize the rate limit manager
   */
  initialize(): void {
    // Start processing queues for all sources
    this.configs.forEach((_, source) => {
      this.startQueueProcessing(source);
    });

    console.log('Rate Limit Manager initialized');
  }

  /**
   * Enqueue a request with rate limiting
   */
  async enqueueRequest<T>(
    source: DataSource,
    execute: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest<T> = {
        id: `${source}-${Date.now()}-${Math.random()}`,
        source,
        execute,
        resolve,
        reject,
        priority,
        timestamp: Date.now(),
        retries: 0,
      };

      const queue = this.queues.get(source)!;
      queue.push(request);

      // Sort by priority (higher first) and timestamp (older first)
      queue.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.timestamp - b.timestamp;
      });

      this.queues.set(source, queue);
    });
  }

  /**
   * Start processing queue for a source
   */
  private startQueueProcessing(source: DataSource): void {
    // Clear existing interval if any
    const existingInterval = this.processingIntervals.get(source);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Process queue every 100ms
    const interval = setInterval(() => {
      this.processQueue(source);
    }, 100);

    this.processingIntervals.set(source, interval);
  }

  /**
   * Process queued requests for a source
   */
  private async processQueue(source: DataSource): Promise<void> {
    const queue = this.queues.get(source)!;
    const tracker = this.trackers.get(source)!;
    const config = this.configs.get(source)!;

    // Check if we're in backoff period
    if (Date.now() < tracker.backoffUntil) {
      return;
    }

    // Clean up old request timestamps
    this.cleanupRequestTimestamps(source);

    // Check if we can process more requests
    if (!this.canProcessRequest(source)) {
      return;
    }

    // Get next request from queue
    const request = queue.shift();
    if (!request) {
      return;
    }

    // Update tracker
    tracker.activeRequests++;
    tracker.lastRequestTime = Date.now();
    tracker.requestsLastMinute.push(Date.now());
    tracker.requestsLastHour.push(Date.now());

    try {
      // Execute the request
      const result = await request.execute();
      
      // Success - reset consecutive failures
      tracker.consecutiveFailures = 0;
      tracker.backoffUntil = 0;
      
      request.resolve(result);
    } catch (error) {
      // Handle rate limit errors
      if (this.isRateLimitError(error)) {
        console.warn(`Rate limit hit for ${source}, applying backoff`);
        
        tracker.consecutiveFailures++;
        const backoffMs = this.calculateBackoff(source, tracker.consecutiveFailures);
        tracker.backoffUntil = Date.now() + backoffMs;

        // Retry the request if we haven't exceeded max retries
        if (request.retries < 3) {
          request.retries++;
          queue.unshift(request); // Put back at front of queue
          console.log(`Retrying request for ${source} (attempt ${request.retries + 1})`);
        } else {
          request.reject(new Error(`Rate limit exceeded for ${source} after ${request.retries} retries`));
        }
      } else {
        // Other errors - reject immediately
        request.reject(error as Error);
      }
    } finally {
      tracker.activeRequests--;
    }
  }

  /**
   * Check if we can process a request for a source
   */
  private canProcessRequest(source: DataSource): boolean {
    const tracker = this.trackers.get(source)!;
    const config = this.configs.get(source)!;

    // Check concurrent requests
    if (tracker.activeRequests >= config.maxConcurrentRequests) {
      return false;
    }

    // Check requests per minute
    if (tracker.requestsLastMinute.length >= config.maxRequestsPerMinute) {
      return false;
    }

    // Check requests per hour
    if (tracker.requestsLastHour.length >= config.maxRequestsPerHour) {
      return false;
    }

    return true;
  }

  /**
   * Clean up old request timestamps
   */
  private cleanupRequestTimestamps(source: DataSource): void {
    const tracker = this.trackers.get(source)!;
    const now = Date.now();

    // Remove requests older than 1 minute
    tracker.requestsLastMinute = tracker.requestsLastMinute.filter(
      timestamp => now - timestamp < 60000
    );

    // Remove requests older than 1 hour
    tracker.requestsLastHour = tracker.requestsLastHour.filter(
      timestamp => now - timestamp < 3600000
    );
  }

  /**
   * Calculate backoff duration
   */
  private calculateBackoff(source: DataSource, failures: number): number {
    const config = this.configs.get(source)!;
    const backoff = config.retryAfterMs * Math.pow(config.backoffMultiplier, failures - 1);
    return Math.min(backoff, config.maxBackoffMs);
  }

  /**
   * Check if error is a rate limit error
   */
  private isRateLimitError(error: any): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('rate limit') ||
        message.includes('too many requests') ||
        message.includes('429')
      );
    }
    return false;
  }

  /**
   * Get current status for a source
   */
  getSourceStatus(source: DataSource): {
    queueLength: number;
    activeRequests: number;
    requestsLastMinute: number;
    requestsLastHour: number;
    isBackedOff: boolean;
    backoffEndsIn: number;
  } {
    const queue = this.queues.get(source)!;
    const tracker = this.trackers.get(source)!;
    const now = Date.now();

    return {
      queueLength: queue.length,
      activeRequests: tracker.activeRequests,
      requestsLastMinute: tracker.requestsLastMinute.length,
      requestsLastHour: tracker.requestsLastHour.length,
      isBackedOff: now < tracker.backoffUntil,
      backoffEndsIn: Math.max(0, tracker.backoffUntil - now),
    };
  }

  /**
   * Get status for all sources
   */
  getAllSourcesStatus(): Record<DataSource, ReturnType<typeof this.getSourceStatus>> {
    const status: any = {};
    this.configs.forEach((_, source) => {
      status[source] = this.getSourceStatus(source);
    });
    return status;
  }

  /**
   * Update rate limit config for a source
   */
  updateConfig(source: DataSource, config: Partial<RateLimitConfig>): void {
    const currentConfig = this.configs.get(source)!;
    this.configs.set(source, { ...currentConfig, ...config });
    console.log(`Updated rate limit config for ${source}`, config);
  }

  /**
   * Clear queue for a source
   */
  clearQueue(source: DataSource): void {
    const queue = this.queues.get(source)!;
    queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queues.set(source, []);
  }

  /**
   * Clear all queues
   */
  clearAllQueues(): void {
    this.queues.forEach((_, source) => {
      this.clearQueue(source);
    });
  }

  /**
   * Reset backoff for a source
   */
  resetBackoff(source: DataSource): void {
    const tracker = this.trackers.get(source)!;
    tracker.consecutiveFailures = 0;
    tracker.backoffUntil = 0;
    console.log(`Reset backoff for ${source}`);
  }

  /**
   * Shutdown the rate limit manager
   */
  shutdown(): void {
    // Clear all intervals
    this.processingIntervals.forEach(interval => {
      clearInterval(interval);
    });
    this.processingIntervals.clear();

    // Clear all queues
    this.clearAllQueues();

    console.log('Rate Limit Manager shut down');
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const rateLimitManager = new RateLimitManager();
