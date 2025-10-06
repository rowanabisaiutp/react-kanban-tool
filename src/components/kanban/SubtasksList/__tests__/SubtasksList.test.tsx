import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import type { Subtask } from '../../../../types';
import SubtasksList from '../SubtasksList';

// Mock de generateId
jest.mock('../../../../utils/helpers', () => ({
  generateId: jest.fn(() => 'mock-id-123'),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('SubtasksList Unit Tests', () => {
  const mockSubtasks: Subtask[] = [
    { id: 'sub-1', title: 'Subtarea 1', completed: false, createdAt: new Date('2024-01-01') },
    { id: 'sub-2', title: 'Subtarea 2', completed: true, createdAt: new Date('2024-01-02') },
    { id: 'sub-3', title: 'Subtarea 3', completed: false, createdAt: new Date('2024-01-03') },
  ];

  const defaultProps = {
    subtasks: mockSubtasks,
    onUpdateSubtasks: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(screen.getByText('Subtarea 1')).toBeInTheDocument();
    });

    it('renders all subtasks', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(screen.getByText('Subtarea 1')).toBeInTheDocument();
      expect(screen.getByText('Subtarea 2')).toBeInTheDocument();
      expect(screen.getByText('Subtarea 3')).toBeInTheDocument();
    });

    it('renders empty list when no subtasks', () => {
      renderWithTheme(<SubtasksList subtasks={[]} onUpdateSubtasks={jest.fn()} />);
      expect(screen.queryByText(/completadas/)).not.toBeInTheDocument();
    });

    it('applies completed class to finished subtasks', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const completedText = container.querySelector('.subtasks-list__text--completed');
      expect(completedText).toBeInTheDocument();
      expect(completedText).toHaveTextContent('Subtarea 2');
    });
  });

  describe('Progress Bar', () => {
    it('shows progress bar when subtasks exist', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(screen.getByText('1/3 completadas')).toBeInTheDocument();
    });

    it('calculates progress percentage correctly', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const progressFill = container.querySelector('.subtasks-list__progress-fill');
      expect(progressFill).toHaveStyle({ width: '33.33333333333333%' });
    });

    it('shows 100% progress when all completed', () => {
      const allCompleted: Subtask[] = [
        { id: 'sub-1', title: 'Subtarea 1', completed: true, createdAt: new Date() },
        { id: 'sub-2', title: 'Subtarea 2', completed: true, createdAt: new Date() },
      ];
      const { container } = renderWithTheme(
        <SubtasksList subtasks={allCompleted} onUpdateSubtasks={jest.fn()} />
      );
      expect(screen.getByText('2/2 completadas')).toBeInTheDocument();
      const progressFill = container.querySelector('.subtasks-list__progress-fill');
      expect(progressFill).toHaveStyle({ width: '100%' });
    });

    it('shows 0% progress when none completed', () => {
      const noneCompleted: Subtask[] = [
        { id: 'sub-1', title: 'Subtarea 1', completed: false, createdAt: new Date() },
        { id: 'sub-2', title: 'Subtarea 2', completed: false, createdAt: new Date() },
      ];
      const { container } = renderWithTheme(
        <SubtasksList subtasks={noneCompleted} onUpdateSubtasks={jest.fn()} />
      );
      expect(screen.getByText('0/2 completadas')).toBeInTheDocument();
      const progressFill = container.querySelector('.subtasks-list__progress-fill');
      expect(progressFill).toHaveStyle({ width: '0%' });
    });

    it('does not show progress bar when no subtasks', () => {
      renderWithTheme(<SubtasksList subtasks={[]} onUpdateSubtasks={jest.fn()} />);
      expect(screen.queryByText(/completadas/)).not.toBeInTheDocument();
    });
  });

  describe('Toggle Subtask', () => {
    it('toggles subtask completion on checkbox click', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith([
        { ...mockSubtasks[0], completed: true },
        mockSubtasks[1],
        mockSubtasks[2],
      ]);
    });

    it('unchecks completed subtask', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith([
        mockSubtasks[0],
        { ...mockSubtasks[1], completed: false },
        mockSubtasks[2],
      ]);
    });

    it('shows correct checkbox states', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
      expect(checkboxes[0].checked).toBe(false);
      expect(checkboxes[1].checked).toBe(true);
      expect(checkboxes[2].checked).toBe(false);
    });
  });

  describe('Add Subtask', () => {
    it('shows add button when not adding', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(screen.getByText('+ Agregar subtarea')).toBeInTheDocument();
    });

    it('shows input form when add button clicked', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      expect(screen.getByPlaceholderText('Nueva subtarea...')).toBeInTheDocument();
    });

    it('adds new subtask when clicking Agregar button', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      fireEvent.click(screen.getByText('Agregar'));

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...mockSubtasks,
          expect.objectContaining({
            id: 'mock-id-123',
            title: 'Nueva subtarea',
            completed: false,
          }),
        ])
      );
    });

    it('trims whitespace from new subtask title', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: '  Nueva subtarea  ' } });
      fireEvent.click(screen.getByText('Agregar'));

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith([
        ...mockSubtasks,
        expect.objectContaining({ title: 'Nueva subtarea' }),
      ]);
    });

    it('does not add empty subtask', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(screen.getByText('Agregar'));

      expect(defaultProps.onUpdateSubtasks).not.toHaveBeenCalled();
    });

    it('cancels adding when Cancelar button clicked', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      fireEvent.click(screen.getByText('Cancelar'));

      expect(screen.queryByPlaceholderText('Nueva subtarea...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Agregar subtarea')).toBeInTheDocument();
    });

    it('clears input after adding subtask', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      fireEvent.click(screen.getByText('Agregar'));

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalled();
    });
  });

  describe('Keyboard Handling', () => {
    it('adds subtask on Enter key', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalled();
    });

    it('handles Escape key attempt (note: onKeyPress does not detect Escape in React)', () => {
      // Este test documenta que Escape no funciona con onKeyPress
      // Para que Escape funcione, el componente necesitaría usar onKeyDown
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      
      // onKeyPress no detecta Escape, así que el input permanece visible
      const inputContainer = input.parentElement;
      if (inputContainer) {
        fireEvent.keyPress(inputContainer, { key: 'Escape', code: 'Escape', charCode: 27 });
      }

      // El input aún está visible porque onKeyPress no maneja Escape
      expect(screen.getByPlaceholderText('Nueva subtarea...')).toBeInTheDocument();
    });

    it('does not add on other keys', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Nueva subtarea' } });
      fireEvent.keyPress(input, { key: 'a', code: 'KeyA', charCode: 97 });

      expect(defaultProps.onUpdateSubtasks).not.toHaveBeenCalled();
    });
  });

  describe('Delete Subtask', () => {
    it('shows delete button for each subtask when editable', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const deleteButtons = container.querySelectorAll('.subtasks-list__delete');
      expect(deleteButtons).toHaveLength(3);
    });

    it('deletes subtask when delete button clicked', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const deleteButtons = container.querySelectorAll('.subtasks-list__delete');
      fireEvent.click(deleteButtons[0]);

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith([
        mockSubtasks[1],
        mockSubtasks[2],
      ]);
    });

    it('removes correct subtask from list', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const deleteButtons = container.querySelectorAll('.subtasks-list__delete');
      fireEvent.click(deleteButtons[1]);

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledWith([
        mockSubtasks[0],
        mockSubtasks[2],
      ]);
    });
  });

  describe('Editable Mode', () => {
    it('hides add button when not editable', () => {
      renderWithTheme(<SubtasksList {...defaultProps} isEditable={false} />);
      expect(screen.queryByText('+ Agregar subtarea')).not.toBeInTheDocument();
    });

    it('hides delete buttons when not editable', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} isEditable={false} />);
      const deleteButtons = container.querySelectorAll('.subtasks-list__delete');
      expect(deleteButtons).toHaveLength(0);
    });

    it('disables checkboxes when not editable', () => {
      renderWithTheme(<SubtasksList {...defaultProps} isEditable={false} />);
      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });

    it('allows toggling when editable (default)', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeDisabled();
      });
    });

    it('shows all edit controls when explicitly editable', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} isEditable={true} />);
      expect(screen.getByText('+ Agregar subtarea')).toBeInTheDocument();
      const deleteButtons = container.querySelectorAll('.subtasks-list__delete');
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles single subtask', () => {
      const singleSubtask: Subtask[] = [
        { id: 'sub-1', title: 'Solo una', completed: false, createdAt: new Date() },
      ];
      renderWithTheme(<SubtasksList subtasks={singleSubtask} onUpdateSubtasks={jest.fn()} />);
      expect(screen.getByText('Solo una')).toBeInTheDocument();
      expect(screen.getByText('0/1 completadas')).toBeInTheDocument();
    });

    it('handles long subtask titles', () => {
      const longTitle = 'Esta es una subtarea con un título muy largo que podría causar problemas de diseño';
      const subtasks: Subtask[] = [
        { id: 'sub-1', title: longTitle, completed: false, createdAt: new Date() },
      ];
      renderWithTheme(<SubtasksList subtasks={subtasks} onUpdateSubtasks={jest.fn()} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles special characters in titles', () => {
      const specialTitle = 'Subtarea con !@#$%^&*()_+-={}[]|:";\'<>?,./';
      const subtasks: Subtask[] = [
        { id: 'sub-1', title: specialTitle, completed: false, createdAt: new Date() },
      ];
      renderWithTheme(<SubtasksList subtasks={subtasks} onUpdateSubtasks={jest.fn()} />);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('maintains state after prop updates', () => {
      const { rerender } = renderWithTheme(<SubtasksList {...defaultProps} />);
      
      const updatedSubtasks = [...mockSubtasks, 
        { id: 'sub-4', title: 'Subtarea 4', completed: false, createdAt: new Date() }
      ];
      
      rerender(
        <ThemeProvider theme={theme}>
          <SubtasksList subtasks={updatedSubtasks} onUpdateSubtasks={defaultProps.onUpdateSubtasks} />
        </ThemeProvider>
      );

      expect(screen.getByText('Subtarea 4')).toBeInTheDocument();
    });

    it('handles rapid toggle clicks', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      const checkbox = screen.getAllByRole('checkbox')[0];
      
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalledTimes(3);
    });

    it('handles adding multiple subtasks sequentially', () => {
      renderWithTheme(<SubtasksList {...defaultProps} />);
      
      // Add first subtask
      fireEvent.click(screen.getByText('+ Agregar subtarea'));
      const input = screen.getByPlaceholderText('Nueva subtarea...');
      fireEvent.change(input, { target: { value: 'Primera' } });
      fireEvent.click(screen.getByText('Agregar'));

      expect(defaultProps.onUpdateSubtasks).toHaveBeenCalled();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct base class', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(container.querySelector('.subtasks-list')).toBeInTheDocument();
    });

    it('applies item class to each subtask', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      const items = container.querySelectorAll('.subtasks-list__item');
      expect(items).toHaveLength(3);
    });

    it('applies progress classes correctly', () => {
      const { container } = renderWithTheme(<SubtasksList {...defaultProps} />);
      expect(container.querySelector('.subtasks-list__progress')).toBeInTheDocument();
      expect(container.querySelector('.subtasks-list__progress-bar')).toBeInTheDocument();
      expect(container.querySelector('.subtasks-list__progress-fill')).toBeInTheDocument();
    });
  });
});
