import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { validateTaskData } from '../../utils/taskUtils';

/**
 * Task form component for creating/editing tasks
 * @param {boolean} open - Whether dialog is open
 * @param {Object} initialData - Initial task data for editing
 * @param {function} onSubmit - Callback when form is submitted
 * @param {function} onCancel - Callback when form is cancelled
 * @param {string} title - Dialog title
 */
const TaskForm = ({
  open,
  initialData = {},
  onSubmit,
  onCancel,
  title = 'Add Task',
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    due_date: initialData.due_date || '',
    status: initialData.status || 'OPEN',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const validation = validateTaskData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      status: 'OPEN',
    });
    setErrors({});
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-form-dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="task-form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              inputProps={{
                'aria-label': 'Task title',
              }}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              inputProps={{
                'aria-label': 'Task description',
              }}
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={formData.due_date}
              onChange={handleChange('due_date')}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.due_date}
              helperText={errors.due_date}
              inputProps={{
                'aria-label': 'Task due date',
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={formData.status}
                onChange={handleChange('status')}
                aria-label="Task status"
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETE">Complete</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData.id ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
