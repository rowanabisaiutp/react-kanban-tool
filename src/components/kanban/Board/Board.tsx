import React, { useState, memo, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, rectIntersection, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { Board as BoardType, Task, TaskStatus } from '../../../types';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { useKanbanFilters } from '../../../hooks/useUnifiedFilters';
import { filterTasks, findColumnByTaskId } from '../../../utils/helpers';
import { useAutoSaveIndicator } from '../../../hooks/useKanbanAutoSave';
import { useRealtimeUpdates } from '../../../hooks/useRealtimeUpdates';
import { NoResults } from '../../search';
import DraggableColumn from '../DraggableColumn';
import Modal from '../../ui/Modal';
import './Board.css';

// Lazy loading de componentes pesados para mejor performance
const TaskForm = lazy(() => import('../TaskForm'));
const TaskDetailModal = lazy(() => import('../TaskDetailModal'));
const AddColumnForm = lazy(() => import('../AddColumnForm'));
const DeleteColumnModal = lazy(() => import('../DeleteColumnModal'));
const DataManager = lazy(() => import('../../ui/DataManager'));

// Componente de loading simple para los modales
const ModalLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '60px',
    minHeight: '200px' 
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p style={{ color: '#666' }}>Cargando...</p>
    </div>
  </div>
);

interface BoardProps {
  board: BoardType;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  const { deleteTask, moveTask, reorderColumns, reorderTasks, duplicateTask, archiveTask, updateTask, currentBoard, addComment, updateComment, deleteComment } = useKanbanStore();
  const { filters, hasActiveFilters, clearAllFilters } = useKanbanFilters();
  const { listenForChanges } = useRealtimeUpdates();
  const { showIndicator, isSaving, hasUnsavedChanges } = useAutoSaveIndicator();

