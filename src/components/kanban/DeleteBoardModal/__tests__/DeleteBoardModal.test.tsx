import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

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

// Importar el componente después de los mocks
import DeleteBoardModal from '../DeleteBoardModal';

describe('DeleteBoardModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    boardTitle: 'Test Board'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open with title and board name', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Tablero' })).toBeInTheDocument();
    expect(screen.getByText('"Test Board"')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DeleteBoardModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Eliminar Tablero' })).not.toBeInTheDocument();
  });

  it('displays warning message and action buttons', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByText('¿Estás seguro de que quieres eliminar este tablero?')).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar Tablero' })).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles confirm button click and closes modal', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Tablero' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles different board titles', () => {
    const longTitle = 'This is a very long board title';
    render(<DeleteBoardModal {...defaultProps} boardTitle={longTitle} />);
    
    expect(screen.getByText(`"${longTitle}"`)).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<DeleteBoardModal {...defaultProps} />);
    expect(container.querySelector('.delete-board-modal')).toBeInTheDocument();
  });
});