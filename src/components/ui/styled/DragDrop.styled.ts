import styled, { css, keyframes } from 'styled-components';

// Animaciones para drag and drop
const dragEnter = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.02); }
`;

// const dragExit = keyframes`
//   0% { transform: scale(1.02); }
//   100% { transform: scale(1); }
// `; // No se usa actualmente

const dropZonePulse = keyframes`
  0%, 100% { 
    border-color: transparent; 
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% { 
    border-color: #3b82f6; 
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
  }
`;

const dragOver = keyframes`
  0% { 
    transform: rotate(0deg) scale(1); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% { 
    transform: rotate(2deg) scale(1.05); 
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  100% { 
    transform: rotate(0deg) scale(1); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Draggable item base
export const DraggableItem = styled.div<{
  $isDragging: boolean;
  $isOver: boolean;
  $canDrop: boolean;
}>`
  cursor: grab;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  ${({ $isDragging }) => $isDragging && css`
    cursor: grabbing;
    opacity: 0.8;
    transform: rotate(5deg);
    z-index: 1000;
    animation: ${dragOver} 0.6s ease-in-out infinite;
  `}

  ${({ $isOver, $canDrop }) => $isOver && $canDrop && css`
    animation: ${dragEnter} 0.2s ease-out;
  `}

  &:active {
    cursor: grabbing;
  }

  &:hover:not(:active) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

// Drop zone
export const DropZone = styled.div<{
  $isOver: boolean;
  $canDrop: boolean;
  $isActive: boolean;
}>`
  min-height: 60px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  ${({ $isOver, $canDrop }) => $isOver && $canDrop && css`
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
    animation: ${dropZonePulse} 1.5s ease-in-out infinite;
  `}

  ${({ $isOver, $canDrop }) => $isOver && !$canDrop && css`
    border-color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => theme.colors.error}10;
  `}

  ${({ $isActive }) => $isActive && css`
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}05;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(59, 130, 246, 0.1) 50%, 
      transparent 70%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    ${({ $isOver, $canDrop }) => $isOver && $canDrop && css`
      transform: translateX(100%);
    `}
  }
`;

// Drop zone content
export const DropZoneContent = styled.div<{
  $isEmpty: boolean;
}>`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => theme.spacing['4']};
  transition: all 0.2s ease;

  ${({ $isEmpty }) => $isEmpty && css`
    opacity: 0.6;
  `}
`;

// Drag handle
export const DragHandle = styled.div`
  cursor: grab;
  color: ${({ theme }) => theme.colors.textTertiary};
  padding: ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  &:active {
    cursor: grabbing;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Sortable list
export const SortableList = styled.div<{
  $orientation: 'vertical' | 'horizontal';
}>`
  display: flex;
  ${({ $orientation }) => $orientation === 'vertical' ? css`
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['3']};
  ` : css`
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing['3']};
    overflow-x: auto;
  `}
`;

// Sortable item
export const SortableItem = styled.div<{
  $isDragging: boolean;
  $isOver: boolean;
  $canDrop: boolean;
  $index: number;
}>`
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ $isDragging }) => $isDragging && css`
    z-index: 1000;
    opacity: 0.8;
    transform: rotate(2deg) scale(1.02);
    box-shadow: ${({ theme }) => theme.boxShadow.xl};
  `}

  ${({ $isOver, $canDrop }) => $isOver && $canDrop && css`
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid ${({ theme }) => theme.colors.primary};
      border-radius: ${({ theme }) => theme.borderRadius.md};
      animation: ${dropZonePulse} 1s ease-in-out infinite;
      z-index: -1;
    }
  `}

  ${({ $index }) => css`
    animation-delay: ${$index * 50}ms;
  `}
`;

// Drag preview
export const DragPreview = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  padding: ${({ theme }) => theme.spacing['3']};
  transform: rotate(5deg);
  opacity: 0.9;
  pointer-events: none;
`;

// Drag overlay
export const DragOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(2px);
`;

// Drop indicator
export const DropIndicator = styled.div<{
  $position: 'top' | 'bottom' | 'left' | 'right';
  $isVisible: boolean;
}>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  z-index: 1001;

  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return css`
          top: -2px;
          left: 0;
          right: 0;
          height: 3px;
        `;
      case 'bottom':
        return css`
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
        `;
      case 'left':
        return css`
          left: -2px;
          top: 0;
          bottom: 0;
          width: 3px;
        `;
      case 'right':
        return css`
          right: -2px;
          top: 0;
          bottom: 0;
          width: 3px;
        `;
      default:
        return css`
          top: -2px;
          left: 0;
          right: 0;
          height: 3px;
        `;
    }
  }}
`;

// Drag ghost (placeholder during drag)
export const DragGhost = styled.div`
  background-color: ${({ theme }) => theme.colors.primary}20;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: 0.6;
  transition: all 0.2s ease;
  animation: ${dropZonePulse} 2s ease-in-out infinite;
`;

// Resize handle
export const ResizeHandle = styled.div<{
  $direction: 'horizontal' | 'vertical' | 'both';
  $isResizing: boolean;
}>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  ${({ $direction }) => {
    switch ($direction) {
      case 'horizontal':
        return css`
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
        `;
      case 'vertical':
        return css`
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          cursor: row-resize;
        `;
      case 'both':
        return css`
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          cursor: nw-resize;
          border-radius: 0 0 ${({ theme }) => theme.borderRadius.sm} 0;
        `;
      default:
        return css`
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
        `;
    }
  }}

  ${({ $isResizing }) => $isResizing && css`
    opacity: 1;
  `}

  &:hover {
    opacity: 0.7;
  }
`;

// Container for resizable elements
export const ResizableContainer = styled.div<{
  $isResizing: boolean;
}>`
  position: relative;
  transition: ${({ $isResizing }) => $isResizing ? 'none' : 'all 0.2s ease'};

  &:hover ${ResizeHandle} {
    opacity: 0.5;
  }
`;
