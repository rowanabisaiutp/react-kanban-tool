import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockSetBoardFilter = jest.fn();
const mockSetPriorityFilter = jest.fn();
const mockAddStatusFilter = jest.fn();
const mockSetDateRange = jest.fn();
const mockSetAssigneeFilter = jest.fn();
const mockSetTimeRange = jest.fn();
const mockClearAllFilters = jest.fn();

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
    setBoardFilter: mockSetBoardFilter,
    setPriorityFilter: mockSetPriorityFilter,
    addStatusFilter: mockAddStatusFilter,
    removeStatusFilter: jest.fn(),
    setDateRange: mockSetDateRange,
    setAssigneeFilter: mockSetAssigneeFilter,
    setTimeRange: mockSetTimeRange,
    clearAllFilters: mockClearAllFilters,
    hasActiveFilters: false
  })
}));

jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    boards: [
      {
        id: '1',
        title: 'Board 1',
        columns: [{ id: 'col1', title: 'Todo', tasks: [{ id: 'task1', title: 'Task 1', assignee: 'John Doe', priority: 'high', createdAt: new Date(), updatedAt: new Date(), subtasks: [], comments: [] }] }]
      },
      {
        id: '2',
        title: 'Board 2',
        columns: [{ id: 'col2', title: 'In Progress', tasks: [{ id: 'task2', title: 'Task 2', assignee: 'Jane Smith', priority: 'medium', createdAt: new Date(), updatedAt: new Date(), subtasks: [], comments: [] }] }]
      }
    ]
  })
}));

import DashboardFilters from '../DashboardFilters';

describe('DashboardFilters', () => {
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

  it('renders all filter sections', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByText('Período de tiempo')).toBeInTheDocument();
    expect(screen.getByText('Tablero')).toBeInTheDocument();
    expect(screen.getByText('Estado de tareas')).toBeInTheDocument();
    expect(screen.getByText('Prioridad')).toBeInTheDocument();
    expect(screen.getByText('Rango de fechas personalizado')).toBeInTheDocument();
    expect(screen.getByText('Asignado')).toBeInTheDocument();
  });

  it('handles time range filter changes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByText('Últimos 7 días')).toBeInTheDocument();
    expect(screen.getByText('Últimos 30 días')).toBeInTheDocument();
    expect(screen.getByText('Últimos 90 días')).toBeInTheDocument();
    expect(screen.getByText('Último año')).toBeInTheDocument();
    expect(screen.getByText('Todo el tiempo')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Últimos 7 días'));
    expect(mockSetTimeRange).toHaveBeenCalledWith('7d');
    expect(mockSetDateRange).toHaveBeenCalled();
  });

  it('handles board filter changes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    const boardSelect = screen.getByDisplayValue('Todos los tableros');
    fireEvent.change(boardSelect, { target: { value: '1' } });
    
    expect(mockSetBoardFilter).toHaveBeenCalledWith('1');
    
    fireEvent.change(boardSelect, { target: { value: '' } });
    expect(mockSetBoardFilter).toHaveBeenCalledWith(null);
  });

  it('handles status filter changes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByText('Por Hacer')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Terminado')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Por Hacer'));
    expect(mockAddStatusFilter).toHaveBeenCalledWith('todo');
  });

  it('handles priority filter changes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    const prioritySelect = screen.getByDisplayValue('Todas las prioridades');
    expect(screen.getByText('Baja')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Urgente')).toBeInTheDocument();
    
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    expect(mockSetPriorityFilter).toHaveBeenCalledWith('high');
  });

  it('handles date range inputs and actions', () => {
    render(<DashboardFilters {...mockProps} />);
    
    const dateInputs = screen.getAllByDisplayValue('');
    expect(dateInputs).toHaveLength(2);
    expect(dateInputs[0]).toHaveAttribute('type', 'date');
    expect(dateInputs[1]).toHaveAttribute('type', 'date');
    
    fireEvent.click(screen.getByText('Aplicar'));
    expect(mockSetDateRange).toHaveBeenCalledWith(null, null);
    
    fireEvent.click(screen.getByText('Limpiar'));
    expect(mockSetDateRange).toHaveBeenCalledWith(null, null);
  });

  it('handles assignee filter changes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    const assigneeSelect = screen.getByDisplayValue('Todos los asignados');
    fireEvent.change(assigneeSelect, { target: { value: 'John Doe' } });
    
    expect(mockSetAssigneeFilter).toHaveBeenCalledWith('John Doe');
  });

  it('handles modal actions', () => {
    render(<DashboardFilters {...mockProps} />);
    
    fireEvent.click(screen.getByTitle('Cerrar filtros'));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    
    const overlay = document.querySelector('.dashboard-filters-overlay');
    fireEvent.click(overlay!);
    expect(mockProps.onClose).toHaveBeenCalledTimes(2);
    
    const modalContent = document.querySelector('.dashboard-filters');
    fireEvent.click(modalContent!);
    expect(mockProps.onClose).toHaveBeenCalledTimes(2);
    
    const clearButton = screen.getByText('Limpiar todos los filtros');
    expect(clearButton).toBeDisabled();
    fireEvent.click(clearButton);
    expect(clearButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<DashboardFilters {...mockProps} />);
    
    expect(screen.getByTitle('Cerrar filtros')).toBeInTheDocument();
    expect(screen.getByText('Desde:')).toBeInTheDocument();
    expect(screen.getByText('Hasta:')).toBeInTheDocument();
  });
});