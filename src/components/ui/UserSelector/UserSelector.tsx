import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { teamMembersDetailed } from '../../../data/mockData';
import './UserSelector.css';

interface UserSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userName: string | null) => void;
  currentAssignee?: string;
  position?: { x: number; y: number };
}

const UserSelector: React.FC<UserSelectorProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentAssignee,
  position = { x: 0, y: 0 }
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(currentAssignee || null);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleUserSelect = (userName: string | null) => {
    setSelectedUser(userName);
    onSelectUser(userName);
    onClose();
  };

  if (!isOpen) return null;

  // Calcular posición inteligente para el selector
  const getSelectorPosition = () => {
    const selectorWidth = 280;
    const selectorHeight = 400;
    const margin = 32;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calcular posición horizontal
    let left = position.x;
    if (left + selectorWidth > viewportWidth - margin) {
      left = position.x - selectorWidth;
    }
    if (left < margin) {
      left = Math.max(margin, (viewportWidth - selectorWidth) / 2);
    }
    
    // Validación estricta horizontal - NUNCA salirse
    left = Math.max(margin, Math.min(left, viewportWidth - selectorWidth - margin));
    
    // Calcular posición vertical
    let top = position.y;
    if (top + selectorHeight > viewportHeight - margin) {
      top = position.y - selectorHeight;
    }
    if (top < margin) {
      top = margin;
    }
    
    // Validación estricta vertical - NUNCA salirse
    top = Math.max(margin, Math.min(top, viewportHeight - selectorHeight - margin));
    
    return { left, top };
  };

  const selectorPosition = getSelectorPosition();

  return createPortal(
    <div 
      ref={selectorRef}
      className="user-selector" 
      style={{ 
        position: 'fixed', 
        left: `${selectorPosition.left}px`, 
        top: `${selectorPosition.top}px`,
        '--selector-left': `${selectorPosition.left}px`,
        '--selector-top': `${selectorPosition.top}px`
      } as React.CSSProperties}
    >
      <div className="user-selector__header">
        <h3 className="user-selector__title">Reasignar tarea</h3>
        <button 
          className="user-selector__close-btn"
          onClick={onClose}
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      <div className="user-selector__content">
        {/* Opción para desasignar */}
        <button
          type="button"
          className={`user-selector__option ${!selectedUser ? 'user-selector__option--selected' : ''}`}
          onClick={() => handleUserSelect(null)}
        >
          <div className="user-selector__avatar user-selector__avatar--unassigned">
            ✕
          </div>
          <div className="user-selector__info">
            <span className="user-selector__name">Sin asignar</span>
            <span className="user-selector__status">Quitar asignación</span>
          </div>
        </button>

        {/* Lista de usuarios */}
        {teamMembersDetailed.map((user) => (
          <button
            key={user.name}
            type="button"
            className={`user-selector__option ${selectedUser === user.name ? 'user-selector__option--selected' : ''}`}
            onClick={() => handleUserSelect(user.name)}
          >
            <div className={`user-selector__avatar user-selector__avatar--${user.status}`}>
              {user.avatar}
            </div>
            <div className="user-selector__info">
              <span className="user-selector__name">{user.name}</span>
              <span className="user-selector__status" data-status={user.status}>
                {user.status === 'online' ? '🟢 En línea' : 
                 user.status === 'busy' ? '🔴 Ocupado' : 
                 user.status === 'away' ? '🟡 Ausente' : '⚫ Desconectado'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default UserSelector;
