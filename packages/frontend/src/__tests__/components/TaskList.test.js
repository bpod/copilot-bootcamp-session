import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../../components/tasks/TaskList';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      due_date: '2025-12-31',
      status: 'OPEN',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      due_date: '2025-12-25',
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      due_date: '2025-12-20',
      status: 'COMPLETE',
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering States', () => {
    test('renders loading state when loading is true', () => {
      render(<TaskList {...defaultProps} loading={true} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });

    test('renders empty state when tasks array is empty', () => {
      render(<TaskList {...defaultProps} tasks={[]} />);
      
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      expect(screen.getByText('Create a new task to get started!')).toBeInTheDocument();
    });

    test('renders tasks when data is available', () => {
      render(<TaskList {...defaultProps} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    test('does not show loading spinner when not loading', () => {
      render(<TaskList {...defaultProps} />);
      
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('does not show empty state when tasks exist', () => {
      render(<TaskList {...defaultProps} />);
      
      expect(screen.queryByText('No tasks found')).not.toBeInTheDocument();
    });
  });

  describe('Task Rendering', () => {
    test('renders all tasks in the list', () => {
      render(<TaskList {...defaultProps} />);
      
      mockTasks.forEach((task) => {
        expect(screen.getByText(task.title)).toBeInTheDocument();
      });
    });

    test('renders correct number of task items', () => {
      render(<TaskList {...defaultProps} />);
      
      const taskCards = screen.getAllByText(/Task \d/);
      expect(taskCards).toHaveLength(mockTasks.length);
    });

    test('passes callbacks to each TaskItem', () => {
      render(<TaskList {...defaultProps} />);
      
      // Verify that edit buttons exist (TaskItem receives callbacks)
      const editButtons = screen.getAllByLabelText(/Edit Task \d/);
      expect(editButtons).toHaveLength(mockTasks.length);
      
      // Verify that delete buttons exist
      const deleteButtons = screen.getAllByLabelText(/Delete Task \d/);
      expect(deleteButtons).toHaveLength(mockTasks.length);
    });
  });

  describe('Grid Layout', () => {
    test('uses responsive grid layout', () => {
      render(<TaskList {...defaultProps} />);
      
      // Check for Grid container
      const gridContainer = screen.getByText('Task 1').closest('.MuiGrid-container');
      expect(gridContainer).toBeInTheDocument();
    });

    test('renders grid items for each task', () => {
      render(<TaskList {...defaultProps} />);
      
      // Verify each task card is rendered (one per task)
      const taskCards = screen.getAllByText(/Task \d/);
      expect(taskCards).toHaveLength(mockTasks.length);
    });
  });

  describe('Empty State', () => {
    test('displays helpful message when no tasks', () => {
      render(<TaskList {...defaultProps} tasks={[]} />);
      
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      expect(screen.getByText('Create a new task to get started!')).toBeInTheDocument();
    });

    test('empty state is centered', () => {
      const { container } = render(<TaskList {...defaultProps} tasks={[]} />);
      
      const emptyStateBox = container.querySelector('.MuiBox-root');
      expect(emptyStateBox).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('shows centered loading spinner', () => {
      const { container } = render(<TaskList {...defaultProps} loading={true} />);
      
      const loadingBox = container.querySelector('.MuiBox-root');
      expect(loadingBox).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('hides tasks while loading', () => {
      render(<TaskList {...defaultProps} loading={true} />);
      
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });
  });

  describe('Dynamic Updates', () => {
    test('updates when tasks prop changes', () => {
      const { rerender } = render(<TaskList {...defaultProps} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getAllByText(/Task \d/)).toHaveLength(3);
      
      const newTasks = [
        { id: '4', title: 'Task 4', status: 'OPEN' },
        { id: '5', title: 'Task 5', status: 'OPEN' },
      ];
      
      rerender(<TaskList {...defaultProps} tasks={newTasks} />);
      
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 4')).toBeInTheDocument();
      expect(screen.getByText('Task 5')).toBeInTheDocument();
    });

    test('transitions from loading to tasks', () => {
      const { rerender } = render(<TaskList {...defaultProps} loading={true} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      
      rerender(<TaskList {...defaultProps} loading={false} />);
      
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    test('transitions from tasks to empty state', () => {
      const { rerender } = render(<TaskList {...defaultProps} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('No tasks found')).not.toBeInTheDocument();
      
      rerender(<TaskList {...defaultProps} tasks={[]} />);
      
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });

    test('transitions from empty state to tasks', () => {
      const { rerender } = render(<TaskList {...defaultProps} tasks={[]} />);
      
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      
      rerender(<TaskList {...defaultProps} tasks={mockTasks} />);
      
      expect(screen.queryByText('No tasks found')).not.toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles single task', () => {
      const singleTask = [mockTasks[0]];
      render(<TaskList {...defaultProps} tasks={singleTask} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getAllByText(/Task \d/)).toHaveLength(1);
    });

    test('handles large number of tasks', () => {
      const manyTasks = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Task ${i + 1}`,
        status: 'OPEN',
      }));
      
      render(<TaskList {...defaultProps} tasks={manyTasks} />);
      
      expect(screen.getAllByText(/Task \d+/)).toHaveLength(50);
    });

    test('handles tasks with minimal data', () => {
      const minimalTasks = [
        { id: '1', title: 'Minimal Task', status: 'OPEN' },
      ];
      
      render(<TaskList {...defaultProps} tasks={minimalTasks} />);
      
      expect(screen.getByText('Minimal Task')).toBeInTheDocument();
    });

    test('maintains state when loading becomes false with empty tasks', () => {
      const { rerender } = render(<TaskList {...defaultProps} loading={true} />);
      
      rerender(<TaskList {...defaultProps} loading={false} tasks={[]} />);
      
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Callback Propagation', () => {
    test('TaskItems receive onEdit callback', () => {
      render(<TaskList {...defaultProps} />);
      
      // If TaskItems can render edit buttons, they received the callback
      expect(screen.getAllByLabelText(/Edit Task/)).toHaveLength(mockTasks.length);
    });

    test('TaskItems receive onDelete callback', () => {
      render(<TaskList {...defaultProps} />);
      
      // If TaskItems can render delete buttons, they received the callback
      expect(screen.getAllByLabelText(/Delete Task/)).toHaveLength(mockTasks.length);
    });

    test('TaskItems receive onStatusChange callback', () => {
      render(<TaskList {...defaultProps} />);
      
      // Status badges should be clickable
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });
});
