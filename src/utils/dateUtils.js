/**
 * Convert ISO datetime string to date format (yyyy-MM-dd) for HTML date inputs
 * Converts "2025-11-02T07:55:28.740337Z" to "2025-11-02"
 * @param {string} isoString - ISO datetime string
 * @returns {string} - Date string in yyyy-MM-dd format
 */
export const isoToDateInput = (isoString) => {
  if (!isoString) return '';
  
  // If it's already in yyyy-MM-dd format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    return isoString;
  }
  
  // If it's an ISO datetime string, extract the date part
  if (isoString.includes('T')) {
    return isoString.split('T')[0];
  }
  
  // Try to parse as Date and format
  try {
    const date = new Date(isoString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.warn('Invalid date format:', isoString);
  }
  
  return '';
};

/**
 * Convert date string to ISO datetime format
 * @param {string} dateString - Date string in yyyy-MM-dd format
 * @returns {string} - ISO datetime string
 */
export const dateInputToISO = (dateString) => {
  if (!dateString) return '';
  
  // If it's already an ISO string, return as is
  if (dateString.includes('T')) {
    return dateString;
  }
  
  // If it's a date string, convert to ISO
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.warn('Invalid date format:', dateString);
  }
  
  return '';
};

