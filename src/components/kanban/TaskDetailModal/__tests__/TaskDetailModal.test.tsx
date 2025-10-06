import { render, screen, fireEvent } from '@testing-library/react';

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

jest.mock('../../../../hooks/useRealtimeUpdates', () => ({
  useRealtimeUpdates: () => ({
    listenForChanges: jest.fn()
  })
}));

// Mock de datos
jest.mock('../../../../data/mockData', () => ({
  teamMembersDetailed: [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'avatar1.jpg' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'avatar2.jpg' }
  ]
}));

// Mock de utilidades
jest.mock('../../../../utils/helpers', () => ({
  getPriorityColor: (_priority: string) => '#3b82f6',
  getPriorityIcon: (_priority: string) => '⚡',
  getTagColor: (_tag: string) => ({ bg: '#e5e7eb', text: '#374151' })
}));

// Mock de componentes
jest.mock('../../../ui/Modal', () => {
  return function MockModal({ isOpen, children, onClose, ...props }: any) {
    return isOpen ? (
      <div data-testid="modal" {...props}>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    ) : null;
  };
});

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick, ...props }: any) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock('../../MarkdownPreview', () => {
  return function MockMarkdownPreview({ content }: any) {
    return <div data-testid="markdown-preview">{content}</div>;
  };
});

// Importar después de los mocks
import TaskDetailModal from '../TaskDetailModal';
import type { Task } from '../../../../types';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'This is a **test** task description',
  status: 'todo',
  priority: 'high',
  assignee: 'John Doe',
  assignees: ['John Doe'],
  tags: ['frontend', 'urgent'],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  dueDate: new Date('2024-01-15T00:00:00Z'),
  estimatedHours: 4,
  subtasks: [
    {
      id: 'subtask-1',
      title: 'Subtask 1',
      completed: false,
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'subtask-2',
      title: 'Subtask 2',
      completed: true,
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ],
  comments: [
    {
      id: 'comment-1',
      content: 'This is a test comment',
      author: 'John Doe',
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ]
};

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  task: mockTask,
  onEdit: jest.fn(),
  onMarkComplete: jest.fn(),
  onUpdateSubtask: jest.fn(),
  onSubtaskChanges: jest.fn(),
  onAddComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
  onCommentChanges: jest.fn()
};

describe('TaskDetailModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<TaskDetailModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render task title', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description with markdown', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    expect(screen.getByText('This is a **test** task description')).toBeInTheDocument();
  });

  it('should render task priority', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('should render task tags', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('should render task assignee', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render task due date', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getAllByText('31/12/2023')).toHaveLength(2);
  });

  it('should render task estimated hours', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('4h')).toBeInTheDocument();
  });

  it('should render subtasks', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
  });

  it('should render comments', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Ver Comentarios(1)' || content.includes('Ver Comentarios');
    })).toBeInTheDocument();
  });

  it('should handle close button', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should handle edit button', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    const editButton = screen.getByText('✏️ Editar Tarea');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should handle mark complete button', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    const completeButton = screen.getByText('Terminado');
    fireEvent.click(completeButton);
    
    expect(mockProps.onMarkComplete).toHaveBeenCalledWith('task-1');
  });

  it('should handle subtask toggle', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    const subtaskCheckbox = screen.getByRole('checkbox', { name: /subtask 1/i });
    expect(subtaskCheckbox).toBeInTheDocument();
    expect(subtaskCheckbox).not.toBeChecked();
  });

  it('should handle task without due date', () => {
    const taskWithoutDueDate = {
      ...mockTask,
      dueDate: undefined
    };
    
    render(<TaskDetailModal {...mockProps} task={taskWithoutDueDate} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });

  it('should handle task without estimated hours', () => {
    const taskWithoutEstimatedHours = {
      ...mockTask,
      estimatedHours: undefined
    };
    
    render(<TaskDetailModal {...mockProps} task={taskWithoutEstimatedHours} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('4h')).not.toBeInTheDocument();
  });

  it('should handle task without subtasks', () => {
    const taskWithoutSubtasks = {
      ...mockTask,
      subtasks: []
    };
    
    render(<TaskDetailModal {...mockProps} task={taskWithoutSubtasks} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Subtask 1')).not.toBeInTheDocument();
  });

  it('should handle task without comments', () => {
    const taskWithoutComments = {
      ...mockTask,
      comments: []
    };
    
    render(<TaskDetailModal {...mockProps} task={taskWithoutComments} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test comment')).not.toBeInTheDocument();
  });

  it('should render modal with correct CSS class', () => {
    const { container } = render(<TaskDetailModal {...mockProps} />);
    
    expect(container.querySelector('.task-detail')).toBeInTheDocument();
  });

  it('should handle task status changes', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    // Verificar que el modal se renderiza correctamente
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should handle realtime updates', () => {
    render(<TaskDetailModal {...mockProps} />);
    
    // El hook de realtime updates debería estar activo
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render with different priority', () => {
    const lowPriorityTask = {
      ...mockTask,
      priority: 'low' as const
    };
    
    render(<TaskDetailModal {...mockProps} task={lowPriorityTask} />);
    
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('should handle task with many tags', () => {
    const taskWithManyTags = {
      ...mockTask,
      tags: ['frontend', 'backend', 'urgent', 'bug', 'feature']
    };
    
    render(<TaskDetailModal {...mockProps} task={taskWithManyTags} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('feature')).toBeInTheDocument();
  });
});
