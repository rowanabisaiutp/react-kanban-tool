import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockAddBoard = jest.fn();
const mockUpdateBoard = jest.fn();

jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    addBoard: mockAddBoard,
    updateBoard: mockUpdateBoard
  })
}));

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick, disabled }: any) {
    return <button onClick={onClick} disabled={disabled}>{children}</button>;
  };
});

jest.mock('../../../ui/Input', () => {
  return function MockInput({ value, onChange, placeholder }: any) {
    return (
      <input 
        id="title"
        value={value || ''} 
        onChange={(e) => onChange && onChange(e.target.value)} 
        placeholder={placeholder} 
      />
    );
  };
});

import BoardForm from '../BoardForm';
import type { Board } from '../../../../types';

const mockBoard: Board = {
  id: 'board-1',
  title: 'Test Board',
  description: 'Test Description',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  columns: []
};

describe('BoardForm', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form for new board with correct title and fields', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Nuevo Tablero')).toBeInTheDocument();
    expect(screen.getByLabelText('Título del Tablero *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción *')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Crear Tablero')).toBeInTheDocument();
  });

  it('renders form for editing board with pre-filled data', () => {
    render(<BoardForm board={mockBoard} onClose={mockOnClose} />);
    
    expect(screen.getByText('Editar Tablero')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Board')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Actualizar Tablero')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByLabelText('Título del Tablero *');
    const descriptionInput = screen.getByLabelText('Descripción *');
    
    fireEvent.change(titleInput, { target: { value: 'New Board' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    expect(titleInput).toHaveValue('New Board');
    expect(descriptionInput).toHaveValue('New Description');
  });

  it('handles form submission for new board', async () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByLabelText('Título del Tablero *');
    const descriptionInput = screen.getByLabelText('Descripción *');
    const createButton = screen.getByText('Crear Tablero');
    
    fireEvent.change(titleInput, { target: { value: 'New Board' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockAddBoard).toHaveBeenCalledWith({
        title: 'New Board',
        description: 'New Description',
        columns: expect.any(Array)
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles form submission for editing board', async () => {
    render(<BoardForm board={mockBoard} onClose={mockOnClose} />);
    
    const updateButton = screen.getByText('Actualizar Tablero');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateBoard).toHaveBeenCalledWith('board-1', {
        title: 'Test Board',
        description: 'Test Description',
        columns: []
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles cancel button', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates required fields and shows errors', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Crear Tablero'));
    
    expect(screen.getByText('El título es requerido')).toBeInTheDocument();
    expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<BoardForm onClose={mockOnClose} />);
    expect(container.firstChild).toHaveClass('board-form');
  });

  it('handles board prop as null', () => {
    render(<BoardForm board={null} onClose={mockOnClose} />);
    expect(screen.getByText('Nuevo Tablero')).toBeInTheDocument();
  });
});