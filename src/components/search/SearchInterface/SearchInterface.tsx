import React, { useState } from 'react';
import { useKanbanFilters } from '../../../hooks/useUnifiedFilters';
import SearchBar from '../SearchBar';
import FilterPanel from '../FilterPanel';
import './SearchInterface.css';

interface SearchInterfaceProps {
  className?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ className = "" }) => {
  const { hasActiveFilters, clearAllFilters } = useKanbanFilters();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handleFilterToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleFilterClose = () => {
    setIsFilterPanelOpen(false);
  };

  return (
    <div className={`search-interface ${className}`}>
      <div className="search-interface__controls">
        <div className="search-interface__search">
          <SearchBar placeholder="Buscar en todas las tareas..." />
        </div>
        
        <div className="search-interface__actions">
          <button
            onClick={handleFilterToggle}
            className={`search-interface__filter-btn ${isFilterPanelOpen ? 'search-interface__filter-btn--active' : ''}`}
            title="Filtros y ordenamiento"
          >
            <span className="search-interface__filter-icon">⚙️</span>
            Filtros
            {hasActiveFilters && (
              <span className="search-interface__filter-indicator">●</span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="search-interface__clear-btn"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <FilterPanel 
        isOpen={isFilterPanelOpen} 
        onClose={handleFilterClose} 
      />
    </div>
  );
};

export default SearchInterface;
