import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Task, Subtask } from '../../../types';
import { teamMembersDetailed } from '../../../data/mockData';
import { getPriorityColor, getPriorityIcon } from '../../../utils/helpers';
import { useDateUtils } from '../../../hooks/useDateUtils';
import { useRealtimeUpdates } from '../../../hooks/useRealtimeUpdates';
import { useCommentContextMenu } from '../../../hooks/useCommentContextMenu';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import CommentContextMenu from '../../ui/CommentContextMenu';
import MarkdownPreview from '../MarkdownPreview';
import './TaskDetailModal.css';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: (task: Task) => void;
  onMarkComplete: (taskId: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onSubtaskChanges?: (taskId: string) => void; // Nueva prop para notificar cambios
  onAddComment?: (taskId: string, content: string, author: string) => void;
  onUpdateComment?: (taskId: string, commentId: string, content: string) => void;
  onDeleteComment?: (taskId: string, commentId: string) => void;
  onCommentChanges?: (taskId: string) => void; // Nueva prop para notificar cambios
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onMarkComplete,
  onUpdateSubtask,
  onSubtaskChanges,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onCommentChanges
}) => {
  const { getTaskDateInfo, formatRelativeDate } = useDateUtils();
  const { notifyChange } = useRealtimeUpdates();
  const dateInfo = getTaskDateInfo(task);
  const assignees = task.assignees || (task.assignee ? [task.assignee] : []);

  // Estado local para las subtareas pendientes
  const [localSubtasks, setLocalSubtasks] = useState<Subtask[]>(task.subtasks);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [useBatchMode, setUseBatchMode] = useState(false);
  const [hasSubtaskChanges, setHasSubtaskChanges] = useState(false);
  
  // Estado para comentarios
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [commentsDialogPosition, setCommentsDialogPosition] = useState<{ top: number; left: number } | null>(null);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [showEditMentionDropdown, setShowEditMentionDropdown] = useState(false);
  const [editMentionFilter, setEditMentionFilter] = useState('');
  const [editMentionPosition, setEditMentionPosition] = useState(0);
  const commentsButtonRef = useRef<HTMLButtonElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editCommentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { menuState, menuRef, showMenu: showCommentMenu, hideMenu: hideCommentMenu } = useCommentContextMenu();

  // Función para formatear comentarios con menciones en negrita (optimizado)
  const formatCommentWithMentions = useCallback((content: string) => {
    // Detectar patrón @Usuario: al inicio del comentario
    const mentionRegex = /^(@[^:]+):\s*(.*)$/;
    const match = content.match(mentionRegex);
    
    if (match) {
      const mention = match[1]; // @Usuario
      const restOfContent = match[2]; // El resto del texto
      
      return (
        <>
          <strong className="task-detail__comment-mention">{mention}</strong>
          {': '}
          {restOfContent}
        </>
      );
    }
    
    return content;
  }, []);

  // Sincronizar con la tarea cuando cambie
  useEffect(() => {
    setLocalSubtasks(task.subtasks);
    setHasPendingChanges(false);
  }, [task.subtasks]);

  // Notificar cambios al cerrar el modal
  useEffect(() => {
    if (!isOpen && hasSubtaskChanges && onSubtaskChanges) {
      onSubtaskChanges(task.id);
      setHasSubtaskChanges(false);
    }
  }, [isOpen, hasSubtaskChanges, onSubtaskChanges, task.id]);

  // Calcular progreso basado en subtareas (usar tarea actualizada en modo inmediato)
  const currentSubtasks = useBatchMode ? localSubtasks : task.subtasks;
  const completedSubtasks = currentSubtasks.filter(s => s.completed).length;
  const totalSubtasks = currentSubtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Manejar cambios en subtareas locales
  const handleLocalSubtaskChange = (subtaskId: string, completed: boolean) => {
    setLocalSubtasks(prev => 
      prev.map(subtask => 
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      )
    );
    setHasPendingChanges(true);
  };

  // Aplicar cambios y notificar
  const handleAcceptChanges = () => {
    // Aplicar todos los cambios pendientes
    localSubtasks.forEach(subtask => {
      const originalSubtask = task.subtasks.find(s => s.id === subtask.id);
      if (originalSubtask && originalSubtask.completed !== subtask.completed) {
        onUpdateSubtask(task.id, subtask.id, subtask.completed);
      }
    });
    
    setHasPendingChanges(false);
    setHasSubtaskChanges(true);
    
    // Mostrar notificación de éxito
    if (completedSubtasks > 0) {
      // Aquí podrías agregar una notificación toast si tienes un sistema de notificaciones
    }
  };

  // Función para actualizar subtarea individual (sin botón aceptar)
  const handleImmediateSubtaskChange = (subtaskId: string, completed: boolean) => {
    onUpdateSubtask(task.id, subtaskId, completed);
    setHasSubtaskChanges(true);
    
    // Notificar cambios usando el sistema de eventos personalizados
    notifyChange('subtask-updated', {
      taskId: task.id,
      subtaskId,
      completed,
      taskTitle: task.title
    });
    
    // Notificar cambios inmediatamente para actualización en tiempo real
    if (onSubtaskChanges) {
      onSubtaskChanges(task.id);
    }
  };

  // Funciones para comentarios
  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(task.id, newComment.trim(), 'Usuario Actual'); // TODO: Obtener usuario actual
      setNewComment('');
      setShowMentionDropdown(false);
      // Notificar cambios en comentarios
      if (onCommentChanges) {
        onCommentChanges(task.id);
      }
    }
  };

  // Manejar cambios en el input de comentario con menciones
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewComment(value);
    
    // Detectar si escribió @ y mostrar dropdown de menciones
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Solo mostrar si no hay espacios después del @
      if (!textAfterAt.includes(' ')) {
        setMentionFilter(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Insertar mención seleccionada (optimizado)
  const handleSelectMention = useCallback((userName: string) => {
    setNewComment(prev => {
      const beforeMention = prev.substring(0, mentionPosition);
      const afterMention = prev.substring(mentionPosition + mentionFilter.length + 1);
      return `${beforeMention}@${userName} ${afterMention}`;
    });
    setShowMentionDropdown(false);
    
    // Enfocar el textarea
    setTimeout(() => {
      commentTextareaRef.current?.focus();
    }, 0);
  }, [mentionPosition, mentionFilter]);

  // Filtrar usuarios según el texto después del @ (optimizado con useMemo)
  const filteredUsers = useMemo(() => {
    if (!showMentionDropdown) return [];
    if (!mentionFilter) return teamMembersDetailed.slice(0, 10);
    
    const lowerFilter = mentionFilter.toLowerCase();
    return teamMembersDetailed
      .filter(user => user.name.toLowerCase().includes(lowerFilter))
      .slice(0, 10);
  }, [mentionFilter, showMentionDropdown]);

  // Filtrar usuarios para el popover de edición
  const filteredEditUsers = useMemo(() => {
    if (!showEditMentionDropdown) return [];
    if (!editMentionFilter) return teamMembersDetailed.slice(0, 10);
    
    const lowerFilter = editMentionFilter.toLowerCase();
    return teamMembersDetailed
      .filter(user => user.name.toLowerCase().includes(lowerFilter))
      .slice(0, 10);
  }, [editMentionFilter, showEditMentionDropdown]);

  const handleReplyComment = (parentId: string) => {
    if (replyContent.trim() && onAddComment) {
      // Encontrar el comentario al que se está respondiendo
      const parentComment = task.comments?.find(c => c.id === parentId);
      const replyPrefix = parentComment ? `@${parentComment.author}: ` : '@Respuesta: ';
      
      onAddComment(task.id, `${replyPrefix}${replyContent.trim()}`, 'Usuario Actual');
      setReplyContent('');
      setReplyingToId(null);
      if (onCommentChanges) {
        onCommentChanges(task.id);
      }
    }
  };

  const handleStartReply = (commentId: string) => {
    setReplyingToId(commentId);
    setReplyContent('');
  };

  const handleEditCommentFromMenu = (commentId: string) => {
    const comment = task.comments?.find(c => c.id === commentId);
    if (comment) {
      handleEditComment(commentId, comment.content);
    }
  };

  const handleDeleteCommentFromMenu = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(task.id, commentId);
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(currentContent);
    
    // Calcular posición del popover
    const commentElement = commentRefs.current[commentId];
    if (commentElement) {
      const rect = commentElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popoverWidth = 320;
      const popoverHeight = 250; // Altura estimada del popover
      
      // Determinar si hay espacio a la derecha
      const spaceRight = windowWidth - rect.right;
      const spaceLeft = rect.left;
      
      // Calcular top para que esté centrado con el comentario
      let top = rect.top + (rect.height / 2) - (popoverHeight / 2);
      
      // Asegurarse de que no se salga por arriba o abajo
      if (top < 20) top = 20;
      if (top + popoverHeight > windowHeight - 20) top = windowHeight - popoverHeight - 20;
      
      let position;
      if (spaceRight >= popoverWidth + 16) {
        // Mostrar a la derecha
        position = {
          top: top,
          left: rect.right + 16
        };
      } else if (spaceLeft >= popoverWidth + 16) {
        // Mostrar a la izquierda
        position = {
          top: top,
          right: windowWidth - rect.left + 16
        };
      } else {
        // Centrar en pantalla si no hay espacio
        position = {
          top: Math.max(20, Math.min(top, windowHeight / 2 - popoverHeight / 2)),
          left: (windowWidth - popoverWidth) / 2
        };
      }
      
      setPopoverPosition(position);
    }
    
    setShowEditModal(true);
  };

  const handleSaveComment = () => {
    if (editingCommentId && editingCommentContent.trim() && onUpdateComment) {
      onUpdateComment(task.id, editingCommentId, editingCommentContent.trim());
      setEditingCommentId(null);
      setEditingCommentContent('');
      setShowEditModal(false);
      // Notificar cambios en comentarios
      if (onCommentChanges) {
        onCommentChanges(task.id);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
    setShowEditModal(false);
    setShowEditMentionDropdown(false);
  };

  // Manejar cambios en el textarea de edición con detección de menciones
  const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setEditingCommentContent(value);
    
    // Detectar si escribió @ y mostrar dropdown de menciones
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      if (!textAfterAt.includes(' ')) {
        setEditMentionFilter(textAfterAt);
        setEditMentionPosition(lastAtIndex);
        setShowEditMentionDropdown(true);
      } else {
        setShowEditMentionDropdown(false);
      }
    } else {
      setShowEditMentionDropdown(false);
    }
  };

  // Insertar mención seleccionada en el popover de edición
  const handleSelectEditMention = (userName: string) => {
    const beforeMention = editingCommentContent.substring(0, editMentionPosition);
    const afterMention = editingCommentContent.substring(editMentionPosition + editMentionFilter.length + 1);
    
    const newValue = `${beforeMention}@${userName} ${afterMention}`;
    setEditingCommentContent(newValue);
    setShowEditMentionDropdown(false);
    
    // Enfocar el textarea
    setTimeout(() => {
      editCommentInputRef.current?.focus();
    }, 0);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
      <div className="task-detail">
        
        {/* Sección principal: Contenido + Información */}
        <div className="task-detail__main-section">
          
          {/* Lado izquierdo: Título, Descripción y Subtareas */}
          <div className="task-detail__content-section">
            
            {/* Título */}
            <div className="task-detail__title-section">
              <h2 className="task-detail__title">{task.title}</h2>
            </div>

            {/* Descripción */}
            {task.description && (
              <div className="task-detail__field">
                <h3 className="task-detail__label">Descripción</h3>
                <div className="task-detail__description">
                  <MarkdownPreview content={task.description} />
                </div>
              </div>
            )}

            {/* Subtareas */}
            {currentSubtasks.length > 0 && (
              <div className="task-detail__field">
                <div className="task-detail__subtasks-header">
                  <h3 className="task-detail__label">
                    Subtareas ({completedSubtasks}/{totalSubtasks})
                  </h3>
                  <div className="task-detail__subtasks-controls">
                    <label className="task-detail__mode-toggle">
                      <input
                        type="checkbox"
                        checked={useBatchMode}
                        onChange={(e) => {
                          setUseBatchMode(e.target.checked);
                          if (!e.target.checked) {
                            setHasPendingChanges(false);
                            setLocalSubtasks(task.subtasks);
                          }
                        }}
                      />
                      <span className="task-detail__mode-toggle-text">
                        {useBatchMode ? 'Modo Lote' : 'Modo Inmediato'}
                      </span>
                    </label>
                    {hasPendingChanges && (
                      <div className="task-detail__pending-indicator">
                        <span className="task-detail__pending-text">⚠️ Cambios pendientes</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="task-detail__progress-bar">
                  <div 
                    className="task-detail__progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="task-detail__subtasks">
                  {currentSubtasks.map(subtask => (
                    <label key={subtask.id} className="task-detail__subtask">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => {
                          if (useBatchMode) {
                            handleLocalSubtaskChange(subtask.id, e.target.checked);
                          } else {
                            handleImmediateSubtaskChange(subtask.id, e.target.checked);
                          }
                        }}
                        className="task-detail__subtask-checkbox"
                      />
                      <span className={`task-detail__subtask-title ${subtask.completed ? 'task-detail__subtask-title--completed' : ''}`}>
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
                {useBatchMode && hasPendingChanges && (
                  <div className="task-detail__subtasks-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAcceptChanges}
                      className="task-detail__accept-btn"

                    >
                      ✅ Aceptar Cambios
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setLocalSubtasks(task.subtasks);
                        setHasPendingChanges(false);
                      }}
                      className="task-detail__cancel-btn"
                    >
                      ❌ Cancelar
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Comentarios - Botón para abrir diálogo */}
              <div className="task-detail__field">
                          <button
                ref={commentsButtonRef}
                className="task-detail__comments-button"
                onClick={() => {
                  if (commentsButtonRef.current) {
                    const rect = commentsButtonRef.current.getBoundingClientRect();
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const popoverWidth = 360;
                    const popoverHeight = 500;
                    
                    // Márgenes más agresivos para asegurar que nunca se salga
                    const margin = 32; // Margen mínimo desde los bordes
                    const spaceRight = windowWidth - rect.right;
                    const spaceLeft = rect.left;
                    
                    // Calcular posición horizontal con validación estricta
                    let left;
                    if (spaceRight >= popoverWidth + margin) {
                      left = rect.right + 16;
                    } else if (spaceLeft >= popoverWidth + margin) {
                      left = rect.left - popoverWidth - 16;
                    } else {
                      // Forzar centrado con márgenes estrictos
                      left = Math.max(margin, (windowWidth - popoverWidth) / 2);
                    }
                    
                    // Validación estricta horizontal - NUNCA salirse
                    left = Math.max(margin, Math.min(left, windowWidth - popoverWidth - margin));
                    
                    // Posicionamiento vertical más conservador
                    const idealTop = rect.top - 80; // Más separado del botón
                    const maxTop = windowHeight - popoverHeight - margin;
                    const minTop = margin;
                    
                    let top;
                    if (idealTop >= minTop && idealTop <= maxTop) {
                      top = idealTop;
                    } else if (idealTop < minTop) {
                      top = minTop;
                    } else {
                      top = maxTop;
                    }
                    
                    // Validación estricta vertical - NUNCA salirse
                    top = Math.max(margin, Math.min(top, windowHeight - popoverHeight - margin));
                    
                    setCommentsDialogPosition({ top, left });
                    setShowCommentsDialog(true);
                  }
                }}
              >
                <MessageCircle className="task-detail__comments-icon" size={20} />
                <span className="task-detail__comments-button-text">
                  Ver Comentarios {task.comments && task.comments.length > 0 && `(${task.comments.length})`}
                </span>
                          </button>
                      </div>

          </div>

          {/* Lado derecho: Usuarios, Prioridad, Etiquetas e Información */}
          <div className="task-detail__info-section">
            
            {/* Usuarios asignados */}
            {assignees.length > 0 && (
              <div className="task-detail__field">
                <h3 className="task-detail__label">Asignado a</h3>
                <div className="task-detail__assignees">
                  {assignees.map(assignee => {
                    const userInfo = teamMembersDetailed.find(u => u.name === assignee);
                    const statusColor = userInfo?.status === 'available' ? '#22c55e' : 
                                       userInfo?.status === 'busy' ? '#f59e0b' : '#6b7280';
                    const statusText = userInfo?.status === 'available' ? 'Disponible' : 
                                      userInfo?.status === 'busy' ? 'Ocupado' : 'Ausente';
                    
                    return (
                      <div key={assignee} className="task-detail__assignee">
                        <div className="task-detail__assignee-avatar">
                          {assignee.charAt(0).toUpperCase()}
                          <span 
                            className="task-detail__assignee-status"
                            style={{ backgroundColor: statusColor }}
                            title={statusText}
                          />
                        </div>
                        <div className="task-detail__assignee-info">
                          <div className="task-detail__assignee-name">{assignee}</div>
                          <div className="task-detail__assignee-status-text">{statusText}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prioridad */}
            <div className="task-detail__field">
              <h3 className="task-detail__label">Prioridad</h3>
              <div 
                className="task-detail__priority"
                style={{ color: getPriorityColor(task.priority) }}
              >
                <span className="task-detail__priority-icon">
                  {getPriorityIcon(task.priority)}
                </span>
                <span className="task-detail__priority-text">
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Etiquetas */}
            {task.tags.length > 0 && (
              <div className="task-detail__field">
                <h3 className="task-detail__label">Etiquetas</h3>
                <div className="task-detail__tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="task-detail__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="task-detail__field">
              <h3 className="task-detail__label">Información</h3>
              <div className="task-detail__info-grid">
                <div className="task-detail__info-item">
                  <span className="task-detail__info-label">Creada:</span>
                  <span className="task-detail__info-value">{dateInfo.created?.formatted}</span>
                </div>
                {task.dueDate && (
                  <div className="task-detail__info-item">
                    <span className="task-detail__info-label">Vencimiento:</span>
                    <span className={`task-detail__info-value ${
                      (dateInfo.due?.timeDifference.days ?? 0) < 0 ? 'task-detail__info-value--overdue' :
                      (dateInfo.due?.timeDifference.days ?? 0) <= 3 ? 'task-detail__info-value--warning' : ''
                    }`}>
                      {dateInfo.due?.formatted}
                    </span>
                  </div>
                )}
                <div className="task-detail__info-item">
                  <span className="task-detail__info-label">Estado:</span>
                  <span className="task-detail__info-value">{task.status}</span>
                </div>
                {task.estimatedHours && (
                  <div className="task-detail__info-item">
                    <span className="task-detail__info-label">Horas estimadas:</span>
                    <span className="task-detail__info-value">{task.estimatedHours}h</span>
                  </div>
                )}
                <div className="task-detail__info-item">
                  <span className="task-detail__info-label">Actualizada:</span>
                  <span className="task-detail__info-value">{dateInfo.updated?.relative}</span>
                </div>
              </div>
            </div>

            {/* Acciones - Debajo de acordeón de comentarios */}
            <div className="task-detail__field">
              <div className="task-detail__actions-below-comments">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  ✏️ Editar Tarea
                </Button>
                
                {task.status !== 'done' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onMarkComplete(task.id);
                      onClose();
                    }}
                  >
                    Terminado
                  </Button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Popover de edición de comentario - Fuera del scroll */}
        {showEditModal && popoverPosition && (
          <>
            <div className="task-detail__edit-comment-backdrop" onClick={handleCancelEdit}></div>
            <div 
              className="task-detail__edit-comment-popover"
              style={{
                top: `${popoverPosition.top}px`,
                left: popoverPosition.left !== undefined ? `${popoverPosition.left}px` : 'auto',
                right: popoverPosition.right !== undefined ? `${popoverPosition.right}px` : 'auto'
              }}
            >
              <h4 className="task-detail__edit-comment-title">Editar comentario</h4>
              <div className="task-detail__edit-comment-input-wrapper">
                <textarea
                  ref={editCommentInputRef}
                  value={editingCommentContent}
                  onChange={handleEditCommentChange}
                  className="task-detail__edit-comment-textarea"
                  rows={4}
                  autoFocus
                  placeholder="Escribe tu comentario... (usa @ para mencionar)"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      if (editingCommentContent.trim()) {
                        handleSaveComment();
                      }
                    }
                  }}
                />
                
                {/* Dropdown de menciones para edición */}
                {showEditMentionDropdown && filteredEditUsers.length > 0 && (
                  <div className="task-detail__edit-mention-dropdown" onClick={(e) => e.stopPropagation()}>
                    {filteredEditUsers.map((user) => (
                      <div
                        key={user.name}
                        className="task-detail__edit-mention-item"
                        onClick={() => handleSelectEditMention(user.name)}
                      >
                        <div className="task-detail__edit-mention-avatar">
                          {user.avatar}
                        </div>
                        <div className="task-detail__edit-mention-info">
                          <span className="task-detail__edit-mention-name">{user.name}</span>
                          <span className="task-detail__edit-mention-status" data-status={user.status}>
                            {user.status === 'online' ? '🟢' : user.status === 'busy' ? '🔴' : user.status === 'away' ? '🟡' : '⚫'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="task-detail__edit-comment-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveComment}
                  disabled={!editingCommentContent.trim()}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Popover de responder comentario - Fuera del scroll */}
        {replyingToId && popoverPosition && (
          <>
            <div 
              className="task-detail__edit-comment-backdrop" 
              onClick={() => {
                setReplyingToId(null);
                setReplyContent('');
              }}
            ></div>
            <div 
              className="task-detail__edit-comment-popover"
              style={{
                top: `${popoverPosition.top}px`,
                left: popoverPosition.left !== undefined ? `${popoverPosition.left}px` : 'auto',
                right: popoverPosition.right !== undefined ? `${popoverPosition.right}px` : 'auto'
              }}
            >
              <h4 className="task-detail__edit-comment-title">Responder comentario</h4>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="task-detail__edit-comment-textarea"
                rows={3}
                autoFocus
              />
              <div className="task-detail__edit-comment-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setReplyingToId(null);
                    setReplyContent('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (replyingToId) handleReplyComment(replyingToId);
                  }}
                  disabled={!replyContent.trim()}
                >
                  Responder
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Diálogo de Comentarios - Popover al lado del botón */}
        {showCommentsDialog && commentsDialogPosition && (
          <>
            <div 
              className="task-detail__comments-dialog-backdrop" 
              onClick={() => {
                setShowCommentsDialog(false);
                setCommentsDialogPosition(null);
              }}
            ></div>
            <div 
              className="task-detail__comments-dialog" 
              style={{
                top: `${commentsDialogPosition.top}px`,
                left: `${commentsDialogPosition.left}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="task-detail__comments-dialog-header">
                <h3>💬 Comentarios ({task.comments?.length || 0})</h3>
              </div>
              
              <div className="task-detail__comments-dialog-body">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="task-detail__comment-item">
                      <div 
                        className="task-detail__comment-bubble"
                        ref={(el) => { if (el) commentRefs.current[comment.id] = el; }}
                      >
                        <div className="task-detail__comment-header">
                          <div className="task-detail__comment-user">
                            <div className="task-detail__comment-avatar">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="task-detail__comment-name">{comment.author}</span>
                          </div>
                          <span className="task-detail__comment-date">
                            {formatRelativeDate(comment.createdAt)}
                            {comment.isEdited && ' (editado)'}
                          </span>
                        </div>
                        
                        <div 
                          className="task-detail__comment-content"
                          onContextMenu={(e) => showCommentMenu(e, comment.id)}
                        >
                          <p>{formatCommentWithMentions(comment.content)}</p>
                        </div>
                        
                        <div className="task-detail__comment-footer-popup">
                          <button
                            className="task-detail__comment-reply-btn-popup"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartReply(comment.id);
                            }}
                          >
                            💬 Responder
                          </button>
                        </div>

                        {/* Input inline para responder */}
                        {replyingToId === comment.id && (
                          <div className="task-detail__reply-input-popup" onClick={(e) => e.stopPropagation()}>
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`Responder a ${comment.author}...`}
                              className="task-detail__reply-textarea-popup"
                              rows={2}
                              autoFocus
                            />
                            <div className="task-detail__reply-actions-popup">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReplyingToId(null);
                                  setReplyContent('');
                                }}
                                className="task-detail__reply-cancel-popup"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReplyComment(comment.id);
                                }}
                                disabled={!replyContent.trim()}
                                className="task-detail__reply-submit-popup"
                              >
                                Responder
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="task-detail__comments-empty">
                    <div className="task-detail__comments-empty-icon">💬</div>
                    <p className="task-detail__comments-empty-text">No hay comentarios aún</p>
                    <p className="task-detail__comments-empty-hint">Sé el primero en comentar →</p>
                  </div>
                )}
              </div>
              
              <div className="task-detail__comments-dialog-footer">
                <div className="task-detail__add-comment-popup">
                  <div className="task-detail__add-comment-input-wrapper-popup">
                    <textarea
                      ref={commentTextareaRef}
                      value={newComment}
                      onChange={handleCommentChange}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          if (newComment.trim()) {
                            handleAddComment();
                          }
                        }
                      }}
                      placeholder="Escribe un comentario... (usa @ para mencionar)"
                      className="task-detail__add-comment-textarea-popup"
                      rows={2}
                    />
                    
                    {/* Dropdown de menciones */}
                    {showMentionDropdown && filteredUsers.length > 0 && (
                      <div className="task-detail__mention-dropdown-popup" onClick={(e) => e.stopPropagation()}>
                        {filteredUsers.map((user) => (
                          <div
                            key={user.name}
                            className="task-detail__mention-item-popup"
                            onClick={() => handleSelectMention(user.name)}
                          >
                            <div className="task-detail__mention-avatar-popup">
                              {user.avatar}
                            </div>
                            <div className="task-detail__mention-info-popup">
                              <span className="task-detail__mention-name-popup">{user.name}</span>
                              <span className="task-detail__mention-status-popup" data-status={user.status}>
                                {user.status === 'online' ? '🟢' : user.status === 'busy' ? '🔴' : user.status === 'away' ? '🟡' : '⚫'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddComment();
                    }}
                    disabled={!newComment.trim()}
                    className="task-detail__add-comment-btn-popup"
                    title="Enviar comentario (Ctrl+Enter)"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <CommentContextMenu
        isOpen={menuState.isOpen}
        position={menuState.position}
        onEdit={() => handleEditCommentFromMenu(menuState.commentId!)}
        onDelete={() => handleDeleteCommentFromMenu(menuState.commentId!)}
        onClose={hideCommentMenu}
        menuRef={menuRef as React.RefObject<HTMLDivElement | null>}
      />
    </Modal>
  );
};

export default TaskDetailModal;


