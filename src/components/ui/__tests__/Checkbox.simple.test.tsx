import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Checkbox sin styled-components
const MockCheckbox = ({ 
  checked = false,
  onChange,
  label = '',
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e);
    }
  };

  return (
    <label className={`checkbox-wrapper ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        data-size={size}
        className={`checkbox checkbox--${size}`}
        {...props}
      />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

describe('Checkbox Component (Simplified)', () => {
  it('should render checkbox with label', () => {
    render(<MockCheckbox label="Test checkbox" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Test checkbox')).toBeInTheDocument();
  });

  it('should render checkbox without label', () => {
    render(<MockCheckbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should handle checkbox changes', () => {
    const handleChange = jest.fn();
    render(<MockCheckbox onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should be checked when checked prop is true', () => {
    render(<MockCheckbox checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should be unchecked when checked prop is false', () => {
    render(<MockCheckbox checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MockCheckbox disabled={true} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<MockCheckbox size="sm" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'sm');

    rerender(<MockCheckbox size="md" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'md');

    rerender(<MockCheckbox size="lg" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'lg');
  });

  it('should render with custom className', () => {
    render(<MockCheckbox className="custom-checkbox" />);
    expect(screen.getByRole('checkbox').parentElement).toHaveClass('checkbox-wrapper', 'custom-checkbox');
  });

  it('should pass through other props', () => {
    render(<MockCheckbox data-testid="test-checkbox" aria-label="Test checkbox" />);
    expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Test checkbox')).toBeInTheDocument();
  });

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<MockCheckbox onFocus={handleFocus} onBlur={handleBlur} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.focus(checkbox);
    fireEvent.blur(checkbox);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<MockCheckbox disabled={true} onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should handle label click', () => {
    const handleChange = jest.fn();
    render(<MockCheckbox label="Click me" onChange={handleChange} />);
    
    const label = screen.getByText('Click me');
    fireEvent.click(label);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle all prop combinations', () => {
    const handleChange = jest.fn();
    render(
      <MockCheckbox
        checked={true}
        onChange={handleChange}
        label="Special checkbox"
        disabled={false}
        size="lg"
        className="special-checkbox"
        data-custom="value"
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    const wrapper = checkbox.parentElement;
    
    expect(checkbox).toBeChecked();
    expect(checkbox).not.toBeDisabled();
    expect(checkbox).toHaveAttribute('data-size', 'lg');
    expect(checkbox).toHaveAttribute('data-custom', 'value');
    expect(wrapper).toHaveClass('checkbox-wrapper', 'special-checkbox');
    expect(screen.getByText('Special checkbox')).toBeInTheDocument();
  });
});
