import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockClearAllFilters = jest.fn();
const mockUseDashboardFilters = jest.fn();

jest.mock('../../../../hooks/useUnifiedFilters', () => ({
  useDashboardFilters: () => mockUseDashboardFilters(),
}));

jest.mock('../../DashboardFilters', () => {
  return function MockDashboardFilters({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="dashboard-filters">
        <button data-testid="close-btn" onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

import DashboardFilterInterface from '../DashboardFilterInterface';

describe('DashboardFilterInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDashboardFilters.mockReturnValue({
      hasActiveFilters: false,
      clearAllFilters: mockClearAllFilters,
    });
  });

  it('renders title, description and toggle button', () => {
    render(<DashboardFilterInterface />);
    
    expect(screen.getByRole('heading', { name: 'Filtros de Analíticas' })).toBeInTheDocument();
    expect(screen.getByText('Personaliza qué datos se muestran en los gráficos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtros de analíticas/i })).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DashboardFilterInterface className="test-class" />);
    expect(container.firstChild).toHaveClass('dashboard-filter-interface', 'test-class');
  });

  it('shows/hides filter indicator based on active filters', () => {
    const { rerender } = render(<DashboardFilterInterface />);
    
    expect(screen.queryByText('●')).not.toBeInTheDocument();
    
    mockUseDashboardFilters.mockReturnValue({
      hasActiveFilters: true,
      clearAllFilters: mockClearAllFilters,
    });
    rerender(<DashboardFilterInterface />);
    
    expect(screen.getByText('●')).toBeInTheDocument();
  });

  it('shows/hides clear button based on active filters', () => {
    const { rerender } = render(<DashboardFilterInterface />);
    
    expect(screen.queryByText('Limpiar Filtros')).not.toBeInTheDocument();
    
    mockUseDashboardFilters.mockReturnValue({
      hasActiveFilters: true,
      clearAllFilters: mockClearAllFilters,
    });
    rerender(<DashboardFilterInterface />);
    
    expect(screen.getByText('Limpiar Filtros')).toBeInTheDocument();
  });

  it('toggles filter panel on button click', () => {
    render(<DashboardFilterInterface />);
    const toggleBtn = screen.getByRole('button', { name: /filtros de analíticas/i });
    
    expect(screen.queryByTestId('dashboard-filters')).not.toBeInTheDocument();
    
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
    expect(toggleBtn).toHaveClass('dashboard-filter-interface__filter-btn--active');
    
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId('dashboard-filters')).not.toBeInTheDocument();
  });

  it('closes panel via close button', () => {
    render(<DashboardFilterInterface />);
    const toggleBtn = screen.getByRole('button', { name: /filtros de analíticas/i });
    
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(screen.queryByTestId('dashboard-filters')).not.toBeInTheDocument();
  });

  it('calls clearAllFilters when clear button is clicked', () => {
    mockUseDashboardFilters.mockReturnValue({
      hasActiveFilters: true,
      clearAllFilters: mockClearAllFilters,
    });

    render(<DashboardFilterInterface />);
    fireEvent.click(screen.getByText('Limpiar Filtros'));
    
    expect(mockClearAllFilters).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    mockUseDashboardFilters.mockReturnValue({
      hasActiveFilters: true,
      clearAllFilters: mockClearAllFilters,
    });

    render(<DashboardFilterInterface />);
    
    expect(screen.getByTitle('Configurar filtros de analíticas')).toBeInTheDocument();
    expect(screen.getByTitle('Limpiar todos los filtros')).toBeInTheDocument();
  });

  it('handles multiple rapid clicks', () => {
    render(<DashboardFilterInterface />);
    const toggleBtn = screen.getByRole('button', { name: /filtros de analíticas/i });
    
    fireEvent.click(toggleBtn);
    fireEvent.click(toggleBtn);
    fireEvent.click(toggleBtn);
    
    expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
  });
});