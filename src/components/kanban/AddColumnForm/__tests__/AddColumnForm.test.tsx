import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockAddColumn = jest.fn();
jest.mock('../../../../store/kanbanStore', () => ({
  useKanban: () => ({ addColumn: mockAddColumn })
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

describe('AddColumnForm', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Agregar Nueva Columna')).toBeInTheDocument();
    expect(screen.getByText('Crear Columna')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Color de la columna')).toBeInTheDocument();
  });

  it('handles cancel button', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders color picker options', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    const colorButtons = screen.getAllByTitle(/\#[0-9a-f]{6}/);
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  it('applies correct CSS class', () => {
    const { container } = render(<AddColumnForm onClose={mockOnClose} />);
    expect(container.firstChild).toHaveClass('add-column-form');
  });

  it('handles color selection', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    const colorButtons = screen.getAllByTitle(/\#[0-9a-f]{6}/);
    if (colorButtons.length > 0) {
      fireEvent.click(colorButtons[0]);
      expect(colorButtons[0]).toHaveClass('add-column-form__color-option--selected');
    }
  });

  it('renders form structure', () => {
    render(<AddColumnForm onClose={mockOnClose} />);
    
    expect(screen.getByRole('heading', { name: 'Agregar Nueva Columna' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Revisión, Testing, etc.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sin límite')).toBeInTheDocument();
  });
});