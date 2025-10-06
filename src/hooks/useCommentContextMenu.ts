import { useState, useCallback, useRef, useEffect } from 'react';

interface CommentContextMenuPosition {
  top: number;
  left?: number;
  right?: number;
}

interface CommentContextMenuState {
  isOpen: boolean;
  position: CommentContextMenuPosition | null;
  commentId: string | null;
}

export const useCommentContextMenu = () => {
  const [menuState, setMenuState] = useState<CommentContextMenuState>({
    isOpen: false,
    position: null,
    commentId: null,
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  const showMenu = useCallback((event: React.MouseEvent, commentId: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calcular posición
    const menuWidth = 150;
    const menuHeight = 80;
    
    let position: CommentContextMenuPosition;
    
    // Verificar si hay espacio a la derecha
    if (rect.right + menuWidth < viewportWidth - 10) {
      position = {
        top: rect.top + 10,
        left: rect.right + 5,
      };
    } else if (rect.left - menuWidth > 10) {
      // Verificar si hay espacio a la izquierda
      position = {
        top: rect.top + 10,
        right: viewportWidth - rect.left + 5,
      };
    } else {
      // Centrar horizontalmente
      position = {
        top: rect.top + 10,
        left: Math.max(10, Math.min(rect.left, viewportWidth - menuWidth - 10)),
      };
    }
    
    // Ajustar posición vertical si se sale de la pantalla
    if (position.top + menuHeight > viewportHeight - 10) {
      position.top = Math.max(10, viewportHeight - menuHeight - 10);
    }

    setMenuState({
      isOpen: true,
      position,
      commentId,
    });
  }, []);

  const hideMenu = useCallback(() => {
    setMenuState({
      isOpen: false,
      position: null,
      commentId: null,
    });
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideMenu();
      }
    };

    if (menuState.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuState.isOpen, hideMenu]);

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideMenu();
      }
    };

    if (menuState.isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [menuState.isOpen, hideMenu]);

  return {
    menuState,
    menuRef,
    showMenu,
    hideMenu,
  };
};
