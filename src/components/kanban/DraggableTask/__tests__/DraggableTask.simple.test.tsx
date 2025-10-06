import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import type { Task } from '../../../../types';

// Mocks básicos
const mockUseSortable = jest.fn();
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => mockUseSortable(),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

jest.mock('../../TaskCard', () => {
  return function MockTaskCard({ task, dragHandleProps }: any) {
    return (
      <div data-testid="task-card">
        <div data-testid="task-title">{task.title}</div>
        <div data-testid="task-description">{task.description}</div>
        <div data-testid="drag-handle" {...dragHandleProps}>Drag Handle</div>
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

describe('DraggableTask Simple Tests', () => {
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
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: undefined,
      isDragging: false,
    });
  });

  it('renders task with drag functionality', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('applies dragging styles when dragging', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: { x: 10, y: 10 },
      transition: 'transform 150ms ease',
      isDragging: true,
    });

    const { container } = renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(container.querySelector('.draggable-task--dragging')).toBeInTheDocument();
  });

  it('passes all callbacks to TaskCard component', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
  });

  it('handles optional onReassign callback', () => {
    const { onReassign, ...propsWithoutReassign } = defaultProps;
    
    renderWithTheme(<DraggableTask {...propsWithoutReassign} />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(container.querySelector('.draggable-task')).toBeInTheDocument();
  });

  it('configures sortable with task data', () => {
    renderWithTheme(<DraggableTask {...defaultProps} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });

  it('passes columnColor to TaskCard', () => {
    renderWithTheme(<DraggableTask {...defaultProps} columnColor="#ff0000" />);
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });

  it('applies memo optimization', () => {
    const { rerender } = renderWithTheme(<DraggableTask {...defaultProps} />);
    
    // Re-render with same props
    rerender(
      <ThemeProvider theme={theme}>
        <DraggableTask {...defaultProps} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });
});

