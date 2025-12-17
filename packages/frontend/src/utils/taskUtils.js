/**
 * Task utility functions for filtering, sorting, and validation
 */

/**
 * Filters tasks by status
 * @param {Array} tasks - Array of task objects
 * @param {string} status - Status to filter by (OPEN, IN_PROGRESS, COMPLETE, or 'ALL')
 * @returns {Array} Filtered tasks
 */
export const filterTasksByStatus = (tasks, status) => {
  if (!status || status === 'ALL') {
    return tasks;
  }
  
  return tasks.filter(task => task.status === status);
};

/**
 * Searches tasks by title or description
 * @param {Array} tasks - Array of task objects
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered tasks
 */
export const searchTasks = (tasks, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return tasks;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return tasks.filter(task => {
    const titleMatch = task.title?.toLowerCase().includes(term);
    const descriptionMatch = task.description?.toLowerCase().includes(term);
    return titleMatch || descriptionMatch;
  });
};

/**
 * Sorts tasks by due date (earliest first, null dates last)
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Sorted tasks
 */
export const sortTasksByDueDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    // Tasks with no due date go to the end
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    // Compare dates
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    
    return dateA - dateB;
  });
};

/**
 * Groups tasks by status
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Tasks grouped by status
 */
export const groupTasksByStatus = (tasks) => {
  return tasks.reduce((groups, task) => {
    const status = task.status || 'OPEN';
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(task);
    return groups;
  }, {});
};

/**
 * Gets task count by status
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Count of tasks by status
 */
export const getTaskCountByStatus = (tasks) => {
  return tasks.reduce((counts, task) => {
    const status = task.status || 'OPEN';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { OPEN: 0, IN_PROGRESS: 0, COMPLETE: 0 });
};

/**
 * Validates task form data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: Object }
 */
export const validateTaskData = (taskData) => {
  const errors = {};
  
  // Title is required
  if (!taskData.title || taskData.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  // Validate status if provided
  if (taskData.status && !['OPEN', 'IN_PROGRESS', 'COMPLETE'].includes(taskData.status)) {
    errors.status = 'Invalid status';
  }
  
  // Validate due date if provided
  if (taskData.due_date) {
    const date = new Date(taskData.due_date);
    if (isNaN(date.getTime())) {
      errors.due_date = 'Invalid date';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Gets status display label
 * @param {string} status - Task status
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    COMPLETE: 'Complete',
  };
  
  return labels[status] || status;
};

/**
 * Gets status color for UI display
 * @param {string} status - Task status
 * @returns {string} MUI color variant
 */
export const getStatusColor = (status) => {
  const colors = {
    OPEN: 'default',
    IN_PROGRESS: 'primary',
    COMPLETE: 'success',
  };
  
  return colors[status] || 'default';
};

/**
 * Checks if task is overdue
 * @param {Object} task - Task object
 * @returns {boolean} True if task is overdue
 */
export const isTaskOverdue = (task) => {
  if (!task.due_date || task.status === 'COMPLETE') {
    return false;
  }
  
  const dueDate = new Date(task.due_date);
  const today = new Date();
  
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return dueDate < today;
};
