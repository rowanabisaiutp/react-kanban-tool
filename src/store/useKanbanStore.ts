import { useCallback } from 'react';
import { useKanban } from './kanbanStore';
import { useKanbanNotifications } from '../hooks/useKanbanNotifications';
import type { Task, TaskStatus } from '../types';

/**
 * Hook que integra el store del Kanban con las notificaciones
 */
export const useKanbanStore = () => {
  const kanbanStore = useKanban();
  const notifications = useKanbanNotifications();

  // Función helper para encontrar una tarea
  const findTask = useCallback((taskId: string): Task | null => {
    if (!kanbanStore.currentBoard) return null;
    
    for (const column of kanbanStore.currentBoard.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  }, [kanbanStore.currentBoard]);

  // Wrapper para addTask con notificación
  const addTaskWithNotification = useCallback((
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, 
    columnId: string
  ) => {
    try {
      kanbanStore.addTask(task, columnId);
      
      // Buscar la tarea recién creada para mostrar en la notificación
      setTimeout(() => {
        if (kanbanStore.currentBoard) {
          for (const column of kanbanStore.currentBoard.columns) {
            if (column.id === columnId) {
              const newTask = column.tasks.find(t => t.title === task.title);
              if (newTask) {
                notifications.notifyTaskCreated(newTask);
              }
              break;
            }
          }
        }
      }, 100);
    } catch (error) {
      notifications.notifyError('Error al crear tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications]);

  // Wrapper para updateTask con notificación
  const updateTaskWithNotification = useCallback((taskId: string, updates: Partial<Task>) => {
    try {
      const originalTask = findTask(taskId);
      kanbanStore.updateTask(taskId, updates);
      
      if (originalTask) {
        notifications.notifyTaskUpdated({ ...originalTask, ...updates });
      }
    } catch (error) {
      notifications.notifyError('Error al actualizar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para deleteTask con notificación
  const deleteTaskWithNotification = useCallback((taskId: string) => {
    try {
      const task = findTask(taskId);
      if (task) {
        kanbanStore.deleteTask(taskId);
        notifications.notifyTaskDeleted(task.title);
      }
    } catch (error) {
      notifications.notifyError('Error al eliminar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para moveTask con notificación
  const moveTaskWithNotification = useCallback((taskId: string, newStatus: TaskStatus, newIndex: number) => {
    try {
      const task = findTask(taskId);
      kanbanStore.moveTask(taskId, newStatus, newIndex);
      
      if (task) {
        notifications.notifyTaskMoved(task, newStatus);
      }
    } catch (error) {
      notifications.notifyError('Error al mover tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para duplicateTask con notificación
  const duplicateTaskWithNotification = useCallback((task: Task) => {
    try {
      kanbanStore.duplicateTask(task);
      notifications.notifyTaskDuplicated(task);
    } catch (error) {
      notifications.notifyError('Error al duplicar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications]);

  // Wrapper para archiveTask con notificación
  const archiveTaskWithNotification = useCallback((taskId: string) => {
    try {
      const task = findTask(taskId);
      kanbanStore.archiveTask(taskId);
      
      if (task) {
        notifications.notifyTaskArchived(task);
      }
    } catch (error) {
      notifications.notifyError('Error al archivar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para restoreTask con notificación
  const restoreTaskWithNotification = useCallback((taskId: string) => {
    try {
      const task = findTask(taskId);
      kanbanStore.restoreTask(taskId);
      
      if (task) {
        notifications.notifyTaskRestored(task);
      }
    } catch (error) {
      notifications.notifyError('Error al restaurar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para deleteArchivedTask con notificación
  const deleteArchivedTaskWithNotification = useCallback((taskId: string) => {
    try {
      const task = findTask(taskId);
      kanbanStore.deleteArchivedTask(taskId);
      
      if (task) {
        notifications.notifyTaskDeleted(task.title);
      }
    } catch (error) {
      notifications.notifyError('Error al eliminar tarea archivada', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Wrapper para addComment con notificación
  const addCommentWithNotification = useCallback((taskId: string, content: string, author: string) => {
    try {
      const task = findTask(taskId);
      kanbanStore.addComment(taskId, content, author);
      
      if (task) {
        notifications.notifyCommentAdded(task);
      }
    } catch (error) {
      notifications.notifyError('Error al agregar comentario', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  // Función para reasignar tarea con notificación
  const reassignTaskWithNotification = useCallback((taskId: string, assignee: string | undefined) => {
    try {
      const task = findTask(taskId);
      kanbanStore.updateTask(taskId, { assignee });
      
      if (task && assignee) {
        notifications.notifyTaskAssigned({ ...task, assignee }, assignee);
      }
    } catch (error) {
      notifications.notifyError('Error al reasignar tarea', error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [kanbanStore, notifications, findTask]);

  return {
    // Estado del store
    ...kanbanStore,
    
    // Acciones con notificaciones
    addTask: addTaskWithNotification,
    updateTask: updateTaskWithNotification,
    deleteTask: deleteTaskWithNotification,
    moveTask: moveTaskWithNotification,
    duplicateTask: duplicateTaskWithNotification,
    archiveTask: archiveTaskWithNotification,
    restoreTask: restoreTaskWithNotification,
    deleteArchivedTask: deleteArchivedTaskWithNotification,
    addComment: addCommentWithNotification,
    reassignTask: reassignTaskWithNotification,
    
    // Notificaciones directas
    notifications,
  };
};

export default useKanbanStore;
