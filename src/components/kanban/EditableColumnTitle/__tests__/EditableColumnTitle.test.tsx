import { render, screen, fireEvent } from '@testing-library/react';

// Importar el componente
import EditableColumnTitle from '../EditableColumnTitle';

describe('EditableColumnTitle Component', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnStartEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title when not editing', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    expect(screen.getByText('Test Column')).toBeInTheDocument();
  });

  it('should render input when editing', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={true}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    expect(screen.getByDisplayValue('Test Column')).toBeInTheDocument();
  });

  it('should handle click to start editing', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    const titleElement = screen.getByText('Test Column');
    fireEvent.click(titleElement);
    
    expect(mockOnStartEdit).toHaveBeenCalled();
  });

  it('should handle input change when editing', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={true}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    const input = screen.getByDisplayValue('Test Column');
    fireEvent.change(input, { target: { value: 'Updated Column' } });
    
    expect(input).toHaveValue('Updated Column');
  });

  it('should handle save on Enter key', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={true}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    const input = screen.getByDisplayValue('Test Column');
    fireEvent.change(input, { target: { value: 'Updated Column' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSave).toHaveBeenCalledWith('Updated Column');
  });

  it('should handle cancel on Escape key', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={true}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    const input = screen.getByDisplayValue('Test Column');
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should handle save on blur', () => {
    render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={true}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    const input = screen.getByDisplayValue('Test Column');
    fireEvent.change(input, { target: { value: 'Updated Column' } });
    fireEvent.blur(input);
    
    expect(mockOnSave).toHaveBeenCalledWith('Updated Column');
  });

  it('should render with correct CSS class', () => {
    const { container } = render(
      <EditableColumnTitle 
        title="Test Column" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    expect(container.firstChild).toHaveClass('editable-column-title__display');
  });

  it('should handle empty title', () => {
    render(
      <EditableColumnTitle 
        title="" 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    // Verificar que el elemento existe aunque esté vacío
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should handle long title', () => {
    const longTitle = 'This is a very long column title that should be handled properly';
    render(
      <EditableColumnTitle 
        title={longTitle} 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const specialTitle = 'Column with special chars: !@#$%^&*()';
    render(
      <EditableColumnTitle 
        title={specialTitle} 
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isEditing={false}
        onStartEdit={mockOnStartEdit}
      />
    );
    
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });
});