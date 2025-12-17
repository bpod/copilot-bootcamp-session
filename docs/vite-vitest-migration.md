# Vite & Vitest Migration Roadmap

## Overview

This document outlines the plan to migrate the TODO app from Create React App (CRA) to Vite, and from Jest to Vitest. These migrations will provide faster development experience, better performance, and modern tooling.

## Why Migrate?

### Benefits of Vite
- **Faster Cold Starts**: Instant server start using native ES modules
- **Lightning Fast HMR**: Hot Module Replacement updates in milliseconds
- **Optimized Builds**: Built-in Rollup for production builds
- **Better DX**: Superior developer experience with faster feedback
- **Modern Standards**: Built for ESM-first development
- **Smaller Bundles**: Better tree-shaking and code splitting

### Benefits of Vitest
- **Native Vite Integration**: Shares same config and transformation pipeline
- **Jest Compatible**: Familiar API, easy migration
- **Fast Execution**: Leverages Vite's transformation pipeline
- **Native ESM**: First-class ESM support
- **Better Watch Mode**: Smarter test re-runs
- **TypeScript Support**: Built-in without additional configuration

## Migration Phases

### Phase 1: Preparation (Pre-Migration)

#### 1.1 Audit Current Setup
- [x] Document current build configuration
- [x] List all Jest configurations and plugins
- [x] Identify CRA-specific dependencies
- [x] Review custom Jest setup files
- [ ] Document environment variables usage
- [ ] List all build scripts and their purposes

#### 1.2 Update Dependencies
- [ ] Update React and React DOM to latest stable versions
- [ ] Update Material-UI to latest version
- [ ] Ensure all dependencies support ESM
- [ ] Review and update polyfills if needed

#### 1.3 Code Audit
- [ ] Identify usage of CRA-specific features (PUBLIC_URL, etc.)
- [ ] Review import statements (check for require() usage)
- [ ] Audit test files for Jest-specific features
- [ ] Document custom test utilities and mocks

### Phase 2: Vite Migration

#### 2.1 Install Vite Dependencies
```bash
npm install --save-dev vite @vitejs/plugin-react
```

#### 2.2 Create Vite Configuration
Create `packages/frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
```

#### 2.3 Update index.html
- Move `public/index.html` to root of `packages/frontend/`
- Add script tag: `<script type="module" src="/src/index.js"></script>`
- Remove `%PUBLIC_URL%` references
- Update asset references

#### 2.4 Update Package Scripts
Replace in `packages/frontend/package.json`:
```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 2.5 Remove CRA Dependencies
```bash
npm uninstall react-scripts
```

#### 2.6 Update Environment Variables
- Rename `.env` variables from `REACT_APP_*` to `VITE_*`
- Update code to use `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`

#### 2.7 Update Import Statements
- Ensure all imports use explicit file extensions where needed
- Update any dynamic imports to Vite's syntax
- Remove any CRA-specific imports

#### 2.8 Testing & Validation
- [ ] Verify development server starts correctly
- [ ] Test hot module replacement
- [ ] Verify all routes work
- [ ] Test API proxy functionality
- [ ] Verify production build works
- [ ] Test built files in preview mode

### Phase 3: Vitest Migration

#### 3.1 Install Vitest Dependencies
```bash
npm install --save-dev vitest @vitest/ui jsdom
npm install --save-dev @testing-library/jest-dom
```

#### 3.2 Create Vitest Configuration
Update `packages/frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/index.js',
        '**/*.test.js',
        '**/*.test.jsx',
      ],
    },
  },
});
```

#### 3.3 Update setupTests.js
Update `packages/frontend/src/setupTests.js`:
```javascript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Make expect available globally
global.expect = expect;
```

#### 3.4 Update Test Files
- Replace `jest.fn()` with `vi.fn()` (import `vi` from vitest)
- Replace `jest.mock()` with `vi.mock()`
- Update any Jest-specific matchers if needed
- Add `import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'` to test files

