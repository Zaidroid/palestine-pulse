# Automatic Data Refresh and Caching System

## Overview

This document describes the comprehensive automatic data refresh and caching system implemented for the Palestine Pulse dashboard. The system provides intelligent data refresh mechanisms, robust caching, graceful error handling, and performance monitoring.

## Components

### 1. Enhanced Data Consolidation Service

**File**: `src/services/dataConsolidationService.ts`

**Features**:
- Intelligent caching with appropriate TTL for different data types
- Automatic retry logic with exponential backoff
- Per-data-type cache TTL configuration
- Enhanced IndexedDB storage with retry tracking
- Improved error handling and recovery

**Cache TTL Configuration**:
```typescript
- Real-time data (casualties, press): 5 minutes
- Frequently updated (displacement, food security): 15 minutes
- Hourly updated (infrastructure, violence): 1 hour
- Daily updated (economic, settlements, prisoners): 24 hours
```

**Retry Configuration**:
- Max attempts: 3
- Initial delay: 1 second
- Max delay: 30 seconds
- Backoff multiplier: 2x

### 2. Real-time Data Refresh Service

**File**: `src/services/dataRefreshService.ts`

**Features**:
- Background data refresh without interrupting user experience
- Visual loading indicators during data fetching
- Manual refresh capabilities
- Automatic refresh on window focus
- Automatic refresh on network reconnection
- Configurable refresh intervals
- Progress tracking and status updates

**Configuration Options**:
```typescript
interface RefreshConfig {
  autoRefreshEnabled: boolean;
  refreshInterval: number; // default: 5 minutes
  backgroundRefresh: boolean;
  showLoadingIndicators: boolean;
  refreshOnFocus: boolean;
  refreshOnReconnect: boolean;
}
```

### 3. React Hook for Data Refresh

**File**: `src/hooks/useDataRefresh.ts`

**Hooks Provided**:
- `useDataRefresh()`: Full refresh control and status
- `useRefreshButton()`: Simple refresh button hook
- `useSourceRefresh(sources)`: Monitor specific data sources

**Example Usage**:
```typescript
const { isRefreshing, refresh, status } = useDataRefresh();

// Manual refresh
await refresh({ forceRefresh: true });

// Refresh specific sources
await refresh({ sources: ['tech4palestine', 'goodshepherd'] });
```

### 4. Data Refresh Indicator Component

**File**: `src/components/v3/shared/DataRefreshIndicator.tsx`

**Variants**:
- `full`: Complete status display with progress and errors
- `compact`: Toolbar-friendly compact display
- `button-only`: Simple refresh button with tooltip

**Features**:
- Real-time progress tracking
- Error display and retry functionality
- Last update timestamp
- Next refresh countdown

### 5. API Rate Limit Manager

**File**: `src/services/rateLimitManager.ts`

**Features**:
- Per-source rate limit tracking
- Request queuing and prioritization
- Automatic backoff when limits exceeded
- Concurrent request limiting
- Requests per minute/hour tracking

**Rate Limit Configuration** (per source):
```typescript
interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxConcurrentRequests: number;
  retryAfterMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}
```

**Default Limits**:
- Tech4Palestine: 60/min, 1000/hour, 5 concurrent
- Good Shepherd: 30/min, 500/hour, 3 concurrent
- UN OCHA: 20/min, 300/hour, 2 concurrent
- World Bank: 30/min, 500/hour, 3 concurrent
- B'Tselem: 10/min, 100/hour, 1 concurrent (most restrictive)

### 6. Performance Monitor

**File**: `src/services/performanceMonitor.ts`

**Features**:
- API response time tracking (avg, min, max, p50, p95, p99)
- Success/failure rate monitoring
- Performance degradation detection
- Automatic alerting for performance issues
- Comprehensive metrics export

**Performance Thresholds**:
```typescript
interface PerformanceThresholds {
  maxAvgResponseTime: 5000ms;
  maxP95ResponseTime: 10000ms;
  minSuccessRate: 95%;
  maxErrorRate: 5%;
  degradationThreshold: 50%;
}
```

**Alert Severities**:
- `info`: Informational alerts
- `warning`: Performance degradation
- `critical`: Service failures or severe degradation

### 7. Performance Dashboard Component

**File**: `src/components/v3/shared/PerformanceDashboard.tsx`

**Features**:
- Real-time performance metrics display
- Summary cards (total requests, avg response time, success rate, alerts)
- Active alerts display
- Source-specific metrics
- Multiple views (overview, response times, success rates)

## Integration

### API Orchestrator Integration

The API orchestrator has been enhanced to integrate all the new services:

