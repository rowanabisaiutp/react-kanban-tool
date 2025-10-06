import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook para manejo de foco en modales y componentes complejos
 */
export const useFocusManagement = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElements = useRef<NodeListOf<HTMLElement> | null>(null);

  // Obtener elementos enfocables dentro del contenedor
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return null;
    
    return containerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    ) as NodeListOf<HTMLElement>;
  }, []);

  // Enfocar el primer elemento
  const focusFirstElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements && elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  // Enfocar el último elemento
  const focusLastElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements && elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Manejar navegación con Tab
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current || !containerRef.current.contains(e.target as Node)) {
      return;
    }

    const elements = getFocusableElements();
    if (!elements || elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = e.target as HTMLElement;

    if (e.shiftKey) {
      // Shift + Tab: navegar hacia atrás
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: navegar hacia adelante
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);

  // Manejar teclas de escape
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (containerRef.current && containerRef.current.contains(e.target as Node)) {
      // El escape se manejará en el componente padre
      return;
    }
  }, []);

  // Configurar cuando el modal se activa
  useEffect(() => {
    if (!isActive) return;

    // Guardar el elemento activo anterior
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Actualizar elementos enfocables
    focusableElements.current = getFocusableElements();

    // Agregar event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Enfocar el primer elemento después de un pequeño delay
    // para asegurar que el modal esté completamente renderizado
    const timer = setTimeout(focusFirstElement, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, focusFirstElement, handleTabKey, handleEscapeKey, getFocusableElements]);

  // Restaurar foco cuando el modal se desactiva
  useEffect(() => {
    if (!isActive && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isActive]);

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  };
};

/**
 * Hook para manejo de foco en listas navegables por teclado
 */
export const useKeyboardNavigation = <T>(
  items: T[],
  onSelect?: (item: T, index: number) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length && onSelect) {
          onSelect(items[focusedIndex], focusedIndex);
        }
        break;
      
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [items, focusedIndex, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
};

/**
 * Hook para anuncios a lectores de pantalla
 */
export const useScreenReaderAnnouncements = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover después de un tiempo
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};

/**
 * Hook para verificar si el usuario prefiere movimiento reducido
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook para verificar el contraste de colores
 */
export const useColorContrast = () => {
  const checkContrast = useCallback((foreground: string, background: string) => {
    // Función simplificada para verificar contraste
    // En una implementación real, se usaría una librería como color-contrast
    const getLuminance = (color: string) => {
      // Convertir hex a RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      // Aplicar gamma correction
      const [rs, gs, bs] = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
      ratio: contrast,
      meetsAA: contrast >= 4.5,
      meetsAAA: contrast >= 7,
    };
  }, []);

  return { checkContrast };
};
