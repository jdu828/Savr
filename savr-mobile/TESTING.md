# Testing Setup Documentation

## Overview

This project now includes a comprehensive testing setup with Jest and a visual test runner screen.

## Files Created

### Test Files
- **src/services/__tests__/getIngredient.service.test.ts** - Unit tests for ingredient service
- **src/services/__tests__/getRecipe.service.test.ts** - Unit tests for recipe service
- **src/services/__tests__/recipeIngredients.service.test.ts** - Unit tests for recipe ingredients service

### Configuration Files
- **jest.config.js** - Jest configuration for React Native
- **jest.setup.js** - Jest setup file for mocking and test utilities

### Test Screen
- **app/test.tsx** - Visual test runner screen (replaces old test file)

## Running Tests

### From Terminal
```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### From App
Navigate to the test screen in your app to see test results with a visual UI. The screen displays:
- Summary of total, passed, and failed tests
- Detailed breakdown of each test suite
- Individual test status and duration
- Button to re-run tests

## Test Suites

### 1. getIngredient.service.test.ts (3 tests)
- ✓ should fetch an ingredient by id successfully
- ✓ should throw error when ingredient not found
- ✓ should throw error when database query fails

### 2. getRecipe.service.test.ts (3 tests)
- ✓ should fetch a recipe by id successfully
- ✓ should throw error when recipe not found
- ✓ should throw error when database query fails

### 3. recipeIngredients.service.test.ts (4 tests)
- ✓ should fetch recipe ingredients successfully
- ✓ should return empty array when no ingredients found
- ✓ should throw error when database query fails
- ✓ should handle missing ingredient name gracefully

## Mocking

All tests use Jest mocking to mock the Supabase client, so tests:
- Don't require actual database connections
- Run quickly
- Can be run in any environment
- Don't affect production data

## Adding New Tests

1. Create a test file in `src/__tests__/` or alongside the file being tested in a `__tests__` subdirectory
2. Follow the naming pattern: `*.test.ts` or `*.test.tsx`
3. Use the existing tests as templates
4. Import and mock any external dependencies (like Supabase)

Example:
```typescript
import { myFunction } from '../myFunction';
import { someService } from '../../lib/someService';

jest.mock('../../lib/someService');

describe('myFunction', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

## Coverage

The Jest configuration collects coverage for:
- `src/**/*.{ts,tsx}` - All source files
- Excludes type definitions and test files

Run `npm run test:coverage` to see coverage reports.

## Troubleshooting

### Tests not running
- Ensure all dependencies are installed: `npm install`
- Clear Jest cache: `npx jest --clearCache`
- Check that jest.config.js and jest.setup.js are in the project root

### Import errors
- Verify file paths in imports
- Check that mocked modules exist
- Ensure TypeScript paths are configured correctly in tsconfig.json

### Supabase mocking issues
- All tests mock Supabase to prevent real API calls
- If you need to test real Supabase calls, create integration tests separately
- Never run tests against production database credentials
