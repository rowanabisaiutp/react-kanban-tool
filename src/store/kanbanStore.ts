import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseISO, isValid } from 'date-fns';
import type { Board, Task, TaskStatus, Column } from '../types';
import { generateId } from '../utils/helpers';
import { mockBoards } from '../data/mockData';
import { safeSetItem, handleStorageError } from '../utils/storageManager';
import { logger } from '../utils/logger';

// Estado del store
interface KanbanState {
  boards: Board[];
  currentBoard: Board | null;
}

// Acciones del store
interface KanbanActions {
  // Getters
  getBoards: () => Board[];
  getCurrentBoard: () => Board | null;
  
  // Board management
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBoard: (boardId: string, updates: Partial<Omit<Board, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteBoard: (boardId: string) => void;
  
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, columnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
  duplicateTask: (task: Task) => void;
  archiveTask: (taskId: string) => void;
  restoreTask: (taskId: string) => void;
  deleteArchivedTask: (taskId: string) => void;
  
  // Column management
  addColumn: (column: Omit<Column, 'id' | 'tasks'>) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  deleteColumnWithMove: (columnId: string, moveToColumnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  
  // Comment management
  addComment: (taskId: string, content: string, author: string) => void;
  updateComment: (taskId: string, commentId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
}

// Helper para crear tarea
const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => ({
  ...task,
  id: generateId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: task.subtasks || [],
  completedAt: undefined
});

// Helper para deserializar fechas desde localStorage usando date-fns
export const deserializeDates = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(deserializeDates);
  }
  
  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'createdAt' || key === 'updatedAt' || key === 'completedAt' || key === 'dueDate') {
        if (value) {
          // Usar parseISO para parsear fechas ISO strings
          const parsedDate = parseISO(value as string);
          result[key] = isValid(parsedDate) ? parsedDate : new Date(value as string);
        } else {
          result[key] = value;
        }
      } else if (key === 'subtasks' && Array.isArray(value)) {
        result[key] = value.map((subtask: any) => ({
          ...subtask,
          createdAt: subtask.createdAt ? 
            (isValid(parseISO(subtask.createdAt)) ? parseISO(subtask.createdAt) : new Date(subtask.createdAt)) : 
            subtask.createdAt
        }));
      } else {
        result[key] = deserializeDates(value);
      }
    }
    return result;
  }
  
  return data;
};

// Helper para actualizar boards
const updateBoards = (boards: Board[], boardId: string, updater: (board: Board) => Board): Board[] =>
  boards.map(board => board.id === boardId ? updater(board) : board);

// Helper para actualizar columnas
const updateColumns = (columns: Column[], updater: (column: Column) => Column): Column[] =>
  columns.map(updater);

// Helper para sincronizar currentBoard después de actualizar boards
// Esto elimina la duplicación de código en todas las acciones
const syncCurrentBoard = (get: any, set: any, currentBoardId: string) => {
  const updatedBoard = get().boards.find((b: Board) => b.id === currentBoardId);
  if (updatedBoard) {
    set({ currentBoard: updatedBoard });
  }
};

