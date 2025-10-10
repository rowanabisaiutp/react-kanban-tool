import React, { useEffect, useRef } from 'react';
import type { ModalProps } from '../../../types';
import { useFocusManagement } from '../../../hooks/useFocusManagement';
import { useScreenReaderAnnouncements } from '../../../hooks/useFocusManagement';
import './Modal.css';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  title,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) => {
  const { containerRef, focusFirstElement } = useFocusManagement(isOpen);
  const { announce } = useScreenReaderAnnouncements();
  const modalId = useRef(`modal-${crypto.randomUUID()}`);

  const hasOpenedRef = useRef(false);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Solo enfocar el primer elemento la primera vez que se abre
      if (!hasOpenedRef.current) {
        announce(`Modal abierto${title ? `: ${title}` : ''}`, 'polite');
        setTimeout(focusFirstElement, 100);
        hasOpenedRef.current = true;
      }
    } else {
      hasOpenedRef.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalLabel = ariaLabel || title || 'Modal';
  const modalDescription = ariaDescribedBy || undefined;

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${modalId.current}-title` : undefined}
      aria-describedby={modalDescription}
      aria-label={!title ? modalLabel : undefined}
    >
      <div 
        ref={containerRef}
        className={`modal modal--${size}`}
        role="document"
      >
        <div className="modal-content">
          {title && (
            <h2 
              id={`${modalId.current}-title`}
              className="modal-title sr-only"
            >
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
