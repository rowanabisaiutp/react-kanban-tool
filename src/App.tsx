import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { StyledThemeProviderWrapper } from './hooks/useStyledTheme';
import { GlobalStyle } from './styles/GlobalStyle';
import ErrorBoundary from './components/ui/ErrorBoundary';
import NotificationSystem from './components/ui/NotificationSystem';

// Log de inicio de App
console.log('🚀 APP INICIANDO...');

// Lazy loading de páginas para code splitting
const KanbanPage = lazy(() => import('./pages/KanbanPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Componente de loading para Suspense
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p>Cargando...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error para debugging
        console.error('Application Error:', error, errorInfo);
        
        // Aquí podrías enviar el error a un servicio de monitoreo
        // como Sentry, LogRocket, etc.
      }}
    >
      <ThemeProvider>
        <StyledThemeProviderWrapper>
          <GlobalStyle />
          <Router>
            <main id="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/kanban" replace />} />
                  <Route path="/kanban" element={<KanbanPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </Suspense>
            </main>
          </Router>
          
          {/* Sistema de notificaciones global */}
          <NotificationSystem />
        </StyledThemeProviderWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
