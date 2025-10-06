import { useEffect, useRef, useCallback, useState } from 'react';
import { useDebouncedCallback } from './useDebounce';

/**
 * Hook para implementar auto-save con debouncing
 * Guarda automáticamente los cambios después de un período de inactividad
 */
export const useAutoSave = <T>(
  data: T,
  saveFunction: (data: T) => Promise<void> | void,
  delay: number = 2000,
  enabled: boolean = true
) => {
  const lastSavedRef = useRef<T | null>(null);
  const isSavingRef = useRef(false);

  // Función para verificar si los datos han cambiado
  const hasDataChanged = useCallback((current: T, lastSaved: T | null): boolean => {
    if (!lastSaved) return true;
    return JSON.stringify(current) !== JSON.stringify(lastSaved);
  }, []);

  // Función de guardado con manejo de errores
  const performSave = useCallback(async (dataToSave: T) => {
    if (isSavingRef.current || !hasDataChanged(dataToSave, lastSavedRef.current)) {
      return;
    }

    try {
      isSavingRef.current = true;
      await saveFunction(dataToSave);
      lastSavedRef.current = dataToSave;
      console.log('✅ Auto-save completado:', new Date().toISOString());
    } catch (error) {
      console.error('❌ Error en auto-save:', error);
      // Aquí se podría implementar un sistema de reintentos o notificaciones
    } finally {
      isSavingRef.current = false;
    }
  }, [saveFunction, hasDataChanged]);

  // Función debounced para el auto-save
  const debouncedSave = useDebouncedCallback(performSave, delay);

  // Effect para ejecutar auto-save cuando los datos cambien
  useEffect(() => {
    if (!enabled) return;

    debouncedSave(data);
  }, [data, debouncedSave, enabled]);

  // Función para forzar guardado inmediato
  const forceSave = useCallback(async () => {
    if (isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      await saveFunction(data);
      lastSavedRef.current = data;
      console.log('💾 Guardado forzado completado:', new Date().toISOString());
    } catch (error) {
      console.error('❌ Error en guardado forzado:', error);
      throw error;
    } finally {
      isSavingRef.current = false;
    }
  }, [data, saveFunction]);

  // Función para verificar si hay cambios pendientes
  const hasUnsavedChanges = useCallback((): boolean => {
    return hasDataChanged(data, lastSavedRef.current);
  }, [data, hasDataChanged]);

  // Función para obtener el estado de guardado
  const getSaveStatus = useCallback(() => ({
    isSaving: isSavingRef.current,
    hasUnsavedChanges: hasUnsavedChanges(),
    lastSaved: lastSavedRef.current,
  }), [hasUnsavedChanges]);

  return {
    forceSave,
    hasUnsavedChanges,
    getSaveStatus,
    isSaving: isSavingRef.current,
  };
};

/**
 * Hook especializado para auto-save de datos del Kanban
 */
export const useKanbanAutoSave = (data: any, enabled: boolean = true) => {
  const saveToLocalStorage = useCallback(async (dataToSave: any) => {
    try {
      const serializedData = JSON.stringify({
        boards: dataToSave.boards,
        currentBoard: dataToSave.currentBoard,
        lastSaved: new Date().toISOString(),
        version: '1.0.0'
      });
      
      localStorage.setItem('kanban-auto-save', serializedData);
      console.log('💾 Datos guardados en localStorage:', {
        boards: dataToSave.boards?.length || 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error guardando en localStorage:', error);
      throw error;
    }
  }, []);

  return useAutoSave(data, saveToLocalStorage, 2000, enabled);
};

/**
 * Hook para auto-save con indicador visual
 */
export const useAutoSaveWithIndicator = <T>(
  data: T,
  saveFunction: (data: T) => Promise<void> | void,
  delay: number = 2000
) => {
  const autoSave = useAutoSave(data, saveFunction, delay);
  
  // Estado para el indicador visual
  const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Actualizar indicador basado en el estado de guardado
  useEffect(() => {
    if (autoSave.isSaving) {
      setSaveIndicator('saving');
    } else if (autoSave.hasUnsavedChanges()) {
      setSaveIndicator('idle');
    } else {
      setSaveIndicator('saved');
    }
  }, [autoSave.isSaving, autoSave.hasUnsavedChanges]);

  return {
    ...autoSave,
    saveIndicator,
    setSaveIndicator,
  };
};
