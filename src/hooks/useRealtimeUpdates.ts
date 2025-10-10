import { useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook simple para manejar actualizaciones en tiempo real
 * Sin Socket.IO, usa eventos personalizados para notificar cambios
 */
export const useRealtimeUpdates = () => {
  // Función para notificar cambios a otros componentes
  const notifyChange = useCallback((changeType: string, data?: any) => {
    logger.debug(`🔄 Notificación de cambio: ${changeType}`, data);
    
    // Crear evento personalizado para notificar cambios
    const event = new CustomEvent('kanban-update', {
      detail: {
        type: changeType,
        data,
        timestamp: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
  }, []);

  // Función para escuchar cambios
  const listenForChanges = useCallback((callback: (event: CustomEvent) => void) => {
    const handleEvent = (event: Event) => {
      callback(event as CustomEvent);
    };
    
    window.addEventListener('kanban-update', handleEvent);
    
    return () => {
      window.removeEventListener('kanban-update', handleEvent);
    };
  }, []);

  return {
    notifyChange,
    listenForChanges
  };
};
