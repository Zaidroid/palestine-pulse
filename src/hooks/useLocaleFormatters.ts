/**
 * useLocaleFormatters Hook
 * 
 * Provides locale-aware formatting functions that automatically
 * use the current language from i18n context
 */

import { useTranslation } from 'react-i18next';
import {
  formatNumber,
  formatNumberWithCommas,
  formatPercentage,
  formatCurrency,
  formatCompactNumber,
  formatDecimal,
  formatDate,
  formatDateShort,
  formatDateMedium,
  formatDateLong,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDateRange,
  formatMonthYear,
  formatYear,
  formatDayOfWeek,
  formatDuration,
  formatFileSize,
  formatList,
  formatOrdinal,
  getTextDirection,
  isRTL,
  getDecimalSeparator,
  getThousandsSeparator,
} from '@/lib/locale-formatters';

export function useLocaleFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'en' | 'ar';

  return {
    // Current locale info
    locale,
    direction: getTextDirection(locale),
    isRTL: isRTL(locale),
    
    // Number formatters
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, locale, options),
    
    formatNumberWithCommas: (value: number) =>
      formatNumberWithCommas(value, locale),
    
    formatPercentage: (value: number, decimals?: number) =>
      formatPercentage(value, locale, decimals),
    
    formatCurrency: (value: number, currency?: string) =>
      formatCurrency(value, locale, currency),
    
    formatCompactNumber: (value: number) =>
      formatCompactNumber(value, locale),
    
    formatDecimal: (value: number, decimals?: number) =>
      formatDecimal(value, locale, decimals),
    
    // Date formatters
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, locale, options),
    
    formatDateShort: (date: Date | string) =>
      formatDateShort(date, locale),
    
    formatDateMedium: (date: Date | string) =>
      formatDateMedium(date, locale),
    
    formatDateLong: (date: Date | string) =>
      formatDateLong(date, locale),
    
    formatDateTime: (date: Date | string) =>
      formatDateTime(date, locale),
    
    formatTime: (date: Date | string) =>
      formatTime(date, locale),
    
    formatRelativeTime: (date: Date | string) =>
      formatRelativeTime(date, locale),
    
    formatDateRange: (startDate: Date | string, endDate: Date | string) =>
      formatDateRange(startDate, endDate, locale),
    
    formatMonthYear: (date: Date | string) =>
      formatMonthYear(date, locale),
    
    formatYear: (date: Date | string) =>
      formatYear(date, locale),
    
    formatDayOfWeek: (date: Date | string) =>
      formatDayOfWeek(date, locale),
    
    // Other formatters
    formatDuration: (milliseconds: number) =>
      formatDuration(milliseconds, locale),
    
    formatFileSize: (bytes: number) =>
      formatFileSize(bytes, locale),
    
    formatList: (items: string[]) =>
      formatList(items, locale),
    
    formatOrdinal: (value: number) =>
      formatOrdinal(value, locale),
    
    // Utility functions
    getDecimalSeparator: () => getDecimalSeparator(locale),
    getThousandsSeparator: () => getThousandsSeparator(locale),
  };
}
