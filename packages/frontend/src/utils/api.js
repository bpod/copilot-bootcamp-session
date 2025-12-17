/**
 * API client utility functions
 * Provides a centralized interface for all API calls
 */

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
const fetchAPI = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fetches all tasks with optional filtering
 * @param {Object} filters - Filter options { status, search }
 * @returns {Promise<Array>} Array of tasks
 */
export const fetchTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status && filters.status !== 'ALL') {
    params.append('status', filters.status);
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  const queryString = params.toString();
  const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(url);
};

/**
 * Fetches a single task by ID
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Task object
 */
export const fetchTask = async (id) => {
  return fetchAPI(`${API_BASE_URL}/tasks/${id}`);
};

/**
 * Creates a new task
 * @param {Object} taskData - Task data { title, description, due_date, status }
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  return fetchAPI(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

/**
 * Updates an existing task
 * @param {number} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (id, taskData) => {
  return fetchAPI(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

/**
 * Updates only the status of a task
 * @param {number} id - Task ID
 * @param {string} status - New status (OPEN, IN_PROGRESS, COMPLETE)
 * @returns {Promise<Object>} Updated task object
 */
export const updateTaskStatus = async (id, status) => {
  return fetchAPI(`${API_BASE_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Deletes a task
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteTask = async (id) => {
  return fetchAPI(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
};

export default {
  fetchTasks,
  fetchTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
