import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
const mockSetCurrentBoard = jest.fn();
const mockToggleTheme = jest.fn();
const mockOnDeleteBoard = jest.fn();

jest.mock('../../../../store/useKanbanStore', () => ({
  useKanbanStore: () => ({
    boards: [
      {
        id: 'board-1',
        title: 'Proyecto Kanban App',
        description: 'Desarrollo de una aplicación de gestión de tareas estilo Kanban',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-17'),
        columns: [{ id: 'col1', title: 'Todo', status: 'todo', color: '#3b82f6', tasks: [] }]
      },
      {
        id: 'board-2',
        title: 'Sprint Planning',
        description: 'Planificación del próximo sprint de desarrollo',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        columns: [{ id: 'col2', title: 'In Progress', status: 'in-progress', color: '#f59e0b', tasks: [] }]
      }
    ],
    currentBoard: {
      id: 'board-1',
      title: 'Proyecto Kanban App',
      description: 'Desarrollo de una aplicación de gestión de tareas estilo Kanban',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-17'),
      columns: []
    },
    setCurrentBoard: mockSetCurrentBoard
  })
}));

jest.mock('../../../../hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: mockToggleTheme
  })
}));

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick }: any) {
    return <button onClick={onClick}>{children}</button>;
  };
});

import BoardSelector from '../BoardSelector';

describe('BoardSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board list with current board active', () => {
    render(<BoardSelector />);
    
    expect(screen.getByText('Tableros')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Kanban App')).toBeInTheDocument();
    expect(screen.getByText('Sprint Planning')).toBeInTheDocument();
    expect(screen.getByText('Desarrollo de una aplicación de gestión de tareas estilo Kanban')).toBeInTheDocument();
    expect(screen.getByText('Planificación del próximo sprint de desarrollo')).toBeInTheDocument();
  });

  it('renders create board button', () => {
    render(<BoardSelector />);
    
    const createButton = screen.getByRole('heading', { name: 'Crear Nuevo Tablero', level: 4 });
    expect(createButton).toBeInTheDocument();
  });

  it('handles board selection', () => {
    render(<BoardSelector />);
    
    const boardItem = screen.getByText('Sprint Planning');
    fireEvent.click(boardItem);
    
    expect(mockSetCurrentBoard).toHaveBeenCalledWith({
      id: 'board-2',
      title: 'Sprint Planning',
      description: 'Planificación del próximo sprint de desarrollo',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      columns: [{ id: 'col2', title: 'In Progress', status: 'in-progress', color: '#f59e0b', tasks: [] }]
    });
  });

  it('handles edit board action', () => {
    render(<BoardSelector />);
    
    const editButtons = screen.getAllByText('✏️');
    expect(editButtons).toHaveLength(2); // One for each board
  });

  it('handles delete board action', () => {
    render(<BoardSelector onDeleteBoard={mockOnDeleteBoard} />);
    
    const deleteButtons = screen.getAllByText('🗑️');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDeleteBoard).toHaveBeenCalledWith('board-1');
  });

  it('handles theme toggle', () => {
    render(<BoardSelector />);
    
    const themeToggle = screen.getByTitle('Cambiar a modo oscuro');
    fireEvent.click(themeToggle);
    
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<BoardSelector className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('board-selector', 'custom-class');
  });

  it('displays board metadata correctly', () => {
    render(<BoardSelector />);
    
    const columnCounts = screen.getAllByText(/columnas/);
    expect(columnCounts).toHaveLength(2);
  });
});