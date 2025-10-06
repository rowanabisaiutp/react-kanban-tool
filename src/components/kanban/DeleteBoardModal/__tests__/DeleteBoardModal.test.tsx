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
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Eliminar Tablero' })).toBeInTheDocument();
    expect(screen.getByText('"Test Board"')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Eliminar Tablero' })).not.toBeInTheDocument();
  });

  it('displays warning message and action buttons', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    expect(screen.getByText('¿Estás seguro de que quieres eliminar este tablero?')).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar Tablero' })).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles confirm button click and closes modal', () => {
    renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Tablero' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles different board titles', () => {
    const longTitle = 'This is a very long board title';
    renderWithTheme(<DeleteBoardModal {...defaultProps} boardTitle={longTitle} />);
    
    expect(screen.getByText(`"${longTitle}"`)).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = renderWithTheme(<DeleteBoardModal {...defaultProps} />);
    expect(container.querySelector('.delete-board-modal')).toBeInTheDocument();
  });
});