import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    addBoard: jest.fn(),
    updateBoard: jest.fn()
  })
}));

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick }: any) {
    return <button onClick={onClick}>{children}</button>;
  };
});

jest.mock('../../../ui/Input', () => {
  return function MockInput({ value, onChange }: any) {
    return (
      <input 
        id="title"
        value={value || ''} 
        onChange={(e) => onChange && onChange(e.target.value)} 
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

describe('BoardForm Simple Tests', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form for new board', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Nuevo Tablero')).toBeInTheDocument();
    expect(screen.getByLabelText('Título del Tablero *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción *')).toBeInTheDocument();
    expect(screen.getByText('Crear Tablero')).toBeInTheDocument();
  });

  it('renders form for editing board', () => {
    render(<BoardForm board={mockBoard} onClose={mockOnClose} />);
    
    expect(screen.getByText('Editar Tablero')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Board')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Actualizar Tablero')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByLabelText('Título del Tablero *');
    fireEvent.change(titleInput, { target: { value: 'New Board' } });
    
    expect(titleInput).toHaveValue('New Board');
  });

  it('handles cancel button', () => {
    render(<BoardForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<BoardForm onClose={mockOnClose} />);
    expect(container.firstChild).toHaveClass('board-form');
  });
});