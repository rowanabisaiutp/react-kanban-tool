import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme as useCustomTheme } from './useTheme';
import { theme } from '../styles/theme';

// Hook para usar el tema en styled-components
export const useStyledTheme = () => {
  const { theme: currentTheme } = useCustomTheme();
  
  // Retornar el tema apropiado basado en el estado actual
  return currentTheme === 'dark' ? { ...theme, colors: theme.dark.colors } : theme;
};

// Provider que combina el tema personalizado con styled-components
export const StyledThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme: currentTheme } = useCustomTheme();
  
  const styledTheme = currentTheme === 'dark' 
    ? { ...theme, colors: theme.dark.colors }
    : theme;

  return (
    <StyledThemeProvider theme={styledTheme}>
      {children}
    </StyledThemeProvider>
  );
};
