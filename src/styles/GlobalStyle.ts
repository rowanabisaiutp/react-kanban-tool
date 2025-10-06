import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Reset y estilos globales */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${({ theme }) => theme.animation.transition.theme}, 
                color ${({ theme }) => theme.animation.transition.theme};
  }

  /* Keyframes para animaciones globales */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(100%); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }

  @keyframes slideOutRight {
    from { 
      opacity: 1; 
      transform: translateX(0); 
    }
    to { 
      opacity: 0; 
      transform: translateX(100%); 
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
  }

  @keyframes dragEnter {
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
  }

  @keyframes dragExit {
    0% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  @keyframes taskComplete {
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
  }

  @keyframes taskMove {
    0% { 
      transform: translateY(0) rotate(0deg); 
    }
    50% { 
      transform: translateY(-5px) rotate(1deg); 
    }
    100% { 
      transform: translateY(0) rotate(0deg); 
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes bounce {
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
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    min-height: 100vh;
    transition: background-color ${({ theme }) => theme.animation.transition.theme}, 
                color ${({ theme }) => theme.animation.transition.theme};
  }

  /* Utilidades de layout */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-1 { gap: ${({ theme }) => theme.spacing.xs}; }
  .gap-2 { gap: ${({ theme }) => theme.spacing.sm}; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: ${({ theme }) => theme.spacing.md}; }
  .gap-6 { gap: ${({ theme }) => theme.spacing.lg}; }
  .gap-8 { gap: ${({ theme }) => theme.spacing.xl}; }

  /* Utilidades de espaciado */
  .p-1 { padding: ${({ theme }) => theme.spacing.xs}; }
  .p-2 { padding: ${({ theme }) => theme.spacing.sm}; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: ${({ theme }) => theme.spacing.md}; }
  .p-6 { padding: ${({ theme }) => theme.spacing.lg}; }
  .p-8 { padding: ${({ theme }) => theme.spacing.xl}; }

  .px-2 { padding-left: ${({ theme }) => theme.spacing.sm}; padding-right: ${({ theme }) => theme.spacing.sm}; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: ${({ theme }) => theme.spacing.md}; padding-right: ${({ theme }) => theme.spacing.md}; }
  .px-6 { padding-left: ${({ theme }) => theme.spacing.lg}; padding-right: ${({ theme }) => theme.spacing.lg}; }

  .py-1 { padding-top: ${({ theme }) => theme.spacing.xs}; padding-bottom: ${({ theme }) => theme.spacing.xs}; }
  .py-2 { padding-top: ${({ theme }) => theme.spacing.sm}; padding-bottom: ${({ theme }) => theme.spacing.sm}; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .py-4 { padding-top: ${({ theme }) => theme.spacing.md}; padding-bottom: ${({ theme }) => theme.spacing.md}; }

  .m-1 { margin: ${({ theme }) => theme.spacing.xs}; }
  .m-2 { margin: ${({ theme }) => theme.spacing.sm}; }
  .m-3 { margin: 0.75rem; }
  .m-4 { margin: ${({ theme }) => theme.spacing.md}; }

  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-6 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }

  .mt-2 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-6 { margin-top: ${({ theme }) => theme.spacing.lg}; }

  /* Utilidades de texto */
  .text-xs { font-size: ${({ theme }) => theme.typography.fontSize.xs}; }
  .text-sm { font-size: ${({ theme }) => theme.typography.fontSize.sm}; }
  .text-base { font-size: ${({ theme }) => theme.typography.fontSize.base}; }
  .text-lg { font-size: ${({ theme }) => theme.typography.fontSize.lg}; }
  .text-xl { font-size: ${({ theme }) => theme.typography.fontSize.xl}; }
  .text-2xl { font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; }

  .font-medium { font-weight: ${({ theme }) => theme.typography.fontWeight.medium}; }
  .font-semibold { font-weight: ${({ theme }) => theme.typography.fontWeight.semibold}; }
  .font-bold { font-weight: ${({ theme }) => theme.typography.fontWeight.bold}; }

  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  /* Utilidades de color */
  .text-gray-500 { color: #6b7280; }
  .text-gray-600 { color: #4b5563; }
  .text-gray-700 { color: #374151; }
  .text-gray-900 { color: #111827; }

  .text-blue-600 { color: #2563eb; }
  .text-green-600 { color: #16a34a; }
  .text-yellow-600 { color: #d97706; }
  .text-red-600 { color: #dc2626; }

  /* Utilidades de fondo */
  .bg-white { background-color: #ffffff; }
  .bg-gray-50 { background-color: #f9fafb; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .bg-gray-200 { background-color: #e5e7eb; }

  /* Utilidades de borde */
  .border { border: 1px solid #e5e7eb; }
  .border-gray-200 { border-color: #e5e7eb; }
  .border-gray-300 { border-color: #d1d5db; }

  .rounded { border-radius: ${({ theme }) => theme.borderRadius.md}; }
  .rounded-md { border-radius: ${({ theme }) => theme.borderRadius.md}; }
  .rounded-lg { border-radius: ${({ theme }) => theme.borderRadius.lg}; }
  .rounded-xl { border-radius: ${({ theme }) => theme.borderRadius.xl}; }

  /* Utilidades de sombra */
  .shadow-sm { box-shadow: ${({ theme }) => theme.boxShadow.sm}; }
  .shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
  .shadow-md { box-shadow: ${({ theme }) => theme.boxShadow.md}; }
  .shadow-lg { box-shadow: ${({ theme }) => theme.boxShadow.lg}; }

  /* Utilidades de hover */
  .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
  .hover\\:bg-gray-100:hover { background-color: #f3f4f6; }
  .hover\\:shadow-md:hover { box-shadow: ${({ theme }) => theme.boxShadow.md}; }

  /* Utilidades de transición */
  .transition { 
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; 
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
    transition-duration: 150ms; 
  }

  /* Utilidades de cursor */
  .cursor-pointer { cursor: pointer; }
  .cursor-grab { cursor: grab; }
  .cursor-grabbing { cursor: grabbing; }

  /* Utilidades de selección */
  .select-none { user-select: none; }

  /* Utilidades de overflow */
  .overflow-hidden { overflow: hidden; }
  .overflow-auto { overflow: auto; }

  /* Utilidades de posición */
  .relative { position: relative; }
  .absolute { position: absolute; }
  .fixed { position: fixed; }

  /* Utilidades de z-index */
  .z-10 { z-index: 10; }
  .z-20 { z-index: 20; }
  .z-30 { z-index: 30; }
  .z-40 { z-index: 40; }
  .z-50 { z-index: 50; }

  /* App Loading State */
  .app-loading {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  .app-loading__content {
    text-align: center;
    color: #6b7280;
  }

  .app-loading__content h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  .app-loading__content p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin: 0;
  }

  /* Responsive utilities */
  @media (max-width: 474px) {
    .xs\\:hidden { display: none !important; }
    .xs\\:block { display: block !important; }
    .xs\\:flex { display: flex !important; }
    .xs\\:flex-col { flex-direction: column !important; }
    .xs\\:text-xs { font-size: ${({ theme }) => theme.typography.fontSize.xs} !important; }
    .xs\\:p-1 { padding: ${({ theme }) => theme.spacing['1']} !important; }
    .xs\\:gap-1 { gap: ${({ theme }) => theme.spacing['1']} !important; }
  }

  @media (max-width: 639px) {
    .sm\\:hidden { display: none !important; }
    .sm\\:block { display: block !important; }
    .sm\\:flex { display: flex !important; }
    .sm\\:flex-col { flex-direction: column !important; }
    .sm\\:text-sm { font-size: ${({ theme }) => theme.typography.fontSize.sm} !important; }
    .sm\\:p-2 { padding: ${({ theme }) => theme.spacing['2']} !important; }
    .sm\\:gap-2 { gap: ${({ theme }) => theme.spacing['2']} !important; }
  }

  @media (max-width: 767px) {
    .md\\:hidden { display: none !important; }
    .md\\:block { display: block !important; }
    .md\\:flex { display: flex !important; }
    .md\\:flex-col { flex-direction: column !important; }
    .md\\:text-base { font-size: ${({ theme }) => theme.typography.fontSize.base} !important; }
    .md\\:p-3 { padding: ${({ theme }) => theme.spacing['3']} !important; }
    .md\\:gap-3 { gap: ${({ theme }) => theme.spacing['3']} !important; }
  }

  @media (max-width: 1023px) {
    .lg\\:hidden { display: none !important; }
    .lg\\:block { display: block !important; }
    .lg\\:flex { display: flex !important; }
    .lg\\:flex-col { flex-direction: column !important; }
  }

  /* Min-width utilities */
  @media (min-width: 640px) {
    .sm\\+\\:hidden { display: none !important; }
    .sm\\+\\:block { display: block !important; }
    .sm\\+\\:flex { display: flex !important; }
    .sm\\+\\:flex-row { flex-direction: row !important; }
  }

  @media (min-width: 768px) {
    .md\\+\\:hidden { display: none !important; }
    .md\\+\\:block { display: block !important; }
    .md\\+\\:flex { display: flex !important; }
    .md\\+\\:flex-row { flex-direction: row !important; }
  }

  @media (min-width: 1024px) {
    .lg\\+\\:hidden { display: none !important; }
    .lg\\+\\:block { display: block !important; }
    .lg\\+\\:flex { display: flex !important; }
  }

  /* Layout principal */
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .app-title {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .app-content {
    flex: 1;
    padding: ${({ theme }) => theme.spacing.lg};
    overflow-x: auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .app-header {
      padding: ${({ theme }) => theme.spacing.md};
    }
    
    .app-title {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
    
    .app-content {
      padding: ${({ theme }) => theme.spacing.md};
    }
  }

  @media (max-width: 480px) {
    .app-header {
      padding: 0.75rem;
    }
    
    .app-title {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
    
    .app-content {
      padding: 0.75rem;
    }
  }

  /* Utilidades de accesibilidad */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }

  /* Mejoras de accesibilidad */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Reducir movimiento para usuarios que lo prefieren */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Indicadores de estado para lectores de pantalla */
  [aria-live="polite"],
  [aria-live="assertive"] {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  /* Skip links para navegación por teclado */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.3s;
  }

  .skip-link:focus {
    top: 6px;
  }

  /* Estados de carga accesibles */
  [aria-busy="true"] {
    position: relative;
  }

  [aria-busy="true"]::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Mejorar visibilidad de elementos interactivos */
  button:focus-visible,
  [role="button"]:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  /* Estados de error accesibles */
  [aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error};
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }

  /* Mejorar legibilidad */
  .text-high-contrast {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  /* Modal title para screen readers */
  .modal-title {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;
