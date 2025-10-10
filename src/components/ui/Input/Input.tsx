import React, { useId } from 'react';
import './Input.css';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  helperText?: string;
  autocomplete?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error,
  label,
  required = false,
  size = 'md',
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  helperText,
  autocomplete
}) => {
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const baseClasses = 'input';
  const sizeClasses = `input--${size}`;
  const errorClasses = error ? 'input--error' : '';
  const disabledClasses = disabled ? 'input--disabled' : '';

  const inputClassName = [
    baseClasses,
    sizeClasses,
    errorClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  // Determinar aria-describedby
  const describedBy = [
    ariaDescribedBy,
    error ? errorId : undefined,
    helperText ? helperId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  // Determinar aria-invalid
  const isInvalid = ariaInvalid !== undefined ? ariaInvalid : !!error;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="requerido">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={isInvalid}
        aria-required={ariaRequired !== undefined ? ariaRequired : required}
        autoComplete={autocomplete}
      />
      {helperText && (
        <span id={helperId} className="input-helper">
          {helperText}
        </span>
      )}
      {error && (
        <span 
          id={errorId} 
          className="input-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
