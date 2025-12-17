import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import TaskItem from './TaskItem';

/**
 * Task list component - displays a grid of task items
 * @param {Array} tasks - Array of task objects
 * @param {function} onEdit - Callback when a task is edited
 * @param {function} onDelete - Callback when a task is deleted
 * @param {function} onStatusChange - Callback when task status changes
 * @param {boolean} loading - Whether tasks are loading
 */
const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, loading }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new task to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TaskList;
