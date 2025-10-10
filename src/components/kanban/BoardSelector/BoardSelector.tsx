import React, { useState } from 'react';
import { Archive } from 'lucide-react';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../../ui/Button';
import BoardForm from '../BoardForm';
import './BoardSelector.css';

interface BoardSelectorProps {
  className?: string;
  onDeleteBoard?: (boardId: string) => void;
  onShowArchived?: () => void;
  onClose?: () => void; // Para cerrar el drawer en mobile
}

const BoardSelector: React.FC<BoardSelectorProps> = ({ className = '', onDeleteBoard, onShowArchived, onClose }) => {
  const { boards, currentBoard, setCurrentBoard } = useKanbanStore();
  const { isDark, toggleTheme } = useTheme();
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<typeof currentBoard>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleBoardSelect = (board: typeof currentBoard) => {
    if (board) {
      setCurrentBoard(board);
      // Cerrar drawer en mobile después de seleccionar
      onClose?.();
    }
  };


  const handleDeleteBoard = (boardId: string) => {
    if (onDeleteBoard) {
      onDeleteBoard(boardId);
    }
  };

  const handleCreateBoard = () => {
    setEditingBoard(null);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowBoardForm(true);
    }, 200);
  };

  const handleEditBoard = (board: typeof currentBoard) => {
    setEditingBoard(board);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowBoardForm(true);
    }, 200);
  };

  const handleCloseForm = () => {
    setShowBoardForm(false);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
  };

  if (boards.length === 0) {
    return (
      <div className={`board-selector ${className}`}>
        <div className="board-selector__empty">
          <p>No hay tableros disponibles</p>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreateBoard}
          >
            + Crear Primer Tablero
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`board-selector ${className}`}>
      <div className="board-selector__header">
        <h3 className="board-selector__title">Tableros</h3>
        {/* Botón de cerrar para mobile */}
        {onClose && (
          <button 
            className="board-selector__close-button"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="board-selector__content">
        {/* Lista de tableros con transición */}
        <div className={`board-selector__list ${isTransitioning ? 'board-selector__list--hidden' : ''}`}>
          {/* Card para crear nuevo tablero - Primera posición */}
          <div className="board-selector__new-card board-selector__new-card--compact" onClick={handleCreateBoard}>
            <div className="board-selector__new-card-content">
              <div className="board-selector__new-card-icon">+</div>
              <div className="board-selector__new-card-text">
                <h4 className="board-selector__new-card-title">Crear Nuevo Tablero</h4>
              </div>
            </div>
          </div>

          {boards.map((board) => (
            <div
              key={board.id}
              className={`board-selector__item ${
                currentBoard?.id === board.id ? 'board-selector__item--active' : ''
              }`}
              onClick={() => handleBoardSelect(board)}
            >
              <div className="board-selector__item-content">
                <h4 className="board-selector__item-title">{board.title}</h4>
                <p className="board-selector__item-description">{board.description}</p>
                <div className="board-selector__item-meta">
                  <span className="board-selector__item-date">
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="board-selector__item-columns">
                    {board.columns.length} columnas
                  </span>
                </div>
              </div>
              
              <div className="board-selector__item-actions">
                <div
                  className="board-selector__action-btn"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEditBoard(board);
                  }}
                >
                  ✏️
                </div>
                <div
                  className="board-selector__action-btn"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                >
                  🗑️
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario con transición */}
        <div className={`board-selector__form ${showBoardForm ? 'board-selector__form--visible' : ''}`}>
          <div className="board-selector__form-header">
            <h3 className="board-selector__form-title">
              {editingBoard ? 'Editar Tablero' : 'Crear Nuevo Tablero'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseForm}
            >
              ✕
            </Button>
          </div>
          <div className="board-selector__form-content">
            <BoardForm
              board={editingBoard}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      </div>

      {/* Botones de tema y archivador en la parte inferior */}
      <div className="board-selector__theme-section">
        {/* Botón de archivador */}
        <div 
          className="board-selector__archive-button" 
          onClick={onShowArchived} 
          title="Ver tareas archivadas"
        >
          <Archive size={20} />
        </div>
        
        {/* Botón de tema */}
        <div className="board-selector__theme-toggle" onClick={toggleTheme} title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          <div className="board-selector__theme-toggle-track">
            <div className={`board-selector__theme-toggle-thumb ${isDark ? 'board-selector__theme-toggle-thumb--dark' : ''}`}>
              <span className="board-selector__theme-icon">
                {isDark ? '🌙' : '☀️'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BoardSelector;
