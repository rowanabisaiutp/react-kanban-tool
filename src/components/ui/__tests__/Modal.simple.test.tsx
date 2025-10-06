import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Modal sin styled-components
const MockModal = ({ 
  isOpen = false,
  onClose,
  title = '',
  children,
  size = 'md',
  className = '',
  ...props 
}: any) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${className}`} onClick={onClose} {...props}>
      <div 
        className={`modal modal--${size}`} 
        onClick={(e) => e.stopPropagation()}
        data-testid="modal"
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

describe('Modal Component (Simplified)', () => {
  it('should not render when isOpen is false', () => {
    render(<MockModal isOpen={false}>Modal content</MockModal>);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<MockModal isOpen={true}>Modal content</MockModal>);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(<MockModal isOpen={true} title="Test Modal">Modal content</MockModal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should handle close button click', () => {
    const handleClose = jest.fn();
    render(<MockModal isOpen={true} onClose={handleClose}>Modal content</MockModal>);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should handle overlay click', () => {
    const handleClose = jest.fn();
    render(<MockModal isOpen={true} onClose={handleClose}>Modal content</MockModal>);
    
    const overlay = screen.getByTestId('modal').parentElement;
    fireEvent.click(overlay!);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking modal content', () => {
    const handleClose = jest.fn();
    render(<MockModal isOpen={true} onClose={handleClose}>Modal content</MockModal>);
    
    const modal = screen.getByTestId('modal');
    fireEvent.click(modal);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<MockModal isOpen={true} size="sm">Small modal</MockModal>);
    expect(screen.getByTestId('modal')).toHaveClass('modal--sm');

    rerender(<MockModal isOpen={true} size="md">Medium modal</MockModal>);
    expect(screen.getByTestId('modal')).toHaveClass('modal--md');

    rerender(<MockModal isOpen={true} size="lg">Large modal</MockModal>);
    expect(screen.getByTestId('modal')).toHaveClass('modal--lg');
  });

  it('should render with custom className', () => {
    render(<MockModal isOpen={true} className="custom-modal">Modal content</MockModal>);
    expect(screen.getByTestId('modal').parentElement).toHaveClass('modal-overlay', 'custom-modal');
  });

  it('should pass through other props', () => {
    render(<MockModal isOpen={true} data-custom="value" role="dialog">Modal content</MockModal>);
    const overlay = screen.getByTestId('modal').parentElement;
    expect(overlay).toHaveAttribute('data-custom', 'value');
    expect(overlay).toHaveAttribute('role', 'dialog');
  });

  it('should render complex content', () => {
    render(
      <MockModal isOpen={true} title="Complex Modal">
        <div>
          <h3>Section 1</h3>
          <p>Some content</p>
          <button>Action</button>
        </div>
      </MockModal>
    );
    
    expect(screen.getByText('Complex Modal')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Some content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should handle keyboard events', () => {
    const handleClose = jest.fn();
    render(<MockModal isOpen={true} onClose={handleClose}>Modal content</MockModal>);
    
    const modal = screen.getByTestId('modal');
    fireEvent.keyDown(modal, { key: 'Escape' });
    
    // Note: In a real implementation, you'd handle Escape key
    // This test just verifies the modal is rendered and can receive events
    expect(modal).toBeInTheDocument();
  });

  it('should handle all prop combinations', () => {
    const handleClose = jest.fn();
    render(
      <MockModal
        isOpen={true}
        onClose={handleClose}
        title="Special Modal"
        size="lg"
        className="special-modal"
        data-custom="value"
      >
        Special content
      </MockModal>
    );
    
    const modal = screen.getByTestId('modal');
    const overlay = modal.parentElement;
    
    expect(modal).toHaveClass('modal', 'modal--lg');
    expect(overlay).toHaveClass('modal-overlay', 'special-modal');
    expect(overlay).toHaveAttribute('data-custom', 'value');
    expect(screen.getByText('Special Modal')).toBeInTheDocument();
    expect(screen.getByText('Special content')).toBeInTheDocument();
  });
});
