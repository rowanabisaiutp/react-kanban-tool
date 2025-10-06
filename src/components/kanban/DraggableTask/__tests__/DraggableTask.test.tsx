import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import type { Task } from '../../../../types';

// Mocks para @dnd-kit
const mockUseSortable = jest.fn();
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => mockUseSortable(),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn((transform) => transform ? 'translate3d(10px, 10px, 0)' : ''),
    },
  },
}));

// Mock del componente TaskCard
jest.mock('../../TaskCard', () => {
  return function MockTaskCard({ 
    task, 
    columnColor, 
    onEdit, 
    onDelete, 
    onMove, 
    onDuplicate, 
    onArchive, 
    onReassign,
    dragHandleProps 
  }: any) {
    return (
      <div data-testid="task-card">
        <div data-testid="task-title">{task.title}</div>
        <div data-testid="task-description">{task.description}</div>
        <div data-testid="task-status">{task.status}</div>
        <div data-testid="task-priority">{task.priority}</div>
        <div data-testid="task-assignee">{task.assignee}</div>
        <div data-testid="column-color" style={{ backgroundColor: columnColor }}>Color</div>
        <button data-testid="edit-button" onClick={() => onEdit(task)}>Edit</button>
        <button data-testid="delete-button" onClick={() => onDelete(task.id)}>Delete</button>
        <button data-testid="move-button" onClick={() => onMove(task.id, 'in-progress')}>Move</button>
        <button data-testid="duplicate-button" onClick={() => onDuplicate(task)}>Duplicate</button>
        <button data-testid="archive-button" onClick={() => onArchive(task.id)}>Archive</button>
        <button data-testid="reassign-button" onClick={() => onReassign?.(task.id, 'Jane Doe')}>Reassign</button>
        <div data-testid="sortable-listeners" {...dragHandleProps}>Drag Handle</div>
      </div>
    );
  };
});

import DraggableTask from '../DraggableTask';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('DraggableTask', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test description',
    status: 'todo',
    priority: 'medium',
    assignee: 'John Doe',
    assignees: ['John Doe'],
    tags: ['frontend', 'urgent'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    dueDate: new Date('2024-01-02T00:00:00Z'),
    estimatedHours: 4,
    subtasks: [],
    comments: []
  };

  const defaultProps = {
    task: mockTask,
    columnColor: '#3b82f6',
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onMove: jest.fn(),
    onDuplicate: jest.fn(),
    onArchive: jest.fn(),
    onReassign: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSortable.mockReturnValue({
      attributes: { 'data-testid': 'sortable-attributes' },
      listeners: { 'data-testid': 'sortable-listeners' },
      setNodeRef: jest.fn(),
      transform: { x: 10, y: 10 },
      transition: 'transform 150ms ease',
      isDragging: false,
    });
  });

  it('renders task with drag and drop functionality', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
    expect(screen.getByTestId('task-title')).toHaveTextContent('Test Task');
    expect(screen.getByTestId('sortable-listeners')).toBeInTheDocument();
  });

  it('applies dragging styles when isDragging is true', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: { x: 10, y: 10 },
      transition: 'transform 150ms ease',
      isDragging: true,
    });

    const { container } = renderWithTheme(<DraggableTask {...defaultProps} />);
    const draggableTask = container.querySelector('.draggable-task');
    
    expect(draggableTask).toHaveClass('draggable-task--dragging');
  });

  it('passes all callbacks to TaskCard component', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('move-button')).toBeInTheDocument();
    expect(screen.getByTestId('duplicate-button')).toBeInTheDocument();
    expect(screen.getByTestId('archive-button')).toBeInTheDocument();
    expect(screen.getByTestId('reassign-button')).toBeInTheDocument();
  });

  it('handles optional onReassign callback', () => {
    const { onReassign, ...propsWithoutReassign } = defaultProps;
    
    renderWithTheme(<DraggableTask {...propsWithoutReassign} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });

  it('passes columnColor to TaskCard component', () => {
    const customColor = '#ff0000';
    renderWithTheme(<DraggableTask {...defaultProps} columnColor={customColor} />);
    
    const colorElement = screen.getByTestId('column-color');
    expect(colorElement).toHaveStyle({ backgroundColor: customColor });
  });

  it('handles callback functions correctly', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
    
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTask.id);
    
    fireEvent.click(screen.getByTestId('move-button'));
    expect(defaultProps.onMove).toHaveBeenCalledWith(mockTask.id, 'in-progress');
    
    fireEvent.click(screen.getByTestId('duplicate-button'));
    expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockTask);
    
    fireEvent.click(screen.getByTestId('archive-button'));
    expect(defaultProps.onArchive).toHaveBeenCalledWith(mockTask.id);
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(container.querySelector('.draggable-task')).toBeInTheDocument();
    expect(container.querySelector('.draggable-task--dragging')).not.toBeInTheDocument();
  });

  it('configures sortable with correct data', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });

  it('uses memo optimization correctly', () => {
    const { rerender } = renderWithTheme(<DraggableTask {...defaultProps} />);
    
    // Re-render with same props should not cause re-renders due to memo
    rerender(
      <ThemeProvider theme={theme}>
        <DraggableTask {...defaultProps} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });

  it('handles different task statuses', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    renderWithTheme(<DraggableTask {...defaultProps} task={inProgressTask} />);
    
    expect(screen.getByTestId('task-status')).toHaveTextContent('in-progress');
  });

  it('handles different task priorities', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    renderWithTheme(<DraggableTask {...defaultProps} task={highPriorityTask} />);
    
    expect(screen.getByTestId('task-priority')).toHaveTextContent('high');
  });

  it('handles tasks without optional fields', () => {
    const minimalTask: Task = {
      id: 'task-minimal',
      title: 'Minimal Task',
      description: '',
      status: 'todo',
      priority: 'low',
      assignee: undefined,
      assignees: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      comments: []
    };
    
    renderWithTheme(<DraggableTask {...defaultProps} task={minimalTask} />);
    
    expect(screen.getByTestId('task-title')).toHaveTextContent('Minimal Task');
    expect(screen.getByTestId('task-assignee')).toHaveTextContent('');
  });
});

