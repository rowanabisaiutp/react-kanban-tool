import React, { useState, memo, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../../../types';
import { useKanbanStore } from '../../../store/useKanbanStore';
import DraggableTask from '../DraggableTask';
import VirtualizedTaskList from '../VirtualizedTaskList';
import Card from '../../ui/Card';
import EditableColumnTitle from '../EditableColumnTitle';
import './Column.css';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onViewTask?: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: string) => void;
  onDuplicateTask: (task: Task) => void;
  onArchiveTask: (taskId: string) => void;
  onReassignTask?: (taskId: string, assignee: string | undefined) => void;
  onAddComment?: (taskId: string, content: string, author: string) => void;
  onUpdateComment?: (taskId: string, commentId: string, content: string) => void;
  onDeleteComment?: (taskId: string, commentId: string) => void;
  onEditColumn?: (column: ColumnType) => void;
  onDeleteColumn?: (column: ColumnType) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  refreshTrigger?: number;
}

const Column: React.FC<ColumnProps> = memo(({
  column,
  onAddTask,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onMoveTask,
  onDuplicateTask,
  onArchiveTask,
  // onReassignTask, // No se usa actualmente
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onEditColumn,
  onDeleteColumn,
  dragHandleProps,
  refreshTrigger
}) => {
  const { updateColumn } = useKanbanStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // Usar la columna que se pasa como prop (que ya viene filtrada desde Board)
  const currentColumn = column;

  const handleAddTask = () => {
    onAddTask?.(currentColumn.id);
  };

  const handleEditColumn = () => {
    onEditColumn?.(currentColumn);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn?.(currentColumn);
  };

  const handleTitleSave = (newTitle: string) => {
    updateColumn(currentColumn.id, { title: newTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  };

  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
  };


  // Memoizar cálculos costosos usando currentColumn
  const taskCount = useMemo(() => currentColumn.tasks.length, [currentColumn.tasks.length]);
  const maxTasks = useMemo(() => currentColumn.maxTasks || Infinity, [currentColumn.maxTasks]);
  const isOverLimit = useMemo(() => taskCount > maxTasks, [taskCount, maxTasks]);
  
  // ===== CONFIGURACIÓN DE DRAG & DROP PARA TAREAS =====
  // Memoizar los IDs de las tareas para el SortableContext
  // Esto es necesario para que dnd-kit pueda rastrear las tareas individuales
  const taskIds = useMemo(() => currentColumn.tasks.map(task => task.id), [currentColumn.tasks]);

  return (
    <div
      className="column"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="column__header" padding="sm">
        <div className="column__header-wrapper">
          <div className="column__title-section">
            <div
              className="column__color-indicator"
              style={{ backgroundColor: currentColumn.color }}
            />
            <div className="column__title-info">
              <EditableColumnTitle
                title={currentColumn.title}
                onSave={handleTitleSave}
                onCancel={handleTitleCancel}
                isEditing={isEditingTitle}
                onStartEdit={handleStartEditTitle}
              />
              <div className="column__meta">
                <span className="column__task-count">
                  {taskCount}
                  {currentColumn.maxTasks && `/${currentColumn.maxTasks}`}
                </span>
                {isOverLimit && (
                  <span className="column__over-limit">⚠️</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="column__header-controls">
            {/* ===== MANIJA DE ARRASTRE PARA COLUMNAS ===== */}
            {dragHandleProps && (
              <div className="column__drag-handle" {...dragHandleProps}>
                <span className="column__drag-icon">⋮⋮</span>
              </div>
            )}
            
            {isHovered && (
              <div className="column__actions">
                <button
                  className="column__action column__action--edit"
                  onClick={handleEditColumn}
                  title="Editar columna"
                >
                  ✏️
                </button>
                <button
                  className="column__action column__action--delete"
                  onClick={handleDeleteColumn}
                  title="Eliminar columna"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="column__content">
        <div className="column__tasks">
          {/* ===== CONTEXTO DE ARRASTRE PARA TAREAS ===== */}
          {/* SortableContext: Define que las tareas dentro de esta columna pueden ser reordenadas */}
          <SortableContext
            items={taskIds}                           // IDs de las tareas que pueden ser reordenadas
            strategy={verticalListSortingStrategy}    // Estrategia de ordenamiento vertical
          >
            {/* Renderizar tareas con virtualización si hay 50+ tareas */}
            {currentColumn.tasks.length >= 50 ? (
              <VirtualizedTaskList
                tasks={currentColumn.tasks}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
                onDuplicate={onDuplicateTask}
                onArchive={onArchiveTask}
                height={400}
                itemHeight={120}
              />
            ) : (
              /* Renderizar todas las tareas como elementos arrastrables */
              currentColumn.tasks.map((task) => (
                <DraggableTask
                  key={`${task.id}-${refreshTrigger || 0}`}
                  task={task}
                  columnColor={currentColumn.color}
                  onEdit={onEditTask}
                  onView={onViewTask}
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                  onDuplicate={onDuplicateTask}
                  onArchive={onArchiveTask}
                  // onReassign={onReassignTask} // Prop no existe en DraggableTaskProps
                  onAddComment={onAddComment}
                  onUpdateComment={onUpdateComment}
                  onDeleteComment={onDeleteComment}
                />
              ))
            )}
          </SortableContext>
          
          {currentColumn.tasks.length === 0 && (
            <div className="column__empty">
              <p className="column__empty-text">
                No hay tareas en esta columna
              </p>
            </div>
          )}
        </div>

        <div className="column__add-task-card" onClick={handleAddTask}>
          <div className="column__add-task-content">
            <div className="column__add-task-icon">+</div>
            <div className="column__add-task-text">Agregar tarea</div>
          </div>
        </div>
      </div>

    </div>
  );
});

// Memoizar Column con comparación personalizada para optimización
export default memo(Column, (prevProps, nextProps) => {
  // Comparar column y tasks para evitar re-renders innecesarios
  return (
    prevProps.column.id === nextProps.column.id &&
    prevProps.column.title === nextProps.column.title &&
    prevProps.column.color === nextProps.column.color &&
    prevProps.column.tasks.length === nextProps.column.tasks.length &&
    prevProps.refreshTrigger === nextProps.refreshTrigger &&
    prevProps.column.tasks.every((task, index) => {
      const prevTask = task;
      const nextTask = nextProps.column.tasks[index];
      return (
        prevTask.id === nextTask?.id &&
        prevTask.title === nextTask?.title &&
        prevTask.status === nextTask?.status &&
        prevTask.assignee === nextTask?.assignee &&
        (prevTask.comments?.length || 0) === (nextTask?.comments?.length || 0) &&
        prevTask.updatedAt?.getTime() === nextTask?.updatedAt?.getTime() &&
        JSON.stringify(prevTask.assignees) === JSON.stringify(nextTask?.assignees) &&
        JSON.stringify(prevTask.subtasks) === JSON.stringify(nextTask?.subtasks)
      );
    })
  );
});
