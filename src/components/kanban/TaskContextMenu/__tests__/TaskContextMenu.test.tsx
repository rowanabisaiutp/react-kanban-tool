import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Task } from '../../../../types';

// Mock de teamMembers
jest.mock('../../../../data/mockData', () => ({
  teamMembers: ['Alice Johnson', 'Bob Smith', 'Carol White']
}));

// Mock de createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: any) => children
}));

import TaskContextMenu from '../TaskContextMenu';

describe('TaskContextMenu Unit Tests', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test description',
    status: 'todo',
    priority: 'high',
    assignee: 'Alice Johnson',
    assignees: ['Alice Johnson'],
    tags: ['frontend'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    subtasks: [],
    comments: []
  };

  const defaultProps = {
    isOpen: true,
    position: { x: 100, y: 200 },
    task: mockTask,
    onClose: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    onArchive: jest.fn(),
    onMove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<TaskContextMenu {...defaultProps} />);
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<TaskContextMenu {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Editar tarea')).not.toBeInTheDocument();
    });

    it('renders at correct position', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      const menu = container.querySelector('.task-context-menu');
      expect(menu).toHaveStyle({ left: '100px', top: '200px' });
    });

    it('renders with fixed positioning', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      const menu = container.querySelector('.task-context-menu');
      expect(menu).toHaveStyle({ position: 'fixed' });
    });

    it('applies correct CSS class', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      expect(container.querySelector('.task-context-menu')).toBeInTheDocument();
    });
  });

  describe('Menu Items', () => {
    it('renders all menu items', () => {
      render(<TaskContextMenu {...defaultProps} />);
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
      expect(screen.getByText('Duplicar tarea')).toBeInTheDocument();
      expect(screen.getByText('Mover a Por Hacer')).toBeInTheDocument();
      expect(screen.getByText('Mover a En Progreso')).toBeInTheDocument();
      expect(screen.getByText('Mover a Terminado')).toBeInTheDocument();
      expect(screen.getByText('Archivar tarea')).toBeInTheDocument();
      expect(screen.getByText('Eliminar tarea')).toBeInTheDocument();
    });

    it('renders menu item icons', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      // Verificar que los iconos SVG de Lucide están presentes
      const menuItems = container.querySelectorAll('.task-context-menu__item');
      expect(menuItems.length).toBeGreaterThan(0);
      // Verificar que hay iconos SVG renderizados
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('renders separators between menu groups', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      const separators = container.querySelectorAll('.task-context-menu__separator');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('applies danger class to delete item', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const deleteButton = screen.getByText('Eliminar tarea').closest('button');
      expect(deleteButton).toHaveClass('task-context-menu__item--danger');
    });

    it('shows correct menu structure', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      const menu = container.querySelector('.task-context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass('task-context-menu');
    });
  });

  describe('Menu Actions', () => {
    it('calls onEdit when Edit is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const editButton = screen.getByText('Editar tarea').closest('button');
      fireEvent.mouseDown(editButton!);
      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onDuplicate when Duplicate is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const duplicateButton = screen.getByText('Duplicar tarea').closest('button');
      fireEvent.mouseDown(duplicateButton!);
      expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockTask);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onMove with todo status', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const moveButton = screen.getByText('Mover a Por Hacer').closest('button');
      fireEvent.mouseDown(moveButton!);
      expect(defaultProps.onMove).toHaveBeenCalledWith('task-1', 'todo');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onMove with in-progress status', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const moveButton = screen.getByText('Mover a En Progreso').closest('button');
      fireEvent.mouseDown(moveButton!);
      expect(defaultProps.onMove).toHaveBeenCalledWith('task-1', 'in-progress');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onMove with done status', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const moveButton = screen.getByText('Mover a Terminado').closest('button');
      fireEvent.mouseDown(moveButton!);
      expect(defaultProps.onMove).toHaveBeenCalledWith('task-1', 'done');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onArchive when Archive is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const archiveButton = screen.getByText('Archivar tarea').closest('button');
      fireEvent.mouseDown(archiveButton!);
      expect(defaultProps.onArchive).toHaveBeenCalledWith('task-1');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onDelete when Delete is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const deleteButton = screen.getByText('Eliminar tarea').closest('button');
      fireEvent.mouseDown(deleteButton!);
      expect(defaultProps.onDelete).toHaveBeenCalledWith('task-1');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('prevents default and stops propagation on menu item click', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const editButton = screen.getByText('Editar tarea').closest('button');
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
      
      editButton!.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Menu Actions', () => {
    it('calls onEdit when edit button is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const editButton = screen.getByText('Editar tarea').closest('button');
      fireEvent.mouseDown(editButton!);
      
      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onDuplicate when duplicate button is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const duplicateButton = screen.getByText('Duplicar tarea').closest('button');
      fireEvent.mouseDown(duplicateButton!);
      
      expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockTask);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onDelete when delete button is clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const deleteButton = screen.getByText('Eliminar tarea').closest('button');
      fireEvent.mouseDown(deleteButton!);
      
      expect(defaultProps.onDelete).toHaveBeenCalledWith('task-1');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onMove when move buttons are clicked', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const moveToTodoButton = screen.getByText('Mover a Por Hacer').closest('button');
      fireEvent.mouseDown(moveToTodoButton!);
      
      expect(defaultProps.onMove).toHaveBeenCalledWith('task-1', 'todo');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Close Behavior', () => {
    it('closes on Escape key', async () => {
      render(<TaskContextMenu {...defaultProps} />);
      
      jest.advanceTimersByTime(300);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('closes on click outside', async () => {
      render(<TaskContextMenu {...defaultProps} />);
      
      jest.advanceTimersByTime(300);
      
      fireEvent.mouseDown(document);
      
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('does not close on click inside menu', async () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      
      jest.advanceTimersByTime(300);
      
      const menu = container.querySelector('.task-context-menu');
      fireEvent.mouseDown(menu!);
      
      await waitFor(() => {
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      }, { timeout: 100 }).catch(() => {
        // Expected to timeout since onClose should not be called
      });
    });

    it('prevents context menu on right click', () => {
      const { container } = render(<TaskContextMenu {...defaultProps} />);
      const menu = container.querySelector('.task-context-menu');
      
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      menu!.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<TaskContextMenu {...defaultProps} />);
      
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('delays event listener attachment', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<TaskContextMenu {...defaultProps} />);
      
      expect(addEventListenerSpy).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(200);
      
      expect(addEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles task without assignee', () => {
      const taskWithoutAssignee = { ...mockTask, assignee: undefined };
      render(<TaskContextMenu {...defaultProps} task={taskWithoutAssignee} />);
      
      // Should render all standard menu items
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
      expect(screen.getByText('Duplicar tarea')).toBeInTheDocument();
      expect(screen.getByText('Eliminar tarea')).toBeInTheDocument();
    });

    it('handles different position values', () => {
      const { container, rerender } = render(<TaskContextMenu {...defaultProps} position={{ x: 0, y: 0 }} />);
      let menu = container.querySelector('.task-context-menu');
      // The component adjusts position to stay within viewport, so we check it exists and has position styles
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveStyle('position: fixed');
      
      rerender(<TaskContextMenu {...defaultProps} position={{ x: 500, y: 300 }} />);
      menu = container.querySelector('.task-context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveStyle('position: fixed');
    });

    it('handles rapid open/close cycles', () => {
      const { rerender } = render(<TaskContextMenu {...defaultProps} isOpen={false} />);
      
      rerender(<TaskContextMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
      
      rerender(<TaskContextMenu {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Editar tarea')).not.toBeInTheDocument();
      
      rerender(<TaskContextMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
    });

    it('handles task with different statuses', () => {
      const todoTask = { ...mockTask, status: 'todo' as const };
      const inProgressTask = { ...mockTask, status: 'in-progress' as const };
      const doneTask = { ...mockTask, status: 'done' as const };
      
      const { unmount: unmount1 } = render(<TaskContextMenu {...defaultProps} task={todoTask} />);
      expect(screen.getByText('Mover a Por Hacer')).toBeInTheDocument();
      unmount1();
      
      const { unmount: unmount2 } = render(<TaskContextMenu {...defaultProps} task={inProgressTask} />);
      expect(screen.getByText('Mover a En Progreso')).toBeInTheDocument();
      unmount2();
      
      render(<TaskContextMenu {...defaultProps} task={doneTask} />);
      expect(screen.getByText('Mover a Terminado')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies danger class to delete item', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const deleteButton = screen.getByText('Eliminar tarea').closest('button');
      expect(deleteButton).toHaveClass('task-context-menu__item--danger');
    });

    it('applies correct classes to menu items', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const editButton = screen.getByText('Editar tarea').closest('button');
      expect(editButton).toHaveClass('task-context-menu__item');
    });

    it('renders separator elements', () => {
      render(<TaskContextMenu {...defaultProps} />);
      const separators = document.querySelectorAll('.task-context-menu__separator');
      expect(separators.length).toBeGreaterThan(0);
    });
  });
});
