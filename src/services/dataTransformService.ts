/**
 * Data Transformation Service
 * 
 * Provides core data transformation methods for converting raw data from local files
 * into chart-ready formats for D3 visualizations.
 * 
 * @see .kiro/specs/dashboard-d3-redesign/design.md
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 1.3, 2.1, 2.2, 2.3)
 */

import {
  TimeSeriesData,
  CategoryData,
  FlowData,
  PyramidData,
  CalendarData,
  TimeRange,
  AggregationPeriod,
} from '@/types/dashboard-data.types';

/**
 * DataTransformService - Core data transformation utilities
 * 
 * This service provides methods to transform raw data into formats suitable
 * for various D3 chart types including area charts, bar charts, Sankey diagrams,
 * population pyramids, and calendar heatmaps.
 */
export class DataTransformService {
  /**
   * Aggregate time-series data by time range
   * 
   * Filters and aggregates time-series data based on the specified time range.
   * Supports 7 days, 1 month, 3 months, 1 year, or all time.
   * 
   * @param data - Array of time-series data points
   * @param range - Time range filter ('7d' | '1m' | '3m' | '1y' | 'all')
   * @param dateField - Name of the date field in the data objects
   * @param aggregation - Optional aggregation period for grouping data
   * @returns Filtered and optionally aggregated time-series data
   * 
   * @example
   * ```typescript
   * const data = [
   *   { date: '2024-01-01', value: 100 },
   *   { date: '2024-01-02', value: 150 },
   * ];
   * const filtered = service.aggregateByTimeRange(data, '7d', 'date');
   * ```
   */
  aggregateByTimeRange(
    data: any[],
    range: TimeRange,
    dateField: string = 'date',
    aggregation?: AggregationPeriod
  ): TimeSeriesData[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Calculate the cutoff date based on the time range
    const now = new Date();
    let cutoffDate: Date;

    switch (range) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        cutoffDate = new Date(0); // Beginning of time
        break;
    }

