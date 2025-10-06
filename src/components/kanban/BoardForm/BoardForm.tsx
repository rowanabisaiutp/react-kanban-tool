import React, { useState, useEffect } from 'react';
import { useKanban } from '../../../hooks/useKanbanHook';
import type { Board } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import './BoardForm.css';

interface BoardFormProps {
  board?: Board | null;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
}

const BoardForm: React.FC<BoardFormProps> = ({ board, onClose }) => {
  const { addBoard, updateBoard } = useKanban();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!board;

  useEffect(() => {
    if (board) {
      setFormData({
        title: board.title,
        description: board.description
      });
    }
  }, [board]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const boardData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        columns: board?.columns || [
          {
            id: 'todo',
            title: 'Por Hacer',
            status: 'todo' as const,
            color: '#3b82f6',
            tasks: [],
            maxTasks: 10
          },
          {
            id: 'in-progress',
            title: 'En Progreso',
            status: 'in-progress' as const,
            color: '#f59e0b',
            tasks: [],
            maxTasks: 5
          },
          {
            id: 'done',
            title: 'Terminado',
            status: 'done' as const,
            color: '#22c55e',
            tasks: [],
            maxTasks: undefined
          }
        ]
      };

      if (isEditing && board) {
        updateBoard(board.id, boardData);
      } else {
        addBoard(boardData);
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar tablero:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="board-form">
      <div className="board-form__header">
        <h3 className="board-form__title">
          {isEditing ? 'Editar Tablero' : 'Nuevo Tablero'}
        </h3>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="board-form__form">
        <div className="board-form__field">
          <label htmlFor="title" className="board-form__label">
            Título del Tablero *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            placeholder="Ej: Proyecto Personal, Trabajo, etc."
            className={errors.title ? 'board-form__input--error' : ''}
            disabled={isSubmitting}
          />
          {errors.title && (
            <span className="board-form__error">{errors.title}</span>
          )}
        </div>

        <div className="board-form__field">
          <label htmlFor="description" className="board-form__label">
            Descripción *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe el propósito de este tablero..."
            className={`board-form__textarea ${errors.description ? 'board-form__textarea--error' : ''}`}
            disabled={isSubmitting}
            rows={3}
          />
          {errors.description && (
            <span className="board-form__error">{errors.description}</span>
          )}
        </div>

        <div className="board-form__actions">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
          >
            {isEditing ? 'Actualizar' : 'Crear'} Tablero
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;
