import React from 'react';
import { GripVertical } from 'lucide-react';
import { UserAvatar } from '../../ui';
import { getPriorityColor } from '../../../utils/helpers';
import type { Task } from '../../../types';

interface TaskCardHeaderProps {
  task: Task;
  columnColor?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  task,
  dragHandleProps
}) => {
  return (
    <div className="task-card__header">
      <div className="task-card__header-left">
        {/* Drag Handle */}
        <div 
          className="task-card__drag-handle" 
          {...dragHandleProps}
          title="Arrastra para mover la tarea"
        >
          <GripVertical size={16} className="task-card__drag-icon" />
        </div>
        <div className="task-card__priority">
          <span
            className="task-card__priority-text"
            style={{ 
              color: getPriorityColor(task.priority),
              borderColor: getPriorityColor(task.priority)
            }}
          >
            {task.priority === 'lowest' && 'MUY BAJA'}
            {task.priority === 'low' && 'BAJA'}
            {task.priority === 'medium' && 'MEDIA'}
            {task.priority === 'high' && 'ALTA'}
            {task.priority === 'urgent' && 'URGENTE'}
          </span>
        </div>
      </div>
      
      <div className="task-card__header-center">
        {/* Espacio vacío - acciones movidas a la derecha */}
      </div>
      
      <div className="task-card__header-right">
        {/* Avatares en el header */}
        {((task.assignees && task.assignees.length > 0) || task.assignee) && (
          <div className="task-card__assignees-compact">
            {(task.assignees || (task.assignee ? [task.assignee] : [])).slice(0, 3).map((assignee) => (
              <UserAvatar
                key={assignee}
                userName={assignee}
                size="sm"
                className="task-card__assignee-item-compact"
              />
            ))}
            {(task.assignees?.length || 0) > 3 && (
              <div className="task-card__assignees-count-compact" title={`${(task.assignees?.length || 0) - 3} más`}>
                +{(task.assignees?.length || 0) - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

