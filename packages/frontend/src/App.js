import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskFilters from './components/tasks/TaskFilters';
import ConfirmDialog from './components/common/ConfirmDialog';
import {
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from './utils/api';
import { filterTasksByStatus, searchTasks, sortTasksByDueDate } from './utils/taskUtils';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setSnackbar({ open: true, message: 'Tasks loaded successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to load tasks: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
      setSnackbar({ open: true, message: 'Task created successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to create task: ${error.message}`, severity: 'error' });
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await updateTask(editingTask.id, taskData);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to update task: ${error.message}`, severity: 'error' });
    }
  };

  const handleSubmitForm = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(taskToDelete);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to delete task: ${error.message}`, severity: 'error' });
    } finally {
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to update status: ${error.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Apply filters and search
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply status filter
    filtered = filterTasksByStatus(filtered, statusFilter);
    
    // Apply search
    filtered = searchTasks(filtered, searchTerm);
    
    // Sort by due date
    filtered = sortTasksByDueDate(filtered);
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            TODO App
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              minHeight: 44,
            }}
          >
            Add Task
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
            My Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your tasks and stay organized
          </Typography>
        </Box>

        {/* Filters */}
        <TaskFilters
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearchTerm}
          tasks={tasks}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
          loading={loading}
        />
      </Container>

      {/* Floating Action Button (Mobile) */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setFormOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Task Form Dialog */}
      <TaskForm
        open={formOpen}
        initialData={editingTask || {}}
        onSubmit={handleSubmitForm}
        onCancel={handleCloseForm}
        title={editingTask ? 'Edit Task' : 'Add Task'}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        confirmColor="error"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;