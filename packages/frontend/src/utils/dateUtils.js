/**
 * Date utility functions for task management
 */

/**
 * Formats a date string to a user-friendly format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Dec 18, 2025")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date string for input fields (YYYY-MM-DD)
 * @param {string} dateString - ISO date string or Date object
 * @returns {string} Formatted date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a date is in the past
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Set time to midnight for fair comparison
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Checks if a date is today
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * Gets relative date description (e.g., "Today", "Tomorrow", "Yesterday")
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Relative date description
 */
export const getRelativeDateDescription = (dateString) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Set time to midnight for fair comparison
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  
  return formatDate(dateString);
};

/**
 * Validates if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return true; // Empty date is valid (optional)
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};
