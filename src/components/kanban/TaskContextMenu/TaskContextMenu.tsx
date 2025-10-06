import React from 'react';
import { createPortal } from 'react-dom';
import { 
  Pencil, Copy, FileEdit, Zap, CheckCircle, Archive, Trash2 
} from 'lucide-react';
import type { Task } from '../../../types';
import './TaskContextMenu.css';

interface TaskContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: Task) => void;
  onArchive: (taskId: string) => void;
  onMove: (taskId: string, newStatus: string) => void;
}

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
  isOpen, position, task, onClose, onEdit, onDelete, onDuplicate, onArchive, onMove
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const menuItems = [
    { icon: <Pencil size={16} />, text: 'Editar tarea', action: () => { onEdit(task); onClose(); } },
    { icon: <Copy size={16} />, text: 'Duplicar tarea', action: () => { onDuplicate(task); onClose(); } },
    { separator: true },
    { icon: <FileEdit size={16} />, text: 'Mover a Por Hacer', action: () => { onMove(task.id, 'todo'); onClose(); } },
    { icon: <Zap size={16} />, text: 'Mover a En Progreso', action: () => { onMove(task.id, 'in-progress'); onClose(); } },
    { icon: <CheckCircle size={16} />, text: 'Mover a Terminado', action: () => { onMove(task.id, 'done'); onClose(); } },
    { separator: true },
    { icon: <Archive size={16} />, text: 'Archivar tarea', action: () => { onArchive(task.id); onClose(); } },
    { icon: <Trash2 size={16} />, text: 'Eliminar tarea', action: () => { onDelete(task.id); onClose(); }, danger: true }
  ];

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calcular posición inteligente para el menú contextual
  const getMenuPosition = () => {
    const menuWidth = 280; // Ancho máximo del menú
    const menuHeight = 400; // Altura estimada del menú
    const margin = 32; // Margen mínimo desde los bordes
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calcular posición horizontal
    let left = position.x;
    if (left + menuWidth > viewportWidth - margin) {
      left = position.x - menuWidth;
    }
    if (left < margin) {
      left = Math.max(margin, (viewportWidth - menuWidth) / 2);
    }
    
    // Validación estricta horizontal - NUNCA salirse
    left = Math.max(margin, Math.min(left, viewportWidth - menuWidth - margin));
    
    // Calcular posición vertical
    let top = position.y;
    if (top + menuHeight > viewportHeight - margin) {
      top = position.y - menuHeight;
    }
    if (top < margin) {
      top = margin;
    }
    
    // Validación estricta vertical - NUNCA salirse
    top = Math.max(margin, Math.min(top, viewportHeight - menuHeight - margin));
    
    return { left, top };
  };

  const menuPosition = getMenuPosition();

  const menuPortal = createPortal(
    <div 
      ref={menuRef}
      className="task-context-menu" 
      style={{ 
        position: 'fixed', 
        left: `${menuPosition.left}px`, 
        top: `${menuPosition.top}px`,
        '--menu-left': `${menuPosition.left}px`,
        '--menu-top': `${menuPosition.top}px`
      } as React.CSSProperties}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menuItems.map((item, index) => 
        item.separator ? (
          <div key={`sep-${index}`} className="task-context-menu__separator" />
        ) : (
          <div key={`item-${index}`}>
            <button 
              type="button"
              className={`task-context-menu__item ${item.danger ? 'task-context-menu__item--danger' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.action?.();
              }}
            >
              <span className="task-context-menu__icon">{item.icon}</span>
              <span className="task-context-menu__text">{item.text}</span>
            </button>
          </div>
        )
      )}
    </div>,
    document.body
  );

  return menuPortal;
};

export default TaskContextMenu;
