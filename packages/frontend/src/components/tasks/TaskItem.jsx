import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskStatusBadge from './TaskStatusBadge';
import { formatDate, getRelativeDateDescription, isToday } from '../../utils/dateUtils';
import { isTaskOverdue } from '../../utils/taskUtils';

/**
 * Task item component - displays a single task
 * @param {Object} task - Task object
 * @param {function} onEdit - Callback when edit is clicked
 * @param {function} onDelete - Callback when delete is clicked
 * @param {function} onStatusChange - Callback when status is changed
 */
const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = isTaskOverdue(task);
  const isDueToday = task.due_date && isToday(task.due_date);

  const handleStatusClick = () => {
    let newStatus;
    if (task.status === 'OPEN') {
      newStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      newStatus = 'COMPLETE';
    } else {
      newStatus = 'OPEN';
    }
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        borderLeft: isOverdue ? '4px solid' : 'none',
        borderLeftColor: 'error.main',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 500,
              textDecoration: task.status === 'COMPLETE' ? 'line-through' : 'none',
              opacity: task.status === 'COMPLETE' ? 0.7 : 1,
            }}
          >
            {task.title}
          </Typography>
          <Tooltip title="Click to cycle status">
            <Box onClick={handleStatusClick} sx={{ cursor: 'pointer' }}>
              <TaskStatusBadge status={task.status} />
            </Box>
          </Tooltip>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description}
          </Typography>
        )}

        {task.due_date && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            <AccessTimeIcon
              sx={{
                fontSize: '1rem',
                color: isOverdue ? 'error.main' : isDueToday ? 'warning.main' : 'text.secondary',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: isOverdue ? 'error.main' : isDueToday ? 'warning.main' : 'text.secondary',
                fontWeight: isOverdue || isDueToday ? 600 : 400,
              }}
            >
              {getRelativeDateDescription(task.due_date)}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Edit task">
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete task">
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default TaskItem;
