import React, { useState } from 'react';
import { useDashboardFilters } from '../../../hooks/useUnifiedFilters';
import { useKanban } from '../../../hooks/useKanbanHook';
import type { TaskPriority } from '../../../types';
import './DashboardFilters.css';

interface DashboardFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ isOpen, onClose }) => {
  const { 
    filters, 
    setBoardFilter, 
    setPriorityFilter, 
    addStatusFilter, 
    removeStatusFilter, 
    setDateRange, 
    setAssigneeFilter,
    setTimeRange,
    clearAllFilters,
    hasActiveFilters 
  } = useDashboardFilters();
  
  const { boards } = useKanban();
  const [tempDateRange, setTempDateRange] = useState({
    start: filters.dateRange.start,
    end: filters.dateRange.end,
  });

  // Obtener todos los asignados únicos
  const allAssignees = React.useMemo(() => {
    const assignees = new Set<string>();
    boards.forEach(board => {
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          if (task.assignee) assignees.add(task.assignee);
        });
      });
    });
    return Array.from(assignees).sort();
  }, [boards]);

  // Estados disponibles
  const availableStatuses = ['todo', 'in-progress', 'done'];

  // Rangos de tiempo predefinidos
  const timeRanges = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '1y', label: 'Último año' },
    { value: 'all', label: 'Todo el tiempo' },
  ] as const;

  const handleDateRangeApply = () => {
    setDateRange(tempDateRange.start, tempDateRange.end);
  };

  const handleDateRangeClear = () => {
    setTempDateRange({ start: null, end: null });
    setDateRange(null, null);
  };

  const handleTimeRangeChange = (timeRange: '7d' | '30d' | '90d' | '1y' | 'all') => {
    setTimeRange(timeRange);
    
    // Aplicar rango de tiempo automáticamente
    const now = new Date();
    let startDate: Date | null = null;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = null;
        break;
    }
    
    setDateRange(startDate, null);
  };

  if (!isOpen) return null;

  return (
    <div className="dashboard-filters-overlay" onClick={onClose}>
      <div className="dashboard-filters" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-filters__header">
          <h3>Filtros de Analíticas</h3>
          <button 
            className="dashboard-filters__close"
            onClick={onClose}
            title="Cerrar filtros"
          >
            ✕
          </button>
        </div>

        <div className="dashboard-filters__content">
          {/* Rango de tiempo predefinido */}
          <div className="filter-group">
            <label className="filter-group__label">Período de tiempo</label>
            <div className="time-range-buttons">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  className={`time-range-btn ${filters.timeRange === range.value ? 'time-range-btn--active' : ''}`}
                  onClick={() => handleTimeRangeChange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Tablero */}
          <div className="filter-group">
            <label className="filter-group__label">Tablero</label>
            <select
              value={filters.boardId || ''}
              onChange={(e) => setBoardFilter(e.target.value || null)}
              className="filter-group__select"
            >
              <option value="">Todos los tableros</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="filter-group">
            <label className="filter-group__label">Estado de tareas</label>
            <div className="filter-group__statuses">
              {availableStatuses.map(status => (
                <button
                  key={status}
                  className={`status-filter ${filters.status.includes(status) ? 'status-filter--active' : ''}`}
                  onClick={() => 
                    filters.status.includes(status) 
                      ? removeStatusFilter(status) 
                      : addStatusFilter(status)
                  }
                >
                  {status === 'todo' ? 'Por Hacer' : 
                   status === 'in-progress' ? 'En Progreso' : 
                   'Terminado'}
                  {filters.status.includes(status) && <span className="status-filter__remove">✕</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Prioridad */}
          <div className="filter-group">
            <label className="filter-group__label">Prioridad</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority || null)}
              className="filter-group__select"
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          {/* Filtro por Rango de Fechas personalizado */}
          <div className="filter-group">
            <label className="filter-group__label">Rango de fechas personalizado</label>
            <div className="filter-group__date-range">
              <div className="date-input-group">
                <label className="date-input-group__label">Desde:</label>
                <input
                  type="date"
                  value={tempDateRange.start ? tempDateRange.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => setTempDateRange(prev => ({ 
                    ...prev, 
                    start: e.target.value ? new Date(e.target.value) : null 
                  }))}
                  className="date-input-group__input"
                />
              </div>
              <div className="date-input-group">
                <label className="date-input-group__label">Hasta:</label>
                <input
                  type="date"
                  value={tempDateRange.end ? tempDateRange.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => setTempDateRange(prev => ({ 
                    ...prev, 
                    end: e.target.value ? new Date(e.target.value) : null 
                  }))}
                  className="date-input-group__input"
                />
              </div>
              <div className="date-range-actions">
                <button 
                  onClick={handleDateRangeApply}
                  className="date-range-actions__apply"
                >
                  Aplicar
                </button>
                <button 
                  onClick={handleDateRangeClear}
                  className="date-range-actions__clear"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Filtro por Asignado */}
          <div className="filter-group">
            <label className="filter-group__label">Asignado</label>
            <select
              value={filters.assignee || ''}
              onChange={(e) => setAssigneeFilter(e.target.value || null)}
              className="filter-group__select"
            >
              <option value="">Todos los asignados</option>
              {allAssignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dashboard-filters__footer">
          <button 
            onClick={clearAllFilters}
            className="dashboard-filters__clear-all"
            disabled={!hasActiveFilters}
          >
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
