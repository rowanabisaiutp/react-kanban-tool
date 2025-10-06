import React, { useState } from 'react';
import type { Subtask } from '../../../types';
import { generateId } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import './SubtasksList.css';

interface SubtasksListProps {
  subtasks: Subtask[];
  onUpdateSubtasks: (subtasks: Subtask[]) => void;
  isEditable?: boolean;
}

const SubtasksList: React.FC<SubtasksListProps> = ({
  subtasks,
  onUpdateSubtasks,
  isEditable = true
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    onUpdateSubtasks(updatedSubtasks);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: generateId(),
        title: newSubtaskTitle.trim(),
        completed: false,
        createdAt: new Date()
      };
      onUpdateSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
      setIsAdding(false);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter(subtask => subtask.id !== subtaskId);
    onUpdateSubtasks(updatedSubtasks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSubtaskTitle('');
    }
  };

  const completedCount = subtasks.filter(subtask => subtask.completed).length;
  const totalCount = subtasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="subtasks-list">
      {subtasks.length > 0 && (
        <div className="subtasks-list__header">
          <div className="subtasks-list__progress">
            <div className="subtasks-list__progress-bar">
              <div 
                className="subtasks-list__progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="subtasks-list__progress-text">
              {completedCount}/{totalCount} completadas
            </span>
          </div>
        </div>
      )}

      <div className="subtasks-list__items">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="subtasks-list__item">
            <label className="subtasks-list__checkbox-label">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask.id)}
                className="subtasks-list__checkbox"
                disabled={!isEditable}
              />
              <span className={`subtasks-list__text ${subtask.completed ? 'subtasks-list__text--completed' : ''}`}>
                {subtask.title}
              </span>
            </label>
            
            {isEditable && (
              <button
                type="button"
                className="subtasks-list__delete"
                onClick={() => handleDeleteSubtask(subtask.id)}
                title="Eliminar subtarea"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditable && (
        <div className="subtasks-list__add">
          {isAdding ? (
            <div className="subtasks-list__add-form">
              <div onKeyPress={handleKeyPress}>
                <Input
                  placeholder="Nueva subtarea..."
                  value={newSubtaskTitle}
                  onChange={setNewSubtaskTitle}
                />
              </div>
              <div className="subtasks-list__add-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubtaskTitle('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSubtask}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              + Agregar subtarea
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubtasksList;
