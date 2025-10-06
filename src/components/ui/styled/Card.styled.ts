import styled, { css } from 'styled-components';
import type { CardProps } from '../../../types';

// Base card styles
const baseCardStyles = css`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
`;

// Padding variants
const paddingVariants = {
  sm: css`
    padding: ${({ theme }) => theme.spacing['3']};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing['4']};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing['6']};
  `,
  none: css`
    padding: 0;
  `,
};

// Interactive card styles
const interactiveStyles = css`
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// Card variants
const cardVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  elevated: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.boxShadow.md};

    &:hover {
      box-shadow: ${({ theme }) => theme.boxShadow.xl};
    }
  `,
  outlined: css`
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border};
    box-shadow: none;

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  `,
  filled: css`
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: transparent;
  `,
};

// Styled Card component
export const StyledCard = styled.div<{
  $padding: CardProps['padding'];
  $hover: boolean;
  $variant: 'default' | 'elevated' | 'outlined' | 'filled';
  $interactive: boolean;
}>`
  ${baseCardStyles}
  ${({ $padding }) => paddingVariants[$padding || 'md']}
  ${({ $variant }) => cardVariants[$variant]}
  ${({ $hover }) => $hover && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.boxShadow.lg};
    }
  `}
  ${({ $interactive }) => $interactive && interactiveStyles}

  /* Responsive padding */
  @media (max-width: 640px) {
    ${({ $padding }) => 
      $padding === 'lg' && css`
        padding: ${({ theme }) => theme.spacing['4']};
      `
    }
  }
`;

// Card header
export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin: -${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']};

  &:last-child {
    border-bottom: none;
    margin-bottom: -${({ theme }) => theme.spacing['4']};
  }
`;

// Card body
export const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  flex: 1;
`;

// Card footer
export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']};

  &:first-child {
    border-top: none;
    margin-top: -${({ theme }) => theme.spacing['4']};
  }
`;

// Card title
export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing['2']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

// Card subtitle
export const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing['3']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// Card content
export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// Card actions
export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2']};
  align-items: center;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing['3']};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
`;

// Card image
export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  margin: -${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} -${({ theme }) => theme.spacing['4']};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }
`;

// Card badge
export const CardBadge = styled.span<{ $variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing['3']};
  right: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.textInverse};
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.backgroundSecondary};
          color: ${theme.colors.textSecondary};
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.textInverse};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: ${theme.colors.textInverse};
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.textInverse};
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.textInverse};
        `;
    }
  }}
`;

// Card skeleton (loading state)
export const CardSkeleton = styled.div`
  ${baseCardStyles}
  ${paddingVariants.md}
  
  &::before {
    content: '';
    display: block;
    height: 20px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.backgroundSecondary} 25%, 
      ${({ theme }) => theme.colors.border} 50%, 
      ${({ theme }) => theme.colors.backgroundSecondary} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin-bottom: ${({ theme }) => theme.spacing['3']};
  }

  &::after {
    content: '';
    display: block;
    height: 16px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.backgroundSecondary} 25%, 
      ${({ theme }) => theme.colors.border} 50%, 
      ${({ theme }) => theme.colors.backgroundSecondary} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    animation-delay: 0.2s;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
