import { act, renderHook } from '@testing-library/react';
import { useKanbanStore } from '../kanbanStore';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('kanbanStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useKanbanStore.getState().setBoards([]);
    useKanbanStore.getState().setCurrentBoard(null);
  });

  describe('Board Management', () => {
    it('should add a new board', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const newBoardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      act(() => {
        result.current.addBoard(newBoardData);
      });

      expect(result.current.boards).toHaveLength(1);
      expect(result.current.boards[0]).toMatchObject(newBoardData);
      expect(result.current.boards[0].id).toBeDefined();
      expect(result.current.boards[0].createdAt).toBeDefined();
      expect(result.current.boards[0].updatedAt).toBeDefined();
    });

    it('should update a board', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      act(() => {
        result.current.addBoard(boardData);
      });

      const boardId = result.current.boards[0].id;

      act(() => {
        result.current.updateBoard(boardId, { title: 'Updated Board' });
      });

      expect(result.current.boards[0].title).toBe('Updated Board');
    });

    it('should delete a board', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      act(() => {
        result.current.addBoard(boardData);
      });

      const boardId = result.current.boards[0].id;

      act(() => {
        result.current.deleteBoard(boardId);
      });

      expect(result.current.boards).toHaveLength(0);
      expect(result.current.currentBoard).toBeNull();
    });
  });

  describe('Column Management', () => {
    it('should add a column to current board', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      act(() => {
        result.current.addBoard(boardData);
      });

      const newColumnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      act(() => {
        result.current.addColumn(newColumnData);
      });

      expect(result.current.currentBoard?.columns).toHaveLength(1);
      expect(result.current.currentBoard?.columns[0]).toMatchObject(newColumnData);
      expect(result.current.currentBoard?.columns[0].id).toBeDefined();
      expect(result.current.currentBoard?.columns[0].tasks).toEqual([]);
    });

    it('should update a column', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const columnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(columnData);
      });

      const columnId = result.current.currentBoard?.columns[0].id;

      act(() => {
        result.current.updateColumn(columnId!, { title: 'Updated Column' });
      });

      expect(result.current.currentBoard?.columns[0].title).toBe('Updated Column');
    });

    it('should delete a column', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const columnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(columnData);
      });

      const columnId = result.current.currentBoard?.columns[0].id;

      act(() => {
        result.current.deleteColumn(columnId!);
      });

      expect(result.current.currentBoard?.columns).toHaveLength(0);
    });
  });

  describe('Task Management', () => {
    it('should add a task to a column', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const columnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(columnData);
      });

      const columnId = result.current.currentBoard?.columns[0].id;

      const newTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'high' as const,
        assignee: 'user1',
        assignees: ['user1'],
        tags: [],
        subtasks: [],
        comments: []
      };

      act(() => {
        result.current.addTask(newTaskData, columnId!);
      });

      expect(result.current.currentBoard?.columns[0].tasks).toHaveLength(1);
      expect(result.current.currentBoard?.columns[0].tasks[0]).toMatchObject(newTaskData);
      expect(result.current.currentBoard?.columns[0].tasks[0].id).toBeDefined();
    });

    it('should update a task', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const columnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'high' as const,
        assignee: 'user1',
        assignees: ['user1'],
        tags: [],
        subtasks: [],
        comments: []
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(columnData);
      });

      const columnId = result.current.currentBoard?.columns[0].id;

      act(() => {
        result.current.addTask(taskData, columnId!);
      });

      const taskId = result.current.currentBoard?.columns[0].tasks[0].id;

      act(() => {
        result.current.updateTask(taskId!, { title: 'Updated Task' });
      });

      expect(result.current.currentBoard?.columns[0].tasks[0].title).toBe('Updated Task');
    });

    it('should delete a task', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const columnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'high' as const,
        assignee: 'user1',
        assignees: ['user1'],
        tags: [],
        subtasks: [],
        comments: []
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(columnData);
      });

      const columnId = result.current.currentBoard?.columns[0].id;

      act(() => {
        result.current.addTask(taskData, columnId!);
      });

      const taskId = result.current.currentBoard?.columns[0].tasks[0].id;

      act(() => {
        result.current.deleteTask(taskId!);
      });

      expect(result.current.currentBoard?.columns[0].tasks).toHaveLength(0);
    });
  });

  describe('Task Movement', () => {
    it('should move task between columns', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const boardData = {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      };

      const todoColumnData = {
        title: 'To Do',
        status: 'todo' as const,
        color: '#10b981'
      };

      const progressColumnData = {
        title: 'In Progress',
        status: 'in-progress' as const,
        color: '#f59e0b'
      };

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'high' as const,
        assignee: 'user1',
        assignees: ['user1'],
        tags: [],
        subtasks: [],
        comments: []
      };

      act(() => {
        result.current.addBoard(boardData);
        result.current.addColumn(todoColumnData);
        result.current.addColumn(progressColumnData);
      });

      const todoColumnId = result.current.currentBoard?.columns[0].id;

      act(() => {
        result.current.addTask(taskData, todoColumnId!);
      });

      const taskId = result.current.currentBoard?.columns[0].tasks[0].id;

      act(() => {
        result.current.moveTask(taskId!, 'in-progress', 0);
      });

      expect(result.current.currentBoard?.columns[0].tasks).toHaveLength(0);
      expect(result.current.currentBoard?.columns[1].tasks).toHaveLength(1);
      expect(result.current.currentBoard?.columns[1].tasks[0].status).toBe('in-progress');
    });
  });
});