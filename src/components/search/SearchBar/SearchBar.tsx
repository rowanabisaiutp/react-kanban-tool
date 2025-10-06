import React, { useState, useEffect, useCallback } from 'react';
import { useKanbanFilters } from '../../../hooks/useUnifiedFilters';
import './SearchBar.css';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Buscar tareas...", 
  className = "" 
}) => {
  const { filters, setQuery } = useKanbanFilters();
  const [localQuery, setLocalQuery] = useState(filters.query);

  // Debounce para búsqueda en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(localQuery);
    }, 300); // 300ms de debounce

    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  // Sincronizar con el estado global cuando se limpian los filtros
  useEffect(() => {
    if (filters.query === '') {
      setLocalQuery('');
    }
  }, [filters.query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setQuery('');
  }, [setQuery]);

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-bar__input-container">
        <div className="search-bar__icon">
          🔍
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-bar__input"
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar__clear"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
