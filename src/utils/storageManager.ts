// Importar funciones de limpieza
import { cleanAllData, cleanKanbanData } from './clean-project-data';
import clearStorage from './clear-storage';
import clearTheme from './clear-theme';

export interface StorageInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

export interface StorageError {
  type: 'QUOTA_EXCEEDED' | 'DISABLED' | 'CORRUPTED' | 'UNKNOWN';
  message: string;
  originalError?: Error;
}

/**
 * Detecta si un error es relacionado con cuota excedida
 */
export const isQuotaExceededError = (error: Error): boolean => {
  const quotaExceededMessages = [
    'quota exceeded',
    'quota has been exceeded',
    'storage quota exceeded',
    'exceeded the quota',
    'not enough space',
    'disk full',
  ];

  const errorMessage = error.message.toLowerCase();
  const errorName = error.name.toLowerCase();

  return quotaExceededMessages.some(msg => 
    errorMessage.includes(msg) || errorName.includes(msg)
  ) || error.name === 'QuotaExceededError';
};

/**
 * Maneja errores de almacenamiento y proporciona información útil
 */
export const handleStorageError = (error: Error): StorageError => {
  if (isQuotaExceededError(error)) {
    return {
      type: 'QUOTA_EXCEEDED',
      message: 'El almacenamiento local está lleno. Por favor, libera espacio o exporta tus datos.',
      originalError: error,
    };
  }

  if (error.name === 'SecurityError') {
    return {
      type: 'DISABLED',
      message: 'El almacenamiento local está deshabilitado en tu navegador.',
      originalError: error,
    };
  }

  if (error.message.includes('corrupt') || error.message.includes('invalid')) {
    return {
      type: 'CORRUPTED',
      message: 'Los datos almacenados parecen estar corruptos. Se intentará limpiar el almacenamiento.',
      originalError: error,
    };
  }

  return {
    type: 'UNKNOWN',
    message: `Error de almacenamiento: ${error.message}`,
    originalError: error,
  };
};

/**
 * Intenta guardar datos con manejo de errores de cuota
 */
export const safeSetItem = async (key: string, value: string): Promise<{ success: boolean; error?: StorageError }> => {
  try {
    localStorage.setItem(key, value);
    return { success: true };
  } catch (error) {
    const storageError = handleStorageError(error as Error);
    
    if (storageError.type === 'QUOTA_EXCEEDED') {
      // Intentar limpiar datos antiguos y volver a intentar
      const cleanupResult = await cleanupOldData();
      if (cleanupResult.success) {
        try {
          localStorage.setItem(key, value);
          return { success: true };
        } catch (retryError) {
          return { 
            success: false, 
            error: handleStorageError(retryError as Error) 
          };
        }
      }
    }
    
    return { success: false, error: storageError };
  }
};

/**
 * Intenta obtener datos con manejo de errores
 */
export const safeGetItem = (key: string): { success: boolean; data?: string; error?: StorageError } => {
  try {
    const data = localStorage.getItem(key);
    return { success: true, data: data || undefined };
  } catch (error) {
    const storageError = handleStorageError(error as Error);
    return { success: false, error: storageError };
  }
};

/**
 * Limpia datos antiguos para liberar espacio (versión mejorada usando los archivos existentes)
 */
export const cleanupOldData = async (): Promise<{ success: boolean; freedSpace: number }> => {
  try {
    console.log('🧹 Iniciando limpieza automática de datos...');
    
    // Usar la función de limpieza de Kanban existente
    const result = cleanKanbanData();
    
    return { 
      success: result.success, 
      freedSpace: result.spaceFreed 
    };

  } catch (error) {
    console.error('Error durante limpieza:', error);
    return { success: false, freedSpace: 0 };
  }
};

/**
 * Limpieza completa del proyecto (usa clean-project-data.ts)
 */
export const performFullCleanup = (): { success: boolean; details: any } => {
  try {
    console.log('🧹 Iniciando limpieza completa del proyecto...');
    const result = cleanAllData();
    return { success: result.success, details: result };
  } catch (error) {
    console.error('Error en limpieza completa:', error);
    return { success: false, details: null };
  }
};

/**
 * Limpieza solo de datos de Kanban (usa clean-project-data.ts)
 */
export const performKanbanCleanup = (): { success: boolean; details: any } => {
  try {
    console.log('🗂️ Iniciando limpieza de datos Kanban...');
    const result = cleanKanbanData();
    return { success: result.success, details: result };
  } catch (error) {
    console.error('Error en limpieza Kanban:', error);
    return { success: false, details: null };
  }
};

/**
 * Limpieza solo del tema (usa clear-theme.ts)
 */
