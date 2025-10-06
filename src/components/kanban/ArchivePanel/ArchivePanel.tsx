import React, { useState, useEffect } from 'react';
import { X, Archive, Clock, User } from 'lucide-react';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { useDateUtils } from '../../../hooks/useDateUtils';
import './ArchivePanel.css';

interface ArchivePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({ isOpen, onClose }) => {
  const { currentBoard, restoreTask, deleteArchivedTask } = useKanbanStore();
  const { formatRelativeDate } = useDateUtils();
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);

  // Obtener tareas archivadas del store
  useEffect(() => {
    if (currentBoard) {
      const archived = currentBoard.columns
        .flatMap(column => column.tasks)
        .filter(task => task.archived === true);
      
      setArchivedTasks(archived);
    }
  }, [currentBoard]);

  // Función para restaurar una tarea
  const handleRestoreTask = (taskId: string) => {
    restoreTask(taskId);
    console.log('Tarea restaurada:', taskId);
  };

  // Función para eliminar permanentemente una tarea
  const handleDeletePermanently = (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar permanentemente esta tarea? Esta acción no se puede deshacer.')) {
      deleteArchivedTask(taskId);
      console.log('Tarea eliminada permanentemente:', taskId);
    }
  };

  return (
    <>
      {/* Overlay de fondo */}
      {isOpen && (
        <div 
          className="archive-panel__overlay"
          onClick={onClose}
        />
      )}

      {/* Panel lateral */}
      <div className={`archive-panel ${isOpen ? 'archive-panel--open' : ''}`}>
        {/* Header del panel */}
        <div className="archive-panel__header">
          <div className="archive-panel__title-section">
            <Archive size={20} className="archive-panel__title-icon" />
            <h2 className="archive-panel__title">Tareas Archivadas</h2>
          </div>
          <button 
            className="archive-panel__close-button"
            onClick={onClose}
            title="Cerrar panel de archivadas"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del panel */}
        <div className="archive-panel__content">
          {archivedTasks.length === 0 ? (
            <div className="archive-panel__empty">
              <Archive size={48} className="archive-panel__empty-icon" />
              <h3 className="archive-panel__empty-title">No hay tareas archivadas</h3>
              <p className="archive-panel__empty-description">
                Las tareas que archives aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="archive-panel__tasks">
              <div className="archive-panel__stats">
                <span className="archive-panel__count">
                  {archivedTasks.length} tarea{archivedTasks.length !== 1 ? 's' : ''} archivada{archivedTasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {archivedTasks.map((task) => (
                <div key={task.id} className="archive-panel__task">
                  <div className="archive-panel__task-header">
                    <h4 className="archive-panel__task-title">{task.title}</h4>
                    <div className="archive-panel__task-actions">
                      <button
                        className="archive-panel__action-btn archive-panel__action-btn--restore"
                        onClick={() => handleRestoreTask(task.id)}
                        title="Restaurar tarea"
                      >
                        Restaurar
                      </button>
                      <button
                        className="archive-panel__action-btn archive-panel__action-btn--delete"
                        onClick={() => handleDeletePermanently(task.id)}
                        title="Eliminar permanentemente"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="archive-panel__task-description">
                      {task.description}
                    </p>
                  )}

                  <div className="archive-panel__task-meta">
                    {task.assignee && (
                      <div className="archive-panel__task-assignee">
                        <User size={14} />
                        <span>{task.assignee}</span>
                      </div>
                    )}
                    
                    {task.archivedAt && (
                      <div className="archive-panel__task-date">
                        <Clock size={14} />
                        <span>Archivada {formatRelativeDate(task.archivedAt)}</span>
                      </div>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="archive-panel__task-tags">
                      {task.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="archive-panel__task-tag">
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="archive-panel__task-tag archive-panel__task-tag--more">
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArchivePanel;