```typescript
// Rate limiting
await apiOrchestrator.fetch('tech4palestine', '/endpoint', {
  priority: 1, // Higher priority requests
  bypassRateLimit: false // Respect rate limits
});

// Performance monitoring
const metrics = apiOrchestrator.getPerformanceMetrics();
const summary = apiOrchestrator.getPerformanceSummary();
const alerts = apiOrchestrator.getPerformanceAlerts();

// Rate limit status
const rateLimitStatus = apiOrchestrator.getRateLimitStats();
```

### Data Consolidation Service Integration

The data consolidation service now uses:
- Intelligent caching with per-data-type TTL
- Automatic retry with exponential backoff
- Performance monitoring for all requests
- Rate limiting for all API calls

## Usage Examples

### 1. Initialize Services

```typescript
import { dataRefreshService } from '@/services/dataRefreshService';
import { performanceMonitor } from '@/services/performanceMonitor';

// Initialize with custom config
await dataRefreshService.initialize({
  autoRefreshEnabled: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  refreshOnFocus: true,
});

performanceMonitor.initialize({
  maxAvgResponseTime: 3000, // 3 seconds
  minSuccessRate: 98, // 98%
});
```

### 2. Use Refresh Components

```typescript
import { DataRefreshIndicator } from '@/components/v3/shared/DataRefreshIndicator';

// In a toolbar
<DataRefreshIndicator variant="compact" />

// In a header
<DataRefreshIndicator variant="button-only" />

// Full status display
<DataRefreshIndicator variant="full" showProgress showErrors />
```

### 3. Monitor Performance

```typescript
import { PerformanceDashboard } from '@/components/v3/shared/PerformanceDashboard';

// Display performance dashboard
<PerformanceDashboard />

// Subscribe to alerts
performanceMonitor.onAlert((alert) => {
  console.warn('Performance alert:', alert);
  // Show notification to user
});
```

### 4. Manual Refresh Control

```typescript
import { useDataRefresh } from '@/hooks/useDataRefresh';

function MyComponent() {
  const { isRefreshing, refresh, errors } = useDataRefresh();

  const handleRefresh = async () => {
    await refresh({ forceRefresh: true });
  };

  return (
    <button onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
    </button>
  );
}
```

## Benefits

### 1. Improved User Experience
- Background refresh doesn't interrupt user interaction
- Visual feedback during data loading
- Automatic recovery from network issues
- Fresh data without manual intervention

### 2. Better Performance
- Intelligent caching reduces unnecessary API calls
- Rate limiting prevents API throttling
- Request queuing optimizes API usage
- Performance monitoring identifies bottlenecks

### 3. Enhanced Reliability
- Automatic retry with exponential backoff
- Graceful error handling
- Fallback mechanisms for rate-limited sources
- Continuous performance monitoring

### 4. Operational Visibility
- Real-time performance metrics
- Automatic alerting for issues
- Comprehensive logging
- Performance dashboards

## Configuration

### Environment Variables

No environment variables required - all configuration is done programmatically.

### Customization

All services support runtime configuration:

```typescript
// Update refresh config
dataRefreshService.updateConfig({
  refreshInterval: 10 * 60 * 1000, // 10 minutes
});

// Update rate limits
rateLimitManager.updateConfig('tech4palestine', {
  maxRequestsPerMinute: 120,
});

// Update performance thresholds
performanceMonitor.updateThresholds({
  maxAvgResponseTime: 3000,
  minSuccessRate: 98,
});
```

## Monitoring and Debugging

### Performance Metrics Export

```typescript
// Export all metrics as JSON
const metricsJson = performanceMonitor.exportMetrics();
console.log(metricsJson);
```

### Rate Limit Status

```typescript
// Check rate limit status
const status = rateLimitManager.getSourceStatus('tech4palestine');
console.log('Queue length:', status.queueLength);
console.log('Active requests:', status.activeRequests);
console.log('Requests last minute:', status.requestsLastMinute);
```

### Refresh Status

```typescript
// Get current refresh status
const status = dataRefreshService.getStatus();
console.log('Is refreshing:', status.isRefreshing);
console.log('Progress:', status.refreshProgress);
console.log('Errors:', status.errors);
```

## Future Enhancements

1. **Predictive Refresh**: Refresh data before user needs it based on usage patterns
2. **Adaptive Rate Limiting**: Automatically adjust rate limits based on API responses
3. **Smart Caching**: Machine learning-based cache invalidation
4. **Performance Optimization**: Automatic performance tuning based on metrics
5. **Advanced Alerting**: Integration with external monitoring services

## Conclusion

The automatic data refresh and caching system provides a robust, performant, and user-friendly solution for managing real-time data in the Palestine Pulse dashboard. It ensures data freshness while respecting API limits and providing excellent user experience.