// Store principal
export const useKanbanStore = create<KanbanState & KanbanActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      boards: [],
      currentBoard: null,

      // Getters
      getBoards: () => get().boards,
      getCurrentBoard: () => get().currentBoard,

      // Board management
      setBoards: (boards) => {
        set({ boards });
        // Si no hay currentBoard y hay boards disponibles, establecer el primero
        if (boards.length > 0 && !get().currentBoard) {
          set({ currentBoard: boards[0] });
        }
      },

      setCurrentBoard: (board) => set({ currentBoard: board }),

      addBoard: (boardData) => {
        const { boards } = get();
        const newBoard: Board = {
          ...boardData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set({ 
          boards: [...boards, newBoard],
          currentBoard: newBoard
        });
      },

      updateBoard: (boardId, updates) => {
        const { boards, currentBoard } = get();
        
        set({
          boards: boards.map(board => 
            board.id === boardId 
              ? { ...board, ...updates, updatedAt: new Date() }
              : board
          ),
          currentBoard: currentBoard?.id === boardId 
            ? { ...currentBoard, ...updates, updatedAt: new Date() }
            : currentBoard
        });
      },

      deleteBoard: (boardId) => {
        const { boards, currentBoard } = get();
        const filteredBoards = boards.filter(board => board.id !== boardId);
        
        // Si se elimina el tablero actual, cambiar al primero disponible
        const newCurrentBoard = currentBoard?.id === boardId 
          ? (filteredBoards.length > 0 ? filteredBoards[0] : null)
          : currentBoard;
        
        set({ 
          boards: filteredBoards,
          currentBoard: newCurrentBoard
        });
      },

      // Task management
      addTask: (task, columnId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) {
          logger.error('No hay currentBoard al agregar tarea');
          return;
        }

        const newTask = createTask(task);
        
        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column =>
              column.id === columnId
                ? { ...column, tasks: [...column.tasks, newTask] }
                : column
            ),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      updateTask: (taskId, updates) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) {
          logger.error('No hay currentBoard al actualizar tarea');
          return;
        }

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      // Funciones para comentarios
      addComment: (taskId, content, author) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        const newComment = {
          id: generateId(),
          content,
          author,
          createdAt: new Date(),
          isEdited: false
        };

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId 
                  ? { 
                      ...task, 
                      comments: [...(task.comments || []), newComment],
                      updatedAt: new Date() 
                    } 
                  : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      updateComment: (taskId, commentId, content) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId 
                  ? { 
                      ...task, 
                      comments: (task.comments || []).map(comment =>
                        comment.id === commentId 
                          ? { ...comment, content, updatedAt: new Date(), isEdited: true }
                          : comment
                      ),
                      updatedAt: new Date() 
                    } 
                  : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      deleteComment: (taskId, commentId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId 
                  ? { 
                      ...task, 
                      comments: (task.comments || []).filter(comment => comment.id !== commentId),
                      updatedAt: new Date() 
                    } 
                  : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      deleteTask: (taskId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) {
          logger.error('No hay currentBoard al eliminar tarea');
          return;
        }

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      moveTask: (taskId, newStatus, newIndex) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        // Encontrar tarea y columna fuente
        let taskToMove: Task | null = null;
        let sourceColumnId: string | null = null;
        
        for (const column of currentBoard.columns) {
          const task = column.tasks.find(t => t.id === taskId);
          if (task) {
            taskToMove = { ...task, status: newStatus, updatedAt: new Date() };
            sourceColumnId = column.id;
            break;
          }
        }
        
        if (!taskToMove || !sourceColumnId) return;
        
        set({
          boards: updateBoards(boards, currentBoard.id, board => {
            // Actualizar columnas
            const updatedColumns = board.columns.map(column => {
              if (column.id === sourceColumnId) {
                return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
              } else if (column.status === newStatus) {
                const newTasks = [...column.tasks];
                newTasks.splice(newIndex, 0, taskToMove!);
                return { ...column, tasks: newTasks };
              }
              return column;
            });
            
            return { ...board, columns: updatedColumns, updatedAt: new Date() };
          })
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      duplicateTask: (task) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        const duplicatedTask: Task = {
          ...task,
          id: generateId(),
          title: `${task.title} (Copia)`,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: undefined,
          subtasks: task.subtasks.map(subtask => ({
            ...subtask,
            id: generateId(),
            completed: false
          }))
        };

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column =>
              column.status === duplicatedTask.status
                ? { ...column, tasks: [...column.tasks, duplicatedTask] }
                : column
            ),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      archiveTask: (taskId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId
                  ? { 
                      ...task, 
                      archived: true, 
                      archivedAt: new Date(), 
                      updatedAt: new Date() 
                    }
                  : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      restoreTask: (taskId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId
                  ? { 
                      ...task, 
                      archived: false, 
                      archivedAt: undefined, 
                      updatedAt: new Date() 
                    }
                  : task
              )
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      deleteArchivedTask: (taskId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column => ({
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            })),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      // Column management
      addColumn: (column) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) {
          logger.error('No hay currentBoard al agregar columna');
          return;
        }

        const newColumn = { ...column, id: generateId(), tasks: [] };

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: [...board.columns, newColumn],
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      updateColumn: (columnId, updates) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column =>
              column.id === columnId ? { ...column, ...updates } : column
            ),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      deleteColumn: (columnId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: board.columns.filter(column => column.id !== columnId),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      deleteColumnWithMove: (columnId, moveToColumnId) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => {
            const columnToDelete = board.columns.find(col => col.id === columnId);
            const targetColumn = board.columns.find(col => col.id === moveToColumnId);
            
            if (!columnToDelete || !targetColumn) return board;
            
            const updatedTargetColumn = {
              ...targetColumn,
              tasks: [
                ...targetColumn.tasks,
                ...columnToDelete.tasks.map(task => ({
                  ...task,
                  status: targetColumn.status,
                  updatedAt: new Date()
                }))
              ]
            };
            
            return {
              ...board,
              columns: board.columns
                .filter(column => column.id !== columnId)
                .map(column => column.id === moveToColumnId ? updatedTargetColumn : column),
              updatedAt: new Date()
            };
          })
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      reorderColumns: (columnIds) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: columnIds
              .map(id => board.columns.find(col => col.id === id))
              .filter(Boolean) as Column[],
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },

      reorderTasks: (columnId, taskIds) => {
        const { boards, currentBoard } = get();
        if (!currentBoard) return;

        set({
          boards: updateBoards(boards, currentBoard.id, board => ({
            ...board,
            columns: updateColumns(board.columns, column =>
              column.id === columnId
                ? {
                    ...column,
                    tasks: taskIds
                      .map(id => column.tasks.find(task => task.id === id))
                      .filter(Boolean) as Task[]
                  }
                : column
            ),
            updatedAt: new Date()
          }))
        });

        syncCurrentBoard(get, set, currentBoard.id);
      },
    }),
    {
      name: 'kanban-storage',
      partialize: (state) => ({
        boards: state.boards,
        currentBoardId: state.currentBoard?.id || null
      }),
      onRehydrateStorage: () => (state) => {
        // Deserializar fechas cuando se cargan los datos del localStorage
        if (state) {
          state.boards = deserializeDates(state.boards);
          
          // Reconstruir currentBoard desde boards usando el ID guardado
          const currentBoardId = (state as any).currentBoardId;
          if (currentBoardId && state.boards.length > 0) {
            state.currentBoard = state.boards.find(b => b.id === currentBoardId) || state.boards[0];
          } else if (state.boards.length > 0) {
            state.currentBoard = state.boards[0];
          }
          
          // Solo cargar datos mock si NO hay datos en absoluto (primera vez)
          if (state.boards.length === 0) {
            state.setBoards(mockBoards);
          }
        }
      },
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (value) {
              const parsed = JSON.parse(value);
              return parsed;
            } else {
              return null;
            }
          } catch (error) {
            logger.error('Error reading from localStorage:', error);
            const storageError = handleStorageError(error as Error);
            if (storageError.type === 'CORRUPTED') {
              localStorage.removeItem(name);
            }
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            const result = await safeSetItem(name, JSON.stringify(value));
            if (!result.success && result.error) {
              logger.error('Storage error:', result.error.message);
              throw new Error(result.error.message);
            }
          } catch (error) {
            logger.error('Error writing to localStorage:', error);
            throw error;
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            logger.error('Error removing from localStorage:', error);
          }
        }
      }
    }
  )
);

// Hook personalizado para facilitar el uso
export const useKanban = () => {
  const store = useKanbanStore();
  
  return {
    // Estado
    boards: store.boards,
    currentBoard: store.currentBoard,
    
    // Acciones
    addTask: store.addTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    moveTask: store.moveTask,
    duplicateTask: store.duplicateTask,
    archiveTask: store.archiveTask,
    restoreTask: store.restoreTask,
    deleteArchivedTask: store.deleteArchivedTask,
    addColumn: store.addColumn,
    updateColumn: store.updateColumn,
    deleteColumn: store.deleteColumn,
    deleteColumnWithMove: store.deleteColumnWithMove,
    reorderColumns: store.reorderColumns,
    reorderTasks: store.reorderTasks,
    setCurrentBoard: store.setCurrentBoard,
    addBoard: store.addBoard,
    updateBoard: store.updateBoard,
    deleteBoard: store.deleteBoard,
    // Funciones para comentarios
    addComment: store.addComment,
    updateComment: store.updateComment,
    deleteComment: store.deleteComment,
  };
};
