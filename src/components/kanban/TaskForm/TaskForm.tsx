import React, { useState, useEffect } from 'react';
import type { Task, TaskFormData, TaskPriority, TaskStatus, Subtask } from '../../../types';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { useNotificationSystem } from '../../../hooks/useNotifications';
import { teamMembers } from '../../../data/mockData';
import SubtasksList from '../SubtasksList';
import './TaskForm.css';

interface TaskFormProps {
  onClose: () => void;
  editingTask?: Task | null;
  columnStatus?: TaskStatus;
  columnId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onClose, 
  editingTask = null, 
  columnStatus = 'todo',
  columnId
}) => {
  const { addTask, updateTask } = useKanbanStore();
  const { showInfo } = useNotificationSystem();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: undefined,
    assignees: [],
    tags: [],
    status: columnStatus,
    startDate: undefined,
    dueDate: undefined,
    estimatedHours: undefined
  });
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [errors, setErrors] = useState<{ 
    title?: string; 
    description?: string; 
    dueDate?: string; 
    estimatedHours?: string; 
  }>({});
  const [tagInput, setTagInput] = useState('');
  const isEditing = !!editingTask;

  // Cargar datos de la tarea cuando se está editando (solo una vez)
  useEffect(() => {
    if (editingTask) {
      // Migrar assignee a assignees si existe
      const assignees = editingTask.assignees || (editingTask.assignee ? [editingTask.assignee] : []);
      
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        assignee: editingTask.assignee,
        assignees: assignees,
        tags: editingTask.tags,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
        estimatedHours: editingTask.estimatedHours
      });
      setSubtasks(editingTask.subtasks || []);
      
      // Los usuarios ya están en formData.assignees
    }
  }, [editingTask]); // Dependencias actualizadas

  const handleSubmit = (saveAndCreateAnother = false) => {
    // Validaciones según ACTIVIDAD 4
    const newErrors: { 
      title?: string; 
      description?: string; 
      dueDate?: string; 
      estimatedHours?: string; 
    } = {};
    
    // Título: Requerido + 3-100 caracteres
    if (!formData.title.trim()) {
      newErrors.title = 'El título de la tarea es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'El título no puede exceder 100 caracteres';
    }
    
    // Descripción: Máximo 1000 caracteres
    if (formData.description.trim().length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }
    
    // Fecha: No puede ser en el pasado
    if (formData.dueDate && formData.dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.dueDate = 'La fecha de vencimiento no puede ser en el pasado';
    }
    
    // Horas estimadas: Solo números > 0
    if (formData.estimatedHours !== undefined) {
      if (isNaN(formData.estimatedHours) || formData.estimatedHours <= 0) {
        newErrors.estimatedHours = 'Las horas estimadas deben ser un número mayor a 0';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && editingTask) {
      // Editar tarea existente
      const updatedTask = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: formData.assignees && formData.assignees.length > 0 ? formData.assignees[0] : undefined,
        assignees: formData.assignees,
        tags: formData.tags,
        status: formData.status,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours,
        subtasks: subtasks,
        comments: editingTask.comments || []
      };

      try {
        updateTask(editingTask.id, updatedTask);
        
        // Notificar a nuevos usuarios asignados
        const previousAssignees = editingTask.assignees || (editingTask.assignee ? [editingTask.assignee] : []);
        const newAssignees = formData.assignees?.filter(a => !previousAssignees.includes(a)) || [];
        
        if (newAssignees.length > 0) {
          showInfo(
            '👥 Usuario(s) asignado(s)',
            `Se asignó la tarea "${formData.title.trim()}" a: ${newAssignees.join(', ')}`
          );
        }
      } catch (error) {
        throw error; // Re-lanzar el error para que se maneje en el componente padre
      }
    } else {
      // Crear nueva tarea
      const newTask = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: formData.assignees && formData.assignees.length > 0 ? formData.assignees[0] : undefined,
        assignees: formData.assignees,
        tags: formData.tags,
        status: formData.status,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours,
        subtasks: subtasks,
        comments: []
      };

      if (columnId) {
        try {
          addTask(newTask, columnId);
          
          // Notificar a usuarios asignados en nueva tarea
          if (formData.assignees && formData.assignees.length > 0) {
            showInfo(
              '👥 Tarea asignada',
              `Nueva tarea "${formData.title.trim()}" asignada a: ${formData.assignees.join(', ')}`
            );
          }
        } catch (error) {
          throw error; // Re-lanzar el error para que se maneje en el componente padre
        }
      }
    }
    
    // Si es "Guardar y crear otra", no cerrar el modal
    if (!saveAndCreateAnother) {
      onClose();
    } else {
      // Limpiar formulario para crear otra tarea
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: undefined,
        assignees: [],
        tags: [],
        status: columnStatus,
        startDate: undefined,
        dueDate: undefined,
        estimatedHours: undefined
      });
      setSubtasks([]);
      setErrors({});
      // Los usuarios se limpian automáticamente
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | TaskPriority | Date | number | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Manejador específico para asegurar que las teclas funcionen correctamente
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // No interferir con ninguna tecla, especialmente Shift, Ctrl, Alt, etc.
    // Solo manejar teclas específicas si es necesario
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type === 'text') {
      // Permitir Enter en inputs de texto (comportamiento normal)
      return;
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  // Manejo de teclado para el formulario
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'lowest', label: 'Lowest', color: '#10b981' }, 
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  return (
    <div className="task-form">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} onKeyDown={handleFormKeyDown}>
        
        <div className="task-form__content">
          {/* Sección principal: Título/Descripción + Usuarios */}
          <div className="task-form__main-section">
            {/* Lado izquierdo: Título, Descripción y Subtareas */}
            <div className="task-form__form-fields">
              <div className="task-form__field">
                <label className="task-form__label">Título de la tarea *</label>
                <input
                  type="text"
                  className="task-form__input"
                  placeholder="Ej: Implementar funcionalidad de login"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                  spellCheck="false"
                  required
                />
                {errors.title && (
                  <span className="task-form__error">{errors.title}</span>
                )}
              </div>

              <div className="task-form__field">
                <label className="task-form__label">Descripción</label>
                <textarea
                  className="task-form__textarea"
                  placeholder="Describe los detalles de la tarea..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  rows={4}
                  maxLength={1000}
                  autoComplete="off"
                  spellCheck="false"
                />
                {errors.description && (
                  <span className="task-form__error">{errors.description}</span>
                )}
                <div className="task-form__char-count">
                  {formData.description.length}/1000 caracteres
                </div>
              </div>

              <div className="task-form__field">
                <label className="task-form__label">Subtareas</label>
                <div className="task-form__subtasks">
                  <SubtasksList
                    subtasks={subtasks}
                    onUpdateSubtasks={setSubtasks}
                    isEditable={true}
                  />
                </div>
              </div>
            </div>

            {/* Lado derecho: Botón para agregar usuarios + Prioridad */}
            <div className="task-form__users-section">
              <label className="task-form__label">Asignar a</label>
              <div className="task-form__users-container">
                {/* Avatares de usuarios seleccionados */}
                {formData.assignees && formData.assignees.length > 0 && (
                  <div className="task-form__selected-users">
                    {formData.assignees.map((assignee) => (
                      <div 
                        key={assignee} 
                        className="task-form__selected-user"
                        onClick={() => {
                          const newAssignees = formData.assignees?.filter(a => a !== assignee) || [];
                          handleInputChange('assignees', newAssignees);
                        }}
                        title={`Quitar ${assignee}`}
                      >
                        <div className="task-form__selected-avatar">
                          {assignee.charAt(0)}
                        </div>
                        <div className="task-form__selected-remove">✕</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acordeón de usuarios */}
                <div className="task-form__users-accordion">
                  <button
                    type="button"
                    className="task-form__add-user-button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <span className="task-form__add-user-icon">👥</span>
                    <span className="task-form__add-user-text">Agregar usuarios</span>
                    <span className={`task-form__accordion-arrow ${showUserDropdown ? 'open' : ''}`}>▼</span>
                  </button>

                  {/* Acordeón con lista de usuarios */}
                  <div className={`task-form__user-accordion-content ${showUserDropdown ? 'open' : ''}`}>
                    <div className="task-form__user-grid">
                      {teamMembers.filter(member => !formData.assignees?.includes(member)).map((member) => (
                        <button
                          key={member} 
                          type="button"
                          className="task-form__user-chip"
                          onClick={() => {
                            const newAssignees = [...(formData.assignees || []), member];
                            handleInputChange('assignees', newAssignees);
                          }}
                        >
                          <div className="task-form__user-chip-avatar">
                            {member.charAt(0)}
                          </div>
                          <span className="task-form__user-chip-name">{member}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sección de prioridad */}
                <div className="task-form__field">
                  <label className="task-form__label">Prioridad requerida</label>
                  <div className="task-form__priority-checks">
                    {priorities.map((priority) => (
                      <label key={priority.value} className="task-form__priority-check">
                        <input
                          type="checkbox"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                          className="task-form__priority-checkbox"
                        />
                        <div className="task-form__priority-check-custom">
                          <div 
                            className="task-form__priority-check-indicator"
                            style={{ backgroundColor: priority.color }}
                          />
                          <span className="task-form__priority-check-label">{priority.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sección de fechas */}
                <div className="task-form__dates-row">
                  <div className="task-form__field">
                    <label className="task-form__label">Fecha de inicio</label>
                    <input
                      type="date"
                      className="task-form__date-input"
                      value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>

                  <div className="task-form__field">
                    <label className="task-form__label">Fecha de finalización</label>
                    <input
                      type="date"
                      className="task-form__date-input"
                      value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Sección de etiquetas */}
                <div className="task-form__field">
                  <label className="task-form__label">Etiquetas</label>
                  <div className="task-form__tag-input">
                    <input
                      type="text"
                      className="task-form__input"
                      placeholder="Agregar etiqueta..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      className="task-form__add-button"
                      onClick={handleAddTag}
                    >
                      Agregar
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="task-form__tags">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="task-form__tag">
                          {tag}
                          <button
                            type="button"
                            className="task-form__tag-remove"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>



        </div>

        <div className="task-form__actions">
          <button
            type="button"
            className="task-form__action-button task-form__action-button--cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          {!isEditing && (
            <button
              type="button"
              className="task-form__action-button task-form__action-button--secondary"
              onClick={() => handleSubmit(true)}
            >
              Guardar y crear otra
            </button>
          )}
          <button
            type="submit"
            className="task-form__action-button task-form__action-button--primary"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
