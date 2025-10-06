import React, { useState, useEffect, useRef } from 'react';
import type { ColumnFormData, Column, TaskStatus } from '../../../types';
import { useKanbanStore } from '../../../store/useKanbanStore';
import { columnColors } from '../../../data/mockData';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import './AddColumnForm.css';

interface AddColumnFormProps {
  onClose: () => void;
  editingColumn?: Column | null;
}

const AddColumnForm: React.FC<AddColumnFormProps> = ({ onClose, editingColumn = null }) => {
  const { addColumn, updateColumn } = useKanbanStore();
  const [formData, setFormData] = useState<ColumnFormData>({
    title: '',
    color: columnColors[0],
    maxTasks: undefined
  });
  const [errors, setErrors] = useState<{ title?: string; maxTasks?: string }>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#8b5cf6');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingColumn;

  // Cargar datos de la columna cuando se está editando
  useEffect(() => {
    if (editingColumn) {
      setFormData({
        title: editingColumn.title,
        color: editingColumn.color,
        maxTasks: editingColumn.maxTasks
      });
    }
  }, [editingColumn]);

  const handleSubmit = () => {
    // Validaciones
    const newErrors: { title?: string; maxTasks?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El nombre de la columna es requerido';
    }
    if (formData.maxTasks !== undefined && formData.maxTasks < 1) {
      newErrors.maxTasks = 'El límite debe ser mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && editingColumn) {
      // Editar columna existente
      const updatedColumn = {
        title: formData.title.trim(),
        color: formData.color,
        maxTasks: formData.maxTasks || undefined
      };

      updateColumn(editingColumn.id, updatedColumn);
    } else {
      // Crear nueva columna con status único
      const newColumn = {
        title: formData.title.trim(),
        status: `custom-${Date.now()}` as TaskStatus, // Status único para columnas personalizadas
        color: formData.color,
        maxTasks: formData.maxTasks || undefined
      };

      addColumn(newColumn);
    }
    
    onClose();
  };

  const handleInputChange = (field: keyof ColumnFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: undefined }));
    }
  };

  const handleCustomColorClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleApplyCustomColor = () => {
    handleInputChange('color', customColor);
    setShowColorPicker(false);
  };

  return (
    <div className="add-column-form">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <h3 className="add-column-form__title">
          {isEditing ? 'Editar Columna' : 'Agregar Nueva Columna'}
        </h3>
        
        <div className="add-column-form__content">
          <div className="add-column-form__field">
          <Input
            label="Nombre de la columna"
            placeholder="Ej: Revisión, Testing, etc."
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            error={errors.title}
            required
          />
        </div>

        <div className="add-column-form__field">
          <label className="add-column-form__label">
            Color de la columna
          </label>
          <div className="add-column-form__color-picker">
            {columnColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`add-column-form__color-option ${
                  formData.color === color ? 'add-column-form__color-option--selected' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleInputChange('color', color)}
                title={color}
              />
            ))}
            
            {/* Botón de color personalizado */}
            <button
              type="button"
              className={`add-column-form__color-option add-column-form__color-option--custom ${
                !columnColors.includes(formData.color as any) ? 'add-column-form__color-option--selected' : ''
              }`}
              style={{ 
                backgroundColor: !columnColors.includes(formData.color as any) ? formData.color : 'transparent',
                background: !columnColors.includes(formData.color as any) 
                  ? formData.color 
                  : 'linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #1dd1a1 75%, #ee5a6f 100%)'
              }}
              onClick={handleCustomColorClick}
              title="Color personalizado"
            >
              {!columnColors.includes(formData.color as any) ? '' : '🎨'}
            </button>
          </div>
          
          {/* Selector de color personalizado */}
          {showColorPicker && (
            <div className="add-column-form__custom-color-picker">
              <div className="add-column-form__custom-color-header">
                <span>🎨 Elige tu color</span>
              </div>
              <div className="add-column-form__custom-color-body">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="add-column-form__custom-color-input"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="add-column-form__custom-color-text"
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <div className="add-column-form__custom-color-preview" style={{ backgroundColor: customColor }}>
                Vista previa
              </div>
              <div className="add-column-form__custom-color-actions">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="add-column-form__custom-color-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustomColor}
                  className="add-column-form__custom-color-apply"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="add-column-form__field">
          <Input
            type="number"
            label="Límite de tareas (opcional)"
            placeholder="Sin límite"
            value={formData.maxTasks?.toString() || ''}
            onChange={(value) => handleInputChange('maxTasks', value ? parseInt(value) : undefined)}
            error={errors.maxTasks || undefined}
          />
        </div>
        </div>

        <div className="add-column-form__actions">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Columna'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddColumnForm;
