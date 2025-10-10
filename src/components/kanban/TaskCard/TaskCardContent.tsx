import React from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { truncateText, getTagColor } from '../../../utils/helpers';
import type { Task } from '../../../types';

interface TaskCardContentProps {
  task: Task;
  dateInfo: any; // Tipo inferido de useDateUtils().getTaskDateInfo()
  onCommentsClick?: (e: React.MouseEvent) => void;
}

export const TaskCardContent: React.FC<TaskCardContentProps> = ({ task, dateInfo, onCommentsClick }) => {
  // Generar descripción accesible
  const getAccessibleDescription = () => {
    const parts = [];
    parts.push(`Prioridad: ${task.priority}`);
    if (task.assignee) parts.push(`Asignado a: ${task.assignee}`);
    if (task.dueDate) parts.push(`Vencimiento: ${dateInfo.due?.formatted || 'Sin fecha'}`);
    if (task.tags.length > 0) parts.push(`Etiquetas: ${task.tags.join(', ')}`);
    return parts.join('. ');
  };

  return (
    <>
      <div className="task-card__content">
        <h3 
          className="task-card__title"
          title={`${task.title}${dateInfo.updated?.relative ? ` - Actualizado: ${dateInfo.updated.relative}` : ''}`}
        >
          {truncateText(task.title, 50)}
        </h3>
        
        {/* Descripción accesible oculta para screen readers */}
        <div 
          id={`task-${task.id}-description`}
          className="sr-only"
          aria-live="polite"
        >
          {getAccessibleDescription()}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="task-card__tags">
            {task.tags.slice(0, 3).map((tag, index) => {
              const tagColor = getTagColor(tag);
              return (
                <span 
                  key={index} 
                  className="task-card__tag"
                  style={{ 
                    color: tagColor.text,
                    borderColor: tagColor.text
                  }}
                >
                  {tag}
                </span>
              );
            })}
            {task.tags.length > 3 && (
              <span className="task-card__tag task-card__tag--more">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Progreso de subtareas */}
        {task.subtasks.length > 0 && (
          <div className="task-card__subtasks-progress">
            <div className="task-card__subtasks-header">
              <span className="task-card__subtasks-label">
                ✓ {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtareas
              </span>
            </div>
            <div className="task-card__progress-bar">
              <div 
                className="task-card__progress-fill"
                style={{ 
                  width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="task-card__footer">
        <div className="task-card__footer-left">
          {dateInfo.due && (
            <span 
              className={`task-card__due-date ${
                dateInfo.due.timeDifference.days < 0 ? 'task-card__due-date--overdue' :
                dateInfo.due.timeDifference.days <= 3 ? 'task-card__due-date--due-soon' :
                'task-card__due-date--upcoming'
              }`}
              title={`Vence: ${dateInfo.due.formatted}`}
            >
              <Calendar size={12} />
              {dateInfo.due.relative}
            </span>
          )}

          {/* Icono de comentarios */}
          {(task.comments?.length || 0) > 0 && onCommentsClick && (
            <button 
              className="task-card__comments-count"
              title={`${task.comments?.length || 0} comentario(s)`}
              onClick={onCommentsClick}
            >
              <MessageCircle size={12} />
              {task.comments?.length || 0}
            </button>
          )}
        </div>
        
        <div className="task-card__footer-right">
          {/* Espacio vacío - botón de eliminar removido */}
        </div>
      </div>
    </>
  );
};

