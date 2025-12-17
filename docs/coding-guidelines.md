# Coding Guidelines

## Overview

This document outlines the coding standards, style guidelines, and best practices for our project. Following these guidelines ensures code consistency, maintainability, and quality across the codebase.

## Code Quality Tools

### ESLint
- **Use Latest Version**: Always use the latest stable version of ESLint
- **Configuration**: Extend from recommended rulesets (e.g., `eslint:recommended`, `plugin:react/recommended`)
- **Custom Rules**: Configure project-specific rules in `.eslintrc.js` or `.eslintrc.json`
- **Run Regularly**: Integrate ESLint into your development workflow and CI/CD pipeline
- **Fix Issues**: Address linting errors and warnings before committing code

#### Example Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "react/prop-types": "warn"
  }
}
```

### Prettier
- **Automatic Formatting**: Use Prettier for consistent code formatting
- **Configuration**: Define formatting rules in `.prettierrc` or `prettier.config.js`
- **Editor Integration**: Configure your editor to format on save
- **Consistency**: Ensure all team members use the same Prettier configuration

#### Recommended Settings
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### Husky Pre-Commit Hooks
- **Automated Checks**: Use Husky to run checks before commits
- **Lint Staged**: Combine with `lint-staged` to check only staged files
- **Prevent Bad Commits**: Block commits that fail linting or formatting checks
- **Run Tests**: Optionally run relevant tests before committing

#### Example Setup
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

## Code Organization

### DUCKS Pattern
- **Module Structure**: Use the DUCKS (Redux Ducks) pattern for organizing Redux/state management code
- **Colocate Related Code**: Keep actions, reducers, and selectors in the same file
- **Clear Exports**: Export action creators, selectors, and the reducer as named exports
- **Scalability**: Organize by feature rather than by type

#### DUCKS Structure Example
```javascript
// tasksSlice.js

// Action Types
const ADD_TASK = 'tasks/ADD_TASK';
const UPDATE_TASK = 'tasks/UPDATE_TASK';
const DELETE_TASK = 'tasks/DELETE_TASK';

// Action Creators
export const addTask = (task) => ({ type: ADD_TASK, payload: task });
export const updateTask = (id, updates) => ({ type: UPDATE_TASK, payload: { id, updates } });
export const deleteTask = (id) => ({ type: DELETE_TASK, payload: id });

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTaskById = (state, id) => state.tasks.items.find(task => task.id === id);

// Reducer
const initialState = { items: [] };
export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, items: [...state.items, action.payload] };
    // ... other cases
    default:
      return state;
  }
}
```

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── services/           # API and external service integrations
├── store/              # State management (DUCKS modules)
├── styles/             # Global styles and theme
├── constants/          # Application constants
└── types/              # TypeScript types/interfaces
```

## Code Style and Formatting

### General Formatting Rules
- **Indentation**: Use 2 spaces for indentation (no tabs)
- **Line Length**: Keep lines under 80-100 characters when possible
- **Semicolons**: Use semicolons at the end of statements
- **Quotes**: Use single quotes for strings (enforced by Prettier)
- **Trailing Commas**: Use trailing commas in multi-line arrays and objects
- **Spacing**: Add spaces around operators and after keywords

### Naming Conventions
- **Variables and Functions**: Use camelCase (e.g., `getUserData`, `taskList`)
- **Components**: Use PascalCase (e.g., `TaskItem`, `UserProfile`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Private Functions**: Prefix with underscore if needed (e.g., `_internalHelper`)
- **Boolean Variables**: Use descriptive prefixes (e.g., `isLoading`, `hasError`, `canEdit`)

### Import Organization
- **Order**: Group imports in a consistent order
  1. External libraries (React, third-party packages)
  2. Internal modules (components, hooks, utils)
  3. Styles and assets
- **Spacing**: Add blank lines between import groups
- **Named vs Default**: Prefer named exports for better refactoring support

#### Example
```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

// Internal modules
import TaskItem from '../components/TaskItem';
import { useTasks } from '../hooks/useTasks';
import { formatDate } from '../utils/dateUtils';

// Styles
import './TaskList.css';
```

## Best Practices

### DRY (Don't Repeat Yourself)
- **Eliminate Duplication**: Extract repeated code into reusable functions or components
- **Single Source of Truth**: Keep logic in one place
- **Abstraction**: Create abstractions for common patterns
- **Refactor Regularly**: Continuously look for opportunities to reduce duplication

### Component Reuse
- **Prefer Reuse Over Creation**: Before creating a new component, check if an existing one can be adapted
- **Configurable Components**: Build components that accept props for customization
- **Composition**: Use composition to build complex UIs from simple components
- **Component Library**: Maintain a library of reusable components

### Utility Functions
- **Common Functions**: Extract common logic into utility functions
- **Pure Functions**: Keep utilities pure (no side effects) when possible
- **Well-Named**: Use descriptive names that clearly indicate purpose
- **Documented**: Add JSDoc comments for complex utilities
- **Tested**: Write unit tests for utility functions

#### Example Utility Structure
```javascript
// utils/dateUtils.js

/**
 * Formats a date string to a user-friendly format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Checks if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateString) => {
  return new Date(dateString) < new Date();
};
```

### Code Comments
- **When to Comment**: Explain "why", not "what"
- **Self-Documenting Code**: Write clear code that minimizes the need for comments
- **JSDoc**: Use JSDoc for function and component documentation
- **TODO Comments**: Use `// TODO:` for planned improvements
- **FIXME Comments**: Use `// FIXME:` for known issues

### Error Handling
- **Handle Errors Gracefully**: Always handle potential errors
- **User-Friendly Messages**: Provide clear error messages to users
- **Logging**: Log errors for debugging purposes
- **Fallbacks**: Provide fallback UI for error states

### Performance
- **Optimize Wisely**: Profile before optimizing
- **Avoid Premature Optimization**: Focus on readability first
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Lazy Loading**: Implement code splitting for large components

## Code Review

### Review Checklist
- Code follows style guidelines and formatting rules
- No linting or formatting errors
- Logic is clear and easy to understand
- Code is DRY and reusable where appropriate
- Tests are included and pass
- No unnecessary dependencies added
- Performance considerations addressed
- Documentation is updated if needed

### Review Best Practices
- Be constructive and respectful in feedback
- Focus on code, not the person
- Suggest improvements with examples
- Approve only when all concerns are addressed
- Learn from each review

## Continuous Improvement

### Regular Refactoring
- Schedule time for refactoring and code cleanup
- Address technical debt proactively
- Keep dependencies up to date
- Review and update coding guidelines periodically

### Knowledge Sharing
- Share learnings from code reviews
- Document patterns and anti-patterns
- Conduct code walkthroughs for complex features
- Maintain an internal wiki or documentation

### Tooling Updates
- Stay current with tool updates (ESLint, Prettier, Husky)
- Evaluate new tools and libraries
- Update configuration files as needed
- Share tool tips and tricks with the team

## Resources

### Documentation
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

### Learning
- Review pull requests to learn from others
- Participate in code review discussions
- Stay updated with JavaScript/React best practices
- Attend team coding sessions or workshops
