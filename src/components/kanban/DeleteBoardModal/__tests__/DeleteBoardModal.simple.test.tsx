import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';

import DeleteBoardModal from '../DeleteBoardModal';

// Wrapper con ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

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
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Tablero' })).toBeInTheDocument();
  });

  it('displays board title and warning message', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByText('"Test Board"')).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
  });

  it('handles cancel and confirm button clicks', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Tablero' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('does not render when closed', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Eliminar Tablero' })).not.toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    expect(container.querySelector('.delete-board-modal')).toBeInTheDocument();
  });
});