export const performThemeCleanup = (): { success: boolean } => {
  try {
    console.log('🎨 Limpiando configuración de tema...');
    clearTheme();
    return { success: true };
  } catch (error) {
    console.error('Error limpiando tema:', error);
    return { success: false };
  }
};

/**
 * Limpieza completa del localStorage (usa clear-storage.ts)
 */
export const performStorageCleanup = (): { success: boolean } => {
  try {
    console.log('🗑️ Limpiando localStorage completo...');
    clearStorage();
    return { success: true };
  } catch (error) {
    console.error('Error limpiando storage:', error);
    return { success: false };
  }
};

/**
 * Obtiene información sobre el uso de almacenamiento
 */
export const getStorageUsage = (): StorageInfo => {
  let used = 0;
  
  try {
    // Calcular espacio usado
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        used += key.length + value.length;
      }
    });

    // Estimaciones basadas en navegadores comunes
    const total = 5 * 1024 * 1024; // 5MB es un límite común
    const available = Math.max(0, total - used);
    const percentage = (used / total) * 100;

    return {
      used,
      available,
      total,
      percentage: Math.min(percentage, 100),
    };
  } catch (error) {
    console.error('Error calculando uso de almacenamiento:', error);
    return {
      used: 0,
      available: 0,
      total: 0,
      percentage: 0,
    };
  }
};

/**
 * Verifica si hay suficiente espacio para guardar datos
 */
export const hasEnoughSpace = (dataSize: number): boolean => {
  const storageInfo = getStorageUsage();
  return storageInfo.available > dataSize + (1024 * 1024); // 1MB de margen
};

/**
 * Comprime datos para reducir el tamaño
 */
export const compressData = (data: any): string => {
  try {
    // Remover espacios y saltos de línea innecesarios
    return JSON.stringify(data, null, 0);
  } catch (error) {
    console.error('Error comprimiendo datos:', error);
    return JSON.stringify(data);
  }
};

/**
 * Descomprime datos
 */
export const decompressData = (compressedData: string): any => {
  try {
    return JSON.parse(compressedData);
  } catch (error) {
    console.error('Error descomprimiendo datos:', error);
    throw new Error('Datos corruptos o incompatibles');
  }
};

/**
 * Crea un backup de seguridad antes de operaciones críticas
 */
export const createSafetyBackup = async (data: any): Promise<{ success: boolean; backupKey?: string }> => {
  try {
    const backupKey = `kanban-safety-backup-${Date.now()}`;
    const compressedData = compressData(data);
    
    const result = await safeSetItem(backupKey, compressedData);
    
    if (result.success) {
      // Limpiar backups antiguos (mantener solo los últimos 3)
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('kanban-safety-backup-'))
        .sort()
        .slice(0, -3); // Mantener los últimos 3
      
      backupKeys.forEach(key => localStorage.removeItem(key));
      
      return { success: true, backupKey };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error creando backup de seguridad:', error);
    return { success: false };
  }
};

/**
 * Restaura desde un backup de seguridad
 */
export const restoreFromSafetyBackup = (backupKey: string): { success: boolean; data?: any } => {
  try {
    const result = safeGetItem(backupKey);
    
    if (result.success && result.data) {
      const data = decompressData(result.data);
      return { success: true, data };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error restaurando backup de seguridad:', error);
    return { success: false };
  }
};

/**
 * Monitorea el uso de almacenamiento y emite alertas
 */
export const monitorStorageUsage = (callback: (info: StorageInfo) => void): (() => void) => {
  const checkUsage = () => {
    const info = getStorageUsage();
    callback(info);
  };

  // Verificar inmediatamente
  checkUsage();

  // Verificar cada 30 segundos
  const interval = setInterval(checkUsage, 30000);

  // Verificar cuando cambie el almacenamiento
  const handleStorageChange = () => {
    checkUsage();
  };

  window.addEventListener('storage', handleStorageChange);

  // Función de limpieza
  return () => {
    clearInterval(interval);
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * Obtiene recomendaciones basadas en el uso de almacenamiento
 */
export const getStorageRecommendations = (info: StorageInfo): string[] => {
  const recommendations: string[] = [];

  if (info.percentage > 90) {
    recommendations.push('⚠️ El almacenamiento está casi lleno. Considera exportar tus datos.');
    recommendations.push('💡 Elimina boards antiguos o tareas completadas para liberar espacio.');
  } else if (info.percentage > 75) {
    recommendations.push('📊 El almacenamiento está en un 75% de uso. Es recomendable hacer una limpieza.');
  }

  if (info.used > 2 * 1024 * 1024) { // Más de 2MB
    recommendations.push('🗂️ Tienes muchos datos. Considera crear un backup completo.');
  }

  return recommendations;
};