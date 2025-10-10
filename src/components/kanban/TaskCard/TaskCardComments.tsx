import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Task } from '../../../types';
import { TaskCardMentions } from './TaskCardMentions';

interface TaskCardCommentsProps {
  task: Task;
  showComments: boolean;
  replyingToId: string | null;
  replyContent: string;
  newCommentContent: string;
  showMentionDropdown: boolean;
  mentionFilter: string;
  onCloseComments: (e?: React.MouseEvent) => void;
  onReplyComment: (commentId: string) => void;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  setReplyContent: (content: string) => void;
  onNewCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddNewComment: () => void;
  onSelectMention: (userName: string) => void;
  onShowCommentMenu: (e: React.MouseEvent, commentId: string) => void;
  formatRelativeDate: (date: Date | string) => string;
  getPopupPosition: () => React.CSSProperties;
}

export const TaskCardComments: React.FC<TaskCardCommentsProps> = ({
  task,
  showComments,
  replyingToId,
  replyContent,
  newCommentContent,
  showMentionDropdown,
  mentionFilter,
  onCloseComments,
  onReplyComment,
  onStartReply,
  onCancelReply,
  setReplyContent,
  onNewCommentChange,
  onAddNewComment,
  onSelectMention,
  onShowCommentMenu,
  formatRelativeDate,
  getPopupPosition
}) => {
  const newCommentInputRef = useRef<HTMLTextAreaElement>(null);

  // Función para formatear comentarios con menciones en negrita
  const formatCommentWithMentions = (content: string) => {
    const mentionRegex = /^(@[^:]+):\s*(.*)$/;
    const match = content.match(mentionRegex);
    
    if (match) {
      const mention = match[1];
      const restOfContent = match[2];
      
      return (
        <>
          <strong className="task-card__comment-mention">{mention}</strong>
          {': '}
          {restOfContent}
        </>
      );
    }
    
    return content;
  };

  if (!showComments || !task.comments || task.comments.length === 0) {
    return null;
  }

  return createPortal(
    <div 
      className="task-card__comments-popup" 
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="task-card__comments-popup-backdrop" onClick={onCloseComments}></div>
      <div 
        className="task-card__comments-popup-content"
        style={getPopupPosition()}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="task-card__comments-popup-header">
          <h3>Comentarios ({task.comments.length})</h3>
          <button 
            className="task-card__comments-popup-close-floating"
            onClick={onCloseComments}
            title="Cerrar comentarios"
          >
            ✕
          </button>
        </div>
        
        <div className="task-card__comments-popup-list">
          {task.comments.map((comment) => (
            <div key={comment.id} className="task-card__comment-bubble" data-comment-id={comment.id}>
              <div className="task-card__comment-header">
                <div className="task-card__comment-avatar">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <span className="task-card__comment-author">{comment.author}</span>
                <span className="task-card__comment-date">
                  {formatRelativeDate(comment.createdAt)}
                </span>
              </div>
              <div 
                className="task-card__comment-content"
                onContextMenu={(e) => onShowCommentMenu(e, comment.id)}
              >
                <p className="task-card__comment-text">
                  {formatCommentWithMentions(comment.content)}
                </p>
              </div>
              <div className="task-card__comment-footer">
                <button
                  className="task-card__comment-reply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onStartReply(comment.id);
                  }}
                >
                  💬 Responder
                </button>
              </div>

              {/* Input inline para responder */}
              {replyingToId === comment.id && (
                <div className="task-card__reply-input" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder={`Responder a ${comment.author}...`}
                    className="task-card__reply-textarea"
                    rows={2}
                    autoFocus
                  />
                  <div className="task-card__reply-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onCancelReply();
                      }}
                      className="task-card__reply-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onReplyComment(comment.id);
                      }}
                      disabled={!replyContent.trim()}
                      className="task-card__reply-submit"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input para agregar nuevo comentario */}
        <div className="task-card__add-comment">
          <div className="task-card__add-comment-input-wrapper">
            <textarea
              ref={newCommentInputRef}
              value={newCommentContent}
              onChange={onNewCommentChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  onAddNewComment();
                }
              }}
              placeholder="Escribe un comentario... (usa @ para mencionar)"
              className="task-card__add-comment-textarea"
              rows={2}
            />
            
            {/* Dropdown de menciones */}
            <TaskCardMentions
              showMentionDropdown={showMentionDropdown}
              mentionFilter={mentionFilter}
              onSelectMention={onSelectMention}
            />
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNewComment();
            }}
            disabled={!newCommentContent.trim()}
            className="task-card__add-comment-btn"
          >
            💬 Comentar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};