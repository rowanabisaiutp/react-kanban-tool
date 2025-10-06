import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Funciones de desarrollo temporalmente deshabilitadas
// import './utils/testUserDetection'
// import './utils/simpleLogger'
// import './utils/simulateUsers'

// Funciones de debug para localStorage (solo en desarrollo)
if (import.meta.env.DEV) {
  import('./utils/reset-storage');
}

// Log inmediato para verificar que la consola funciona
console.log('🔥🔥🔥 PROYECTO KANBAN CARGADO 🔥🔥🔥');
console.log('📅 Fecha:', new Date().toLocaleString('es-ES'));
console.log('🌐 URL:', window.location.href);
console.log('👤 User Agent:', navigator.userAgent);
console.log('💾 LocalStorage disponible:', typeof localStorage !== 'undefined');
console.log('🔥🔥🔥 FIN DEL LOG DE CARGA 🔥🔥🔥');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
