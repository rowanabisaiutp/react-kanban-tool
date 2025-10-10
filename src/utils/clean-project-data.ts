import { logger } from './logger';

/**
 * Script utilitario para limpiar completamente todos los datos del proyecto Kanban
 * Incluye localStorage, sessionStorage, y datos específicos de la aplicación
 */
interface CleanupOptions {
  localStorage?: boolean;
  sessionStorage?: boolean;
  kanbanData?: boolean;
  themeData?: boolean;
  userPreferences?: boolean;
  backups?: boolean;
  tempData?: boolean;
}
interface CleanupResult {
  success: boolean;
  itemsRemoved: number;
  spaceFreed: number;
  errors: string[];
  details: {
    localStorage?: { items: number; space: number };
    sessionStorage?: { items: number; space: number };
    kanbanData?: { items: number; space: number };
    themeData?: { items: number; space: number };
    userPreferences?: { items: number; space: number };
    backups?: { items: number; space: number };
    tempData?: { items: number; space: number };
  };
}

const cleanProjectData = (options: CleanupOptions = {}): CleanupResult => {
  const defaultOptions: CleanupOptions = {
    localStorage: true,
    sessionStorage: true,
    kanbanData: true,
    themeData: true,
    userPreferences: true,
    backups: true,
    tempData: true,
    ...options
  };

  const result: CleanupResult = {
    success: true,
    itemsRemoved: 0,
    spaceFreed: 0,
    errors: [],
    details: {}
  };

  // Función para limpiar un storage específico
  const cleanStorage = (storage: Storage, storageName: string, keyPatterns: string[] = []) => {
    const storageResult = { items: 0, space: 0 };
    
    try {
      const keysToRemove: string[] = [];
      
      // Si hay patrones específicos, solo remover esas claves
      if (keyPatterns.length > 0) {
        Object.keys(storage).forEach(key => {
          if (keyPatterns.some(pattern => key.includes(pattern))) {
            keysToRemove.push(key);
          }
        });
      } else {
        // Remover todas las claves
        keysToRemove.push(...Object.keys(storage));
      }

      // Remover claves y calcular espacio liberado
      keysToRemove.forEach(key => {
        const value = storage.getItem(key);
        if (value) {
          storageResult.space += key.length + value.length;
          storage.removeItem(key);
          storageResult.items++;
        }
      });

      logger.debug(`🧹 ${storageName} limpiado: ${storageResult.items} elementos, ${(storageResult.space / 1024).toFixed(2)} KB liberados`);
      
    } catch (error) {
      const errorMsg = `Error limpiando ${storageName}: ${error}`;
      logger.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
      result.success = false;
    }

    return storageResult;
  };

  // Calcular espacio total antes de limpiar
  const calculateStorageSize = (storage: Storage): number => {
    let totalSize = 0;
    Object.keys(storage).forEach(key => {
      const value = storage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    });
    return totalSize;
  };

  const beforeLocalStorageSize = calculateStorageSize(localStorage);
  const beforeSessionStorageSize = calculateStorageSize(sessionStorage);

  // 1. Limpiar localStorage
  if (defaultOptions.localStorage) {
    const localStoragePatterns: string[] = [];
    
    if (defaultOptions.kanbanData) {
      localStoragePatterns.push('kanban', 'board', 'task', 'column');
    }
    
    if (defaultOptions.themeData) {
      localStoragePatterns.push('theme', 'dark', 'light');
    }
    
    if (defaultOptions.userPreferences) {
      localStoragePatterns.push('user', 'preference', 'setting');
    }
    
    if (defaultOptions.backups) {
      localStoragePatterns.push('backup', 'safety');
    }
    
    if (defaultOptions.tempData) {
      localStoragePatterns.push('temp', 'cache', 'session');
    }

    result.details.localStorage = cleanStorage(
      localStorage, 
      'localStorage', 
      localStoragePatterns.length > 0 ? localStoragePatterns : undefined
    );
  }

  // 2. Limpiar sessionStorage
  if (defaultOptions.sessionStorage) {
    result.details.sessionStorage = cleanStorage(sessionStorage, 'sessionStorage');
  }

  // 3. Limpiar datos específicos de Kanban
  if (defaultOptions.kanbanData) {
    const kanbanKeys = [
      'kanban-boards',
      'kanban-current-board',
      'kanban-auto-save',
      'kanban-backup-',
      'kanban-temp-',
      'kanban-safety-backup-',
      'kanban-data-',
      'kanban-state-',
      'kanban-settings'
    ];

    let kanbanItems = 0;
    let kanbanSpace = 0;

    kanbanKeys.forEach(keyPattern => {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(keyPattern)) {
          const value = localStorage.getItem(key);
          if (value) {
            kanbanSpace += key.length + value.length;
            localStorage.removeItem(key);
            kanbanItems++;
          }
        }
      });
    });

    result.details.kanbanData = { items: kanbanItems, space: kanbanSpace };
    logger.debug(`🗂️ Datos Kanban limpiados: ${kanbanItems} elementos, ${(kanbanSpace / 1024).toFixed(2)} KB liberados`);
  }

  // 4. Limpiar datos de tema
  if (defaultOptions.themeData) {
    const themeKeys = ['theme', 'dark-mode', 'light-mode', 'color-scheme'];
    let themeItems = 0;
    let themeSpace = 0;

    themeKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        themeSpace += key.length + value.length;
        localStorage.removeItem(key);
        themeItems++;
      }
    });

    result.details.themeData = { items: themeItems, space: themeSpace };
    logger.debug(`🎨 Datos de tema limpiados: ${themeItems} elementos, ${(themeSpace / 1024).toFixed(2)} KB liberados`);
  }

  // 5. Limpiar preferencias de usuario
  if (defaultOptions.userPreferences) {
    const preferenceKeys = ['user-preferences', 'app-settings', 'ui-settings'];
    let preferenceItems = 0;
    let preferenceSpace = 0;

    preferenceKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        preferenceSpace += key.length + value.length;
        localStorage.removeItem(key);
        preferenceItems++;
      }
    });

    result.details.userPreferences = { items: preferenceItems, space: preferenceSpace };
    logger.debug(`👤 Preferencias de usuario limpiadas: ${preferenceItems} elementos, ${(preferenceSpace / 1024).toFixed(2)} KB liberados`);
  }

  // 6. Limpiar backups
  if (defaultOptions.backups) {
    let backupItems = 0;
    let backupSpace = 0;

    Object.keys(localStorage).forEach(key => {
      if (key.includes('backup') || key.includes('safety')) {
        const value = localStorage.getItem(key);
        if (value) {
          backupSpace += key.length + value.length;
          localStorage.removeItem(key);
          backupItems++;
        }
      }
    });

    result.details.backups = { items: backupItems, space: backupSpace };
    logger.debug(`💾 Backups limpiados: ${backupItems} elementos, ${(backupSpace / 1024).toFixed(2)} KB liberados`);
  }

  // 7. Limpiar datos temporales
  if (defaultOptions.tempData) {
    let tempItems = 0;
    let tempSpace = 0;

    Object.keys(localStorage).forEach(key => {
      if (key.includes('temp') || key.includes('cache') || key.includes('session')) {
        const value = localStorage.getItem(key);
        if (value) {
          tempSpace += key.length + value.length;
          localStorage.removeItem(key);
          tempItems++;
        }
      }
    });

    result.details.tempData = { items: tempItems, space: tempSpace };
    logger.debug(`🗑️ Datos temporales limpiados: ${tempItems} elementos, ${(tempSpace / 1024).toFixed(2)} KB liberados`);
  }

  // Calcular totales
  Object.values(result.details).forEach(detail => {
    if (detail) {
      result.itemsRemoved += detail.items;
      result.spaceFreed += detail.space;
    }
  });

  const afterLocalStorageSize = calculateStorageSize(localStorage);
  const afterSessionStorageSize = calculateStorageSize(sessionStorage);

  // Resultado final
  if (result.success) {
    logger.info('✅ ¡Limpieza completada exitosamente!');
    logger.debug(`📊 Total de elementos removidos: ${result.itemsRemoved}`);
    logger.debug(`💾 Espacio total liberado: ${(result.spaceFreed / 1024).toFixed(2)} KB`);
    logger.debug(`📉 localStorage: ${(beforeLocalStorageSize / 1024).toFixed(2)} KB → ${(afterLocalStorageSize / 1024).toFixed(2)} KB`);
    logger.debug(`📉 sessionStorage: ${(beforeSessionStorageSize / 1024).toFixed(2)} KB → ${(afterSessionStorageSize / 1024).toFixed(2)} KB`);
    
    if (result.errors.length > 0) {
      logger.warn(`⚠️ Se encontraron ${result.errors.length} errores menores durante la limpieza`);
    }
  } else {
    logger.error('❌ La limpieza se completó con errores');
    logger.debug(`📊 Elementos removidos: ${result.itemsRemoved}`);
    logger.debug(`💾 Espacio liberado: ${(result.spaceFreed / 1024).toFixed(2)} KB`);
    logger.error(`❌ Errores encontrados: ${result.errors.length}`);
  }

  return result;
};

// Función para limpieza completa (todas las opciones)
const cleanAllData = (): CleanupResult => {
  logger.info('🧹 Iniciando limpieza completa de datos del proyecto');
  return cleanProjectData();
};

// Función para limpieza selectiva
const cleanKanbanData = (): CleanupResult => {
  logger.info('🗂️ Limpiando solo datos de Kanban');
  return cleanProjectData({
    localStorage: false,
    sessionStorage: false,
    kanbanData: true,
    themeData: false,
    userPreferences: false,
    backups: false,
    tempData: false
  });
};

// Función para limpieza de solo tema
const cleanThemeData = (): CleanupResult => {
  logger.info('🎨 Limpiando solo datos de tema');
  return cleanProjectData({
    localStorage: false,
    sessionStorage: false,
    kanbanData: false,
    themeData: true,
    userPreferences: false,
    backups: false,
    tempData: false
  });
};

export default cleanProjectData;
export { cleanAllData, cleanKanbanData, cleanThemeData };
export type { CleanupOptions, CleanupResult };