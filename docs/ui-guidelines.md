# UI Guidelines

## Technology Stack

### Core Technologies
- **React**: Use the latest stable version of React for building the user interface
- **Vite**: Use Vite as the build tool and development server for fast development experience
- **Material-UI (MUI)**: Primary component library for consistent UI design
- **Emotion**: CSS-in-JS solution for styled components

## Architecture Patterns

### Component Design

#### Reusable Hooks
- Extract business logic into custom hooks for reusability
- Follow React hooks best practices (naming, dependencies, etc.)
- Keep hooks focused on a single responsibility
- Examples: `useTaskManager`, `useAuth`, `useLocalStorage`

#### Component Composition
- Break down complex components into smaller, composable pieces
- Favor composition over inheritance
- Use render props and children props for flexible component APIs
- Create a clear component hierarchy

#### Component Reuse
- Build generic, configurable components that can be reused across the application
- Use prop-driven components with sensible defaults
- Document component props and usage examples
- Maintain a component library/documentation

### Code Organization
- Separate presentational and container components
- Keep components small and focused on a single responsibility
- Use meaningful naming conventions for components and files
- Group related components and utilities together

## Theming

### Custom Theme Architecture

#### Theme Provider
- Use MUI's `ThemeProvider` to wrap the application
- Define a custom theme object with brand colors, typography, and spacing
- Support theme overrides at different levels of the component tree

#### Theme Structure
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#...' },
    secondary: { main: '#...' },
    // ... custom colors
  },
  typography: {
    // ... custom typography
  },
  spacing: 8,
  // ... other theme properties
});
```

#### Theme Customization
- Allow theme properties to be overridden through configuration
- Support environment-specific theme variations
- Document all customizable theme properties

## Styling

### Emotion Styled Components
- Use Emotion styled components for custom styling where MUI components don't suffice
- Leverage theme values in styled components for consistency
- Keep styled components close to their usage
- Use TypeScript for type-safe styled components

```javascript
import styled from '@emotion/styled';

const StyledCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));
```

### Styling Best Practices
- Prefer styled components over inline styles
- Use MUI's `sx` prop for one-off styling
- Maintain consistent spacing using theme spacing units
- Follow BEM or similar naming conventions for class names when needed

## Responsive Design

### Mobile-First Approach
- Design and develop for mobile screens first
- Progressively enhance for larger screens
- Use MUI's responsive breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
- Test on various device sizes regularly

### Responsive Patterns
- Use flexible layouts (Flexbox, Grid)
- Implement responsive typography
- Adapt component behavior for different screen sizes
- Handle touch and mouse interactions appropriately

```javascript
// Example responsive styling
sx={{
  width: { xs: '100%', sm: '80%', md: '60%' },
  padding: { xs: 2, md: 4 },
}}
```

## Accessibility

### Core Principles
- Follow WCAG 2.1 Level AA guidelines
- Ensure keyboard navigation works throughout the application
- Provide appropriate ARIA labels and roles
- Maintain sufficient color contrast ratios

### Implementation
- Use semantic HTML elements
- Add alt text for images
- Ensure form inputs have associated labels
- Test with screen readers
- Support focus indicators
- Handle focus management in modals and dynamic content

### MUI Accessibility
- Leverage MUI's built-in accessibility features
- Use `aria-label` and `aria-describedby` props where needed
- Ensure interactive elements are keyboard accessible

## Internationalization (i18n)

### Guidelines
- Design UI to accommodate text expansion (some languages require more space)
- Avoid hard-coded text strings in components
- Use a translation library (e.g., react-i18next)
- Support RTL (right-to-left) languages
- Format dates, numbers, and currencies according to locale

### Implementation
- Extract all user-facing strings to translation files
- Use translation keys consistently
- Test with different languages to ensure layout integrity
- Support dynamic language switching

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <button>{t('common.save')}</button>;
};
```

## Performance

### Optimization Strategies
- Use React.memo for expensive components
- Implement code splitting and lazy loading
- Optimize bundle size with proper tree shaking
- Use production builds for deployment
- Monitor and optimize rendering performance

### Vite Optimizations
- Leverage Vite's fast HMR (Hot Module Replacement)
- Configure proper build settings for production
- Use dynamic imports for route-based code splitting

## Testing

### UI Testing
- Write unit tests for components using React Testing Library
- Test accessibility with @testing-library/jest-dom
- Test responsive behavior with viewport testing utilities
- Ensure proper keyboard navigation in tests

## Documentation

### Component Documentation
- Document props, usage examples, and edge cases
- Include screenshots or live examples where helpful
- Maintain a style guide or component library documentation
- Keep documentation up to date with code changes