#### 3.5 Update Package Scripts
Update `packages/frontend/package.json`:
```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### 3.6 Remove Jest Dependencies
```bash
npm uninstall jest @testing-library/jest-dom
```

#### 3.7 Testing & Validation
- [ ] Run all tests and ensure they pass
- [ ] Verify coverage reports work
- [ ] Test watch mode functionality
- [ ] Try Vitest UI (`npm run test:ui`)
- [ ] Verify test performance improvements

### Phase 4: Backend Vitest Migration (Optional)

#### 4.1 Install Vitest for Backend
```bash
cd packages/backend
npm install --save-dev vitest
```

#### 4.2 Create Vitest Configuration
Create `packages/backend/vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '**/*.test.js'],
    },
  },
});
```

#### 4.3 Update Test Files
- Replace `jest.fn()` with `vi.fn()`
- Update imports to include `vi` from vitest
- Update any Jest-specific matchers

#### 4.4 Update Package Scripts
```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest"
  }
}
```

#### 4.5 Remove Jest
```bash
npm uninstall jest
```

### Phase 5: Optimization & Enhancement

#### 5.1 Code Splitting
- Implement route-based code splitting using React.lazy()
- Split large components into separate chunks
- Analyze bundle size with `vite-plugin-bundle-analyzer`

#### 5.2 Performance Optimization
- Configure Vite build options for optimal chunks
- Enable compression plugins if needed
- Optimize asset loading strategies

#### 5.3 Development Experience
- Configure Vitest UI for better test visualization
- Set up custom Vite plugins if needed
- Optimize HMR boundaries

#### 5.4 CI/CD Updates
- Update CI/CD pipelines to use new build commands
- Update deployment scripts
- Verify build artifacts

## Migration Checklist

### Pre-Migration
- [ ] Backup current working state
- [ ] Create migration branch
- [ ] Document current functionality
- [ ] Ensure all tests pass

### Vite Migration
- [ ] Install Vite dependencies
- [ ] Create Vite configuration
- [ ] Move and update index.html
- [ ] Update package scripts
- [ ] Remove CRA dependencies
- [ ] Update environment variables
- [ ] Test development mode
- [ ] Test production build
- [ ] Verify all features work

### Vitest Migration
- [ ] Install Vitest dependencies
- [ ] Create/update Vitest configuration
- [ ] Update setupTests.js
- [ ] Update all test files
- [ ] Update package scripts
- [ ] Remove Jest dependencies
- [ ] Run all tests
- [ ] Verify coverage reports

### Post-Migration
- [ ] Performance testing
- [ ] Update documentation
- [ ] Update README with new scripts
- [ ] Train team on new tools
- [ ] Monitor for issues in production

## Troubleshooting Guide

### Common Issues

#### Issue: Import errors with .jsx/.js extensions
**Solution**: Vite requires explicit extensions for JSX files. Update imports:
```javascript
// Before
import TaskItem from './TaskItem';

// After
import TaskItem from './TaskItem.jsx';
```

#### Issue: Environment variables not working
**Solution**: Update from `process.env.REACT_APP_*` to `import.meta.env.VITE_*`

#### Issue: Tests failing with module errors
**Solution**: Ensure `globals: true` is set in vitest config and imports are correct

#### Issue: Slow HMR after migration
**Solution**: Check for large dependency trees and split code appropriately

#### Issue: Build errors with Material-UI
**Solution**: Ensure MUI is updated to latest version compatible with Vite

## Timeline Estimate

- **Phase 1 (Preparation)**: 1-2 days
- **Phase 2 (Vite Migration)**: 2-3 days
- **Phase 3 (Vitest Migration)**: 1-2 days
- **Phase 4 (Backend Vitest)**: 1 day
- **Phase 5 (Optimization)**: 1-2 days
- **Testing & Validation**: 1-2 days

**Total Estimated Time**: 1-2 weeks

## Success Criteria

- [ ] All existing functionality works without regression
- [ ] All tests pass with Vitest
- [ ] Development server starts in < 1 second
- [ ] HMR updates in < 100ms
- [ ] Production build completes successfully
- [ ] Build size is equal or smaller than CRA build
- [ ] Test execution time improved by at least 20%
- [ ] Team trained on new tooling
- [ ] Documentation updated

## Resources

### Documentation
- [Vite Official Docs](https://vitejs.dev/)
- [Vitest Official Docs](https://vitest.dev/)
- [Migrating from CRA to Vite](https://vitejs.dev/guide/migration.html)
- [Vitest Migration Guide](https://vitest.dev/guide/migration.html)

### Tools
- [vite-plugin-bundle-analyzer](https://github.com/nonzzz/vite-plugin-bundle-analyzer)
- [@vitest/ui](https://vitest.dev/guide/ui.html)
- [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)

## Notes

- Keep CRA setup in a separate branch until Vite migration is fully validated
- Run parallel testing during transition period
- Monitor build times and performance metrics
- Document any custom configurations for team reference
- Consider gradual rollout: dev environment first, then staging, then production
