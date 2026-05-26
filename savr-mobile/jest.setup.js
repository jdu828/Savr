// Use the provided Jest mock for AsyncStorage to avoid native module errors
const mockAsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Supabase if not already mocked
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Suppress console warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values were found in the navigation state') ||
        args[0].includes('ViewPropTypes will be removed'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values were found in the navigation state') ||
        args[0].includes('ViewPropTypes will be removed'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
