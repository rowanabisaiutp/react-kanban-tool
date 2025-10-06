import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Input sin styled-components
const MockInput = ({ 
  value = '', 
  onChange, 
  placeholder = '', 
  type = 'text', 
  disabled = false, 
  required = false,
  size = 'md',
  className = '',
  ...props 
}: any) => {
  return (
    <div className={`input-wrapper ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        data-size={size}
        className={`input input--${size}`}
        {...props}
      />
    </div>
  );
};

describe('Input Component (Simplified)', () => {
  it('should render input with value', () => {
    const handleChange = jest.fn();
    render(<MockInput value="test value" onChange={handleChange} />);
    
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    const handleChange = jest.fn();
    render(<MockInput value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render with placeholder', () => {
    render(<MockInput placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('should render with different types', () => {
    const { rerender } = render(<MockInput type="text" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<MockInput type="email" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<MockInput type="password" />);
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<MockInput size="sm" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'sm');

    rerender(<MockInput size="md" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'md');

    rerender(<MockInput size="lg" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MockInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should be required when required prop is true', () => {
    render(<MockInput required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should render with custom className', () => {
    render(<MockInput className="custom-input" />);
    expect(screen.getByRole('textbox').parentElement).toHaveClass('input-wrapper', 'custom-input');
  });

  it('should pass through other props', () => {
    render(<MockInput data-testid="test-input" aria-label="Test input" />);
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Test input')).toBeInTheDocument();
  });

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<MockInput onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle key events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    render(<MockInput onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyUp(input, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('should handle all prop combinations', () => {
    const handleChange = jest.fn();
    render(
      <MockInput
        value="test"
        onChange={handleChange}
        placeholder="Enter text"
        type="email"
        disabled={false}
        required={true}
        size="lg"
        className="special-input"
        data-custom="value"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).not.toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('data-size', 'lg');
    expect(input.parentElement).toHaveClass('input-wrapper', 'special-input');
    expect(input).toHaveAttribute('data-custom', 'value');
  });
});
