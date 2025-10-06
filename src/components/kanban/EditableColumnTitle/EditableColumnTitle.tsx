import React, { useState, useRef, useEffect } from 'react';
import './EditableColumnTitle.css';

interface EditableColumnTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
}

const EditableColumnTitle: React.FC<EditableColumnTitleProps> = ({
  title,
  onSave,
  onCancel,
  isEditing,
  onStartEdit
}) => {
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleSubmit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== title) {
      onSave(trimmedValue);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className="editable-column-title__input"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        maxLength={50}
      />
    );
  }

  return (
    <h3 
      className="editable-column-title__display"
      onClick={onStartEdit}
      title="Haz clic para editar"
    >
      {title}
    </h3>
  );
};

export default EditableColumnTitle;