    // Filter data by date range
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= cutoffDate;
    });

    // If no aggregation specified, return filtered data as-is
    if (!aggregation) {
      return filteredData.map((item) => ({
        date: item[dateField],
        value: item.value ?? item.count ?? item.total ?? 0,
        category: item.category,
        metadata: item,
      }));
    }

    // Aggregate data by the specified period
    return this.aggregateByPeriod(filteredData, dateField, aggregation);
  }

  /**
   * Aggregate data by time period (daily, weekly, monthly, etc.)
   * 
   * @param data - Array of data points
   * @param dateField - Name of the date field
   * @param period - Aggregation period
   * @returns Aggregated time-series data
   */
  private aggregateByPeriod(
    data: any[],
    dateField: string,
    period: AggregationPeriod
  ): TimeSeriesData[] {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item[dateField]);
      const key = this.getAggregationKey(date, period);
      const value = item.value ?? item.count ?? item.total ?? 0;

      grouped.set(key, (grouped.get(key) || 0) + value);
    });

    return Array.from(grouped.entries())
      .map(([date, value]) => ({
        date,
        value,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Get aggregation key for a date based on the period
   * 
   * @param date - Date to get key for
   * @param period - Aggregation period
   * @returns String key for grouping
   */
  private getAggregationKey(date: Date, period: AggregationPeriod): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (period) {
      case 'daily':
        return `${year}-${month}-${day}`;
      case 'weekly':
        // Get ISO week number
        const weekNum = this.getWeekNumber(date);
        return `${year}-W${String(weekNum).padStart(2, '0')}`;
      case 'monthly':
        return `${year}-${month}`;
      case 'quarterly':
        const quarter = Math.floor((date.getMonth() + 3) / 3);
        return `${year}-Q${quarter}`;
      case 'yearly':
        return `${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Get ISO week number for a date
   * 
   * @param date - Date to get week number for
   * @returns Week number (1-53)
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * Group data by category for categorical visualizations
   * 
   * Aggregates data by a specified category field and calculates totals and percentages.
   * Useful for bar charts, donut charts, and other categorical visualizations.
   * 
   * @param data - Array of data objects
   * @param categoryField - Name of the category field to group by
   * @param valueField - Name of the value field to sum
   * @param options - Optional configuration for sorting and limiting
   * @returns Array of category data with values and percentages
   * 
   * @example
   * ```typescript
   * const data = [
   *   { type: 'hospital', count: 50 },
   *   { type: 'clinic', count: 30 },
   *   { type: 'hospital', count: 20 },
   * ];
   * const grouped = service.groupByCategory(data, 'type', 'count');
   * // Result: [{ category: 'hospital', value: 70, percentage: 70 }, ...]
   * ```
   */
  groupByCategory(
    data: any[],
    categoryField: string,
    valueField: string,
    options?: {
      sortBy?: 'value' | 'category';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
    }
  ): CategoryData[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Group data by category
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const category = item[categoryField] ?? 'Unknown';
      const value = item[valueField] ?? 0;

      grouped.set(category, (grouped.get(category) || 0) + value);
    });

    // Calculate total for percentages
    const total = Array.from(grouped.values()).reduce((sum, val) => sum + val, 0);

    // Convert to CategoryData array
    let result: CategoryData[] = Array.from(grouped.entries()).map(([category, value]) => ({
      category,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }));

    // Apply sorting
    if (options?.sortBy) {
      result.sort((a, b) => {
        const aVal = options.sortBy === 'value' ? a.value : a.category;
        const bVal = options.sortBy === 'value' ? b.value : b.category;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return options.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        }

        const comparison = String(aVal).localeCompare(String(bVal));
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply limit
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  /**
   * Transform data to population pyramid format
   * 
   * Converts demographic data into the format required for population pyramid charts,
   * with age groups and male/female breakdowns.
   * 
   * @param data - Array of demographic data
   * @param ageField - Name of the age field
   * @param genderField - Name of the gender field
   * @param options - Optional configuration for age grouping
   * @returns Array of pyramid data with age groups and gender breakdowns
   * 
   * @example
   * ```typescript
   * const data = [
   *   { age: 25, gender: 'male' },
   *   { age: 30, gender: 'female' },
   *   { age: 28, gender: 'male' },
   * ];
   * const pyramid = service.transformToPyramid(data, 'age', 'gender');
   * // Result: [{ ageGroup: '25-29', male: 2, female: 1, total: 3 }, ...]
   * ```
   */
  transformToPyramid(
    data: any[],
    ageField: string,
    genderField: string,
    options?: {
      ageGroupSize?: number;
      maxAge?: number;
      ageCategories?: string[];
    }
  ): PyramidData[] {
    if (!data || data.length === 0) {
      return [];
    }

    const ageGroupSize = options?.ageGroupSize ?? 5;
    const maxAge = options?.maxAge ?? 100;

    // If age categories are provided, use them directly
    if (options?.ageCategories) {
      return this.transformToPyramidByCategory(data, ageField, genderField, options.ageCategories);
    }

    // Create age groups
    const ageGroups = new Map<string, { male: number; female: number }>();

    // Initialize age groups
    for (let age = 0; age <= maxAge; age += ageGroupSize) {
      const groupLabel = `${age}-${Math.min(age + ageGroupSize - 1, maxAge)}`;
      ageGroups.set(groupLabel, { male: 0, female: 0 });
    }

    // Count individuals by age group and gender
    data.forEach((item) => {
      const age = item[ageField];
      const gender = String(item[genderField]).toLowerCase();

      if (age == null || isNaN(age)) {
        return;
      }

      // Find the appropriate age group
      const groupIndex = Math.floor(age / ageGroupSize) * ageGroupSize;
      const groupLabel = `${groupIndex}-${Math.min(groupIndex + ageGroupSize - 1, maxAge)}`;

      const group = ageGroups.get(groupLabel);
      if (group) {
        if (gender === 'male' || gender === 'm') {
          group.male++;
        } else if (gender === 'female' || gender === 'f') {
          group.female++;
        }
      }
    });

    // Convert to PyramidData array
    return Array.from(ageGroups.entries())
      .map(([ageGroup, counts]) => ({
        ageGroup,
        male: counts.male,
        female: counts.female,
        total: counts.male + counts.female,
      }))
      .filter((item) => item.total > 0); // Remove empty age groups
  }

  /**
   * Transform data to pyramid format using predefined age categories
   * 
   * @param data - Array of demographic data
   * @param ageField - Name of the age field
   * @param genderField - Name of the gender field
   * @param categories - Array of age category labels
   * @returns Array of pyramid data
   */
  private transformToPyramidByCategory(
    data: any[],
    ageField: string,
    genderField: string,
    categories: string[]
  ): PyramidData[] {
    const grouped = new Map<string, { male: number; female: number }>();

    // Initialize categories
    categories.forEach((category) => {
      grouped.set(category, { male: 0, female: 0 });
    });

    // Count by category
    data.forEach((item) => {
      const category = item[ageField];
      const gender = String(item[genderField]).toLowerCase();

      if (!category) {
        return;
      }

      const group = grouped.get(category);
      if (group) {
        if (gender === 'male' || gender === 'm') {
          group.male++;
        } else if (gender === 'female' || gender === 'f') {
          group.female++;
        }
      }
    });

    return Array.from(grouped.entries()).map(([ageGroup, counts]) => ({
      ageGroup,
      male: counts.male,
      female: counts.female,
      total: counts.male + counts.female,
    }));
  }

  /**
   * Transform data to flow format for Sankey diagrams
   * 
   * Converts relational data into the source-target-value format required for
   * Sankey flow diagrams.
   * 
   * @param data - Array of relational data
   * @param sourceField - Name of the source field
   * @param targetField - Name of the target field
   * @param valueField - Name of the value field (optional, defaults to count)
   * @param options - Optional configuration for filtering and aggregation
   * @returns Array of flow data for Sankey diagrams
   * 
   * @example
   * ```typescript
   * const data = [
   *   { from: 'Gaza City', to: 'Rafah', people: 1000 },
   *   { from: 'Gaza City', to: 'Khan Younis', people: 500 },
   * ];
   * const flows = service.transformToFlow(data, 'from', 'to', 'people');
   * // Result: [{ source: 'Gaza City', target: 'Rafah', value: 1000 }, ...]
   * ```
   */
  transformToFlow(
    data: any[],
    sourceField: string,
    targetField: string,
    valueField?: string,
    options?: {
      minValue?: number;
      aggregateBy?: string;
    }
  ): FlowData[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Group flows by source-target pairs
    const flows = new Map<string, FlowData>();

    data.forEach((item) => {
      const source = item[sourceField];
      const target = item[targetField];

      if (!source || !target) {
        return;
      }

      // Get value (default to 1 if no value field specified)
      const value = valueField ? (item[valueField] ?? 1) : 1;

      // Create unique key for this flow
      const key = `${source}→${target}`;

      if (flows.has(key)) {
        const existing = flows.get(key)!;
        existing.value += value;
      } else {
        flows.set(key, {
          source,
          target,
          value,
          metadata: item,
        });
      }
    });

    // Convert to array and apply filters
    let result = Array.from(flows.values());

    // Filter by minimum value if specified
    if (options?.minValue) {
      result = result.filter((flow) => flow.value >= options.minValue!);
    }

    // Sort by value descending
    result.sort((a, b) => b.value - a.value);

    return result;
  }

  /**
   * Transform data to calendar heatmap format
   * 
   * Converts time-series data into the format required for calendar heatmap
   * visualizations, with daily values and intensity levels.
   * 
   * @param data - Array of time-series data
   * @param dateField - Name of the date field
   * @param valueField - Name of the value field
   * @param options - Optional configuration for intensity calculation
   * @returns Array of calendar data with dates, values, and intensity levels
   * 
   * @example
   * ```typescript
   * const data = [
   *   { date: '2024-01-01', casualties: 50 },
   *   { date: '2024-01-02', casualties: 100 },
   * ];
   * const calendar = service.transformToCalendar(data, 'date', 'casualties');
   * // Result: [{ date: '2024-01-01', value: 50, intensity: 'medium' }, ...]
   * ```
   */
  transformToCalendar(
    data: any[],
    dateField: string,
    valueField: string,
    options?: {
      intensityThresholds?: {
        low: number;
        medium: number;
        high: number;
      };
      fillMissingDates?: boolean;
    }
  ): CalendarData[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Group by date (in case there are duplicates)
    const dailyData = new Map<string, number>();

    data.forEach((item) => {
      const date = this.normalizeDate(item[dateField]);
      const value = item[valueField] ?? 0;

      if (date) {
        dailyData.set(date, (dailyData.get(date) || 0) + value);
      }
    });

    // Calculate intensity thresholds if not provided
    const values = Array.from(dailyData.values());
    const thresholds = options?.intensityThresholds ?? this.calculateIntensityThresholds(values);

    // Convert to CalendarData array
    let result: CalendarData[] = Array.from(dailyData.entries()).map(([date, value]) => ({
      date,
      value,
      intensity: this.getIntensityLevel(value, thresholds),
    }));

    // Fill missing dates if requested
    if (options?.fillMissingDates && result.length > 0) {
      result = this.fillMissingDates(result);
    }

    // Sort by date
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }

  /**
   * Normalize date to YYYY-MM-DD format
   * 
   * @param date - Date string or Date object
   * @returns Normalized date string
   */
  private normalizeDate(date: string | Date): string | null {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return null;
      }
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  }

  /**
   * Calculate intensity thresholds based on data distribution
   * 
   * @param values - Array of values
   * @returns Intensity thresholds
   */
  private calculateIntensityThresholds(values: number[]): {
    low: number;
    medium: number;
    high: number;
  } {
    if (values.length === 0) {
      return { low: 0, medium: 0, high: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q2 = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];

    return {
      low: q1,
      medium: q2,
      high: q3,
    };
  }

  /**
   * Get intensity level based on value and thresholds
   * 
   * @param value - Value to classify
   * @param thresholds - Intensity thresholds
   * @returns Intensity level
   */
  private getIntensityLevel(
    value: number,
    thresholds: { low: number; medium: number; high: number }
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (value <= thresholds.low) {
      return 'low';
    } else if (value <= thresholds.medium) {
      return 'medium';
    } else if (value <= thresholds.high) {
      return 'high';
    } else {
      return 'critical';
    }
  }

  /**
   * Fill missing dates in calendar data
   * 
   * @param data - Array of calendar data
   * @returns Array with missing dates filled
   */
  private fillMissingDates(data: CalendarData[]): CalendarData[] {
    if (data.length === 0) {
      return data;
    }

    const result: CalendarData[] = [];
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);

    const dataMap = new Map(data.map((d) => [d.date, d]));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = this.normalizeDate(d)!;
      if (dataMap.has(dateStr)) {
        result.push(dataMap.get(dateStr)!);
      } else {
        result.push({
          date: dateStr,
          value: 0,
          intensity: 'low',
        });
      }
    }

    return result;
  }
}

// Export singleton instance
export const dataTransformService = new DataTransformService();
