import { render, screen, fireEvent } from '@testing-library/react';
import VirtualizedTaskList from '../VirtualizedTaskList';
import type { Task } from '../../../../types';

// Mock de TaskCard
jest.mock('../../TaskCard', () => {
  return function MockTaskCard({ task, onEdit, onDelete, onMove, onDuplicate, onArchive }: any) {
    return (
      <div data-testid={`task-card-${task.id}`}>
        <h3>{task.title}</h3>
        <button onClick={() => onEdit?.(task)}>Edit</button>
        <button onClick={() => onDelete?.(task.id)}>Delete</button>
        <button onClick={() => onMove?.(task.id, 'done')}>Move</button>
        <button onClick={() => onDuplicate?.(task)}>Duplicate</button>
        <button onClick={() => onArchive?.(task.id)}>Archive</button>
      </div>
    );
  };
});

const createMockTask = (id: string, title: string): Task => ({
  id,
  title,
  description: `Description for ${title}`,
  status: 'todo',
  priority: 'medium',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
  comments: []
});

describe('VirtualizedTaskList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnMove = jest.fn();
  const mockOnDuplicate = jest.fn();
  const mockOnArchive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Non-virtualized mode (< 50 tasks)', () => {
    it('should render all tasks when less than 50 tasks', () => {
      const tasks = Array.from({ length: 10 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      render(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onDuplicate={mockOnDuplicate}
          onArchive={mockOnArchive}
        />
      );

      // Verificar que todas las tareas se renderizan
      tasks.forEach(task => {
        expect(screen.getByTestId(`task-card-${task.id}`)).toBeInTheDocument();
        expect(screen.getByText(task.title)).toBeInTheDocument();
      });

      // Verificar que usa la clase fallback
      const container = screen.getByText(tasks[0].title).closest('.virtualized-task-list');
      expect(container).toHaveClass('fallback');
    });

    it('should call callbacks in non-virtualized mode', () => {
      const tasks = [createMockTask('task-1', 'Task 1')];

      render(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onDuplicate={mockOnDuplicate}
          onArchive={mockOnArchive}
        />
      );

      // Probar callbacks
      fireEvent.click(screen.getByText('Edit'));
      expect(mockOnEdit).toHaveBeenCalledWith(tasks[0]);

      fireEvent.click(screen.getByText('Delete'));
      expect(mockOnDelete).toHaveBeenCalledWith('task-1');

      fireEvent.click(screen.getByText('Move'));
      expect(mockOnMove).toHaveBeenCalledWith('task-1', 'done');

      fireEvent.click(screen.getByText('Duplicate'));
      expect(mockOnDuplicate).toHaveBeenCalledWith(tasks[0]);

      fireEvent.click(screen.getByText('Archive'));
      expect(mockOnArchive).toHaveBeenCalledWith('task-1');
    });
  });

  describe('Virtualized mode (>= 50 tasks)', () => {
    it('should render with virtualization for 50+ tasks', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      render(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onMove={mockOnMove}
          onDuplicate={mockOnDuplicate}
          onArchive={mockOnArchive}
          height={400}
          itemHeight={120}
        />
      );

      // Verificar header con información de virtualización
      expect(screen.getByText(/100 tareas/)).toBeInTheDocument();
      expect(screen.getByText(/Virtualizadas para mejor rendimiento/)).toBeInTheDocument();
    });

    it('should show correct visible range in header', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      render(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
          height={400}
          itemHeight={120}
        />
      );

      // Verificar rango visible
      expect(screen.getByText(/Mostrando.*de 100/)).toBeInTheDocument();
    });

    it('should render only visible tasks in viewport', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      render(
        <VirtualizedTaskList
          tasks={tasks}
          height={400}
          itemHeight={120}
        />
      );

      // Solo algunas tareas deberían estar en el DOM (las visibles)
      const renderedTasks = screen.queryAllByTestId(/task-card-/);
      
      // Con height=400 y itemHeight=120, esperamos ~3-4 tareas visibles + buffer
      expect(renderedTasks.length).toBeLessThan(tasks.length);
      expect(renderedTasks.length).toBeGreaterThan(0);
    });

    it('should have correct container height', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      const { container } = render(
        <VirtualizedTaskList
          tasks={tasks}
          height={500}
          itemHeight={120}
        />
      );

      const scrollContainer = container.querySelector('.virtualized-list');
      expect(scrollContainer).toHaveStyle({ height: '500px' });
    });

    it('should have correct spacer height', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      const { container } = render(
        <VirtualizedTaskList
          tasks={tasks}
          height={400}
          itemHeight={120}
        />
      );

      // Spacer height = tasks.length * itemHeight = 100 * 120 = 12000px
      const spacer = container.querySelector('.virtualized-list__spacer');
      expect(spacer).toHaveStyle({ height: '12000px' });
    });

    it('should handle scroll events', () => {
      const tasks = Array.from({ length: 100 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      const { container } = render(
        <VirtualizedTaskList
          tasks={tasks}
          height={400}
          itemHeight={120}
        />
      );

      const scrollContainer = container.querySelector('.virtualized-list');
      expect(scrollContainer).toBeInTheDocument();

      // Simular scroll
      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 500 } });
      }

      // El componente debería actualizar el estado de scroll
      // (No podemos verificar el estado interno, pero no debería crashear)
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render with empty task list', () => {
      const { container } = render(
        <VirtualizedTaskList
          tasks={[]}
          onEdit={mockOnEdit}
        />
      );

      const taskCards = container.querySelectorAll('[data-testid^="task-card-"]');
      expect(taskCards.length).toBe(0);
    });

    it('should render exactly 50 tasks (boundary case)', () => {
      const tasks = Array.from({ length: 50 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      render(
        <VirtualizedTaskList
          tasks={tasks}
          height={400}
          itemHeight={120}
        />
      );

      // Con exactamente 50 tareas, debería usar virtualización
      expect(screen.getByText(/50 tareas/)).toBeInTheDocument();
      expect(screen.getByText(/Virtualizadas para mejor rendimiento/)).toBeInTheDocument();
    });

    it('should work without optional callbacks', () => {
      const tasks = [createMockTask('task-1', 'Task 1')];

      expect(() => {
        render(<VirtualizedTaskList tasks={tasks} />);
      }).not.toThrow();
    });

    it('should use default height and itemHeight', () => {
      const tasks = Array.from({ length: 50 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );

      const { container } = render(
        <VirtualizedTaskList tasks={tasks} />
      );

      const scrollContainer = container.querySelector('.virtualized-list');
      // Default height = 400px
      expect(scrollContainer).toHaveStyle({ height: '400px' });

      const spacer = container.querySelector('.virtualized-list__spacer');
      // Default itemHeight = 120, so 50 * 120 = 6000px
      expect(spacer).toHaveStyle({ height: '6000px' });
    });
  });

  describe('Performance optimizations', () => {
    it('should render with memo', () => {
      const tasks = [createMockTask('task-1', 'Task 1')];

      const { rerender } = render(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
        />
      );

      // Re-render con las mismas props
      rerender(
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={mockOnEdit}
        />
      );

      // El componente debería renderizar correctamente
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      const tasksSmall = [createMockTask('task-1', 'Task 1')];
      const { container: containerSmall } = render(
        <VirtualizedTaskList tasks={tasksSmall} />
      );

      expect(containerSmall.querySelector('.virtualized-task-list')).toBeInTheDocument();
      expect(containerSmall.querySelector('.virtualized-task-item')).toBeInTheDocument();

      const tasksLarge = Array.from({ length: 50 }, (_, i) => 
        createMockTask(`task-${i}`, `Task ${i}`)
      );
      const { container: containerLarge } = render(
        <VirtualizedTaskList tasks={tasksLarge} />
      );

      expect(containerLarge.querySelector('.virtualized-list')).toBeInTheDocument();
      expect(containerLarge.querySelector('.virtualized-list__spacer')).toBeInTheDocument();
      expect(containerLarge.querySelector('.virtualized-list__content')).toBeInTheDocument();
    });
  });
});
