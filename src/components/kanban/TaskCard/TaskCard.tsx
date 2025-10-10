import React, { useState, memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Task } from '../../../types';
import { useDateUtils } from '../../../hooks/useDateUtils';
import { useContextMenu } from '../../../hooks/useContextMenu';
import { useCommentContextMenu } from '../../../hooks/useCommentContextMenu';
import TaskContextMenu from '../TaskContextMenu';
import CommentContextMenu from '../../ui/CommentContextMenu';
import { TaskCardHeader } from './TaskCardHeader';
import { TaskCardContent } from './TaskCardContent';
import { TaskCardComments } from './TaskCardComments';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string;
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: string) => void;
  onDuplicate?: (task: Task) => void;
  onArchive?: (taskId: string) => void;
  onAddComment?: (taskId: string, content: string, author: string) => void;
  onUpdateComment?: (taskId: string, commentId: string, content: string) => void;
  onDeleteComment?: (taskId: string, commentId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task, columnColor, onEdit, onView, onDelete, onMove, onDuplicate, onArchive, dragHandleProps,
  onAddComment, onUpdateComment, onDeleteComment
}) => {
  const [showComments, setShowComments] = useState(false);
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPopoverPosition, setEditPopoverPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const editCommentInputRef = useRef<HTMLTextAreaElement>(null);
  const { contextMenu, showContextMenu, closeContextMenu } = useContextMenu();
  const { getTaskDateInfo, formatRelativeDate } = useDateUtils();
  const { menuState, menuRef, showMenu: showCommentMenu, hideMenu: hideCommentMenu } = useCommentContextMenu();
  
  const dateInfo = getTaskDateInfo(task);

  // Cerrar popup cuando se hace scroll o se cambia de columna
  useEffect(() => {
    if (showComments) {
      const handleScroll = (e: Event) => {
        // Solo cerrar si el scroll es en el contenedor principal, no en el popup
        const target = e.target as HTMLElement;
        if (!target.closest('.task-card__comments-popup')) {
          setShowComments(false);
        }
      };
      const handleResize = () => setShowComments(false);
      
      // Usar passive: false para poder prevenir el comportamiento por defecto si es necesario
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showComments]);

  // Cerrar popover de edición al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEditModal && editCommentInputRef.current && !editCommentInputRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.task-card__edit-popover')) {
          handleCancelEditComment();
        }
      }
    };

    if (showEditModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEditModal]);

  // Solo cerrar popup cuando se cambia de tarea (ID diferente)
  useEffect(() => {
    setShowComments(false);
  }, [task.id]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo abrir detalles si no se hizo click en botones o áreas interactivas
    const target = e.target as HTMLElement;
    if (target.closest('button') || 
        target.closest('.task-card__content') ||
        target.closest('.task-card__comments-popup')) {
      return;
    }
    onView?.(task);
  };


  const handleCommentsClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    // Pequeño delay para evitar conflictos con otros eventos
    setTimeout(() => {
      setShowComments(!showComments);
    }, 0);
  };

  const handleReplyComment = (commentId: string) => {
    if (!replyContent.trim() || !onAddComment) return;
    
    const originalComment = task.comments?.find(c => c.id === commentId);
    const replyText = `@${originalComment?.author}: ${replyContent}`;
    
    // Agregar el comentario
    onAddComment(task.id, replyText, 'Usuario Actual');
    
    // Limpiar el input de respuesta
    setReplyingToId(null);
    setReplyContent('');
  };

  const handleStartReply = (commentId: string) => {
    setReplyingToId(commentId);
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyContent('');
  };

  const handleEditComment = (commentId: string) => {
    const comment = task.comments?.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingCommentContent(comment.content);
      
      // Calcular posición del popover
      const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
      if (commentElement) {
        const rect = commentElement.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const popoverWidth = 320;
        const popoverHeight = 200;
        
        // Márgenes más agresivos para asegurar que nunca se salga
        const margin = 32; // Margen mínimo desde los bordes
        const spaceRight = windowWidth - rect.right;
        const spaceLeft = rect.left;
        
        // Calcular top para que esté centrado con el comentario, evitando extremos
        const idealTop = rect.top + (rect.height / 2) - (popoverHeight / 2);
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
        
        if (spaceRight >= popoverWidth + margin) {
          // Hay espacio a la derecha
          const left = Math.max(margin, rect.right + 16);
          setEditPopoverPosition({
            top,
            left
          });
        } else if (spaceLeft >= popoverWidth + margin) {
          // Hay espacio a la izquierda
          const right = Math.max(margin, windowWidth - rect.left + 16);
          setEditPopoverPosition({
            top,
            right
          });
        } else {
          // Forzar centrado horizontal con validación estricta
          const centeredLeft = Math.max(margin, Math.min(windowWidth - popoverWidth - margin, (windowWidth - popoverWidth) / 2));
          setEditPopoverPosition({
            top,
            left: centeredLeft
          });
        }
        
        setShowEditModal(true);
      }
    }
  };

  const handleSaveEditComment = () => {
    if (editingCommentId && editingCommentContent.trim() && onUpdateComment) {
      onUpdateComment(task.id, editingCommentId, editingCommentContent.trim());
      setShowEditModal(false);
      setEditingCommentId(null);
      setEditingCommentContent('');
    }
  };

  const handleCancelEditComment = () => {
    setShowEditModal(false);
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(task.id, commentId);
    }
  };

  // Manejar cambios en el input de nuevo comentario
  const handleNewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewCommentContent(value);
    
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

  const handleSelectMention = (userName: string) => {
    const beforeMention = newCommentContent.substring(0, mentionPosition);
    const afterMention = newCommentContent.substring(mentionPosition + mentionFilter.length + 1);
    
    const newValue = `${beforeMention}@${userName} ${afterMention}`;
    setNewCommentContent(newValue);
    setShowMentionDropdown(false);
  };

  const handleAddNewComment = () => {
    if (!newCommentContent.trim() || !onAddComment) return;
    
    onAddComment(task.id, newCommentContent, 'Usuario Actual');
    setNewCommentContent('');
    setShowMentionDropdown(false);
  };

  const getPopupPosition = () => {
    if (!cardRef) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = cardRef.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 400;
    const popupHeight = 300;
    const margin = 32; // Margen mínimo más agresivo
    
    // Calcular posición preferida (a la derecha de la card)
    let left = rect.right + 16;
    let top = rect.top;
    
    // Si no cabe a la derecha, mostrar a la izquierda
    if (left + popupWidth > viewportWidth - margin) {
      left = rect.left - popupWidth - 16;
    }
    
    // Si no cabe a la izquierda, forzar centrado horizontal
    if (left < margin) {
      left = Math.max(margin, (viewportWidth - popupWidth) / 2);
    }
    
    // Validación ULTRA estricta horizontal - NUNCA salirse
    left = Math.max(margin, Math.min(left, viewportWidth - popupWidth - margin));
    
    // Posicionamiento vertical más conservador
    const idealTop = rect.top - 40; // Más separado de la card
    const maxTop = viewportHeight - popupHeight - margin;
    const minTop = margin;
    
    if (idealTop >= minTop && idealTop <= maxTop) {
      top = idealTop;
    } else if (idealTop < minTop) {
      top = minTop;
    } else {
      top = maxTop;
    }
    
    // Validación ULTRA estricta vertical - NUNCA salirse
    top = Math.max(margin, Math.min(top, viewportHeight - popupHeight - margin));
    
    // Validación final de emergencia - si aún se sale, centrar
    if (left + popupWidth > viewportWidth - margin) {
      left = Math.max(margin, (viewportWidth - popupWidth) / 2);
    }
    if (top + popupHeight > viewportHeight - margin) {
      top = Math.max(margin, (viewportHeight - popupHeight) / 2);
    }
    
    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: 'none',
      '--popup-left': `${left}px`,
      '--popup-top': `${top}px`
    } as React.CSSProperties;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onEdit?.(task);
        break;
      case 'ContextMenu':
      case 'F10':
        e.preventDefault();
        showContextMenu(e as any);
        break;
    }
  };

  return (
    <>
      <div
        ref={setCardRef}
        className={`task-card ${contextMenu.isOpen ? 'task-card--context-menu-open' : ''}`}
        style={{
          borderColor: columnColor || 'var(--color-border)',
          color: columnColor || 'inherit',
        }}
        onClick={handleCardClick}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        onContextMenu={showContextMenu}
        role="article"
        aria-label={`Tarea: ${task.title}`}
        aria-describedby={`task-${task.id}-description`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <TaskCardHeader
          task={task}
          columnColor={columnColor}
          dragHandleProps={dragHandleProps}
        />

        <TaskCardContent 
          task={task} 
          dateInfo={dateInfo}
          onCommentsClick={handleCommentsClick}
        />
      </div>

      <TaskCardComments
        task={task}
        showComments={showComments}
        replyingToId={replyingToId}
        replyContent={replyContent}
        newCommentContent={newCommentContent}
        showMentionDropdown={showMentionDropdown}
        mentionFilter={mentionFilter}
        onCloseComments={handleCommentsClick}
        onReplyComment={handleReplyComment}
        onStartReply={handleStartReply}
        onCancelReply={handleCancelReply}
        setReplyContent={setReplyContent}
        onNewCommentChange={handleNewCommentChange}
        onAddNewComment={handleAddNewComment}
        onSelectMention={handleSelectMention}
        onShowCommentMenu={showCommentMenu}
        formatRelativeDate={formatRelativeDate}
        getPopupPosition={getPopupPosition}
      />
    
   <TaskContextMenu
      isOpen={contextMenu.isOpen}
      position={{ x: contextMenu.x, y: contextMenu.y }}
      task={task}
      onClose={closeContextMenu}
      onEdit={onEdit || (() => {})}
      onDelete={onDelete || (() => {})}
      onDuplicate={onDuplicate || (() => {})}
      onArchive={onArchive || (() => {})}
      onMove={onMove || (() => {})}
    />

    <CommentContextMenu
      isOpen={menuState.isOpen}
      position={menuState.position}
      onEdit={() => handleEditComment(menuState.commentId!)}
      onDelete={() => handleDeleteComment(menuState.commentId!)}
      onClose={hideCommentMenu}
      menuRef={menuRef as React.RefObject<HTMLDivElement | null>}
    />

    {/* Popover para editar comentario */}
    {showEditModal && editPopoverPosition && createPortal(
      <div 
        className="task-card__edit-popover"
        style={{
          position: 'fixed',
          top: editPopoverPosition.top,
          left: editPopoverPosition.left,
          right: editPopoverPosition.right,
          zIndex: 100001,
        }}
      >
        <div className="task-card__edit-popover-content">
          <div className="task-card__edit-popover-header">
            <h4>Editar comentario</h4>
            <button 
              className="task-card__edit-popover-close"
              onClick={handleCancelEditComment}
            >
              ✕
            </button>
          </div>
          
          <div className="task-card__edit-popover-body">
            <textarea
              ref={editCommentInputRef}
              value={editingCommentContent}
              onChange={(e) => setEditingCommentContent(e.target.value)}
              className="task-card__edit-popover-textarea"
              placeholder="Escribe tu comentario..."
              rows={3}
              autoFocus
            />
          </div>
          
          <div className="task-card__edit-popover-footer">
            <button 
              className="task-card__edit-popover-cancel"
              onClick={handleCancelEditComment}
            >
              Cancelar
            </button>
            <button 
              className="task-card__edit-popover-save"
              onClick={handleSaveEditComment}
              disabled={!editingCommentContent.trim()}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default memo(TaskCard, (prevProps, nextProps) => {
  // Comparación para detectar cambios relevantes
  const isSameTask = prevProps.task.id === nextProps.task.id;
  const isSameColor = prevProps.columnColor === nextProps.columnColor;
  const isSameCommentsLength = (prevProps.task.comments?.length || 0) === (nextProps.task.comments?.length || 0);
  const isSameUpdatedAt = prevProps.task.updatedAt?.getTime() === nextProps.task.updatedAt?.getTime();
  
  return isSameTask && isSameColor && isSameCommentsLength && isSameUpdatedAt;
});
