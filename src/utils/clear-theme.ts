import { logger } from './logger';

/**
 * Script utilitario para resetear solo la configuración del tema
 * Elimina únicamente el tema guardado, manteniendo otros datos
 */
const clearTheme = (): void => {
  try {
    localStorage.removeItem('theme');
    logger.info('✅ Configuración de tema reseteada exitosamente');
  } catch (error) {
    logger.error('❌ Error al resetear tema:', error);
  }
};

export default clearTheme;