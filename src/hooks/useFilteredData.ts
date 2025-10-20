import { useMemo } from 'react';
import { useV3Store } from '@/store/v3Store';
import { isWithinInterval } from 'date-fns';

export const useFilteredData = <T extends Record<string, any>>(
  data: T[] | undefined,
  options?: {
    dateField?: string;
    regionField?: string;
    categoryField?: string;
    severityField?: string;
    dataSourceField?: string;
    dataQualityField?: string;
  }
) => {
  const { dateRange, filters } = useV3Store();

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      // Date range filter
      if (options?.dateField && item[options.dateField]) {
        const itemDate = new Date(item[options.dateField]);
        if (!isWithinInterval(itemDate, { start: dateRange.start, end: dateRange.end })) {
          return false;
        }
      }

      // Region filter
      if (options?.regionField && filters.regions.length > 0) {
        const itemRegion = item[options.regionField];
        if (!filters.regions.includes(itemRegion)) {
          return false;
        }
      }

      // Category filter
      if (options?.categoryField && filters.categories.length > 0) {
        const itemCategory = item[options.categoryField];
        if (!filters.categories.includes(itemCategory)) {
          return false;
        }
      }

      // Severity filter
      if (options?.severityField && filters.severity > 0) {
        const itemSeverity = item[options.severityField] || 0;
        if (itemSeverity < filters.severity) {
          return false;
        }
      }

      // Data source filter
      if (options?.dataSourceField && filters.dataSources.length > 0) {
        const itemDataSource = item[options.dataSourceField];
        if (!filters.dataSources.includes(itemDataSource)) {
          return false;
        }
      }

      // Data quality filter
      if (options?.dataQualityField && filters.dataQuality.length < 3) {
        const itemDataQuality = item[options.dataQualityField] || 'high';
        if (!filters.dataQuality.includes(itemDataQuality)) {
          return false;
        }
      }

      return true;
    });
  }, [data, dateRange, filters, options]);

  return filteredData;
};

// Hook to get filtered casualty count
export const useFilteredCount = (
  data: any[] | undefined,
  dateField: string = 'report_date'
) => {
  const filteredData = useFilteredData(data, { dateField });
  
  return useMemo(() => {
    if (!filteredData || filteredData.length === 0) return 0;
    
    // Sum up casualties if data has cumulative counts
    const latest = filteredData[filteredData.length - 1];
    return latest?.ext_killed_cum || filteredData.length;
  }, [filteredData]);
};