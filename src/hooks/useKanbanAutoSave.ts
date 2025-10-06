import React from 'react';
import { useKanban } from '../store/kanbanStore';
import { useKanbanAutoSave } from './useAutoSave';
import { useNotificationSystem } from './useNotifications';

/**
 * Hook especializado para auto-save de datos del Kanban
 * Integra el auto-save con el store y el sistema de notificaciones
 */
export const useKanbanAutoSaveIntegration = (enabled: boolean = true) => {
  const { boards, currentBoard } = useKanban();
  const { showError } = useNotificationSystem();

  // Datos a observar para cambios (sin lastModified que cambia en cada render)
  const kanbanData = React.useMemo(() => ({
    boards,
    currentBoard,
  }), [boards, currentBoard]);

  // Auto-save con manejo de errores mejorado
  const autoSave = useKanbanAutoSave(kanbanData, enabled);

  // Manejar errores de auto-save
  React.useEffect(() => {
    if (!autoSave.hasUnsavedChanges()) return;

    // Aquí se podría implementar lógica adicional para manejar
    // errores de auto-save específicos del Kanban
  }, [autoSave.hasUnsavedChanges]);

  return {
    ...autoSave,
    // Funciones específicas del Kanban
    forceSaveKanban: autoSave.forceSave,
    hasKanbanUnsavedChanges: autoSave.hasUnsavedChanges,
    kanbanSaveStatus: autoSave.getSaveStatus,
  };
};

/**
 * Hook para mostrar indicador de auto-save en la UI
 */
export const useAutoSaveIndicator = () => {
  const autoSave = useKanbanAutoSaveIntegration();
  const [showIndicator, setShowIndicator] = React.useState(false);

  React.useEffect(() => {
    if (autoSave.hasUnsavedChanges()) {
      setShowIndicator(true);
      // Ocultar indicador después de 3 segundos si no hay cambios
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [autoSave.hasUnsavedChanges]);

  return {
    showIndicator,
    isSaving: autoSave.isSaving,
    hasUnsavedChanges: autoSave.hasUnsavedChanges(),
  };
};
