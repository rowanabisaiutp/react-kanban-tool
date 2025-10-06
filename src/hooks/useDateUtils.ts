import { 
  formatRelativeDate, 
  formatFullDate, 
  formatShortDate, 
  isToday, 
  isThisWeek, 
  isThisMonth, 
  getTimeDifference
} from '../utils/helpers';

// Tipo para filtros de fecha
export interface DateFilter {
  start: Date | null;
  end: Date | null;
}

// Hook para utilidades de fecha
export const useDateUtils = () => {
  return {
    // Formateo de fechas
    formatRelativeDate,
    formatFullDate,
    formatShortDate,
    
    // Verificaciones de fecha
    isToday,
    isThisWeek,
    isThisMonth,
    getTimeDifference,
    
    // Utilidades específicas para tareas
    getTaskDateInfo: (task: { createdAt?: Date | string; updatedAt?: Date | string; dueDate?: Date | string; completedAt?: Date | string }) => {
      return {
        // Información de creación
        created: task.createdAt ? {
          date: task.createdAt,
          formatted: formatFullDate(task.createdAt),
          relative: formatRelativeDate(task.createdAt),
          isToday: isToday(task.createdAt),
          isThisWeek: isThisWeek(task.createdAt),
          isThisMonth: isThisMonth(task.createdAt)
        } : null,
        
        // Información de actualización
        updated: task.updatedAt ? {
          date: task.updatedAt,
          formatted: formatFullDate(task.updatedAt),
          relative: formatRelativeDate(task.updatedAt),
          isToday: isToday(task.updatedAt),
          isThisWeek: isThisWeek(task.updatedAt),
          isThisMonth: isThisMonth(task.updatedAt)
        } : null,
        
        // Información de vencimiento
        due: task.dueDate ? {
          date: task.dueDate,
          formatted: formatFullDate(task.dueDate),
          relative: formatRelativeDate(task.dueDate),
          isToday: isToday(task.dueDate),
          isThisWeek: isThisWeek(task.dueDate),
          isThisMonth: isThisMonth(task.dueDate),
          timeDifference: getTimeDifference(task.dueDate)
        } : null,
        
        // Información de completado
        completed: task.completedAt ? {
          date: task.completedAt,
          formatted: formatFullDate(task.completedAt),
          relative: formatRelativeDate(task.completedAt),
          isToday: isToday(task.completedAt),
          isThisWeek: isThisWeek(task.completedAt),
          isThisMonth: isThisMonth(task.completedAt)
        } : null
      };
    },
    
    // Filtros de fecha para tareas
    getDateFilters: (): DateFilter => ({
      start: null,
      end: null
    }),
    
    // Filtrar tareas por fecha
    filterTasksByDate: (tasks: Array<{ createdAt?: Date | string }>, filter: DateFilter) => {
      return tasks.filter(task => {
        if (!task.createdAt) return false;
        
        const taskDate = new Date(task.createdAt);
        const startDate = filter.start ? new Date(filter.start) : null;
        const endDate = filter.end ? new Date(filter.end) : null;
        
        if (startDate && taskDate < startDate) return false;
        if (endDate && taskDate > endDate) return false;
        
        return true;
      });
    }
  };
};