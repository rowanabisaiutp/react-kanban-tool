import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mocks
const mockDeleteColumn = jest.fn();
const mockDeleteColumnWithMove = jest.fn();

jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    deleteColumn: mockDeleteColumn,
    deleteColumnWithMove: mockDeleteColumnWithMove,
    currentBoard: {
      id: 'board-1',
      title: 'Test Board',
      columns: [
        { id: 'col-1', title: 'Todo', status: 'todo', color: '#3b82f6', tasks: [] },
        { id: 'col-2', title: 'In Progress', status: 'in-progress', color: '#f59e0b', tasks: [] }
      ]
    }
  })
}));

// Importar el componente después de los mocks
import DeleteColumnModal from '../DeleteColumnModal';

describe('DeleteColumnModal', () => {
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

  it('renders modal with title and warning message', () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Columna' })).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
    expect(screen.getByText(/¿Eliminar/)).toBeInTheDocument();
  });

  it('does not render when closed or column is null', () => {
    const { rerender } = render(<DeleteColumnModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('heading', { name: 'Eliminar Columna' })).not.toBeInTheDocument();

    rerender(<DeleteColumnModal {...defaultProps} column={null} />);
    expect(screen.queryByRole('heading', { name: 'Eliminar Columna' })).not.toBeInTheDocument();
  });

  it('shows empty column info and handles delete', async () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    expect(screen.getByText(/Esta columna está vacía/)).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Columna' }));
    await waitFor(() => {
      expect(mockDeleteColumn).toHaveBeenCalledWith('col-1');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('shows tasks info and column selector for columns with tasks', () => {
    render(<DeleteColumnModal {...defaultProps} column={columnWithTasks} />);
    
    expect(screen.getByText(/Esta columna contiene/)).toBeInTheDocument();
    expect(screen.getByText(/¿A qué columna quieres mover las tareas?/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    render(<DeleteColumnModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables delete button when tasks exist but no destination selected', () => {
    render(<DeleteColumnModal {...defaultProps} column={columnWithTasks} />);
    
    const deleteButton = screen.getByRole('button', { name: 'Eliminar Columna' });
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button when destination column is selected', () => {
    render(<DeleteColumnModal {...defaultProps} column={columnWithTasks} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'col-2' } });
    const deleteButton = screen.getByRole('button', { name: 'Eliminar Columna' });
    expect(deleteButton).not.toBeDisabled();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<DeleteColumnModal {...defaultProps} />);
    expect(container.querySelector('.delete-column-modal')).toBeInTheDocument();
  });
});