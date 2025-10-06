import styled, { css, keyframes } from 'styled-components';

// Animaciones para tareas
const taskComplete = keyframes`
  0% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.8; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
`;

const taskHover = keyframes`
  0% { 
    transform: translateY(0); 
  }
  100% { 
    transform: translateY(-2px); 
  }
`;

const priorityPulse = keyframes`
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.6; 
  }
`;

// Task card container
export const TaskCard = styled.div<{
  $isCompleted: boolean;
  $priority: 'low' | 'medium' | 'high' | 'urgent';
  $isAnimating: boolean;
  $isHovered: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  /* Priority indicator */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${({ $priority, theme }) => {
      switch ($priority) {
        case 'urgent': return theme.colors.error;
        case 'high': return theme.colors.warning;
        case 'medium': return theme.colors.accent;
        case 'low': return theme.colors.success;
        default: return theme.colors.border;
      }
    }};
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  ${({ $isCompleted }) => $isCompleted && css`
    opacity: 0.7;
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    
    ${TaskTitle} {
      text-decoration: line-through;
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  `}

  ${({ $isAnimating }) => $isAnimating && css`
    animation: ${taskComplete} 0.4s ease-in-out;
  `}

  ${({ $isHovered }) => $isHovered && css`
    animation: ${taskHover} 0.2s ease-out forwards;
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    border-color: ${({ theme }) => theme.colors.borderHover};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:active {
    transform: translateY(0);
  }

  /* Focus styles */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// Task title
export const TaskTitle = styled.h3<{
  $isCompleted: boolean;
}>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing['2']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  transition: all 0.2s ease;

  ${({ $isCompleted }) => $isCompleted && css`
    text-decoration: line-through;
    color: ${({ theme }) => theme.colors.textSecondary};
  `}
`;

// Task description
export const TaskDescription = styled.p<{
  $isCompleted: boolean;
}>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing['3']} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: all 0.2s ease;

  ${({ $isCompleted }) => $isCompleted && css`
    opacity: 0.6;
  `}
`;

// Task metadata container
export const TaskMetadata = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['3']};
  margin-top: ${({ theme }) => theme.spacing['3']};
  padding-top: ${({ theme }) => theme.spacing['3']};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Task priority badge
export const TaskPriority = styled.span<{
  $priority: 'low' | 'medium' | 'high' | 'urgent';
  $isUrgent: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'urgent':
        return css`
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
          border: 1px solid ${theme.colors.error}40;
        `;
      case 'high':
        return css`
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      case 'medium':
        return css`
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
          border: 1px solid ${theme.colors.accent}40;
        `;
      case 'low':
        return css`
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      default:
        return css`
          background-color: ${theme.colors.backgroundSecondary};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}

  ${({ $isUrgent }) => $isUrgent && css`
    animation: ${priorityPulse} 2s ease-in-out infinite;
  `}
`;

// Task assignee
export const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Task assignee avatar
export const TaskAssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Task due date
export const TaskDueDate = styled.div<{
  $isOverdue: boolean;
  $isToday: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  ${({ $isOverdue }) => $isOverdue && css`
    background-color: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  `}

  ${({ $isToday }) => $isToday && css`
    background-color: ${({ theme }) => theme.colors.warning}20;
    color: ${({ theme }) => theme.colors.warning};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  `}

  ${({ $isOverdue, $isToday }) => !$isOverdue && !$isToday && css`
    color: ${({ theme }) => theme.colors.textTertiary};
  `}
`;

// Task tags
export const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['1']};
  margin: ${({ theme }) => theme.spacing['2']} 0;
`;

// Task tag
export const TaskTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

// Task subtasks
export const TaskSubtasks = styled.div`
  margin: ${({ theme }) => theme.spacing['3']} 0;
`;

// Task subtask
export const TaskSubtask = styled.div<{
  $isCompleted: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => theme.spacing['1']} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  ${({ $isCompleted }) => $isCompleted && css`
    opacity: 0.6;
    text-decoration: line-through;
  `}
`;

// Task subtask checkbox
export const TaskSubtaskCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

// Task actions
export const TaskActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing['2']};
  right: ${({ theme }) => theme.spacing['2']};
  display: flex;
  gap: ${({ theme }) => theme.spacing['1']};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TaskCard}:hover & {
    opacity: 1;
  }
`;

// Task action button
export const TaskActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textTertiary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing['1']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// Task progress bar
export const TaskProgress = styled.div`
  margin: ${({ theme }) => theme.spacing['2']} 0;
`;

// Task progress bar background
export const TaskProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

// Task progress bar fill
export const TaskProgressFill = styled.div<{
  $percentage: number;
}>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: ${({ $percentage }) => $percentage}%;
  transition: width 0.3s ease;
`;

// Task completion animation
export const TaskCompletionAnimation = styled.div<{
  $isVisible: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translate(-50%, -50%) scale(${({ $isVisible }) => $isVisible ? 1 : 0});
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10;

  ${({ $isVisible }) => $isVisible && css`
    animation: ${taskComplete} 0.6s ease-in-out;
  `}
`;
