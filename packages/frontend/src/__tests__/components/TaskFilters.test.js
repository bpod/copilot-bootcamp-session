import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFilters from '../../components/tasks/TaskFilters';

describe('TaskFilters', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', status: 'OPEN' },
    { id: '2', title: 'Task 2', status: 'IN_PROGRESS' },
    { id: '3', title: 'Task 3', status: 'COMPLETE' },
    { id: '4', title: 'Task 4', status: 'OPEN' },
  ];

  const defaultProps = {
    statusFilter: 'ALL',
    searchTerm: '',
    onStatusFilterChange: jest.fn(),
    onSearchChange: jest.fn(),
    tasks: mockTasks,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders filter section with title', () => {
      render(<TaskFilters {...defaultProps} />);
      expect(screen.getByText('Filter Tasks')).toBeInTheDocument();
    });

    test('displays correct task counts for each status', () => {
      render(<TaskFilters {...defaultProps} />);
      
      expect(screen.getByText(/All \(4\)/)).toBeInTheDocument();
      expect(screen.getByText(/Open \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/In Progress \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Complete \(1\)/)).toBeInTheDocument();
    });

    test('renders search input with correct placeholder', () => {
      render(<TaskFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      expect(searchInput).toBeInTheDocument();
    });

    test('displays current search term in search input', () => {
      render(<TaskFilters {...defaultProps} searchTerm="test search" />);
      
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      expect(searchInput).toHaveValue('test search');
    });

    test('shows ALL status as selected by default', () => {
      render(<TaskFilters {...defaultProps} />);
      
      const allButton = screen.getByRole('button', { name: /all tasks/i });
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Status Filter Behavior', () => {
    test('calls onStatusFilterChange when OPEN filter is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} />);
      
      const openButton = screen.getByRole('button', { name: /open tasks/i });
      await user.click(openButton);
      
      expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith('OPEN');
    });

    test('calls onStatusFilterChange when IN_PROGRESS filter is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} />);
      
      const inProgressButton = screen.getByRole('button', { name: /in progress tasks/i });
      await user.click(inProgressButton);
      
      expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith('IN_PROGRESS');
    });

    test('calls onStatusFilterChange when COMPLETE filter is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} />);
      
      const completeButton = screen.getByRole('button', { name: /completed tasks/i });
      await user.click(completeButton);
      
      expect(defaultProps.onStatusFilterChange).toHaveBeenCalledWith('COMPLETE');
    });

    test('displays correct button as selected based on statusFilter prop', () => {
      render(<TaskFilters {...defaultProps} statusFilter="IN_PROGRESS" />);
      
      const inProgressButton = screen.getByRole('button', { name: /in progress tasks/i });
      expect(inProgressButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('does not call onStatusFilterChange when clicking already selected filter', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} statusFilter="OPEN" />);
      
      const openButton = screen.getByRole('button', { name: /open tasks/i });
      await user.click(openButton);
      
      // ToggleButtonGroup prevents deselecting the current value
      expect(defaultProps.onStatusFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('Search Behavior', () => {
    test('calls onSearchChange when user types in search field', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      await user.type(searchInput, 'test');
      
      // Verify onSearchChange was called (userEvent.type fires onChange for each keystroke)
      expect(defaultProps.onSearchChange).toHaveBeenCalled();
      // The last call should be with the full text if field accumulates, or individual chars
      const calls = defaultProps.onSearchChange.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[calls.length - 1][0]).toBe('t'); // Last character typed
    });

    test('calls onSearchChange with empty string when search is cleared', async () => {
      const user = userEvent.setup();
      render(<TaskFilters {...defaultProps} searchTerm="existing" />);
      
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      await user.clear(searchInput);
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty tasks array', () => {
      render(<TaskFilters {...defaultProps} tasks={[]} />);
      
      expect(screen.getByText(/All \(0\)/)).toBeInTheDocument();
      expect(screen.getByText(/Open \(0\)/)).toBeInTheDocument();
      expect(screen.getByText(/In Progress \(0\)/)).toBeInTheDocument();
      expect(screen.getByText(/Complete \(0\)/)).toBeInTheDocument();
    });

    test('updates counts when tasks prop changes', () => {
      const { rerender } = render(<TaskFilters {...defaultProps} tasks={mockTasks} />);
      
      expect(screen.getByText(/All \(4\)/)).toBeInTheDocument();
      
      const newTasks = [...mockTasks, { id: '5', title: 'Task 5', status: 'OPEN' }];
      rerender(<TaskFilters {...defaultProps} tasks={newTasks} />);
      
      expect(screen.getByText(/All \(5\)/)).toBeInTheDocument();
      expect(screen.getByText(/Open \(3\)/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for status filters', () => {
      render(<TaskFilters {...defaultProps} />);
      
      expect(screen.getByLabelText('filter by status')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /open tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /in progress tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /completed tasks/i })).toBeInTheDocument();
    });

    test('has proper ARIA label for search input', () => {
      render(<TaskFilters {...defaultProps} />);
      
      const searchInput = screen.getByLabelText('Search tasks');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
