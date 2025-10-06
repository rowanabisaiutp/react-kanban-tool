// Tema para styled-components
export const theme = {
  colors: {
    // Colores primarios
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#8b5cf6',
    secondaryHover: '#7c3aed',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    
    // Colores de estado
    success: '#10b981',
    successHover: '#059669',
    warning: '#f59e0b',
    warningHover: '#d97706',
    error: '#ef4444',
    errorHover: '#dc2626',
    
    // Colores de fondo
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    // Colores de superficie
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    
    // Colores de borde
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    
    // Colores de texto
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textInverse: '#ffffff',
    
    // Colores de sombra
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Tema oscuro
  dark: {
    colors: {
      // Colores primarios
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#a78bfa',
      secondaryHover: '#8b5cf6',
      accent: '#22d3ee',
      accentHover: '#06b6d4',
      
      // Colores de estado
      success: '#34d399',
      successHover: '#10b981',
      warning: '#fbbf24',
      warningHover: '#f59e0b',
      error: '#f87171',
      errorHover: '#ef4444',
      
      // Colores de fondo
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      backgroundTertiary: '#334155',
      
      // Colores de superficie
      surface: '#1e293b',
      surfaceHover: '#334155',
      
      // Colores de borde
      border: '#475569',
      borderHover: '#64748b',
      
      // Colores de texto
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textTertiary: '#94a3b8',
      textInverse: '#0f172a',
      
      // Colores de sombra
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    }
  },
  
  // Sistema de espaciado basado en 4px/8px
  spacing: {
    // Base: 4px
    '0': '0',
    '1': '0.25rem',    // 4px
    '2': '0.5rem',     // 8px
    '3': '0.75rem',    // 12px
    '4': '1rem',       // 16px
    '5': '1.25rem',    // 20px
    '6': '1.5rem',     // 24px
    '8': '2rem',       // 32px
    '10': '2.5rem',    // 40px
    '12': '3rem',      // 48px
    '16': '4rem',      // 64px
    '20': '5rem',      // 80px
    '24': '6rem',      // 96px
    '32': '8rem',      // 128px
    
    // Alias para compatibilidad
    xs: '0.25rem',     // 4px
    sm: '0.5rem',      // 8px
    md: '1rem',        // 16px
    lg: '1.5rem',      // 24px
    xl: '2rem',        // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
  },
  
  // Sistema de tipografía modular
  typography: {
    // Escala de tamaños (basada en 1.125 - Major Third)
    fontSize: {
      'xs': '0.75rem',      // 12px
      'sm': '0.875rem',     // 14px
      'base': '1rem',       // 16px
      'lg': '1.125rem',     // 18px
      'xl': '1.25rem',      // 20px
      '2xl': '1.5rem',      // 24px
      '3xl': '1.875rem',    // 30px
      '4xl': '2.25rem',     // 36px
      '5xl': '3rem',        // 48px
      '6xl': '3.75rem',     // 60px
      '7xl': '4.5rem',      // 72px
    },
    
    // Pesos de fuente
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Alturas de línea
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    // Espaciado de letras
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Alias para compatibilidad
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Radios de borde
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  // Sombras
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Sistema de breakpoints responsive
  breakpoints: {
    xs: '475px',     // Extra small devices
    sm: '640px',     // Small devices (móviles)
    md: '768px',     // Medium devices (tablets)
    lg: '1024px',    // Large devices (laptops)
    xl: '1280px',    // Extra large devices (desktops)
    '2xl': '1536px', // 2X large devices (large desktops)
  },
  
  // Media queries helpers
  media: {
    xs: '(max-width: 474px)',
    sm: '(max-width: 639px)',
    md: '(max-width: 767px)',
    lg: '(max-width: 1023px)',
    xl: '(max-width: 1279px)',
    '2xl': '(max-width: 1535px)',
    // Min-width queries
    'sm+': '(min-width: 640px)',
    'md+': '(min-width: 768px)',
    'lg+': '(min-width: 1024px)',
    'xl+': '(min-width: 1280px)',
    '2xl+': '(min-width: 1536px)',
    // Range queries
    'sm-md': '(min-width: 640px) and (max-width: 767px)',
    'md-lg': '(min-width: 768px) and (max-width: 1023px)',
    'lg-xl': '(min-width: 1024px) and (max-width: 1279px)',
  },
  
  // Sistema de animaciones y transiciones
  animation: {
    // Duraciones
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    
    // Funciones de timing
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // Cubic bezier personalizados
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    
    // Transiciones predefinidas
    transition: {
      fast: '150ms ease',
      normal: '300ms ease',
      slow: '500ms ease',
      theme: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    
    // Keyframes para animaciones complejas
    keyframes: {
      // Drag and drop
      dragEnter: `
        0% { transform: scale(1); }
        100% { transform: scale(1.02); }
      `,
      dragExit: `
        0% { transform: scale(1.02); }
        100% { transform: scale(1); }
      `,
      dropZone: `
        0%, 100% { border-color: transparent; }
        50% { border-color: var(--primary-color); }
      `,
      
      // Theme switching
      themeTransition: `
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
      `,
      
      // Modal/panel transitions
      modalEnter: `
        0% { 
          opacity: 0; 
          transform: scale(0.95) translateY(-10px); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      `,
      modalExit: `
        0% { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
        100% { 
          opacity: 0; 
          transform: scale(0.95) translateY(-10px); 
        }
      `,
      slideInRight: `
        0% { 
          opacity: 0; 
          transform: translateX(100%); 
        }
        100% { 
          opacity: 1; 
          transform: translateX(0); 
        }
      `,
      slideOutRight: `
        0% { 
          opacity: 1; 
          transform: translateX(0); 
        }
        100% { 
          opacity: 0; 
          transform: translateX(100%); 
        }
      `,
      
      // Task state changes
      taskComplete: `
        0% { 
          transform: scale(1); 
          opacity: 1; 
        }
        50% { 
          transform: scale(1.05); 
          opacity: 0.8; 
        }
        100% { 
          transform: scale(1); 
          opacity: 1; 
        }
      `,
      taskMove: `
        0% { 
          transform: translateY(0) rotate(0deg); 
        }
        50% { 
          transform: translateY(-5px) rotate(1deg); 
        }
        100% { 
          transform: translateY(0) rotate(0deg); 
        }
      `,
      pulse: `
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      `,
      bounce: `
        0%, 20%, 53%, 80%, 100% { 
          transform: translate3d(0,0,0); 
        }
        40%, 43% { 
          transform: translate3d(0, -30px, 0); 
        }
        70% { 
          transform: translate3d(0, -15px, 0); 
        }
        90% { 
          transform: translate3d(0, -4px, 0); 
        }
      `,
      shake: `
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      `,
      fadeIn: `
        0% { opacity: 0; }
        100% { opacity: 1; }
      `,
      fadeOut: `
        0% { opacity: 1; }
        100% { opacity: 0; }
      `,
      slideUp: `
        0% { transform: translateY(100%); }
        100% { transform: translateY(0); }
      `,
      slideDown: `
        0% { transform: translateY(-100%); }
        100% { transform: translateY(0); }
      `,
    },
  },
};

// Tipo para el tema
export type Theme = typeof theme;
