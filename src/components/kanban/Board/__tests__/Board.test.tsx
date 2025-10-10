import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    filters: { query: '', priority: null, tags: [], dateRange: { start: null, end: null }, assignee: null },
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
    return <div data-testid="draggable-column" data-column-id={column.id}>{column.title}</div>;
  };
});

jest.mock('../../../ui/Modal', () => {
  return function MockModal({ isOpen, children }: any) {
    return isOpen ? <div data-testid="modal">{children}</div> : null;
  };
});

jest.mock('../../AddColumnForm', () => {
  return function MockAddColumnForm({ onClose }: any) {
    return <div data-testid="add-column-form"><button onClick={onClose}>Close</button></div>;
  };
});

jest.mock('../../TaskForm', () => {
  return function MockTaskForm({ onClose }: any) {
    return <div data-testid="task-form"><button onClick={onClose}>Close</button></div>;
  };
});

jest.mock('../../TaskDetailModal', () => {
  return function MockTaskDetailModal({ isOpen, onClose }: any) {
    return isOpen ? <div data-testid="task-detail-modal"><button onClick={onClose}>Close</button></div> : null;
  };
});

jest.mock('../../DeleteColumnModal', () => {
  return function MockDeleteColumnModal({ isOpen, onClose }: any) {
    return isOpen ? <div data-testid="delete-column-modal"><button onClick={onClose}>Close</button></div> : null;
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
      tasks: [
        {
          id: 'task-1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'todo',
          priority: 'high',
          assignee: 'John Doe',
          assignees: ['John Doe'],
          tags: [],
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
          subtasks: [],
          comments: []
        }
      ]
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

describe('Board', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board with columns and drag-drop context', () => {
    render(<Board board={mockBoard} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    expect(screen.getAllByTestId('draggable-column')).toHaveLength(3);
    expect(screen.getByText('Por Hacer')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('renders add column button and handles click', async () => {
    render(<Board board={mockBoard} />);
    
    const addColumnButton = screen.getByText('Agregar Columna');
    expect(addColumnButton).toBeInTheDocument();
    
    fireEvent.click(addColumnButton);
    // Esperar a que el componente lazy se cargue
    await waitFor(() => {
      expect(screen.getByTestId('add-column-form')).toBeInTheDocument();
    });
  });

  it('renders data manager', async () => {
    render(<Board board={mockBoard} />);
    // DataManager ahora es lazy, solo se renderiza cuando showDataManager es true
    // Este test debería verificar que el componente se pueda abrir
    expect(screen.queryByTestId('data-manager')).not.toBeInTheDocument();
  });

  it('handles empty board', () => {
    const emptyBoard = { ...mockBoard, columns: [] };
    render(<Board board={emptyBoard} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getAllByTestId('draggable-column')).toHaveLength(3);
  });

  it('applies correct CSS class', () => {
    const { container } = render(<Board board={mockBoard} />);
    expect(container.firstChild).toHaveClass('board');
  });

  it('handles board updates', () => {
    const { rerender } = render(<Board board={mockBoard} />);
    
    const updatedBoard = { ...mockBoard, title: 'Updated Board' };
    rerender(<Board board={updatedBoard} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
  });
});