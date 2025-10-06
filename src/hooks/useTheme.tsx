import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos de tema
export type Theme = 'light' | 'dark';

// Estado del tema
interface ThemeState {
  theme: Theme;
  isSystemTheme: boolean;
}

// Acciones del reducer
type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_SYSTEM_THEME'; payload: boolean }
  | { type: 'INIT_THEME'; payload: Theme };

// Estado inicial
const initialState: ThemeState = {
  theme: 'dark',
  isSystemTheme: false,
};

// Reducer
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        isSystemTheme: false,
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
        isSystemTheme: false,
      };
    
    case 'SET_SYSTEM_THEME':
      return {
        ...state,
        isSystemTheme: action.payload,
      };
    
    case 'INIT_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    default:
      return state;
  }
};

// Contexto
interface ThemeContextType {
  theme: Theme;
  isSystemTheme: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Funciones para manejar el tema
  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setSystemTheme = (useSystem: boolean) => {
    dispatch({ type: 'SET_SYSTEM_THEME', payload: useSystem });
    if (useSystem) {
      localStorage.removeItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      dispatch({ type: 'INIT_THEME', payload: systemTheme });
    } else {
      localStorage.setItem('theme', state.theme);
    }
  };

  // Inicializar tema al cargar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedTheme) {
      dispatch({ type: 'INIT_THEME', payload: savedTheme });
    } else {
      // Usar tema oscuro por defecto si no hay tema guardado
      dispatch({ type: 'INIT_THEME', payload: 'dark' });
    }
  }, []);

  // Aplicar tema al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases de tema anteriores
    root.classList.remove('light-theme', 'dark-theme');
    
    // Agregar clase del tema actual
    root.classList.add(`${state.theme}-theme`);
    
    // Aplicar atributo data-theme para CSS
    root.setAttribute('data-theme', state.theme);
    
    // Aplicar variables CSS del tema
    const themeColors = getThemeColors(state.theme);
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [state.theme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (state.isSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        dispatch({ type: 'INIT_THEME', payload: newTheme });
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.isSystemTheme]);

  const value: ThemeContextType = {
    theme: state.theme,
    isSystemTheme: state.isSystemTheme,
    setTheme,
    toggleTheme,
    setSystemTheme,
    isDark: state.theme === 'dark',
    isLight: state.theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Función para obtener colores del tema
const getThemeColors = (theme: Theme) => {
  const lightColors = {
    '--color-primary': '#3b82f6',
    '--color-primary-hover': '#2563eb',
    '--color-secondary': '#8b5cf6',
    '--color-secondary-hover': '#7c3aed',
    '--color-accent': '#06b6d4',
    '--color-accent-hover': '#0891b2',
    '--color-success': '#10b981',
    '--color-success-hover': '#059669',
    '--color-warning': '#f59e0b',
    '--color-warning-hover': '#d97706',
    '--color-error': '#ef4444',
    '--color-error-hover': '#dc2626',
    '--color-background': '#ffffff',
    '--color-background-secondary': '#f8fafc',
    '--color-background-tertiary': '#f1f5f9',
    '--color-surface': '#ffffff',
    '--color-surface-hover': '#f8fafc',
    '--color-border': '#e2e8f0',
    '--color-border-hover': '#cbd5e1',
    '--color-text-primary': '#1e293b',
    '--color-text-secondary': '#64748b',
    '--color-text-tertiary': '#94a3b8',
    '--color-text-inverse': '#ffffff',
    '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    '--color-shadow-hover': 'rgba(0, 0, 0, 0.15)',
    '--color-overlay': 'rgba(0, 0, 0, 0.5)',
  };

  const darkColors = {
    '--color-primary': '#60a5fa',
    '--color-primary-hover': '#3b82f6',
    '--color-secondary': '#a78bfa',
    '--color-secondary-hover': '#8b5cf6',
    '--color-accent': '#22d3ee',
    '--color-accent-hover': '#06b6d4',
    '--color-success': '#34d399',
    '--color-success-hover': '#10b981',
    '--color-warning': '#fbbf24',
    '--color-warning-hover': '#f59e0b',
    '--color-error': '#f87171',
    '--color-error-hover': '#ef4444',
    '--color-background': '#0f172a',
    '--color-background-secondary': '#1e293b',
    '--color-background-tertiary': '#334155',
    '--color-surface': '#1e293b',
    '--color-surface-hover': '#334155',
    '--color-border': '#475569',
    '--color-border-hover': '#64748b',
    '--color-text-primary': '#f1f5f9',
    '--color-text-secondary': '#cbd5e1',
    '--color-text-tertiary': '#94a3b8',
    '--color-text-inverse': '#0f172a',
    '--color-shadow': 'rgba(0, 0, 0, 0.3)',
    '--color-shadow-hover': 'rgba(0, 0, 0, 0.4)',
    '--color-overlay': 'rgba(0, 0, 0, 0.7)',
  };

  return theme === 'dark' ? darkColors : lightColors;
};
