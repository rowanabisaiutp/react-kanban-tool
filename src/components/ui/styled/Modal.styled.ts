import styled, { css, keyframes } from 'styled-components';

// Animaciones para modal
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOutRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

// Modal backdrop
export const ModalBackdrop = styled.div<{
  $isOpen: boolean;
  $animation: 'fade' | 'slide' | 'slideRight';
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 1040;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['4']};
  
  animation: ${({ $isOpen, $animation }) => {
    if (!$isOpen) return 'none';
    switch ($animation) {
      case 'fade':
        return fadeIn;
      case 'slide':
        return fadeIn;
      case 'slideRight':
        return fadeIn;
      default:
        return fadeIn;
    }
  }} 0.3s ease-out;

  ${({ $isOpen }) => !$isOpen && css`
    animation: ${fadeOut} 0.2s ease-in forwards;
  `}

  /* Responsive */
  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing['2']};
    align-items: flex-end;
  }
`;

// Modal container
export const ModalContainer = styled.div<{
  $size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  $isOpen: boolean;
  $animation: 'fade' | 'slide' | 'slideRight';
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          max-width: 400px;
        `;
      case 'md':
        return css`
          max-width: 500px;
        `;
      case 'lg':
        return css`
          max-width: 700px;
        `;
      case 'xl':
        return css`
          max-width: 900px;
        `;
      case 'full':
        return css`
          max-width: 95vw;
          max-height: 95vh;
        `;
      default:
        return css`
          max-width: 500px;
        `;
    }
  }}

  animation: ${({ $isOpen, $animation }) => {
    if (!$isOpen) return 'none';
    switch ($animation) {
      case 'fade':
        return slideIn;
      case 'slide':
        return slideIn;
      case 'slideRight':
        return slideInRight;
      default:
        return slideIn;
    }
  }} 0.3s ease-out;

  ${({ $isOpen }) => !$isOpen && css`
    animation: ${slideOut} 0.2s ease-in forwards;
  `}

  /* Responsive */
  @media (max-width: 640px) {
    ${({ $size }) => $size !== 'full' && css`
      max-width: 100%;
      border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
      max-height: 80vh;
    `}
  }
`;

// Modal header
export const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  }
`;

// Modal title
export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

// Modal subtitle
export const ModalSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing['1']} 0 0 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// Modal close button
export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Modal body
export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  flex: 1;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderHover};
  }

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing['4']};
  }
`;

// Modal footer
export const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing['3']};
  flex-shrink: 0;

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['4']};
    flex-direction: column-reverse;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
`;

// Modal actions
export const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing['2']};
  }
`;

// Modal content
export const ModalContent = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// Modal loading state
export const ModalLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['8']};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Modal error state
export const ModalError = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

// Modal success state
export const ModalSuccess = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background-color: ${({ theme }) => theme.colors.success}10;
  border: 1px solid ${({ theme }) => theme.colors.success}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

// Modal divider
export const ModalDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing['4']} 0;
`;

// Modal section
export const ModalSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['6']};

  &:last-child {
    margin-bottom: 0;
  }
`;

// Modal section title
export const ModalSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing['3']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

// Full screen modal (for mobile)
export const FullScreenModal = styled(ModalContainer)`
  @media (max-width: 640px) {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
`;

// Drawer modal (slides from right)
export const DrawerModal = styled(ModalContainer)<{
  $isOpen: boolean;
}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  max-height: 100vh;
  margin: 0;
  border-radius: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  animation: ${({ $isOpen }) => $isOpen ? slideInRight : slideOutRight} 0.3s ease-out;

  @media (max-width: 640px) {
    width: 100vw;
    border-left: none;
  }
`;
