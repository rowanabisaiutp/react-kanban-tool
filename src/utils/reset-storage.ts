export const resetStorage = () => {
  try {
    // Limpiar completamente el localStorage
    localStorage.clear();
    console.log('✅ LocalStorage limpiado correctamente');
    
    // Recargar la página
    window.location.reload();
  } catch (error) {
    console.error('❌ Error al limpiar localStorage:', error);
  }
};

export const verifyStorage = () => {
  try {
    const kanbanData = localStorage.getItem('kanban-storage');
    
    if (kanbanData) {
      const parsed = JSON.parse(kanbanData);
      console.log('📦 Datos en localStorage:', {
        boards: parsed.state?.boards?.length || 0,
        currentBoard: parsed.state?.currentBoard?.title || 'Ninguno'
      });
      return parsed;
    } else {
      console.log('⚠️ No hay datos en localStorage');
      return null;
    }
  } catch (error) {
    console.error('❌ Error al verificar localStorage:', error);
    return null;
  }
};

// Agregar funciones al window para debug
if (typeof window !== 'undefined') {
  (window as any).resetKanbanStorage = resetStorage;
  (window as any).verifyKanbanStorage = verifyStorage;
}
