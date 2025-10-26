/**
 * Locale-Aware Formatters
 * 
 * Number and date formatting utilities that respect
 * the user's language preference (English/Arabic)
 */

/**
 * Format a number according to locale
 * Uses Western Arabic numerals (0-9) for consistency in data visualization
 */
export function formatNumber(
  value: number,
  locale: 'en' | 'ar' = 'en',
  options?: Intl.NumberFormatOptions
): string {
  // Always use Western Arabic numerals for data consistency
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    ...options,
    numberingSystem: 'latn', // Force Western Arabic numerals (0-9)
  });
  
  return formatter.format(value);
}

/**
 * Format a number with thousands separators
 */
export function formatNumberWithCommas(
  value: number,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(
  value: number,
  locale: 'en' | 'ar' = 'en',
  decimals: number = 1
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  locale: 'en' | 'ar' = 'en',
  currency: string = 'USD'
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a large number with abbreviations (K, M, B)
 */
export function formatCompactNumber(
  value: number,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatNumber(value, locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
}

/**
 * Format a number with decimal places
 */
export function formatDecimal(
  value: number,
  locale: 'en' | 'ar' = 'en',
  decimals: number = 2
): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: 'en' | 'ar' = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatter = new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-EG' : 'en-US',
    {
      ...options,
      numberingSystem: 'latn', // Force Western Arabic numerals for dates
    }
  );
  
  return formatter.format(dateObj);
}

/**
 * Format a date as short format (e.g., "1/15/2024" or "١٥/١/٢٠٢٤")
 */
export function formatDateShort(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * Format a date as medium format (e.g., "Jan 15, 2024")
 */
export function formatDateMedium(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date as long format (e.g., "January 15, 2024")
 */
export function formatDateLong(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a time only
 */
export function formatTime(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a relative time (e.g., "2 hours ago", "منذ ساعتين")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    numeric: 'auto',
  });
  
  // Seconds
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  
  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }
  
  // Months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  
  // Years
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}

/**
 * Format a date range
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  const start = formatDateShort(startDate, locale);
  const end = formatDateShort(endDate, locale);
  
  const separator = locale === 'ar' ? ' - ' : ' - ';
  return `${start}${separator}${end}`;
}

/**
 * Format a month and year (e.g., "January 2024", "يناير ٢٠٢٤")
 */
export function formatMonthYear(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Format a year only
 */
export function formatYear(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
  });
}

/**
 * Format a day of week (e.g., "Monday", "الاثنين")
 */
export function formatDayOfWeek(
  date: Date | string,
  locale: 'en' | 'ar' = 'en'
): string {
  return formatDate(date, locale, {
    weekday: 'long',
  });
}

/**
 * Format a duration in milliseconds to human-readable format
 */
export function formatDuration(
  milliseconds: number,
  locale: 'en' | 'ar' = 'en'
): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return locale === 'ar' 
      ? `${formatNumber(days, locale)} ${days === 1 ? 'يوم' : 'أيام'}`
      : `${formatNumber(days, locale)} ${days === 1 ? 'day' : 'days'}`;
  }
  
  if (hours > 0) {
    return locale === 'ar'
      ? `${formatNumber(hours, locale)} ${hours === 1 ? 'ساعة' : 'ساعات'}`
      : `${formatNumber(hours, locale)} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  if (minutes > 0) {
    return locale === 'ar'
      ? `${formatNumber(minutes, locale)} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
      : `${formatNumber(minutes, locale)} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  return locale === 'ar'
    ? `${formatNumber(seconds, locale)} ${seconds === 1 ? 'ثانية' : 'ثواني'}`
    : `${formatNumber(seconds, locale)} ${seconds === 1 ? 'second' : 'seconds'}`;
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(
  bytes: number,
  locale: 'en' | 'ar' = 'en'
): string {
  const units = locale === 'ar'
    ? ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت']
    : ['B', 'KB', 'MB', 'GB', 'TB'];
  
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${formatDecimal(size, locale, 2)} ${units[unitIndex]}`;
}

/**
 * Format a list of items with proper conjunction
 */
export function formatList(
  items: string[],
  locale: 'en' | 'ar' = 'en'
): string {
  // Check if Intl.ListFormat is available
  if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
    const formatter = new (Intl as any).ListFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'long',
      type: 'conjunction',
    });
    return formatter.format(items);
  }
  
  // Fallback for browsers without Intl.ListFormat
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    const conjunction = locale === 'ar' ? ' و ' : ' and ';
    return items.join(conjunction);
  }
  
  const conjunction = locale === 'ar' ? '، و ' : ', and ';
  const separator = locale === 'ar' ? '، ' : ', ';
  return items.slice(0, -1).join(separator) + conjunction + items[items.length - 1];
}

/**
 * Format a number as ordinal (1st, 2nd, 3rd, etc.)
 * Note: Arabic doesn't have direct ordinal number formatting in Intl API
 */
export function formatOrdinal(
  value: number,
  locale: 'en' | 'ar' = 'en'
): string {
  if (locale === 'ar') {
    // Arabic ordinals are complex, return simple format
    return `${formatNumber(value, locale)}`;
  }
  
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);
  
  const rule = pr.select(value);
  const suffix = suffixes.get(rule);
  return `${value}${suffix}`;
}

/**
 * Get the direction for the current locale
 */
export function getTextDirection(locale: 'en' | 'ar' = 'en'): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: 'en' | 'ar' = 'en'): boolean {
  return locale === 'ar';
}

/**
 * Get locale-specific decimal separator
 */
export function getDecimalSeparator(locale: 'en' | 'ar' = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');
  const parts = formatter.formatToParts(1.1);
  const decimalPart = parts.find(part => part.type === 'decimal');
  return decimalPart?.value || '.';
}

/**
 * Get locale-specific thousands separator
 */
export function getThousandsSeparator(locale: 'en' | 'ar' = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');
  const parts = formatter.formatToParts(1000);
  const groupPart = parts.find(part => part.type === 'group');
  return groupPart?.value || ',';
}
