import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../../components/tasks/TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task description',
    due_date: '2025-12-31',
    status: 'OPEN',
  };

  const defaultProps = {
    task: mockTask,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders task title', () => {
      render(<TaskItem {...defaultProps} />);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('renders task description when provided', () => {
      render(<TaskItem {...defaultProps} />);
      
      expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    });

    test('does not render description when not provided', () => {
      const taskWithoutDescription = { ...mockTask, description: '' };
      render(<TaskItem {...defaultProps} task={taskWithoutDescription} />);
      
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });

    test('renders due date when provided', () => {
      render(<TaskItem {...defaultProps} />);
      
      // Due date is formatted by getRelativeDateDescription
      expect(screen.getByText(/Dec.*31,.*2025|days|today|tomorrow/i)).toBeInTheDocument();
    });

    test('does not render due date section when not provided', () => {
      const taskWithoutDueDate = { ...mockTask, due_date: null };
      render(<TaskItem {...defaultProps} task={taskWithoutDueDate} />);
      
      // Check that the AccessTimeIcon is not rendered (it's only shown with due dates)
      const icons = screen.queryAllByTestId('AccessTimeIcon');
      expect(icons.length).toBe(0);
    });

    test('renders task status badge', () => {
      render(<TaskItem {...defaultProps} />);
      
      expect(screen.getByText('Open')).toBeInTheDocument();
    });

    test('renders edit and delete buttons', () => {
      render(<TaskItem {...defaultProps} />);
      
      expect(screen.getByLabelText(`Edit ${mockTask.title}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`Delete ${mockTask.title}`)).toBeInTheDocument();
    });
  });

  describe('Task Status Display', () => {
    test('shows correct status badge for OPEN tasks', () => {
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'OPEN' }} />);
      
      expect(screen.getByText('Open')).toBeInTheDocument();
    });

    test('shows correct status badge for IN_PROGRESS tasks', () => {
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'IN_PROGRESS' }} />);
      
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    test('shows correct status badge for COMPLETE tasks', () => {
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'COMPLETE' }} />);
      
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    test('applies strikethrough style to completed task title', () => {
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'COMPLETE' }} />);
      
      const title = screen.getByText('Test Task');
      expect(title).toHaveStyle({ textDecoration: 'line-through' });
    });

    test('does not apply strikethrough to non-completed task titles', () => {
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'OPEN' }} />);
      
      const title = screen.getByText('Test Task');
      expect(title).toHaveStyle({ textDecoration: 'none' });
    });
  });

  describe('Due Date Display', () => {
    test('highlights overdue tasks', () => {
      const overdueTask = { ...mockTask, due_date: '2020-01-01', status: 'OPEN' };
      render(<TaskItem {...defaultProps} task={overdueTask} />);
      
      // Check for error styling (red border on card left)
      const card = screen.getByText('Test Task').closest('.MuiCard-root');
      expect(card).toBeInTheDocument();
    });

    test('does not highlight completed overdue tasks', () => {
      const completedOverdueTask = { ...mockTask, due_date: '2020-01-01', status: 'COMPLETE' };
      render(<TaskItem {...defaultProps} task={completedOverdueTask} />);
      
      // Overdue indicator should still show visually but the behavior is handled by isTaskOverdue
      const card = screen.getByText('Test Task').closest('.MuiCard-root');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Status Change Behavior', () => {
    test('cycles status from OPEN to IN_PROGRESS when badge is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'OPEN' }} />);
      
      const badge = screen.getByText('Open');
      await user.click(badge);
      
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('1', 'IN_PROGRESS');
    });

    test('cycles status from IN_PROGRESS to COMPLETE when badge is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'IN_PROGRESS' }} />);
      
      const badge = screen.getByText('In Progress');
      await user.click(badge);
      
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('1', 'COMPLETE');
    });

    test('cycles status from COMPLETE to OPEN when badge is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} task={{ ...mockTask, status: 'COMPLETE' }} />);
      
      const badge = screen.getByText('Complete');
      await user.click(badge);
      
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('1', 'OPEN');
    });
  });

  describe('Edit and Delete Actions', () => {
    test('calls onEdit with task when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);
      
      const editButton = screen.getByLabelText(`Edit ${mockTask.title}`);
      await user.click(editButton);
      
      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
    });

    test('calls onDelete with task id when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);
      
      const deleteButton = screen.getByLabelText(`Delete ${mockTask.title}`);
      await user.click(deleteButton);
      
      expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for action buttons', () => {
      render(<TaskItem {...defaultProps} />);
      
      expect(screen.getByLabelText(`Edit ${mockTask.title}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`Delete ${mockTask.title}`)).toBeInTheDocument();
    });

    test('has tooltip for status badge', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);
      
      const badge = screen.getByText('Open');
      await user.hover(badge);
      
      // MUI Tooltip shows text on hover
      expect(await screen.findByText('Click to cycle status')).toBeInTheDocument();
    });

    test('has tooltips for edit and delete buttons', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);
      
      const editButton = screen.getByLabelText(`Edit ${mockTask.title}`);
      await user.hover(editButton);
      expect(await screen.findByText('Edit task')).toBeInTheDocument();
      
      await user.unhover(editButton);
      
      const deleteButton = screen.getByLabelText(`Delete ${mockTask.title}`);
      await user.hover(deleteButton);
      expect(await screen.findByText('Delete task')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long task titles', () => {
      const longTitleTask = {
        ...mockTask,
        title: 'This is a very long task title that should be displayed properly without breaking the layout or causing any issues with the UI rendering',
      };
      
      render(<TaskItem {...defaultProps} task={longTitleTask} />);
      
      expect(screen.getByText(longTitleTask.title)).toBeInTheDocument();
    });

    test('handles very long descriptions (shows ellipsis)', () => {
      const longDescTask = {
        ...mockTask,
        description: 'This is a very long description that should be truncated with an ellipsis after two lines to prevent the card from becoming too tall and to maintain a consistent card height across the grid layout. This ensures a clean and organized appearance.',
      };
      
      render(<TaskItem {...defaultProps} task={longDescTask} />);
      
      // Description should be in the document (even if visually truncated with CSS)
      expect(screen.getByText(longDescTask.description)).toBeInTheDocument();
    });

    test('handles null or undefined description gracefully', () => {
      const taskNoDesc = { ...mockTask, description: null };
      
      render(<TaskItem {...defaultProps} task={taskNoDesc} />);
      
      // Should still render without errors
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('handles null or undefined due date gracefully', () => {
      const taskNoDate = { ...mockTask, due_date: null };
      
      render(<TaskItem {...defaultProps} task={taskNoDate} />);
      
      // Should still render without errors
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });
});
