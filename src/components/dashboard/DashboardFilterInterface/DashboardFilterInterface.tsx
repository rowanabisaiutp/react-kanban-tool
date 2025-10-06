import React, { useState } from 'react';
import { useDashboardFilters } from '../../../hooks/useUnifiedFilters';
import DashboardFilters from '../DashboardFilters';
import './DashboardFilterInterface.css';

interface DashboardFilterInterfaceProps {
  className?: string;
}

const DashboardFilterInterface: React.FC<DashboardFilterInterfaceProps> = ({ className = "" }) => {
  const { hasActiveFilters, clearAllFilters } = useDashboardFilters();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handleFilterToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleFilterClose = () => {
    setIsFilterPanelOpen(false);
  };

  return (
    <div className={`dashboard-filter-interface ${className}`}>
      <div className="dashboard-filter-interface__controls">
        <div className="dashboard-filter-interface__title">
          <h3>Filtros de Analíticas</h3>
          <p>Personaliza qué datos se muestran en los gráficos</p>
        </div>
        
        <div className="dashboard-filter-interface__actions">
          <button
            onClick={handleFilterToggle}
            className={`dashboard-filter-interface__filter-btn ${isFilterPanelOpen ? 'dashboard-filter-interface__filter-btn--active' : ''}`}
            title="Configurar filtros de analíticas"
          >
            <span className="dashboard-filter-interface__filter-icon">📊</span>
            Filtros de Analíticas
            {hasActiveFilters && (
              <span className="dashboard-filter-interface__filter-indicator">●</span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="dashboard-filter-interface__clear-btn"
              title="Limpiar todos los filtros"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      <DashboardFilters 
        isOpen={isFilterPanelOpen} 
        onClose={handleFilterClose} 
      />
    </div>
  );
};

export default DashboardFilterInterface;
