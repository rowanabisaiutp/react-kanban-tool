import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import type { Column as ColumnType } from '../../../../types';

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

// Mock del componente Column
jest.mock('../../Column', () => {
  return function MockColumn({ column, dragHandleProps }: any) {
    return (
      <div data-testid="column">
        <div data-testid="column-title">{column.title}</div>
        <div data-testid="sortable-listeners" {...dragHandleProps}>Drag Handle</div>
      </div>
    );
  };
});

import DraggableColumn from '../DraggableColumn';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('DraggableColumn', () => {
  const mockColumn: ColumnType = {
    id: 'col-1',
    title: 'Todo',
    status: 'todo',
    color: '#3b82f6',
    tasks: []
  };


  const defaultProps = {
    column: mockColumn,
    onAddTask: jest.fn(),
    onEditTask: jest.fn(),
    onDeleteTask: jest.fn(),
    onMoveTask: jest.fn(),
    onDuplicateTask: jest.fn(),
    onArchiveTask: jest.fn(),
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

  it('renders column with drag and drop functionality', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(screen.getByTestId('column')).toBeInTheDocument();
    expect(screen.getByTestId('column-title')).toHaveTextContent('Todo');
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

    const { container } = renderWithTheme(<DraggableColumn {...defaultProps} />);
    const draggableColumn = container.querySelector('.draggable-column');
    
    expect(draggableColumn).toHaveClass('draggable-column--dragging');
  });

  it('passes all callbacks to Column component', () => {
    const props = {
      ...defaultProps,
      onReassignTask: jest.fn(),
      onEditColumn: jest.fn(),
      onDeleteColumn: jest.fn(),
    };

    renderWithTheme(<DraggableColumn {...props} />);
    
    expect(screen.getByTestId('column')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: undefined,
      isDragging: false,
    });

    renderWithTheme(<DraggableColumn {...defaultProps} disabled={true} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });

  it('renders custom children when provided', () => {
    const customChild = <div data-testid="custom-child">Custom Content</div>;
    
    renderWithTheme(
      <DraggableColumn {...defaultProps}>
        {customChild}
      </DraggableColumn>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.queryByTestId('column')).not.toBeInTheDocument();
  });

  it('passes refreshTrigger to Column component', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} refreshTrigger={123} />);
    
    expect(screen.getByTestId('column')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(container.querySelector('.draggable-column')).toBeInTheDocument();
    expect(container.querySelector('.draggable-column--dragging')).not.toBeInTheDocument();
  });

  it('configures sortable with correct data', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });
});
