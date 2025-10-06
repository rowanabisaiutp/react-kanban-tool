import React from 'react';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = '' }) => {
  const parseMarkdown = (text: string): string => {
    const rules = [
      [/^### (.*$)/gim, '<h3>$1</h3>'],
      [/^## (.*$)/gim, '<h2>$1</h2>'],
      [/^# (.*$)/gim, '<h1>$1</h1>'],
      [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
      [/__(.*?)__/g, '<strong>$1</strong>'],
      [/\*(.*?)\*/g, '<em>$1</em>'],
      [/_(.*?)_/g, '<em>$1</em>'],
      [/`(.*?)`/g, '<code>$1</code>'],
      [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'],
      [/\n/g, '<br>']
    ];
    
    return rules.reduce((text, [pattern, replacement]) => 
      text.replace(pattern as RegExp, replacement as string), text);
  };

  return (
    <div 
      className={`markdown-preview ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default MarkdownPreview;
