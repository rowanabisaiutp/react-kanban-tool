import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockClearAllFilters = jest.fn();
jest.mock('../../../../hooks/useUnifiedFilters', () => ({
  useDashboardFilters: () => ({
    hasActiveFilters: false,
    clearAllFilters: mockClearAllFilters,
  }),
}));

jest.mock('../../DashboardFilters', () => {
  return function MockDashboardFilters({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="dashboard-filters">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

import DashboardFilterInterface from '../DashboardFilterInterface';

describe('DashboardFilterInterface Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component elements', () => {
    render(<DashboardFilterInterface />);
    
    expect(screen.getByRole('heading', { name: 'Filtros de Analíticas' })).toBeInTheDocument();
    expect(screen.getByText('Personaliza qué datos se muestran en los gráficos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtros de analíticas/i })).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('toggles filter panel', async () => {
    render(<DashboardFilterInterface />);
    
    const button = screen.getByRole('button', { name: /filtros de analíticas/i });
    
    expect(screen.queryByTestId('dashboard-filters')).not.toBeInTheDocument();
    
    fireEvent.click(button);
    // Esperar a que el componente lazy se cargue
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
    });
    
    fireEvent.click(button);
    expect(screen.queryByTestId('dashboard-filters')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DashboardFilterInterface className="test-class" />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('dashboard-filter-interface', 'test-class');
  });
});