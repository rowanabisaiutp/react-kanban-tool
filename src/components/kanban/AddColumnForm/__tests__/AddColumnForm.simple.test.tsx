import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../../store/kanbanStore', () => ({
  useKanban: () => ({ addColumn: jest.fn() })
}));

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick }: any) {
    return <button onClick={onClick}>{children}</button>;
  };
});

jest.mock('../../../ui/Input', () => {
  return function MockInput({ value, onChange, placeholder }: any) {
    return <input value={value} onChange={onChange} placeholder={placeholder} />;
  };
});

import AddColumnForm from '../AddColumnForm';

describe('AddColumnForm Simple Tests', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Agregar Nueva Columna')).toBeInTheDocument();
    expect(screen.getByText('Crear Columna')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('handles cancel button', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders color picker', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Color de la columna')).toBeInTheDocument();
    const colorButtons = screen.getAllByTitle(/\#[0-9a-f]{6}/);
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  it('applies correct CSS class', () => {
    const { container } = render(<AddColumnForm onClose={mockOnClose} />);
    expect(container.firstChild).toHaveClass('add-column-form');
  });
});