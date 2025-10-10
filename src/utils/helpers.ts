import { 
  format, 
  formatDistanceToNow, 
  isValid, 
  parseISO, 
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { TaskStatus, TaskPriority, Task, Column } from '../types';
import { logger } from './logger';

// Generar ID único usando crypto.randomUUID() (más seguro y estándar)
export const generateId = (): string => {
  // Usar la API nativa de crypto para generar UUIDs seguros
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback para entornos que no soportan crypto.randomUUID()
  // (aunque todos los navegadores modernos lo soportan)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Generar color para etiquetas basado en el texto
export const getTagColor = (tag: string): { bg: string; text: string } => {
  // Paleta de colores para etiquetas (compatible con tema claro y oscuro)
  const colors = [
    { bg: '#e3f2fd', text: '#1565c0' },
    { bg: '#f3e5f5', text: '#7b1fa2' },
    { bg: '#e8f5e8', text: '#2e7d32' },
    { bg: '#fff3e0', text: '#ef6c00' },
    { bg: '#fce4ec', text: '#c2185b' },
    { bg: '#e0f2f1', text: '#00695c' },
    { bg: '#f1f8e9', text: '#558b2f' },
    { bg: '#fff8e1', text: '#f57f17' },
  ];

  // Generar índice basado en el hash del texto
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Formatear fecha relativa usando date-fns
export const formatRelativeDate = (date: Date | string): string => {
  try {
    // Convertir string a Date si es necesario
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Fecha inválida';
    }
    // Usar date-fns para formateo relativo
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: es 
    });
  } catch (error) {
    logger.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

// Formatear fecha completa usando date-fns
export const formatFullDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Fecha inválida';
    }
    
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    logger.error('Error formateando fecha completa:', error);
    return 'Fecha inválida';
  }
};

// Formatear fecha corta usando date-fns
export const formatShortDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Fecha inválida';
    }
    
    return format(dateObj, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    logger.error('Error formateando fecha corta:', error);
    return 'Fecha inválida';
  }
};

// Verificar si una fecha es hoy
export const isToday = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    return differenceInDays(today, dateObj) === 0;
  } catch {
    return false;
  }
};

// Verificar si una fecha es esta semana
export const isThisWeek = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    return differenceInWeeks(today, dateObj) === 0;
  } catch {
    return false;
  }
};

// Verificar si una fecha es este mes
export const isThisMonth = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    return differenceInMonths(today, dateObj) === 0;
  } catch {
    return false;
  }
};

// Obtener diferencia de tiempo detallada
export const getTimeDifference = (date: Date | string): {
  days: number;
  weeks: number;
  months: number;
  years: number;
} => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    if (!isValid(dateObj)) {
      return { days: 0, weeks: 0, months: 0, years: 0 };
    }
    
    return {
      days: differenceInDays(today, dateObj),
      weeks: differenceInWeeks(today, dateObj),
      months: differenceInMonths(today, dateObj),
      years: differenceInYears(today, dateObj)
    };
  } catch {
    return { days: 0, weeks: 0, months: 0, years: 0 };
  }
};

// Obtener color de prioridad
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    lowest: '#34d399',
    low: '#a0aec0',
    medium: '#60a5fa',
    high: '#fbbf24',
    urgent: '#f87171'
  };
  return colors[priority]; 
};

// Obtener icono de prioridad (legacy - para compatibilidad)
export const getPriorityIcon = (priority: TaskPriority): string => {
  const icons = {
    lowest: '↓↓',
    low: '↓',
    medium: '→',
    high: '↑',
    urgent: '↑↑'
  };
  return icons[priority];
};

// Obtener nombre del icono Lucide para prioridad
export const getPriorityIconName = (priority: TaskPriority): string => {
  const iconNames = {
    lowest: 'ChevronsDown',
    low: 'ChevronDown',
    medium: 'Minus',
    high: 'ChevronUp',
    urgent: 'ChevronsUp'
  };
  return iconNames[priority];
};

// Obtener color de estado
export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<string, string> = {
    todo: '#3b82f6',
    'in-progress': '#f59e0b',
    done: '#22c55e'
  };
  // Color gris por defecto para status personalizados
  return colors[status] || '#6b7280';
};

// Obtener texto de estado
export const getStatusText = (status: TaskStatus): string => {
  const texts: Record<string, string> = {
    todo: 'Por Hacer',
    'in-progress': 'En Progreso',
    done: 'Completado'
  };
  // Devolver el status tal como está para status personalizados
  return texts[status] || status;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Tipo para filtros de búsqueda
interface SearchFilters {
  query: string;
  priority: TaskPriority | null;
  tags: string[];
  dateRange: { start: Date | string | null; end: Date | string | null };
  assignee: string | null;
  boardId?: string | null;
  sortBy?: string;
  sortOrder?: string;
}

// Filtrar tareas basado en criterios de búsqueda
export const filterTasks = (tasks: Task[], filters: SearchFilters): Task[] => {
  // Si no hay filtros activos, retornar todas las tareas
  if (!filters.query && !filters.priority && !filters.tags.length && 
      !filters.dateRange.start && !filters.dateRange.end && !filters.assignee) {
    return tasks;
  }

  return tasks.filter(task => {
    // Filtro por búsqueda de texto
    if (filters.query && filters.query.trim() !== '') {
      const query = filters.query.toLowerCase();
      const matchesQuery = 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag: string) => tag.toLowerCase().includes(query));
      if (!matchesQuery) return false;
    }

    // Filtro por prioridad
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Filtro por etiquetas (todas deben coincidir)
    if (filters.tags.length > 0 && !filters.tags.every((tag: string) => task.tags.includes(tag))) {
      return false;
    }

    // Filtro por asignado
    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
    }

    // Filtro por rango de fechas
    if (filters.dateRange.start || filters.dateRange.end) {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
      
      if (startDate && taskDate < startDate) return false;
      if (endDate && taskDate > endDate) return false;
    }

    return true;
  });
};

// Encontrar columna que contiene una tarea específica
export const findColumnByTaskId = (columns: Column[], taskId: string) => {
  return columns.find(col => col.tasks.some((t: Task) => t.id === taskId));
};

// Obtener carga de trabajo por usuario
export const getUserWorkload = (tasks: Task[], username: string): {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<TaskPriority, number>;
} => {
  const userTasks = tasks.filter(task => 
    task.assignees?.includes(username) || task.assignee === username
  );

  const byStatus: Record<string, number> = {};
  const byPriority: Record<TaskPriority, number> = { lowest: 0, low: 0, medium: 0, high: 0, urgent: 0 };

  userTasks.forEach(task => {
    byStatus[task.status] = (byStatus[task.status] || 0) + 1;
    byPriority[task.priority]++;
  });

  return {
    total: userTasks.length,
    byStatus,
    byPriority
  };
};

// Obtener todas las cargas de trabajo
export const getAllWorkloads = (tasks: Task[], usernames: readonly string[]) => {
  return usernames.map(username => ({
    username,
    ...getUserWorkload(tasks, username)
  }));
};