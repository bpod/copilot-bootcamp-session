import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskStatusBadge from '../../../src/components/tasks/TaskStatusBadge';

describe('TaskStatusBadge', () => {
  test('renders OPEN status correctly', () => {
    render(<TaskStatusBadge status="OPEN" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  test('renders IN_PROGRESS status correctly', () => {
    render(<TaskStatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('renders COMPLETE status correctly', () => {
    render(<TaskStatusBadge status="COMPLETE" />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });
});
