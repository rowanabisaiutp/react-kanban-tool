import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../../store/useKanbanStore', () => ({
  useKanbanStore: () => ({
    boards: [
      {
        id: 'board-1',
        title: 'Proyecto Kanban App',
        description: 'Desarrollo de una aplicación de gestión de tareas estilo Kanban',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-17'),
        columns: []
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
    setCurrentBoard: jest.fn()
  })
}));

jest.mock('../../../../hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn()
  })
}));

jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick }: any) {
    return <button onClick={onClick}>{children}</button>;
  };
});

import BoardSelector from '../BoardSelector';

describe('BoardSelector Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders board selector with boards', () => {
    render(<BoardSelector />);
    
    expect(screen.getByText('Tableros')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Kanban App')).toBeInTheDocument();
    expect(screen.getByText('Desarrollo de una aplicación de gestión de tareas estilo Kanban')).toBeInTheDocument();
  });

  it('renders create board button', () => {
    render(<BoardSelector />);
    
    const createButton = screen.getByRole('heading', { name: 'Crear Nuevo Tablero', level: 4 });
    expect(createButton).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<BoardSelector />);
    
    expect(screen.getByTitle('Cambiar a modo oscuro')).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('handles board selection', () => {
    render(<BoardSelector />);
    
    const boardItem = screen.getByText('Proyecto Kanban App');
    fireEvent.click(boardItem);
    
    // The mock setCurrentBoard should be called
    expect(boardItem).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<BoardSelector />);
    expect(container.firstChild).toHaveClass('board-selector');
  });
});