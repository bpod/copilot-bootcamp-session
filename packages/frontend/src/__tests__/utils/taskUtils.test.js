import {
  filterTasksByStatus,
  searchTasks,
  sortTasksByDueDate,
  groupTasksByStatus,
  getTaskCountByStatus,
  validateTaskData,
  getStatusLabel,
  getStatusColor,
  isTaskOverdue,
} from '../../../src/utils/taskUtils';

describe('taskUtils', () => {
  const sampleTasks = [
    { id: 1, title: 'Task 1', status: 'OPEN', due_date: '2025-12-20' },
    { id: 2, title: 'Task 2', status: 'IN_PROGRESS', due_date: '2025-12-25' },
    { id: 3, title: 'Task 3', status: 'COMPLETE', due_date: '2025-12-15' },
    { id: 4, title: 'Task 4', status: 'OPEN', due_date: null },
  ];

  describe('filterTasksByStatus', () => {
    test('returns all tasks when status is ALL', () => {
      const result = filterTasksByStatus(sampleTasks, 'ALL');
      expect(result).toHaveLength(4);
    });

    test('filters tasks by OPEN status', () => {
      const result = filterTasksByStatus(sampleTasks, 'OPEN');
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'OPEN')).toBe(true);
    });

    test('filters tasks by IN_PROGRESS status', () => {
      const result = filterTasksByStatus(sampleTasks, 'IN_PROGRESS');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('IN_PROGRESS');
    });

    test('filters tasks by COMPLETE status', () => {
      const result = filterTasksByStatus(sampleTasks, 'COMPLETE');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('COMPLETE');
    });
  });

  describe('searchTasks', () => {
    const tasksWithDescriptions = [
      { id: 1, title: 'Buy groceries', description: 'Get milk and bread' },
      { id: 2, title: 'Call dentist', description: 'Schedule appointment' },
      { id: 3, title: 'Buy tickets', description: 'Concert on Friday' },
    ];

    test('searches by title', () => {
      const result = searchTasks(tasksWithDescriptions, 'buy');
      expect(result).toHaveLength(2);
      expect(result.map(t => t.title)).toContain('Buy groceries');
      expect(result.map(t => t.title)).toContain('Buy tickets');
    });

    test('searches by description', () => {
      const result = searchTasks(tasksWithDescriptions, 'appointment');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Call dentist');
    });

    test('returns all tasks for empty search', () => {
      const result = searchTasks(tasksWithDescriptions, '');
      expect(result).toHaveLength(3);
    });

    test('is case insensitive', () => {
      const result = searchTasks(tasksWithDescriptions, 'BUY');
      expect(result).toHaveLength(2);
    });
  });

  describe('sortTasksByDueDate', () => {
    test('sorts tasks by due date (earliest first)', () => {
      const result = sortTasksByDueDate(sampleTasks);
      expect(result[0].due_date).toBe('2025-12-15');
      expect(result[1].due_date).toBe('2025-12-20');
      expect(result[2].due_date).toBe('2025-12-25');
    });

    test('places tasks with no due date at the end', () => {
      const result = sortTasksByDueDate(sampleTasks);
      expect(result[result.length - 1].due_date).toBeNull();
    });

    test('does not mutate original array', () => {
      const original = [...sampleTasks];
      sortTasksByDueDate(sampleTasks);
      expect(sampleTasks).toEqual(original);
    });
  });

  describe('groupTasksByStatus', () => {
    test('groups tasks by status', () => {
      const result = groupTasksByStatus(sampleTasks);
      expect(result.OPEN).toHaveLength(2);
      expect(result.IN_PROGRESS).toHaveLength(1);
      expect(result.COMPLETE).toHaveLength(1);
    });
  });

  describe('getTaskCountByStatus', () => {
    test('counts tasks by status', () => {
      const result = getTaskCountByStatus(sampleTasks);
      expect(result.OPEN).toBe(2);
      expect(result.IN_PROGRESS).toBe(1);
      expect(result.COMPLETE).toBe(1);
    });

    test('returns zero for missing statuses', () => {
      const tasksWithoutComplete = sampleTasks.filter(t => t.status !== 'COMPLETE');
      const result = getTaskCountByStatus(tasksWithoutComplete);
      expect(result.COMPLETE).toBe(0);
    });
  });

  describe('validateTaskData', () => {
    test('validates correct task data', () => {
      const taskData = {
        title: 'Valid Task',
        description: 'Description',
        due_date: '2025-12-31',
        status: 'OPEN',
      };
      const result = validateTaskData(taskData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('requires title', () => {
      const result = validateTaskData({ title: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    test('validates status', () => {
      const result = validateTaskData({ title: 'Task', status: 'INVALID' });
      expect(result.isValid).toBe(false);
      expect(result.errors.status).toBe('Invalid status');
    });

    test('validates due date', () => {
      const result = validateTaskData({ title: 'Task', due_date: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors.due_date).toBe('Invalid date');
    });
  });

  describe('getStatusLabel', () => {
    test('returns correct labels for statuses', () => {
      expect(getStatusLabel('OPEN')).toBe('Open');
      expect(getStatusLabel('IN_PROGRESS')).toBe('In Progress');
      expect(getStatusLabel('COMPLETE')).toBe('Complete');
    });
  });

  describe('getStatusColor', () => {
    test('returns correct colors for statuses', () => {
      expect(getStatusColor('OPEN')).toBe('default');
      expect(getStatusColor('IN_PROGRESS')).toBe('primary');
      expect(getStatusColor('COMPLETE')).toBe('success');
    });
  });

  describe('isTaskOverdue', () => {
    test('returns false for tasks without due date', () => {
      const task = { due_date: null, status: 'OPEN' };
      expect(isTaskOverdue(task)).toBe(false);
    });

    test('returns false for completed tasks', () => {
      const task = { due_date: '2020-01-01', status: 'COMPLETE' };
      expect(isTaskOverdue(task)).toBe(false);
    });

    test('returns true for overdue open tasks', () => {
      const task = { due_date: '2020-01-01', status: 'OPEN' };
      expect(isTaskOverdue(task)).toBe(true);
    });

    test('returns false for future tasks', () => {
      const task = { due_date: '2030-12-31', status: 'OPEN' };
      expect(isTaskOverdue(task)).toBe(false);
    });
  });
});
