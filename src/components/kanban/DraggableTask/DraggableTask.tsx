import React, { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../types';
import TaskCard from '../TaskCard';
import './DraggableTask.css';

interface DraggableTaskProps {
  task: Task;
  columnColor?: string;
  onEdit: (task: Task) => void;
  onView?: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, newStatus: string) => void;
  onDuplicate: (task: Task) => void;
  onArchive: (taskId: string) => void;
  onAddComment?: (taskId: string, content: string, author: string) => void;
  onUpdateComment?: (taskId: string, commentId: string, content: string) => void;
  onDeleteComment?: (taskId: string, commentId: string) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  columnColor,
  onEdit,
  onView,
  onDelete,
  onMove,
  onDuplicate,
  onArchive,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  // ===== CONFIGURACIÓN DE DRAG & DROP PARA TAREAS =====
  // useSortable: Hook que convierte un elemento en arrastrable
  const {
    attributes,      // Atributos HTML necesarios para la accesibilidad
    listeners,       // Event listeners para detectar el inicio del arrastre
    setNodeRef,      // Referencia al elemento DOM que se puede arrastrar
    transform,       // Transformación CSS aplicada durante el arrastre
    transition,      // Transición CSS para animaciones suaves
    isDragging,      // Estado que indica si el elemento está siendo arrastrado
  } = useSortable({
    id: task.id,     // ID único del elemento arrastrable
    data: {          // Datos adicionales que se pasan durante el arrastre
      type: 'task',  // Tipo de elemento para identificar en el handler
      task,          // Objeto completo de la tarea
    },
  });

  // ===== ESTILOS DINÁMICOS PARA EL ARRASTRE =====
  // Aplicar transformaciones y transiciones durante el arrastre
  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),  // Aplicar transformación de posición
    transition,                                    // Aplicar transición suave
    opacity: isDragging ? 0.5 : 1,               // Reducir opacidad cuando se arrastra
  }), [transform, transition, isDragging]);

  return (
    <div
      ref={setNodeRef}                    // Referencia al elemento arrastrable
      style={style}                       // Estilos dinámicos para el arrastre
      className={`draggable-task ${isDragging ? 'draggable-task--dragging' : ''}`}
      {...attributes}                     // Atributos de accesibilidad para el arrastre
    >
      {/* ===== COMPONENTE DE TAREA ARRASTRABLE ===== */}
      {/* TaskCard: Componente visual de la tarea con funcionalidad de arrastre */}
      <TaskCard
        task={task}
        columnColor={columnColor}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        onMove={onMove}
        onDuplicate={onDuplicate}
        onArchive={onArchive}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        dragHandleProps={listeners}       // Pasar los listeners para el área de arrastre
      />
    </div>
  );
};

export default memo(DraggableTask);
