import { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Board, Task, TaskPriority } from '../types';

// Tipos para filtros y búsqueda
export interface SearchFilters {
  query: string;
  boardId: string | null;
  priority: TaskPriority | null;
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  assignee: string | null;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Tipos para filtros específicos del Dashboard
export interface DashboardFilters {
  boardId: string | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string[]; // Filtros por estado de tareas
  priority: TaskPriority | null;
  assignee: string | null;
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all'; // Rangos predefinidos
}

// Tipo para el contexto de filtros
export type FilterContext = 'kanban' | 'dashboard';

// Estado inicial para Kanban
const initialKanbanFilters: SearchFilters = {
  query: '',
  boardId: null,
  priority: null,
  tags: [],
  dateRange: {
    start: null,
    end: null,
  },
  assignee: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Estado inicial para Dashboard
const initialDashboardFilters: DashboardFilters = {
  boardId: null,
  dateRange: {
    start: null,
    end: null,
  },
  status: [],
  priority: null,
  assignee: null,
  timeRange: '30d',
};

// Estado del contexto unificado
interface UnifiedFilterState {
  kanbanFilters: SearchFilters;
  dashboardFilters: DashboardFilters;
  currentContext: FilterContext;
}

// Acciones del reducer
type UnifiedFilterAction =
  // Acciones para Kanban
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_BOARD_FILTER'; payload: string | null }
  | { type: 'SET_PRIORITY_FILTER'; payload: TaskPriority | null }
  | { type: 'ADD_TAG_FILTER'; payload: string }
  | { type: 'REMOVE_TAG_FILTER'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: { start: Date | null; end: Date | null } }
  | { type: 'SET_ASSIGNEE_FILTER'; payload: string | null }
  | { type: 'SET_SORT'; payload: { by: SearchFilters['sortBy']; order: SearchFilters['sortOrder'] } }
  | { type: 'CLEAR_KANBAN_FILTERS' }
  // Acciones para Dashboard
  | { type: 'SET_DASHBOARD_BOARD_FILTER'; payload: string | null }
  | { type: 'SET_DASHBOARD_PRIORITY_FILTER'; payload: TaskPriority | null }
  | { type: 'ADD_DASHBOARD_STATUS_FILTER'; payload: string }
  | { type: 'REMOVE_DASHBOARD_STATUS_FILTER'; payload: string }
  | { type: 'SET_DASHBOARD_DATE_RANGE'; payload: { start: Date | null; end: Date | null } }
  | { type: 'SET_DASHBOARD_ASSIGNEE_FILTER'; payload: string | null }
  | { type: 'SET_DASHBOARD_TIME_RANGE'; payload: DashboardFilters['timeRange'] }
  | { type: 'CLEAR_DASHBOARD_FILTERS' }
  // Acciones generales
  | { type: 'SET_CONTEXT'; payload: FilterContext };

// Reducer para Kanban
const kanbanReducer = (state: SearchFilters, action: UnifiedFilterAction): SearchFilters => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_BOARD_FILTER':
      return { ...state, boardId: action.payload };
    case 'SET_PRIORITY_FILTER':
      return { ...state, priority: action.payload };
    case 'ADD_TAG_FILTER':
      return { 
        ...state, 
        tags: state.tags.includes(action.payload) 
          ? state.tags 
          : [...state.tags, action.payload] 
      };
    case 'REMOVE_TAG_FILTER':
      return { 
        ...state, 
        tags: state.tags.filter(tag => tag !== action.payload) 
      };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_ASSIGNEE_FILTER':
      return { ...state, assignee: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.by, sortOrder: action.payload.order };
    case 'CLEAR_KANBAN_FILTERS':
      return initialKanbanFilters;
    default:
      return state;
  }
};

// Reducer para Dashboard
const dashboardReducer = (state: DashboardFilters, action: UnifiedFilterAction): DashboardFilters => {
  switch (action.type) {
    case 'SET_DASHBOARD_BOARD_FILTER':
      return { ...state, boardId: action.payload };
    case 'SET_DASHBOARD_PRIORITY_FILTER':
      return { ...state, priority: action.payload };
    case 'ADD_DASHBOARD_STATUS_FILTER':
      return { 
        ...state, 
        status: state.status.includes(action.payload) 
          ? state.status 
          : [...state.status, action.payload] 
      };
    case 'REMOVE_DASHBOARD_STATUS_FILTER':
      return { 
        ...state, 
        status: state.status.filter(status => status !== action.payload) 
      };
    case 'SET_DASHBOARD_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_DASHBOARD_ASSIGNEE_FILTER':
      return { ...state, assignee: action.payload };
    case 'SET_DASHBOARD_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    case 'CLEAR_DASHBOARD_FILTERS':
      return initialDashboardFilters;
    default:
      return state;
  }
};

// Reducer principal
const unifiedFilterReducer = (state: UnifiedFilterState, action: UnifiedFilterAction): UnifiedFilterState => {
  switch (action.type) {
    case 'SET_CONTEXT':
      return { ...state, currentContext: action.payload };
    default:
      return {
        ...state,
        kanbanFilters: kanbanReducer(state.kanbanFilters, action),
        dashboardFilters: dashboardReducer(state.dashboardFilters, action),
      };
  }
};

