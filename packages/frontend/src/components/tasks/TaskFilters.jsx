import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getTaskCountByStatus } from '../../utils/taskUtils';

/**
 * Task filters component
 * Provides filtering by status and search functionality
 * @param {string} statusFilter - Current status filter
 * @param {string} searchTerm - Current search term
 * @param {function} onStatusFilterChange - Callback when status filter changes
 * @param {function} onSearchChange - Callback when search term changes
 * @param {Array} tasks - All tasks for count display
 */
const TaskFilters = ({
  statusFilter,
  searchTerm,
  onStatusFilterChange,
  onSearchChange,
  tasks = [],
}) => {
  const counts = getTaskCountByStatus(tasks);
  const totalCount = tasks.length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 500 }}>
        Filter Tasks
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(event, newValue) => {
            if (newValue !== null) {
              onStatusFilterChange(newValue);
            }
          }}
          aria-label="filter by status"
          size="small"
          sx={{
            flexWrap: 'wrap',
            '& .MuiToggleButton-root': {
              minHeight: 44,
            },
          }}
        >
          <ToggleButton value="ALL" aria-label="all tasks">
            All ({totalCount})
          </ToggleButton>
          <ToggleButton value="OPEN" aria-label="open tasks">
            Open ({counts.OPEN})
          </ToggleButton>
          <ToggleButton value="IN_PROGRESS" aria-label="in progress tasks">
            In Progress ({counts.IN_PROGRESS})
          </ToggleButton>
          <ToggleButton value="COMPLETE" aria-label="completed tasks">
            Complete ({counts.COMPLETE})
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{
            flexGrow: 1,
            '& .MuiInputBase-root': {
              minHeight: 44,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{
            'aria-label': 'Search tasks',
          }}
        />
      </Box>
    </Paper>
  );
};

export default TaskFilters;
