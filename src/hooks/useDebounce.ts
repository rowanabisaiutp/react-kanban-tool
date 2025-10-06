import React, { useState, useEffect } from 'react';

/**
 * Hook personalizado para implementar debounce
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (por defecto 300ms)
 * @returns Valor debounced
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de funciones
 * @param callback - Función a debounce
 * @param delay - Delay en milisegundos
 * @returns Función debounced
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const callbackRef = React.useRef(callback);

  // Mantener la referencia del callback actualizada
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Limpiar el timeout cuando el componente se desmonta
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = React.useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );

  return debouncedCallback;
};
