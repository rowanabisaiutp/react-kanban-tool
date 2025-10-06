import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../../hooks/useUnifiedFilters', () => ({
  useDashboardFilters: () => ({
    filters: {
      boardId: null,
      priority: null,
      status: [],
      dateRange: { start: null, end: null },
      assignee: null,
      timeRange: '30d'
    },
    setBoardFilter: jest.fn(),
    setPriorityFilter: jest.fn(),
    addStatusFilter: jest.fn(),
    removeStatusFilter: jest.fn(),
    setDateRange: jest.fn(),
    setAssigneeFilter: jest.fn(),
    setTimeRange: jest.fn(),
    clearAllFilters: jest.fn(),
    hasActiveFilters: false
  })
}));

jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    boards: [{
      id: '1',
      title: 'Board 1',
      columns: [{
        id: 'col1',
        title: 'Todo',
        tasks: [{
          id: 'task1',
          title: 'Task 1',
          assignee: 'John Doe',
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date(),
          subtasks: [],
          comments: []
        }]
      }]
    }]
  })
}));

import DashboardFilters from '../DashboardFilters';

describe('DashboardFilters Simple Tests', () => {
  const mockProps = { isOpen: true, onClose: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open, not when closed', () => {
    const { rerender } = render(<DashboardFilters {...mockProps} />);
    expect(screen.getByText('Filtros de Analíticas')).toBeInTheDocument();
    
    rerender(<DashboardFilters {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Filtros de Analíticas')).not.toBeInTheDocument();
  });

  it('renders filter sections', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByText('Período de tiempo')).toBeInTheDocument();
    expect(screen.getByText('Tablero')).toBeInTheDocument();
    expect(screen.getByText('Prioridad')).toBeInTheDocument();
    expect(screen.getByText('Estado de tareas')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByText('Limpiar todos los filtros')).toBeInTheDocument();
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DashboardFilters {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Cerrar filtros'));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});