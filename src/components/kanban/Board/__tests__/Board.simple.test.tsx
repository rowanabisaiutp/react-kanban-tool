import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks básicos
jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    deleteTask: jest.fn(),
    moveTask: jest.fn(),
    reorderColumns: jest.fn(),
    reorderTasks: jest.fn(),
    duplicateTask: jest.fn(),
    archiveTask: jest.fn(),
    updateTask: jest.fn(),
    currentBoard: null,
    addComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn()
  })
}));

jest.mock('../../../../hooks/useUnifiedFilters', () => ({
  useKanbanFilters: () => ({
    filters: {},
    hasActiveFilters: false,
    clearAllFilters: jest.fn()
  })
}));

jest.mock('../../../../hooks/useRealtimeUpdates', () => ({
  useRealtimeUpdates: () => ({ listenForChanges: jest.fn(() => jest.fn()) })
}));

jest.mock('../../../../hooks/useKanbanAutoSave', () => ({
  useAutoSaveIndicator: () => ({ showIndicator: false, isSaving: false, hasUnsavedChanges: false })
}));

jest.mock('../../../../utils/helpers', () => ({
  filterTasks: jest.fn((tasks) => tasks),
  findColumnByTaskId: jest.fn(() => null)
}));

jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  rectIntersection: jest.fn()
}));

jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array) => array),
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  sortableKeyboardCoordinates: jest.fn(),
  horizontalListSortingStrategy: jest.fn()
}));

jest.mock('../../../search', () => ({
  NoResults: () => <div data-testid="no-results">No hay resultados</div>
}));

// Mock simplificado sin dependencias problemáticas
jest.mock('../../DraggableColumn', () => {
  return function MockDraggableColumn({ column }: any) {
    return <div data-testid="draggable-column">{column.title}</div>;
  };
});

jest.mock('../../../ui/Modal', () => {
  return function MockModal() {
    return <div data-testid="modal">Modal</div>;
  };
});

jest.mock('../../AddColumnForm', () => {
  return function MockAddColumnForm() {
    return <div data-testid="add-column-form">Add Column Form</div>;
  };
});

jest.mock('../../TaskForm', () => {
  return function MockTaskForm() {
    return <div data-testid="task-form">Task Form</div>;
  };
});

jest.mock('../../TaskDetailModal', () => {
  return function MockTaskDetailModal() {
    return <div data-testid="task-detail-modal">Task Detail Modal</div>;
  };
});

jest.mock('../../DeleteColumnModal', () => {
  return function MockDeleteColumnModal() {
    return <div data-testid="delete-column-modal">Delete Column Modal</div>;
  };
});

jest.mock('../../../ui/DataManager', () => {
  return function MockDataManager() {
    return <div data-testid="data-manager">Data Manager</div>;
  };
});

import Board from '../Board';
import type { Board as BoardType } from '../../../../types';

const mockBoard: BoardType = {
  id: 'board-1',
  title: 'Test Board',
  description: 'Test Description',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  columns: [
    {
      id: 'col-1',
      title: 'Todo',
      status: 'todo',
      color: '#3b82f6',
      tasks: []
    },
    {
      id: 'col-2',
      title: 'In Progress',
      status: 'in-progress',
      color: '#f59e0b',
      tasks: []
    }
  ]
};

describe('Board Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board structure', () => {
    render(<Board board={mockBoard} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    expect(screen.getByTestId('data-manager')).toBeInTheDocument();
  });

  it('renders columns', () => {
    render(<Board board={mockBoard} />);
    
    expect(screen.getAllByTestId('draggable-column')).toHaveLength(3);
    expect(screen.getByText('Por Hacer')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('renders add column button', () => {
    render(<Board board={mockBoard} />);
    
    expect(screen.getByText('Agregar Columna')).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<Board board={mockBoard} />);
    expect(container.firstChild).toHaveClass('board');
  });
});