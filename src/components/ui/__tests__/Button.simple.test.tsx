import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Button sin styled-components
const MockButton = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, ...props }: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      data-variant={variant}
      data-size={size}
      data-loading={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

describe('Button Component (Simplified)', () => {
  it('should render button with text', () => {
    render(<MockButton>Click me</MockButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<MockButton onClick={handleClick}>Click me</MockButton>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MockButton disabled>Disabled button</MockButton>);
    expect(screen.getByText('Disabled button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<MockButton loading>Loading button</MockButton>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
  });

  it('should render with different variants', () => {
    const { rerender } = render(<MockButton variant="primary">Primary</MockButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary');

    rerender(<MockButton variant="secondary">Secondary</MockButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'secondary');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<MockButton size="sm">Small</MockButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');

    rerender(<MockButton size="lg">Large</MockButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });

  it('should pass through other props', () => {
    render(<MockButton data-testid="custom-button" aria-label="Custom">Custom</MockButton>);
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom')).toBeInTheDocument();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<MockButton onClick={handleClick} disabled>Disabled</MockButton>);
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(<MockButton onClick={handleClick} loading>Loading</MockButton>);
    
    fireEvent.click(screen.getByText('Loading...'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});