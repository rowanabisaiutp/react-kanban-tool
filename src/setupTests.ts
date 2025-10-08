import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de console methods para evitar logs en tests
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

// Mock de fetch si es necesario
global.fetch = jest.fn();

// Mock de URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock de crypto para generateId
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mocked-uuid-' + Math.random().toString(36).substr(2, 9))
  }
});

// Polyfill para TextEncoder y TextDecoder (necesario para react-router-dom)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de Date.now para tests consistentes
const mockDate = new Date('2024-01-01T00:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
global.Date.now = jest.fn(() => mockDate.getTime());

// Mock global de styled-components más robusto
jest.mock('styled-components', () => {
  const React = require('react');
  
  const createStyledComponent = (tag: string) => {
    return (_template: TemplateStringsArray, ..._interpolations: any[]) => {
      return ({ children, ...props }: any) => {
        return React.createElement(tag, {
          ...props,
          'data-testid': props['data-testid'] || `styled-${tag}`,
        }, children);
      };
    };
  };

  // Crear un objeto que responda a cualquier propiedad
  const styled = new Proxy({} as any, {
    get: (_target, prop) => {
      if (typeof prop === 'string') {
        return createStyledComponent(prop);
      }
      return undefined;
    },
    has: () => true,
    ownKeys: () => [],
  });

  return {
    default: styled,
    ThemeProvider: ({ children }: any) => children,
    keyframes: (_template: TemplateStringsArray) => 'mock-keyframes',
    css: (_template: TemplateStringsArray, ..._interpolations: any[]) => 'mock-css',
    useTheme: () => ({
      colors: {
        surface: '#ffffff',
        border: '#e5e7eb',
        primary: '#3b82f6',
        text: '#1f2937',
        background: '#f9fafb',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    }),
  };
});