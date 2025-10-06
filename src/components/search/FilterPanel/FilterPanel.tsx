import React, { useState, useMemo } from 'react';
import { useKanbanFilters } from '../../../hooks/useUnifiedFilters';
import { useKanban } from '../../../hooks/useKanbanHook';
import type { TaskPriority } from '../../../types';
import { teamMembers, teamMembersDetailed } from '../../../data/mockData';
import { getAllWorkloads } from '../../../utils/helpers';
import './FilterPanel.css';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { 
    filters, 
    setBoardFilter, 
    setPriorityFilter, 
    addTagFilter, 
    removeTagFilter, 
    setDateRange, 
    setAssigneeFilter,
    setSort,
    clearAllFilters,
    hasActiveFilters 
  } = useKanbanFilters();
  
  const { boards } = useKanban();
  const [tempDateRange, setTempDateRange] = useState({
    start: filters.dateRange.start,
    end: filters.dateRange.end,
  });

  // Obtener todas las etiquetas únicas de todas las tareas
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    boards.forEach(board => {
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          task.tags.forEach(tag => tags.add(tag));
        });
      });
    });
    return Array.from(tags).sort();
  }, [boards]);

  // Obtener todos los asignados únicos
  const allAssignees = React.useMemo(() => {
    const assignees = new Set<string>();
    boards.forEach(board => {
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          if (task.assignee) assignees.add(task.assignee);
          task.assignees?.forEach(a => assignees.add(a));
        });
      });
    });
    return Array.from(assignees).sort();
  }, [boards]);

  // Obtener todas las tareas para calcular carga de trabajo
  const allTasks = useMemo(() => {
    const tasks: any[] = [];
    boards.forEach(board => {
      board.columns.forEach(column => {
        tasks.push(...column.tasks);
      });
    });
    return tasks;
  }, [boards]);

  // Calcular carga de trabajo de cada usuario
  const workloads = useMemo(() => 
    getAllWorkloads(allTasks, teamMembers),
    [allTasks]
  );

  const handleDateRangeApply = () => {
    setDateRange(tempDateRange.start, tempDateRange.end);
  };

  const handleDateRangeClear = () => {
    setTempDateRange({ start: null, end: null });
    setDateRange(null, null);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-panel-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="filter-panel__header">
          <h3>
            <span>🔍</span>
            Filtros y Ordenamiento
          </h3>
          <button 
            className="filter-panel__close"
            onClick={onClose}
            title="Cerrar filtros"
          >
            ✕
          </button>
        </div>

        <div className="filter-panel__content">
          {/* Filtro por Tablero */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>📋</span>
              Tablero
            </label>
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

          {/* Filtro por Prioridad */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>⚡</span>
              Prioridad
            </label>
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

          {/* Filtro por Etiquetas */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>🏷️</span>
              Etiquetas
            </label>
            <div className="filter-group__tags">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-tag ${filters.tags.includes(tag) ? 'filter-tag--active' : ''}`}
                  onClick={() => 
                    filters.tags.includes(tag) 
                      ? removeTagFilter(tag) 
                      : addTagFilter(tag)
                  }
                >
                  {tag}
                  {filters.tags.includes(tag) && <span className="filter-tag__remove">✕</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Rango de Fechas */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>📅</span>
              Fecha de Vencimiento
            </label>
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
            <label className="filter-group__label">
              <span>👤</span>
              Asignado
            </label>
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

          {/* Ordenamiento */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>🔄</span>
              Ordenar por
            </label>
            <div className="sort-controls">
              <select
                value={filters.sortBy}
                onChange={(e) => setSort(e.target.value as 'createdAt' | 'dueDate' | 'priority' | 'title', filters.sortOrder)}
                className="filter-group__select"
              >
                <option value="createdAt">Fecha de creación</option>
                <option value="dueDate">Fecha de vencimiento</option>
                <option value="priority">Prioridad</option>
                <option value="title">Título</option>
              </select>
              <button
                onClick={() => setSort(filters.sortBy, filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="sort-controls__order"
                title={`Orden ${filters.sortOrder === 'asc' ? 'ascendente' : 'descendente'}`}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Carga de trabajo del equipo */}
          <div className="filter-group">
            <label className="filter-group__label">
              <span>📊</span>
              Carga de Trabajo del Equipo
            </label>
            <div className="workload-list">
              {workloads.map((workload) => {
                const userInfo = teamMembersDetailed.find(u => u.name === workload.username);
                const statusColor = userInfo?.status === 'available' ? '#22c55e' : 
                                   userInfo?.status === 'busy' ? '#f59e0b' : '#6b7280';
                
                return (
                  <div key={workload.username} className="workload-item">
                    <div className="workload-item__user">
                      <div className="workload-item__avatar" style={{ position: 'relative' }}>
                        {workload.username.charAt(0)}
                        <span 
                          className="workload-item__status" 
                          style={{ backgroundColor: statusColor }}
                          title={userInfo?.status === 'available' ? 'Disponible' : 
                                 userInfo?.status === 'busy' ? 'Ocupado' : 'Ausente'}
                        />
                      </div>
                      <span className="workload-item__name">{workload.username}</span>
                    </div>
                    <div className="workload-item__count">{workload.total}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="filter-panel__footer">
          <button 
            onClick={clearAllFilters}
            className="filter-panel__clear-all"
            disabled={!hasActiveFilters}
          >
            <span>🗑️</span>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
