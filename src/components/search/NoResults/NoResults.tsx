import React from 'react';
import './NoResults.css';

interface NoResultsProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="no-results">
      <div className="no-results__icon">🔍</div>
      <h3 className="no-results__title">
        {hasFilters ? 'No se encontraron tareas' : 'No hay tareas disponibles'}
      </h3>
      <p className="no-results__message">
        {hasFilters 
          ? 'Intenta ajustar tus filtros de búsqueda o limpiar todos los filtros para ver más resultados.'
          : 'Comienza agregando algunas tareas a tu tablero Kanban.'
        }
      </p>
      {hasFilters && (
        <button 
          onClick={onClearFilters}
          className="no-results__clear-btn"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );
};

export default NoResults;
