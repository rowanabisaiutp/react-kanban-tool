import styled, { css } from 'styled-components';

// Base input styles
const baseInputStyles = css`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:invalid {
    border-color: ${({ theme }) => theme.colors.error};
  }

  &:invalid:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.error}20;
  }
`;

// Size variants
const sizeVariants = {
  sm: css`
    padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['5']};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

// Variant styles
const variantStyles = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  filled: css`
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: transparent;

    &:focus {
      background-color: ${({ theme }) => theme.colors.surface};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  `,
  outlined: css`
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  `,
};

// Input container
export const InputContainer = styled.div<{
  $fullWidth: boolean;
  $disabled: boolean;
}>`
  display: ${({ $fullWidth }) => $fullWidth ? 'block' : 'inline-block'};
  position: relative;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
`;

// Styled input
export const StyledInput = styled.input<{
  $size: 'sm' | 'md' | 'lg';
  $variant: 'default' | 'filled' | 'outlined';
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
  $error: boolean;
}>`
  ${baseInputStyles}
  ${({ $size }) => sizeVariants[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  
  ${({ $hasLeftIcon }) => $hasLeftIcon && css`
    padding-left: ${({ theme }) => theme.spacing['10']};
  `}
  
  ${({ $hasRightIcon }) => $hasRightIcon && css`
    padding-right: ${({ theme }) => theme.spacing['10']};
  `}

  ${({ $error }) => $error && css`
    border-color: ${({ theme }) => theme.colors.error};
    
    &:focus {
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.error}20;
    }
  `}

  /* Remove autofill styling */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px ${({ theme }) => theme.colors.surface} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.textPrimary};
    transition: background-color 5000s ease-in-out 0s;
  }
`;

// Textarea
export const StyledTextarea = styled.textarea<{
  $size: 'sm' | 'md' | 'lg';
  $variant: 'default' | 'filled' | 'outlined';
  $error: boolean;
  $resize: 'none' | 'vertical' | 'horizontal' | 'both';
}>`
  ${baseInputStyles}
  ${({ $size }) => sizeVariants[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  
  min-height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '80px';
      case 'md': return '100px';
      case 'lg': return '120px';
      default: return '100px';
    }
  }};
  
  resize: ${({ $resize }) => $resize};
  font-family: inherit;

  ${({ $error }) => $error && css`
    border-color: ${({ theme }) => theme.colors.error};
    
    &:focus {
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.error}20;
    }
  `}
`;

// Input label
export const InputLabel = styled.label<{ $required: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};

  ${({ $required }) => $required && css`
    &::after {
      content: ' *';
      color: ${({ theme }) => theme.colors.error};
    }
  `}
`;

// Input helper text
export const InputHelper = styled.div<{ $error: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }) => theme.spacing['2']};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  color: ${({ theme, $error }) => $error ? theme.colors.error : theme.colors.textSecondary};
`;

// Input icon container
export const InputIcon = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position}: ${({ theme }) => theme.spacing['3']};
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Input group
export const InputGroup = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  display: flex;
  ${({ $orientation }) => $orientation === 'horizontal' ? css`
    flex-direction: row;
    align-items: end;
    gap: ${({ theme }) => theme.spacing['2']};
  ` : css`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['3']};
  `}
`;

// Input addon
export const InputAddon = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;

  ${({ $position }) => $position === 'left' ? css`
    border-right: none;
    border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
  ` : css`
    border-left: none;
    border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
  `}
`;

// Search input
export const SearchInput = styled(StyledInput)`
  padding-left: ${({ theme }) => theme.spacing['10']};
  
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    width: 16px;
    background: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    
    &::after {
      content: '×';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;

// Password toggle button
export const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing['3']};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing['1']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
