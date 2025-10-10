import React, { useState, lazy, Suspense } from 'react';
import { useKanbanStore } from '../../store/useKanbanStore';
import { logger } from '../../utils/logger';
import { UnifiedFilterProvider, useKanbanFilters } from '../../hooks/useUnifiedFilters';
import { Board, BoardSelector, DeleteBoardModal, ArchivePanel } from '../../components/kanban';
import { SearchInterface } from '../../components/search';
import { UserAvatar } from '../../components/ui';
import { teamMembersDetailed } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import './KanbanPage.css';

// Lazy loading de AddColumnForm
const AddColumnForm = lazy(() => import('../../components/kanban/AddColumnForm'));

// Componente interno que usa los filtros de Kanban
const KanbanContent: React.FC = () => {
  const { boards, currentBoard, setCurrentBoard, deleteBoard } = useKanbanStore();
  const { filters } = useKanbanFilters();
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Si no hay tablero actual, usar el primero disponible
  React.useEffect(() => {
    if (!currentBoard && boards.length > 0) {
      setCurrentBoard(boards[0]);
    }
  }, [currentBoard, boards, setCurrentBoard]);

  // Cambiar el tablero cuando se selecciona desde los filtros
  React.useEffect(() => {
    if (filters.boardId) {
      const selectedBoard = boards.find(b => b.id === filters.boardId);
      if (selectedBoard && selectedBoard.id !== currentBoard?.id) {
        setCurrentBoard(selectedBoard);
      }
    }
  }, [filters.boardId, boards, currentBoard, setCurrentBoard]);

  // Función para manejar la eliminación de tablero
  const handleDeleteBoard = (boardId: string) => {
    setDeletingBoardId(boardId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingBoardId) {
      deleteBoard(deletingBoardId);
      setShowDeleteModal(false);
      setDeletingBoardId(null);
    }
  };

  // Función para mostrar/ocultar tareas archivadas
  const handleShowArchived = () => {
    setShowArchived(!showArchived);
    logger.debug('Mostrando tareas archivadas:', !showArchived);
  };


  if (!currentBoard) {
    return (
      <div className="kanban-page__loading">
        <div className="kanban-page__loading-content">
          <h2>Cargando tablero Kanban...</h2>
          <p>Preparando tu espacio de trabajo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-page">
      {/* Backdrop para cerrar el drawer en mobile */}
      {isSidebarOpen && (
        <div 
          className="kanban-page__drawer-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - drawer en mobile, sticky en desktop */}
      <div className={`kanban-page__sidebar ${isSidebarOpen ? 'kanban-page__sidebar--open' : ''}`}>
        <BoardSelector 
          onDeleteBoard={handleDeleteBoard} 
          onShowArchived={handleShowArchived}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      <div className="kanban-page__main">
        <div className="kanban-page__header">
          {/* Botón hamburguesa para mobile */}
          <button 
            className="kanban-page__menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Abrir menú de tableros"
          >
            <span className="kanban-page__menu-icon">☰</span>
          </button>

          <div className="kanban-page__title-section">
            <h1 className="kanban-page__title">Kanban Board</h1>
            <p className="kanban-page__subtitle">
              {currentBoard.title}
            </p>
          </div>
          
          <div className="kanban-page__search-section">
            <SearchInterface />
          </div>
          
          {/* Usuarios conectados */}
          <div className="kanban-page__connected-users">
            <div className="kanban-page__users-avatars">
              {teamMembersDetailed.slice(0, 3).map((user) => (
                <UserAvatar
                  key={user.name}
                  userName={user.name}
                  size="md"
                  className="kanban-page__user-avatar"
                />
              ))}
              {teamMembersDetailed.length > 3 && (
                <div className="kanban-page__users-count" title={`${teamMembersDetailed.length - 3} más`}>
                  +{teamMembersDetailed.length - 3}
                </div>
              )}
            </div>
          </div>
          
          <div className="kanban-page__actions">
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.href = '/dashboard'}
            >
              📊 Ver Dashboard
            </Button>
          </div>
        </div>
        
        <div className="kanban-page__content">
          <Board 
            board={currentBoard}
          />
        </div>
      </div>

      {/* Modal para agregar columna */}
      <Modal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        title="Agregar Nueva Columna"
      >
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Cargando formulario...</div>}>
          <AddColumnForm onClose={() => setShowAddColumn(false)} />
        </Suspense>
      </Modal>

      {/* Modal para confirmar eliminación de tablero */}
          <DeleteBoardModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            boardTitle={boards.find(b => b.id === deletingBoardId)?.title || ''}
          />

          {/* Panel de tareas archivadas */}
          <ArchivePanel
            isOpen={showArchived}
            onClose={() => setShowArchived(false)}
          />
    </div>
  );
};

const KanbanPage: React.FC = () => {
  const { boards } = useKanbanStore();

  return (
    <UnifiedFilterProvider boards={boards}>
      <KanbanContent />
    </UnifiedFilterProvider>
  );
};

export default KanbanPage;
