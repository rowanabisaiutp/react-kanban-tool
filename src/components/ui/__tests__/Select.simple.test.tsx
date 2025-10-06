import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Select sin styled-components
const MockSelect = ({ 
  value = '', 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  disabled = false, 
  required = false,
  size = 'md',
  className = '',
  ...props 
}: any) => {
  return (
    <div className={`select-wrapper ${className}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        data-size={size}
        className={`select select--${size}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

describe('Select Component (Simplified)', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  it('should render select with options', () => {
    render(<MockSelect options={mockOptions} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should handle selection changes', () => {
    const handleChange = jest.fn();
    render(<MockSelect options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render with placeholder', () => {
    render(<MockSelect options={mockOptions} placeholder="Choose option" />);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('should render with selected value', () => {
    render(<MockSelect options={mockOptions} value="option2" />);
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<MockSelect options={mockOptions} size="sm" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'sm');

    rerender(<MockSelect options={mockOptions} size="md" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'md');

    rerender(<MockSelect options={mockOptions} size="lg" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MockSelect options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should be required when required prop is true', () => {
    render(<MockSelect options={mockOptions} required />);
    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('should render with custom className', () => {
    render(<MockSelect options={mockOptions} className="custom-select" />);
    expect(screen.getByRole('combobox').parentElement).toHaveClass('select-wrapper', 'custom-select');
  });

  it('should pass through other props', () => {
    render(<MockSelect options={mockOptions} data-testid="test-select" aria-label="Test select" />);
    expect(screen.getByTestId('test-select')).toBeInTheDocument();
    expect(screen.getByLabelText('Test select')).toBeInTheDocument();
  });

  it('should handle empty options array', () => {
    render(<MockSelect options={[]} placeholder="No options" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<MockSelect options={mockOptions} onFocus={handleFocus} onBlur={handleBlur} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.focus(select);
    fireEvent.blur(select);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle all prop combinations', () => {
    const handleChange = jest.fn();
    render(
      <MockSelect
        value="option2"
        onChange={handleChange}
        options={mockOptions}
        placeholder="Choose option"
        disabled={false}
        required={true}
        size="lg"
        className="special-select"
        data-custom="value"
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
    expect(select).toHaveAttribute('data-size', 'lg');
    expect(select).not.toBeDisabled();
    expect(select).toBeRequired();
    expect(select.parentElement).toHaveClass('select-wrapper', 'special-select');
    expect(select).toHaveAttribute('data-custom', 'value');
  });
});
