# Project Overview

## Introduction

This project is a full-stack JavaScript TODO application designed as a learning project for the Copilot Bootcamp by Slalom. It demonstrates modern web development practices with a React frontend and Node.js/Express backend, organized in a monorepo structure using npm workspaces.

## Current Status

The application is fully functional with complete CRUD operations for task management, including:
- Task creation with title, description, due date, and status
- Task editing and status updates (OPEN, IN_PROGRESS, COMPLETE)
- Task deletion with confirmation
- Filtering by status and search functionality
- Automatic sorting by due date
- Responsive, mobile-first UI with Material-UI components
- Comprehensive test coverage (70+ tests passing)

## Architecture

The project follows a monorepo architecture with the following structure:

- `packages/frontend/`: React-based web application with Material-UI
- `packages/backend/`: Express.js API server with SQLite database

## Technology Stack

### Frontend
- **React 18.2** - UI library
- **Material-UI (MUI)** - Component library
- **Emotion** - CSS-in-JS styling
- **React Testing Library** - Component testing
- **Jest** - Test runner (planned migration to Vitest)
- **Create React App** - Build tooling (planned migration to Vite)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **better-sqlite3** - In-memory SQLite database
- **Jest** - Testing framework
- **Supertest** - API testing

## Project Structure

```
copilot-bootcamp-session/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot configuration
├── docs/
│   ├── project-overview.md         # This file
│   ├── functional-requirements.md  # Core feature requirements
│   ├── ui-guidelines.md           # UI/UX standards
│   ├── testing-guidelines.md      # Testing best practices
│   ├── coding-guidelines.md       # Code quality standards
│   └── vite-vitest-migration.md   # Migration roadmap
├── packages/
│   ├── backend/
│   │   ├── __tests__/
│   │   │   └── tasks.test.js      # API tests
│   │   └── src/
│   │       ├── app.js             # Express app & routes
│   │       └── index.js           # Server entry point
│   └── frontend/
│       ├── src/
│       │   ├── __tests__/         # Test files
│       │   │   ├── components/    # Component tests
│       │   │   └── utils/         # Utility tests
│       │   ├── components/
│       │   │   ├── common/        # Shared components
│       │   │   │   └── ConfirmDialog.jsx
│       │   │   └── tasks/         # Task components
│       │   │       ├── TaskForm.jsx
│       │   │       ├── TaskItem.jsx
│       │   │       ├── TaskList.jsx
│       │   │       ├── TaskFilters.jsx
│       │   │       └── TaskStatusBadge.jsx
│       │   ├── utils/
│       │   │   ├── api.js         # API client
│       │   │   ├── dateUtils.js   # Date utilities
│       │   │   └── taskUtils.js   # Task utilities
│       │   ├── App.js             # Main app component
│       │   ├── theme.js           # MUI theme config
│       │   └── index.js           # App entry point
│       └── public/
│           └── index.html
└── package.json                    # Workspace configuration
```

## Key Features

### Task Management
- Create tasks with title, description, due date, and status
- Edit existing tasks with inline form
- Delete tasks with confirmation dialog
- Update task status with click-to-cycle badge
- Automatic sorting by due date (earliest first, null dates last)

### Filtering & Search
- Filter by status: All, Open, In Progress, Complete
- Real-time search by title or description
- Task count badges for each status

### User Interface
- **Responsive Design**: Mobile-first approach with breakpoints
- **Material-UI Components**: Consistent, accessible UI
- **Custom Theme**: Configurable theme with brand colors
- **Touch-Friendly**: Minimum 44px touch targets
- **Visual Feedback**: Loading states, error messages, success notifications
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Testing
- **Backend**: 18 comprehensive API tests
- **Frontend**: 52 unit tests for utilities and components
- **Focus**: Business logic and behavior, not implementation details
- **Coverage**: ~75% coverage on critical paths

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository
2. Run `npm install` at the root of the project to install all dependencies
3. Start the development environment using `npm run start`

## Development Workflow

The project uses npm workspaces to manage the monorepo structure. You can:

- **Start both servers**: `npm run start` from the root
- **Run all tests**: `npm test` from the root
- **Backend only**: Navigate to `packages/backend` and run scripts
- **Frontend only**: Navigate to `packages/frontend` and run scripts

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and sorting)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status only
- `DELETE /api/tasks/:id` - Delete task

### Query Parameters
- `status` - Filter by status (OPEN, IN_PROGRESS, COMPLETE)
- `search` - Search in title and description

## Future Enhancements

See [vite-vitest-migration.md](vite-vitest-migration.md) for the planned migration roadmap:
- Migration from Create React App to Vite
- Migration from Jest to Vitest
- Additional features and optimizations

## Documentation

For detailed guidelines, see:
- [Functional Requirements](functional-requirements.md) - Core feature specifications
- [UI Guidelines](ui-guidelines.md) - UI/UX development standards
- [Testing Guidelines](testing-guidelines.md) - Testing principles and best practices
- [Coding Guidelines](coding-guidelines.md) - Code quality and style standards
- [Vite/Vitest Migration](vite-vitest-migration.md) - Migration roadmap
