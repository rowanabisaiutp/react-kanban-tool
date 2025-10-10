import React, { useState, useCallback } from 'react';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { 
  getStorageUsage, 
  cleanupOldData, 
  getStorageRecommendations,
  monitorStorageUsage,
  type StorageInfo 
} from '../../../utils/storageManager';
import { useNotificationSystem } from '../../../hooks/useNotifications';
import { logger } from '../../../utils/logger';
import './DataManager.css';

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const { boards } = useKanbanStore();
  const { showSuccess, showError } = useNotificationSystem();
  const [storageInfo, setStorageInfo] = useState<StorageInfo>(getStorageUsage());
  const [isCleaning, setIsCleaning] = useState(false);

  // Monitorear uso de almacenamiento
  React.useEffect(() => {
    if (!isOpen) return;
    
    const cleanup = monitorStorageUsage((info) => {
      setStorageInfo(info);
    });

    return cleanup;
  }, [isOpen]);

  // Exportar datos - FUNCIONALIDAD DESHABILITADA
  const handleExport = useCallback(async () => {
    showError('Función no disponible', 'La funcionalidad de exportación no está implementada');
  }, [showError]);

  // Importar datos - FUNCIONALIDAD DESHABILITADA
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    showError('Función no disponible', 'La funcionalidad de importación no está implementada');
    event.target.value = '';
  }, [showError]);

  // Limpiar almacenamiento
  const handleCleanup = useCallback(async () => {
    setIsCleaning(true);
    try {
      const result = await cleanupOldData();
      
      if (result.success) {
        const freedMB = (result.freedSpace / (1024 * 1024)).toFixed(2);
        showSuccess('Limpieza completada', `Se liberaron ${freedMB} MB de espacio`);
        
        // Actualizar información de almacenamiento
        setStorageInfo(getStorageUsage());
      } else {
        showError('Error de limpieza', 'No se pudo limpiar el almacenamiento');
      }
    } catch (error) {
      showError('Error de limpieza', 'Error inesperado durante la limpieza');
      logger.error('Error limpiando:', error);
    } finally {
      setIsCleaning(false);
    }
  }, [showSuccess, showError]);

  // Generar reporte - FUNCIONALIDAD DESHABILITADA
  const handleGenerateReport = useCallback(() => {
    showError('Función no disponible', 'La funcionalidad de reportes no está implementada');
  }, [showError]);

  if (!isOpen) return null;

  const recommendations = getStorageRecommendations(storageInfo);
  const storagePercentage = Math.round(storageInfo.percentage);

  return (
    <div className="data-manager-overlay" onClick={onClose}>
      <div className="data-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="data-manager-header">
          <h2>🗂️ Gestión de Datos</h2>
          <button className="data-manager-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="data-manager-content">
          {/* Información de Almacenamiento */}
          <section className="storage-info">
            <h3>📊 Uso de Almacenamiento</h3>
            <div className="storage-bar">
              <div 
                className="storage-fill" 
                style={{ width: `${storagePercentage}%` }}
              />
              <span className="storage-text">
                {storagePercentage}% usado ({Math.round(storageInfo.used / 1024)} KB / {Math.round(storageInfo.total / 1024)} KB)
              </span>
            </div>
            
            {recommendations.length > 0 && (
              <div className="storage-recommendations">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation">
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Exportar Datos */}
          <section className="export-section">
            <h3>📤 Exportar Datos</h3>
            <div className="section-content">
              <p>Exporta todos tus boards y tareas como archivo JSON.</p>
              <div className="export-stats">
                <div>📋 Boards: {boards.length}</div>
                <div>📊 Tareas: {boards.reduce((total, board) => 
                  total + board.columns.reduce((colTotal, column) => colTotal + column.tasks.length, 0), 0
                )}</div>
              </div>
              <button 
                className="export-button"
                onClick={handleExport}
                disabled={boards.length === 0}
              >
                📥 Descargar JSON
              </button>
            </div>
          </section>

          {/* Importar Datos */}
          <section className="import-section">
            <h3>📥 Importar Datos</h3>
            <div className="section-content">
              <p>Importa datos desde un archivo JSON exportado previamente.</p>
              <div className="import-input">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  id="import-file"
                  className="file-input"
                />
                <label htmlFor="import-file" className="import-label">
                  📂 Seleccionar Archivo JSON
                </label>
              </div>
            </div>
          </section>

          {/* Limpiar Almacenamiento */}
          <section className="cleanup-section">
            <h3>🧹 Limpiar Almacenamiento</h3>
            <div className="section-content">
              <p>Elimina datos temporales y backups antiguos para liberar espacio.</p>
              <button 
                className="cleanup-button"
                onClick={handleCleanup}
                disabled={isCleaning}
              >
                {isCleaning ? '⏳ Limpiando...' : '🗑️ Limpiar Ahora'}
              </button>
            </div>
          </section>

          {/* Generar Reporte */}
          <section className="report-section">
            <h3>📈 Generar Reporte</h3>
            <div className="section-content">
              <p>Genera un reporte detallado de todos tus datos.</p>
              <button 
                className="report-button"
                onClick={handleGenerateReport}
                disabled={boards.length === 0}
              >
                📊 Descargar Reporte
              </button>
            </div>
          </section>
        </div>

        <div className="data-manager-footer">
          <button className="cancel-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManager;







