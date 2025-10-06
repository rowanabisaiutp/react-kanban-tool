import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Column as ColumnType, Task } from '../../../types';
import Column from '../Column';
import './DraggableColumn.css';

interface DraggableColumnProps {
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
  disabled?: boolean;
  children?: React.ReactNode;
  refreshTrigger?: number;
}

const DraggableColumn: React.FC<DraggableColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onMoveTask,
  onDuplicateTask,
  onArchiveTask,
  onReassignTask,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onEditColumn,
  onDeleteColumn,
  disabled = false,
  children,
  refreshTrigger
}) => {
  // ===== CONFIGURACIÓN DE DRAG & DROP PARA COLUMNAS =====
  // useSortable: Hook que convierte una columna en arrastrable
  const {
    attributes,      // Atributos HTML necesarios para la accesibilidad
    listeners,       // Event listeners para detectar el inicio del arrastre
    setNodeRef,      // Referencia al elemento DOM que se puede arrastrar
    transform,       // Transformación CSS aplicada durante el arrastre
    transition,      // Transición CSS para animaciones suaves
    isDragging,      // Estado que indica si el elemento está siendo arrastrado
  } = useSortable({
    id: column.id,   // ID único del elemento arrastrable
    disabled,        // Deshabilitar el arrastre si es necesario
    data: {          // Datos adicionales que se pasan durante el arrastre
      type: 'column', // Tipo de elemento para identificar en el handler
      column: column  // Objeto completo de la columna
    }
  });

  // ===== ESTILOS DINÁMICOS PARA EL ARRASTRE =====
  // Aplicar transformaciones y transiciones durante el arrastre de columnas
  const style = {
    transform: CSS.Transform.toString(transform),  // Aplicar transformación de posición
    transition,                                    // Aplicar transición suave
  };

  return (
    <div
      ref={setNodeRef}                    // Referencia al elemento arrastrable
      style={style}                       // Estilos dinámicos para el arrastre
      className={`draggable-column ${isDragging ? 'draggable-column--dragging' : ''}`}
      {...attributes}                     // Atributos de accesibilidad para el arrastre
    >
      {/* ===== CONTENIDO DE LA COLUMNA ARRASTRABLE ===== */}
      {/* Renderizar children personalizados o el componente Column por defecto */}
      {children || (
        <Column
          column={column}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onViewTask={onViewTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onDuplicateTask={onDuplicateTask}
          onArchiveTask={onArchiveTask}
          onReassignTask={onReassignTask}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
          dragHandleProps={listeners}     // Pasar los listeners para el área de arrastre
          refreshTrigger={refreshTrigger} // Pasar el refreshTrigger
        />
      )}
    </div>
  );
};

export default DraggableColumn;
  