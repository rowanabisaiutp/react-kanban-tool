import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Column } from '../../../types';
import { useKanban } from '../../../hooks/useKanbanHook';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import './DeleteColumnModal.css';

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: Column | null;
}

const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({
  isOpen,
  onClose,
  column
}) => {
  const { deleteColumn, deleteColumnWithMove, currentBoard } = useKanban();
  const [selectedMoveToColumn, setSelectedMoveToColumn] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!column || !currentBoard) return null;

  const otherColumns = currentBoard.columns.filter(col => col.id !== column.id);
  const hasTasks = column.tasks.length > 0;

  const handleDelete = async () => {
    if (hasTasks && !selectedMoveToColumn) {
      return; // No se puede eliminar sin seleccionar destino
    }

    setIsDeleting(true);

    try {
      if (hasTasks) {
        await deleteColumnWithMove(column.id, selectedMoveToColumn);
      } else {
        await deleteColumn(column.id);
      }
      onClose();
    } catch (error) {
      // Error al eliminar columna
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setSelectedMoveToColumn('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Eliminar Columna"
      size="md"
    >
      <Card className="delete-column-modal" padding="lg">
        <div className="delete-column-modal__content">
          <div className="delete-column-modal__warning">
            <div className="delete-column-modal__icon">
              <AlertTriangle size={48} />
            </div>
            <h3 className="delete-column-modal__title">
              ¿Eliminar "{column.title}"?
            </h3>
            <p className="delete-column-modal__description">
              Esta acción no se puede deshacer.
            </p>
          </div>

          {hasTasks && (
            <div className="delete-column-modal__tasks-info">
              <p className="delete-column-modal__tasks-count">
                Esta columna contiene <strong>{column.tasks.length}</strong> tarea{column.tasks.length !== 1 ? 's' : ''}.
              </p>
              <p className="delete-column-modal__tasks-question">
                ¿A qué columna quieres mover las tareas?
              </p>
              
              <div className="delete-column-modal__column-selector">
                <select
                  value={selectedMoveToColumn}
                  onChange={(e) => setSelectedMoveToColumn(e.target.value)}
                  className="delete-column-modal__select"
                  required
                >
                  <option value="">Selecciona una columna</option>
                  {otherColumns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title} ({col.tasks.length} tareas)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!hasTasks && (
            <div className="delete-column-modal__empty-info">
              <p className="delete-column-modal__empty-text">
                Esta columna está vacía y se puede eliminar de forma segura.
              </p>
            </div>
          )}

          <div className="delete-column-modal__actions">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDelete}
              disabled={isDeleting || (hasTasks && !selectedMoveToColumn)}
              loading={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Columna'}
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default DeleteColumnModal;
