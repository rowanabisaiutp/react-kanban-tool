import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock simplificado de localStorage y sessionStorage
const createStorageMock = () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
});

Object.defineProperty(window, 'localStorage', { value: createStorageMock() });
Object.defineProperty(window, 'sessionStorage', { value: createStorageMock() });

// Mocks simplificados de APIs del navegador
const createObserverMock = () => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(createObserverMock);
global.IntersectionObserver = jest.fn().mockImplementation(createObserverMock);

// Mock simplificado de console para tests
const consoleOriginals = {
  error: console.error,
  warn: console.warn,
  log: console.log,
};

beforeAll(() => {
  Object.keys(consoleOriginals).forEach(key => {
    console[key as keyof typeof consoleOriginals] = jest.fn();
  });
});

afterAll(() => {
  Object.assign(console, consoleOriginals);
});

// Mocks de APIs web
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock de crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => `test-uuid-${Date.now()}-${Math.random()}`)
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

// Limpiar mocks y timers después de cada test
afterEach(() => {
  cleanup(); // Limpia componentes React montados
  jest.clearAllTimers(); // Limpia todos los timers pendientes
  jest.clearAllMocks(); // Limpia todos los mocks
});

// Mock simplificado de styled-components
jest.mock('styled-components', () => {
  const React = require('react');
  
  // Mock básico que crea elementos HTML estándar
  const styled = new Proxy({} as any, {
    get: (_target, prop) => 
      typeof prop === 'string' 
        ? () => ({ children, ...props }: any) => React.createElement(prop, props, children)
        : undefined
  });

  // Mock del tema básico
  const mockTheme = {
    colors: { surface: '#fff', border: '#e5e7eb', primary: '#3b82f6', text: '#1f2937', background: '#f9fafb' },
    borderRadius: { lg: '8px', md: '6px', sm: '4px' },
    boxShadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  };

  return {
    default: styled,
    ThemeProvider: ({ children }: any) => children,
    keyframes: () => 'mock-keyframes',
    css: () => 'mock-css',
    useTheme: () => mockTheme,
  };
});