  // Filtrar tareas del board actual basado en los filtros de búsqueda y excluir archivadas
  const filteredBoard = useMemo(() => {
    const boardData = currentBoard || board;
    
    // Primero excluir tareas archivadas de todas las columnas
    const columnsWithoutArchived = boardData.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => !task.archived)
    }));
    
    // Luego aplicar filtros de búsqueda si hay filtros activos
    if (!hasActiveFilters) {
      return { ...boardData, columns: columnsWithoutArchived };
    }
    
    const columns = columnsWithoutArchived.map(column => ({
      ...column,
      tasks: filterTasks(column.tasks, filters)
    }));

    return { ...boardData, columns };
  }, [currentBoard, board, filters, hasActiveFilters]);

  // Verificar si hay tareas después del filtrado
  const hasFilteredTasks = useMemo(() => {
    return filteredBoard.columns.some(column => column.tasks.length > 0);
  }, [filteredBoard.columns]);

  // Consolidar estados relacionados en objetos
  const [modalState, setModalState] = useState({
    showAddColumn: false,
    showAddTask: false,
    showEditTask: false,
    showTaskDetail: false,
    showEditColumn: false,
    showDeleteColumn: false,
    showDataManager: false
  });
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [viewingTaskId, setViewingTaskId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<BoardType['columns'][0] | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<BoardType['columns'][0] | null>(null);
  const [taskColumnId, setTaskColumnId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Escuchar eventos de actualización en tiempo real
  useEffect(() => {
    const cleanup = listenForChanges((event) => {
      if (event.detail.type === 'subtask-updated') {
        // Forzar re-renderización para mostrar cambios
        setRefreshTrigger(prev => prev + 1);
        
        // Si hay una tarea abierta en detalle, actualizarla
        if (viewingTaskId === event.detail.data.taskId) {
          setViewingTaskId(event.detail.data.taskId); // Forzar actualización
        }
      }
    });

    return cleanup;
  }, [listenForChanges, viewingTaskId]);

  // Obtener la tarea actualizada en tiempo real desde el board
  const currentViewingTask = useMemo(() => {
    if (!viewingTaskId) return null;
    // Usar currentBoard o board para obtener la tarea más actualizada
    const sourceBoard = currentBoard || board;
    const task = sourceBoard.columns.flatMap(c => c.tasks).find(t => t.id === viewingTaskId);
    return task || viewingTask;
  }, [viewingTaskId, currentBoard, board, viewingTask, refreshTrigger]);

  // ===== CONFIGURACIÓN DE DRAG & DROP (PointerSensor, KeyboardSensor)=====
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handlers optimizados y consolidados
  const handleAddTask = useCallback((columnId: string) => {
    const columns = currentBoard?.columns || board.columns;
    if (!columns.find(col => col.id === columnId)) return;
    setTaskColumnId(columnId);
    setModalState(prev => ({ ...prev, showAddTask: true }));
  }, [currentBoard?.columns, board.columns]);

  const handleViewTask = useCallback((task: Task) => {
    setViewingTask(task);
    setViewingTaskId(task.id);
    setModalState(prev => ({ ...prev, showTaskDetail: true }));
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setModalState(prev => ({ ...prev, showEditTask: true }));
  }, []);

  const handleMarkComplete = useCallback((taskId: string) => {
    moveTask(taskId, 'done' as TaskStatus, 0);
  }, [moveTask]);

  const handleUpdateSubtask = useCallback((taskId: string, subtaskId: string, completed: boolean) => {
    // Usar currentBoard o board en lugar de filteredBoard para evitar problemas de sincronización
    const sourceBoard = currentBoard || board;
    const task = sourceBoard.columns.flatMap(c => c.tasks).find(t => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map(s =>
        s.id === subtaskId ? { ...s, completed } : s
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
      // La tarea se actualiza automáticamente en tiempo real via useMemo
    }
  }, [currentBoard, board, updateTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(taskId);
    }
  }, [deleteTask]);

  const handleMoveTask = useCallback((taskId: string, newStatus: string) => {
    moveTask(taskId, newStatus as TaskStatus, 0);
  }, [moveTask]);

  const handleEditColumn = useCallback((column: BoardType['columns'][0]) => {
    setEditingColumn(column);
    setModalState(prev => ({ ...prev, showEditColumn: true }));
  }, []);

  const handleDeleteColumn = useCallback((column: BoardType['columns'][0]) => {
    setDeletingColumn(column);
    setModalState(prev => ({ ...prev, showDeleteColumn: true }));
  }, []);

  const handleDuplicateTask = useCallback((task: Task) => duplicateTask(task), [duplicateTask]);
  const handleArchiveTask = useCallback((taskId: string) => archiveTask(taskId), [archiveTask]);
  
  const handleReassignTask = useCallback((taskId: string, assignee: string | undefined) => {
    updateTask(taskId, { assignee });
  }, [updateTask]);

  const handleSubtaskChanges = useCallback((_taskId: string) => {
    // Forzar re-render de las TaskCards incrementando el refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleCommentChanges = useCallback((_taskId: string) => {
    // Forzar re-render de las TaskCards incrementando el refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Función auxiliar para reordenar columnas
  const reorderColumnsHandler = useCallback((columns: BoardType['columns'], activeId: string, overId: string) => {
    const oldIndex = columns.findIndex(col => col.id === activeId);
    const newIndex = columns.findIndex(col => col.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    
    const newOrder = arrayMove(columns, oldIndex, newIndex);
    reorderColumns(newOrder.map(col => col.id));
  }, [reorderColumns]);

  // Función auxiliar para reordenar tareas dentro de una columna
  const reorderTasksInColumn = useCallback((column: BoardType['columns'][0], taskId: string, targetTaskId: string) => {
    const oldIndex = column.tasks.findIndex((t: Task) => t.id === taskId);
    const newIndex = column.tasks.findIndex((t: Task) => t.id === targetTaskId);
    if (oldIndex === newIndex) return;
    
    const newTasks = arrayMove(column.tasks, oldIndex, newIndex);
    reorderTasks(column.id, newTasks.map((t: Task) => t.id));
  }, [reorderTasks]);

  // ===== MANEJO DE DRAG & DROP OPTIMIZADO =====
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const columns = filteredBoard.columns;

    // Reordenar columnas
    if (activeData?.type === 'column' && overData?.type === 'column' && active.id !== over.id) {
      reorderColumnsHandler(columns, active.id as string, over.id as string);
      return;
    }

    // Manejo de tareas
    if (activeData?.type === 'task') {
      const task = activeData.task as Task;
      const sourceColumn = findColumnByTaskId(columns, task.id);
      if (!sourceColumn) return;

      // Mover a otra columna
      if (overData?.type === 'column') {
        const targetColumn = overData.column;
        if (sourceColumn.id !== targetColumn.id) {
          moveTask(task.id, targetColumn.status, 0);
        }
        return;
      }

      // Reordenar tareas
      if (overData?.type === 'task') {
        const targetTask = overData.task as Task;
        const targetColumn = findColumnByTaskId(columns, targetTask.id);
        if (!targetColumn) return;

        if (sourceColumn.id === targetColumn.id) {
          reorderTasksInColumn(sourceColumn, task.id, targetTask.id);
        } else {
          moveTask(task.id, targetColumn.status, 0);
        }
      }
    }
  }, [filteredBoard.columns, moveTask, reorderColumnsHandler, reorderTasksInColumn]);

  return (
    <div className="board">
      {!hasFilteredTasks && hasActiveFilters ? (
        <NoResults 
          hasFilters={hasActiveFilters} 
          onClearFilters={clearAllFilters} 
        />
      ) : (
        <div className="board__content">
          {/* DndContext: Proporciona el contexto global para todas las operaciones de arrastrar y soltar */}
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
          >
          {/* SortableContext: Define qué elementos pueden ser reordenados y cómo */}
          <SortableContext
            items={filteredBoard.columns.map(column => column.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="board__columns">
              {/* Renderizar todas las columnas como elementos arrastrables */}
              {filteredBoard.columns.map((column) => (
                <DraggableColumn
                  key={`${column.id}-${refreshTrigger}`}
                  column={column}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onViewTask={handleViewTask}
                  onDeleteTask={handleDeleteTask}
                  onMoveTask={handleMoveTask}
                  onDuplicateTask={handleDuplicateTask}
                  onArchiveTask={handleArchiveTask}
                  onReassignTask={handleReassignTask}
                  onAddComment={addComment}
                  onUpdateComment={updateComment}
                  onDeleteComment={deleteComment}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  refreshTrigger={refreshTrigger}
                />
              ))}
              
              {/* Columna para agregar nueva columna */}
              <div className="add-column-card" onClick={() => setModalState(prev => ({ ...prev, showAddColumn: true }))}>
                <div className="add-column-card__content">
                  <div className="add-column-card__icon">+</div>
                  <div className="add-column-card__text">Agregar Columna</div>
                </div>
              </div>
            </div>
          </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Panel lateral para agregar columna */}
      {modalState.showAddColumn && (
        <div className="filter-panel-overlay" onClick={() => setModalState(prev => ({ ...prev, showAddColumn: false }))}>
          <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filter-panel__header">
              <h3>
                <span>➕</span>
                Agregar Nueva Columna
              </h3>
              <button 
                className="filter-panel__close"
                onClick={() => setModalState(prev => ({ ...prev, showAddColumn: false }))}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="filter-panel__content">
              <Suspense fallback={<ModalLoader />}>
                <AddColumnForm onClose={() => setModalState(prev => ({ ...prev, showAddColumn: false }))} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {modalState.showAddTask && taskColumnId && (
        <Modal
          isOpen={modalState.showAddTask}
          onClose={() => {
            setModalState(prev => ({ ...prev, showAddTask: false }));
            setTaskColumnId(null);
          }}
          title="Agregar Nueva Tarea"
          size="xl"
        >
          <Suspense fallback={<ModalLoader />}>
            <TaskForm 
              onClose={() => {
                setModalState(prev => ({ ...prev, showAddTask: false }));
                setTaskColumnId(null);
              }}
              columnStatus={board.columns.find(col => col.id === taskColumnId)?.status || 'todo'}
              columnId={taskColumnId}
            />
          </Suspense>
        </Modal>
      )}

      {/* Modal de detalles de tarea con lazy loading */}
      {modalState.showTaskDetail && currentViewingTask && (
        <Suspense fallback={<ModalLoader />}>
          <TaskDetailModal
            isOpen={modalState.showTaskDetail}
            onClose={() => {
              setModalState(prev => ({ ...prev, showTaskDetail: false }));
              setViewingTask(null);
              setViewingTaskId(null);
            }}
            task={currentViewingTask}
            onEdit={(task) => {
              setViewingTask(null);
              setViewingTaskId(null);
              setEditingTask(task);
              setModalState(prev => ({ ...prev, showTaskDetail: false, showEditTask: true }));
            }}
            onMarkComplete={handleMarkComplete}
            onUpdateSubtask={handleUpdateSubtask}
            onSubtaskChanges={handleSubtaskChanges}
            onAddComment={addComment}
            onUpdateComment={updateComment}
            onDeleteComment={deleteComment}
            onCommentChanges={handleCommentChanges}
          />
        </Suspense>
      )}

      {modalState.showEditTask && editingTask && (
        <Modal
          isOpen={modalState.showEditTask}
          onClose={() => {
            setModalState(prev => ({ ...prev, showEditTask: false }));
            setEditingTask(null);
          }}
          title="Editar Tarea"
          size="xl"
        >
          <Suspense fallback={<ModalLoader />}>
            <TaskForm 
              onClose={() => {
                setModalState(prev => ({ ...prev, showEditTask: false }));
                setEditingTask(null);
              }}
              editingTask={editingTask}
              columnId={findColumnByTaskId(board.columns, editingTask.id)?.id}
            />
          </Suspense>
        </Modal>
      )}

      {/* Panel lateral para editar columna */}
      {modalState.showEditColumn && editingColumn && (
        <div className="filter-panel-overlay" onClick={() => {
          setModalState(prev => ({ ...prev, showEditColumn: false }));
          setEditingColumn(null);
        }}>
          <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filter-panel__header">
              <h3>
                <span>✏️</span>
                Editar Columna
              </h3>
              <button 
                className="filter-panel__close"
                onClick={() => {
                  setModalState(prev => ({ ...prev, showEditColumn: false }));
                  setEditingColumn(null);
                }}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="filter-panel__content">
              <Suspense fallback={<ModalLoader />}>
                <AddColumnForm
                  onClose={() => {
                    setModalState(prev => ({ ...prev, showEditColumn: false }));
                    setEditingColumn(null);
                  }}
                  editingColumn={editingColumn}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {modalState.showDeleteColumn && deletingColumn && (
        <Suspense fallback={<ModalLoader />}>
          <DeleteColumnModal
            isOpen={modalState.showDeleteColumn}
            onClose={() => {
              setModalState(prev => ({ ...prev, showDeleteColumn: false }));
              setDeletingColumn(null);
            }}
            column={deletingColumn}
          />
        </Suspense>
      )}

      {/* Data Manager Modal */}
      {modalState.showDataManager && (
        <Suspense fallback={<ModalLoader />}>
          <DataManager
            isOpen={modalState.showDataManager}
            onClose={() => setModalState(prev => ({ ...prev, showDataManager: false }))}
          />
        </Suspense>
      )}

      {/* Auto-save Indicator */}
      {showIndicator && (
        <div className="auto-save-indicator">
          {isSaving ? '💾 Guardando...' : hasUnsavedChanges ? '⚠️ Cambios sin guardar' : '✅ Guardado'}
        </div>
      )}

    </div>
  );
};

export default memo(Board);
