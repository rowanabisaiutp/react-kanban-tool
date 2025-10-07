/**
 * Script utilitario para resetear solo la configuración del tema
 * Elimina únicamente el tema guardado, manteniendo otros datos
 */
const clearTheme = (): void => {
  try {
    localStorage.removeItem('theme');
    console.log('✅ Configuración de tema reseteada exitosamente');
    console.log('🌙 La aplicación volverá al tema por defecto del sistema');
  } catch (error) {
    console.error('❌ Error al resetear tema:', error);
  }
};

export default clearTheme;