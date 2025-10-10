import { logger } from './logger';

/**
 * Script utilitario para limpiar todo el localStorage del navegador
 * Útil para debugging, testing y resetear el estado de la aplicación
 */
const clearStorage = (): void => {
  try {
    localStorage.clear();
    logger.info('✅ localStorage limpiado exitosamente');
  } catch (error) {
    logger.error('❌ Error al limpiar localStorage:', error);
  }
};

export default clearStorage;

