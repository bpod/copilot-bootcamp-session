import React from 'react';
import { Chip } from '@mui/material';
import { getStatusLabel, getStatusColor } from '../../utils/taskUtils';

/**
 * Task status badge component
 * Displays task status as a colored chip
 * @param {string} status - Task status (OPEN, IN_PROGRESS, COMPLETE)
 * @param {string} size - Chip size (small, medium)
 */
const TaskStatusBadge = ({ status, size = 'small' }) => {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default TaskStatusBadge;
