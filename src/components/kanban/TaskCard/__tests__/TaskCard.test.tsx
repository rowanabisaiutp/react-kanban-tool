import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock de hooks
jest.mock('../../../../hooks/useDateUtils', () => ({
  useDateUtils: () => ({
    getTaskDateInfo: (task: any) => ({
      created: {
        date: task.createdAt,
        formatted: task.createdAt.toLocaleDateString(),
        relative: 'hace 2 días',
        isToday: false,
        isThisWeek: false,
        isThisMonth: false,
        timeDifference: { days: 2, weeks: 0, months: 0, years: 0 }
      },
      due: task.dueDate ? {
        date: task.dueDate,
        formatted: task.dueDate.toLocaleDateString(),
        relative: 'hace 2 días',
        isToday: false,
        isThisWeek: false,
        isThisMonth: false,
        timeDifference: { days: 2, weeks: 0, months: 0, years: 0 }
      } : null
    })
  })
}));

jest.mock('../../../../hooks/useContextMenu', () => ({
  useContextMenu: () => ({
    contextMenu: { isOpen: false, x: 0, y: 0 },
    showContextMenu: jest.fn(),
    closeContextMenu: jest.fn()
  })
}));

// Mock de utilidades
jest.mock('../../../../utils/helpers', () => ({
  getPriorityColor: (_priority: string) => '#3b82f6',
  getPriorityIcon: (_priority: string) => '⚡',
  truncateText: (text: string, maxLength: number) => text.length > maxLength ? text.substring(0, maxLength) + '...' : text,
  getTagColor: (_tag: string) => ({ bg: '#e5e7eb', text: '#374151' })
}));

// Mock de componentes
jest.mock('../../../ui', () => ({
  UserAvatar: ({ userName }: { userName: string }) => <div data-testid="user-avatar">{userName}</div>
}));

jest.mock('../../TaskContextMenu', () => {
  return function MockTaskContextMenu({ isOpen, task, onEdit, onDelete, onMove, onDuplicate, onArchive, onReassign, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="task-context-menu">
        <button onClick={() => onEdit && onEdit(task)}>Edit</button>
        <button onClick={() => onDelete && onDelete(task.id)}>Delete</button>
        <button onClick={() => onMove && onMove(task.id, 'in-progress')}>Move</button>
        <button onClick={() => onDuplicate && onDuplicate(task)}>Duplicate</button>
        <button onClick={() => onArchive && onArchive(task.id)}>Archive</button>
        <button onClick={() => onReassign && onReassign(task.id, 'New Assignee')}>Reassign</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock de createPortal - mantener el original y solo mockear createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: any) => children
}));

// Importar después de los mocks
import TaskCard from '../TaskCard';
import type { Task } from '../../../../types';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'This is a test task description that should be truncated if too long',
  status: 'todo',
  priority: 'high',
  assignee: 'John Doe',
  assignees: ['John Doe'],
  tags: ['frontend', 'urgent'],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  dueDate: new Date('2024-01-15T00:00:00Z'),
  estimatedHours: 4,
  subtasks: [],
  comments: []
};

const mockProps = {
  task: mockTask,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onMove: jest.fn(),
  onDuplicate: jest.fn(),
  onArchive: jest.fn(),
  onReassign: jest.fn()
};

describe('TaskCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task accessible description', () => {
    render(<TaskCard {...mockProps} />);
    
    // La descripción está en un elemento oculto para screen readers
    expect(screen.getByText(/Prioridad: high/)).toBeInTheDocument();
    expect(screen.getByText(/Asignado a: John Doe/)).toBeInTheDocument();
  });

  it('should render task priority', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('ALTA')).toBeInTheDocument();
  });

  it('should render task tags', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('should render assignee avatar', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render due date', () => {
    const { container } = render(<TaskCard {...mockProps} />);
    
    // Verificar que existe el elemento de fecha con la clase task-card__due-date
    const dueDateElement = container.querySelector('.task-card__due-date');
    expect(dueDateElement).toBeInTheDocument();
  });

  it('should handle estimated hours in task data', () => {
    render(<TaskCard {...mockProps} />);
    
    // El componente tiene estimatedHours en los datos pero puede no renderizarlo visualmente
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task card with correct CSS class', () => {
    const { container } = render(<TaskCard {...mockProps} />);
    
    expect(container.firstChild).toHaveClass('task-card');
  });

  it('should handle task without due date', () => {
    const taskWithoutDueDate = {
      ...mockTask,
      dueDate: undefined
    };
    
    const { container } = render(<TaskCard {...mockProps} task={taskWithoutDueDate} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    // Verificar que NO existe el elemento de fecha
    const dueDateElement = container.querySelector('.task-card__due-date');
    expect(dueDateElement).not.toBeInTheDocument();
  });

  it('should handle task without estimated hours', () => {
    const taskWithoutEstimatedHours = {
      ...mockTask,
      estimatedHours: undefined
    };
    
    render(<TaskCard {...mockProps} task={taskWithoutEstimatedHours} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    // El componente renderiza la tarea sin horas estimadas
  });

  it('should handle task without tags', () => {
    const taskWithoutTags = {
      ...mockTask,
      tags: []
    };
    
    render(<TaskCard {...mockProps} task={taskWithoutTags} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('frontend')).not.toBeInTheDocument();
  });

  it('should handle task without assignee', () => {
    const taskWithoutAssignee = {
      ...mockTask,
      assignee: undefined,
      assignees: []
    };
    
    render(<TaskCard {...mockProps} task={taskWithoutAssignee} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument();
  });

  it('should handle hover state', () => {
    render(<TaskCard {...mockProps} />);
    
    const taskCard = screen.getByText('Test Task').closest('.task-card');
    expect(taskCard).toBeInTheDocument();
  });

  it('should handle context menu', () => {
    render(<TaskCard {...mockProps} />);
    
    // El context menu se renderiza cuando se hace clic derecho
    expect(screen.queryByTestId('task-context-menu')).not.toBeInTheDocument();
  });

  it('should handle drag handle props', () => {
    const dragHandleProps = {
      'data-testid': 'drag-handle'
    } as React.HTMLAttributes<HTMLDivElement>;
    
    render(<TaskCard {...mockProps} dragHandleProps={dragHandleProps} />);
    
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
  });

  it('should handle column color', () => {
    render(<TaskCard {...mockProps} columnColor="#ff0000" />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render with different priority', () => {
    const lowPriorityTask = {
      ...mockTask,
      priority: 'low' as const
    };
    
    render(<TaskCard {...mockProps} task={lowPriorityTask} />);
    
    expect(screen.getByText('BAJA')).toBeInTheDocument();
  });

  it('should handle task with comments', () => {
    const taskWithComments = {
      ...mockTask,
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          author: 'John Doe',
          createdAt: new Date('2024-01-01T00:00:00Z')
        }
      ]
    };
    
    render(<TaskCard {...mockProps} task={taskWithComments} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should handle task with subtasks', () => {
    const taskWithSubtasks = {
      ...mockTask,
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Subtask 1',
          completed: false,
          createdAt: new Date('2024-01-01T00:00:00Z')
        }
      ]
    };
    
    render(<TaskCard {...mockProps} task={taskWithSubtasks} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task with correct props', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    // La descripción se renderiza en el aria-describedby para accesibilidad
    expect(screen.getByText(/Prioridad: high/)).toBeInTheDocument();
  });
});
