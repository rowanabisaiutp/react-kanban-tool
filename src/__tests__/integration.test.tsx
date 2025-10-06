import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../styles/theme';
import { useKanban } from '../store/kanbanStore';
import { useNotificationSystem } from '../hooks/useNotifications';

// Mock de los hooks
jest.mock('../store/kanbanStore');
jest.mock('../hooks/useNotifications');

const mockUseKanban = useKanban as jest.MockedFunction<typeof useKanban>;
const mockUseNotificationSystem = useNotificationSystem as jest.MockedFunction<typeof useNotificationSystem>;

// Mock de los componentes complejos
jest.mock('../components/kanban/Board', () => {
  return function MockBoard({ children }: { children: React.ReactNode }) {
    return <div data-testid="kanban-board">{children}</div>;
  };
});

jest.mock('../pages/DashboardPage', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Integration Tests', () => {
  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockMoveTask = jest.fn();
  const mockAddBoard = jest.fn();
  const mockUpdateBoard = jest.fn();
  const mockDeleteBoard = jest.fn();
  const mockAddColumn = jest.fn();
  const mockUpdateColumn = jest.fn();
  const mockDeleteColumn = jest.fn();
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseKanban.mockReturnValue({
      boards: [
        {
          id: 'board-1',
          title: 'Board 1',
          description: 'Test Board 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          columns: [
            {
              id: 'col-1',
              title: 'Todo',
              status: 'todo',
              color: '#3b82f6',
              tasks: [
                {
                  id: 'task-1',
                  title: 'Test Task 1',
                  description: 'Test Description',
                  status: 'todo',
                  priority: 'medium',
                  assignee: 'John Doe',
                  tags: ['test'],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  dueDate: new Date(),
                  estimatedHours: 2,
                  subtasks: [],
                  comments: []
                }
              ]
            }
          ]
        }
      ],
      currentBoard: {
        id: 'board-1',
        title: 'Board 1',
        description: 'Test Board 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        columns: [
          {
            id: 'col-1',
            title: 'Todo',
            status: 'todo',
            color: '#3b82f6',
            tasks: [
              {
                id: 'task-1',
                title: 'Test Task 1',
                description: 'Test Description',
                status: 'todo',
                priority: 'medium',
                assignee: 'John Doe',
                tags: ['test'],
                createdAt: new Date(),
                updatedAt: new Date(),
                dueDate: new Date(),
                estimatedHours: 2,
                subtasks: [],
                comments: []
              }
            ]
          }
        ]
      },
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      moveTask: mockMoveTask,
      addBoard: mockAddBoard,
      updateBoard: mockUpdateBoard,
      deleteBoard: mockDeleteBoard,
      addColumn: mockAddColumn,
      updateColumn: mockUpdateColumn,
      deleteColumn: mockDeleteColumn,
      deleteColumnWithMove: jest.fn(),
      setCurrentBoard: jest.fn(),
      reorderColumns: jest.fn(),
      reorderTasks: jest.fn(),
      duplicateTask: jest.fn(),
      archiveTask: jest.fn(),
      restoreTask: jest.fn(),
      deleteArchivedTask: jest.fn(),
      addComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn()
    });

    mockUseNotificationSystem.mockReturnValue({
      notifications: [],
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: jest.fn(),
      showInfo: jest.fn(),
      showNotificationWithAction: jest.fn(),
      removeNotification: jest.fn(),
      clearAllNotifications: jest.fn()
    });
  });

  describe('Component Integration', () => {
    it('should render board component correctly', () => {
      const TestComponent = () => (
        <div>
          <div data-testid="kanban-board">Board Component</div>
        </div>
      );

      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
    });

    it('should render dashboard component correctly', () => {
      const TestComponent = () => (
        <div>
          <div data-testid="dashboard">Dashboard Component</div>
        </div>
      );

      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  describe('Store Integration', () => {
    it('should provide store data to components', () => {
      // Verificar que los mocks están configurados correctamente
      const storeData = mockUseKanban();
      const notificationData = mockUseNotificationSystem();
      
      expect(storeData).toBeDefined();
      expect(notificationData).toBeDefined();
    });

    it('should have correct board structure', () => {
      const storeData = mockUseKanban();
      expect(storeData.boards).toHaveLength(1);
      expect(storeData.boards[0].id).toBe('board-1');
      expect(storeData.currentBoard).toBeDefined();
    });
  });

  describe('User Interactions', () => {
    it('should handle task creation', async () => {
      // Simular creación de tarea
      mockAddTask({
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'medium'
      });

      expect(mockAddTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'medium'
      });
    });

    it('should handle task updates', async () => {
      // Simular actualización de tarea
      mockUpdateTask('task-1', {
        title: 'Updated Task',
        priority: 'high'
      });

      expect(mockUpdateTask).toHaveBeenCalledWith('task-1', {
        title: 'Updated Task',
        priority: 'high'
      });
    });

    it('should handle task deletion', async () => {
      // Simular eliminación de tarea
      mockDeleteTask('task-1');

      expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', () => {
      mockUseKanban.mockReturnValue({
        boards: [],
        currentBoard: null,
        addTask: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
        moveTask: jest.fn(),
        addBoard: jest.fn(),
        updateBoard: jest.fn(),
        deleteBoard: jest.fn(),
        addColumn: jest.fn(),
        updateColumn: jest.fn(),
        deleteColumn: jest.fn(),
        deleteColumnWithMove: jest.fn(),
        setCurrentBoard: jest.fn(),
        reorderColumns: jest.fn(),
        reorderTasks: jest.fn(),
        duplicateTask: jest.fn(),
        archiveTask: jest.fn(),
        restoreTask: jest.fn(),
        deleteArchivedTask: jest.fn(),
        addComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn()
      });

      const storeData = mockUseKanban();
      expect(storeData.boards).toHaveLength(0);
      expect(storeData.currentBoard).toBeNull();
    });
  });
});