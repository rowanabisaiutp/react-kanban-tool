import { render, screen } from '@testing-library/react';

// Importar el componente
import MarkdownPreview from '../MarkdownPreview';

describe('MarkdownPreview Component', () => {
  it('should render plain text', () => {
    render(<MarkdownPreview content="Hello World" />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <MarkdownPreview content="Hello World" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('markdown-preview', 'custom-class');
  });

  it('should render bold text with **', () => {
    render(<MarkdownPreview content="**Bold Text**" />);
    
    const boldElement = screen.getByText('Bold Text');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('should render bold text with __', () => {
    render(<MarkdownPreview content="__Bold Text__" />);
    
    const boldElement = screen.getByText('Bold Text');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('should render italic text with *', () => {
    render(<MarkdownPreview content="*Italic Text*" />);
    
    const italicElement = screen.getByText('Italic Text');
    expect(italicElement.tagName).toBe('EM');
  });

  it('should render italic text with _', () => {
    render(<MarkdownPreview content="_Italic Text_" />);
    
    const italicElement = screen.getByText('Italic Text');
    expect(italicElement.tagName).toBe('EM');
  });

  it('should render code with backticks', () => {
    render(<MarkdownPreview content="`code snippet`" />);
    
    const codeElement = screen.getByText('code snippet');
    expect(codeElement.tagName).toBe('CODE');
  });

  it('should render h1 headers', () => {
    render(<MarkdownPreview content="# Main Title" />);
    
    const heading = screen.getByText('Main Title');
    expect(heading.tagName).toBe('H1');
  });

  it('should render h2 headers', () => {
    render(<MarkdownPreview content="## Subtitle" />);
    
    const heading = screen.getByText('Subtitle');
    expect(heading.tagName).toBe('H2');
  });

  it('should render h3 headers', () => {
    render(<MarkdownPreview content="### Small Title" />);
    
    const heading = screen.getByText('Small Title');
    expect(heading.tagName).toBe('H3');
  });

  it('should render links', () => {
    render(<MarkdownPreview content="[Google](https://google.com)" />);
    
    const link = screen.getByText('Google');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://google.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render line breaks', () => {
    const { container } = render(<MarkdownPreview content="Line 1\nLine 2" />);
    
    // Verificar que el contenido se renderiza correctamente
    expect(container.textContent).toContain('Line 1');
    expect(container.textContent).toContain('Line 2');
  });

  it('should handle complex markdown', () => {
    const complexMarkdown = "# Title\n**Bold** and *italic* text with `code` and [link](https://example.com)";
    render(<MarkdownPreview content={complexMarkdown} />);
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
  });

  it('should handle empty content', () => {
    const { container } = render(<MarkdownPreview content="" />);
    
    expect(container.firstChild).toHaveClass('markdown-preview');
  });

  it('should handle multiple bold and italic combinations', () => {
    render(<MarkdownPreview content="**Bold** and *italic* and ***both***" />);
    
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('both')).toBeInTheDocument();
  });

  it('should handle multiple headers', () => {
    const multiHeader = "# H1\n## H2\n### H3";
    render(<MarkdownPreview content={multiHeader} />);
    
    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByText('H3')).toBeInTheDocument();
  });

  it('should handle special characters in content', () => {
    const specialContent = "Special chars: !@#$%^&*()";
    render(<MarkdownPreview content={specialContent} />);
    
    expect(screen.getByText('Special chars: !@#$%^&*()')).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    const { container } = render(<MarkdownPreview content="Test" />);
    
    expect(container.firstChild).toHaveClass('markdown-preview');
  });

  it('should handle mixed formatting', () => {
    const mixedContent = "**Bold** with `code` and [link](https://test.com) in *italic*";
    render(<MarkdownPreview content={mixedContent} />);
    
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
  });
});
