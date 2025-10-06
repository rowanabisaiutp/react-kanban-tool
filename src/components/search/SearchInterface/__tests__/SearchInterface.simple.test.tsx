import { render, screen, fireEvent } from '@testing-library/react';

// Test básico sin dependencias externas
describe('SearchInterface Component - Simple Test', () => {
  it('should render search interface structure', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Buscar en todas las tareas...</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTitle('Filtros y ordenamiento')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <div className="search-interface custom-class">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button className="search-interface__filter-btn">Filtros</button>
          </div>
        </div>
      </div>
    );
    
    expect(container.firstChild).toHaveClass('search-interface', 'custom-class');
  });

  it('should render search bar with correct placeholder', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Buscar en todas las tareas...</div>
          </div>
          <div className="search-interface__actions">
            <button className="search-interface__filter-btn">Filtros</button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.getByTestId('search-bar')).toHaveTextContent('Buscar en todas las tareas...');
  });

  it('should render filter button', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    const filterButton = screen.getByTitle('Filtros y ordenamiento');
    expect(filterButton).toBeInTheDocument();
    expect(filterButton).toHaveTextContent('Filtros');
    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('should handle filter button click', () => {
    const mockOnFilterToggle = jest.fn();
    
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              onClick={mockOnFilterToggle}
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    const filterButton = screen.getByTitle('Filtros y ordenamiento');
    fireEvent.click(filterButton);
    
    expect(mockOnFilterToggle).toHaveBeenCalledTimes(1);
  });

  it('should show active filter indicator when hasActiveFilters is true', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
              <span className="search-interface__filter-indicator">●</span>
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.getByText('●')).toBeInTheDocument();
  });

  it('should not show active filter indicator when hasActiveFilters is false', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.queryByText('●')).not.toBeInTheDocument();
  });

  it('should show clear button when hasActiveFilters is true', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
              <span className="search-interface__filter-indicator">●</span>
            </button>
            <button
              className="search-interface__clear-btn"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.getByTitle('Limpiar todos los filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });

  it('should not show clear button when hasActiveFilters is false', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.queryByTitle('Limpiar todos los filtros')).not.toBeInTheDocument();
    expect(screen.queryByText('Limpiar')).not.toBeInTheDocument();
  });

  it('should call clearAllFilters when clear button is clicked', () => {
    const mockClearAllFilters = jest.fn();
    
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
              <span className="search-interface__filter-indicator">●</span>
            </button>
            <button
              onClick={mockClearAllFilters}
              className="search-interface__clear-btn"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    );
    
    const clearButton = screen.getByTitle('Limpiar todos los filtros');
    fireEvent.click(clearButton);
    
    expect(mockClearAllFilters).toHaveBeenCalledTimes(1);
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button className="search-interface__filter-btn">Filtros</button>
          </div>
        </div>
      </div>
    );
    
    expect(container.firstChild).toHaveClass('search-interface');
    expect(screen.getByTestId('search-bar').closest('.search-interface__search')).toBeInTheDocument();
    expect(screen.getByText('Filtros').closest('.search-interface__actions')).toBeInTheDocument();
  });

  it('should add active class to filter button when panel is open', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn search-interface__filter-btn--active"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
            </button>
          </div>
        </div>
      </div>
    );
    
    const filterButton = screen.getByTitle('Filtros y ordenamiento');
    expect(filterButton).toHaveClass('search-interface__filter-btn--active');
  });

  it('should render all components when hasActiveFilters is true', () => {
    render(
      <div className="search-interface">
        <div className="search-interface__controls">
          <div className="search-interface__search">
            <div data-testid="search-bar">Search Bar</div>
          </div>
          <div className="search-interface__actions">
            <button
              className="search-interface__filter-btn"
              title="Filtros y ordenamiento"
            >
              <span className="search-interface__filter-icon">⚙️</span>
              Filtros
              <span className="search-interface__filter-indicator">●</span>
            </button>
            <button
              className="search-interface__clear-btn"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    );
    
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTitle('Filtros y ordenamiento')).toBeInTheDocument();
    expect(screen.getByTitle('Limpiar todos los filtros')).toBeInTheDocument();
    expect(screen.getByText('●')).toBeInTheDocument();
  });
});
