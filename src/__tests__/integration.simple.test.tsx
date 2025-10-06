import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock de los hooks principales
jest.mock('../store/kanbanStore', () => ({
  useKanban: () => ({
    boards: [
      {
        id: 'board-1',
        title: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        columns: [
          {
            id: 'column-1',
            title: 'To Do',
            tasks: [],
            maxTasks: 10,
          },
        ],
      },
    ],
    currentBoard: {
      id: 'board-1',
      title: 'Test Board',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
      columns: [
        {
          id: 'column-1',
          title: 'To Do',
          tasks: [],
          maxTasks: 10,
        },
      ],
    },
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
  }),
}));

jest.mock('../hooks/useNotifications', () => ({
  useNotificationSystem: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarning: jest.fn(),
    showInfo: jest.fn(),
  }),
}));

describe('Integration Tests - Simple', () => {
  describe('Ciclo de vida completo de tareas', () => {
    it('debe completar el flujo completo de una tarea', async () => {
      const user = userEvent.setup();
      
      const TaskLifecycleTest = () => {
        const [tasks, setTasks] = React.useState([
          {
            id: 'task-1',
            title: 'Test Task',
            description: 'Test Description',
            priority: 'high' as const,
            status: 'todo' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['urgent'],
            subtasks: [],
            assignees: [],
          },
        ]);

        const handleMoveTask = (taskId: string, newStatus: string) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus as any } : task
          ));
        };

        const handleUpdateTask = (taskId: string, updates: any) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ));
        };

        const handleDeleteTask = (taskId: string) => {
          setTasks(prev => prev.filter(task => task.id !== taskId));
        };

        return (
          <div>
            <h1>Task Lifecycle Test</h1>
            {tasks.map(task => (
              <div key={task.id} data-testid={`task-${task.id}`}>
                <h3>{task.title}</h3>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <button 
                  onClick={() => handleMoveTask(task.id, 'in-progress')}
                  data-testid={`move-to-progress-${task.id}`}
                >
                  Move to In Progress
                </button>
                <button 
                  onClick={() => handleMoveTask(task.id, 'done')}
                  data-testid={`move-to-done-${task.id}`}
                >
                  Move to Done
                </button>
                <button 
                  onClick={() => handleUpdateTask(task.id, { priority: 'low' })}
                  data-testid={`update-priority-${task.id}`}
                >
                  Change Priority to Low
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  data-testid={`delete-task-${task.id}`}
                >
                  Delete Task
                </button>
              </div>
            ))}
          </div>
        );
      };

      render(<TaskLifecycleTest />);

      // Verificar que la tarea se renderiza correctamente
      expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
      expect(screen.getByText('Status: todo')).toBeInTheDocument();
      expect(screen.getByText('Priority: high')).toBeInTheDocument();

      // Mover tarea a "In Progress"
      const moveToProgressButton = screen.getByTestId('move-to-progress-task-1');
      await user.click(moveToProgressButton);

      await waitFor(() => {
        expect(screen.getByText('Status: in-progress')).toBeInTheDocument();
      });

      // Cambiar prioridad
      const updatePriorityButton = screen.getByTestId('update-priority-task-1');
      await user.click(updatePriorityButton);

      await waitFor(() => {
        expect(screen.getByText('Priority: low')).toBeInTheDocument();
      });

      // Mover tarea a "Done"
      const moveToDoneButton = screen.getByTestId('move-to-done-task-1');
      await user.click(moveToDoneButton);

      await waitFor(() => {
        expect(screen.getByText('Status: done')).toBeInTheDocument();
      });

      // Eliminar tarea
      const deleteTaskButton = screen.getByTestId('delete-task-task-1');
      await user.click(deleteTaskButton);

      await waitFor(() => {
        expect(screen.queryByTestId('task-task-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad de búsqueda y filtros', () => {
    it('debe filtrar tareas por texto de búsqueda', async () => {
      const user = userEvent.setup();
      
      const SearchFilterTest = () => {
        const [searchText, setSearchText] = React.useState('');
        const [priorityFilter, setPriorityFilter] = React.useState('');
        const [statusFilter, setStatusFilter] = React.useState('');
        
        const tasks = [
          {
            id: 'task-1',
            title: 'Frontend Task',
            description: 'Build UI components',
            priority: 'high' as const,
            status: 'todo' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['frontend'],
            subtasks: [],
            assignees: [],
          },
          {
            id: 'task-2',
            title: 'Backend Task',
            description: 'Build API endpoints',
            priority: 'medium' as const,
            status: 'in-progress' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['backend'],
            subtasks: [],
            assignees: [],
          },
          {
            id: 'task-3',
            title: 'Database Task',
            description: 'Setup database',
            priority: 'low' as const,
            status: 'done' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['database'],
            subtasks: [],
            assignees: [],
          },
        ];

        const filteredTasks = tasks.filter(task => {
          const matchesSearch = !searchText || 
            task.title.toLowerCase().includes(searchText.toLowerCase()) ||
            task.description.toLowerCase().includes(searchText.toLowerCase());
          const matchesPriority = !priorityFilter || task.priority === priorityFilter;
          const matchesStatus = !statusFilter || task.status === statusFilter;
          
          return matchesSearch && matchesPriority && matchesStatus;
        });

        return (
          <div>
            <h1>Search and Filter Test</h1>
            <div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                data-testid="search-input"
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                data-testid="priority-filter"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-testid="status-filter"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div data-testid="filtered-tasks">
              {filteredTasks.map(task => (
                <div key={task.id} data-testid={`task-${task.id}`}>
                  <h3>{task.title}</h3>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(<SearchFilterTest />);

      // Verificar que se muestran todas las tareas inicialmente
      expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-task-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-task-3')).toBeInTheDocument();

      // Filtrar por texto de búsqueda
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'frontend');

      await waitFor(() => {
        expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
        expect(screen.queryByTestId('task-task-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('task-task-3')).not.toBeInTheDocument();
      });

      // Limpiar búsqueda y filtrar por prioridad
      await user.clear(searchInput);
      const priorityFilter = screen.getByTestId('priority-filter');
      await user.selectOptions(priorityFilter, 'high');

      await waitFor(() => {
        expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
        expect(screen.queryByTestId('task-task-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('task-task-3')).not.toBeInTheDocument();
      });

      // Limpiar filtros y filtrar por estado
      await user.clear(searchInput);
      await user.selectOptions(priorityFilter, '');
      const statusFilter = screen.getByTestId('status-filter');
      await user.selectOptions(statusFilter, 'done');

      await waitFor(() => {
        expect(screen.queryByTestId('task-task-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('task-task-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('task-task-3')).toBeInTheDocument();
      });
    });
  });

  describe('Gestión de estado global', () => {
    it('debe sincronizar el estado entre diferentes componentes', async () => {
      const user = userEvent.setup();
      
      const StateSyncTest = () => {
        const [tasks, setTasks] = React.useState([
          {
            id: 'task-1',
            title: 'Shared Task',
            description: 'This task is shared between components',
            priority: 'high' as const,
            status: 'todo' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['shared'],
            subtasks: [],
            assignees: [],
          },
        ]);

        const handleUpdateTask = (taskId: string, updates: any) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ));
        };

        return (
          <div>
            <h1>State Sync Test</h1>
            <div data-testid="component-a">
              <h2>Component A</h2>
              {tasks.map(task => (
                <div key={task.id}>
                  <h3>{task.title}</h3>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <button 
                    onClick={() => handleUpdateTask(task.id, { priority: 'low' })}
                    data-testid="update-priority-a"
                  >
                    Change Priority to Low
                  </button>
                </div>
              ))}
            </div>
            <div data-testid="component-b">
              <h2>Component B</h2>
              {tasks.map(task => (
                <div key={task.id}>
                  <h3>{task.title}</h3>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <button 
                    onClick={() => handleUpdateTask(task.id, { status: 'done' })}
                    data-testid="update-status-b"
                  >
                    Mark as Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(<StateSyncTest />);

      // Verificar que ambos componentes muestran el mismo estado inicial
      const componentA = screen.getByTestId('component-a');
      const componentB = screen.getByTestId('component-b');
      
      expect(componentA).toHaveTextContent('Priority: high');
      expect(componentB).toHaveTextContent('Priority: high');

      // Actualizar desde el componente A
      const updatePriorityButton = screen.getByTestId('update-priority-a');
      await user.click(updatePriorityButton);

      await waitFor(() => {
        expect(componentA).toHaveTextContent('Priority: low');
        expect(componentB).toHaveTextContent('Priority: low');
      });

      // Actualizar desde el componente B
      const updateStatusButton = screen.getByTestId('update-status-b');
      await user.click(updateStatusButton);

      await waitFor(() => {
        expect(componentA).toHaveTextContent('Status: done');
        expect(componentB).toHaveTextContent('Status: done');
      });
    });
  });
});
