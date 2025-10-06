import React from 'react';
import styled from 'styled-components';
import type { CardProps } from '../../../types';

const StyledCard = styled.div<{
  $hover: boolean;
  $padding: CardProps['padding'];
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  transition: all ${({ theme }) => theme.animation.transition.normal};
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'default'};
  
  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'sm': return '0.75rem';
      case 'md': return '1rem';
      case 'lg': return '1.5rem';
      default: return '1rem';
    }
  }};

  ${({ $hover, theme }) => $hover && `
    &:hover {
      box-shadow: ${theme.boxShadow.md};
      transform: translateY(-1px);
    }
  `}

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
  ...props
}) => {
  const cardClasses = [
    'card',
    hover ? 'card--hover' : '',
    `card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <StyledCard 
      $hover={hover}
      $padding={padding}
      className={cardClasses}
      data-hover={hover.toString()}
      data-padding={padding}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
