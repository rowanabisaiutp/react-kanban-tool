import { useCallback } from 'react';
import { useNotificationSystem } from './useNotifications';
import type { Task } from '../types';

/**
 * Hook especializado para notificaciones del Kanban
 */
export const useKanbanNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationSystem();

  // Notificaciones para creación de tareas
  const notifyTaskCreated = useCallback((task: Task) => {
    showSuccess(
      'Tarea Creada',
      `"${task.title}" ha sido creada exitosamente`,
      3000
    );
  }, [showSuccess]);

  // Notificaciones para actualización de tareas
  const notifyTaskUpdated = useCallback((task: Task) => {
    showInfo(
      'Tarea Actualizada',
      `"${task.title}" ha sido modificada`,
      3000
    );
  }, [showInfo]);

  // Notificaciones para eliminación de tareas
  const notifyTaskDeleted = useCallback((taskTitle: string) => {
    showWarning(
      'Tarea Eliminada',
      `"${taskTitle}" ha sido eliminada permanentemente`,
      4000
    );
  }, [showWarning]);

  // Notificaciones para archivado de tareas
  const notifyTaskArchived = useCallback((task: Task) => {
    showInfo(
      'Tarea Archivada',
      `"${task.title}" ha sido archivada`,
      3000
    );
  }, [showInfo]);

  // Notificaciones para restauración de tareas
  const notifyTaskRestored = useCallback((task: Task) => {
    showSuccess(
      'Tarea Restaurada',
      `"${task.title}" ha sido restaurada desde el archivo`,
      3000
    );
  }, [showSuccess]);

  // Notificaciones para movimiento de tareas
  const notifyTaskMoved = useCallback((task: Task, newStatus: string) => {
    const statusLabels: Record<string, string> = {
      'todo': 'Por Hacer',
      'in-progress': 'En Progreso',
      'done': 'Terminado'
    };

    showInfo(
      'Tarea Movida',
      `"${task.title}" movida a ${statusLabels[newStatus] || newStatus}`,
      2500
    );
  }, [showInfo]);

  // Notificaciones para duplicación de tareas
  const notifyTaskDuplicated = useCallback((originalTask: Task) => {
    showSuccess(
      'Tarea Duplicada',
      `"${originalTask.title}" ha sido duplicada exitosamente`,
      3000
    );
  }, [showSuccess]);

  // Notificaciones para asignación de tareas
  const notifyTaskAssigned = useCallback((task: Task, assignee: string) => {
    showInfo(
      'Tarea Asignada',
      `"${task.title}" asignada a ${assignee}`,
      3000
    );
  }, [showInfo]);

  // Notificaciones para comentarios
  const notifyCommentAdded = useCallback((task: Task) => {
    showInfo(
      'Comentario Agregado',
      `Nuevo comentario en "${task.title}"`,
      2500
    );
  }, [showInfo]);

  // Notificaciones para errores genéricos
  const notifyError = useCallback((message: string, details?: string) => {
    showError(
      'Error',
      details ? `${message}: ${details}` : message,
      5000
    );
  }, [showError]);

  // Notificaciones para operaciones en lote
  const notifyBulkOperation = useCallback((operation: string, count: number) => {
    showInfo(
      'Operación en Lote',
      `${operation}: ${count} tarea${count > 1 ? 's' : ''} procesada${count > 1 ? 's' : ''}`,
      3000
    );
  }, [showInfo]);

  // Notificaciones para cambios de estado del proyecto
  const notifyProjectStatusChange = useCallback((message: string) => {
    showInfo(
      'Estado del Proyecto',
      message,
      4000
    );
  }, [showInfo]);

  // Notificaciones para exportación/importación
  const notifyDataExported = useCallback((format: string) => {
    showSuccess(
      'Datos Exportados',
      `Proyecto exportado en formato ${format}`,
      3000
    );
  }, [showSuccess]);

  const notifyDataImported = useCallback((count: number) => {
    showSuccess(
      'Datos Importados',
      `${count} tarea${count > 1 ? 's' : ''} importada${count > 1 ? 's' : ''} exitosamente`,
      3000
    );
  }, [showSuccess]);

  return {
    // Acciones principales
    notifyTaskCreated,
    notifyTaskUpdated,
    notifyTaskDeleted,
    notifyTaskArchived,
    notifyTaskRestored,
    notifyTaskMoved,
    notifyTaskDuplicated,
    notifyTaskAssigned,
    
    // Acciones secundarias
    notifyCommentAdded,
    notifyError,
    notifyBulkOperation,
    notifyProjectStatusChange,
    notifyDataExported,
    notifyDataImported,
  };
};

export default useKanbanNotifications;
