// Tipos principales del Kanban
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string; // Mantener para compatibilidad con datos antiguos
  assignees?: string[]; // Nueva propiedad para múltiples asignados
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  dueDate?: Date;
  estimatedHours?: number;
  archived?: boolean; // Nueva propiedad para tareas archivadas
  archivedAt?: Date; // Fecha de archivado
}

export type TaskStatus = 'todo' | 'in-progress' | 'done' | string;
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'urgent';

export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  color: string;
  maxTasks?: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para UI
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'true' | 'false' | 'listbox' | 'tree' | 'grid';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Tipos para formularios
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee?: string; // Mantener para compatibilidad
  assignees?: string[]; // Nueva propiedad para múltiples asignados
  tags: string[];
  status: TaskStatus;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
}

export interface ColumnFormData {
  title: string;
  color: string;
  maxTasks?: number;
}

// Tipos para drag and drop
export interface DragItem {
  type: 'task' | 'column';
  id: string;
  index: number;
  columnId?: string;
}

// Tipos para el store de Zustand (mantenidos para compatibilidad)
export interface KanbanStoreType {
  boards: Board[];
  currentBoard: Board | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, columnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
  addColumn: (column: Omit<Column, 'id' | 'tasks'>) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  duplicateTask: (task: Task) => void;
  archiveTask: (taskId: string) => void;
  deleteColumnWithMove: (columnId: string, moveToColumnId: string) => void;
  setCurrentBoard: (board: Board) => void;
  // Funciones para comentarios
  addComment: (taskId: string, content: string, author: string) => void;
  updateComment: (taskId: string, commentId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
}

// Tipos para localStorage
export interface StoredData {
  boards: Board[];
  currentBoardId: string | null;
  lastUpdated: string;
}

// Tipos de usuarios detectados temporalmente deshabilitados
// export { DetectedUser } from '../hooks/useUserDetection';