// Contexto unificado
interface UnifiedFilterContextType {
  // Estado
  kanbanFilters: SearchFilters;
  dashboardFilters: DashboardFilters;
  currentContext: FilterContext;
  
  // Funciones para Kanban
  setQuery: (query: string) => void;
  setBoardFilter: (boardId: string | null) => void;
  setPriorityFilter: (priority: TaskPriority | null) => void;
  addTagFilter: (tag: string) => void;
  removeTagFilter: (tag: string) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setAssigneeFilter: (assignee: string | null) => void;
  setSort: (by: SearchFilters['sortBy'], order: SearchFilters['sortOrder']) => void;
  clearKanbanFilters: () => void;
  
  // Funciones para Dashboard
  setDashboardBoardFilter: (boardId: string | null) => void;
  setDashboardPriorityFilter: (priority: TaskPriority | null) => void;
  addDashboardStatusFilter: (status: string) => void;
  removeDashboardStatusFilter: (status: string) => void;
  setDashboardDateRange: (start: Date | null, end: Date | null) => void;
  setDashboardAssigneeFilter: (assignee: string | null) => void;
  setDashboardTimeRange: (timeRange: DashboardFilters['timeRange']) => void;
  clearDashboardFilters: () => void;
  
  // Utilidades
  hasActiveKanbanFilters: boolean;
  hasActiveDashboardFilters: boolean;
  filteredTasks: Task[];
  filteredBoards: Board[];
  setContext: (context: FilterContext) => void;
}

const UnifiedFilterContext = createContext<UnifiedFilterContextType | undefined>(undefined);

// Provider
export const UnifiedFilterProvider = ({ children, boards }: { children: ReactNode; boards: Board[] }) => {
  const [state, dispatch] = useReducer(unifiedFilterReducer, {
    kanbanFilters: initialKanbanFilters,
    dashboardFilters: initialDashboardFilters,
    currentContext: 'kanban',
  });

  // Funciones para Kanban
  const setQuery = (query: string) => dispatch({ type: 'SET_QUERY', payload: query });
  const setBoardFilter = (boardId: string | null) => dispatch({ type: 'SET_BOARD_FILTER', payload: boardId });
  const setPriorityFilter = (priority: TaskPriority | null) => dispatch({ type: 'SET_PRIORITY_FILTER', payload: priority });
  const addTagFilter = (tag: string) => dispatch({ type: 'ADD_TAG_FILTER', payload: tag });
  const removeTagFilter = (tag: string) => dispatch({ type: 'REMOVE_TAG_FILTER', payload: tag });
  const setDateRange = (start: Date | null, end: Date | null) => dispatch({ type: 'SET_DATE_RANGE', payload: { start, end } });
  const setAssigneeFilter = (assignee: string | null) => dispatch({ type: 'SET_ASSIGNEE_FILTER', payload: assignee });
  const setSort = (by: SearchFilters['sortBy'], order: SearchFilters['sortOrder']) => 
    dispatch({ type: 'SET_SORT', payload: { by, order } });
  const clearKanbanFilters = () => dispatch({ type: 'CLEAR_KANBAN_FILTERS' });

  // Funciones para Dashboard
  const setDashboardBoardFilter = (boardId: string | null) => dispatch({ type: 'SET_DASHBOARD_BOARD_FILTER', payload: boardId });
  const setDashboardPriorityFilter = (priority: TaskPriority | null) => dispatch({ type: 'SET_DASHBOARD_PRIORITY_FILTER', payload: priority });
  const addDashboardStatusFilter = (status: string) => dispatch({ type: 'ADD_DASHBOARD_STATUS_FILTER', payload: status });
  const removeDashboardStatusFilter = (status: string) => dispatch({ type: 'REMOVE_DASHBOARD_STATUS_FILTER', payload: status });
  const setDashboardDateRange = (start: Date | null, end: Date | null) => dispatch({ type: 'SET_DASHBOARD_DATE_RANGE', payload: { start, end } });
  const setDashboardAssigneeFilter = (assignee: string | null) => dispatch({ type: 'SET_DASHBOARD_ASSIGNEE_FILTER', payload: assignee });
  const setDashboardTimeRange = (timeRange: DashboardFilters['timeRange']) => dispatch({ type: 'SET_DASHBOARD_TIME_RANGE', payload: timeRange });
  const clearDashboardFilters = () => dispatch({ type: 'CLEAR_DASHBOARD_FILTERS' });

  // Función para cambiar contexto
  const setContext = (context: FilterContext) => dispatch({ type: 'SET_CONTEXT', payload: context });

  // Verificar si hay filtros activos
  const hasActiveKanbanFilters = useMemo(() => {
    const filters = state.kanbanFilters;
    return (
      filters.query !== '' ||
      filters.boardId !== null ||
      filters.priority !== null ||
      filters.tags.length > 0 ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      filters.assignee !== null
    );
  }, [state.kanbanFilters]);

  const hasActiveDashboardFilters = useMemo(() => {
    const filters = state.dashboardFilters;
    return (
      filters.boardId !== null ||
      filters.priority !== null ||
      filters.status.length > 0 ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      filters.assignee !== null ||
      filters.timeRange !== '30d'
    );
  }, [state.dashboardFilters]);

  // Obtener todas las tareas de todos los boards
  const allTasks = useMemo(() => {
    const tasks: Task[] = [];
    boards.forEach(board => {
      board.columns.forEach(column => {
        tasks.push(...column.tasks);
      });
    });
    return tasks;
  }, [boards]);

  // Filtrar tareas para Kanban
  const filteredTasks = useMemo(() => {
    let tasks = allTasks;
    const filters = state.kanbanFilters;

    // Aplicar filtros de Kanban
    if (filters.query) {
      const query = filters.query.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.boardId) {
      tasks = tasks.filter(task => {
        return boards.some(board => 
          board.id === filters.boardId && 
          board.columns.some(column => 
            column.tasks.some(t => t.id === task.id)
          )
        );
      });
    }

    if (filters.priority) {
      tasks = tasks.filter(task => task.priority === filters.priority);
    }

    if (filters.tags.length > 0) {
      tasks = tasks.filter(task => 
        filters.tags.every(tag => task.tags.includes(tag))
      );
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && taskDate < startDate) return false;
        if (endDate && taskDate > endDate) return false;
        return true;
      });
    }

    if (filters.assignee) {
      tasks = tasks.filter(task => task.assignee === filters.assignee);
    }

    // Ordenar
    tasks.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return tasks;
  }, [allTasks, state.kanbanFilters]);

  // Filtrar boards
  const filteredBoards = useMemo(() => {
    if (state.currentContext === 'kanban' && state.kanbanFilters.boardId) {
      return boards.filter(board => board.id === state.kanbanFilters.boardId);
    }
    if (state.currentContext === 'dashboard' && state.dashboardFilters.boardId) {
      return boards.filter(board => board.id === state.dashboardFilters.boardId);
    }
    return boards;
  }, [boards, state.kanbanFilters.boardId, state.dashboardFilters.boardId, state.currentContext]);

  const value: UnifiedFilterContextType = {
    kanbanFilters: state.kanbanFilters,
    dashboardFilters: state.dashboardFilters,
    currentContext: state.currentContext,
    setQuery,
    setBoardFilter,
    setPriorityFilter,
    addTagFilter,
    removeTagFilter,
    setDateRange,
    setAssigneeFilter,
    setSort,
    clearKanbanFilters,
    setDashboardBoardFilter,
    setDashboardPriorityFilter,
    addDashboardStatusFilter,
    removeDashboardStatusFilter,
    setDashboardDateRange,
    setDashboardAssigneeFilter,
    setDashboardTimeRange,
    clearDashboardFilters,
    hasActiveKanbanFilters,
    hasActiveDashboardFilters,
    filteredTasks,
    filteredBoards,
    setContext,
  };

  return (
    <UnifiedFilterContext.Provider value={value}>
      {children}
    </UnifiedFilterContext.Provider>
  );
};

