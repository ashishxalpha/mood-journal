/**
 * Utility Functions
 * Helper functions used throughout the application
 */

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', options || defaultOptions);
};

/**
 * Gets the current date in ISO format (YYYY-MM-DD)
 * @returns Current date string
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calculates the difference in days between two dates
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns Number of days between dates
 */
export const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a date is today
 * @param dateString - Date string to check
 * @returns True if date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = getCurrentDate();
  return dateString === today;
};

/**
 * Gets a date range array between two dates
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Array of date strings
 */
export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

/**
 * Truncates text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generates a random ID
 * @returns Random ID string
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
