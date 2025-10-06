import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import type { Task } from '../../../types';
import TaskCard from '../TaskCard';
import './VirtualizedTaskList.css';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: string) => void;
  onDuplicate?: (task: Task) => void;
  onArchive?: (taskId: string) => void;
  height?: number;
  itemHeight?: number;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onMove,
  onDuplicate,
  onArchive,
  height = 400,
  itemHeight = 120
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular qué elementos deben ser renderizados
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      tasks.length - 1
    );
    return { startIndex: Math.max(0, startIndex - 2), endIndex };
  }, [scrollTop, containerHeight, itemHeight, tasks.length]);

  // Elementos visibles
  const visibleTasks = useMemo(() => {
    return tasks.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [tasks, visibleRange]);

  // Manejar scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Actualizar altura del contenedor
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Si hay menos de 50 tareas, no usar virtualización
  if (tasks.length < 50) {
    return (
      <div className="virtualized-task-list fallback">
        {tasks.map((task) => (
          <div key={task.id} className="virtualized-task-item">
            <TaskCard
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="virtualized-task-list">
      <div className="virtualized-task-list__header">
        <span className="virtualized-task-list__count">
          📊 {tasks.length} tareas (Virtualizadas para mejor rendimiento)
        </span>
        <span className="virtualized-task-list__range">
          Mostrando {visibleRange.startIndex + 1}-{visibleRange.endIndex + 1} de {tasks.length}
        </span>
      </div>
      
      <div
        ref={containerRef}
        className="virtualized-list"
        style={{ height: `${height}px` }}
        onScroll={handleScroll}
      >
        <div
          className="virtualized-list__spacer"
          style={{ height: `${tasks.length * itemHeight}px` }}
        >
          <div
            className="virtualized-list__content"
            style={{
              transform: `translateY(${visibleRange.startIndex * itemHeight}px)`,
            }}
          >
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="virtualized-task-item"
                style={{ height: `${itemHeight}px` }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMove={onMove}
                  onDuplicate={onDuplicate}
                  onArchive={onArchive}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VirtualizedTaskList, (prevProps, nextProps) => {
  // Solo re-renderizar si cambia el número de tareas o las props de callback
  return (
    prevProps.tasks.length === nextProps.tasks.length &&
    prevProps.tasks.every((task, index) => 
      task.id === nextProps.tasks[index]?.id &&
      task.title === nextProps.tasks[index]?.title &&
      task.status === nextProps.tasks[index]?.status
    ) &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onMove === nextProps.onMove &&
    prevProps.onDuplicate === nextProps.onDuplicate &&
    prevProps.onArchive === nextProps.onArchive
  );
});
