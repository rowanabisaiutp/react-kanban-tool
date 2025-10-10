import { logger } from './logger';

export const resetStorage = () => {
  try {
    // Limpiar completamente el localStorage
    localStorage.clear();
    logger.info('✅ LocalStorage limpiado correctamente');
    
    // Recargar la página
    window.location.reload();
  } catch (error) {
    logger.error('❌ Error al limpiar localStorage:', error);
  }
};

export const verifyStorage = () => {
  try {
    const kanbanData = localStorage.getItem('kanban-storage');
    
    if (kanbanData) {
      const parsed = JSON.parse(kanbanData);
      logger.debug('📦 Datos en localStorage:', {
        boards: parsed.state?.boards?.length || 0,
        currentBoard: parsed.state?.currentBoard?.title || 'Ninguno'
      });
      return parsed;
    } else {
      logger.debug('⚠️ No hay datos en localStorage');
      return null;
    }
  } catch (error) {
    logger.error('❌ Error al verificar localStorage:', error);
    return null;
  }
};

// Agregar funciones al window para debug
if (typeof window !== 'undefined') {
  (window as any).resetKanbanStorage = resetStorage;
  (window as any).verifyKanbanStorage = verifyStorage;
}
