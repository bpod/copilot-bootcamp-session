# Testing Guidelines

## Overview

Testing is a critical part of our development process. All code should be properly tested to ensure reliability, maintainability, and quality. This document outlines our testing principles and best practices.

## Testing Philosophy

### Core Principles
- **Test First Mindset**: Consider testability when designing features
- **Business Value Focus**: Tests should validate business logic and requirements, not implementation details
- **Maintainability**: Tests should be easy to understand, update, and maintain
- **Coverage with Purpose**: Aim for meaningful test coverage, not just high percentages
- **Fast Feedback**: Tests should run quickly to enable rapid development cycles

### Test Requirements
- All new features must include appropriate tests
- Bug fixes should include tests that verify the fix
- Tests should be written alongside feature development, not as an afterthought
- Code reviews must include test review

## Testing Levels

### Unit Tests
Unit tests verify individual components, functions, or modules in isolation.

#### Scope
- Test individual components and functions
- Focus on business logic and data transformations
- Verify component behavior and state management
- Test custom hooks independently

#### Best Practices
- **Focus on Business Value**: Test what the component does, not how it does it
- **Avoid Implementation Details**: Don't test internal state or private methods directly
- **Test Behavior, Not Interaction**: Focus on outcomes rather than specific user interactions
- **Keep Tests Simple**: Each test should verify one specific behavior
- **Use Meaningful Names**: Test names should clearly describe what is being tested

#### Example
```javascript
// Good: Tests business value
test('calculates total price with discount correctly', () => {
  const result = calculateTotal(100, 0.2);
  expect(result).toBe(80);
});

// Avoid: Tests implementation details
test('calls internal method twice', () => {
  // This tests HOW, not WHAT
});
```

### Integration Tests
Integration tests verify that multiple components or modules work together correctly.

#### Scope
- Test interactions between components
- Verify data flow between frontend and backend
- Test state management across the application
- Validate API integrations

#### Best Practices
- Test realistic user workflows
- Use actual implementations where possible, mock only external dependencies
- Verify side effects and state changes
- Test error handling and edge cases

### End-to-End (E2E) Tests
E2E tests verify complete user workflows from start to finish.

#### Scope
- Test critical user journeys
- Verify the application works as a whole
- Test in environments that closely mirror production
- Validate cross-browser compatibility

#### Best Practices
- Focus on high-value user workflows
- Keep E2E tests focused and maintainable
- Run E2E tests in CI/CD pipeline
- Balance coverage with execution time

## Technology Stack

### Testing Tools

#### Vitest
- **Primary Unit Testing Framework**: Use Vitest for all unit and integration tests
- **Fast Execution**: Leverages Vite's transformation pipeline for speed
- **Jest Compatible**: Familiar API for developers coming from Jest
- **Native ESM Support**: Works seamlessly with modern JavaScript modules

#### React Testing Library
- **Component Testing**: Use React Testing Library for testing React components
- **User-Centric Testing**: Encourages testing from the user's perspective
- **Accessibility Focus**: Promotes accessible component design

#### Example Configuration
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Other Tools
- **Playwright** or **Cypress**: For E2E testing
- **Mock Service Worker (MSW)**: For mocking API requests
- **@testing-library/user-event**: For simulating user interactions
- **@testing-library/jest-dom**: For additional matchers

## Testing Best Practices

### Writing Testable Code
- Keep functions pure when possible
- Use dependency injection for external dependencies
- Separate business logic from UI components
- Design components with single responsibilities

### Test Organization
- Colocate tests with source files or use a `__tests__` directory
- Use descriptive test suite names with `describe` blocks
- Group related tests together
- Follow the Arrange-Act-Assert (AAA) pattern

```javascript
describe('TaskManager', () => {
  describe('addTask', () => {
    test('adds task with valid data', () => {
      // Arrange
      const manager = new TaskManager();
      const task = { title: 'Test Task', dueDate: '2025-12-31' };
      
      // Act
      manager.addTask(task);
      
      // Assert
      expect(manager.getTasks()).toHaveLength(1);
      expect(manager.getTasks()[0]).toMatchObject(task);
    });
  });
});
```

### Test Coverage
- Aim for meaningful coverage of critical paths
- Focus on business logic and edge cases
- Don't obsess over 100% coverage
- Use coverage reports to identify untested critical code

### Mocking and Stubbing
- Mock external dependencies (APIs, databases, third-party services)
- Avoid mocking internal application code when possible
- Use real implementations in integration tests
- Keep mocks simple and maintainable

### Async Testing
- Use async/await for asynchronous tests
- Wait for async operations to complete before assertions
- Use React Testing Library's `waitFor` and `findBy` queries
- Test loading states and error handling

```javascript
test('loads and displays tasks', async () => {
  render(<TaskList />);
  
  // Wait for tasks to load
  const tasks = await screen.findAllByRole('listitem');
  
  expect(tasks).toHaveLength(3);
});
```

### Accessibility Testing
- Test with screen reader-friendly queries (`getByRole`, `getByLabelText`)
- Verify keyboard navigation works correctly
- Check for proper ARIA attributes
- Use @axe-core/react for automated accessibility testing

## Component Testing Guidelines

### What to Test
- **Rendering**: Component renders with default and custom props
- **Behavior**: Component responds correctly to user interactions
- **State Changes**: Component updates correctly when state changes
- **Props**: Component handles different prop combinations
- **Edge Cases**: Component handles empty states, errors, loading states
- **Accessibility**: Component is accessible to all users

### What NOT to Test
- Implementation details (internal state, private methods)
- Third-party library internals
- Styles and CSS (unless critical to functionality)
- Exact HTML structure (test behavior, not markup)

### Example Component Test
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: 'OPEN',
  };

  test('displays task title', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls onStatusChange when status is updated', async () => {
    const handleStatusChange = vi.fn();
    render(<TaskItem task={mockTask} onStatusChange={handleStatusChange} />);
    
    const statusButton = screen.getByRole('button', { name: /change status/i });
    await userEvent.click(statusButton);
    
    expect(handleStatusChange).toHaveBeenCalledWith('1', 'IN_PROGRESS');
  });
});
```

## Continuous Integration

### CI/CD Requirements
- All tests must pass before code can be merged
- Run tests automatically on every pull request
- Generate and track coverage reports
- Fail builds if critical coverage thresholds are not met

### Test Execution
- Run unit and integration tests on every commit
- Run E2E tests on pull requests and before deployment
- Use parallel test execution to speed up CI pipeline
- Cache dependencies to improve build times

## Maintenance

### Keeping Tests Healthy
- Regularly review and refactor tests
- Remove or update obsolete tests
- Keep test dependencies up to date
- Fix flaky tests immediately
- Monitor test execution time and optimize slow tests

### Test Debt
- Address test failures promptly
- Don't skip or ignore failing tests
- Refactor brittle tests that break frequently
- Update tests when requirements change

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Training
- Review example tests in the codebase
- Pair program on testing with team members
- Share testing knowledge in team meetings
- Contribute to testing documentation
