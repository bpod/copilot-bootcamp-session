import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/tasks/TaskForm';

describe('TaskForm', () => {
  const defaultProps = {
    open: true,
    initialData: {},
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    title: 'Add Task',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders form when open is true', () => {
      render(<TaskForm {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Add Task' })).toBeInTheDocument();
    });

    test('does not render form when open is false', () => {
      render(<TaskForm {...defaultProps} open={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('renders all form fields', () => {
      render(<TaskForm {...defaultProps} />);
      
      expect(screen.getByLabelText(/Task title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task due date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task status/i)).toBeInTheDocument();
    });

    test('renders correct buttons', () => {
      render(<TaskForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    test('displays custom title prop', () => {
      render(<TaskForm {...defaultProps} title="Edit Task" />);
      
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    test('initializes with empty values for new task', () => {
      render(<TaskForm {...defaultProps} />);
      
      expect(screen.getByLabelText(/Task title/i)).toHaveValue('');
      expect(screen.getByLabelText(/Task description/i)).toHaveValue('');
      expect(screen.getByLabelText(/Task due date/i)).toHaveValue('');
    });

    test('initializes with provided initial data for editing', () => {
      const initialData = {
        id: '1',
        title: 'Existing Task',
        description: 'Task description',
        due_date: '2025-12-31',
        status: 'IN_PROGRESS',
      };
      
      render(<TaskForm {...defaultProps} initialData={initialData} />);
      
      expect(screen.getByLabelText(/Task title/i)).toHaveValue('Existing Task');
      expect(screen.getByLabelText(/Task description/i)).toHaveValue('Task description');
      expect(screen.getByLabelText(/Task due date/i)).toHaveValue('2025-12-31');
    });

    test('shows "Update Task" button when editing existing task', () => {
      const initialData = { id: '1', title: 'Existing Task' };
      
      render(<TaskForm {...defaultProps} initialData={initialData} />);
      
      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    });
  });

  describe('Form Input Behavior', () => {
    test('updates title field when user types', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/Task title/i);
      await user.type(titleInput, 'New Task');
      
      expect(titleInput).toHaveValue('New Task');
    });

    test('updates description field when user types', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const descriptionInput = screen.getByLabelText(/Task description/i);
      await user.type(descriptionInput, 'Task details');
      
      expect(descriptionInput).toHaveValue('Task details');
    });

    test('updates due date field when user selects date', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const dateInput = screen.getByLabelText(/Task due date/i);
      await user.type(dateInput, '2025-12-31');
      
      expect(dateInput).toHaveValue('2025-12-31');
    });

    test('status field renders with default value', () => {
      render(<TaskForm {...defaultProps} />);
      
      // Verify status field exists and has default value
      const statusField = screen.getByLabelText(/Task status/i);
      expect(statusField).toBeInTheDocument();
      // Default status is OPEN
      expect(statusField).toHaveTextContent('Open');
    });
  });

  describe('Form Validation', () => {
    test('shows error when submitting with empty title', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
      
      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    test('does not show error for empty description (optional field)', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/Task title/i);
      await user.type(titleInput, 'Valid Task');
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    test('clears error when user starts typing in field with error', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
      
      // Type in title field
      const titleInput = screen.getByLabelText(/Task title/i);
      await user.type(titleInput, 'A');
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('calls onSubmit with form data when validation passes', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      await user.type(screen.getByLabelText(/Task title/i), 'New Task');
      await user.type(screen.getByLabelText(/Task description/i), 'Task description');
      await user.type(screen.getByLabelText(/Task due date/i), '2025-12-31');
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
          due_date: '2025-12-31',
          status: 'OPEN',
        });
      });
    });

    test('calls onCancel after successful submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      await user.type(screen.getByLabelText(/Task title/i), 'New Task');
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
    });

    test('resets form after successful submission', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TaskForm {...defaultProps} />);
      
      await user.type(screen.getByLabelText(/Task title/i), 'New Task');
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      // Reopen the form
      rerender(<TaskForm {...defaultProps} open={true} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Task title/i)).toHaveValue('');
      });
    });

    test('submits form with all filled fields including default status', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      await user.type(screen.getByLabelText(/Task title/i), 'Complete Task');
      await user.type(screen.getByLabelText(/Task description/i), 'With all fields');
      await user.type(screen.getByLabelText(/Task due date/i), '2025-12-31');
      // Status defaults to OPEN, no need to change it
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          title: 'Complete Task',
          description: 'With all fields',
          due_date: '2025-12-31',
          status: 'OPEN', // Default status
        });
      });
    });
  });

  describe('Form Cancellation', () => {
    test('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskForm {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test('resets form when cancelled', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TaskForm {...defaultProps} />);
      
      await user.type(screen.getByLabelText(/Task title/i), 'Abandoned Task');
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      // Reopen the form
      rerender(<TaskForm {...defaultProps} open={true} />);
      
      expect(screen.getByLabelText(/Task title/i)).toHaveValue('');
    });

    test('clears validation errors when cancelled', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TaskForm {...defaultProps} />);
      
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      // Reopen the form
      rerender(<TaskForm {...defaultProps} open={true} />);
      
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper dialog title for screen readers', () => {
      render(<TaskForm {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'task-form-dialog-title');
    });

    test('has proper ARIA labels for all form fields', () => {
      render(<TaskForm {...defaultProps} />);
      
      expect(screen.getByLabelText(/Task title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task due date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Task status/i)).toBeInTheDocument();
    });

    test('autofocuses title field when dialog opens', () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/Task title/i);
      expect(titleInput).toHaveFocus();
    });
  });
});