// Hook para usar el contexto unificado
export const useUnifiedFilters = () => {
  const context = useContext(UnifiedFilterContext);
  if (context === undefined) {
    throw new Error('useUnifiedFilters debe ser usado dentro de un UnifiedFilterProvider');
  }
  return context;
};

// Hook específico para Kanban (compatibilidad)
export const useKanbanFilters = () => {
  const { kanbanFilters, setQuery, setBoardFilter, setPriorityFilter, addTagFilter, removeTagFilter, setDateRange, setAssigneeFilter, setSort, clearKanbanFilters, hasActiveKanbanFilters, filteredTasks, filteredBoards } = useUnifiedFilters();
  
  return {
    filters: kanbanFilters,
    setQuery,
    setBoardFilter,
    setPriorityFilter,
    addTagFilter,
    removeTagFilter,
    setDateRange,
    setAssigneeFilter,
    setSort,
    clearAllFilters: clearKanbanFilters,
    hasActiveFilters: hasActiveKanbanFilters,
    filteredTasks,
    filteredBoards,
  };
};

// Hook específico para Dashboard
export const useDashboardFilters = () => {
  const { dashboardFilters, setDashboardBoardFilter, setDashboardPriorityFilter, addDashboardStatusFilter, removeDashboardStatusFilter, setDashboardDateRange, setDashboardAssigneeFilter, setDashboardTimeRange, clearDashboardFilters, hasActiveDashboardFilters, filteredBoards } = useUnifiedFilters();
  
  return {
    filters: dashboardFilters,
    setBoardFilter: setDashboardBoardFilter,
    setPriorityFilter: setDashboardPriorityFilter,
    addStatusFilter: addDashboardStatusFilter,
    removeStatusFilter: removeDashboardStatusFilter,
    setDateRange: setDashboardDateRange,
    setAssigneeFilter: setDashboardAssigneeFilter,
    setTimeRange: setDashboardTimeRange,
    clearAllFilters: clearDashboardFilters,
    hasActiveFilters: hasActiveDashboardFilters,
    filteredBoards,
  };
};
