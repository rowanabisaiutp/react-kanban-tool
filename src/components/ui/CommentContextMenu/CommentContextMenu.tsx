import React from 'react';
import { createPortal } from 'react-dom';

interface CommentContextMenuProps {
  isOpen: boolean;
  position: { top: number; left?: number; right?: number } | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

const CommentContextMenu: React.FC<CommentContextMenuProps> = ({
  isOpen,
  position,
  onEdit,
  onDelete,
  onClose,
  menuRef,
}) => {
  if (!isOpen || !position) return null;

  // Calcular posición inteligente para el menú contextual de comentarios
  const getMenuPosition = () => {
    const menuWidth = 200; // Ancho estimado del menú
    const menuHeight = 100; // Altura estimada del menú
    const margin = 32; // Margen mínimo desde los bordes
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calcular posición horizontal
    let left = position.left || 0;
    let right = position.right;
    
    if (left && left + menuWidth > viewportWidth - margin) {
      left = viewportWidth - menuWidth - margin;
      right = undefined;
    }
    if (left && left < margin) {
      left = margin;
    }
    
    // Validación estricta horizontal - NUNCA salirse
    if (left) {
      left = Math.max(margin, Math.min(left, viewportWidth - menuWidth - margin));
    }
    
    // Calcular posición vertical
    let top = position.top;
    if (top + menuHeight > viewportHeight - margin) {
      top = position.top - menuHeight;
    }
    if (top < margin) {
      top = margin;
    }
    
    // Validación estricta vertical - NUNCA salirse
    top = Math.max(margin, Math.min(top, viewportHeight - menuHeight - margin));
    
    return { top, left, right };
  };

  const menuPosition = getMenuPosition();

  return createPortal(
    <div
      ref={menuRef}
      className="comment-context-menu"
      style={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        right: menuPosition.right,
        zIndex: 100000,
        '--comment-menu-left': menuPosition.left ? `${menuPosition.left}px` : 'auto',
        '--comment-menu-top': `${menuPosition.top}px`,
      } as React.CSSProperties}
    >
      <div className="comment-context-menu__content">
        <button
          className="comment-context-menu__item comment-context-menu__item--edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
            onClose();
          }}
        >
          <span className="comment-context-menu__icon">✏️</span>
          <span className="comment-context-menu__text">Editar</span>
        </button>
        
        <button
          className="comment-context-menu__item comment-context-menu__item--delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            onClose();
          }}
        >
          <span className="comment-context-menu__icon">🗑️</span>
          <span className="comment-context-menu__text">Eliminar</span>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CommentContextMenu;
