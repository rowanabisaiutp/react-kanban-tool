import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock de hooks
jest.mock('../../../../hooks/useKanbanHook', () => ({
  useKanban: () => ({
    addTask: jest.fn(),
    updateTask: jest.fn()
  })
}));

jest.mock('../../../../hooks/useNotifications', () => ({
  useNotificationSystem: () => ({
    showInfo: jest.fn(),
    showError: jest.fn(),
    showSuccess: jest.fn(),
    showWarning: jest.fn()
  })
}));

// Mock de datos
jest.mock('../../../../data/mockData', () => ({
  teamMembers: ['John Doe', 'Jane Smith', 'Bob Johnson']
}));

// Mock de componentes
jest.mock('../../SubtasksList', () => {
  return function MockSubtasksList({ subtasks, onUpdateSubtasks, ...props }: any) {
    return (
      <div data-testid="subtasks-list" {...props}>
        {subtasks.map((subtask: any, index: number) => (
          <div key={index} data-testid="subtask">
            {subtask.title}
          </div>
        ))}
      </div>
    );
  };
});

// Importar después de los mocks
import TaskForm from '../TaskForm';
import type { Task } from '../../../../types';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  assignee: 'John Doe',
  assignees: ['John Doe'],
  tags: ['frontend'],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  subtasks: [],
  comments: []
};

describe('TaskForm Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form for new task', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    expect(screen.getByText(/Título de la tarea/)).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
  });

  it('should render form for editing task', () => {
    render(<TaskForm onClose={mockOnClose} editingTask={mockTask} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('should render form fields', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    expect(screen.getByText(/Título de la tarea/)).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Prioridad requerida')).toBeInTheDocument();
    expect(screen.getByText('Asignar a')).toBeInTheDocument();
    expect(screen.getByText('Etiquetas')).toBeInTheDocument();
    expect(screen.getByText('Fecha de finalización')).toBeInTheDocument();
  });

  it('should render priority options', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Lowest')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Crear Tarea')).toBeInTheDocument();
    expect(screen.getByText('Guardar y crear otra')).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByPlaceholderText(/Implementar funcionalidad/);
    const descriptionInput = screen.getByPlaceholderText(/Describe los detalles/);
    
    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    expect(titleInput).toHaveValue('New Task Title');
    expect(descriptionInput).toHaveValue('New Description');
  });

  it('should handle priority change', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const highPriorityCheckbox = screen.getByDisplayValue('high');
    fireEvent.change(highPriorityCheckbox, { target: { checked: true } });
    
    expect(highPriorityCheckbox).toBeChecked();
  });

  it('should handle assignee selection', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const addUsersButton = screen.getByText('Agregar usuarios');
    fireEvent.click(addUsersButton);
    
    // Verificar que se muestra el dropdown
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle tags input', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const tagsInput = screen.getByPlaceholderText('Agregar etiqueta...');
    fireEvent.change(tagsInput, { target: { value: 'frontend' } });
    
    expect(tagsInput).toHaveValue('frontend');
  });

  it('should handle due date input', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const dateInputs = screen.getAllByDisplayValue('');
    // Obtener los inputs de tipo date
    const dateTypeInputs = dateInputs.filter(input => input.getAttribute('type') === 'date');
    
    // Verificar que existen al menos dos inputs de fecha (inicio y finalización)
    expect(dateTypeInputs.length).toBeGreaterThanOrEqual(2);
    
    // El segundo input es "Fecha de finalización"
    const dueDateInput = dateTypeInputs[1];
    expect(dueDateInput).toHaveAttribute('type', 'date');
    expect(dueDateInput).toHaveClass('task-form__date-input');
  });

  it('should handle subtasks list rendering', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    // Verificar que el componente SubtasksList está renderizado
    expect(screen.getByTestId('subtasks-list')).toBeInTheDocument();
  });

  it('should render subtasks list', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    expect(screen.getByTestId('subtasks-list')).toBeInTheDocument();
  });

  it('should handle form submission for new task', async () => {
    render(<TaskForm onClose={mockOnClose} columnId="col-1" />);
    
    const titleInput = screen.getByPlaceholderText(/Implementar funcionalidad/);
    const saveButton = screen.getByText('Crear Tarea');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle form submission for editing task', async () => {
    render(<TaskForm onClose={mockOnClose} editingTask={mockTask} />);
    
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle cancel button', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle form with column status', () => {
    render(<TaskForm onClose={mockOnClose} columnStatus="in-progress" />);
    
    expect(screen.getByText(/Título de la tarea/)).toBeInTheDocument();
  });

  it('should handle form with column ID', () => {
    render(<TaskForm onClose={mockOnClose} columnId="col-1" />);
    
    expect(screen.getByText(/Título de la tarea/)).toBeInTheDocument();
  });

  it('should validate required fields', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByPlaceholderText(/Implementar funcionalidad/);
    const saveButton = screen.getByText('Crear Tarea');
    
    // Dejar el campo vacío y hacer submit
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(saveButton);
    
    // El formulario no debería cerrar si hay errores de validación
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle form with existing subtasks', () => {
    const taskWithSubtasks = {
      ...mockTask,
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Subtask 1',
          completed: false,
          createdAt: new Date('2024-01-01T00:00:00Z')
        }
      ]
    };
    
    render(<TaskForm onClose={mockOnClose} editingTask={taskWithSubtasks} />);
    
    expect(screen.getByTestId('subtasks-list')).toBeInTheDocument();
  });

  it('should render form with correct CSS class', () => {
    const { container } = render(<TaskForm onClose={mockOnClose} />);
    
    expect(container.firstChild).toHaveClass('task-form');
  });

  it('should handle form reset', () => {
    render(<TaskForm onClose={mockOnClose} />);
    
    const titleInput = screen.getByPlaceholderText(/Implementar funcionalidad/);
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    expect(titleInput).toHaveValue('Test');
  });
});