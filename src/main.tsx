import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './utils/logger'

// Funciones de debug para localStorage (solo en desarrollo)
if (import.meta.env.DEV) {
  import('./utils/reset-storage');
}

// Log de inicio (solo en desarrollo)
logger.info('🔥 PROYECTO KANBAN CARGADO');
logger.debug('📅 Fecha:', new Date().toLocaleString('es-ES'));
logger.debug('🌐 URL:', window.location.href);
logger.debug('💾 LocalStorage disponible:', typeof localStorage !== 'undefined');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
