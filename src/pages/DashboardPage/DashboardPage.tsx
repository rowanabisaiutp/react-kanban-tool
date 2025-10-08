import React, { useMemo, useState } from 'react';
import { useKanban } from '../../hooks/useKanbanHook';
import { UnifiedFilterProvider, useDashboardFilters } from '../../hooks/useUnifiedFilters';
import type { Board } from '../../types';
import { MetricsCards, TasksCompletedChart, TasksByStatusChart, TimeInColumnsChart } from '../../components/dashboard';
import { DashboardFilterInterface } from '../../components/dashboard';
import { UserAvatar } from '../../components/ui';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';

// Componente interno que usa los filtros
const DashboardContent: React.FC = () => {
  const { boards, currentBoard } = useKanban();
  const { filters } = useDashboardFilters();
  const navigate = useNavigate();
  
  // Estado para funcionalidades administrativas
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // Filtrar datos según los filtros del Dashboard
  const filteredData = useMemo(() => {
    let selectedBoard: Board | null = null;
    
    if (filters.boardId) {
      selectedBoard = boards.find(board => board.id === filters.boardId) || null;
    } else {
      selectedBoard = currentBoard;
    }

    if (!selectedBoard) return { tasks: [], boards: [] };

    // Filtrar tareas según todos los filtros
    const filteredTasks = selectedBoard.columns.flatMap(column => 
      column.tasks.filter(task => {
        // Filtrar por estado
        if (filters.status.length > 0 && !filters.status.includes(task.status)) {
          return false;
        }

        // Filtrar por prioridad
        if (filters.priority && task.priority !== filters.priority) {
          return false;
        }

        // Filtrar por asignado
        if (filters.assignee && task.assignee !== filters.assignee) {
          return false;
        }

        // Filtrar por rango de fechas
        if (filters.dateRange.start || filters.dateRange.end) {
          const taskDate = new Date(task.createdAt);
          const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
          const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
          
          if (startDate && taskDate < startDate) return false;
          if (endDate && taskDate > endDate) return false;
        }

        return true;
      })
    );

    return {
      tasks: filteredTasks,
      boards: [selectedBoard]
    };
  }, [boards, currentBoard, filters]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="dashboard-page__title-section">
          <h1 className="dashboard-page__title">📊 Dashboard de Analíticas</h1>
          <p className="dashboard-page__subtitle">
            Métricas y visualizaciones de tu proyecto Kanban
          </p>
        </div>
        <div className="dashboard-page__actions">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/kanban')}
          >
            ← Volver al Tablero
          </Button>
        </div>
      </div>

      <div className="dashboard-page__content">
        <div className="dashboard-page__filters">
          <DashboardFilterInterface />
        </div>

        {/* Sección de Administración */}
        <div className="dashboard-page__admin-section">
          <div className="dashboard-page__admin-header">
            <h2 className="dashboard-page__admin-title">🛠️ Panel de Administración</h2>
            <p className="dashboard-page__admin-subtitle">Gestiona tu equipo y configuración</p>
          </div>
          
          <div className="dashboard-page__admin-grid">
            {/* Gestión de Usuarios */}
            <div className="dashboard-page__admin-card" onClick={() => setShowUserManagement(true)}>
              <div className="dashboard-page__admin-card-icon">👥</div>
              <h3 className="dashboard-page__admin-card-title">Gestión de Usuarios</h3>
              <p className="dashboard-page__admin-card-description">Administra miembros del equipo y permisos</p>
              <div className="dashboard-page__admin-card-stats">
                <span className="dashboard-page__admin-card-stat">
                  <strong>8</strong> usuarios activos
                </span>
              </div>
            </div>

            {/* Configuración del Sistema */}
            <div className="dashboard-page__admin-card" onClick={() => setShowSystemSettings(true)}>
              <div className="dashboard-page__admin-card-icon">⚙️</div>
              <h3 className="dashboard-page__admin-card-title">Configuración</h3>
              <p className="dashboard-page__admin-card-description">Ajustes del sistema y preferencias</p>
              <div className="dashboard-page__admin-card-stats">
                <span className="dashboard-page__admin-card-stat">
                  <strong>{boards.length}</strong> tableros
                </span>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="dashboard-page__admin-card" onClick={() => setShowQuickActions(true)}>
              <div className="dashboard-page__admin-card-icon">⚡</div>
              <h3 className="dashboard-page__admin-card-title">Acciones Rápidas</h3>
              <p className="dashboard-page__admin-card-description">Herramientas y acciones frecuentes</p>
              <div className="dashboard-page__admin-card-stats">
                <span className="dashboard-page__admin-card-stat">
                  <strong>12</strong> tareas pendientes
                </span>
              </div>
            </div>

            {/* Estadísticas Avanzadas */}
            <div className="dashboard-page__admin-card" onClick={() => setShowAdvancedStats(true)}>
              <div className="dashboard-page__admin-card-icon">📊</div>
              <h3 className="dashboard-page__admin-card-title">Estadísticas</h3>
              <p className="dashboard-page__admin-card-description">Análisis detallado y reportes</p>
              <div className="dashboard-page__admin-card-stats">
                <span className="dashboard-page__admin-card-stat">
                  <strong>95%</strong> productividad
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-page__metrics">
          <MetricsCards tasks={filteredData.tasks} />
        </div>

        <div className="dashboard-page__charts">
          <div className="dashboard-page__chart-row">
            <TasksCompletedChart tasks={filteredData.tasks} />
            <TasksByStatusChart tasks={filteredData.tasks} />
          </div>
          <div className="dashboard-page__chart-row">
            <TimeInColumnsChart tasks={filteredData.tasks} />
          </div>
        </div>
      </div>

      {/* Modales de Administración */}
      {showUserManagement && (
        <Modal
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
          title="👥 Gestión de Usuarios"
          size="lg"
        >
          <div className="dashboard-page__modal-content">
            <div className="dashboard-page__user-list">
              <h3>Miembros del Equipo</h3>
              <div className="dashboard-page__users-grid">
                {['Ana García', 'Carlos López', 'María Rodríguez', 'Luis Martínez', 'Sofia Chen', 'Diego Fernández', 'Elena Ruiz', 'Pablo Torres'].map((user) => (
                  <div key={user} className="dashboard-page__user-item">
                    <UserAvatar userName={user} size="md" />
                    <div className="dashboard-page__user-info">
                      <span className="dashboard-page__user-name">{user}</span>
                      <span className="dashboard-page__user-role">Miembro del equipo</span>
                    </div>
                    <div className="dashboard-page__user-actions">
                      <Button variant="secondary" size="sm">Editar</Button>
                      <Button variant="danger" size="sm">Eliminar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-page__modal-actions">
              <Button variant="primary" size="md">+ Agregar Usuario</Button>
              <Button variant="secondary" size="md">Invitar por Email</Button>
            </div>
          </div>
        </Modal>
      )}

      {showSystemSettings && (
        <Modal
          isOpen={showSystemSettings}
          onClose={() => setShowSystemSettings(false)}
          title="⚙️ Configuración del Sistema"
          size="lg"
        >
          <div className="dashboard-page__modal-content">
            <div className="dashboard-page__settings-section">
              <h3>Configuración General</h3>
              <div className="dashboard-page__setting-item">
                <label>Nombre de la Organización</label>
                <input type="text" defaultValue="Mi Empresa" className="dashboard-page__setting-input" />
              </div>
              <div className="dashboard-page__setting-item">
                <label>Zona Horaria</label>
                <select className="dashboard-page__setting-input">
                  <option>UTC-5 (Colombia)</option>
                  <option>UTC-6 (México)</option>
                  <option>UTC-3 (Argentina)</option>
                </select>
              </div>
              <div className="dashboard-page__setting-item">
                <label>Idioma</label>
                <select className="dashboard-page__setting-input">
                  <option>Español</option>
                  <option>English</option>
                  <option>Português</option>
                </select>
              </div>
            </div>
            <div className="dashboard-page__settings-section">
              <h3>Notificaciones</h3>
              <div className="dashboard-page__setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Notificaciones por email
                </label>
              </div>
              <div className="dashboard-page__setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Notificaciones push
                </label>
              </div>
            </div>
            <div className="dashboard-page__modal-actions">
              <Button variant="primary" size="md">Guardar Cambios</Button>
              <Button variant="secondary" size="md">Restaurar</Button>
            </div>
          </div>
        </Modal>
      )}

      {showQuickActions && (
        <Modal
          isOpen={showQuickActions}
          onClose={() => setShowQuickActions(false)}
          title="⚡ Acciones Rápidas"
          size="md"
        >
          <div className="dashboard-page__modal-content">
            <div className="dashboard-page__quick-actions">
              <Button variant="primary" size="lg" className="dashboard-page__quick-action">
                📋 Crear Tarea Rápida
              </Button>
              <Button variant="secondary" size="lg" className="dashboard-page__quick-action">
                📊 Generar Reporte
              </Button>
              <Button variant="secondary" size="lg" className="dashboard-page__quick-action">
                📧 Enviar Recordatorio
              </Button>
              <Button variant="secondary" size="lg" className="dashboard-page__quick-action">
                🔄 Sincronizar Datos
              </Button>
              <Button variant="secondary" size="lg" className="dashboard-page__quick-action">
                📤 Exportar Datos
              </Button>
              <Button variant="secondary" size="lg" className="dashboard-page__quick-action">
                🗑️ Limpiar Completadas
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showAdvancedStats && (
        <Modal
          isOpen={showAdvancedStats}
          onClose={() => setShowAdvancedStats(false)}
          title="📊 Estadísticas Avanzadas"
          size="xl"
        >
          <div className="dashboard-page__modal-content">
            <div className="dashboard-page__stats-grid">
              <div className="dashboard-page__stat-card">
                <h4>Productividad del Equipo</h4>
                <div className="dashboard-page__stat-value">95%</div>
                <div className="dashboard-page__stat-trend">↗️ +5% este mes</div>
              </div>
              <div className="dashboard-page__stat-card">
                <h4>Tiempo Promedio por Tarea</h4>
                <div className="dashboard-page__stat-value">2.3 días</div>
                <div className="dashboard-page__stat-trend">↘️ -0.5 días</div>
              </div>
              <div className="dashboard-page__stat-card">
                <h4>Tareas Completadas</h4>
                <div className="dashboard-page__stat-value">247</div>
                <div className="dashboard-page__stat-trend">↗️ +23 esta semana</div>
              </div>
              <div className="dashboard-page__stat-card">
                <h4>Eficiencia del Flujo</h4>
                <div className="dashboard-page__stat-value">87%</div>
                <div className="dashboard-page__stat-trend">↗️ +3% este mes</div>
              </div>
            </div>
            <div className="dashboard-page__modal-actions">
              <Button variant="primary" size="md">📊 Ver Reporte Completo</Button>
              <Button variant="secondary" size="md">📤 Exportar Datos</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { boards } = useKanban();

  return (
    <UnifiedFilterProvider boards={boards}>
      <DashboardContent />
    </UnifiedFilterProvider>
  );
};

export default DashboardPage;
