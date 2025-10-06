import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import type { ButtonProps } from '../../../types';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $disabled: boolean;
  $loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.25rem';
      case 'md': return '0.5rem';
      case 'lg': return '0.5rem';
      default: return '0.5rem';
    }
  }};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.75rem';
      case 'md': return '0.875rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  }};
  line-height: 1.25rem;
  cursor: ${({ $disabled, $loading }) => 
    $disabled || $loading ? 'not-allowed' : 'pointer'};
  transition: all 150ms ease-in-out;
  position: relative;
  overflow: hidden;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  padding: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.375rem 0.75rem';
      case 'md': return '0.5rem 1rem';
      case 'lg': return '0.75rem 1.5rem';
      default: return '0.5rem 1rem';
    }
  }};

  /* Variants */
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.backgroundSecondary;
      case 'danger': return theme.colors.error;
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  }};

  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary': return theme.colors.textInverse;
      case 'secondary': return theme.colors.textPrimary;
      case 'danger': return theme.colors.textInverse;
      case 'ghost': return theme.colors.textPrimary;
      default: return theme.colors.textInverse;
    }
  }};

  border: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary': return `1px solid ${theme.colors.border}`;
      default: return 'none';
    }
  }};

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  &:hover:not(:disabled) {
    background-color: ${({ $variant, theme }) => {
      switch ($variant) {
        case 'primary': return theme.colors.primaryHover;
        case 'secondary': return theme.colors.surfaceHover;
        case 'danger': return theme.colors.errorHover;
        case 'ghost': return theme.colors.backgroundSecondary;
        default: return theme.colors.primaryHover;
      }
    }};
    
    border-color: ${({ $variant, theme }) => {
      switch ($variant) {
        case 'secondary': return theme.colors.borderHover;
        default: return 'transparent';
      }
    }};
    
    box-shadow: ${({ $variant }) => {
      switch ($variant) {
        case 'primary':
        case 'danger':
          return '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        default: return 'none';
      }
    }};
  }

  /* Responsive */
  @media (max-width: 640px) {
    padding: ${({ $size }) => {
      switch ($size) {
        case 'sm': return '0.25rem 0.5rem';
        case 'md': return '0.375rem 0.75rem';
        case 'lg': return '0.5rem 1rem';
        default: return '0.375rem 0.75rem';
      }
    }};
    
    font-size: ${({ $size }) => {
      switch ($size) {
        case 'sm': return '0.75rem';
        case 'md': return '0.875rem';
        case 'lg': return '0.875rem';
        default: return '0.875rem';
      }
    }};
  }
`;

const Spinner = styled.span`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Content = styled.span<{ $loading: boolean }>`
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-haspopup': ariaHasPopup,
  type = 'button',
  ...props
}) => {
  // Generar aria-label automático si no se proporciona
  const buttonAriaLabel = ariaLabel || (typeof children === 'string' ? children : 'Botón');
  
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $disabled={disabled}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={buttonAriaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-haspopup={ariaHasPopup}
      aria-disabled={disabled || loading}
      role="button"
      tabIndex={disabled || loading ? -1 : 0}
      {...props}
    >
      {loading && (
        <Spinner 
          aria-hidden="true"
          role="presentation"
        />
      )}
      <Content $loading={loading}>
        {children}
      </Content>
    </StyledButton>
  );
};

// Memoizar Button para evitar re-renders innecesarios
export default memo(Button, (prevProps, nextProps) => {
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.children === nextProps.children &&
    prevProps.onClick === nextProps.onClick
  );
});
