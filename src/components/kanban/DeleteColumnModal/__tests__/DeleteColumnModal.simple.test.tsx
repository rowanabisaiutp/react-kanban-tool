import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Column } from '../../../../types';

// Mock específico para componentes UI
jest.mock('../../../../components/ui/Button/Button', () => {
  return ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
});

jest.mock('../../../../components/ui/Card/Card', () => {
  return ({ children, ...props }: any) => (
    <div {...props}>
      {children}
    </div>
  );
});

jest.mock('../../../../components/ui/index', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Card: ({ children, ...props }: any) => (
    <div {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    deleteColumn: jest.fn(),
    deleteColumnWithMove: jest.fn(),
    currentBoard: {
      id: 'board-1',
      columns: [
        { id: 'col-1', title: 'Todo', status: 'todo', color: '#3b82f6', tasks: [] },
        { id: 'col-2', title: 'In Progress', status: 'in-progress', color: '#f59e0b', tasks: [] }
      ]
    }
  })
}));

// Importar el componente después de los mocks
import DeleteColumnModal from '../DeleteColumnModal';

describe('DeleteColumnModal Simple Tests', () => {
  const mockOnClose = jest.fn();

  const emptyColumn: Column = {
    id: 'col-1',
    title: 'Todo',
    status: 'todo',
    color: '#3b82f6',
    tasks: []
  };

  const columnWithTasks: Column = {
    id: 'col-1',
    title: 'Todo',
    status: 'todo',
    color: '#3b82f6',
    tasks: [
      {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        assignee: 'John Doe',
        assignees: ['John Doe'],
        tags: ['frontend'],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        subtasks: [],
        comments: []
      }
    ]
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    column: emptyColumn
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Columna' })).toBeInTheDocument();
    expect(screen.getByText(/¿Eliminar/)).toBeInTheDocument();
  });

  it('shows warning message and action buttons', () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar Columna' })).toBeInTheDocument();
  });

  it('handles cancel and delete button clicks', () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Columna' }));
  });

  it('does not render when closed', () => {
    render(<DeleteColumnModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Eliminar Columna' })).not.toBeInTheDocument();
  });

  it('shows column selector for columns with tasks', () => {
    render(<DeleteColumnModal {...defaultProps} column={columnWithTasks} />);
    
    expect(screen.getByText(/Esta columna contiene/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<DeleteColumnModal {...defaultProps} />);
    expect(container.querySelector('.delete-column-modal')).toBeInTheDocument();
  });
});