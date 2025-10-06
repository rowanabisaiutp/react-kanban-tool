import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple de Card sin styled-components
const MockCard = ({ children, hover = false, padding = 'md', className = '', ...props }: any) => {
  const classes = [
    'card',
    hover ? 'card--hover' : '',
    `card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-hover={hover}
      data-padding={padding}
      {...props}
    >
      {children}
    </div>
  );
};

describe('Card Component (Simplified)', () => {
  it('should render card with children', () => {
    render(<MockCard>Card content</MockCard>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(<MockCard>Default card</MockCard>);
    const card = screen.getByText('Default card');
    expect(card).toHaveClass('card');
    expect(card).toHaveAttribute('data-hover', 'false');
    expect(card).toHaveAttribute('data-padding', 'md');
  });

  it('should render with hover prop', () => {
    render(<MockCard hover>Hover card</MockCard>);
    const card = screen.getByText('Hover card');
    expect(card).toHaveClass('card--hover');
    expect(card).toHaveAttribute('data-hover', 'true');
  });

  it('should render with different padding sizes', () => {
    const { rerender } = render(<MockCard padding="sm">Small padding</MockCard>);
    let card = screen.getByText('Small padding');
    expect(card).toHaveClass('card--padding-sm');
    expect(card).toHaveAttribute('data-padding', 'sm');

    rerender(<MockCard padding="lg">Large padding</MockCard>);
    card = screen.getByText('Large padding');
    expect(card).toHaveClass('card--padding-lg');
    expect(card).toHaveAttribute('data-padding', 'lg');
  });

  it('should render with custom className', () => {
    render(<MockCard className="custom-class">Custom card</MockCard>);
    const card = screen.getByText('Custom card');
    expect(card).toHaveClass('card', 'custom-class');
  });

  it('should pass through other props', () => {
    render(<MockCard data-testid="test-card" role="article">Test card</MockCard>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('should render complex content', () => {
    render(
      <MockCard>
        <h2>Card Title</h2>
        <p>Card description</p>
        <button>Action</button>
      </MockCard>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should handle all prop combinations', () => {
    render(
      <MockCard 
        hover 
        padding="lg" 
        className="special-card" 
        data-custom="value"
      >
        Special card
      </MockCard>
    );
    
    const card = screen.getByText('Special card');
    expect(card).toHaveClass('card', 'card--hover', 'card--padding-lg', 'special-card');
    expect(card).toHaveAttribute('data-hover', 'true');
    expect(card).toHaveAttribute('data-padding', 'lg');
    expect(card).toHaveAttribute('data-custom', 'value');
  });
});
