import { create } from 'zustand';
import { useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{ label: string; action: () => void; variant?: 'primary' | 'secondary' }>;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, notification.duration);
    }
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  clearAllNotifications: () => {
    set({ notifications: [] });
  }
}));

/**
 * Hook para manejar notificaciones globales
 */
export const useNotificationSystem = () => {
  const notifications = useNotificationStore(state => state.notifications);
  const addNotification = useNotificationStore(state => state.addNotification);
  const removeNotification = useNotificationStore(state => state.removeNotification);

  const showSuccess = useCallback((
    title: string, 
    message: string, 
    duration: number = 3000
  ) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showError = useCallback((
    title: string, 
    message: string, 
    duration: number = 5000
  ) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showWarning = useCallback((
    title: string, 
    message: string, 
    duration: number = 4000
  ) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showInfo = useCallback((
    title: string, 
    message: string, 
    duration: number = 3000
  ) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showNotificationWithAction = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    actions: Array<{ label: string; action: () => void; variant?: 'primary' | 'secondary' }>,
    duration?: number
  ) => {
    addNotification({
      type,
      title,
      message,
      duration,
      actions,
    });
  }, [addNotification]);

  const clearAllNotifications = useCallback(() => {
    notifications.forEach(notification => {
      removeNotification(notification.id);
    });
  }, [notifications, removeNotification]);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotificationWithAction,
    removeNotification,
    clearAllNotifications,
  };
};