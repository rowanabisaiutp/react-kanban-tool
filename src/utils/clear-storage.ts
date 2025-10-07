/**
 * Script utilitario para limpiar todo el localStorage del navegador
 * Útil para debugging, testing y resetear el estado de la aplicación
 */
const clearStorage = (): void => {
  try {
    localStorage.clear();
    console.log('✅ localStorage limpiado exitosamente');
  } catch (error) {
    console.error('❌ Error al limpiar localStorage:', error);
  }
};

export default clearStorage;

