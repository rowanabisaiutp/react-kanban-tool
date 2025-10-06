import React from 'react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import './DeleteBoardModal.css';

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boardTitle: string;
}

const DeleteBoardModal: React.FC<DeleteBoardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  boardTitle
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Tablero"
      size="sm"
    >
      <div className="delete-board-modal">
        <div className="delete-board-modal__content">
          <div className="delete-board-modal__icon">
            🗑️
          </div>
          
          <div className="delete-board-modal__text">
            <h3 className="delete-board-modal__title">
              ¿Estás seguro de que quieres eliminar este tablero?
            </h3>
            
            <p className="delete-board-modal__description">
              El tablero <strong>"{boardTitle}"</strong> será eliminado permanentemente.
              Esta acción no se puede deshacer.
            </p>
            
            <div className="delete-board-modal__warning">
              <div className="delete-board-modal__warning-icon">
                ⚠️
              </div>
              <div className="delete-board-modal__warning-text">
                <strong>Advertencia:</strong> Todas las tareas, columnas y datos 
                asociados a este tablero también serán eliminados.
              </div>
            </div>
          </div>
        </div>
        
        <div className="delete-board-modal__actions">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleConfirm}
          >
            Eliminar Tablero
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBoardModal;
