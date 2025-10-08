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

describe('DeleteBoardModal Simple Tests', () => {
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

  it('renders modal when open', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Tablero' })).toBeInTheDocument();
  });

  it('displays board title and warning message', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByText('"Test Board"')).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
  });

  it('handles cancel and confirm button clicks', () => {
    render(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Tablero' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('does not render when closed', () => {
    render(<DeleteBoardModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Eliminar Tablero' })).not.toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<DeleteBoardModal {...defaultProps} />);
    expect(container.querySelector('.delete-board-modal')).toBeInTheDocument();
  });
});