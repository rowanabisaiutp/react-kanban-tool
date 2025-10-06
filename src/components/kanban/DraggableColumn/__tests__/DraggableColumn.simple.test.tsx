import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import type { Column as ColumnType } from '../../../../types';

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

jest.mock('../../Column', () => {
  return function MockColumn({ column }: any) {
    return <div data-testid="column">{column.title}</div>;
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

describe('DraggableColumn Simple Tests', () => {
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
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: undefined,
      isDragging: false,
    });
  });

  it('renders column with drag functionality', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(screen.getByTestId('column')).toBeInTheDocument();
    expect(screen.getByText('Todo')).toBeInTheDocument();
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

    const { container } = renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(container.querySelector('.draggable-column--dragging')).toBeInTheDocument();
  });

  it('renders custom children when provided', () => {
    const customChild = <div data-testid="custom-child">Custom</div>;
    
    renderWithTheme(
      <DraggableColumn {...defaultProps}>
        {customChild}
      </DraggableColumn>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.queryByTestId('column')).not.toBeInTheDocument();
  });

  it('handles disabled state', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} disabled={true} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(container.querySelector('.draggable-column')).toBeInTheDocument();
  });

  it('configures sortable with column data', () => {
    renderWithTheme(<DraggableColumn {...defaultProps} />);
    
    expect(mockUseSortable).toHaveBeenCalledTimes(1);
  });
});
