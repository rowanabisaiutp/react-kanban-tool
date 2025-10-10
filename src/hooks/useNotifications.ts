import { create } from 'zustand';
import { useCallback } from 'react';
import { generateId } from '../utils/helpers';

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
  timers: Map<string, NodeJS.Timeout>;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  timers: new Map(),
  addNotification: (notification) => {
    const id = generateId();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove after duration
    if (notification.duration) {
      const timer = setTimeout(() => {
        set((state) => {
          const timers = new Map(state.timers);
          timers.delete(id);
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            timers
          };
        });
      }, notification.duration);
      
      set((state) => {
        const timers = new Map(state.timers);
        timers.set(id, timer);
        return { timers };
      });
    }
  },
  removeNotification: (id) => {
    const state = get();
    const timer = state.timers.get(id);
    if (timer) {
      clearTimeout(timer);
    }
    
    set((state) => {
      const timers = new Map(state.timers);
      timers.delete(id);
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        timers
      };
    });
  },
  clearAllNotifications: () => {
    const state = get();
    state.timers.forEach(timer => clearTimeout(timer));
    set({ notifications: [], timers: new Map() });
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