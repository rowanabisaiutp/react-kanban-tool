import { css } from 'styled-components';

// Utilidades comunes para componentes styled
export const commonStyles = {
  // Estados de focus
  focus: css`
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  `,

  // Estados de hover
  hover: {
    lift: css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.boxShadow.lg};
      }
    `,
    scale: css`
      &:hover {
        transform: scale(1.05);
      }
    `,
    opacity: css`
      &:hover {
        opacity: 0.8;
      }
    `,
  },

  // Estados de disabled
  disabled: css`
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `,

  // Transiciones comunes
  transition: {
    fast: css`
      transition: all 0.15s ease;
    `,
    normal: css`
      transition: all 0.3s ease;
    `,
    slow: css`
      transition: all 0.5s ease;
    `,
    theme: css`
      transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `,
  },

  // Layout común
  flex: {
    center: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    between: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    start: css`
      display: flex;
      align-items: center;
      justify-content: flex-start;
    `,
    end: css`
      display: flex;
      align-items: center;
      justify-content: flex-end;
    `,
  },

  // Responsive
  responsive: {
    mobile: css`
      @media (max-width: 640px) {
        /* Estilos para móvil */
      }
    `,
    tablet: css`
      @media (max-width: 768px) {
        /* Estilos para tablet */
      }
    `,
    desktop: css`
      @media (min-width: 1024px) {
        /* Estilos para desktop */
      }
    `,
  },

  // Scrollbar personalizado
  customScrollbar: css`
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.backgroundSecondary};
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.border};
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.borderHover};
    }
  `,

  // Truncar texto
  truncate: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  // Sombra común
  shadow: {
    sm: css`
      box-shadow: ${({ theme }) => theme.boxShadow.sm};
    `,
    md: css`
      box-shadow: ${({ theme }) => theme.boxShadow.md};
    `,
    lg: css`
      box-shadow: ${({ theme }) => theme.boxShadow.lg};
    `,
    xl: css`
      box-shadow: ${({ theme }) => theme.boxShadow.xl};
    `,
  },

  // Bordes comunes
  border: {
    sm: css`
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    `,
    md: css`
      border-radius: ${({ theme }) => theme.borderRadius.md};
    `,
    lg: css`
      border-radius: ${({ theme }) => theme.borderRadius.lg};
    `,
    full: css`
      border-radius: ${({ theme }) => theme.borderRadius.full};
    `,
  },
};
