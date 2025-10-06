import styled, { css } from 'styled-components';
import { disabled } from '../../../styles/helpers';
import type { ButtonProps } from '../../../types';

// Base button styles
const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ${disabled}
`;

// Size variants
const sizeVariants = {
  sm: css`
    padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
    gap: ${({ theme }) => theme.spacing['2']};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    gap: ${({ theme }) => theme.spacing['2']};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    gap: ${({ theme }) => theme.spacing['3']};
  `,
};

// Color variants
const colorVariants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
      box-shadow: ${({ theme }) => theme.boxShadow.md};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.boxShadow.sm};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.borderHover};
      transform: translateY(-1px);
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.errorHover};
      box-shadow: ${({ theme }) => theme.boxShadow.md};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.boxShadow.sm};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.backgroundSecondary};
      border-color: ${({ theme }) => theme.colors.border};
    }
  `,
  success: css`
    background-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.successHover};
      box-shadow: ${({ theme }) => theme.boxShadow.md};
      transform: translateY(-1px);
    }
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.warningHover};
      box-shadow: ${({ theme }) => theme.boxShadow.md};
      transform: translateY(-1px);
    }
  `,
};

// Loading state
const loadingStyles = css`
  position: relative;
  color: transparent;

  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin-left: -8px;
    margin-top: -8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Icon button variant
const iconButtonStyles = css`
  padding: ${({ theme }) => theme.spacing['2']};
  min-width: auto;
  width: auto;
  height: auto;
`;

// Full width variant
const fullWidthStyles = css`
  width: 100%;
`;

// Styled Button component
export const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $loading: boolean;
  $fullWidth?: boolean;
  $icon?: boolean;
}>`
  ${baseButtonStyles}
  
  ${({ $size }) => sizeVariants[$size]}
  ${({ $variant }) => colorVariants[$variant]}
  ${({ $loading }) => $loading && loadingStyles}
  ${({ $fullWidth }) => $fullWidth && fullWidthStyles}
  ${({ $icon }) => $icon && iconButtonStyles}

  /* Responsive adjustments */
  @media (max-width: 640px) {
    ${({ $size }) => 
      $size === 'lg' && css`
        padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
        font-size: ${({ theme }) => theme.typography.fontSize.base};
      `
    }
  }
`;

// Button group styles
export const ButtonGroup = styled.div`
  display: inline-flex;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.sm};

  ${StyledButton} {
    border-radius: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border};

    &:first-child {
      border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
      border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    }

    &:last-child {
      border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
      border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
      border-right: none;
    }

    &:only-child {
      border-radius: ${({ theme }) => theme.borderRadius.md};
    }
  }
`;

// Icon component for buttons
export const ButtonIcon = styled.span<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $loading }) => $loading ? 0 : 1};
  transition: opacity 0.2s ease;
`;

// Button text component
export const ButtonText = styled.span<{ $loading?: boolean }>`
  opacity: ${({ $loading }) => $loading ? 0 : 1};
  transition: opacity 0.2s ease;
`;
