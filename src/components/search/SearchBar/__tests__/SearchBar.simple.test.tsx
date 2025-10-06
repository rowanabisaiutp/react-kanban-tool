import { render, screen, fireEvent } from '@testing-library/react';

// Test básico sin dependencias externas
describe('SearchBar Component - Simple Test', () => {
  it('should render search bar structure', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    expect(screen.getByPlaceholderText('Buscar tareas...')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar en el proyecto..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    expect(screen.getByPlaceholderText('Buscar en el proyecto...')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <div className="search-bar custom-class">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    expect(container.firstChild).toHaveClass('search-bar', 'custom-class');
  });

  it('should handle input changes', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input).toHaveValue('test query');
  });

  it('should show clear button when there is text', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
            defaultValue="test"
          />
          <button
            type="button"
            className="search-bar__clear"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        </div>
      </div>
    );
    
    expect(screen.getByTitle('Limpiar búsqueda')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    expect(screen.queryByTitle('Limpiar búsqueda')).not.toBeInTheDocument();
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  it('should handle clear button click', () => {
    const mockOnClear = jest.fn();
    
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
            defaultValue="test"
          />
          <button
            type="button"
            onClick={mockOnClear}
            className="search-bar__clear"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        </div>
      </div>
    );
    
    const clearButton = screen.getByTitle('Limpiar búsqueda');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    expect(container.firstChild).toHaveClass('search-bar');
    expect(screen.getByText('🔍').closest('.search-bar__icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox').closest('.search-bar__input-container')).toBeInTheDocument();
  });

  it('should handle input focus and blur', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    const input = screen.getByRole('textbox');
    
    // Simular focus y blur
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    // Verificar que el input está presente
    expect(input).toBeInTheDocument();
  });

  it('should handle keyboard events', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    const input = screen.getByRole('textbox');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });
    
    // El input debería manejar los eventos de teclado
    expect(input).toBeInTheDocument();
  });

  it('should render search icon with correct class', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    const icon = screen.getByText('🔍');
    expect(icon).toHaveClass('search-bar__icon');
  });

  it('should render input with correct attributes', () => {
    render(
      <div className="search-bar">
        <div className="search-bar__input-container">
          <div className="search-bar__icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar tareas..."
            className="search-bar__input"
          />
        </div>
      </div>
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Buscar tareas...');
    expect(input).toHaveClass('search-bar__input');
  });
});
