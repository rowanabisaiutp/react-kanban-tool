import { render, screen, fireEvent } from '@testing-library/react';

// Importar el componente
import NoResults from '../NoResults';

describe('NoResults Component', () => {
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no filters message', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('No hay tareas disponibles')).toBeInTheDocument();
    expect(screen.getByText('Comienza agregando algunas tareas a tu tablero Kanban.')).toBeInTheDocument();
  });

  it('should render with filters message when hasFilters is true', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('No se encontraron tareas')).toBeInTheDocument();
    expect(screen.getByText('Intenta ajustar tus filtros de búsqueda o limpiar todos los filtros para ver más resultados.')).toBeInTheDocument();
  });

  it('should render search icon', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('should render clear filters button when hasFilters is true', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('Limpiar todos los filtros')).toBeInTheDocument();
  });

  it('should not render clear filters button when hasFilters is false', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.queryByText('Limpiar todos los filtros')).not.toBeInTheDocument();
  });

  it('should call onClearFilters when clear button is clicked', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    const clearButton = screen.getByText('Limpiar todos los filtros');
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    expect(container.firstChild).toHaveClass('no-results');
    expect(screen.getByText('🔍').closest('.no-results__icon')).toBeInTheDocument();
    expect(screen.getByText('No hay tareas disponibles').closest('.no-results__title')).toBeInTheDocument();
    expect(screen.getByText('Comienza agregando algunas tareas a tu tablero Kanban.').closest('.no-results__message')).toBeInTheDocument();
  });

  it('should render clear button with correct CSS class when hasFilters is true', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    const clearButton = screen.getByText('Limpiar todos los filtros');
    expect(clearButton).toHaveClass('no-results__clear-btn');
  });

  it('should handle different hasFilters states correctly', () => {
    const { rerender } = render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    // Sin filtros
    expect(screen.getByText('No hay tareas disponibles')).toBeInTheDocument();
    expect(screen.queryByText('Limpiar todos los filtros')).not.toBeInTheDocument();
    
    // Con filtros
    rerender(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    expect(screen.getByText('No se encontraron tareas')).toBeInTheDocument();
    expect(screen.getByText('Limpiar todos los filtros')).toBeInTheDocument();
  });

  it('should render all elements when hasFilters is true', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('No se encontraron tareas')).toBeInTheDocument();
    expect(screen.getByText('Intenta ajustar tus filtros de búsqueda o limpiar todos los filtros para ver más resultados.')).toBeInTheDocument();
    expect(screen.getByText('Limpiar todos los filtros')).toBeInTheDocument();
  });

  it('should render minimal elements when hasFilters is false', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('No hay tareas disponibles')).toBeInTheDocument();
    expect(screen.getByText('Comienza agregando algunas tareas a tu tablero Kanban.')).toBeInTheDocument();
    expect(screen.queryByText('Limpiar todos los filtros')).not.toBeInTheDocument();
  });

  it('should handle multiple clear button clicks', () => {
    render(<NoResults hasFilters={true} onClearFilters={mockOnClearFilters} />);
    
    const clearButton = screen.getByText('Limpiar todos los filtros');
    
    fireEvent.click(clearButton);
    fireEvent.click(clearButton);
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalledTimes(3);
  });

  it('should render with proper heading structure', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    const title = screen.getByText('No hay tareas disponibles');
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('no-results__title');
  });

  it('should render with proper message structure', () => {
    render(<NoResults hasFilters={false} onClearFilters={mockOnClearFilters} />);
    
    const message = screen.getByText('Comienza agregando algunas tareas a tu tablero Kanban.');
    expect(message.tagName).toBe('P');
    expect(message).toHaveClass('no-results__message');
  });
});
